import { describe, it, expect, beforeEach } from 'vitest';

describe('ChronoFlow Changelog Manager & Quick Paste Parser', () => {
  let changelogs = [];

  const INITIAL_CHANGELOGS = [
    {
      id: 'ver-1-1-0',
      version: 'v1.1.0',
      date: '26/09/2026',
      tag: 'Fix & Feature',
      isLatest: true,
      title: 'Khắc phục triệt để hiện tượng giật màn hình Timeline & Giữ nguyên vị trí cuộn khi tương tác Task',
      items: [
        'Loại bỏ chớp giật Timeline khi đồng hồ nhảy phút.',
        'Giữ nguyên vị trí cuộn thanh bên trái, timeline và ma trận Eisenhower.'
      ]
    },
    {
      id: 'ver-1-0-1',
      version: 'v1.0.1',
      date: 'Tháng 09/2026',
      tag: 'UI Polish',
      isLatest: false,
      title: 'Tối Ưu Giao Diện, Loại Bỏ Icon Rườm Rà',
      items: [
        'Bộ Icon Phẳng SVG Siêu Nhẹ.',
        'Triệt Tiêu Emoji Trang Trí.'
      ]
    }
  ];

  function parseQuickChangelogText(rawText, defaultVersion = 'v1.1.1') {
    const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length === 0) return null;

    let version = defaultVersion;
    let dateStr = new Date().toLocaleDateString('vi-VN');
    let tag = 'Tính năng mới';
    let title = '';
    const items = [];

    // Check first line for format: vX.Y.Z | Date | Tag
    const firstLine = lines[0];
    const versionMatch = firstLine.match(/v\d+\.\d+(\.\d+)?/i);
    let startIndex = 0;

    if (versionMatch) {
      version = versionMatch[0];
      const parts = firstLine.split('|').map(p => p.trim());
      if (parts.length >= 2) dateStr = parts[1];
      if (parts.length >= 3) tag = parts[2];
      startIndex = 1;
    }

    // Process remaining lines
    for (let i = startIndex; i < lines.length; i++) {
      const line = lines[i];
      // Check if bullet point
      const bulletMatch = line.match(/^[-*•\d+.]\s*(.+)$/);
      if (bulletMatch) {
        items.push(bulletMatch[1]);
      } else if (!title) {
        title = line;
      } else {
        items.push(line);
      }
    }

    if (!title && items.length > 0) {
      title = items[0];
    }

    return {
      id: 'ver-' + version.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + Date.now(),
      version,
      date: dateStr,
      tag,
      isLatest: true,
      title: title || `Cập nhật ${version}`,
      items: items.length > 0 ? items : [title]
    };
  }

  function addChangelog(newLog) {
    changelogs.forEach(c => { c.isLatest = false; });
    newLog.isLatest = true;
    changelogs.unshift(newLog);
    return changelogs;
  }

  function generateSourceCodeSnippet(list) {
    return `const INITIAL_CHANGELOGS = ${JSON.stringify(list, null, 2)};`;
  }

  beforeEach(() => {
    changelogs = JSON.parse(JSON.stringify(INITIAL_CHANGELOGS));
  });

  it('TC01: Phân tích nhanh văn bản copy-paste thành cấu trúc phiên bản hoàn chỉnh', () => {
    const rawInput = `v1.2.0 | 27/09/2026 | Tính năng mới
Nâng cấp hiệu năng và bổ sung phím tắt
- Thêm phím tắt Ctrl+S để lưu tức thì
- Tối ưu hóa render danh sách công việc
- Bổ sung bộ lọc theo mức độ tập trung`;

    const parsed = parseQuickChangelogText(rawInput);
    expect(parsed.version).toBe('v1.2.0');
    expect(parsed.date).toBe('27/09/2026');
    expect(parsed.tag).toBe('Tính năng mới');
    expect(parsed.title).toBe('Nâng cấp hiệu năng và bổ sung phím tắt');
    expect(parsed.items.length).toBe(3);
    expect(parsed.items[0]).toBe('Thêm phím tắt Ctrl+S để lưu tức thì');
  });

  it('TC02: Phân tích văn bản chỉ có các gạch đầu dòng mà không có header', () => {
    const rawInput = `- Sửa lỗi hiển thị trên thiết bị di động
- Cải thiện độ tương phản màu sắc
- Tối ưu hóa bộ nhớ đệm`;

    const parsed = parseQuickChangelogText(rawInput, 'v1.1.2');
    expect(parsed.version).toBe('v1.1.2');
    expect(parsed.items.length).toBe(3);
    expect(parsed.items[0]).toBe('Sửa lỗi hiển thị trên thiết bị di động');
  });

  it('TC03: Thêm phiên bản mới vào danh sách và tự động chuyển cờ isLatest', () => {
    const newEntry = {
      id: 'ver-1-2-0',
      version: 'v1.2.0',
      date: '27/09/2026',
      tag: 'Feature',
      title: 'New Feature Release',
      items: ['Item 1', 'Item 2']
    };

    addChangelog(newEntry);
    expect(changelogs.length).toBe(3);
    expect(changelogs[0].version).toBe('v1.2.0');
    expect(changelogs[0].isLatest).toBe(true);
    expect(changelogs[1].version).toBe('v1.1.0');
    expect(changelogs[1].isLatest).toBe(false);
  });

  it('TC04: Xuất mã nguồn JavaScript chuẩn (Export Source Code Snippet) để dán trực tiếp vào file mã nguồn', () => {
    const snippet = generateSourceCodeSnippet(changelogs);
    expect(snippet).toContain('const INITIAL_CHANGELOGS = [');
    expect(snippet).toContain('"version": "v1.1.0"');
    expect(snippet).toContain('"version": "v1.0.1"');
  });
});
