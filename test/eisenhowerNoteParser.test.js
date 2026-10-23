import { describe, it, expect } from 'vitest';

/**
 * Pure parsing logic for Eisenhower Task Notes
 */
export function parseTaskNote(note) {
  if (!note || typeof note !== 'string' || note.trim().length === 0) {
    return {
      isEmpty: true,
      isStructured: false,
      previewLines: [],
      allLines: [],
      hasMore: false,
      totalDashCount: 0
    };
  }

  const rawLines = note.split('\n');
  const dashLines = [];
  const allLines = [];

  for (const line of rawLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    allLines.push(line);
    if (/^[-–—]/.test(trimmed)) {
      dashLines.push(line);
    }
  }

  const isStructured = dashLines.length > 0;

  if (isStructured) {
    const previewLines = dashLines.slice(0, 3);
    // Has more if there are more than 3 dash lines, OR if there are sub-items (+) or other lines
    const hasMore = dashLines.length > 3 || allLines.some(l => /^\s*\+/.test(l)) || allLines.length > previewLines.length;
    return {
      isEmpty: false,
      isStructured: true,
      previewLines,
      allLines,
      hasMore,
      totalDashCount: dashLines.length
    };
  } else {
    // Unstructured: fallback to first 3 non-empty lines
    const previewLines = allLines.slice(0, 3);
    const hasMore = allLines.length > 3;
    return {
      isEmpty: false,
      isStructured: false,
      previewLines,
      allLines,
      hasMore,
      totalDashCount: 0
    };
  }
}

describe('Eisenhower Task Note Parsing & Collapse/Expand Suite', () => {
  describe('Empty or whitespace note', () => {
    it('should detect empty note and set isEmpty: true', () => {
      expect(parseTaskNote('')).toEqual({
        isEmpty: true,
        isStructured: false,
        previewLines: [],
        allLines: [],
        hasMore: false,
        totalDashCount: 0
      });
      expect(parseTaskNote(null).isEmpty).toBe(true);
      expect(parseTaskNote('   \n  \n ').isEmpty).toBe(true);
    });
  });

  describe('Structured note with main dashes (-) and sub-items (+)', () => {
    const structuredNote = `- to do list (30P)
  + kiểm tra các mục tiêu cần thực hiện
  + vạch ra các việc cần làm để đạt mục tiêu
  + viết các việc này vào ma trận eisenhower
  + xếp chúng vào các khoảng thời gian phù hợp

- Viết journal (15P)
  + ngày hôm nay thế nào? (tốt, ổn, may,...)
  + suy nghĩ lung tung?

- Đọc sách 20 trang
  + Chương 3: Thói quen nguyên tử

- Ôn lại từ vựng tiếng Anh
  + Flashcard 50 từ`;

    it('should identify as structured and extract exactly 3 dash lines for preview', () => {
      const parsed = parseTaskNote(structuredNote);
      expect(parsed.isEmpty).toBe(false);
      expect(parsed.isStructured).toBe(true);
      expect(parsed.totalDashCount).toBe(4);
      expect(parsed.previewLines).toHaveLength(3);
      expect(parsed.previewLines[0]).toContain('to do list (30P)');
      expect(parsed.previewLines[1]).toContain('Viết journal (15P)');
      expect(parsed.previewLines[2]).toContain('Đọc sách 20 trang');
      expect(parsed.hasMore).toBe(true);
    });

    it('should show hasMore = true if <= 3 dashes but sub-items (+) exist', () => {
      const noteWith2DashesAndSubitems = `- Mục chính 1
  + Chi tiết con 1
  + Chi tiết con 2
- Mục chính 2
  + Chi tiết con 3`;
      const parsed = parseTaskNote(noteWith2DashesAndSubitems);
      expect(parsed.isStructured).toBe(true);
      expect(parsed.previewLines).toHaveLength(2);
      expect(parsed.hasMore).toBe(true); // sub-items are hidden in collapsed view
    });

    it('should show hasMore = false if <= 3 dashes and NO sub-items', () => {
      const shortStructured = `- Mục chính 1\n- Mục chính 2\n- Mục chính 3`;
      const parsed = parseTaskNote(shortStructured);
      expect(parsed.isStructured).toBe(true);
      expect(parsed.previewLines).toHaveLength(3);
      expect(parsed.hasMore).toBe(false);
    });
  });

  describe('Unstructured note (no dashes)', () => {
    it('should fallback to first 3 non-empty lines when not structured', () => {
      const plainNote = `Dòng ghi chú 1
Dòng ghi chú 2
Dòng ghi chú 3
Dòng ghi chú 4
Dòng ghi chú 5`;
      const parsed = parseTaskNote(plainNote);
      expect(parsed.isStructured).toBe(false);
      expect(parsed.previewLines).toHaveLength(3);
      expect(parsed.previewLines[0]).toBe('Dòng ghi chú 1');
      expect(parsed.previewLines[1]).toBe('Dòng ghi chú 2');
      expect(parsed.previewLines[2]).toBe('Dòng ghi chú 3');
      expect(parsed.hasMore).toBe(true);
      expect(parsed.allLines).toHaveLength(5);
    });

    it('should show hasMore = false when unstructured has <= 3 lines', () => {
      const shortPlain = `Dòng 1\nDòng 2`;
      const parsed = parseTaskNote(shortPlain);
      expect(parsed.isStructured).toBe(false);
      expect(parsed.previewLines).toHaveLength(2);
      expect(parsed.hasMore).toBe(false);
    });
  });
});
