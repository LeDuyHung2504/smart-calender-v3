import { describe, it, expect } from 'vitest';

// Recurrence checker logic matching ChronoFlow's isItemActiveOnDate
function isItemActiveOnDate(item, targetDateStr) {
  if (!item || !targetDateStr || typeof targetDateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)) return false;

  const exclusions = item.excludedDates || item.recurrenceExclusions;
  if (exclusions && Array.isArray(exclusions) && exclusions.includes(targetDateStr)) {
    return false;
  }

  const startDate = item.startDate || (item.date ? item.date : null);
  if (startDate && targetDateStr < startDate) {
    return false;
  }

  const endDate = item.endDate || item.repeatEndDate || null;
  if (endDate && targetDateStr > endDate) {
    return false;
  }

  const isLegacyNoisy = !!(item.start && item.end && !item.date && !item.repeatType);
  const repeatType = item.repeatType || (isLegacyNoisy ? 'daily' : 'none');

  if (repeatType === 'none') {
    if (!item.date && Array.isArray(item.daysOfWeek) && item.daysOfWeek.length > 0) {
      const [y, m, d] = targetDateStr.split('-').map(Number);
      const dObj = new Date(y, m - 1, d);
      return item.daysOfWeek.includes(dObj.getDay());
    }
    return item.date === targetDateStr;
  }

  const [y, m, d] = targetDateStr.split('-').map(Number);
  const targetDateObj = new Date(y, m - 1, d);
  const targetDayOfWeek = targetDateObj.getDay(); // 0: Sun, 1: Mon, ..., 6: Sat

  if (repeatType === 'daily') {
    return true;
  }

  if (repeatType === 'every_2_days') {
    if (startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const sObj = new Date(sy, sm - 1, sd);
      const diffMs = targetDateObj.getTime() - sObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && (diffDays % 2 === 0);
    }
    return true;
  }

  if (repeatType === 'interval' || repeatType === 'custom') {
    const interval = Math.max(1, Number(item.repeatInterval) || 1);
    if (startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const sObj = new Date(sy, sm - 1, sd);
      const diffMs = targetDateObj.getTime() - sObj.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && (diffDays % interval === 0);
    }
    return true;
  }

  if (repeatType === 'weekdays') {
    return targetDayOfWeek >= 1 && targetDayOfWeek <= 5;
  }

  if (repeatType === 'weekly') {
    if (item.date && targetDateStr === item.date && (!item.startDate || targetDateStr >= item.startDate)) {
      return true;
    }
    const days = Array.isArray(item.repeatDays) ? item.repeatDays
               : (Array.isArray(item.daysOfWeek) ? item.daysOfWeek : []);
    if (days.length > 0) {
      return days.includes(targetDayOfWeek);
    }
    if (startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const sDay = new Date(sy, sm - 1, sd).getDay();
      return targetDayOfWeek === sDay;
    }
    return false;
  }

  if (repeatType === 'monthly') {
    const baseDayNum = startDate
      ? parseInt(startDate.split('-')[2], 10)
      : (item.date ? parseInt(item.date.split('-')[2], 10) : 1);
    const [ty, tm, td] = targetDateStr.split('-').map(Number);
    const daysInTargetMonth = new Date(ty, tm, 0).getDate();
    const effectiveDayNum = Math.min(baseDayNum, daysInTargetMonth);
    return td === effectiveDayNum;
  }

  return false;
}

function isTaskDoneOnDate(task, dateStr) {
  if (!task) return false;
  if (task.completedDates && Array.isArray(task.completedDates) && task.completedDates.includes(dateStr)) {
    return true;
  }
  if ((!task.repeatType || task.repeatType === 'none') && task.date === dateStr && task.status === 'done') {
    return true;
  }
  return false;
}

describe('ChronoFlow Recurrence & Task Completion State Engine', () => {
  describe('Non-repeating items', () => {
    it('should be active only on the exact specified date', () => {
      const singleTask = { id: 't-1', date: '2026-09-25', repeatType: 'none' };
      expect(isItemActiveOnDate(singleTask, '2026-09-25')).toBe(true);
      expect(isItemActiveOnDate(singleTask, '2026-09-26')).toBe(false);
      expect(isItemActiveOnDate(singleTask, '2026-09-24')).toBe(false);
    });

    it('should respect legacy daysOfWeek when date is absent', () => {
      const weekendEvent = { id: 'fe-weekend', daysOfWeek: [0, 6], repeatType: 'none' };
      // 2026-09-26 is Saturday (6), 2026-09-27 is Sunday (0), 2026-09-28 is Monday (1)
      expect(isItemActiveOnDate(weekendEvent, '2026-09-26')).toBe(true);
      expect(isItemActiveOnDate(weekendEvent, '2026-09-27')).toBe(true);
      expect(isItemActiveOnDate(weekendEvent, '2026-09-28')).toBe(false);
    });
  });

  describe('Daily and Weekday recurring rules', () => {
    it('should correctly handle daily recurring items within start/end boundaries', () => {
      const dailyItem = {
        id: 't-daily',
        startDate: '2026-09-20',
        endDate: '2026-09-30',
        repeatType: 'daily'
      };
      expect(isItemActiveOnDate(dailyItem, '2026-09-19')).toBe(false); // Before start
      expect(isItemActiveOnDate(dailyItem, '2026-09-20')).toBe(true);  // Start
      expect(isItemActiveOnDate(dailyItem, '2026-09-25')).toBe(true);  // Inside
      expect(isItemActiveOnDate(dailyItem, '2026-09-30')).toBe(true);  // End
      expect(isItemActiveOnDate(dailyItem, '2026-10-01')).toBe(false); // After end
    });

    it('should handle weekday recurrence (Mon-Fri only)', () => {
      const weekdayTask = {
        id: 't-work',
        startDate: '2026-09-21',
        repeatType: 'weekdays'
      };
      // 2026-09-25 is Friday, 2026-09-26 is Sat, 2026-09-27 is Sun, 2026-09-28 is Mon
      expect(isItemActiveOnDate(weekdayTask, '2026-09-25')).toBe(true);  // Fri
      expect(isItemActiveOnDate(weekdayTask, '2026-09-26')).toBe(false); // Sat
      expect(isItemActiveOnDate(weekdayTask, '2026-09-27')).toBe(false); // Sun
      expect(isItemActiveOnDate(weekdayTask, '2026-09-28')).toBe(true);  // Mon
    });
  });

  describe('Interval & Exclusions', () => {
    it('should handle every-2-days recurrence correctly', () => {
      const item = {
        startDate: '2026-09-20',
        repeatType: 'every_2_days'
      };
      expect(isItemActiveOnDate(item, '2026-09-20')).toBe(true);
      expect(isItemActiveOnDate(item, '2026-09-21')).toBe(false);
      expect(isItemActiveOnDate(item, '2026-09-22')).toBe(true);
      expect(isItemActiveOnDate(item, '2026-09-23')).toBe(false);
    });

    it('should exclude dates listed in excludedDates array', () => {
      const item = {
        startDate: '2026-09-01',
        repeatType: 'daily',
        excludedDates: ['2026-09-25', '2026-09-28']
      };
      expect(isItemActiveOnDate(item, '2026-09-24')).toBe(true);
      expect(isItemActiveOnDate(item, '2026-09-25')).toBe(false); // Excluded!
      expect(isItemActiveOnDate(item, '2026-09-26')).toBe(true);
      expect(isItemActiveOnDate(item, '2026-09-28')).toBe(false); // Excluded!
    });
  });

  describe('Independent date-based completion tracking', () => {
    it('should mark recurring task done only on specific checked dates', () => {
      const recurringTask = {
        id: 't-recurring',
        startDate: '2026-09-20',
        repeatType: 'daily',
        completedDates: ['2026-09-22', '2026-09-25']
      };

      expect(isTaskDoneOnDate(recurringTask, '2026-09-21')).toBe(false);
      expect(isTaskDoneOnDate(recurringTask, '2026-09-22')).toBe(true);
      expect(isTaskDoneOnDate(recurringTask, '2026-09-23')).toBe(false);
      expect(isTaskDoneOnDate(recurringTask, '2026-09-25')).toBe(true);
    });
  });
});
