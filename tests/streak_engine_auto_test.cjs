/**
 * ChronoFlow StreakEngine Automated TDD Test Runner
 * Runs all 8 mandatory test cases in Node.js runtime to verify the Retrospective History Replay Engine.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 Đang chuẩn bị môi trường kiểm thử TDD cho StreakEngine...');

// Setup mock browser environment
const localStorageStore = {};
const mockLocalStorage = {
  getItem: (k) => localStorageStore[k] || null,
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
    querySelector: function(s) { return null; },
    querySelectorAll: function(s) { return []; },
    addEventListener: function(e, fn) {},
    dispatchEvent: function(e) {},
    setAttribute: function(k, v) { this[k] = v; },
    getAttribute: function(k) { return this[k] || null; },
    removeAttribute: function(k) { delete this[k]; },
    focus: function() {},
    click: function() {}
  };
  if (id) domElements[id] = el;
  return el;
}

const mockDocument = {
  getElementById: (id) => domElements[id] || (domElements[id] = createMockElement('div', id)),
  createElement: (tag) => createMockElement(tag),
  querySelector: (sel) => null,
  querySelectorAll: (sel) => [],
  body: createMockElement('body', 'body'),
  documentElement: createMockElement('html', 'html'),
  addEventListener: () => {}
};

// Create mock elements
['app-sidebar', 'app-sidebar-content', 'view-container', 'modal-container', 'toast', 'current-date-title', 'active-view-label',
 'header-gcal-btn', 'header-gcal-label', 'gcal-floating-widget', 'gcal-floating-msg',
 'view-btn-year', 'view-btn-month', 'view-btn-day', 'view-btn-eisenhower', 'view-btn-settings',
 'lang-btn-text', 'settings-overlay-modal', 'settings-gcal-mount-point', 'settings-appearance-mount-point',
 'settings-data-mount-point', 'settings-help-mount-point', 'app-toast-container'].forEach(id => {
  mockDocument.getElementById(id);
});

const sandbox = {
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
  google: {
    accounts: {
      oauth2: {
        initTokenClient: () => ({ requestAccessToken: () => {} })
      }
    }
  },
  fetch: async () => ({ ok: true, json: async () => ({ items: [] }) }),
  Blob: class { constructor(parts) { this.parts = parts; } },
  URL: { createObjectURL: () => 'blob:mock', revokeObjectURL: () => {} },
  CustomEvent: class {
    constructor(type, detail) {
      this.type = type;
      this.detail = detail ? detail.detail : null;
    }
  },
  console: console
};
sandbox.window = sandbox;
sandbox.window.dispatchEvent = function(event) {
  if (event && event.type === 'streakUpdated') {
    sandbox._lastDispatchedStreakEvent = event.detail;
  }
};

const appJsCode = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf8');
vm.createContext(sandbox);

try {
  vm.runInContext(appJsCode, sandbox);
  console.log('✅ Đã nạp thành công app.js vào sandbox.');
} catch (e) {
  console.error('❌ Lỗi nạp app.js:', e);
  process.exit(1);
}

// Kiểm tra sự tồn tại của window.StreakEngine
if (!sandbox.StreakEngine) {
  console.error('❌ StreakEngine không được gắn vào window!');
  process.exit(1);
}

console.log('✅ Tìm thấy window.StreakEngine. Bắt đầu chạy test...');

const testResult = sandbox.StreakEngine.runUnitTests();

if (!testResult.allPassed) {
  console.error(`❌ Kiểm thử thất bại: Chỉ có ${testResult.passed}/${testResult.total} passed.`);
  process.exit(1);
} else {
  console.log(`🎉 TOÀN BỘ ${testResult.passed}/${testResult.total} KIỂM THỬ TDD ĐÃ VƯỢT QUA XUẤT SẮC!`);
}

// Bổ sung kiểm thử các hàm tiện ích getMonthStats, getYearStats, setThreshold, event dispatching & tính năng mới
console.log('\n--- Kiểm thử bổ sung các API Thống kê, Quản lý State & Cứu Trợ Tuần ---');

// 1. setThreshold & thresholdEditableOnlyOnSunday
sandbox.appState.settings.streak.thresholdEditableOnlyOnSunday = true;
// Nếu hôm nay không phải CN, setThreshold phải trả về false
const nonSundayRes = sandbox.StreakEngine.setThreshold(0.8);
if (nonSundayRes === false) {
  console.log('✅ PASS [setThreshold restriction]: Chặn thay đổi ngưỡng khi thresholdEditableOnlyOnSunday=true và không phải Chủ Nhật.');
} else {
  console.error('❌ FAIL [setThreshold restriction]: Không chặn khi không phải Chủ Nhật', nonSundayRes);
  process.exit(1);
}

// Bật thresholdEditableOnlyOnSunday = false để test setThreshold thành công
sandbox.appState.settings.streak.thresholdEditableOnlyOnSunday = false;
const thresholdRes = sandbox.StreakEngine.setThreshold(0.8);
if (thresholdRes && thresholdRes.threshold === 0.8) {
  console.log('✅ PASS [API setThreshold]: Đã lưu và áp dụng ngưỡng 0.8 (80%) thành công khi được phép.');
} else {
  console.error('❌ FAIL [API setThreshold]: Ngưỡng không khớp 0.8', thresholdRes);
  process.exit(1);
}

// 2. Helpers: canChangeThreshold & canUseWeeklyRelief & getISOWeekKey
const canChange = sandbox.StreakEngine.canChangeThreshold();
const canRelief = sandbox.StreakEngine.canUseWeeklyRelief('2026-10-26');
const isoWeek = sandbox.StreakEngine.getISOWeekKey('2026-10-26');
if (typeof canChange === 'boolean' && typeof canRelief === 'boolean' && typeof isoWeek === 'string') {
  console.log(`✅ PASS [Helpers]: canChangeThreshold=${canChange}, canUseWeeklyRelief=${canRelief}, isoWeek=${isoWeek}.`);
} else {
  console.error('❌ FAIL [Helpers]: Sai kiểu dữ liệu trả về từ helpers');
  process.exit(1);
}

// 3. applyWeeklyRelief
// Hiệu lực hiện tại của ngày 2026-10-26 là 0.8 (từ setThreshold trên)
// Thử applyWeeklyRelief với ngưỡng cao hơn hoặc bằng hiệu lực (ví dụ 0.9) -> phải trả về false
const reliefFail = sandbox.StreakEngine.applyWeeklyRelief('2026-10-26', 0.9);
if (reliefFail === false) {
  console.log('✅ PASS [applyWeeklyRelief condition]: Chặn cứu trợ khi threshold >= effectiveThreshold (0.9 >= 0.8).');
} else {
  console.error('❌ FAIL [applyWeeklyRelief condition]: Không chặn khi threshold >= effectiveThreshold', reliefFail);
  process.exit(1);
}

// Thử applyWeeklyRelief hợp lệ (ví dụ 0.4 < 0.8) -> phải thành công
const reliefSuccess = sandbox.StreakEngine.applyWeeklyRelief('2026-10-26', 0.4);
if (reliefSuccess && sandbox.appState.streakDayOverrides['2026-10-26'] && sandbox.appState.streakDayOverrides['2026-10-26'].threshold === 0.4) {
  console.log('✅ PASS [applyWeeklyRelief success]: Áp dụng cứu trợ tuần thành công (threshold = 0.4), ghi override.');
} else {
  console.error('❌ FAIL [applyWeeklyRelief success]: Không ghi được override cứu trợ', reliefSuccess);
  process.exit(1);
}

// Thử dùng lại cứu trợ trong cùng tuần (ví dụ ngày 2026-10-28) -> phải bị chặn (1 lần/tuần)
const reliefSecondCall = sandbox.StreakEngine.applyWeeklyRelief('2026-10-28', 0.3);
if (reliefSecondCall === false) {
  console.log('✅ PASS [applyWeeklyRelief weekly limit]: Giới hạn 1 lần/tuần (ISO week key) hoạt động chính xác (chặn lần 2 trong tuần).');
} else {
  console.error('❌ FAIL [applyWeeklyRelief weekly limit]: Cho phép dùng cứu trợ nhiều lần trong 1 tuần', reliefSecondCall);
  process.exit(1);
}

// 2. getMonthStats
const monthStats = sandbox.StreakEngine.getMonthStats(2026, 9);
if (typeof monthStats.totalDaysInMonth === 'number' && monthStats.totalDaysInMonth === 30 && Array.isArray(monthStats.dayDetails)) {
  console.log('✅ PASS [API getMonthStats]: Thống kê tháng 9/2026 trả về đúng 30 ngày và dayDetails.');
} else {
  console.error('❌ FAIL [API getMonthStats]: Sai định dạng trả về', monthStats);
  process.exit(1);
}

// 3. getYearStats
const yearStats = sandbox.StreakEngine.getYearStats(2026);
if (typeof yearStats.totalDaysInYear === 'number' && yearStats.totalDaysInYear === 365 && yearStats.monthlySummary.length === 12) {
  console.log('✅ PASS [API getYearStats]: Thống kê năm 2026 trả về đúng 365 ngày và 12 tháng tóm tắt.');
} else {
  console.error('❌ FAIL [API getYearStats]: Sai định dạng trả về', yearStats);
  process.exit(1);
}

// 4. Custom Event Dispatch
if (sandbox._lastDispatchedStreakEvent) {
  console.log('✅ PASS [CustomEvent]: window.dispatchEvent(\'streakUpdated\') hoạt động chính xác với payload.');
} else {
  console.error('❌ FAIL [CustomEvent]: Chưa nhận được sự kiện streakUpdated');
  process.exit(1);
}

// --- Kiểm thử tính năng mới: settings.streak, streakDayOverrides, effectiveThreshold, getDayMetrics ---
console.log('\n--- Kiểm thử tính năng Streak Settings, Day Overrides & effectiveThreshold ---');
const appStateRef = sandbox.appState;
if (appStateRef.settings.streak && typeof appStateRef.settings.streak.threshold === 'number' && appStateRef.settings.streak.weekdayThresholds && typeof appStateRef.settings.streak.thresholdEditableOnlyOnSunday === 'boolean' && appStateRef.settings.streak.weeklyRelief) {
  console.log('✅ PASS [settings.streak]: Cấu trúc settings.streak đầy đủ threshold, weekdayThresholds, thresholdEditableOnlyOnSunday, weeklyRelief.');
} else {
  console.error('❌ FAIL [settings.streak]: Thiếu cấu trúc settings.streak');
  process.exit(1);
}

if (appStateRef.streakDayOverrides && typeof appStateRef.streakDayOverrides === 'object') {
  console.log('✅ PASS [streakDayOverrides]: Tồn tại thuộc tính streakDayOverrides trên data root.');
} else {
  console.error('❌ FAIL [streakDayOverrides]: Thiếu streakDayOverrides trên data root');
  process.exit(1);
}

appStateRef.settings.streak.threshold = 0.7;
const testSundayDate = '2026-10-25'; // 2026-10-25 is Sunday
const testMondayDate = '2026-10-26'; // Monday
appStateRef.settings.streak.weekdayThresholds[0] = 0.5;

const tSun = sandbox.StreakEngine.effectiveThreshold(testSundayDate);
if (tSun === 0.5) {
  console.log('✅ PASS [effectiveThreshold weekday]: Lấy đúng weekdayThresholds[0] = 0.5 cho Chủ Nhật.');
} else {
  console.error('❌ FAIL [effectiveThreshold weekday]: Giá trị không khớp', tSun);
  process.exit(1);
}

appStateRef.streakDayOverrides[testMondayDate] = { threshold: 0.9, source: 'manual' };
appStateRef.settings.streak.weekdayThresholds[1] = 0.6;
const tMon = sandbox.StreakEngine.effectiveThreshold(testMondayDate);
if (tMon === 0.9) {
  console.log('✅ PASS [effectiveThreshold override]: Override (0.9) ưu tiên cao hơn weekdayThresholds và global threshold.');
} else {
  console.error('❌ FAIL [effectiveThreshold override]: Giá trị override không khớp 0.9', tMon);
  process.exit(1);
}

const metricsMon = sandbox.StreakEngine.getDayMetrics(testMondayDate, [], null);
if (metricsMon.threshold === 0.9) {
  console.log('✅ PASS [getDayMetrics effectiveThreshold]: getDayMetrics sử dụng đúng effectiveThreshold (0.9 từ override).');
} else {
  console.error('❌ FAIL [getDayMetrics effectiveThreshold]: threshold không khớp 0.9', metricsMon.threshold);
  process.exit(1);
}

console.log('\n🌟 100% KIỂM THỬ THÀNH CÔNG RỰC RỠ!');
process.exit(0);

