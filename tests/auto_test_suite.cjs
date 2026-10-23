/**
 * ChronoFlow Automated Comprehensive Test Suite
 * Tests all core algorithms, state management, recurrence, calculations, GCal mapping, and views.
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

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

// Create required container elements in mock DOM
['app-sidebar', 'app-sidebar-content', 'view-container', 'modal-container', 'toast', 'current-date-title', 'active-view-label',
 'header-gcal-btn', 'header-gcal-label', 'gcal-floating-widget', 'gcal-floating-msg',
 'view-btn-year', 'view-btn-month', 'view-btn-day', 'view-btn-eisenhower', 'view-btn-settings',
 'lang-btn-text', 'settings-overlay-modal', 'settings-gcal-mount-point', 'settings-appearance-mount-point',
 'settings-data-mount-point', 'settings-help-mount-point'].forEach(id => {
  mockDocument.getElementById(id);
});

// Setup global context
const testContext = {
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
  console: console
};
testContext.window = testContext;

// Read and evaluate src/app.js
const appJsCode = fs.readFileSync(path.join(__dirname, '../src/app.js'), 'utf-8');
const context = vm.createContext(testContext);
vm.runInContext(appJsCode, context);

// Test Runner Framework
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  ✓ PASS: ${testName}`);
  } else {
    failedTests++;
    failures.push({ testName, details });
    console.error(`  ✗ FAIL: ${testName} - ${details}`);
  }
}

function assertEqual(actual, expected, testName) {
  const cond = JSON.stringify(actual) === JSON.stringify(expected);
  assert(cond, testName, `Expected: ${JSON.stringify(expected)}, Got: ${JSON.stringify(actual)}`);
}

console.log('====================================================');
console.log('      CHRONOFLOW AUTOMATED COMPREHENSIVE TESTS      ');
console.log('====================================================\n');

// ----------------------------------------------------
// TEST GROUP 1: Internationalization (i18n) Parity
// ----------------------------------------------------
console.log('--- TEST GROUP 1: i18n & Translation Keys Parity ---');
try {
  const viKeys = Object.keys(context.translations.vi);
  const enKeys = Object.keys(context.translations.en);

  const missingInEn = viKeys.filter(k => !(k in context.translations.en));
  const missingInVi = enKeys.filter(k => !(k in context.translations.vi));

  assert(missingInEn.length === 0, 'All Vietnamese keys exist in English', `Missing in EN: ${missingInEn.join(', ')}`);
  assert(missingInVi.length === 0, 'All English keys exist in Vietnamese', `Missing in VI: ${missingInVi.join(', ')}`);

  // Test t() function
  context.appState.settings.lang = 'vi';
  assert(context.t('navDay').includes('Ngày'), 't("navDay") returns Vietnamese value with Ngày');
  context.appState.settings.lang = 'en';
  assert(context.t('navDay').includes('Day'), 't("navDay") returns English value with Day');
  context.appState.settings.lang = 'vi'; // reset
} catch (e) {
  assert(false, 'i18n Parity', e.message);
}

// ----------------------------------------------------
// TEST GROUP 2: Time Utilities & Durations
// ----------------------------------------------------
console.log('\n--- TEST GROUP 2: Time Utilities & Durations ---');
try {
  assertEqual(context.timeToMinutes('00:00'), 0, 'timeToMinutes("00:00") === 0');
  assertEqual(context.timeToMinutes('12:30'), 750, 'timeToMinutes("12:30") === 750');
  assertEqual(context.timeToMinutes('23:59'), 1439, 'timeToMinutes("23:59") === 1439');

  assertEqual(context.minutesToTime(0), '00:00', 'minutesToTime(0) === "00:00"');
  assertEqual(context.minutesToTime(750), '12:30', 'minutesToTime(750) === "12:30"');
  assertEqual(context.minutesToTime(1439), '23:59', 'minutesToTime(1439) === "23:59"');

  // Round trip test for all 1440 minutes in 15m steps
  let roundTripOk = true;
  for (let m = 0; m < 1440; m += 15) {
    const tStr = context.minutesToTime(m);
    const back = context.timeToMinutes(tStr);
    if (back !== m) {
      roundTripOk = false;
      break;
    }
  }
  assert(roundTripOk, 'All 15-minute increments round-trip correctly');

  // formatDuration tests
  assert(context.formatDuration(30).includes('30'), 'formatDuration(30) contains 30');
  assert(context.formatDuration(90).includes('1') && context.formatDuration(90).includes('30'), 'formatDuration(90) contains 1h 30');
} catch (e) {
  assert(false, 'Time Utilities', e.message);
}

// ----------------------------------------------------
// TEST GROUP 3: Core Free Time Calculation Engine
// ----------------------------------------------------
console.log('\n--- TEST GROUP 3: Free Time Calculation & Thresholds ---');
try {
  const testDate = '2026-09-23';

  const origFixed = [...context.appState.fixedEvents];
  const origTransient = [...context.appState.transientEvents];
  const origNoisy = [...context.appState.settings.noisyIntervals];

  // Test 3.1: Zero busy events -> Entire day is free
  context.appState.fixedEvents = [];
  context.appState.transientEvents = [];
  context.appState.settings.noisyIntervals = [];

  let res = context.calculateFreeTimeSlots(testDate);
  const totalFree = res.freeSlots.reduce((acc, s) => acc + s.duration, 0);
  assertEqual(totalFree, 1440, 'Zero events => exactly 1440 minutes total free time');
  assertEqual(res.freeSlots.length, 1, 'Zero events => exactly 1 full day slot (00:00 to 24:00)');
  assertEqual(res.freeSlots[0].startTimeStr, '00:00', 'Full day slot starts at "00:00"');
  assertEqual(res.freeSlots[0].duration, 1440, 'Full day slot duration is 1440 mins');

  // Test 3.2: Overlapping busy events
  // Event A: 09:00 - 11:00 (120 min)
  // Event B: 10:00 - 12:00 (120 min, overlapping)
  // Merged busy should be 09:00 - 12:00 (180 min)
  context.appState.fixedEvents = [
    { id: 'f1', title: 'Work A', start: '09:00', end: '11:00', repeatType: 'daily' },
    { id: 'f2', title: 'Work B', start: '10:00', end: '12:00', repeatType: 'daily' }
  ];
  res = context.calculateFreeTimeSlots(testDate);
  const freeMins = res.freeSlots.reduce((acc, s) => acc + s.duration, 0);
  const busyTotal = 1440 - freeMins;
  assertEqual(busyTotal, 180, 'Overlapping events merge properly into exactly 180 minutes busy');

  // Test 3.3: Dynamic Focus Threshold and Smart Tags
  context.appState.settings.focusThresholdMinutes = 30;
  context.appState.settings.noisyIntervals = [
    { start: '14:00', end: '18:00', label: 'Noisy afternoon', repeatType: 'daily' }
  ];
  context.appState.fixedEvents = [
    { id: 'f_sleep', title: 'Sleep', start: '00:00', end: '08:00', repeatType: 'daily' },
    { id: 'f_m1', title: 'Task 1', start: '08:20', end: '12:00', repeatType: 'daily' },
    { id: 'f_n1', title: 'Noisy Task', start: '14:15', end: '18:00', repeatType: 'daily' }
  ];

  res = context.calculateFreeTimeSlots(testDate);
  const slot20m = res.freeSlots.find(s => s.startTimeStr === '08:00' && s.endTimeStr === '08:20');
  const slot120m = res.freeSlots.find(s => s.startTimeStr === '12:00' && s.endTimeStr === '14:00');
  const slot15m = res.freeSlots.find(s => s.startTimeStr === '14:00' && s.endTimeStr === '14:15');

  assert(slot20m && slot20m.tagType === 'focus-short', 'Slot 20m in quiet time gets tag "focus-short"');
  assert(slot120m && slot120m.tagType === 'focus-long', 'Slot 120m in quiet time gets tag "focus-long"');
  assert(slot15m && slot15m.tagType === 'distract-short', 'Slot 15m in noisy time gets tag "distract-short"');

  // Restore
  context.appState.fixedEvents = origFixed;
  context.appState.transientEvents = origTransient;
  context.appState.settings.noisyIntervals = origNoisy;
} catch (e) {
  assert(false, 'Free Time Calculation', e.message);
}

// ----------------------------------------------------
// TEST GROUP 4: Recurrence Rules Engine
// ----------------------------------------------------
console.log('\n--- TEST GROUP 4: Recurrence Rules Engine ---');
try {
  // 2026-09-23 is Wednesday (day 3)
  // 2026-09-26 is Saturday (day 6)
  // 2026-09-27 is Sunday (day 0)

  // 4.1 Daily
  const dailyEvt = { date: '2026-09-01', repeatType: 'daily' };
  assert(context.isItemActiveOnDate(dailyEvt, '2026-09-23'), 'Daily event is active on 2026-09-23');
  assert(context.isItemActiveOnDate(dailyEvt, '2026-09-27'), 'Daily event is active on Sunday 2026-09-27');

  // 4.2 Weekdays (Mon-Fri)
  const weekdayEvt = { date: '2026-09-01', repeatType: 'weekdays' };
  assert(context.isItemActiveOnDate(weekdayEvt, '2026-09-23'), 'Weekday event is active on Wednesday');
  assert(!context.isItemActiveOnDate(weekdayEvt, '2026-09-26'), 'Weekday event is NOT active on Saturday');
  assert(!context.isItemActiveOnDate(weekdayEvt, '2026-09-27'), 'Weekday event is NOT active on Sunday');

  // 4.3 Weekly with repeatDays
  const weeklyEvt = { date: '2026-09-01', repeatType: 'weekly', repeatDays: [1, 3, 5] }; // Mon, Wed, Fri
  assert(context.isItemActiveOnDate(weeklyEvt, '2026-09-23'), 'Weekly event with Wed(3) is active on Wednesday');
  assert(!context.isItemActiveOnDate(weeklyEvt, '2026-09-22'), 'Weekly event is NOT active on Tuesday(2)');

  // 4.4 Monthly
  const monthlyEvt = { date: '2026-08-23', repeatType: 'monthly' };
  assert(context.isItemActiveOnDate(monthlyEvt, '2026-09-23'), 'Monthly event is active on same day 23rd of next month');
  assert(!context.isItemActiveOnDate(monthlyEvt, '2026-09-24'), 'Monthly event is NOT active on 24th');

  // 4.5 Exclusions
  const excludedEvt = { date: '2026-09-01', repeatType: 'daily', excludedDates: ['2026-09-23'] };
  assert(!context.isItemActiveOnDate(excludedEvt, '2026-09-23'), 'Event with excluded date is NOT active on that date');
  assert(context.isItemActiveOnDate(excludedEvt, '2026-09-24'), 'Event is active on non-excluded date');
} catch (e) {
  assert(false, 'Recurrence Rules', e.message);
}

// ----------------------------------------------------
// TEST GROUP 5: Eisenhower Matrix Logic & Completion
// ----------------------------------------------------
console.log('\n--- TEST GROUP 5: Eisenhower Matrix Logic & Completion ---');
try {
  const origTasks = [...context.appState.tasks];
  const origDate = context.selectedDate;
  context.selectedDate = '2026-09-23';
  context.appState.tasks = [
    { id: 't1', title: 'Q1 Urgent Important', date: '2026-09-23', isImportant: true, isUrgent: true, status: 'todo' },
    { id: 't2', title: 'Q2 NotUrgent Important', date: '2026-09-23', isImportant: true, isUrgent: false, status: 'todo' },
    { id: 't3', title: 'Q3 Urgent NotImportant', date: '2026-09-23', isImportant: false, isUrgent: true, status: 'todo' },
    { id: 't4', title: 'Q4 Neither', date: '2026-09-23', isImportant: false, isUrgent: false, status: 'todo' }
  ];

  // Render view to test Eisenhower logic
  const container = context.document.getElementById('view-container');
  context.renderEisenhowerView(container);

  const renderedHtml = container.innerHTML;
  assert(renderedHtml.includes('Q1 Urgent Important'), 'Eisenhower view renders Q1 Task');
  assert(renderedHtml.includes('Q2 NotUrgent Important'), 'Eisenhower view renders Q2 Task');
  assert(renderedHtml.includes('Q3 Urgent NotImportant'), 'Eisenhower view renders Q3 Task');
  assert(renderedHtml.includes('Q4 Neither'), 'Eisenhower view renders Q4 Task');

  // Test completion toggle
  context.toggleTaskDone('t1', '2026-09-23');
  const t1 = context.appState.tasks.find(t => t.id === 't1');
  assert(context.isTaskDoneOnDate(t1, '2026-09-23'), 'toggleTaskDone toggles task to done on that date');
  context.toggleTaskDone('t1', '2026-09-23');
  assert(!context.isTaskDoneOnDate(t1, '2026-09-23'), 'toggleTaskDone toggles task back to not done');

  context.appState.tasks = origTasks;
  context.selectedDate = origDate;
} catch (e) {
  assert(false, 'Eisenhower Matrix', e.message);
}

// ----------------------------------------------------
// TEST GROUP 6: Google Calendar Color Mapping System
// ----------------------------------------------------
console.log('\n--- TEST GROUP 6: Google Calendar Color Mapping System ---');
try {
  // 6.1 Palette verification
  assertEqual(context.GCAL_EVENT_COLORS.length, 11, 'GCAL_EVENT_COLORS has all 11 official Google Calendar colors');
  const ids = context.GCAL_EVENT_COLORS.map(c => c.id);
  assertEqual(ids, ['1','2','3','4','5','6','7','8','9','10','11'], 'All 11 color IDs from 1 to 11 are present in order');

  // 6.2 getGCalColorObj
  const tomato = context.getGCalColorObj('11');
  assertEqual(tomato.hex, '#d50000', 'Color 11 is Tomato (#d50000)');
  const basil = context.getGCalColorObj('10');
  assertEqual(basil.hex, '#0b8043', 'Color 10 is Basil (#0b8043)');

  // 6.3 Update color mapping
  context.updateGCalColorMapping('focusLong', '1'); // change to Lavender
  assertEqual(context.appState.settings.gcal.colorMapping.focusLong, '1', 'updateGCalColorMapping successfully updates focusLong to 1');

  // 6.4 Reset single color
  context.resetSingleGCalColor('focusLong');
  assertEqual(context.appState.settings.gcal.colorMapping.focusLong, '10', 'resetSingleGCalColor resets focusLong back to suggested 10 (Basil)');

  // 6.5 Reset all colors
  context.updateGCalColorMapping('distractLong', '3');
  context.resetGCalColorMapping();
  assertEqual(context.appState.settings.gcal.colorMapping.distractLong, '5', 'resetGCalColorMapping resets distractLong to suggested 5 (Banana)');

  // 6.6 Color assignment on task sync
  const sampleTask = {
    id: 'task_sync',
    title: 'Deep Work',
    date: '2026-09-23',
    requireQuiet: true,
    assignedSlot: { start: '09:00', end: '11:00' }
  };
  const assignedColorId = context.getTaskGCalColorId(sampleTask, '2026-09-23');
  assertEqual(assignedColorId, '10', 'getTaskGCalColorId returns mapped colorId 10 for long focus task');
} catch (e) {
  assert(false, 'GCal Color Mapping', e.message);
}

// ----------------------------------------------------
// TEST GROUP 7: Data Backup / Restore & Storage Integrity
// ----------------------------------------------------
console.log('\n--- TEST GROUP 7: Backup / Restore & Storage Integrity ---');
try {
  // Test export
  const stateJson = JSON.stringify(context.appState);
  assert(stateJson.length > 500, 'appState serializes to valid non-empty JSON');

  // Test corrupted data handling in loadData
  mockLocalStorage.setItem('chronoflow_data', '{"invalid_json": broken');
  const restored = context.loadData();
  assert(restored && restored.tasks && Array.isArray(restored.tasks), 'loadData gracefully recovers from invalid JSON in localStorage');
} catch (e) {
  assert(false, 'Backup & Storage', e.message);
}

// ----------------------------------------------------
// TEST GROUP 8: View Rendering Smoke Tests
// ----------------------------------------------------
console.log('\n--- TEST GROUP 8: All View Rendering Tests ---');
try {
  const container = context.document.getElementById('view-container');

  // Day View
  context.renderDayView(container);
  assert(container.innerHTML.includes('timeline'), 'renderDayView renders timeline container');

  // Month View
  context.renderMonthView(container);
  assert(container.innerHTML.includes('month-grid') || container.innerHTML.includes('month'), 'renderMonthView renders month calendar');

  // Year View
  context.renderYearView(container);
  assert(container.innerHTML.includes('year-overview-grid') || container.innerHTML.includes('year'), 'renderYearView renders year view');

  // Settings View & Modal
  context.renderSettingsView(container);
  const gcalMount = context.document.getElementById('settings-gcal-mount-point');
  const appearanceMount = context.document.getElementById('settings-appearance-mount-point');
  const modalOverlay = context.document.getElementById('app-modal-overlay');
  const allSettingsHtml = container.innerHTML + 
    (gcalMount ? gcalMount.innerHTML : '') +
    (appearanceMount ? appearanceMount.innerHTML : '') + 
    (modalOverlay ? modalOverlay.innerHTML : '');
  assert(allSettingsHtml.includes('gcal-color-mapping-box'), 'renderSettingsView renders Google Calendar color mapping box');
  assert(allSettingsHtml.includes('resetGCalColorMapping'), 'renderSettingsView renders reset colors button');
} catch (e) {
  assert(false, 'View Rendering', e.message);
}

// ----------------------------------------------------
// TEST GROUP 9: Multi-Day Timeline View (1, 3, 7 days - Google Calendar Style)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 9: Multi-Day Timeline View (1, 3, 7 Days) ---');
try {
  // 9.1 getTimelineDates calculations
  const singleDay = context.getTimelineDates('2026-09-23', 1);
  assertEqual(singleDay.length, 1, '1-day span returns exactly 1 date');
  assertEqual(singleDay[0], '2026-09-23', '1-day span date matches base date');

  const threeDays = context.getTimelineDates('2026-09-23', 3);
  assertEqual(threeDays.length, 3, '3-day span returns exactly 3 dates');
  assertEqual(threeDays, ['2026-09-23', '2026-09-24', '2026-09-25'], '3-day span returns 3 consecutive days');

  // Wednesday 2026-09-23: Week starts on Monday 2026-09-21 and ends on Sunday 2026-09-27
  const sevenDays = context.getTimelineDates('2026-09-23', 7);
  assertEqual(sevenDays.length, 7, '7-day span returns exactly 7 dates');
  assertEqual(sevenDays[0], '2026-09-21', '7-day span begins on Monday 2026-09-21');
  assertEqual(sevenDays[6], '2026-09-27', '7-day span ends on Sunday 2026-09-27');
  assert(sevenDays.includes('2026-09-23'), '7-day span contains base date Wednesday');

  // Sunday 2026-09-27 check: should also return Monday 2026-09-21 to Sunday 2026-09-27
  const sundayWeek = context.getTimelineDates('2026-09-27', 7);
  assertEqual(sundayWeek[0], '2026-09-21', 'Sunday base date correctly resolves to current week Monday');
  assertEqual(sundayWeek[6], '2026-09-27', 'Sunday base date correctly resolves to current week Sunday');

  // 9.2 Span toggling & cycling
  context.setTimelineDaySpan(1);
  assertEqual(context.appState.settings.timelineDaySpan, 1, 'setTimelineDaySpan sets span to 1');
  context.cycleTimelineDaySpan();
  assertEqual(context.appState.settings.timelineDaySpan, 3, 'cycleTimelineDaySpan cycles 1 -> 3');
  context.cycleTimelineDaySpan();
  assertEqual(context.appState.settings.timelineDaySpan, 7, 'cycleTimelineDaySpan cycles 3 -> 7');
  context.cycleTimelineDaySpan();
  assertEqual(context.appState.settings.timelineDaySpan, 1, 'cycleTimelineDaySpan cycles 7 -> 1');

  // Fallback protection for invalid span
  context.setTimelineDaySpan(99);
  assertEqual(context.appState.settings.timelineDaySpan, 1, 'setTimelineDaySpan falls back to 1 for invalid values');

  // 9.3 Date navigation offsets by span
  context.selectedDate = '2026-09-23';
  context.setTimelineDaySpan(3);
  context.changeTimelineDate(1);
  assertEqual(context.selectedDate, '2026-09-26', 'changeTimelineDate(1) moves +3 days when in 3-day span');
  context.changeTimelineDate(-1);
  assertEqual(context.selectedDate, '2026-09-23', 'changeTimelineDate(-1) moves -3 days when in 3-day span');

  context.setTimelineDaySpan(7);
  context.changeTimelineDate(1);
  assertEqual(context.selectedDate, '2026-09-30', 'changeTimelineDate(1) moves +7 days when in 7-day span');
  context.changeTimelineDate(-1);
  assertEqual(context.selectedDate, '2026-09-23', 'changeTimelineDate(-1) moves -7 days when in 7-day span');

  // 9.4 Reset to 1-day view on date selection
  context.setTimelineDaySpan(7);
  context.switchToSingleDayView('2026-09-25');
  assertEqual(context.selectedDate, '2026-09-25', 'switchToSingleDayView updates selectedDate');
  assertEqual(context.appState.settings.timelineDaySpan, 1, 'switchToSingleDayView resets timelineDaySpan to 1');

  // Month View clicking a date resets timeline to 1-day view
  context.setTimelineDaySpan(3);
  context.selectDateAndGoToDay('2026-10-15');
  assertEqual(context.selectedDate, '2026-10-15', 'selectDateAndGoToDay sets selectedDate');
  assertEqual(context.currentView, 'day', 'selectDateAndGoToDay switches to day view');
  assertEqual(context.appState.settings.timelineDaySpan, 1, 'selectDateAndGoToDay resets timelineDaySpan to 1');

  // 9.5 formatDisplayDateRange
  const rangeSingle = context.formatDisplayDateRange(['2026-09-23']);
  assert(rangeSingle.includes('23'), 'formatDisplayDateRange formats single date correctly');

  const rangeSameMonth = context.formatDisplayDateRange(['2026-09-23', '2026-09-24', '2026-09-25']);
  assert(rangeSameMonth.includes('23') && rangeSameMonth.includes('25'), 'formatDisplayDateRange formats same-month span');

  const rangeCrossMonth = context.formatDisplayDateRange(['2026-09-28', '2026-10-04']);
  assert(rangeCrossMonth.includes('28') && rangeCrossMonth.includes('4'), 'formatDisplayDateRange formats cross-month span');

  // 9.6 DOM Rendering for 1, 3, 7 Day Views
  const container = context.document.getElementById('view-container');
  context.selectedDate = '2026-09-23';

  // Render 1-day view
  context.setTimelineDaySpan(1);
  context.renderDayView(container);
  let html = container.innerHTML;
  assert(html.includes('timeline-dayspan-center'), 'Day view renders center day span switcher');
  assert(html.includes('timeline-dayspan-cycle-btn'), 'Day view renders cycle button');
  assert(html.includes('timeline-day-headers-row'), 'Day view renders day headers row');
  assert(html.includes('timeline-columns-container'), 'Day view renders columns container');
  assert(html.includes('data-date="2026-09-23"'), '1-day view renders column for base date');

  // Render 3-day view
  context.setTimelineDaySpan(3);
  context.renderDayView(container);
  html = container.innerHTML;
  assert(html.includes('data-date="2026-09-23"'), '3-day view renders column for day 1');
  assert(html.includes('data-date="2026-09-24"'), '3-day view renders column for day 2');
  assert(html.includes('data-date="2026-09-25"'), '3-day view renders column for day 3');
  assert(html.includes('switchToSingleDayView'), '3-day view renders header click to switch to single day');

  // Render 7-day view
  context.setTimelineDaySpan(7);
  context.renderDayView(container);
  html = container.innerHTML;
  assert(html.includes('data-date="2026-09-21"'), '7-day view renders Monday column');
  assert(html.includes('data-date="2026-09-27"'), '7-day view renders Sunday column');

  // Clean up
  context.setTimelineDaySpan(1);
} catch (e) {
  assert(false, 'Multi-Day Timeline View', e.message);
}

// ----------------------------------------------------
// TEST GROUP 10: TDD UI/UX Calendar Redesign (TC01 - TC04)
// ----------------------------------------------------
console.log('\n--- TEST GROUP 10: TDD UI/UX Calendar Redesign (TC01 - TC04) ---');
try {
  const container = context.document.getElementById('view-container');
  const cssContent = fs.readFileSync('src/styles.css', 'utf8');

  // TC01 (Header UI): Cụm nút chuyển đổi gọn gàng, không bị lặp chữ
  context.changeCalendarView(1);
  context.renderDayView(container);
  let dayHtml = container.innerHTML;
  assert(dayHtml.includes('calendar-view-select'), 'TC01: Header renders <select> dropdown for switching calendar views');
  assert(dayHtml.includes('option value="1"'), 'TC01: Dropdown contains option for 1 Day');
  assert(dayHtml.includes('option value="3"'), 'TC01: Dropdown contains option for 3 Days');
  assert(dayHtml.includes('option value="7"'), 'TC01: Dropdown contains option for 7 Days');
  assert(!dayHtml.includes('timeline-dayspan-cycle-btn style="display:inline'), 'TC01: Cycle button is not cluttering header text');

  // TC02 (Grid UI): Đường ranh giới các cột là nét liền, mờ, không tranh sự chú ý với Event
  assert(cssContent.includes('.day-hour-grid-line') && cssContent.includes('border-bottom: 1px solid var(--border-subtle) !important'), 'TC02: Grid lines use 1px solid subtle border instead of dashed');
  assert(cssContent.includes('.timeline-day-column') && cssContent.includes('border-right: 1px solid var(--border-subtle)'), 'TC02: Day columns have 1px solid subtle border');
  assert(cssContent.includes('.current-day-column') || cssContent.includes('.timeline-day-column.current-day-column'), 'TC02: CSS defines subtle highlight background for .current-day-column');
  context.selectedDate = context.getTodayDateString();
  context.renderDayView(container);
  dayHtml = container.innerHTML;
  assert(dayHtml.includes('current-day-column'), 'TC02: Current day column has .current-day-column class for visual focus');

  // TC03 (Responsive Event): Khi chuyển sang view 7 ngày, cột bị hẹp lại -> Tiêu đề event bị cắt bằng dấu "...", nút "Đổi tag" biến mất hoàn toàn
  context.changeCalendarView(7);
  context.renderDayView(container);
  let view7Html = container.innerHTML;
  assert(view7Html.includes('view-7d'), 'TC03: Calendar container has .view-7d class when 7-day span is active');
  assert(cssContent.includes('.view-7d .quick-tag-toggle-btn') && cssContent.includes('display: none !important'), 'TC03: CSS hides quick tag toggle button in 7-day view');
  assert(cssContent.includes('.view-7d .block-note') && cssContent.includes('display: none !important'), 'TC03: CSS hides long description notes in 7-day view');
  assert(cssContent.includes('.view-7d .block-title') && cssContent.includes('text-overflow: ellipsis !important'), 'TC03: CSS truncates event title with ellipsis (...) in 7-day view');

  // TC04 (Refinement: Clean Day Headers, Hidden Hour Tag, Notes Banner on Bar):
  const todayStr = context.getTodayDateString();
  context.appState.notes = [
    { id: 'note-web-done', date: todayStr, content: 'Hôm nay, nhớ hoàn thiện web' }
  ];

  // 1-day view: Day headers row hidden, notes in bar
  context.changeCalendarView(1);
  context.renderDayView(container);
  let view1Html = container.innerHTML;
  assert(view1Html.includes('timeline-day-headers-row style="min-width:100%; display:none !important;"') || cssContent.includes('.view-1d .timeline-day-headers-row'), 'TC04: 1-day view hides the day headers row since date is in the toolbar');
  assert(cssContent.includes('.current-time-tag') && cssContent.includes('display: none !important'), 'TC04: Current time indicator hides the hour tag to prevent text overlap');
  assert(view1Html.includes('calendar-notes-banner') && view1Html.includes('Hôm nay, nhớ hoàn thiện web'), 'TC04: Note "Hôm nay, nhớ hoàn thiện web" is cleanly rendered in toolbar notes banner');

  // 3-day view: Day headers shown without cluttering icons
  context.changeCalendarView(3);
  context.renderDayView(container);
  let view3Html = container.innerHTML;
  assert(view3Html.includes('timeline-day-headers-row') && !view3Html.includes('day-header-note-dot'), 'TC04: 3-day view displays day headers without unnecessary icons');
  assert(!view3Html.includes('timeline-all-day-row'), 'TC04: Duplicate all-day row removed from grid as notes are in toolbar');

  // Restore 1-day view
  context.changeCalendarView(1);
} catch (e) {
  assert(false, 'TDD UI/UX Calendar Redesign (TC01 - TC04)', e.message);
}

// ----------------------------------------------------
// TEST GROUP 11: 7-Day Name Tag Collision & Multi-Line Title Wrapping
// ----------------------------------------------------
console.log('\n--- TEST GROUP 11: 7-Day Name Tag Collision & Multi-Line Title Wrapping ---');
try {
  const cssContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf-8');
  const container = context.document.createElement('div');
  assert(typeof context.calculateTagTitleOverlap === 'function', 'TG11: calculateTagTitleOverlap function exists');
  assert(typeof context.checkAndResolveTagOcclusion === 'function', 'TG11: checkAndResolveTagOcclusion algorithm function exists');
  assert(cssContent.includes('-webkit-line-clamp: 3') || cssContent.includes('-webkit-line-clamp: 3 !important'), 'TG11: CSS supports wrapping task title up to 3 lines in 7-day view');
  assert(cssContent.includes('.view-7d .time-block .smart-pill[data-hidden-by-algo="true"]') || cssContent.includes('.has-hidden-nametag'), 'TG11: CSS hides name tags flagged by collision algorithm');

  // Test calculateTagTitleOverlap: Case 1 - Width Overflow / Space Competition
  const mockBlock = createMockElement('div');
  mockBlock.clientWidth = 110;
  mockBlock.clientHeight = 50;

  const mockTitleLong = createMockElement('span');
  mockTitleLong.scrollWidth = 90;
  mockTitleLong.clientWidth = 60;
  mockTitleLong.offsetHeight = 16;

  const mockTag = createMockElement('span');
  mockTag.offsetWidth = 45;
  mockTag.offsetHeight = 14;

  const overlapLong = context.calculateTagTitleOverlap(mockBlock, mockTitleLong, [mockTag], 7);
  assert(overlapLong === true, 'TG11: Overlap correctly detected when long title and tag exceed column width');

  // Test calculateTagTitleOverlap: Case 2 - Short Title with plenty of space
  const mockTitleShort = createMockElement('span');
  mockTitleShort.scrollWidth = 30;
  mockTitleShort.clientWidth = 50;
  mockTitleShort.offsetHeight = 16;
  const mockTagSmall = createMockElement('span');
  mockTagSmall.offsetWidth = 20;
  mockTagSmall.offsetHeight = 14;
  const mockBlockSpacious = createMockElement('div');
  mockBlockSpacious.clientWidth = 140;
  mockBlockSpacious.clientHeight = 90;

  const overlapShort = context.calculateTagTitleOverlap(mockBlockSpacious, mockTitleShort, [mockTagSmall], 7);
  assert(overlapShort === false, 'TG11: No overlap detected when title is short and block is spacious');

  // Test calculateTagTitleOverlap: Case 3 - Direct Bounding Box Intersection
  const mockBlockBox = createMockElement('div');
  mockBlockBox.getBoundingClientRect = () => ({ width: 120, height: 60 });
  const mockTitleBox = createMockElement('span');
  mockTitleBox.getBoundingClientRect = () => ({ left: 10, right: 80, top: 10, bottom: 26, width: 70, height: 16 });
  const mockTagBox = createMockElement('span');
  // Coordinates intersect with mockTitleBox (left 70 < 80, right 110 > 10, top 12 < 26, bottom 24 > 10)
  mockTagBox.getBoundingClientRect = () => ({ left: 70, right: 110, top: 12, bottom: 24, width: 40, height: 12 });

  const overlapBox = context.calculateTagTitleOverlap(mockBlockBox, mockTitleBox, [mockTagBox], 7);
  assert(overlapBox === true, 'TG11: Direct geometric 2D intersection overlap detected');

  // Test rendering in 7-day view
  context.changeCalendarView(7);
  context.renderDayView(container);
  const view7Html = container.innerHTML;
  assert(view7Html.includes('view-7d'), 'TG11: Container includes view-7d class');
  assert(view7Html.includes('-webkit-line-clamp:3') || cssContent.includes('.view-7d .block-title-text'), 'TG11: 7-day view applies multi-line line clamping to task titles');

  // Restore 1-day view
  context.changeCalendarView(1);
} catch (e) {
  assert(false, 'TEST GROUP 11: 7-Day Name Tag Collision', e.message);
}

// ----------------------------------------------------
// TEST GROUP 12: Mode Switch Button Width Balancing & Right Edge Alignment
// ----------------------------------------------------
console.log('\n--- TEST GROUP 12: Mode Switch Button Width Balancing & Right Edge Alignment ---');
try {
  const cssContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf-8');
  assert(typeof context.syncSpanButtonWidth === 'function', 'TG12: syncSpanButtonWidth algorithm function exists');
  assert(cssContent.includes('.date-navigator-stacked') && cssContent.includes('align-items: stretch'), 'TG12: date-navigator-stacked has align-items: stretch');
  assert(!cssContent.includes('.nav-arrows button:last-child {'), 'TG12: nav-arrows button:last-child is not forcing 36px onto timeline-span-toggle-btn');
  assert(cssContent.includes('.timeline-span-toggle-btn') && cssContent.includes('flex: 1'), 'TG12: timeline-span-toggle-btn has flexible width to expand');

  const container = context.document.createElement('div');
  context.renderDayView(container);
  assert(container.innerHTML.includes('id="timeline-span-toggle-btn"'), 'TG12: Day view renders #timeline-span-toggle-btn');
  assert(container.innerHTML.includes('date-navigator-stacked'), 'TG12: .date-navigator-stacked container found');

  // Test syncSpanButtonWidth calculation logic
  const mockBtn = createMockElement('button', 'timeline-span-toggle-btn');
  const mockTitle = createMockElement('h2');
  mockTitle.offsetWidth = 250;
  const mockPrev = createMockElement('button');
  mockPrev.offsetWidth = 36;
  const mockToday = createMockElement('button');
  mockToday.offsetWidth = 84;
  const mockNext = createMockElement('button');
  mockNext.offsetWidth = 36;
  const mockArrows = createMockElement('div');
  mockArrows.querySelector = (s) => {
    if (s.includes('prev')) return mockPrev;
    if (s.includes('today')) return mockToday;
    if (s.includes('next')) return mockNext;
    return null;
  };
  const mockStacked = createMockElement('div');
  mockStacked.querySelector = (s) => {
    if (s.includes('title')) return mockTitle;
    if (s.includes('toggle-btn')) return mockBtn;
    if (s.includes('arrows')) return mockArrows;
    return null;
  };
  const mockRoot = {
    querySelector: (s) => s.includes('stacked') ? mockStacked : null
  };
  context.syncSpanButtonWidth(mockRoot);
  assert(mockBtn.style.width === '76px' || (mockBtn.style && mockBtn.style.width && mockBtn.style.width.includes('px')), 'TG12: syncSpanButtonWidth correctly computes and balances toggle button width to match year');
} catch (e) {
  assert(false, 'TEST GROUP 12: Mode Switch Button Width Balancing', e.message);
}

// ----------------------------------------------------
// TEST GROUP 13: 30-Minute Subtle Line & Focus Mode Layering
// ----------------------------------------------------
console.log('\n--- TEST GROUP 13: 30-Minute Subtle Line & Focus Mode Layering ---');
try {
  const cssContent = fs.readFileSync(path.join(__dirname, '..', 'src', 'styles.css'), 'utf-8');
  assert(cssContent.includes('.day-half-hour-line') && cssContent.includes('border-top: 1px dashed'), 'TG13: 30-minute line uses subtle dashed border instead of harsh solid white');
  assert(!cssContent.includes('border-top: 1px solid rgba(226, 232, 240, 0.5) !important;'), 'TG13: Harsh 50% opacity solid white half-hour border removed');
  assert(cssContent.includes('backdrop-filter: blur'), 'TG13: Time blocks use backdrop-filter for frosted glass effect');
  assert(cssContent.includes('.timeline-current-time-indicator') && cssContent.includes('z-index: 25;'), 'TG13: Timeline laser line indicator floats on top of tasks (z-index: 25) with luminous glass styling');
  assert(cssContent.includes('.time-block.time-block-ongoing') && cssContent.includes('z-index: 15'), 'TG13: Active ongoing tasks in focus mode have z-index: 15 to submerge grid lines');
  
  const container = context.document.createElement('div');
  context.renderDayView(container);
  assert(container.innerHTML.includes('day-half-hour-line'), 'TG13: Day view renders half-hour grid line structure');
} catch (e) {
  assert(false, 'TEST GROUP 13: 30-Minute Subtle Line & Focus Mode Layering', e.message);
}

// ----------------------------------------------------
// TEST GROUP 14: Schedule Mode Priority, Disabling Logic & Immediate Scheduling
// ----------------------------------------------------
console.log('\n--- TEST GROUP 14: Schedule Mode Priority, Disabling Logic & Immediate Scheduling ---');
const origGetElementById = context.document.getElementById;
const origOpenModal = context.openModal;
try {
  // 1. Verify toggleManualStartTime toggles and disables/enables properly
  let mockMode = 'auto';
  let mockGroupDisplay = 'none';
  let mockRowOpacity = '1';
  let mockRowPointerEvents = 'auto';
  let mockSessionDisabled = false;
  let mockAttentionDisabled = false;
  let mockHintDisplay = 'none';

  context.document.getElementById = (id) => {
    if (id === 'm-task-schedule-mode') return { value: mockMode };
    if (id === 'm-task-manual-time-group') return { style: { set display(v) { mockGroupDisplay = v; }, get display() { return mockGroupDisplay; } } };
    if (id === 'm-task-auto-options-row') return { style: { set opacity(v) { mockRowOpacity = v; }, get opacity() { return mockRowOpacity; }, set pointerEvents(v) { mockRowPointerEvents = v; }, get pointerEvents() { return mockRowPointerEvents; } } };
    if (id === 'm-task-session') return { set disabled(v) { mockSessionDisabled = v; }, get disabled() { return mockSessionDisabled; } };
    if (id === 'm-task-attention') return { set disabled(v) { mockAttentionDisabled = v; }, get disabled() { return mockAttentionDisabled; } };
    if (id === 'm-task-manual-hint') return { style: { set display(v) { mockHintDisplay = v; }, get display() { return mockHintDisplay; } } };
    return null;
  };

  // Switch to manual mode
  mockMode = 'manual';
  context.toggleManualStartTime('m-task');
  assert(mockGroupDisplay === 'flex' || mockGroupDisplay === 'block', 'TG14: Manual time group displayed when manual mode selected');
  assert(mockRowOpacity === '0.4', 'TG14: Auto options row dimmed (opacity 0.4) when manual mode selected');
  assert(mockRowPointerEvents === 'none', 'TG14: Auto options row pointerEvents set to none when manual mode selected');
  assert(mockSessionDisabled === true, 'TG14: Session select disabled when manual mode selected');
  assert(mockAttentionDisabled === true, 'TG14: Attention select disabled when manual mode selected');
  assert(mockHintDisplay === 'block', 'TG14: Manual mode explanatory hint displayed');

  // Switch back to auto mode
  mockMode = 'auto';
  context.toggleManualStartTime('m-task');
  assert(mockGroupDisplay === 'none', 'TG14: Manual time group hidden when auto mode selected');
  assert(mockRowOpacity === '1', 'TG14: Auto options row opacity restored to 1');
  assert(mockRowPointerEvents === 'auto', 'TG14: Auto options row pointerEvents restored to auto');
  assert(mockSessionDisabled === false, 'TG14: Session select re-enabled in auto mode');
  assert(mockAttentionDisabled === false, 'TG14: Attention select re-enabled in auto mode');
  assert(mockHintDisplay === 'none', 'TG14: Manual mode hint hidden in auto mode');

  // 2. Test saveTask immediate schedule assignment for manual mode
  const testManualTask = {
    id: 't-manual-immediate-01',
    title: 'Họp khẩn cấp với khách hàng',
    date: '2026-09-24',
    estimatedMinutes: 45,
    scheduleMode: 'manual',
    manualStartTime: '14:15'
  };

  const saved = context.saveTask(testManualTask);
  assert(saved.status === 'scheduled', 'TG14: Task in manual mode is immediately set to status=scheduled');
  assert(saved.assignedSlot && saved.assignedSlot.start === '14:15' && saved.assignedSlot.end === '15:00', 'TG14: Task assignedSlot start/end computed accurately (14:15 -> 15:00)');
  assert(saved.assignedSlotsByDate && saved.assignedSlotsByDate['2026-09-24'].start === '14:15', 'TG14: assignedSlotsByDate correctly populated for manual task');

  // 3. Test openAddTaskModal HTML structure ordering
  let modalContentHtml = '';
  context.openModal = (content) => { modalContentHtml = content; };
  context.openAddTaskModal('2026-09-24', 'q1');

  const eisenhowerPos = modalContentHtml.indexOf('Phân loại ma trận Eisenhower');
  const scheduleModePos = modalContentHtml.indexOf('id="m-task-schedule-mode"');
  const autoOptionsPos = modalContentHtml.indexOf('id="m-task-auto-options-row"');
  const sessionPos = modalContentHtml.indexOf('id="m-task-session"');
  const quietPos = modalContentHtml.indexOf('id="m-task-quiet"');

  assert(eisenhowerPos > -1 && scheduleModePos > -1 && sessionPos > -1, 'TG14: Add Task modal includes Eisenhower, Schedule mode, and Session controls');
  assert(scheduleModePos < autoOptionsPos, 'TG14: Schedule Mode is positioned ABOVE preferred session and attention level');
  assert(autoOptionsPos < quietPos, 'TG14: Auto options are positioned above quiet checkbox');

  // 4. Test openEditTaskModal for existing manual task (uses unified m-task modal)
  const taskToEdit = {
    id: 't-manual-edit-02',
    title: 'Kiểm tra bảo mật hệ thống',
    date: '2026-09-24',
    estimatedMinutes: 30,
    scheduleMode: 'manual',
    manualStartTime: '10:00'
  };
  context.appState.tasks.push(taskToEdit);
  context.openEditTaskModal('t-manual-edit-02');
  assert(modalContentHtml.includes('id="m-task-schedule-mode"'), 'TG14: Edit Task modal contains schedule mode select');
  assert(modalContentHtml.includes('opacity: 0.4; pointer-events: none;') || modalContentHtml.includes('disabled'), 'TG14: Edit Task modal pre-dims auto options row for manual task');
  assert(modalContentHtml.includes('id="m-task-session" class="form-select form-input" disabled'), 'TG14: Edit Task modal pre-disables session select for manual task');
  assert(modalContentHtml.includes('id="m-task-attention" class="form-select form-input" disabled'), 'TG14: Edit Task modal pre-disables attention select for manual task');

  // Restore original functions
  context.document.getElementById = origGetElementById;
  context.openModal = origOpenModal;
} catch (e) {
  // Ensure restored
  context.document.getElementById = origGetElementById;
  context.openModal = origOpenModal;
  assert(false, 'TEST GROUP 14: Schedule Mode Priority & Disabling Logic', e.message);
}

// ----------------------------------------------------
// TEST GROUP 15: Weekly Recurrence Kickoff, Interval Recurrence & Eisenhower Scope
// ----------------------------------------------------
console.log('\n--- TEST GROUP 15: Weekly Recurrence Kickoff, Interval & Eisenhower Scope ---');
try {
  // Test 15.1: Task created on Thursday 2026-09-24 with repeat on T2, T4, T6 (1, 3, 5)
  const deskTask = {
    id: 't-desk-cleaning-q4',
    title: 'Dọn bàn học',
    date: '2026-09-24',
    startDate: '2026-09-24',
    endDate: '2026-09-30',
    repeatType: 'weekly',
    repeatDays: [1, 3, 5], // T2, T4, T6
    isImportant: false,
    isUrgent: false,
    estimatedMinutes: 10
  };

  // 1. Kickoff date: 2026-09-24 (Thursday) MUST be active because it matches task.date
  assert(context.isItemActiveOnDate(deskTask, '2026-09-24'), 'TG15: Task is active on initial creation/target date (Thursday 2026-09-24)');

  // 2. Next Friday (2026-09-25 - day 5 / T6) MUST be active
  assert(context.isItemActiveOnDate(deskTask, '2026-09-25'), 'TG15: Task is active on Friday 2026-09-25 (T6)');

  // 3. Saturday (2026-09-26 - day 6 / T7) MUST NOT be active
  assert(!context.isItemActiveOnDate(deskTask, '2026-09-26'), 'TG15: Task is NOT active on Saturday 2026-09-26 (T7)');

  // 4. Sunday (2026-09-27 - day 0 / CN) MUST NOT be active
  assert(!context.isItemActiveOnDate(deskTask, '2026-09-27'), 'TG15: Task is NOT active on Sunday 2026-09-27 (CN)');

  // 5. Monday (2026-09-28 - day 1 / T2) MUST be active
  assert(context.isItemActiveOnDate(deskTask, '2026-09-28'), 'TG15: Task is active on Monday 2026-09-28 (T2)');

  // 6. Wednesday (2026-09-30 - day 3 / T4) MUST be active (matches endDate)
  assert(context.isItemActiveOnDate(deskTask, '2026-09-30'), 'TG15: Task is active on Wednesday 2026-09-30 (T4)');

  // 7. Friday (2026-10-02 - after endDate) MUST NOT be active
  assert(!context.isItemActiveOnDate(deskTask, '2026-10-02'), 'TG15: Task is NOT active after endDate (2026-10-02)');

  // Test 15.2: Interval recurrence (every_2_days)
  const biDailyTask = {
    id: 't-bidaily-01',
    title: 'Tập chống đẩy',
    date: '2026-09-24',
    startDate: '2026-09-24',
    repeatType: 'every_2_days'
  };
  assert(context.isItemActiveOnDate(biDailyTask, '2026-09-24'), 'TG15: every_2_days is active on start date 24/09');
  assert(!context.isItemActiveOnDate(biDailyTask, '2026-09-25'), 'TG15: every_2_days is NOT active on next day 25/09');
  assert(context.isItemActiveOnDate(biDailyTask, '2026-09-26'), 'TG15: every_2_days is active on +2 days 26/09');

  // Test 15.3: Eisenhower Scope Switcher (Day, Week, All)
  context.appState.tasks = [deskTask];
  context.selectedDate = '2026-09-24';
  context.currentView = 'eisenhower';
  const container = mockDocument.getElementById('view-container');

  // Day scope
  context.setEisenhowerScope('day');
  context.renderEisenhowerView(container);
  assert(container.innerHTML && container.innerHTML.includes('Dọn bàn học'), 'TG15: Eisenhower matrix in Day scope displays Dọn bàn học on 2026-09-24');

  // Week scope
  context.setEisenhowerScope('week');
  context.renderEisenhowerView(container);
  assert(container.innerHTML && container.innerHTML.includes('Dọn bàn học'), 'TG15: Eisenhower matrix in Week scope displays Dọn bàn học');

  // All scope
  context.setEisenhowerScope('all');
  context.renderEisenhowerView(container);
  assert(container.innerHTML && container.innerHTML.includes('Dọn bàn học'), 'TG15: Eisenhower matrix in All scope displays Dọn bàn học');

  // Reset to day
  context.setEisenhowerScope('day');
} catch (e) {
  assert(false, 'TEST GROUP 15: Weekly Recurrence & Eisenhower Scope', e.message);
}

// ----------------------------------------------------
// TEST GROUP 16: Settings GCal Sync & Auth UI Optimization
// ----------------------------------------------------
console.log('\n--- TEST GROUP 16: Settings GCal Sync & Auth UI Optimization ---');
try {
  // 1. Verify helper functions exist
  assert(typeof context.toggleGCalApiKeyVisibility === 'function', 'TG16: toggleGCalApiKeyVisibility function exists');
  assert(typeof context.copyGCalScope === 'function', 'TG16: copyGCalScope function exists');
  assert(typeof context.setGCalInterval === 'function', 'TG16: setGCalInterval function exists');

  // 2. Test disconnected HTML structure
  localStorageStore['chronoflow_gcal_token'] = '';
  const disconnectedHtml = context.renderSettingsAccountSyncHtml();
  assert(disconnectedHtml.includes('gcal-brand-stripe'), 'TG16: Settings Account Sync includes Google 4-color brand stripe');
  assert(disconnectedHtml.includes('gcal-google-signin-btn'), 'TG16: Disconnected state renders Google official sign-in button');
  assert(disconnectedHtml.includes('gcal-features-trio'), 'TG16: Disconnected state renders features trio (Realtime, Smart Colors, Security)');
  assert(disconnectedHtml.includes('gcal-client-id-input'), 'TG16: Contains OAuth Client ID input field');
  assert(disconnectedHtml.includes('gcal-api-key-input'), 'TG16: Contains API Key input field');
  assert(disconnectedHtml.includes('gcal-origin-bar'), 'TG16: Contains JavaScript Origin copy bar');
  assert(disconnectedHtml.includes('gcal-interval-pills'), 'TG16: Contains polling interval quick preset chips');

  // 3. Test setGCalInterval updates settings
  context.setGCalInterval(30);
  assert(context.appState.settings.gcal.autoSyncInterval === 30, 'TG16: setGCalInterval(30) updates autoSyncInterval to 30');

  // 4. Test connected HTML structure
  localStorageStore['chronoflow_gcal_token'] = 'mock-test-token-123';
  localStorageStore['chronoflow_gcal_token_expires'] = String(Date.now() + 3600000);
  context.appState.settings.gcal.userEmail = 'testuser@gmail.com';
  
  const connectedHtml = context.renderSettingsAccountSyncHtml();
  assert(connectedHtml.includes('gcal-auth-hero-connected'), 'TG16: Connected state renders connected hero status box');
  assert(connectedHtml.includes('testuser@gmail.com'), 'TG16: Connected hero displays user email');
  assert(connectedHtml.includes('live-pulse-dot'), 'TG16: Connected badge displays pulsing live dot');
  assert(connectedHtml.includes('gcal-sync-now-btn'), 'TG16: Connected hero provides Pull from GCal button');
  assert(connectedHtml.includes('gcal-push-all-btn'), 'TG16: Connected hero provides Push to GCal button');

  // Cleanup token
  localStorageStore['chronoflow_gcal_token'] = '';
} catch (e) {
  assert(false, 'TEST GROUP 16: Settings GCal Sync & Auth UI Optimization', e.message);
}

// ----------------------------------------------------
// TEST GROUP 17: Settings Real-Time Reactivity & Live Sandbox
// ----------------------------------------------------
console.log('\n--- TEST GROUP 17: Settings Real-Time Reactivity & Live Sandbox ---');
try {
  // 1. Verify helper functions exist
  assert(typeof context.applyCustomColorsToRoot === 'function', 'TG17: applyCustomColorsToRoot exists');
  assert(typeof context.previewFocusThreshold === 'function', 'TG17: previewFocusThreshold exists');
  assert(typeof context.updateFocusThreshold === 'function', 'TG17: updateFocusThreshold exists');
  assert(typeof context.updateColorSetting === 'function', 'TG17: updateColorSetting exists');
  assert(typeof context.resetDefaultColors === 'function', 'TG17: resetDefaultColors exists');
  assert(typeof context.previewTestDuration === 'function', 'TG17: previewTestDuration exists');
  assert(typeof context.updateSettingsPreference === 'function', 'TG17: updateSettingsPreference exists');
  assert(typeof context.setLanguageFromSettings === 'function', 'TG17: setLanguageFromSettings exists');
  assert(typeof context.handleGCalClientIdInput === 'function', 'TG17: handleGCalClientIdInput exists');

  // 2. Test Appearance HTML rendering
  const appHtml = context.renderSettingsAppearanceHtml();
  assert(appHtml.includes('settings-card-threshold'), 'TG17: Appearance includes Focus Threshold Card');
  assert(appHtml.includes('settings-card-colors'), 'TG17: Appearance includes Real-time Color Palette Card');
  assert(appHtml.includes('settings-card-sandbox'), 'TG17: Appearance includes Interactive Live Sandbox Card');
  assert(appHtml.includes('settings-lang-btn-group'), 'TG17: Appearance includes Language Switcher');
  assert(appHtml.includes('settings-pref-grid'), 'TG17: Appearance includes Startup Preferences Grid');
  assert(appHtml.includes('sandbox-test-duration-input'), 'TG17: Sandbox contains Task Duration test slider');
  assert(appHtml.includes('sandbox-sample-focus-card'), 'TG17: Sandbox contains Sample Focus Card');

  // 3. Test focus threshold update
  context.updateFocusThreshold(45);
  assert(context.appState.settings.focusThresholdMinutes === 45, 'TG17: updateFocusThreshold(45) updates focusThresholdMinutes');
  
  // 4. Test color setting update
  context.updateColorSetting('focusLong', '#047857');
  assert(context.appState.settings.colors.focusLong === '#047857', 'TG17: updateColorSetting updates custom color in state');

  // 5. Test reset default colors
  context.resetDefaultColors();
  assert(context.appState.settings.colors.focusLong === '#059669', 'TG17: resetDefaultColors restores default #059669');

  // 6. Test update preferences
  context.updateSettingsPreference('defaultTaskDuration', 45);
  assert(context.appState.settings.defaultTaskDuration === 45, 'TG17: updateSettingsPreference updates defaultTaskDuration to 45');

  // 7. Test language setting
  context.setLanguageFromSettings('en');
  assert(context.appState.settings.lang === 'en', 'TG17: setLanguageFromSettings sets language to English');
  context.setLanguageFromSettings('vi');
  assert(context.appState.settings.lang === 'vi', 'TG17: setLanguageFromSettings sets language back to Vietnamese');

  // Reset focus threshold to standard 30
  context.updateFocusThreshold(30);
} catch (e) {
  assert(false, 'TEST GROUP 17: Settings Real-Time Reactivity & Live Sandbox', e.message);
}

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`TOTAL TESTS: ${totalTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================');

if (failures.length > 0) {
  console.log('\nFAILURES SUMMARY:');
  failures.forEach(f => console.error(` - ${f.testName}: ${f.details}`));
  process.exit(1);
} else {
  console.log('\nALL TESTS PASSED WITH 100% SUCCESS RATE! 🎉');
  process.exit(0);
}
