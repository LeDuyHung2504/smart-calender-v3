import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

describe('Kịch bản kiểm thử: Chống lặp lại sự kiện cũ khi đồng bộ Google Calendar', () => {
  let sandbox;

  beforeEach(() => {
    const store = new Map();
    const localStorageMock = {
      getItem: vi.fn((k) => (store.has(k) ? store.get(k) : null)),
      setItem: vi.fn((k, v) => { store.set(k, String(v)); }),
      removeItem: vi.fn((k) => { store.delete(k); }),
      clear: vi.fn(() => { store.clear(); })
    };

    const fetchMock = vi.fn();

    sandbox = {
      console,
      setTimeout: (fn) => { return 1; },
      clearTimeout: vi.fn(),
      setInterval: vi.fn(() => 123),
      clearInterval: vi.fn(),
      localStorage: localStorageMock,
      fetch: fetchMock,
      Blob: class {
        constructor(parts, options) {
          this.parts = parts;
          this.options = options;
        }
      },
      URL: {
        createObjectURL: vi.fn(() => 'blob:mock'),
        revokeObjectURL: vi.fn()
      },
      Intl,
      Date,
      Math,
      JSON,
      Object,
      Array,
      String,
      Number,
      Boolean,
      RegExp,
      Map,
      Set,
      Promise,
      Error,
       encodeURIComponent,
      decodeURIComponent,
      parseInt,
      parseFloat,
      isNaN,
      isFinite,
      crypto: {
        randomUUID: () => 'uuid-' + Math.random().toString(36).slice(2, 10)
      },
      document: {
        getElementById: vi.fn(() => null),
        querySelector: vi.fn(() => null),
        querySelectorAll: vi.fn(() => []),
        createElement: vi.fn(() => ({
          style: {},
          classList: { add: vi.fn(), remove: vi.fn(), toggle: vi.fn(), contains: vi.fn(() => false) },
          appendChild: vi.fn(),
          remove: vi.fn(),
          setAttribute: vi.fn(),
          click: vi.fn()
        })),
        body: {
          appendChild: vi.fn(),
          removeChild: vi.fn(),
          classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
          style: {}
        },
        documentElement: {
          classList: { add: vi.fn(), remove: vi.fn(), contains: vi.fn(() => false) },
          style: { setProperty: vi.fn() },
          setAttribute: vi.fn(),
          getAttribute: vi.fn()
        },
        addEventListener: vi.fn(),
        readyState: 'complete'
      },
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      matchMedia: vi.fn(() => ({ matches: false, addEventListener: vi.fn() })),
      window: null,
      globalThis: null
    };

    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;

    const appCode = fs.readFileSync(path.resolve(__dirname, '../src/app.js'), 'utf8');
    vm.createContext(sandbox);
    vm.runInContext(appCode, sandbox);
    vm.runInContext(`
      window.d = appState;
      window.saveData = saveData;
      window.renderApp = renderApp;
    `, sandbox);

    // Thiết lập trạng thái đã đăng nhập & bật nút tổng đồng bộ Google Calendar
    sandbox._gcalAccessToken = 'mock-gcal-token';
    localStorageMock.setItem('chronoflow_gcal_token', 'mock-gcal-token');
    localStorageMock.setItem('chronoflow_gcal_token_expires', String(Date.now() + 3600000));
    sandbox.saveSyncPrefs({ gcalEnabled: true, gdriveEnabled: true });
    sandbox.selectedDate = '2026-10-22';
  });

  it('TC1: Khi sự kiện cũ đã có trên Google Calendar nhưng máy local mất gcal_event_id -> Tự tìm lại ID cũ và PATCH (cập nhật), KHÔNG POST tạo bản sao trùng lặp', async () => {
    const { pushToGCal, fetch, d } = sandbox;

    // Giả sử Task có ID 'task-old-101' từng được đẩy lên GCal (ID trên GCal là 'gcal_existing_evt_999'),
    // nhưng ở local bị mất thuộc tính gcal_event_id (ví dụ sau khi đồng bộ thiết bị mới)
    const taskWithoutGcalId = {
      id: 'task-old-101',
      title: 'Họp tổng kết dự án (Đã sửa giờ)',
      date: '2026-10-22',
      isImportant: true,
      isUrgent: true,
      status: 'scheduled',
      assignedSlot: { start: '09:00', end: '10:00' },
      assignedSlotsByDate: { '2026-10-22': { start: '09:00', end: '10:00' } },
      deleted: false
    };
    d.tasks = [taskWithoutGcalId];

    let postCalls = 0;
    let patchCalls = 0;

    fetch.mockImplementation(async (url, options = {}) => {
      const method = options.method || 'GET';

      // Bước tìm kiếm sự kiện cũ theo ChronoFlow Tag trên Google Calendar
      if (method === 'GET' && url.includes('?q=')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              {
                id: 'gcal_existing_evt_999',
                status: 'confirmed',
                summary: 'Họp tổng kết dự án',
                description: '[ChronoFlow Task | ID: task-old-101]'
              }
            ]
          })
        };
      }

      if (method === 'POST') {
        postCalls++;
        return { ok: true, status: 200, json: async () => ({ id: 'gcal_duplicate_new_id' }) };
      }

      if (method === 'PATCH') {
        patchCalls++;
        return { ok: true, status: 200, json: async () => ({ id: 'gcal_existing_evt_999' }) };
      }

      return { ok: true, status: 200, json: async () => ({ items: [] }) };
    });

    const result = await pushToGCal(taskWithoutGcalId, 'task', 'update', '2026-10-22');

    expect(result.success).toBe(true);
    // Xác thực: KHÔNG tạo sự kiện mới (postCalls === 0), chỉ cập nhật sự kiện cũ (patchCalls === 1)
    expect(postCalls).toBe(0);
    expect(patchCalls).toBe(1);
    expect(taskWithoutGcalId.gcal_event_id).toBe('gcal_existing_evt_999');
  });

  it('TC2: Khi bấm đồng bộ / lưu liên tiếp nhiều lần cho cùng 1 sự kiện mới -> Chỉ tạo đúng 1 sự kiện duy nhất trên Google Calendar', async () => {
    const { pushToGCal, fetch, d } = sandbox;

    const newTask = {
      id: 'task-rapid-202',
      title: 'Viết báo cáo tuần',
      date: '2026-10-22',
      isImportant: true,
      isUrgent: false,
      status: 'scheduled',
      assignedSlot: { start: '14:00', end: '15:00' },
      assignedSlotsByDate: { '2026-10-22': { start: '14:00', end: '15:00' } },
      deleted: false
    };
    d.tasks = [newTask];

    let postCalls = 0;
    let patchCalls = 0;

    fetch.mockImplementation(async (url, options = {}) => {
      const method = options.method || 'GET';
      if (method === 'GET' && url.includes('?q=')) {
        return { ok: true, status: 200, json: async () => ({ items: [] }) };
      }
      if (method === 'POST') {
        postCalls++;
        return { ok: true, status: 200, json: async () => ({ id: 'gcal_single_created_id' }) };
      }
      if (method === 'PATCH') {
        patchCalls++;
        return { ok: true, status: 200, json: async () => ({ id: 'gcal_single_created_id' }) };
      }
      return { ok: true, status: 200, json: async () => ({ items: [] }) };
    });

    // Giả lập 3 lệnh đồng bộ xảy ra đồng thời cho cùng 1 sự kiện
    await Promise.all([
      pushToGCal(newTask, 'task', 'create', '2026-10-22'),
      pushToGCal(newTask, 'task', 'update', '2026-10-22'),
      pushToGCal(newTask, 'task', 'update', '2026-10-22')
    ]);

    // Chỉ có đúng 1 lần POST tạo mới, 2 lần sau tự động đợi và chuyển sang PATCH
    expect(postCalls).toBe(1);
    expect(patchCalls).toBe(2);
    expect(newTask.gcal_event_id).toBe('gcal_single_created_id');
  });

  it('TC3: Khi kéo dữ liệu từ Google Calendar (pullFromGCal) -> Không nhân bản sự kiện lặp lại (Fixed Event) và không tái tạo sự kiện đã xóa', async () => {
    const { pullFromGCal, fetch, d } = sandbox;

    // 1 sự kiện cố định lặp lại hàng ngày và 1 sự kiện đột xuất đã bị người dùng xóa mềm
    d.fixedEvents = [
      {
        id: 'fixed-morning-run',
        title: 'Chạy bộ buổi sáng',
        startDate: '2026-10-01',
        start: '06:00',
        end: '06:30',
        repeatType: 'daily',
        gcal_event_id: 'master_run_series_id',
        deleted: false
      }
    ];
    d.transientEvents = [
      {
        id: 'gcal-old_deleted_foreign_evt',
        gcal_event_id: 'old_deleted_foreign_evt',
        deleted: true,
        updatedAt: 1000
      }
    ];

    fetch.mockImplementation(async (url, options = {}) => {
      const method = options.method || 'GET';
      if (method === 'GET' && url.includes('/events')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            items: [
              // Google Calendar trả về nhiều instance của cùng 1 chuỗi sự kiện lặp lại (do singleEvents=true)
              {
                id: 'master_run_series_id_20261021T230000Z',
                recurringEventId: 'master_run_series_id',
                status: 'confirmed',
                summary: 'Chạy bộ buổi sáng',
                description: 'Việc cố định\n[ChronoFlow Fixed | ID: fixed-morning-run]',
                start: { dateTime: '2026-10-22T06:00:00+07:00' },
                end: { dateTime: '2026-10-22T06:30:00+07:00' }
              },
              {
                id: 'master_run_series_id_20261022T230000Z',
                recurringEventId: 'master_run_series_id',
                status: 'confirmed',
                summary: 'Chạy bộ buổi sáng',
                description: 'Việc cố định\n[ChronoFlow Fixed | ID: fixed-morning-run]',
                start: { dateTime: '2026-10-23T06:00:00+07:00' },
                end: { dateTime: '2026-10-23T06:30:00+07:00' }
              },
              // Sự kiện ngoại lai cũ vẫn còn trên GCal nhưng đã bị xóa mềm trong ChronoFlow
              {
                id: 'old_deleted_foreign_evt',
                status: 'confirmed',
                summary: 'Lịch hẹn cũ đã xóa',
                description: '',
                start: { dateTime: '2026-10-22T16:00:00+07:00' },
                end: { dateTime: '2026-10-22T17:00:00+07:00' }
              }
            ]
          })
        };
      }
      return { ok: true, status: 200, json: async () => ({ id: 'master_run_series_id' }) };
    });

    await pullFromGCal(false);

    // 1. Sự kiện cố định vẫn giữ đúng master_run_series_id, không bị đè thành instance ID và không đẻ thêm sự kiện mới
    expect(d.fixedEvents.filter(f => !f.deleted).length).toBe(1);
    expect(d.fixedEvents[0].gcal_event_id).toBe('master_run_series_id');

    // 2. Không có sự kiện đột xuất nào bị tạo lặp lại từ các instance hoặc từ sự kiện đã xóa
    const activeTransients = d.transientEvents.filter(t => !t.deleted);
    expect(activeTransients.length).toBe(0);
  });
});
