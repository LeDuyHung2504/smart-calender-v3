import { describe, it, expect } from 'vitest';

function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return Math.min(1440, Math.max(0, h * 60 + m));
}

function getSessionRange(sessionKey) {
  switch (sessionKey) {
    case 'morning': return { start: 360, end: 720 };    // 06:00 - 12:00
    case 'afternoon': return { start: 720, end: 1080 }; // 12:00 - 18:00
    case 'evening': return { start: 1080, end: 1380 };  // 18:00 - 23:00
    default: return null;
  }
}

function findBestFreeSlotForTask(task, availableSlots) {
  if (!task) return null;
  const duration = (typeof task.estimatedMinutes === 'number' && task.estimatedMinutes > 0) ? task.estimatedMinutes : 25;
  if (!availableSlots || !Array.isArray(availableSlots) || availableSlots.length === 0) return null;

  // 1. CHẾ ĐỘ XẾP LỊCH THỦ CÔNG
  if (task.scheduleMode === 'manual' && task.manualStartTime && typeof task.manualStartTime === 'string') {
    const manualMins = timeToMinutes(task.manualStartTime);
    const exactCoverSlot = availableSlots.find(s => s.start <= manualMins && s.end >= manualMins + duration);
    if (exactCoverSlot) {
      return {
        ...exactCoverSlot,
        start: manualMins,
        end: exactCoverSlot.end,
        duration: exactCoverSlot.end - manualMins
      };
    }
  }

  // 2. Lọc các slot đủ độ dài
  const validSlots = availableSlots.filter(s => s.duration >= duration);
  if (validSlots.length === 0) return null;

  // 3. Ưu tiên lọc theo buổi mong muốn (preferredSession)
  let candidateSlots = validSlots;
  if (task.preferredSession && task.preferredSession !== 'any') {
    const sRange = getSessionRange(task.preferredSession);
    if (sRange) {
      const sessionMatches = validSlots.filter(s => s.start < sRange.end && s.end > sRange.start);
      if (sessionMatches.length > 0) {
        candidateSlots = sessionMatches;
      }
    }
  }

  // 4. Ưu tiên theo độ yên tĩnh
  if (task.requireQuiet) {
    const quietMatches = candidateSlots.filter(s => !s.isNoisy);
    if (quietMatches.length > 0) {
      return quietMatches[0];
    }
  }

  return candidateSlots[0];
}

describe('ChronoFlow Auto-Scheduler & Priority Assignment Engine', () => {
  const sampleFreeSlots = [
    { id: 'slot-1', start: 420, end: 540, duration: 120, isNoisy: false, startTimeStr: '07:00', endTimeStr: '09:00' }, // Morning Quiet
    { id: 'slot-2', start: 600, end: 660, duration: 60, isNoisy: true, startTimeStr: '10:00', endTimeStr: '11:00' },   // Morning Noisy
    { id: 'slot-3', start: 840, end: 960, duration: 120, isNoisy: false, startTimeStr: '14:00', endTimeStr: '16:00' }, // Afternoon Quiet
    { id: 'slot-4', start: 1200, end: 1260, duration: 60, isNoisy: false, startTimeStr: '20:00', endTimeStr: '21:00' } // Evening Quiet
  ];

  it('should find first valid slot for task without special constraints', () => {
    const simpleTask = { id: 't-1', estimatedMinutes: 45, requireQuiet: false };
    const slot = findBestFreeSlotForTask(simpleTask, sampleFreeSlots);
    expect(slot).toBeDefined();
    expect(slot.id).toBe('slot-1');
  });

  it('should prioritize morning session slot when preferredSession is morning', () => {
    const morningTask = { id: 't-morning', estimatedMinutes: 30, preferredSession: 'morning' };
    const slot = findBestFreeSlotForTask(morningTask, sampleFreeSlots);
    expect(slot.id).toBe('slot-1');
  });

  it('should select afternoon slot when preferredSession is afternoon', () => {
    const afternoonTask = { id: 't-afternoon', estimatedMinutes: 30, preferredSession: 'afternoon' };
    const slot = findBestFreeSlotForTask(afternoonTask, sampleFreeSlots);
    expect(slot.id).toBe('slot-3');
  });

  it('should select evening slot when preferredSession is evening', () => {
    const eveningTask = { id: 't-evening', estimatedMinutes: 30, preferredSession: 'evening' };
    const slot = findBestFreeSlotForTask(eveningTask, sampleFreeSlots);
    expect(slot.id).toBe('slot-4');
  });

  it('should bypass noisy slot when requireQuiet is true', () => {
    // Only slots 2 (noisy) and 3 (quiet) available
    const slots = [sampleFreeSlots[1], sampleFreeSlots[2]];
    const quietTask = { id: 't-deepwork', estimatedMinutes: 45, requireQuiet: true };
    const slot = findBestFreeSlotForTask(quietTask, slots);
    expect(slot.id).toBe('slot-3');
  });

  it('should correctly schedule manual task at designated start time if covered', () => {
    const manualTask = {
      id: 't-manual',
      scheduleMode: 'manual',
      manualStartTime: '14:30',
      estimatedMinutes: 30
    };
    const slot = findBestFreeSlotForTask(manualTask, sampleFreeSlots);
    expect(slot).toBeDefined();
    expect(slot.start).toBe(870); // 14:30 in minutes
  });

  it('should return null when no slots can accommodate the required duration', () => {
    const longTask = { id: 't-massive', estimatedMinutes: 180 }; // 3 hours, max slot is 2h
    const slot = findBestFreeSlotForTask(longTask, sampleFreeSlots);
    expect(slot).toBeNull();
  });
});
