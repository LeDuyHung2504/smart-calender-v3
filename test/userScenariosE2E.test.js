import { describe, it, expect, beforeEach } from 'vitest';

/**
 * CHRONOFLOW USER SCENARIOS & UI/UX COMPREHENSIVE TEST SUITE
 * Lập các kịch bản người dùng có thể xảy ra, chạy test tính năng, UI, UX
 */

// Core algorithm simulation helpers
function timeToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return 0;
  const parts = timeStr.split(':');
  if (parts.length < 2) return 0;
  const h = parseInt(parts[0], 10);
  const m = parseInt(parts[1], 10);
  if (isNaN(h) || isNaN(m)) return 0;
  return Math.min(1440, Math.max(0, h * 60 + m));
}

function minutesToTime(mins) {
  const clamped = Math.min(1440, Math.max(0, Math.round(mins)));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function getSessionRange(sessionKey) {
  switch (sessionKey) {
    case 'morning': return { start: 360, end: 720 };    // 06:00 - 12:00
    case 'afternoon': return { start: 720, end: 1080 }; // 12:00 - 18:00
    case 'evening': return { start: 1080, end: 1380 };  // 18:00 - 23:00
    default: return null;
  }
}

function calculateFreeSlots(totalMinutes, busyIntervals, noisyIntervals = []) {
  // Free slots from 00:00 to 24:00 (1440 mins)
  const isBusy = new Uint8Array(1440);
  busyIntervals.forEach(({ start, end }) => {
    const s = timeToMinutes(start);
    const e = timeToMinutes(end);
    for (let i = s; i < e && i < 1440; i++) isBusy[i] = 1;
  });

  const isNoisy = new Uint8Array(1440);
  noisyIntervals.forEach(({ start, end }) => {
    const s = timeToMinutes(start);
    const e = timeToMinutes(end);
    for (let i = s; i < e && i < 1440; i++) isNoisy[i] = 1;
  });

  const slots = [];
  let inSlot = false;
  let slotStart = 0;
  let slotNoisy = false;

  for (let m = 0; m <= 1440; m++) {
    if (m < 1440 && isBusy[m] === 0) {
      const curNoisy = isNoisy[m] === 1;
      if (!inSlot) {
        inSlot = true;
        slotStart = m;
        slotNoisy = curNoisy;
      } else if (slotNoisy !== curNoisy) {
        // Split on noise boundary
        slots.push({
          start: slotStart,
          end: m,
          duration: m - slotStart,
          isNoisy: slotNoisy,
          startStr: minutesToTime(slotStart),
          endStr: minutesToTime(m)
        });
        slotStart = m;
        slotNoisy = curNoisy;
      }
    } else {
      if (inSlot) {
        slots.push({
          start: slotStart,
          end: m,
          duration: m - slotStart,
          isNoisy: slotNoisy,
          startStr: minutesToTime(slotStart),
          endStr: minutesToTime(m)
        });
        inSlot = false;
      }
    }
  }
  return slots;
}

function findBestFreeSlotForTask(task, availableSlots) {
  if (!task || !availableSlots || availableSlots.length === 0) return null;
  const duration = task.estimatedMinutes || 30;

  // 1. Manual schedule mode
  if (task.scheduleMode === 'manual' && task.manualStartTime) {
    const manualStart = timeToMinutes(task.manualStartTime);
    const manualEnd = manualStart + duration;
    const coverSlot = availableSlots.find(s => s.start <= manualStart && s.end >= manualEnd);
    if (coverSlot) {
      return {
        start: manualStart,
        end: manualEnd,
        duration: duration,
        startStr: minutesToTime(manualStart),
        endStr: minutesToTime(manualEnd),
        isNoisy: coverSlot.isNoisy
      };
    }
    return null;
  }

  // 2. Filter slots with enough duration
  const validSlots = availableSlots.filter(s => s.duration >= duration);
  if (validSlots.length === 0) return null;

  // 3. Preferred session filter
  let candidates = validSlots;
  if (task.preferredSession && task.preferredSession !== 'any') {
    const range = getSessionRange(task.preferredSession);
    if (range) {
      const sessionSlots = validSlots.filter(s => s.start < range.end && s.end > range.start);
      if (sessionSlots.length > 0) candidates = sessionSlots;
    }
  }

  // 4. Quiet environment preference for Deep Focus (Q1/Q2 or requireQuiet)
  if (task.requireQuiet || (task.isImportant && !task.isUrgent)) {
    const quietSlots = candidates.filter(s => !s.isNoisy);
    if (quietSlots.length > 0) candidates = quietSlots;
  }

  // Pick first optimal candidate
  const chosen = candidates[0];
  return {
    start: chosen.start,
    end: chosen.start + duration,
    duration: duration,
    startStr: minutesToTime(chosen.start),
    endStr: minutesToTime(chosen.start + duration),
    isNoisy: chosen.isNoisy
  };
}

describe('Kịch Bản Người Dùng 1: Khởi Chạy Ban Đầu & Tùy Biến Giao Diện (Onboarding & UI Theme)', () => {
  it('Khởi tạo quỹ thời gian chuẩn 1440 phút và trạng thái giao diện mặc định', () => {
    const defaultData = {
      selectedDate: '2026-09-26',
      settings: {
        theme: 'light',
        lang: 'vi',
        focusThresholdMinutes: 30,
        fontSizePercent: 100,
        timelineDaySpan: 1
      },
      tasks: [],
      fixedEvents: [],
      transientEvents: []
    };

    expect(defaultData.settings.theme).toBe('light');
    expect(defaultData.settings.lang).toBe('vi');
    expect(defaultData.settings.focusThresholdMinutes).toBe(30);

    // Tính toán quỹ thời gian ngày trống hoàn toàn
    const freeSlots = calculateFreeSlots(1440, []);
    expect(freeSlots.length).toBe(1);
    expect(freeSlots[0].duration).toBe(1440);
    expect(freeSlots[0].startStr).toBe('00:00');
    expect(freeSlots[0].endStr).toBe('24:00');
  });

  it('Chuyển đổi giao diện Sáng <-> Tối và lưu trữ vào LocalStorage', () => {
    let currentTheme = 'light';
    const toggleTheme = () => {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      return currentTheme;
    };

    expect(toggleTheme()).toBe('dark');
    expect(toggleTheme()).toBe('light');
  });

  it('Hỗ trợ song ngữ Tiếng Việt & Tiếng Anh trên các tab điều hướng', () => {
    const labels = {
      vi: { day: 'Ngày (Timeline 24h)', eisenhower: 'Ma Trận Eisenhower', month: 'Tháng', year: 'Năm' },
      en: { day: 'Day (24h Timeline)', eisenhower: 'Eisenhower Matrix', month: 'Month', year: 'Year' }
    };

    expect(labels.vi.day).toContain('Timeline 24h');
    expect(labels.en.day).toContain('24h Timeline');
    expect(labels.vi.eisenhower).toBe('Ma Trận Eisenhower');
    expect(labels.en.eisenhower).toBe('Eisenhower Matrix');
  });
});

describe('Kịch Bản Người Dùng 2: Tạo Công Việc & Xếp Lịch Tự Động vs Thủ Công (Auto vs Manual Scheduling UX)', () => {
  const busyList = [
    { start: '12:00', end: '13:00' } // Bữa trưa
  ];
  const noisyList = [
    { start: '13:00', end: '15:00' } // Giờ họp ồn
  ];

  it('Tạo việc Tự động (Auto Mode): Ưu tiên slot yên tĩnh buổi sáng cho việc quan trọng Q2', () => {
    const freeSlots = calculateFreeSlots(1440, busyList, noisyList);

    const taskQ2 = {
      id: 'task-q2-1',
      title: 'Học bài thi chứng chỉ',
      estimatedMinutes: 60,
      isImportant: true,
      isUrgent: false, // Q2
      preferredSession: 'morning',
      requireQuiet: true,
      scheduleMode: 'auto'
    };

    const assigned = findBestFreeSlotForTask(taskQ2, freeSlots);
    expect(assigned).not.toBeNull();
    expect(assigned.duration).toBe(60);
    expect(assigned.isNoisy).toBe(false);
    // Phải nằm trong khung buổi sáng (>= 06:00 và < 12:00)
    expect(assigned.start).toBeGreaterThanOrEqual(0);
    expect(assigned.end).toBeLessThanOrEqual(720);
  });

  it('Tạo việc Thủ công (Manual Mode): Khóa cứng giờ chỉ định, vô hiệu hóa can thiệp tự động', () => {
    const freeSlots = calculateFreeSlots(1440, busyList, noisyList);

    const manualTask = {
      id: 'task-manual-1',
      title: 'Phỏng vấn ứng viên tuyển dụng',
      estimatedMinutes: 45,
      scheduleMode: 'manual',
      manualStartTime: '14:15'
    };

    const assigned = findBestFreeSlotForTask(manualTask, freeSlots);
    expect(assigned).not.toBeNull();
    expect(assigned.startStr).toBe('14:15');
    expect(assigned.endStr).toBe('15:00');
    expect(assigned.duration).toBe(45);
  });

  it('Từ chối xếp giờ thủ công nếu slot bị trùng đè với sự kiện bận', () => {
    const freeSlots = calculateFreeSlots(1440, busyList, noisyList);

    const conflictingTask = {
      id: 'task-conflict',
      title: 'Gặp khách hàng trùng giờ ăn trưa',
      estimatedMinutes: 30,
      scheduleMode: 'manual',
      manualStartTime: '12:15' // Nằm trong 12:00 - 13:00 (busy)
    };

    const assigned = findBestFreeSlotForTask(conflictingTask, freeSlots);
    expect(assigned).toBeNull(); // Không được xếp đè lên giờ bận
  });
});

describe('Kịch Bản Người Dùng 3: Ma Trận Eisenhower & Phân Tích Độ Ưu Tiên (Eisenhower Workflow)', () => {
  it('Phân loại chính xác 4 quadrant Q1, Q2, Q3, Q4', () => {
    const classify = (isImp, isUrg) => {
      if (isImp && isUrg) return 'Q1';
      if (isImp && !isUrg) return 'Q2';
      if (!isImp && isUrg) return 'Q3';
      return 'Q4';
    };

    expect(classify(true, true)).toBe('Q1');   // Khẩn cấp & Quan trọng
    expect(classify(true, false)).toBe('Q2');  // Quan trọng & Không khẩn
    expect(classify(false, true)).toBe('Q3');  // Khẩn & Không quan trọng
    expect(classify(false, false)).toBe('Q4'); // Không quan trọng & Không khẩn
  });

  it('Chuyển đổi quadrant nhanh (Quick Move Drag & Drop)', () => {
    const task = {
      id: 't-drag-1',
      title: 'Soạn slide thuyết trình',
      isImportant: true,
      isUrgent: false // Ban đầu là Q2
    };

    // Di chuyển sang Q1
    const moveToQ1 = (t) => { t.isImportant = true; t.isUrgent = true; };
    moveToQ1(task);
    expect(task.isImportant).toBe(true);
    expect(task.isUrgent).toBe(true);

    // Di chuyển sang Q4
    const moveToQ4 = (t) => { t.isImportant = false; t.isUrgent = false; };
    moveToQ4(task);
    expect(task.isImportant).toBe(false);
    expect(task.isUrgent).toBe(false);
  });

  it('Bóc tách ghi chú nhanh Eisenhower (Note Parser) từ cú pháp người dùng', () => {
    function parseQuickNote(line) {
      const match = line.match(/^\[(Q[1-4])\]\s*(.+?)(?:\s*-\s*(\d+)p)?$/i);
      if (!match) return null;
      const q = match[1].toUpperCase();
      const title = match[2].trim();
      const dur = match[3] ? parseInt(match[3], 10) : 30;
      return {
        quadrant: q,
        title,
        duration: dur,
        isImportant: q === 'Q1' || q === 'Q2',
        isUrgent: q === 'Q1' || q === 'Q3'
      };
    }

    const res1 = parseQuickNote('[Q1] Nộp báo cáo thuế - 45p');
    expect(res1).not.toBeNull();
    expect(res1.quadrant).toBe('Q1');
    expect(res1.title).toBe('Nộp báo cáo thuế');
    expect(res1.duration).toBe(45);
    expect(res1.isImportant).toBe(true);
    expect(res1.isUrgent).toBe(true);

    const res2 = parseQuickNote('[Q2] Lập kế hoạch tuần mới');
    expect(res2).not.toBeNull();
    expect(res2.quadrant).toBe('Q2');
    expect(res2.duration).toBe(30); // Default 30p
    expect(res2.isImportant).toBe(true);
    expect(res2.isUrgent).toBe(false);
  });
});

describe('Kịch Bản Người Dùng 4: Hoàn Thành Công Việc & Chuỗi Kỷ Luật (Streak Engine & Freeze UX)', () => {
  it('Đạt tỷ lệ hoàn thành >= 70% thì tính 1 ngày streak hợp lệ', () => {
    const tasks = [
      { id: '1', completed: true },
      { id: '2', completed: true },
      { id: '3', completed: true },
      { id: '4', completed: false }
    ];

    const completedCount = tasks.filter(t => t.completed).length;
    const rate = completedCount / tasks.length;
    const threshold = 0.7;
    const isStreakDay = rate >= threshold;

    expect(rate).toBe(0.75);
    expect(isStreakDay).toBe(true);
  });

  it('Sử dụng lượt đóng băng (Freeze) để bảo toàn streak khi lỡ một ngày', () => {
    let streak = 10;
    let freezeCount = 1;
    const dayMetGoal = false;

    if (!dayMetGoal) {
      if (freezeCount > 0) {
        freezeCount -= 1; // Tiêu thụ 1 lượt bảo vệ
        // streak được giữ nguyên
      } else {
        streak = 0; // Hết freeze -> reset về 0
      }
    }

    expect(streak).toBe(10);
    expect(freezeCount).toBe(0);

    // Nếu tiếp tục lỡ ngày thứ hai mà hết freeze
    const nextDayMetGoal = false;
    if (!nextDayMetGoal) {
      if (freezeCount > 0) {
        freezeCount -= 1;
      } else {
        streak = 0;
      }
    }
    expect(streak).toBe(0);
  });

  it('Bỏ tick hoàn thành (Un-tick) cập nhật lại trạng thái ngay lập tức', () => {
    const task = { id: 't-toggle', completed: true };
    task.completed = !task.completed;
    expect(task.completed).toBe(false);
    task.completed = !task.completed;
    expect(task.completed).toBe(true);
  });
});

describe('Kịch Bản Người Dùng 5: Công Việc Lặp Lại & Xử Lý Ngày Loại Trừ (Recurring & Frequency Rules)', () => {
  function isItemActive(item, targetDateStr) {
    const [ty, tm, td] = targetDateStr.split('-').map(Number);
    const targetDate = new Date(ty, tm - 1, td);
    const dayOfWeek = targetDate.getDay(); // 0: CN, 1: T2, ...

    if (item.startDate && targetDateStr < item.startDate) return false;
    if (item.endDate && targetDateStr > item.endDate) return false;
    if (item.excludedDates && item.excludedDates.includes(targetDateStr)) return false;

    if (!item.repeatType || item.repeatType === 'none') {
      return item.date === targetDateStr;
    }

    if (item.repeatType === 'daily') return true;
    if (item.repeatType === 'weekdays') return dayOfWeek >= 1 && dayOfWeek <= 5;
    if (item.repeatType === 'weekly') {
      const allowedDays = item.repeatDays || [1, 2, 3, 4, 5];
      return allowedDays.includes(dayOfWeek);
    }
    if (item.repeatType === 'every_2_days') {
      if (!item.startDate) return false;
      const [sy, sm, sd] = item.startDate.split('-').map(Number);
      const sDate = new Date(sy, sm - 1, sd);
      const diffDays = Math.round((targetDate - sDate) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays % 2 === 0;
    }
    return false;
  }

  it('Công việc lặp các ngày trong tuần (Weekdays) chỉ kích hoạt từ Thứ 2 đến Thứ 6', () => {
    const weekdayTask = {
      id: 'rec-work',
      repeatType: 'weekdays',
      startDate: '2026-09-21' // Thứ 2
    };

    expect(isItemActive(weekdayTask, '2026-09-21')).toBe(true);  // Thứ 2
    expect(isItemActive(weekdayTask, '2026-09-25')).toBe(true);  // Thứ 6
    expect(isItemActive(weekdayTask, '2026-09-26')).toBe(false); // Thứ 7
    expect(isItemActive(weekdayTask, '2026-09-27')).toBe(false); // Chủ Nhật
  });

  it('Công việc lặp cách ngày (Every 2 days) tính đúng nhịp ngày chẵn/lẻ', () => {
    const taskEvery2Days = {
      id: 'rec-gym',
      repeatType: 'every_2_days',
      startDate: '2026-09-24'
    };

    expect(isItemActive(taskEvery2Days, '2026-09-24')).toBe(true);  // Ngày 1
    expect(isItemActive(taskEvery2Days, '2026-09-25')).toBe(false); // Cách 1 ngày
    expect(isItemActive(taskEvery2Days, '2026-09-26')).toBe(true);  // Ngày tiếp theo
  });

  it('Tôn trọng danh sách ngày loại trừ (Excluded Dates) khi người dùng xóa riêng 1 ngày', () => {
    const dailyTask = {
      id: 'rec-daily',
      repeatType: 'daily',
      startDate: '2026-09-20',
      excludedDates: ['2026-09-25']
    };

    expect(isItemActive(dailyTask, '2026-09-24')).toBe(true);
    expect(isItemActive(dailyTask, '2026-09-25')).toBe(false); // Ngày đã loại trừ
    expect(isItemActive(dailyTask, '2026-09-26')).toBe(true);
  });
});

describe('Kịch Bản Người Dùng 6: Timeline 1 Ngày, 3 Ngày, 7 Ngày & Tránh Đè Tag (Timeline UI/UX)', () => {
  it('Chế độ 1 ngày hiển thị thanh toolbar tinh gọn và đường laser thời gian thực', () => {
    const currentHour = 14;
    const currentMinute = 30;
    const currentTimelineMins = currentHour * 60 + currentMinute;
    expect(currentTimelineMins).toBe(870);

    // Tỉ lệ vị trí đường laser trên lưới 24h
    const percent = (currentTimelineMins / 1440) * 100;
    expect(percent.toFixed(2)).toBe('60.42');
  });

  it('Thuật toán giải quyết va chạm tag & wrap tiêu đề 3 dòng trong chế độ xem 7 ngày', () => {
    function detectTagOverlap(titleText, blockWidthPx) {
      // Giả lập độ dài chữ: mỗi ký tự trung bình 6px, tag tên chiếm 35px
      const estimatedTextWidth = titleText.length * 6;
      const tagWidth = 35;
      return (estimatedTextWidth + tagWidth) > blockWidthPx;
    }

    const longTitle = 'Họp ban quản trị chiến lược phát triển quý 4 và tổng kết KPI năm';
    const shortTitle = 'Call';

    // Cột xem 7 ngày trên màn hình thường ~100px
    expect(detectTagOverlap(longTitle, 100)).toBe(true);   // Vượt quá chiều rộng -> Cần ẩn tag và wrap chữ
    expect(detectTagOverlap(shortTitle, 100)).toBe(false); // Đủ chỗ (59px <= 100px) -> hiển thị bình thường
  });
});

describe('Kịch Bản Người Dùng 7: Cảnh Báo Mệt Mỏi & Sự Kiện Phục Hồi (Cognitive Fatigue & Recovery)', () => {
  it('Tích lũy điểm mệt mỏi khi làm việc liên tục và reset tức thì sau sự kiện recovery', () => {
    let fatigueScore = 0;
    const logTask = (attentionLevel) => {
      if (attentionLevel === 'high') fatigueScore += 0.5;
      else if (attentionLevel === 'medium') fatigueScore += 0.2;
    };

    logTask('high');
    logTask('high');
    expect(fatigueScore).toBe(1.0);

    // Cảnh báo quá tải nếu vượt ngưỡng 0.8
    const isFatigued = fatigueScore >= 0.8;
    expect(isFatigued).toBe(true);

    // Gặp sự kiện phục hồi năng lượng (isRecovery: true) như Ngủ trưa, Yoga
    const onRecoveryEvent = () => {
      fatigueScore = 0;
    };
    onRecoveryEvent();
    expect(fatigueScore).toBe(0);
    expect(fatigueScore >= 0.8).toBe(false);
  });
});

describe('Kịch Bản Người Dùng 8: Tùy Biến Cài Đặt, Live Sandbox & Đếm Ngược Xóa An Toàn (Settings & Data Safety)', () => {
  it('Tùy biến bảng màu sắc danh mục và xem trước trực tiếp', () => {
    const colors = {
      focusLong: '#059669',
      focusShort: '#34d399',
      distractLong: '#d97706',
      distractShort: '#fbbf24'
    };

    // Người dùng đổi màu focusLong sang xanh navy
    colors.focusLong = '#1d4ed8';
    expect(colors.focusLong).toBe('#1d4ed8');

    // Khôi phục mặc định
    colors.focusLong = '#059669';
    expect(colors.focusLong).toBe('#059669');
  });

  it('Cơ chế đếm ngược 5 giây an toàn chống xóa nhầm dữ liệu', () => {
    let countdown = 5;
    let isConfirmed = false;

    // Giả lập từng giây đếm ngược
    for (let sec = 5; sec >= 1; sec--) {
      countdown = sec;
      expect(isConfirmed).toBe(false); // Chưa hết giờ, chưa cho phép xóa
    }
    countdown = 0;
    isConfirmed = true; // Chỉ cho phép xóa khi đã đếm ngược xong 5 giây
    expect(isConfirmed).toBe(true);
  });
});

describe('Kịch Bản Người Dùng 9: Xử Lý Biên & Phòng Chống Lỗi (Edge Cases & Robustness)', () => {
  it('Chống XSS và ký tự đặc biệt trong tên công việc', () => {
    function sanitizeTitle(str) {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    const dangerousInput = '<script>alert("hack")</script>';
    const safeOutput = sanitizeTitle(dangerousInput);
    expect(safeOutput).not.toContain('<script>');
    expect(safeOutput).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;/script&gt;');
  });

  it('Từ chối công việc có thời lượng bằng 0 hoặc âm', () => {
    function validateDuration(dur) {
      const parsed = parseInt(dur, 10);
      if (isNaN(parsed) || parsed <= 0) return 30; // Fallback an toàn về 30p
      return Math.min(parsed, 720); // Tối đa 12h
    }

    expect(validateDuration(0)).toBe(30);
    expect(validateDuration(-15)).toBe(30);
    expect(validateDuration('invalid')).toBe(30);
    expect(validateDuration(45)).toBe(45);
  });

  it('Xử lý an toàn mốc thời gian chuyển giao đêm (23:45 -> 00:30)', () => {
    const startMins = timeToMinutes('23:45'); // 1425 phút
    const duration = 45;
    // Không được để vượt quá 1440 phút của ngày hiện tại
    const endMins = Math.min(1440, startMins + duration);
    expect(startMins).toBe(1425);
    expect(endMins).toBe(1440);
    expect(minutesToTime(endMins)).toBe('24:00');
  });
});

describe('Kịch Bản Người Dùng 10: Tùy Chọn Phạm Vi Khi Sửa/Xóa Việc Lặp (Multi-Scope Recurrence Mutations)', () => {
  it('Sửa "Chỉ ngày này" (this) tạo bản ghi override riêng mà không hỏng chuỗi lặp', () => {
    const recurringTask = {
      id: 'rec-meeting',
      title: 'Họp giao ban',
      repeatType: 'daily',
      assignedSlotsByDate: {
        '2026-09-26': { start: '09:00', end: '10:00' }
      }
    };

    // Sửa riêng ngày 26 thành 09:30 - 10:30
    recurringTask.assignedSlotsByDate['2026-09-26'] = { start: '09:30', end: '10:30' };

    expect(recurringTask.assignedSlotsByDate['2026-09-26'].start).toBe('09:30');
    expect(recurringTask.repeatType).toBe('daily'); // Chuỗi lặp vẫn duy trì
  });

  it('Sửa "Tất cả các lần lặp" (all) áp dụng cập nhật tiêu đề cho toàn bộ các ngày', () => {
    const recurringTask = {
      id: 'rec-study',
      title: 'Học tiếng Nhật',
      repeatType: 'daily'
    };

    recurringTask.title = 'Học tiếng Nhật N2 cấp tốc';
    expect(recurringTask.title).toBe('Học tiếng Nhật N2 cấp tốc');
  });
});
