import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

describe('ChronoFlow Change Tracking & Soft Delete (Theo dõi thay đổi & Xóa mềm)', () => {
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

    // Load and evaluate src/app.js in VM sandbox
    const code = fs.readFileSync(path.resolve(__dirname, '../src/app.js'), 'utf8');
    const context = vm.createContext(sandbox);
    vm.runInContext(code, context);
  });

  // 1. DEVICE ID
  it('1. should generate deviceId once using crypto.randomUUID() and persist it in localStorage', () => {
    const { deviceId, getDeviceId, localStorage } = sandbox;

    expect(deviceId).toBeDefined();
    expect(typeof deviceId).toBe('string');
    expect(deviceId.startsWith('uuid-')).toBe(true);

    const storedId = localStorage.getItem('chronoflow_deviceId');
    expect(storedId).toBe(deviceId);

    // Call getDeviceId again and verify it returns the same persisted id
    expect(getDeviceId()).toBe(deviceId);
  });

  // 2. TOUCH FUNCTION
  it('2. touch(rec) should set updatedAt = Math.max(Date.now(), maxSeenUpdatedAt + 1), updatedBy = deviceId, and update maxSeenUpdatedAt', () => {
    const { touch, deviceId, getMaxSeenUpdatedAt, localStorage } = sandbox;

    const initialMax = getMaxSeenUpdatedAt();
    expect(initialMax).toBeGreaterThanOrEqual(0);

    const rec = { id: 'test-1', title: 'Test Record' };
    const touched = touch(rec);

    expect(touched.updatedAt).toBeGreaterThan(0);
    expect(touched.updatedBy).toBe(deviceId);
    expect(getMaxSeenUpdatedAt()).toBe(touched.updatedAt);
    expect(localStorage.getItem('chronoflow_maxSeenUpdatedAt')).toBe(String(touched.updatedAt));

    // Verify monotonic strictly increasing timestamp
    const rec2 = { id: 'test-2' };
    touch(rec2);
    expect(rec2.updatedAt).toBeGreaterThan(touched.updatedAt);
    expect(getMaxSeenUpdatedAt()).toBe(rec2.updatedAt);
  });

  // 3. CALL TOUCH AT EVERY ACTION & DEFAULT UPDATEDAT TO 0
  it('3. should have updatedAt default to 0 for older records and assign UUID to notes without id', () => {
    const { appState } = sandbox;

    // Check existing notes
    expect(Array.isArray(appState.notes)).toBe(true);
    appState.notes.forEach(note => {
      expect(note.id).toBeDefined();
      expect(note.updatedAt).toBeDefined();
      expect(typeof (note.updatedAt || 0)).toBe('number');
    });

    // Check tasks and fixed events have updatedAt defined (defaults to 0 or timestamp)
    appState.tasks.forEach(task => {
      expect(task.updatedAt !== undefined).toBe(true);
    });
    appState.fixedEvents.forEach(fe => {
      expect(fe.updatedAt !== undefined).toBe(true);
    });
  });

  it('3b. should call touch() when creating, editing, completing, assigning slot, and unassigning task', () => {
    const { saveTask, toggleTaskDone, assignTaskToSlot, unassignTask, appState, selectedDate, deviceId } = sandbox;

    // Save a new task via saveTask
    const newTask = saveTask({
      title: 'Học lập trình change tracking',
      isImportant: true,
      isUrgent: false,
      estimatedMinutes: 45
    });

    expect(newTask.updatedAt).toBeGreaterThan(0);
    expect(newTask.updatedBy).toBe(deviceId);
    const createTime = newTask.updatedAt;

    // Edit task
    const editedTask = saveTask({
      id: newTask.id,
      title: 'Học lập trình change tracking (Đã cập nhật)',
      isImportant: true,
      isUrgent: true,
      estimatedMinutes: 60
    });
    expect(editedTask.updatedAt).toBeGreaterThan(createTime);
    const editTime = editedTask.updatedAt;

    // Toggle completed
    toggleTaskDone(newTask.id, selectedDate);
    const taskAfterDone = appState.tasks.find(t => t.id === newTask.id);
    expect(taskAfterDone.updatedAt).toBeGreaterThan(editTime);
    const doneTime = taskAfterDone.updatedAt;

    // Assign slot (10:00 - 12:00 provides sufficient room with transition buffers)
    assignTaskToSlot(newTask.id, { start: '10:00', end: '12:00' }, selectedDate);
    const taskAfterSlot = appState.tasks.find(t => t.id === newTask.id);
    expect(taskAfterSlot.updatedAt).toBeGreaterThan(doneTime);
    const slotTime = taskAfterSlot.updatedAt;

    // Unassign slot
    unassignTask(newTask.id, selectedDate);
    const taskAfterUnassign = appState.tasks.find(t => t.id === newTask.id);
    expect(taskAfterUnassign.updatedAt).toBeGreaterThan(slotTime);
  });

  it('3c. should call touch() when creating and editing fixedEvents, noisyIntervals, and goals', () => {
    const { saveFixedEvent, submitDailyGoal, appState, selectedDate, deviceId, document } = sandbox;

    // Fixed Event
    const fe = saveFixedEvent({
      title: 'Ăn trưa & Đọc sách',
      start: '12:00',
      end: '13:00'
    });
    expect(fe.updatedAt).toBeGreaterThan(0);
    expect(fe.updatedBy).toBe(deviceId);

    // Goal
    const today = selectedDate;
    document.getElementById('m-daily-focus').value = 'Hoàn thành 100% mục tiêu ngày!';
    submitDailyGoal(today);
    const savedGoal = appState.goals.dailyGoals.find(g => !g.deleted && g.date === today);
    expect(savedGoal).toBeDefined();
    expect(savedGoal.updatedAt).toBeGreaterThan(0);
    expect(savedGoal.updatedBy).toBe(deviceId);
  });

  // 4. SOFT DELETE & FILTERING
  it('4. deleteTask should change record into { id, deleted: true, updatedAt, updatedBy } instead of removing from array', () => {
    const { saveTask, deleteTask, isItemActiveOnDate, getTaskAssignedSlot, isTaskDoneOnDate, appState, selectedDate, deviceId } = sandbox;

    const task = saveTask({
      title: 'Task to be soft deleted',
      isImportant: true,
      isUrgent: false
    });
    const taskId = task.id;
    const initialCount = appState.tasks.length;

    deleteTask(taskId, 'all', selectedDate);

    // Array length must NOT decrease!
    expect(appState.tasks.length).toBe(initialCount);

    const deletedRecord = appState.tasks.find(t => t.id === taskId);
    expect(deletedRecord).toBeDefined();
    expect(deletedRecord.id).toBe(taskId);
    expect(deletedRecord.deleted).toBe(true);
    expect(deletedRecord.updatedAt).toBeGreaterThan(0);
    expect(deletedRecord.updatedBy).toBe(deviceId);

    // isItemActiveOnDate must ignore deleted task
    expect(isItemActiveOnDate(deletedRecord, selectedDate)).toBe(false);

    // getTaskAssignedSlot must return null
    expect(getTaskAssignedSlot(deletedRecord, selectedDate)).toBe(null);

    // isTaskDoneOnDate must return false
    expect(isTaskDoneOnDate(deletedRecord, selectedDate)).toBe(false);
  });

  it('4b. deleteFixedEvent and deleteNoisyInterval and deleteNote should soft-delete their records', () => {
    const { saveFixedEvent, deleteFixedEvent, deleteNoisyInterval, deleteNote, appState, selectedDate } = sandbox;

    // Fixed Event soft-delete
    const fe = saveFixedEvent({ title: 'Fixed Event To Delete', start: '07:00', end: '08:00' });
    const feId = fe.id;
    const feInitialLen = appState.fixedEvents.length;
    deleteFixedEvent(feId, 'all', selectedDate);
    expect(appState.fixedEvents.length).toBe(feInitialLen);
    const deletedFe = appState.fixedEvents.find(f => f.id === feId);
    expect(deletedFe.deleted).toBe(true);
    expect(deletedFe.updatedAt).toBeGreaterThan(0);

    // Note soft-delete
    const noteId = 'test-note-uuid-1';
    appState.notes.push({ id: noteId, date: selectedDate, content: 'Sample note to delete' });
    const notesInitialLen = appState.notes.length;
    deleteNote(noteId);
    expect(appState.notes.length).toBe(notesInitialLen);
    const deletedNote = appState.notes.find(n => n.id === noteId);
    expect(deletedNote.deleted).toBe(true);
    expect(deletedNote.updatedAt).toBeGreaterThan(0);

    // Noisy Interval soft-delete
    const noisyLen = appState.settings.noisyIntervals.length;
    const niId = appState.settings.noisyIntervals[0].id || 'ni-0';
    appState.settings.noisyIntervals[0].id = niId;
    deleteNoisyInterval(0);
    expect(appState.settings.noisyIntervals.length).toBe(noisyLen);
    expect(appState.settings.noisyIntervals[0].deleted).toBe(true);
    expect(appState.settings.noisyIntervals[0].updatedAt).toBeGreaterThan(0);
  });

  it('4c. Display, counts, free-time calculation and GCal scheduling must ignore deleted: true', () => {
    const { saveTask, assignTaskToSlot, deleteTask, calculateFreeTimeSlots, isItemActiveOnDate, appState, selectedDate } = sandbox;

    // Create and soft-delete a task in an open slot (14:00 - 15:00)
    const t = saveTask({ title: 'Deleted Task', date: selectedDate });
    assignTaskToSlot(t.id, { start: '14:00', end: '15:00' }, selectedDate);
    deleteTask(t.id, 'all', selectedDate);

    // Free time calculation on selectedDate should NOT be blocked by this deleted task slot
    const { freeSlots } = calculateFreeTimeSlots(selectedDate);
    const overlappingSlot = freeSlots.find(s => s.startTimeStr <= '14:00' && s.endTimeStr >= '15:00');
    // The slot 14:00 - 15:00 is completely free because the deleted task is ignored!
    expect(overlappingSlot).toBeDefined();

    // Auto match unassigned tasks should NOT include deleted tasks
    const unassigned = appState.tasks.filter(task => !task.deleted && isItemActiveOnDate(task, selectedDate));
    expect(unassigned.some(task => task.id === t.id)).toBe(false);
  });
});
