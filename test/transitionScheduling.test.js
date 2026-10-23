import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

describe('ChronoFlow Transition Time Scheduling Logic (Quy tắc xếp lịch chèn transition)', () => {
  let sandbox;

  beforeEach(() => {
    const localStorageStore = {};
    const mockLocalStorage = {
      getItem: (k) => localStorageStore[k] !== undefined ? localStorageStore[k] : null,
      setItem: (k, v) => { localStorageStore[k] = String(v); },
      removeItem: (k) => { delete localStorageStore[k]; },
      clear: () => { Object.keys(localStorageStore).forEach(k => delete localStorageStore[k]); }
    };

    const domElements = {};
    function createMockElement(tag, id = '') {
      const el = {
        tagName: tag.toUpperCase(),
        id: id,
        innerHTML: '',
        value: '',
        style: {
          setProperty: function(k, v) { this[k] = v; },
          getPropertyValue: function(k) { return this[k] || ''; },
          removeProperty: function(k) { delete this[k]; }
        },
        classList: {
          _classes: new Set(),
          add: function(...c) { c.forEach(x => this._classes.add(x)); },
          remove: function(...c) { c.forEach(x => this._classes.delete(x)); },
          contains: function(c) { return this._classes.has(c); },
          toggle: function(c) { if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c); }
        },
        children: [],
        appendChild: function(c) { this.children.push(c); return c; },
        querySelector: () => null,
        querySelectorAll: () => [],
        addEventListener: () => {},
        dispatchEvent: () => {},
        setAttribute: function(k, v) { this[k] = v; },
        getAttribute: function(k) { return this[k] || null; },
        removeAttribute: function(k) { delete this[k]; },
        focus: () => {},
        click: () => {}
      };
      if (id) domElements[id] = el;
      return el;
    }

    const mockDocument = {
      getElementById: (id) => domElements[id] || (domElements[id] = createMockElement('div', id)),
      createElement: (tag) => createMockElement(tag),
      querySelector: () => null,
      querySelectorAll: () => [],
      body: createMockElement('body', 'body'),
      documentElement: createMockElement('html', 'html'),
      addEventListener: () => {}
    };

    ['app-sidebar', 'app-sidebar-content', 'view-container', 'modal-container', 'toast',
     'm-daily-focus', 'm-year-title', 'm-year-principles', 'm-month-title', 'm-note-date', 'm-note-content'].forEach(id => {
      mockDocument.getElementById(id);
    });

    sandbox = {
      window: {},
      document: mockDocument,
      localStorage: mockLocalStorage,
      location: { origin: 'http://localhost:3000' },
      navigator: { userAgent: 'NodeTestRunner', clipboard: { writeText: async () => {} } },
      addEventListener: () => {},
      removeEventListener: () => {},
      scrollTo: () => {},
      matchMedia: () => ({ matches: false, addEventListener: () => {}, removeEventListener: () => {} }),
      setInterval: () => 1,
      clearInterval: () => {},
      setTimeout: (fn) => { fn(); return 1; },
      clearTimeout: () => {},
      crypto: {
        randomUUID: () => 'uuid-' + Math.random().toString(36).substring(2, 10)
      },
      console: console,
      Date: Date,
      Math: Math,
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      JSON: JSON,
      Set: Set,
      Map: Map,
      Array: Array,
      Object: Object,
      String: String,
      Number: Number,
      Boolean: Boolean,
      RegExp: RegExp,
      Intl: Intl
    };

    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;

    const code = fs.readFileSync(path.resolve(__dirname, '../src/app.js'), 'utf8');
    const context = vm.createContext(sandbox);
    vm.runInContext(code, context);
  });

  it('1. should only apply transition to event types specified in settings.transition.applyTo', () => {
    const { appState, eventHasTransition } = sandbox;
    
    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 15,
      applyTo: {
        task: true,
        fixed: false,
        transient: false
      },
      conflictMode: 'max'
    };

    expect(eventHasTransition('task', 'before')).toBe(15);
    expect(eventHasTransition('task', 'after')).toBe(15);
    expect(eventHasTransition('fixed', 'before')).toBe(0);
    expect(eventHasTransition('fixed', 'after')).toBe(0);
    expect(eventHasTransition('transient', 'before')).toBe(0);
    expect(eventHasTransition('transient', 'after')).toBe(0);

    // Bật fixed và transient
    appState.settings.transition.applyTo.fixed = true;
    appState.settings.transition.applyTo.transient = true;
    expect(eventHasTransition('fixed', 'before')).toBe(15);
    expect(eventHasTransition('transient', 'after')).toBe(15);
  });

  it('2. should calculate transition buffer between adjacent events correctly with conflictMode max and sum', () => {
    const { appState, calculateTransitionBufferBetween } = sandbox;

    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 10,
      applyTo: {
        task: true,
        fixed: true,
        transient: false
      },
      conflictMode: 'max'
    };

    const prevEvent = { type: 'fixed', id: 'fe-1' }; // has after-end
    const nextEvent = { type: 'task', id: 't-1' };   // has before-start

    // max mode: max(10, 10) = 10
    expect(calculateTransitionBufferBetween(prevEvent, nextEvent)).toBe(10);

    // sum mode: 10 + 10 = 20
    appState.settings.transition.conflictMode = 'sum';
    expect(calculateTransitionBufferBetween(prevEvent, nextEvent)).toBe(20);

    // If one event has no transition (e.g. transient event)
    const transientEvent = { type: 'transient', id: 'te-1' };
    expect(calculateTransitionBufferBetween(transientEvent, nextEvent)).toBe(10); // only nextEvent has before
    expect(calculateTransitionBufferBetween(prevEvent, transientEvent)).toBe(10); // only prevEvent has after
    expect(calculateTransitionBufferBetween(transientEvent, transientEvent)).toBe(0);
  });

  it('3. should automatically insert buffer before and after when scheduling task into a free slot', () => {
    const { appState, calculateTaskPlacementInSlot, selectedDate } = sandbox;

    // Thiết lập fixed event từ 08:00 đến 09:00 và 11:00 đến 12:00
    appState.fixedEvents = [
      { id: 'f-1', title: 'Ca 1', start: '08:00', end: '09:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { id: 'f-2', title: 'Ca 2', start: '11:00', end: '12:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
    ];
    appState.transientEvents = [];
    appState.tasks = [];

    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 10,
      applyTo: { task: true, fixed: true, transient: false },
      conflictMode: 'max'
    };

    const task = { id: 'test-t', title: 'Task mẫu', estimatedMinutes: 30 };
    // Khung rảnh từ 09:00 (540) đến 11:00 (660)
    const slot = { start: 540, end: 660 };

    const placement = calculateTaskPlacementInSlot(task, slot, selectedDate);
    expect(placement.fits).toBe(true);
    // Task bắt đầu sau 10p buffer chuyển tiếp: 09:00 + 10 = 09:10 (550)
    expect(placement.taskStart).toBe(550);
    expect(placement.assigned.start).toBe('09:10');
    // Task kết thúc: 09:10 + 30 = 09:40 (580)
    expect(placement.taskEnd).toBe(580);
    expect(placement.assigned.end).toBe('09:40');
  });

  it('4. should reject scheduling if remaining slot duration after subtracting transition is insufficient (Rule 6)', () => {
    const { appState, calculateTaskPlacementInSlot, assignTaskToSlot, selectedDate } = sandbox;

    // Giả sử slot chỉ có 40 phút từ 09:00 đến 09:40
    // Liền trước là fixed event kết thúc 09:00 (after: 10)
    // Liền sau là fixed event bắt đầu 09:40 (before: 10)
    appState.fixedEvents = [
      { id: 'f-1', title: 'Trước', start: '08:00', end: '09:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { id: 'f-2', title: 'Sau', start: '09:40', end: '10:30', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
    ];
    appState.transientEvents = [];
    appState.tasks = [];

    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 10,
      applyTo: { task: true, fixed: true, transient: false },
      conflictMode: 'max'
    };

    // Task 30 phút -> Cần 10p trước + 30p task + 10p sau = 50p > 40p slot
    const task30 = { id: 't-30', title: 'Task 30p', estimatedMinutes: 30 };
    sandbox.appState.tasks.push(task30);

    const slot40 = { start: 540, end: 580 };
    const placement30 = calculateTaskPlacementInSlot(task30, slot40, selectedDate);
    expect(placement30.fits).toBe(false);

    // Khi gọi assignTaskToSlot trực tiếp, cũng phải từ chối (trả về false)
    const assignedOk = assignTaskToSlot(task30.id, slot40, selectedDate, { silent: true });
    expect(assignedOk).toBe(false);
    expect(task30.status).not.toBe('scheduled');

    // Trong khi task 20 phút thì VỪA KHÍT (10p trước + 20p task + 10p sau = 40p)
    const task20 = { id: 't-20', title: 'Task 20p', estimatedMinutes: 20 };
    sandbox.appState.tasks.push(task20);

    const placement20 = calculateTaskPlacementInSlot(task20, slot40, selectedDate);
    expect(placement20.fits).toBe(true);
    expect(placement20.taskStart).toBe(550); // 09:10
    expect(placement20.taskEnd).toBe(570);   // 09:30
    expect(placement20.assigned.start).toBe('09:10');
    expect(placement20.assigned.end).toBe('09:30');
  });

  it('5. should respect conflictMode "sum" requiring double buffer when both sides have transitions', () => {
    const { appState, calculateTaskPlacementInSlot, selectedDate } = sandbox;

    // Liền trước kết thúc lúc 09:00
    // Liền sau bắt đầu lúc 10:10 (Tổng khoảng trống = 70 phút)
    appState.fixedEvents = [
      { id: 'f-1', start: '08:00', end: '09:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { id: 'f-2', start: '10:10', end: '11:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
    ];
    appState.transientEvents = [];
    appState.tasks = [];

    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 10,
      applyTo: { task: true, fixed: true, transient: false },
      conflictMode: 'sum' // 10 + 10 = 20 phút đệm mỗi đầu
    };

    const task30 = { id: 't-30', estimatedMinutes: 30 };
    const slot = { start: 540, end: 610 }; // 09:00 đến 10:10 (70 phút)

    const placement = calculateTaskPlacementInSlot(task30, slot, selectedDate);
    expect(placement.fits).toBe(true);
    // Bắt đầu sau buffer sum (20 phút): 09:00 + 20 = 09:20 (560)
    expect(placement.taskStart).toBe(560);
    expect(placement.assigned.start).toBe('09:20');
    // Kết thúc: 09:20 + 30 = 09:50 (590)
    expect(placement.taskEnd).toBe(590);
    expect(placement.assigned.end).toBe('09:50');
    // Buffer sau: 10:10 - 20 = 09:50. Vừa đủ (590 <= 590)!

    // Nếu task 35 phút -> 20 + 35 + 20 = 75 phút > 70 phút -> KHÔNG vừa
    const task35 = { id: 't-35', estimatedMinutes: 35 };
    const placement35 = calculateTaskPlacementInSlot(task35, slot, selectedDate);
    expect(placement35.fits).toBe(false);
  });

  it('6. should auto-match tasks inserting transitions between sequentially matched tasks', () => {
    const { appState, autoMatchAllTasks, selectedDate, getTaskAssignedSlot } = sandbox;

    // Xóa hết việc khác, để 1 khoảng trống lớn 09:00 đến 12:00
    appState.fixedEvents = [
      { id: 'f-1', start: '08:00', end: '09:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] },
      { id: 'f-2', start: '12:00', end: '13:00', daysOfWeek: [0, 1, 2, 3, 4, 5, 6] }
    ];
    appState.transientEvents = [];
    appState.tasks = [
      { id: 't-1', date: selectedDate, title: 'Task 1', estimatedMinutes: 30, preferredSession: 'morning', status: 'todo' },
      { id: 't-2', date: selectedDate, title: 'Task 2', estimatedMinutes: 30, preferredSession: 'morning', status: 'todo' }
    ];

    appState.settings.transition = {
      enabledBeforeStart: true,
      enabledAfterEnd: true,
      minutes: 10,
      applyTo: { task: true, fixed: false, transient: false },
      conflictMode: 'max'
    };

    autoMatchAllTasks();

    const slot1 = getTaskAssignedSlot(appState.tasks[0], selectedDate);
    const slot2 = getTaskAssignedSlot(appState.tasks[1], selectedDate);

    expect(slot1).toBeDefined();
    expect(slot2).toBeDefined();

    // Task 1 bắt đầu sau 10p buffer: 09:10 - 09:40
    expect(slot1.start).toBe('09:10');
    expect(slot1.end).toBe('09:40');

    // Task 2 được xếp sau Task 1 và phải chừa transition buffer (09:40 + 10p = 09:50)
    expect(slot2.start).toBe('09:50');
    expect(slot2.end).toBe('10:20');
  });
});
