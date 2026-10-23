import { describe, it, expect, beforeEach, vi } from 'vitest';
import fs from 'fs';
import path from 'path';
import vm from 'vm';

describe('ChronoFlow Google Drive Sync Engine (Dong bo Google Drive va Smart Merge)', () => {
  let sandbox;
  let mockFetchResponses;

  beforeEach(() => {
    mockFetchResponses = [];
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
        textContent: '',
        value: '',
        disabled: false,
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
          toggle: function(c, force) {
            if (force !== undefined) {
              if (force) this._classes.add(c);
              else this._classes.delete(c);
              return;
            }
            if (this._classes.has(c)) this._classes.delete(c); else this._classes.add(c);
          }
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

    const mockFetch = vi.fn(async (url, options = {}) => {
      if (mockFetchResponses.length > 0) {
        const next = mockFetchResponses.shift();
        if (typeof next === 'function') {
          return next(url, options);
        }
        return next;
      }
      return {
        ok: true,
        status: 200,
        statusText: 'OK',
        json: async () => ({ files: [] }),
        text: async () => '{}'
      };
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
      setInterval: vi.fn((fn, ms) => 999),
      clearInterval: vi.fn(),
      setTimeout: (fn) => { fn(); return 1; },
      clearTimeout: () => {},
      fetch: mockFetch,
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

  it('1. Cấu hình mặc định u.settings chứa nhánh gdrive đầy đủ', () => {
    const { u, d } = sandbox;
    expect(u.settings.gdrive).toBeDefined();
    expect(u.settings.gdrive.enabled).toBe(true);
    expect(u.settings.gdrive.autoSyncOnOpen).toBe(false);
    expect(u.settings.gdrive.pollingEnabled).toBe(false);
    expect(u.settings.gdrive.pollingInterval).toBe(300);
    expect(u.settings.gdrive.lastSyncTime).toBeNull();
    expect(u.settings.gdrive.fileId).toBeNull();

    expect(d.settings.gdrive).toBeDefined();
    expect(d.settings.gdrive.pollingInterval).toBe(300);
  });

  it('2. getOrCreateDriveSyncFileId trả về fileId nếu file đã tồn tại trên Drive', async () => {
    const { getOrCreateDriveSyncFileId, fetch } = sandbox;

    fetch.mockImplementationOnce(async (url) => {
      expect(url).toContain("name%20%3D%20'chronoflow_sync.json'");
      return {
        ok: true,
        json: async () => ({
          files: [{ id: 'existing-gdrive-file-id-123', name: 'chronoflow_sync.json' }]
        })
      };
    });

    const fileId = await getOrCreateDriveSyncFileId('test-access-token');
    expect(fileId).toBe('existing-gdrive-file-id-123');
  });

  it('3. getOrCreateDriveSyncFileId tạo file mới qua multipart upload nếu file chưa có trên Drive', async () => {
    const { getOrCreateDriveSyncFileId, fetch, d } = sandbox;

    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ files: [] })
      };
    });

    fetch.mockImplementationOnce(async (url, options) => {
      expect(url).toContain('uploadType=multipart');
      expect(options.method).toBe('POST');
      expect(options.headers['Content-Type']).toContain('multipart/related');
      expect(options.body).toContain('chronoflow_sync.json');
      return {
        ok: true,
        json: async () => ({ id: 'newly-created-file-id-456' })
      };
    });

    const fileId = await getOrCreateDriveSyncFileId('test-access-token');
    expect(fileId).toBe('newly-created-file-id-456');
    expect(d.settings.gdrive.fileId).toBe('newly-created-file-id-456');
  });

  it('4. pushToGoogleDrive gửi PATCH dữ liệu d và cập nhật lastSyncTime', async () => {
    sandbox._gcalAccessToken = 'valid-token-abc';
    const { pushToGoogleDrive, fetch, d } = sandbox;

    // 1. list files for pull
    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ files: [{ id: 'drive-target-id', name: 'chronoflow_sync.json' }] })
      };
    });

    // 2. get file content for pull
    fetch.mockImplementationOnce(async (url, options) => {
      expect(url).toContain('/files/drive-target-id?alt=media');
      expect(options.method).toBe('GET');
      return {
        ok: true,
        json: async () => ({ schemaVersion: 2, tasks: [] })
      };
    });

    // 3. list files for push getOrCreate
    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ files: [{ id: 'drive-target-id', name: 'chronoflow_sync.json' }] })
      };
    });

    // 4. patch upload for push
    fetch.mockImplementationOnce(async (url, options) => {
      expect(url).toContain('upload/drive/v3/files/drive-target-id?uploadType=media');
      expect(options.method).toBe('PATCH');
      expect(options.headers['Authorization']).toBe('Bearer valid-token-abc');
      const payload = JSON.parse(options.body);
      expect(payload.schemaVersion).toBe(2);
      return {
        ok: true,
        json: async () => ({ id: 'drive-target-id', status: 'updated' })
      };
    });

    const res = await pushToGoogleDrive();
    expect(res.status).toBe('updated');
    expect(d.settings.gdrive.lastSyncTime).toBeGreaterThan(0);
    expect(d.settings.gdrive.fileId).toBe('drive-target-id');
  });

  it('5. pullFromGoogleDrive tải file về, thực hiện Smart Merge (Last-Writer-Wins) và gọi I()', async () => {
    sandbox._gcalAccessToken = 'valid-token-abc';
    const { pullFromGoogleDrive, fetch, d, touch } = sandbox;

    const task1 = {
      id: 'task-test-merge',
      title: 'Local version 1',
      updatedAt: 1000,
      deleted: false
    };
    d.tasks = [task1];

    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ files: [{ id: 'drive-target-id', name: 'chronoflow_sync.json' }] })
      };
    });

    fetch.mockImplementationOnce(async (url, options) => {
      expect(url).toContain('/files/drive-target-id?alt=media');
      expect(options.method).toBe('GET');
      return {
        ok: true,
        json: async () => ({
          schemaVersion: 2,
          tasks: [
            {
              id: 'task-test-merge',
              title: 'Remote version updated',
              updatedAt: 2000,
              deleted: false
            },
            {
              id: 'task-remote-new',
              title: 'New task from remote drive',
              updatedAt: 1500,
              deleted: false
            }
          ]
        })
      };
    });

    let uiRefreshed = false;
    sandbox.I = () => {
      uiRefreshed = true;
    };

    const merged = await pullFromGoogleDrive();
    expect(merged.tasks.length).toBe(2);

    const updatedTask = merged.tasks.find(t => t.id === 'task-test-merge');
    expect(updatedTask.title).toBe('Remote version updated');

    const newTask = merged.tasks.find(t => t.id === 'task-remote-new');
    expect(newTask).toBeDefined();

    expect(uiRefreshed).toBe(true);
  });

  it('6. setupGDrivePolling thiết lập và dọn dẹp interval theo cài đặt polling', () => {
    const { setupGDrivePolling, d, setInterval, clearInterval, saveSyncPrefs } = sandbox;
    saveSyncPrefs({ gdriveEnabled: true });
    setInterval.mockClear();
    clearInterval.mockClear();

    d.settings.gdrive.pollingEnabled = false;
    setupGDrivePolling();
    expect(setInterval).not.toHaveBeenCalled();

    d.settings.gdrive.pollingEnabled = true;
    d.settings.gdrive.pollingInterval = 120;
    setupGDrivePolling();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 120000);

    d.settings.gdrive.pollingInterval = 900;
    setupGDrivePolling();
    expect(clearInterval).toHaveBeenCalled();
    expect(setInterval).toHaveBeenCalledWith(expect.any(Function), 900000);
  });

  it('7. autoSyncGDriveOnOpen tự động kéo dữ liệu khi mở nếu có token hợp lệ', async () => {
    sandbox._gcalAccessToken = 'test-token-xyz';
    const { autoSyncGDriveOnOpen, d, fetch, saveSyncPrefs } = sandbox;
    saveSyncPrefs({ gdriveEnabled: true });

    d.settings.gdrive.autoSyncOnOpen = true;

    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ files: [{ id: 'drive-target-id' }] })
      };
    });

    fetch.mockImplementationOnce(async () => {
      return {
        ok: true,
        json: async () => ({ schemaVersion: 2, tasks: [] })
      };
    });

    await autoSyncGDriveOnOpen();
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  it('8. renderGDriveSettingsCard tạo giao diện đầy đủ các nút thủ công, toggle và preset', () => {
    const { renderGDriveSettingsCard, d, saveSyncPrefs } = sandbox;
    saveSyncPrefs({ gdriveEnabled: true });
    d.settings.gdrive.pollingEnabled = true;
    d.settings.gdrive.pollingInterval = 300;

    const html = renderGDriveSettingsCard();
    expect(html).toContain('gdrive-card-sync');
    expect(html).toContain('btn-gdrive-pull');
    expect(html).toContain('btn-gdrive-push');
    expect(html).toContain('gdrive-autosync-open-checkbox');
    expect(html).toContain('gdrive-polling-checkbox');
    expect(html).toContain('2 phút (120s)');
    expect(html).toContain('5 phút (300s)');
    expect(html).toContain('15 phút (900s)');
    expect(html).toContain('30 phút (1800s)');
  });

  it('9. Handlers cập nhật state cấu hình gdrive và kích hoạt lưu trữ', () => {
    const { updateGDriveAutoSyncOnOpen, updateGDrivePollingEnabled, setGDrivePollingInterval, d, localStorage } = sandbox;

    updateGDriveAutoSyncOnOpen(false);
    expect(d.settings.gdrive.autoSyncOnOpen).toBe(false);

    updateGDrivePollingEnabled(true);
    expect(d.settings.gdrive.pollingEnabled).toBe(true);

    setGDrivePollingInterval(1800);
    expect(d.settings.gdrive.pollingInterval).toBe(1800);

    const saved = JSON.parse(localStorage.getItem('chronoflow_data'));
    expect(saved.settings.gdrive.pollingInterval).toBe(1800);
  });

  it('10. Master Switch tắt sẽ chặn mọi hoạt động đồng bộ (cả GCal và GDrive) dù đã có token đăng nhập', async () => {
    const {
      saveSyncPrefs,
      pushToGCal,
      pullFromGCal,
      pushAllToGCal,
      pushToGoogleDrive,
      pullFromGoogleDrive,
      triggerGDrivePullManual,
      triggerGDrivePushManual,
      fetch,
      localStorage,
      d
    } = sandbox;

    sandbox._gcalAccessToken = 'valid-token-999';
    localStorage.setItem('chronoflow_gcal_token', 'valid-token-999');
    localStorage.setItem('chronoflow_gcal_token_expires', String(Date.now() + 3600000));

    // Tắt cả 2 nút tổng
    saveSyncPrefs({ gcalEnabled: false, gdriveEnabled: false });
    fetch.mockClear();

    const task = d.tasks[0];
    const resPush = await pushToGCal(task, 'task', 'update', '2026-10-21');
    expect(resPush.reason).toBe('gcal_disabled');

    const resPull = await pullFromGCal(true);
    expect(resPull.reason).toBe('gcal_disabled');

    const resPushAll = await pushAllToGCal(true);
    expect(resPushAll.reason).toBe('gcal_disabled');

    const resDrivePush = await pushToGoogleDrive();
    expect(resDrivePush.reason).toBe('gdrive_disabled');

    const resDrivePull = await pullFromGoogleDrive();
    expect(resDrivePull.reason).toBe('gdrive_disabled');

    await triggerGDrivePullManual();
    await triggerGDrivePushManual();

    // Không có bất kỳ request mạng nào được gửi đi khi nút tổng đang tắt
    expect(fetch).not.toHaveBeenCalled();
  });

  it('11. Tùy chọn đồng bộ khi mở web (autoSyncOnOpen) và Polling hoạt động và bật/tắt hoàn toàn độc lập', () => {
    const {
      saveSyncPrefs,
      updateGCalAutoSyncOnOpen,
      updateGCalPollingEnabled,
      updateGDriveAutoSyncOnOpen,
      updateGDrivePollingEnabled,
      d,
      setInterval,
      clearInterval
    } = sandbox;

    saveSyncPrefs({ gcalEnabled: true, gdriveEnabled: true });
    setInterval.mockClear();
    clearInterval.mockClear();

    // 1. GCal: Bật autoSyncOnOpen không làm bật Polling (autoSync)
    updateGCalAutoSyncOnOpen(true);
    expect(d.settings.gcal.autoSyncOnOpen).toBe(true);
    expect(d.settings.gcal.autoSync).toBe(false);
    expect(setInterval).not.toHaveBeenCalled();

    // Bật Polling GCal độc lập, rồi tắt autoSyncOnOpen mà Polling vẫn giữ nguyên
    updateGCalPollingEnabled(true);
    expect(d.settings.gcal.autoSync).toBe(true);
    expect(d.settings.gcal.autoSyncOnOpen).toBe(true);
    expect(setInterval).toHaveBeenCalled();

    updateGCalAutoSyncOnOpen(false);
    expect(d.settings.gcal.autoSyncOnOpen).toBe(false);
    expect(d.settings.gcal.autoSync).toBe(true);

    // 2. GDrive: Bật/tắt autoSyncOnOpen và pollingEnabled độc lập
    updateGDriveAutoSyncOnOpen(true);
    updateGDrivePollingEnabled(false);
    expect(d.settings.gdrive.autoSyncOnOpen).toBe(true);
    expect(d.settings.gdrive.pollingEnabled).toBe(false);

    updateGDrivePollingEnabled(true);
    updateGDriveAutoSyncOnOpen(false);
    expect(d.settings.gdrive.autoSyncOnOpen).toBe(false);
    expect(d.settings.gdrive.pollingEnabled).toBe(true);
  });

  it('12. Chống lặp sự kiện GCal khi pushToGCal được gọi đồng thời và khi pullFromGCal xử lý sự kiện lặp/ghi chú/đã xóa', async () => {
    const {
      saveSyncPrefs,
      pushToGCal,
      pullFromGCal,
      mergeCollections,
      fetch,
      localStorage,
      d
    } = sandbox;

    sandbox._gcalAccessToken = 'valid-token-dedup';
    localStorage.setItem('chronoflow_gcal_token', 'valid-token-dedup');
    localStorage.setItem('chronoflow_gcal_token_expires', String(Date.now() + 3600000));
    saveSyncPrefs({ gcalEnabled: true, gdriveEnabled: true });

    const testTask = {
      id: 'task-concurrent-1',
      title: 'Task kiểm tra chống nhân đôi',
      date: '2026-10-21',
      isImportant: true,
      isUrgent: true,
      status: 'scheduled',
      assignedSlot: { start: '08:00', end: '09:00' },
      assignedSlotsByDate: { '2026-10-21': { start: '08:00', end: '09:00' } },
      deleted: false
    };
    d.tasks.push(testTask);
    sandbox.selectedDate = '2026-10-21';

    let postCount = 0;
    let patchCount = 0;

    fetch.mockImplementation(async (url, options = {}) => {
      const method = options.method || 'GET';
      if (method === 'GET' && url.includes('?q=')) {
        return { ok: true, status: 200, json: async () => ({ items: [] }) };
      }
      if (method === 'POST') {
        postCount++;
        return { ok: true, status: 200, json: async () => ({ id: 'gcal-created-id-1' }) };
      }
      if (method === 'PATCH') {
        patchCount++;
        const patchedId = url.includes('/events/') ? url.split('/events/')[1].split('?')[0] : 'gcal-created-id-1';
        return { ok: true, status: 200, json: async () => ({ id: patchedId }) };
      }
      return { ok: true, status: 200, json: async () => ({ items: [] }) };
    });

    // Gọi song song 2 lần pushToGCal cho cùng 1 task chưa có gcal_event_id
    await Promise.all([
      pushToGCal(testTask, 'task', 'update', '2026-10-21'),
      pushToGCal(testTask, 'task', 'update', '2026-10-21')
    ]);

    // Lần 1 INSERT (POST), lần 2 đợi lần 1 xong nên nhận được gcal_event_id và chỉ PATCH (không POST trùng)
    expect(postCount).toBe(1);
    expect(patchCount).toBe(1);
    expect(testTask.gcal_event_id).toBe('gcal-created-id-1');

    // Kiểm tra mergeCollections bảo toàn gcal_event_id khi bản mới hơn từ thiết bị khác chưa có gcal_event_id
    const merged = mergeCollections(
      { tasks: [{ id: 'task-concurrent-1', title: 'Old', updatedAt: 100, gcal_event_id: 'gcal-created-id-1', deleted: false }] },
      { tasks: [{ id: 'task-concurrent-1', title: 'Newer from Device B', updatedAt: 200, deleted: false }] }
    );
    expect(merged.tasks[0].title).toBe('Newer from Device B');
    expect(merged.tasks[0].gcal_event_id).toBe('gcal-created-id-1');

    // Kiểm tra pullFromGCal:
    // - Instance của Fixed Event (có recurringEventId) giữ nguyên master ID chứ không bị ghi đè bởi instance ID
    // - Sự kiện có tag ChronoFlow Note hoặc Task đã xóa mềm không bị biến thành Việc đột xuất (transientEvent)
    const transientCountBefore = d.transientEvents.length;
    fetch.mockImplementationOnce(async () => ({
      ok: true,
      status: 200,
      json: async () => ({
        items: [
          {
            id: 'masterFixed123_20261021T000000Z',
            recurringEventId: 'masterFixed123',
            status: 'confirmed',
            summary: 'Ngủ đêm & Phục hồi sức khỏe',
            description: 'Việc cố định\n[ChronoFlow Fixed | ID: fe-1]',
            start: { dateTime: '2026-10-21T00:00:00+07:00' },
            end: { dateTime: '2026-10-21T06:30:00+07:00' }
          },
          {
            id: 'noteEvent999',
            status: 'confirmed',
            summary: '📝 Ghi chú hôm nay',
            description: 'Nội dung ghi chú\n[ChronoFlow Note | ID: note-1]',
            start: { date: '2026-10-21' },
            end: { date: '2026-10-22' }
          },
          {
            id: 'deletedTaskEvent888',
            status: 'confirmed',
            summary: 'Task đã xóa local',
            description: '[ChronoFlow Task | ID: deleted-task-id]',
            start: { dateTime: '2026-10-21T14:00:00+07:00' },
            end: { dateTime: '2026-10-21T15:00:00+07:00' }
          }
        ]
      })
    }));

    await pullFromGCal(false);
    const fe1 = d.fixedEvents.find(f => f.id === 'fe-1');
    expect(fe1.gcal_event_id).toBe('masterFixed123');
    expect(d.transientEvents.length).toBe(transientCountBefore);
  });

  it('13. Đồng bộ đầy đủ thiết lập Streak (weekdayThresholds / ngày lười, weeklyRelief, streakDayOverrides) và hợp nhất không xung đột giúp Streak giống hệt trên mọi thiết bị', () => {
    const {
      mergeCollections,
      updateWeekdayThreshold,
      StreakEngine,
      d
    } = sandbox;

    // Giả lập lịch sử công việc trên 2 ngày:
    // - 2026-10-20 (Thứ Ba, dow = 2): hoàn thành 1/2 task (50%)
    // - 2026-10-21 (Thứ Tư, dow = 3): hoàn thành 1/2 task (50%)
    const sharedTasks = [
      { id: 'st-1', title: 'T1', date: '2026-10-20', status: 'done', completedDates: ['2026-10-20'], updatedAt: 100, deleted: false },
      { id: 'st-2', title: 'T2', date: '2026-10-20', status: 'todo', completedDates: [], updatedAt: 100, deleted: false },
      { id: 'st-3', title: 'T3', date: '2026-10-21', status: 'done', completedDates: ['2026-10-21'], updatedAt: 100, deleted: false },
      { id: 'st-4', title: 'T4', date: '2026-10-21', status: 'todo', completedDates: [], updatedAt: 100, deleted: false }
    ];

    // Thiết bị A: chọn Thứ Ba (dow = 2) làm "ngày lười" trong tuần (ngưỡng 50%) và áp dụng Cứu trợ tuần (Weekly Relief 50%) cho Thứ Tư (2026-10-21)
    d.tasks = JSON.parse(JSON.stringify(sharedTasks));
    d.streakDayOverrides = {};
    d.settings.streak = {
      threshold: 0.8,
      weekdayThresholds: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      thresholdEditableOnlyOnSunday: false,
      weeklyRelief: { usedInWeekKey: null }
    };

    // Cập nhật ngày lười Thứ Ba (dow = 2) = 0.5 và dùng Cứu trợ tuần cho 2026-10-21 = 0.5
    updateWeekdayThreshold(2, 0.5);
    const reliefApplied = StreakEngine.applyWeeklyRelief('2026-10-21', 0.5);
    expect(reliefApplied).toBeTruthy();

    // Kiểm tra metadata updatedAt đã được gắn đầy đủ khi thay đổi Streak
    expect(d.settings.streak.updatedAt).toBeGreaterThan(0);
    expect(d.settings.streak.weekdayThresholds[2]).toBe(0.5);
    expect(d.streakDayOverrides['2026-10-21'].threshold).toBe(0.5);
    expect(d.streakDayOverrides['2026-10-21'].updatedAt).toBeGreaterThan(0);

    const streakOnDeviceA = StreakEngine.evaluate({ customToday: '2026-10-21', tasks: d.tasks });
    expect(streakOnDeviceA.currentStreak).toBe(2);

    // Thiết bị B ban đầu chưa có cấu hình ngày lười hay cứu trợ tuần (ngưỡng mặc định 0.8 -> cả 2 ngày đều 50% < 80% nên streak = 0)
    const deviceBState = {
      tasks: JSON.parse(JSON.stringify(sharedTasks)),
      streakDayOverrides: {},
      settings: {
        updatedAt: 50,
        streakThreshold: 0.8,
        streak: {
          threshold: 0.8,
          weekdayThresholds: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
          thresholdEditableOnlyOnSunday: true,
          weeklyRelief: { usedInWeekKey: null },
          updatedAt: 50
        }
      }
    };

    // Đồng bộ JSON từ Thiết bị A sang Thiết bị B qua mergeCollections
    const syncedDeviceB = mergeCollections(deviceBState, JSON.parse(JSON.stringify(d)));

    expect(syncedDeviceB.settings.streak.weekdayThresholds[2]).toBe(0.5);
    expect(syncedDeviceB.settings.streak.weeklyRelief.usedInWeekKey).toBe(d.settings.streak.weeklyRelief.usedInWeekKey);
    expect(syncedDeviceB.streakDayOverrides['2026-10-21'].threshold).toBe(0.5);

    // Gán state đã đồng bộ vào máy B và tính lại Streak -> kết quả khớp 100% với máy A (2 ngày liên tiếp)
    sandbox.appState = syncedDeviceB;
    sandbox.d = syncedDeviceB;
    const streakOnDeviceB = StreakEngine.evaluate({ customToday: '2026-10-21', tasks: syncedDeviceB.tasks });
    expect(streakOnDeviceB.currentStreak).toBe(streakOnDeviceA.currentStreak);
    expect(streakOnDeviceB.currentStreak).toBe(2);
  });

  it('14. Cho phép tùy chỉnh phím tắt đồng bộ trên Header là Google Calendar (GCal) hoặc Google Drive (GDrive)', async () => {
    const {
      getHeaderSyncTarget,
      updateHeaderSyncTarget,
      triggerHeaderGCalAction,
      saveSyncPrefs,
      localStorage,
      fetch
    } = sandbox;

    sandbox._gcalAccessToken = 'token-header-shortcut';
    localStorage.setItem('chronoflow_gcal_token', 'token-header-shortcut');
    localStorage.setItem('chronoflow_gcal_token_expires', String(Date.now() + 3600000));
    saveSyncPrefs({ gcalEnabled: true, gdriveEnabled: true });

    // Mặc định là 'gcal'
    expect(getHeaderSyncTarget()).toBe('gcal');

    // Chuyển phím tắt đồng bộ trên Header sang Google Drive ('gdrive')
    updateHeaderSyncTarget('gdrive');
    expect(getHeaderSyncTarget()).toBe('gdrive');
    expect(sandbox.appState.settings.headerSyncTarget).toBe('gdrive');

    fetch.mockClear();
    fetch.mockImplementation(async (url, options = {}) => {
      const method = options.method || 'GET';
      if (url.includes('alt=media') && method === 'GET') {
        return {
          ok: true,
          status: 200,
          json: async () => ({ tasks: [], settings: { gdrive: { fileId: 'drive-shortcut-id' } } })
        };
      }
      return {
        ok: true,
        status: 200,
        json: async () => ({ id: 'drive-shortcut-id', files: [{ id: 'drive-shortcut-id', name: 'chronoflow_sync.json' }] })
      };
    });

    const driveRes = await triggerHeaderGCalAction();
    expect(driveRes.target).toBe('gdrive');
    expect(driveRes.success).toBe(true);
    expect(fetch.mock.calls.some(([u]) => String(u).includes('googleapis.com/drive') || String(u).includes('upload/drive'))).toBe(true);

    // Chuyển lại về Google Calendar ('gcal')
    updateHeaderSyncTarget('gcal');
    expect(getHeaderSyncTarget()).toBe('gcal');
  });

  it('15. Khi syncTypes tắt, ngoài quadrant hoặc ngoài syncTimeScope: không DELETE trên GCal, không xóa gcal_event_id local, chỉ return skipped; bulk push bỏ qua', async () => {
    const {
      saveSyncPrefs,
      pushToGCal,
      pushAllToGCal,
      fetch,
      localStorage,
      d
    } = sandbox;

    sandbox._gcalAccessToken = 'valid-token-filter-test';
    localStorage.setItem('chronoflow_gcal_token', 'valid-token-filter-test');
    localStorage.setItem('chronoflow_gcal_token_expires', String(Date.now() + 3600000));
    saveSyncPrefs({ gcalEnabled: true, gdriveEnabled: false });

    // Khởi tạo các event/task đã có gcal_event_id từ trước
    const scheduledTask = {
      id: 'task-filter-1',
      title: 'Scheduled Task in Q3 (disabled quadrant)',
      date: '2026-10-21',
      isImportant: false,
      isUrgent: true, // Q3
      status: 'scheduled',
      assignedSlot: { start: '09:00', end: '10:00' },
      assignedSlotsByDate: { '2026-10-21': { start: '09:00', end: '10:00' } },
      gcal_event_id: 'gcal-scheduled-101',
      deleted: false
    };

    const fixedEvent = {
      id: 'fixed-filter-1',
      title: 'Fixed Event with sync type turned off',
      startDate: '2026-10-21',
      start: '14:00',
      end: '15:00',
      repeatType: 'daily',
      gcal_event_id: 'gcal-fixed-202',
      deleted: false
    };

    const transientEvent = {
      id: 'transient-filter-1',
      title: 'Transient Event with sync type turned off',
      date: '2026-10-21',
      start: '16:00',
      end: '17:00',
      gcal_event_id: 'gcal-transient-303',
      source: 'local',
      deleted: false
    };

    d.tasks = [scheduledTask];
    d.fixedEvents = [fixedEvent];
    d.transientEvents = [transientEvent];
    sandbox.selectedDate = '2026-10-21';

    // Cài đặt: syncTypes tắt fixed và transient; syncScheduledQuadrants tắt Q3
    d.settings.gcal.syncTypes = {
      tasksScheduled: true,
      tasksUnscheduled: false,
      fixed: false,
      transient: false,
      notes: false
    };
    d.settings.gcal.syncScheduledQuadrants = {
      q1: true,
      q2: true,
      q3: false,
      q4: false
    };
    d.settings.gcal.syncTimeScope = 'day';

    const fetchCalls = [];
    fetch.mockImplementation(async (url, options = {}) => {
      fetchCalls.push({ url, method: options.method || 'GET' });
      return { ok: true, status: 200, json: async () => ({}) };
    });

    // 1. Push từng item:
    // a) scheduledTask thuộc Q3 (quadrant bị tắt) -> return skipped, KHÔNG fetch DELETE, KHÔNG xóa gcal_event_id
    const resTask = await pushToGCal(scheduledTask, 'task', 'update', '2026-10-21');
    expect(resTask.action).toBe('skipped_scheduled_filter');
    expect(scheduledTask.gcal_event_id).toBe('gcal-scheduled-101');
    expect(fetchCalls.filter(c => c.method === 'DELETE').length).toBe(0);

    // b) fixedEvent có syncTypes.fixed = false -> return skipped, KHÔNG fetch DELETE, KHÔNG xóa gcal_event_id
    const resFixed = await pushToGCal(fixedEvent, 'fixed', 'update', '2026-10-21');
    expect(resFixed.action).toBe('skipped_sync_type');
    expect(fixedEvent.gcal_event_id).toBe('gcal-fixed-202');
    expect(fetchCalls.filter(c => c.method === 'DELETE').length).toBe(0);

    // c) transientEvent có syncTypes.transient = false -> return skipped, KHÔNG fetch DELETE, KHÔNG xóa gcal_event_id
    const resTransient = await pushToGCal(transientEvent, 'transient', 'update', '2026-10-21');
    expect(resTransient.action).toBe('skipped_sync_type');
    expect(transientEvent.gcal_event_id).toBe('gcal-transient-303');
    expect(fetchCalls.filter(c => c.method === 'DELETE').length).toBe(0);

    // 2. Bulk push (pushAllToGCal):
    // Với fixed và transient tắt, và task ngoài quadrant -> không gọi push/fetch DELETE, các item vẫn giữ gcal_event_id
    fetchCalls.length = 0;
    await pushAllToGCal(false);
    expect(fetchCalls.filter(c => c.method === 'DELETE').length).toBe(0);
    expect(fetchCalls.length).toBe(0); // Không gửi request nào vì tất cả đều bị skip
    expect(scheduledTask.gcal_event_id).toBe('gcal-scheduled-101');
    expect(fixedEvent.gcal_event_id).toBe('gcal-fixed-202');
    expect(transientEvent.gcal_event_id).toBe('gcal-transient-303');

    // 3. Kiểm tra DELETE vẫn hoạt động khi user chủ động xóa item (action === 'delete' hoặc item.deleted)
    const resDelete = await pushToGCal(fixedEvent, 'fixed', 'delete');
    expect(resDelete.action).toBe('deleted');
    expect(fixedEvent.gcal_event_id).toBeUndefined();
    expect(fetchCalls.some(c => c.method === 'DELETE' && c.url.includes('gcal-fixed-202'))).toBe(true);
  });
});

