import { describe, it, expect } from 'vitest';

// Utility functions matching ChronoFlow core implementation
function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return Math.min(1440, Math.max(0, h * 60 + m));
}

function minutesToTime(totalMinutes) {
  const safe = Math.min(Math.max(0, totalMinutes), 1440);
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function formatDuration(totalMinutes, lang = 'vi') {
  const m = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const isEn = lang === 'en';
  if (m < 60) return `${m} ${isEn ? 'min' : 'phút'}`;
  const hours = Math.floor(m / 60);
  const remainingMins = m % 60;
  if (remainingMins === 0) return `${hours}${isEn ? 'h' : ' giờ'}`;
  return `${hours}h ${remainingMins}${isEn ? 'm' : 'p'}`;
}

describe('ChronoFlow Core Time & Scheduling Logic', () => {
  describe('timeToMinutes & minutesToTime conversions', () => {
    it('should correctly convert HH:MM to minutes', () => {
      expect(timeToMinutes('00:00')).toBe(0);
      expect(timeToMinutes('08:30')).toBe(510);
      expect(timeToMinutes('12:00')).toBe(720);
      expect(timeToMinutes('23:59')).toBe(1439);
      expect(timeToMinutes('24:00')).toBe(1440);
    });

    it('should handle invalid or boundary time inputs safely', () => {
      expect(timeToMinutes('')).toBe(0);
      expect(timeToMinutes(null)).toBe(0);
      expect(timeToMinutes('invalid')).toBe(0);
      expect(timeToMinutes('-05:00')).toBe(0);
      expect(timeToMinutes('30:00')).toBe(1440);
    });

    it('should correctly convert total minutes back to HH:MM format', () => {
      expect(minutesToTime(0)).toBe('00:00');
      expect(minutesToTime(510)).toBe('08:30');
      expect(minutesToTime(720)).toBe('12:00');
      expect(minutesToTime(1439)).toBe('23:59');
      expect(minutesToTime(1440)).toBe('24:00');
    });

    it('should round-trip time conversions without loss', () => {
      const times = ['01:15', '07:45', '14:30', '18:00', '22:10'];
      times.forEach(t => {
        expect(minutesToTime(timeToMinutes(t))).toBe(t);
      });
    });
  });

  describe('formatDuration helper', () => {
    it('should format minutes under 60 correctly in Vietnamese and English', () => {
      expect(formatDuration(25, 'vi')).toBe('25 phút');
      expect(formatDuration(25, 'en')).toBe('25 min');
      expect(formatDuration(0, 'vi')).toBe('0 phút');
    });

    it('should format exact hours without minutes', () => {
      expect(formatDuration(60, 'vi')).toBe('1 giờ');
      expect(formatDuration(60, 'en')).toBe('1h');
      expect(formatDuration(120, 'vi')).toBe('2 giờ');
      expect(formatDuration(120, 'en')).toBe('2h');
    });

    it('should format compound hours and minutes', () => {
      expect(formatDuration(90, 'vi')).toBe('1h 30p');
      expect(formatDuration(90, 'en')).toBe('1h 30m');
      expect(formatDuration(145, 'vi')).toBe('2h 25p');
      expect(formatDuration(145, 'en')).toBe('2h 25m');
    });
  });

  describe('Overlapping Interval Resolution & Free Time Slot Algorithms', () => {
    it('should correctly determine free time slots between fixed events', () => {
      const fixedEvents = [
        { start: '08:00', end: '09:00' },
        { start: '12:00', end: '13:00' }
      ];

      // Convert fixed events to occupied minute intervals
      const occupied = fixedEvents.map(e => ({
        startMins: timeToMinutes(e.start),
        endMins: timeToMinutes(e.end)
      })).sort((a, b) => a.startMins - b.startMins);

      // Find free slots in 24h (0 to 1440)
      const freeSlots = [];
      let currentMins = 0;

      for (const block of occupied) {
        if (block.startMins > currentMins) {
          freeSlots.push({
            startMins: currentMins,
            endMins: block.startMins,
            duration: block.startMins - currentMins
          });
        }
        currentMins = Math.max(currentMins, block.endMins);
      }
      if (currentMins < 1440) {
        freeSlots.push({
          startMins: currentMins,
          endMins: 1440,
          duration: 1440 - currentMins
        });
      }

      expect(freeSlots).toHaveLength(3);
      expect(freeSlots[0]).toEqual({ startMins: 0, endMins: 480, duration: 480 }); // 00:00 - 08:00
      expect(freeSlots[1]).toEqual({ startMins: 540, endMins: 720, duration: 180 }); // 09:00 - 12:00
      expect(freeSlots[2]).toEqual({ startMins: 780, endMins: 1440, duration: 660 }); // 13:00 - 24:00
    });
  });
});
