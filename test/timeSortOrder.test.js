import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Event & Task Time Sort Order Feature', () => {
  let appCode = '';
  let sortItemsByTimeFn;
  let timeToMinutesFn;

  beforeAll(() => {
    const appJsPath = path.resolve(__dirname, '../src/app.js');
    appCode = fs.readFileSync(appJsPath, 'utf8');

    // Extract timeToMinutes and sortItemsByTime
    const sandbox = {
      selectedDate: '2026-10-09',
      appState: { settings: { timeSortOrder: 'asc' } },
      getTaskAssignedSlot: (task, date) => {
        if (!task) return null;
        if (task.assignedSlotsByDate && task.assignedSlotsByDate[date]) {
          return task.assignedSlotsByDate[date];
        }
        return task.assignedSlot || null;
      }
    };

    const fn = new Function('sandbox', `
      with (sandbox) {
        ${appCode.match(/function timeToMinutes\([\s\S]*?\n\}/)[0]}
        ${appCode.match(/function sortItemsByTime\([\s\S]*?\n\}/)[0]}
        return { timeToMinutes, sortItemsByTime };
      }
    `);

    const result = fn(sandbox);
    timeToMinutesFn = result.timeToMinutes;
    sortItemsByTimeFn = result.sortItemsByTime;
  });

  it('should sort scheduled tasks in ascending chronological order (earliest first)', () => {
    const tasks = [
      { id: '1', title: 'Task at 21:15', assignedSlot: { start: '21:15', end: '21:25' } },
      { id: '2', title: 'Task at 07:45', assignedSlot: { start: '07:45', end: '10:45' } },
      { id: '3', title: 'Task at 16:00', assignedSlot: { start: '16:00', end: '17:00' } },
      { id: '4', title: 'Task at 22:00', assignedSlot: { start: '22:00', end: '22:30' } }
    ];

    const sorted = sortItemsByTimeFn(tasks, '2026-10-09', 'asc');
    expect(sorted.map(t => t.id)).toEqual(['2', '3', '1', '4']);
    expect(sorted[0].assignedSlot.start).toBe('07:45');
    expect(sorted[1].assignedSlot.start).toBe('16:00');
    expect(sorted[2].assignedSlot.start).toBe('21:15');
    expect(sorted[3].assignedSlot.start).toBe('22:00');
  });

  it('should sort scheduled tasks in descending chronological order (latest first)', () => {
    const tasks = [
      { id: '1', title: 'Task at 21:15', assignedSlot: { start: '21:15', end: '21:25' } },
      { id: '2', title: 'Task at 07:45', assignedSlot: { start: '07:45', end: '10:45' } },
      { id: '3', title: 'Task at 16:00', assignedSlot: { start: '16:00', end: '17:00' } },
      { id: '4', title: 'Task at 22:00', assignedSlot: { start: '22:00', end: '22:30' } }
    ];

    const sorted = sortItemsByTimeFn(tasks, '2026-10-09', 'desc');
    expect(sorted.map(t => t.id)).toEqual(['4', '1', '3', '2']);
    expect(sorted[0].assignedSlot.start).toBe('22:00');
    expect(sorted[1].assignedSlot.start).toBe('21:15');
    expect(sorted[2].assignedSlot.start).toBe('16:00');
    expect(sorted[3].assignedSlot.start).toBe('07:45');
  });

  it('should preserve creation order for unscheduled tasks and place them after scheduled ones', () => {
    const tasks = [
      { id: 'un-1', title: 'Unscheduled First' },
      { id: 'sc-1', title: 'Task at 14:00', assignedSlot: { start: '14:00', end: '15:00' } },
      { id: 'un-2', title: 'Unscheduled Second' },
      { id: 'sc-2', title: 'Task at 09:00', assignedSlot: { start: '09:00', end: '10:00' } },
      { id: 'un-3', title: 'Unscheduled Third' }
    ];

    const sorted = sortItemsByTimeFn(tasks, '2026-10-09', 'asc');
    // Scheduled ones ordered by time: 09:00, then 14:00
    // Unscheduled ones preserved in original addition order: un-1, un-2, un-3
    expect(sorted.map(t => t.id)).toEqual(['sc-2', 'sc-1', 'un-1', 'un-2', 'un-3']);
  });

  it('should correctly sort fixed and transient events with start and end times', () => {
    const events = [
      { id: 'ev-1', title: 'Meeting', start: '18:00', end: '19:00' },
      { id: 'ev-2', title: 'Breakfast', start: '08:00', end: '08:30' },
      { id: 'ev-3', title: 'Lunch', start: '12:00', end: '13:00' }
    ];

    const sortedAsc = sortItemsByTimeFn(events, '2026-10-09', 'asc');
    expect(sortedAsc.map(e => e.id)).toEqual(['ev-2', 'ev-3', 'ev-1']);

    const sortedDesc = sortItemsByTimeFn(events, '2026-10-09', 'desc');
    expect(sortedDesc.map(e => e.id)).toEqual(['ev-1', 'ev-3', 'ev-2']);
  });

  it('should contain timeSortOrder in DEFAULT_DATA and translations', () => {
    expect(appCode).toContain("timeSortOrder: 'asc'");
    expect(appCode).toContain("sortOrderLabel: 'Thứ tự sắp xếp sự kiện & task:'");
    expect(appCode).toContain("sortOrderLabel: 'Event & Task Sort Order:'");
    expect(appCode).toContain("updateSettingsPreference('timeSortOrder', this.value)");
  });
});
