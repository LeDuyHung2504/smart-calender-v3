import { describe, it, expect, beforeEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Load app.js and evaluate in a controlled sandbox
const appJsPath = path.resolve(__dirname, '../src/app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

// Helper to extract function body from app.js
function extractFunction(name) {
  const match = appJsContent.match(new RegExp(`function\\s+${name}\\s*\\([^)]*\\)\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!match) throw new Error(`Function ${name} not found in app.js`);
  return match[1];
}

// Utility functions
function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

function minutesToTime(mins) {
  const m = Math.max(0, Math.min(1439, Math.round(mins)));
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
}

function isItemActiveOnDate(item, targetDateStr) {
  if (!item || !targetDateStr) return false;
  const exclusions = item.excludedDates || item.recurrenceExclusions;
  if (exclusions && Array.isArray(exclusions) && exclusions.includes(targetDateStr)) return false;
  const startDate = item.startDate || (item.date ? item.date : null);
  if (startDate && targetDateStr < startDate) return false;
  const endDate = item.endDate || item.repeatEndDate || null;
  if (endDate && targetDateStr > endDate) return false;
  return true;
}

function getTaskAssignedSlot(task, targetDateStr) {
  if (task.assignedSlotsByDate && task.assignedSlotsByDate[targetDateStr]) {
    return task.assignedSlotsByDate[targetDateStr];
  }
  if (task.date === targetDateStr && task.assignedSlot) {
    return task.assignedSlot;
  }
  return null;
}

// Instantiate tested functions using factory functions with closures
const getBaseAttentionScore = new Function('timeToMinutes', `
  return function(timeString) {
    ${extractFunction('getBaseAttentionScore')}
  };
`)(timeToMinutes);

const calculateAttentionScore = new Function('getBaseAttentionScore', `
  return function(timeString, currentFatigue = 0) {
    ${extractFunction('calculateAttentionScore')}
  };
`)(getBaseAttentionScore);

const createTimelineFatigueCalculator = new Function(
  'isItemActiveOnDate', 'getTaskAssignedSlot', 'timeToMinutes', 'minutesToTime', 'getBaseAttentionScore', `
  return function(tasks, fixedEvents, targetDateStr) {
    const selectedDate = targetDateStr;
    const appState = { tasks, fixedEvents };
    ${extractFunction('calculateTimelineAttentionWithFatigue')}
  };
`);

const calculateTimelineAttentionWithFatigue = createTimelineFatigueCalculator(
  isItemActiveOnDate,
  getTaskAssignedSlot,
  timeToMinutes,
  minutesToTime,
  getBaseAttentionScore
);

describe('Fatigue Score & Attention Calculation Test Suite', () => {
  const targetDate = '2026-09-23';

  describe('1. getBaseAttentionScore Time-of-Day Base Rules', () => {
    it('should return 2.0 for morning peak hours (06:00 - 11:00)', () => {
      expect(getBaseAttentionScore('06:00')).toBe(2.0);
      expect(getBaseAttentionScore('08:30')).toBe(2.0);
      expect(getBaseAttentionScore('10:59')).toBe(2.0);
    });

    it('should return 0.5 for lunch energy dip (11:00 - 13:30)', () => {
      expect(getBaseAttentionScore('11:00')).toBe(0.5);
      expect(getBaseAttentionScore('12:15')).toBe(0.5);
      expect(getBaseAttentionScore('13:29')).toBe(0.5);
    });

    it('should return 1.5 for afternoon focus session (14:00 - 18:00)', () => {
      expect(getBaseAttentionScore('14:00')).toBe(1.5);
      expect(getBaseAttentionScore('15:45')).toBe(1.5);
      expect(getBaseAttentionScore('17:59')).toBe(1.5);
    });

    it('should return 1.0 for evening focus session (18:00 - 22:00)', () => {
      expect(getBaseAttentionScore('18:00')).toBe(1.0);
      expect(getBaseAttentionScore('20:00')).toBe(1.0);
      expect(getBaseAttentionScore('21:59')).toBe(1.0);
    });

    it('should return 0.0 for night/early morning hours (22:00 - 06:00)', () => {
      expect(getBaseAttentionScore('22:00')).toBe(0.0);
      expect(getBaseAttentionScore('23:30')).toBe(0.0);
      expect(getBaseAttentionScore('02:00')).toBe(0.0);
      expect(getBaseAttentionScore('05:59')).toBe(0.0);
    });
  });

  describe('2. calculateAttentionScore with Variable Fatigue Score', () => {
    it('should subtract fatigue from base score accurately', () => {
      expect(calculateAttentionScore('09:00', 0.0)).toBe(2.0);
      expect(calculateAttentionScore('09:00', 0.5)).toBe(1.5);
      expect(calculateAttentionScore('09:00', 1.0)).toBe(1.0);
      expect(calculateAttentionScore('15:00', 0.5)).toBe(1.0);
    });

    it('should never produce negative attention scores (floor at 0.0)', () => {
      // Base 0.5 at 12:00 with 1.0 fatigue -> 0.0
      expect(calculateAttentionScore('12:00', 1.0)).toBe(0.0);
      // Base 0.0 at 23:00 with 0.5 fatigue -> 0.0
      expect(calculateAttentionScore('23:00', 0.5)).toBe(0.0);
    });
  });

  describe('3. calculateTimelineAttentionWithFatigue Simulation with Tasks & Recovery Events', () => {
    it('should correctly simulate timeline: High Tasks increase fatigue, Recovery Events reset fatigue to 0', () => {
      const mockTasks = [
        // Morning High Attention Task 1 (08:00 - 09:30)
        {
          id: 'task-1',
          title: 'Code Deep Architecture',
          date: targetDate,
          attentionLevel: 'high',
          assignedSlot: { start: '08:00', end: '09:30' }
        },
        // Morning High Attention Task 2 (10:00 - 11:30)
        {
          id: 'task-2',
          title: 'Debug Complex Race Condition',
          date: targetDate,
          attentionLevel: 'high',
          assignedSlot: { start: '10:00', end: '11:30' }
        },
        // Afternoon Low Attention Task (14:30 - 15:30)
        {
          id: 'task-3',
          title: 'Reply to non-urgent emails',
          date: targetDate,
          attentionLevel: 'low',
          assignedSlot: { start: '14:30', end: '15:30' }
        },
        // Afternoon Medium Attention Task (16:00 - 17:00)
        {
          id: 'task-4',
          title: 'Code Review & Sprint Planning',
          date: targetDate,
          attentionLevel: 'medium',
          assignedSlot: { start: '16:00', end: '17:00' }
        }
      ];

      const mockFixedEvents = [
        // Regular Meeting (Non-recovery) 09:30 - 10:00
        {
          id: 'fe-meeting',
          title: 'Team Sync Meeting',
          date: targetDate,
          start: '09:30',
          end: '10:00',
          isRecovery: false
        },
        // Power Nap / Meditation Recovery Event (12:00 - 13:00)
        {
          id: 'fe-recovery-1',
          title: 'Power Nap & Meditation',
          date: targetDate,
          start: '12:00',
          end: '13:00',
          isRecovery: true
        },
        // Evening Yoga Recovery Event (18:00 - 19:00)
        {
          id: 'fe-recovery-2',
          title: 'Evening Yoga & Stretching',
          date: targetDate,
          start: '18:00',
          end: '19:00',
          isRecovery: true
        }
      ];

      const result = calculateTimelineAttentionWithFatigue(
        mockTasks,
        mockFixedEvents,
        targetDate,
        { tasks: mockTasks, fixedEvents: mockFixedEvents },
        targetDate,
        isItemActiveOnDate,
        getTaskAssignedSlot,
        timeToMinutes,
        minutesToTime,
        getBaseAttentionScore
      );

      // 1. Check Initial State at 07:00 (Before any tasks)
      const state0700 = result.getAttentionAtTime('07:00');
      expect(state0700.baseScore).toBe(2.0);
      expect(state0700.fatigueScore).toBe(0.0);
      expect(state0700.actualAttentionScore).toBe(2.0);

      // 2. Check After Task 1 (at 09:45, during non-recovery meeting)
      // Task 1 finished at 09:30 (+0.5 fatigue)
      const state0945 = result.getAttentionAtTime('09:45');
      expect(state0945.baseScore).toBe(2.0);
      expect(state0945.fatigueScore).toBe(0.5);
      expect(state0945.actualAttentionScore).toBe(1.5);

      // 3. Check After Task 2 (at 11:45, before recovery)
      // Task 2 finished at 11:30 (+0.5 fatigue -> total 1.0)
      const state1145 = result.getAttentionAtTime('11:45');
      expect(state1145.baseScore).toBe(0.5);
      expect(state1145.fatigueScore).toBe(1.0);
      expect(state1145.actualAttentionScore).toBe(0.0); // 0.5 - 1.0 floored to 0

      // 4. CHECK RECOVERY EVENT RESET (at 13:30, after Power Nap)
      // Recovery event ended at 13:00 -> fatigue score MUST BE 0!
      const state1330 = result.getAttentionAtTime('13:30');
      expect(state1330.baseScore).toBe(0.5);
      expect(state1330.fatigueScore).toBe(0.0); // RESET TO 0!
      expect(state1330.actualAttentionScore).toBe(0.5);

      // 5. Check Afternoon Focus Window at 14:00 (Fatigue still 0)
      const state1400 = result.getAttentionAtTime('14:00');
      expect(state1400.baseScore).toBe(1.5);
      expect(state1400.fatigueScore).toBe(0.0);
      expect(state1400.actualAttentionScore).toBe(1.5);

      // 6. Check After Low Attention Task 3 at 15:45
      // Low attention task does not increase fatigue -> Fatigue remains 0.0
      const state1545 = result.getAttentionAtTime('15:45');
      expect(state1545.baseScore).toBe(1.5);
      expect(state1545.fatigueScore).toBe(0.0);
      expect(state1545.actualAttentionScore).toBe(1.5);

      // 7. Check After Medium Attention Task 4 at 17:15
      // Task 4 ended at 17:00 (+0.2 fatigue -> total 0.2)
      const state1715 = result.getAttentionAtTime('17:15');
      expect(state1715.baseScore).toBe(1.5);
      expect(state1715.fatigueScore).toBe(0.2);
      expect(state1715.actualAttentionScore).toBe(1.3);

      // 8. CHECK SECOND RECOVERY EVENT RESET (at 19:30, after Evening Yoga)
      // Recovery event ended at 19:00 -> fatigue score MUST BE 0!
      const state1930 = result.getAttentionAtTime('19:30');
      expect(state1930.baseScore).toBe(1.0);
      expect(state1930.fatigueScore).toBe(0.0); // RESET TO 0!
      expect(state1930.actualAttentionScore).toBe(1.0);
    });

    it('should handle un-ordered tasks and fixed events seamlessly by auto-sorting by start time', () => {
      const unsortedTasks = [
        { id: 't2', title: 'Task 2', date: targetDate, attentionLevel: 'high', assignedSlot: { start: '14:00', end: '15:00' } },
        { id: 't1', title: 'Task 1', date: targetDate, attentionLevel: 'high', assignedSlot: { start: '08:00', end: '09:00' } }
      ];
      const unsortedEvents = [
        { id: 'fe2', title: 'Yoga', date: targetDate, start: '16:00', end: '17:00', isRecovery: true },
        { id: 'fe1', title: 'Nap', date: targetDate, start: '11:00', end: '12:00', isRecovery: true }
      ];

      const result = calculateTimelineAttentionWithFatigue(
        unsortedTasks,
        unsortedEvents,
        targetDate,
        { tasks: unsortedTasks, fixedEvents: unsortedEvents },
        targetDate,
        isItemActiveOnDate,
        getTaskAssignedSlot,
        timeToMinutes,
        minutesToTime,
        getBaseAttentionScore
      );

      // At 10:00 -> after Task 1 (fatigue 0.5)
      expect(result.getAttentionAtTime('10:00').fatigueScore).toBe(0.5);
      // At 13:00 -> after Nap (fatigue reset to 0)
      expect(result.getAttentionAtTime('13:00').fatigueScore).toBe(0.0);
      // At 15:30 -> after Task 2 (fatigue 0.5)
      expect(result.getAttentionAtTime('15:30').fatigueScore).toBe(0.5);
      // At 17:30 -> after Yoga (fatigue reset to 0)
      expect(result.getAttentionAtTime('17:30').fatigueScore).toBe(0.0);
    });
  });
});
