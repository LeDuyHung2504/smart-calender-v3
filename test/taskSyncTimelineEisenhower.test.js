import { describe, it, expect, beforeEach } from 'vitest';

describe('ChronoFlow Task Synchronization (Timeline & Eisenhower)', () => {
  let appState;

  function executeEditTaskWithScope(taskId, scope, values, targetDateStr) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (!task) return;

    // Luôn cập nhật trực tiếp nội dung chính vào task
    task.title = values.title;
    task.note = values.note;
    task.isImportant = values.isImportant;
    task.isUrgent = values.isUrgent;
    task.estimatedMinutes = values.duration;
    task.requireQuiet = values.requireQuiet;
    task.preferredSession = values.preferredSession;
    task.attentionLevel = values.attentionLevel;

    const currentAssigned = (task.assignedSlotsByDate && task.assignedSlotsByDate[targetDateStr]) || task.assignedSlot;

    if (scope === 'all' || !task.repeatType || task.repeatType === 'none') {
      task.date = values.date || targetDateStr;
      task.scheduleMode = values.scheduleMode;
      task.manualStartTime = values.manualStartTime;
      if (values.rec) {
        task.repeatType = values.rec.repeatType;
        task.repeatDays = values.rec.repeatDays;
      }
      if (currentAssigned) {
        if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
        task.assignedSlotsByDate[targetDateStr] = currentAssigned;
        task.assignedSlot = currentAssigned;
        task.status = 'scheduled';
      }
    } else if (scope === 'this') {
      const finalSlot = currentAssigned;
      if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
      if (finalSlot) {
        task.assignedSlotsByDate[targetDateStr] = finalSlot;
        task.assignedSlot = finalSlot;
        task.status = 'scheduled';
      }
    }
  }

  function getTimelineBlocks(targetDateStr) {
    const blocks = [];
    appState.tasks.forEach(task => {
      const slot = task.assignedSlotsByDate ? task.assignedSlotsByDate[targetDateStr] : task.assignedSlot;
      if (slot) {
        blocks.push({
          taskId: task.id,
          title: task.title,
          note: task.note || '',
          start: slot.start,
          end: slot.end
        });
      }
    });
    return blocks;
  }

  function getEisenhowerCards(targetDateStr) {
    return appState.tasks.map(task => ({
      id: task.id,
      title: task.title,
      note: task.note,
      isImportant: task.isImportant,
      isUrgent: task.isUrgent,
      assignedSlot: task.assignedSlotsByDate ? task.assignedSlotsByDate[targetDateStr] : task.assignedSlot
    }));
  }

  beforeEach(() => {
    appState = {
      tasks: [
        {
          id: 't-journal',
          date: '2026-09-25',
          title: 'Viết journal - buổi sáng',
          note: '- suy nghĩ ngẫu nhiên về thứ gì đó',
          isImportant: true,
          isUrgent: true,
          estimatedMinutes: 15,
          requireQuiet: true,
          status: 'scheduled',
          assignedSlot: { start: '06:50', end: '07:05' },
          assignedSlotsByDate: {
            '2026-09-25': { start: '06:50', end: '07:05' }
          },
          repeatType: 'daily'
        }
      ]
    };
  });

  it('should seamlessly synchronize task title and note between timeline and eisenhower', () => {
    const updatedValues = {
      title: 'Viết journal - buổi sáng (đã cập nhật)',
      note: '- suy nghĩ ngẫu nhiên về thứ gì đó\n- suy nghĩ về các việc cần làm',
      isImportant: true,
      isUrgent: true,
      duration: 15,
      requireQuiet: true,
      preferredSession: 'morning',
      attentionLevel: 'high',
      scheduleMode: 'auto',
      manualStartTime: null,
      rec: { repeatType: 'daily', repeatDays: [0, 1, 2, 3, 4, 5, 6] }
    };

    // User edits task from timeline
    executeEditTaskWithScope('t-journal', 'this', updatedValues, '2026-09-25');

    // 1. Check timeline representation
    const timelineBlocks = getTimelineBlocks('2026-09-25');
    expect(timelineBlocks).toHaveLength(1);
    expect(timelineBlocks[0].title).toBe('Viết journal - buổi sáng (đã cập nhật)');
    expect(timelineBlocks[0].note).toBe('- suy nghĩ ngẫu nhiên về thứ gì đó\n- suy nghĩ về các việc cần làm');
    expect(timelineBlocks[0].start).toBe('06:50');
    expect(timelineBlocks[0].end).toBe('07:05');

    // 2. Check Eisenhower matrix representation
    const eisenhowerCards = getEisenhowerCards('2026-09-25');
    expect(eisenhowerCards).toHaveLength(1);
    expect(eisenhowerCards[0].title).toBe('Viết journal - buổi sáng (đã cập nhật)');
    expect(eisenhowerCards[0].note).toBe('- suy nghĩ ngẫu nhiên về thứ gì đó\n- suy nghĩ về các việc cần làm');
    expect(eisenhowerCards[0].assignedSlot).toEqual({ start: '06:50', end: '07:05' });
  });

  it('should not disconnect or lose assigned time slot when edited with scope=all', () => {
    const updatedValues = {
      title: 'Viết journal siêu tập trung',
      note: 'Ghi chép nhanh 15 phút',
      isImportant: true,
      isUrgent: true,
      duration: 15,
      requireQuiet: true,
      preferredSession: 'morning',
      attentionLevel: 'high',
      scheduleMode: 'auto',
      manualStartTime: null,
      rec: { repeatType: 'daily', repeatDays: [0, 1, 2, 3, 4, 5, 6] }
    };

    executeEditTaskWithScope('t-journal', 'all', updatedValues, '2026-09-25');

    const task = appState.tasks.find(t => t.id === 't-journal');
    expect(task.title).toBe('Viết journal siêu tập trung');
    expect(task.note).toBe('Ghi chép nhanh 15 phút');
    expect(task.assignedSlotsByDate['2026-09-25']).toEqual({ start: '06:50', end: '07:05' });
    expect(task.status).toBe('scheduled');
  });
});
