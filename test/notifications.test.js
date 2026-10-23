import { describe, it, expect, beforeEach } from 'vitest';

function toLocalDateKey(dateInput) {
  if (!dateInput) {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  if (typeof dateInput === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
    return dateInput;
  }
  const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) {
    const fallback = new Date();
    return `${fallback.getFullYear()}-${String(fallback.getMonth() + 1).padStart(2, '0')}-${String(fallback.getDate()).padStart(2, '0')}`;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return Math.min(1440, Math.max(0, h * 60 + m));
}

function isSlotNoisy(startStr, endStr, noisyIntervals = []) {
  const sMins = timeToMinutes(startStr);
  const eMins = timeToMinutes(endStr);
  return noisyIntervals.some(n => {
    if (!n.start || !n.end) return false;
    const ns = timeToMinutes(n.start);
    const ne = timeToMinutes(n.end);
    return Math.max(sMins, ns) < Math.min(eMins, ne);
  });
}

function formatNotificationText(currentEvent, nextItems, noisyIntervals = [], lang = 'vi') {
  const isEn = lang === 'en';
  const noticeMins = Number(currentEvent.noticeMins) || 5;
  const currentEndMins = timeToMinutes(currentEvent.end);

  let nextEvent = null;
  if (Array.isArray(nextItems)) {
    nextEvent = nextItems.find(item => timeToMinutes(item.start) >= currentEndMins) || null;
  } else if (nextItems && typeof nextItems === 'object') {
    nextEvent = nextItems;
  }

  // Dòng 1: Sự kiện hiện tại kết thúc sau: [X] phút ([thời gian kết thúc])
  const line1 = isEn 
    ? `Current event "${currentEvent.title || ''}" ends in: ${noticeMins}m (${currentEvent.end})` 
    : `Sự kiện hiện tại kết thúc sau: ${noticeMins} phút (${currentEvent.end})`;

  const textLines = [line1];

  if (!nextEvent) {
    const gapTime = `${currentEvent.end} - 24:00`;
    const noisy = isSlotNoisy(currentEvent.end, '24:00', noisyIntervals);
    const noisyLabel = noisy 
      ? (isEn ? 'noisy' : 'ồn ào') 
      : (isEn ? 'quiet' : 'không ồn');
    const line2 = isEn
      ? `(Next) Free time (${noisyLabel}): ${gapTime}`
      : `(tiếp theo) thời gian rảnh (${noisyLabel}): ${gapTime}`;
    textLines.push(line2);
  } else {
    const nextStartMins = timeToMinutes(nextEvent.start);

    if (nextStartMins > currentEndMins) {
      // Trường hợp 1: Khoảng thời gian trống giữa các sự kiện
      const gapStart = currentEvent.end;
      const gapEnd = nextEvent.start;
      const noisy = isSlotNoisy(gapStart, gapEnd, noisyIntervals);
      const noisyLabel = noisy 
        ? (isEn ? 'noisy' : 'ồn ào') 
        : (isEn ? 'quiet' : 'không ồn');

      // Dòng 2: (tiếp theo) thời gian rảnh (ồn ào, không ồn,...): mốc thời gian
      const line2 = isEn 
        ? `(Next) Free time (${noisyLabel}): ${gapStart} - ${gapEnd}` 
        : `(tiếp theo) thời gian rảnh (${noisyLabel}): ${gapStart} - ${gapEnd}`;

      // Dòng 3: (sự kiện tiếp theo).....: mốc thời gian
      const line3 = isEn 
        ? `(Subsequent event) ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}` 
        : `(sự kiện tiếp theo) ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}`;

      textLines.push(line2);
      textLines.push(line3);
    } else {
      // Trường hợp 2: Các sự kiện liền nhau (liền kề, không có khoảng trống)
      // Dòng 2: (Sự kiện tiếp theo) event name: khoảng thời gian diễn ra
      const line2 = isEn 
        ? `(Next event) ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}` 
        : `(Sự kiện tiếp theo) ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}`;

      textLines.push(line2);
    }
  }

  return textLines;
}

describe('Notification Engine & Formatting Tests', () => {
  describe('toLocalDateKey', () => {
    it('should format Date instance to YYYY-MM-DD correctly in local time', () => {
      const d = new Date(2026, 9, 10);
      expect(toLocalDateKey(d)).toBe('2026-10-10');
    });

    it('should pass through valid YYYY-MM-DD string', () => {
      expect(toLocalDateKey('2026-05-15')).toBe('2026-05-15');
    });

    it('should return current date for null/undefined', () => {
      const today = new Date();
      const expected = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
      expect(toLocalDateKey(null)).toBe(expected);
      expect(toLocalDateKey(undefined)).toBe(expected);
    });
  });

  describe('Notification Group Checkbox Toggle Logic', () => {
    let settings;

    const toggleGroup = (group, isChecked) => {
      if (group === 'all') {
        settings.notifyAll = isChecked;
        settings.notifyEisenhower = isChecked;
        settings.notifyFixed = isChecked;
        settings.notifyTransient = isChecked;
        settings.notificationsEnabled = isChecked;
      } else {
        if (group === 'eisenhower') settings.notifyEisenhower = isChecked;
        if (group === 'fixed') settings.notifyFixed = isChecked;
        if (group === 'transient') settings.notifyTransient = isChecked;

        const eOn = settings.notifyEisenhower !== false;
        const fOn = settings.notifyFixed !== false;
        const tOn = settings.notifyTransient !== false;

        settings.notifyAll = (eOn && fOn && tOn);
        settings.notificationsEnabled = (eOn || fOn || tOn);
      }
    };

    beforeEach(() => {
      settings = {
        notificationsEnabled: true,
        notifyAll: true,
        notifyEisenhower: true,
        notifyFixed: true,
        notifyTransient: true
      };
    });

    it('Checking "all" should automatically check all 3 sub-groups', () => {
      // Start with all disabled
      settings.notifyAll = false;
      settings.notifyEisenhower = false;
      settings.notifyFixed = false;
      settings.notifyTransient = false;
      settings.notificationsEnabled = false;

      toggleGroup('all', true);

      expect(settings.notifyAll).toBe(true);
      expect(settings.notifyEisenhower).toBe(true);
      expect(settings.notifyFixed).toBe(true);
      expect(settings.notifyTransient).toBe(true);
      expect(settings.notificationsEnabled).toBe(true);
    });

    it('Unchecking "all" should automatically uncheck all 3 sub-groups', () => {
      toggleGroup('all', false);

      expect(settings.notifyAll).toBe(false);
      expect(settings.notifyEisenhower).toBe(false);
      expect(settings.notifyFixed).toBe(false);
      expect(settings.notifyTransient).toBe(false);
      expect(settings.notificationsEnabled).toBe(false);
    });

    it('Unchecking one sub-group should uncheck "all", while keeping other sub-groups enabled', () => {
      toggleGroup('eisenhower', false);

      expect(settings.notifyEisenhower).toBe(false);
      expect(settings.notifyFixed).toBe(true);
      expect(settings.notifyTransient).toBe(true);
      expect(settings.notifyAll).toBe(false);
      expect(settings.notificationsEnabled).toBe(true);
    });

    it('Checking all 3 sub-groups should automatically mark "all" as checked', () => {
      settings.notifyEisenhower = false;
      settings.notifyAll = false;

      toggleGroup('eisenhower', true);

      expect(settings.notifyEisenhower).toBe(true);
      expect(settings.notifyAll).toBe(true);
      expect(settings.notificationsEnabled).toBe(true);
    });
  });

  describe('formatNotificationText for Event Endings', () => {
    it('Case 1: Should format free gap correctly when there is a free time interval between events', () => {
      const current = { title: 'Họp chiến lược', end: '10:00', noticeMins: 10 };
      const nextItems = [
        { title: 'Viết báo cáo tài chính', start: '11:00', end: '12:00' }
      ];
      const noisyIntervals = [{ start: '09:00', end: '10:30' }];

      const lines = formatNotificationText(current, nextItems, noisyIntervals, 'vi');
      expect(lines).toHaveLength(3);
      expect(lines[0]).toBe('Sự kiện hiện tại kết thúc sau: 10 phút (10:00)');
      expect(lines[1]).toBe('(tiếp theo) thời gian rảnh (ồn ào): 10:00 - 11:00');
      expect(lines[2]).toBe('(sự kiện tiếp theo) Viết báo cáo tài chính: 11:00 - 12:00');
    });

    it('Case 1 (Quiet gap): Should indicate non-noisy free time correctly', () => {
      const current = { title: 'Tập Gym', end: '08:00', noticeMins: 5 };
      const nextItems = [
        { title: 'Đọc sách', start: '09:00', end: '10:00' }
      ];
      const noisyIntervals = []; // No noise

      const lines = formatNotificationText(current, nextItems, noisyIntervals, 'vi');
      expect(lines[1]).toBe('(tiếp theo) thời gian rảnh (không ồn): 08:00 - 09:00');
    });

    it('Case 2: Should format adjacent / contiguous events without gap', () => {
      const current = { title: 'Coding Sprint 1', end: '14:00', noticeMins: 5 };
      const nextItems = [
        { title: 'Sprint Review', start: '14:00', end: '15:00' }
      ];

      const lines = formatNotificationText(current, nextItems, [], 'vi');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe('Sự kiện hiện tại kết thúc sau: 5 phút (14:00)');
      expect(lines[1]).toBe('(Sự kiện tiếp theo) Sprint Review: 14:00 - 15:00');
    });

    it('Case 3: Should format remainder of day when no subsequent events exist', () => {
      const current = { title: 'Ăn tối gia đình', end: '20:00', noticeMins: 15 };
      const nextItems = [];

      const lines = formatNotificationText(current, nextItems, [], 'vi');
      expect(lines).toHaveLength(2);
      expect(lines[0]).toBe('Sự kiện hiện tại kết thúc sau: 15 phút (20:00)');
      expect(lines[1]).toBe('(tiếp theo) thời gian rảnh (không ồn): 20:00 - 24:00');
    });
  });

  describe('Simulated Notification Scenarios for Testing', () => {
    function getSimulatedNotification(scenario, startNoticeMins = 5, endNoticeMins = 5, isEn = false) {
      if (scenario === 'start') {
        const title = isEn ? 'ChronoFlow: Event Starting Soon' : 'ChronoFlow: Sự kiện sắp bắt đầu';
        const body = isEn 
          ? `Event "Weekly Strategy Sync" starts in: ${startNoticeMins}m (09:00)` 
          : `Sự kiện "Họp chiến lược tuần" bắt đầu sau: ${startNoticeMins} phút (09:00)`;
        return { title, body };
      }
      if (scenario === 'adjacent') {
        const title = isEn ? 'ChronoFlow: Event Ending Soon' : 'ChronoFlow: Sự kiện sắp kết thúc';
        const body = isEn
          ? `Current event "Sprint Planning" ends in: ${endNoticeMins}m (14:00)\n(Next event) Sprint Review: 14:00 - 15:00`
          : `Sự kiện hiện tại "Lập trình Sprint 1" kết thúc sau: ${endNoticeMins} phút (14:00)\n(Sự kiện tiếp theo) Sprint Review: 14:00 - 15:00`;
        return { title, body };
      }
      // 'gap'
      const title = isEn ? 'ChronoFlow: Event Ending Soon' : 'ChronoFlow: Sự kiện sắp kết thúc';
      const body = isEn
        ? `Current event "Weekly Strategy Sync" ends in: ${endNoticeMins}m (10:00)\n(Next) Free time (quiet): 10:00 - 11:30\n(Subsequent event) Technical Documentation: 11:30 - 12:30`
        : `Sự kiện hiện tại "Họp kế hoạch tuần" kết thúc sau: ${endNoticeMins} phút (10:00)\n(tiếp theo) thời gian rảnh (không ồn): 10:00 - 11:30\n(sự kiện tiếp theo) Viết tài liệu dự án: 11:30 - 12:30`;
      return { title, body };
    }

    it('Scenario "gap" generates simulated notification with free time gap and next event', () => {
      const notif = getSimulatedNotification('gap', 5, 10, false);
      expect(notif.title).toBe('ChronoFlow: Sự kiện sắp kết thúc');
      expect(notif.body).toContain('Sự kiện hiện tại "Họp kế hoạch tuần" kết thúc sau: 10 phút (10:00)');
      expect(notif.body).toContain('(tiếp theo) thời gian rảnh (không ồn): 10:00 - 11:30');
      expect(notif.body).toContain('(sự kiện tiếp theo) Viết tài liệu dự án: 11:30 - 12:30');
    });

    it('Scenario "adjacent" generates simulated notification with consecutive events', () => {
      const notif = getSimulatedNotification('adjacent', 5, 5, false);
      expect(notif.title).toBe('ChronoFlow: Sự kiện sắp kết thúc');
      expect(notif.body).toContain('Sự kiện hiện tại "Lập trình Sprint 1" kết thúc sau: 5 phút (14:00)');
      expect(notif.body).toContain('(Sự kiện tiếp theo) Sprint Review: 14:00 - 15:00');
    });

    it('Scenario "start" generates simulated notification for starting event', () => {
      const notif = getSimulatedNotification('start', 15, 5, false);
      expect(notif.title).toBe('ChronoFlow: Sự kiện sắp bắt đầu');
      expect(notif.body).toContain('Sự kiện "Họp chiến lược tuần" bắt đầu sau: 15 phút (09:00)');
    });
  });
});
