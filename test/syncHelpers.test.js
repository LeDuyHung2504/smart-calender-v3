import assert from 'node:assert';
import { describe, it } from 'vitest';

function getTaskQuadrant(task) {
  if (!task) return 'q4';
  const imp = Boolean(task.isImportant);
  const urg = Boolean(task.isUrgent);
  if (imp && urg) return 'q1';
  if (imp && !urg) return 'q2';
  if (!imp && urg) return 'q3';
  return 'q4';
}

function dateInSyncScope(dateKey, scope, anchorDate) {
  if (!dateKey) return false;
  const s = String(scope || 'day').toLowerCase();
  if (s === 'all') return true;
  const anchor = anchorDate || '2026-10-21';

  if (s === 'day') {
    return dateKey === anchor;
  }
  if (s === 'month') {
    return dateKey.substring(0, 7) === anchor.substring(0, 7);
  }
  if (s === 'week') {
    const parts = anchor.split('-').map(Number);
    if (parts.length < 3) return dateKey === anchor;
    const [y, m, d] = parts;
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay();
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(y, m - 1, d + diffToMonday);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    const ymd = (date) => {
      const yy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yy}-${mm}-${dd}`;
    };
    const startStr = ymd(monday);
    const endStr = ymd(sunday);
    return dateKey >= startStr && dateKey <= endStr;
  }
  return dateKey === anchor;
}

function shouldPushScheduledTask(task, dateKey, appStateMock) {
  if (!task || !dateKey) return false;
  const gcalSettings = (appStateMock && appStateMock.settings && appStateMock.settings.gcal) ? appStateMock.settings.gcal : {};
  const syncTypes = gcalSettings.syncTypes || {};

  if (syncTypes.tasksScheduled === false) return false;

  const quadrant = getTaskQuadrant(task);
  const scheduledQuads = gcalSettings.syncScheduledQuadrants || { q1: true, q2: true, q3: false, q4: false };
  if (scheduledQuads[quadrant] === false) return false;

  const syncScope = gcalSettings.syncTimeScope || 'day';
  const anchor = gcalSettings.syncAnchorDate || '2026-10-21';
  if (!dateInSyncScope(dateKey, syncScope, anchor)) return false;

  return true;
}

describe('ChronoFlow Sync Helpers (Unit Tests)', () => {
  it('1. getTaskQuadrant returns correct quadrant', () => {
    assert.strictEqual(getTaskQuadrant({ isImportant: true, isUrgent: true }), 'q1');
    assert.strictEqual(getTaskQuadrant({ isImportant: true, isUrgent: false }), 'q2');
    assert.strictEqual(getTaskQuadrant({ isImportant: false, isUrgent: true }), 'q3');
    assert.strictEqual(getTaskQuadrant({ isImportant: false, isUrgent: false }), 'q4');
    assert.strictEqual(getTaskQuadrant(null), 'q4');
  });

  it('2. dateInSyncScope handles scopes correctly', () => {
    assert.strictEqual(dateInSyncScope('2026-10-21', 'day', '2026-10-21'), true);
    assert.strictEqual(dateInSyncScope('2026-10-22', 'day', '2026-10-21'), false);
    assert.strictEqual(dateInSyncScope('2026-10-15', 'month', '2026-10-21'), true);
    assert.strictEqual(dateInSyncScope('2026-11-01', 'month', '2026-10-21'), false);
    assert.strictEqual(dateInSyncScope('2025-01-01', 'all', '2026-10-21'), true);
  });

  it('3. shouldPushScheduledTask respects syncTypes, quadrants, and time scope (including default fallback)', () => {
    const mockState = {
      settings: {
        gcal: {
          syncTypes: { tasksScheduled: true },
          syncScheduledQuadrants: { q1: true, q2: true, q3: false, q4: true },
          syncTimeScope: 'day',
          syncAnchorDate: '2026-10-21'
        }
      }
    };

    const q1Task = { isImportant: true, isUrgent: true };
    const q3Task = { isImportant: false, isUrgent: true };
    const q4Task = { isImportant: false, isUrgent: false };

    assert.strictEqual(shouldPushScheduledTask(q1Task, '2026-10-21', mockState), true);
    assert.strictEqual(shouldPushScheduledTask(q3Task, '2026-10-21', mockState), false); // q3 disabled
    assert.strictEqual(shouldPushScheduledTask(q1Task, '2026-10-25', mockState), false); // out of day scope

    // Default fallback when syncScheduledQuadrants is omitted: { q1: true, q2: true, q3: false, q4: false }
    const fallbackState = { settings: { gcal: { syncAnchorDate: '2026-10-21' } } };
    assert.strictEqual(shouldPushScheduledTask(q1Task, '2026-10-21', fallbackState), true);
    assert.strictEqual(shouldPushScheduledTask(q3Task, '2026-10-21', fallbackState), false);
    assert.strictEqual(shouldPushScheduledTask(q4Task, '2026-10-21', fallbackState), false);
  });
});

