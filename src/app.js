/**
 * ChronoFlow - Quản lý thời gian & Lịch biểu cá nhân
 * Vanilla JavaScript thuần - Hoạt động offline 100% với LocalStorage
 * Hỗ trợ Đa ngôn ngữ (Tiếng Việt & English)
 */

// Global accessor and variable for isEn
var isEn = false;
try {
  const globalTarget = typeof globalThis !== 'undefined' ? globalThis : (typeof window !== 'undefined' ? window : this);
  if (globalTarget) {
    Object.defineProperty(globalTarget, 'isEn', {
      get() {
        return typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
      },
      set(val) {
        if (typeof appState !== 'undefined' && appState?.settings) {
          appState.settings.lang = val ? 'en' : 'vi';
        }
      },
      configurable: true,
      enumerable: true
    });
  }
} catch (e) {}

// ==========================================
// 1. DICTIONARY ĐA NGÔN NGỮ (i18n)
// ==========================================
const translations = {
  vi: {
    brandSubtitle: 'Google & Samsung Calendar Style • 100% Offline',
    navYear: 'Năm',
    navMonth: 'Tháng',
    navDay: 'Ngày (Timeline 24h)',
    navEisenhower: 'Ma Trận Eisenhower',
    navSettings: 'Cài Đặt',
    btnAddTask: 'Thêm Task',
    
    // Sidebar
    dailyGoal: 'Mục Tiêu Ngày',
    dailyNotes: 'Ghi Chú Lịch',
    addNote: 'Ghi Chú',
    noDailyGoal: 'Chưa có mục tiêu cho ngày này. Bấm bút để thêm!',
    noNotes: 'Chưa có ghi chú nào cho ngày này.',
    freeTimeToday: 'Thời Gian Rảnh Hôm Nay',
    noFreeSlots: 'Không có khoảng rảnh nào (Lịch đã kín).',
    fixedAndTransient: 'Việc Cố Định & Đột Xuất',
    fixedTag: 'Việc Cố Định',
    transientTag: 'Việc Đột Xuất',
    addFixedBtn: 'Cố định',
    addTransientBtn: 'Đột xuất',
    noFixedOrTransient: 'Không có việc cố định hay đột xuất.',
    scheduledTasks: 'Công Việc Đã Xếp Lịch',
    noScheduledTasks: 'Chưa có task nào được xếp vào lịch.',
    noisyIntervalsSidebarTitle: 'Khung Giờ Bị Làm Phiền',
    noNoisyIntervalsToday: 'Không có khung giờ làm phiền nào hôm nay.',
    addNoisySidebarBtn: 'Khung giờ làm phiền',
    
    // Smart Tag Labels
    tagFocusLong: 'Dễ tập trung (Dài)',
    tagFocusShort: 'Dễ tập trung (Ngắn)',
    tagDistractLong: 'Khó tập trung (Dài)',
    tagDistractShort: 'Khó tập trung (Ngắn)',
    tagFocus: 'Dễ tập trung',
    tagDistract: 'Khó tập trung',
    tagAuto: 'Tự động',
    tagAdjustTitle: 'Gắn / Điều chỉnh Tag độ tập trung:',
    tagAdjustDesc: 'Trong giờ ồn ào mặc định là Khó tập trung, ngoài giờ ồn là Dễ tập trung (Dài &ge; {threshold}p, Ngắn &lt; {threshold}p). Bạn có thể gắn đè tag tùy ý:',
    tagResetBtn: 'Đặt lại Tự động',
    tagManualApplied: 'Đã gắn tag thủ công',
    tagAutoQuiet: 'Tự động: Ngoài khung giờ ồn ào → Dễ tập trung',
    tagAutoNoisy: 'Tự động: Nằm trong khung giờ ồn ào → Khó tập trung',
    quickTagToggle: 'Đổi tag',
    quietEnv: 'Dễ tập trung',
    noisyEnv: 'Khó tập trung',
    minutes: 'phút',
    minShort: 'p',
    
    // Threshold & Settings
    thresholdSettingTitle: 'Ngưỡng Phân Loại Thời Gian (Dài vs Ngắn)',
    thresholdSettingDesc: 'Quy định số phút chuẩn để phân chia khoảng rảnh thành Dài hoặc Ngắn (mặc định là 30 phút). Khoảng rảnh đạt ngưỡng này trở lên được xem là khung giờ tập trung sâu.',
    thresholdCurrentLabel: 'Ngưỡng thời gian:',
    thresholdPreviewTitle: 'Quy tắc phân loại đang áp dụng:',
    thresholdRuleLong: 'Thời lượng rảnh ≥ {minutes} phút → Phân loại là DÀI (Tập trung sâu)',
    thresholdRuleShort: 'Thời lượng rảnh < {minutes} phút → Phân loại là NGẮN (Tập trung nhanh)',
    presetLabel: 'Gợi ý nhanh:',
    presetPomodoro: '25p (Pomodoro)',
    presetDefault: '30p (Chuẩn)',
    presetLong: '60p (1 giờ)',
    presetDeepWork: '90p (Deep Work)',
    toastThresholdUpdated: 'Đã cập nhật ngưỡng thời gian phân loại!',
    fontSizeTitle: 'Cỡ Chữ Giao Diện (Font Size & Typography Scaling)',
    fontSizeDesc: 'Tùy chỉnh kích thước chữ cho toàn bộ hệ thống (thanh điều hướng, lịch trình 24h, danh sách công việc, ghi chú và các hộp thoại). Giúp bảo vệ mắt và tối ưu khả năng đọc trên mọi kích thước màn hình.',
    fontSizeCurrentLabel: 'Kích cỡ hiện tại:',
    fontSizeSliderLabel: 'Thanh trượt điều chỉnh kích cỡ chữ (80% - 130%):',
    fontSizePresetSmall: '85% (Nhỏ / Gọn)',
    fontSizePresetDefault: '100% (Tiêu chuẩn / Chuẩn)',
    fontSizePresetLarge: '115% (Lớn / Dễ đọc)',
    fontSizePresetXLarge: '130% (Rất lớn / Trợ năng)',
    fontSizePreviewTitle: 'Giao diện xem trước cỡ chữ thực tế:',
    fontSizePreviewHint: 'Chữ sẽ tự động co giãn đồng bộ trên toàn bộ ChronoFlow theo thời gian thực.',
    toastFontSizeUpdated: 'Đã cập nhật cỡ chữ toàn hệ thống!',
    settingsSubtitle: 'Tùy biến ngưỡng tập trung, màu sắc nhận diện, khung giờ ồn ào và sao lưu dữ liệu.',
    colorSettingsDesc: 'Tùy chỉnh màu sắc trực quan cho từng loại khoảng rảnh hiển thị trên dòng thời gian 24h.',
    noisyIntervalsDesc: 'Khoảng rảnh nằm trong các khung giờ này sẽ tự động gắn nhãn Khó tập trung chính xác trong thời gian diễn ra.',
    backupStatsLabel: 'Thống kê dữ liệu hiện có trong trình duyệt:',
    
    // Types
    typeFixed: 'Cố định',
    typeTransient: 'Đột xuất',
    typeTask: 'Task',
    
    // Day View
    timelineTitle: 'Dòng thời gian 24 giờ',
    notesBannerTitle: 'Ghi chú trong ngày (Google Calendar Style)',
    clickSlotHint: 'Click vào khoảng rảnh để xếp task, hoặc kéo task từ Ma Trận thả vào đây.',
    unassignTaskConfirm: 'Hủy xếp lịch cho task này?',
    zoom: 'Thu phóng',
    zoomIn: 'Phóng to (+)',
    zoomOut: 'Thu nhỏ (−)',
    currentTime: 'Thời gian hiện tại',
    nowActive: 'ĐANG DIỄN RA',
    nextUpcoming: 'KẾ TIẾP',
    focusDimmingTitle: 'Chế Độ Tập Trung Dòng Thời Gian (Focus Dimming)',
    focusDimmingDesc: 'Khi bật: Chỉ sự kiện đang diễn ra hiển thị đầy đủ chi tiết; sự kiện liền kề gần nhất chỉ hiển thị tên; các sự kiện còn lại sẽ mờ đi để tối đa hóa sự tập trung (bấm vào để xem rõ).',
    focusDimmingBtn: 'Tập trung',
    focusDimmingOn: 'Bật',
    focusDimmingOff: 'Tắt',
    focusDimmingTooltip: 'Bật / Tắt chế độ làm mờ tập trung theo thời gian thực',
    toastFocusDimmingEnabled: 'Đã bật chế độ làm mờ tập trung!',
    toastFocusDimmingDisabled: 'Đã tắt chế độ làm mờ tập trung (hiển thị bình thường).',
    
    // Month & Year Views
    prevBtn: 'Trước',
    nextBtn: 'Tiếp',
    prevMonth: '← Tháng trước',
    nextMonth: 'Tháng sau →',
    todayBtn: 'Hôm nay',
    goalYear: 'Mục tiêu năm',
    goalMonth: 'Mục tiêu tháng',
    monthNotes: 'Ghi chú',
    noMonthGoal: 'Chưa đặt mục tiêu tháng.',
    noYearGoal: 'Chưa đặt mục tiêu năm.',
    monthZoomLabel: 'Tỉ lệ ô lịch tháng',
    monthZoomFit: 'Tự động vừa màn hình (Fit)',
    monthZoomFitShort: 'Vừa khung',
    monthScale75: '75% (Gọn)',
    monthScale100: '100% (Chuẩn)',
    monthScale125: '125% (Rộng)',
    monthScale150: '150% (Chi tiết)',
    dayDetailTitle: 'Chi tiết các sự kiện trong ngày',
    mobileMonthHiddenHint: 'Chế độ xem Tháng đã được ẩn trên màn hình nhỏ di động để tối ưu trải nghiệm chạm.',
    
    // Eisenhower Matrix
    eisenhowerTitle: 'Ma Trận Eisenhower & Khớp Lịch Thông Minh',
    eisenhowerDesc: 'Phân loại công việc theo mức độ Khẩn cấp & Quan trọng, tự động gợi ý vào các khoảng thời gian rảnh phù hợp.',
    autoMatchAll: 'Tự Động Xếp Hết Lịch',
    autoMatchSuccess: 'Đã tự động xếp thành công {count} việc vào các khoảng rảnh tối ưu!',
    autoMatchNone: 'Không tìm thấy khoảng thời gian rảnh nào phù hợp với các việc còn lại.',
    
    q1Title: 'Q1: KHẨN CẤP & QUAN TRỌNG',
    q1Badge: 'Làm Ngay Lập Tức',
    q1Desc: 'Nhiệm vụ ưu tiên cao nhất, giải quyết ngay lập tức trong khung giờ vàng.',
    q2Title: 'Q2: KHÔNG KHẨN & QUAN TRỌNG',
    q2Badge: 'Lên Kế Hoạch / Sâu',
    q2Desc: 'Mục tiêu chiến lược, phát triển dài hạn, xếp vào các khoảng tập trung sâu.',
    q3Title: 'Q3: KHẨN CẤP & KHÔNG QUAN TRỌNG',
    q3Badge: 'Ủy Quyền / Làm Nhanh',
    q3Desc: 'Việc gấp phát sinh nhưng ít quan trọng, xếp vào khoảng ngắn hoặc ồn ào.',
    q4Title: 'Q4: KHÔNG KHẨN & KHÔNG QUAN TRỌNG',
    q4Badge: 'Làm Khi Rảnh / Bỏ',
    q4Desc: 'Việc giải trí, thứ yếu, chỉ thực hiện khi đã hoàn thành các mục tiêu trên.',
    
    repeatLabel: 'Lặp lại',
    repeatNone: 'Không lặp lại (Một lần)',
    repeatDaily: 'Hàng ngày',
    repeatEvery2Days: 'Mỗi 2 ngày (Cách ngày)',
    repeatWeekly: 'Hàng tuần (chọn thứ)',
    repeatMonthly: 'Hàng tháng',
    repeatWeekdays: 'Các ngày trong tuần (T2 - T6)',
    repeatInterval: 'Tùy chỉnh (Mỗi N ngày)',
    repeatStartDateLabel: 'Ngày bắt đầu lặp',
    repeatEndDateLabel: 'Ngày kết thúc lặp',
    repeatNoEnd: 'Vô thời hạn (không kết thúc)',
    repeatBadge: 'Lặp lại',
    repeatDaysLabel: 'Lặp lại vào các thứ:',
    quickAddTaskInQuadrant: 'Thêm task',
    
    requireQuiet: 'Cần yên tĩnh',
    allowNoise: 'Chấp nhận ồn ào',
    scheduledAt: 'Đã xếp',
    scheduleBtn: 'Xếp vào slot',
    emptyQuadrant: 'Chưa có task trong ô này. Bấm nút bên dưới để thêm.',
    
    // Settings
    settingsTitle: 'Cài Đặt Hệ Thống & Tùy Chỉnh Màu Sắc',
    colorSettings: 'Bảng màu 4 Nhóm Thời Gian Rảnh & Sự Kiện',
    noisyIntervalsTitle: 'Khung giờ dễ bị làm phiền / Ồn ào trong ngày',
    addNoisyBtn: 'Thêm Khung Giờ Ồn Ào',
    backupDataTitle: 'Sao Lưu & Khôi Phục Dữ Liệu (100% Offline)',
    exportBtn: 'Tải File Sao Lưu (.JSON)',
    importBtn: 'Khôi Phục Từ File',
    resetBtn: 'Khôi Phục Dữ Liệu Gốc',
    sortOrderLabel: 'Thứ tự sắp xếp sự kiện & task:',
    sortOrderAsc: 'Tăng dần thời gian (Sớm nhất trước / Chiều xuôi)',
    sortOrderDesc: 'Giảm dần thời gian (Muộn nhất trước / Chiều ngược)',

    // Google Calendar Color Mapping
    gcalColorMappingTitle: 'Ánh xạ mã màu Google Calendar',
    gcalColorMappingDesc: 'Mỗi loại việc trong ChronoFlow tương ứng với một mã màu chính thức trên Google Calendar. Bạn có thể xem màu gợi ý chuẩn hoặc tùy chỉnh màu sắc theo ý muốn.',
    gcalResetColorsBtn: 'Khôi phục tất cả về gợi ý',
    gcalSuggestedBadge: 'Gợi ý',
    gcalResetSingleBtn: 'Về gợi ý',
    gcalStandardBadge: 'Chuẩn gợi ý',
    gcalCustomBadge: 'Đã tùy chỉnh',
    gcalPaletteTitle: 'Bảng 11 màu chuẩn Google Calendar:',
    toastGCalColorUpdated: 'Đã cập nhật ánh xạ màu Google Calendar',
    toastGCalColorsReset: 'Đã khôi phục toàn bộ màu gợi ý mặc định',
    
    // Modals & Forms
    modalAddTaskTitle: 'Thêm Công Việc Mới',
    modalEditTaskTitle: 'Chỉnh Sửa Công Việc',
    modalAddFixedTitle: 'Thêm Việc Cố Định Lặp Lại',
    modalEditFixedTitle: 'Chỉnh Sửa Việc Cố Định',
    modalAddTransientTitle: 'Thêm Việc Đột Xuất Trong Ngày',
    modalEditTransientTitle: 'Chỉnh Sửa Việc Đột Xuất',
    modalAddNoisyTitle: 'Thêm Khung Giờ Ồn Ào / Sinh Hoạt',
    modalEditNoisyTitle: 'Chỉnh Sửa Khung Giờ Ồn Ào',
    modalAddNoteTitle: 'Thêm Ghi Chú Lịch',
    modalEditNoteTitle: 'Chỉnh Sửa Ghi Chú',
    modalDailyGoalTitle: 'Mục Tiêu & Thông Điệp Ngày',
    modalYearGoalTitle: 'Mục Tiêu Năm',
    modalMonthGoalTitle: 'Mục Tiêu Tháng',
    modalSelectTaskSlotTitle: 'Chọn Task Để Xếp Vào Khung Giờ',
    
    taskTitleLabel: 'Tên công việc *',
    taskNoteHeading: 'Ghi chú',
    taskNoteLabel: 'Ghi chú / Mô tả công việc (tùy chọn)',
    taskNotePlaceholder: 'Cấu trúc chuẩn:\n- Mục chính 1\n  + Chi tiết con\n- Mục chính 2\n(Hiển thị tối đa 3 dòng mục chính trên thẻ ma trận)',
    durationLabel: 'Thời lượng dự kiến (phút) *',
    targetDateLabel: 'Ngày thực hiện',
    isImportantLabel: 'Quan trọng',
    isUrgentLabel: 'Khẩn cấp',
    requireQuietLabel: 'Cần yên tĩnh',
    preferredSessionLabel: 'Khung giờ / Buổi ưu tiên',
    sessionAny: 'Bất kỳ (Tự động)',
    sessionMorning: 'Buổi sáng (06:00 - 12:00)',
    sessionAfternoon: 'Buổi chiều (12:00 - 18:00)',
    sessionEvening: 'Buổi tối (18:00 - 23:00)',
    sessionBadgeMorning: 'Sáng',
    sessionBadgeAfternoon: 'Chiều',
    sessionBadgeEvening: 'Tối',
    scheduleModeLabel: 'Chế độ xếp lịch',
    scheduleModeAuto: 'Tự động xếp lịch',
    scheduleModeManual: 'Tùy chọn giờ (Thủ công)',
    manualStartTimeLabel: 'Giờ bắt đầu',
    manualHintText: 'Chế độ tùy chọn giờ: Task sẽ được xếp lịch ngay lập tức vào mốc thời gian chỉ định (Khung giờ & Mức độ tập trung được bỏ qua).',
    attentionLevelLabel: 'Mức độ tập trung yêu cầu',
    attentionAuto: 'Tự động (theo ma trận)',
    attentionHigh: 'Cao (Tập trung sâu)',
    attentionMedium: 'Trung bình',
    attentionLow: 'Thấp',
    attentionAny: 'Bất kỳ',
    titleFixedLabel: 'Tên hoạt động (vd: Ngủ, Ăn trưa, Tập gym) *',
    titleTransientLabel: 'Tên việc đột xuất (vd: Đi nhận bưu phẩm, gặp thợ sửa...) *',
    activityNoteLabel: 'Ghi chú cho hoạt động (tùy chọn)',
    activityNotePlaceholder: 'Thêm ghi chú, địa điểm, nhắc nhở chi tiết...',
    daysRepeatLabel: 'Lặp lại vào các thứ trong tuần:',
    startTimeLabel: 'Giờ bắt đầu *',
    endTimeLabel: 'Giờ kết thúc *',
    noteContentLabel: 'Nội dung ghi chú *',
    noisyLabelPrompt: 'Mô tả khung giờ (vd: Giờ ăn tối gia đình, xem TV...) *',
    
    cancelBtn: 'Hủy',
    saveBtn: 'Lưu',
    deleteBtn: 'Xóa',
    editBtn: 'Sửa',
    unscheduleBtn: 'Hủy xếp',
    
    // Toasts & Messages
    toastTaskAdded: 'Đã thêm công việc mới thành công!',
    toastTaskUpdated: 'Đã cập nhật công việc!',
    toastTaskDeleted: 'Đã xóa công việc.',
    toastEventAdded: 'Đã thêm sự kiện thành công!',
    toastEventUpdated: 'Đã cập nhật sự kiện!',
    toastEventDeleted: 'Đã xóa sự kiện thành công.',
    toastNoteAdded: 'Đã thêm ghi chú mới!',
    toastNoteDeleted: 'Đã xóa ghi chú.',
    toastNoisyAdded: 'Đã thêm khung giờ ồn ào!',
    toastNoisyUpdated: 'Đã cập nhật khung giờ ồn ào!',
    toastNoisyDeleted: 'Đã xóa khung giờ ồn ào.',
    toastNoisyExcluded: 'Đã bỏ khung giờ ồn ào cho ngày {date}!',
    deleteNoisyConfirm: 'Bạn có chắc chắn muốn xóa khung giờ ồn ào này?',
    deleteNoisyTitle: 'Xóa Khung Giờ Ồn Ào',
    deleteScopeSingle: 'Chỉ xóa cho ngày {date}',
    deleteScopeAll: 'Xóa toàn bộ các lần lặp',
    toastBackupExported: 'Đã tải xuống file sao lưu!',
    toastDataRestored: 'Đã khôi phục dữ liệu thành công!',
    toastResetDefault: 'Đã xóa trắng và khôi phục dữ liệu gốc.',
    toastResetCleanSuccess: 'Đã xóa trắng toàn bộ dữ liệu thành công!',
    toastSlotAssigned: 'Đã xếp task vào khung giờ!',
    toastTagUpdated: 'Đã cập nhật tag cho khung giờ!',
    toastTagReset: 'Đã đặt lại tag tự động theo giờ ồn ào.',

    // Backup Confirmation & 5s Countdown
    confirmExportTitle: 'Xác Nhận Tải File Sao Lưu (.JSON)',
    confirmExportDesc: 'Bạn có chắc chắn muốn tải xuống bản sao lưu toàn bộ dữ liệu hiện tại (Tasks, Sự kiện, Ghi chú, Cấu hình)? File JSON này có thể dùng để khôi phục dữ liệu bất kỳ lúc nào.',
    confirmExportAlert: 'File sao lưu chứa 100% dữ liệu đang có trên máy của bạn và được lưu an toàn dưới dạng file .JSON.',
    confirmExportBtn: 'Xác Nhận Tải File',

    confirmImportTitle: 'Xác Nhận Khôi Phục Dữ Liệu Từ File',
    confirmImportDesc: 'Bạn chuẩn bị khôi phục dữ liệu từ file <strong>{filename}</strong>. Thao tác này sẽ ghi đè toàn bộ dữ liệu hiện tại của bạn bằng dữ liệu trong file sao lưu!',
    confirmImportAlert: 'Gợi ý: Hãy sao lưu (tải file .JSON) dữ liệu hiện tại trước nếu bạn muốn giữ lại bản ghi cũ.',
    confirmImportBtn: 'Xác Nhận Khôi Phục',

    confirmResetTitle: 'Xác Nhận Xóa Trắng & Khôi Phục Dữ Liệu Gốc',
    confirmResetDesc: 'Hành động này sẽ <strong>XÓA TRẮNG TOÀN BỘ TẤT CẢ DỮ LIỆU</strong> (Toàn bộ Tasks, Sự kiện cố định, Việc đột xuất, Ghi chú, Mục tiêu, Giờ ồn) và đưa ứng dụng về trạng thái ban đầu hoàn toàn sạch sẽ!',
    confirmResetWarningTitle: 'CẢNH BÁO QUAN TRỌNG: DỮ LIỆU SẼ BỊ XÓA VĨNH VIỄN!',
    confirmResetWarningDesc: 'Dữ liệu sau khi xóa trắng sẽ không thể hoàn tác. Bạn hãy luôn luôn TẢI FILE SAO LƯU trước khi đồng ý khôi phục dữ liệu gốc!',
    confirmResetBtn: 'Xác Nhận Xóa Trắng Tất Cả',
    recommendBackupFirst: 'Khuyến nghị sao lưu trước',

    // Recurring Scope (Google Calendar Style)
    recurringActionTitle: 'Chỉnh sửa sự kiện định kỳ',
    recurringDeleteTitle: 'Xóa sự kiện định kỳ',
    recurringScopeThis: 'Sự kiện này',
    recurringScopeThisAndFollowing: 'Sự kiện này và các sự kiện sau',
    recurringScopeAll: 'Tất cả sự kiện',
    recurringPromptDesc: 'Bạn muốn áp dụng thay đổi này cho những sự kiện nào trong chuỗi lặp?',
    recurringDeletePromptDesc: 'Bạn muốn xóa những sự kiện nào trong chuỗi lặp?',

    // Undo & Sub-slots & Insights
    undoBtn: 'Hoàn tác',
    toastUndoSuccess: 'Đã hoàn tác thành công!',
    toastUndoExpired: 'Thời gian hoàn tác đã hết.',
    subslotAssignedToast: 'Đã xếp vào {start} - {end} ({taskDur}p). Còn lại {remainDur}p rảnh ({remainStart} - {remainEnd})!',
    productivityTitle: 'Số liệu Năng suất',
    productivityStatsTitle: 'Số liệu Năng suất',
    productivityTotalFreeSummary: 'Tổng thời gian trống khả dụng: {hours} ({slotsCount} khoảng trống)',
    focusRate: 'Tỷ lệ tập trung',
    deepFocusTime: 'Thời gian tập trung sâu',
    distractTime: 'Thời gian linh hoạt / ồn ào',
    completionRate: 'Tỷ lệ hoàn thành',
    scheduledRate: 'Tỷ lệ đã xếp lịch',
    focusLongAndShortSub: '{longMins}p dài (≥{threshold}p) + {shortMins}p ngắn',
    distractLongAndShortSub: '{longMins}p dài + {shortMins}p ngắn',
    tasksDoneLabel: 'công việc hoàn thành',
    unassignedTasksCount: '{count} việc chưa xếp',
    allTasksScheduledLabel: 'Đã xếp toàn bộ',
    eisenhowerDistribution: 'Phân Bổ Ma Trận Eisenhower',
    q1Short: 'Q1 Khẩn & Quan trọng',
    q2Short: 'Q2 Quan trọng',
    q3Short: 'Q3 Khẩn cấp',
    q4Short: 'Q4 Không quan trọng',
    smartInsightsTitle: 'Gợi Ý Tối Ưu Hóa',
    insightUnassigned: 'Bạn còn {count} công việc chưa được xếp vào dòng thời gian. Nhấn "Tự Động Xếp Hết Lịch" để tối ưu hóa ngay.',
    insightAllScheduled: 'Tuyệt vời! Tất cả công việc trong ngày đều đã có khung thời gian cố định.',
    insightQ1Heavy: 'Số lượng việc khẩn cấp (Q1) đang khá nhiều. Hãy giải quyết chúng trong các khung giờ tập trung sâu trước.',
    insightDeepFocusHigh: 'Bạn có {hours} thời gian yên tĩnh, rất thuận lợi cho các đầu việc Q2 đòi hỏi tư duy cao.',
    insightDeepFocusLow: 'Khung giờ yên tĩnh có hạn, hãy phân bổ ưu tiên cho các việc Q1 quan trọng nhất.',
    tasksCount: '{count} việc',
    productivityFocusRate: 'Tỷ lệ thời gian tập trung sâu',
    productivityDistractRate: 'Thời gian việc ngắn / linh hoạt',
    productivityCompletedTasks: 'Công việc đã hoàn thành',
    productivityTotalFree: 'Tổng quỹ thời gian rảnh',
    productivityScheduledRate: 'Tỷ lệ thời gian đã xếp lịch',
    timeRangeInvalid: 'Thời gian bắt đầu và kết thúc không được trùng nhau!',
    timelineDaySpan: 'Số ngày xem',
    daySpan1: '1 ngày',
    daySpan3: '3 ngày',
    daySpan7: '7 ngày (Tuần)',
    cycleDaySpanHint: 'Nhấn để chuyển: 1 ngày → 3 ngày → 7 ngày',
    switchToDayViewHint: 'Nhấn vào ngày để chuyển sang xem 1 ngày',
    switchedDaySpan: 'Đã đổi chế độ xem: {span}',
    switchedToDay: 'Đã chuyển sang xem ngày {date}',
    addNoteHintText: 'Thêm ghi chú (Bấm để viết):',
    addNoteHintTitle: 'Hướng dẫn viết ghi chú: (-) mục chính, (+) mục con',
    addNoteGuideMain: 'Gạch đầu dòng (-) : nội dung chính (xem trước 3 dòng)',
    addNoteGuideSub: 'Dấu cộng (+) : nội dung con chi tiết',
    expandNote: 'Xem thêm',
    collapseNote: 'Thu gọn',
    unscheduledTasks: 'Công Việc Chưa Xếp Lịch',
    noUnscheduledTasksToday: 'Không có công việc chưa xếp lịch',
    toastFreeTimeTotal: 'Đang hiển thị: Tổng thời gian rảnh ({hours}h)',
    toastFreeTimeFocus: 'Đang hiển thị: Thời gian rảnh tập trung ({hours}h)',
    toastFreeTimeDistract: 'Đang hiển thị: Thời gian rảnh xao nhãng ({hours}h)',
    fixedShort: 'Cố định',
    transientShort: 'Đột xuất',
    countFixedTitle: 'Số lượng việc cố định hôm nay',
    countTransientTitle: 'Số lượng việc đột xuất hôm nay',
    freeTimeModeTotal: 'Tổng thời gian rảnh',
    freeTimeModeFocus: 'Thời gian rảnh tập trung',
    freeTimeModeDistract: 'Thời gian rảnh xao nhãng',
    cycleFreeTimeModeHint: 'Bấm để đổi: Tổng / Tập trung / Xao nhãng',
    toggleCollapseHint: 'Bấm để ẩn / hiện',
    freeTimeSettingsCardTitle: 'Mốc Hiển Thị Quỹ Thời Gian Rảnh',
    freeTimeSettingsCardDesc: 'Tùy chọn mốc thời gian rảnh hiển thị mặc định trên thanh bên (Sidebar). Bạn cũng có thể bấm trực tiếp vào con số thời gian trên thanh bên để chuyển đổi nhanh bất kỳ lúc nào.',
    transitionSettingsTitle: 'Thời Gian Chuyển Đổi',
    transitionSettingsDesc: 'Thiết lập khoảng nghỉ hoặc thời gian chuyển tiếp giữa các sự kiện để nạp lại năng lượng và tránh kiệt sức.',
    transitionBeforeStartLabel: 'Trước khi bắt đầu sự kiện (Buffer Trước)',
    transitionBeforeStartSub: 'Dành khoảng thời gian đệm trước khi bắt đầu để chuẩn bị và chuyển đổi trạng thái.',
    transitionAfterEndLabel: 'Sau khi kết thúc sự kiện (Buffer Sau)',
    transitionAfterEndSub: 'Dành khoảng nghỉ ngơi hoặc giãn cách ngay sau khi sự kiện hoàn thành.',
    transitionMinutesLabel: 'Thời lượng chuyển đổi (Số phút chung):',
    transitionMinutesHint: 'Áp dụng một mốc phút thống nhất cho mỗi khoảng đệm trước / sau.',
    transitionApplyToTitle: 'Áp dụng cho các loại sự kiện:',
    transitionApplyToTask: 'Công việc (Task đã xếp lịch)',
    transitionApplyToFixed: 'Việc cố định (Fixed events)',
    transitionApplyToTransient: 'Việc đột xuất (Transient events)',
    transitionConflictTitle: 'Khi hai sự kiện liền kề đều có transition:',
    transitionConflictMax: 'Lấy thời gian dài hơn (Max — tránh bị trùng lặp khoảng đệm)',
    transitionConflictSum: 'Cộng dồn (Sum — cộng gộp cả hai khoảng đệm)',
    freeTimeModeTotalDesc: 'Hiển thị toàn bộ tổng quỹ giờ rảnh còn trống trong ngày (24h) sau khi đã trừ đi các việc cố định và việc đột xuất.',
    freeTimeModeFocusDesc: 'Chỉ tính các khoảng thời gian rảnh yên tĩnh (không trùng khung giờ ồn ào/dễ bị làm phiền) và có thời lượng đủ dài (≥ ngưỡng tập trung) phù hợp cho học tập & làm việc sâu.',
    freeTimeModeDistractDesc: 'Chỉ tính các khoảng thời gian rảnh rơi vào khung giờ ồn ào, dễ bị gián đoạn hoặc phân mảnh ngắn, thích hợp làm việc nhẹ, giải trí hoặc nghỉ ngơi.',
    toggleSidebarTooltip: 'Ẩn / Hiện thanh bên (Ctrl+B)',
    showSidebar: 'Hiện thanh bên (Ctrl+B)',
    hideSidebar: 'Ẩn thanh bên (Ctrl+B)',
    streakSettingsCardTitle: 'Chuỗi Kỷ Luật & Ngưỡng Hoàn Thành',
    streakSettingsCardDesc: 'Cấu hình ngưỡng hoàn thành task để tính chuỗi kỷ luật toàn cục và theo từng ngày trong tuần.',
    streakGlobalThresholdLabel: 'Ngưỡng chuẩn toàn cục (Chỉ thay đổi được vào Chủ Nhật):',
    streakWeekdayThresholdsLabel: 'Ngưỡng riêng theo từng thứ trong tuần:',
    streakStandardOption: 'Theo chuẩn (Inherit)',
    streakLevel50: '50% (Cơ bản)',
    streakLevel70: '70% (Chuẩn)',
    streakLevel80: '80% (Nâng cao)',
    streakLevel100: '100% (Hoàn thành tuyệt đối)',
    toastStreakGlobalUpdated: 'Đã cập nhật ngưỡng chuẩn chuỗi kỷ luật!',
    toastStreakWeekdayUpdated: 'Đã cập nhật ngưỡng cho ngày trong tuần!',
    streakSundayOnlyAlert: 'Chỉ được phép thay đổi ngưỡng chuẩn chuỗi kỷ luật vào Chủ Nhật!'
  },
  en: {
    brandSubtitle: 'Google & Samsung Calendar Style • 100% Offline',
    navYear: 'Year',
    navMonth: 'Month',
    navDay: 'Day (24h Timeline)',
    navEisenhower: 'Eisenhower Matrix',
    navSettings: 'Settings',
    btnAddTask: 'Add Task',
    
    // Sidebar
    dailyGoal: 'Daily Goal',
    dailyNotes: 'Calendar Notes',
    addNote: 'Note',
    noDailyGoal: 'No daily goal set. Click the edit icon to add!',
    noNotes: 'No notes for this date.',
    freeTimeToday: "Today's Free Time",
    noFreeSlots: 'No free time slots available (Fully booked).',
    fixedAndTransient: 'Fixed & Transient Events',
    fixedTag: 'Fixed Routines',
    transientTag: 'Ad-hoc Events',
    addFixedBtn: 'Fixed',
    addTransientBtn: 'Transient',
    noFixedOrTransient: 'No fixed or transient events.',
    scheduledTasks: 'Scheduled Tasks',
    noScheduledTasks: 'No tasks scheduled on this day.',
    noisyIntervalsSidebarTitle: 'Distraction Hours',
    noNoisyIntervalsToday: 'No distraction intervals today.',
    addNoisySidebarBtn: 'Distraction Hours',
    
    // Smart Tag Labels
    tagFocusLong: 'Easy Focus (Long)',
    tagFocusShort: 'Easy Focus (Short)',
    tagDistractLong: 'Hard to Focus (Long)',
    tagDistractShort: 'Hard to Focus (Short)',
    tagFocus: 'Easy Focus',
    tagDistract: 'Hard to Focus',
    tagAuto: 'Auto',
    tagAdjustTitle: 'Attach / Adjust Focus Tag:',
    tagAdjustDesc: 'Noisy hours default to Hard to Focus, outside noisy hours default to Easy Focus (Long &ge; {threshold}m, Short &lt; {threshold}m). You can override anytime:',
    tagResetBtn: 'Reset to Auto',
    tagManualApplied: 'Manually overridden',
    tagAutoQuiet: 'Auto: Outside noisy hours → Easy Focus',
    tagAutoNoisy: 'Auto: In noisy hours → Hard to Focus',
    quickTagToggle: 'Toggle Tag',
    quietEnv: 'Easy Focus',
    noisyEnv: 'Hard to Focus',
    minutes: 'mins',
    minShort: 'm',
    
    // Threshold & Settings
    thresholdSettingTitle: 'Focus Duration Threshold (Long vs Short)',
    thresholdSettingDesc: 'Define the minute threshold to classify free time slots into Long or Short (default: 30 minutes). Slots with duration greater or equal to this are Long, otherwise Short.',
    thresholdCurrentLabel: 'Duration threshold:',
    thresholdPreviewTitle: 'Active Classification Rules:',
    thresholdRuleLong: 'Free duration ≥ {minutes} mins → Classified as LONG (Deep Focus)',
    thresholdRuleShort: 'Free duration < {minutes} mins → Classified as SHORT (Quick Focus)',
    presetLabel: 'Quick presets:',
    presetPomodoro: '25m (Pomodoro)',
    presetDefault: '30m (Default)',
    presetLong: '60m (1 hour)',
    presetDeepWork: '90m (Deep Work)',
    toastThresholdUpdated: 'Focus duration threshold updated!',
    fontSizeTitle: 'System Font Size (Typography Scaling)',
    fontSizeDesc: 'Customize typography scaling across the entire application (navigation bar, 24h timeline, task backlog, notes, and modal dialogs). Optimizes readability and visual comfort across all screen sizes.',
    fontSizeCurrentLabel: 'Current Size:',
    fontSizeSliderLabel: 'Adjust Typography Scale (80% - 130%):',
    fontSizePresetSmall: '85% (Compact)',
    fontSizePresetDefault: '100% (Standard - Default)',
    fontSizePresetLarge: '115% (Comfortable)',
    fontSizePresetXLarge: '130% (Large / Accessibility)',
    fontSizePreviewTitle: 'Real-time Typography Live Preview:',
    fontSizePreviewHint: 'Font size scales smoothly across all ChronoFlow views in real time.',
    toastFontSizeUpdated: 'System font size updated!',
    settingsSubtitle: 'Customize duration thresholds, timeline colors, noisy hours, and data backup.',
    colorSettingsDesc: 'Customize visual color badges for each category of free slots on the 24h timeline.',
    noisyIntervalsDesc: 'Free slots falling within these hours will be tagged as Distract only during the exact noisy duration.',
    backupStatsLabel: 'Current data stored locally in browser:',
    
    // Types
    typeFixed: 'Fixed',
    typeTransient: 'Transient',
    typeTask: 'Task',
    
    // Day View
    timelineTitle: '24-Hour Timeline',
    notesBannerTitle: 'Daily Notes & Reminders (Google Calendar Style)',
    clickSlotHint: 'Click a free slot to schedule a task, or drag tasks from the Eisenhower Matrix.',
    unassignTaskConfirm: 'Unschedule this task?',
    zoom: 'Zoom',
    zoomIn: 'Zoom In (+)',
    zoomOut: 'Zoom Out (−)',
    currentTime: 'Current time',
    nowActive: 'NOW ONGOING',
    nextUpcoming: 'NEXT',
    focusDimmingTitle: 'Timeline Focus Dimming (Focus Mode)',
    focusDimmingDesc: 'When enabled: Only the ongoing event shows full details, the next upcoming event shows title only, and all other events are dimmed to maximize focus (click to view clearly).',
    focusDimmingBtn: 'Focus',
    focusDimmingOn: 'ON',
    focusDimmingOff: 'OFF',
    focusDimmingTooltip: 'Toggle real-time focus dimming mode',
    toastFocusDimmingEnabled: 'Focus dimming mode enabled!',
    toastFocusDimmingDisabled: 'Focus dimming mode disabled (normal view).',
    
    // Month & Year Views
    prevBtn: 'Previous',
    nextBtn: 'Next',
    prevMonth: '← Prev Month',
    nextMonth: 'Next Month →',
    todayBtn: 'Today',
    goalYear: 'Year Goal',
    goalMonth: 'Month Goal',
    monthNotes: 'Notes',
    noMonthGoal: 'No monthly goal set.',
    noYearGoal: 'No yearly goal set.',
    monthZoomLabel: 'Month Grid Scale',
    monthZoomFit: 'Fit to Viewport (Fit)',
    monthZoomFitShort: 'Fit',
    monthScale75: '75% (Compact)',
    monthScale100: '100% (Standard)',
    monthScale125: '125% (Wide)',
    monthScale150: '150% (Detailed)',
    dayDetailTitle: 'Events Details for Day',
    mobileMonthHiddenHint: 'Month view is hidden on mobile screens for an optimal touch experience.',
    
    // Eisenhower Matrix
    eisenhowerTitle: 'Eisenhower Matrix & Smart Time Blocking',
    eisenhowerDesc: 'Categorize tasks by Urgency & Importance, auto-matching them into optimal free time slots.',
    autoMatchAll: 'Auto-Schedule All Tasks',
    autoMatchSuccess: 'Successfully scheduled {count} task(s) into optimal free slots!',
    autoMatchNone: 'No matching free time slots found for remaining tasks.',
    
    q1Title: 'Q1: URGENT & IMPORTANT',
    q1Badge: 'Do First (Urgent)',
    q1Desc: 'Top priority tasks, tackle immediately in prime focus hours.',
    q2Title: 'Q2: NOT URGENT & IMPORTANT',
    q2Badge: 'Schedule / Deep Focus',
    q2Desc: 'Strategic & long-term goals, schedule into deep focus slots.',
    q3Title: 'Q3: URGENT & NOT IMPORTANT',
    q3Badge: 'Delegate / Quick Win',
    q3Desc: 'Urgent requests with lower importance, fit into short or noisy slots.',
    q4Title: 'Q4: NOT URGENT & NOT IMPORTANT',
    q4Badge: 'Eliminate / Free Time',
    q4Desc: 'Low priority or leisure items, only do when priorities are done.',
    
    repeatLabel: 'Repeat',
    repeatNone: 'Does not repeat',
    repeatDaily: 'Daily',
    repeatEvery2Days: 'Every 2 days (Alternate)',
    repeatWeekly: 'Weekly (select days)',
    repeatMonthly: 'Monthly',
    repeatWeekdays: 'Every weekday (Mon - Fri)',
    repeatInterval: 'Custom (Every N days)',
    repeatStartDateLabel: 'Start date',
    repeatEndDateLabel: 'End date',
    repeatNoEnd: 'Never ends',
    repeatBadge: 'Repeats',
    repeatDaysLabel: 'Repeat on days:',
    quickAddTaskInQuadrant: 'Add task',
    
    requireQuiet: 'Needs quiet',
    allowNoise: 'Allows noise',
    scheduledAt: 'Scheduled',
    scheduleBtn: 'Schedule into slot',
    emptyQuadrant: 'No tasks in this quadrant. Click below to add one.',
    
    // Settings
    settingsTitle: 'Settings & Color Customization',
    colorSettings: 'Color Palette for Free Slots & Events',
    noisyIntervalsTitle: 'Daily Noisy / Distraction Hours',
    addNoisyBtn: 'Add Noisy Interval',
    backupDataTitle: 'Backup & Restore Data (100% Offline)',
    exportBtn: 'Download Backup File (.JSON)',
    importBtn: 'Restore From File',
    resetBtn: 'Reset to Default Data',
    sortOrderLabel: 'Event & Task Sort Order:',
    sortOrderAsc: 'Ascending (Earliest first / Chronological)',
    sortOrderDesc: 'Descending (Latest first / Reverse)',

    // Google Calendar Color Mapping
    gcalColorMappingTitle: 'Google Calendar Color Mapping',
    gcalColorMappingDesc: 'Each ChronoFlow task type corresponds to an official color on Google Calendar. You can view suggested standard colors or customize them.',
    gcalResetColorsBtn: 'Reset all to suggested',
    gcalSuggestedBadge: 'Suggested',
    gcalResetSingleBtn: 'Reset',
    gcalStandardBadge: 'Standard',
    gcalCustomBadge: 'Custom',
    gcalPaletteTitle: 'Official Google Calendar 11-color palette:',
    toastGCalColorUpdated: 'Updated Google Calendar sync color',
    toastGCalColorsReset: 'Restored all suggested default colors',
    
    // Modals & Forms
    modalAddTaskTitle: 'Add New Task',
    modalEditTaskTitle: 'Edit Task',
    modalAddFixedTitle: 'Add Repeating Fixed Event',
    modalEditFixedTitle: 'Edit Fixed Event',
    modalAddTransientTitle: 'Add Transient / Ad-hoc Event',
    modalEditTransientTitle: 'Edit Transient Event',
    modalAddNoisyTitle: 'Add Noisy / Active Interval',
    modalEditNoisyTitle: 'Edit Noisy Interval',
    modalAddNoteTitle: 'Add Calendar Note',
    modalEditNoteTitle: 'Edit Note',
    modalDailyGoalTitle: 'Daily Goal & Focus Message',
    modalYearGoalTitle: 'Yearly Goal',
    modalMonthGoalTitle: 'Monthly Goal',
    modalSelectTaskSlotTitle: 'Select Task for Free Slot',
    
    taskTitleLabel: 'Task Title *',
    taskNoteHeading: 'Note',
    taskNoteLabel: 'Task Note / Description (optional)',
    taskNotePlaceholder: 'Standard format:\n- Main point 1\n  + Sub-item detail\n- Main point 2\n(Shows first 3 main points on matrix card)',
    durationLabel: 'Estimated Duration (minutes) *',
    targetDateLabel: 'Date',
    isImportantLabel: 'Important',
    isUrgentLabel: 'Urgent',
    requireQuietLabel: 'Requires quiet',
    preferredSessionLabel: 'Preferred Time of Day',
    sessionAny: 'Any Time (Auto)',
    sessionMorning: 'Morning (06:00 - 12:00)',
    sessionAfternoon: 'Afternoon (12:00 - 18:00)',
    sessionEvening: 'Evening (18:00 - 23:00)',
    sessionBadgeMorning: 'Morning',
    sessionBadgeAfternoon: 'Afternoon',
    sessionBadgeEvening: 'Evening',
    scheduleModeLabel: 'Schedule Mode',
    scheduleModeAuto: 'Auto Schedule',
    scheduleModeManual: 'Custom / Manual Time',
    manualStartTimeLabel: 'Start Time',
    manualHintText: 'Custom Time mode: Task is scheduled immediately at the specified time slot (Preferred Session & Attention Level are ignored).',
    attentionLevelLabel: 'Required Attention Level',
    attentionAuto: 'Auto (by Eisenhower matrix)',
    attentionHigh: 'High (Deep focus)',
    attentionMedium: 'Medium',
    attentionLow: 'Low',
    attentionAny: 'Any',
    titleFixedLabel: 'Event Title (e.g., Sleep, Lunch, Gym) *',
    titleTransientLabel: 'Transient Event Title (e.g. Courier pickup, maintenance...) *',
    activityNoteLabel: 'Notes for activity (optional)',
    activityNotePlaceholder: 'Add detailed notes, location, reminders...',
    daysRepeatLabel: 'Repeats on days of week:',
    startTimeLabel: 'Start Time *',
    endTimeLabel: 'End Time *',
    noteContentLabel: 'Note Content *',
    noisyLabelPrompt: 'Description (e.g. Family dinner, TV time) *',
    
    cancelBtn: 'Cancel',
    saveBtn: 'Save',
    deleteBtn: 'Delete',
    editBtn: 'Edit',
    unscheduleBtn: 'Unschedule',
    
    // Toasts & Messages
    toastTaskAdded: 'New task added successfully!',
    toastTaskUpdated: 'Task updated successfully!',
    toastTaskDeleted: 'Task deleted.',
    toastEventAdded: 'Event added successfully!',
    toastEventUpdated: 'Event updated!',
    toastEventDeleted: 'Event deleted successfully.',
    toastNoteAdded: 'Note added to calendar!',
    toastNoteDeleted: 'Note removed.',
    toastNoisyAdded: 'Noisy interval added!',
    toastNoisyUpdated: 'Noisy interval updated!',
    toastNoisyDeleted: 'Noisy interval deleted.',
    toastNoisyExcluded: 'Noisy interval removed for {date}!',
    deleteNoisyConfirm: 'Are you sure you want to delete this noisy interval?',
    deleteNoisyTitle: 'Delete Noisy Interval',
    deleteScopeSingle: 'Delete for {date} only',
    deleteScopeAll: 'Delete all occurrences',
    toastBackupExported: 'Backup file downloaded!',
    toastDataRestored: 'Data restored successfully!',
    toastResetDefault: 'Reset to default data.',
    toastResetCleanSuccess: 'Successfully wiped all workspace data to a clean slate!',
    toastSlotAssigned: 'Task scheduled into slot!',
    toastTagUpdated: 'Slot tag updated!',
    toastTagReset: 'Slot tag reset to auto based on noisy hours.',

    // Backup Confirmation & 5s Countdown
    confirmExportTitle: 'Confirm Download Backup File (.JSON)',
    confirmExportDesc: 'Are you sure you want to download a complete backup of your current workspace (Tasks, Events, Notes, Settings)? You can use this JSON file to restore your data anytime.',
    confirmExportAlert: 'The backup file contains 100% of your workspace data and is safely downloaded as a standard .JSON file.',
    confirmExportBtn: 'Confirm Download Backup',

    confirmImportTitle: 'Confirm Restore Workspace From File',
    confirmImportDesc: 'You are about to restore workspace from file <strong>{filename}</strong>. This action will overwrite your current workspace with the data from the backup file!',
    confirmImportAlert: 'Tip: You should export a backup of your current workspace first if you wish to preserve the existing records.',
    confirmImportBtn: 'Confirm Restore',

    confirmResetTitle: 'Confirm Wipe & Reset to Blank Slate',
    confirmResetDesc: 'This action will <strong>PERMANENTLY WIPE ALL DATA</strong> (All Tasks, Fixed Events, Transient Events, Notes, Goals, Noisy Intervals) and reset the workspace to a completely clean blank slate!',
    confirmResetWarningTitle: 'CRITICAL WARNING: DATA WILL BE PERMANENTLY ERASED!',
    confirmResetWarningDesc: 'Wiped data cannot be undone. We strongly advise you to DOWNLOAD A BACKUP FILE first before agreeing to reset!',
    confirmResetBtn: 'Confirm Wipe & Reset All Data',
    recommendBackupFirst: 'Recommended backup first',

    // Recurring Scope (Google Calendar Style)
    recurringActionTitle: 'Edit recurring event',
    recurringDeleteTitle: 'Delete recurring event',
    recurringScopeThis: 'This event',
    recurringScopeThisAndFollowing: 'This and following events',
    recurringScopeAll: 'All events',
    recurringPromptDesc: 'Which events in the series do you want to apply this change to?',
    recurringDeletePromptDesc: 'Which events in the series do you want to delete?',

    // Undo & Sub-slots & Insights
    undoBtn: 'Undo',
    toastUndoSuccess: 'Undone successfully!',
    toastUndoExpired: 'Undo period expired.',
    subslotAssignedToast: 'Scheduled in {start} - {end} ({taskDur}m). Remaining {remainDur}m free ({remainStart} - {remainEnd})!',
    productivityTitle: 'Productivity Statistics',
    productivityStatsTitle: 'Productivity Statistics',
    productivityTotalFreeSummary: 'Total available free time: {hours} ({slotsCount} slot(s))',
    focusRate: 'Focus Rate',
    deepFocusTime: 'Deep Focus Time',
    distractTime: 'Flexible / Active Time',
    completionRate: 'Completion Rate',
    scheduledRate: 'Scheduled Rate',
    focusLongAndShortSub: '{longMins}m long (≥{threshold}m) + {shortMins}m short',
    distractLongAndShortSub: '{longMins}m long + {shortMins}m short',
    tasksDoneLabel: 'tasks completed',
    unassignedTasksCount: '{count} unscheduled task(s)',
    allTasksScheduledLabel: 'All tasks scheduled',
    eisenhowerDistribution: 'Eisenhower Matrix Distribution',
    q1Short: 'Q1 Urgent & Important',
    q2Short: 'Q2 Important',
    q3Short: 'Q3 Urgent',
    q4Short: 'Q4 Not Important',
    smartInsightsTitle: 'Optimization Insights',
    insightUnassigned: 'You have {count} unscheduled task(s). Click "Auto-Schedule All Tasks" to optimize your day.',
    insightAllScheduled: 'Great! All tasks for today have been allocated into time slots.',
    insightQ1Heavy: 'You have a high volume of urgent tasks (Q1). Prioritize them during deep focus intervals.',
    insightDeepFocusHigh: 'You have {hours} of quiet focus time, ideal for high-leverage Q2 strategic tasks.',
    insightDeepFocusLow: 'Quiet focus time is limited today. Allocate it strictly to top Q1 priorities.',
    tasksCount: '{count} tasks',
    productivityFocusRate: 'Deep focus time ratio',
    productivityDistractRate: 'Shallow / flexible time',
    productivityCompletedTasks: 'Completed tasks',
    productivityTotalFree: 'Total free time pool',
    productivityScheduledRate: 'Time scheduled ratio',
    timeRangeInvalid: 'Start time and end time cannot be identical!',
    timelineDaySpan: 'View Mode',
    daySpan1: '1 Day',
    daySpan3: '3 Days',
    daySpan7: '7 Days (Week)',
    cycleDaySpanHint: 'Click to cycle: 1 Day → 3 Days → 7 Days',
    switchToDayViewHint: 'Click day to switch to 1-day view',
    switchedDaySpan: 'View mode switched to: {span}',
    switchedToDay: 'Switched to {date}',
    addNoteHintText: 'Add note (Click to write):',
    addNoteHintTitle: 'Note format guide: (-) main point, (+) sub-item',
    addNoteGuideMain: 'Dash (-) : main point (3-line preview)',
    addNoteGuideSub: 'Plus (+) : sub-item / details',
    expandNote: 'Show more',
    collapseNote: 'Collapse',
    unscheduledTasks: 'Unscheduled Tasks',
    noUnscheduledTasksToday: 'No unscheduled tasks today',
    toastFreeTimeTotal: 'Showing: Total Free Time ({hours}h)',
    toastFreeTimeFocus: 'Showing: Focused Free Time ({hours}h)',
    toastFreeTimeDistract: 'Showing: Distracted Free Time ({hours}h)',
    fixedShort: 'Fixed',
    transientShort: 'Transient',
    countFixedTitle: 'Fixed events count today',
    countTransientTitle: 'Transient events count today',
    freeTimeModeTotal: 'Total Free Time',
    freeTimeModeFocus: 'Focused Free Time',
    freeTimeModeDistract: 'Distracted Free Time',
    cycleFreeTimeModeHint: 'Click to cycle: Total / Focus / Distract',
    toggleCollapseHint: 'Click to toggle collapse/expand',
    freeTimeSettingsCardTitle: 'Free Time Metric Preference',
    freeTimeSettingsCardDesc: 'Choose which free time metric is shown on the sidebar by default. You can also click the time number directly on the sidebar to cycle through metrics quickly.',
    transitionSettingsTitle: 'Transition Time',
    transitionSettingsDesc: 'Configure buffer or break time between events to maintain focus and prevent fatigue.',
    transitionBeforeStartLabel: 'Before event starts (Buffer Before)',
    transitionBeforeStartSub: 'Allow buffer time before start to prepare and transition mental focus.',
    transitionAfterEndLabel: 'After event ends (Buffer After)',
    transitionAfterEndSub: 'Allow a cool-down break immediately after the event concludes.',
    transitionMinutesLabel: 'Transition duration (Minutes):',
    transitionMinutesHint: 'Applies a single uniform minute duration for each buffer before / after.',
    transitionApplyToTitle: 'Apply buffer to event types:',
    transitionApplyToTask: 'Tasks (Scheduled matrix tasks)',
    transitionApplyToFixed: 'Fixed routines & events',
    transitionApplyToTransient: 'Transient / unexpected events',
    transitionConflictTitle: 'When adjacent events both have transition:',
    transitionConflictMax: 'Take longer duration (Max — prevents oversized gaps)',
    transitionConflictSum: 'Sum both durations (Sum — combines both buffers)',
    freeTimeModeTotalDesc: 'Displays all available free hours across the 24-hour day after subtracting fixed routines and ad-hoc events.',
    freeTimeModeFocusDesc: 'Calculates only quiet free slots that do not overlap with noisy hours and meet the focus threshold for deep work.',
    freeTimeModeDistractDesc: 'Calculates free slots that fall into noisy/interruptible hours or short fragmented windows, best for routine tasks or rest.',
    toggleSidebarTooltip: 'Toggle Sidebar (Ctrl+B)',
    showSidebar: 'Show Sidebar (Ctrl+B)',
    hideSidebar: 'Hide Sidebar (Ctrl+B)',
    streakSettingsCardTitle: 'Discipline Streak & Completion Thresholds',
    streakSettingsCardDesc: 'Configure completion thresholds for tracking discipline streaks globally and per weekday.',
    streakGlobalThresholdLabel: 'Global Standard Threshold (Editable on Sundays only):',
    streakWeekdayThresholdsLabel: 'Weekday-Specific Thresholds:',
    streakStandardOption: 'Standard (Inherit)',
    streakLevel50: '50% (Basic)',
    streakLevel70: '70% (Standard)',
    streakLevel80: '80% (Advanced)',
    streakLevel100: '100% (Absolute Completion)',
    toastStreakGlobalUpdated: 'Global streak threshold updated successfully!',
    toastStreakWeekdayUpdated: 'Weekday threshold updated successfully!',
    streakSundayOnlyAlert: 'Streak threshold can only be edited on Sundays!'
  }
};

function t(key, params = {}) {
  const lang = appState?.settings?.lang || 'vi';
  let str = (translations[lang] && translations[lang][key]) || translations['vi'][key] || key;
  for (const [k, v] of Object.entries(params)) {
    str = str.replace(`{${k}}`, v);
  }
  return str;
}

// ==========================================
// 2. CẤU TRÚC DỮ LIỆU & QUẢN LÝ LOCALSTORAGE
// ==========================================
const STORAGE_KEY = 'chronoflow_data';
const DEVICE_ID_KEY = 'chronoflow_deviceId';
const MAX_SEEN_UPDATED_AT_KEY = 'chronoflow_maxSeenUpdatedAt';

function initDeviceId() {
  let id = null;
  try {
    id = localStorage.getItem(DEVICE_ID_KEY) || localStorage.getItem('deviceId');
    if (!id) {
      id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : ('dev-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9));
      localStorage.setItem(DEVICE_ID_KEY, id);
      localStorage.setItem('deviceId', id);
    }
  } catch (e) {
    if (!id) {
      id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : 'dev-fallback';
    }
  }
  return id;
}

let deviceId = initDeviceId();

let maxSeenUpdatedAt = 0;
try {
  const savedMax = localStorage.getItem(MAX_SEEN_UPDATED_AT_KEY) || localStorage.getItem('maxSeenUpdatedAt');
  if (savedMax) {
    maxSeenUpdatedAt = parseInt(savedMax, 10) || 0;
  }
} catch (e) {}

function touch(rec) {
  if (!rec || typeof rec !== 'object') return rec;
  rec.updatedAt = Math.max(Date.now(), maxSeenUpdatedAt + 1);
  rec.updatedBy = deviceId;
  maxSeenUpdatedAt = rec.updatedAt;
  try {
    localStorage.setItem(MAX_SEEN_UPDATED_AT_KEY, String(maxSeenUpdatedAt));
    localStorage.setItem('maxSeenUpdatedAt', String(maxSeenUpdatedAt));
  } catch (e) {}
  return rec;
}

if (typeof window !== 'undefined') {
  window.deviceId = deviceId;
  window.touch = touch;
  window.maxSeenUpdatedAt = maxSeenUpdatedAt;
  window.getDeviceId = () => deviceId;
  window.getMaxSeenUpdatedAt = () => maxSeenUpdatedAt;
}
if (typeof globalThis !== 'undefined') {
  globalThis.deviceId = deviceId;
  globalThis.touch = touch;
  globalThis.maxSeenUpdatedAt = maxSeenUpdatedAt;
  globalThis.getDeviceId = () => deviceId;
  globalThis.getMaxSeenUpdatedAt = () => maxSeenUpdatedAt;
}

const INITIAL_CHANGELOGS = [
  {
    id: 'ver-1-3-0',
    version: 'v1.3.0',
    date: '22/10/2026',
    tag: 'Feature',
    tagEn: 'Feature',
    isLatest: true,
    title: 'Hỗ Trợ Giao Diện Mobile & Chuẩn Hóa Vector Icons',
    titleEn: 'Mobile Interface Assistance & Flat Vector Icon Modernization',
    items: [
      'Nút Thao Tác Nổi Trợ Năng Cho Mobile (FAB): Bổ sung nút tròn nổi góc dưới màn hình điện thoại với menu phím tắt nhanh (Đồng bộ Google Drive/Google Calendar, Thêm việc Eisenhower, Việc đột xuất, Việc cố định, Ghi chú ngày, Tự động xếp lịch).',
      'Cài Đặt Trợ Năng Mobile Độc Lập: Thẻ tùy biến riêng biệt trong Cài đặt Giao diện & Hiển thị, cho phép bật/tắt master switch và tùy biến thêm/bớt từng phím tắt nhanh chỉ trên mobile, hoàn toàn không ảnh hưởng máy tính.',
      'Thuật Toán Định Vị Nút Nổi Thích Ứng: Nút nổi luôn tự động căn chỉnh vị trí phía trên nút Cài đặt của thanh điều hướng đáy, thích ứng mượt mà với mọi tỉ lệ zoom/scale màn hình, và xếp lớp an toàn phía sau thanh menu bên trái (Sidebar).',
      'Chuẩn Hóa Flat Vector SVG Toàn Bộ Giao Diện: Loại bỏ triệt để các emoji 3D/hệ điều hành không đồng nhất, thay thế bằng bộ icon vector SVG line sắc nét, đồng bộ phong cách tối giản.',
      'Tối Giản Giao Diện Dòng Thời Gian: Loại bỏ nút toggle tag trên các khối khoảng rảnh, giữ cho dòng thời gian 24h luôn thanh thoát và tập trung.'
    ],
    itemsEn: [
      'Mobile Floating Action Button (FAB): Added quick-access floating button on mobile screens with instant shortcuts for Sync (GDrive / GCal), New Task, Transient Event, Fixed Event, Daily Note, and Auto-Match.',
      'Dedicated Mobile Accessibility Setting: New preference card in Appearance & Display settings allowing full customization of mobile shortcuts without affecting desktop.',
      'Adaptive Positioning Algorithm: Intelligently anchors the FAB directly above the bottom navigation Settings button across any screen zoom or scale ratio, layered safely behind the left sidebar.',
      'Flat Vector SVG Modernization: Replaced legacy 3D/OS emojis with unified line-art SVG icons across streak badges, year view records, and modal interfaces.',
      'Streamlined Timeline Interface: Removed redundant tag toggle buttons from free-slot cards for a cleaner, decluttered 24h schedule.'
    ]
  },
  {
    id: 'ver-1-2-1',
    version: 'v1.2.1',
    date: '21/10/2026',
    tag: 'Feature',
    tagEn: 'Feature',
    isLatest: false,
    title: 'Hệ Thống Thời Gian Chuyển Đổi Tối Ưu (Transition Time Redesign)',
    titleEn: 'Revamped Transition Time System & Smart Buffer Scheduling',
    items: [
      'Xây lại hoàn toàn Thời gian chuyển đổi: Tái cấu trúc toàn diện kiến trúc dữ liệu transition sang model tinh gọn, loại bỏ hoàn toàn các trường dữ liệu phân mảnh cũ và tương thích tuyệt đối với Smart Merge.',
      'Bật/tắt độc lập trước bắt đầu & sau kết thúc: Tùy biến linh hoạt khoảng nghỉ trước sự kiện (enabledBeforeStart) và sau khi hoàn thành (enabledAfterEnd).',
      'Một mức phút chung & áp dụng theo loại sự kiện: Cấu hình thống nhất một thời lượng chuyển đổi duy nhất (minutes), dễ dàng lựa chọn áp dụng riêng cho Task, Việc cố định (Fixed) hoặc Việc đột xuất (Transient).',
      'Xử lý xung đột thông minh (Conflict Mode): Cơ chế linh hoạt giải quyết khi hai sự kiện liền kề cùng có transition với hai tùy chọn: Lấy thời gian dài hơn (Max) hoặc Cộng dồn hai khoảng (Sum).',
      'Tự động chèn đệm khi xếp lịch: Tích hợp chặt chẽ vào thuật toán Auto-match và thao tác click chọn slot trực tiếp trên Timeline, tự động kiểm tra khoảng cách và từ chối nếu không đủ chỗ.'
    ],
    itemsEn: [
      'Complete Transition Time Redesign: Fully streamlined transition architecture into a unified data model, cleanly migrating legacy keys and ensuring robust Smart Merge support.',
      'Independent Pre & Post Buffer Controls: Separate toggle controls to reserve transition rest intervals before event start and after event end.',
      'Unified Duration with Per-Type Targeting: A single minutes setting applied selectively to tasks, fixed events, and transient events.',
      'Smart Adjacent Conflict Resolution: Resolves adjacent transition overlaps via either Longer Buffer (Max) or Cumulative Duration (Sum) mode.',
      'Automated Scheduling Integration: Embedded into Auto-match and direct Timeline slot selection with automatic fit validation.'
    ]
  },
  {
    id: 'ver-1-2-0',
    version: 'v1.2.0',
    date: '21/10/2026',
    tag: 'Feature',
    tagEn: 'Feature',
    isLatest: false,
    title: 'Smart Merge, Soft-Delete & Schema Version',
    titleEn: 'Smart Merge, Soft-Delete & Schema Version',
    items: [
      'Soft-delete với updatedAt / updatedBy: Khi xóa task, sự kiện, ghi chú hay mục tiêu, hệ thống chuyển thành bản ghi xóa mềm (deleted: true) kèm mốc thời gian và định danh thiết bị để đồng bộ chính xác và chống hồi sinh.',
      'Smart Merge khi Import (Last-Writer-Wins): Khi nạp file JSON, tùy chọn "Merge thông minh" tự động so sánh updatedAt từng record, ưu tiên bản mới hơn, tôn trọng trạng thái đã xóa và ưu tiên bản local khi hòa.',
      'Hỗ trợ merge slotOverrides và changelogs: Tự động hợp nhất từng key cấu hình khung giờ slotOverrides và danh sách phiên bản changelogs theo chuẩn Last-Writer-Wins.',
      'Thêm schemaVersion: 2: Chuẩn hóa cấu trúc dữ liệu cấp cao nhất với schemaVersion: 2, tự động nâng cấp dữ liệu cũ và xuất đầy đủ 100% siêu dữ liệu.',
      'Chức năng dọn dẹp bản ghi đã xóa cũ: Bổ sung nút "Dọn dẹp bản ghi đã xóa cũ hơn 90 ngày" trong tab Quản lý Dữ liệu kèm hộp thoại xác nhận an toàn và thông báo số lượng bản ghi đã dọn.'
    ],
    itemsEn: [
      'Soft-delete with updatedAt / updatedBy: Deletions persist as tombstones (deleted: true) with monotonic timestamps and device ID for reliable cross-device sync.',
      'Smart Merge on Import (Last-Writer-Wins): Import dialog offers Smart Merge to compare updatedAt per record, respecting tombstones and favoring local state on ties.',
      'Comprehensive slotOverrides and changelogs merging: Seamlessly merges customized timeline slot overrides and changelogs without data loss.',
      'Top-level schemaVersion: 2: Standardizes data architecture with schemaVersion: 2, automatic legacy migration, and complete metadata exports.',
      'Prune Old Soft-Deleted Records: Added "Prune deleted records older than 90 days" button in Settings → Data Management with safe confirmation.'
    ]
  },
  {
    id: 'ver-1-1-0',
    version: 'v1.1.0',
    date: '26/09/2026',
    tag: 'Fix & Feature',
    tagEn: 'Fix & Feature',
    isLatest: false,
    title: 'Khắc phục triệt để hiện tượng giật màn hình Timeline & Giữ nguyên vị trí cuộn khi tương tác Task',
    titleEn: 'Timeline Flicker-Free Laser Indicator & Persistent Scroll State Preservation',
    items: [
      'Khắc phục triệt để lỗi chớp giật (Flicker-Free): Tách riêng hàm updateTimeIndicatorOnly cập nhật trực tiếp style.top và text nhãn thời gian thực, không vẽ lại toàn bộ DOM cây mỗi phút.',
      'Giữ nguyên vị trí thanh cuộn (Scroll State Preservation): Cơ chế saveAndRestoreScroll bảo toàn tuyệt đối vị trí cuộn của Thanh bên trái (Sidebar), Khung cuộn Timeline 24h và Ma trận Eisenhower khi người dùng tick hoàn thành, sửa, xóa hoặc xếp lịch công việc.',
      'Cờ điều hướng thông minh shouldScrollToNow: Chỉ tự động cuộn đến vạch đỏ giờ hiện tại khi mở web lần đầu, bấm nút Hôm nay hoặc chuyển tab Ngày.',
      'Thêm tính năng Quản lý & Ghi chép Nhật ký phiên bản (Changelog Manager): Cho phép thêm phiên bản mới trực tiếp trong giao diện, chế độ Copy - Paste nhanh (Quick Paste) và Xuất mã nguồn JavaScript 1-click.'
    ],
    itemsEn: [
      'Eliminated Timeline flicker: Dedicated updateTimeIndicatorOnly updates style.top and time labels directly on existing DOM without re-rendering the view tree.',
      'Scroll State Preservation: Built-in saveAndRestoreScroll mechanism guarantees left sidebar, 24h timeline grid, and Eisenhower matrix maintain their exact scroll position during all task interactions.',
      'Smart shouldScrollToNow navigation: Auto-scrolls to the current time indicator only on first launch, clicking Today, or switching to Day tab.',
      'Changelog Manager feature: Enables adding new release notes directly within the app, featuring Quick Paste mode and 1-click Source Code Snippet export.'
    ]
  },
  {
    id: 'ver-1-0-1',
    version: 'v1.0.1',
    date: 'Tháng 09/2026',
    tag: 'UI Polish',
    tagEn: 'UI Polish',
    isLatest: false,
    title: 'Tối Ưu Giao Diện, Loại Bỏ Icon Rườm Rà & Chuẩn Hóa Phẳng',
    titleEn: 'Minimalist UI Polish & Anti-Clutter Optimization',
    items: [
      'Bộ Icon Phẳng SVG Siêu Nhẹ: Loại bỏ toàn bộ icon 3D, gradient bóng bẩy, thay bằng các stroke icon SVG 2px sắc nét và đồng bộ.',
      'Triệt Tiêu Emoji Trang Trí: Chuyển các biểu tượng cảm xúc thô ở đầu dòng sang icon vector thanh thoát, tránh lỗi font chữ trên các hệ điều hành khác nhau.',
      'Chuẩn Hóa Huy Hiệu Chuỗi Kỷ Luật: Thay thế emoji 🔥 và ❄️ bằng vector SVG mảnh nét cam/xanh hiện đại, hiển thị sắc nét trên màn hình Retina.',
      'Tối Giản & Tăng Không Gian Tập Trung: Giảm thiểu bóng mờ không cần thiết, làm phẳng các đường viền thẻ để giao diện thông thoáng, dễ nhìn.'
    ],
    itemsEn: [
      'Flat Vector Iconography: Replaced all emojis and 3D effects with ultra-clean, uniform 2px stroke SVG icons.',
      'Zero Visual Slop: Removed extraneous drop-shadows, flashy gradients, and decorative prefixes for maximum readability.',
      'Vector Header Streak Indicators: Embedded lightweight Flame & Snowflake SVG paths into the global streak widget to eliminate OS font variations.',
      'Restrained Typography & Calm Surfaces: Cleaned up card borders and color accents following strict SaaS design guidelines.'
    ]
  },
  {
    id: 'ver-1-0-0',
    version: 'v1.0.0',
    date: 'Tháng 09/2026',
    tag: 'Milestone',
    tagEn: 'Milestone',
    isLatest: false,
    title: 'Bản Phát Hành Nền Tảng (8 Khối Tính Năng Cốt Lõi)',
    titleEn: 'Foundation Release (8 Core Modules)',
    items: [
      'Động cơ Tập trung & Chống kiệt sức (Cognitive Attention Engine): Đường cong sinh học Circadian nhịp ngày đêm, tích lũy năng lượng và tự động hồi phục khi nghỉ ngơi.',
      'Ma trận Eisenhower & Đồng bộ Task: Phân loại 4 góc phần tư (Q1-Q4), chế độ xếp lịch tự động và thủ công theo các buổi sáng/chiều/tối.',
      'Timeline Đa Ngày & Vạch Laser: Chế độ xem 1 ngày, 3 ngày, 7 ngày với vạch laser thời gian thực xuyên suốt và kéo thả 15 phút.',
      'Phân Tích Năng Suất & Chuỗi Kỷ Luật (Streaks): Thống kê giờ tập trung sâu, tỷ lệ hoàn thành mục tiêu ngày và tính năng đóng băng chuỗi (Freeze 2 ngày).',
      'Đồng Bộ 2 Chiều Google Calendar: Kết nối OAuth bảo mật, đẩy và kéo sự kiện hai chiều và gán màu sắc trực quan.',
      'Bảo Mật & Lưu Trữ Ngoại Tuyến (100% Offline LocalStorage): Khóa an toàn 5 giây khi sao lưu/khôi phục và xuất file JSON.'
    ],
    itemsEn: [
      'Cognitive Attention Engine: Circadian rhythm curve, dynamic mental fatigue accumulation, and fixed-event recovery.',
      'Eisenhower Matrix & Tasks: 4 Quadrants, dual scheduling mode (Auto vs Manual), preferred sessions, and multi-day recurrence.',
      '24h Multi-Day Timeline: 1-Day, 3-Day & 7-Day views, luminous glass real-time laser indicator, and 15m drag-and-drop snapping.',
      'Productivity Analytics & Discipline Streak: Deep vs Shallow hours, Discipline Streak counter with 2-day Freeze protection.',
      'Two-Way Google Calendar Synchronization: Secure OAuth connection, automatic push/pull, and custom color mapping.',
      '100% Offline LocalStorage with 5-second safety countdown lock on backup export and restore.'
    ]
  }
];

const DEFAULT_DATA = {
  schemaVersion: 2,
  changelogs: INITIAL_CHANGELOGS,
  streakDayOverrides: {},
  settings: {
    lang: 'vi',
    focusThresholdMinutes: 30,
    monthZoom: 100, // 75, 100, 125, 150 (%), or 'fit'
    timelineDaySpan: 1, // 1, 3, 7 (ngày)
    focusDimming: false, // Chế độ làm mờ tập trung (Focus Dimming)
    focusBlurPx: 6, // Mức độ mờ mặc định (6px)
    fontSizePercent: 100, // Cỡ chữ giao diện toàn hệ thống (80% - 130%)
    streakThreshold: 0.7, // Ngưỡng tỷ lệ hoàn thành để đạt Streak mỗi ngày (mặc định 70%)
    streak: {
      threshold: 0.7,
      weekdayThresholds: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      thresholdEditableOnlyOnSunday: true,
      weeklyRelief: { usedInWeekKey: null }
    },
    timeSortOrder: 'asc', // 'asc' (tăng dần: sớm nhất trước) | 'desc' (giảm dần: muộn nhất trước)
    colors: {
      focusLong: '#059669',    // Xanh lục ngọc đậm nét: >= 30p + Dễ tập trung
      focusShort: '#0284c7',   // Xanh lam đại dương: < 30p + Dễ tập trung
      distractLong: '#d97706', // Hổ phách/Vàng đậm: >= 30p + Khó tập trung
      distractShort: '#ea580c',// Cam đậm nét: < 30p + Khó tập trung
      fixedEvent: '#475569',   // Việc cố định
      transientEvent: '#dc2626', // Việc đột xuất
      scheduledTask: '#10b981',  // Task đã xếp lịch (Màu xanh lá cây)
      unscheduledTask: '#d97706' // Task chưa xếp lịch (Màu vàng đậm)
    },
    freeTimeDisplayMode: 'total', // 'total' | 'focus' | 'distract'
    transition: {
      enabledBeforeStart: true,    // bật khoảng chuyển trước khi bắt đầu
      enabledAfterEnd: true,       // bật khoảng chuyển sau khi kết thúc
      minutes: 10,                 // số phút chung (một giá trị duy nhất)
      applyTo: {
        task: true,
        fixed: false,
        transient: false
      },
      conflictMode: "max"          // "max" | "sum" — khi hai bên đều có transition
    },
    notificationsEnabled: true,
    notifyAll: true,
    notifyEisenhower: true,
    notifyFixed: true,
    notifyTransient: true,
    startNoticeMinutes: 5,
    endNoticeMinutes: 5,
    popupDurationSeconds: 8,
    noisyIntervals: [
      { start: '18:00', end: '21:00', label: 'Giờ gia đình sinh hoạt / Xem TV' }
    ],
    gcal: {
      clientId: '',
      apiKey: '',
      calendarId: 'primary',
      autoSync: false,
      autoSyncOnOpen: false,
      autoSyncInterval: 60, // khoảng thời gian tự động đồng bộ (giây)
      lastSyncTime: null,
      syncToken: null,
      userEmail: '',
      syncTypes: {
        tasksScheduled: true,
        tasksUnscheduled: false,
        fixed: true,
        transient: true,
        notes: false
      },
      syncScheduledQuadrants: { q1: true, q2: true, q3: false, q4: false },
      syncTimeScope: 'day',
      colorMapping: {
        focusLong: '10',    // Basil (#0b8043)
        focusShort: '9',    // Blueberry (#3f51b5)
        distractLong: '5',  // Banana (#f6bf26)
        distractShort: '6', // Tangerine (#f4511e)
        transient: '11',    // Tomato (#d50000)
        fixed: '8'          // Graphite (#616161)
      }
    },
    gdrive: {
      enabled: true,
      autoSyncOnOpen: false,
      pollingEnabled: false,
      pollingInterval: 300,
      lastSyncTime: null,
      fileId: null
    },
    headerSyncTarget: 'gcal',
    mobileAssist: {
      enabled: true,
      shortcuts: {
        sync: true,
        syncSwitch: true,
        newTask: true,
        transientEvent: true,
        fixedEvent: true,
        dailyNote: true,
        autoMatch: true
      }
    }
  },
  slotOverrides: {},
  goals: {
    years: [
      {
        id: 'y-2026',
        year: 2026,
        title: 'Làm chủ công nghệ & Phát triển kỹ năng cá nhân',
        principles: 'Kim chỉ nam: Kỷ luật tạo nên tự do. Tập trung năng lượng cao độ vào các việc quan trọng trong khung giờ vàng.'
      }
    ],
    monthGoals: [
      {
        id: 'mg-2026-09',
        yearId: 'y-2026',
        yearMonth: '2026-09',
        title: 'Xây dựng ứng dụng quản lý thời gian cá nhân hoàn thiện'
      }
    ],
    dailyGoals: [
      {
        id: 'dg-today',
        date: getTodayDateString(),
        focusMessage: 'Tập trung giải quyết 2 task quan trọng vào khung giờ yên tĩnh'
      }
    ]
  },
  notes: [
    {
      id: 'note-1',
      date: getTodayDateString(),
      content: 'Hôm nay, nhớ hoàn thiện web'
    }
  ],
  tasks: [
    {
      id: 't-1',
      date: getTodayDateString(),
      title: 'Học lập trình thuật toán Time Blocking',
      isImportant: true,
      isUrgent: true,
      estimatedMinutes: 45,
      requireQuiet: true,
      status: 'todo',
      assignedSlot: null
    },
    {
      id: 't-2',
      date: getTodayDateString(),
      title: 'Lên kế hoạch mục tiêu cho quý tới',
      isImportant: true,
      isUrgent: false,
      estimatedMinutes: 60,
      requireQuiet: true,
      status: 'todo',
      assignedSlot: null
    },
    {
      id: 't-3',
      date: getTodayDateString(),
      title: 'Trả lời email đối tác & dọn bàn làm việc',
      isImportant: false,
      isUrgent: true,
      estimatedMinutes: 20,
      requireQuiet: false,
      status: 'todo',
      assignedSlot: null
    },
    {
      id: 't-4',
      date: getTodayDateString(),
      title: 'Lướt tin tức công nghệ giải trí',
      isImportant: false,
      isUrgent: false,
      estimatedMinutes: 15,
      requireQuiet: false,
      status: 'todo',
      assignedSlot: null
    }
  ],
  fixedEvents: [
    {
      id: 'fe-1',
      title: 'Ngủ đêm & Phục hồi sức khỏe',
      note: 'Phòng ngủ thoáng mát, tắt điện thoại trước khi ngủ 30 phút',
      start: '00:00',
      end: '06:30',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: 'fe-2',
      title: 'Ăn trưa & Nghỉ ngơi',
      note: 'Ăn uống điều độ, chợp mắt 15-20 phút phục hồi năng lượng',
      start: '12:00',
      end: '13:30',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    },
    {
      id: 'fe-3',
      title: 'Ăn tối cùng gia đình',
      note: 'Thời gian sum họp, không mang công việc vào bàn ăn',
      start: '18:30',
      end: '19:30',
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
    }
  ],
  transientEvents: [
    {
      id: 'te-1',
      date: getTodayDateString(),
      title: 'Họp đột xuất giải quyết bài toán nhóm',
      start: '09:00',
      end: '10:00'
    }
  ]
};

// Global App State
let appState = loadData();
const u = DEFAULT_DATA;
let d = appState;
let currentView = 'day'; // 'year', 'month', 'day', 'eisenhower', 'settings'
let selectedDate = getTodayDateString();
let shouldScrollToNow = true;

if (typeof window !== 'undefined') {
  window.u = u;
  Object.defineProperty(window, 'd', {
    get: () => appState,
    set: (v) => {
      appState = v;
      d = v;
    },
    configurable: true
  });
  Object.defineProperty(window, 'selectedDate', {
    get: () => selectedDate,
    set: (v) => { selectedDate = v; },
    configurable: true
  });
  Object.defineProperty(window, 'currentView', {
    get: () => currentView,
    set: (v) => { currentView = v; },
    configurable: true
  });
  Object.defineProperty(window, 'shouldScrollToNow', {
    get: () => shouldScrollToNow,
    set: (v) => { shouldScrollToNow = v; },
    configurable: true
  });
}

function getTodayDateString() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ==========================================
// MIGRATION DỮ LIỆU TOÀN DIỆN (CHANGE-TRACKING & METADATA)
// ==========================================
function migrateDataRecords(data) {
  if (!data || typeof data !== 'object') return data;

  // Nếu data chưa có schemaVersion → gán schemaVersion = 2
  if (!data.schemaVersion) {
    data.schemaVersion = 2;
  }

  if (!data.streakDayOverrides || typeof data.streakDayOverrides !== 'object') {
    data.streakDayOverrides = {};
  }
  if (!data.settings) data.settings = {};
  if (!data.settings.streak || typeof data.settings.streak !== 'object') {
    const oldT = data.settings.streakThreshold !== undefined ? Number(data.settings.streakThreshold) || 0.7 : 0.7;
    data.settings.streak = {
      threshold: oldT,
      weekdayThresholds: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
      thresholdEditableOnlyOnSunday: true,
      weeklyRelief: { usedInWeekKey: null }
    };
  } else {
    if (data.settings.streak.threshold === undefined && data.settings.streakThreshold !== undefined) {
      data.settings.streak.threshold = Number(data.settings.streakThreshold) || 0.7;
    }
    if (!data.settings.streak.weekdayThresholds || typeof data.settings.streak.weekdayThresholds !== 'object') {
      data.settings.streak.weekdayThresholds = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
    }
    if (data.settings.streak.thresholdEditableOnlyOnSunday === undefined) {
      data.settings.streak.thresholdEditableOnlyOnSunday = true;
    }
    if (!data.settings.streak.weeklyRelief || typeof data.settings.streak.weeklyRelief !== 'object') {
      data.settings.streak.weeklyRelief = { usedInWeekKey: null };
    }
  }

  const currentDevId = (typeof deviceId !== 'undefined' && deviceId)
    ? deviceId
    : ((typeof getDeviceId === 'function' ? getDeviceId() : null) || null);

  const ensureRecordFields = (rec) => {
    if (!rec || typeof rec !== 'object') return;
    // 1. Nếu thiếu updatedAt thì gán updatedAt = 0
    if (rec.updatedAt === undefined || rec.updatedAt === null) {
      rec.updatedAt = 0;
    } else {
      const num = Number(rec.updatedAt);
      rec.updatedAt = Number.isFinite(num) ? num : 0;
    }
    // 2. Nếu thiếu deleted thì gán deleted = false
    if (rec.deleted === undefined || rec.deleted === null) {
      rec.deleted = false;
    } else {
      rec.deleted = Boolean(rec.deleted);
    }
    // 3. Nếu thiếu updatedBy thì để null hoặc deviceId hiện tại
    if (rec.updatedBy === undefined) {
      rec.updatedBy = currentDevId;
    }
  };

  // Mọi record thuộc tasks, fixedEvents, transientEvents
  if (Array.isArray(data.tasks)) data.tasks.forEach(ensureRecordFields);
  if (Array.isArray(data.fixedEvents)) data.fixedEvents.forEach(ensureRecordFields);
  if (Array.isArray(data.transientEvents)) data.transientEvents.forEach(ensureRecordFields);

  // Chuẩn hóa metadata cho streakDayOverrides và settings.streak phục vụ đồng bộ đa thiết bị
  if (data.streakDayOverrides && typeof data.streakDayOverrides === 'object') {
    for (const k of Object.keys(data.streakDayOverrides)) {
      const ov = data.streakDayOverrides[k];
      if (ov && typeof ov === 'object') {
        ensureRecordFields(ov);
      }
    }
  }
  if (data.settings && typeof data.settings === 'object') {
    if (data.settings.headerSyncTarget !== 'gdrive' && data.settings.headerSyncTarget !== 'gcal') {
      data.settings.headerSyncTarget = 'gcal';
    }
    if (data.settings.streak && typeof data.settings.streak === 'object') {
      ensureRecordFields(data.settings.streak);
      if (!data.settings.streak.weekdayThresholdsUpdatedAt || typeof data.settings.streak.weekdayThresholdsUpdatedAt !== 'object') {
        data.settings.streak.weekdayThresholdsUpdatedAt = {};
      }
      if (data.settings.streak.weeklyRelief && typeof data.settings.streak.weeklyRelief === 'object') {
        ensureRecordFields(data.settings.streak.weeklyRelief);
      }
    }
  }

  // notes (kèm gán id UUID nếu thiếu)
  if (Array.isArray(data.notes)) {
    data.notes.forEach(n => {
      if (!n.id) {
        n.id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
          ? crypto.randomUUID()
          : ('note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9));
      }
      ensureRecordFields(n);
    });
  }

  // noisyIntervals (cả ở root hoặc trong settings)
  if (Array.isArray(data.noisyIntervals)) {
    data.noisyIntervals.forEach((ni, idx) => {
      if (!ni.id) ni.id = 'ni-' + idx + '-' + Date.now();
      ensureRecordFields(ni);
    });
  }
  if (data.settings && Array.isArray(data.settings.noisyIntervals)) {
    data.settings.noisyIntervals.forEach((ni, idx) => {
      if (!ni.id) ni.id = 'ni-' + idx + '-' + Date.now();
      ensureRecordFields(ni);
    });
  }

  // goals.years / monthGoals / dailyGoals
  if (data.goals && typeof data.goals === 'object') {
    if (Array.isArray(data.goals.years)) data.goals.years.forEach(ensureRecordFields);
    if (Array.isArray(data.goals.monthGoals)) data.goals.monthGoals.forEach(ensureRecordFields);
    if (Array.isArray(data.goals.dailyGoals)) data.goals.dailyGoals.forEach(ensureRecordFields);
  }

  // Dọn dẹp triệt để các trường Transition Time cũ nếu có trong backup/localStorage
  if (data.settings && typeof data.settings === 'object') {
    delete data.settings.transitionTimeEnabled;
    delete data.settings.transitionRules;
    delete data.settings.transitionTime;

    // Khởi tạo & chuẩn hóa data model Transition mới nếu thiếu
    if (!data.settings.transition || typeof data.settings.transition !== 'object') {
      data.settings.transition = {
        enabledBeforeStart: true,
        enabledAfterEnd: true,
        minutes: 10,
        applyTo: {
          task: true,
          fixed: false,
          transient: false
        },
        conflictMode: "max"
      };
    } else {
      if (data.settings.transition.enabledBeforeStart === undefined) data.settings.transition.enabledBeforeStart = true;
      if (data.settings.transition.enabledAfterEnd === undefined) data.settings.transition.enabledAfterEnd = true;
      if (typeof data.settings.transition.minutes !== 'number' || isNaN(data.settings.transition.minutes)) {
        data.settings.transition.minutes = 10;
      }
      if (!data.settings.transition.applyTo || typeof data.settings.transition.applyTo !== 'object') {
        data.settings.transition.applyTo = { task: true, fixed: false, transient: false };
      } else {
        if (data.settings.transition.applyTo.task === undefined) data.settings.transition.applyTo.task = true;
        if (data.settings.transition.applyTo.fixed === undefined) data.settings.transition.applyTo.fixed = false;
        if (data.settings.transition.applyTo.transient === undefined) data.settings.transition.applyTo.transient = false;
      }
      if (!['max', 'sum'].includes(data.settings.transition.conflictMode)) {
        data.settings.transition.conflictMode = "max";
      }
    }
  }
  if (Array.isArray(data.tasks)) {
    data.tasks.forEach(t => {
      delete t.useTransition;
      delete t.transitionMins;
    });
  }
  if (Array.isArray(data.fixedEvents)) {
    data.fixedEvents.forEach(e => {
      delete e.useTransition;
      delete e.transitionMins;
    });
  }
  if (Array.isArray(data.transientEvents)) {
    data.transientEvents.forEach(e => {
      delete e.useTransition;
      delete e.transitionMins;
    });
  }

  return data;
}

if (typeof window !== 'undefined') {
  window.migrateDataRecords = migrateDataRecords;
}
if (typeof globalThis !== 'undefined') {
  globalThis.migrateDataRecords = migrateDataRecords;
}

function loadData() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : JSON.parse(JSON.stringify(DEFAULT_DATA));
    const isFirstRun = !raw;
    if (!parsed.schemaVersion || parsed.schemaVersion < 2) {
      parsed.schemaVersion = 2;
    }
    // Migration checks for new fields
    if (!Array.isArray(parsed.tasks)) parsed.tasks = [];
    if (!Array.isArray(parsed.fixedEvents)) parsed.fixedEvents = [];
    if (!Array.isArray(parsed.transientEvents)) parsed.transientEvents = [];
    if (!Array.isArray(parsed.notes)) parsed.notes = [];
    if (!parsed.slotOverrides || typeof parsed.slotOverrides !== 'object') parsed.slotOverrides = {};
    if (!parsed.goals || typeof parsed.goals !== 'object') {
      parsed.goals = { years: [], monthGoals: [], dailyGoals: [] };
    }
    if (!Array.isArray(parsed.goals.years)) parsed.goals.years = [];
    if (!Array.isArray(parsed.goals.monthGoals)) parsed.goals.monthGoals = [];
    if (!Array.isArray(parsed.goals.dailyGoals)) parsed.goals.dailyGoals = [];

    // Chạy migration toàn diện cho mọi records
    migrateDataRecords(parsed);

    if (!Array.isArray(parsed.changelogs) || parsed.changelogs.length === 0) {
      parsed.changelogs = JSON.parse(JSON.stringify(INITIAL_CHANGELOGS));
    } else {
      INITIAL_CHANGELOGS.forEach(initLog => {
        const existingIdx = parsed.changelogs.findIndex(c => c.version === initLog.version);
        if (existingIdx === -1) {
          parsed.changelogs.unshift(initLog);
        } else if (initLog.isLatest) {
          parsed.changelogs[existingIdx] = { ...parsed.changelogs[existingIdx], ...initLog };
        }
      });
    }

    if (!parsed.settings || typeof parsed.settings !== 'object') {
      parsed.settings = JSON.parse(JSON.stringify(DEFAULT_DATA.settings));
    }
    if (!parsed.settings.lang) parsed.settings.lang = 'vi';
    if (parsed.settings.notificationsEnabled === undefined) parsed.settings.notificationsEnabled = true;
    if (parsed.settings.notifyEisenhower === undefined) parsed.settings.notifyEisenhower = true;
    if (parsed.settings.notifyFixed === undefined) parsed.settings.notifyFixed = true;
    if (parsed.settings.notifyTransient === undefined) parsed.settings.notifyTransient = true;
    if (parsed.settings.notifyAll === undefined) {
      parsed.settings.notifyAll = (parsed.settings.notifyEisenhower !== false && parsed.settings.notifyFixed !== false && parsed.settings.notifyTransient !== false);
    }
    if (parsed.settings.startNoticeMinutes === undefined) parsed.settings.startNoticeMinutes = 5;
    if (parsed.settings.endNoticeMinutes === undefined) parsed.settings.endNoticeMinutes = 5;
    if (!parsed.settings.focusThresholdMinutes) parsed.settings.focusThresholdMinutes = 30;
    if (parsed.settings.monthZoom === undefined) parsed.settings.monthZoom = 100;
    if (![1, 3, 7].includes(Number(parsed.settings.timelineDaySpan))) parsed.settings.timelineDaySpan = 1;
    if (parsed.settings.focusDimming === undefined) parsed.settings.focusDimming = false;
    if (parsed.settings.focusBlurPx === undefined) parsed.settings.focusBlurPx = 6;
    document.documentElement.style.setProperty('--focus-blur-px', `${parsed.settings.focusBlurPx || 6}px`);
    if (parsed.settings.fontSizePercent === undefined) parsed.settings.fontSizePercent = 100;
    applySystemFontSize(parsed.settings.fontSizePercent || 100);
    if (!['asc', 'desc'].includes(parsed.settings.timeSortOrder)) parsed.settings.timeSortOrder = 'asc';
    if (!Array.isArray(parsed.settings.noisyIntervals)) {
      parsed.settings.noisyIntervals = DEFAULT_DATA.settings.noisyIntervals || [];
    }
    parsed.settings.noisyIntervals.forEach((ni, idx) => {
      if (!ni.id) ni.id = 'ni-' + idx + '-' + Date.now();
      if (!ni.repeatType) ni.repeatType = 'daily';
      if (!ni.repeatDays) ni.repeatDays = [0, 1, 2, 3, 4, 5, 6];
      if (!ni.excludedDates) ni.excludedDates = [];
    });
    if (!parsed.settings.gcal || typeof parsed.settings.gcal !== 'object') {
      parsed.settings.gcal = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.gcal));
    } else {
      if (parsed.settings.gcal.autoSync === undefined) parsed.settings.gcal.autoSync = false;
      if (parsed.settings.gcal.autoSyncOnOpen === undefined) parsed.settings.gcal.autoSyncOnOpen = false;
      if (!parsed.settings.gcal.autoSyncInterval) parsed.settings.gcal.autoSyncInterval = 60;
      if (!parsed.settings.gcal.calendarId) parsed.settings.gcal.calendarId = 'primary';
      if (!parsed.settings.gcal.syncScheduledQuadrants || typeof parsed.settings.gcal.syncScheduledQuadrants !== 'object') {
        parsed.settings.gcal.syncScheduledQuadrants = { q1: true, q2: true, q3: false, q4: false };
      }
      if (!parsed.settings.gcal.syncTimeScope) {
        parsed.settings.gcal.syncTimeScope = 'day';
      }
      if (!parsed.settings.gcal.syncTypes || typeof parsed.settings.gcal.syncTypes !== 'object') {
        parsed.settings.gcal.syncTypes = {
          tasksScheduled: true,
          tasksUnscheduled: false,
          fixed: true,
          transient: true,
          notes: false
        };
      }
      if (!parsed.settings.gcal.colorMapping) {
        parsed.settings.gcal.colorMapping = {
          focusLong: '10',
          focusShort: '9',
          distractLong: '5',
          distractShort: '6',
          transient: '11',
          fixed: '8'
        };
      }
    }
    if (!parsed.settings.gdrive || typeof parsed.settings.gdrive !== 'object') {
      parsed.settings.gdrive = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.gdrive));
    } else {
      if (parsed.settings.gdrive.autoSyncOnOpen === undefined) parsed.settings.gdrive.autoSyncOnOpen = false;
      if (parsed.settings.gdrive.pollingEnabled === undefined) parsed.settings.gdrive.pollingEnabled = false;
    }
    if (!parsed.settings.colors || typeof parsed.settings.colors !== 'object') {
      parsed.settings.colors = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.colors));
    } else {
      if (parsed.settings.colors.scheduledTask === '#7c3aed') {
        parsed.settings.colors.scheduledTask = '#10b981';
      }
      if (!parsed.settings.colors.unscheduledTask) {
        parsed.settings.colors.unscheduledTask = '#d97706';
      }
    }
    if (!parsed.settings.freeTimeDisplayMode) {
      parsed.settings.freeTimeDisplayMode = 'total';
    }
    if (parsed.settings.streakThreshold === undefined) {
      parsed.settings.streakThreshold = 0.7;
    }
    if (!parsed.collapsedSidebarSections || typeof parsed.collapsedSidebarSections !== 'object') {
      parsed.collapsedSidebarSections = {};
    } else {
      // Migrate legacy pale colors to high-contrast anti-glare colors
      if (parsed.settings.colors.focusLong === '#10b981') parsed.settings.colors.focusLong = '#059669';
      if (parsed.settings.colors.distractLong === '#eab308') parsed.settings.colors.distractLong = '#d97706';
      if (parsed.settings.colors.distractShort === '#f97316') parsed.settings.colors.distractShort = '#ea580c';
      if (parsed.settings.colors.fixedEvent === '#64748b') parsed.settings.colors.fixedEvent = '#475569';
      if (parsed.settings.colors.transientEvent === '#ef4444') parsed.settings.colors.transientEvent = '#dc2626';
      if (parsed.settings.colors.scheduledTask === '#8b5cf6' || parsed.settings.colors.scheduledTask === '#7c3aed') {
        parsed.settings.colors.scheduledTask = '#10b981';
      }
    }

    if (!parsed.settings.transition || typeof parsed.settings.transition !== 'object') {
      parsed.settings.transition = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.transition));
    } else {
      if (parsed.settings.transition.enabledBeforeStart === undefined) parsed.settings.transition.enabledBeforeStart = true;
      if (parsed.settings.transition.enabledAfterEnd === undefined) parsed.settings.transition.enabledAfterEnd = true;
      if (typeof parsed.settings.transition.minutes !== 'number' || isNaN(parsed.settings.transition.minutes)) {
        parsed.settings.transition.minutes = 10;
      }
      if (!parsed.settings.transition.applyTo || typeof parsed.settings.transition.applyTo !== 'object') {
        parsed.settings.transition.applyTo = { task: true, fixed: false, transient: false };
      } else {
        if (parsed.settings.transition.applyTo.task === undefined) parsed.settings.transition.applyTo.task = true;
        if (parsed.settings.transition.applyTo.fixed === undefined) parsed.settings.transition.applyTo.fixed = false;
        if (parsed.settings.transition.applyTo.transient === undefined) parsed.settings.transition.applyTo.transient = false;
      }
      if (!['max', 'sum'].includes(parsed.settings.transition.conflictMode)) {
        parsed.settings.transition.conflictMode = 'max';
      }
    }
    if (isFirstRun) {
      saveData(parsed);
    }
    applyCustomColorsToRoot(parsed.settings.colors);
    return parsed;
  } catch (e) {
    console.error('Lỗi khi đọc LocalStorage, khôi phục dữ liệu mẫu:', e);
    return JSON.parse(JSON.stringify(DEFAULT_DATA));
  }
}

function saveData(data = appState) {
  try {
    if (data && typeof data === 'object') {
      migrateDataRecords(data);
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    if (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.notifyChange === 'function') {
      window.StreakEngine.notifyChange();
    }
  } catch (e) {
    console.error('Không thể lưu vào LocalStorage:', e);
  }
}

function loadSyncPrefs() {
  try {
    const raw = localStorage.getItem('chronoflow_sync_prefs');
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        gcalEnabled: Boolean(parsed.gcalEnabled),
        gdriveEnabled: Boolean(parsed.gdriveEnabled),
        headerSyncTarget: parsed.headerSyncTarget === 'gdrive' ? 'gdrive' : 'gcal'
      };
    }
  } catch (e) {}
  const fallbackTarget = (typeof appState !== 'undefined' && appState?.settings?.headerSyncTarget === 'gdrive') ? 'gdrive' : 'gcal';
  return { gcalEnabled: false, gdriveEnabled: false, headerSyncTarget: fallbackTarget };
}

function saveSyncPrefs(prefs) {
  try {
    localStorage.setItem('chronoflow_sync_prefs', JSON.stringify(prefs));
  } catch (e) {}
}

function getHeaderSyncTarget() {
  const fromState = (typeof appState !== 'undefined' && appState?.settings?.headerSyncTarget)
    ? appState.settings.headerSyncTarget
    : ((typeof window !== 'undefined' && window.d?.settings?.headerSyncTarget) ? window.d.settings.headerSyncTarget : null);
  if (fromState === 'gdrive' || fromState === 'gcal') {
    return fromState;
  }
  const prefs = loadSyncPrefs();
  return prefs.headerSyncTarget === 'gdrive' ? 'gdrive' : 'gcal';
}

function updateHeaderSyncTarget(target) {
  const norm = target === 'gdrive' ? 'gdrive' : 'gcal';
  if (typeof appState !== 'undefined' && appState) {
    if (!appState.settings) appState.settings = {};
    appState.settings.headerSyncTarget = norm;
    touch(appState.settings);
  }
  if (typeof window !== 'undefined' && window.d && window.d.settings) {
    window.d.settings.headerSyncTarget = norm;
  }
  const prefs = loadSyncPrefs();
  prefs.headerSyncTarget = norm;
  saveSyncPrefs(prefs);
  if (typeof saveData === 'function') {
    saveData();
  }

  const btnGcal = document.getElementById('header-shortcut-opt-gcal');
  const btnGdrive = document.getElementById('header-shortcut-opt-gdrive');
  if (btnGcal) btnGcal.classList.toggle('active', norm === 'gcal');
  if (btnGdrive) btnGdrive.classList.toggle('active', norm === 'gdrive');
  const selEl = document.getElementById('header-sync-target-select');
  if (selEl && selEl.value !== norm) selEl.value = norm;

  if (typeof updateGCalSyncWidget === 'function') {
    updateGCalSyncWidget('idle');
  }
  if (typeof updateStaticLanguageStrings === 'function') {
    updateStaticLanguageStrings();
  }

  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
  const label = norm === 'gdrive' ? 'Google Drive (GDrive)' : 'Google Calendar (GCal)';
  if (typeof showToast === 'function') {
    showToast(isEn ? `Header sync shortcut set to: ${label}` : `Đã đổi phím tắt đồng bộ trên Header sang: ${label}`);
  }
  return norm;
}

if (typeof window !== 'undefined') {
  window.loadSyncPrefs = loadSyncPrefs;
  window.saveSyncPrefs = saveSyncPrefs;
  window.getHeaderSyncTarget = getHeaderSyncTarget;
  window.updateHeaderSyncTarget = updateHeaderSyncTarget;
}
if (typeof globalThis !== 'undefined') {
  globalThis.loadSyncPrefs = loadSyncPrefs;
  globalThis.saveSyncPrefs = saveSyncPrefs;
  globalThis.getHeaderSyncTarget = getHeaderSyncTarget;
  globalThis.updateHeaderSyncTarget = updateHeaderSyncTarget;
}

// Global Undo Management
window.lastUndoAction = null;
let undoToastTimeout = null;

function triggerGlobalUndo() {
  if (typeof window.lastUndoAction === 'function') {
    const fn = window.lastUndoAction;
    window.lastUndoAction = null;
    if (undoToastTimeout) {
      clearTimeout(undoToastTimeout);
      undoToastTimeout = null;
    }
    const container = document.getElementById('app-toast-container');
    if (container) {
      container.innerHTML = '';
    }
    fn();
  } else {
    showToast(t('toastUndoExpired'));
  }
}
window.triggerGlobalUndo = triggerGlobalUndo;

// Toast notification system with optional Undo action
function showToast(message, options = {}) {
  let container = document.getElementById('app-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'app-toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  // Clear active timer and clear old toasts to prevent orphaned toasts
  if (undoToastTimeout) {
    clearTimeout(undoToastTimeout);
    undoToastTimeout = null;
  }
  container.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = 'toast-message';

  const hasUndo = typeof options?.onUndo === 'function';
  if (hasUndo) {
    window.lastUndoAction = options.onUndo;
  } else {
    window.lastUndoAction = null;
  }

  const undoHtml = hasUndo
    ? `<button type="button" class="toast-undo-btn" onclick="triggerGlobalUndo()">${t('undoBtn')}</button>`
    : '';

  toast.innerHTML = `<span>${message}</span>${undoHtml}`;
  container.appendChild(toast);

  const duration = typeof options?.duration === 'number' ? options.duration : (hasUndo ? 5000 : 2500);

  undoToastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.25s ease';
    setTimeout(() => {
      if (typeof toast.remove === 'function') {
        toast.remove();
      } else if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
      if (hasUndo && window.lastUndoAction === options.onUndo) {
        window.lastUndoAction = null;
      }
    }, 250);
  }, duration);
}

// Language switcher
function toggleLanguage() {
  appState.settings.lang = appState.settings.lang === 'vi' ? 'en' : 'vi';
  saveData();
  updateStaticLanguageStrings();
  renderApp();
  showToast(appState.settings.lang === 'vi' ? 'Đã đổi sang Tiếng Việt' : 'Switched to English');
}

function updateStaticLanguageStrings() {
  const isEn = appState.settings.lang === 'en';
  const flagLabel = document.getElementById('lang-flag-label');
  if (flagLabel) flagLabel.textContent = isEn ? 'EN' : 'VI';
  
  const sub = document.getElementById('header-brand-subtitle');
  if (sub) sub.textContent = t('brandSubtitle');
  
  const addBtn = document.getElementById('btn-add-task-header');
  if (addBtn) addBtn.textContent = t('btnAddTask');
  const addBtnParent = document.getElementById('btn-add-task-header-parent');
  if (addBtnParent) addBtnParent.title = isEn ? 'Add New Task (Key T)' : 'Thêm Task mới (Phím T)';
  
  document.querySelectorAll('.nav-text-year').forEach(el => el.textContent = t('navYear'));
  document.querySelectorAll('.nav-text-month').forEach(el => el.textContent = t('navMonth'));
  document.querySelectorAll('.nav-text-day').forEach(el => el.textContent = t('navDay'));
  document.querySelectorAll('.nav-text-eisenhower').forEach(el => el.textContent = t('navEisenhower'));
  document.querySelectorAll('.nav-text-settings').forEach(el => el.textContent = t('navSettings'));

  // Mobile Bottom Navigation Labels (Gọn gàng, chống tràn chữ trên màn hình nhỏ)
  document.querySelectorAll('.mobile-nav-text-year').forEach(el => el.textContent = isEn ? 'Year' : 'Năm');
  document.querySelectorAll('.mobile-nav-text-month').forEach(el => el.textContent = isEn ? 'Month' : 'Tháng');
  document.querySelectorAll('.mobile-nav-text-day').forEach(el => el.textContent = isEn ? 'Day' : 'Ngày');
  document.querySelectorAll('.mobile-nav-text-eisenhower').forEach(el => el.textContent = isEn ? 'Matrix' : 'Ma Trận');
  document.querySelectorAll('.mobile-nav-text-settings').forEach(el => el.textContent = isEn ? 'Settings' : 'Cài Đặt');

  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  const sidebar = document.getElementById('app-sidebar-content');
  if (toggleBtn) {
    const isCollapsed = sidebar && sidebar.classList.contains('desktop-collapsed');
    toggleBtn.setAttribute('title', isCollapsed ? (t('showSidebar') || (isEn ? 'Show sidebar (Ctrl+B)' : 'Hiện thanh bên (Ctrl+B)')) : (t('hideSidebar') || (isEn ? 'Hide sidebar (Ctrl+B)' : 'Ẩn thanh bên (Ctrl+B)')));
  }

  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.setAttribute('title', isEn ? 'Toggle Light / Dark theme' : 'Chuyển đổi giao diện Sáng / Tối');
    themeBtn.setAttribute('aria-label', isEn ? 'Toggle theme' : 'Chuyển đổi giao diện');
  }

  const headerGcalBtn = document.getElementById('header-gcal-btn');
  const syncTarget = typeof getHeaderSyncTarget === 'function' ? getHeaderSyncTarget() : 'gcal';
  if (headerGcalBtn) {
    headerGcalBtn.setAttribute('title', syncTarget === 'gdrive'
      ? (isEn ? 'Google Drive Sync' : 'Đồng bộ Google Drive')
      : (isEn ? 'Google Calendar Sync' : 'Đồng bộ Google Calendar')
    );
  }
  const headerGcalText = document.getElementById('header-gcal-text');
  if (headerGcalText && !headerGcalBtn?.classList.contains('syncing')) {
    const isConnected = typeof getGCalToken === 'function' && !!getGCalToken();
    if (syncTarget === 'gdrive') {
      headerGcalText.textContent = isConnected ? 'GDrive OK' : 'GDrive';
    } else {
      headerGcalText.textContent = isConnected ? 'GCal OK' : 'GCal';
    }
  }

  const headerStreakBtn = document.getElementById('header-streak-badge');
  if (headerStreakBtn) {
    headerStreakBtn.setAttribute('title', isEn ? 'View Discipline Streak & Productivity Stats' : 'Xem Chi Tiết Chuỗi Kỷ Luật & Số Liệu Năng Suất');
  }

  document.querySelectorAll('.nav-btn[data-view="year"]').forEach(el => el.setAttribute('title', isEn ? 'Year View (Key 1)' : 'Xem Năm (Phím 1)'));
  document.querySelectorAll('.nav-btn[data-view="month"]').forEach(el => el.setAttribute('title', isEn ? 'Month View (Key 2)' : 'Xem Tháng (Phím 2)'));
  document.querySelectorAll('.nav-btn[data-view="day"]').forEach(el => el.setAttribute('title', isEn ? 'Day View (Key 3)' : 'Xem Ngày (Phím 3)'));
  document.querySelectorAll('.nav-btn[data-view="eisenhower"]').forEach(el => el.setAttribute('title', isEn ? 'Eisenhower Matrix (Key 4)' : 'Ma Trận Eisenhower (Phím 4)'));

  document.querySelectorAll('.mobile-nav-btn[data-view="day"]').forEach(el => el.setAttribute('title', isEn ? 'Day (Key 3)' : 'Ngày (Phím 3)'));
  document.querySelectorAll('.mobile-nav-btn[data-view="eisenhower"]').forEach(el => el.setAttribute('title', isEn ? 'Matrix (Key 4)' : 'Ma Trận Eisenhower (Phím 4)'));
  document.querySelectorAll('.mobile-nav-btn[data-view="year"]').forEach(el => el.setAttribute('title', isEn ? 'Year (Key 1)' : 'Năm (Phím 1)'));
  document.querySelectorAll('.mobile-nav-btn[data-view="settings"]').forEach(el => el.setAttribute('title', isEn ? 'Settings (Key S)' : 'Cài Đặt (Phím S)'));

  const settingsLabel = document.getElementById('floating-settings-label');
  if (settingsLabel) settingsLabel.textContent = isEn ? 'Settings' : 'Cài Đặt';
  const settingsBtn = document.getElementById('btn-floating-settings');
  if (settingsBtn) settingsBtn.setAttribute('title', isEn ? 'System Settings (Key S)' : 'Cài đặt hệ thống (Phím S)');

  updateSettingsModalI18n();
}

// ==========================================
// 3. THUẬT TOÁN TÍNH THỜI GIAN RẢNH & SMART TAGS
// ==========================================
/**
 * Chuẩn hóa ngày giờ sang 'YYYY-MM-DD' theo đúng múi giờ địa phương (Local Time).
 * Tuyệt đối không dùng toISOString() để tránh lệch ngày khi người dùng làm việc vào ban đêm.
 */
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
window.toLocalDateKey = toLocalDateKey;

function timeToMinutes(timeStr) {
  if (typeof timeStr === 'number') return Math.min(1440, Math.max(0, timeStr));
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

function formatDuration(totalMinutes) {
  const m = Math.max(0, Math.round(Number(totalMinutes) || 0));
  const isEn = appState && appState.settings && appState.settings.lang === 'en';
  if (m < 60) return `${m} ${isEn ? 'min' : 'phút'}`;
  const hours = Math.floor(m / 60);
  const remainingMins = m % 60;
  if (remainingMins === 0) return `${hours}${isEn ? 'h' : ' giờ'}`;
  return `${hours}h ${remainingMins}${isEn ? 'm' : 'p'}`;
}

/**
 * Kiểm tra xem một mục (task, fixed event, transient event) có hiệu lực vào ngày targetDateStr không.
 * Hỗ trợ toàn diện tính năng lặp lại kiểu Google Calendar (Daily, Weekly, Monthly, Weekdays, Start Date, End Date).
 */
function isItemActiveOnDate(item, targetDateStr) {
  if (!item || item.deleted || !targetDateStr || typeof targetDateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(targetDateStr)) return false;

  // 0. Kiểm tra ngày bị loại trừ (nếu người dùng xóa riêng một ngày cụ thể)
  const exclusions = item.excludedDates || item.recurrenceExclusions;
  if (exclusions && Array.isArray(exclusions) && exclusions.includes(targetDateStr)) {
    return false;
  }

  // 1. Kiểm tra ngày bắt đầu (Start Date)
  const startDate = item.startDate || (item.date ? item.date : null);
  if (startDate && targetDateStr < startDate) {
    return false;
  }

  // 2. Kiểm tra ngày kết thúc (End Date)
  const endDate = item.endDate || item.repeatEndDate || null;
  if (endDate && targetDateStr > endDate) {
    return false;
  }

  const isLegacyNoisy = !!(item.start && item.end && !item.date && !item.repeatType);
  const repeatType = item.repeatType || item.recurrence || (isLegacyNoisy ? 'daily' : 'none');

  // 3. Nếu không có lặp lại
  if (repeatType === 'none') {
    // Tương thích ngược với fixed event truyền thống (có daysOfWeek)
    if (!item.date && Array.isArray(item.daysOfWeek) && item.daysOfWeek.length > 0) {
      const [y, m, d] = targetDateStr.split('-').map(Number);
      const dObj = new Date(y, m - 1, d);
      return item.daysOfWeek.includes(dObj.getDay());
    }
    return item.date === targetDateStr;
  }

  // 4. Nếu có lặp lại
  const [y, m, d] = targetDateStr.split('-').map(Number);
  const targetDateObj = new Date(y, m - 1, d);
  const targetDayOfWeek = targetDateObj.getDay(); // 0: CN, 1: T2, ..., 6: T7

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
    // 1. Nếu ngày mục tiêu trùng đúng ngày tạo / ngày thực hiện ban đầu được chỉ định
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
      const sObj = new Date(sy, sm - 1, sd);
      return sObj.getDay() === targetDayOfWeek;
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

/**
 * Lấy nhãn hiển thị tần suất lặp lại (Google Calendar Style badge)
 */
function getRepeatLabel(item) {
  if (!item) return '';
  const isLegacyNoisy = !!(item.start && item.end && !item.date && !item.repeatType);
  const type = item.repeatType || (isLegacyNoisy ? 'daily' : 'none');
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  if (!type || type === 'none') {
    if (!item.date && Array.isArray(item.daysOfWeek) && item.daysOfWeek.length > 0) {
      if (item.daysOfWeek.length === 7) return t('repeatDaily');
      if (item.daysOfWeek.length === 5 && !item.daysOfWeek.includes(0) && !item.daysOfWeek.includes(6)) return t('repeatWeekdays');
      return item.daysOfWeek.map(d => dayNames[d]).join(',');
    }
    return '';
  }

  if (type === 'daily') return t('repeatDaily');
  if (type === 'every_2_days') return t('repeatEvery2Days') || 'Mỗi 2 ngày';
  if (type === 'custom' || type === 'interval') {
    const interval = item.repeatInterval || 1;
    return `Mỗi ${interval} ngày`;
  }
  if (type === 'weekdays') return t('repeatWeekdays');
  if (type === 'monthly') return t('repeatMonthly');
  if (type === 'weekly') {
    const days = item.repeatDays || item.daysOfWeek || [];
    if (days.length === 7) return t('repeatDaily');
    if (days.length === 5 && !days.includes(0) && !days.includes(6)) return t('repeatWeekdays');
    return days.map(d => dayNames[d]).join(',');
  }
  return '';
}

/**
 * Trả về slot đã xếp của task trên ngày cụ thể (hỗ trợ recurrence linh hoạt)
 */
function getTaskAssignedSlot(task, dateStr = selectedDate) {
  if (!task || task.deleted) return null;
  if (!isItemActiveOnDate(task, dateStr)) return null;

  // 1. Kiểm tra nếu có override riêng cho ngày cụ thể này
  if (task.assignedSlotsByDate && task.assignedSlotsByDate[dateStr] !== undefined) {
    return task.assignedSlotsByDate[dateStr]; // Có thể là null nếu ngày này bị gỡ lịch
  }

  // 2. Nếu task thuộc chế độ xếp lịch thủ công (manual) với giờ cố định
  if (task.scheduleMode === 'manual' && task.manualStartTime) {
    const duration = Math.max(5, (typeof task.estimatedMinutes === 'number' && !isNaN(task.estimatedMinutes) && task.estimatedMinutes > 0) ? task.estimatedMinutes : 30);
    const startMins = timeToMinutes(task.manualStartTime);
    const endMins = Math.min(1440, startMins + duration);
    return {
      start: task.manualStartTime,
      end: minutesToTime(endMins)
    };
  }

  // 3. Nếu là task đơn lẻ có assignedSlot và đúng ngày
  if ((!task.repeatType || task.repeatType === 'none') && task.date === dateStr && task.assignedSlot) {
    return task.assignedSlot;
  }

  // 4. Nếu là task lặp lại có assignedSlot chung
  if (task.repeatType && task.repeatType !== 'none' && task.assignedSlot) {
    return task.assignedSlot;
  }

  return null;
}

/**
 * Kiểm tra trạng thái hoàn thành của task trên ngày cụ thể
 */
function isTaskDoneOnDate(task, dateStr = selectedDate) {
  if (!task || task.deleted) return false;
  if (task.completedDates && Array.isArray(task.completedDates) && task.completedDates.includes(dateStr)) {
    return true;
  }
  if ((!task.repeatType || task.repeatType === 'none') && task.date === dateStr && task.status === 'done') {
    return true;
  }
  return false;
}

/**
 * Toggle trạng thái hoàn thành của task trên ngày cụ thể
 */
function toggleTaskDone(taskId, dateStr = selectedDate) {
  shouldScrollToNow = false;
  const task = appState.tasks.find(t => t.id === taskId);
  if (task && !task.deleted) {
    touch(task);
    const beforeState = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : null;
    const wasMetToday = beforeState?.todayMetrics?.isMet;

    if (!task.completedDates) task.completedDates = [];
    const isCurrentlyDone = isTaskDoneOnDate(task, dateStr);
    if (isCurrentlyDone) {
      task.completedDates = task.completedDates.filter(d => d !== dateStr);
      if (!task.repeatType || task.repeatType === 'none') {
        if (task.date === dateStr) task.status = 'todo';
      }
    } else {
      if (!task.completedDates.includes(dateStr)) {
        task.completedDates.push(dateStr);
      }
      if (!task.repeatType || task.repeatType === 'none') {
        if (task.date === dateStr) task.status = 'done';
      }
    }
    saveData();
    renderApp();

    if (typeof window !== 'undefined' && window.StreakEngine) {
      const afterState = window.StreakEngine.notifyChange();
      if (!wasMetToday && afterState?.todayMetrics?.isMet) {
        triggerStreakCelebration(afterState.currentStreak);
        const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
        showToast(isEn ? `Goal Achieved! Current Streak: ${afterState.currentStreak} Days!` : `Xuất sắc! Đã hoàn thành mục tiêu giữ chuỗi kỷ luật: ${afterState.currentStreak} ngày!`);
      }
    }
  }
}

/**
 * Helper đồng bộ 2 chiều giữa Ngày thực hiện và Ngày bắt đầu chuỗi lặp
 */
function syncRecurrenceDate(prefix, source = 'main') {
  const mainDateEl = document.getElementById(`${prefix}-date`);
  const recStartEl = document.getElementById(`${prefix}-repeat-start`);
  if (!mainDateEl || !recStartEl) return;

  if (source === 'main') {
    recStartEl.value = mainDateEl.value;
  } else {
    mainDateEl.value = recStartEl.value;
  }

  // Tự động chọn thứ tương ứng nếu đang chọn weekly mà chưa chọn thứ nào
  const repeatTypeEl = document.getElementById(`${prefix}-repeat-type`);
  if (repeatTypeEl && repeatTypeEl.value === 'weekly') {
    const checked = document.querySelectorAll(`input[name="${prefix}-repeat-day"]:checked`);
    if (checked.length === 0 && mainDateEl.value) {
      const [y, m, d] = mainDateEl.value.split('-').map(Number);
      const dayIdx = new Date(y, m - 1, d).getDay();
      const targetCb = document.querySelector(`input[name="${prefix}-repeat-day"][value="${dayIdx}"]`);
      if (targetCb) {
        targetCb.checked = true;
        const parentLabel = targetCb.closest('.day-chip-btn');
        if (parentLabel) parentLabel.classList.add('selected');
      }
    }
  }
}

/**
 * Helper HTML render bộ chọn Lặp lại (Recurrence) phong cách Google Calendar
 */
function renderRecurrenceInputs(prefix, config = {}) {
  const isEn = appState && appState.settings && appState.settings.lang === 'en';
  const repeatType = config.repeatType || 'none';
  const repeatDays = Array.isArray(config.repeatDays) && config.repeatDays.length > 0
                   ? config.repeatDays
                   : (Array.isArray(config.daysOfWeek) && config.daysOfWeek.length > 0
                      ? config.daysOfWeek
                      : [1, 2, 3, 4, 5]);
  const repeatInterval = config.repeatInterval || (repeatType === 'every_2_days' ? 2 : 1);
  const startDate = config.startDate || config.date || selectedDate;
  const endDate = config.endDate || '';

  const dayNames = isEn ? [
    { idx: 0, label: 'Sun' },
    { idx: 1, label: 'Mon' },
    { idx: 2, label: 'Tue' },
    { idx: 3, label: 'Wed' },
    { idx: 4, label: 'Thu' },
    { idx: 5, label: 'Fri' },
    { idx: 6, label: 'Sat' }
  ] : [
    { idx: 0, label: 'CN' },
    { idx: 1, label: 'T2' },
    { idx: 2, label: 'T3' },
    { idx: 3, label: 'T4' },
    { idx: 4, label: 'T5' },
    { idx: 5, label: 'T6' },
    { idx: 6, label: 'T7' }
  ];

  return `
    <div class="recurrence-box">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label" style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
          <span style="font-weight:700; font-size:13px; color:var(--text-primary);">${t('repeatLabel')}</span>
          <span id="${prefix}-repeat-badge-indicator" class="repeat-badge" style="${repeatType !== 'none' ? '' : 'display:none;'}">
            ${repeatType !== 'none' ? t('repeatBadge') : ''}
          </span>
        </label>
        <select id="${prefix}-repeat-type" class="form-select" onchange="handleRecurrenceTypeChange('${prefix}')">
          <option value="none" ${repeatType === 'none' ? 'selected' : ''}>${t('repeatNone')}</option>
          <option value="daily" ${repeatType === 'daily' ? 'selected' : ''}>${t('repeatDaily')}</option>
          <option value="every_2_days" ${repeatType === 'every_2_days' ? 'selected' : ''}>${t('repeatEvery2Days') || (isEn ? 'Every 2 days' : 'Mỗi 2 ngày (Cách ngày)')}</option>
          <option value="weekdays" ${repeatType === 'weekdays' ? 'selected' : ''}>${t('repeatWeekdays')}</option>
          <option value="weekly" ${repeatType === 'weekly' ? 'selected' : ''}>${t('repeatWeekly')}</option>
          <option value="monthly" ${repeatType === 'monthly' ? 'selected' : ''}>${t('repeatMonthly')}</option>
          <option value="custom" ${repeatType === 'custom' || repeatType === 'interval' ? 'selected' : ''}>${t('repeatInterval') || (isEn ? 'Custom (Every N days)' : 'Tùy chỉnh (Mỗi N ngày)')}</option>
        </select>
      </div>

      <!-- Khung tùy chọn nâng cao khi có lặp lại -->
      <div id="${prefix}-recurrence-extra" style="${repeatType === 'none' ? 'display:none;' : 'display:flex; flex-direction:column; gap:10px; margin-top:2px;'}">
        <!-- Tùy chọn khoảng cách ngày khi chọn custom -->
        <div id="${prefix}-custom-interval-row" style="${repeatType === 'custom' || repeatType === 'interval' ? 'display:flex;' : 'display:none;'} align-items:center; gap:8px;">
          <label class="form-label" style="margin:0; font-size:12px; color:var(--text-secondary); white-space:nowrap;">${isEn ? 'Repeat every:' : 'Lặp lại mỗi:'}</label>
          <input type="number" id="${prefix}-repeat-interval" class="form-input" min="1" max="365" value="${repeatInterval}" style="width:80px; padding:4px 8px; font-size:13px;">
          <span style="font-size:12px; color:var(--text-secondary);">${isEn ? 'days' : 'ngày một lần'}</span>
        </div>

        <!-- Tùy chọn thứ khi chọn weekly -->
        <div id="${prefix}-weekly-days-row" style="${repeatType === 'weekly' ? 'display:block;' : 'display:none;'}">
          <label class="form-label" style="font-size:12px; margin-bottom:4px; color:var(--text-secondary);">${t('repeatDaysLabel')}</label>
          <div class="day-chip-picker">
            ${dayNames.map(d => {
              const isChecked = repeatDays.includes(d.idx);
              return `
                <label class="day-chip-btn ${isChecked ? 'selected' : ''}">
                  <input type="checkbox" name="${prefix}-repeat-day" value="${d.idx}" ${isChecked ? 'checked' : ''} onchange="this.closest('.day-chip-btn').classList.toggle('selected', this.checked)">
                  <span>${d.label}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>

        <div class="form-row">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:12px; color:var(--text-secondary);">${t('repeatStartDateLabel')}</label>
            <input type="date" id="${prefix}-repeat-start" class="form-input" value="${startDate}" onchange="syncRecurrenceDate('${prefix}', 'rec')">
          </div>
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="font-size:12px; color:var(--text-secondary);">${t('repeatEndDateLabel')}</label>
            <input type="date" id="${prefix}-repeat-end" class="form-input" value="${endDate}" placeholder="${t('repeatNoEnd')}">
          </div>
        </div>
      </div>
    </div>
  `;
}

function handleRecurrenceTypeChange(prefix) {
  const sel = document.getElementById(`${prefix}-repeat-type`);
  const extra = document.getElementById(`${prefix}-recurrence-extra`);
  const weeklyDays = document.getElementById(`${prefix}-weekly-days-row`);
  const customInterval = document.getElementById(`${prefix}-custom-interval-row`);
  const badgeEl = document.getElementById(`${prefix}-repeat-badge-indicator`);
  if (!sel || !extra) return;

  const val = sel.value;
  if (val === 'none') {
    extra.style.display = 'none';
    if (badgeEl) badgeEl.style.display = 'none';
  } else {
    extra.style.display = 'flex';
    if (badgeEl) {
      badgeEl.style.display = 'inline-flex';
      badgeEl.textContent = t('repeatBadge');
    }
    if (customInterval) {
      customInterval.style.display = (val === 'custom' || val === 'interval') ? 'flex' : 'none';
    }
    if (weeklyDays) {
      weeklyDays.style.display = (val === 'weekly') ? 'block' : 'none';
      if (val === 'weekly') {
        const checked = document.querySelectorAll(`input[name="${prefix}-repeat-day"]:checked`);
        if (checked.length === 0) {
          const mainDateVal = document.getElementById(`${prefix}-date`)?.value || document.getElementById(`${prefix}-repeat-start`)?.value || selectedDate;
          if (mainDateVal) {
            const [y, m, d] = mainDateVal.split('-').map(Number);
            const dayIdx = new Date(y, m - 1, d).getDay();
            const targetCb = document.querySelector(`input[name="${prefix}-repeat-day"][value="${dayIdx}"]`);
            if (targetCb) {
              targetCb.checked = true;
              const parentLabel = targetCb.closest('.day-chip-btn');
              if (parentLabel) parentLabel.classList.add('selected');
            }
          }
        }
      }
    }
  }
}

function getRecurrenceFromForm(prefix) {
  const sel = document.getElementById(`${prefix}-repeat-type`);
  const repeatType = sel ? sel.value : 'none';
  const startInput = document.getElementById(`${prefix}-repeat-start`) || document.getElementById(`${prefix}-date`);
  const startDate = startInput?.value || selectedDate;
  const endDate = document.getElementById(`${prefix}-repeat-end`)?.value || null;
  const intervalInput = document.getElementById(`${prefix}-repeat-interval`);
  const repeatInterval = (repeatType === 'custom' || repeatType === 'interval')
    ? (intervalInput ? (Math.max(1, parseInt(intervalInput.value, 10)) || 1) : 1)
    : (repeatType === 'every_2_days' ? 2 : 1);

  let checkedDays = Array.from(document.querySelectorAll(`input[name="${prefix}-repeat-day"]:checked`))
    .map(cb => parseInt(cb.value, 10));

  if (repeatType === 'weekly') {
    if (checkedDays.length === 0 && startDate) {
      const [sy, sm, sd] = startDate.split('-').map(Number);
      const sDay = new Date(sy, sm - 1, sd).getDay();
      checkedDays = [sDay];
    }
  } else if (repeatType === 'daily') {
    checkedDays = [0, 1, 2, 3, 4, 5, 6];
  } else if (repeatType === 'weekdays') {
    checkedDays = [1, 2, 3, 4, 5];
  } else {
    checkedDays = [];
  }

  return {
    repeatType,
    repeatDays: checkedDays,
    repeatInterval,
    startDate,
    endDate: (endDate && endDate.trim()) ? endDate.trim() : null
  };
}

/**
 * Thuật toán tính giờ rảnh chính xác và xử lý việc qua đêm (overnight events)
 */
function calculateFreeTimeSlots(targetDateStr) {
  let busyIntervals = [];

  // 1. Việc cố định (hỗ trợ recurrence)
  appState.fixedEvents.forEach(evt => {
    if (isItemActiveOnDate(evt, targetDateStr)) {
      const s = timeToMinutes(evt.start);
      const e = timeToMinutes(evt.end);
      if (s === e) return;
      if (e < s) {
        // Sự kiện qua đêm (ví dụ: 23:00 - 06:30) -> tách 2 đoạn: [23:00, 24:00] và [00:00, 06:30]
        busyIntervals.push({ start: s, end: 1440, title: evt.title, note: evt.note || '', type: 'fixed', id: evt.id });
        busyIntervals.push({ start: 0, end: e, title: evt.title, note: evt.note || '', type: 'fixed', id: evt.id });
      } else {
        busyIntervals.push({ start: s, end: e, title: evt.title, note: evt.note || '', type: 'fixed', id: evt.id });
      }
    }
  });

  // 2. Việc đột xuất (hỗ trợ recurrence)
  appState.transientEvents.forEach(evt => {
    if (isItemActiveOnDate(evt, targetDateStr)) {
      const s = timeToMinutes(evt.start);
      const e = timeToMinutes(evt.end);
      if (s === e) return;
      if (e < s) {
        busyIntervals.push({ start: s, end: 1440, title: evt.title, note: evt.note || '', type: 'transient', id: evt.id });
        busyIntervals.push({ start: 0, end: e, title: evt.title, note: evt.note || '', type: 'transient', id: evt.id });
      } else {
        busyIntervals.push({ start: s, end: e, title: evt.title, note: evt.note || '', type: 'transient', id: evt.id });
      }
    }
  });

  // 3. Task đã xếp lịch trên ngày này (hỗ trợ recurrence)
  appState.tasks.forEach(task => {
    if (isItemActiveOnDate(task, targetDateStr)) {
      const slot = getTaskAssignedSlot(task, targetDateStr);
      if (slot) {
        const s = timeToMinutes(slot.start);
        const e = timeToMinutes(slot.end);
        if (e > s) {
          busyIntervals.push({
            start: s,
            end: e,
            title: task.title,
            note: task.note || '',
            type: 'scheduled',
            taskId: task.id
          });
        }
      }
    }
  });

  // Sắp xếp các khoảng bận theo thời gian bắt đầu
  busyIntervals.sort((a, b) => a.start - b.start || a.end - b.end);

  // Hợp nhất các khoảng bận trùng nhau (Merge overlapping intervals)
  const mergedBusy = [];
  for (let interval of busyIntervals) {
    if (mergedBusy.length === 0) {
      mergedBusy.push({ ...interval });
    } else {
      let prev = mergedBusy[mergedBusy.length - 1];
      if (interval.start <= prev.end) {
        prev.end = Math.max(prev.end, interval.end);
      } else {
        mergedBusy.push({ ...interval });
      }
    }
  }

  // Thuật toán đảo ngược: Tìm các khoảng trống từ 00:00 (0) đến 24:00 (1440)
  const rawFreeGaps = [];
  let currentTime = 0;

  for (let busy of mergedBusy) {
    if (busy.start > currentTime) {
      rawFreeGaps.push({
        start: currentTime,
        end: busy.start
      });
    }
    currentTime = Math.max(currentTime, busy.end);
  }

  if (currentTime < 1440) {
    rawFreeGaps.push({
      start: currentTime,
      end: 1440
    });
  }

  // Chuẩn hóa và gộp các khung giờ ồn ào (Noisy intervals có hỗ trợ Recurrence)
  const rawNoisyList = appState.settings.noisyIntervals || [];
  const noisyIntervals = [];
  for (let i = 0; i < rawNoisyList.length; i++) {
    const n = rawNoisyList[i];
    if (!isItemActiveOnDate(n, targetDateStr)) continue;
    const s = timeToMinutes(n.start);
    const e = timeToMinutes(n.end);
    if (s < e) {
      noisyIntervals.push({ start: s, end: e, label: n.label || '', index: i, id: n.id });
    }
  }
  noisyIntervals.sort((a, b) => a.start - b.start || a.end - b.end);

  const mergedNoisy = [];
  for (let item of noisyIntervals) {
    if (mergedNoisy.length === 0) {
      mergedNoisy.push({ 
        start: item.start, 
        end: item.end, 
        labels: item.label ? [item.label] : [],
        indices: [item.index]
      });
    } else {
      let last = mergedNoisy[mergedNoisy.length - 1];
      if (item.start <= last.end) {
        last.end = Math.max(last.end, item.end);
        if (item.label && !last.labels.includes(item.label)) {
          last.labels.push(item.label);
        }
        if (!last.indices.includes(item.index)) {
          last.indices.push(item.index);
        }
      } else {
        mergedNoisy.push({ 
          start: item.start, 
          end: item.end, 
          labels: item.label ? [item.label] : [],
          indices: [item.index]
        });
      }
    }
  }

  // TÁCH CÁC KHOẢNG RẢNH:
  // Khoảng thời gian khó tập trung sẽ chỉ được bao quanh bởi chính thời gian mà sự ồn ào diễn ra.
  // Khoảng thời gian rảnh còn lại trước/sau sẽ không bị ảnh hưởng và được gán là Dễ tập trung với màu sắc tương ứng.
  const partitionedFreeSlots = [];

  for (let gap of rawFreeGaps) {
    let cur = gap.start;
    // Lấy các khung giờ ồn ào có giao thoa với gap này
    const overlappingNoisy = mergedNoisy.filter(n => Math.max(gap.start, n.start) < Math.min(gap.end, n.end));

    for (let noise of overlappingNoisy) {
      const nStartInGap = Math.max(gap.start, noise.start);
      const nEndInGap = Math.min(gap.end, noise.end);

      // 1. Khoảng thời gian yên tĩnh trước khi ồn ào bắt đầu (nếu có)
      if (nStartInGap > cur) {
        partitionedFreeSlots.push({
          start: cur,
          end: nStartInGap,
          isQuietDefault: true,
          noiseLabels: []
        });
      }

      // 2. Khoảng thời gian ồn ào (chính xác trong thời gian ồn ào diễn ra)
      if (nEndInGap > nStartInGap) {
        partitionedFreeSlots.push({
          start: nStartInGap,
          end: nEndInGap,
          isQuietDefault: false,
          noiseLabels: noise.labels || [],
          noisyIndices: noise.indices || []
        });
      }

      cur = Math.max(cur, nEndInGap);
    }

    // 3. Khoảng thời gian yên tĩnh còn lại sau khi các khung ồn ào kết thúc (nếu có)
    if (cur < gap.end) {
      partitionedFreeSlots.push({
        start: cur,
        end: gap.end,
        isQuietDefault: true,
        noiseLabels: []
      });
    }
  }

  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;

  // Phân tích & Gắn Smart Tag 4 màu cho từng khoảng rảnh
  const analyzedSlots = partitionedFreeSlots.map((slot, index) => {
    const duration = slot.end - slot.start;
    const isLong = duration >= threshold; // >= threshold phút là Dài, < threshold phút là Ngắn

    // Kiểm tra tùy chỉnh tag thủ công từ người dùng
    const overrideKey = `${targetDateStr}_${slot.start}_${slot.end}`;
    const customTag = appState.slotOverrides ? appState.slotOverrides[overrideKey] : null;

    let isQuiet = slot.isQuietDefault;
    let isManualOverride = false;
    if (customTag === 'focus') {
      isQuiet = true;
      isManualOverride = true;
    } else if (customTag === 'distract') {
      isQuiet = false;
      isManualOverride = true;
    }

    let tagType = '';
    let tagLabel = '';
    let color = '';
    let pillClass = '';

    if (isQuiet) {
      if (isLong) {
        tagType = 'focus-long';
        tagLabel = t('tagFocusLong');
        color = appState.settings.colors.focusLong;
        pillClass = 'pill-focus-long';
      } else {
        tagType = 'focus-short';
        tagLabel = t('tagFocusShort');
        color = appState.settings.colors.focusShort;
        pillClass = 'pill-focus-short';
      }
    } else {
      if (isLong) {
        tagType = 'distract-long';
        tagLabel = t('tagDistractLong');
        color = appState.settings.colors.distractLong;
        pillClass = 'pill-distract-long';
      } else {
        tagType = 'distract-short';
        tagLabel = t('tagDistractShort');
        color = appState.settings.colors.distractShort;
        pillClass = 'pill-distract-short';
      }
    }

    return {
      id: `free-${index}`,
      start: slot.start,
      end: slot.end,
      startTimeStr: minutesToTime(slot.start),
      endTimeStr: minutesToTime(slot.end),
      duration,
      isLong,
      isQuiet,
      isQuietDefault: slot.isQuietDefault,
      noiseLabels: slot.noiseLabels || [],
      noisyIndices: slot.noisyIndices || [],
      isManualOverride,
      customTag,
      tagType,
      tagLabel,
      color,
      pillClass
    };
  });

  const totalFreeMinutes = analyzedSlots.reduce((acc, s) => acc + s.duration, 0);
  return {
    busyIntervals,
    freeSlots: analyzedSlots,
    totalFreeMinutes,
    totalFreeMins: totalFreeMinutes
  };
}

/**
 * Lấy điểm Attention cơ bản theo khung giờ (0.0 - 2.0)
 * - 06:00 - 11:00 -> 2.0 (Đỉnh cao năng lượng)
 * - 11:00 - 13:30 -> 0.5 (Trũng năng lượng trưa)
 * - 14:00 - 18:00 -> 1.5 (Tập trung buổi chiều)
 * - 18:00 - 22:00 -> 1.0 (Năng lượng buổi tối)
 * - 22:00 - 06:00 -> 0.0 (Thời gian nghỉ ngơi)
 */
function getBaseAttentionScore(timeString) {
  const mins = timeToMinutes(timeString);
  if (mins >= 360 && mins < 660) { // 06:00 - 11:00
    return 2.0;
  } else if (mins >= 660 && mins < 810) { // 11:00 - 13:30
    return 0.5;
  } else if (mins >= 810 && mins < 840) { // 13:30 - 14:00 (chuyển tiếp)
    return 0.5;
  } else if (mins >= 840 && mins < 1080) { // 14:00 - 18:00
    return 1.5;
  } else if (mins >= 1080 && mins < 1320) { // 18:00 - 22:00
    return 1.0;
  } else { // 22:00 - 06:00
    return 0.0;
  }
}

/**
 * Tính điểm Attention thực tế tại một mốc thời gian = Math.max(0, BaseScore - FatigueScore)
 */
function calculateAttentionScore(timeString, currentFatigue = 0) {
  const base = getBaseAttentionScore(timeString);
  return Math.max(0, Number((base - currentFatigue).toFixed(2)));
}

/**
 * Quét toàn bộ timeline trong ngày để tính toán trạng thái Fatigue Score và điểm Attention thực tế
 * Tự động tăng Fatigue khi hoàn thành Task high/medium attention, và Reset Fatigue về 0 sau sự kiện Recovery
 */
function calculateTimelineAttentionWithFatigue(tasks = appState.tasks, fixedEvents = appState.fixedEvents, targetDateStr = selectedDate) {
  const timelineItems = [];

  // Fixed events
  (fixedEvents || []).forEach(f => {
    if (isItemActiveOnDate(f, targetDateStr)) {
      timelineItems.push({
        type: 'fixedEvent',
        id: f.id,
        title: f.title,
        startMins: timeToMinutes(f.start),
        endMins: timeToMinutes(f.end),
        isRecovery: Boolean(f.isRecovery)
      });
    }
  });

  // Tasks
  (tasks || []).forEach(t => {
    if (isItemActiveOnDate(t, targetDateStr)) {
      const slot = getTaskAssignedSlot(t, targetDateStr);
      if (slot && slot.start && slot.end) {
        timelineItems.push({
          type: 'task',
          id: t.id,
          title: t.title,
          startMins: timeToMinutes(slot.start),
          endMins: timeToMinutes(slot.end),
          attentionLevel: t.attentionLevel || (t.isImportant ? 'high' : (t.isUrgent ? 'medium' : 'low'))
        });
      }
    }
  });

  // Sắp xếp theo thứ tự thời gian bắt đầu
  timelineItems.sort((a, b) => a.startMins - b.startMins);

  // Quét dòng thời gian từ đầu ngày
  let currentFatigue = 0;
  const history = [
    { minute: 0, time: '00:00', fatigueScore: 0, reason: 'start_of_day' }
  ];

  timelineItems.forEach(item => {
    if (item.type === 'task') {
      if (item.attentionLevel === 'high') {
        currentFatigue += 0.5;
        history.push({
          minute: item.endMins,
          time: minutesToTime(item.endMins),
          fatigueScore: currentFatigue,
          reason: `task_high_attention: ${item.title}`
        });
      } else if (item.attentionLevel === 'medium') {
        currentFatigue += 0.2;
        history.push({
          minute: item.endMins,
          time: minutesToTime(item.endMins),
          fatigueScore: currentFatigue,
          reason: `task_medium_attention: ${item.title}`
        });
      }
    } else if (item.type === 'fixedEvent') {
      if (item.isRecovery) {
        currentFatigue = 0; // Reset điểm mệt mỏi
        history.push({
          minute: item.endMins,
          time: minutesToTime(item.endMins),
          fatigueScore: 0,
          reason: `recovery_event: ${item.title}`
        });
      }
    }
  });

  function getFatigueAtMinute(minute) {
    let fatigue = 0;
    for (const entry of history) {
      if (minute >= entry.minute) {
        fatigue = entry.fatigueScore;
      } else {
        break;
      }
    }
    return fatigue;
  }

  function getAttentionAtTime(timeString) {
    const mins = timeToMinutes(timeString);
    const fatigue = getFatigueAtMinute(mins);
    const base = getBaseAttentionScore(timeString);
    return {
      time: timeString,
      minute: mins,
      baseScore: base,
      fatigueScore: fatigue,
      actualAttentionScore: Math.max(0, Number((base - fatigue).toFixed(2)))
    };
  }

  return {
    timelineItems,
    history,
    getCurrentFatigue: () => currentFatigue,
    getFatigueAtMinute,
    getAttentionAtTime
  };
}

/**
 * Tính toán biểu đồ mức độ tập trung / năng lượng theo từng mốc thời gian trong ngày
 * Hỗ trợ reset năng lượng ngay sau các sự kiện Phục hồi (isRecovery: true)
 */
function calculateAttentionEnergyTimeline(targetDateStr = selectedDate) {
  // Lấy các sự kiện phục hồi năng lượng trong ngày
  const recoveryEvents = appState.fixedEvents
    .filter(f => f.isRecovery && isItemActiveOnDate(f, targetDateStr))
    .map(f => ({ start: timeToMinutes(f.start), end: timeToMinutes(f.end), title: f.title }));

  // Hàm tính điểm năng lượng cơ bản (0 - 100) theo nhịp sinh học và các mốc recovery
  function getEnergyScoreAtMinute(minute) {
    // Kiểm tra nếu vừa kết thúc một sự kiện recovery trong vòng 180 phút
    for (const rec of recoveryEvents) {
      if (minute >= rec.end && minute <= rec.end + 180) {
        // Năng lượng tăng tối đa sau khi nghỉ ngơi / thiền / ngủ / thể thao
        const minutesSinceRec = minute - rec.end;
        return Math.max(75, 100 - Math.floor(minutesSinceRec / 6));
      }
    }

    // Nhịp sinh học chuẩn (Circadian rhythm)
    if (minute >= 480 && minute <= 690) {
      // 08:00 - 11:30: Đỉnh cao năng lượng buổi sáng
      return 95;
    } else if (minute > 690 && minute <= 810) {
      // 11:30 - 13:30: Trũng năng lượng buổi trưa
      return 45;
    } else if (minute > 810 && minute <= 1050) {
      // 13:30 - 17:30: Đỉnh cao năng lượng buổi chiều
      return 85;
    } else if (minute > 1050 && minute <= 1260) {
      // 17:30 - 21:00: Năng lượng trung bình buổi tối
      return 60;
    } else {
      // Đêm khuya & sáng sớm
      return 30;
    }
  }

  return {
    recoveryEvents,
    getEnergyScoreAtMinute
  };
}

function getSessionRange(sessionKey) {
  switch (sessionKey) {
    case 'morning': return { start: 360, end: 720 };    // 06:00 - 12:00
    case 'afternoon': return { start: 720, end: 1080 }; // 12:00 - 18:00
    case 'evening': return { start: 1080, end: 1380 };  // 18:00 - 23:00
    default: return null;
  }
}

/**
 * Lấy cấu hình Transition Time hiện tại
 */
function getTransitionSettings() {
  const t = appState.settings?.transition || {};
  return {
    enabledBeforeStart: Boolean(t.enabledBeforeStart),
    enabledAfterEnd: Boolean(t.enabledAfterEnd),
    minutes: Math.max(0, Number(t.minutes) || 0),
    applyTo: {
      task: Boolean(t.applyTo?.task),
      fixed: Boolean(t.applyTo?.fixed),
      transient: Boolean(t.applyTo?.transient)
    },
    conflictMode: t.conflictMode === 'sum' ? 'sum' : 'max'
  };
}

/**
 * Phân loại loại sự kiện (task, fixed, transient)
 */
function getEventTypeCategory(eventOrType) {
  if (!eventOrType) return null;
  const t = typeof eventOrType === 'string' ? eventOrType : (eventOrType.type || (eventOrType.taskId ? 'task' : null));
  if (t === 'task' || t === 'scheduled') return 'task';
  if (t === 'fixed') return 'fixed';
  if (t === 'transient') return 'transient';
  return null;
}

/**
 * Kiểm tra xem một sự kiện có khoảng transition (before hoặc after) hay không
 */
function eventHasTransition(eventOrType, direction) {
  const cfg = getTransitionSettings();
  if (cfg.minutes <= 0) return 0;
  const typeCat = getEventTypeCategory(eventOrType);
  if (!typeCat || !cfg.applyTo[typeCat]) return 0;
  if (direction === 'before' && cfg.enabledBeforeStart) return cfg.minutes;
  if (direction === 'after' && cfg.enabledAfterEnd) return cfg.minutes;
  return 0;
}

/**
 * Tính khoảng đệm chuyển đổi giữa hai sự kiện liền kề theo Quy tắc:
 * - Sự kiện trước có after-end và sự kiện sau có before-start
 * - Nếu conflictMode = 'max' -> lấy max(hai khoảng)
 * - Nếu conflictMode = 'sum' -> cộng hai khoảng
 * - Nếu chỉ một bên có -> lấy khoảng của bên đó
 */
function calculateTransitionBufferBetween(prevEvent, nextEvent) {
  const cfg = getTransitionSettings();
  if (cfg.minutes <= 0) return 0;

  const bufPrev = prevEvent ? eventHasTransition(prevEvent, 'after') : 0;
  const bufNext = nextEvent ? eventHasTransition(nextEvent, 'before') : 0;

  if (bufPrev > 0 && bufNext > 0) {
    return cfg.conflictMode === 'sum' ? (bufPrev + bufNext) : Math.max(bufPrev, bufNext);
  }
  if (bufPrev > 0) return bufPrev;
  if (bufNext > 0) return bufNext;
  return 0;
}

/**
 * Lấy toàn bộ các sự kiện đang hiện hữu trên ngày chỉ định (fixed, transient, scheduled tasks)
 */
function getAllEventsOnDate(targetDateStr, excludeTaskId = null) {
  const events = [];

  // 1. Việc cố định (fixed)
  (appState.fixedEvents || []).forEach(evt => {
    if (isItemActiveOnDate(evt, targetDateStr)) {
      const s = timeToMinutes(evt.start);
      const e = timeToMinutes(evt.end);
      if (s === e) return;
      if (e < s) {
        events.push({ start: s, end: 1440, type: 'fixed', id: evt.id, title: evt.title });
        events.push({ start: 0, end: e, type: 'fixed', id: evt.id, title: evt.title });
      } else {
        events.push({ start: s, end: e, type: 'fixed', id: evt.id, title: evt.title });
      }
    }
  });

  // 2. Việc đột xuất (transient)
  (appState.transientEvents || []).forEach(evt => {
    if (isItemActiveOnDate(evt, targetDateStr)) {
      const s = timeToMinutes(evt.start);
      const e = timeToMinutes(evt.end);
      if (s === e) return;
      if (e < s) {
        events.push({ start: s, end: 1440, type: 'transient', id: evt.id, title: evt.title });
        events.push({ start: 0, end: e, type: 'transient', id: evt.id, title: evt.title });
      } else {
        events.push({ start: s, end: e, type: 'transient', id: evt.id, title: evt.title });
      }
    }
  });

  // 3. Task đã xếp lịch (scheduled tasks, loại trừ task đang xét nếu có)
  (appState.tasks || []).forEach(t => {
    if (t.id === excludeTaskId || t.deleted) return;
    if (isItemActiveOnDate(t, targetDateStr)) {
      const slot = getTaskAssignedSlot(t, targetDateStr);
      if (slot) {
        const s = timeToMinutes(slot.start);
        const e = timeToMinutes(slot.end);
        if (e > s) {
          events.push({ start: s, end: e, type: 'task', id: t.id, title: t.title });
        }
      }
    }
  });

  events.sort((a, b) => a.start - b.start || a.end - b.end);
  return events;
}

/**
 * Tính toán vị trí xếp task vào slot có tự động chèn khoảng transition đệm trước / sau
 * Trả về { fits: boolean, taskStart, taskEnd, bufferBefore, bufferAfter, assigned }
 */
function calculateTaskPlacementInSlot(task, slot, targetDateStr = selectedDate, options = {}) {
  if (!task || !slot) return { fits: false };

  const duration = Math.max(5, (typeof task.estimatedMinutes === 'number' && !isNaN(task.estimatedMinutes) && task.estimatedMinutes > 0) ? task.estimatedMinutes : 25);
  const slotStart = typeof slot.start === 'string' ? timeToMinutes(slot.start) : Number(slot.start);
  const slotEnd = typeof slot.end === 'string' ? timeToMinutes(slot.end) : Number(slot.end);

  if (isNaN(slotStart) || isNaN(slotEnd) || slotStart >= slotEnd) {
    return { fits: false, reason: 'invalid_slot' };
  }

  const allEvents = getAllEventsOnDate(targetDateStr, task.id);

  // Tìm sự kiện liền trước slot (kết thúc trễ nhất tại hoặc trước slotStart)
  const prevEvents = allEvents.filter(e => e.end <= slotStart);
  const prevEvent = prevEvents.length > 0 
    ? prevEvents.reduce((latest, cur) => cur.end > latest.end ? cur : latest, prevEvents[0]) 
    : null;

  // Tìm sự kiện liền sau slot (bắt đầu sớm nhất tại hoặc sau slotEnd)
  const nextEvents = allEvents.filter(e => e.start >= slotEnd);
  const nextEvent = nextEvents.length > 0 
    ? nextEvents.reduce((earliest, cur) => cur.start < earliest.start ? cur : earliest, nextEvents[0]) 
    : null;

  const taskEventObj = { type: 'task', id: task.id };

  // 1. Khoảng đệm trước khi bắt đầu task:
  // Đảm bảo khoảng cách từ sự kiện liền trước (hoặc đầu ngày) tới taskStart >= buffer chuyển đổi yêu cầu
  const bufferBefore = calculateTransitionBufferBetween(prevEvent, taskEventObj);
  const minAllowedStart = Math.max(
    slotStart,
    (prevEvent ? prevEvent.end : 0) + bufferBefore
  );

  // 2. Khoảng đệm sau khi kết thúc task:
  // Đảm bảo khoảng cách từ taskEnd tới sự kiện liền sau (hoặc cuối ngày) >= buffer chuyển đổi yêu cầu
  const bufferAfter = calculateTransitionBufferBetween(taskEventObj, nextEvent);
  const maxAllowedEnd = Math.min(
    slotEnd,
    (nextEvent ? nextEvent.start : 1440) - bufferAfter
  );

  let taskStart = minAllowedStart;
  if (options.forcedStart !== undefined && options.forcedStart !== null) {
    taskStart = Number(options.forcedStart);
    if (taskStart < minAllowedStart) {
      return { fits: false, reason: 'buffer_before_conflict' };
    }
  }

  const taskEnd = taskStart + duration;

  // Quy tắc 6: Nếu sau khi trừ transition mà không còn đủ chỗ -> không xếp vào slot đó
  if (taskStart < slotStart || taskEnd > slotEnd || taskEnd > maxAllowedEnd || taskStart >= taskEnd) {
    return { fits: false, reason: 'insufficient_time' };
  }

  return {
    fits: true,
    taskStart,
    taskEnd,
    bufferBefore,
    bufferAfter,
    assigned: {
      start: minutesToTime(taskStart),
      end: minutesToTime(taskEnd)
    }
  };
}

/**
 * Thuật toán khớp việc vào slot rảnh tối ưu dựa trên Session Preference, Attention Level, Recovery Events & Transition Buffers
 */
function findBestFreeSlotForTask(task, availableSlots, targetDateStr = selectedDate) {
  if (!task) return null;
  const duration = (typeof task.estimatedMinutes === 'number' && task.estimatedMinutes > 0) ? task.estimatedMinutes : 25;
  if (!availableSlots || !Array.isArray(availableSlots) || availableSlots.length === 0) return null;

  // 1. CHẾ ĐỘ XẾP LỊCH THỦ CÔNG (SCHEDULE MODE: MANUAL)
  if (task.scheduleMode === 'manual' && task.manualStartTime && typeof task.manualStartTime === 'string') {
    const manualMins = timeToMinutes(task.manualStartTime);
    // Tìm slot rảnh bao trùm giờ bắt đầu chỉ định thỏa mãn transition
    for (const s of availableSlots) {
      if (s.start <= manualMins && s.end >= manualMins + duration) {
        const placement = calculateTaskPlacementInSlot(task, s, targetDateStr, { forcedStart: manualMins });
        if (placement && placement.fits) {
          return {
            ...s,
            start: manualMins,
            end: s.end,
            duration: s.end - manualMins,
            _placement: placement
          };
        }
      }
    }

    // Nếu không có slot bao trùm chính xác thỏa mãn transition, tìm slot gần nhất thỏa mãn transition
    const validCandidateSlots = [];
    for (const s of availableSlots) {
      const placement = calculateTaskPlacementInSlot(task, s, targetDateStr);
      if (placement && placement.fits) {
        validCandidateSlots.push({ slot: s, placement });
      }
    }
    if (validCandidateSlots.length > 0) {
      const sortedByDistance = [...validCandidateSlots].sort((a, b) => 
        Math.abs(a.placement.taskStart - manualMins) - Math.abs(b.placement.taskStart - manualMins)
      );
      const chosen = sortedByDistance[0];
      return {
        ...chosen.slot,
        _placement: chosen.placement
      };
    }
    return null;
  }

  // 2. CHẾ ĐỘ TỰ ĐỘNG DỰA TRÊN MỨC ĐỘ TẬP TRUNG & PHÂN LOẠI BUỔI
  // Quy tắc 6: Lọc các slot mà sau khi tính transition buffers vẫn còn đủ chỗ cho task
  const candidateSlotsWithPlacement = [];
  for (const s of availableSlots) {
    const placement = calculateTaskPlacementInSlot(task, s, targetDateStr);
    if (placement && placement.fits) {
      candidateSlotsWithPlacement.push({
        slot: s,
        placement
      });
    }
  }

  if (candidateSlotsWithPlacement.length === 0) return null;

  // Xác định attention requirement (hoặc suy luận từ Eisenhower)
  let requiredAttention = task.attentionLevel || 'auto';
  if (requiredAttention === 'auto') {
    if (task.isImportant) {
      requiredAttention = 'high';
    } else if (task.isUrgent) {
      requiredAttention = 'medium';
    } else {
      requiredAttention = 'low';
    }
  }

  const { getEnergyScoreAtMinute } = calculateAttentionEnergyTimeline(targetDateStr);

  // Lọc theo yêu cầu không gian yên tĩnh
  let candidateSlots = candidateSlotsWithPlacement;
  if (task.requireQuiet) {
    const quietSlots = candidateSlotsWithPlacement.filter(c => c.slot.isQuiet);
    if (quietSlots.length > 0) candidateSlots = quietSlots;
  }

  const sessionRange = getSessionRange(task.preferredSession);

  // Chấm điểm từng candidate slot dựa trên Session, Attention & Energy (dùng placement.taskStart thực tế)
  const rankedSlots = candidateSlots.map(c => {
    const s = c.slot;
    const taskStart = c.placement.taskStart;
    const energyScore = getEnergyScoreAtMinute(taskStart);
    let matchScore = 0;

    // 1. Phân loại theo Buổi (Morning / Afternoon / Evening)
    if (sessionRange) {
      const inSession = (taskStart >= sessionRange.start && taskStart < sessionRange.end);
      if (inSession) {
        matchScore += 500; // Trọng số lớn nhất để ưu tiên chọn đúng buổi

        // Ưu tiên xếp vào ĐẦU BUỔI:
        // Slot càng gần thời điểm bắt đầu buổi (sessionRange.start), điểm earliness càng cao
        const sessionLength = sessionRange.end - sessionRange.start;
        const elapsedInSession = Math.max(0, taskStart - sessionRange.start);
        const earlinessRatio = Math.max(0, (sessionLength - elapsedInSession) / sessionLength);

        // Trọng số ưu tiên sự chú ý cao (Attention: High / Important) sẽ đẩy mạnh hơn vào ĐẦU BUỔI
        const earlinessWeight = (requiredAttention === 'high' || task.isImportant) ? 200 : 100;
        matchScore += earlinessRatio * earlinessWeight;
      }
    }

    // 2. Mức độ tập trung (Attention)
    if (requiredAttention === 'high') {
      matchScore += energyScore;
      if (s.tagType === 'focus-long') matchScore += 30;
      if (s.isQuiet) matchScore += 20;
    } else if (requiredAttention === 'medium') {
      matchScore += (100 - Math.abs(energyScore - 65));
      if (s.tagType === 'focus-short') matchScore += 20;
    } else if (requiredAttention === 'low') {
      matchScore += (100 - energyScore);
      if (!s.isQuiet) matchScore += 25;
      if (s.tagType === 'distract-short' || s.tagType === 'distract-long') matchScore += 15;
    } else { // 'any'
      matchScore += 50;
    }

    return { slot: { ...s, _placement: c.placement }, matchScore };
  });

  rankedSlots.sort((a, b) => b.matchScore - a.matchScore);
  return rankedSlots[0].slot;
}

function assignTaskToSlot(taskId, slot, dateStr = selectedDate, options = {}) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task || task.deleted || !slot) return false;

  const duration = Math.max(5, (typeof task.estimatedMinutes === 'number' && !isNaN(task.estimatedMinutes) && task.estimatedMinutes > 0) ? task.estimatedMinutes : 25);
  const slotStart = typeof slot.start === 'string' ? timeToMinutes(slot.start) : Number(slot.start);
  const originalSlotEnd = typeof slot.end === 'string' ? timeToMinutes(slot.end) : Number(slot.end);

  if (isNaN(slotStart) || isNaN(originalSlotEnd) || slotStart >= originalSlotEnd) {
    return false;
  }

  // Tự động tính toán placement chèn khoảng transition
  let placement = slot._placement;
  if (!placement || !placement.fits) {
    placement = calculateTaskPlacementInSlot(task, { start: slotStart, end: originalSlotEnd }, dateStr);
  }

  // Quy tắc 6: Nếu sau khi trừ transition mà không còn đủ chỗ -> không xếp vào slot đó
  if (!placement || !placement.fits) {
    if (!options.silent) {
      const isEn = appState.settings && appState.settings.lang === 'en';
      showToast(isEn 
        ? 'Not enough free time in this slot after reserving transition buffers!' 
        : 'Không đủ thời gian trong slot này sau khi trừ thời gian chuyển đổi (transition)!'
      );
    }
    return false;
  }

  const taskStart = placement.taskStart;
  const taskEnd = placement.taskEnd;

  const previousAssignedByDate = task.assignedSlotsByDate ? JSON.parse(JSON.stringify(task.assignedSlotsByDate)) : {};
  const previousSlot = task.assignedSlot ? { ...task.assignedSlot } : null;
  const previousStatus = task.status;

  const assigned = {
    start: minutesToTime(taskStart),
    end: minutesToTime(taskEnd)
  };

  if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
  task.assignedSlotsByDate[dateStr] = assigned;
  task.assignedSlot = assigned;
  task.status = 'scheduled';
  touch(task);

  const silent = Boolean(options && (options.silent || options.skipRenderAndToast));

  if (!silent) {
    saveData();
    renderApp();

    const remainDur = originalSlotEnd - taskEnd;
    let toastMsg = t('toastSlotAssigned');
    if (remainDur > 0) {
      toastMsg = t('subslotAssignedToast', {
        start: assigned.start,
        end: assigned.end,
        taskDur: duration,
        remainDur: remainDur,
        remainStart: assigned.end,
        remainEnd: minutesToTime(originalSlotEnd)
      });
    }

    showToast(toastMsg, {
      onUndo: () => {
        task.assignedSlotsByDate = previousAssignedByDate;
        task.assignedSlot = previousSlot;
        task.status = previousStatus;
        saveData();
        renderApp();
        showToast(t('toastUndoSuccess'));
      }
    });

    if (typeof pushTaskToGCal === 'function') {
      pushTaskToGCal(task, 'update', dateStr);
    }
  }

  return true;
}

function unassignTask(taskId, dateStr = selectedDate) {
  shouldScrollToNow = false;
  const task = appState.tasks.find(t => t.id === taskId);
  if (task && !task.deleted) {
    touch(task);
    const previousAssignedByDate = task.assignedSlotsByDate ? JSON.parse(JSON.stringify(task.assignedSlotsByDate)) : {};
    const previousSlot = task.assignedSlot ? { ...task.assignedSlot } : null;
    const previousStatus = task.status;

    if (task.assignedSlotsByDate) {
      delete task.assignedSlotsByDate[dateStr];
    }
    if (task.date === dateStr || !task.repeatType || task.repeatType === 'none') {
      task.assignedSlot = null;
      task.status = 'todo';
    }
    saveData();
    renderApp();
    showToast(t('toastTaskUpdated'), {
      onUndo: () => {
        task.assignedSlotsByDate = previousAssignedByDate;
        task.assignedSlot = previousSlot;
        task.status = previousStatus;
        saveData();
        renderApp();
        showToast(t('toastUndoSuccess'));
      }
    });
    if (typeof pushTaskToGCal === 'function') {
      pushTaskToGCal(task, 'update', dateStr);
    }
  }
}

// ==========================================
// 4. RENDERING CHÍNH & SIDEBAR
// ==========================================
function updateHeaderStreakBadge() {
  if (typeof window === 'undefined' || !window.StreakEngine) return;
  const state = window.StreakEngine.getState();
  if (!state) return;
  const streakEl = document.getElementById('header-streak-count');
  const freezeEl = document.getElementById('header-freeze-count');
  const badgeEl = document.getElementById('header-streak-badge');

  if (streakEl) streakEl.textContent = String(state.currentStreak || 0);
  if (freezeEl) freezeEl.textContent = `${state.freezeCount || 0}/${state.maxFreeze || 2}`;
  if (badgeEl) {
    const isEn = typeof appState !== 'undefined' && appState.settings && appState.settings.lang === 'en';
    badgeEl.setAttribute('title', isEn
      ? `Discipline Streak: ${state.currentStreak || 0} days | Streak Freeze: ${state.freezeCount || 0}/${state.maxFreeze || 2} (Click for Productivity Analytics)`
      : `Chuỗi kỷ luật: ${state.currentStreak || 0} ngày | Đóng băng: ${state.freezeCount || 0}/${state.maxFreeze || 2} (Bấm để xem Số liệu Năng suất)`
    );
  }
}
window.updateHeaderStreakBadge = updateHeaderStreakBadge;

/**
 * Cơ chế lưu và khôi phục vị trí cuộn cho toàn bộ các vùng có thanh cuộn độc lập:
 * - Sidebar bên trái (#sidebar-scroll-content, #app-sidebar-content, .sidebar-scroll-content)
 * - Khung cuộn chính Timeline 24h (.timeline-grid-wrapper, #calendar-grid-root)
 * - Khung Ma trận Eisenhower (.eisenhower-grid-layout, .eisenhower-task-list)
 * - Khung nội dung chính (#view-container)
 * - Cửa sổ (window / document)
 */
function saveAndRestoreScroll(renderCallback) {
  const winScrollTop = (typeof window !== 'undefined') ? (window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0) : 0;
  const winScrollLeft = (typeof window !== 'undefined') ? (window.scrollX || document.documentElement.scrollLeft || document.body.scrollLeft || 0) : 0;

  const sidebarEl = document.getElementById('sidebar-scroll-content') || document.getElementById('app-sidebar-content');
  const sidebarScrollTop = sidebarEl ? sidebarEl.scrollTop : 0;
  const sidebarScrollLeft = sidebarEl ? sidebarEl.scrollLeft : 0;

  const viewContainerEl = document.getElementById('view-container');
  const viewScrollTop = viewContainerEl ? viewContainerEl.scrollTop : 0;
  const viewScrollLeft = viewContainerEl ? viewContainerEl.scrollLeft : 0;

  const timelineWrapperEl = document.querySelector('.timeline-grid-wrapper');
  const timelineScrollTop = timelineWrapperEl ? timelineWrapperEl.scrollTop : 0;
  const timelineScrollLeft = timelineWrapperEl ? timelineWrapperEl.scrollLeft : 0;
  const wasUserScrolled = timelineWrapperEl ? (timelineWrapperEl.dataset.userScrolled === 'true') : false;

  const eisenhowerListScrolls = [];
  document.querySelectorAll('.eisenhower-task-list').forEach((el, index) => {
    eisenhowerListScrolls.push({ index, scrollTop: el.scrollTop, scrollLeft: el.scrollLeft });
  });
  const eisenhowerGrid = document.querySelector('.eisenhower-grid-layout');
  const eisenhowerGridScroll = eisenhowerGrid ? eisenhowerGrid.scrollTop : 0;

  if (typeof renderCallback === 'function') {
    renderCallback();
  }

  const originalHtmlBehavior = document.documentElement.style.scrollBehavior;
  const originalBodyBehavior = document.body.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  document.body.style.scrollBehavior = 'auto';

  if (typeof window !== 'undefined') {
    window.scrollTo({ top: winScrollTop, left: winScrollLeft, behavior: 'auto' });
  }

  const newSidebarEl = document.getElementById('sidebar-scroll-content') || document.getElementById('app-sidebar-content');
  if (newSidebarEl) {
    newSidebarEl.style.scrollBehavior = 'auto';
    newSidebarEl.scrollTop = sidebarScrollTop;
    newSidebarEl.scrollLeft = sidebarScrollLeft;
  }

  const newViewEl = document.getElementById('view-container');
  if (newViewEl) {
    newViewEl.style.scrollBehavior = 'auto';
    newViewEl.scrollTop = viewScrollTop;
    newViewEl.scrollLeft = viewScrollLeft;
  }

  const newTimelineWrapper = document.querySelector('.timeline-grid-wrapper');
  if (newTimelineWrapper) {
    newTimelineWrapper.style.scrollBehavior = 'auto';
    if (!shouldScrollToNow) {
      newTimelineWrapper.scrollTop = timelineScrollTop;
      newTimelineWrapper.scrollLeft = timelineScrollLeft;
      if (wasUserScrolled || timelineScrollTop > 0) {
        newTimelineWrapper.dataset.userScrolled = 'true';
      }
    }
    newTimelineWrapper.addEventListener('scroll', () => {
      newTimelineWrapper.dataset.userScrolled = 'true';
      shouldScrollToNow = false;
    }, { passive: true });
  }

  if (eisenhowerListScrolls.length > 0) {
    const newLists = document.querySelectorAll('.eisenhower-task-list');
    eisenhowerListScrolls.forEach(item => {
      if (newLists[item.index]) {
        newLists[item.index].style.scrollBehavior = 'auto';
        newLists[item.index].scrollTop = item.scrollTop;
        newLists[item.index].scrollLeft = item.scrollLeft;
      }
    });
  }
  const newEisenhowerGrid = document.querySelector('.eisenhower-grid-layout');
  if (newEisenhowerGrid && eisenhowerGridScroll) {
    newEisenhowerGrid.style.scrollBehavior = 'auto';
    newEisenhowerGrid.scrollTop = eisenhowerGridScroll;
  }

  if (typeof requestAnimationFrame !== 'undefined') {
    requestAnimationFrame(() => {
      document.documentElement.style.scrollBehavior = originalHtmlBehavior;
      document.body.style.scrollBehavior = originalBodyBehavior;
    });
  }
}
window.saveAndRestoreScroll = saveAndRestoreScroll;

function renderApp() {
  saveAndRestoreScroll(() => {
    document.documentElement.style.setProperty('--focus-blur-px', `${appState.settings.focusBlurPx || 6}px`);
    applySystemFontSize(appState.settings.fontSizePercent || 100);
    updateStaticLanguageStrings();
    updateHeaderStreakBadge();
    const mainContent = document.getElementById('view-container');
    if (!mainContent) return;

    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.view === currentView);
    });
    document.querySelectorAll('.mobile-nav-btn').forEach(btn => {
      if (btn.dataset.view === 'settings') {
        const isSettingsOpen = document.getElementById('settings-overlay-modal')?.classList.contains('active');
        btn.classList.toggle('active', !!isSettingsOpen);
      } else {
        btn.classList.toggle('active', btn.dataset.view === currentView);
      }
    });

    switch (currentView) {
      case 'year':
        renderYearView(mainContent);
        break;
      case 'month':
        renderMonthView(mainContent);
        break;
      case 'day':
        renderDayView(mainContent);
        break;
      case 'eisenhower':
        renderEisenhowerView(mainContent);
        break;
      case 'settings':
        renderSettingsView(mainContent);
        break;
      default:
        renderDayView(mainContent);
    }

    renderSidebar();
  });
}

const I = renderApp;
if (typeof window !== 'undefined') {
  window.I = renderApp;
}

/**
 * Ẩn / hiện một mục trong sidebar theo name tag với hiệu ứng co giãn mượt mà không giật layout
 */
function toggleSidebarSection(sectionKey) {
  if (!appState.collapsedSidebarSections) {
    appState.collapsedSidebarSections = {};
  }
  appState.collapsedSidebarSections[sectionKey] = !appState.collapsedSidebarSections[sectionKey];
  saveData();
  
  const sectionEl = document.querySelector(`.sidebar-section[data-section="${sectionKey}"]`);
  if (sectionEl) {
    const isCollapsed = !!appState.collapsedSidebarSections[sectionKey];
    sectionEl.classList.toggle('is-collapsed', isCollapsed);
    const wrapper = sectionEl.querySelector('.sidebar-collapsible-wrapper');
    if (wrapper) {
      wrapper.classList.toggle('is-collapsed', isCollapsed);
    }
  } else {
    renderSidebar();
  }
}

/**
 * Chuyển đổi nhanh mốc hiển thị thời gian rảnh khi click vào con số thời gian
 */
function cycleFreeTimeMode(event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!appState.settings) appState.settings = {};
  const currentMode = appState.settings.freeTimeDisplayMode || 'total';
  let nextMode = 'total';
  let toastMsg = '';

  const { freeSlots } = calculateFreeTimeSlots(selectedDate);
  const totalFreeMinutes = freeSlots.reduce((acc, cur) => acc + cur.duration, 0);
  const focusFreeMinutes = freeSlots.filter(s => s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);
  const distractFreeMinutes = freeSlots.filter(s => !s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);

  const totalHours = (totalFreeMinutes / 60).toFixed(1);
  const focusHours = (focusFreeMinutes / 60).toFixed(1);
  const distractHours = (distractFreeMinutes / 60).toFixed(1);

  if (currentMode === 'total') {
    nextMode = 'focus';
    toastMsg = t('toastFreeTimeFocus', { hours: focusHours });
  } else if (currentMode === 'focus') {
    nextMode = 'distract';
    toastMsg = t('toastFreeTimeDistract', { hours: distractHours });
  } else {
    nextMode = 'total';
    toastMsg = t('toastFreeTimeTotal', { hours: totalHours });
  }

  appState.settings.freeTimeDisplayMode = nextMode;
  saveData();
  renderSidebar();
  const appearanceMount = document.getElementById('settings-appearance-mount-point');
  if (appearanceMount) appearanceMount.innerHTML = renderSettingsAppearanceHtml();
  showToast(toastMsg);
}

/**
 * Cập nhật mốc hiển thị thời gian rảnh từ Cài đặt
 */
function updateFreeTimeDisplayModeSetting(mode) {
  if (!appState.settings) appState.settings = {};
  appState.settings.freeTimeDisplayMode = mode;
  saveData();
  renderSidebar();
  
  // Cập nhật giao diện trong Settings theo thời gian thực mà không làm giật cuộn trang
  const badge = document.getElementById('free-time-mode-badge');
  if (badge) {
    badge.textContent = mode === 'focus' ? t('freeTimeModeFocus') : mode === 'distract' ? t('freeTimeModeDistract') : t('freeTimeModeTotal');
  }
  const radioInputs = document.querySelectorAll('input[name="freeTimeDisplayModeSetting"]');
  radioInputs.forEach(input => {
    const isSelected = input.value === mode;
    input.checked = isSelected;
    const parentLabel = input.closest('label');
    if (parentLabel) {
      parentLabel.style.background = isSelected ? 'var(--bg-card)' : 'transparent';
      let borderColor = 'var(--border-color)';
      if (isSelected) {
        if (mode === 'focus') borderColor = 'var(--c-focus-long, #059669)';
        else if (mode === 'distract') borderColor = 'var(--c-distract-long, #d97706)';
        else borderColor = 'var(--primary)';
      }
      parentLabel.style.borderColor = borderColor;
    }
  });

  const { freeSlots } = calculateFreeTimeSlots(selectedDate);
  const totalFreeMinutes = freeSlots.reduce((acc, cur) => acc + cur.duration, 0);
  const focusFreeMinutes = freeSlots.filter(s => s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);
  const distractFreeMinutes = freeSlots.filter(s => !s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);

  const totalHours = (totalFreeMinutes / 60).toFixed(1);
  const focusHours = (focusFreeMinutes / 60).toFixed(1);
  const distractHours = (distractFreeMinutes / 60).toFixed(1);

  let toastMsg = '';
  if (mode === 'focus') {
    toastMsg = t('toastFreeTimeFocus', { hours: focusHours });
  } else if (mode === 'distract') {
    toastMsg = t('toastFreeTimeDistract', { hours: distractHours });
  } else {
    toastMsg = t('toastFreeTimeTotal', { hours: totalHours });
  }
  showToast(toastMsg);
}

/**
 * Sắp xếp các sự kiện / công việc theo mốc thời gian:
 * - Khi sự kiện/task có mốc thời gian: sắp xếp theo thời gian bắt đầu (chiều xuôi/tăng dần 'asc' hoặc chiều ngược/giảm dần 'desc')
 * - Chỉ khi sự kiện chưa được gán với mốc thời gian thì hiển thị theo thứ tự thêm vào ban đầu (original creation order)
 * @param {Array} items - Danh sách task hoặc event
 * @param {string} dateStr - Ngày cần lấy slot (đối với task)
 * @param {string} order - 'asc' (tăng dần: sớm nhất trước) hoặc 'desc' (giảm dần: muộn nhất trước)
 * @returns {Array} - Mảng mới đã được sắp xếp
 */
function sortItemsByTime(items, dateStr = selectedDate, order = null) {
  if (!Array.isArray(items) || items.length <= 1) return items ? [...items] : [];
  const sortOrder = order || appState?.settings?.timeSortOrder || 'asc';
  const isDesc = sortOrder === 'desc';

  const decorated = items.map((item, originalIndex) => {
    let startMins = null;
    let endMins = null;

    // 1. Trường hợp là Task: kiểm tra slot xếp lịch của ngày cụ thể
    if (item && typeof getTaskAssignedSlot === 'function') {
      const slot = getTaskAssignedSlot(item, dateStr) || item.assignedSlot;
      if (slot && slot.start !== undefined && slot.start !== null && slot.start !== '') {
        startMins = timeToMinutes(slot.start);
        endMins = (slot.end !== undefined && slot.end !== null && slot.end !== '') ? timeToMinutes(slot.end) : startMins;
      }
    }

    // 2. Trường hợp là Fixed hoặc Transient Event hoặc Noisy Interval: có thuộc tính start, end
    if (startMins === null && item && item.start !== undefined && item.start !== null && item.start !== '') {
      startMins = timeToMinutes(item.start);
      endMins = (item.end !== undefined && item.end !== null && item.end !== '') ? timeToMinutes(item.end) : startMins;
    }

    return {
      item,
      originalIndex,
      hasTime: startMins !== null && !isNaN(startMins),
      startMins,
      endMins
    };
  });

  decorated.sort((a, b) => {
    // Nếu cả 2 đều có mốc thời gian: so sánh theo giờ bắt đầu, sau đó đến giờ kết thúc
    if (a.hasTime && b.hasTime) {
      if (a.startMins !== b.startMins) {
        return isDesc ? (b.startMins - a.startMins) : (a.startMins - b.startMins);
      }
      if (a.endMins !== b.endMins) {
        return isDesc ? (b.endMins - a.endMins) : (a.endMins - b.endMins);
      }
      return a.originalIndex - b.originalIndex;
    }

    // Sự kiện/task có mốc thời gian luôn xếp trước sự kiện chưa có mốc thời gian
    if (a.hasTime && !b.hasTime) {
      return -1;
    }
    if (!a.hasTime && b.hasTime) {
      return 1;
    }

    // Cả 2 đều chưa được gán mốc thời gian: hiển thị theo thứ tự thêm vào (originalIndex)
    return a.originalIndex - b.originalIndex;
  });

  return decorated.map(d => d.item);
}
window.sortItemsByTime = sortItemsByTime;

function toggleTimeSortOrder() {
  const current = appState?.settings?.timeSortOrder || 'asc';
  const next = current === 'asc' ? 'desc' : 'asc';
  if (!appState.settings) appState.settings = {};
  appState.settings.timeSortOrder = next;
  saveData();
  if (typeof renderApp === 'function') {
    renderApp();
  }
  const isEn = appState?.settings?.lang === 'en';
  showToast(next === 'asc' 
    ? (isEn ? 'Sorted chronologically (Earliest first / Ascending)' : 'Đã sắp xếp tăng dần theo thời gian (Sớm nhất trước / Chiều xuôi)') 
    : (isEn ? 'Sorted chronologically (Latest first / Descending)' : 'Đã sắp xếp giảm dần theo thời gian (Muộn nhất trước / Chiều ngược)'));
}
window.toggleTimeSortOrder = toggleTimeSortOrder;

/**
 * Render Sidebar tách biệt hoàn toàn:
 * 1. Mục tiêu & Ghi chú ngày
 * 2. Thời gian rảnh hôm nay (Chuyển đổi Tổng / Tập trung / Xao nhãng, có ẩn hiện)
 * 3. Việc cố định & đột xuất (Dãn 2 nút xuống dưới, hiển thị số lượng bên phải, ẩn hiện)
 * 4. Công việc đã xếp lịch (Màu xanh lá cây, ẩn hiện)
 * 4B. Công việc chưa xếp lịch (Màu vàng đậm, ẩn hiện)
 * 5. Khung giờ dễ bị làm phiền (Ẩn hiện khi bấm title)
 */
function renderSidebar() {
  const sidebar = document.getElementById('app-sidebar-content');
  if (!sidebar) return;

  const currentScrollContent = document.getElementById('sidebar-scroll-content');
  const savedScrollTop = currentScrollContent ? currentScrollContent.scrollTop : sidebar.scrollTop;
  const savedScrollLeft = currentScrollContent ? currentScrollContent.scrollLeft : sidebar.scrollLeft;

  const todayStr = selectedDate;
  const dailyGoal = appState.goals?.dailyGoals?.find(g => !g.deleted && g.date === todayStr);
  const dayNotes = (appState.notes || []).filter(n => !n.deleted && n.date === todayStr);
  const { freeSlots } = calculateFreeTimeSlots(todayStr);

  const totalFreeMinutes = freeSlots.reduce((acc, cur) => acc + cur.duration, 0);
  const focusFreeMinutes = freeSlots.filter(s => s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);
  const distractFreeMinutes = freeSlots.filter(s => !s.isQuiet).reduce((acc, cur) => acc + cur.duration, 0);

  const totalFreeHours = (totalFreeMinutes / 60).toFixed(1);
  const focusFreeHours = (focusFreeMinutes / 60).toFixed(1);
  const distractFreeHours = (distractFreeMinutes / 60).toFixed(1);

  const freeTimeMode = appState.settings?.freeTimeDisplayMode || 'total';
  let displayFreeTimeText = `${totalFreeHours}h`;
  let displayFreeTimeColor = 'var(--primary)';
  let displayFreeTimeTitle = `${t('freeTimeModeTotal')} (${t('cycleFreeTimeModeHint')})`;

  if (freeTimeMode === 'focus') {
    displayFreeTimeText = `${focusFreeHours}h`;
    displayFreeTimeColor = 'var(--c-focus-long, #059669)';
    displayFreeTimeTitle = `${t('freeTimeModeFocus')} (${t('cycleFreeTimeModeHint')})`;
  } else if (freeTimeMode === 'distract') {
    displayFreeTimeText = `${distractFreeHours}h`;
    displayFreeTimeColor = 'var(--c-distract-long, #d97706)';
    displayFreeTimeTitle = `${t('freeTimeModeDistract')} (${t('cycleFreeTimeModeHint')})`;
  }

  const sortOrder = appState.settings?.timeSortOrder || 'asc';

  // Lọc chỉ việc CỐ ĐỊNH của ngày hiện tại (hỗ trợ recurrence và sắp xếp theo mốc giờ)
  const rawDayFixed = (appState.fixedEvents || []).filter(f => isItemActiveOnDate(f, todayStr));
  const dayFixed = sortItemsByTime(rawDayFixed, todayStr, sortOrder);
  
  // Lọc chỉ việc ĐỘT XUẤT của ngày hiện tại (hỗ trợ recurrence và sắp xếp theo mốc giờ)
  const rawDayTransient = (appState.transientEvents || []).filter(t => isItemActiveOnDate(t, todayStr));
  const dayTransient = sortItemsByTime(rawDayTransient, todayStr, sortOrder);

  // Ghép toàn bộ sự kiện Cố Định & Đột Xuất để sắp xếp chuẩn theo mốc thời gian (hoặc thứ tự thêm vào nếu chưa gán giờ)
  const rawAllEvents = [
    ...rawDayFixed.map(f => ({ ...f, _eventType: 'fixed' })),
    ...rawDayTransient.map(tr => ({ ...tr, _eventType: 'transient' }))
  ];
  const dayAllEvents = sortItemsByTime(rawAllEvents, todayStr, sortOrder);

  // Lọc riêng các TASK đã xếp lịch trên ngày hiện tại (sắp xếp theo mốc giờ đã xếp)
  const rawScheduledTasks = (appState.tasks || []).filter(t => isItemActiveOnDate(t, todayStr) && getTaskAssignedSlot(t, todayStr));
  const dayScheduledTasks = sortItemsByTime(rawScheduledTasks, todayStr, sortOrder);
  const doneScheduledCount = dayScheduledTasks.filter(t => isTaskDoneOnDate(t, todayStr)).length;

  // Lọc riêng các TASK chưa xếp lịch trên ngày hiện tại (chưa có slot và chưa hoàn thành - hiển thị theo thứ tự thêm vào)
  const dayUnscheduledTasks = (appState.tasks || []).filter(t => isItemActiveOnDate(t, todayStr) && !getTaskAssignedSlot(t, todayStr) && !isTaskDoneOnDate(t, todayStr));

  // Lọc riêng các KHUNG GIỜ DỄ BỊ LÀM PHIỀN / ỒN ÀO trên ngày hiện tại (sắp xếp theo mốc thời gian)
  const noisyList = appState.settings.noisyIntervals || [];
  const activeNoisyWithIdx = noisyList.map((item, originalIndex) => ({ ...item, _originalIndex: originalIndex })).filter(item => isItemActiveOnDate(item, todayStr));
  const sortedNoisy = sortItemsByTime(activeNoisyWithIdx, todayStr, sortOrder);
  const activeNoisy = sortedNoisy.map(item => ({ item, originalIndex: item._originalIndex }));

  const collapsed = appState.collapsedSidebarSections || {};
  const isFreeSlotsCollapsed = !!collapsed.freeSlots;
  const isFixedTransientCollapsed = !!collapsed.fixedTransient;
  const isScheduledCollapsed = !!collapsed.scheduled;
  const isUnscheduledCollapsed = !!collapsed.unscheduled;
  const isNoisyCollapsed = !!collapsed.noisy;

  const streakState = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : {
    currentStreak: 0,
    freezeCount: 0,
    maxFreeze: 2,
    cleanDays: 0,
    todayMetrics: { total: 0, completed: 0, isMet: false }
  };
  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
  const cleanDaysWidth = Math.min(100, Math.round((streakState.cleanDays / 7) * 100));

  sidebar.innerHTML = `
    <div class="sidebar-scroll-content" id="sidebar-scroll-content">
      <!-- SECTION 1: MỤC TIÊU & GHI CHÚ NGÀY (GIỮ NGUYÊN) -->
      <div class="sidebar-section" data-section="goalNotes">
      <div class="section-header">
        <span class="section-title">
          ${t('dailyGoal')}
        </span>
        <button class="icon-btn" style="width:26px; height:26px;" onclick="openDailyGoalModal('${todayStr}')" title="${t('editBtn')}">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
      </div>
      <div class="sidebar-goal-box">
        ${dailyGoal ? `<strong>${dailyGoal.focusMessage}</strong>` : `<span style="color:var(--text-muted);">${t('noDailyGoal')}</span>`}
      </div>

      <!-- Compact Sidebar Streak Widget -->
      <div class="sidebar-streak-card" onclick="openProductivityModal('${todayStr}')" title="${isEn ? 'Click to view Streak & Discipline details' : 'Bấm để xem Chi tiết Chuỗi Kỷ Luật & Năng Suất'}">
        <div class="sidebar-streak-top">
          <span class="sidebar-streak-label">${isEn ? 'Discipline Streak' : 'Chuỗi Kỷ Luật'}</span>
          <span class="sidebar-streak-val">${streakState.currentStreak || 0} ${isEn ? 'days' : 'ngày'}</span>
        </div>
        <div style="display:flex; justify-content:space-between; align-items:center; font-size:11px; margin-top:5px; color:var(--text-muted);">
          <span>${isEn ? 'Freeze' : 'Đóng băng'}: <strong>${streakState.freezeCount || 0}/${streakState.maxFreeze || 2}</strong></span>
          <span><strong>${streakState.cleanDays || 0}/7</strong> ${isEn ? 'clean days' : 'ngày sạch'}</span>
        </div>
        <div class="freeze-progress-bar" style="margin-top:5px; height:4px;">
          <div class="freeze-progress-fill" style="width:${cleanDaysWidth}%;"></div>
        </div>
      </div>

      <!-- Google Calendar Notes in Sidebar -->
      <div style="margin-top:10px; display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">${t('dailyNotes')}</span>
        <button class="icon-btn" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;" onclick="openAddNoteModal('${todayStr}')" title="${t('addNote')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
      </div>
      <div style="display:flex; flex-direction:column; gap:5px; margin-top:5px;">
        ${dayNotes.map(n => `
          <div class="note-chip" style="justify-content:space-between;">
            <span>${escapeHtml(n.content)}</span>
            <button class="delete-note-btn" onclick="deleteNote('${n.id}')" title="${t('deleteBtn')}">✕</button>
          </div>
        `).join('') || `<div style="font-size:11px; color:var(--text-muted);">${t('noNotes')}</div>`}
      </div>
    </div>

    <!-- SECTION 2: THỜI GIAN RẢNH HÔM NAY (CLICK TITLE ĐỂ ẨN/HIỆN, CLICK TIME ĐỂ ĐỔI MỐC) -->
    <div class="sidebar-section ${isFreeSlotsCollapsed ? 'is-collapsed' : ''}" data-section="freeSlots">
      <div class="section-header">
        <span class="section-title clickable-title" onclick="toggleSidebarSection('freeSlots')" title="${t('toggleCollapseHint')}">
          ${t('freeTimeToday')}
        </span>
        <span class="sidebar-count-badge free-time-badge" onclick="cycleFreeTimeMode(event)" style="font-size:12px; font-weight:700; color:${displayFreeTimeColor}; cursor:pointer; padding:2px 6px; border-radius:4px;" title="${displayFreeTimeTitle}">${displayFreeTimeText}</span>
      </div>
      <div class="sidebar-collapsible-wrapper ${isFreeSlotsCollapsed ? 'is-collapsed' : ''}">
        <div class="collapsible-inner" id="sidebar-free-slots-list" style="gap:6px;">
          ${freeSlots.map(s => `
            <div class="sidebar-free-slot-item" style="border-left-color:${s.color};" onclick="openFreeSlotModal('${s.id}')" title="${t('clickSlotHint')}">
              <span><strong>${s.startTimeStr} - ${s.endTimeStr}</strong> (${s.duration}${t('minShort')})</span>
              <span class="smart-pill ${s.pillClass}" style="padding:2px 8px; font-size:10px; white-space:nowrap;">${s.tagLabel}</span>
            </div>
          `).join('') || `<div style="font-size:12px; color:var(--text-muted);">${t('noFreeSlots')}</div>`}
        </div>
      </div>
    </div>

    <!-- SECTION 3: VIỆC CỐ ĐỊNH & ĐỘT XUẤT (2 DÒNG NAME TAG, KHÔNG DẤU VÀ, SỐ ĐƯỢC ĐƯA RA SÁT MÉP PHẢI CÂN ĐỐI) -->
    <div class="sidebar-section ${isFixedTransientCollapsed ? 'is-collapsed' : ''}" data-section="fixedTransient">
      <div class="section-header" style="align-items:flex-start; width:100%;">
        <div class="section-title-stacked clickable-title" onclick="toggleSidebarSection('fixedTransient')" title="${t('toggleCollapseHint')}">
          <div class="name-tag-row">
            <span class="name-tag-label">${t('fixedTag') || 'Việc Cố Định'}</span>
            <span class="sidebar-count-badge tag-count-fixed" title="${t('countFixedTitle')}">${dayFixed.length}</span>
          </div>
          <div class="name-tag-row">
            <span class="name-tag-label">${t('transientTag') || 'Việc Đột Xuất'}</span>
            <span class="sidebar-count-badge tag-count-transient" title="${t('countTransientTitle')}">${dayTransient.length}</span>
          </div>
        </div>
      </div>

      <div class="sidebar-collapsible-wrapper ${isFixedTransientCollapsed ? 'is-collapsed' : ''}">
        <div class="collapsible-inner" id="sidebar-fixed-transient-body">
          <div style="display:flex; gap:8px; margin-top:2px; margin-bottom:8px;">
            <button class="sidebar-action-stretched-btn" onclick="openAddFixedEventModal()" title="${t('addFixedBtn')} (E - F / Phím F)">
              + ${t('fixedShort')}
            </button>
            <button class="sidebar-action-stretched-btn" onclick="openAddTransientEventModal()" title="${t('addTransientBtn')} (E - T)">
              + ${t('transientShort')}
            </button>
          </div>

          <div style="display:flex; flex-direction:column; gap:6px;">
            ${dayAllEvents.map(evt => {
              const rep = getRepeatLabel(evt);
              const isFixed = evt._eventType === 'fixed';
              return `
                <div class="event-item-row" style="border-left-color: ${isFixed ? 'var(--c-fixed)' : 'var(--c-transient)'};">
                  <div class="event-details" title="${escapeHtml(evt.title)}${evt.note ? ' - ' + escapeHtml(evt.note) : ''} (${evt.start} - ${evt.end})">
                    <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                      <strong>${evt.start} - ${evt.end}</strong>
                      <span>${escapeHtml(evt.title)}</span>
                      ${rep ? `<span class="repeat-badge">${rep}</span>` : ''}
                    </div>
                    ${evt.note ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(evt.note)}</div>` : ''}
                  </div>
                  <div class="event-action-btns">
                    <button class="mini-action-btn" onclick="${isFixed ? `openEditFixedEventModal('${evt.id}')` : `openEditTransientEventModal('${evt.id}')`}" title="${t('editBtn')}" aria-label="${t('editBtn')}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    </button>
                    <button class="mini-action-btn delete" onclick="${isFixed ? `deleteFixedEvent('${evt.id}')` : `deleteTransientEvent('${evt.id}')`}" title="${t('deleteBtn')}" aria-label="${t('deleteBtn')}">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}

            ${dayAllEvents.length === 0 ? `<div style="font-size:12px; color:var(--text-muted);">${t('noFixedOrTransient')}</div>` : ''}
          </div>
        </div>
      </div>
    </div>

    <!-- SECTION 4: CÔNG VIỆC ĐÃ XẾP LỊCH TRONG NGÀY (MÀU XANH LÁ CÂY, ẨN HIỆN) -->
    <div class="sidebar-section ${isScheduledCollapsed ? 'is-collapsed' : ''}" data-section="scheduled">
      <div class="section-header">
        <span class="section-title clickable-title scheduled-tag" onclick="toggleSidebarSection('scheduled')" title="${t('toggleCollapseHint')}">
          ${t('scheduledTasks')}
        </span>
        <span class="sidebar-count-badge scheduled-count" style="font-size:12px; font-weight:800; color:var(--c-scheduled);"><small style="font-size:11px; font-weight:600; opacity:0.85;">(${isEn ? 'Done' : 'Đã xong'} ${doneScheduledCount}/${dayScheduledTasks.length})</small></span>
      </div>
      <div class="sidebar-collapsible-wrapper ${isScheduledCollapsed ? 'is-collapsed' : ''}">
        <div class="collapsible-inner" id="sidebar-scheduled-tasks-list" style="gap:6px;">
          ${dayScheduledTasks.map(task => {
            const slot = getTaskAssignedSlot(task, todayStr) || task.assignedSlot;
            const isDone = isTaskDoneOnDate(task, todayStr);
            const rep = getRepeatLabel(task);
            return `
              <div class="event-item-row" style="border-left-color: var(--c-scheduled);">
                <div class="event-details" style="${isDone ? 'text-decoration:line-through; opacity:0.6;' : ''} cursor:pointer;" onclick="openEditTaskModal('${task.id}')" title="${escapeHtml(task.title)}${task.note ? ' - ' + escapeHtml(task.note) : ''} (${slot.start} - ${slot.end})">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <strong style="color:var(--c-scheduled);">${slot.start} - ${slot.end}</strong>
                    <span>${escapeHtml(task.title)}</span>
                    ${rep ? `<span class="repeat-badge">${rep}</span>` : ''}
                  </div>
                  ${task.note ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(task.note)}</div>` : ''}
                </div>
                <div class="event-action-btns">
                  <button class="mini-action-btn" onclick="toggleTaskDone('${task.id}', '${todayStr}')" title="${isDone ? (isEn ? 'Mark incomplete' : 'Chưa xong') : (isEn ? 'Mark completed' : 'Hoàn thành')}" aria-label="${isDone ? (isEn ? 'Mark incomplete' : 'Chưa xong') : (isEn ? 'Mark completed' : 'Hoàn thành')}">
                    ${isDone 
                      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`
                      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`}
                  </button>
                  <button class="mini-action-btn" onclick="openEditTaskModal('${task.id}')" title="${t('editBtn')}" aria-label="${t('editBtn')}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button class="mini-action-btn delete" onclick="unassignTask('${task.id}', '${todayStr}')" title="${t('unscheduleBtn')}" aria-label="${t('unscheduleBtn')}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            `;
          }).join('') || `<div style="font-size:12px; color:var(--text-muted);">${t('noScheduledTasks')}</div>`}
        </div>
      </div>
    </div>

    <!-- SECTION 4B: CÔNG VIỆC CHƯA XẾP LỊCH TRONG NGÀY (MÀU VÀNG ĐẬM, ẨN HIỆN) -->
    <div class="sidebar-section ${isUnscheduledCollapsed ? 'is-collapsed' : ''}" data-section="unscheduled">
      <div class="section-header">
        <span class="section-title clickable-title unscheduled-tag" onclick="toggleSidebarSection('unscheduled')" title="${t('toggleCollapseHint')}">
          ${t('unscheduledTasks')}
        </span>
        <span class="sidebar-count-badge unscheduled-count" style="font-size:12px; font-weight:800; color:var(--c-unscheduled);">${dayUnscheduledTasks.length}</span>
      </div>
      <div class="sidebar-collapsible-wrapper ${isUnscheduledCollapsed ? 'is-collapsed' : ''}">
        <div class="collapsible-inner" id="sidebar-unscheduled-tasks-list" style="gap:6px;">
          ${dayUnscheduledTasks.map(task => {
            const isDone = isTaskDoneOnDate(task, todayStr);
            const rep = getRepeatLabel(task);
            return `
              <div class="event-item-row" style="border-left-color: var(--c-unscheduled);">
                <div class="event-details" style="${isDone ? 'text-decoration:line-through; opacity:0.6;' : ''} cursor:pointer;" onclick="openEditTaskModal('${task.id}')" title="${escapeHtml(task.title)}${task.note ? ' - ' + escapeHtml(task.note) : ''} (${task.estimatedMinutes || 30} ${t('minShort')})">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <strong style="color:var(--c-unscheduled);">${task.estimatedMinutes || 30} ${t('minShort')}</strong>
                    <span>${escapeHtml(task.title)}</span>
                    ${rep ? `<span class="repeat-badge">${rep}</span>` : ''}
                  </div>
                  ${task.note ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(task.note)}</div>` : ''}
                </div>
                <div class="event-action-btns">
                  <button class="mini-action-btn" onclick="openEditTaskModal('${task.id}')" title="${t('editBtn')}" aria-label="${t('editBtn')}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button class="mini-action-btn" onclick="toggleTaskDone('${task.id}', '${todayStr}')" title="${isDone ? (isEn ? 'Mark incomplete' : 'Chưa xong') : (isEn ? 'Mark completed' : 'Hoàn thành')}" aria-label="${isDone ? (isEn ? 'Mark incomplete' : 'Chưa xong') : (isEn ? 'Mark completed' : 'Hoàn thành')}">
                    ${isDone 
                      ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`
                      : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`}
                  </button>
                </div>
              </div>
            `;
          }).join('') || `<div style="font-size:12px; color:var(--text-muted);">${t('noUnscheduledTasksToday')}</div>`}
        </div>
      </div>
    </div>

    <!-- SECTION 5: KHUNG GIỜ BỊ LÀM PHIỀN (SỐ ĐƯỢC ĐƯA RA SÁT MÉP PHẢI, NÚT THÊM NẰM TRONG COLLAPSIBLE BODY) -->
    <div class="sidebar-section ${isNoisyCollapsed ? 'is-collapsed' : ''}" data-section="noisy">
      <div class="section-header">
        <span class="section-title clickable-title" onclick="toggleSidebarSection('noisy')" title="${t('toggleCollapseHint')}">
          ${t('noisyIntervalsSidebarTitle')}
        </span>
        <span class="sidebar-count-badge noisy-count" title="${t('noisyIntervalsSidebarTitle')}">${activeNoisy.length}</span>
      </div>
      <div class="sidebar-collapsible-wrapper ${isNoisyCollapsed ? 'is-collapsed' : ''}">
        <div class="collapsible-inner" id="sidebar-noisy-list" style="gap:6px;">
          <div style="margin-top:2px; margin-bottom:8px;">
            <button class="sidebar-action-stretched-btn" style="width:100%;" onclick="openAddNoisyIntervalModal()" title="${t('addNoisyBtn')} (Phím D)">
              + ${t('addNoisySidebarBtn')}
            </button>
          </div>
          ${activeNoisy.map(({ item, originalIndex }) => {
            const rep = getRepeatLabel(item);
            return `
              <div class="event-item-row noisy-row">
                <div class="event-details" title="${escapeHtml(item.label)} (${item.start} - ${item.end})">
                  <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                    <strong>${item.start} - ${item.end}</strong>
                    <span>${escapeHtml(item.label)}</span>
                    ${rep ? `<span class="repeat-badge" style="background:var(--pill-distract-short-bg); color:var(--pill-distract-short-text);">${rep}</span>` : ''}
                  </div>
                </div>
                <div class="event-action-btns">
                  <button class="mini-action-btn" onclick="openEditNoisyIntervalModal(${originalIndex})" title="${t('editBtn')}" aria-label="${t('editBtn')}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </button>
                  <button class="mini-action-btn delete" onclick="confirmDeleteNoisyInterval(${originalIndex})" title="${t('deleteBtn')}" aria-label="${t('deleteBtn')}">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                  </button>
                </div>
              </div>
            `;
          }).join('') || `<div style="font-size:12px; color:var(--text-muted);">${t('noNoisyIntervalsToday')}</div>`}
        </div>
      </div>
    </div>
  </div>

  <!-- PINNED BOTTOM DOCK: Nút Cài đặt luôn cố định dưới đáy thanh bên trái -->
  <div class="sidebar-bottom-dock">
    <button 
      id="btn-floating-settings" 
      class="floating-settings-btn sidebar-docked-settings-btn" 
      onclick="openSettingsModal()" 
      title="${isEn ? 'System Settings (Key S)' : 'Cài đặt hệ thống (Phím S)'}"
      aria-label="${isEn ? 'System Settings' : 'Cài đặt hệ thống'}"
    >
      <svg class="gear-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="3"></circle>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
      </svg>
      <span class="floating-btn-label" id="floating-settings-label">${isEn ? 'Settings' : 'Cài Đặt'}</span>
    </button>
  </div>
`;

  const newScrollContent = document.getElementById('sidebar-scroll-content');
  if (newScrollContent) {
    newScrollContent.style.scrollBehavior = 'auto';
    newScrollContent.scrollTop = savedScrollTop;
    newScrollContent.scrollLeft = savedScrollLeft;
  }
}

// Tính toán chia cột thông minh cho các sự kiện trùng lặp khung giờ (Google Calendar layout)
function computeEventColumns(events) {
  if (!events || events.length === 0) return [];
  const sorted = events.map((e, idx) => ({ ...e, originalIndex: idx })).sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  const eventLayouts = new Map();
  let currentGroup = [];
  let groupEnd = 0;

  function packCurrentGroup(group) {
    if (!group || group.length === 0) return;
    const columns = [];
    for (let event of group) {
      let placed = false;
      for (let c = 0; c < columns.length; c++) {
        const lastInCol = columns[c][columns[c].length - 1];
        if (lastInCol.end <= event.start) {
          columns[c].push(event);
          event._col = c;
          placed = true;
          break;
        }
      }
      if (!placed) {
        event._col = columns.length;
        columns.push([event]);
      }
    }
    const numCols = columns.length;
    for (let event of group) {
      eventLayouts.set(event.originalIndex, { col: event._col, colCount: numCols });
    }
  }

  for (let event of sorted) {
    if (currentGroup.length > 0 && event.start >= groupEnd) {
      packCurrentGroup(currentGroup);
      currentGroup = [];
      groupEnd = 0;
    }
    currentGroup.push(event);
    groupEnd = Math.max(groupEnd, event.end);
  }
  if (currentGroup.length > 0) {
    packCurrentGroup(currentGroup);
  }

  return events.map((e, idx) => {
    const layout = eventLayouts.get(idx) || { col: 0, colCount: 1 };
    return { ...e, col: layout.col, colCount: layout.colCount };
  });
}



// Điều khiển mức thu phóng & tỷ lệ ô lưới lịch tháng (Month Grid Scale & Zoom Controller)
function setMonthZoom(newZoom) {
  let val = newZoom;
  if (newZoom !== 'fit') {
    val = Math.max(75, Math.min(150, parseInt(newZoom, 10) || 100));
  }
  if (!appState.settings) appState.settings = {};
  appState.settings.monthZoom = val;
  saveData();

  renderApp();
}

function zoomMonth(delta) {
  const zoomLevels = [75, 100, 125, 150];
  const cur = appState.settings?.monthZoom || 100;
  if (cur === 'fit') {
    setMonthZoom(delta > 0 ? 100 : 75);
    return;
  }
  const curVal = typeof cur === 'number' ? cur : 100;
  let idx = zoomLevels.indexOf(curVal);
  if (idx === -1) {
    idx = 1;
  }
  const nextIdx = Math.max(0, Math.min(zoomLevels.length - 1, idx + delta));
  setMonthZoom(zoomLevels[nextIdx]);
}

window.setMonthZoom = setMonthZoom;
window.zoomMonth = zoomMonth;

// ==========================================
// 5. VIEW CHI TIẾT: NGÀY (TIMELINE 24H - GOOGLE CALENDAR STYLE CÙNG TÙY CHỌN 1, 3, 7 NGÀY)
// ==========================================
function getTimelineDates(baseDateStr, span = 1) {
  if (!baseDateStr) return [getTodayDateString()];
  const spanNum = Number(span) || 1;
  const [y, m, d] = baseDateStr.split('-').map(Number);

  if (spanNum === 1) {
    return [baseDateStr];
  }

  if (spanNum === 3) {
    const dates = [];
    for (let i = 0; i < 3; i++) {
      const curDate = new Date(y, m - 1, d + i);
      dates.push(formatDateToYMD(curDate));
    }
    return dates;
  }

  if (spanNum === 7) {
    // Tuần chứa baseDateStr (từ Thứ Hai đến Chủ Nhật) theo chuẩn Google Calendar
    const baseObj = new Date(y, m - 1, d);
    const dayOfWeek = baseObj.getDay(); // 0: CN, 1: T2, ..., 6: T7
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const mondayObj = new Date(y, m - 1, d + diffToMonday);

    const dates = [];
    for (let i = 0; i < 7; i++) {
      const curDate = new Date(mondayObj.getFullYear(), mondayObj.getMonth(), mondayObj.getDate() + i);
      dates.push(formatDateToYMD(curDate));
    }
    return dates;
  }

  return [baseDateStr];
}

function changeCalendarView(days) {
  const validSpan = [1, 3, 7].includes(Number(days)) ? Number(days) : 1;
  if (!appState.settings) appState.settings = {};
  appState.settings.timelineDaySpan = validSpan;
  saveData();
  renderApp();
  const spanNames = {
    1: t('daySpan1'),
    3: t('daySpan3'),
    7: t('daySpan7')
  };
  showToast(t('switchedDaySpan', { span: spanNames[validSpan] || `${validSpan} ngày` }));
  return validSpan;
}

function cycleTimelineDaySpan() {
  const currentSpan = Number(appState?.settings?.timelineDaySpan) || 1;
  let nextSpan = 1;
  if (currentSpan === 1) nextSpan = 3;
  else if (currentSpan === 3) nextSpan = 7;
  else if (currentSpan === 7) nextSpan = 1;

  return changeCalendarView(nextSpan);
}

function setTimelineDaySpan(span) {
  return changeCalendarView(span);
}

function switchToSingleDayView(targetDateStr) {
  if (targetDateStr) {
    selectedDate = targetDateStr;
  }
  if (!appState.settings) appState.settings = {};
  appState.settings.timelineDaySpan = 1;
  saveData();
  renderApp();
  showToast(t('switchedToDay', { date: formatDisplayDate(selectedDate) }));
}

function changeTimelineDate(offset) {
  const span = Number(appState?.settings?.timelineDaySpan) || 1;
  const [y, m, d] = selectedDate.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d + (offset * span));
  selectedDate = formatDateToYMD(targetDate);
  renderApp();
}

// Thuật toán tính toán va chạm / đè chập giữa name tag và tiêu đề task (7-day View Overlap Calculation)
function calculateTagTitleOverlap(block, titleEl, tagEls, span = 7) {
  if (!block || !titleEl || !tagEls || tagEls.length === 0) return false;
  if (span !== 7 && span !== 3) return false;

  const blockWidth = block.clientWidth || (block.getBoundingClientRect ? block.getBoundingClientRect().width : 0) || 120;
  const blockHeight = block.clientHeight || (block.getBoundingClientRect ? block.getBoundingClientRect().height : 0) || 50;

  let totalTagWidth = 0;
  let maxTagHeight = 0;
  tagEls.forEach(tag => {
    const tagRect = tag.getBoundingClientRect ? tag.getBoundingClientRect() : null;
    const w = tagRect ? tagRect.width : (tag.offsetWidth || 0);
    const h = tagRect ? tagRect.height : (tag.offsetHeight || 0);
    totalTagWidth += w + 4;
    if (h > maxTagHeight) maxTagHeight = h;
  });

  const titleScrollWidth = titleEl.scrollWidth || 0;
  const titleClientWidth = titleEl.clientWidth || 0;
  const titleHeight = titleEl.offsetHeight || (titleEl.getBoundingClientRect ? titleEl.getBoundingClientRect().height : 0) || 16;

  // 1. Kiểm tra va chạm hình học trực tiếp (Direct 2D Geometric Bounding Box Overlap)
  if (block.getBoundingClientRect && titleEl.getBoundingClientRect) {
    const titleRect = titleEl.getBoundingClientRect();
    for (let i = 0; i < tagEls.length; i++) {
      const tag = tagEls[i];
      if (!tag.getBoundingClientRect) continue;
      const tagRect = tag.getBoundingClientRect();
      if (tagRect.width > 0 && titleRect.width > 0) {
        // Tọa độ hình chữ nhật giao nhau cả trục X và Y
        const intersectsX = (titleRect.left < tagRect.right && titleRect.right > tagRect.left);
        const intersectsY = (titleRect.top < tagRect.bottom && titleRect.bottom > tagRect.top);
        if (intersectsX && intersectsY) return true;

        // Khoảng cách quá gần sát mép khiến tiêu đề bị chèn ép
        if (Math.abs(tagRect.top - titleRect.top) < 18 && (tagRect.left - titleRect.right < 6)) {
          if (titleScrollWidth > titleClientWidth) return true;
        }
      }
    }
  }

  // 2. Tính toán không gian bề ngang (Horizontal Space Competition)
  // Ở view 7 ngày, độ rộng cột rất hẹp (~100-130px), trừ lề đệm còn lại availableWidth
  const availableWidth = Math.max(blockWidth - 8, 40);
  if (titleScrollWidth + totalTagWidth > availableWidth) {
    return true;
  }
  if (totalTagWidth > blockWidth * 0.28 && titleScrollWidth > 38) {
    return true;
  }
  if (titleScrollWidth > titleClientWidth + 1) {
    return true;
  }

  // 3. Tính toán không gian bề dọc (Vertical Height Collision)
  // Khi tiêu đề xuống 2-3 dòng (chiều cao ~28-42px), nếu block quá thấp (< 46px) sẽ xảy ra va chạm không gian
  if (blockHeight < 46 && (titleHeight > 18 || totalTagWidth > 28)) {
    return true;
  }

  return false;
}

// Thuật toán kiểm tra và xử lý che khuất name tag (Overlap & Occlusion Detection Algorithm)
function checkAndResolveTagOcclusion(containerRoot = document) {
  const span = Number(appState?.settings?.timelineDaySpan) || 1;
  const root = containerRoot || document;
  const blocks = root.querySelectorAll ? root.querySelectorAll('.calendar-grid .time-block, .timeline-canvas .time-block') : [];
  if (!blocks || blocks.length === 0) return;

  blocks.forEach(block => {
    const titleEl = block.querySelector('.block-title-text, .block-title strong, .block-title > span:first-child');
    const tagEls = block.querySelectorAll('.smart-pill, .block-tag, .block-tags-wrap');

    if (!titleEl) return;

    // Trong view 7 ngày: Mặc định ưu tiên hiển thị tên task đa dòng (tối đa 3 dòng)
    if (span === 7) {
      titleEl.style.setProperty('display', '-webkit-box', 'important');
      titleEl.style.setProperty('-webkit-line-clamp', '3', 'important');
      titleEl.style.setProperty('-webkit-box-orient', 'vertical', 'important');
      titleEl.style.setProperty('white-space', 'normal', 'important');
      titleEl.style.setProperty('word-break', 'break-word', 'important');
      titleEl.style.setProperty('line-height', '1.25', 'important');
      titleEl.style.setProperty('overflow', 'hidden', 'important');
      titleEl.style.setProperty('text-overflow', 'ellipsis', 'important');
      titleEl.style.setProperty('max-width', '100%', 'important');
    }

    if (!tagEls || tagEls.length === 0) return;

    // Nếu không phải chế độ 7 ngày (hoặc 3 ngày hẹp), khôi phục trạng thái hiển thị đầy đủ
    if (span !== 7 && span !== 3) {
      tagEls.forEach(tag => {
        tag.style.removeProperty('display');
        tag.removeAttribute('data-hidden-by-algo');
      });
      block.classList.remove('has-hidden-nametag');
      titleEl.style.removeProperty('width');
      titleEl.style.removeProperty('margin-right');
      return;
    }

    // Tạm bỏ style ẩn để đo kích thước tự nhiên chính xác của name tag
    tagEls.forEach(tag => {
      if (tag.getAttribute('data-hidden-by-algo') === 'true') {
        tag.style.removeProperty('display');
      }
    });

    // Tự động tính toán va chạm giữa name tag và tên task
    const isOverlapDetected = calculateTagTitleOverlap(block, titleEl, tagEls, span);

    if (isOverlapDetected) {
      // Khi phát hiện va chạm: Ẩn name tag và mở rộng tên task hiển thị lên đến 3 dòng
      tagEls.forEach(tag => {
        tag.style.setProperty('display', 'none', 'important');
        tag.setAttribute('data-hidden-by-algo', 'true');
      });
      block.classList.add('has-hidden-nametag');

      // Tối ưu hóa tối đa khả năng đọc tên task: dãn 100% bề rộng, cho phép xuống đến 3 dòng
      titleEl.style.setProperty('display', '-webkit-box', 'important');
      titleEl.style.setProperty('-webkit-line-clamp', '3', 'important');
      titleEl.style.setProperty('-webkit-box-orient', 'vertical', 'important');
      titleEl.style.setProperty('white-space', 'normal', 'important');
      titleEl.style.setProperty('word-break', 'break-word', 'important');
      titleEl.style.setProperty('line-height', '1.25', 'important');
      titleEl.style.setProperty('overflow', 'hidden', 'important');
      titleEl.style.setProperty('text-overflow', 'ellipsis', 'important');
      titleEl.style.setProperty('width', '100%', 'important');
      titleEl.style.setProperty('max-width', '100%', 'important');
      titleEl.style.setProperty('margin-right', '0px', 'important');
    } else {
      // Khi không va chạm (tên task ngắn trong ô đủ rộng): giữ nguyên hiển thị name tag
      tagEls.forEach(tag => {
        tag.style.removeProperty('display');
        tag.removeAttribute('data-hidden-by-algo');
      });
      block.classList.remove('has-hidden-nametag');
      titleEl.style.removeProperty('margin-right');
    }
  });
}

// Thuật toán tính toán và dãn nút chuyển chế độ (1N/3N/7N) cân đối bằng mép phải với năm bên dưới
function syncSpanButtonWidth(containerRoot = document) {
  try {
    const root = containerRoot || document;
    const navStacked = root.querySelector ? root.querySelector('.date-navigator-stacked') : null;
    if (!navStacked) return;
    const titleEl = navStacked.querySelector('.day-current-title');
    const toggleBtn = navStacked.querySelector('#timeline-span-toggle-btn');
    const navArrows = navStacked.querySelector('.nav-arrows');
    if (!titleEl || !toggleBtn || !navArrows) return;

    // Tạm thời bỏ style inline để đo kích thước tự nhiên chính xác nhất
    toggleBtn.style.removeProperty('width');
    toggleBtn.style.removeProperty('min-width');
    navStacked.style.removeProperty('width');

    const titleWidth = Math.ceil(
      (titleEl.getBoundingClientRect ? titleEl.getBoundingClientRect().width : 0) ||
      titleEl.offsetWidth ||
      titleEl.scrollWidth ||
      240
    );

    const prevBtn = navArrows.querySelector('.nav-btn-prev');
    const todayBtn = navArrows.querySelector('.nav-today-btn');
    const nextBtn = navArrows.querySelector('.nav-btn-next');

    const wPrev = prevBtn ? (prevBtn.getBoundingClientRect?.().width || prevBtn.offsetWidth || 36) : 36;
    const wToday = todayBtn ? (todayBtn.getBoundingClientRect?.().width || todayBtn.offsetWidth || 84) : 84;
    const wNext = nextBtn ? (nextBtn.getBoundingClientRect?.().width || nextBtn.offsetWidth || 36) : 36;
    const totalGaps = 18; // 3 khoảng cách gap 6px giữa 4 nút (prev - today - next - toggleBtn)

    const leftButtonsWidth = wPrev + wToday + wNext + totalGaps;

    // Tính toán chiều rộng tương đối để mép phải nút cân đối bằng với mép phải của chữ năm bên dưới
    const targetWidth = Math.max(62, Math.round(titleWidth - leftButtonsWidth));
    const finalStackedWidth = Math.max(titleWidth, leftButtonsWidth + targetWidth);

    navStacked.style.setProperty('width', `${finalStackedWidth}px`, 'important');
    navArrows.style.setProperty('width', '100%', 'important');
    toggleBtn.style.setProperty('width', `${targetWidth}px`, 'important');
    toggleBtn.style.setProperty('min-width', `${targetWidth}px`, 'important');
    toggleBtn.style.setProperty('flex', 'none', 'important');
  } catch (err) {
    console.warn('Lỗi đồng bộ chiều rộng nút chuyển chế độ:', err);
  }
}

function renderDayColumnBlocks(dateStr, pxPerMinute, isFocusDimming, nowMinutes, isToday, t) {
  const span = Number(appState?.settings?.timelineDaySpan) || 1;
  const { busyIntervals, freeSlots } = calculateFreeTimeSlots(dateStr);
  const packedBusyIntervals = computeEventColumns(busyIntervals);

  // Vạch kẻ chỉ thời gian hiện tại nếu là hôm nay
  let liveIndicatorHtml = '';
  if (isToday) {
    const nowTop = Math.round(nowMinutes * pxPerMinute);
    const now = new Date();
    const nowTimeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    liveIndicatorHtml = `
      <div id="timeline-live-indicator" class="timeline-current-time-indicator" style="top:${nowTop}px;" title="${t('currentTime')}: ${nowTimeStr}">
        <div class="current-time-tag" style="display:none !important;" aria-hidden="true">${nowTimeStr}</div>
        <div class="current-time-dot"></div>
        <div class="current-time-line"></div>
      </div>
    `;
  }

  // Focus Dimming
  const ongoingEventKeys = new Set();
  let nextUpcomingKey = null;

  if (isFocusDimming && isToday) {
    packedBusyIntervals.forEach(b => {
      const key = `${b.type}-${b.taskId || b.id}-${b.start}-${b.end}`;
      if (b.start <= nowMinutes && nowMinutes < b.end) {
        ongoingEventKeys.add(key);
      }
    });

    let minUpcomingDiff = Infinity;
    packedBusyIntervals.forEach(b => {
      const key = `${b.type}-${b.taskId || b.id}-${b.start}-${b.end}`;
      if (!ongoingEventKeys.has(key) && b.start >= nowMinutes) {
        const diff = b.start - nowMinutes;
        if (diff < minUpcomingDiff) {
          minUpcomingDiff = diff;
          nextUpcomingKey = key;
        }
      }
    });
  }

  const busyBlocksHtml = packedBusyIntervals.map(b => {
    const duration = b.end - b.start;
    const top = Math.round(b.start * pxPerMinute);
    const height = Math.max(Math.round(duration * pxPerMinute), 26);

    let className = 'time-block ';
    let badgeText = '';

    if (b.type === 'fixed') {
      className += 'time-block-fixed';
      badgeText = t('typeFixed');
    } else if (b.type === 'transient') {
      className += 'time-block-transient';
      badgeText = t('typeTransient');
    } else {
      className += 'time-block-scheduled';
      badgeText = t('typeTask');
    }

    const noteTooltip = b.note ? `\n${b.note}` : '';
    const tooltipText = `${escapeHtml(b.title)}${escapeHtml(noteTooltip)} (${minutesToTime(b.start)} - ${minutesToTime(b.end)}, ${duration} ${t('minShort')})`;

    const eventKey = `${b.type}-${b.taskId || b.id}-${b.start}-${b.end}`;
    let focusState = 'normal';
    if (isFocusDimming && isToday) {
      if (ongoingEventKeys.has(eventKey)) {
        focusState = 'ongoing';
        className += ' time-block-ongoing';
      } else if (eventKey === nextUpcomingKey) {
        focusState = 'upcoming';
        className += ' time-block-upcoming';
      } else {
        focusState = 'dimmed';
        className += ' time-block-dimmed';
      }
    }

    let innerContent = '';
    if (focusState === 'upcoming') {
      innerContent = `
        <div class="block-compact-row" style="height:100%; align-items:center;">
          <span class="block-title-text" style="font-weight:700; color:inherit; display:flex; align-items:center; gap:5px;">
            <span style="font-size:9px; background:#d97706; color:white; padding:1px 5px; border-radius:3px; font-weight:700; flex-shrink:0;">${t('nextUpcoming')}</span>
            <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(b.title)}</span>
          </span>
        </div>
      `;
    } else if (focusState === 'ongoing') {
      innerContent = `
        <div class="block-title">
          <span class="block-title-text" style="overflow:hidden; text-overflow:ellipsis; ${span === 7 ? 'white-space:normal; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; word-break:break-word; line-height:1.25;' : 'white-space:nowrap;'} margin-right:4px; display:inline-flex; align-items:center; gap:5px;">
            <span style="font-size:9px; background:#ef4444; color:white; padding:1px 5px; border-radius:4px; font-weight:700; flex-shrink:0;">${t('nowActive')}</span>
            <strong>${escapeHtml(b.title)}</strong>
          </span>
          <span class="block-tag" style="background:rgba(0,0,0,0.08);">${badgeText}</span>
        </div>
        <div class="block-time" style="font-weight:600;">${minutesToTime(b.start)} - ${minutesToTime(b.end)} (${duration} ${t('minShort')})</div>
        ${b.note ? `<div class="block-note block-desc" style="font-size:11px; margin-top:3px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; opacity:0.9;">${escapeHtml(b.note)}</div>` : ''}
      `;
    } else if (height < 34) {
      className += ' time-block-compact';
      innerContent = `
        <div class="block-compact-row">
          <span class="block-title-text" style="font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; ${span === 7 ? 'white-space:normal; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; word-break:break-word; line-height:1.25;' : ''}">${escapeHtml(b.title)}</span>
          <span class="block-time-inline" style="font-size:10px; opacity:0.85; white-space:nowrap; flex-shrink:0;">${minutesToTime(b.start)}-${minutesToTime(b.end)}</span>
        </div>
      `;
    } else {
      const showNoteInBlock = b.note && height >= 52;
      innerContent = `
        <div class="block-title">
          <span class="block-title-text" style="overflow:hidden; text-overflow:ellipsis; ${span === 7 ? 'white-space:normal; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; word-break:break-word; line-height:1.25;' : 'white-space:nowrap;'} margin-right:4px;">${escapeHtml(b.title)}</span>
          <span class="block-tag" style="background:rgba(0,0,0,0.08);">${badgeText}</span>
        </div>
        <div class="block-time">${minutesToTime(b.start)} - ${minutesToTime(b.end)} (${duration} ${t('minShort')})</div>
        ${showNoteInBlock ? `<div class="block-note block-desc" style="font-size:10px; opacity:0.85; margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(b.note)}</div>` : ''}
      `;
    }

    const colStyle = b.colCount > 1
      ? `left: calc(${b.col * (100 / b.colCount)}% + 3px); width: calc(${100 / b.colCount}% - 6px); right: auto;`
      : `left: 4px; right: 4px; width: calc(100% - 8px);`;

    const customBorder = b.color ? `border-left-color: ${b.color} !important;` : '';

    return `
      <div class="${className}" style="top:${top}px; height:${height}px; ${colStyle} ${customBorder}" onclick="handleBlockClick('${b.type}', '${b.taskId || b.id}')" title="${tooltipText}">
        ${innerContent}
      </div>
    `;
  }).join('');

  const freeBlocksHtml = freeSlots.map(slot => {
    const top = Math.round(slot.start * pxPerMinute);
    const h = Math.round(slot.duration * pxPerMinute);
    const height = h < 18 ? Math.max(h, 2) : Math.max(h, 4);
    const manualTagBadge = slot.isManualOverride 
      ? `<span style="font-size:9px; background:#f3e8ff; color:#7e22ce; border:1px solid #d8b4fe; padding:1px 5px; border-radius:4px; font-weight:700; margin-left:4px;">Tùy chỉnh</span>` 
      : '';

    const tooltipText = `${slot.tagLabel} (${slot.startTimeStr} - ${slot.endTimeStr}, ${slot.duration} ${t('minShort')}) • ${slot.isQuiet ? t('quietEnv') : t('noisyEnv')}\n${t('clickSlotHint')}`;

    let className = 'time-block time-block-free';
    if (isFocusDimming && isToday) {
      if (slot.start <= nowMinutes && nowMinutes < slot.end) {
        className += ' time-block-ongoing';
      } else {
        className += ' time-block-dimmed';
      }
    }
    let innerContent = '';

    if (h < 18) {
      className += ' time-block-strip';
      innerContent = '';
    } else if (height < 36) {
      className += ' time-block-compact';
      innerContent = `
        <div class="block-compact-row">
          <span class="block-title-text" style="color:var(--text-primary); font-weight:700; ${span === 7 ? 'white-space:normal; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; word-break:break-word; line-height:1.25;' : ''}">
            ${slot.tagLabel} (${slot.duration} ${t('minShort')})
            ${manualTagBadge}
          </span>
          <span class="smart-pill ${slot.pillClass}" style="font-size:9px; padding:1px 5px; flex-shrink:0;">
            ${slot.tagLabel}
          </span>
        </div>
      `;
    } else {
      innerContent = `
        <div class="block-title">
          <span class="block-title-text" style="color:var(--text-primary); ${span === 7 ? 'white-space:normal; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; word-break:break-word; line-height:1.25; margin-right:4px;' : 'display:inline-flex; align-items:center; gap:4px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;'}">
            ${slot.tagLabel} (${slot.duration} ${t('minShort')})
            ${manualTagBadge}
          </span>
          <div class="block-tags-wrap" style="display:inline-flex; align-items:center; gap:4px; flex-shrink:0;">
            <span class="smart-pill ${slot.pillClass}" style="font-size:10px; padding:2px 7px;">
              ${slot.isQuiet ? t('quietEnv') : t('noisyEnv')}
            </span>
          </div>
        </div>
        <div class="block-time" style="color:var(--text-secondary);">${slot.startTimeStr} - ${slot.endTimeStr}</div>
      `;
    }

    return `
      <div class="${className}" style="top:${top}px; height:${height}px; left:4px; right:4px; width:calc(100% - 8px); background: linear-gradient(${slot.color}22, ${slot.color}22), var(--bg-card); border-color:${slot.color};" onclick="openFreeSlotModal('${slot.id}', '${dateStr}')" ondragover="handleSlotDragOver(event)" ondrop="handleSlotDrop(event, ${slot.start}, ${slot.end}, '${dateStr}')" title="${tooltipText}">
        ${innerContent}
      </div>
    `;
  }).join('');

  return `
    ${liveIndicatorHtml}
    ${freeBlocksHtml}
    ${busyBlocksHtml}
  `;
}

function renderDayView(container) {
  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
  const HOUR_HEIGHT = 64;
  const PX_PER_MIN = HOUR_HEIGHT / 60;
  const r = HOUR_HEIGHT;
  const i = HOUR_HEIGHT * 24;
  const n = PX_PER_MIN;
  const hourHeight = r;
  const totalCanvasHeight = i;
  const pxPerMinute = n;

  const todayStr = getTodayDateString();
  const now = new Date();
  const nowMinutes = (now.getHours() * 60) + now.getMinutes();

  const span = Number(appState?.settings?.timelineDaySpan) || 1;
  const dates = getTimelineDates(selectedDate, span);
  const displayTitle = span === 1 ? formatDisplayDate(selectedDate) : formatDisplayDateRange(dates);
  const isEn = appState?.settings?.lang === 'en';

  const spanLabels = {
    1: t('daySpan1'),
    3: t('daySpan3'),
    7: t('daySpan7')
  };
  const nextSpanMap = { 1: 3, 3: 7, 7: 1 };
  const nextSpan = nextSpanMap[span] || 1;
  const currentSpanText = spanLabels[span] || `${span} ngày`;
  const nextSpanText = spanLabels[nextSpan] || `${nextSpan} ngày`;

  const dayNotes = appState.notes.filter(n => !n.deleted && n.date === selectedDate);

  let hoursHtml = '';
  for (let h = 0; h < 24; h++) {
    const timeStr = `${String(h).padStart(2, '0')}:00`;
    hoursHtml += `
      <div class="hour-row" style="height:${hourHeight}px;">
        <div class="hour-label">${timeStr}</div>
        <div class="hour-track">
          ${hourHeight >= 50 ? `<div class="half-hour-line" style="top:50%;"></div>` : ''}
        </div>
      </div>
    `;
  }

  let dayGridLinesHtml = '';
  for (let h = 0; h < 24; h++) {
    dayGridLinesHtml += `
      <div class="day-hour-grid-line" style="height:${hourHeight}px;">
        ${hourHeight >= 50 ? `<div class="day-half-hour-line"></div>` : ''}
      </div>
    `;
  }

  const isFocusDimming = !!appState.settings.focusDimming;

  const dayHeadersHtml = dates.map(dateStr => {
    const isDateToday = dateStr === todayStr;
    const isDateSelected = dateStr === selectedDate;
    const [y, m, d] = dateStr.split('-').map(Number);
    const dObj = new Date(y, m - 1, d);
    const dayNum = d;
    const weekdayShort = isEn
      ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][dObj.getDay()]
      : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][dObj.getDay()];

    const hasNotes = appState.notes.some(n => !n.deleted && n.date === dateStr);

    return `
      <div class="timeline-day-header-cell ${isDateToday ? 'is-today' : ''} ${isDateSelected ? 'is-selected' : ''}" 
           onclick="switchToSingleDayView('${dateStr}')" 
           title="${t('switchToDayViewHint')} (${formatDisplayDate(dateStr)})">
        <span class="day-header-weekday">${weekdayShort}</span>
        <span class="day-header-daynum ${isDateToday ? 'today-circle' : ''}">${dayNum}</span>
        <span class="day-header-touch-hint" style="display:none;">1d</span>
      </div>
    `;
  }).join('');

  const dayColumnsHtml = dates.map(dateStr => {
    const isDateToday = dateStr === todayStr;
    const isDateSelected = dateStr === selectedDate;
    return `
      <div class="day-column timeline-day-column ${isDateToday ? 'current-day-column is-today' : ''} ${isDateSelected ? 'is-selected' : ''}" data-date="${dateStr}" ondblclick="switchToSingleDayView('${dateStr}')" onclick="handleDayColumnTouchTap(event, '${dateStr}')" title="${dates.length > 1 ? t('switchToDayViewHint') : ''}">
        <div class="day-column-grid-lines">
          ${dayGridLinesHtml}
        </div>
        <div class="day-column-blocks-layer" style="height:${totalCanvasHeight}px;">
          ${renderDayColumnBlocks(dateStr, pxPerMinute, isFocusDimming, nowMinutes, isDateToday, t)}
        </div>
      </div>
    `;
  }).join('');

  const canvasMinWidth = span === 7 ? '940px' : (span === 3 ? '600px' : '100%');
  const spanClass = span === 7 ? 'view-7d' : (span === 3 ? 'view-3d' : 'view-1d');

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:12px; width:100%;">
      <!-- Header Tối Giản & Gọn Gàng cho Tab Ngày (Day View Header: Trái Điều hướng & Nút 1/3/7, Phải Ghi chú Ngày) -->
      <div class="calendar-toolbar day-view-compact-toolbar">
        <!-- Bên trái: Xếp thành 2 hàng (Hàng trên: nút di chuyển và nút gộp 1, 3, 7 ngày; Hàng dưới: thứ ngày tháng) -->
        <div class="date-navigator-stacked">
          <div class="nav-arrows">
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-prev" onclick="changeTimelineDate(-1); changeDate(0);" title="${t('prevBtn')}">←</button>
            <button type="button" class="btn-secondary nav-today-btn" onclick="goToToday()">${t('todayBtn')}</button>
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-next" onclick="changeTimelineDate(1); changeDate(0);" title="${t('nextBtn')}">→</button>

            <!-- Nút chuyển chế độ 1, 3, 7 gộp làm một giống như nút nhấn giao diện sáng tối, mỗi lần nhấn lần lượt chuyển qua 1, 3, 7 -->
            <button type="button" id="timeline-span-toggle-btn" class="icon-btn timeline-span-toggle-btn timeline-dayspan-cycle-btn" onclick="cycleTimelineDaySpan()" title="${t('cycleDaySpanHint')} (${currentSpanText} → ${nextSpanText})" aria-label="Chuyển chế độ xem 1, 3, 7 ngày">
              <span class="dayspan-tag-pill">${span}N</span>
            </button>

            <!-- Tương thích automation & tests -->
            <div id="timeline-dayspan-center" class="timeline-dayspan-center" style="display:none;" aria-hidden="true"></div>
            <select id="calendar-view-select" class="calendar-view-select" onchange="changeCalendarView(Number(this.value))" style="display:none;" aria-hidden="true">
              <option value="1" ${span === 1 ? 'selected' : ''}>1 ${isEn ? 'Day' : 'Ngày'}</option>
              <option value="3" ${span === 3 ? 'selected' : ''}>3 ${isEn ? 'Days' : 'Ngày'}</option>
              <option value="7" ${span === 7 ? 'selected' : ''}>7 ${isEn ? 'Days' : 'Ngày'}</option>
            </select>
          </div>
          <h2 class="current-title day-current-title">${displayTitle}</h2>
        </div>

        <!-- Bên phải: Mục ghi chú ngày chiếm phần còn lại bên phải của thanh bar -->
        <div class="day-notes-inline-box calendar-notes-banner">
          <div class="notes-header">
            <span class="notes-banner-title">
              ${t('notesBannerTitle')}
            </span>
            <button type="button" class="notes-add-btn" onclick="openAddNoteModal('${selectedDate}')" title="${isEn ? 'Add Note (Key N)' : 'Thêm Ghi Chú Lịch (Phím N)'}">
              ${t('addNote')}
            </button>
          </div>
          <div class="notes-list">
            ${dayNotes.map(note => `
              <div class="note-chip" title="${escapeHtml(note.content)}">
                <span class="note-chip-text">${escapeHtml(note.content)}</span>
                <button type="button" class="delete-note-btn" onclick="deleteNote('${note.id}')" title="${t('deleteBtn')}">✕</button>
              </div>
            `).join('') || `<span class="notes-empty-text">${t('noNotes')}</span>`}
          </div>
        </div>
      </div>

      <!-- Khung Timeline 24 Giờ khép kín hoàn toàn, Google Calendar Style Grid -->
      <div class="calendar-grid timeline-card ${spanClass}" id="calendar-grid-root">
        <div class="timeline-grid-wrapper ${spanClass}">
          <!-- 1. Day headers row (Chỉ hiển thị ở chế độ 3 ngày hoặc 7 ngày; ẩn khi xem 1 ngày vì đã có trên thanh bar) -->
          <div class="calendar-header-row timeline-day-headers-row" style="min-width:${canvasMinWidth}; ${span === 1 ? 'display:none !important;' : ''}">
            <div class="time-column-header timeline-hours-header-spacer">GMT+7</div>
            <div class="timeline-day-headers-grid" style="grid-template-columns: repeat(${dates.length}, 1fr);">
              ${dayHeadersHtml}
            </div>
          </div>

          <!-- 2. Khung Canvas Lưới Giờ (Scrollable Time Grid) -->
          <div class="timeline-canvas calendar-body" style="height:${totalCanvasHeight}px; min-width:${canvasMinWidth};">
            <div class="time-column timeline-hours">
              ${hoursHtml}
            </div>
            <div class="day-columns timeline-columns-container" style="grid-template-columns: repeat(${dates.length}, 1fr);">
              ${dayColumnsHtml}
            </div>
          </div>
        </div>
      </div>

    </div>
  `;

  // Chạy thuật toán kiểm tra che khuất name tag và ưu tiên tên task xuống 2-3 dòng
  try {
    syncSpanButtonWidth(container);
    checkAndResolveTagOcclusion(container);
  } catch (err) {
    console.warn('Lỗi khi kiểm tra che khuất name tag:', err);
  }

  const scrollWrapper = container.querySelector('.timeline-grid-wrapper');
  if (scrollWrapper) {
    scrollWrapper.addEventListener('scroll', () => {
      scrollWrapper.dataset.userScrolled = 'true';
      shouldScrollToNow = false;
    }, { passive: true });
  }

  // Tự động cuộn đến gần giờ hiện tại (chỉ khi shouldScrollToNow = true: mở app lần đầu, vào tab Ngày, hoặc bấm Hôm nay)
  setTimeout(() => {
    try {
      syncSpanButtonWidth(container);
      checkAndResolveTagOcclusion(container);
    } catch (e) {}
    const currentScrollWrapper = container.querySelector('.timeline-grid-wrapper');
    if (currentScrollWrapper && shouldScrollToNow && !currentScrollWrapper.dataset.userScrolled) {
      const now = new Date();
      const curM = (now.getHours() * 60) + now.getMinutes();
      const targetScroll = Math.max(0, Math.round(curM * pxPerMinute) - 90);
      currentScrollWrapper.style.scrollBehavior = 'auto';
      currentScrollWrapper.scrollTop = targetScroll;
      shouldScrollToNow = false;
    }
  }, 40);
}

// ==========================================
// 6. VIEW THÁNG (MONTH VIEW - GOOGLE CALENDAR STYLE CÓ HỖ TRỢ SCALE & SCROLL)
// ==========================================
function renderMonthView(container) {
  // Nếu màn hình nhỏ dạng mobile/tablet hẹp, tự động chuyển về view ngày
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    currentView = 'day';
    renderDayView(container);
    return;
  }

  const [yearStr, monthStr] = selectedDate.split('-');
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const firstDay = new Date(year, month - 1, 1).getDay();
  const totalDays = new Date(year, month, 0).getDate();
  const prevMonthTotalDays = new Date(year, month - 1, 0).getDate();

  const isEn = appState.settings.lang === 'en';
  const monthNames = isEn 
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  const dayHeaders = isEn
    ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const ymKey = `${year}-${String(month).padStart(2, '0')}`;
  const monthGoal = appState.goals?.monthGoals?.find(m => !m.deleted && m.yearMonth === ymKey);

  const totalRendered = firstDay + totalDays;
  const remainingCells = (7 - (totalRendered % 7)) % 7;
  const totalCells = totalRendered + remainingCells;
  const numWeeks = Math.max(4, Math.ceil(totalCells / 7));

  const monthZoom = appState.settings?.monthZoom !== undefined ? appState.settings.monthZoom : 100;
  const isFit = monthZoom === 'fit';
  const zoomNumeric = typeof monthZoom === 'number' ? monthZoom : 100;

  // Số lượng badge hiển thị tối đa trước khi thu gọn thành "+N việc khác"
  const maxBadgesToShow = isFit ? 2 : (zoomNumeric >= 150 ? 5 : (zoomNumeric >= 125 ? 4 : (zoomNumeric === 75 ? 2 : 3)));

  let gridCells = '';
  // Ô đệm từ tháng trước
  for (let i = firstDay - 1; i >= 0; i--) {
    const pDay = prevMonthTotalDays - i;
    const prevMonthNum = month === 1 ? 12 : month - 1;
    const prevYearNum = month === 1 ? year - 1 : year;
    const pDateStr = `${prevYearNum}-${String(prevMonthNum).padStart(2, '0')}-${String(pDay).padStart(2, '0')}`;
    
    gridCells += `
      <div class="month-cell other-month" onclick="selectDateAndGoToDay('${pDateStr}')" title="${formatDisplayDate(pDateStr)}">
        <div class="cell-top">
          <span class="cell-date-num">${pDay}</span>
        </div>
        <div class="cell-badges"></div>
      </div>
    `;
  }

  // Các ngày trong tháng hiện tại
  const streakStateForMonth = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : null;

  for (let day = 1; day <= totalDays; day++) {
    const curDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const isToday = curDateStr === getTodayDateString();
    const isSelected = curDateStr === selectedDate;

    // Trạng thái Streak / Freeze của ngày
    const dayStreakStatus = streakStateForMonth?.dayStatus?.[curDateStr] || null;
    let streakIconHtml = '';
    if (dayStreakStatus === 'STREAK') {
      streakIconHtml = `<span class="cell-streak-icon" title="${isEn ? 'Streak target achieved' : 'Đạt Streak'}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg></span>`;
    } else if (dayStreakStatus === 'FROZEN') {
      streakIconHtml = `<span class="cell-streak-icon" title="${isEn ? 'Streak frozen (Protected)' : 'Đã dùng Freeze bảo vệ chuỗi'}"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg></span>`;
    }

    // Ghi chú của ngày
    const dayNotes = appState.notes.filter(n => !n.deleted && n.date === curDateStr);
    // Chỉ hiển thị ghi chú trên ô lịch cho những ngày KHÁC với ngày đang được chọn xem
    // (Vì ngày đang được chọn xem thì ghi chú đã hiển thị chi tiết trên khung bên trái)
    const showNoteBanner = !isSelected && dayNotes.length > 0;

    // Lọc công việc đã được xếp lịch từ Eisenhower
    const assignedTasks = appState.tasks.filter(t => isItemActiveOnDate(t, curDateStr) && getTaskAssignedSlot(t, curDateStr));
    
    // Lọc bỏ các việc lặp đi lặp lại routine hàng ngày nếu không thuộc Eisenhower quan trọng
    const eisenhowerTasks = assignedTasks.filter(t => {
      const isRoutineRepeating = (t.repeatType === 'daily' || t.repeatType === 'weekdays' || t.repeatType === 'custom') && !t.isImportant && !t.isUrgent;
      return !isRoutineRepeating;
    });

    // Helper xác định thứ bậc ưu tiên Q1 -> Q2 -> Q3 -> Q4
    const getQuadrantInfo = (t) => {
      if (t.isImportant && t.isUrgent) return { rank: 1, key: 'q1', label: 'Q1' };
      if (t.isImportant && !t.isUrgent) return { rank: 2, key: 'q2', label: 'Q2' };
      if (!t.isImportant && t.isUrgent) return { rank: 3, key: 'q3', label: 'Q3' };
      return { rank: 4, key: 'q4', label: 'Q4' };
    };

    // Sắp xếp ưu tiên: Q1 -> Q2 -> Q3 -> Q4, sau đó theo giờ bắt đầu
    eisenhowerTasks.sort((a, b) => {
      const qA = getQuadrantInfo(a);
      const qB = getQuadrantInfo(b);
      if (qA.rank !== qB.rank) return qA.rank - qB.rank;
      const slotA = getTaskAssignedSlot(a, curDateStr);
      const slotB = getTaskAssignedSlot(b, curDateStr);
      const startA = slotA ? slotA.start : '99:99';
      const startB = slotB ? slotB.start : '99:99';
      return startA.localeCompare(startB);
    });

    gridCells += `
      <div class="month-cell ${isToday ? 'is-today' : ''} ${isSelected ? 'is-selected' : ''}" onclick="selectDateAndGoToDay('${curDateStr}')" title="${formatDisplayDate(curDateStr)} • ${eisenhowerTasks.length} ${isEn ? 'Eisenhower tasks' : 'task Eisenhower'}">
        <div class="cell-top">
          <span class="cell-date-num ${isToday ? 'today-circle' : ''}">${day}</span>
          ${streakIconHtml}
          ${isToday ? `<span class="cell-today-pill">${isEn ? 'Today' : 'Hôm nay'}</span>` : ''}
        </div>

        ${showNoteBanner ? `
          <div class="cell-note-banner" title="${t('note')}: ${escapeHtml(dayNotes[0].content)}" onclick="event.stopPropagation(); openEditNoteModal('${dayNotes[0].id}')">
            <span class="note-icon"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="17" x2="12" y2="22"></line><path d="M5 17h14v-1.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V6h1a2 2 0 0 0 0-4H8a2 2 0 0 0 0 4h1v4.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24Z"></path></svg></span>
            <span class="note-text">${escapeHtml(dayNotes[0].content)}</span>
          </div>
        ` : ''}

        <div class="cell-badges">
          ${eisenhowerTasks.slice(0, 3).map(t => {
            const slot = getTaskAssignedSlot(t, curDateStr);
            const qInfo = getQuadrantInfo(t);
            const timeStr = slot ? slot.start : '';
            return `
              <div class="month-eisenhower-badge month-badge-${qInfo.key}" title="[${qInfo.label}] ${timeStr ? timeStr + ' - ' : ''}${escapeHtml(t.title)}" onclick="event.stopPropagation(); handleBlockClick('scheduled', '${t.id}')">
                <span class="q-tag">${qInfo.label}</span>
                ${timeStr ? `<span class="q-time">${timeStr}</span>` : ''}
                <span class="q-title">${escapeHtml(t.title)}</span>
              </div>
            `;
          }).join('')}
          ${eisenhowerTasks.length > 3 ? `
            <div class="month-more-indicator" onclick="event.stopPropagation(); selectDateAndGoToDay('${curDateStr}')">
              +${eisenhowerTasks.length - 3} ${isEn ? 'more' : 'khác'}
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }

  // Ô đệm hoàn tất hàng cuối của lưới 7 cột
  for (let n = 1; n <= remainingCells; n++) {
    const nextMonthNum = month === 12 ? 1 : month + 1;
    const nextYearNum = month === 12 ? year + 1 : year;
    const nDateStr = `${nextYearNum}-${String(nextMonthNum).padStart(2, '0')}-${String(n).padStart(2, '0')}`;
    gridCells += `
      <div class="month-cell other-month" onclick="selectDateAndGoToDay('${nDateStr}')" title="${formatDisplayDate(nDateStr)}">
        <div class="cell-top">
          <span class="cell-date-num">${n}</span>
        </div>
        <div class="cell-badges"></div>
      </div>
    `;
  }

  const zoomClass = isFit ? 'scale-fit' : `scale-${zoomNumeric}`;
  const gridMinWidth = isFit ? '100%' : `${Math.round(720 * (zoomNumeric / 100))}px`;

  container.innerHTML = `
    <div class="month-view-wrapper">
      <!-- Month Toolbar -->
      <div class="calendar-toolbar month-view-toolbar">
        <div class="date-display">
          <div class="nav-arrows">
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-prev" onclick="changeMonth(-1)" title="${t('prevMonth')}">←</button>
            <button type="button" class="btn-secondary nav-today-btn" onclick="goToToday()">${t('todayBtn')}</button>
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-next" onclick="changeMonth(1)" title="${t('nextMonth')}">→</button>
          </div>
          <h2 class="current-title">${monthNames[month - 1]} ${year}</h2>
        </div>

        <!-- Month Scale & Zoom Controls (PC & Tablet) -->
        <div class="month-toolbar-actions">
          <div class="month-zoom-controls">
            <span class="zoom-label">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/></svg>
              <span>${t('zoom')}</span>
            </span>
            <button type="button" class="zoom-btn" onclick="zoomMonth(-1)" title="${t('zoomOut')}" ${!isFit && zoomNumeric <= 75 ? 'disabled' : ''}>−</button>
            <span class="zoom-val-badge">${isFit ? t('monthZoomFitShort') : `${zoomNumeric}%`}</span>
            <button type="button" class="zoom-btn" onclick="zoomMonth(1)" title="${t('zoomIn')}" ${!isFit && zoomNumeric >= 150 ? 'disabled' : ''}>+</button>
            <div class="zoom-preset-group">
              <button type="button" class="zoom-chip ${isFit ? 'active' : ''}" onclick="setMonthZoom('fit')" title="${t('monthZoomFit')}">${t('monthZoomFitShort')}</button>
              <button type="button" class="zoom-chip ${!isFit && zoomNumeric === 75 ? 'active' : ''}" onclick="setMonthZoom(75)">75%</button>
              <button type="button" class="zoom-chip ${!isFit && zoomNumeric === 100 ? 'active' : ''}" onclick="setMonthZoom(100)">100%</button>
              <button type="button" class="zoom-chip ${!isFit && zoomNumeric === 125 ? 'active' : ''}" onclick="setMonthZoom(125)">125%</button>
            </div>
          </div>

          <div style="display:flex; gap:8px; align-items:center;">
            <button class="btn-secondary" onclick="openAddNoteModal('${selectedDate}')" title="${isEn ? 'Add Note (Key N)' : 'Thêm Ghi Chú Lịch (Phím N)'}">
              ${t('addNote')}
            </button>
            <button class="btn-primary" onclick="openAddMonthGoalModal('${ymKey}')" title="${isEn ? 'Monthly Goal (G - M)' : 'Mục Tiêu Tháng (G - M)'}">
              ${t('goalMonth')}
            </button>
          </div>
        </div>
      </div>

      <!-- Mục tiêu tháng -->
      <div class="month-goal-card">
        <span><strong>${t('goalMonth')}:</strong> ${monthGoal ? escapeHtml(monthGoal.title) : `<span style="color:var(--text-muted);">${t('noMonthGoal')}</span>`}</span>
        <button class="icon-btn" onclick="openAddMonthGoalModal('${ymKey}')" title="${t('editBtn')}">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        </button>
      </div>

      <!-- Lưới Lịch Tháng Scrollable Container -->
      <div class="month-grid-scroll-wrapper ${isFit ? 'is-fit-mode' : ''}">
        <div class="month-calendar-grid" style="min-width:${gridMinWidth};">
          <div class="grid-header-row">
            ${dayHeaders.map(d => `<div>${d}</div>`).join('')}
          </div>
          <div class="month-days-container ${zoomClass}" style="${isFit ? `grid-template-rows: repeat(${numWeeks}, minmax(0, 1fr));` : ''}">
            ${gridCells}
          </div>
        </div>
      </div>
    </div>
  `;
}


// ==========================================
// 7. VIEW NĂM (YEAR VIEW - GOOGLE CALENDAR 12 THÁNG DẠNG Ô LƯỚI)
// ==========================================
function renderYearView(container) {
  const currentYear = parseInt(selectedDate.split('-')[0], 10);
  const yearGoal = appState.goals?.years?.find(y => !y.deleted && y.year === currentYear);

  const isEn = appState.settings.lang === 'en';
  const monthNames = isEn 
    ? ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    : ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

  const miniDayHeaders = isEn
    ? ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  const todayStr = getTodayDateString();
  const streakState = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : { currentStreak: 0, bestStreak: 0, freezeCount: 0, cleanDays: 0, dayStatus: {} };
  const yearStats = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getYearStats(currentYear) : { streakDays: 0, frozenDays: 0, missedDays: 0, bestStreakInYear: 0, consistencyRate: 0 };

  let monthsCardsHtml = '';
  for (let m = 1; m <= 12; m++) {
    const ymKey = `${currentYear}-${String(m).padStart(2, '0')}`;
    const mGoal = appState.goals?.monthGoals?.find(mg => !mg.deleted && mg.yearMonth === ymKey);
    const mStats = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getMonthStats(currentYear, m) : { streakDays: 0 };
    const firstDay = new Date(currentYear, m - 1, 1).getDay();
    const daysInMonth = new Date(currentYear, m, 0).getDate();

    let dayCellsHtml = '';
    // Đệm ô trống đầu tháng
    for (let p = 0; p < firstDay; p++) {
      dayCellsHtml += `<div class="mini-day-cell empty"></div>`;
    }

    // Các ngày 1..N
    for (let d = 1; d <= daysInMonth; d++) {
      const fullDate = `${ymKey}-${String(d).padStart(2, '0')}`;
      const isToday = fullDate === todayStr;
      const dayStatus = streakState.dayStatus?.[fullDate] || null;
      const metrics = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getDayTaskMetrics(fullDate) : { total: 0, completed: 0, rate: 0 };
      const hasEvents = appState.tasks.some(t => isItemActiveOnDate(t, fullDate) && getTaskAssignedSlot(t, fullDate)) ||
                        appState.notes.some(n => !n.deleted && n.date === fullDate) ||
                        appState.transientEvents.some(tr => isItemActiveOnDate(tr, fullDate)) ||
                        appState.fixedEvents.some(f => isItemActiveOnDate(f, fullDate));

      let classes = 'mini-day-cell';
      if (isToday) classes += ' is-today';
      if (dayStatus === 'STREAK') classes += ' mini-day-streak';
      else if (dayStatus === 'FROZEN') classes += ' mini-day-frozen';
      else if (hasEvents) classes += ' has-events';

      const statusLabel = dayStatus === 'STREAK' ? (isEn ? 'Streak Met' : 'Đạt Streak')
                        : dayStatus === 'FROZEN' ? (isEn ? 'Streak Frozen' : 'Đã dùng Freeze')
                        : dayStatus === 'PENDING' ? (isEn ? 'In Progress' : 'Đang diễn ra')
                        : (isEn ? 'Unmet' : 'Chưa đạt');
      const cellTitle = `${fullDate} • ${statusLabel} • ${metrics.completed}/${metrics.total} ${isEn ? 'tasks' : 'việc'} (${Math.round(metrics.rate * 100)}%)`;

      dayCellsHtml += `
        <div class="${classes}" onclick="event.stopPropagation(); selectDateAndGoToDay('${fullDate}')" title="${cellTitle}">
          ${d}
        </div>
      `;
    }

    monthsCardsHtml += `
      <div class="month-mini-card" onclick="selectMonthAndGo('${ymKey}-01')">
        <div class="mini-month-header">
          <span>${monthNames[m - 1]}</span>
          ${mGoal ? `<span style="font-size:10px; font-weight:700; color:#4338ca;" title="${escapeHtml(mGoal.title)}">•</span>` : ''}
          <span class="month-streak-badge" title="${isEn ? `${mStats.streakDays} streak days in ${monthNames[m - 1]}` : `${mStats.streakDays} ngày đạt streak trong ${monthNames[m - 1]}`}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-1px; margin-right:2px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>${mStats.streakDays} ${isEn ? 'days' : 'ngày'}</span>
        </div>
        <div class="mini-calendar-grid">
          ${miniDayHeaders.map(h => `<div class="mini-day-header">${h}</div>`).join('')}
          ${dayCellsHtml}
        </div>
      </div>
    `;
  }

  container.innerHTML = `
    <div style="display:flex; flex-direction:column; gap:16px; width:100%;">
      <!-- Year Toolbar -->
      <div class="calendar-toolbar">
        <div class="date-display">
          <div class="nav-arrows">
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-prev" onclick="changeYear(-1)" title="${t('prevBtn')}">←</button>
            <button type="button" class="btn-secondary nav-today-btn" onclick="goToToday()">${t('todayBtn')}</button>
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-next" onclick="changeYear(1)" title="${t('nextBtn')}">→</button>
          </div>
          <h2 class="current-title">${currentYear}</h2>
        </div>
        <button class="btn-primary" onclick="openYearGoalModal(${currentYear})" title="${isEn ? 'Yearly Goal (G - Y)' : 'Mục Tiêu Năm (G - Y)'}">
          ${t('goalYear')} ${currentYear}
        </button>
      </div>

      <!-- Mục tiêu năm & Trung tâm Streak & Freeze -->
      <div class="year-goal-card">
        <div class="year-goal-card-content">
          <div style="flex:1; min-width:240px;">
            <h3 style="font-size:14px; font-weight:700; color:var(--primary); margin-bottom:4px;">
              ${t('goalYear')} ${currentYear}
            </h3>
            <div style="font-size:13px; color:var(--text-main); line-height:1.5;">
              ${yearGoal ? `<strong>${escapeHtml(yearGoal.title)}</strong><br><span style="color:var(--text-muted);">${escapeHtml(yearGoal.principles || '')}</span>` : `<span style="color:var(--text-muted);">${t('noYearGoal')}</span>`}
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px; align-items:flex-end;">
            <button class="btn-primary" style="font-size:12px; padding:6px 12px; display:inline-flex; align-items:center; gap:5px;" onclick="openYearGoalModal(${currentYear})">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
              <span>${t('goalYear')} ${currentYear}</span>
            </button>
          </div>
        </div>

        <!-- 4 Chỉ số Tổng kết Năm & Legend -->
        <div class="year-streak-stats-row">
          <div class="year-streak-chip current" title="${isEn ? 'Current discipline streak' : 'Chuỗi kỷ luật hiện tại'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#f97316" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:3px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>${isEn ? 'Streak:' : 'Chuỗi hiện tại:'} <strong>${streakState.currentStreak} ${isEn ? 'days' : 'ngày'}</strong>
          </div>
          <div class="year-streak-chip record" title="${isEn ? 'Year record streak' : 'Kỷ lục chuỗi trong năm'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:3px;"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.45 1-1 1H8c-.55 0-1 .45-1 1v1h10v-1c0-.55-.45-1-1-1h-1c-.55 0-1-.45-1-1v-2.34"/><path d="M6 4h12a2 2 0 0 1 2 2v3a6 6 0 0 1-12 0V6a2 2 0 0 1 2-2z"/></svg>${isEn ? 'Record:' : 'Kỷ lục:'} <strong>${yearStats.bestStreakInYear || streakState.bestStreak} ${isEn ? 'days' : 'ngày'}</strong>
          </div>
          <div class="year-streak-chip freeze" title="${isEn ? 'Streak Freeze count and progress towards next freeze' : 'Số lượt đóng băng và tiến độ nhận thêm lượt'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:3px;"><line x1="2" y1="12" x2="22" y2="12"/><line x1="12" y1="2" x2="12" y2="22"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/><line x1="19.07" y1="4.93" x2="4.93" y2="19.07"/></svg>${isEn ? 'Freeze:' : 'Đóng băng:'} <strong>${streakState.freezeCount}/2</strong> <span style="font-size:11px; opacity:0.85;">(${isEn ? 'Progress:' : 'Tiến độ:'} ${streakState.cleanDays}/7)</span>
          </div>
          <div class="year-streak-chip total" title="${isEn ? 'Total days meeting streak target in year' : 'Tổng số ngày đạt chuẩn mục tiêu trong năm'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline-block; vertical-align:-2px; margin-right:3px;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>${isEn ? 'Total Met:' : 'Tổng ngày đạt chuẩn:'} <strong>${yearStats.streakDays} ${isEn ? 'days' : 'ngày'}</strong> <span style="font-size:11px; opacity:0.85;">(${Math.round(yearStats.consistencyRate * 100)}%)</span>
          </div>
        </div>

        <div class="year-streak-legend">
          <span><span class="legend-dot streak"></span> ${isEn ? 'Streak Met' : 'Đạt Streak'}</span>
          <span><span class="legend-dot frozen"></span> ${isEn ? 'Streak Frozen' : 'Đóng băng'}</span>
          <span><span class="legend-dot today"></span> ${isEn ? 'Today' : 'Hôm nay'}</span>
        </div>
      </div>

      <!-- 12 Tháng Dạng Ô Lưới Google Calendar -->
      <div class="year-overview-grid">
        ${monthsCardsHtml}
      </div>
    </div>
  `;
}

// ==========================================
// 8. VIEW MA TRẬN EISENHOWER & SMART TIME BLOCKING
// ==========================================
function setEisenhowerScope(scope) {
  if (!appState.settings) appState.settings = {};
  appState.settings.eisenhowerScope = scope;
  saveData();
  renderApp();
}
window.setEisenhowerScope = setEisenhowerScope;

/**
 * Phân tích cấu trúc ghi chú của task theo quy chuẩn:
 * - Gạch đầu dòng (-) cho nội dung chính
 * - Dấu cộng (+) cho nội dung con
 * Mặc định chỉ hiển thị tối đa 3 dòng gạch đầu dòng đầu tiên.
 * Nếu không theo cấu trúc gạch đầu dòng, hiển thị mặc định 3 dòng đầu tiên.
 */
function parseTaskNote(note) {
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

if (typeof window !== 'undefined' && !window.expandedTaskNotes) {
  window.expandedTaskNotes = new Set();
}

function renderTaskNoteBlock(task, isExpanded = false) {
  const parsed = parseTaskNote(task.note);

  // 1. Ghi chú trống -> hiển thị hint gợi ý cấu trúc
  if (parsed.isEmpty) {
    return `
      <div id="task-note-container-${task.id}" class="task-note-container is-empty">
        <div class="task-note-empty-hint" onclick="event.stopPropagation(); openEditTaskModal('${task.id}')" title="${t('addNoteHintTitle')}">
          <div class="hint-title">${t('addNoteHintText')}</div>
          <div class="hint-guide-line">${t('addNoteGuideMain')}</div>
          <div class="hint-guide-line hint-sub">${t('addNoteGuideSub')}</div>
        </div>
      </div>
    `;
  }

  // 2. Có nội dung ghi chú
  const linesToRender = isExpanded ? parsed.allLines : parsed.previewLines;

  const renderedLinesHtml = linesToRender.map(line => {
    const trimmed = line.trim();
    if (!trimmed) return '';
    const isMain = /^[-–—]/.test(trimmed);
    const isSub = /^\+/.test(trimmed);
    let lineClass = 'note-line';
    if (isMain) lineClass += ' note-line-main';
    else if (isSub) lineClass += ' note-line-sub';
    else lineClass += ' note-line-plain';

    return `<div class="${lineClass}">${escapeHtml(trimmed)}</div>`;
  }).filter(Boolean).join('');

  return `
    <div id="task-note-container-${task.id}" class="task-note-container ${isExpanded ? 'is-expanded' : 'is-collapsed'}">
      <div class="task-note-text" title="${escapeHtml(task.note)}">${renderedLinesHtml}</div>
      ${parsed.hasMore ? `
        <button type="button" class="task-note-toggle-btn" onclick="event.stopPropagation(); toggleTaskNoteExpand('${task.id}', event)">${isExpanded ? t('collapseNote') : t('expandNote')}</button>
      ` : ''}
    </div>
  `;
}

function toggleTaskNoteExpand(taskId, event) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!window.expandedTaskNotes) window.expandedTaskNotes = new Set();
  const willExpand = !window.expandedTaskNotes.has(taskId);
  if (willExpand) {
    window.expandedTaskNotes.add(taskId);
  } else {
    window.expandedTaskNotes.delete(taskId);
  }

  const container = document.getElementById(`task-note-container-${taskId}`);
  if (container) {
    const task = appState.tasks.find(t => t.id === taskId);
    if (task) {
      container.outerHTML = renderTaskNoteBlock(task, willExpand);
      return;
    }
  }
  renderEisenhowerView();
}
window.toggleTaskNoteExpand = toggleTaskNoteExpand;

function renderEisenhowerView(container) {
  if (!container) {
    container = document.getElementById('view-container');
  }
  if (!container) return;

  const displayTasks = appState.tasks.filter(t => isItemActiveOnDate(t, selectedDate));
  const sortOrder = appState.settings?.timeSortOrder || 'asc';

  const q1Raw = displayTasks.filter(t => t.isImportant && t.isUrgent);
  const q2Raw = displayTasks.filter(t => t.isImportant && !t.isUrgent);
  const q3Raw = displayTasks.filter(t => !t.isImportant && t.isUrgent);
  const q4Raw = displayTasks.filter(t => !t.isImportant && !t.isUrgent);

  const q1 = sortItemsByTime(q1Raw, selectedDate, sortOrder);
  const q2 = sortItemsByTime(q2Raw, selectedDate, sortOrder);
  const q3 = sortItemsByTime(q3Raw, selectedDate, sortOrder);
  const q4 = sortItemsByTime(q4Raw, selectedDate, sortOrder);

  function renderTaskCard(task) {
    const assignedSlot = getTaskAssignedSlot(task, selectedDate);
    const isScheduled = !!assignedSlot;
    const isDone = isTaskDoneOnDate(task, selectedDate);
    const rep = getRepeatLabel(task);

    return `
      <div class="matrix-task-item ${isDone ? 'is-done' : ''}" draggable="true" ondragstart="handleDragStart(event, '${task.id}')">
        <div class="task-top-row">
          <label class="task-checkbox-label">
            <input type="checkbox" ${isDone ? 'checked' : ''} onchange="toggleTaskDone('${task.id}', '${selectedDate}')">
            <span class="task-title-text">
              ${escapeHtml(task.title)}
            </span>
          </label>
          <div class="task-actions-group">
            <button class="mini-action-btn" onclick="openEditTaskModal('${task.id}')" title="${t('editBtn')}" aria-label="${t('editBtn')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
            </button>
            <button class="mini-action-btn delete" onclick="deleteTask('${task.id}')" title="${t('deleteBtn')}" aria-label="${t('deleteBtn')}">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
        </div>

        ${renderTaskNoteBlock(task, !!(window.expandedTaskNotes && window.expandedTaskNotes.has(task.id)))}

        <div class="task-meta-wrap">
          <span class="smart-pill" style="background:var(--bg-hover); color:var(--text-secondary);">${task.estimatedMinutes || 25}${t('minShort')}</span>
          <span class="smart-pill ${task.requireQuiet ? 'pill-focus-long' : 'pill-distract-short'}">
            ${task.requireQuiet ? t('requireQuiet') : t('allowNoise')}
          </span>
          ${task.preferredSession && task.preferredSession !== 'any' ? `
            <span class="session-pill ${task.preferredSession}">
              ${task.preferredSession === 'morning' ? t('sessionBadgeMorning') : (task.preferredSession === 'afternoon' ? t('sessionBadgeAfternoon') : t('sessionBadgeEvening'))}
            </span>
          ` : ''}
          ${rep ? `<span class="repeat-badge" title="${rep}">${rep}</span>` : ''}
          ${isScheduled ? `
            <span class="smart-pill task-assigned-slot-pill">
              ${assignedSlot.start} - ${assignedSlot.end}
              <button class="icon-btn unassign-slot-btn" onclick="unassignTask('${task.id}', '${selectedDate}')" title="${t('unscheduleBtn')}">✕</button>
            </span>
          ` : `
            <button class="btn-secondary" style="padding:2px 8px; font-size:11px;" onclick="promptScheduleTask('${task.id}')">
              ${t('scheduleBtn')}
            </button>
          `}
        </div>
      </div>
    `;
  }

  function renderEmptyQuadrant(qKey) {
    return `
      <div class="empty-quadrant-box">
        <div>${t('emptyQuadrant')}</div>
        <button class="btn-secondary" style="font-size:11px; padding:4px 10px;" onclick="openAddTaskModal('${selectedDate}', '${qKey}')">
          ${t('quickAddTaskInQuadrant')}
        </button>
      </div>
    `;
  }

  const streakState = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : {
    currentStreak: 0,
    freezeCount: 0,
    maxFreeze: 2,
    cleanDays: 0,
    todayMetrics: { total: 0, completed: 0, rate: 0, isMet: false, neededCount: 0 }
  };
  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
  const streakMetrics = streakState.todayMetrics || {};
  const isMetToday = streakMetrics.isMet;

  container.innerHTML = `
    <div class="eisenhower-container">
      <!-- Eisenhower Header Card -->
      <div class="eisenhower-header-card">
        <div style="display:flex; align-items:center; gap:14px; flex-wrap:wrap;">
          <div class="nav-arrows">
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-prev" onclick="changeDate(-1); setView('eisenhower');" title="${t('prevBtn')}">←</button>
            <button type="button" class="btn-secondary nav-today-btn" onclick="goToToday(); setView('eisenhower');">${t('todayBtn')}</button>
            <button type="button" class="btn-secondary nav-arrow-btn nav-btn-next" onclick="changeDate(1); setView('eisenhower');" title="${t('nextBtn')}">→</button>
          </div>
          <div>
            <h2 style="font-size:17px; font-weight:800; color:var(--text-main); margin-bottom:2px;">
              ${t('eisenhowerTitle')}
            </h2>
            <div style="font-size:12px; color:var(--text-muted); display:flex; align-items:center; gap:6px;">
              <span>${formatDisplayDate(selectedDate)}</span>
              <span>•</span>
              <span>${t('tasksCount', { count: displayTasks.length })}</span>
            </div>
          </div>
        </div>

        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-secondary" onclick="toggleTimeSortOrder()" title="${sortOrder === 'asc' ? (isEn ? 'Sort: Earliest First (Click to switch to Latest First)' : 'Sắp xếp: Sớm nhất trước (Bấm để đổi sang Muộn nhất trước)') : (isEn ? 'Sort: Latest First (Click to switch to Earliest First)' : 'Sắp xếp: Muộn nhất trước (Bấm để đổi sang Sớm nhất trước)')}" style="display:inline-flex; align-items:center; gap:6px; font-size:12px; font-weight:600; padding:6px 12px; border-radius:6px;">
            ${sortOrder === 'asc' 
              ? `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg><span>${isEn ? 'Earliest First (↑)' : 'Sớm nhất trước (↑)'}</span>` 
              : `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg><span>${isEn ? 'Latest First (↓)' : 'Muộn nhất trước (↓)'}</span>`}
          </button>
          <button class="btn-secondary" onclick="autoMatchAllTasks()">
            ${t('autoMatchAll')}
          </button>
          <button class="btn-primary" onclick="openAddTaskModal('${selectedDate}')">
            ${t('btnAddTask')}
          </button>
        </div>
      </div>

      <!-- 2x2 Grid of Quadrants (Settings-card style) -->
      <div class="eisenhower-grid-layout">
        <!-- Q1: Khẩn cấp & Quan trọng -->
        <div class="eisenhower-card quadrant-q1" ondragover="handleQuadrantDragOver(event)" ondrop="handleQuadrantDrop(event, 'q1')">
          <div class="eisenhower-card-header">
            <div class="eisenhower-card-title" style="color:var(--q1-accent);">
              <span>${t('q1Title')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="smart-pill q-badge-q1">${t('q1Badge')} (${q1.length})</span>
              <button class="icon-btn" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;" onclick="openAddTaskModal('${selectedDate}', 'q1')" title="${t('quickAddTaskInQuadrant')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
          <div class="eisenhower-card-desc">${t('q1Desc')}</div>
          <div class="eisenhower-task-list">
            ${q1.map(renderTaskCard).join('') || renderEmptyQuadrant('q1')}
          </div>
        </div>

        <!-- Q2: Quan trọng & Không khẩn cấp -->
        <div class="eisenhower-card quadrant-q2" ondragover="handleQuadrantDragOver(event)" ondrop="handleQuadrantDrop(event, 'q2')">
          <div class="eisenhower-card-header">
            <div class="eisenhower-card-title" style="color:var(--q2-accent);">
              <span>${t('q2Title')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="smart-pill q-badge-q2">${t('q2Badge')} (${q2.length})</span>
              <button class="icon-btn" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;" onclick="openAddTaskModal('${selectedDate}', 'q2')" title="${t('quickAddTaskInQuadrant')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
          <div class="eisenhower-card-desc">${t('q2Desc')}</div>
          <div class="eisenhower-task-list">
            ${q2.map(renderTaskCard).join('') || renderEmptyQuadrant('q2')}
          </div>
        </div>

        <!-- Q3: Khẩn cấp & Không quan trọng -->
        <div class="eisenhower-card quadrant-q3" ondragover="handleQuadrantDragOver(event)" ondrop="handleQuadrantDrop(event, 'q3')">
          <div class="eisenhower-card-header">
            <div class="eisenhower-card-title" style="color:var(--q3-accent);">
              <span>${t('q3Title')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="smart-pill q-badge-q3">${t('q3Badge')} (${q3.length})</span>
              <button class="icon-btn" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;" onclick="openAddTaskModal('${selectedDate}', 'q3')" title="${t('quickAddTaskInQuadrant')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
          <div class="eisenhower-card-desc">${t('q3Desc')}</div>
          <div class="eisenhower-task-list">
            ${q3.map(renderTaskCard).join('') || renderEmptyQuadrant('q3')}
          </div>
        </div>

        <!-- Q4: Không khẩn cấp & Không quan trọng -->
        <div class="eisenhower-card quadrant-q4" ondragover="handleQuadrantDragOver(event)" ondrop="handleQuadrantDrop(event, 'q4')">
          <div class="eisenhower-card-header">
            <div class="eisenhower-card-title" style="color:var(--q4-accent);">
              <span>${t('q4Title')}</span>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <span class="smart-pill q-badge-q4">${t('q4Badge')} (${q4.length})</span>
              <button class="icon-btn" style="width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center;" onclick="openAddTaskModal('${selectedDate}', 'q4')" title="${t('quickAddTaskInQuadrant')}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </button>
            </div>
          </div>
          <div class="eisenhower-card-desc">${t('q4Desc')}</div>
          <div class="eisenhower-task-list">
            ${q4.map(renderTaskCard).join('') || renderEmptyQuadrant('q4')}
          </div>
        </div>
      </div>
    </div>
  `;
}

// ==========================================
// 9. VIEW CÀI ĐẶT & BACKUP DỮ LIỆU
// ==========================================

function renderHelpDocSection() {
  const isEn = appState.settings.lang === 'en';

  if (isEn) {
    return `
      <!-- COMPREHENSIVE HELP DOC & USER MANUAL (ACCORDION) -->
      <div class="settings-card help-doc-card" id="help-doc-section">
        <div class="settings-card-header">
          <div class="settings-card-title" style="display:flex; align-items:center; gap:8px;">
            <span>Comprehensive ChronoFlow User Manual & Help Center</span>
          </div>
          <span class="smart-pill" style="background:#dbeafe; color:#1e40af; font-weight:700; font-size:11px;">
            Version 1.3.0 • Complete Guide
          </span>
        </div>

        <div class="settings-card-desc">
          Everything you need to master ChronoFlow v1.3.0: Mobile Interface Assistance, Quick Actions FAB, Touch Gestures, Cognitive Energy Management, Eisenhower Matrix, Multi-Day 24h Timelines, Smart Color Mapping Modes, Real-Time Laser Indicator, Recovery Resets, Two-Way Google Calendar Sync, Minimalist Settings, and Data Safety.
        </div>

        <div class="help-accordion-group">
          <!-- 1. Overview & Philosophy -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>1. Overview: Energy Philosophy, 1440-Minute Budget & Smart Algorithms</span>
              <span class="settings-name-tag">Name Tag: Energy & 1440m</span>
            </summary>
            <div class="help-content">
              <div><strong>• Finite 1440-Minute Daily Budget:</strong> Every day contains exactly 1440 minutes. ChronoFlow treats your daily hours as a strict budget, dynamically computing your Remaining Free Time whenever Fixed or Transient events are scheduled.</div>
              <div><strong>• Cognitive Energy & Attention vs. Time Management:</strong> Traditional apps assume 1 hour at 08:00 has the same value as 1 hour at 14:00 or 23:00. ChronoFlow manages your biological focus (Circadian Rhythm), matching intensive Deep Work to energy peaks and light chores to energy troughs.</div>
              <div><strong>• Noise-Aware Free Slot Partitioning:</strong> The timeline automatically scans 24 hours (00:00 to 24:00), excludes Fixed and Transient events, partitions remaining gaps by your configurable Quiet/Noisy intervals, and categorizes free blocks into Deep Focus vs. Shallow intervals.</div>
              <div><strong>• Two-Way Google Calendar Real-Time Sync:</strong> Client-side OAuth 2.0 integration synchronizes scheduled tasks to Google Calendar with color mappings and parses incoming foreign events into transient buffers with zero server footprint.</div>
            </div>
          </details>

          <!-- 2. Year & Month Long-Term Management -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>2. Year & Month Goals Management (Long-Term Vision Alignment)</span>
              <span class="settings-name-tag">Name Tag: Goals & Notes</span>
            </summary>
            <div class="help-content">
              <div><strong>• Long-Term Vision Alignment:</strong> Located at the top of the workspace, the Year and Month panels ensure your daily Eisenhower tasks directly serve your quarterly and annual aspirations.</div>
              <div><strong>• <span class="btn-badge">Edit</span> & <span class="btn-badge">Save</span> Buttons:</strong> Click to edit your strategic milestones, KPI targets, or monthly focus themes. Press Save to persist changes instantly to LocalStorage.</div>
              <div><strong>• <span class="btn-badge">Add Note</span> Button:</strong> Create contextual sticky notes, reference links, project checklists, or meeting agendas linked directly to the selected month/year.</div>
            </div>
          </details>

          <!-- 3. Eisenhower Matrix & Task Management -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>3. Eisenhower Matrix & Task Management (Auto vs. Manual Scheduling)</span>
              <span class="settings-name-tag">Name Tag: Eisenhower Matrix</span>
            </summary>
            <div class="help-content">
              <div><strong>• 4 Matrix Quadrants:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>Q1 (Do First - Urgent & Important):</strong> Critical emergencies, deadlines, production bugs.</li>
                  <li><strong>Q2 (Schedule / Deep Focus - Not Urgent & Important):</strong> System architecture, proactive learning, strategy, high-leverage growth.</li>
                  <li><strong>Q3 (Delegate / Shallow - Urgent & Not Important):</strong> Operational emails, status meetings, routine requests.</li>
                  <li><strong>Q4 (Eliminate / Buffer - Not Urgent & Not Important):</strong> Low-priority backlog, trivial chores.</li>
                </ul>
              </div>
              <div><strong>• Action Controls:</strong> Click <span class="btn-badge">Edit</span> to open the comprehensive Edit Modal, and <span class="btn-badge">Delete</span> to permanently delete a task.</div>
              <div><strong>• Task Attributes & Checkboxes:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>Important & Urgent:</strong> Dynamically recalculates the quadrant placement (Q1-Q4).</li>
                  <li><strong>Quiet Environment Required:</strong> When checked, prevents this task from being auto-matched into noisy time slots (e.g. coffee shop or commute hours).</li>
                </ul>
              </div>
              <div><strong>• <span class="btn-badge">Schedule Mode</span> (Prioritized at Top):</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>Auto Schedule (Default):</strong> Automatically matches tasks into optimal free slots according to Circadian energy score, Attention Level, and Preferred Session.</li>
                  <li><strong>Custom / Manual Time:</strong> Reveals the <em>"Start Time"</em> picker. The task is scheduled immediately upon saving (End Time is calculated as Start Time + Duration). The Preferred Session and Attention Level fields are automatically disabled and dimmed since exact timing is fixed.</li>
                </ul>
              </div>
              <div><strong>• <span class="btn-badge">Attention Level</span> & <span class="btn-badge">Preferred Session</span>:</strong> For Auto mode, configure desired cognitive focus (<em>Auto, High, Medium, Low, Any</em>) and time of day (<em>Morning, Afternoon, Evening, Any</em>).</div>
              <div><strong>• <span class="btn-badge">Assign to Slot</span> & <span class="btn-badge">Auto Match All Tasks</span>:</strong> "Assign to Slot" places a single task into the best available slot; "Auto Match All Tasks" batches all tasks across the day in prioritized Q1 &rarr; Q2 &rarr; Q3 &rarr; Q4 sequence.</div>
            </div>
          </details>

          <!-- 4. Attention-Based Cognitive Scheduling Algorithm & Neuroscience Engine -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>4. Attention-Based Scheduling Algorithm & Circadian Energy Engine</span>
              <span class="settings-name-tag">Name Tag: Attention Engine</span>
            </summary>
            <div class="help-content">
              <div><strong>• Does ChronoFlow have an Attention-Based Scheduling Algorithm?</strong>
                <p style="margin:4px 0 8px 0;"><strong>YES, absolutely.</strong> ChronoFlow incorporates an advanced, science-grounded <em>Attention & Energy Scheduling Engine</em> that goes far beyond traditional calendar time-blocking. Instead of treating every hour as identical, it models your brain's biological focus capacity throughout 24 hours.</p>
              </div>

              <div><strong>• How the Attention Algorithm Operates:</strong>
                <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                  <li><strong>1. Biological Circadian Base Curve (0.0 &ndash; 2.0 Score):</strong>
                    <ul style="margin:2px 0 4px 16px; list-style-type:circle;">
                      <li><em>06:00 &ndash; 11:00 (Base 2.0 - Peak Clarity):</em> Maximum dopamine and working memory. Ideal for deep creative thought and Q1/Q2 tasks.</li>
                      <li><em>11:00 &ndash; 13:30 (Base 0.5 - Biological Dip):</em> Post-prandial slump. Ideal for lunch, naps, meditation, or shallow errands.</li>
                      <li><em>14:00 &ndash; 18:00 (Base 1.5 - Secondary Execution Peak):</em> Strong analytical focus for coding, sprints, and strategic meetings.</li>
                      <li><em>18:00 &ndash; 22:00 (Base 1.0 - Gentle Focus):</em> Reading, daily retrospective, planning tomorrow.</li>
                      <li><em>22:00 &ndash; 06:00 (Base 0.0 - Sleep & Restoration):</em> System protection for physical recovery.</li>
                    </ul>
                  </li>
                  <li><strong>2. Dynamic Fatigue Accumulation:</strong> Completing demanding mental work depletes willpower. High Attention tasks add <strong>+0.5 Fatigue Score</strong>; Medium Attention tasks add <strong>+0.2 Fatigue Score</strong>.</li>
                  <li><strong>3. Energy Recovery Resets (isRecovery):</strong> When timeline reaches a Fixed Event marked with <em>"Energy Recovery Event"</em> (Power Nap, Meditation, Yoga, Exercise, Walk), the <strong>Fatigue Score instantly resets to 0.0</strong>, reviving subsequent hours back to 1.5 &ndash; 2.0 peak capability!</li>
                  <li><strong>4. Actual Attention Formula:</strong> <code>ActualAttention = Math.max(0, BaseScore - FatigueScore)</code>.</li>
                  <li><strong>5. Multi-Factor Match Scoring:</strong>
                    When calculating the best slot, ChronoFlow combines: <em>(Session Preference + Early-Session Placement Bonus) + (Cognitive Energy Match) + (Quiet Environment Verification) + (Eisenhower Priority Weight)</em>.
                  </li>
                </ul>
              </div>

              <div><strong>• Is It Effective? Why It Outperforms Traditional Calendars:</strong>
                <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                  <li><strong>Eliminates Afternoon Burnout:</strong> Prevents high-intensity mental tasks from being scheduled during 13:00 energy slumps or after consecutive demanding sessions without recovery.</li>
                  <li><strong>Protects Deep Work:</strong> Directs your most crucial Q1/Q2 projects into quiet &ge;30m green focus blocks.</li>
                  <li><strong>Optimizes Dead Time:</strong> Relegates low-attention chores (Q3/Q4) into short fragments and noisy windows, reclaiming up to 2-3 productive hours daily.</li>
                </ul>
              </div>

              <div><strong>• How to Use the Attention Algorithm in 4 Easy Steps:</strong>
                <ol style="margin:4px 0 0 16px; padding:0; list-style-type:decimal;">
                  <li><strong>Step 1 (Recovery Events):</strong> Create or edit Fixed Events (e.g. Nap 12:30-13:15, Gym 17:30-18:30) and check <em>"Energy Recovery Event"</em>.</li>
                  <li><strong>Step 2 (Task Attention Level):</strong> In the Task modal, set Attention Level to <em>High</em> (complex reasoning), <em>Medium</em>, <em>Low</em> (emails/chores), or <em>Auto</em> (inferred from Eisenhower matrix).</li>
                  <li><strong>Step 3 (Session Preference & Quiet):</strong> Select Preferred Session (Morning/Afternoon/Evening) and check <em>"Quiet environment required"</em> if noise-sensitive.</li>
                  <li><strong>Step 4 (One-Click Auto-Match):</strong> Click <em>"Auto Match All Tasks"</em> on the Eisenhower Matrix or Timeline toolbar. ChronoFlow automatically sequences your entire day for peak cognitive performance!</li>
                </ol>
              </div>
            </div>
          </details>

          <!-- 5. Preferred Session Classification -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>5. Preferred Session Classification (Morning, Afternoon, Evening) & Early-Session Placement</span>
              <span class="settings-name-tag">Name Tag: Session Priority</span>
            </summary>
            <div class="help-content">
              <div><strong>• Target Session Options:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>Morning:</strong> 06:00 to 12:00 window.</li>
                  <li><strong>Afternoon:</strong> 12:00 to 18:00 window.</li>
                  <li><strong>Evening:</strong> 18:00 to 23:00 window.</li>
                  <li><strong>Any Time:</strong> Flexible placement across the full 24h budget.</li>
                </ul>
              </div>
              <div><strong>• Early-Session Auto Placement:</strong> High-attention and critical tasks assigned to a specific session are mathematically prioritized to the earliest open slot within that session (e.g. 07:00 for Morning, 14:00 for Afternoon, 18:00 for Evening).</div>
              <div><strong>• Resilient Fallback:</strong> If your preferred session is fully occupied by Fixed Events, ChronoFlow gracefully falls back to the next highest attention interval without scheduling errors.</div>
            </div>
          </details>

          <!-- 6. 24h Timeline & Multi-Day Views -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>6. 24h Multi-Day Timeline (1, 3, 7 Days), Luminous Time Laser & Recovery Resets</span>
              <span class="settings-name-tag">Name Tag: 24h Timeline</span>
            </summary>
            <div class="help-content">
              <div><strong>• Multi-Day Timeline Spans (1, 3, 7 Days):</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>1-Day View:</strong> Ultra-clean single day timeline with embedded Daily Notes in the header and maximum vertical focus.</li>
                  <li><strong>3-Day & 7-Day (Week) Views:</strong> Google Calendar style multi-column grid. Double-click any day header to jump straight into that day. In 7-day mode, event titles wrap up to 3 lines with automatic name-tag collision prevention.</li>
                  <li><strong>Cycle Switcher Button (1N / 3N / 7N):</strong> Click the compact switcher next to the date arrows to cycle seamlessly between 1, 3, and 7 day views.</li>
                </ul>
              </div>
              <div><strong>• Luminous Glass Laser Indicator:</strong> Real-time current hour beam stays permanently on top (<span class="btn-badge">z-index: 25</span>) with glowing glass aesthetics and click-through transparency (<code>pointer-events: none</code>) for effortless task interaction.</div>
              <div><strong>• Subtle 30-Minute Grid Lines:</strong> Refined semi-transparent dashed lines mark every half-hour cleanly without cluttering text or causing visual fatigue.</div>
              <div><strong>• Free Slot Color Coding:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:none;">
                  <li><span class="help-color-indicator" style="background:#10b981;"></span><strong>Green (Deep Focus / Peak Attention):</strong> Duration &ge; Focus Threshold (default 30m), quiet environment, High Energy Base (1.5 - 2.0). Ideal for Q1/Q2.</li>
                  <li><span class="help-color-indicator" style="background:#3b82f6;"></span><strong>Blue (Sub-Peak Focus):</strong> Moderate duration quiet slots with good attention capacity.</li>
                  <li><span class="help-color-indicator" style="background:#f59e0b;"></span><strong>Yellow (Shallow / Post-Lunch Dip):</strong> Short slots &lt; 30m or biological energy dips (11:00-13:30). Best for Q3/Q4.</li>
                  <li><span class="help-color-indicator" style="background:#f97316;"></span><strong>Orange (Noisy Window):</strong> Slots overlapping with designated Noisy Hours.</li>
                </ul>
              </div>
              <div><strong>• Fixed Events vs. Transient Events:</strong> Fixed events represent recurring commitments (meetings, classes, sleep). Transient events represent ad-hoc interruptions or incoming Google Calendar events.</div>
              <div><strong>• SPECIAL: [Energy Recovery Event] Checkbox:</strong> When editing Fixed Events (Nap, Yoga, Meditation, Gym, Walk), checking <em>"Energy Recovery Event"</em> tells ChronoFlow to <strong>reset the cumulative Fatigue Score to 0.0</strong> the moment this event concludes. Subsequent free slots instantly regain pristine 1.5 - 2.0 attention scores!</div>
              <div><strong>• Ergonomic Bottom Utility Toolbar:</strong> Productivity Statistics, Focus Mode Toggle, Zoom Slider (- / + / 100%), and Smart Tag Color Legend are cleanly docked below the timeline card.</div>
              <div><strong>• Drag & Drop & Direct Timeline Interaction:</strong> Drag any scheduled block to reschedule start and end times with automated 15-minute grid snapping. Click on any event to edit or remove it.</div>
            </div>
          </details>

          <!-- 7. Productivity Statistics Report & High Contrast WCAG AAA -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>7. Productivity Statistics Report & High-Contrast Visual Accessibility (WCAG AAA)</span>
              <span class="settings-name-tag">Name Tag: Analytics</span>
            </summary>
            <div class="help-content">
              <div><strong>• Instant Insights Modal:</strong> Click the <strong>"Productivity Statistics"</strong> button in the bottom utility toolbar to open a comprehensive analytics overview.</div>
              <div><strong>• Key Metrics Tracked:</strong>
                <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                  <li><strong>Focus Rate %:</strong> Percentage of free time dedicated to Deep Focus vs. Shallow activities.</li>
                  <li><strong>Deep Focus vs. Shallow Hours:</strong> Breakdown of total hours spent in focus long slots (&ge; 30m) vs. distraction intervals.</li>
                  <li><strong>Completion & Scheduled Rates:</strong> Percentage of tasks marked completed and fraction of Eisenhower backlog assigned to the timeline.</li>
                  <li><strong>Eisenhower Distribution (Q1-Q4):</strong> Exact count breakdown across Urgent & Important quadrants.</li>
                  <li><strong>Smart Optimization Insights:</strong> Dynamic recommendations highlighting schedule imbalances or Q1 overload.</li>
                </ul>
              </div>
              <div><strong>• WCAG 2.1 AAA Accessibility:</strong> Fully re-engineered with theme-aware semantic CSS variables, ensuring text contrast ratios exceeding 7.0:1 in both Light and Dark modes with zero harsh white blocks.</div>
            </div>
          </details>

          <!-- 8. System Customization, Typography Scaling & Focus Blur Engine -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>8. System Customization, Dynamic Typography Scaling & Focus Mode Engine</span>
              <span class="settings-name-tag">Name Tag: Appearance</span>
            </summary>
            <div class="help-content">
              <div><strong>• System-Wide Dynamic Typography Scaling (80% - 130%):</strong> Adjust all text and UI elements globally in Settings &rarr; Appearance. Choose from 4 quick presets (85%, 100%, 115%, 130%) or fine-tune with the smooth range slider and instant live preview.</div>
              <div><strong>• Focus Mode & Blur Customization:</strong> Enable Focus Mode (<span class="btn-badge">Focus Mode: On</span>) to submerge non-active events into soft glass-morphic depth. Customize blur intensity from 2px to 10px in Settings with live preview. Hovering over any card smoothly restores crystal clarity.</div>
              <div><strong>• Clean Ergonomics & Button Standardization:</strong> Refined toolbar layouts eliminate redundant plus signs and standardize navigation controls to 36px geometry with perfectly centered glyphs.</div>
            </div>
          </details>

          <!-- 9. Color Palette & Smart Google Calendar Color Mapping (Attention vs Eisenhower) -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>9. Dual Color Palette & Smart Google Calendar Color Mapping (Attention vs. Eisenhower Modes)</span>
              <span class="settings-name-tag">Name Tag: Color Mapping</span>
            </summary>
            <div class="help-content">
              <div><strong>• Dual Mapping Modes (Attention vs. Eisenhower Matrix):</strong>
                <p style="margin:4px 0 8px 0;">You can switch the first 4 customizable color slots between two distinct organizational paradigms:</p>
                <ul style="margin:2px 0 6px 16px; padding:0; list-style-type:disc;">
                  <li><strong>Attention Level Mode (Default):</strong> Assigns dedicated colors to High Focus, Medium Focus, Low Focus, and Auto Focus tasks.</li>
                  <li><strong>Eisenhower Matrix Mode:</strong> Assigns distinct colors directly to Q1 (Urgent & Important), Q2 (Important), Q3 (Urgent), and Q4 (Neither).</li>
                </ul>
              </div>
              <div><strong>• Google Calendar Native Color ID Integration:</strong>
                When pushing events to Google Calendar, ChronoFlow maps each task type to official Google Calendar event colors (e.g. Flamingo #11, Peacock #7, Grape #3, Tangerine #6, Blueberry #9, Basil #10, Graphite #8).
              </div>
              <div><strong>• In-Place Customization & Instant Feedback:</strong>
                Changing mapping mode or picking a new color swatch updates your timeline and Google Calendar rules immediately without closing or collapsing the settings card.
              </div>
            </div>
          </details>

          <!-- 10. Minimalist Settings Architecture, Name Tags & Tiered Mobile Navigation -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>10. Minimalist Settings Architecture, Name Tags & Tiered Mobile Navigation</span>
              <span class="settings-name-tag">Name Tag: Settings UX</span>
            </summary>
            <div class="help-content">
              <div><strong>• Quick Action Toolbars:</strong> Located at the top of each settings tab for instant one-click toggles: Light/Dark theme, Vietnamese/English switch, Focus Dimming on/off, Google Calendar connection, and Quick Data Export/Import.</div>
              <div><strong>• Clean Collapsible Cards with Name Tags:</strong> Deep customization sections (Color Palette, Focus Thresholds, 1440m Budget, OAuth credentials, Polling interval, JSON Backup) are neatly packaged into clean cards with explicit Name Tag badges, collapsed by default to keep the interface minimal and uncluttered.</div>
              <div><strong>• Smart State Preservation:</strong> Expanding a settings card and modifying its values keeps that card open smoothly without sudden re-collapsing or visual jumping.</div>
              <div><strong>• Tiered Mobile Experience:</strong> On mobile devices, the settings modal adopts an ergonomic 2-tiered structure with category cards and a clear back button, while ensuring the bottom navigation bar never obscures system settings.</div>
            </div>
          </details>

          <!-- 11. Google Calendar Two-Way Sync -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>11. Two-Way Google Calendar Synchronization (Push, Pull, Polling & Anti-Collision)</span>
              <span class="settings-name-tag">Name Tag: GCal Sync</span>
            </summary>
            <div class="help-content">
              <div><strong>• <span class="btn-badge">Sign In with Google</span> & <span class="btn-badge">Sign Out</span>:</strong> Authenticates directly with Google OAuth 2.0. All tokens are kept client-side.</div>
              <div><strong>• <span class="btn-badge">Push to Calendar</span> & <span class="btn-badge">Pull from Calendar</span>:</strong> Push synchronizes scheduled tasks with smart color mappings and appends metadata tags (<code>[ChronoFlow Task | ID:...]</code>). Pull extracts updates and cancellations from Google Calendar.</div>
              <div><strong>• Background Polling:</strong> Configurable periodic scanning (1m, 3m, 5m, 10m) automatically synchronizes changes while you work. Polling automatically pauses during active mouse, touch, or drag interactions to eliminate UI jitter.</div>
              <div><strong>• Foreign Event Ingestion:</strong> Any non-ChronoFlow event created on Google Calendar (e.g. invited meeting, doctor appointment) is automatically imported as a <strong>Transient Event</strong>, instantly shrinking free time and preserving timeline truth.</div>
            </div>
          </details>

          <!-- 12. Data Management & Backup -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>12. 100% Offline Data Backup, Restore & Clean-Slate Reset (5s Safety Timer)</span>
              <span class="settings-name-tag">Name Tag: Backup & Reset</span>
            </summary>
            <div class="help-content">
              <div><strong>• 100% LocalStorage Privacy:</strong> All tasks, events, notes, and custom color preferences remain completely within your browser.</div>
              <div><strong>• Mandatory 5-Second Confirmation Countdown:</strong> To prevent accidental clicks or data loss, all 3 buttons (Export, Import, Reset) open a confirmation dialog with an active 5-second safety timer before the confirmation button becomes active.</div>
              <div><strong>• <span class="btn-badge">Export Backup (.JSON)</span>:</strong> Generates a clean, timestamped JSON snapshot containing all tasks, fixed/transient events, recurring rules, and application settings.</div>
              <div><strong>• <span class="btn-badge">Restore from File</span>:</strong> Prompts with a 5s countdown and seamlessly imports backup files with automated backward-compatibility schema migration and integrity validation.</div>
              <div><strong>• <span class="btn-badge" style="color:#ef4444; border-color:#fca5a5;">Reset to Default Data</span> (Blank Slate Wipe):</strong> Prompts with a 5s countdown and <strong>completely wipes all data</strong> (all tasks, fixed/transient events, notes, goals, and noisy intervals) clean. The confirmation dialog always highlights a suggestion to download a backup file first before confirming.</div>
            </div>
          </details>

          <!-- 13. System Keyboard Shortcuts & Quick Action Hotkeys -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>13. System Keyboard Shortcuts & Quick Action Hotkeys (Productivity Speed Keys)</span>
              <span class="settings-name-tag">Name Tag: Shortcuts UX</span>
            </summary>
            <div class="help-content">
              <div><strong>• Keys <span class="btn-badge">1</span>, <span class="btn-badge">2</span>, <span class="btn-badge">3</span>, <span class="btn-badge">4</span> (Switch Main Tabs):</strong> Press <strong>1</strong> (Year), <strong>2</strong> (Month), <strong>3</strong> (Day Timeline), or <strong>4</strong> (Eisenhower Matrix) to switch views instantly.</div>
              <div><strong>• <span class="btn-badge">T</span> Key (Quick Add Task):</strong> Press <strong>T</strong> anywhere to instantly open the <em>Add Task Modal</em> for rapid Eisenhower backlog entry.</div>
              <div><strong>• <span class="btn-badge">G</span> &rarr; <span class="btn-badge">Y</span> Keys (Year Goal):</strong> Press <strong>G</strong> then <strong>Y</strong> to instantly open the <em>Year Goal Modal</em>.</div>
              <div><strong>• <span class="btn-badge">G</span> &rarr; <span class="btn-badge">M</span> Keys (Month Goal):</strong> Press <strong>G</strong> then <strong>M</strong> to instantly open the <em>Month Goal Modal</em>.</div>
              <div><strong>• <span class="btn-badge">G</span> &rarr; <span class="btn-badge">D</span> Keys (Daily Focus Goal):</strong> Press <strong>G</strong> then <strong>D</strong> to instantly open the <em>Daily Goal Modal</em>.</div>
              <div><strong>• <span class="btn-badge">E</span> Key (Event Selection Popup):</strong> Press <strong>E</strong> to open the <em>Event Type Choice Dialog</em>. From this popup, press <strong>F</strong> for Fixed Event or <strong>T</strong> for Transient Event.</div>
              <div><strong>• <span class="btn-badge">F</span> Key (Direct Fixed Event):</strong> Press <strong>F</strong> directly to open the <em>Add Fixed Event Modal</em>.</div>
              <div><strong>• <span class="btn-badge">E</span> &rarr; <span class="btn-badge">T</span> Key (Transient Event):</strong> Press <strong>E</strong> then <strong>T</strong> inside the event popup to open the <em>Add Transient Event Modal</em>.</div>
              <div><strong>• <span class="btn-badge">N</span> Key (Add Quick Note):</strong> Press <strong>N</strong> to open the <em>Add Calendar Note Modal</em> for sticky notes, project ideas, or meeting agendas.</div>
              <div><strong>• <span class="btn-badge">D</span> Key (Add Distraction Hours):</strong> Press <strong>D</strong> to open the <em>Add Distraction / Noisy Hours Modal</em> to mark noisy time slots on your timeline.</div>
              <div><strong>• <span class="btn-badge">S</span> Key (Open System Settings):</strong> Press <strong>S</strong> anywhere to instantly open the <em>System Settings Modal</em>.</div>
              <div><strong>• <span class="btn-badge">Ctrl + B</span> / <span class="btn-badge">Cmd + B</span> (Toggle Sidebar):</strong> Hide or show the left workspace navigation panel to maximize focused screen area.</div>
              <div><strong>• <span class="btn-badge">Esc</span> Key (Global Escape):</strong> Instantly close active modals, event choice dialogs, Chrome Settings overlay, or mobile drawer.</div>
              <div><strong>• Input Protection Guard Rules:</strong> All single-key hotkeys (<code>T</code>, <code>E</code>, <code>F</code>, <code>N</code>, <code>D</code>, <code>S</code>) trigger strictly when you are not typing in input fields (<code>&lt;input&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;select&gt;</code>, <code>contenteditable</code>) and when Settings or active Modals are closed.</div>
          <!-- 14. Mobile Interface Assistance, Quick Actions FAB & Touch Gestures -->
          <details class="help-accordion">
            <summary class="help-summary">
              <span>14. Mobile Interface Assistance, Quick Actions FAB & Touch Gestures</span>
              <span class="settings-name-tag">Name Tag: Mobile Assist</span>
            </summary>
            <div class="help-content">
              <div><strong>• Floating Action Button (FAB):</strong> A persistent floating quick-action launcher on mobile devices anchored right above the navigation bar. Positioned dynamically across screen zoom/scale factors using visual viewport metrics, and layered underneath the left navigation drawer to ensure a clean layout.</div>
              <div><strong>• Quick Actions Drawer:</strong> Tap the FAB (+) button on mobile to reveal a sleek popup action sheet featuring direct two-column Google Drive &amp; GCal sync toggles, followed by quick-add shortcuts for Eisenhower Tasks, Transient Events, Fixed Events, Calendar Notes, and One-Tap Auto-Match.</div>
              <div><strong>• Accessibility Settings ("Mobile Interface Assistance"):</strong> Located in <em>Settings &rarr; Display &amp; Appearance &rarr; Card 8: Hỗ trợ giao diện mobile</em>. You can enable or disable the mobile floating button and customize which shortcuts appear in the floating drawer. Changes strictly apply to mobile viewports without affecting desktop displays.</div>
              <div><strong>• Quick Touch Interactions:</strong>
                <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                  <li><strong>Day Column Quick Nav Tap:</strong> Tap any day header on the multi-day timeline on mobile to immediately switch focus to that day or view quick day stats.</li>
                  <li><strong>Timeline Hour Touch Guide:</strong> Tapping on timeline tracks displays a real-time touch summary banner highlighting the exact hour, available free minutes, and slot state.</li>
                </ul>
              </div>
            </div>
          </details>
        </div>

        <!-- Legal & Privacy Links -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 12.5px; font-weight: 700; color: var(--text-primary);">
            Legal & Privacy:
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="https://chronoflowonline.netlify.app/privacy" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 12px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Privacy Policy</span>
            </a>
            <a href="https://chronoflowonline.netlify.app/terms" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 12px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>Terms of Service</span>
            </a>
          </div>
        </div>
      </div>
    `;
  }

  // Tiếng Việt
  return `
    <!-- TÀI LIỆU HƯỚNG DẪN SỬ DỤNG TOÀN DIỆN (ACCORDION) -->
    <div class="settings-card help-doc-card" id="help-doc-section">
      <div class="settings-card-header">
        <div class="settings-card-title" style="display:flex; align-items:center; gap:8px;">
          <span>Tài Liệu Hướng Dẫn Sử Dụng Chi Tiết ChronoFlow</span>
        </div>
        <span class="smart-pill" style="background:#dbeafe; color:#1e40af; font-weight:700; font-size:11px;">
          Phiên bản 1.3.0 • Hướng dẫn toàn diện
        </span>
      </div>

      <div class="settings-card-desc">
        Cẩm nang hoàn chỉnh giúp bạn làm chủ mọi tính năng của ChronoFlow v1.3.0: Hỗ trợ giao diện mobile, Nút nổi nhanh (FAB), Thao tác chạm cảm ứng đa điểm, Quản lý Năng lượng, Ma trận Eisenhower, Lịch trình 24h Đa ngày (1, 3, 7 ngày), Chế độ Ánh xạ Màu thông minh, Vạch thời gian kính phát quang, Phục hồi tập trung, Đồng bộ Google Calendar 2 chiều, Giao diện Cài đặt Tối giản và An toàn dữ liệu.
      </div>

      <div class="help-accordion-group">
        <!-- 1. Tổng quan & Triết lý -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>1. Tổng Quan: Triết Lý Quản Lý Năng Lượng, Quỹ 1440 Phút & Phân Hoạch Giờ Rảnh</span>
            <span class="settings-name-tag">Name Tag: Energy & 1440m</span>
          </summary>
          <div class="help-content">
            <div><strong>• Quỹ thời gian 1440 phút cố định:</strong> Mỗi ngày bạn chỉ có đúng 1440 phút. ChronoFlow tính toán chính xác số phút bạn đã cam kết cho Việc cố định và Việc đột xuất, từ đó hiển thị chính xác Quỹ thời gian rảnh thực tế còn lại trong ngày.</div>
            <div><strong>• Quản lý Năng lượng (Attention) thay vì chỉ quản lý Thời gian:</strong> Quản lý thời gian truyền thống coi 1 giờ lúc 8h sáng ngang bằng 1 giờ lúc 14h trưa hay 23h đêm. ChronoFlow dựa trên nhịp sinh học não bộ (Circadian Rhythm), giúp bạn ghép các công việc tư duy sâu (Deep Work) vào khung giờ vàng có mức tập trung cao nhất, và đẩy việc nhẹ sang các khung giờ trũng năng lượng.</div>
            <div><strong>• Thuật toán phân hoạch giờ rảnh 24h:</strong> Hệ thống tự động quét 24 giờ trong ngày (00:00 - 24:00), trừ đi các Sự kiện cố định và Đột xuất, loại trừ các Giờ ồn (Noisy Hours) bạn đã cài đặt, và chia các khoảng rảnh thành Tập trung sâu (&ge; 30 phút, yên tĩnh) hoặc Làm việc nhẹ.</div>
            <div><strong>• Đồng bộ 2 chiều Google Calendar tức thì:</strong> Tích hợp Google OAuth 2.0 hoàn toàn trên Client-side. Task xếp lịch sẽ được đẩy lên Google Calendar kèm mã màu thông minh, và các sự kiện mới từ Google Calendar sẽ tự động kéo về làm Việc đột xuất để bảo toàn tính toàn vẹn của lịch trình.</div>
          </div>
        </details>

        <!-- 2. Quản lý Mục tiêu Năm/Tháng -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>2. Quản Lý Mục Tiêu Năm & Tháng (Tầm Nhìn Dài Hạn & Ghi Chú)</span>
            <span class="settings-name-tag">Name Tag: Goals & Notes</span>
          </summary>
          <div class="help-content">
            <div><strong>• Định hướng mục tiêu chiến lược:</strong> Nằm ở đầu trang làm việc, bảng Năm và Tháng giúp bạn luôn nhìn thấy bức tranh tổng thể và đảm bảo các công việc hàng ngày trong Ma trận Eisenhower đang phục vụ đúng các mục tiêu quan trọng nhất.</div>
            <div><strong>• Nút <span class="btn-badge">Sửa</span> & <span class="btn-badge">Lưu</span>:</strong> Nhấn nút Sửa để nhập mục tiêu trọng tâm trong năm hoặc KPI của tháng. Nhấn Lưu để lưu tức thì vào LocalStorage.</div>
            <div><strong>• Nút <span class="btn-badge">Thêm Note</span>:</strong> Tạo các ghi chú nhanh, checklist, ý tưởng hoặc biên bản cuộc họp gắn liền với tháng hoặc năm đang chọn.</div>
          </div>
        </details>

        <!-- 3. Ma trận Eisenhower & Quản lý Task -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>3. Ma Trận Eisenhower & Quản Lý Công Việc (Xếp Lịch Tự Động vs Thủ Công)</span>
            <span class="settings-name-tag">Name Tag: Eisenhower Matrix</span>
          </summary>
          <div class="help-content">
            <div><strong>• Ý nghĩa 4 ô Ma trận Eisenhower:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Q1 (Khẩn cấp & Quan trọng - Làm ngay):</strong> Sự cố hệ thống, deadline sát nút, khủng hoảng cần giải quyết lập tức.</li>
                <li><strong>Q2 (Quan trọng & Không khẩn cấp - Lên kế hoạch/Tập trung sâu):</strong> Học kỹ năng mới, thiết kế kiến trúc, chiến lược kinh doanh, thể dục.</li>
                <li><strong>Q3 (Khẩn cấp & Không quan trọng - Uỷ quyền/Xử lý nhanh):</strong> Trả lời email thường, họp giao ban, thủ tục giấy tờ.</li>
                <li><strong>Q4 (Không khẩn cấp & Không quan trọng - Cắt giảm/Dự phòng):</strong> Việc giải trí lướt web, công việc tồn đọng chưa cần thiết.</li>
              </ul>
            </div>
            <div><strong>• Nút điều khiển trên Task:</strong> Bấm <span class="btn-badge">Sửa</span> để mở Modal chỉnh sửa chi tiết; bấm <span class="btn-badge">Xóa</span> để xóa vĩnh viễn task.</div>
            <div><strong>• Các Checkbox thuộc tính:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Quan trọng & Khẩn cấp:</strong> Tự động xác định ô ma trận tương ứng (Q1, Q2, Q3, Q4).</li>
                <li><strong>Cần môi trường yên tĩnh:</strong> Khi tích chọn, thuật toán sẽ tuyệt đối không xếp task này vào các khung giờ ồn ào bạn đã thiết lập.</li>
              </ul>
            </div>
            <div><strong>• <span class="btn-badge">Chế độ xếp lịch</span> (Được ưu tiên hiển thị ở trên):</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Tự động xếp lịch (Mặc định):</strong> Hệ thống tự động khớp task vào khoảng rảnh tối ưu dựa trên điểm nhịp sinh học Circadian, Mức độ tập trung và Buổi ưu tiên.</li>
                <li><strong>Tùy chọn giờ (Thủ công):</strong> Hiển thị ô chọn <em>"Giờ bắt đầu"</em>. Khi lưu, task được xếp lịch ngay lập tức vào mốc giờ này (giờ kết thúc = giờ bắt đầu + thời lượng). Đồng thời, 2 mục <em>Khung giờ ưu tiên</em> và <em>Mức độ tập trung</em> sẽ tự động được làm mờ và vô hiệu hóa để tránh gây nhầm lẫn.</li>
              </ul>
            </div>
            <div><strong>• <span class="btn-badge">Mức độ tập trung</span> & <span class="btn-badge">Khung giờ ưu tiên</span>:</strong> Dành cho chế độ tự động để phân loại (<em>Tự động, Cao, Trung bình, Thấp, Bất kỳ</em>) và buổi trong ngày (<em>Sáng, Chiều, Tối, Bất kỳ</em>).</div>
            <div><strong>• Nút <span class="btn-badge">Xếp vào slot</span> & <span class="btn-badge">Tự động xếp hết lịch</span>:</strong> Nút "Xếp vào slot" xếp riêng lẻ từng việc; nút "Tự động xếp hết lịch" sẽ tối ưu hóa toàn bộ danh sách task trong ngày theo thứ tự ưu tiên Q1 &rarr; Q2 &rarr; Q3 &rarr; Q4.</div>
          </div>
        </details>

        <!-- 4. Thuật toán Xếp lịch theo Mức độ tập trung (Attention Engine) & Nhịp sinh học -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>4. Thuật Toán Attention Engine & Nhịp Sinh Học Não Bộ (Circadian Rhythm)</span>
            <span class="settings-name-tag">Name Tag: Attention Engine</span>
          </summary>
          <div class="help-content">
            <div><strong>• Ứng dụng đã có thuật toán xếp lịch theo Attention chưa?</strong>
              <p style="margin:4px 0 8px 0;"><strong>HOÀN TOÀN ĐÃ CÓ.</strong> ChronoFlow sở hữu động cơ tính toán <em>Attention & Energy Engine</em> độc quyền dựa trên khoa học nhịp sinh học não bộ (Circadian Rhythm & Cognitive Energy). Ứng dụng không chỉ xếp việc vào chỗ trống cơ học đơn thuần, mà hiểu rõ mức độ tập trung nhận thức của bạn thay đổi như thế nào trong 24 giờ.</p>
            </div>

            <div><strong>• Cơ chế hoạt động chi tiết của Thuật toán Attention:</strong>
              <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                <li><strong>1. Thang điểm Nhịp sinh học cơ bản (Circadian Base Score 0.0 &ndash; 2.0):</strong>
                  <ul style="margin:2px 0 4px 16px; list-style-type:circle;">
                    <li><em>06:00 &ndash; 11:00 (Base 2.0 - Đỉnh cao minh mẫn sáng):</em> Nồng độ dopamine & trí nhớ làm việc cao nhất. Thích hợp cho tư duy chiến lược, kiến trúc hệ thống và việc Q1/Q2.</li>
                    <li><em>11:00 &ndash; 13:30 (Base 0.5 - Trũng sinh học trưa):</em> Năng lượng giảm tự nhiên. Lý tưởng cho ăn trưa, ngủ ngắn (nap), thiền, hoặc việc nhẹ.</li>
                    <li><em>14:00 &ndash; 18:00 (Base 1.5 - Đỉnh cao tập trung chiều):</em> Khung giờ vàng thứ 2 để chạy nước rút dự án, code sprint, giải quyết việc hóc búa.</li>
                    <li><em>18:00 &ndash; 22:00 (Base 1.0 - Nhẹ nhàng buổi tối):</em> Đọc sách, tổng kết ngày, lên kế hoạch cho ngày mai.</li>
                    <li><em>22:00 &ndash; 06:00 (Base 0.0 - Nghỉ ngơi & Tái tạo):</em> Bảo vệ giấc ngủ và sức khỏe thể chất.</li>
                  </ul>
                </li>
                <li><strong>2. Điểm Mệt mỏi Tích lũy (Fatigue Accumulation):</strong> Làm việc nặng liên tục làm hao mòn năng lượng ý chí. Mỗi task có Attention Cao hoàn thành sẽ cộng <strong>+0.5 Fatigue Score</strong>; việc Trung bình cộng <strong>+0.2 Fatigue Score</strong>.</li>
                <li><strong>3. Reset Phục Hồi Năng Lượng (Energy Recovery Reset):</strong> Khi timeline đi qua một Lịch cố định có đánh dấu <em>"Sự kiện phục hồi năng lượng"</em> (Ngủ trưa, Tập thể dục, Thiền, Đi bộ...), <strong>Fatigue Score lập tức được Reset về 0.0</strong>, đưa các khoảng rảnh tiếp theo phục hồi trọn vẹn về mức năng lượng đỉnh cao 1.5 &ndash; 2.0!</li>
                <li><strong>4. Công thức Điểm Attention Thực tế:</strong> <code>Điểm thực tế = Math.max(0, BaseScore - FatigueScore)</code>.</li>
                <li><strong>5. Thuật toán Chấm điểm Khớp lịch Đa yếu tố:</strong>
                  Khi chọn slot rảnh, hệ thống kết hợp đồng thời: <em>(Buổi ưu tiên + Điểm thưởng ưu tiên đầu buổi) + (Mức độ phù hợp năng lượng Attention) + (Kiểm tra môi trường Yên tĩnh / Giờ ồn) + (Trọng số Ma trận Eisenhower)</em>.
                </li>
              </ul>
            </div>

            <div><strong>• Thuật toán có hoạt động hiệu quả không?</strong>
              <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                <li><strong>Chống kiệt sức (Burnout Prevention):</strong> Triệt tiêu hoàn toàn tình trạng bị xếp việc phân tích nặng vào lúc 13h trưa hay sau nhiều giờ làm việc kiệt sức mà chưa nghỉ ngơi.</li>
                <li><strong>Bảo vệ khung giờ Deep Work:</strong> Đảm bảo công việc Q1/Q2 tối quan trọng luôn chiếm trọn các slot rảnh xanh lá (&ge;30 phút) yên tĩnh với năng lượng cao nhất.</li>
                <li><strong>Tận dụng tối đa thời gian chết:</strong> Tự động đẩy các việc vặt Q3/Q4 (trả lời thư, dọn dẹp) vào các khoảng ngắn hoặc khung giờ ồn ào, giải phóng 2-3 giờ làm việc sâu mỗi ngày.</li>
              </ul>
            </div>

            <div><strong>• Hướng dẫn 4 bước sử dụng thuật toán Attention để xếp lịch tối ưu:</strong>
              <ol style="margin:4px 0 0 16px; padding:0; list-style-type:decimal;">
                <li><strong>Bước 1 (Gán sự kiện phục hồi):</strong> Tạo hoặc sửa các Việc cố định (ví dụ Ngủ trưa 12:30-13:15, Tập gym 17:30-18:30) và tích chọn ô <em>"Sự kiện phục hồi năng lượng"</em>.</li>
                <li><strong>Bước 2 (Chọn mức Attention cho Task):</strong> Trong Modal tạo/sửa Task, chọn Mức độ tập trung: <em>Cao</em> (tư duy nặng), <em>Trung bình</em>, <em>Thấp</em> (thủ tục/email) hoặc <em>Tự động</em> (hệ thống tự suy luận từ Eisenhower).</li>
                <li><strong>Bước 3 (Chọn Buổi & Yêu cầu yên tĩnh):</strong> Chọn Khung giờ ưu tiên (<em>Sáng / Chiều / Tối / Bất kỳ</em>) và tích <em>"Cần môi trường yên tĩnh"</em> nếu không muốn làm ở khung giờ ồn.</li>
                <li><strong>Bước 4 (Kích hoạt Tự động xếp lịch):</strong> Bấm nút <em>"Xếp vào slot"</em> trên từng task hoặc bấm nút <em>"Tự Động Xếp Hết Lịch"</em> trên thanh công cụ Ma trận Eisenhower / Timeline. ChronoFlow sẽ tự động phân bổ và tối ưu hóa toàn bộ lịch trình trong ngày!</li>
              </ol>
            </div>
          </div>
        </details>

        <!-- 5. Phân loại theo buổi & Ưu tiên đầu buổi -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>5. Phân Loại Công Việc Theo Buổi (Sáng / Chiều / Tối) & Tự Động Ưu Tiên Đầu Buổi</span>
            <span class="settings-name-tag">Name Tag: Session Priority</span>
          </summary>
          <div class="help-content">
            <div><strong>• Các tùy chọn khung giờ / Buổi ưu tiên:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Buổi sáng:</strong> Khung giờ từ 06:00 đến 12:00.</li>
                <li><strong>Buổi chiều:</strong> Khung giờ từ 12:00 đến 18:00.</li>
                <li><strong>Buổi tối:</strong> Khung giờ từ 18:00 đến 23:00.</li>
                <li><strong>Bất kỳ:</strong> Tự động sắp xếp linh hoạt toàn bộ quỹ thời gian 24h.</li>
              </ul>
            </div>
            <div><strong>• Tự động xếp vào đầu buổi (Early-Session Placement):</strong> Thuật toán tính toán chỉ số ưu tiên đầu buổi. Những việc được phân loại vào một buổi cụ thể có mức độ tập trung cao hoặc quan trọng sẽ tự động được xếp vào **vị trí đầu buổi đó** (ví dụ 07:00 cho Buổi sáng, 14:00 cho Buổi chiều, 18:00 cho Buổi tối).</div>
            <div><strong>• Cơ chế Fallback an toàn:</strong> Nếu buổi bạn chọn bị kín lịch bởi các Việc cố định, ChronoFlow sẽ tự động chuyển sang khoảng rảnh tối ưu tiếp theo mà không gây lỗi xếp lịch.</div>
          </div>
        </details>

        <!-- 6. Lịch trình 24h Đa Ngày, Vạch Laser & Phục hồi năng lượng -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>6. Lịch Trình 24h Đa Ngày (1, 3, 7 Ngày), Vạch Kính Phát Quang & Phục Hồi Năng Lượng</span>
            <span class="settings-name-tag">Name Tag: 24h Timeline</span>
          </summary>
          <div class="help-content">
            <div><strong>• Chế độ hiển thị Đa Ngày (1, 3, 7 Ngày):</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Chế độ 1 Ngày:</strong> Lịch trình 24h siêu tối giản, tập trung tuyệt đối. Tích hợp thanh Ghi chú ngày ở góc phải thanh công cụ.</li>
                <li><strong>Chế độ 3 Ngày & 7 Ngày (Tuần):</strong> Giao diện phân cột trực quan theo phong cách Google Calendar. Nhấp đúp vào tiêu đề bất kỳ ngày nào để chuyển ngay sang ngày đó. Ở chế độ 7 ngày, tiêu đề sự kiện tự động xuống dòng đến 3 dòng kèm thuật toán chống đè thẻ tag tên.</li>
                <li><strong>Nút chuyển chu kỳ (1N / 3N / 7N):</strong> Bấm vào nút chuyển đổi bên cạnh mũi tên điều hướng để luân phiên 1 &rarr; 3 &rarr; 7 ngày nhanh chóng.</li>
              </ul>
            </div>
            <div><strong>• Vạch thời gian hiện tại kính phát quang (Laser Time Beam):</strong> Vạch chỉ thị giờ thực tế luôn nổi bật ở lớp trên cùng (<span class="btn-badge">z-index: 25</span>) với hiệu ứng kính phát quang đỏ/cam sang trọng, cho phép click xuyên thấu (<code>pointer-events: none</code>) để tương tác trơn tru với các khối công việc bên dưới.</div>
            <div><strong>• Đường kẻ chia mốc 30 phút tinh tế:</strong> Nét đứt mảnh bán trong suốt đánh dấu chính xác từng mốc nửa giờ, hiển thị rõ ràng khi quan sát mà không làm rối mắt hay che khuất nội dung văn bản.</div>
            <div><strong>• Ý nghĩa bảng màu khoảng rảnh:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:none;">
                <li><span class="help-color-indicator" style="background:#10b981;"></span><strong>Xanh lục (Tập trung sâu / Deep Focus):</strong> Khoảng rảnh &ge; 30 phút, yên tĩnh, điểm năng lượng cao (1.5 - 2.0). Dành cho Q1/Q2.</li>
                <li><span class="help-color-indicator" style="background:#3b82f6;"></span><strong>Xanh lam (Tập trung mức vừa):</strong> Khung giờ có năng lượng ổn định.</li>
                <li><span class="help-color-indicator" style="background:#f59e0b;"></span><strong>Vàng (Làm việc nhẹ / Trũng năng lượng trưa):</strong> Khoảng rảnh ngắn &lt; 30 phút hoặc khung giờ trưa (11:00-13:30). Thích hợp cho Q3/Q4.</li>
                <li><span class="help-color-indicator" style="background:#f97316;"></span><strong>Cam (Giờ ồn):</strong> Khung giờ trùng với Giờ ồn (quán cafe, di chuyển...).</li>
              </ul>
            </div>
            <div><strong>• Việc cố định vs. Việc đột xuất:</strong> Việc cố định đại diện cho cam kết lặp lại (cuộc họp, giờ làm, giờ ngủ). Việc đột xuất đại diện cho phát sinh bất ngờ hoặc sự kiện kéo về từ Google Calendar.</div>
            <div><strong>• ĐẶC BIỆT: Checkbox [Sự kiện phục hồi năng lượng]:</strong> Khi tạo/sửa Việc cố định (Ngủ trưa, Yoga, Đi bộ, Thiền, Gym...), tích chọn ô này. Ngay khi sự kiện kết thúc, ChronoFlow sẽ <strong>RESET điểm cạn kiệt (Fatigue Score) về 0.0</strong>, giúp các khung giờ phía sau phục hồi hoàn toàn về mức năng lượng đỉnh (1.5 - 2.0)!</div>
            <div><strong>• Thanh tiện ích đáy màn hình (Bottom Toolbar):</strong> Bố trí hợp lý các nút: Số liệu Năng suất, Bật/Tắt Chế độ Focus, và Bảng chú thích màu sắc.</div>
            <div><strong>• Kéo thả (Drag & Drop) & Tương tác trực tiếp:</strong> Bạn có thể dùng chuột kéo thả bất kỳ khối công việc nào trên Timeline để dời giờ bắt đầu/kết thúc (tự động hít vào lưới 15 phút). Nhấp vào bất kỳ sự kiện nào để chỉnh sửa hoặc xóa nhanh.</div>
          </div>
        </details>

        <!-- 7. Báo cáo số liệu năng suất & Tương phản WCAG AAA -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>7. Báo Cáo Số Liệu Năng Suất (Productivity Statistics) & Chuẩn Tương Phản Tối Ưu (WCAG AAA)</span>
            <span class="settings-name-tag">Name Tag: Analytics</span>
          </summary>
          <div class="help-content">
            <div><strong>• Hộp thoại phân tích thông minh:</strong> Bấm nút <strong>"Số liệu Năng suất"</strong> ở thanh tiện ích đáy để mở giao diện tổng quan phân tích hiệu suất làm việc trong ngày.</div>
            <div><strong>• Các thông số quan trọng:</strong>
              <ul style="margin:4px 0 0 16px; padding:0; list-style-type:disc;">
                <li><strong>Tỷ lệ tập trung (Focus Rate %):</strong> Phần trăm quỹ thời gian rảnh được phân bổ cho Deep Focus so với công việc nhẹ.</li>
                <li><strong>Giờ Tập trung sâu vs Làm việc nhẹ:</strong> Tổng số giờ thuộc khoảng rảnh dài (&ge; 30m) so với khoảng xao nhãng/ồn ào.</li>
                <li><strong>Tỷ lệ hoàn thành & Xếp lịch:</strong> Tỷ lệ phần trăm task đã hoàn thành và tỷ lệ backlog Eisenhower đã được đưa lên lịch.</li>
                <li><strong>Phân bố Ma trận Eisenhower (Q1-Q4):</strong> Số lượng công việc chi tiết phân bố theo 4 ô mức độ quan trọng & khẩn cấp.</li>
                <li><strong>Gợi ý Tối ưu hóa:</strong> Phân tích thông minh cảnh báo khi lịch trình quá tải Q1 hoặc thiếu nghỉ ngơi.</li>
              </ul>
            </div>
            <div><strong>• Thiết kế tối ưu tương phản WCAG 2.1 AAA:</strong> Toàn bộ giao diện số liệu được chuẩn hóa biến CSS theo theme, đảm bảo tỷ lệ tương phản chữ trên nền luôn vượt **7.0:1** ở cả chế độ Sáng và Tối (Dark Mode), triệt tiêu hoàn toàn mảng trắng chói.</div>
          </div>
        </details>

        <!-- 8. Tùy biến giao diện, Cỡ chữ hệ thống & Chế độ Focus -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>8. Tùy Biến Giao Diện, Cỡ Chữ Hệ Thống & Chế Độ Focus Làm Mờ</span>
            <span class="settings-name-tag">Name Tag: Appearance</span>
          </summary>
          <div class="help-content">
            <div><strong>• Điều chỉnh cỡ chữ toàn hệ thống (80% - 130%):</strong> Tùy biến kích thước hiển thị toàn bộ ứng dụng trong Cài đặt &rarr; Giao diện. Có sẵn 4 mức nhanh (85%, 100%, 115%, 130%) và thanh trượt mượt mà kèm hộp xem trước trực tiếp.</div>
            <div><strong>• Chế độ Tập trung (Focus Mode) & Tùy chỉnh độ mờ:</strong> Bật chế độ Focus (<span class="btn-badge">Tập trung: Bật</span>) để làm mờ các sự kiện không diễn ra, đưa sự chú ý vào công việc hiện tại. Độ mờ có thể tinh chỉnh từ 2px đến 10px trong Cài đặt. Rê chuột vào thẻ sự kiện bất kỳ để làm rõ ngay lập tức.</div>
            <div><strong>• Giao diện nút bấm chuẩn hóa:</strong> Loại bỏ các dấu + thừa, chuẩn hóa kích thước các nút điều hướng 36px cân đối, hỗ trợ đầy đủ phím tắt và thao tác trực quan.</div>
          </div>
        </details>

        <!-- 9. Tùy chọn Bảng màu & Ánh xạ Mã màu Google Calendar (Attention vs Eisenhower) -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>9. Tùy Chọn Bảng Màu Kép & Ánh Xạ Màu Google Calendar (Chế độ Tập trung vs. Ma trận Eisenhower)</span>
            <span class="settings-name-tag">Name Tag: Color Mapping</span>
          </summary>
          <div class="help-content">
            <div><strong>• Chuyển đổi linh hoạt 2 chế độ màu (Attention vs. Eisenhower Matrix):</strong>
              <p style="margin:4px 0 8px 0;">Trong Cài đặt &rarr; Giao diện & Hiển thị hoặc Cài đặt &rarr; Tài khoản & Đồng bộ, bạn có thể chuyển đổi quy tắc màu của 4 mục đầu tiên:</p>
              <ul style="margin:2px 0 6px 16px; padding:0; list-style-type:disc;">
                <li><strong>Chế độ Mức độ tập trung (Mặc định):</strong> Gán mã màu chuyên biệt cho việc Tập trung Cao, Trung bình, Thấp và Tự động.</li>
                <li><strong>Chế độ Ma trận Eisenhower:</strong> Gán mã màu trực tiếp theo 4 ô ma trận Q1 (Khẩn cấp & Quan trọng), Q2 (Quan trọng), Q3 (Khẩn cấp), và Q4 (Không khẩn / Không quan trọng).</li>
              </ul>
            </div>
            <div><strong>• Ánh xạ màu chuẩn Google Calendar Event Colors:</strong>
              Khi đẩy task lên Google Calendar, hệ thống sẽ tự động gán mã màu sự kiện tương ứng của Google (Đỏ hồng Flamingo, Xanh công Peacock, Tím Grape, Cam Tangerine, Xanh dương Blueberry, Xanh lá Basil, Xám chì Graphite...).
            </div>
            <div><strong>• Tinh chỉnh tại chỗ & Trực quan:</strong>
              Mọi thay đổi màu sắc được cập nhật ngay lập tức trên Timeline và cấu hình Google Calendar mà không làm nhảy hay tự động đóng thẻ cài đặt.
            </div>
          </div>
        </details>

        <!-- 10. Cấu trúc Cài đặt Tối giản, Name Tag & Điều hướng Mobile -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>10. Cấu Trúc Cài Đặt Tối Giản, Thẻ Thu Gọn Name Tag & Điều Hướng Mobile Phân Cấp</span>
            <span class="settings-name-tag">Name Tag: Settings UX</span>
          </summary>
          <div class="help-content">
            <div><strong>• Thanh thao tác nhanh (Quick Action Toolbar):</strong> Nằm ở đầu mỗi tab cài đặt giúp bạn bật/tắt nhanh: Giao diện Sáng/Tối, Ngôn ngữ Tiếng Việt/English, Chế độ làm mờ Focus Dimming, Kết nối Google Calendar và Xuất/Nhập dữ liệu nhanh.</div>
            <div><strong>• Thiết kế thẻ thu gọn kèm Name Tag:</strong> Các khối tùy chỉnh sâu (Bảng màu, Ngưỡng tập trung, Quỹ 1440m, Thông số OAuth 2.0, Tần số quét, Sao lưu JSON) được đóng gói thành các thẻ gọn gàng có nhãn Name Tag rõ ràng, mặc định ở trạng thái ẩn để giữ giao diện tối giản, thanh thoát. Bấm vào tiêu đề/name tag để mở rộng khi cần.</div>
            <div><strong>• Cơ chế ghi nhớ trạng thái thẻ đang mở:</strong> Khi bạn đang mở một thẻ và thao tác đổi giá trị, thẻ đó sẽ được giữ nguyên trạng thái mở mà không bị giật lag hay tự động thu nhỏ lại.</div>
            <div><strong>• Giao diện Mobile 2 tầng trực quan:</strong> Trên điện thoại, modal Cài đặt hiển thị menu phân cấp rõ ràng kèm nút Quay lại (Back), và thanh điều hướng đáy được tối ưu để không che khuất nút Cài đặt.</div>
          </div>
        </details>

        <!-- 11. Đồng bộ Google Calendar 2 chiều -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>11. Đồng Bộ Google Calendar 2 Chiều (Push, Pull, Quét Tự Động & Chống Xung Đột)</span>
            <span class="settings-name-tag">Name Tag: GCal Sync</span>
          </summary>
          <div class="help-content">
            <div><strong>• Nút <span class="btn-badge">Đăng nhập với Google</span> & <span class="btn-badge">Đăng xuất</span>:</strong> Xác thực trực tiếp qua Google OAuth 2.0. Toàn bộ token được bảo mật trên máy bạn.</div>
            <div><strong>• Nút <span class="btn-badge">Đẩy lên Calendar</span> & <span class="btn-badge">Kéo từ Calendar</span>:</strong> Đẩy các task đã xếp lịch lên Google Calendar kèm mã màu thông minh và thẻ tag nhận diện (<code>[ChronoFlow Task | ID:...]</code>). Kéo các sự kiện đã sửa hoặc xóa từ Google Calendar về máy.</div>
            <div><strong>• Quét tự động dưới nền (Background Polling):</strong> Tự động đồng bộ định kỳ theo tần số thiết lập (1p, 3p, 5p, 10p). Hệ thống tự động tạm dừng đồng bộ khi bạn đang rê chuột hoặc kéo thả sự kiện để tránh giật giao diện.</div>
            <div><strong>• Tự động biến sự kiện ngoài thành Việc đột xuất:</strong> Mọi cuộc họp hay lịch hẹn mới tạo trên Google Calendar (từ đồng nghiệp, đối tác) sẽ được tự động nạp về làm <strong>Việc đột xuất (Transient Event)</strong>, ngay lập tức trừ bớt giờ rảnh và bảo toàn tính toàn vẹn của dòng thời gian.</div>
          </div>
        </details>

        <!-- 12. Quản lý dữ liệu & Sao lưu -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>12. Quản Lý Dữ Liệu Offline 100%, Sao Lưu & Xóa Trắng Khôi Phục (Đếm Ngược 5s An Toàn)</span>
            <span class="settings-name-tag">Name Tag: Backup & Reset</span>
          </summary>
          <div class="help-content">
            <div><strong>• Lưu trữ Offline 100% (LocalStorage):</strong> Dữ liệu của bạn được lưu an toàn trên trình duyệt, không cần máy chủ trung gian, hoạt động mượt mà ngay cả khi không có mạng Internet.</div>
            <div><strong>• Khóa đếm ngược an toàn 5 giây bắt buộc:</strong> Để chống bấm nhầm làm mất dữ liệu, cả 3 nút (Sao lưu, Khôi phục, Xóa trắng) đều mở hộp thoại xác nhận có đếm ngược 5 giây trước khi nút hành động được kích hoạt.</div>
            <div><strong>• Nút <span class="btn-badge">Sao Lưu File (.JSON)</span>:</strong> Tải về file sao lưu định dạng JSON có gắn mốc thời gian, lưu giữ toàn bộ task, sự kiện cố định/đột xuất, cài đặt màu sắc và nhịp sinh học.</div>
            <div><strong>• Nút <span class="btn-badge">Khôi Phục từ File</span>:</strong> Mở hộp thoại đếm ngược 5s và nạp lại dữ liệu sao lưu cũ với thuật toán tự động nâng cấp cấu trúc dữ liệu tương thích ngược.</div>
            <div><strong>• Nút <span class="btn-badge" style="color:#ef4444; border-color:#fca5a5;">Xóa Trắng & Khôi Phục Dữ Liệu Mẫu</span>:</strong> Mở hộp thoại đếm ngược 5s và <strong>xóa sạch toàn bộ dữ liệu</strong> cá nhân. Hộp thoại luôn nhắc nhở bạn sao lưu dữ liệu trước khi xóa.</div>
          </div>
        </details>

        <!-- 13. Phím Tắt Hệ Thống & Thao Tác Tốc Độ -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>13. Phím Tắt Hệ Thống & Thao Tác Tốc Độ (System Keyboard Shortcuts)</span>
            <span class="settings-name-tag">Name Tag: Shortcuts UX</span>
          </summary>
          <div class="help-content">
            <div><strong>• Phím <span class="btn-badge">1</span>, <span class="btn-badge">2</span>, <span class="btn-badge">3</span>, <span class="btn-badge">4</span> (Chuyển 4 Tab Chính):</strong> Nhấn phím <strong>1</strong> (Năm), <strong>2</strong> (Tháng), <strong>3</strong> (Ngày), hoặc <strong>4</strong> (Ma Trận Eisenhower) để chuyển đổi tức thì giữa các giao diện chính.</div>
            <div><strong>• Phím <span class="btn-badge">T</span> (Thêm Task Nhanh):</strong> Nhấn phím <strong>T</strong> ở bất kỳ vị trí nào để mở ngay Form tạo <em>Công Việc (Task)</em> mới.</div>
            <div><strong>• Phím <span class="btn-badge">G</span> &rarr; <span class="btn-badge">Y</span> (Mục Tiêu Năm):</strong> Nhấn phím <strong>G</strong> rồi nhấn phím <strong>Y</strong> để mở ngay <em>Mục Tiêu Năm (Year Goal)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">G</span> &rarr; <span class="btn-badge">M</span> (Mục Tiêu Tháng):</strong> Nhấn phím <strong>G</strong> rồi nhấn phím <strong>M</strong> để mở ngay <em>Mục Tiêu Tháng (Month Goal)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">G</span> &rarr; <span class="btn-badge">D</span> (Mục Tiêu Ngày):</strong> Nhấn phím <strong>G</strong> rồi nhấn phím <strong>D</strong> để mở ngay <em>Mục Tiêu Ngày (Daily Focus Goal)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">E</span> (Popup Chọn Loại Sự Kiện):</strong> Nhấn phím <strong>E</strong> để mở nhanh hộp thoại chọn loại sự kiện. Từ hộp thoại này, nhấn phím <strong>F</strong> để chọn Cố Định hoặc phím <strong>T</strong> để chọn Đột Xuất.</div>
            <div><strong>• Phím <span class="btn-badge">F</span> (Thêm Sự Kiện Cố Định):</strong> Nhấn trực tiếp phím <strong>F</strong> để mở Form tạo <em>Lịch Cố Định (Fixed Event)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">E</span> &rarr; <span class="btn-badge">T</span> (Thêm Sự Kiện Đột Xuất):</strong> Nhấn phím <strong>E</strong> rồi nhấn phím <strong>T</strong> trong popup để mở Form tạo <em>Lịch Đột Xuất (Transient Event)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">N</span> (Thêm Ghi Chú Nhanh):</strong> Nhấn phím <strong>N</strong> để mở Form tạo <em>Ghi Chú Lịch (Note/Checklist)</em> gắn liền với tháng/năm.</div>
            <div><strong>• Phím <span class="btn-badge">D</span> (Thêm Khung Giờ Bị Làm Phiền):</strong> Nhấn phím <strong>D</strong> để mở Form tạo <em>Khung Giờ Bị Làm Phiền / Ồn Ào (Distraction Hours)</em> trên timeline.</div>
            <div><strong>• Phím <span class="btn-badge">S</span> (Mở Cài Đặt Hệ Thống):</strong> Nhấn phím <strong>S</strong> ở bất kỳ vị trí nào để mở ngay <em>Cửa Sổ Cài Đặt Hệ Thống (Settings)</em>.</div>
            <div><strong>• Phím <span class="btn-badge">Ctrl + B</span> / <span class="btn-badge">Cmd + B</span> (Ẩn/Hiện Sidebar):</strong> Bật/Tắt nhanh thanh điều hướng danh mục bên trái để tối ưu diện tích hiển thị.</div>
            <div><strong>• Phím <span class="btn-badge">Esc</span> (Đóng & Thoát Nhanh):</strong> Tắt tức thì các Popup, Modal, Cửa sổ Cài đặt Chrome Settings Window hoặc Menu drawer trên thiết bị di động.</div>
            <div><strong>• Bộ lọc bảo vệ chống gõ nhầm (Guard Rules):</strong> Tất cả các phím tắt chữ đơn (<code>T</code>, <code>E</code>, <code>F</code>, <code>N</code>, <code>D</code>, <code>S</code>) chỉ kích hoạt khi bạn KHÔNG gõ chữ trong các ô nhập liệu (<code>&lt;input&gt;</code>, <code>&lt;textarea&gt;</code>, <code>&lt;select&gt;</code>, <code>contenteditable</code>) và KHÔNG đang mở Cài đặt hay Modal khác.</div>
          </div>
        </details>

        <!-- 14. Hỗ Trợ Giao Diện Mobile, Nút Nổi Nhanh (FAB) & Thao Tác Cảm Ứng -->
        <details class="help-accordion">
          <summary class="help-summary">
            <span>14. Hỗ Trợ Giao Diện Mobile, Nút Nổi Nhanh (FAB) & Thao Tác Cảm Ứng</span>
            <span class="settings-name-tag">Name Tag: Hỗ Trợ Mobile</span>
          </summary>
          <div class="help-content">
            <div><strong>• Nút Nổi Thao Tác Nhanh (FAB):</strong> Nút nổi đa năng trên giao diện di động, tự động ghim vị trí ngay phía trên nút Cài đặt của thanh điều hướng dưới cùng. Tích hợp thuật toán tính toán tọa độ theo <code>visualViewport</code> thích ứng mượt mà với mọi mức zoom/scale, đồng thời nằm phía sau thanh menu bên trái (sidebar drawer) khi mở ra.</div>
            <div><strong>• Menu Tác Vụ Nhanh:</strong> Chạm vào nút (+) để mở bảng chọn tiện ích gồm hàng đôi đồng bộ Google Drive &amp; Google Calendar (GDrive ⇄ GCal), cùng các nút tạo nhanh Việc cần làm (Eisenhower), Lịch đột xuất, Lịch cố định, Ghi chú ngày và Tự động xếp lịch (Auto-Match).</div>
            <div><strong>• Cài Đặt Trợ Năng "Hỗ Trợ Giao Diện Mobile":</strong> Nằm tại <em>Cài đặt &rarr; Giao diện &amp; Hiển thị &rarr; Thẻ 8: Hỗ trợ giao diện mobile</em>. Cho phép bật/tắt toàn bộ nút nổi và tùy biến thêm/bớt từng phím tắt theo nhu cầu cá nhân. Khi bật hoặc tắt chỉ tác động đến giao diện mobile, hoàn toàn không ảnh hưởng máy tính.</div>
            <div><strong>• Thao Tác Chạm Tối Ưu Cho Mobile:</strong>
              <ul style="margin:4px 0 8px 16px; padding:0; list-style-type:disc;">
                <li><strong>Chạm tiêu đề cột ngày:</strong> Chạm vào tiêu đề ngày trong dòng thời gian đa ngày để chuyển nhanh ngày tiêu điểm và xem thống kê tiến độ.</li>
                <li><strong>Khám phá khung giờ timeline bằng cảm ứng:</strong> Chạm trực tiếp vào các rãnh giờ để hiển thị thanh tóm tắt thông minh về giờ bắt đầu, số phút trống và trạng thái khối thời gian.</li>
              </ul>
            </div>
          </div>
        </details>

        <!-- Pháp lý & Quyền riêng tư -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border-color); display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="font-size: 12.5px; font-weight: 700; color: var(--text-primary);">
            Pháp lý & Quyền riêng tư:
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <a href="https://chronoflowonline.netlify.app/privacy" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 12px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>Chính sách bảo mật</span>
            </a>
            <a href="https://chronoflowonline.netlify.app/terms" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size: 12px; padding: 6px 14px; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              <span>Điều khoản sử dụng</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderAttentionGuideSection() {
  const isEn = appState.settings.lang === 'en';

  if (isEn) {
    return `
      <!-- ATTENTION & ENERGY MANAGEMENT GUIDE CARD -->
      <div class="settings-card ${getCardCollapseClass('attention-guide-card')}" id="attention-guide-card">
        <div class="settings-card-header" onclick="toggleSettingsCard('attention-guide-card')">
          <div class="settings-card-title-group">
            <div class="settings-card-title">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <span>Cognitive Attention & Energy Management Engine</span>
            </div>
          </div>
          <div class="settings-card-actions">
            <span class="settings-name-tag">Name Tag: Attention Engine</span>
            <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>

        <div class="settings-card-body">
          <div class="settings-guide-notice">
            ChronoFlow integrates an intelligent Attention & Energy Engine that aligns tasks with your natural biological focus curve (Circadian Rhythm) and prevents mental burnout through dynamic fatigue depletion and recovery resets.
          </div>

        <!-- Section 1: What is Attention? -->
        <div class="attention-hero-intro">
          <div class="attention-hero-title">
            <span>1. What is Attention & Energy Management?</span>
          </div>
          <div class="attention-hero-desc">
            Traditional time management assumes every hour of the day has equal productive capacity. In reality, human cognitive energy is finite and fluctuations follow biological circadian rhythms. <strong>Attention Management</strong> focuses on scheduling high-leverage, complex tasks (Deep Work) during peak mental clarity windows, while routing lighter tasks to energy dips—unlocking 3-5x higher output without mental exhaustion.
          </div>
        </div>

        <!-- Section 2: How It Works in ChronoFlow -->
        <div>
          <div style="font-size:14px; font-weight:700; color:#0f172a; margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span>2. How ChronoFlow Attention Engine Works</span>
          </div>

          <!-- Circadian Base Score Grid -->
          <div class="attention-circadian-grid">
            <div class="circadian-pill-card peak">
              <div class="circadian-time-badge">
                <span>06:00 - 11:00</span>
                <span class="circadian-score-tag score-tag-peak">Base 2.0</span>
              </div>
              <div class="circadian-label">Morning Peak Focus</div>
              <div class="circadian-note">Peak dopamine & clarity. Ideal for strategic planning, architecture & Q1/Q2 tasks.</div>
            </div>

            <div class="circadian-pill-card dip">
              <div class="circadian-time-badge">
                <span>11:00 - 13:30</span>
                <span class="circadian-score-tag score-tag-dip">Base 0.5</span>
              </div>
              <div class="circadian-label">Post-Lunch Biological Dip</div>
              <div class="circadian-note">Natural energy trough. Ideal for lunch, power nap, meditation, or shallow tasks.</div>
            </div>

            <div class="circadian-pill-card sub-peak">
              <div class="circadian-time-badge">
                <span>14:00 - 18:00</span>
                <span class="circadian-score-tag score-tag-sub">Base 1.5</span>
              </div>
              <div class="circadian-label">Afternoon Second Peak</div>
              <div class="circadian-note">Strong execution window for coding, writing, debugging, and focused sprints.</div>
            </div>

            <div class="circadian-pill-card evening">
              <div class="circadian-time-badge">
                <span>18:00 - 22:00</span>
                <span class="circadian-score-tag score-tag-evening">Base 1.0</span>
              </div>
              <div class="circadian-label">Evening Gentle Focus</div>
              <div class="circadian-note">Light review, reading, journaling, and daily retrospective.</div>
            </div>

            <div class="circadian-pill-card rest">
              <div class="circadian-time-badge">
                <span>22:00 - 06:00</span>
                <span class="circadian-score-tag score-tag-rest">Base 0.0</span>
              </div>
              <div class="circadian-label">Night Sleep & Recovery</div>
              <div class="circadian-note">Restorative sleep, brain detoxification and physical regeneration.</div>
            </div>
          </div>

          <!-- Rules Grid -->
          <div class="attention-rules-grid" style="margin-top:12px;">
            <div class="attention-rule-card">
              <div class="attention-rule-title">
                <span>Dynamic Fatigue Depletion</span>
              </div>
              <div class="attention-rule-body">
                Executing demanding tasks depletes willpower and mental stamina. High Attention tasks add <strong>+0.5 Fatigue Score</strong> upon completion; Medium Attention tasks add <strong>+0.2 Fatigue Score</strong>.
              </div>
            </div>

            <div class="attention-rule-card">
              <div class="attention-rule-title">
                <span>Energy Recovery Reset (isRecovery)</span>
              </div>
              <div class="attention-rule-body">
                Whenever the timeline encounters a Fixed Event marked with <strong>isRecovery = true</strong> (e.g. Nap, Meditation, Yoga, Gym, Walk), the <strong>Fatigue Score immediately resets to 0.0</strong>!
              </div>
            </div>

            <div class="attention-rule-card">
              <div class="attention-rule-title">
                <span>Actual Attention & Smart Match</span>
              </div>
              <div class="attention-rule-body">
                <strong>Actual Attention = Math.max(0, BaseScore - FatigueScore)</strong>. Auto-Match directs High Attention tasks into slots with the highest actual score (or right after Recovery events).
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Setup & Usage Guide -->
        <div style="margin-top:4px;">
          <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
            <span>3. How to Use & Setup Attention in Your Daily Workflow</span>
          </div>
          <div class="attention-step-row">
            <div class="attention-step-box">
              <div class="attention-step-num">Step 1</div>
              <div class="attention-step-heading">Mark Recovery Routines</div>
              <div class="attention-step-desc">When editing Fixed Events (Nap, Exercise, Meditation), check <em>"Energy Recovery Event"</em> to trigger automatic fatigue reset.</div>
            </div>
            <div class="attention-step-box">
              <div class="attention-step-num">Step 2</div>
              <div class="attention-step-heading">Set Task Attention Level</div>
              <div class="attention-step-desc">For each Task, select required Attention level: <strong>High</strong> (deep reasoning), <strong>Medium</strong>, or <strong>Low</strong> (shallow emails/chores).</div>
            </div>
            <div class="attention-step-box">
              <div class="attention-step-num">Step 3</div>
              <div class="attention-step-heading">Select Scheduling Mode</div>
              <div class="attention-step-desc">Choose <strong>Auto</strong> for dynamic energy matching, or switch to <strong>Manual</strong> to specify exact start time.</div>
            </div>
            <div class="attention-step-box">
              <div class="attention-step-num">Step 4</div>
              <div class="attention-step-heading">Run Auto-Match</div>
              <div class="attention-step-desc">Click <em>"Auto-Match All"</em> to automatically align all tasks with your highest energy windows.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    `;
  }

  // Tiếng Việt
  return `
    <!-- BẢNG GIẢI THÍCH TÍNH NĂNG QUẢN LÝ NĂNG LƯỢNG (ATTENTION ENGINE) -->
    <div class="settings-card ${getCardCollapseClass('attention-guide-card')}" id="attention-guide-card">
      <div class="settings-card-header" onclick="toggleSettingsCard('attention-guide-card')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>Quản Lý Năng Lượng & Mức Độ Tập Trung (Attention Engine)</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">Name Tag: Attention Engine</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ChronoFlow tích hợp thuật toán Attention Engine dựa trên nhịp sinh học não bộ (Circadian Rhythm). Hệ thống tính toán năng lượng nhận thức thực tế, tự động trừ điểm cạn kiệt (Fatigue) khi làm việc nặng và phục hồi toàn diện sau các hoạt động nghỉ ngơi (Recovery).
        </div>

      <!-- Phần 1: Attention là gì? -->
      <div class="attention-hero-intro">
        <div class="attention-hero-title">
          <span>1. Khái niệm: Attention (Năng lượng & Sự chú ý nhận thức) là gì?</span>
        </div>
        <div class="attention-hero-desc">
          Quản lý thời gian truyền thống (Time Management) coi 1 giờ làm việc vào lúc 8h sáng có giá trị ngang với 1 giờ vào lúc 14h trưa hay 23h đêm. Tuy nhiên, <strong>Năng lượng não bộ (Cognitive Energy)</strong> là một tài nguyên hữu hạn và biến thiên liên tục. <strong>Quản lý Attention</strong> giúp bạn xếp công việc phức tạp (Deep Work) vào đúng "khung giờ vàng" của não bộ, giảm thiểu tối đa tình trạng kiệt sức (burnout) và nâng cao hiệu suất thực tế từ 3 đến 5 lần.
        </div>
      </div>

      <!-- Phần 2: Cách hoạt động trong hệ thống ChronoFlow -->
      <div>
        <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>2. Cách thức hoạt động trong hệ thống ChronoFlow</span>
        </div>

        <!-- Bảng điểm cơ sở theo nhịp sinh học -->
        <div class="attention-circadian-grid">
          <div class="circadian-pill-card peak">
            <div class="circadian-time-badge">
              <span>06:00 - 11:00</span>
              <span class="circadian-score-tag score-tag-peak">Base 2.0</span>
            </div>
            <div class="circadian-label">Đỉnh cao năng lượng sáng</div>
            <div class="circadian-note">Khung giờ vàng cho tư duy chiến lược, kiến trúc hệ thống, giải quyết bài toán hóc búa (Q1/Q2).</div>
          </div>

          <div class="circadian-pill-card dip">
            <div class="circadian-time-badge">
              <span>11:00 - 13:30</span>
              <span class="circadian-score-tag score-tag-dip">Base 0.5</span>
            </div>
            <div class="circadian-label">Trũng sinh học buổi trưa</div>
            <div class="circadian-note">Năng lượng nhận thức tự nhiên giảm xuống. Lý tưởng cho ăn trưa, ngủ ngắn (nap), thiền, thư giãn.</div>
          </div>

          <div class="circadian-pill-card sub-peak">
            <div class="circadian-time-badge">
              <span>14:00 - 18:00</span>
              <span class="circadian-score-tag score-tag-sub">Base 1.5</span>
            </div>
            <div class="circadian-label">Đỉnh cao tập trung chiều</div>
            <div class="circadian-note">Khung giờ vàng thứ 2 trong ngày, thích hợp cho code sprint, họp trọng điểm, xử lý công việc chuyên sâu.</div>
          </div>

          <div class="circadian-pill-card evening">
            <div class="circadian-time-badge">
              <span>18:00 - 22:00</span>
              <span class="circadian-score-tag score-tag-evening">Base 1.0</span>
            </div>
            <div class="circadian-label">Nhẹ nhàng buổi tối</div>
            <div class="circadian-note">Năng lượng trung bình, thích hợp đọc sách, lập kế hoạch ngày mai, học hỏi kỹ năng mới.</div>
          </div>

          <div class="circadian-pill-card rest">
            <div class="circadian-time-badge">
              <span>22:00 - 06:00</span>
              <span class="circadian-score-tag score-tag-rest">Base 0.0</span>
            </div>
            <div class="circadian-label">Nghỉ ngơi & Tái tạo</div>
            <div class="circadian-note">Giấc ngủ sâu phục hồi thể chất, thanh lọc tâm trí và tái tạo lại toàn bộ năng lượng cho ngày mới.</div>
          </div>
        </div>

        <!-- 3 Quy tắc hoạt động cốt lõi -->
        <div class="attention-rules-grid" style="margin-top:12px;">
          <div class="attention-rule-card">
            <div class="attention-rule-title">
              <span>Điểm Cạn Kiệt Năng Lượng (Fatigue Score)</span>
            </div>
            <div class="attention-rule-body">
              Khi bạn hoàn thành một việc đòi hỏi <strong>Attention: Cao (High)</strong>, điểm cạn kiệt <strong>Fatigue tăng +0.5</strong>; việc <strong>Trung bình (Medium) tăng +0.2</strong>; việc <strong>Thấp (Low)</strong> không làm tăng Fatigue.
            </div>
          </div>

          <div class="attention-rule-card">
            <div class="attention-rule-title">
              <span>Cơ Chế Phục Hồi Năng Lượng (Recovery Reset)</span>
            </div>
            <div class="attention-rule-body">
              Khi dòng thời gian đi qua một Sự kiện cố định được đánh dấu <strong>isRecovery: true</strong> (Ngủ trưa, Yoga, Thiền, Gym...), <strong>Fatigue Score lập tức được Reset về 0.0</strong>!
            </div>
          </div>

          <div class="attention-rule-card">
            <div class="attention-rule-title">
              <span>Điểm Thực Tế & Khớp Lịch Thông Minh</span>
            </div>
            <div class="attention-rule-body">
              <strong>Điểm Attention Thực Tế = Math.max(0, BaseScore - FatigueScore)</strong>. Thuật toán Auto-Match sẽ ưu tiên xếp các việc quan trọng vào khung giờ có điểm thực tế cao nhất hoặc ngay sau khi phục hồi.
            </div>
          </div>
        </div>
      </div>

      <!-- Phần 3: Hướng dẫn Sử dụng & Cài đặt từng bước -->
      <div style="margin-top:4px;">
        <div style="font-size:14px; font-weight:700; color:var(--text-primary); margin-bottom:8px; display:flex; align-items:center; gap:6px;">
          <span>3. Hướng dẫn Sử dụng & Thiết lập (Setup & Workflow)</span>
        </div>
        <div class="attention-step-row">
          <div class="attention-step-box">
            <div class="attention-step-num">Bước 1</div>
            <div class="attention-step-heading">Gán Sự Kiện Phục Hồi</div>
            <div class="attention-step-desc">Khi tạo/sửa Sự kiện cố định (Ngủ trưa, Tập thể dục, Thiền), tích chọn ô <em>"Sự kiện phục hồi năng lượng"</em> để kích hoạt reset điểm mệt mỏi.</div>
          </div>
          <div class="attention-step-box">
            <div class="attention-step-num">Bước 2</div>
            <div class="attention-step-heading">Chọn Mức Độ Tập Trung</div>
            <div class="attention-step-desc">Trong modal Task, chọn mức Attention: <strong>Cao</strong> (việc tư duy nặng), <strong>Trung bình</strong>, <strong>Thấp</strong> (việc nhẹ/thủ tục) hoặc <strong>Tự động</strong>.</div>
          </div>
          <div class="attention-step-box">
            <div class="attention-step-num">Bước 3</div>
            <div class="attention-step-heading">Chọn Chế Độ Xếp Lịch</div>
            <div class="attention-step-desc">Chọn <strong>Tự động xếp</strong> để thuật toán tự tính toán, hoặc chọn <strong>Tùy chọn giờ (manual)</strong> nếu bạn muốn chỉ định giờ bắt đầu cụ thể.</div>
          </div>
          <div class="attention-step-box">
            <div class="attention-step-num">Bước 4</div>
            <div class="attention-step-heading">Kích Hoạt Tự Động Xếp</div>
            <div class="attention-step-desc">Nhấn nút <em>"Tự Động Xếp Hết Lịch"</em> trên Ma trận Eisenhower hoặc Timeline để hệ thống tối ưu hóa toàn bộ lịch trình trong ngày!</div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
}

function openAttentionGuideModal() {
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">Hướng Dẫn Quản Lý Năng Lượng (Attention Engine)</h3>
      <button class="icon-btn" onclick="closeModal()">✕</button>
    </div>
    <div class="modal-body" style="max-height:75vh; overflow-y:auto; padding:16px;">
      ${renderAttentionGuideSection()}
    </div>
    <div class="modal-footer">
      <button class="btn-primary" onclick="closeModal()">${t('cancelBtn')}</button>
    </div>
  `);
}

window.renderAttentionGuideSection = renderAttentionGuideSection;
window.openAttentionGuideModal = openAttentionGuideModal;
window.renderHelpDocSection = renderHelpDocSection;

// ==========================================
// CHROME-LIKE MODULAR SETTINGS RENDERERS
// ==========================================

let activeSettingsTabId = 'tab-account-sync';

function toggleGCalApiKeyVisibility() {
  const input = document.getElementById('gcal-api-key-input');
  const icon = document.getElementById('gcal-api-key-eye-icon');
  if (!input) return;
  if (input.type === 'password') {
    input.type = 'text';
    if (icon) icon.innerHTML = '<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>';
  } else {
    input.type = 'password';
    if (icon) icon.innerHTML = '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>';
  }
}
window.toggleGCalApiKeyVisibility = toggleGCalApiKeyVisibility;

function copyGCalScope() {
  const scope = 'https://www.googleapis.com/auth/calendar.events';
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(scope).then(() => {
      showToast('Đã sao chép OAuth Scope vào Clipboard!');
    }).catch(() => {
      showToast(`OAuth Scope: ${scope}`);
    });
  } else {
    showToast(`OAuth Scope: ${scope}`);
  }
}
window.copyGCalScope = copyGCalScope;

function setGCalInterval(val) {
  const select = document.getElementById('gcal-sync-interval-select');
  if (select) {
    select.value = String(val);
  }
  document.querySelectorAll('.gcal-interval-pill').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-val') === String(val));
  });
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  appState.settings.gcal.autoSyncInterval = Number(val) || 60;
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    window.d.settings.gcal.autoSyncInterval = Number(val) || 60;
  }
  touch(appState.settings);
  saveData();
  const nameTag = document.getElementById('gcal-polling-name-tag');
  if (nameTag && appState.settings.gcal.autoSync === true) {
    nameTag.textContent = `${appState.settings.gcal.autoSyncInterval}s`;
  }
  restartGCalAutoSyncTimer();
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? `Polling interval: ${val}s` : `Chu kỳ quét: ${val} giây`);
}
window.setGCalInterval = setGCalInterval;

const expandedSettingsCards = new Set();

function isSettingsCardExpanded(cardId) {
  if (typeof document !== 'undefined') {
    const el = document.getElementById(cardId);
    if (el) {
      if (el.classList.contains('is-expanded')) {
        expandedSettingsCards.add(cardId);
        return true;
      }
      if (el.classList.contains('is-collapsed')) {
        expandedSettingsCards.delete(cardId);
        return false;
      }
    }
  }
  return expandedSettingsCards.has(cardId);
}

function getCardCollapseClass(cardId, defaultOpen = false) {
  if (typeof document !== 'undefined') {
    const el = document.getElementById(cardId);
    if (el) {
      if (el.classList.contains('is-expanded')) {
        expandedSettingsCards.add(cardId);
        return 'is-expanded';
      }
      if (el.classList.contains('is-collapsed')) {
        expandedSettingsCards.delete(cardId);
        return 'is-collapsed';
      }
    }
  }
  if (expandedSettingsCards.has(cardId)) {
    return 'is-expanded';
  }
  return defaultOpen ? 'is-expanded' : 'is-collapsed';
}

function toggleSettingsCard(cardId) {
  const card = document.getElementById(cardId);
  if (!card) return;
  const isCollapsed = card.classList.contains('is-collapsed');
  if (isCollapsed) {
    card.classList.remove('is-collapsed');
    card.classList.add('is-expanded');
    expandedSettingsCards.add(cardId);
  } else {
    card.classList.add('is-collapsed');
    card.classList.remove('is-expanded');
    expandedSettingsCards.delete(cardId);
  }
}
window.toggleSettingsCard = toggleSettingsCard;
window.getCardCollapseClass = getCardCollapseClass;
window.expandedSettingsCards = expandedSettingsCards;

function updateGDriveBadgeTime() {
  const badge = document.getElementById('gdrive-sync-status-badge');
  if (badge) {
    const isEn = appState.settings?.lang === 'en';
    const appData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : appState);
    const lastSyncTime = appData?.settings?.gdrive?.lastSyncTime || Date.now();
    const formatted = new Date(lastSyncTime).toLocaleString(isEn ? 'en-US' : 'vi-VN', { dateStyle: 'short', timeStyle: 'medium' });
    badge.textContent = `${isEn ? 'Synced' : 'Đã đồng bộ'}: ${formatted}`;
    badge.className = 'settings-name-tag active';
  }
}

function toggleGDriveMasterSync(value) {
  const prefs = loadSyncPrefs();
  prefs.gdriveEnabled = Boolean(value);
  saveSyncPrefs(prefs);

  if (!value) {
    if (typeof gdrivePollingIntervalId !== 'undefined' && gdrivePollingIntervalId) {
      clearInterval(gdrivePollingIntervalId);
      gdrivePollingIntervalId = null;
    }
  } else {
    if (typeof setupGDrivePolling === 'function') {
      setupGDrivePolling();
    }
  }

  const isEn = appState.settings?.lang === 'en';
  const msg = isEn
    ? (value ? 'Enabled Google Drive Sync' : 'Disabled Google Drive Sync')
    : (value ? 'Đã bật đồng bộ Google Drive' : 'Đã tắt đồng bộ Google Drive');
  showToast(msg);

  const gcalMount = document.getElementById('settings-gcal-mount-point');
  if (gcalMount) {
    gcalMount.innerHTML = renderSettingsAccountSyncHtml();
  }
}

function b() {
  saveData();
}

if (typeof window !== 'undefined') {
  window.toggleGDriveMasterSync = toggleGDriveMasterSync;
  window.b = b;
}

function renderGDriveSettingsCard() {
  const isEn = appState.settings?.lang === 'en';
  const syncPrefs = loadSyncPrefs();
  const gdriveEnabled = !!syncPrefs.gdriveEnabled;
  const gdrive = appState.settings?.gdrive || (typeof window !== 'undefined' && window.d?.settings?.gdrive) || {
    enabled: true,
    autoSyncOnOpen: false,
    pollingEnabled: false,
    pollingInterval: 300,
    lastSyncTime: null,
    fileId: null
  };

  const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
  const hasToken = Boolean(token);
  const loginRequiredTitle = isEn ? 'Google login required' : 'Cần đăng nhập Google';

  const isAutoSyncOpen = gdrive.autoSyncOnOpen === true;
  const isPolling = gdrive.pollingEnabled === true;
  const currentInterval = Number(gdrive.pollingInterval) || 300;
  
  const lastSyncFormatted = gdrive.lastSyncTime 
    ? new Date(gdrive.lastSyncTime).toLocaleString(isEn ? 'en-US' : 'vi-VN', { dateStyle: 'short', timeStyle: 'medium' }) 
    : (isEn ? 'Never' : 'Chưa đồng bộ');

  return `
    <div class="settings-card ${getCardCollapseClass('gdrive-card-sync', true)}" id="gdrive-card-sync">
      <div class="settings-card-header" onclick="toggleSettingsCard('gdrive-card-sync')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${isEn ? 'Google Drive Cloud Synchronization' : 'Đồng Bộ Dữ Liệu Qua Google Drive'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag ${gdrive.lastSyncTime ? 'active' : ''}" id="gdrive-sync-status-badge">
            ${gdrive.lastSyncTime ? `${isEn ? 'Synced' : 'Đã đồng bộ'}: ${lastSyncFormatted}` : 'Google Drive'}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body" style="display:flex; flex-direction:column; gap:16px;">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Safely store and synchronize your workspace through chronoflow_sync.json on Google Drive. Required OAuth scope: https://www.googleapis.com/auth/drive.file.' 
            : 'Lưu trữ và đồng bộ hóa toàn bộ công việc trên tệp chronoflow_sync.json thuộc Google Drive. Yêu cầu OAuth scope: https://www.googleapis.com/auth/drive.file.'}
        </div>

        ${gdrive.fileId ? `
          <div style="display:flex; align-items:center; gap:6px; font-size:12.5px;">
            <span style="color:var(--text-secondary);">${isEn ? 'Drive File Link:' : 'Liên kết tệp Drive:'}</span>
            <a href="https://drive.google.com/file/d/${gdrive.fileId}/view" target="_blank" rel="noopener noreferrer" style="color:var(--primary); text-decoration:underline; font-weight:600; display:inline-flex; align-items:center; gap:4px;">
              <span>chronoflow_sync.json</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        ` : ''}

        <!-- 1. Thao tác thủ công: Kéo về (Pull) và Đẩy lên (Push) -->
        <div style="display:flex; flex-direction:column; gap:8px;">
          <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Manual Synchronization:' : 'Thao tác thủ công:'}</div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button type="button" class="btn-secondary" id="btn-gdrive-pull" ${(!hasToken || !gdriveEnabled) ? `disabled title="${loginRequiredTitle}" style="opacity:0.6; cursor:not-allowed;"` : ''} onclick="triggerGDrivePullManual()">
              ${isEn ? 'Pull From Drive' : 'Kéo dữ liệu về (Pull)'}
            </button>
            <button type="button" class="btn-primary" id="btn-gdrive-push" ${(!hasToken || !gdriveEnabled) ? `disabled title="${loginRequiredTitle}" style="opacity:0.6; cursor:not-allowed;"` : ''} onclick="triggerGDrivePushManual()">
              ${isEn ? 'Push To Drive' : 'Đẩy dữ liệu lên (Push)'}
            </button>
          </div>
        </div>

        ${gdriveEnabled ? `
          <!-- 2. Toggle Tự động đồng bộ khi mở web -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:12px; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Auto-sync on Startup:' : 'Tự động đồng bộ khi mở web:'}</span>
              <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Automatically pull latest data from Google Drive when launching ChronoFlow' : 'Tự động tải bản ghi mới nhất về khi khởi chạy ứng dụng'}</span>
            </div>
            <label class="modern-switch" title="${isEn ? 'Auto-sync on startup' : 'Tự động đồng bộ khi mở web'}">
              <input type="checkbox" id="gdrive-autosync-open-checkbox" ${isAutoSyncOpen ? 'checked' : ''} onchange="updateGDriveAutoSyncOnOpen(this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <!-- 3. Toggle Đồng bộ định kỳ ngầm (Polling) -->
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding-top:12px; border-top:1px solid var(--border-subtle);">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Background Polling (Auto Pull & Push):' : 'Đồng bộ định kỳ ngầm (Polling):'}</span>
              <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Periodically pull and push updates in the background' : 'Tự động pull và push dữ liệu chạy nền theo chu kỳ định sẵn'}</span>
            </div>
            <label class="modern-switch" title="${isEn ? 'Background Polling' : 'Đồng bộ định kỳ ngầm (Polling)'}">
              <input type="checkbox" id="gdrive-polling-checkbox" ${isPolling ? 'checked' : ''} onchange="updateGDrivePollingEnabled(this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <!-- 4. Nhóm nút preset thời gian polling -->
          <div id="gdrive-polling-interval-container" style="display:${isPolling ? 'flex' : 'none'}; flex-direction:column; gap:10px; padding-top:12px; border-top:1px solid var(--border-subtle);">
            <div style="font-size:12px; font-weight:700; color:var(--text-primary);">${isEn ? 'Polling Frequency:' : 'Chu kỳ polling định kỳ:'}</div>
            <div class="gcal-interval-pills" style="display:flex; gap:8px; flex-wrap:wrap;">
              <button type="button" class="preset-chip ${currentInterval === 120 ? 'active' : ''}" onclick="setGDrivePollingInterval(120)">
                ${isEn ? '2 mins (120s)' : '2 phút (120s)'}
              </button>
              <button type="button" class="preset-chip ${currentInterval === 300 ? 'active' : ''}" onclick="setGDrivePollingInterval(300)">
                ${isEn ? '5 mins (300s)' : '5 phút (300s)'}
              </button>
              <button type="button" class="preset-chip ${currentInterval === 900 ? 'active' : ''}" onclick="setGDrivePollingInterval(900)">
                ${isEn ? '15 mins (900s)' : '15 phút (900s)'}
              </button>
              <button type="button" class="preset-chip ${currentInterval === 1800 ? 'active' : ''}" onclick="setGDrivePollingInterval(1800)">
                ${isEn ? '30 mins (1800s)' : '30 phút (1800s)'}
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function updateGCalAutoSyncOnOpen(enabled) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  appState.settings.gcal.autoSyncOnOpen = Boolean(enabled);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    window.d.settings.gcal.autoSyncOnOpen = Boolean(enabled);
  }
  touch(appState.settings);
  saveData();
  if (typeof b === 'function') b();
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? 'Updated Google Calendar auto-sync on startup' : 'Đã cập nhật tự động đồng bộ khi mở web');
}

function updateGCalPollingEnabled(enabled) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  appState.settings.gcal.autoSync = Boolean(enabled);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    window.d.settings.gcal.autoSync = Boolean(enabled);
  }
  touch(appState.settings);
  saveData();
  if (typeof b === 'function') b();

  toggleAutoSyncSettingsRow(Boolean(enabled));
  const nameTag = document.getElementById('gcal-polling-name-tag');
  if (nameTag) {
    const isEn = appState.settings?.lang === 'en';
    const currentInterval = Number(appState.settings.gcal.autoSyncInterval) || 60;
    nameTag.textContent = enabled ? `${currentInterval}s` : (isEn ? 'Off' : 'Tắt');
  }

  restartGCalAutoSyncTimer();
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? 'Updated Google Calendar background polling' : 'Đã cập nhật tính năng quét ngầm Google Calendar');
}

function updateGDriveAutoSyncOnOpen(enabled) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gdrive) appState.settings.gdrive = {};
  appState.settings.gdrive.autoSyncOnOpen = Boolean(enabled);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gdrive) {
    window.d.settings.gdrive.autoSyncOnOpen = Boolean(enabled);
  }
  touch(appState.settings);
  saveData();
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? 'Updated auto-sync on startup' : 'Đã cập nhật tự động đồng bộ khi mở web');
}

function updateGDrivePollingEnabled(enabled) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gdrive) appState.settings.gdrive = {};
  appState.settings.gdrive.pollingEnabled = Boolean(enabled);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gdrive) {
    window.d.settings.gdrive.pollingEnabled = Boolean(enabled);
  }
  touch(appState.settings);
  saveData();

  const container = document.getElementById('gdrive-polling-interval-container');
  if (container) {
    container.style.display = enabled ? 'flex' : 'none';
  }

  if (typeof setupGDrivePolling === 'function') {
    setupGDrivePolling();
  }
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? 'Updated background polling setting' : 'Đã cập nhật tính năng đồng bộ ngầm');
}

function setGDrivePollingInterval(seconds) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gdrive) appState.settings.gdrive = {};
  appState.settings.gdrive.pollingInterval = Number(seconds) || 300;
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gdrive) {
    window.d.settings.gdrive.pollingInterval = Number(seconds) || 300;
  }
  touch(appState.settings);
  saveData();

  const container = document.getElementById('gdrive-polling-interval-container');
  if (container) {
    const buttons = container.querySelectorAll('.preset-chip');
    buttons.forEach(btn => {
      const match = btn.textContent.includes(`(${seconds}s)`);
      btn.classList.toggle('active', match);
    });
  }

  if (typeof setupGDrivePolling === 'function') {
    setupGDrivePolling();
  }
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? `Polling interval set to ${seconds}s` : `Đã đặt chu kỳ quét là ${seconds} giây`);
}

async function triggerGDrivePullManual() {
  const isEn = appState.settings?.lang === 'en';
  if (!loadSyncPrefs().gdriveEnabled) {
    showToast(isEn ? 'Google Drive Sync is disabled. Please enable the master switch first!' : 'Đồng bộ Google Drive đang tắt. Vui lòng bật nút tổng trước!');
    return;
  }
  const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
  if (!token) {
    showToast(isEn ? 'Please sign in with Google first!' : 'Vui lòng đăng nhập Google trước!');
    return;
  }
  const btn = document.getElementById('btn-gdrive-pull');
  if (btn) {
    btn.disabled = true;
    btn.textContent = isEn ? 'Pulling...' : 'Đang kéo...';
  }
  showToast(isEn ? 'Pulling data from Google Drive...' : 'Đang kéo dữ liệu từ Google Drive...');
  try {
    await pullFromGoogleDrive();
    updateGDriveBadgeTime();
    showToast(isEn ? 'Pulled and merged from Google Drive successfully!' : 'Đã kéo và hợp nhất dữ liệu từ Google Drive thành công!');
    const gdriveMount = document.getElementById('settings-gcal-mount-point');
    if (gdriveMount) gdriveMount.innerHTML = renderSettingsAccountSyncHtml();
  } catch (err) {
    console.error('GDrive pull error:', err);
    showToast(isEn ? 'Failed to pull from Google Drive: ' + err.message : 'Lỗi kéo dữ liệu từ Google Drive: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = isEn ? 'Pull From Drive' : 'Kéo dữ liệu về (Pull)';
    }
  }
}

async function triggerGDrivePushManual() {
  const isEn = appState.settings?.lang === 'en';
  if (!loadSyncPrefs().gdriveEnabled) {
    showToast(isEn ? 'Google Drive Sync is disabled. Please enable the master switch first!' : 'Đồng bộ Google Drive đang tắt. Vui lòng bật nút tổng trước!');
    return;
  }
  const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
  if (!token) {
    showToast(isEn ? 'Please sign in with Google first!' : 'Vui lòng đăng nhập Google trước!');
    return;
  }
  const btn = document.getElementById('btn-gdrive-push');
  if (btn) {
    btn.disabled = true;
    btn.textContent = isEn ? 'Pushing...' : 'Đang đẩy...';
  }
  showToast(isEn ? 'Pushing data to Google Drive...' : 'Đang lưu trữ dữ liệu lên Google Drive...');
  try {
    await pushToGoogleDrive();
    updateGDriveBadgeTime();
    showToast(isEn ? 'Pushed data to Google Drive successfully!' : 'Đã lưu trữ dữ liệu lên Google Drive thành công!');
    const gdriveMount = document.getElementById('settings-gcal-mount-point');
    if (gdriveMount) gdriveMount.innerHTML = renderSettingsAccountSyncHtml();
  } catch (err) {
    console.error('GDrive push error:', err);
    showToast(isEn ? 'Failed to push to Google Drive: ' + err.message : 'Lỗi lưu trữ lên Google Drive: ' + err.message);
  } finally {
    if (btn) {
      btn.disabled = false;
      btn.textContent = isEn ? 'Push To Drive' : 'Đẩy dữ liệu lên (Push)';
    }
  }
}

if (typeof window !== 'undefined') {
  window.renderGDriveSettingsCard = renderGDriveSettingsCard;
  window.updateGCalAutoSyncOnOpen = updateGCalAutoSyncOnOpen;
  window.updateGCalPollingEnabled = updateGCalPollingEnabled;
  window.updateGDriveAutoSyncOnOpen = updateGDriveAutoSyncOnOpen;
  window.updateGDrivePollingEnabled = updateGDrivePollingEnabled;
  window.setGDrivePollingInterval = setGDrivePollingInterval;
  window.triggerGDrivePullManual = triggerGDrivePullManual;
  window.triggerGDrivePushManual = triggerGDrivePushManual;
}

function oa() {
  if (typeof restartGCalAutoSyncTimer === 'function') {
    restartGCalAutoSyncTimer();
  }
}

function toggleGCalMasterSync(value) {
  const prefs = loadSyncPrefs();
  prefs.gcalEnabled = Boolean(value);
  saveSyncPrefs(prefs);
  if (!value) {
    if (typeof gcalPushDebounceTimers !== 'undefined' && gcalPushDebounceTimers) {
      gcalPushDebounceTimers.forEach(t => clearTimeout(t));
      gcalPushDebounceTimers.clear();
    }
    if (typeof updateGCalSyncWidget === 'function') {
      updateGCalSyncWidget('idle');
    }
  }
  if (typeof oa === 'function') {
    oa();
  } else if (typeof restartGCalAutoSyncTimer === 'function') {
    restartGCalAutoSyncTimer();
  }
  const isEn = appState.settings?.lang === 'en';
  const msg = isEn
    ? (value ? 'Enabled Google Calendar Sync' : 'Disabled Google Calendar Sync')
    : (value ? 'Đã bật đồng bộ Google Calendar' : 'Đã tắt đồng bộ Google Calendar');
  showToast(msg);

  const gcalMount = document.getElementById('settings-gcal-mount-point');
  if (gcalMount) {
    gcalMount.innerHTML = renderSettingsAccountSyncHtml();
  }
}

if (typeof window !== 'undefined') {
  window.oa = oa;
  window.toggleGCalMasterSync = toggleGCalMasterSync;
}

function renderSettingsAccountSyncHtml() {
  const isEn = appState.settings.lang === 'en';
  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
  const gcalConfig = appState.settings.gcal || {};
  const syncPrefs = loadSyncPrefs();
  const gcalEnabled = !!syncPrefs.gcalEnabled;
  const gdriveEnabled = !!syncPrefs.gdriveEnabled;
  const syncTypes = gcalConfig.syncTypes || {
    tasksScheduled: true,
    tasksUnscheduled: false,
    fixed: true,
    transient: true,
    notes: false
  };
  const isConnected = !!getGCalToken();
  const hasClientId = !!(gcalConfig.clientId && gcalConfig.clientId.trim());
  const currentInterval = Number(gcalConfig.autoSyncInterval) || 60;
  const currentOrigin = typeof window !== 'undefined' && window.location ? window.location.origin : '';

  return `
    <div class="gcal-brand-stripe"></div>
    <!-- 1. QUICK ACCOUNT & SYNC STATUS TOOLBAR -->
    <div class="settings-quick-bar ${isConnected ? 'gcal-auth-hero-connected' : 'gcal-auth-hero-disconnected'}">
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <span>Google Calendar:</span>
        </span>
        <span class="gcal-status-badge ${isConnected ? 'connected' : 'disconnected'}">
          ${isConnected ? `<span class="live-pulse-dot"></span>` : ''}
          ${isConnected 
            ? (isEn ? 'Connected: ' : 'Đã kết nối: ') + escapeHtml(gcalConfig.userEmail || 'Google') 
            : (isEn ? 'Disconnected' : 'Chưa kết nối')}
        </span>
      </div>

      <div class="settings-quick-group">
        ${isConnected ? `
          <button type="button" id="gcal-sync-now-btn" class="btn-primary" ${!gcalEnabled ? 'disabled' : ''} onclick="syncFromGoogleCalendar(true)" style="background:#16a34a; font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:5px; ${!gcalEnabled ? 'opacity:0.55; cursor:not-allowed;' : ''}" title="${!gcalEnabled ? (isEn ? 'Enable Google Calendar Sync master switch first' : 'Vui lòng bật nút đồng bộ Google Calendar trước') : (isEn ? 'Pull latest events from Google Calendar' : 'Kéo các sự kiện từ Google Calendar về')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
            <span>${isEn ? 'Pull' : 'Kéo về'}</span>
          </button>
          <button type="button" id="gcal-push-all-btn" class="btn-primary" ${!gcalEnabled ? 'disabled' : ''} onclick="pushAllToGCal(true)" style="background:#2563eb; font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:5px; ${!gcalEnabled ? 'opacity:0.55; cursor:not-allowed;' : ''}" title="${!gcalEnabled ? (isEn ? 'Enable Google Calendar Sync master switch first' : 'Vui lòng bật nút đồng bộ Google Calendar trước') : (isEn ? 'Push all items to Google Calendar' : 'Đẩy dữ liệu lên Google Calendar')}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>
            <span>${isEn ? 'Push' : 'Đẩy lên'}</span>
          </button>
          <button type="button" class="btn-secondary" onclick="handleGCalLogout()" style="color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11px; padding:5px 10px;" title="${isEn ? 'Sign out' : 'Đăng xuất'}">
            <span>${isEn ? 'Sign Out' : 'Đăng xuất'}</span>
          </button>
        ` : `
          <button type="button" class="gcal-google-signin-btn" onclick="handleGCalLogin()" style="padding:6px 14px; font-size:12.5px;" title="${isEn ? 'Sign in with Google' : 'Đăng nhập Google'}">
            <svg width="16" height="16" viewBox="0 0 24 24" style="flex-shrink:0;">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>${isEn ? 'Sign In' : 'Đăng nhập Google'}</span>
          </button>
        `}
      </div>
    </div>

    <!-- Hàng switch nhanh master switch Google Calendar Sync -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); margin-bottom:12px;">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Enable Google Calendar Sync' : 'Bật đồng bộ Google Calendar'}</span>
        <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Master switch for Google Calendar synchronization' : 'Bật/tắt tổng thể hoạt động đồng bộ Google Calendar'}</span>
      </div>
      <label class="modern-switch" title="${isEn ? 'Enable Google Calendar Sync' : 'Bật đồng bộ Google Calendar'}">
        <input type="checkbox" id="gcal-master-sync-checkbox" ${gcalEnabled ? 'checked' : ''} onchange="toggleGCalMasterSync(this.checked)">
        <span class="switch-track"><span class="switch-thumb"></span></span>
      </label>
    </div>

    <!-- Hàng switch nhanh master switch Google Drive Sync -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); margin-bottom:12px;">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Enable Google Drive Sync' : 'Bật đồng bộ Google Drive'}</span>
        <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Master switch for Google Drive synchronization' : 'Bật/tắt tổng thể hoạt động đồng bộ đám mây Google Drive'}</span>
      </div>
      <label class="modern-switch" title="${isEn ? 'Enable Google Drive Sync' : 'Bật đồng bộ Google Drive'}">
        <input type="checkbox" id="gdrive-master-sync-checkbox" ${gdriveEnabled ? 'checked' : ''} onchange="toggleGDriveMasterSync(this.checked)">
        <span class="switch-track"><span class="switch-thumb"></span></span>
      </label>
    </div>

    <!-- Tùy chỉnh phím tắt đồng bộ nhanh trên thanh công cụ Header (Google Calendar hay Google Drive) -->
    <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; padding:10px 14px; background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-md); margin-bottom:12px;">
      <div style="display:flex; flex-direction:column; gap:2px;">
        <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Header Quick Sync Shortcut' : 'Phím tắt đồng bộ nhanh trên Header'}</span>
        <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Choose whether the header sync button triggers Google Calendar or Google Drive' : 'Tùy chỉnh nút đồng bộ trên thanh điều hướng là Google Calendar hay Google Drive'}</span>
      </div>
      <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
        <div style="display:inline-flex; gap:6px; align-items:center;" role="group" aria-label="${isEn ? 'Header Sync Shortcut' : 'Phím tắt đồng bộ Header'}">
          <button type="button" id="header-shortcut-opt-gcal" class="preset-chip ${getHeaderSyncTarget() !== 'gdrive' ? 'active' : ''}" onclick="updateHeaderSyncTarget('gcal')" style="padding:5px 12px; font-size:12px; font-weight:700;">
            Google Calendar (GCal)
          </button>
          <button type="button" id="header-shortcut-opt-gdrive" class="preset-chip ${getHeaderSyncTarget() === 'gdrive' ? 'active' : ''}" onclick="updateHeaderSyncTarget('gdrive')" style="padding:5px 12px; font-size:12px; font-weight:700;">
            Google Drive (GDrive)
          </button>
        </div>
        <select id="header-sync-target-select" class="form-select" style="width:auto; padding:4px 8px; font-size:12px; font-weight:600; border-radius:6px; display:none;" onchange="updateHeaderSyncTarget(this.value)">
          <option value="gcal" ${getHeaderSyncTarget() !== 'gdrive' ? 'selected' : ''}>Google Calendar (GCal)</option>
          <option value="gdrive" ${getHeaderSyncTarget() === 'gdrive' ? 'selected' : ''}>Google Drive (GDrive)</option>
        </select>
      </div>
    </div>

    <!-- 1B. CARD: GOOGLE DRIVE CLOUD SYNC -->
    ${renderGDriveSettingsCard()}

    <!-- 2. CARD: OAUTH CREDENTIALS & ORIGIN (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('gcal-card-credentials')}" id="gcal-card-credentials">
      <div class="settings-card-header" onclick="toggleSettingsCard('gcal-card-credentials')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>${isEn ? 'OAuth Credentials & Origin Configuration' : 'Cấu Hình Thông Tin Xác Thực OAuth (Credentials)'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag ${hasClientId ? 'active' : ''}">
            ${hasClientId ? (isEn ? 'OAuth: Configured' : 'OAuth: Đã cấu hình') : (isEn ? 'OAuth: Missing' : 'OAuth: Chưa cấu hình')}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Setup your Google Cloud OAuth Client ID to authorize direct browser synchronization without any middle server.' 
            : 'Điền Client ID từ Google Cloud Console để cho phép trình duyệt kết nối trực tiếp với Google Calendar.'}
        </div>

        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(280px, 1fr)); gap:14px;">
          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700;">OAuth Client ID *</span>
              <span style="font-size:11px; color:var(--primary); font-weight:700;">(${isEn ? 'Required' : 'Bắt buộc'})</span>
            </label>
            <input 
              type="text" 
              id="gcal-client-id-input" 
              class="form-input" 
              placeholder="${isEn ? 'e.g., 123456789-abc.apps.googleusercontent.com' : 'Ví dụ: 123456789-abc.apps.googleusercontent.com'}" 
              value="${escapeHtml(gcalConfig.clientId || '')}"
              oninput="handleGCalClientIdInput(this.value)"
              style="font-family:monospace; font-size:12px;"
            >
          </div>

          <div class="form-group" style="margin-bottom:0;">
            <label class="form-label" style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-weight:700;">Google API Key</span>
              <span style="font-size:11px; color:var(--text-muted);">(${isEn ? 'Optional' : 'Tùy chọn'})</span>
            </label>
            <div class="gcal-input-wrap">
              <input 
                type="password" 
                id="gcal-api-key-input" 
                class="form-input" 
                placeholder="AIzaSy..." 
                value="${escapeHtml(gcalConfig.apiKey || '')}"
                style="font-family:monospace; font-size:12px;"
              >
              <button type="button" class="gcal-input-toggle-btn" onclick="toggleGCalApiKeyVisibility()" title="${isEn ? 'Toggle visibility' : 'Ẩn / Hiện API Key'}">
                <svg id="gcal-api-key-eye-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div class="gcal-origin-bar">
          <div>
            <div style="font-weight:700; color:var(--text-primary); font-size:12px;">
              <span>${isEn ? 'Authorized JavaScript Origin for your app:' : 'Địa chỉ JavaScript Origin của ứng dụng hiện tại:'}</span>
            </div>
            <code class="gcal-code-inline" style="display:inline-block; margin-top:3px; font-size:11.5px; font-weight:700; color:var(--primary);">${escapeHtml(currentOrigin)}</code>
          </div>
          <button type="button" class="btn-primary" onclick="copyCurrentOrigin()" style="font-size:11.5px; padding:5px 12px; display:inline-flex; align-items:center; gap:5px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            <span>${isEn ? 'Copy' : 'Sao chép'}</span>
          </button>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:4px;">
          <button type="button" class="btn-primary" onclick="saveGCalCredentials()" style="padding:7px 18px; font-size:12.5px; font-weight:700; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>${isEn ? 'Save Configuration' : 'Lưu Cấu Hình'}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. CARD: BACKGROUND AUTO-SYNC POLLING & ANTI-COLLISION (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('gcal-card-polling')}" id="gcal-card-polling">
      <div class="settings-card-header" onclick="toggleSettingsCard('gcal-card-polling')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${isEn ? 'Background Auto-Sync & Anti-Collision Engine' : 'Tự Động Quét Ngầm (Auto Polling) & Chống Xung Đột'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="gcal-polling-name-tag">
            ${gcalConfig.autoSync === true ? `${currentInterval}s` : (isEn ? 'Off' : 'Tắt')}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Background auto-polling synchronizes updates from Google Calendar automatically while preserving active focus.' 
            : 'Tự động kiểm tra thay đổi từ Google Calendar theo chu kỳ định sẵn trong khi bạn làm việc.'}
        </div>

        ${!gcalEnabled ? `
          <div style="font-size:11.5px; color:#ef4444; font-weight:600; padding:6px 10px; background:rgba(239,68,68,0.1); border-radius:6px; margin-bottom:10px; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${isEn ? 'Options below require Google Calendar Sync master switch to be enabled above.' : 'Các tùy chọn dưới đây chỉ có hiệu lực khi Master Switch đồng bộ Google Calendar ở trên được bật.'}</span>
          </div>
        ` : ''}

        <!-- a. Switch Tự đồng bộ khi mở web -->
        <div class="sync-toggle-row" style="margin-bottom:12px; ${!gcalEnabled ? 'opacity:0.5; pointer-events:none;' : ''}">
          <div class="sync-toggle-text" style="display:flex; flex-direction:column; gap:2px;">
            <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Auto-sync on Startup' : 'Tự đồng bộ khi mở web'}</span>
            <span style="font-size:11.5px; color:var(--text-secondary);">${isEn ? 'Pull updates from Google Calendar when launching app' : 'Tự động tải sự kiện khi khởi chạy ứng dụng'}</span>
          </div>
          <label class="modern-switch">
            <input type="checkbox" id="gcal-autosync-open-checkbox" ${gcalConfig.autoSyncOnOpen === true ? 'checked' : ''} ${!gcalEnabled ? 'disabled' : ''} onchange="updateGCalAutoSyncOnOpen(this.checked)">
            <span class="switch-track"><span class="switch-thumb"></span></span>
          </label>
        </div>

        <!-- b. Switch Polling định kỳ -->
        <div class="sync-toggle-row" style="${!gcalEnabled ? 'opacity:0.5; pointer-events:none;' : ''}">
          <div class="sync-toggle-text">
            <span style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Background Polling (Auto-sync)' : 'Polling định kỳ'}</span>
          </div>
          <label class="modern-switch" title="${isEn ? 'Toggle background auto-sync' : 'Bật / Tắt tự động đồng bộ ngầm'}">
            <input type="checkbox" id="gcal-auto-sync-checkbox" ${gcalConfig.autoSync === true ? 'checked' : ''} ${!gcalEnabled ? 'disabled' : ''} onchange="updateGCalPollingEnabled(this.checked)">
            <span class="switch-track"><span class="switch-thumb"></span></span>
          </label>
        </div>

        <div id="gcal-interval-container" style="display:${(gcalEnabled && gcalConfig.autoSync === true) ? 'flex' : 'none'}; flex-direction:column; gap:10px; padding-top:8px; border-top:1px solid var(--border-subtle); margin-top:12px; ${!gcalEnabled ? 'opacity:0.5; pointer-events:none;' : ''}">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <span style="font-size:12px; font-weight:700; color:var(--text-primary);">${isEn ? 'Select Polling Frequency:' : 'Chọn chu kỳ quét:'}</span>
            <select id="gcal-sync-interval-select" class="form-select" style="width:auto; padding:4px 8px; font-size:12px; font-weight:600; border-radius:6px;" ${!gcalEnabled ? 'disabled' : ''} onchange="setGCalInterval(this.value)">
              <option value="30" ${currentInterval === 30 ? 'selected' : ''}>30s (${isEn ? 'Fast' : 'Nhanh'})</option>
              <option value="60" ${(!currentInterval || currentInterval === 60) ? 'selected' : ''}>60s (${isEn ? 'Standard' : 'Chuẩn'})</option>
              <option value="120" ${currentInterval === 120 ? 'selected' : ''}>2m</option>
              <option value="300" ${currentInterval === 300 ? 'selected' : ''}>5m (${isEn ? 'Battery Saver' : 'Tiết kiệm pin'})</option>
              <option value="600" ${currentInterval === 600 ? 'selected' : ''}>10m</option>
            </select>
          </div>

          <div class="gcal-interval-pills">
            <button type="button" class="gcal-interval-pill ${currentInterval === 30 ? 'active' : ''}" data-val="30" onclick="setGCalInterval(30)">30s</button>
            <button type="button" class="gcal-interval-pill ${currentInterval === 60 ? 'active' : ''}" data-val="60" onclick="setGCalInterval(60)">60s</button>
            <button type="button" class="gcal-interval-pill ${currentInterval === 120 ? 'active' : ''}" data-val="120" onclick="setGCalInterval(120)">2m</button>
            <button type="button" class="gcal-interval-pill ${currentInterval === 300 ? 'active' : ''}" data-val="300" onclick="setGCalInterval(300)">5m</button>
            <button type="button" class="gcal-interval-pill ${currentInterval === 600 ? 'active' : ''}" data-val="600" onclick="setGCalInterval(600)">10m</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 3.5. CARD: SYNC TYPES CONFIGURATION (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('gcal-card-synctypes')}" id="gcal-card-synctypes">
      <div class="settings-card-header" onclick="toggleSettingsCard('gcal-card-synctypes')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/></svg>
            <span>${isEn ? 'Google Calendar Sync Types Configuration' : 'Cấu Hình Loại Dữ Liệu Đồng Bộ Google Calendar'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag active">${isEn ? 'Sync Types' : 'Loại dữ liệu'}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body" style="display:flex; flex-direction:column; gap:12px;">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Select which categories of items to synchronize with Google Calendar during push and pull operations.' 
            : 'Lựa chọn các loại mục dữ liệu sẽ được đồng bộ hóa với Google Calendar trong các thao tác đẩy lên và kéo về.'}
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary);">
            <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" ${syncTypes.tasksScheduled !== false ? 'checked' : ''} onchange="updateGCalSyncTypeSetting('tasksScheduled', this.checked)">
            <span>${isEn ? 'Scheduled tasks (tasksScheduled)' : 'Task đã xếp lịch (tasksScheduled)'}</span>
          </label>

          <!-- SUB-BLOCK: QUADRANTS & TIME SCOPE FOR SCHEDULED TASKS -->
          <div id="scheduled-sync-subblock" style="display:${syncTypes.tasksScheduled !== false ? 'flex' : 'none'}; flex-direction:column; gap:12px; margin-top:6px; margin-left:26px; padding:12px; background:var(--bg-subtle); border:1px solid var(--border-subtle); border-radius:8px;">
            <div>
              <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
                ${isEn ? 'Sync by Eisenhower Quadrants:' : 'Đồng bộ theo Ma Trận Eisenhower:'}
              </div>
              <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="checkbox" style="accent-color:var(--primary);" ${(gcalConfig.syncScheduledQuadrants?.q1 !== false) ? 'checked' : ''} onchange="updateGCalSyncQuadrantSetting('q1', this.checked)">
                  <span>${isEn ? 'Q1: Urgent & Important' : 'Q1: Khẩn & Quan trọng'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="checkbox" style="accent-color:var(--primary);" ${(gcalConfig.syncScheduledQuadrants?.q2 !== false) ? 'checked' : ''} onchange="updateGCalSyncQuadrantSetting('q2', this.checked)">
                  <span>${isEn ? 'Q2: Important, Not Urgent' : 'Q2: Quan trọng, ko khẩn'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="checkbox" style="accent-color:var(--primary);" ${(gcalConfig.syncScheduledQuadrants?.q3 === true) ? 'checked' : ''} onchange="updateGCalSyncQuadrantSetting('q3', this.checked)">
                  <span>${isEn ? 'Q3: Urgent, Not Important' : 'Q3: Khẩn, ko quan trọng'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="checkbox" style="accent-color:var(--primary);" ${(gcalConfig.syncScheduledQuadrants?.q4 === true) ? 'checked' : ''} onchange="updateGCalSyncQuadrantSetting('q4', this.checked)">
                  <span>${isEn ? 'Q4: Not Urgent & Not Important' : 'Q4: Ko khẩn & ko quan trọng'}</span>
                </label>
              </div>
            </div>

            <div style="border-top:1px solid var(--border-subtle); padding-top:10px;">
              <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:6px;">
                ${isEn ? 'Sync Time Scope (Applies to scheduled tasks only, not fixed/transient):' : 'Phạm Vi Thời Gian Đồng Bộ (Chỉ áp dụng cho task đã xếp lịch, không áp dụng fixed/transient):'}
              </div>
              <div style="display:flex; flex-wrap:wrap; gap:14px;">
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="radio" name="gcal-sync-timescope" value="day" ${(gcalConfig.syncTimeScope || 'day') === 'day' ? 'checked' : ''} onchange="updateGCalSyncTimeScope('day')" style="accent-color:var(--primary);">
                  <span>${isEn ? 'By Day (Default)' : 'Theo ngày (Mặc định)'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="radio" name="gcal-sync-timescope" value="week" ${gcalConfig.syncTimeScope === 'week' ? 'checked' : ''} onchange="updateGCalSyncTimeScope('week')" style="accent-color:var(--primary);">
                  <span>${isEn ? 'By Week' : 'Theo tuần'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="radio" name="gcal-sync-timescope" value="month" ${gcalConfig.syncTimeScope === 'month' ? 'checked' : ''} onchange="updateGCalSyncTimeScope('month')" style="accent-color:var(--primary);">
                  <span>${isEn ? 'By Month' : 'Theo tháng'}</span>
                </label>
                <label style="display:flex; align-items:center; gap:6px; font-size:12px; cursor:pointer;">
                  <input type="radio" name="gcal-sync-timescope" value="all" ${gcalConfig.syncTimeScope === 'all' ? 'checked' : ''} onchange="updateGCalSyncTimeScope('all')" style="accent-color:var(--primary);">
                  <span>${isEn ? 'All Time' : 'Tất cả'}</span>
                </label>
              </div>
            </div>
          </div>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary);">
            <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" ${syncTypes.tasksUnscheduled === true ? 'checked' : ''} onchange="updateGCalSyncTypeSetting('tasksUnscheduled', this.checked)">
            <span>${isEn ? 'Unscheduled tasks (tasksUnscheduled)' : 'Task chưa xếp lịch (tasksUnscheduled)'}</span>
          </label>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary);">
            <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" ${syncTypes.fixed !== false ? 'checked' : ''} onchange="updateGCalSyncTypeSetting('fixed', this.checked)">
            <span>${isEn ? 'Fixed events (fixed)' : 'Việc cố định (fixed)'}</span>
          </label>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary);">
            <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" ${syncTypes.transient !== false ? 'checked' : ''} onchange="updateGCalSyncTypeSetting('transient', this.checked)">
            <span>${isEn ? 'Transient events (transient)' : 'Việc đột xuất (transient)'}</span>
          </label>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; font-size:13px; color:var(--text-primary);">
            <input type="checkbox" style="width:16px; height:16px; accent-color:var(--primary); cursor:pointer;" ${syncTypes.notes === true ? 'checked' : ''} onchange="updateGCalSyncTypeSetting('notes', this.checked)">
            <span>${isEn ? 'Daily notes (notes)' : 'Ghi chú ngày (notes)'}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 4. CARD: COLOR MAPPING RULES (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('gcal-card-colors')}" id="gcal-card-colors">
      <div class="settings-card-header" onclick="toggleSettingsCard('gcal-card-colors')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span>${isEn ? 'Google Calendar Color Mapping' : 'Ánh Xạ Mã Màu Google Calendar (11 Mã Màu Chuẩn)'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">${isEn ? 'Color Mapping' : 'Mã màu sự kiện'}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        ${renderGCalColorMappingSection(threshold)}
      </div>
    </div>

    <!-- 5. CARD: STEP-BY-STEP SETUP GUIDE (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('gcal-card-guide')}" id="gcal-card-guide">
      <div class="settings-card-header" onclick="toggleSettingsCard('gcal-card-guide')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${isEn ? 'Step-by-Step Google Cloud Console Setup Guide' : 'Hướng Dẫn 5 Bước Tạo OAuth Client ID Trên Google Cloud'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">${isEn ? '5-Step Guide' : 'Hướng dẫn 5 bước'}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="gcal-guide-body" style="border:none; padding:0; background:transparent;">
          <div class="gcal-step-item">
            <div class="gcal-step-title">
              <span class="gcal-step-num-badge">1</span>
              <span>${isEn ? 'Create New Project on Google Cloud Console' : 'Bước 1: Tạo Dự án mới trên Google Cloud Console'}</span>
            </div>
            <div style="font-size:12px;">
              ${isEn 
                ? 'Open <a href="https://console.cloud.google.com" target="_blank" style="color:var(--primary); font-weight:700;">console.cloud.google.com</a> &rarr; Click project dropdown &rarr; <strong>New Project</strong> &rarr; Name it (e.g. <code>ChronoFlow</code>) &rarr; Click <strong>Create</strong>.' 
                : 'Truy cập <a href="https://console.cloud.google.com" target="_blank" style="color:var(--primary); font-weight:700;">console.cloud.google.com</a> &rarr; Bấm vào danh sách dự án &rarr; <strong>New Project</strong> &rarr; Đặt tên (ví dụ: <code>ChronoFlow</code>) &rarr; Bấm <strong>Create</strong>.'}
            </div>
          </div>

          <div class="gcal-step-item">
            <div class="gcal-step-title">
              <span class="gcal-step-num-badge">2</span>
              <span>${isEn ? 'Enable Google Calendar API' : 'Bước 2: Kích hoạt Google Calendar API'}</span>
            </div>
            <div style="font-size:12px;">
              ${isEn 
                ? 'Go to <strong>APIs & Services &rarr; Library</strong> &rarr; Search for <code>"Google Calendar API"</code> &rarr; Click <strong>Enable</strong>.' 
                : 'Vào <strong>APIs & Services &rarr; Library</strong> &rarr; Tìm kiếm từ khóa <code>"Google Calendar API"</code> &rarr; Bấm <strong>Enable</strong> để kích hoạt.'}
            </div>
          </div>

          <div class="gcal-step-item">
            <div class="gcal-step-title">
              <span class="gcal-step-num-badge">3</span>
              <span>${isEn ? 'Configure OAuth Consent Screen' : 'Bước 3: Cấu hình Màn hình chấp thuận OAuth (Consent Screen)'}</span>
            </div>
            <div style="font-size:12px;">
              ${isEn 
                ? 'Go to <strong>OAuth consent screen</strong> &rarr; Select <strong>External</strong> &rarr; Fill App name &rarr; Add Scope <code class="gcal-code-inline">https://www.googleapis.com/auth/calendar.events</code> &rarr; Add your Google email to <strong>Test Users</strong>.' 
                : 'Vào <strong>APIs & Services &rarr; OAuth consent screen</strong> &rarr; Chọn <strong>External</strong> &rarr; Điền tên ứng dụng &rarr; Thêm Scope <code class="gcal-code-inline">https://www.googleapis.com/auth/calendar.events</code> <button type="button" class="btn-secondary" style="font-size:10.5px; padding:1px 5px; margin-left:4px;" onclick="copyGCalScope()">Sao chép</button> &rarr; Thêm email vào mục <strong>Test Users</strong>.'}
            </div>
          </div>

          <div class="gcal-step-item">
            <div class="gcal-step-title">
              <span class="gcal-step-num-badge">4</span>
              <span>${isEn ? 'Create OAuth Client ID & Add Authorized Origin' : 'Bước 4: Tạo Client ID & Thêm Authorized JavaScript Origins'}</span>
            </div>
            <div style="font-size:12px;">
              ${isEn 
                ? 'Go to <strong>Credentials &rarr; Create Credentials &rarr; OAuth client ID</strong> &rarr; Choose <strong>Web application</strong> &rarr; Under <strong>Authorized JavaScript origins</strong>, paste: <code class="gcal-code-inline">' + escapeHtml(currentOrigin) + '</code> &rarr; Click <strong>Create</strong>.' 
                : 'Vào <strong>Credentials &rarr; Create Credentials &rarr; OAuth client ID</strong> &rarr; Chọn <strong>Web application</strong> &rarr; Dán địa chỉ Origin: <code class="gcal-code-inline">' + escapeHtml(currentOrigin) + '</code> <button type="button" class="btn-secondary" style="font-size:10.5px; padding:1px 5px; margin-left:4px;" onclick="copyCurrentOrigin()">Sao chép</button> &rarr; Bấm <strong>Create</strong>.'}
            </div>
          </div>

          <div class="gcal-step-item">
            <div class="gcal-step-title">
              <span class="gcal-step-num-badge">5</span>
              <span>${isEn ? 'Paste Client ID & Connect' : 'Bước 5: Dán Client ID vào ứng dụng & Đăng nhập'}</span>
            </div>
            <div style="font-size:12px;">
              ${isEn 
                ? 'Copy the generated Client ID &rarr; Paste into the <strong>OAuth Client ID</strong> field &rarr; Click <strong>Save Configuration</strong> &rarr; Click <strong>Sign In</strong>!' 
                : 'Sao chép chuỗi Client ID vừa tạo &rarr; Dán vào ô <strong>OAuth Client ID</strong> &rarr; Bấm <strong>Lưu Cấu Hình</strong> &rarr; Bấm <strong>Đăng nhập với Google</strong>!'}
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsAppearanceHtml() {
  const isEn = appState.settings.lang === 'en';
  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
  const colors = appState.settings.colors || DEFAULT_DATA.settings.colors;
  const noisy = appState.settings.noisyIntervals || [];
  const currentLang = appState.settings.lang || 'vi';
  const defaultDuration = Number(appState.settings.defaultTaskDuration) || 30;
  const defaultStartupView = appState.settings.defaultStartupView || 'day';
  const timelineDaySpan = Number(appState.settings.timelineDaySpan) || 1;
  const freeTimeMode = appState.settings?.freeTimeDisplayMode || 'total';
  const trans = appState.settings?.transition || DEFAULT_DATA.settings.transition;
  const timeSortOrder = appState.settings?.timeSortOrder || 'asc';
  const isDark = typeof document !== 'undefined' && (document.documentElement.classList.contains('dark-theme') || (document.body && document.body.classList.contains('dark-theme')));
  const mobileAssist = appState.settings?.mobileAssist || {};
  const assistEnabled = mobileAssist.enabled !== false;
  const shortcuts = mobileAssist.shortcuts || {};

  return `
    <!-- 1. QUICK APPEARANCE CONTROLS TOOLBAR (THEME, LANGUAGE, FOCUS TOGGLE) -->
    <div class="settings-quick-bar">
      <!-- Quick Theme Toggle -->
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
          <span>${isEn ? 'Theme:' : 'Giao diện:'}</span>
        </span>
        <button type="button" id="theme-toggle-btn-settings" class="btn-secondary" onclick="toggleTheme()" style="padding:4px 10px; font-size:12px; font-weight:600;">
          <span id="theme-toggle-icon-settings">${isDark ? (isEn ? 'Light' : 'Sáng') : (isEn ? 'Dark' : 'Tối')}</span>
        </button>
      </div>

      <!-- Quick Language Switch -->
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
          <span>${isEn ? 'Language:' : 'Ngôn ngữ:'}</span>
        </span>
        <div class="settings-lang-btn-group" style="margin:0;">
          <button type="button" class="settings-lang-btn ${currentLang === 'vi' ? 'active' : ''}" style="padding:3px 8px; font-size:11.5px;" onclick="setLanguageFromSettings('vi')">VI</button>
          <button type="button" class="settings-lang-btn ${currentLang === 'en' ? 'active' : ''}" style="padding:3px 8px; font-size:11.5px;" onclick="setLanguageFromSettings('en')">EN</button>
        </div>
      </div>

      <!-- Quick Focus Dimming Switch -->
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h1m16 0h1M12 3v1m0 16v1m-6.36-13.64l.7.7m11.32 11.32l.7.7m0-12.72l-.7.7M6.34 17.66l-.7.7"/></svg>
          <span>${isEn ? 'Focus Mode:' : 'Tập trung:'}</span>
        </span>
        <label class="modern-switch" title="${t('focusDimmingTooltip')}">
          <input type="checkbox" id="focus-dimming-checkbox" ${appState.settings.focusDimming ? 'checked' : ''} onchange="toggleFocusDimming(this.checked)">
          <span class="switch-track"><span class="switch-thumb"></span></span>
        </label>
      </div>

      <!-- Quick Sort Order Switch -->
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M7 12h10M10 18h4"/></svg>
          <span>${isEn ? 'Sort:' : 'Thứ tự:'}</span>
        </span>
        <select class="form-select" style="font-size:11.5px; font-weight:600; padding:2px 6px; height:26px; border-radius:4px; max-width:140px;" onchange="updateSettingsPreference('timeSortOrder', this.value)">
          <option value="asc" ${timeSortOrder === 'asc' ? 'selected' : ''}>${isEn ? 'Asc (Early)' : 'Tăng dần (Sớm)'}</option>
          <option value="desc" ${timeSortOrder === 'desc' ? 'selected' : ''}>${isEn ? 'Desc (Late)' : 'Giảm dần (Muộn)'}</option>
        </select>
      </div>
    </div>

    <!-- 2. CARD: COLOR PALETTE (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-colors')}" id="settings-card-colors">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-colors')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19l7-7 3 3-7 7-3-3z"/><path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="M2 2l7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
            <span>${t('colorSettings')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">${isEn ? 'Event Colors' : 'Bảng màu sự kiện'}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('colorSettingsDesc')}
        </div>

        <div class="color-settings-grid">
          <div class="color-card-item">
            <div class="color-card-info">
              <div class="color-card-name">${t('tagFocusLong')}</div>
              <div id="sub-label-focus-long" style="font-size:11px; color:var(--text-muted);">${isEn ? 'Quiet & Focused' : 'Dễ tập trung'} (&ge;${threshold}${t('minShort')})</div>
              <span id="preview-badge-focusLong" class="smart-pill pill-focus-long" style="margin-top:2px; font-size:10px; width:fit-content; background:${colors.focusLong}; color:#ffffff; font-weight:700;">${isEn ? 'Preview' : 'Xem trước'}</span>
            </div>
            <input type="color" class="color-input-circle" value="${colors.focusLong}" oninput="updateColorSetting('focusLong', this.value)" onchange="updateColorSetting('focusLong', this.value)" title="${isEn ? 'Choose color' : 'Chọn màu'}">
          </div>

          <div class="color-card-item">
            <div class="color-card-info">
              <div class="color-card-name">${t('tagFocusShort')}</div>
              <div id="sub-label-focus-short" style="font-size:11px; color:var(--text-muted);">${isEn ? 'Quiet & Shallow' : 'Dễ tập trung'} (&lt;${threshold}${t('minShort')})</div>
              <span id="preview-badge-focusShort" class="smart-pill pill-focus-short" style="margin-top:2px; font-size:10px; width:fit-content; background:${colors.focusShort}; color:#ffffff; font-weight:700;">${isEn ? 'Preview' : 'Xem trước'}</span>
            </div>
            <input type="color" class="color-input-circle" value="${colors.focusShort}" oninput="updateColorSetting('focusShort', this.value)" onchange="updateColorSetting('focusShort', this.value)" title="${isEn ? 'Choose color' : 'Chọn màu'}">
          </div>

          <div class="color-card-item">
            <div class="color-card-info">
              <div class="color-card-name">${t('tagDistractLong')}</div>
              <div id="sub-label-distract-long" style="font-size:11px; color:var(--text-muted);">${isEn ? 'Noisy & Long' : 'Khó tập trung'} (&ge;${threshold}${t('minShort')})</div>
              <span id="preview-badge-distractLong" class="smart-pill pill-distract-long" style="margin-top:2px; font-size:10px; width:fit-content; background:${colors.distractLong}; color:#ffffff; font-weight:700;">${isEn ? 'Preview' : 'Xem trước'}</span>
            </div>
            <input type="color" class="color-input-circle" value="${colors.distractLong}" oninput="updateColorSetting('distractLong', this.value)" onchange="updateColorSetting('distractLong', this.value)" title="${isEn ? 'Choose color' : 'Chọn màu'}">
          </div>

          <div class="color-card-item">
            <div class="color-card-info">
              <div class="color-card-name">${t('tagDistractShort')}</div>
              <div id="sub-label-distract-short" style="font-size:11px; color:var(--text-muted);">${isEn ? 'Noisy & Short' : 'Khó tập trung'} (&lt;${threshold}${t('minShort')})</div>
              <span id="preview-badge-distractShort" class="smart-pill pill-distract-short" style="margin-top:2px; font-size:10px; width:fit-content; background:${colors.distractShort}; color:#ffffff; font-weight:700;">${isEn ? 'Preview' : 'Xem trước'}</span>
            </div>
            <input type="color" class="color-input-circle" value="${colors.distractShort}" oninput="updateColorSetting('distractShort', this.value)" onchange="updateColorSetting('distractShort', this.value)" title="${isEn ? 'Choose color' : 'Chọn màu'}">
          </div>
        </div>

        <div style="display:flex; justify-content:flex-end; margin-top:10px;">
          <button type="button" class="btn-secondary" onclick="resetDefaultColors()" style="font-size:11px; padding:4px 10px; display:inline-flex; align-items:center; gap:4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            <span>${isEn ? 'Reset Default' : 'Khôi phục mặc định'}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. CARD: FOCUS THRESHOLD & SIMULATION SANDBOX (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-threshold')}" id="settings-card-threshold">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-threshold')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${t('thresholdSettingTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="threshold-header-badge">
            ${threshold}p (${threshold === 30 ? (isEn ? 'Default' : 'Chuẩn') : (isEn ? 'Custom' : 'Tùy biến')})
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('thresholdSettingDesc')}
        </div>

        <div class="threshold-control-box">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12.5px; font-weight:700; color:var(--text-main);">${t('thresholdCurrentLabel')}</span>
            <div style="display:flex; align-items:center; gap:6px;">
              <input 
                type="number" 
                id="threshold-num-input" 
                class="threshold-number-input" 
                min="5" 
                max="180" 
                value="${threshold}" 
                onchange="updateFocusThreshold(this.value)"
                oninput="previewFocusThreshold(this.value)"
              >
              <span style="font-size:12px; font-weight:700; color:var(--primary);">${t('minShort')}</span>
            </div>
          </div>

          <div class="threshold-slider-row">
            <span style="font-size:11px; color:var(--text-muted); font-weight:600;">5p</span>
            <input 
              type="range" 
              id="threshold-range-slider" 
              class="threshold-slider" 
              min="5" 
              max="120" 
              step="5" 
              value="${threshold}" 
              oninput="previewFocusThreshold(this.value)" 
              onchange="updateFocusThreshold(this.value)"
            >
            <span style="font-size:11px; color:var(--text-muted); font-weight:600;">120p</span>
          </div>

          <div>
            <div style="font-size:11px; font-weight:600; color:var(--text-muted); margin-bottom:6px;">${t('presetLabel')}</div>
            <div class="preset-chip-list">
              <button type="button" class="preset-chip ${threshold === 15 ? 'active' : ''}" onclick="updateFocusThreshold(15)">15p</button>
              <button type="button" class="preset-chip ${threshold === 25 ? 'active' : ''}" onclick="updateFocusThreshold(25)">${t('presetPomodoro')}</button>
              <button type="button" class="preset-chip ${threshold === 30 ? 'active' : ''}" onclick="updateFocusThreshold(30)">${t('presetDefault')}</button>
              <button type="button" class="preset-chip ${threshold === 45 ? 'active' : ''}" onclick="updateFocusThreshold(45)">45p</button>
              <button type="button" class="preset-chip ${threshold === 60 ? 'active' : ''}" onclick="updateFocusThreshold(60)">${t('presetLong')}</button>
              <button type="button" class="preset-chip ${threshold === 90 ? 'active' : ''}" onclick="updateFocusThreshold(90)">${t('presetDeepWork')}</button>
            </div>
          </div>
        </div>

        <!-- Live Simulation Sandbox -->
        <div class="settings-live-sandbox settings-card-sandbox" style="margin-top:10px;">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:700; color:var(--text-primary);">
                ${isEn ? 'Simulate Duration:' : 'Thử nghiệm thời lượng:'}
              </span>
              <span id="sandbox-test-duration-val" class="settings-name-tag active">
                25 ${t('minShort')}
              </span>
            </div>
            <input 
              type="range" 
              id="sandbox-test-duration-input" 
              min="10" 
              max="120" 
              step="5" 
              value="25" 
              oninput="previewTestDuration(this.value)"
              style="width:100%; cursor:pointer; accent-color:var(--primary);"
            >
          </div>

          <div class="settings-sandbox-demo-grid">
            <div id="sandbox-sample-focus-card" class="settings-sandbox-card" style="border-left-color:${25 >= threshold ? colors.focusLong : colors.focusShort};">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <span style="font-size:12px; font-weight:700; color:var(--text-primary);">${isEn ? 'Focused Task' : 'Việc cần tập trung'}</span>
                <span id="sandbox-sample-focus-pill" class="smart-pill ${25 >= threshold ? 'pill-focus-long' : 'pill-focus-short'}" style="font-size:10px;">
                  ${25 >= threshold ? (isEn ? `≥${threshold}m` : `≥${threshold}p`) : (isEn ? `<${threshold}m` : `<${threshold}p`)}
                </span>
              </div>
            </div>

            <div id="sandbox-sample-distract-card" class="settings-sandbox-card" style="border-left-color:${25 >= threshold ? colors.distractLong : colors.distractShort};">
              <div style="display:flex; justify-content:space-between; align-items:center; gap:6px;">
                <span style="font-size:12px; font-weight:700; color:var(--text-primary);">${isEn ? 'Noisy Task' : 'Việc giờ ồn'}</span>
                <span class="smart-pill ${25 >= threshold ? 'pill-distract-long' : 'pill-distract-short'}" style="font-size:10px;">
                  ${25 >= threshold ? (isEn ? `Noisy ≥${threshold}m` : `Ồn ≥${threshold}p`) : (isEn ? `Noisy <${threshold}m` : `Ồn <${threshold}p`)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 4. CARD: FREE TIME METRIC PREFERENCE (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-free-time-mode')}" id="settings-card-free-time-mode">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-free-time-mode')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${t('freeTimeSettingsCardTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="free-time-mode-badge">
            ${freeTimeMode === 'focus' ? t('freeTimeModeFocus') : freeTimeMode === 'distract' ? t('freeTimeModeDistract') : t('freeTimeModeTotal')}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('freeTimeSettingsCardDesc')}
        </div>

        <div style="display:flex; flex-direction:column; gap:8px;">
          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px 10px; border-radius:6px; background:${freeTimeMode === 'total' ? 'var(--bg-subtle)' : 'transparent'}; border:1px solid ${freeTimeMode === 'total' ? 'var(--primary)' : 'var(--border-color)'};">
            <input type="radio" name="freeTimeDisplayModeSetting" value="total" ${freeTimeMode === 'total' ? 'checked' : ''} onchange="updateFreeTimeDisplayModeSetting('total')">
            <span style="font-size:12.5px; font-weight:600; color:var(--text-primary);">${t('freeTimeModeTotal')}</span>
          </label>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px 10px; border-radius:6px; background:${freeTimeMode === 'focus' ? 'var(--bg-subtle)' : 'transparent'}; border:1px solid ${freeTimeMode === 'focus' ? 'var(--c-focus-long, #059669)' : 'var(--border-color)'};">
            <input type="radio" name="freeTimeDisplayModeSetting" value="focus" ${freeTimeMode === 'focus' ? 'checked' : ''} onchange="updateFreeTimeDisplayModeSetting('focus')">
            <span style="font-size:12.5px; font-weight:600; color:var(--c-focus-long, #059669);">${t('freeTimeModeFocus')}</span>
          </label>

          <label style="display:flex; align-items:center; gap:10px; cursor:pointer; padding:8px 10px; border-radius:6px; background:${freeTimeMode === 'distract' ? 'var(--bg-subtle)' : 'transparent'}; border:1px solid ${freeTimeMode === 'distract' ? 'var(--c-distract-long, #d97706)' : 'var(--border-color)'};">
            <input type="radio" name="freeTimeDisplayModeSetting" value="distract" ${freeTimeMode === 'distract' ? 'checked' : ''} onchange="updateFreeTimeDisplayModeSetting('distract')">
            <span style="font-size:12.5px; font-weight:600; color:var(--c-distract-long, #d97706);">${t('freeTimeModeDistract')}</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 5. CARD: TRANSITION TIME SETTINGS (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-transition')}" id="settings-card-transition">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-transition')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${t('transitionSettingsTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="transition-header-badge">
            ${(() => {
              const tr = appState.settings?.transition || DEFAULT_DATA.settings.transition;
              const hasAny = Boolean(tr.enabledBeforeStart || tr.enabledAfterEnd);
              if (!hasAny) return isEn ? 'Disabled' : 'Đang tắt';
              const parts = [];
              if (tr.enabledBeforeStart) parts.push(isEn ? 'Before' : 'Trước');
              if (tr.enabledAfterEnd) parts.push(isEn ? 'After' : 'Sau');
              return `${tr.minutes || 10}${t('minShort')} (${parts.join(' & ')})`;
            })()}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('transitionSettingsDesc')}
        </div>

        <!-- 1. HAI TOGGLE ĐỘC LẬP: TRƯỚC VÀ SAU -->
        <div style="display:flex; flex-direction:column; gap:8px;">
          <!-- Toggle trước khi bắt đầu -->
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 12px; border-radius:8px; border:1px solid ${trans.enabledBeforeStart ? 'var(--primary)' : 'var(--border-color)'}; background:${trans.enabledBeforeStart ? 'var(--bg-subtle)' : 'transparent'}; transition:all 0.15s ease;">
            <input type="checkbox" id="transition-chk-before" ${trans.enabledBeforeStart ? 'checked' : ''} onchange="updateTransitionToggle('enabledBeforeStart', this.checked)" style="margin-top:2px;">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:13px; font-weight:700; color:var(--text-primary);">${t('transitionBeforeStartLabel')}</span>
              <span style="font-size:11.5px; color:var(--text-muted);">${t('transitionBeforeStartSub')}</span>
            </div>
          </label>

          <!-- Toggle sau khi kết thúc -->
          <label style="display:flex; align-items:flex-start; gap:10px; cursor:pointer; padding:10px 12px; border-radius:8px; border:1px solid ${trans.enabledAfterEnd ? 'var(--primary)' : 'var(--border-color)'}; background:${trans.enabledAfterEnd ? 'var(--bg-subtle)' : 'transparent'}; transition:all 0.15s ease;">
            <input type="checkbox" id="transition-chk-after" ${trans.enabledAfterEnd ? 'checked' : ''} onchange="updateTransitionToggle('enabledAfterEnd', this.checked)" style="margin-top:2px;">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:13px; font-weight:700; color:var(--text-primary);">${t('transitionAfterEndLabel')}</span>
              <span style="font-size:11.5px; color:var(--text-muted);">${t('transitionAfterEndSub')}</span>
            </div>
          </label>
        </div>

        <!-- VÙNG CẤU HÌNH CHI TIẾT (CHỈ HIỆN KHI CÓ ÍT NHẤT 1 TOGGLE BẬT) -->
        <div id="transition-details-container" style="display:${(trans.enabledBeforeStart || trans.enabledAfterEnd) ? 'flex' : 'none'}; flex-direction:column; gap:14px; margin-top:12px; border-top:1px solid var(--border-color); padding-top:14px;">
          
          <!-- 2. Ô NHẬP SỐ PHÚT CHUNG (MINUTES) -->
          <div style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px;">
            <div>
              <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${t('transitionMinutesLabel')}</div>
              <div style="font-size:11.5px; color:var(--text-muted);">${t('transitionMinutesHint')}</div>
            </div>
            <div style="display:flex; align-items:center; gap:6px;">
              <input 
                type="number" 
                id="transition-input-minutes" 
                class="form-input" 
                min="1" 
                max="120" 
                step="5" 
                value="${trans.minutes || 10}" 
                onchange="updateTransitionMinutes(this.value)" 
                oninput="updateTransitionMinutes(this.value)" 
                style="width:80px; text-align:center; padding:6px 8px; font-weight:700;"
              >
              <span style="font-size:12px; font-weight:600; color:var(--text-muted);">${t('minShort')}</span>
            </div>
          </div>

          <!-- 3. NHÓM CHECKBOX 'ÁP DỤNG CHO' -->
          <div style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:12.5px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
              ${t('transitionApplyToTitle')}
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="transition-apply-task" ${trans.applyTo?.task ? 'checked' : ''} onchange="updateTransitionApplyTo('task', this.checked)">
                <span>${t('transitionApplyToTask')}</span>
              </label>

              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="transition-apply-fixed" ${trans.applyTo?.fixed ? 'checked' : ''} onchange="updateTransitionApplyTo('fixed', this.checked)">
                <span>${t('transitionApplyToFixed')}</span>
              </label>

              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12.5px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="transition-apply-transient" ${trans.applyTo?.transient ? 'checked' : ''} onchange="updateTransitionApplyTo('transient', this.checked)">
                <span>${t('transitionApplyToTransient')}</span>
              </label>
            </div>
          </div>

          <!-- 4. XỬ LÝ KHI HAI SỰ KIỆN LIỀN KỀ ĐỀU CÓ TRANSITION (CONFLICT MODE) -->
          <div style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:12.5px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
              ${t('transitionConflictTitle')}
            </div>
            <div style="display:flex; flex-direction:column; gap:8px;">
              <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:12.5px; color:var(--text-primary);">
                <input type="radio" name="transitionConflictMode" value="max" ${trans.conflictMode !== 'sum' ? 'checked' : ''} onchange="updateTransitionConflictMode('max')" style="margin-top:2px;">
                <span>${t('transitionConflictMax')}</span>
              </label>
              <label style="display:flex; align-items:flex-start; gap:8px; cursor:pointer; font-size:12.5px; color:var(--text-primary);">
                <input type="radio" name="transitionConflictMode" value="sum" ${trans.conflictMode === 'sum' ? 'checked' : ''} onchange="updateTransitionConflictMode('sum')" style="margin-top:2px;">
                <span>${t('transitionConflictSum')}</span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- CARD: CHUỖI KỶ LUẬT & NGƯỠNG HOÀN THÀNH -->
    <div class="settings-card ${getCardCollapseClass('settings-card-streak')}" id="settings-card-streak">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-streak')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            <span>${t('streakSettingsCardTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">
            ${Math.round((appState?.settings?.streak?.threshold || 0.7) * 100)}%
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('streakSettingsCardDesc')}
        </div>

        <!-- Global Standard Threshold -->
        <div style="margin-bottom:16px; padding:12px; background:var(--bg-card-sub, var(--bg-hover)); border-radius:8px; border:1px solid var(--border-color);">
          <div style="font-size:12.5px; font-weight:700; color:var(--text-main); margin-bottom:8px;">
            ${t('streakGlobalThresholdLabel')}
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <select 
              class="form-select" 
              style="max-width:220px; font-size:12.5px; font-weight:600;" 
              onchange="updateStreakGlobalThreshold(this.value)"
              ${!(new Date().getDay() === 0) ? 'disabled title="' + t('streakSundayOnlyAlert') + '" style="opacity:0.6; cursor:not-allowed;"' : ''}
            >
              <option value="0.5" ${Math.abs((appState?.settings?.streak?.threshold || 0.7) - 0.5) < 0.01 ? 'selected' : ''}>${t('streakLevel50')}</option>
              <option value="0.7" ${Math.abs((appState?.settings?.streak?.threshold || 0.7) - 0.7) < 0.01 ? 'selected' : ''}>${t('streakLevel70')}</option>
              <option value="0.8" ${Math.abs((appState?.settings?.streak?.threshold || 0.7) - 0.8) < 0.01 ? 'selected' : ''}>${t('streakLevel80')}</option>
              <option value="1.0" ${Math.abs((appState?.settings?.streak?.threshold || 0.7) - 1.0) < 0.01 ? 'selected' : ''}>${t('streakLevel100')}</option>
            </select>
            ${!(new Date().getDay() === 0) ? `<span style="font-size:11.5px; color:#ea580c; font-weight:600; display:inline-flex; align-items:center; gap:4px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>${t('streakSundayOnlyAlert')}</span>` : ''}
          </div>
        </div>

        <!-- 7 Weekday Rows (CN - T7) -->
        <div>
          <div style="font-size:12.5px; font-weight:700; color:var(--text-main); margin-bottom:8px;">
            ${t('streakWeekdayThresholdsLabel')}
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            ${[0, 1, 2, 3, 4, 5, 6].map(dow => {
              const dayNamesVi = ['Chủ Nhật (CN)', 'Thứ Hai (T2)', 'Thứ Ba (T3)', 'Thứ Tư (T4)', 'Thứ Năm (T5)', 'Thứ Sáu (T6)', 'Thứ Bảy (T7)'];
              const dayNamesEn = ['Sunday (Sun)', 'Monday (Mon)', 'Tuesday (Tue)', 'Wednesday (Wed)', 'Thursday (Thu)', 'Friday (Fri)', 'Saturday (Sat)'];
              const dayName = isEn ? dayNamesEn[dow] : dayNamesVi[dow];
              const wVal = appState?.settings?.streak?.weekdayThresholds?.[dow];
              return `
                <div style="display:flex; align-items:center; justify-content:space-between; padding:6px 10px; background:var(--bg-card-sub, var(--bg-hover)); border-radius:6px;">
                  <span style="font-size:12px; font-weight:600; color:var(--text-main); width:140px;">${dayName}</span>
                  <select class="form-select" style="max-width:180px; font-size:11.5px; font-weight:600; padding:3px 6px; height:28px;" onchange="updateWeekdayThreshold(${dow}, this.value)">
                    <option value="" ${wVal === null || wVal === undefined ? 'selected' : ''}>${t('streakStandardOption')}</option>
                    <option value="0.5" ${wVal === 0.5 ? 'selected' : ''}>${t('streakLevel50')}</option>
                    <option value="0.7" ${wVal === 0.7 ? 'selected' : ''}>${t('streakLevel70')}</option>
                    <option value="0.8" ${wVal === 0.8 ? 'selected' : ''}>${t('streakLevel80')}</option>
                    <option value="1.0" ${wVal === 1.0 ? 'selected' : ''}>${t('streakLevel100')}</option>
                  </select>
                </div>
              `;
            }).join('')}
          </div>
        </div>
      </div>
    </div>



    <!-- CARD: NOTIFICATION SETTINGS -->
    <div class="settings-card ${getCardCollapseClass('settings-card-notifications')}" id="settings-card-notifications">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-notifications')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
            <span>${isEn ? 'Notification Management' : 'Quản lý Thông báo'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="notification-header-badge">
            ${(() => {
              const eOn = appState.settings.notifyEisenhower !== false;
              const fOn = appState.settings.notifyFixed !== false;
              const tOn = appState.settings.notifyTransient !== false;
              const isEnabled = appState.settings.notificationsEnabled !== false;
              if (isEnabled && eOn && fOn && tOn) return isEn ? 'All Enabled' : 'Bật tất cả';
              if (isEnabled && (eOn || fOn || tOn)) return isEn ? 'Custom' : 'Tùy chọn';
              return isEn ? 'Disabled' : 'Đang tắt';
            })()}
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Configure browser notifications for scheduled events. Notifications are native browser alerts (not popups in the app).' 
            : 'Cấu hình thông báo trình duyệt cho các sự kiện. Đây là thông báo trực tiếp từ trình duyệt (Notification API), không phải là popup trong app.'}
        </div>

        <div style="display:flex; flex-direction:column; gap:14px;">
          <!-- 1. Trạng thái quyền thông báo trình duyệt -->
          <div style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color); display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:8px;">
            <div style="display:flex; flex-direction:column; gap:2px;">
              <span style="font-size:12px; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                ${isEn ? 'Browser Push Permission:' : 'Quyền thông báo trình duyệt:'}
              </span>
              <span style="font-size:11px; color:var(--text-muted);" id="browser-permission-status-text">
                ${(() => {
                  if (typeof window === 'undefined' || !('Notification' in window)) {
                    return isEn ? 'Not supported in this browser' : 'Trình duyệt không hỗ trợ thông báo';
                  }
                  const inIframe = typeof window !== 'undefined' && window.self !== window.top;
                  if (Notification.permission === 'granted') {
                    return isEn ? '✓ Permission granted (OS notifications active)' : '✓ Đã cấp quyền (Thông báo hệ thống đang hoạt động)';
                  }
                  if (Notification.permission === 'denied') {
                    return isEn ? '✕ Blocked by browser settings' : '✕ Bị chặn trong cài đặt trình duyệt';
                  }
                  if (inIframe) {
                    return isEn ? 'iFrame Preview mode (Click "Open New Tab" for OS alerts)' : 'Chế độ xem trước iFrame (Bấm "Mở tab mới" để nhận pop-up OS)';
                  }
                  return isEn ? 'Not yet requested' : 'Chưa cấp quyền';
                })()}
              </span>
            </div>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button type="button" class="btn-secondary" onclick="requestBrowserNotificationPermission()" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:5px;">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                ${isEn ? 'Request Permission' : 'Cấp quyền thông báo'}
              </button>
              <a href="${typeof window !== 'undefined' ? window.location.href : '#'}" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:5px; text-decoration:none; color:inherit;" title="${isEn ? 'Open app in a new tab for native OS pop-up notifications' : 'Mở ứng dụng ở tab mới để nhận thông báo pop-up hệ thống trực tiếp'}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                ${isEn ? 'Open New Tab' : 'Mở tab mới'}
              </a>
              <button type="button" class="btn-secondary" onclick="testBrowserNotification()" style="font-size:11px; padding:5px 10px; display:inline-flex; align-items:center; gap:5px;" title="${isEn ? 'Send a test browser notification' : 'Gửi thử thông báo trình duyệt'}">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                ${isEn ? 'Test Alert' : 'Gửi thử'}
              </button>
            </div>
          </div>

          <!-- 2. Nhóm sự kiện nhận thông báo (Các dấu tích Checkbox) -->
          <div style="background:var(--bg-subtle); padding:10px 12px; border-radius:8px; border:1px solid var(--border-color);">
            <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:8px;">
              ${isEn ? 'Select Event Categories to Notify:' : 'Bật / Tắt thông báo theo nhóm sự kiện:'}
            </div>

            <!-- TẤT CẢ (ALL) -->
            <label style="display:flex; align-items:center; gap:8px; padding:6px 8px; border-radius:6px; cursor:pointer; font-size:12.5px; font-weight:700; color:var(--primary); background:rgba(var(--primary-rgb, 59, 130, 246), 0.08); margin-bottom:6px;">
              <input type="checkbox" id="noti-chk-all" ${(appState.settings.notificationsEnabled !== false && appState.settings.notifyEisenhower !== false && appState.settings.notifyFixed !== false && appState.settings.notifyTransient !== false) ? 'checked' : ''} onchange="toggleNotificationGroup('all', this.checked)">
              <span>${isEn ? 'All Event Types (Automatically selects all groups)' : 'Tất cả các nhóm sự kiện (Tự động chọn tất cả)'}</span>
            </label>

            <div style="display:flex; flex-direction:column; gap:6px; padding-left:14px; border-left:2px solid var(--border-color); margin-left:8px;">
              <!-- 1. Eisenhower Tasks -->
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="noti-chk-eisenhower" ${(appState.settings.notificationsEnabled !== false && appState.settings.notifyEisenhower !== false) ? 'checked' : ''} onchange="toggleNotificationGroup('eisenhower', this.checked)">
                <span>${isEn ? 'Eisenhower Tasks (Scheduled tasks from matrix)' : 'Công việc Ma trận Eisenhower (Các task đã xếp lịch)'}</span>
              </label>

              <!-- 2. Fixed Events -->
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="noti-chk-fixed" ${(appState.settings.notificationsEnabled !== false && appState.settings.notifyFixed !== false) ? 'checked' : ''} onchange="toggleNotificationGroup('fixed', this.checked)">
                <span>${isEn ? 'Fixed Events (Recurring & fixed routines)' : 'Sự kiện cố định (Lịch trình sinh hoạt & làm việc cố định)'}</span>
              </label>

              <!-- 3. Transient / Unexpected Events -->
              <label style="display:flex; align-items:center; gap:8px; cursor:pointer; font-size:12px; font-weight:500; color:var(--text-primary);">
                <input type="checkbox" id="noti-chk-transient" ${(appState.settings.notificationsEnabled !== false && appState.settings.notifyTransient !== false) ? 'checked' : ''} onchange="toggleNotificationGroup('transient', this.checked)">
                <span>${isEn ? 'Unexpected / Ad-hoc Events (Transient items)' : 'Sự kiện bất ngờ / đột xuất (Phát sinh trong ngày)'}</span>
              </label>
            </div>
          </div>

          <!-- 3. Cài đặt số phút báo trước & thời gian hiển thị popup -->
          <div style="display:flex; flex-direction:column; gap:8px;">
            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <span style="font-size:12px; font-weight:600;">${isEn ? 'Start Notice (Minutes before start):' : 'Báo trước khi sự kiện bắt đầu:'}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" min="0" max="60" step="1" value="${appState.settings.startNoticeMinutes ?? 5}" onchange="updateNotificationSetting('startNoticeMinutes', parseInt(this.value, 10))" style="width: 60px; padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-main); font-size: 12px; text-align: center;">
                <span style="font-size: 11px; color: var(--text-muted);">${t('minShort')}</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <span style="font-size:12px; font-weight:600;">${isEn ? 'End Notice (Minutes before end):' : 'Báo trước khi sự kiện kết thúc:'}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" min="0" max="60" step="1" value="${appState.settings.endNoticeMinutes ?? 5}" onchange="updateNotificationSetting('endNoticeMinutes', parseInt(this.value, 10))" style="width: 60px; padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-main); font-size: 12px; text-align: center;">
                <span style="font-size: 11px; color: var(--text-muted);">${t('minShort')}</span>
              </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; background:var(--bg-subtle); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color);">
              <span style="font-size:12px; font-weight:600;">${isEn ? 'Popup On-Screen Duration:' : 'Thời gian xuất hiện popup trên màn hình:'}</span>
              <div style="display:flex; align-items:center; gap:6px;">
                <input type="number" min="2" max="60" step="1" value="${appState.settings.popupDurationSeconds ?? 8}" onchange="updateNotificationSetting('popupDurationSeconds', Math.max(2, Math.min(60, parseInt(this.value, 10) || 8)))" style="width: 60px; padding: 3px 6px; border: 1px solid var(--border-color); border-radius: 4px; background: var(--bg-card); color: var(--text-main); font-size: 12px; text-align: center;">
                <span style="font-size: 11px; color: var(--text-muted);">${isEn ? 'sec' : 'giây'}</span>
              </div>
            </div>
          </div>

          <!-- 4. THỬ NGHIỆM THÔNG BÁO GIẢ LẬP (TEST NOTIFICATIONS SIMULATOR) -->
          <div style="background:var(--bg-subtle); padding:12px; border-radius:8px; border:1px solid var(--border-color); display:flex; flex-direction:column; gap:10px;">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <span style="font-size:12px; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2v7.31M14 9.3V1.99M8.5 2h7M14 9.3a6.5 6.5 0 1 1-4 0"/></svg>
                ${isEn ? 'Notification Simulator (Test Alerts):' : 'Thử nghiệm thông báo giả lập:'}
              </span>
              <span style="font-size:11px; color:var(--text-muted);">
                ${isEn ? 'Interactive Preview' : 'Xem & bắn thử thông báo'}
              </span>
            </div>

            <div style="font-size:11.5px; color:var(--text-muted); line-height:1.45;">
              ${isEn 
                ? 'Click any scenario below to trigger a simulated browser notification so you can see how it looks and works in real-time:' 
                : 'Bấm vào một trong các kịch bản dưới đây để gửi thử thông báo giả lập tới trình duyệt của bạn, giúp bạn thấy chính xác cách hệ thống thông báo khi có sự kiện thực tế:'}
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(130px, 1fr)); gap:8px;">
              <!-- Nút Kịch bản 1: Có khoảng trống -->
              <button type="button" class="btn-secondary" onclick="testBrowserNotification('gap')" style="padding:7px 8px; font-size:11px; display:flex; flex-direction:column; align-items:flex-start; gap:3px; text-align:left; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); cursor:pointer;">
                <div style="display:flex; align-items:center; gap:5px; font-weight:700; color:var(--primary);">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                  <span>${isEn ? '1. Free Gap' : '1. Có thời gian rảnh'}</span>
                </div>
                <span style="font-size:10px; color:var(--text-muted); line-height:1.2;">
                  ${isEn ? 'Ending + Free time + Next event' : 'Kết thúc + Rảnh + Sự kiện kế'}
                </span>
              </button>

              <!-- Nút Kịch bản 2: Liền nhau -->
              <button type="button" class="btn-secondary" onclick="testBrowserNotification('adjacent')" style="padding:7px 8px; font-size:11px; display:flex; flex-direction:column; align-items:flex-start; gap:3px; text-align:left; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); cursor:pointer;">
                <div style="display:flex; align-items:center; gap:5px; font-weight:700; color:var(--primary);">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  <span>${isEn ? '2. Adjacent' : '2. Liền nhau'}</span>
                </div>
                <span style="font-size:10px; color:var(--text-muted); line-height:1.2;">
                  ${isEn ? 'Ending + Immediate next event' : 'Kết thúc + Sự kiện kế ngay sau'}
                </span>
              </button>

              <!-- Nút Kịch bản 3: Sắp bắt đầu -->
              <button type="button" class="btn-secondary" onclick="testBrowserNotification('start')" style="padding:7px 8px; font-size:11px; display:flex; flex-direction:column; align-items:flex-start; gap:3px; text-align:left; border:1px solid var(--border-color); border-radius:6px; background:var(--bg-card); cursor:pointer;">
                <div style="display:flex; align-items:center; gap:5px; font-weight:700; color:var(--primary);">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
                  <span>${isEn ? '3. Start Reminder' : '3. Sắp bắt đầu'}</span>
                </div>
                <span style="font-size:10px; color:var(--text-muted); line-height:1.2;">
                  ${isEn ? 'Event starting notice' : 'Báo trước khi bắt đầu'}
                </span>
              </button>
            </div>

            <!-- Mô tả cấu trúc hoạt động -->
            <div style="background:var(--bg-card); border:1px dashed var(--border-color); border-radius:6px; padding:8px 10px; font-size:11px; color:var(--text-muted); line-height:1.45;">
              <div style="font-weight:600; color:var(--text-primary); margin-bottom:2px; display:flex; align-items:center; gap:4px;">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                <span>${isEn ? 'How it works on your device:' : 'Cơ chế hoạt động trên thiết bị:'}</span>
              </div>
              <div>• ${isEn ? 'Notifications appear as native system popups from your operating system/browser even when you are working in other tabs or apps.' : 'Thông báo hiển thị dưới dạng pop-up của trình duyệt/hệ điều hành, xuất hiện ngay cả khi bạn đang làm việc trên tab khác hoặc phần mềm khác.'}</div>
              <div>• ${isEn ? 'When an event is ending, it automatically checks whether a free slot follows or if the next task begins immediately.' : 'Khi sự kiện sắp kết thúc, hệ thống tự động kiểm tra xem sau đó là thời gian rảnh (kèm tính chất ồn ào/không ồn) hay có sự kiện liền kề để nhắc việc kế tiếp.'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 5. CARD: FOCUS DIMMING BLUR ADJUSTMENT (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-focus-dimming')}" id="settings-card-focus-dimming">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-focus-dimming')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M3 12h1m16 0h1M12 3v1m0 16v1m-6.36-13.64l.7.7m11.32 11.32l.7.7m0-12.72l-.7.7M6.34 17.66l-.7.7"/></svg>
            <span>${t('focusDimmingTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="focus-blur-val-badge">
            ${appState.settings.focusBlurPx || 6}px (${getBlurLabel(appState.settings.focusBlurPx || 6, isEn)})
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('focusDimmingDesc')}
        </div>

        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; font-weight:600; color:var(--text-primary);">
            <span>${isEn ? 'Adjust Blur Radius (1px - 10px):' : 'Tùy chỉnh độ nhòe / mờ (1px - 10px):'}</span>
            <span id="focus-blur-numeric" style="color:var(--primary); font-weight:700;">${appState.settings.focusBlurPx || 6}px</span>
          </div>
          <input type="range" min="1" max="10" step="1" value="${appState.settings.focusBlurPx || 6}" id="focus-blur-slider" oninput="updateFocusBlurLevel(this.value)" style="width:100%; cursor:pointer; accent-color:var(--primary);">
          
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:2px;">
            <button type="button" class="preset-chip ${Number(appState.settings.focusBlurPx) === 2 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateFocusBlurLevel(2)">2px</button>
            <button type="button" class="preset-chip ${Number(appState.settings.focusBlurPx) === 4 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateFocusBlurLevel(4)">4px</button>
            <button type="button" class="preset-chip ${Number(appState.settings.focusBlurPx) === 6 || !appState.settings.focusBlurPx ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateFocusBlurLevel(6)">6px (${isEn ? 'Standard' : 'Chuẩn'})</button>
            <button type="button" class="preset-chip ${Number(appState.settings.focusBlurPx) === 8 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateFocusBlurLevel(8)">8px</button>
            <button type="button" class="preset-chip ${Number(appState.settings.focusBlurPx) === 10 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateFocusBlurLevel(10)">10px</button>
          </div>
        </div>

        <div style="margin-top:8px;">
          <div id="focus-preview-dimmed-card" class="focus-preview-dimmed" style="background:var(--bg-subtle); border:1px solid var(--border-color); border-left:4px solid var(--primary); border-radius:6px; padding:6px 10px; opacity:0.25; filter:blur(${appState.settings.focusBlurPx || 6}px); transition:all 0.2s ease; cursor:pointer;" title="${isEn ? 'Hover to unblur' : 'Rê chuột để thử bỏ mờ'}">
            <span style="font-size:11px; font-weight:600; color:var(--text-primary);">16:00 - 17:00 • ${isEn ? 'Sample Dimmed Event (Hover to test)' : 'Sự kiện mẫu làm mờ (Rê chuột để thử)'}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 6. CARD: SYSTEM FONT SIZE (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-font-size')}" id="settings-card-font-size">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-font-size')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/></svg>
            <span>${t('fontSizeTitle')}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" id="font-size-val-badge">
            ${appState.settings.fontSizePercent || 100}%
          </span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${t('fontSizeDesc')}
        </div>

        <div style="display:flex; flex-direction:column; gap:6px;">
          <div style="display:flex; justify-content:space-between; align-items:center; font-size:11.5px; font-weight:600; color:var(--text-primary);">
            <span>${t('fontSizeSliderLabel')}</span>
            <span id="font-size-numeric" style="color:var(--primary); font-weight:700;">${appState.settings.fontSizePercent || 100}%</span>
          </div>
          <div style="display:flex; align-items:center; gap:10px;">
            <span style="font-size:10px; font-weight:700; color:var(--text-muted);">80%</span>
            <input 
              type="range" 
              min="80" 
              max="130" 
              step="5" 
              value="${appState.settings.fontSizePercent || 100}" 
              id="font-size-range-slider" 
              oninput="previewSystemFontSize(this.value)" 
              onchange="updateSystemFontSize(this.value)"
              style="width:100%; cursor:pointer; accent-color:var(--primary);"
            >
            <span style="font-size:10px; font-weight:700; color:var(--text-muted);">130%</span>
          </div>
          
          <div style="display:flex; gap:6px; flex-wrap:wrap; margin-top:2px;">
            <button type="button" class="preset-chip ${Number(appState.settings.fontSizePercent) === 85 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateSystemFontSize(85)">${t('fontSizePresetSmall')}</button>
            <button type="button" class="preset-chip ${Number(appState.settings.fontSizePercent) === 100 || !appState.settings.fontSizePercent ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateSystemFontSize(100)">${t('fontSizePresetDefault')}</button>
            <button type="button" class="preset-chip ${Number(appState.settings.fontSizePercent) === 115 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateSystemFontSize(115)">${t('fontSizePresetLarge')}</button>
            <button type="button" class="preset-chip ${Number(appState.settings.fontSizePercent) === 130 ? 'active' : ''}" style="padding:2px 8px; font-size:11px;" onclick="updateSystemFontSize(130)">${t('fontSizePresetXLarge')}</button>
          </div>

          <!-- Live Preview Interface -->
          <div id="font-size-live-preview-box" class="settings-sandbox-card" style="margin-top:10px; border-left:3px solid var(--primary); padding:10px 12px; background:var(--bg-subtle);">
            <div class="preview-text-header" style="font-weight:700; font-size:calc(13px * var(--font-scale, 1)); color:var(--text-primary); margin-bottom:3px;">
              ${isEn ? 'Typography Live Preview' : 'Xem Trước Trực Quan Cỡ Chữ'}
            </div>
            <div class="preview-text-body" style="font-size:calc(12px * var(--font-scale, 1)); color:var(--text-main); line-height:1.45; margin-bottom:4px;">
              ${isEn ? 'This is an interactive demonstration of how timeline tasks, matrix cards, and dialog texts scale smoothly.' : 'Đây là bản mô phỏng trực tiếp cách các thẻ công việc timeline, ma trận và hộp thoại co giãn chữ.'}
            </div>
            <div class="preview-text-meta" style="font-size:calc(11px * var(--font-scale, 1)); color:var(--text-muted); font-weight:600;">
              ${isEn ? 'Scale factor: ' : 'Hệ số tỉ lệ: '} <span id="font-size-preview-factor">${((appState.settings.fontSizePercent || 100) / 100).toFixed(2)}x</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 7. CARD: STARTUP & WORKSPACE PREFERENCES (EXPANDED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-startup-pref', true)}" id="settings-card-startup-pref">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-startup-pref')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            <span>${isEn ? 'Startup & Workspace Defaults' : 'Tùy Chọn Khởi Chạy & Lịch Biểu'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">${timeSortOrder === 'asc' ? (isEn ? 'Earliest First' : 'Sớm nhất trước') : (isEn ? 'Latest First' : 'Muộn nhất trước')}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Customize initial startup view, default task duration and timeline span.' 
            : 'Thiết lập chế độ xem mặc định và thời lượng tiêu chuẩn khi tạo công việc mới.'}
        </div>

        <div class="settings-pref-grid">
          <div class="settings-pref-item">
            <label style="font-size:11.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Default Startup View:' : 'Chế độ xem mặc định:'}</label>
            <select class="form-select" style="font-size:12px; font-weight:600; padding:4px 8px;" onchange="updateSettingsPreference('defaultStartupView', this.value)">
              <option value="day" ${defaultStartupView === 'day' ? 'selected' : ''}>${isEn ? 'Day (Timeline 24h)' : 'Ngày (Timeline 24h)'}</option>
              <option value="eisenhower" ${defaultStartupView === 'eisenhower' ? 'selected' : ''}>${isEn ? 'Eisenhower Matrix' : 'Ma Trận Eisenhower'}</option>
              <option value="month" ${defaultStartupView === 'month' ? 'selected' : ''}>${isEn ? 'Month View' : 'Xem Tháng'}</option>
              <option value="year" ${defaultStartupView === 'year' ? 'selected' : ''}>${isEn ? 'Year View' : 'Xem Năm'}</option>
            </select>
          </div>

          <div class="settings-pref-item">
            <label style="font-size:11.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Default Task Duration:' : 'Thời lượng task mặc định:'}</label>
            <select class="form-select" style="font-size:12px; font-weight:600; padding:4px 8px;" onchange="updateSettingsPreference('defaultTaskDuration', this.value)">
              <option value="15" ${defaultDuration === 15 ? 'selected' : ''}>15 ${t('minShort')}</option>
              <option value="25" ${defaultDuration === 25 ? 'selected' : ''}>25 ${t('minShort')} (Pomodoro)</option>
              <option value="30" ${defaultDuration === 30 ? 'selected' : ''}>30 ${t('minShort')} (${isEn ? 'Standard' : 'Chuẩn'})</option>
              <option value="45" ${defaultDuration === 45 ? 'selected' : ''}>45 ${t('minShort')}</option>
              <option value="60" ${defaultDuration === 60 ? 'selected' : ''}>60 ${t('minShort')} (1h)</option>
            </select>
          </div>

          <div class="settings-pref-item">
            <label style="font-size:11.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Timeline Multi-day Span:' : 'Số ngày hiển thị timeline:'}</label>
            <select class="form-select" style="font-size:12px; font-weight:600; padding:4px 8px;" onchange="updateSettingsPreference('timelineDaySpan', this.value)">
              <option value="1" ${timelineDaySpan === 1 ? 'selected' : ''}>1 ${isEn ? 'Day' : 'Ngày'}</option>
              <option value="3" ${timelineDaySpan === 3 ? 'selected' : ''}>3 ${isEn ? 'Days' : 'Ngày'}</option>
              <option value="7" ${timelineDaySpan === 7 ? 'selected' : ''}>7 ${isEn ? 'Days (Week)' : 'Ngày (Tuần)'}</option>
            </select>
          </div>

          <div class="settings-pref-item">
            <label style="font-size:11.5px; font-weight:700; color:var(--text-primary);">${t('sortOrderLabel')}</label>
            <select class="form-select" style="font-size:12px; font-weight:600; padding:4px 8px;" onchange="updateSettingsPreference('timeSortOrder', this.value)">
              <option value="asc" ${timeSortOrder === 'asc' ? 'selected' : ''}>${t('sortOrderAsc')}</option>
              <option value="desc" ${timeSortOrder === 'desc' ? 'selected' : ''}>${t('sortOrderDesc')}</option>
            </select>
            <div style="font-size:10.5px; color:var(--text-muted); margin-top:3px; line-height:1.4;">
              ${isEn 
                ? 'Events & scheduled tasks are ordered by time; unscheduled items follow creation order.' 
                : 'Sự kiện & task đã xếp lịch theo mốc thời gian; việc chưa gán mốc thời gian hiển thị theo thứ tự thêm vào.'}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 8. CARD: HỖ TRỢ GIAO DIỆN MOBILE (TRỢ NĂNG DI ĐỘNG) -->
    <div class="settings-card ${getCardCollapseClass('settings-card-mobile-assist', true)}" id="settings-card-mobile-assist">
      <div class="settings-card-header" onclick="toggleSettingsCard('settings-card-mobile-assist')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
              <line x1="12" y1="18" x2="12.01" y2="18"></line>
            </svg>
            <span>${isEn ? 'Mobile Interface Assistance' : 'Hỗ Trợ Giao Diện Mobile'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag ${assistEnabled ? 'active' : ''}">${assistEnabled ? (isEn ? 'Enabled' : 'Đang bật') : (isEn ? 'Disabled' : 'Đang tắt')}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body" style="display:flex; flex-direction:column; gap:12px;">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'Customize the floating action button (FAB) and instant shortcuts for mobile screens. This setting only affects mobile devices and does not alter the desktop view.' 
            : 'Tùy biến nút thao tác nổi (FAB) và các phím tắt nhanh trên điện thoại. Cài đặt này chỉ áp dụng khi truy cập bằng thiết bị di động, hoàn toàn không ảnh hưởng máy tính.'}
        </div>

        <!-- Master Switch -->
        <div class="sync-toggle-row" style="padding:10px 12px; background:var(--bg-subtle); border-radius:8px; border:1px solid var(--border-subtle);">
          <div class="sync-toggle-text">
            <div style="font-size:12.5px; font-weight:700; color:var(--text-primary);">${isEn ? 'Enable Mobile Quick Actions FAB' : 'Bật nút thao tác nhanh nổi trên mobile'}</div>
            <div style="font-size:11px; color:var(--text-secondary); margin-top:2px;">
              ${isEn 
                ? 'Displays a floating circle button pinned above the bottom navigation bar for 1-tap quick actions.' 
                : 'Hiển thị nút tròn nổi ở góc dưới màn hình điện thoại, nằm trên nút cài đặt của thanh điều hướng đáy để thao tác 1 chạm.'}
            </div>
          </div>
          <label class="modern-switch" title="${isEn ? 'Toggle mobile assist' : 'Bật / Tắt nút nổi mobile'}">
            <input type="checkbox" id="mobile-assist-master-switch" ${assistEnabled ? 'checked' : ''} onchange="toggleMobileAssistMaster(this.checked)">
            <span class="switch-track"><span class="switch-thumb"></span></span>
          </label>
        </div>

        <!-- Individual Shortcut Toggles -->
        <div id="mobile-assist-shortcuts-block" style="display:${assistEnabled ? 'flex' : 'none'}; flex-direction:column; gap:8px; margin-top:2px;">
          <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-top:4px;">
            ${isEn ? 'Select shortcuts to display in mobile quick menu:' : 'Chọn các phím tắt hiển thị trong menu nổi:'}
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Accessibility & System Tools (Focus, Theme, Language)' : 'Bộ phím trợ năng (Tập trung, Sáng - Tối, Ngôn ngữ)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.accessibilityTools !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('accessibilityTools', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Instant Sync (Google Drive / Calendar)' : 'Đồng bộ tức thì (Google Drive / Calendar)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.sync !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('sync', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Switch Sync Target (GDrive ⇄ GCal)' : 'Nút chuyển mục tiêu đồng bộ (GDrive ⇄ GCal)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.syncSwitch !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('syncSwitch', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'New Task (Eisenhower Matrix)' : 'Thêm công việc mới (Eisenhower Task)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.newTask !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('newTask', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Transient Event (Ad-hoc)' : 'Thêm việc đột xuất (Transient Event)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.transientEvent !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('transientEvent', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Fixed Routine Event' : 'Thêm việc cố định (Fixed Routine)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.fixedEvent !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('fixedEvent', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Daily Note' : 'Thêm ghi chú ngày (Daily Note)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.dailyNote !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('dailyNote', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>

          <div class="sync-toggle-row" style="padding:8px 10px; background:var(--bg-card); border-radius:6px; border:1px solid var(--border-subtle);">
            <div class="sync-toggle-text">
              <span style="font-size:12px; font-weight:600; color:var(--text-primary);">${isEn ? 'Auto-Match All Tasks to Timeline' : 'Tự động xếp lịch (Auto-Match All Tasks)'}</span>
            </div>
            <label class="modern-switch">
              <input type="checkbox" ${shortcuts.autoMatch !== false ? 'checked' : ''} onchange="updateMobileAssistShortcut('autoMatch', this.checked)">
              <span class="switch-track"><span class="switch-thumb"></span></span>
            </label>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderSettingsDataManagementHtml() {
  const isEn = appState.settings.lang === 'en';
  const noisy = (appState.settings.noisyIntervals || []).filter(n => !n.deleted);
  const fixedCount = (appState.fixedEvents || []).filter(f => !f.deleted).length;
  const transientCount = (appState.transientEvents || []).filter(tr => !tr.deleted).length;

  return `
    <!-- 1. QUICK DATA STATS & ACTION TOOLBAR -->
    <div class="settings-quick-bar">
      <div class="settings-quick-group">
        <span class="settings-quick-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${isEn ? 'Storage Stats:' : 'Dữ liệu:'}</span>
        </span>
        <span class="settings-name-tag active">${(appState.tasks || []).filter(t => !t.deleted).length} Tasks • ${fixedCount + transientCount} ${isEn ? 'Events' : 'Sự kiện'}</span>
      </div>

      <div class="settings-quick-group">
        <button class="btn-primary" onclick="confirmExportData()" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:5px;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          <span>${t('exportBtn')}</span>
        </button>
        <label class="btn-secondary" style="font-size:12px; padding:5px 12px; cursor:pointer; display:inline-flex; align-items:center; gap:5px; margin:0;">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          <span>${t('importBtn')}</span>
          <input type="file" accept=".json" style="display:none;" onchange="handleFileSelectForImport(event)">
        </label>
        <button class="btn-secondary" style="color:#ef4444; border-color:rgba(239,68,68,0.3); font-size:11.5px; padding:5px 10px;" onclick="confirmResetToDefaultData()" title="${t('resetBtn')}">
          <span>${isEn ? 'Wipe & Reset' : 'Xóa trắng'}</span>
        </button>
      </div>
    </div>

    <!-- 2. CARD: LOCAL STORAGE BACKUP DETAILS (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('data-card-backup')}" id="data-card-backup">
      <div class="settings-card-header" onclick="toggleSettingsCard('data-card-backup')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
            <span>${isEn ? 'Backup & Restore Local Data (.JSON)' : 'Sao Lưu & Phục Hồi Dữ Liệu Cục Bộ (.JSON)'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag">100% Offline LocalStorage</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn 
            ? 'All your tasks, events, and notes remain 100% private in browser LocalStorage. Export a JSON backup anytime to transfer data between devices.' 
            : 'Tất cả dữ liệu được lưu hoàn toàn trong trình duyệt (LocalStorage). Xuất file sao lưu JSON bất cứ lúc nào để chuyển dữ liệu sang thiết bị khác.'}
        </div>

        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <span class="settings-name-tag">${(appState.tasks || []).filter(t => !t.deleted).length} Task</span>
          <span class="settings-name-tag">${fixedCount + transientCount} ${isEn ? 'Events' : 'Sự kiện'}</span>
          <span class="settings-name-tag">${(appState.notes || []).filter(n => !n.deleted).length} ${isEn ? 'Notes' : 'Ghi chú'}</span>
          <span class="settings-name-tag">${noisy.length} ${isEn ? 'Noisy Windows' : 'Giờ ồn'}</span>
        </div>

        <!-- DỌN DẸP BẢN GHI ĐÃ XÓA MỀM CŨ HƠN 90 NGÀY -->
        <div style="margin-top:14px; padding-top:14px; border-top:1px dashed var(--border-color); display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:10px;">
          <div>
            <div style="font-size:12.5px; font-weight:700; color:var(--text-main);">
              ${isEn ? 'Prune Old Soft-Deleted Records (Tombstones):' : 'Dọn dẹp bản ghi đã xóa cũ:'}
            </div>
            <div style="font-size:11.5px; color:var(--text-muted); line-height:1.4;">
              ${isEn ? 'Permanently remove soft-deleted records older than 90 days to optimize LocalStorage.' : 'Xóa vĩnh viễn các bản ghi đã xóa mềm cũ hơn 90 ngày để tối ưu hóa bộ nhớ.'}
            </div>
          </div>
          <button type="button" id="btn-prune-deleted-records" class="btn-secondary" onclick="confirmPruneDeletedRecords(90)" style="font-size:12px; padding:6px 14px; display:inline-flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
            <span>${isEn ? 'Prune deleted records older than 90 days' : 'Dọn dẹp bản ghi đã xóa cũ hơn 90 ngày'}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 3. CARD: OFFLINE SINGLE FILE HTML EXPORT -->
    <div class="settings-card ${getCardCollapseClass('data-card-offline-build')}" id="data-card-offline-build">
      <div class="settings-card-header" onclick="toggleSettingsCard('data-card-offline-build')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span>${isEn ? 'Offline Web-App Single File Bundle' : 'Đóng Gói Web-App Single File HTML Offline'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag active">Vite Singlefile</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice">
          ${isEn
            ? 'Compile and bundle the entire ChronoFlow application into a single standalone HTML file (ChronoFlow_Offline.html). You can open and run this file directly in any web browser without an Internet connection.'
            : 'Tự động đóng gói toàn bộ ứng dụng ChronoFlow thành 1 file HTML duy nhất (ChronoFlow_Offline.html). Bạn có thể mở trực tiếp file này trên bất kỳ trình duyệt nào mà không cần kết nối Internet.'}
        </div>
        <div style="margin-top:14px; display:flex; gap:12px; align-items:center; flex-wrap:wrap;">
          <button type="button" id="btn-download-offline-html" class="btn-primary" onclick="downloadOfflineHtmlApp()" style="padding:9px 18px; font-size:13px; font-weight:700; display:inline-flex; align-items:center; gap:8px;">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            <span id="btn-download-offline-text">${isEn ? 'Build & Download Offline HTML' : 'Biên dịch (Build) & Tải File HTML Offline'}</span>
          </button>
          <span style="font-size:12px; color:var(--text-muted);">${isEn ? 'File name: ChronoFlow_Offline.html' : 'Tên file: ChronoFlow_Offline.html'}</span>
        </div>
      </div>
    </div>

    <!-- 4. CARD: SAFETY 5-SECOND COUNTDOWN RESET (COLLAPSED BY DEFAULT) -->
    <div class="settings-card ${getCardCollapseClass('data-card-safety-reset')}" id="data-card-safety-reset">
      <div class="settings-card-header" onclick="toggleSettingsCard('data-card-safety-reset')">
        <div class="settings-card-title-group">
          <div class="settings-card-title">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span style="color:#ef4444;">${isEn ? 'Factory Reset & Data Wipe Safety Lock' : 'Khôi Phục Mặc Định & Cơ Chế Khóa An Toàn 5 Giây'}</span>
          </div>
        </div>
        <div class="settings-card-actions">
          <span class="settings-name-tag" style="color:#ef4444; border-color:rgba(239,68,68,0.25);">${isEn ? '5s Safety Lock' : 'Khóa 5s an toàn'}</span>
          <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>

      <div class="settings-card-body">
        <div class="settings-guide-notice" style="border-left-color:#ef4444;">
          <strong>${isEn ? 'Safety recommendation:' : 'Khuyến nghị an toàn:'}</strong> ${isEn ? 'Always export a backup file (.JSON) before wiping data. All reset operations require confirming a mandatory 5-second countdown safety lock.' : 'Luôn tải file sao lưu (.JSON) trước khi xóa trắng. Thao tác khôi phục có bộ đếm ngược 5 giây bảo vệ chống bấm nhầm.'}
        </div>
      </div>
    </div>
  `;
}

function renderSettingsHelpDocHtml() {
  return `
    ${renderAttentionGuideSection()}
    ${renderHelpDocSection()}
  `;
}

/**
 * Phân tích cú pháp văn bản copy-paste thành cấu trúc nhật ký phiên bản hoàn chỉnh
 */
function parseQuickChangelogText(rawText, defaultVersion = 'v1.1.1') {
  if (!rawText || !rawText.trim()) return null;
  const lines = rawText.split('\n').map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return null;

  let version = defaultVersion;
  let dateStr = new Date().toLocaleDateString('vi-VN');
  let tag = 'Tính năng mới';
  let title = '';
  const items = [];

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

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    const bulletMatch = line.match(/^[-*•\d+.)\]]\s*(.+)$/);
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

function openAddChangelogModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const list = appState.changelogs || INITIAL_CHANGELOGS;
  const latestVer = list[0]?.version || 'v1.1.0';
  const verParts = latestVer.replace('v', '').split('.').map(Number);
  const nextVer = `v${verParts[0]}.${verParts[1]}.${(verParts[2] || 0) + 1}`;
  const todayFormatted = new Date().toLocaleDateString(isEn ? 'en-US' : 'vi-VN');

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${isEn ? 'Add New Version' : 'Thêm Phiên Bản Mới'}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-row" style="display:flex; gap:12px; margin-bottom:12px;">
        <div class="form-group" style="flex:1;">
          <label class="form-label">${isEn ? 'Version Number *' : 'Số phiên bản *'}</label>
          <input type="text" id="cl-version" class="form-input" value="${nextVer}" placeholder="${isEn ? 'e.g., v1.1.1' : 'Ví dụ: v1.1.1'}">
        </div>
        <div class="form-group" style="flex:1;">
          <label class="form-label">${isEn ? 'Release Date *' : 'Ngày phát hành *'}</label>
          <input type="text" id="cl-date" class="form-input" value="${todayFormatted}">
        </div>
      </div>

      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">${isEn ? 'Category / Tag' : 'Phân loại / Thẻ'}</label>
        <select id="cl-tag" class="form-select form-input">
          <option value="Fix & Polish">${isEn ? 'Bug Fix & Polish' : 'Sửa lỗi & Tối ưu UI'}</option>
          <option value="Feature">${isEn ? 'New Feature' : 'Tính năng mới'}</option>
          <option value="Improvement">${isEn ? 'Improvement' : 'Cải tiến trải nghiệm'}</option>
          <option value="Milestone">${isEn ? 'Major Milestone' : 'Cột mốc lớn'}</option>
        </select>
      </div>

      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">${isEn ? 'Summary Title *' : 'Tiêu đề tóm tắt *'}</label>
        <input type="text" id="cl-title" class="form-input" placeholder="${isEn ? 'e.g., Performance Boost & Shortcuts' : 'Ví dụ: Nâng cấp hiệu năng & Bổ sung phím tắt'}">
      </div>

      <div class="form-group" style="margin-bottom:12px;">
        <label class="form-label">${isEn ? 'Changelog Details (One item per line)' : 'Chi tiết thay đổi (Mỗi dòng một mục thay đổi)'}</label>
        <textarea id="cl-items" class="form-textarea form-input" rows="5" placeholder="${isEn ? '- Added feature A\n- Fixed bug B\n- Optimized UI C' : '- Đã khắc phục lỗi A\n- Bổ sung tính năng B\n- Tinh chỉnh giao diện C'}"></textarea>
        <div style="font-size:11.5px; color:var(--text-muted); margin-top:4px;">
          ${isEn ? 'Tip: You can paste multiple bullet points directly.' : 'Mẹo: Bạn có thể copy nhiều dòng gạch đầu dòng và dán trực tiếp vào đây.'}
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitAddChangelog()">${isEn ? 'Save Version' : 'Lưu Phiên Bản'}</button>
    </div>
  `);
}

function submitAddChangelog() {
  const versionEl = document.getElementById('cl-version');
  const dateEl = document.getElementById('cl-date');
  const tagEl = document.getElementById('cl-tag');
  const titleEl = document.getElementById('cl-title');
  const itemsEl = document.getElementById('cl-items');

  const version = versionEl ? versionEl.value.trim() : '';
  const dateStr = dateEl ? dateEl.value.trim() : '';
  const tag = tagEl ? tagEl.value : 'Feature';
  const title = titleEl ? titleEl.value.trim() : '';
  const rawItems = itemsEl ? itemsEl.value.trim() : '';

  if (!version) {
    showToast('Vui lòng nhập số phiên bản!');
    return;
  }
  if (!title) {
    showToast('Vui lòng nhập tiêu đề tóm tắt!');
    return;
  }

  const items = rawItems
    ? rawItems.split('\n').map(l => l.replace(/^[-*•\d+.)\]]\s*/, '').trim()).filter(Boolean)
    : [title];

  if (!Array.isArray(appState.changelogs)) {
    appState.changelogs = JSON.parse(JSON.stringify(INITIAL_CHANGELOGS));
  }

  appState.changelogs.forEach(c => { c.isLatest = false; });

  const newEntry = {
    id: 'ver-' + version.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase() + '-' + Date.now(),
    version,
    date: dateStr || new Date().toLocaleDateString('vi-VN'),
    tag,
    isLatest: true,
    title,
    items,
    isCustom: true
  };

  appState.changelogs.unshift(newEntry);
  saveData();
  closeModal();

  const mount = document.getElementById('settings-changelog-mount-point');
  if (mount) mount.innerHTML = renderSettingsChangelogHtml();

  showToast(`Đã thêm thành công phiên bản ${version}!`);
}

function openQuickPasteChangelogModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title" style="display:flex; align-items:center; gap:6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
        <span>${isEn ? 'Quick Import & Paste Release Notes' : 'Dán Nhanh Nhật Ký Phiên Bản (Quick Paste)'}</span>
      </h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:10px; line-height:1.5;">
        ${isEn 
          ? 'Paste release notes directly in text, markdown, or bulleted list format. The smart parser will automatically extract the version, summary title, and list of changes.' 
          : 'Dán trực tiếp nội dung cập nhật từ ghi chú, Markdown hoặc danh sách gạch đầu dòng. Trình phân tích thông minh sẽ tự động tách số phiên bản, tiêu đề và các mục thay đổi.'}
      </div>

      <div class="form-group">
        <textarea id="quick-paste-input" class="form-textarea form-input" rows="7" oninput="updateQuickPastePreview()" placeholder="${isEn ? 'v1.2.0 | 27/09/2026 | New Features\nApp Performance Optimization\n- Added shortcut S for Settings\n- Optimized task list rendering\n- Improved English/Vietnamese localization' : 'v1.2.0 | 27/09/2026 | Tính năng mới\nTối ưu hóa hiệu năng ứng dụng\n- Thêm phím tắt S mở Cài đặt\n- Tối ưu hóa render danh sách công việc\n- Bổ sung Việt hóa / Anh hóa toàn diện'}"></textarea>
      </div>

      <!-- Live Preview -->
      <div id="quick-paste-preview-container" style="display:none;">
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
          ${isEn ? 'Preview Card:' : 'Xem trước bản ghi:'}
        </div>
        <div id="quick-paste-preview" class="changelog-preview-box"></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitQuickPasteChangelog()">${isEn ? 'Add to Changelog' : 'Thêm Vào Nhật Ký'}</button>
    </div>
  `);
}

function updateQuickPastePreview() {
  const input = document.getElementById('quick-paste-input');
  const container = document.getElementById('quick-paste-preview-container');
  const preview = document.getElementById('quick-paste-preview');
  if (!input || !container || !preview) return;

  const raw = input.value.trim();
  if (!raw) {
    container.style.display = 'none';
    return;
  }

  const parsed = parseQuickChangelogText(raw);
  if (!parsed) {
    container.style.display = 'none';
    return;
  }

  container.style.display = 'block';
  preview.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
      <span class="changelog-version-badge" style="font-size:11.5px; padding:2px 8px;">${escapeHtml(parsed.version)}</span>
      <span style="font-size:11px; font-weight:600; color:var(--primary);">${escapeHtml(parsed.tag)} • ${escapeHtml(parsed.date)}</span>
    </div>
    <div style="font-size:13px; font-weight:700; color:var(--text-main); margin-bottom:6px;">${escapeHtml(parsed.title)}</div>
    <ul style="margin:0 0 0 16px; padding:0; font-size:11.5px; color:var(--text-secondary); line-height:1.5;">
      ${parsed.items.map(it => `<li>${escapeHtml(it)}</li>`).join('')}
    </ul>
  `;
}

function submitQuickPasteChangelog() {
  const input = document.getElementById('quick-paste-input');
  if (!input || !input.value.trim()) {
    showToast('Vui lòng dán nội dung cập nhật!');
    return;
  }

  const parsed = parseQuickChangelogText(input.value.trim());
  if (!parsed) {
    showToast('Không thể nhận diện nội dung!');
    return;
  }

  if (!Array.isArray(appState.changelogs)) {
    appState.changelogs = JSON.parse(JSON.stringify(INITIAL_CHANGELOGS));
  }

  appState.changelogs.forEach(c => { c.isLatest = false; });
  parsed.isCustom = true;
  appState.changelogs.unshift(parsed);
  saveData();
  closeModal();

  const mount = document.getElementById('settings-changelog-mount-point');
  if (mount) mount.innerHTML = renderSettingsChangelogHtml();

  showToast(`Đã thêm thành công phiên bản ${parsed.version}!`);
}

function openExportChangelogCodeModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const list = appState.changelogs || INITIAL_CHANGELOGS;
  const codeSnippet = `const INITIAL_CHANGELOGS = ${JSON.stringify(list, null, 2)};`;

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title" style="display:flex; align-items:center; gap:6px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        <span>${isEn ? 'Export Source Code Snippet' : 'Xuất Mã Nguồn Nhật Ký Phiên Bản (Code Snippet)'}</span>
      </h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div style="font-size:12.5px; color:var(--text-secondary); margin-bottom:10px; line-height:1.5;">
        ${isEn 
          ? 'This JavaScript snippet contains all versions. Click "Copy Source Code" and paste directly into <code>src/app.js</code> or in chat to permanently embed it into the codebase before building!' 
          : 'Đoạn mã JavaScript này chứa toàn bộ các phiên bản đã cập nhật. Bạn chỉ cần nhấn "Sao chép mã nguồn" và dán trực tiếp vào file <code>src/app.js</code> hoặc dán vào cuộc trò chuyện để lưu vĩnh viễn vào mã nguồn trước khi build!'}
      </div>

      <div class="changelog-code-box" id="changelog-code-preview">${escapeHtml(codeSnippet)}</div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="copyChangelogCodeToClipboard()" style="display:inline-flex; align-items:center; gap:6px;">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
        <span>${isEn ? 'Copy Source Code' : 'Sao Chép Mã Nguồn'}</span>
      </button>
    </div>
  `);
}

function copyChangelogCodeToClipboard() {
  const list = appState.changelogs || INITIAL_CHANGELOGS;
  const codeSnippet = `const INITIAL_CHANGELOGS = ${JSON.stringify(list, null, 2)};`;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(codeSnippet).then(() => {
      showToast('Đã sao chép mã nguồn JavaScript vào Clipboard!');
      closeModal();
    }).catch(() => {
      showToast('Không thể sao chép tự động, vui lòng bôi đen và copy.');
    });
  } else {
    showToast('Clipboard API không hỗ trợ, vui lòng bôi đen và copy.');
  }
}

function copyVersionMarkdown(versionId) {
  const list = appState.changelogs || INITIAL_CHANGELOGS;
  const item = list.find(c => c.id === versionId || c.version === versionId);
  if (!item) return;

  const md = `### [${item.version}] - ${item.date} (${item.tag || 'Update'})\n${item.title}\n\n${(item.items || []).map(i => `- ${i}`).join('\n')}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(md).then(() => {
      showToast(`Đã sao chép nội dung phiên bản ${item.version} (Markdown)!`);
    });
  } else {
    showToast(`Đã chọn nội dung ${item.version}`);
  }
}

function deleteChangelog(versionId) {
  if (!Array.isArray(appState.changelogs)) return;
  const item = appState.changelogs.find(c => c.id === versionId);
  if (!item) return;

  if (confirm(`Bạn có chắc chắn muốn xóa bản ghi phiên bản ${item.version}?`)) {
    const previous = JSON.parse(JSON.stringify(appState.changelogs));
    appState.changelogs = appState.changelogs.filter(c => c.id !== versionId);
    if (appState.changelogs.length > 0) {
      appState.changelogs[0].isLatest = true;
    }
    saveData();
    const mount = document.getElementById('settings-changelog-mount-point');
    if (mount) mount.innerHTML = renderSettingsChangelogHtml();

    showToast(`Đã xóa phiên bản ${item.version}!`, {
      onUndo: () => {
        appState.changelogs = previous;
        saveData();
        const m = document.getElementById('settings-changelog-mount-point');
        if (m) m.innerHTML = renderSettingsChangelogHtml();
        showToast(t('toastUndoSuccess'));
      }
    });
  }
}

function resetChangelogsToDefault() {
  if (confirm('Khôi phục danh sách nhật ký phiên bản về mặc định gốc của hệ thống?')) {
    appState.changelogs = JSON.parse(JSON.stringify(INITIAL_CHANGELOGS));
    saveData();
    const mount = document.getElementById('settings-changelog-mount-point');
    if (mount) mount.innerHTML = renderSettingsChangelogHtml();
    showToast('Đã khôi phục nhật ký phiên bản về mặc định!');
  }
}

function renderSettingsChangelogHtml() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const list = (Array.isArray(appState.changelogs) && appState.changelogs.length > 0)
    ? appState.changelogs
    : INITIAL_CHANGELOGS;
  const latestEntry = list[0] || {};
  const latestVersion = latestEntry.version || 'v1.1.0';
  const latestTag = isEn ? (latestEntry.tagEn || latestEntry.tag || 'Latest') : (latestEntry.tag || 'Mới nhất');

  const versionsHtml = list.map((item, index) => {
    const isExpanded = index === 0;
    const cardId = 'changelog-card-' + (item.id || item.version.replace(/[^a-zA-Z0-9]/g, '-'));
    const title = isEn ? (item.titleEn || item.title) : item.title;
    const tag = isEn ? (item.tagEn || item.tag || 'Update') : (item.tag || 'Cập nhật');
    const items = isEn ? (item.itemsEn || item.items || []) : (item.items || []);
    const isCustom = !!item.isCustom;

    return `
      <div class="settings-card ${isExpanded ? 'is-expanded' : ''}" id="${cardId}" style="margin-bottom:12px;">
        <div class="settings-card-header" onclick="toggleSettingsCard('${cardId}')" style="cursor:pointer;">
          <div class="settings-card-title-group" style="display:flex; align-items:center; gap:8px;">
            <div class="settings-card-title" style="display:flex; align-items:center; gap:8px;">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
              <strong>${escapeHtml(item.version)}</strong> — <span>${escapeHtml(title)}</span>
            </div>
          </div>
          <div class="settings-card-actions" style="display:flex; align-items:center; gap:8px;" onclick="event.stopPropagation()">
            <span class="settings-name-tag ${item.isLatest ? 'active' : ''}">${escapeHtml(tag)}</span>
            <span style="font-size:11px; color:var(--text-muted);">${escapeHtml(item.date || '')}</span>
            <button class="mini-action-btn" onclick="copyVersionMarkdown('${item.id || item.version}')" title="${isEn ? 'Copy Markdown' : 'Sao chép Markdown'}" aria-label="Copy Markdown">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
            </button>
            ${isCustom ? `
              <button class="mini-action-btn delete" onclick="deleteChangelog('${item.id}')" title="${isEn ? 'Delete version' : 'Xóa phiên bản'}" aria-label="Delete">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            ` : ''}
            <svg class="settings-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </div>
        </div>
        <div class="settings-card-body">
          <div style="font-size:12.5px; color:var(--text-secondary); line-height:1.65;">
            <ul style="margin:4px 0 0 18px; padding:0; list-style-type:disc;">
              ${items.map(it => `<li>${it}</li>`).join('')}
            </ul>
          </div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <!-- CHANGELOG & VERSION HISTORY BANNER -->
    <div class="changelog-banner" style="margin-bottom:14px;">
      <div class="changelog-banner-top" style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:10px;">
        <div class="changelog-version-title">
          <span class="changelog-version-badge" style="font-size:14px; padding:3px 10px; font-weight:800; background:var(--primary); color:#fff; border-radius:6px;">${escapeHtml(latestVersion)}</span>
          <span class="changelog-status-pill" style="margin-left:8px; font-size:12px; font-weight:600; color:var(--primary);">${escapeHtml(latestTag)}</span>
        </div>
        
        <!-- Action Buttons: Thêm phiên bản, Dán nhanh (Quick Paste), Xuất mã nguồn -->
        <div class="changelog-actions-toolbar" style="display:flex; align-items:center; gap:8px; flex-wrap:wrap;">
          <button class="btn-primary" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:6px;" onclick="openAddChangelogModal()" title="${isEn ? 'Add new version' : 'Thêm phiên bản mới'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            <span>${isEn ? 'Add Version' : 'Thêm Phiên Bản'}</span>
          </button>
          
          <button class="btn-secondary" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:6px;" onclick="openQuickPasteChangelogModal()" title="${isEn ? 'Quick paste release notes' : 'Dán nhanh nội dung cập nhật (Copy-Paste)'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>
            <span>${isEn ? 'Quick Paste' : 'Dán Nhanh'}</span>
          </button>
          
          <button class="btn-secondary" style="font-size:12px; padding:5px 12px; display:inline-flex; align-items:center; gap:6px;" onclick="openExportChangelogCodeModal()" title="${isEn ? 'Export JavaScript code snippet to embed into codebase' : 'Xuất mã nguồn code snippet dán vào src/app.js'}">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            <span>${isEn ? 'Export Code' : 'Xuất Code'}</span>
          </button>

          <button class="mini-action-btn" onclick="resetChangelogsToDefault()" title="${isEn ? 'Reset to default changelog' : 'Khôi phục nhật ký gốc'}" aria-label="Reset">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          </button>
        </div>
      </div>

      <div class="changelog-meta-tags" style="margin-top:8px; display:flex; gap:8px; flex-wrap:wrap;">
        <span class="changelog-meta-tag">${isEn ? 'Release Date: Sep 2026' : 'Phát hành: Tháng 09/2026'}</span>
        <span class="changelog-meta-tag">100% Offline LocalStorage</span>
        <span class="changelog-meta-tag">${list.length} ${isEn ? 'Versions Recorded' : 'Phiên bản đã ghi nhận'}</span>
      </div>

      <div class="changelog-policy-card" style="margin-top:10px;">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="flex-shrink:0; margin-top:2px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
        <div style="font-size:12px; line-height:1.5;">
          <strong>${isEn ? 'Versioning & Codebase Persistence:' : 'Quy chuẩn phiên bản & Lưu trữ mã nguồn:'}</strong>
          ${isEn 
            ? 'When user adds or pastes a new release version, it is immediately rendered and persisted in browser LocalStorage. Use "Export Code" to generate the JavaScript snippet for directly committing into the app source code (git/repository).' 
            : 'Mọi phiên bản do bạn thêm hoặc dán (Paste) sẽ được hiển thị ngay lập tức và lưu an toàn trong LocalStorage. Dùng nút "Xuất Code" để tạo đoạn mã JavaScript nạp thẳng vào mã nguồn trước khi build hoặc lưu trữ lâu dài.'}
        </div>
      </div>
    </div>

    <!-- DANH SÁCH CÁC PHIÊN BẢN (RENDER ĐỘNG TỪ APPSTATE.CHANGELOGS) -->
    <div class="changelog-versions-list">
      ${versionsHtml}
    </div>
  `;
}

function updateSettingsModalI18n() {
  const isEn = appState.settings && appState.settings.lang === 'en';

  // 1. Sidebar Nav Button Labels (Desktop)
  const elAccNav = document.getElementById('nav-tab-account-label');
  if (elAccNav) elAccNav.textContent = isEn ? 'Account & Sync' : 'Tài khoản & Đồng bộ';

  const elAppNav = document.getElementById('nav-tab-appearance-label');
  if (elAppNav) elAppNav.textContent = isEn ? 'Appearance & Display' : 'Giao diện & Hiển thị';

  const elDataNav = document.getElementById('nav-tab-data-label');
  if (elDataNav) elDataNav.textContent = isEn ? 'Data & Backup' : 'Quản lý Dữ liệu';

  const elHelpNav = document.getElementById('nav-tab-help-label');
  if (elHelpNav) elHelpNav.textContent = isEn ? 'Help & Documentation' : 'Trợ giúp & Tài liệu';

  const elChangeNav = document.getElementById('nav-tab-changelog-label');
  if (elChangeNav) elChangeNav.textContent = isEn ? 'Changelog & History' : 'Nhật Ký Cập Nhật';

  // 2. Pane Headers (Titles & Subtitles inside each tab content pane)
  const paneTitleAcc = document.getElementById('pane-title-account');
  const paneSubAcc = document.getElementById('pane-sub-account');
  if (paneTitleAcc) paneTitleAcc.textContent = isEn ? 'Google Calendar Account & Synchronization' : 'Tài khoản & Đồng bộ Google Calendar';
  if (paneSubAcc) paneSubAcc.textContent = isEn ? 'Manage OAuth 2.0 connection, auto background polling, and 2-way calendar sync.' : 'Quản lý kết nối OAuth 2.0, tự động quét sự kiện ngầm và đồng bộ lịch 2 chiều.';

  const paneTitleApp = document.getElementById('pane-title-appearance');
  const paneSubApp = document.getElementById('pane-sub-appearance');
  if (paneTitleApp) paneTitleApp.textContent = isEn ? 'Appearance & Calendar Display' : 'Giao diện & Hiển thị Lịch biểu';
  if (paneSubApp) paneSubApp.textContent = isEn ? 'Customize focus thresholds, Google Calendar color mappings, and font size scaling.' : 'Tùy biến ngưỡng tập trung, màu sắc đồng bộ Google Calendar và tỉ lệ hiển thị.';

  const paneTitleData = document.getElementById('pane-title-data');
  const paneSubData = document.getElementById('pane-sub-data');
  if (paneTitleData) paneTitleData.textContent = isEn ? 'Data Backup & Management' : 'Sao Lưu & Quản Lý Dữ Liệu';
  if (paneSubData) paneSubData.textContent = isEn ? 'Safeguard personal data with 5-second countdown protection against accidental deletion.' : 'Bảo vệ dữ liệu cá nhân với cơ chế đếm ngược 5 giây an toàn chống xóa nhầm.';

  const paneTitleHelp = document.getElementById('pane-title-help');
  const paneSubHelp = document.getElementById('pane-sub-help');
  if (paneTitleHelp) paneTitleHelp.textContent = isEn ? 'User Documentation & Manual' : 'Tài Liệu Hướng Dẫn Sử Dụng';
  if (paneSubHelp) paneSubHelp.textContent = isEn ? 'Comprehensive guide for 1440-minute philosophy, Eisenhower Matrix, Attention & Auto-match.' : 'Cẩm nang chi tiết về triết lý 1440 phút, Ma trận Eisenhower, Attention và Auto-match.';

  const paneTitleChange = document.getElementById('pane-title-changelog');
  const paneSubChange = document.getElementById('pane-sub-changelog');
  if (paneTitleChange) paneTitleChange.textContent = isEn ? 'Changelog & Version History' : 'Nhật Ký Phát Triển & Lịch Sử Phiên Bản';
  if (paneSubChange) paneSubChange.textContent = isEn ? 'Milestones, new features, and interface improvements by version.' : 'Tổng hợp các mốc nâng cấp, tính năng mới và cải tiến giao diện theo từng phiên bản.';

  // 3. Modal Header Title & Subtitle
  const mainTitle = document.getElementById('settings-modal-main-title');
  const subTitle = document.getElementById('settings-modal-sub-title');
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  if (!isMobile || typeof mobileSettingsState === 'undefined' || mobileSettingsState === 'menu') {
    if (mainTitle) mainTitle.textContent = isEn ? 'System Settings' : 'Cài Đặt Hệ Thống';
    if (subTitle) subTitle.textContent = isEn ? 'ChronoFlow Settings & Preferences' : 'Tùy chỉnh hệ thống ChronoFlow';
  } else {
    const meta = getSettingsCategoryMeta(activeSettingsTabId);
    if (mainTitle) mainTitle.textContent = meta.title;
    if (subTitle) subTitle.textContent = meta.subtitle;
  }

  // 4. Close & Back buttons
  const closeBtn = document.getElementById('btn-close-settings-modal');
  if (closeBtn) {
    closeBtn.setAttribute('title', isEn ? 'Close settings (Esc)' : 'Đóng cài đặt (Esc)');
    closeBtn.setAttribute('aria-label', isEn ? 'Close' : 'Đóng');
  }

  const backBtn = document.getElementById('settings-mobile-back-btn');
  if (backBtn) {
    backBtn.setAttribute('title', isEn ? 'Back to categories' : 'Quay lại danh mục');
    backBtn.setAttribute('aria-label', isEn ? 'Back' : 'Quay lại');
  }
}

function renderAllSettingsPanes() {
  updateSettingsModalI18n();

  const gcalMount = document.getElementById('settings-gcal-mount-point');
  if (gcalMount) gcalMount.innerHTML = renderSettingsAccountSyncHtml();

  const appearanceMount = document.getElementById('settings-appearance-mount-point');
  if (appearanceMount) appearanceMount.innerHTML = renderSettingsAppearanceHtml();

  const dataMount = document.getElementById('settings-data-mount-point');
  if (dataMount) dataMount.innerHTML = renderSettingsDataManagementHtml();

  const helpMount = document.getElementById('settings-help-mount-point');
  if (helpMount) helpMount.innerHTML = renderSettingsHelpDocHtml();

  const changelogMount = document.getElementById('settings-changelog-mount-point');
  if (changelogMount) changelogMount.innerHTML = renderSettingsChangelogHtml();
}

let mobileSettingsState = 'menu'; // 'menu' or 'detail'

function getSettingsCategoryMeta(tabId) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const gcalConnected = typeof isGCalConnected === 'function' ? isGCalConnected() : false;
  const fontSize = (appState.settings && appState.settings.fontSizePercent) || 100;
  
  const map = {
    'tab-account-sync': {
      id: 'tab-account-sync',
      title: isEn ? 'Account & Sync' : 'Tài khoản & Đồng bộ',
      subtitle: isEn ? 'Google Calendar 2-way sync, OAuth 2.0 & auto-polling' : 'Đồng bộ 2 chiều Google Calendar, OAuth 2.0 & quét ngầm',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
      badge: gcalConnected 
        ? `<span class="settings-menu-badge connected">${isEn ? 'Connected' : 'Đã kết nối'}</span>` 
        : `<span class="settings-menu-badge disconnected">${isEn ? 'Disconnected' : 'Chưa kết nối'}</span>`
    },
    'tab-appearance-display': {
      id: 'tab-appearance-display',
      title: isEn ? 'Appearance & Display' : 'Giao diện & Hiển thị',
      subtitle: isEn ? 'Sort order, font scale, focus mode, dark theme & colors' : 'Thứ tự sắp xếp, cỡ chữ hệ thống, chế độ Focus, theme sáng tối & màu sắc',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20v-2a8 8 0 0 0 0-16V2z"/></svg>`,
      badge: `<span class="settings-menu-badge default">${fontSize}%</span>`
    },
    'tab-data-management': {
      id: 'tab-data-management',
      title: isEn ? 'Data & Backup' : 'Quản lý Dữ liệu',
      subtitle: isEn ? 'JSON file export, restore & safe 5-second countdown reset' : 'Xuất sao lưu .JSON, nạp file & xóa trắng an toàn 5s',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>`,
      badge: `<span class="settings-menu-badge default">100% Offline</span>`
    },
    'tab-help-doc': {
      id: 'tab-help-doc',
      title: isEn ? 'Help & Documentation' : 'Trợ giúp & Tài liệu',
      subtitle: isEn ? 'Attention Engine guide, Eisenhower Matrix & 24h Timeline' : 'Cẩm nang Attention Engine, Ma trận Eisenhower & Timeline 24h',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
      badge: `<span class="settings-menu-badge default">v1.0</span>`
    },
    'tab-changelog': {
      id: 'tab-changelog',
      title: isEn ? 'Changelog & Version History' : 'Nhật Ký Cập Nhật & Phiên Bản',
      subtitle: isEn ? 'Milestones, feature roadmap & versioning policy' : 'Lịch sử phiên bản, các mốc phát triển và quy chuẩn phiên bản',
      icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>`,
      badge: `<span class="settings-menu-badge default">v1.2.0</span>`
    }
  };
  return map[tabId] || map['tab-account-sync'];
}

function renderMobileTieredMenu() {
  const container = document.getElementById('settings-mobile-tiered-menu');
  if (!container) return;
  const isEn = appState.settings && appState.settings.lang === 'en';
  
  const tabs = ['tab-account-sync', 'tab-appearance-display', 'tab-data-management', 'tab-help-doc', 'tab-changelog'];
  
  container.innerHTML = `
    <div class="tiered-menu-header">
      <div class="tiered-menu-greeting">
        <h3 class="tiered-menu-title">${isEn ? 'Settings & Preferences' : 'Danh Mục Cài Đặt'}</h3>
        <p class="tiered-menu-sub">${isEn ? 'Select a category to customize ChronoFlow' : 'Chọn danh mục bên dưới để tùy biến các tính năng'}</p>
      </div>
    </div>
    <div class="tiered-menu-list">
      ${tabs.map(tabId => {
        const meta = getSettingsCategoryMeta(tabId);
        return `
          <button type="button" class="tiered-menu-card" onclick="selectMobileSettingsCategory('${meta.id}')">
            <div class="tiered-card-icon-wrap">
              ${meta.icon}
            </div>
            <div class="tiered-card-info">
              <div class="tiered-card-title-row">
                <span class="tiered-card-title">${escapeHtml(meta.title)}</span>
                ${meta.badge}
              </div>
              <p class="tiered-card-sub">${escapeHtml(meta.subtitle)}</p>
            </div>
            <div class="tiered-card-chevron">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </div>
          </button>
        `;
      }).join('')}
    </div>
    <div class="tiered-menu-footer">
      <span class="cf-version-pill">ChronoFlow v1.3.0 • 100% Offline</span>
    </div>
  `;
}

function selectMobileSettingsCategory(tabId) {
  mobileSettingsState = 'detail';
  switchSettingsTab(tabId);
  updateMobileSettingsUIState();
}

function backToMobileSettingsMenu() {
  mobileSettingsState = 'menu';
  updateMobileSettingsUIState();
}

function updateMobileSettingsUIState() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const tieredMenu = document.getElementById('settings-mobile-tiered-menu');
  const contentContainer = document.getElementById('settings-content-container');
  const desktopSidebar = document.getElementById('settings-desktop-sidebar');
  const backBtn = document.getElementById('settings-mobile-back-btn');
  const mainTitle = document.getElementById('settings-modal-main-title');
  const subTitle = document.getElementById('settings-modal-sub-title');
  const brandBadge = document.getElementById('settings-brand-badge');
  const isEn = appState.settings && appState.settings.lang === 'en';

  if (!isMobile) {
    // Desktop layout
    if (tieredMenu) tieredMenu.style.display = 'none';
    if (desktopSidebar) desktopSidebar.style.display = 'flex';
    if (contentContainer) contentContainer.style.display = 'block';
    if (backBtn) backBtn.style.display = 'none';
    if (brandBadge) brandBadge.style.display = 'flex';
    if (mainTitle) mainTitle.textContent = isEn ? 'System Settings' : 'Cài Đặt Hệ Thống';
    if (subTitle) subTitle.textContent = isEn ? 'ChronoFlow Settings & Preferences' : 'Tùy chỉnh hệ thống ChronoFlow';
    return;
  }

  // Mobile layout
  if (mobileSettingsState === 'menu') {
    renderMobileTieredMenu();
    if (tieredMenu) tieredMenu.style.display = 'flex';
    if (desktopSidebar) desktopSidebar.style.display = 'none';
    if (contentContainer) contentContainer.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    if (brandBadge) brandBadge.style.display = 'flex';
    if (mainTitle) mainTitle.textContent = isEn ? 'System Settings' : 'Cài Đặt Hệ Thống';
    if (subTitle) subTitle.textContent = isEn ? 'Select a category below' : 'Chọn danh mục bên dưới';
  } else {
    // Detail view
    const meta = getSettingsCategoryMeta(activeSettingsTabId);
    if (tieredMenu) tieredMenu.style.display = 'none';
    if (desktopSidebar) desktopSidebar.style.display = 'none';
    if (contentContainer) contentContainer.style.display = 'block';
    if (backBtn) backBtn.style.display = 'inline-flex';
    if (brandBadge) brandBadge.style.display = 'none';
    if (mainTitle) mainTitle.textContent = meta.title;
    if (subTitle) subTitle.textContent = meta.subtitle;
  }
}

function switchSettingsTab(tabId) {
  activeSettingsTabId = tabId;

  // 1. Update Sidebar nav items
  const navBtns = document.querySelectorAll('.settings-nav-item');
  navBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-target') === tabId;
    btn.classList.toggle('active', isTarget);
    btn.setAttribute('aria-selected', isTarget ? 'true' : 'false');
  });

  // 2. Toggle Tab Content panes
  const panes = document.querySelectorAll('.settings-tab-pane');
  panes.forEach(pane => {
    if (pane.id === tabId) {
      pane.style.display = 'block';
      pane.classList.add('active');
    } else {
      pane.style.display = 'none';
      pane.classList.remove('active');
    }
  });

  // 3. Scroll content to top
  const container = document.getElementById('settings-content-container');
  if (container) {
    container.scrollTop = 0;
  }

  updateMobileSettingsUIState();
}

// ==========================================
// MOBILE ASSIST & FLOATING ACTION BUTTON (FAB)
// ==========================================

function getMobileAssistSettings() {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.mobileAssist) {
    appState.settings.mobileAssist = {
      enabled: true,
      shortcuts: {
        accessibilityTools: true,
        sync: true,
        syncSwitch: true,
        newTask: true,
        transientEvent: true,
        fixedEvent: true,
        dailyNote: true,
        autoMatch: true
      }
    };
  }
  return appState.settings.mobileAssist;
}

function toggleMobileAssistMaster(enabled) {
  const assist = getMobileAssistSettings();
  assist.enabled = !!enabled;
  touch(appState.settings);
  saveData();

  const block = document.getElementById('mobile-assist-shortcuts-block');
  if (block) {
    block.style.display = assist.enabled ? 'flex' : 'none';
  }

  ensureMobileQuickActionsFab();
  renderMobileQuickFab();
  updateMobileQuickFabPosition();

  const isEn = appState.settings?.lang === 'en';
  showToast(
    assist.enabled 
      ? (isEn ? 'Mobile quick actions button enabled!' : 'Đã bật nút thao tác nhanh nổi trên mobile!') 
      : (isEn ? 'Mobile quick actions button disabled.' : 'Đã tắt nút thao tác nhanh nổi trên mobile.')
  );
}
window.toggleMobileAssistMaster = toggleMobileAssistMaster;

function updateMobileAssistShortcut(key, value) {
  const assist = getMobileAssistSettings();
  if (!assist.shortcuts) assist.shortcuts = {};
  assist.shortcuts[key] = !!value;
  touch(appState.settings);
  saveData();
  renderMobileQuickFab();
}
window.updateMobileAssistShortcut = updateMobileAssistShortcut;

function ensureMobileQuickActionsFab() {
  let root = document.getElementById('mobile-quick-fab-root');
  let backdrop = document.getElementById('mobile-quick-fab-backdrop');

  if (!root) {
    root = document.createElement('div');
    root.id = 'mobile-quick-fab-root';
    root.className = 'mobile-quick-fab-root';
    root.innerHTML = `
      <div id="mobile-quick-actions-sheet" class="mobile-quick-actions-sheet" role="menu" aria-label="Mobile Quick Actions"></div>
      <button type="button" id="mobile-quick-fab-btn" class="mobile-quick-fab-btn" onclick="toggleMobileQuickActionsMenu()" aria-label="Trợ năng & Thao tác nhanh mobile" title="Trợ năng & Thao tác nhanh">
        <svg class="fab-icon-default" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="4.5" r="2.2"></circle>
          <path d="M4.5 9.5h15"></path>
          <path d="M12 9.5v5.5"></path>
          <path d="m8.5 20.5 3.5-5.5 3.5 5.5"></path>
        </svg>
        <svg class="fab-icon-close" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display:none;">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `;
    document.body.appendChild(root);
  }

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'mobile-quick-fab-backdrop';
    backdrop.className = 'mobile-quick-fab-backdrop';
    backdrop.onclick = () => toggleMobileQuickActionsMenu(false);
    document.body.appendChild(backdrop);
  }

  renderMobileQuickFab();
  updateMobileQuickFabPosition();
}
window.ensureMobileQuickActionsFab = ensureMobileQuickActionsFab;

function renderMobileQuickFab() {
  const sheet = document.getElementById('mobile-quick-actions-sheet');
  const root = document.getElementById('mobile-quick-fab-root');
  if (!sheet || !root) return;

  const isEn = appState.settings?.lang === 'en';
  const assist = getMobileAssistSettings();
  if (assist.enabled === false) {
    root.style.display = 'none';
    return;
  }

  const shortcuts = assist.shortcuts || {};
  const currentTarget = appState.settings?.headerSyncTarget || 'gcal';
  const isGCal = currentTarget === 'gcal';
  const isGCalConn = typeof isGCalConnected === 'function' ? isGCalConnected() : false;
  const isGDriveConn = typeof isGDriveConnected === 'function' ? isGDriveConnected() : false;
  const isConnected = isGCal ? isGCalConn : isGDriveConn;

  let syncLabel = '';
  if (isGCal) {
    syncLabel = isGCalConn 
      ? (isEn ? 'Sync Google Calendar (OK)' : 'Đồng bộ Google Calendar (OK)') 
      : (isEn ? 'Connect Google Calendar' : 'Kết nối Google Calendar');
  } else {
    syncLabel = isGDriveConn 
      ? (isEn ? 'Sync Google Drive (OK)' : 'Đồng bộ Google Drive (OK)') 
      : (isEn ? 'Connect Google Drive' : 'Kết nối Google Drive');
  }

  let html = '';

  // 0. Accessibility & Quick Controls Row (Focus, Theme, Language)
  if (shortcuts.accessibilityTools !== false) {
    const isFocus = !!appState.settings?.focusDimming;
    const isDark = (typeof document !== 'undefined') && (document.documentElement.classList.contains('dark-theme') || (document.body && document.body.classList.contains('dark-theme')));
    
    html += `
      <div class="mobile-quick-sys-row" role="group" aria-label="${isEn ? 'Accessibility & System Tools' : 'Phím trợ năng & Hệ thống'}">
        <button type="button" class="mobile-quick-sys-btn ${isFocus ? 'active' : ''}" onclick="toggleMobileFocusDimming()" title="${isEn ? 'Toggle Timeline Focus Dimming' : 'Bật / Tắt chế độ tập trung dòng thời gian'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="3"></circle>
          </svg>
          <span class="btn-text">${isEn ? 'Focus' : 'Tập trung'}</span>
          <span class="quick-toggle-badge ${isFocus ? 'on' : ''}">${isFocus ? (isEn ? 'ON' : 'Bật') : (isEn ? 'OFF' : 'Tắt')}</span>
        </button>

        <button type="button" class="mobile-quick-sys-btn" onclick="toggleMobileTheme()" title="${isEn ? 'Toggle Light/Dark Theme' : 'Chuyển đổi giao diện Sáng / Tối'}">
          ${isDark 
            ? `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
               <span class="btn-text">${isEn ? 'Dark' : 'Tối'}</span>
               <span class="quick-toggle-badge">🌙</span>`
            : `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
               <span class="btn-text">${isEn ? 'Light' : 'Sáng'}</span>
               <span class="quick-toggle-badge">☀️</span>`
          }
        </button>

        <button type="button" class="mobile-quick-sys-btn" onclick="toggleMobileLanguage()" title="${isEn ? 'Switch Language (VI/EN)' : 'Chuyển đổi ngôn ngữ (VI/EN)'}">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span class="btn-text">${isEn ? 'EN' : 'VI'}</span>
          <span class="quick-toggle-badge">${isEn ? 'English' : 'Tiếng Việt'}</span>
        </button>
      </div>
    `;
  }

  // 1. Top row: Sync & Target Switch (if either is enabled)
  if (shortcuts.sync !== false || shortcuts.syncSwitch !== false) {
    html += '<div class="mobile-quick-sync-row">';
    if (shortcuts.sync !== false) {
      html += `
        <button type="button" id="mobile-fab-sync-btn" class="mobile-quick-action-item mobile-quick-sync-btn ${isConnected ? 'connected' : ''}" onclick="triggerHeaderGCalAction()">
          ${syncLabel}
        </button>
      `;
    }
    if (shortcuts.syncSwitch !== false) {
      html += `
        <button type="button" id="mobile-fab-sync-switch-btn" class="mobile-quick-sync-switch" onclick="toggleMobileHeaderSyncTarget()" title="${isEn ? 'Switch target' : 'Chuyển mục tiêu'}">
          GDrive ⇄ GCal
        </button>
      `;
    }
    html += '</div>';
  }

  // 2. Action Shortcuts
  if (shortcuts.newTask !== false) {
    html += `
      <button type="button" class="mobile-quick-action-item" onclick="openAddTaskModal(); toggleMobileQuickActionsMenu(false);">
        New Task (Eisenhower)
      </button>
    `;
  }

  if (shortcuts.transientEvent !== false) {
    html += `
      <button type="button" class="mobile-quick-action-item" onclick="openAddTransientEventModal(); toggleMobileQuickActionsMenu(false);">
        Transient Event
      </button>
    `;
  }

  if (shortcuts.fixedEvent !== false) {
    html += `
      <button type="button" class="mobile-quick-action-item" onclick="openAddFixedEventModal(); toggleMobileQuickActionsMenu(false);">
        Fixed Event
      </button>
    `;
  }

  if (shortcuts.dailyNote !== false) {
    html += `
      <button type="button" class="mobile-quick-action-item" onclick="openAddNoteModal(); toggleMobileQuickActionsMenu(false);">
        Daily Note
      </button>
    `;
  }

  if (shortcuts.autoMatch !== false) {
    html += `
      <button type="button" class="mobile-quick-action-item" onclick="autoMatchAllTasks(); toggleMobileQuickActionsMenu(false);">
        Auto-Match All Tasks
      </button>
    `;
  }

  sheet.innerHTML = html;
}
window.renderMobileQuickFab = renderMobileQuickFab;

function toggleMobileFocusDimming() {
  if (typeof toggleFocusDimming === 'function') {
    toggleFocusDimming();
  } else if (appState && appState.settings) {
    appState.settings.focusDimming = !appState.settings.focusDimming;
    saveData();
    renderApp();
  }
  renderMobileQuickFab();
}
window.toggleMobileFocusDimming = toggleMobileFocusDimming;

function toggleMobileTheme() {
  if (typeof toggleTheme === 'function') {
    toggleTheme();
  }
  renderMobileQuickFab();
}
window.toggleMobileTheme = toggleMobileTheme;

function toggleMobileLanguage() {
  const currentLang = appState.settings?.lang === 'en' ? 'en' : 'vi';
  const newLang = currentLang === 'en' ? 'vi' : 'en';
  if (typeof setLanguageFromSettings === 'function') {
    setLanguageFromSettings(newLang);
  } else if (appState && appState.settings) {
    appState.settings.lang = newLang;
    saveData();
    renderApp();
  }
  renderMobileQuickFab();
}
window.toggleMobileLanguage = toggleMobileLanguage;

function toggleMobileQuickActionsMenu(forceOpen) {
  const root = document.getElementById('mobile-quick-fab-root');
  const sheet = document.getElementById('mobile-quick-actions-sheet');
  const backdrop = document.getElementById('mobile-quick-fab-backdrop');
  const fabBtn = document.getElementById('mobile-quick-fab-btn');
  if (!root || !sheet) return;

  const isCurrentlyOpen = root.classList.contains('open') || sheet.classList.contains('open');
  const shouldOpen = (typeof forceOpen === 'boolean') ? forceOpen : !isCurrentlyOpen;

  if (shouldOpen) {
    renderMobileQuickFab();
    updateMobileQuickFabPosition();
    root.classList.add('open');
    sheet.classList.add('open');
    if (backdrop) backdrop.classList.add('open');
    if (fabBtn) {
      fabBtn.classList.add('open');
      const defIcon = fabBtn.querySelector('.fab-icon-default');
      const closeIcon = fabBtn.querySelector('.fab-icon-close');
      if (defIcon) defIcon.style.display = 'none';
      if (closeIcon) closeIcon.style.display = 'block';
    }
  } else {
    root.classList.remove('open');
    sheet.classList.remove('open');
    if (backdrop) backdrop.classList.remove('open');
    if (fabBtn) {
      fabBtn.classList.remove('open');
      const defIcon = fabBtn.querySelector('.fab-icon-default');
      const closeIcon = fabBtn.querySelector('.fab-icon-close');
      if (defIcon) defIcon.style.display = 'block';
      if (closeIcon) closeIcon.style.display = 'none';
    }
  }
}
window.toggleMobileQuickActionsMenu = toggleMobileQuickActionsMenu;

function updateMobileQuickFabPosition() {
  const fabRoot = document.getElementById('mobile-quick-fab-root');
  if (!fabRoot) return;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640;
  const assistEnabled = appState?.settings?.mobileAssist?.enabled !== false;
  if (!isMobile || !assistEnabled) {
    fabRoot.style.display = 'none';
    return;
  }
  fabRoot.style.display = 'block';

  const settingsBtn = document.getElementById('mobile-nav-btn-settings');
  const bottomNav = document.getElementById('mobile-bottom-nav') || document.querySelector('.mobile-nav-bar');

  const vpHeight = (typeof window !== 'undefined' && window.visualViewport) ? window.visualViewport.height : (typeof window !== 'undefined' ? window.innerHeight : 800);
  const vpWidth = (typeof window !== 'undefined' && window.visualViewport) ? window.visualViewport.width : (typeof window !== 'undefined' ? window.innerWidth : 360);

  let bottomPx = 74;
  let rightPx = 14;

  if (bottomNav) {
    const navRect = bottomNav.getBoundingClientRect();
    const navTopDistFromBottom = vpHeight - navRect.top;
    bottomPx = Math.max(68, Math.round(navTopDistFromBottom + 10));
  }

  if (settingsBtn) {
    const btnRect = settingsBtn.getBoundingClientRect();
    const btnCenterX = btnRect.left + (btnRect.width / 2);
    const fabWidth = 48;
    rightPx = Math.max(8, Math.round(vpWidth - btnCenterX - (fabWidth / 2)));
  }

  fabRoot.style.bottom = `${bottomPx}px`;
  fabRoot.style.right = `${rightPx}px`;
}
window.updateMobileQuickFabPosition = updateMobileQuickFabPosition;

function toggleMobileHeaderSyncTarget() {
  if (!appState.settings) appState.settings = {};
  const current = appState.settings.headerSyncTarget || 'gcal';
  appState.settings.headerSyncTarget = current === 'gcal' ? 'gdrive' : 'gcal';
  touch(appState.settings);
  saveData();
  renderMobileQuickFab();
  if (typeof updateHeaderSyncButton === 'function') updateHeaderSyncButton();
  const isEn = appState.settings?.lang === 'en';
  const newTarget = appState.settings.headerSyncTarget === 'gdrive' ? 'Google Drive' : 'Google Calendar';
  showToast(isEn ? `Sync target switched to ${newTarget}` : `Đã chuyển mục tiêu đồng bộ sang ${newTarget}`);
}
window.toggleMobileHeaderSyncTarget = toggleMobileHeaderSyncTarget;

// Touch-scrubbing on 24h Modal Timeline Track
function handleTimelineTrackTouch(e, prefix = 'm-task') {
  if (!e || !e.touches || e.touches.length === 0) return;
  const touchObj = e.touches[0];
  const track = document.getElementById(`${prefix}-timeline-track`) || e.currentTarget;
  if (!track) return;
  const rect = track.getBoundingClientRect();
  const clientY = touchObj.clientY - rect.top;
  const height = rect.height || 1;
  const ratio = Math.max(0, Math.min(1, clientY / height));
  const totalMinutes = 24 * 60;
  const currentMinutes = Math.floor(ratio * totalMinutes);
  const h = Math.floor(currentMinutes / 60);
  const m = currentMinutes % 60;
  const timeStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;

  updateTimelineTouchSummaryBanner(null, timeStr, prefix);
}
window.handleTimelineTrackTouch = handleTimelineTrackTouch;

function updateTimelineTouchSummaryBanner(block, selectedTimeStr = null, prefix = 'm-task') {
  const banner = document.getElementById(`${prefix}-touch-summary-banner`) || document.querySelector('.timeline-touch-summary-banner');
  if (!banner) return;
  banner.classList.add('has-content');
  banner.style.display = 'flex';
  const isEn = appState.settings?.lang === 'en';
  if (selectedTimeStr) {
    banner.innerHTML = `<span>${isEn ? 'Selected time:' : 'Khung giờ chạm:'} <strong>${selectedTimeStr}</strong></span>`;
  }
}
window.updateTimelineTouchSummaryBanner = updateTimelineTouchSummaryBanner;

// Double-tap on Multi-day Columns
let lastDayColumnTapTime = 0;
let lastDayColumnTapDate = null;
function handleDayColumnTouchTap(event, dateStr) {
  const now = Date.now();
  if (lastDayColumnTapDate === dateStr && (now - lastDayColumnTapTime) < 350) {
    if (typeof switchToSingleDayView === 'function') {
      switchToSingleDayView(dateStr);
    } else {
      appState.settings.timelineDaySpan = 1;
      appState.currentDate = dateStr;
      saveData();
      renderApp();
    }
    lastDayColumnTapTime = 0;
    lastDayColumnTapDate = null;
  } else {
    lastDayColumnTapTime = now;
    lastDayColumnTapDate = dateStr;
  }
}
window.handleDayColumnTouchTap = handleDayColumnTouchTap;

// Horizontal Swipe Gestures
function initMobileTouchGestures() {
  if (typeof document === 'undefined') return;
  const container = document.getElementById('main-content-view') || document.body;
  if (!container || container._touchGesturesInitialized) return;
  container._touchGesturesInitialized = true;

  let touchStartX = 0;
  let touchStartY = 0;
  let touchStartTime = 0;

  container.addEventListener('touchstart', (e) => {
    if (e.touches.length !== 1) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
    touchStartTime = Date.now();
  }, { passive: true });

  container.addEventListener('touchend', (e) => {
    if (e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartX;
    const dy = e.changedTouches[0].clientY - touchStartY;
    const dt = Date.now() - touchStartTime;

    if (dt < 400 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.8) {
      if (dx > 0) {
        if (typeof navigateDate === 'function') navigateDate(-1);
      } else {
        if (typeof navigateDate === 'function') navigateDate(1);
      }
    }
  }, { passive: true });
}
window.initMobileTouchGestures = initMobileTouchGestures;

function openSettingsModal(initialTabId) {
  renderAllSettingsPanes();
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  
  if (initialTabId) {
    mobileSettingsState = 'detail';
    switchSettingsTab(initialTabId);
  } else {
    if (isMobile) {
      mobileSettingsState = 'menu';
    } else {
      const targetTab = activeSettingsTabId || 'tab-account-sync';
      switchSettingsTab(targetTab);
    }
  }

  updateMobileSettingsUIState();

  const modal = document.getElementById('settings-overlay-modal');
  if (modal) {
    modal.classList.add('active');
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    syncSettingsModalViewport();
  }

  const mobileSettingsBtn = document.getElementById('mobile-nav-btn-settings');
  if (mobileSettingsBtn) mobileSettingsBtn.classList.add('active');
}

function syncSettingsModalViewport() {
  const modal = document.getElementById('settings-overlay-modal');
  if (!modal || (!modal.classList.contains('active') && !modal.classList.contains('open'))) return;
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
  const win = modal.querySelector('.settings-chrome-window');
  if (isMobile) {
    const vpHeight = (typeof window !== 'undefined' && window.visualViewport) ? window.visualViewport.height : window.innerHeight;
    const vpTop = (typeof window !== 'undefined' && window.visualViewport) ? (window.visualViewport.offsetTop || 0) : 0;
    modal.style.top = `${vpTop}px`;
    modal.style.height = `${vpHeight}px`;
    if (win) {
      win.style.height = `${vpHeight}px`;
      win.style.maxHeight = `${vpHeight}px`;
    }
  } else {
    modal.style.top = '';
    modal.style.height = '';
    if (win) {
      win.style.height = '';
      win.style.maxHeight = '';
    }
  }
}
window.syncSettingsModalViewport = syncSettingsModalViewport;

function closeSettingsModal() {
  const modal = document.getElementById('settings-overlay-modal');
  if (modal) {
    modal.classList.remove('active');
    modal.classList.remove('open');
    document.body.style.overflow = '';
    modal.style.top = '';
    modal.style.height = '';
    const win = modal.querySelector('.settings-chrome-window');
    if (win) {
      win.style.height = '';
      win.style.maxHeight = '';
    }
  }

  const mobileSettingsBtn = document.getElementById('mobile-nav-btn-settings');
  if (mobileSettingsBtn) mobileSettingsBtn.classList.remove('active');
}

function handleSettingsBackdropClick(event) {
  if (event && event.target && event.target.id === 'settings-overlay-modal') {
    closeSettingsModal();
  }
}

window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.switchSettingsTab = switchSettingsTab;
window.handleSettingsBackdropClick = handleSettingsBackdropClick;
window.renderAllSettingsPanes = renderAllSettingsPanes;
window.updateSettingsModalI18n = updateSettingsModalI18n;
window.renderSettingsAccountSyncHtml = renderSettingsAccountSyncHtml;
window.renderSettingsAppearanceHtml = renderSettingsAppearanceHtml;
window.renderSettingsDataManagementHtml = renderSettingsDataManagementHtml;
window.renderSettingsHelpDocHtml = renderSettingsHelpDocHtml;
window.renderSettingsChangelogHtml = renderSettingsChangelogHtml;
window.selectMobileSettingsCategory = selectMobileSettingsCategory;
window.backToMobileSettingsMenu = backToMobileSettingsMenu;
window.updateMobileSettingsUIState = updateMobileSettingsUIState;
window.renderMobileTieredMenu = renderMobileTieredMenu;
window.getSettingsCategoryMeta = getSettingsCategoryMeta;

// Export Changelog Interactive Modal & Action Handlers to window
window.openAddChangelogModal = openAddChangelogModal;
window.submitAddChangelog = submitAddChangelog;
window.openQuickPasteChangelogModal = openQuickPasteChangelogModal;
window.updateQuickPastePreview = updateQuickPastePreview;
window.submitQuickPasteChangelog = submitQuickPasteChangelog;
window.openExportChangelogCodeModal = openExportChangelogCodeModal;
window.copyChangelogCodeToClipboard = copyChangelogCodeToClipboard;
window.copyVersionMarkdown = copyVersionMarkdown;
window.deleteChangelog = deleteChangelog;
window.resetChangelogsToDefault = resetChangelogsToDefault;

// Window Resize listener for responsive layout changes
if (typeof window !== 'undefined') {
  window.addEventListener('resize', () => {
    const modal = document.getElementById('settings-overlay-modal');
    if (modal && (modal.classList.contains('active') || modal.classList.contains('open'))) {
      updateMobileSettingsUIState();
      syncSettingsModalViewport();
    }
  });
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      syncSettingsModalViewport();
    });
    window.visualViewport.addEventListener('scroll', () => {
      syncSettingsModalViewport();
    });
  }
}

// Global Escape Key for Settings Modal
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const modal = document.getElementById('settings-overlay-modal');
    if (modal && modal.classList.contains('active')) {
      closeSettingsModal();
    }
  }
});

function renderSettingsView(container) {
  openSettingsModal('tab-account-sync');
  
  // Render a beautiful placeholder view in the main container in case user returns
  container.innerHTML = `
    <div class="settings-container" style="text-align:center; padding:48px 24px;">
      <div style="width:64px; height:64px; border-radius:16px; background:linear-gradient(135deg, #2563eb, #3b82f6); color:white; display:inline-flex; align-items:center; justify-content:center; margin-bottom:16px; box-shadow:0 8px 20px rgba(37, 99, 235, 0.25);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
      </div>
      <h2 style="font-size:20px; font-weight:800; color:var(--text-primary); margin-bottom:8px;">${t('settingsTitle')}</h2>
      <p style="font-size:13.5px; color:var(--text-muted); max-width:480px; margin:0 auto 20px auto; line-height:1.5;">${t('settingsSubtitle')}</p>
      <button class="btn-primary" onclick="openSettingsModal()" style="padding:10px 20px; font-size:14px; font-weight:700; margin:0 auto; display:inline-flex;">
        ${appState.settings.lang === 'en' ? 'Open Chrome Settings Window' : 'Mở Cửa Sổ Cài Đặt Hệ Thống'}
      </button>
    </div>
  `;
}

// ==========================================
// 10. CÁC MODAL THÊM / SỬA / XÓA CHI TIẾT
// ==========================================
function openModal(contentHtml) {
  let overlay = document.getElementById('app-modal-overlay');
  if (!overlay) {
    overlay = document.createElement('div');
    overlay.id = 'app-modal-overlay';
    overlay.className = 'modal-overlay';
    overlay.onclick = (e) => {
      if (e.target === overlay) closeModal();
    };
    document.body.appendChild(overlay);
  }
  overlay.innerHTML = `<div class="modal-card" onclick="event.stopPropagation()">${contentHtml}</div>`;
  overlay.style.display = 'flex';
  overlay.classList.add('active');
}

function closeModal() {
  if (window._activeCountdownInterval) {
    clearInterval(window._activeCountdownInterval);
    window._activeCountdownInterval = null;
  }
  const overlay = document.getElementById('app-modal-overlay');
  if (overlay) {
    overlay.classList.remove('active');
    overlay.style.display = 'none';
    overlay.innerHTML = '';
  }
  const toasts = document.querySelectorAll('.timeline-floating-toast');
  toasts.forEach(t => t.remove());
}

// Global escape key to close modals
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Google Calendar Recurring Action Choice Modal
window._pendingRecurringAction = null;

function promptRecurringScope({ title, promptText, onConfirm }) {
  const isEn = appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${escapeHtml(title || t('recurringActionTitle'))}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body recurring-scope-dialog">
      <p class="recurring-scope-prompt">
        ${escapeHtml(promptText || t('recurringPromptDesc'))}
      </p>
      <div class="recurring-scope-options">
        <label class="recurring-scope-option selected" onclick="selectRecurringOption('this')">
          <input type="radio" name="recurring-scope-radio" id="rec-opt-this" value="this" checked>
          <div>
            <div class="recurring-scope-label">${t('recurringScopeThis')}</div>
            <div class="recurring-scope-sublabel">${isEn ? 'Only applies to selected date' : 'Chỉ áp dụng cho ngày đang chọn'} (${formatDisplayDate(selectedDate)})</div>
          </div>
        </label>
        <label class="recurring-scope-option" onclick="selectRecurringOption('thisAndFollowing')">
          <input type="radio" name="recurring-scope-radio" id="rec-opt-thisAndFollowing" value="thisAndFollowing">
          <div>
            <div class="recurring-scope-label">${t('recurringScopeThisAndFollowing')}</div>
            <div class="recurring-scope-sublabel">${isEn ? 'From selected date onwards' : 'Từ ngày'} ${formatDisplayDate(selectedDate)} ${isEn ? '' : 'trở về sau'}</div>
          </div>
        </label>
        <label class="recurring-scope-option" onclick="selectRecurringOption('all')">
          <input type="radio" name="recurring-scope-radio" id="rec-opt-all" value="all">
          <div>
            <div class="recurring-scope-label">${t('recurringScopeAll')}</div>
            <div class="recurring-scope-sublabel">${isEn ? 'All dates in the recurring sequence' : 'Toàn bộ các ngày trong chuỗi lặp'}</div>
          </div>
        </label>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="confirmRecurringScopeAction()">${t('saveBtn')}</button>
    </div>
  `);
  window._pendingRecurringAction = onConfirm;
}

function selectRecurringOption(optVal) {
  const radio = document.getElementById('rec-opt-' + optVal);
  if (radio) radio.checked = true;
  document.querySelectorAll('.recurring-scope-option').forEach(el => el.classList.remove('selected'));
  if (radio && radio.closest('.recurring-scope-option')) {
    radio.closest('.recurring-scope-option').classList.add('selected');
  }
}

function confirmRecurringScopeAction() {
  const selectedRadio = document.querySelector('input[name="recurring-scope-radio"]:checked');
  const scope = selectedRadio ? selectedRadio.value : 'this';
  const action = window._pendingRecurringAction;
  window._pendingRecurringAction = null;
  closeModal();
  if (typeof action === 'function') {
    action(scope);
  }
}

// Toggle manual start time input visibility
function toggleManualStartTime(prefix) {
  const scheduleModeEl = document.getElementById(`${prefix}-schedule-mode`);
  const manualGroupEl = document.getElementById(`${prefix}-manual-time-group`);
  const scheduleGroupEl = document.getElementById(`${prefix}-schedule-mode-group`);
  const autoOptionsRow = document.getElementById(`${prefix}-auto-options-row`);
  const sessionEl = document.getElementById(`${prefix}-session`);
  const attentionEl = document.getElementById(`${prefix}-attention`);
  const hintEl = document.getElementById(`${prefix}-manual-hint`);
  const timelinePanel = document.getElementById(`${prefix}-timeline-panel`);
  const modalCard = document.querySelector('.modal-card');

  if (!scheduleModeEl) return;
  const isManual = scheduleModeEl.value === 'manual';

  if (manualGroupEl) {
    manualGroupEl.style.display = isManual ? 'flex' : 'none';
  }
  if (scheduleGroupEl) {
    scheduleGroupEl.style.gridColumn = isManual ? 'span 1' : '1 / -1';
  }
  if (autoOptionsRow) {
    autoOptionsRow.style.opacity = isManual ? '0.4' : '1';
    autoOptionsRow.style.pointerEvents = isManual ? 'none' : 'auto';
  }
  if (sessionEl) {
    sessionEl.disabled = isManual;
  }
  if (attentionEl) {
    attentionEl.disabled = isManual;
  }
  if (hintEl) {
    hintEl.style.display = isManual ? 'block' : 'none';
  }
  if (timelinePanel) {
    timelinePanel.style.display = isManual ? 'flex' : 'none';
  }
  if (modalCard) {
    if (isManual) {
      modalCard.classList.add('modal-card-manual-mode');
    } else {
      modalCard.classList.remove('modal-card-manual-mode');
    }
  }
  if (isManual) {
    updateTaskModalTimeline(prefix);
  }
}

/**
 * Cập nhật trực quan phân loại Ma trận Eisenhower ngay trong Modal
 */
function updateTaskQuadrantPreview(prefix) {
  const impEl = document.getElementById(`${prefix}-important`);
  const urgEl = document.getElementById(`${prefix}-urgent`);
  const badgeEl = document.getElementById(`${prefix}-quadrant-badge`);
  if (!impEl || !urgEl || !badgeEl) return;

  const isImp = impEl.checked;
  const isUrg = urgEl.checked;
  const isEn = appState.settings.lang === 'en';

  if (isImp && isUrg) {
    badgeEl.textContent = isEn ? 'Q1 • Urgent & Important (Do First)' : 'Q1 • Khẩn cấp & Quan trọng (Làm ngay)';
    badgeEl.style.background = 'rgba(239, 68, 68, 0.12)';
    badgeEl.style.color = 'var(--q1-accent, #ef4444)';
    badgeEl.style.borderColor = 'rgba(239, 68, 68, 0.3)';
  } else if (isImp && !isUrg) {
    badgeEl.textContent = isEn ? 'Q2 • Important & Not Urgent (Schedule)' : 'Q2 • Quan trọng & Không khẩn cấp (Lên lịch)';
    badgeEl.style.background = 'rgba(59, 130, 246, 0.12)';
    badgeEl.style.color = 'var(--q2-accent, #3b82f6)';
    badgeEl.style.borderColor = 'rgba(59, 130, 246, 0.3)';
  } else if (!isImp && isUrg) {
    badgeEl.textContent = isEn ? 'Q3 • Urgent & Not Important (Delegate)' : 'Q3 • Khẩn cấp & Không quan trọng (Ủy quyền)';
    badgeEl.style.background = 'rgba(245, 158, 11, 0.12)';
    badgeEl.style.color = 'var(--q3-accent, #f59e0b)';
    badgeEl.style.borderColor = 'rgba(245, 158, 11, 0.3)';
  } else {
    badgeEl.textContent = isEn ? 'Q4 • Not Urgent & Not Important (Eliminate)' : 'Q4 • Không khẩn cấp & Không quan trọng (Xóa bỏ/Để sau)';
    badgeEl.style.background = 'rgba(100, 116, 139, 0.12)';
    badgeEl.style.color = 'var(--q4-accent, #64748b)';
    badgeEl.style.borderColor = 'rgba(100, 116, 139, 0.3)';
  }
}

/**
 * =========================================================================
 * TIMELINE MODAL: THUẬT TOÁN GỘP CÁC KHỐI THỜI GIAN & HIỂN THỊ TOAST SHOW
 * 1. Các mốc thời gian rảnh, bị làm phiền giữ nguyên màu nếu ở liền nhau, gộp thành 1 khối
 * 2. Các sự kiện liền nhau (không bị cắt bởi mốc khác màu) gộp thành 1 khối
 * 3. Các khối màu chỉ hiển thị màu sắc, rê chuột hiển thị thông tin dạng toastshow
 * =========================================================================
 */
window._modalTimelineBlocks = [];

function computeDayTimelineBlocks(targetDateStr) {
  const isEn = appState?.settings?.lang === 'en';
  const rawEvents = [];

  // 1. Việc cố định
  (appState.fixedEvents || []).forEach(evt => {
    if (!isItemActiveOnDate(evt, targetDateStr)) return;
    const s = timeToMinutes(evt.start);
    const e = timeToMinutes(evt.end);
    if (s === e) return;
    const color = appState.settings?.colors?.fixedEvent || 'var(--c-fixed, #475569)';
    if (e < s) {
      // Overnight event
      rawEvents.push({ start: s, end: 1440, title: evt.title, note: evt.note || '', type: 'fixed', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
      rawEvents.push({ start: 0, end: e, title: evt.title, note: evt.note || '', type: 'fixed', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
    } else {
      rawEvents.push({ start: s, end: e, title: evt.title, note: evt.note || '', type: 'fixed', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
    }
  });

  // 2. Việc đột xuất
  (appState.transientEvents || []).forEach(evt => {
    if (!isItemActiveOnDate(evt, targetDateStr)) return;
    const s = timeToMinutes(evt.start);
    const e = timeToMinutes(evt.end);
    if (s === e) return;
    const color = appState.settings?.colors?.transientEvent || 'var(--c-transient, #dc2626)';
    if (e < s) {
      rawEvents.push({ start: s, end: 1440, title: evt.title, note: evt.note || '', type: 'transient', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
      rawEvents.push({ start: 0, end: e, title: evt.title, note: evt.note || '', type: 'transient', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
    } else {
      rawEvents.push({ start: s, end: e, title: evt.title, note: evt.note || '', type: 'transient', timeStr: `${evt.start} - ${evt.end}`, color, id: evt.id });
    }
  });

  // 3. Task đã xếp lịch
  (appState.tasks || []).forEach(task => {
    if (!isItemActiveOnDate(task, targetDateStr)) return;
    const slot = getTaskAssignedSlot(task, targetDateStr);
    if (!slot) return;
    const s = timeToMinutes(slot.start);
    const e = timeToMinutes(slot.end);
    if (e <= s) return;
    const color = appState.settings?.colors?.scheduledTask || 'var(--c-scheduled, #10b981)';
    rawEvents.push({
      start: s,
      end: e,
      title: task.title,
      note: task.note || '',
      type: 'scheduled',
      timeStr: `${slot.start} - ${slot.end}`,
      color,
      id: task.id
    });
  });

  // 4. Các khoảng rảnh & bị làm phiền từ calculateFreeTimeSlots
  const { freeSlots } = calculateFreeTimeSlots(targetDateStr);

  // Thu thập toàn bộ các mốc chia thời gian trong ngày [0, 1440]
  const boundaryPoints = new Set([0, 1440]);
  rawEvents.forEach(ev => {
    boundaryPoints.add(Math.max(0, Math.min(1440, ev.start)));
    boundaryPoints.add(Math.max(0, Math.min(1440, ev.end)));
  });
  freeSlots.forEach(slot => {
    boundaryPoints.add(Math.max(0, Math.min(1440, slot.start)));
    boundaryPoints.add(Math.max(0, Math.min(1440, slot.end)));
  });

  const sortedPoints = Array.from(boundaryPoints).sort((a, b) => a - b);

  // Phân mảnh atomic cho từng đoạn [t1, t2]
  const atomicSlices = [];
  for (let i = 0; i < sortedPoints.length - 1; i++) {
    const t1 = sortedPoints[i];
    const t2 = sortedPoints[i + 1];
    if (t2 <= t1) continue;

    // Xem có sự kiện nào bao trùm đoạn này không
    const coveringEvents = rawEvents.filter(ev => ev.start <= t1 && ev.end >= t2);
    if (coveringEvents.length > 0) {
      const primaryColor = coveringEvents[0].color;
      atomicSlices.push({
        start: t1,
        end: t2,
        kind: 'event',
        color: primaryColor,
        events: coveringEvents
      });
    } else {
      // Khoảng rảnh
      const coveringFree = freeSlots.find(slot => slot.start <= t1 && slot.end >= t2);
      if (coveringFree) {
        atomicSlices.push({
          start: t1,
          end: t2,
          kind: 'free',
          color: coveringFree.color,
          slotInfo: coveringFree
        });
      } else {
        const defColor = appState.settings?.colors?.focusLong || '#059669';
        atomicSlices.push({
          start: t1,
          end: t2,
          kind: 'free',
          color: defColor,
          slotInfo: { isQuiet: true, tagLabel: isEn ? 'Free Time' : 'Thời gian rảnh', noiseLabels: [] }
        });
      }
    }
  }

  // GỘP CÁC KHỐI THEO LUẬT 1 & 2:
  // - Luật 1: Các mốc rảnh, bị làm phiền giữ nguyên màu nếu liền nhau gộp vào thành một khối
  // - Luật 2: Các sự kiện liền nhau (không bị cắt bởi khoảng khác màu) gộp vào thành một khối
  const mergedBlocks = [];
  for (const slice of atomicSlices) {
    if (mergedBlocks.length === 0) {
      mergedBlocks.push({
        start: slice.start,
        end: slice.end,
        kind: slice.kind,
        color: slice.color,
        events: slice.events ? [...slice.events] : [],
        slotInfo: slice.slotInfo ? { ...slice.slotInfo } : null
      });
    } else {
      const prev = mergedBlocks[mergedBlocks.length - 1];
      const isAdjacent = prev.end === slice.start;
      const isSameColor = prev.color === slice.color && prev.kind === slice.kind;

      if (isAdjacent && isSameColor) {
        // Gộp liền kề cùng màu
        prev.end = slice.end;
        if (slice.kind === 'event' && slice.events) {
          slice.events.forEach(e => {
            if (!prev.events.some(pe => pe.id === e.id && pe.type === e.type)) {
              prev.events.push(e);
            }
          });
        }
        if (slice.kind === 'free' && slice.slotInfo && prev.slotInfo) {
          if (slice.slotInfo.noiseLabels) {
            prev.slotInfo.noiseLabels = Array.from(new Set([...(prev.slotInfo.noiseLabels || []), ...(slice.slotInfo.noiseLabels || [])]));
          }
        }
      } else {
        mergedBlocks.push({
          start: slice.start,
          end: slice.end,
          kind: slice.kind,
          color: slice.color,
          events: slice.events ? [...slice.events] : [],
          slotInfo: slice.slotInfo ? { ...slice.slotInfo } : null
        });
      }
    }
  }

  window._modalTimelineBlocks = mergedBlocks;
  return mergedBlocks;
}

function updateTaskModalTimeline(prefix = 'm-task') {
  const dateInput = document.getElementById(`${prefix}-date`);
  const targetDateStr = (dateInput ? dateInput.value : null) || selectedDate;
  const isEn = appState?.settings?.lang === 'en';

  const dateLabel = document.getElementById(`${prefix}-timeline-date-label`);
  if (dateLabel) {
    dateLabel.textContent = formatDisplayDate(targetDateStr);
  }

  const trackEl = document.getElementById(`${prefix}-timeline-track`);
  if (!trackEl) return;

  const mergedBlocks = computeDayTimelineBlocks(targetDateStr);

  // Render các khối màu: theo luật 3, KHỐI MÀU CHỈ HIỂN THỊ MÀU SẮC, KHÔNG CÓ TEXT BÊN TRONG
  const blocksHtml = mergedBlocks.map((b, idx) => {
    const topPercent = (b.start / 1440) * 100;
    const heightPercent = Math.max(0.35, ((b.end - b.start) / 1440) * 100);
    return `
      <div 
        class="timeline-colored-block" 
        data-block-idx="${idx}"
        style="position:absolute; left:0; right:0; top:${topPercent}%; height:${heightPercent}%; background-color:${b.color}; cursor:pointer; box-sizing:border-box; border-bottom:1px solid rgba(0,0,0,0.12);"
        onmouseenter="showTimelineToast(event, ${idx}, '${prefix}')"
        onmousemove="moveTimelineToast(event, '${prefix}')"
        onmouseleave="hideTimelineToast('${prefix}')"
        onclick="handleTimelineBlockClick(event, ${idx}, '${prefix}')">
      </div>
    `;
  }).join('');

  const previewBoxHtml = `
    <div id="${prefix}-timeline-preview-box" style="display:none; position:absolute; left:0; right:0; border:2px dashed #3b82f6; border-radius:4px; z-index:20; pointer-events:none; transition:top 0.1s ease, height 0.1s ease;">
      <span id="${prefix}-timeline-preview-badge" style="position:absolute; right:2px; top:2px; font-size:9.5px; font-weight:800; color:#fff; padding:1px 5px; border-radius:3px; white-space:nowrap;"></span>
    </div>
  `;

  trackEl.innerHTML = blocksHtml + previewBoxHtml;
  updateTaskModalTimelinePreview(prefix);
}

function updateTaskModalTimelinePreview(prefix = 'm-task') {
  const manualInput = document.getElementById(`${prefix}-manual-time`);
  const durInput = document.getElementById(`${prefix}-duration`);
  const dateInput = document.getElementById(`${prefix}-date`);
  const previewBox = document.getElementById(`${prefix}-timeline-preview-box`);
  if (!manualInput || !durInput || !previewBox) return;

  const startMin = timeToMinutes(manualInput.value || '08:00');
  const durMin = parseInt(durInput.value, 10) || 30;
  const endMin = Math.min(1440, startMin + durMin);
  const isEn = appState?.settings?.lang === 'en';

  const topPercent = (startMin / 1440) * 100;
  const heightPercent = Math.max(1.2, ((endMin - startMin) / 1440) * 100);

  previewBox.style.top = `${topPercent}%`;
  previewBox.style.height = `${heightPercent}%`;
  previewBox.style.display = 'block';

  // Kiểm tra xung đột với sự kiện bận
  const blocks = window._modalTimelineBlocks || [];
  const hasConflict = blocks.some(b => {
    if (b.kind !== 'event') return false;
    return Math.max(startMin, b.start) < Math.min(endMin, b.end);
  });

  const previewBadge = document.getElementById(`${prefix}-timeline-preview-badge`);
  if (hasConflict) {
    previewBox.style.borderColor = '#ef4444';
    previewBox.style.background = 'rgba(239, 68, 68, 0.32)';
    if (previewBadge) {
      previewBadge.style.background = '#ef4444';
      previewBadge.textContent = isEn ? '[!] Conflict' : '[!] Trùng lịch';
    }
  } else {
    previewBox.style.borderColor = '#10b981';
    previewBox.style.background = 'rgba(16, 185, 129, 0.32)';
    if (previewBadge) {
      previewBadge.style.background = '#10b981';
      previewBadge.textContent = isEn ? `OK (${durMin}m)` : `Rảnh (${durMin}p)`;
    }
  }
}

function showTimelineToast(e, blockIdx, prefix = 'm-task') {
  const blocks = window._modalTimelineBlocks || [];
  const block = blocks[blockIdx];
  if (!block) return;
  const isEn = appState?.settings?.lang === 'en';
  let toast = document.getElementById(`${prefix}-timeline-toast`);
  if (!toast) {
    toast = document.createElement('div');
    toast.id = `${prefix}-timeline-toast`;
    toast.className = 'timeline-floating-toast';
    document.body.appendChild(toast);
  }

  const startTimeStr = minutesToTime(block.start);
  const endTimeStr = minutesToTime(block.end);
  const duration = block.end - block.start;

  let bodyHtml = '';
  if (block.kind === 'event') {
    const evCount = block.events ? block.events.length : 0;
    const headerTitle = isEn 
      ? (evCount > 1 ? `Events & Tasks in block (${evCount})` : 'Event / Task in block')
      : (evCount > 1 ? `Sự kiện & Công việc trong khối (${evCount} việc)` : 'Sự kiện / Công việc trong khối');
    
    bodyHtml = `
      <div style="font-size:11px; font-weight:800; color:var(--text-secondary); margin-bottom:8px; text-transform:uppercase; letter-spacing:0.5px;">
        ${headerTitle}
      </div>
      <div style="display:flex; flex-direction:column; gap:6px; max-height:180px; overflow-y:auto; padding-right:2px;">
        ${(block.events || []).map(ev => {
          let typeLabel = isEn ? 'Task' : 'Công việc';
          if (ev.type === 'fixed') typeLabel = isEn ? 'Fixed Event' : 'Việc cố định';
          else if (ev.type === 'transient') typeLabel = isEn ? 'Transient Event' : 'Việc đột xuất';
          else if (ev.type === 'scheduled') typeLabel = isEn ? 'Scheduled Task' : 'Task đã xếp lịch';
          
          return `
            <div style="padding:6px 9px; border-radius:6px; background:var(--bg-card); border-left:3.5px solid ${ev.color}; font-size:12px; box-shadow:0 1px 3px rgba(0,0,0,0.1);">
              <div style="display:flex; align-items:center; justify-content:space-between; gap:6px;">
                <strong style="color:var(--text-primary); font-size:12px; line-height:1.3;">${escapeHtml(ev.title)}</strong>
                <span style="font-size:10px; color:var(--text-muted); font-weight:700; white-space:nowrap;">${ev.timeStr}</span>
              </div>
              ${ev.note ? `<div style="font-size:11px; color:var(--text-secondary); margin-top:3px; word-break:break-word;">${escapeHtml(ev.note)}</div>` : ''}
              <div style="font-size:10px; font-weight:700; color:${ev.color}; margin-top:3px; display:inline-block;">
                ${typeLabel}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  } else {
    // Free slot
    const isQuiet = !!block.slotInfo?.isQuiet;
    const noiseLabels = block.slotInfo?.noiseLabels || [];
    bodyHtml = `
      <div style="padding:8px 10px; border-radius:6px; background:var(--bg-card); font-size:12px; border-left:3.5px solid ${block.color};">
        <div style="display:flex; align-items:center; gap:6px; font-weight:800; font-size:12.5px; color:${isQuiet ? 'var(--c-focus-long, #059669)' : 'var(--c-distract-long, #d97706)'}; margin-bottom:4px;">
          <span>${isQuiet ? (isEn ? 'Free Time • Focus & Quiet' : 'Thời gian rảnh • Dễ tập trung / Yên tĩnh') : (isEn ? 'Free Time • Noisy / Distracted' : 'Thời gian rảnh • Bị làm phiền')}</span>
        </div>
        <div style="font-size:11.5px; color:var(--text-secondary); line-height:1.4;">
          ${isQuiet ? (isEn ? 'Ideal period for tasks requiring deep focus and quietness.' : 'Khung giờ rảnh lý tưởng cho công việc cần tập trung cao.') : (isEn ? 'Overlaps with scheduled noisy periods. Best for light or flexible tasks.' : 'Khung giờ rảnh bị ảnh hưởng bởi giờ ồn ào. Thích hợp việc nhẹ.')}
        </div>
        ${noiseLabels.length > 0 ? `
          <div style="font-size:11px; color:var(--pill-distract-short-text); margin-top:5px; font-weight:600; display:flex; align-items:center; gap:4px;">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${isEn ? 'Distraction: ' : 'Mốc làm phiền: '}${noiseLabels.join(', ')}</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  toast.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; gap:10px; border-bottom:1px solid var(--border-color); padding-bottom:6px; margin-bottom:8px;">
      <div style="display:flex; align-items:center; gap:6px;">
        <span style="display:inline-block; width:10px; height:10px; border-radius:50%; background:${block.color}; flex-shrink:0;"></span>
        <strong style="font-size:13px; color:var(--text-primary);">${startTimeStr} - ${endTimeStr}</strong>
      </div>
      <span style="font-size:11px; font-weight:800; color:var(--text-muted); background:var(--bg-card); padding:1px 6px; border-radius:4px;">${duration} ${isEn ? 'min' : 'phút'}</span>
    </div>
    ${bodyHtml}
    <div style="margin-top:8px; padding-top:6px; border-top:1px dashed var(--border-color); font-size:11px; color:var(--primary); font-weight:700; text-align:center;">
      👉 ${isEn ? 'Click to select this start time' : 'Bấm vào để chọn giờ bắt đầu'} (${startTimeStr})
    </div>
  `;

  toast.style.display = 'block';
  moveTimelineToast(e, prefix);
}

function moveTimelineToast(e, prefix = 'm-task') {
  const toast = document.getElementById(`${prefix}-timeline-toast`);
  if (!toast || toast.style.display === 'none') return;
  const trackEl = document.getElementById(`${prefix}-timeline-track`);
  const toastWidth = 280;
  const toastHeight = 180;

  let left = e.clientX - toastWidth - 14;
  if (left < 10 && trackEl) {
    const rect = trackEl.getBoundingClientRect();
    left = rect.right + 14;
  }
  if (left + toastWidth > window.innerWidth - 10) {
    left = window.innerWidth - toastWidth - 10;
  }
  let top = e.clientY - 30;
  if (top + toastHeight > window.innerHeight - 10) {
    top = window.innerHeight - toastHeight - 10;
  }
  if (top < 10) top = 10;

  toast.style.left = `${left}px`;
  toast.style.top = `${top}px`;
}

function hideTimelineToast(prefix = 'm-task') {
  const toast = document.getElementById(`${prefix}-timeline-toast`);
  if (toast) {
    toast.style.display = 'none';
  }
}

function handleTimelineBlockClick(e, idx, prefix = 'm-task') {
  e.stopPropagation();
  const blocks = window._modalTimelineBlocks || [];
  const block = blocks[idx];
  if (!block) return;
  const timeStr = minutesToTime(block.start);
  const manualInput = document.getElementById(`${prefix}-manual-time`);
  if (manualInput) {
    manualInput.value = timeStr;
    updateTaskModalTimelinePreview(prefix);
  }
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? `Selected start time: ${timeStr}` : `Đã chọn giờ bắt đầu: ${timeStr}`);
}

function handleTimelineTrackClick(e, prefix = 'm-task') {
  const trackEl = document.getElementById(`${prefix}-timeline-track`);
  if (!trackEl) return;
  const rect = trackEl.getBoundingClientRect();
  const offsetY = e.clientY - rect.top;
  const ratio = Math.max(0, Math.min(1, offsetY / rect.height));
  const rawMinutes = ratio * 1440;
  const snappedMinutes = Math.round(rawMinutes / 5) * 5;
  const timeStr = minutesToTime(Math.min(1435, snappedMinutes));

  const manualInput = document.getElementById(`${prefix}-manual-time`);
  if (manualInput) {
    manualInput.value = timeStr;
    updateTaskModalTimelinePreview(prefix);
  }
  const isEn = appState.settings?.lang === 'en';
  showToast(isEn ? `Selected start time: ${timeStr}` : `Đã chọn giờ bắt đầu: ${timeStr}`);
}

window.computeDayTimelineBlocks = computeDayTimelineBlocks;
window.updateTaskModalTimeline = updateTaskModalTimeline;
window.updateTaskModalTimelinePreview = updateTaskModalTimelinePreview;
window.showTimelineToast = showTimelineToast;
window.moveTimelineToast = moveTimelineToast;
window.hideTimelineToast = hideTimelineToast;
window.handleTimelineBlockClick = handleTimelineBlockClick;
window.handleTimelineTrackClick = handleTimelineTrackClick;

/**
 * Hàm sinh giao diện Form Task Thống nhất (Dùng chung cho cả Thêm mới & Chỉnh sửa)
 */
function renderUnifiedTaskModalHtml({ mode = 'add', task = null, prefillDate = selectedDate, prefillQuadrant = null }) {
  const isEdit = mode === 'edit' && !!task;
  const prefix = 'm-task';
  const isEn = appState.settings.lang === 'en';

  let isImportant = true;
  let isUrgent = true;

  if (isEdit) {
    isImportant = !!task.isImportant;
    isUrgent = !!task.isUrgent;
  } else if (prefillQuadrant) {
    isImportant = prefillQuadrant === 'q1' || prefillQuadrant === 'q2';
    isUrgent = prefillQuadrant === 'q1' || prefillQuadrant === 'q3';
  }

  const titleVal = isEdit ? (task.title || '') : '';
  const noteVal = isEdit ? (task.note || '') : '';
  const targetDateVal = isEdit ? (task.date || selectedDate) : (prefillDate || selectedDate);
  const durationVal = isEdit ? (task.estimatedMinutes || 30) : 30;
  const isManual = isEdit ? (task.scheduleMode === 'manual') : false;
  const manualStartTimeVal = isEdit ? (task.manualStartTime || '08:00') : '08:00';
  const sessionVal = isEdit ? (task.preferredSession || 'any') : 'any';
  const attentionVal = isEdit ? (task.attentionLevel || 'auto') : 'auto';
  const requireQuiet = isEdit ? !!task.requireQuiet : true;

  const repeatType = isEdit ? (task.repeatType || 'none') : 'none';
  const repeatDays = isEdit ? (task.repeatDays || (task.daysOfWeek || [1, 2, 3, 4, 5])) : [1, 2, 3, 4, 5];
  const repeatInterval = isEdit ? (task.repeatInterval || (repeatType === 'every_2_days' ? 2 : 1)) : 2;
  const startDate = isEdit ? (task.startDate || task.date || selectedDate) : targetDateVal;
  const endDate = isEdit ? (task.endDate || '') : '';

  const modalTitle = isEdit ? t('modalEditTaskTitle') : t('modalAddTaskTitle');

  return `
    <div class="modal-header">
      <h3 class="modal-title">${modalTitle}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body" style="padding:16px 20px;">
      <div class="task-modal-split-layout" style="display:flex; gap:20px; align-items:stretch; width:100%;">
        <!-- CỘT BÊN TRÁI: FORM NHẬP LIỆU TASK -->
        <div class="task-modal-form-col" style="flex:1; min-width:0; display:flex; flex-direction:column; gap:14px;">
          <div class="form-group">
            <label class="form-label">${t('taskTitleLabel')}</label>
            <input type="text" id="${prefix}-title" class="form-input" placeholder="${isEn ? 'e.g., Complete weekly financial report...' : 'Ví dụ: Hoàn thành báo cáo tài chính tuần...'}" value="${escapeHtml(titleVal)}">
          </div>
          <div class="form-group">
            <label class="form-label">${t('taskNoteLabel')}</label>
            <textarea id="${prefix}-note" class="form-textarea" rows="2" placeholder="${t('taskNotePlaceholder')}">${escapeHtml(noteVal)}</textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">${t('targetDateLabel')}</label>
              <input type="date" id="${prefix}-date" class="form-input" value="${targetDateVal}" onchange="syncRecurrenceDate('${prefix}', 'main'); updateTaskModalTimeline('${prefix}');">
            </div>
            <div class="form-group">
              <label class="form-label">${t('durationLabel')}</label>
              <input type="number" id="${prefix}-duration" class="form-input" value="${durationVal}" min="5" step="5" oninput="updateTaskModalTimelinePreview('${prefix}')" onchange="updateTaskModalTimelinePreview('${prefix}')">
            </div>
          </div>

          <!-- Phân loại ma trận Eisenhower & Yêu cầu không gian (Important, Urgent, Quiet trên 1 hàng) -->
          <div class="form-group">
            <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:6px;">
              <label class="form-label" style="margin-bottom:0;">${isEn ? 'Eisenhower Matrix Classification' : 'Phân loại ma trận Eisenhower'}</label>
              <span id="${prefix}-quadrant-badge" class="smart-pill" style="font-size:11px; font-weight:700; border:1px solid transparent; padding:2px 8px; border-radius:4px; transition:all 0.15s ease;"></span>
            </div>
            <div style="display:flex; align-items:center; gap:16px; margin-top:4px; flex-wrap:nowrap;">
              <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; user-select:none; white-space:nowrap;">
                <input type="checkbox" id="${prefix}-important" ${isImportant ? 'checked' : ''} onchange="updateTaskQuadrantPreview('${prefix}')">
                <strong>${t('isImportantLabel')}</strong>
              </label>
              <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; user-select:none; white-space:nowrap;">
                <input type="checkbox" id="${prefix}-urgent" ${isUrgent ? 'checked' : ''} onchange="updateTaskQuadrantPreview('${prefix}')">
                <strong>${t('isUrgentLabel')}</strong>
              </label>
            </div>
          </div>

          <!-- 1. CHẾ ĐỘ XẾP LỊCH (Tự động hoặc Tùy chọn giờ) -->
          <div class="form-row" id="${prefix}-schedule-row" style="margin-top: 6px;">
            <div class="form-group" id="${prefix}-schedule-mode-group" style="${isManual ? 'grid-column: span 1;' : 'grid-column: 1 / -1;'}">
              <label class="form-label" for="${prefix}-schedule-mode">${t('scheduleModeLabel') || 'Chế độ xếp lịch'}</label>
              <select id="${prefix}-schedule-mode" class="form-select form-input" onchange="toggleManualStartTime('${prefix}')">
                <option value="auto" ${!isManual ? 'selected' : ''}>${t('scheduleModeAuto') || 'Tự động xếp lịch'}</option>
                <option value="manual" ${isManual ? 'selected' : ''}>${t('scheduleModeManual') || 'Tùy chọn giờ (Thủ công)'}</option>
              </select>
            </div>
            <div class="form-group" id="${prefix}-manual-time-group" style="${isManual ? 'display: flex;' : 'display: none;'}">
              <label class="form-label" for="${prefix}-manual-time">${t('manualStartTimeLabel') || 'Giờ bắt đầu'}</label>
              <input type="time" id="${prefix}-manual-time" class="form-input" value="${manualStartTimeVal}" oninput="updateTaskModalTimelinePreview('${prefix}')" onchange="updateTaskModalTimelinePreview('${prefix}')">
            </div>
          </div>

          <!-- 2. CÁC TÙY CHỌN TỰ ĐỘNG: KHUNG GIỜ VÀ MỨC ĐỘ TẬP TRUNG -->
          <div class="form-row" id="${prefix}-auto-options-row" style="margin-top: 6px; transition: opacity 0.2s; ${isManual ? 'opacity: 0.4; pointer-events: none;' : ''}">
            <div class="form-group">
              <label class="form-label" for="${prefix}-session">${t('preferredSessionLabel')}</label>
              <select id="${prefix}-session" class="form-select form-input" ${isManual ? 'disabled' : ''}>
                <option value="any" ${sessionVal === 'any' ? 'selected' : ''}>${t('sessionAny')}</option>
                <option value="morning" ${sessionVal === 'morning' ? 'selected' : ''}>${t('sessionMorning')}</option>
                <option value="afternoon" ${sessionVal === 'afternoon' ? 'selected' : ''}>${t('sessionAfternoon')}</option>
                <option value="evening" ${sessionVal === 'evening' ? 'selected' : ''}>${t('sessionEvening')}</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label" for="${prefix}-attention">${t('attentionLevelLabel') || 'Mức độ tập trung yêu cầu'}</label>
              <select id="${prefix}-attention" class="form-select form-input" ${isManual ? 'disabled' : ''}>
                <option value="auto" ${attentionVal === 'auto' ? 'selected' : ''}>${t('attentionAuto') || 'Tự động'}</option>
                <option value="high" ${attentionVal === 'high' ? 'selected' : ''}>${t('attentionHigh') || 'Cao'}</option>
                <option value="medium" ${attentionVal === 'medium' ? 'selected' : ''}>${t('attentionMedium') || 'Trung bình'}</option>
                <option value="low" ${attentionVal === 'low' ? 'selected' : ''}>${t('attentionLow') || 'Thấp'}</option>
                <option value="any" ${attentionVal === 'any' ? 'selected' : ''}>${t('attentionAny') || 'Bất kỳ'}</option>
              </select>
            </div>
          </div>
          <div id="${prefix}-manual-hint" style="${isManual ? 'display: block;' : 'display: none;'} font-size: 11.5px; color: var(--text-muted); margin-top: -6px; margin-bottom: 4px;">
            <em>${t('manualHintText') || 'Chế độ tùy chọn giờ: Quan sát timeline bên phải để đối chiếu khung giờ trống và tránh trùng lịch.'}</em>
          </div>

          <!-- YÊU CẦU KHÔNG GIAN YÊN TĨNH -->
          <div class="form-group" style="margin-top: 6px;">
            <label style="display:flex; align-items:center; gap:6px; font-size:13px; cursor:pointer; user-select:none; white-space:nowrap;" title="${isEn ? 'Requires deep quiet environment' : 'Cần không gian yên tĩnh cao để tập trung'}">
              <input type="checkbox" id="${prefix}-quiet" ${requireQuiet ? 'checked' : ''}>
              <strong>${t('requireQuietLabel')}</strong>
            </label>
          </div>

          <!-- BỘ CHỌN LẶP LẠI (GOOGLE CALENDAR RECURRENCE) -->
          ${renderRecurrenceInputs(prefix, {
            repeatType,
            repeatDays,
            repeatInterval,
            startDate,
            endDate
          })}
        </div>

        <!-- CỘT BÊN PHẢI: TIMELINE QUAN SÁT MỐC THỜI GIAN TRONG NGÀY -->
        <div id="${prefix}-timeline-panel" class="task-modal-timeline-col" style="${isManual ? 'display:flex;' : 'display:none;'} flex-direction:column; width:290px; flex-shrink:0; border-left:1px solid var(--border-color); padding-left:18px; align-self:stretch;">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:4px;">
            <span style="font-size:12px; font-weight:800; color:var(--text-primary); text-transform:uppercase; letter-spacing:0.5px;">
              ${isEn ? 'Day Timeline' : 'Mốc Giờ Trong Ngày'}
            </span>
            <span id="${prefix}-timeline-date-label" style="font-size:11px; font-weight:700; color:var(--primary);">
              ${targetDateVal}
            </span>
          </div>
          <div style="font-size:11px; color:var(--text-muted); margin-bottom:10px; line-height:1.35;">
            ${isEn ? 'Hover color blocks to view events • Click track to pick time' : 'Rê chuột xem sự kiện • Bấm mốc để chọn giờ'}
          </div>

          <!-- Banner tóm tắt khung giờ chạm trên điện thoại -->
          <div id="${prefix}-touch-summary-banner" class="timeline-touch-summary-banner" style="display:none;"></div>

          <!-- Trục timeline 24h kèm thước đo thời gian -->
          <div id="${prefix}-timeline-track-wrapper" class="task-modal-timeline-track-wrapper" style="display:flex; gap:8px; align-items:stretch; flex:1; min-height:480px; position:relative; user-select:none;">
            <!-- Cột vạch giờ bên trái (00:00 - 24:00 với bước nhảy 2h chi tiết) -->
            <div style="display:flex; flex-direction:column; justify-content:space-between; width:34px; padding:2px 0; font-size:9px; font-weight:700; color:var(--text-muted); text-align:right; line-height:1;">
              <span>00:00</span>
              <span>02:00</span>
              <span>04:00</span>
              <span>06:00</span>
              <span>08:00</span>
              <span>10:00</span>
              <span>12:00</span>
              <span>14:00</span>
              <span>16:00</span>
              <span>18:00</span>
              <span>20:00</span>
              <span>22:00</span>
              <span>24:00</span>
            </div>

            <!-- Vùng track chứa các khối màu chỉ hiển thị màu sắc -->
            <div id="${prefix}-timeline-track" class="task-modal-timeline-track" onclick="handleTimelineTrackClick(event, '${prefix}')" ontouchstart="handleTimelineTrackTouch(event, '${prefix}')" ontouchmove="handleTimelineTrackTouch(event, '${prefix}')" style="flex:1; position:relative; background:var(--bg-main, #0f172a); border-radius:6px; border:1px solid var(--border-color); overflow:hidden; cursor:pointer;" title="${isEn ? 'Click anywhere on track to pick time' : 'Bấm vào vạch để chọn mốc giờ'}">
              <!-- Render động bởi updateTaskModalTimeline -->
            </div>
          </div>

          <!-- Chú thích màu sắc (Legend) -->
          <div style="margin-top:12px; display:flex; flex-direction:column; gap:4px; font-size:10px; color:var(--text-secondary); background:var(--bg-card); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color);">
            <div style="display:flex; align-items:center; justify-content:space-between;">
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--c-fixed, #475569);"></span> ${isEn ? 'Fixed' : 'Cố định'}</span>
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--c-transient, #dc2626);"></span> ${isEn ? 'Transient' : 'Đột xuất'}</span>
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--c-scheduled, #10b981);"></span> ${isEn ? 'Scheduled' : 'Đã xếp'}</span>
            </div>
            <div style="display:flex; align-items:center; justify-content:space-between; margin-top:2px;">
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--c-focus-long, #059669);"></span> ${isEn ? 'Free (Focus)' : 'Rảnh (Tập trung)'}</span>
              <span style="display:flex; align-items:center; gap:4px;"><span style="width:7px; height:7px; border-radius:2px; background:var(--c-distract-long, #d97706);"></span> ${isEn ? 'Free (Noisy)' : 'Rảnh (Làm phiền)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      ${isEdit ? `
        <button class="btn-secondary" style="color:#ef4444; margin-right:auto;" onclick="deleteTask('${task.id}', null, '${selectedDate}')">${t('deleteBtn')}</button>
      ` : ''}
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="${isEdit ? `submitEditTask('${task.id}')` : 'submitAddTask()'}">${t('saveBtn')}</button>
    </div>
  `;
}

// Modal Thêm Task Mới
function openAddTaskModal(prefillDate = selectedDate, prefillQuadrant = null) {
  openModal(renderUnifiedTaskModalHtml({
    mode: 'add',
    prefillDate,
    prefillQuadrant
  }));
  updateTaskQuadrantPreview('m-task');
  updateTaskModalTimeline('m-task');
}

// Modal Sửa Task
function openEditTaskModal(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const isManual = task.scheduleMode === 'manual';
  openModal(renderUnifiedTaskModalHtml({
    mode: 'edit',
    task,
    prefillDate: task.date || selectedDate
  }));
  if (isManual) {
    const modalCard = document.querySelector('.modal-card');
    if (modalCard) modalCard.classList.add('modal-card-manual-mode');
  }
  updateTaskQuadrantPreview('m-task');
  updateTaskModalTimeline('m-task');
}

/**
 * Thu thập và chuẩn hóa dữ liệu từ Form Task
 */
function extractTaskFormData(prefix = 'm-task') {
  const titleEl = document.getElementById(`${prefix}-title`);
  const title = (titleEl ? titleEl.value : '').trim();
  const note = (document.getElementById(`${prefix}-note`)?.value || '').trim();
  const date = document.getElementById(`${prefix}-date`)?.value || selectedDate;
  const duration = parseInt(document.getElementById(`${prefix}-duration`)?.value, 10) || 30;
  const isImportant = !!document.getElementById(`${prefix}-important`)?.checked;
  const isUrgent = !!document.getElementById(`${prefix}-urgent`)?.checked;
  const requireQuiet = !!document.getElementById(`${prefix}-quiet`)?.checked;
  const preferredSession = document.getElementById(`${prefix}-session`)?.value || 'any';
  const attentionLevel = document.getElementById(`${prefix}-attention`)?.value || 'auto';
  const scheduleMode = document.getElementById(`${prefix}-schedule-mode`)?.value || 'auto';
  const manualStartTime = document.getElementById(`${prefix}-manual-time`)?.value || '08:00';
  const rec = getRecurrenceFromForm(prefix);

  if (!title) {
    showToast('Vui lòng nhập tên công việc!');
    if (titleEl) titleEl.focus();
    return null;
  }

  const taskDate = date || selectedDate;
  let manualSlot = null;
  if (scheduleMode === 'manual' && manualStartTime) {
    const startMins = timeToMinutes(manualStartTime);
    const endMins = Math.min(1440, startMins + duration);
    manualSlot = {
      start: manualStartTime,
      end: minutesToTime(endMins)
    };
  }

  return {
    title,
    note,
    date: taskDate,
    duration,
    isImportant,
    isUrgent,
    requireQuiet,
    preferredSession,
    attentionLevel,
    scheduleMode,
    manualStartTime: scheduleMode === 'manual' ? manualStartTime : null,
    manualSlot,
    rec
  };
}

function submitAddTask() {
  shouldScrollToNow = false;
  const data = extractTaskFormData('m-task');
  if (!data) return;

  const newTask = {
    id: 't-' + Date.now(),
    date: data.date,
    title: data.title,
    note: data.note,
    isImportant: data.isImportant,
    isUrgent: data.isUrgent,
    estimatedMinutes: data.duration,
    requireQuiet: data.requireQuiet,
    preferredSession: data.preferredSession,
    attentionLevel: data.attentionLevel,
    scheduleMode: data.scheduleMode,
    manualStartTime: data.manualStartTime,
    status: data.manualSlot ? 'scheduled' : 'todo',
    assignedSlot: data.manualSlot,
    assignedSlotsByDate: data.manualSlot ? { [data.date]: data.manualSlot } : {},
    completedDates: [],
    repeatType: data.rec.repeatType,
    repeatDays: data.rec.repeatDays,
    repeatInterval: data.rec.repeatInterval || (data.rec.repeatType === 'every_2_days' ? 2 : 1),
    startDate: data.rec.startDate || data.date,
    endDate: data.rec.endDate
  };

  touch(newTask);
  const previousTasks = JSON.parse(JSON.stringify(appState.tasks));

  appState.tasks.push(newTask);
  saveData();
  closeModal();
  renderApp();

  const isRecurring = (newTask.repeatType && newTask.repeatType !== 'none');
  const repLabel = isRecurring ? getRepeatLabel(newTask) : '';
  const isActiveToday = isItemActiveOnDate(newTask, selectedDate);

  let nextDateStr = null;
  if (isRecurring && !isActiveToday) {
    const [cy, cm, cd] = selectedDate.split('-').map(Number);
    const startObj = new Date(cy, cm - 1, cd);
    for (let i = 1; i <= 365; i++) {
      const candidateDate = new Date(startObj.getFullYear(), startObj.getMonth(), startObj.getDate() + i);
      const candStr = formatDateToYMD(candidateDate);
      if (isItemActiveOnDate(newTask, candStr)) {
        nextDateStr = candStr;
        break;
      }
    }
  }

  let toastMessage = t('toastTaskAdded');
  if (isRecurring && repLabel) {
    if (!isActiveToday && nextDateStr) {
      toastMessage = `Đã thêm công việc lặp lại (${repLabel})! Lần xuất hiện gần nhất: ${formatDisplayDate(nextDateStr)}`;
    } else {
      toastMessage = `${t('toastTaskAdded')} (${repLabel})`;
    }
  }

  showToast(toastMessage, {
    onUndo: () => {
      appState.tasks = previousTasks;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });

  if (typeof pushTaskToGCal === 'function') {
    pushTaskToGCal(newTask, 'update', newTask.date);
  }
}

function submitEditTask(taskId, scope = null) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const data = extractTaskFormData('m-task');
  if (!data) return;

  const isRecurring = (task.repeatType && task.repeatType !== 'none') || (data.rec.repeatType && data.rec.repeatType !== 'none');

  if (isRecurring && !scope) {
    promptRecurringScope({
      title: t('recurringActionTitle'),
      promptText: t('recurringPromptDesc'),
      onConfirm: (chosenScope) => executeEditTaskWithScope(taskId, chosenScope, data, selectedDate)
    });
    return;
  }

  executeEditTaskWithScope(taskId, scope || 'all', data, selectedDate);
}

function executeEditTaskWithScope(taskId, scope, values, targetDateStr) {
  shouldScrollToNow = false;
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task || task.deleted) return;

  const previousTasks = JSON.parse(JSON.stringify(appState.tasks));
  const prevDuration = task.estimatedMinutes;

  task.title = values.title;
  task.note = values.note;
  task.isImportant = values.isImportant;
  task.isUrgent = values.isUrgent;
  task.estimatedMinutes = values.duration;
  task.requireQuiet = values.requireQuiet;
  task.preferredSession = values.preferredSession;
  task.attentionLevel = values.attentionLevel;
  touch(task);

  const currentAssigned = getTaskAssignedSlot(task, targetDateStr) || task.assignedSlot;

  if (scope === 'all' || !task.repeatType || task.repeatType === 'none') {
    task.date = values.date || selectedDate;
    task.scheduleMode = values.scheduleMode;
    task.manualStartTime = values.manualStartTime;
    task.repeatType = values.rec.repeatType;
    task.repeatDays = values.rec.repeatDays;
    task.repeatInterval = values.rec.repeatInterval || (values.rec.repeatType === 'every_2_days' ? 2 : 1);
    task.startDate = values.rec.startDate || task.date;
    task.endDate = values.rec.endDate;

    // Harmonize or immediately assign manual slot
    if (values.scheduleMode === 'manual' && values.manualStartTime) {
      const startMins = timeToMinutes(values.manualStartTime);
      const endMins = Math.min(1440, startMins + values.duration);
      const manualSlot = {
        start: values.manualStartTime,
        end: minutesToTime(endMins)
      };
      if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
      task.assignedSlotsByDate[targetDateStr] = manualSlot;
      task.assignedSlot = manualSlot;
      task.status = 'scheduled';
    } else if (currentAssigned && currentAssigned.start && currentAssigned.end) {
      if (prevDuration && values.duration && prevDuration !== values.duration) {
        const slotStart = timeToMinutes(currentAssigned.start);
        const newSlotEnd = Math.min(1440, slotStart + values.duration);
        if (newSlotEnd > slotStart) {
          const updatedAssigned = {
            start: currentAssigned.start,
            end: minutesToTime(newSlotEnd)
          };
          if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
          task.assignedSlotsByDate[targetDateStr] = updatedAssigned;
          task.assignedSlot = updatedAssigned;
        }
      }
    }
  } else if (scope === 'this') {
    // Sửa riêng ngày này: giữ lại lịch đã xếp (slot) để không làm mất task trên timeline
    let manualSlot = null;
    if (values.scheduleMode === 'manual' && values.manualStartTime) {
      const startMins = timeToMinutes(values.manualStartTime);
      const endMins = Math.min(1440, startMins + values.duration);
      manualSlot = {
        start: values.manualStartTime,
        end: minutesToTime(endMins)
      };
    }
    const finalSlot = manualSlot || currentAssigned;

    if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
    if (finalSlot) {
      task.assignedSlotsByDate[targetDateStr] = finalSlot;
      task.assignedSlot = finalSlot;
      task.status = 'scheduled';
    }
  } else if (scope === 'thisAndFollowing') {
    let manualSlot = null;
    if (values.scheduleMode === 'manual' && values.manualStartTime) {
      const startMins = timeToMinutes(values.manualStartTime);
      const endMins = Math.min(1440, startMins + values.duration);
      manualSlot = {
        start: values.manualStartTime,
        end: minutesToTime(endMins)
      };
    }
    const finalSlot = manualSlot || currentAssigned;

    task.scheduleMode = values.scheduleMode;
    task.manualStartTime = values.manualStartTime;
    task.repeatType = values.rec.repeatType;
    task.repeatDays = values.rec.repeatDays;
    task.startDate = targetDateStr;
    task.endDate = values.rec.endDate;

    if (!task.assignedSlotsByDate) task.assignedSlotsByDate = {};
    if (finalSlot) {
      task.assignedSlotsByDate[targetDateStr] = finalSlot;
      task.assignedSlot = finalSlot;
      task.status = 'scheduled';
    }
  }

  saveData();
  closeModal();
  renderApp();
  showToast(t('toastTaskUpdated'), {
    onUndo: () => {
      appState.tasks = previousTasks;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });

  if (typeof pushTaskToGCal === 'function') {
    pushTaskToGCal(task, 'update', targetDateStr);
  }
}

// Standalone saveTask function for programmatic persistence
function saveTask(taskData) {
  if (!taskData) return null;
  const id = taskData.id || ('t-' + Date.now());
  const index = appState.tasks.findIndex(t => t.id === id);
  const scheduleMode = taskData.scheduleMode || 'auto';
  const manualStartTime = scheduleMode === 'manual' ? (taskData.manualStartTime || '08:00') : null;
  const duration = (typeof taskData.estimatedMinutes === 'number' && taskData.estimatedMinutes > 0) ? taskData.estimatedMinutes : 30;
  let assignedSlot = taskData.assignedSlot || null;
  let assignedSlotsByDate = taskData.assignedSlotsByDate ? { ...taskData.assignedSlotsByDate } : {};
  let status = taskData.status || 'todo';

  if (scheduleMode === 'manual' && manualStartTime && !assignedSlot) {
    const startMins = timeToMinutes(manualStartTime);
    const endMins = Math.min(1440, startMins + duration);
    assignedSlot = { start: manualStartTime, end: minutesToTime(endMins) };
    const taskDate = taskData.date || selectedDate;
    if (taskDate) {
      assignedSlotsByDate[taskDate] = assignedSlot;
    }
    status = 'scheduled';
  }

  const taskToSave = {
    ...taskData,
    id,
    status,
    assignedSlot,
    assignedSlotsByDate,
    attentionLevel: taskData.attentionLevel || 'auto',
    scheduleMode,
    manualStartTime
  };
  touch(taskToSave);

  if (index >= 0) {
    Object.assign(appState.tasks[index], taskToSave);
  } else {
    appState.tasks.push(taskToSave);
  }
  saveData();
  return taskToSave;
}

function deleteTask(taskId, scope = null, targetDateStr = selectedDate) {
  shouldScrollToNow = false;
  const taskToDelete = appState.tasks.find(t => t.id === taskId);
  if (!taskToDelete || taskToDelete.deleted) return;

  const isRecurring = taskToDelete.repeatType && taskToDelete.repeatType !== 'none';
  if (isRecurring && !scope) {
    promptRecurringScope({
      title: t('recurringDeleteTitle'),
      promptText: t('recurringDeletePromptDesc'),
      onConfirm: (chosenScope) => deleteTask(taskId, chosenScope, targetDateStr)
    });
    return;
  }

  const previousTasks = JSON.parse(JSON.stringify(appState.tasks));

  if (!isRecurring || scope === 'all') {
    if (typeof pushTaskToGCal === 'function') {
      pushTaskToGCal(taskToDelete, 'delete');
    }
    const idx = appState.tasks.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      const deletedRec = { id: taskId, deleted: true };
      touch(deletedRec);
      appState.tasks[idx] = deletedRec;
    }
  } else if (scope === 'this') {
    if (!taskToDelete.excludedDates) taskToDelete.excludedDates = [];
    if (!taskToDelete.excludedDates.includes(targetDateStr)) {
      taskToDelete.excludedDates.push(targetDateStr);
    }
    touch(taskToDelete);
  } else if (scope === 'thisAndFollowing') {
    const start = taskToDelete.startDate || taskToDelete.date;
    if (start && targetDateStr <= start) {
      if (typeof pushTaskToGCal === 'function') {
        pushTaskToGCal(taskToDelete, 'delete');
      }
      const idx = appState.tasks.findIndex(t => t.id === taskId);
      if (idx !== -1) {
        const deletedRec = { id: taskId, deleted: true };
        touch(deletedRec);
        appState.tasks[idx] = deletedRec;
      }
    } else {
      taskToDelete.endDate = getPreviousDateStr(targetDateStr);
      touch(taskToDelete);
    }
  }

  saveData();
  closeModal();
  renderApp();
  showToast(t('toastTaskDeleted'), {
    onUndo: () => {
      appState.tasks = previousTasks;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

// Modal Thêm & Sửa Việc Cố Định (Google Calendar Style)
function openAddFixedEventModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalAddFixedTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('titleFixedLabel')}</label>
        <input type="text" id="m-fixed-title" class="form-input" placeholder="${isEn ? 'e.g., Morning exercise' : 'Ví dụ: Tập thể dục buổi sáng'}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('activityNoteLabel')}</label>
        <textarea id="m-fixed-note" class="form-input form-textarea" rows="2" placeholder="${t('activityNotePlaceholder')}"></textarea>
      </div>
      <div class="form-group" style="margin-bottom: 12px;">
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
          <input type="checkbox" id="m-fixed-recovery" class="form-checkbox">
          <span>${isEn ? 'Energy Recovery Event' : 'Sự kiện phục hồi năng lượng'}</span>
        </label>
        <small style="display: block; font-size: 11px; color: var(--text-muted, #64748b); margin-top: 4px; line-height: 1.4;">${isEn ? '(Check if this activity restores focus e.g. Sleep, Meditation, Exercise... Resets fatigue for subsequent slots)' : '(Đánh dấu nếu hoạt động này giúp phục hồi sự tập trung như Ngủ, Thiền, Tập thể dục... Hệ thống sẽ reset điểm cạn kiệt năng lượng cho các khung giờ sau)'}</small>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-fixed-start" class="form-input" value="07:00">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-fixed-end" class="form-input" value="07:45">
        </div>
      </div>
      ${renderRecurrenceInputs('m-fixed', { repeatType: 'daily', repeatDays: [0, 1, 2, 3, 4, 5, 6], startDate: selectedDate })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitFixedEvent()">${t('saveBtn')}</button>
    </div>
  `);
}

function openEditFixedEventModal(eventId) {
  const item = appState.fixedEvents.find(f => f.id === eventId);
  if (!item) return;

  const isEn = appState.settings && appState.settings.lang === 'en';
  const currentDays = item.repeatDays || item.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
  const currentRepeatType = item.repeatType || (currentDays.length === 7 ? 'daily' : 'weekly');

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalEditFixedTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('titleFixedLabel')}</label>
        <input type="text" id="m-fixed-title" class="form-input" value="${escapeHtml(item.title)}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('activityNoteLabel')}</label>
        <textarea id="m-fixed-note" class="form-input form-textarea" rows="2" placeholder="${t('activityNotePlaceholder')}">${escapeHtml(item.note || '')}</textarea>
      </div>
      <div class="form-group" style="margin-bottom: 12px;">
        <label class="checkbox-label" style="display: flex; align-items: center; gap: 8px; font-weight: 600; cursor: pointer;">
          <input type="checkbox" id="m-fixed-recovery" class="form-checkbox" ${item.isRecovery ? 'checked' : ''}>
          <span>${isEn ? 'Energy Recovery Event' : 'Sự kiện phục hồi năng lượng'}</span>
        </label>
        <small style="display: block; font-size: 11px; color: var(--text-muted, #64748b); margin-top: 4px; line-height: 1.4;">${isEn ? '(Check if this activity restores focus e.g. Sleep, Meditation, Exercise... Resets fatigue for subsequent slots)' : '(Đánh dấu nếu hoạt động này giúp phục hồi sự tập trung như Ngủ, Thiền, Tập thể dục... Hệ thống sẽ reset điểm cạn kiệt năng lượng cho các khung giờ sau)'}</small>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-fixed-start" class="form-input" value="${item.start}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-fixed-end" class="form-input" value="${item.end}">
        </div>
      </div>
      ${renderRecurrenceInputs('m-fixed', {
        repeatType: currentRepeatType,
        repeatDays: currentDays,
        startDate: item.startDate || selectedDate,
        endDate: item.endDate || ''
      })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" style="color:#ef4444; margin-right:auto;" onclick="deleteFixedEvent('${item.id}', null, '${selectedDate}')">${t('deleteBtn')}</button>
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitFixedEvent('${item.id}')">${t('saveBtn')}</button>
    </div>
  `);
}

function submitFixedEvent(existingId = null, scope = null) {
  const title = document.getElementById('m-fixed-title').value.trim();
  const note = (document.getElementById('m-fixed-note')?.value || '').trim();
  const start = document.getElementById('m-fixed-start').value;
  const end = document.getElementById('m-fixed-end').value;
  const isRecovery = document.getElementById('m-fixed-recovery')?.checked || false;
  const rec = getRecurrenceFromForm('m-fixed');

  if (!title || !start || !end) {
    showToast('Vui lòng điền đủ thông tin!');
    return;
  }
  if (timeToMinutes(start) === timeToMinutes(end)) {
    showToast(t('timeRangeInvalid'));
    return;
  }

  const daysOfWeek = rec.repeatType === 'daily' ? [0, 1, 2, 3, 4, 5, 6]
                   : (rec.repeatType === 'weekdays' ? [1, 2, 3, 4, 5] : rec.repeatDays);

  const values = { title, note, start, end, rec, daysOfWeek, isRecovery };

  if (existingId) {
    const item = appState.fixedEvents.find(f => f.id === existingId);
    if (item && item.repeatType && item.repeatType !== 'none' && !scope) {
      promptRecurringScope({
        title: t('recurringActionTitle'),
        promptText: t('recurringPromptDesc'),
        onConfirm: (chosenScope) => executeEditFixedEventWithScope(existingId, chosenScope, values, selectedDate)
      });
      return;
    }
  }

  executeEditFixedEventWithScope(existingId, scope || 'all', values, selectedDate);
}

function executeEditFixedEventWithScope(existingId, scope, values, targetDateStr) {
  const previousFixed = JSON.parse(JSON.stringify(appState.fixedEvents));

  if (existingId) {
    const item = appState.fixedEvents.find(f => f.id === existingId);
    if (item && !item.deleted) {
      if (scope === 'all' || !item.repeatType || item.repeatType === 'none') {
        item.title = values.title;
        item.note = values.note;
        item.start = values.start;
        item.end = values.end;
        item.isRecovery = values.isRecovery;
        item.repeatType = values.rec.repeatType;
        item.daysOfWeek = values.daysOfWeek;
        item.repeatDays = values.daysOfWeek;
        item.startDate = values.rec.startDate;
        item.endDate = values.rec.endDate;
        touch(item);
      } else if (scope === 'this') {
        if (!item.excludedDates) item.excludedDates = [];
        if (!item.excludedDates.includes(targetDateStr)) {
          item.excludedDates.push(targetDateStr);
        }
        touch(item);
        const newFe = {
          id: 'fe-' + Date.now(),
          title: values.title,
          note: values.note,
          start: values.start,
          end: values.end,
          isRecovery: values.isRecovery,
          repeatType: 'none',
          daysOfWeek: [],
          repeatDays: [],
          startDate: targetDateStr,
          endDate: targetDateStr,
          date: targetDateStr
        };
        touch(newFe);
        appState.fixedEvents.push(newFe);
      } else if (scope === 'thisAndFollowing') {
        item.endDate = getPreviousDateStr(targetDateStr);
        touch(item);
        const newFe = {
          id: 'fe-' + Date.now(),
          title: values.title,
          note: values.note,
          start: values.start,
          end: values.end,
          isRecovery: values.isRecovery,
          repeatType: values.rec.repeatType,
          daysOfWeek: values.daysOfWeek,
          repeatDays: values.daysOfWeek,
          startDate: targetDateStr,
          endDate: values.rec.endDate
        };
        touch(newFe);
        appState.fixedEvents.push(newFe);
      }
    }
  } else {
    const newFe = {
      id: 'fe-' + Date.now(),
      title: values.title,
      note: values.note,
      start: values.start,
      end: values.end,
      isRecovery: values.isRecovery,
      repeatType: values.rec.repeatType,
      daysOfWeek: values.daysOfWeek,
      repeatDays: values.daysOfWeek,
      startDate: values.rec.startDate,
      endDate: values.rec.endDate
    };
    touch(newFe);
    appState.fixedEvents.push(newFe);
  }

  saveData();
  closeModal();
  renderApp();
  showToast(existingId ? t('toastEventUpdated') : t('toastEventAdded'), {
    onUndo: () => {
      appState.fixedEvents = previousFixed;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });

  if (typeof pushFixedEventToGCal === 'function') {
    const savedItem = existingId 
      ? appState.fixedEvents.find(f => f.id === existingId)
      : appState.fixedEvents[appState.fixedEvents.length - 1];
    if (savedItem) pushFixedEventToGCal(savedItem, 'update');
  }
}

// Standalone saveFixedEvent function for programmatic persistence
function saveFixedEvent(eventData) {
  if (!eventData) return null;
  const id = eventData.id || ('fe-' + Date.now());
  const index = appState.fixedEvents.findIndex(f => f.id === id);
  const eventToSave = {
    ...eventData,
    id,
    isRecovery: Boolean(eventData.isRecovery)
  };
  touch(eventToSave);

  if (index >= 0) {
    Object.assign(appState.fixedEvents[index], eventToSave);
  } else {
    appState.fixedEvents.push(eventToSave);
  }
  saveData();
  return eventToSave;
}

function deleteFixedEvent(eventId, scope = null, targetDateStr = selectedDate) {
  const item = appState.fixedEvents.find(f => f.id === eventId);
  if (!item || item.deleted) return;

  const isRecurring = item.repeatType && item.repeatType !== 'none';
  if (isRecurring && !scope) {
    promptRecurringScope({
      title: t('recurringDeleteTitle'),
      promptText: t('recurringDeletePromptDesc'),
      onConfirm: (chosenScope) => deleteFixedEvent(eventId, chosenScope, targetDateStr)
    });
    return;
  }

  const previousFixed = JSON.parse(JSON.stringify(appState.fixedEvents));

  if (!isRecurring || scope === 'all') {
    if (typeof pushFixedEventToGCal === 'function') {
      pushFixedEventToGCal(item, 'delete');
    }
    const idx = appState.fixedEvents.findIndex(f => f.id === eventId);
    if (idx !== -1) {
      const deletedRec = { id: eventId, deleted: true };
      touch(deletedRec);
      appState.fixedEvents[idx] = deletedRec;
    }
  } else if (scope === 'this') {
    if (!item.excludedDates) item.excludedDates = [];
    if (!item.excludedDates.includes(targetDateStr)) {
      item.excludedDates.push(targetDateStr);
    }
    touch(item);
  } else if (scope === 'thisAndFollowing') {
    const start = item.startDate || item.date;
    if (start && targetDateStr <= start) {
      if (typeof pushFixedEventToGCal === 'function') {
        pushFixedEventToGCal(item, 'delete');
      }
      const idx = appState.fixedEvents.findIndex(f => f.id === eventId);
      if (idx !== -1) {
        const deletedRec = { id: eventId, deleted: true };
        touch(deletedRec);
        appState.fixedEvents[idx] = deletedRec;
      }
    } else {
      item.endDate = getPreviousDateStr(targetDateStr);
      touch(item);
    }
  }

  saveData();
  closeModal();
  renderApp();
  showToast(t('toastEventDeleted'), {
    onUndo: () => {
      appState.fixedEvents = previousFixed;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

// Modal Chọn Loại Sự Kiện Mới (Cho Phím Tắt E)
function openEventChoiceModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${isEn ? 'Select Event Type' : 'Chọn Loại Sự Kiện Mới'}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body" style="padding: 20px 20px 24px; text-align: center;">
      <p style="margin-bottom:18px; color:var(--text-secondary); font-size:13.5px; line-height:1.5;">
        ${isEn ? 'Choose the type of event you want to create:' : 'Chọn loại sự kiện bạn muốn thêm:'}
      </p>
      <div style="display:flex; gap:12px; justify-content:center; align-items:center; flex-wrap:wrap;">
        <button type="button" class="event-choice-btn" onclick="closeModal(); openAddFixedEventModal();">
          <span style="font-size:14px; font-weight:600; color:var(--text-primary);">${isEn ? 'Fixed Event' : 'Cố Định'}</span>
          <span style="font-size:11px; font-weight:500; color:var(--text-muted); background:var(--bg-subtle); border:1px solid var(--border-color); padding:2px 7px; border-radius:4px; margin-top:5px;">${isEn ? 'Press F' : 'Nhấn phím F'}</span>
        </button>
        <button type="button" class="event-choice-btn" onclick="closeModal(); openAddTransientEventModal();">
          <span style="font-size:14px; font-weight:600; color:var(--text-primary);">${isEn ? 'Transient Event' : 'Đột Xuất'}</span>
          <span style="font-size:11px; font-weight:500; color:var(--text-muted); background:var(--bg-subtle); border:1px solid var(--border-color); padding:2px 7px; border-radius:4px; margin-top:5px;">${isEn ? 'Press T' : 'Nhấn phím T'}</span>
        </button>
      </div>
    </div>
  `);
  const modalCard = document.querySelector('#app-modal-overlay .modal-card');
  if (modalCard) modalCard.dataset.eventChoiceModal = 'true';
}
function openAddTransientEventModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalAddTransientTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('titleTransientLabel')}</label>
        <input type="text" id="m-transient-title" class="form-input" placeholder="${isEn ? 'e.g., Pick up package' : 'Ví dụ: Đi nhận bưu phẩm'}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('activityNoteLabel')}</label>
        <textarea id="m-transient-note" class="form-input form-textarea" rows="2" placeholder="${t('activityNotePlaceholder')}"></textarea>
      </div>
      <div class="form-group">
        <label class="form-label">${t('targetDateLabel')}</label>
        <input type="date" id="m-transient-date" class="form-input" value="${selectedDate}" onchange="syncRecurrenceDate('m-transient', 'main')">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-transient-start" class="form-input" value="10:00">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-transient-end" class="form-input" value="10:45">
        </div>
      </div>
      ${renderRecurrenceInputs('m-transient', { repeatType: 'none', startDate: selectedDate })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitTransientEvent()">${t('saveBtn')}</button>
    </div>
  `);
}

function openEditTransientEventModal(eventId) {
  const item = appState.transientEvents.find(tr => tr.id === eventId);
  if (!item) return;

  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalEditTransientTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('titleTransientLabel')}</label>
        <input type="text" id="m-transient-title" class="form-input" value="${escapeHtml(item.title)}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('activityNoteLabel')}</label>
        <textarea id="m-transient-note" class="form-input form-textarea" rows="2" placeholder="${t('activityNotePlaceholder')}">${escapeHtml(item.note || '')}</textarea>
      </div>
      <div class="form-group">
        <label class="form-label">${t('targetDateLabel')}</label>
        <input type="date" id="m-transient-date" class="form-input" value="${item.date}" onchange="syncRecurrenceDate('m-transient', 'main')">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-transient-start" class="form-input" value="${item.start}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-transient-end" class="form-input" value="${item.end}">
        </div>
      </div>
      ${renderRecurrenceInputs('m-transient', {
        repeatType: item.repeatType || 'none',
        repeatDays: item.repeatDays || [1, 2, 3, 4, 5],
        startDate: item.startDate || item.date || selectedDate,
        endDate: item.endDate || ''
      })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" style="color:#ef4444; margin-right:auto;" onclick="deleteTransientEvent('${item.id}', null, '${selectedDate}')">${t('deleteBtn')}</button>
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitTransientEvent('${item.id}')">${t('saveBtn')}</button>
    </div>
  `);
}

function submitTransientEvent(existingId = null, scope = null) {
  const title = document.getElementById('m-transient-title').value.trim();
  const note = (document.getElementById('m-transient-note')?.value || '').trim();
  const date = document.getElementById('m-transient-date').value;
  const start = document.getElementById('m-transient-start').value;
  const end = document.getElementById('m-transient-end').value;
  const rec = getRecurrenceFromForm('m-transient');

  if (!title || !start || !end) {
    showToast('Vui lòng điền đủ thông tin!');
    return;
  }
  if (timeToMinutes(start) === timeToMinutes(end)) {
    showToast(t('timeRangeInvalid'));
    return;
  }

  const values = { title, note, date, start, end, rec };

  if (existingId) {
    const item = appState.transientEvents.find(tr => tr.id === existingId);
    if (item && item.repeatType && item.repeatType !== 'none' && !scope) {
      promptRecurringScope({
        title: t('recurringActionTitle'),
        promptText: t('recurringPromptDesc'),
        onConfirm: (chosenScope) => executeEditTransientEventWithScope(existingId, chosenScope, values, selectedDate)
      });
      return;
    }
  }

  executeEditTransientEventWithScope(existingId, scope || 'all', values, selectedDate);
}

function executeEditTransientEventWithScope(existingId, scope, values, targetDateStr) {
  const previousTransient = JSON.parse(JSON.stringify(appState.transientEvents));

  if (existingId) {
    const item = appState.transientEvents.find(tr => tr.id === existingId);
    if (item && !item.deleted) {
      if (scope === 'all' || !item.repeatType || item.repeatType === 'none') {
        item.title = values.title;
        item.note = values.note;
        item.date = values.date;
        item.start = values.start;
        item.end = values.end;
        item.repeatType = values.rec.repeatType;
        item.repeatDays = values.rec.repeatDays;
        item.startDate = values.rec.startDate;
        item.endDate = values.rec.endDate;
        touch(item);
      } else if (scope === 'this') {
        if (!item.excludedDates) item.excludedDates = [];
        if (!item.excludedDates.includes(targetDateStr)) {
          item.excludedDates.push(targetDateStr);
        }
        touch(item);
        const newTe = {
          id: 'te-' + Date.now(),
          title: values.title,
          note: values.note,
          date: targetDateStr,
          start: values.start,
          end: values.end,
          repeatType: 'none',
          repeatDays: [],
          startDate: targetDateStr,
          endDate: targetDateStr
        };
        touch(newTe);
        appState.transientEvents.push(newTe);
      } else if (scope === 'thisAndFollowing') {
        item.endDate = getPreviousDateStr(targetDateStr);
        touch(item);
        const newTe = {
          id: 'te-' + Date.now(),
          title: values.title,
          note: values.note,
          date: targetDateStr,
          start: values.start,
          end: values.end,
          repeatType: values.rec.repeatType,
          repeatDays: values.rec.repeatDays,
          startDate: targetDateStr,
          endDate: values.rec.endDate
        };
        touch(newTe);
        appState.transientEvents.push(newTe);
      }
    }
  } else {
    const newTe = {
      id: 'te-' + Date.now(),
      title: values.title,
      note: values.note,
      date: values.date || selectedDate,
      start: values.start,
      end: values.end,
      repeatType: values.rec.repeatType,
      repeatDays: values.rec.repeatDays,
      startDate: values.rec.startDate,
      endDate: values.rec.endDate
    };
    touch(newTe);
    appState.transientEvents.push(newTe);
  }

  saveData();
  closeModal();
  renderApp();
  showToast(existingId ? t('toastEventUpdated') : t('toastEventAdded'), {
    onUndo: () => {
      appState.transientEvents = previousTransient;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });

  if (typeof pushTransientEventToGCal === 'function') {
    const savedItem = existingId 
      ? appState.transientEvents.find(tr => tr.id === existingId)
      : appState.transientEvents[appState.transientEvents.length - 1];
    if (savedItem) pushTransientEventToGCal(savedItem, 'update');
  }
}

function deleteTransientEvent(eventId, scope = null, targetDateStr = selectedDate) {
  const evtToDelete = appState.transientEvents.find(tr => tr.id === eventId);
  if (!evtToDelete || evtToDelete.deleted) return;

  const isRecurring = evtToDelete.repeatType && evtToDelete.repeatType !== 'none';
  if (isRecurring && !scope) {
    promptRecurringScope({
      title: t('recurringDeleteTitle'),
      promptText: t('recurringDeletePromptDesc'),
      onConfirm: (chosenScope) => deleteTransientEvent(eventId, chosenScope, targetDateStr)
    });
    return;
  }

  const previousTransient = JSON.parse(JSON.stringify(appState.transientEvents));

  if (!isRecurring || scope === 'all') {
    if (typeof pushTransientEventToGCal === 'function') {
      pushTransientEventToGCal(evtToDelete, 'delete');
    }
    const idx = appState.transientEvents.findIndex(tr => tr.id === eventId);
    if (idx !== -1) {
      const deletedRec = { id: eventId, deleted: true };
      touch(deletedRec);
      appState.transientEvents[idx] = deletedRec;
    }
  } else if (scope === 'this') {
    if (!evtToDelete.excludedDates) evtToDelete.excludedDates = [];
    if (!evtToDelete.excludedDates.includes(targetDateStr)) {
      evtToDelete.excludedDates.push(targetDateStr);
    }
    touch(evtToDelete);
  } else if (scope === 'thisAndFollowing') {
    const start = evtToDelete.startDate || evtToDelete.date;
    if (start && targetDateStr <= start) {
      if (typeof pushTransientEventToGCal === 'function') {
        pushTransientEventToGCal(evtToDelete, 'delete');
      }
      const idx = appState.transientEvents.findIndex(tr => tr.id === eventId);
      if (idx !== -1) {
        const deletedRec = { id: eventId, deleted: true };
        touch(deletedRec);
        appState.transientEvents[idx] = deletedRec;
      }
    } else {
      evtToDelete.endDate = getPreviousDateStr(targetDateStr);
      touch(evtToDelete);
    }
  }

  saveData();
  closeModal();
  renderApp();
  showToast(t('toastEventDeleted'), {
    onUndo: () => {
      appState.transientEvents = previousTransient;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

// Modal Thêm & Sửa Khung Giờ Ồn Ào (Hỗ trợ lặp lại giống Google Calendar & Xóa linh hoạt)
function openAddNoisyIntervalModal() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalAddNoisyTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('noisyLabelPrompt')}</label>
        <input type="text" id="m-noisy-label" class="form-input" placeholder="${isEn ? 'e.g., Family dinner / Watching TV' : 'Ví dụ: Giờ gia đình ăn tối / Xem tivi'}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-noisy-start" class="form-input" value="18:00">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-noisy-end" class="form-input" value="20:00">
        </div>
      </div>
      ${renderRecurrenceInputs('m-noisy', {
        repeatType: 'daily',
        repeatDays: [0, 1, 2, 3, 4, 5, 6],
        startDate: selectedDate
      })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitNoisyInterval()">${t('saveBtn')}</button>
    </div>
  `);
}

function openEditNoisyIntervalModal(index) {
  const item = appState.settings.noisyIntervals[index];
  if (!item) return;

  const isEn = appState.settings && appState.settings.lang === 'en';
  const currentDays = item.repeatDays || item.daysOfWeek || [0, 1, 2, 3, 4, 5, 6];
  const currentRepeatType = item.repeatType || 'daily';

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalEditNoisyTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('noisyLabelPrompt')}</label>
        <input type="text" id="m-noisy-label" class="form-input" value="${escapeHtml(item.label)}">
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">${t('startTimeLabel')}</label>
          <input type="time" id="m-noisy-start" class="form-input" value="${item.start}">
        </div>
        <div class="form-group">
          <label class="form-label">${t('endTimeLabel')}</label>
          <input type="time" id="m-noisy-end" class="form-input" value="${item.end}">
        </div>
      </div>
      ${renderRecurrenceInputs('m-noisy', {
        repeatType: currentRepeatType,
        repeatDays: currentDays,
        startDate: item.startDate || selectedDate,
        endDate: item.endDate || ''
      })}
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" style="color:#ef4444; margin-right:auto;" onclick="confirmDeleteNoisyInterval(${index})">${t('deleteBtn')}</button>
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitNoisyInterval(${index})">${t('saveBtn')}</button>
    </div>
  `);
}

function submitNoisyInterval(index = null) {
  const label = document.getElementById('m-noisy-label').value.trim();
  const start = document.getElementById('m-noisy-start').value;
  const end = document.getElementById('m-noisy-end').value;
  const rec = getRecurrenceFromForm('m-noisy');

  if (!label || !start || !end) {
    showToast('Vui lòng điền đủ thông tin!');
    return;
  }

  const daysOfWeek = rec.repeatType === 'daily' ? [0, 1, 2, 3, 4, 5, 6]
                   : (rec.repeatType === 'weekdays' ? [1, 2, 3, 4, 5] : rec.repeatDays);

  const previousNoisy = JSON.parse(JSON.stringify(appState.settings.noisyIntervals));
  const existingItem = (index !== null && appState.settings.noisyIntervals[index]) ? appState.settings.noisyIntervals[index] : null;

  const itemData = {
    id: existingItem?.id || ('ni-' + Date.now()),
    start,
    end,
    label,
    repeatType: rec.repeatType,
    repeatDays: daysOfWeek,
    daysOfWeek: daysOfWeek,
    startDate: rec.startDate,
    endDate: rec.endDate,
    excludedDates: existingItem?.excludedDates || []
  };
  touch(itemData);

  if (index !== null && index >= 0) {
    appState.settings.noisyIntervals[index] = itemData;
  } else {
    appState.settings.noisyIntervals.push(itemData);
  }

  saveData();
  closeModal();
  renderApp();
  showToast(index !== null ? t('toastNoisyUpdated') : t('toastNoisyAdded'), {
    onUndo: () => {
      appState.settings.noisyIntervals = previousNoisy;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

function confirmDeleteNoisyInterval(index) {
  const item = appState.settings.noisyIntervals[index];
  if (!item) return;

  const isRecurring = (item.repeatType || 'daily') !== 'none';

  if (!isRecurring) {
    deleteNoisyInterval(index);
    closeModal();
    return;
  }

  promptRecurringScope({
    title: t('deleteNoisyTitle'),
    promptText: t('recurringDeletePromptDesc'),
    onConfirm: (scope) => {
      if (scope === 'this') {
        excludeNoisyIntervalDate(index, selectedDate);
      } else if (scope === 'thisAndFollowing') {
        const previousNoisy = JSON.parse(JSON.stringify(appState.settings.noisyIntervals));
        item.endDate = getPreviousDateStr(selectedDate);
        touch(item);
        saveData();
        renderApp();
        showToast(t('toastNoisyUpdated'), {
          onUndo: () => {
            appState.settings.noisyIntervals = previousNoisy;
            saveData();
            renderApp();
            showToast(t('toastUndoSuccess'));
          }
        });
      } else {
        deleteNoisyInterval(index);
      }
    }
  });
}

function excludeNoisyIntervalDate(index, dateStr) {
  const item = appState.settings.noisyIntervals[index];
  if (!item || item.deleted) return;
  const previousNoisy = JSON.parse(JSON.stringify(appState.settings.noisyIntervals));
  if (!item.excludedDates) item.excludedDates = [];
  if (!item.excludedDates.includes(dateStr)) {
    item.excludedDates.push(dateStr);
  }
  touch(item);
  saveData();
  renderApp();
  showToast(t('toastNoisyExcluded', { date: dateStr }), {
    onUndo: () => {
      appState.settings.noisyIntervals = previousNoisy;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

function deleteNoisyInterval(index) {
  const previousNoisy = JSON.parse(JSON.stringify(appState.settings.noisyIntervals));
  let idx = typeof index === 'number'
    ? index
    : appState.settings.noisyIntervals.findIndex(n => n.id === index);
  const item = appState.settings.noisyIntervals[idx];
  if (item) {
    const id = item.id || ('ni-' + Date.now());
    const deletedRec = { id, deleted: true };
    touch(deletedRec);
    appState.settings.noisyIntervals[idx] = deletedRec;
  }
  saveData();
  renderApp();
  showToast(t('toastNoisyDeleted'), {
    onUndo: () => {
      appState.settings.noisyIntervals = previousNoisy;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

window.openAddNoisyIntervalModal = openAddNoisyIntervalModal;
window.openEditNoisyIntervalModal = openEditNoisyIntervalModal;
window.submitNoisyInterval = submitNoisyInterval;
window.confirmDeleteNoisyInterval = confirmDeleteNoisyInterval;
window.excludeNoisyIntervalDate = excludeNoisyIntervalDate;
window.deleteNoisyInterval = deleteNoisyInterval;

// Modal Thêm & Xóa Ghi Chú Lịch (Google Calendar Style)
function openAddNoteModal(prefillDate = selectedDate) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalAddNoteTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${t('targetDateLabel')}</label>
        <input type="date" id="m-note-date" class="form-input" value="${prefillDate}">
      </div>
      <div class="form-group">
        <label class="form-label">${t('noteContentLabel')}</label>
        <textarea id="m-note-content" class="form-textarea" rows="3" placeholder="${isEn ? 'e.g., Bring notebook, parent meeting notes...' : 'Ví dụ: Mang theo sổ ghi chép, nhớ lịch họp phụ huynh...'}"></textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitAddNote()">${t('saveBtn')}</button>
    </div>
  `);
}

function submitAddNote() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const date = document.getElementById('m-note-date').value;
  const content = document.getElementById('m-note-content').value.trim();

  if (!content) {
    showToast(isEn ? 'Please enter note content!' : 'Vui lòng nhập nội dung ghi chú!');
    return;
  }

  const previousNotes = JSON.parse(JSON.stringify(appState.notes));
  const id = (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : ('note-' + Date.now() + '-' + Math.random().toString(36).slice(2, 9));

  const newNote = {
    id,
    date: date || selectedDate,
    content
  };
  touch(newNote);
  appState.notes.push(newNote);

  saveData();
  closeModal();
  renderApp();

  if (shouldPushToGCal('notes')) {
    pushNoteToGCal(newNote, 'create');
  }

  showToast(t('toastNoteAdded'), {
    onUndo: () => {
      appState.notes = previousNotes;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

function deleteNote(noteId) {
  const previousNotes = JSON.parse(JSON.stringify(appState.notes));
  const note = appState.notes.find(n => n.id === noteId);
  const idx = appState.notes.findIndex(n => n.id === noteId);
  if (idx !== -1) {
    const deletedRec = { ...note, deleted: true };
    touch(deletedRec);
    appState.notes[idx] = deletedRec;
    if (note && note.gcal_event_id && shouldPushToGCal('notes')) {
      pushNoteToGCal(note, 'delete');
    }
  }
  saveData();
  renderApp();
  showToast(t('toastNoteDeleted'), {
    onUndo: () => {
      appState.notes = previousNotes;
      saveData();
      renderApp();
      showToast(t('toastUndoSuccess'));
    }
  });
}

// Modal Chọn Task Cho Free Slot & Gắn / Điều Chỉnh Tag
function setSlotTagOverride(dateStr, start, end, newTag) {
  if (!appState.slotOverrides) appState.slotOverrides = {};
  const key = `${dateStr}_${start}_${end}`;
  if (newTag === 'auto') {
    delete appState.slotOverrides[key];
    showToast(t('toastTagReset'));
  } else {
    appState.slotOverrides[key] = newTag;
    showToast(newTag === 'focus' ? 'Đã gán: ' + t('tagFocus') : 'Đã gán: ' + t('tagDistract'));
  }
  saveData();
  renderApp();
  // Cập nhật lại nội dung modal nếu đang xem slot này
  const { freeSlots } = calculateFreeTimeSlots(dateStr);
  const updatedSlot = freeSlots.find(s => s.start === start && s.end === end);
  if (updatedSlot) {
    openFreeSlotModal(updatedSlot.id);
  }
}

function toggleSlotTagDirect(event, dateStr, start, end) {
  if (event) {
    event.stopPropagation();
    event.preventDefault();
  }
  if (!appState.slotOverrides) appState.slotOverrides = {};
  const key = `${dateStr}_${start}_${end}`;
  const { freeSlots } = calculateFreeTimeSlots(dateStr);
  const slot = freeSlots.find(s => s.start === start && s.end === end);
  if (!slot) return;

  const currentIsQuiet = slot.isQuiet;
  const newTag = currentIsQuiet ? 'distract' : 'focus';
  appState.slotOverrides[key] = newTag;
  saveData();
  renderApp();
  showToast(newTag === 'focus' ? 'Đã chuyển sang: ' + t('tagFocus') : 'Đã chuyển sang: ' + t('tagDistract'));
}

function openFreeSlotModal(slotId, dateStr = selectedDate) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
  const { freeSlots } = calculateFreeTimeSlots(dateStr);
  const slot = freeSlots.find(s => s.id === slotId);
  if (!slot) return;

  const unassignedTasks = appState.tasks.filter(t => !t.deleted && isItemActiveOnDate(t, dateStr) && !getTaskAssignedSlot(t, dateStr) && !isTaskDoneOnDate(t, dateStr));

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalSelectTaskSlotTitle')}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <!-- Thông tin khung giờ -->
      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); padding:14px; border-radius:10px; margin-bottom:14px; border-left:5px solid ${slot.color}; box-shadow:var(--shadow-sm);">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <div style="font-weight:700; font-size:15px; color:var(--text-primary);">${slot.tagLabel} (${slot.duration} ${t('minShort')})</div>
          <span class="smart-pill ${slot.pillClass}" style="font-size:11px; padding:3px 10px;">
            ${slot.isQuiet ? t('quietEnv') : t('noisyEnv')}
          </span>
        </div>
        <div style="font-size:13px; color:var(--text-secondary);">
          <strong>${slot.startTimeStr} - ${slot.endTimeStr}</strong> • ${slot.isLong ? (isEn ? `Long (&ge; ${threshold} mins)` : `Dài (&ge; ${threshold} phút)`) : (isEn ? `Short (&lt; ${threshold} mins)` : `Ngắn (&lt; ${threshold} phút)`)}
        </div>
      </div>

      <!-- BỘ GẮN / ĐIỀU CHỈNH TAG ĐỘ TẬP TRUNG -->
      <div class="slot-tag-control-card">
        <div style="font-size:13px; font-weight:700; color:var(--text-primary); margin-bottom:4px;">
          ${t('tagAdjustTitle')}
        </div>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px; line-height:1.4;">
          ${t('tagAdjustDesc', { threshold })}
        </div>
        <div style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-tag-choice ${slot.isQuiet ? 'selected-focus' : ''}" onclick="setSlotTagOverride('${dateStr}', ${slot.start}, ${slot.end}, 'focus')">
            ${t('tagFocus')} (${slot.isLong ? `&ge;${threshold}p` : `&lt;${threshold}p`})
          </button>
          <button type="button" class="btn-tag-choice ${!slot.isQuiet ? 'selected-distract' : ''}" onclick="setSlotTagOverride('${dateStr}', ${slot.start}, ${slot.end}, 'distract')">
            ${t('tagDistract')} (${slot.isLong ? `&ge;${threshold}p` : `&lt;${threshold}p`})
          </button>
          ${slot.isManualOverride ? `
            <button type="button" class="btn-tag-choice btn-tag-reset" onclick="setSlotTagOverride('${dateStr}', ${slot.start}, ${slot.end}, 'auto')" title="${t('tagAuto')}">
              ${t('tagResetBtn')}
            </button>
          ` : ''}
        </div>
        <div style="font-size:11px; margin-top:8px; color:${slot.isManualOverride ? '#7c3aed' : '#64748b'}; font-weight:600;">
          ${slot.isManualOverride 
            ? `${t('tagManualApplied')}: ${slot.isQuiet ? t('tagFocus') : t('tagDistract')}` 
            : (slot.isQuiet 
                ? t('tagAutoQuiet') 
                : `${t('tagAutoNoisy')}${slot.noiseLabels && slot.noiseLabels.length > 0 ? ` (${escapeHtml(slot.noiseLabels.join(', '))})` : ''}`)}
        </div>
      </div>

      ${slot.noiseLabels && slot.noiseLabels.length > 0 && slot.noisyIndices && slot.noisyIndices.length > 0 ? `
        <div class="slot-noisy-active-banner">
          <div style="font-size:12px; color:inherit;">
            <span><strong>${isEn ? 'Active noisy hours:' : 'Khung giờ ồn ào đang kích hoạt:'}</strong> ${escapeHtml(slot.noiseLabels.join(', '))}</span>
          </div>
          <div style="display:flex; gap:6px;">
            ${slot.noisyIndices.map(idx => `
              <button type="button" class="btn-secondary" style="font-size:11px; padding:3px 8px;" onclick="closeModal(); openEditNoisyIntervalModal(${idx})" title="${isEn ? 'Edit or delete this noisy interval' : 'Chỉnh sửa hoặc xóa khung giờ ồn ào này'}">
                ${isEn ? 'Manage / Delete' : 'Quản lý / Xóa'}
              </button>
            `).join('')}
          </div>
        </div>
      ` : ''}

      <!-- Chọn task để xếp vào slot -->
      <div style="font-size:13px; font-weight:700; margin-bottom:8px; color:var(--text-primary); display:flex; justify-content:space-between; align-items:center;">
        <span>${isEn ? 'Select a suitable task for this slot:' : 'Chọn việc phù hợp để xếp vào khung giờ này:'}</span>
        <span style="font-size:11px; font-weight:500; color:var(--text-muted);">(${isEn ? `Max ${slot.duration}m` : `Tối đa ${slot.duration} ${t('minShort')}`})</span>
      </div>
      <div style="display:flex; flex-direction:column; gap:8px; max-height:200px; overflow-y:auto;">
        ${unassignedTasks.map(task => {
          const placement = calculateTaskPlacementInSlot(task, { start: slot.start, end: slot.end }, dateStr);
          const fits = Boolean(placement && placement.fits);
          const timeHint = fits 
            ? `${placement.assigned.start} - ${placement.assigned.end}` 
            : (isEn ? 'Not enough time (incl. buffer)' : 'Không đủ thời gian (tính cả buffer)');
          return `
          <div class="event-item-row" style="cursor:${fits ? 'pointer' : 'not-allowed'}; padding:8px 10px; opacity:${fits ? '1' : '0.55'};" onclick="${fits ? `assignTaskToSlot('${task.id}', { start: ${slot.start}, end: ${slot.end} }, '${dateStr}'); closeModal();` : `showToast('${isEn ? 'Not enough time after reserving transition buffers!' : 'Không đủ thời gian trong slot này sau khi trừ thời gian chuyển đổi!'}' )`}">
            <div class="event-details">
              <strong>${escapeHtml(task.title)}</strong> (${task.estimatedMinutes || 25}${t('minShort')})
              <div style="font-size:11px; color:var(--text-muted);">${task.requireQuiet ? (isEn ? 'Requires quiet' : 'Cần yên tĩnh') : (isEn ? 'Tolerates noise' : 'Chấp nhận ồn ào')} • <span style="color:${fits ? 'var(--color-primary, #0284c7)' : '#ef4444'}; font-weight:600;">${timeHint}</span></div>
              ${task.note ? `<div style="font-size:11px; color:var(--text-muted); margin-top:2px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${escapeHtml(task.note)}</div>` : ''}
            </div>
            <button class="btn-primary" style="padding:4px 10px; font-size:11px; opacity:${fits ? '1' : '0.5'};" ${fits ? '' : 'disabled'}>${t('scheduleBtn')}</button>
          </div>
        `;}).join('') || `<div style="font-size:13px; color:#94a3b8; text-align:center; padding:12px;">${isEn ? 'No unscheduled tasks remaining. You can add a new task!' : 'Không còn task nào chưa xếp. Bạn có thể thêm task mới!'}</div>`}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="closeModal(); openAddTaskModal('${dateStr}')">${t('btnAddTask')}</button>
    </div>
  `);
}

function promptScheduleTask(taskId) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  shouldScrollToNow = false;
  const { freeSlots } = calculateFreeTimeSlots(selectedDate);
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const validSlots = freeSlots.filter(s => {
    const placement = calculateTaskPlacementInSlot(task, s, selectedDate);
    return placement && placement.fits;
  });

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${isEn ? `Schedule Task: "${escapeHtml(task.title)}"` : `Xếp Lịch Cho: "${escapeHtml(task.title)}"`}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <p style="font-size:13px; color:var(--text-secondary); margin-bottom:12px;">${isEn ? `Duration: <strong>${task.estimatedMinutes} mins</strong> • ${task.requireQuiet ? 'Requires quiet' : 'Tolerates noise'}` : `Thời lượng: <strong>${task.estimatedMinutes} phút</strong> • ${task.requireQuiet ? 'Cần yên tĩnh' : 'Chấp nhận ồn ào'}`}</p>
      <div style="display:flex; flex-direction:column; gap:8px;">
        ${validSlots.map(s => {
          const placement = calculateTaskPlacementInSlot(task, s, selectedDate);
          const timeRangeStr = placement && placement.fits ? `${placement.assigned.start} - ${placement.assigned.end}` : `${s.startTimeStr} - ${s.endTimeStr}`;
          return `
          <div class="event-item-row" style="cursor:pointer; padding:8px 10px; border-left-color:${s.color};" onclick="assignTaskToSlot('${task.id}', { start: ${s.start}, end: ${s.end} }, '${selectedDate}'); closeModal();">
            <div class="event-details">
              <strong>${timeRangeStr}</strong> (${s.duration}p) • ${s.tagLabel}
            </div>
            <button class="btn-primary" style="padding:4px 10px; font-size:11px;">${isEn ? 'Select this slot' : 'Chọn slot này'}</button>
          </div>
        `;}).join('') || `<div style="font-size:13px; color:#ef4444; padding:8px;">${isEn ? 'No free slots with sufficient time (after reserving transition buffers)!' : `Không có khoảng rảnh nào đủ thời gian (sau khi trừ thời gian chuyển đổi)!`}</div>`}
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
    </div>
  `);
}

// Modal Mục Tiêu Ngày, Tháng, Năm
function openDailyGoalModal(dateStr) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.dailyGoals)) appState.goals.dailyGoals = [];
  const existing = appState.goals.dailyGoals.find(g => !g.deleted && g.date === dateStr);
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalDailyGoalTitle')} (${dateStr})</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${isEn ? 'Daily Focus Message *' : 'Thông điệp trọng tâm ngày hôm nay *'}</label>
        <textarea id="m-daily-focus" class="form-textarea" rows="3" placeholder="${isEn ? 'e.g., Focus on completing 2 key tasks in the morning...' : 'Ví dụ: Tập trung cao độ hoàn thành 2 task quan trọng vào buổi sáng...'}">${existing ? escapeHtml(existing.focusMessage) : ''}</textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitDailyGoal('${dateStr}')">${t('saveBtn')}</button>
    </div>
  `);
}

function submitDailyGoal(dateStr) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const focus = document.getElementById('m-daily-focus').value.trim();
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.dailyGoals)) appState.goals.dailyGoals = [];
  let goal = appState.goals.dailyGoals.find(g => !g.deleted && g.date === dateStr);
  if (!focus) {
    if (goal) {
      const deletedRec = { id: goal.id, deleted: true };
      touch(deletedRec);
      const idx = appState.goals.dailyGoals.indexOf(goal);
      if (idx !== -1) appState.goals.dailyGoals[idx] = deletedRec;
      saveData();
      closeModal();
      renderApp();
      showToast(isEn ? 'Daily goal removed!' : 'Đã xóa mục tiêu ngày!');
    } else {
      closeModal();
    }
    return;
  }

  if (goal) {
    goal.focusMessage = focus;
    touch(goal);
  } else {
    const newGoal = {
      id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : ('dg-' + Date.now()),
      date: dateStr,
      focusMessage: focus
    };
    touch(newGoal);
    appState.goals.dailyGoals.push(newGoal);
  }
  saveData();
  closeModal();
  renderApp();
  showToast(isEn ? 'Saved daily goal!' : 'Đã lưu mục tiêu ngày!');
}

function openYearGoalModal(year) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.years)) appState.goals.years = [];
  const existing = appState.goals.years.find(y => !y.deleted && y.year === year);
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalYearGoalTitle')} ${year}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${isEn ? 'Overarching Year Goal *' : 'Mục tiêu tổng quát lớn của năm *'}</label>
        <input type="text" id="m-year-title" class="form-input" placeholder="${isEn ? 'e.g., Land my dream job...' : 'Ví dụ: Đạt được công việc mơ ước...'}" value="${existing ? escapeHtml(existing.title) : ''}">
      </div>
      <div class="form-group">
        <label class="form-label">${isEn ? 'Guiding Principles / Action Notes' : 'Kim chỉ nam / Hướng dẫn hành động'}</label>
        <textarea id="m-year-principles" class="form-textarea" rows="4" placeholder="${isEn ? 'Key principles & notes...' : 'Ghi chú nguyên tắc then chốt...'}">${existing ? escapeHtml(existing.principles || '') : ''}</textarea>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitYearGoal(${year})">${t('saveBtn')}</button>
    </div>
  `);
}

function submitYearGoal(year) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const title = document.getElementById('m-year-title').value.trim();
  const principles = document.getElementById('m-year-principles').value.trim();
  if (!title) {
    showToast(isEn ? 'Please enter a year goal!' : 'Vui lòng nhập mục tiêu năm!');
    return;
  }
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.years)) appState.goals.years = [];
  let goal = appState.goals.years.find(y => !y.deleted && y.year === year);
  if (goal) {
    goal.title = title;
    goal.principles = principles;
    touch(goal);
  } else {
    const newGoal = {
      id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : ('y-' + year),
      year,
      title,
      principles
    };
    touch(newGoal);
    appState.goals.years.push(newGoal);
  }
  saveData();
  closeModal();
  renderApp();
  showToast(isEn ? 'Saved year goal!' : 'Đã lưu mục tiêu năm!');
}

function openAddMonthGoalModal(yearMonth) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.monthGoals)) appState.goals.monthGoals = [];
  const existing = appState.goals.monthGoals.find(m => !m.deleted && m.yearMonth === yearMonth);
  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${t('modalMonthGoalTitle')} (${yearMonth})</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="${isEn ? 'Close (Esc)' : 'Đóng (Esc)'}" aria-label="${isEn ? 'Close' : 'Đóng'}">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">${isEn ? 'Monthly Focus Goal *' : 'Mục tiêu trọng tâm của tháng *'}</label>
        <input type="text" id="m-month-title" class="form-input" placeholder="${isEn ? 'e.g., Complete 100% coursework...' : 'Ví dụ: Hoàn thành 100% bài thực hành...'}" value="${existing ? escapeHtml(existing.title) : ''}">
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
      <button class="btn-primary" onclick="submitMonthGoal('${yearMonth}')">${t('saveBtn')}</button>
    </div>
  `);
}

function submitMonthGoal(yearMonth) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const title = document.getElementById('m-month-title').value.trim();
  if (!title) {
    showToast(isEn ? 'Please enter a month goal!' : 'Vui lòng nhập mục tiêu tháng!');
    return;
  }
  if (!appState.goals) appState.goals = { years: [], monthGoals: [], dailyGoals: [] };
  if (!Array.isArray(appState.goals.monthGoals)) appState.goals.monthGoals = [];
  let goal = appState.goals.monthGoals.find(m => !m.deleted && m.yearMonth === yearMonth);
  if (goal) {
    goal.title = title;
    touch(goal);
  } else {
    const newGoal = {
      id: (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function')
        ? crypto.randomUUID()
        : ('mg-' + Date.now()),
      yearMonth,
      title
    };
    touch(newGoal);
    appState.goals.monthGoals.push(newGoal);
  }
  saveData();
  closeModal();
  renderApp();
  showToast(isEn ? 'Saved month goal!' : 'Đã lưu mục tiêu tháng!');
}

function deleteDailyGoal(goalIdOrDate) {
  if (!appState.goals?.dailyGoals) return;
  const idx = appState.goals.dailyGoals.findIndex(g => !g.deleted && (g.id === goalIdOrDate || g.date === goalIdOrDate));
  if (idx !== -1) {
    const item = appState.goals.dailyGoals[idx];
    const id = item.id || ('dg-' + Date.now());
    const deletedRec = { id, deleted: true };
    touch(deletedRec);
    appState.goals.dailyGoals[idx] = deletedRec;
    saveData();
    renderApp();
  }
}

function deleteMonthGoal(goalIdOrYM) {
  if (!appState.goals?.monthGoals) return;
  const idx = appState.goals.monthGoals.findIndex(m => !m.deleted && (m.id === goalIdOrYM || m.yearMonth === goalIdOrYM));
  if (idx !== -1) {
    const item = appState.goals.monthGoals[idx];
    const id = item.id || ('mg-' + Date.now());
    const deletedRec = { id, deleted: true };
    touch(deletedRec);
    appState.goals.monthGoals[idx] = deletedRec;
    saveData();
    renderApp();
  }
}

function deleteYearGoal(goalIdOrYear) {
  if (!appState.goals?.years) return;
  const idx = appState.goals.years.findIndex(y => !y.deleted && (y.id === goalIdOrYear || y.year === goalIdOrYear));
  if (idx !== -1) {
    const item = appState.goals.years[idx];
    const id = item.id || ('y-' + Date.now());
    const deletedRec = { id, deleted: true };
    touch(deletedRec);
    appState.goals.years[idx] = deletedRec;
    saveData();
    renderApp();
  }
}

window.deleteDailyGoal = deleteDailyGoal;
window.deleteMonthGoal = deleteMonthGoal;
window.deleteYearGoal = deleteYearGoal;

// Auto-Match All Tasks
function autoMatchAllTasks() {
  shouldScrollToNow = false;
  const unassignedTasks = appState.tasks.filter(t => 
    !t.deleted &&
    isItemActiveOnDate(t, selectedDate) && 
    !getTaskAssignedSlot(t, selectedDate) && 
    !isTaskDoneOnDate(t, selectedDate)
  );

  // Sắp xếp thứ tự ưu tiên gán slot:
  // 1. Chế độ xếp lịch thủ công (manual) được ưu tiên chọn slot trước
  // 2. Phân loại theo buổi chỉ định (Sáng / Chiều / Tối) được ưu tiên giữ slot đúng buổi
  // 3. Mức độ tập trung cao (high) hoặc Q1/Q2 (Important)
  // 4. Mức độ tập trung vừa (medium) / Q3 (Urgent)
  // 5. Mức độ tập trung thấp (low) / Q4
  unassignedTasks.sort((a, b) => {
    if (a.scheduleMode === 'manual' && b.scheduleMode !== 'manual') return -1;
    if (b.scheduleMode === 'manual' && a.scheduleMode !== 'manual') return 1;

    const getSessionPriority = (task) => (task.preferredSession && task.preferredSession !== 'any') ? 10 : 0;
    const sessionDiff = getSessionPriority(b) - getSessionPriority(a);
    if (sessionDiff !== 0) return sessionDiff;

    const getAttentionPriority = (task) => {
      const att = task.attentionLevel || 'auto';
      if (att === 'high') return 5;
      if (att === 'medium') return 3;
      if (att === 'low') return 1;
      if (att === 'any') return 2;
      // 'auto' mode fallback to Eisenhower
      const p = (task.isImportant ? 4 : 0) + (task.isUrgent ? 2 : 0);
      return p;
    };

    return getAttentionPriority(b) - getAttentionPriority(a);
  });

  let matchedCount = 0;
  for (let task of unassignedTasks) {
    const currentSlots = calculateFreeTimeSlots(selectedDate).freeSlots;
    const bestSlot = findBestFreeSlotForTask(task, currentSlots, selectedDate);
    if (bestSlot) {
      const ok = assignTaskToSlot(task.id, bestSlot, selectedDate, { silent: true });
      if (ok) matchedCount++;
    }
  }

  if (matchedCount > 0) {
    saveData();
    renderApp();
    showToast(t('autoMatchSuccess', { count: matchedCount }));
  } else {
    showToast(t('autoMatchNone'));
  }
}

// Utilities
function setView(viewName) {
  // Mobile / Small Screen: Ẩn tab tháng và tự chuyển sang tab ngày
  if (viewName === 'month' && typeof window !== 'undefined' && window.innerWidth <= 768) {
    viewName = 'day';
    showToast(t('mobileMonthHiddenHint') || 'Chế độ xem Tháng chỉ hỗ trợ trên PC/Tablet');
  }

  if (viewName === 'day' && currentView !== 'day') {
    shouldScrollToNow = true;
  }

  currentView = viewName;
  if (window.innerWidth <= 860) {
    const sidebar = document.getElementById('app-sidebar-content');
    if (sidebar && sidebar.classList.contains('open')) {
      toggleSidebar(false);
    }
  }
  renderApp();
}
window.setView = setView;


function formatDateToYMD(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function getPreviousDateStr(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const prevDate = new Date(y, m - 1, d - 1);
  return formatDateToYMD(prevDate);
}

function getNextDateStr(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const nextDate = new Date(y, m - 1, d + 1);
  return formatDateToYMD(nextDate);
}

function changeDate(offsetDays) {
  const [y, m, d] = selectedDate.split('-').map(Number);
  const targetDate = new Date(y, m - 1, d + offsetDays);
  selectedDate = formatDateToYMD(targetDate);
  renderApp();
}

function changeMonth(offsetMonths) {
  const [y, m] = selectedDate.split('-').map(Number);
  const targetDate = new Date(y, m - 1 + offsetMonths, 1);
  selectedDate = formatDateToYMD(targetDate);
  renderApp();
}

function changeYear(offsetYears) {
  const [y, m, d] = selectedDate.split('-').map(Number);
  const targetDate = new Date(y + offsetYears, m - 1, d);
  selectedDate = formatDateToYMD(targetDate);
  renderApp();
}

function goToToday() {
  selectedDate = getTodayDateString();
  shouldScrollToNow = true;
  renderApp();
}

function selectDateAndGoToDay(dateStr) {
  selectedDate = dateStr;
  currentView = 'day';
  if (!appState.settings) appState.settings = {};
  appState.settings.timelineDaySpan = 1;
  saveData();
  shouldScrollToNow = (dateStr === getTodayDateString());
  renderApp();
}

function selectMonthAndGo(dateStr) {
  selectedDate = dateStr;
  currentView = 'month';
  renderApp();
}

/**
 * Áp dụng bảng màu tùy chỉnh trực tiếp vào CSS Custom Properties trên Root
 */
function applyCustomColorsToRoot(colors = appState?.settings?.colors) {
  if (!colors || typeof document === 'undefined') return;
  const root = document.documentElement;
  if (!root) return;

  if (colors.focusLong) root.style.setProperty('--c-focus-long', colors.focusLong);
  if (colors.focusShort) root.style.setProperty('--c-focus-short', colors.focusShort);
  if (colors.distractLong) root.style.setProperty('--c-distract-long', colors.distractLong);
  if (colors.distractShort) root.style.setProperty('--c-distract-short', colors.distractShort);
  if (colors.fixedEvent) root.style.setProperty('--c-fixed', colors.fixedEvent);
  if (colors.transientEvent) root.style.setProperty('--c-transient', colors.transientEvent);
  if (colors.scheduledTask) root.style.setProperty('--c-scheduled', colors.scheduledTask);
  if (colors.unscheduledTask) root.style.setProperty('--c-unscheduled', colors.unscheduledTask);
}

/**
 * Cập nhật màu sắc thời gian thực và đồng bộ ngay lên toàn bộ giao diện
 */
function updateColorSetting(key, value) {
  if (!appState.settings.colors) {
    appState.settings.colors = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.colors));
  }
  appState.settings.colors[key] = value;
  saveData();
  applyCustomColorsToRoot();

  // Cập nhật badge xem trước trong Cài đặt
  const previewBadge = document.getElementById(`preview-badge-${key}`);
  if (previewBadge) {
    previewBadge.style.backgroundColor = value;
    previewBadge.style.color = '#ffffff';
  }

  // Cập nhật thẻ mẫu trong Live Sandbox
  const sandboxSampleFocus = document.getElementById('sandbox-sample-focus-card');
  const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
  if (sandboxSampleFocus && (key === 'focusLong' || key === 'focusShort')) {
    const testSlider = document.getElementById('sandbox-test-duration-input');
    const curDur = testSlider ? (parseInt(testSlider.value, 10) || 25) : 25;
    sandboxSampleFocus.style.borderLeftColor = curDur >= threshold ? appState.settings.colors.focusLong : appState.settings.colors.focusShort;
  }

  const sandboxSampleDistract = document.getElementById('sandbox-sample-distract-card');
  if (sandboxSampleDistract && (key === 'distractLong' || key === 'distractShort')) {
    const testSlider = document.getElementById('sandbox-test-duration-input');
    const curDur = testSlider ? (parseInt(testSlider.value, 10) || 25) : 25;
    sandboxSampleDistract.style.borderLeftColor = curDur >= threshold ? appState.settings.colors.distractLong : appState.settings.colors.distractShort;
  }

  // Cập nhật timeline nền và ma trận
  if (typeof renderApp === 'function') {
    renderApp();
  }
}

/**
 * Khôi phục bảng màu mặc định có độ tương phản cao chuẩn WCAG
 */
function resetDefaultColors() {
  appState.settings.colors = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.colors));
  saveData();
  applyCustomColorsToRoot();

  const appearanceMount = document.getElementById('settings-appearance-mount-point');
  if (appearanceMount) {
    appearanceMount.innerHTML = renderSettingsAppearanceHtml();
  }

  if (typeof renderApp === 'function') {
    renderApp();
  }
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Default color palette restored!' : 'Đã khôi phục bảng màu mặc định!');
}

/**
 * Xem trước thay đổi Ngưỡng tập trung thời gian thực (Slider & Input & Presets)
 */
function previewFocusThreshold(value) {
  const val = Math.max(5, Math.min(180, parseInt(value, 10) || 30));
  const isEn = appState.settings.lang === 'en';

  // 1. Đồng bộ ô số và thanh trượt
  const numInput = document.getElementById('threshold-num-input');
  if (numInput && Number(numInput.value) !== val) numInput.value = val;
  const rangeSlider = document.getElementById('threshold-range-slider');
  if (rangeSlider && Number(rangeSlider.value) !== val) rangeSlider.value = val;

  // 2. Cập nhật class active trên các preset chips
  const chips = document.querySelectorAll('#settings-card-threshold .preset-chip');
  chips.forEach(chip => {
    const chipVal = parseInt(chip.textContent, 10);
    chip.classList.toggle('active', chipVal === val);
  });

  // 3. Cập nhật huy hiệu tiêu đề Card
  const badge = document.getElementById('threshold-header-badge');
  if (badge) {
    badge.textContent = (val === 30) ? (isEn ? 'Default: 30m' : 'Mặc định: 30p') : `${isEn ? 'Custom: ' : 'Tùy chỉnh: '}${val}p`;
    badge.className = `smart-pill ${val === 30 ? 'pill-focus-long' : 'pill-focus-short'}`;
  }

  // 4. Cập nhật banner quy tắc xem trước
  const previewBanner = document.getElementById('threshold-preview-banner');
  if (previewBanner) {
    previewBanner.innerHTML = `
      <div style="font-weight:700;">${t('thresholdPreviewTitle')}</div>
      <div>• ${t('thresholdRuleLong', { minutes: val })}</div>
      <div>• ${t('thresholdRuleShort', { minutes: val })}</div>
    `;
  }

  // 5. Cập nhật nhãn phụ bên dưới các ô màu
  const longQuietSub = document.getElementById('sub-label-focus-long');
  if (longQuietSub) longQuietSub.textContent = `${isEn ? 'Quiet & Focused' : 'Dễ tập trung'} (≥${val}${t('minShort')})`;
  const shortQuietSub = document.getElementById('sub-label-focus-short');
  if (shortQuietSub) shortQuietSub.textContent = `${isEn ? 'Quiet & Shallow' : 'Dễ tập trung'} (<${val}${t('minShort')})`;
  const longDistractSub = document.getElementById('sub-label-distract-long');
  if (longDistractSub) longDistractSub.textContent = `${isEn ? 'Noisy & Long' : 'Khó tập trung'} (≥${val}${t('minShort')})`;
  const shortDistractSub = document.getElementById('sub-label-distract-short');
  if (shortDistractSub) shortDistractSub.textContent = `${isEn ? 'Noisy & Short' : 'Khó tập trung'} (<${val}${t('minShort')})`;

  // 6. Cập nhật Live Sandbox
  const testSlider = document.getElementById('sandbox-test-duration-input');
  if (testSlider) {
    previewTestDuration(testSlider.value, val);
  }
}


function toggleNotificationGroup(group, isChecked) {
  if (!appState.settings) appState.settings = {};

  if (group === 'all') {
    appState.settings.notifyAll = isChecked;
    appState.settings.notifyEisenhower = isChecked;
    appState.settings.notifyFixed = isChecked;
    appState.settings.notifyTransient = isChecked;
    appState.settings.notificationsEnabled = isChecked;
  } else {
    if (group === 'eisenhower') appState.settings.notifyEisenhower = isChecked;
    if (group === 'fixed') appState.settings.notifyFixed = isChecked;
    if (group === 'transient') appState.settings.notifyTransient = isChecked;

    const eOn = appState.settings.notifyEisenhower !== false;
    const fOn = appState.settings.notifyFixed !== false;
    const tOn = appState.settings.notifyTransient !== false;

    // Tích all thì tất cả 3 mục trên tự động tích; nếu cả 3 đều được tích thì all tự động tích
    appState.settings.notifyAll = (eOn && fOn && tOn);
    // Bật nếu có ít nhất một nhóm được tích
    appState.settings.notificationsEnabled = (eOn || fOn || tOn);
  }

  saveData();

  const appearanceMount = document.getElementById('settings-appearance-mount-point');
  if (appearanceMount) {
    appearanceMount.innerHTML = renderSettingsAppearanceHtml();
  }
}
window.toggleNotificationGroup = toggleNotificationGroup;

function updateNotificationSetting(key, val) {
  if (!appState.settings) appState.settings = {};
  appState.settings[key] = val;
  saveData();
  const appearanceMount = document.getElementById('settings-appearance-mount-point');
  if (appearanceMount) {
    appearanceMount.innerHTML = renderSettingsAppearanceHtml();
  }
}
window.updateNotificationSetting = updateNotificationSetting;

// ==========================================
// BỘ ĐIỀU KHIỂN & HIỆN THỊ THÔNG BÁO TRÌNH DUYỆT (BROWSER & SYSTEM NOTIFICATIONS)
// ==========================================

/**
 * Âm thanh báo hiệu nhẹ nhàng (Web Audio API - không phụ thuộc file mp3 ngoài)
 */
function playNotificationChime() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const now = ctx.currentTime;

    // Âm 1: 587.33 Hz (D5)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now);
    gain1.gain.setValueAtTime(0.12, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Âm 2: 880 Hz (A5)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.1);
    gain2.gain.setValueAtTime(0.15, now + 0.1);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.1);
    osc2.stop(now + 0.4);
  } catch (e) {
    // Không chặn luồng nếu trình duyệt chặn autoplay trước khi có tương tác
  }
}
window.playNotificationChime = playNotificationChime;

/**
 * Hiển thị thẻ pop-up thông báo trực quan trên màn hình
 * Tối ưu UI: Bỏ tên app ChronoFlow, bỏ các dòng native OS / preview alert.
 * Hỗ trợ hiển thị cấu trúc chi tiết cho thông báo kết thúc (khoảng rảnh / liền kề) và thông báo bắt đầu.
 * Hỗ trợ cấu hình thời gian hiển thị popup (popupDurationSeconds).
 */
function showSimulatedNotificationBanner(dataOrTitle, body = '', isNativeGranted = false) {
  if (typeof document === 'undefined') return;

  let container = document.getElementById('chronoflow-notifications-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'chronoflow-notifications-root';
    container.style.cssText = 'position:fixed; top:20px; right:20px; z-index:9999999; display:flex; flex-direction:column; gap:10px; max-width:420px; width:calc(100vw - 36px); pointer-events:none;';
    document.body.appendChild(container);
  }

  const isEn = appState.settings?.lang === 'en';
  const durationSec = Math.max(2, Math.min(60, Number(appState.settings?.popupDurationSeconds) || 8));

  let payload = null;
  if (typeof dataOrTitle === 'object' && dataOrTitle !== null) {
    payload = dataOrTitle;
  } else {
    payload = {
      type: 'generic',
      title: dataOrTitle || '',
      body: body || ''
    };
  }

  const isEnd = payload.type === 'end';
  const isStart = payload.type === 'start';
  const accentColor = isEnd ? '#ea580c' : (isStart ? '#2563eb' : 'var(--primary, #3b82f6)');

  const banner = document.createElement('div');
  banner.className = 'chronoflow-notification-popup';
  banner.style.cssText = `
    pointer-events: auto;
    background: var(--bg-card, #ffffff);
    color: var(--text-primary, #0f172a);
    border: 1px solid var(--border-color, #e2e8f0);
    border-left: 4px solid ${accentColor};
    border-radius: 12px;
    box-shadow: 0 12px 30px -4px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.06);
    padding: 13px 15px;
    box-sizing: border-box;
    opacity: 0;
    transform: translateX(110%);
    transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
    backdrop-filter: blur(12px);
    font-family: inherit;
  `;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const esc = (s) => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  // Header gọn gàng: BỎ tên app (ChronoFlow), BỎ dòng native OS / preview alert
  let headerBadge = '';
  if (isEnd) {
    headerBadge = `<span style="font-size:11px; font-weight:700; color:#ea580c; background:rgba(234,88,12,0.12); padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
      ${isEn ? 'Ending Soon' : 'Sắp kết thúc'}
    </span>`;
  } else if (isStart) {
    headerBadge = `<span style="font-size:11px; font-weight:700; color:#2563eb; background:rgba(37,99,235,0.12); padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
      ${isEn ? 'Starting Soon' : 'Sắp bắt đầu'}
    </span>`;
  } else {
    headerBadge = `<span style="font-size:11px; font-weight:700; color:var(--primary, #3b82f6); background:rgba(59,130,246,0.12); padding:2px 7px; border-radius:4px; display:inline-flex; align-items:center; gap:4px;">
      🔔 ${isEn ? 'Notification' : 'Thông báo'}
    </span>`;
  }

  let bodyHtml = '';

  if (isEnd) {
    // ++ thông báo kết thúc:
    // +++ tên sự kiện - thời gian kết thúc
    // +++ Các sự kiện tiếp theo
    // ++++ nếu có khoảng trống: free time, tên sự kiện tiếp (mốc thời gian - bắt đầu - kết thúc)
    // ++++ nếu liền kề: tên sự kiện (mốc thời gian), một vài nội dung chính của sự kiện kế tiếp này
    const safeTitle = esc(payload.eventTitle || '');
    const safeEndTime = esc(payload.endTime || '');
    const noticeMins = payload.noticeMins;

    let nextSectionHtml = '';
    if (payload.hasGap) {
      nextSectionHtml = `
        <div style="margin-top:7px; background:var(--bg-subtle, #f8fafc); border:1px solid var(--border-color, #e2e8f0); border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:5px;">
          <div style="font-size:10.5px; font-weight:700; color:var(--text-muted, #64748b); text-transform:uppercase; letter-spacing:0.3px;">
            ${isEn ? 'Next Events' : 'Các sự kiện tiếp theo'}
          </div>
          <div style="display:flex; align-items:center; gap:6px; font-size:12px; color:var(--text-primary, #0f172a);">
            <span style="font-size:10.5px; font-weight:600; padding:1px 6px; border-radius:4px; background:rgba(16,185,129,0.12); color:#059669;">
              ${esc(payload.freeTimeLabel || (isEn ? 'Free time' : 'Thời gian rảnh'))}
            </span>
            <span style="font-weight:600;">${esc(payload.freeTimeRange || '')}</span>
          </div>
          ${payload.nextEventTitle ? `
            <div style="font-size:12px; color:var(--text-secondary, #334155); display:flex; align-items:center; gap:6px; padding-left:2px;">
              <span style="font-weight:600; color:var(--text-primary, #0f172a);">${esc(payload.nextEventTitle)}:</span>
              <span>${esc(payload.nextEventRange || '')}</span>
            </div>
          ` : ''}
        </div>
      `;
    } else if (payload.isAdjacent) {
      nextSectionHtml = `
        <div style="margin-top:7px; background:var(--bg-subtle, #f8fafc); border:1px solid var(--border-color, #e2e8f0); border-radius:8px; padding:8px 10px; display:flex; flex-direction:column; gap:5px;">
          <div style="font-size:10.5px; font-weight:700; color:var(--text-muted, #64748b); text-transform:uppercase; letter-spacing:0.3px;">
            ${isEn ? 'Next Events' : 'Các sự kiện tiếp theo'}
          </div>
          <div style="font-size:12px; font-weight:600; color:var(--text-primary, #0f172a); display:flex; align-items:center; gap:6px;">
            <span>${esc(payload.nextEventTitle)}</span>
            <span style="font-weight:500; color:var(--text-muted, #64748b); font-size:11px;">(${esc(payload.nextEventRange)})</span>
          </div>
          ${payload.nextEventDetails ? `
            <div style="font-size:11.5px; color:var(--text-secondary, #475569); line-height:1.4; padding-left:8px; border-left:2px solid var(--border-color, #cbd5e1); margin-top:2px;">
              ${esc(payload.nextEventDetails)}
            </div>
          ` : ''}
        </div>
      `;
    }

    bodyHtml = `
      <div style="font-size:13px; font-weight:700; color:var(--text-primary, #0f172a); margin-bottom:2px; line-height:1.4;">
        ${safeTitle} - ${safeEndTime} ${noticeMins ? `<span style="font-weight:normal; font-size:11.5px; color:var(--text-muted, #64748b);">(${isEn ? `ends in ${noticeMins}m` : `kết thúc sau ${noticeMins} phút`})</span>` : ''}
      </div>
      ${nextSectionHtml}
    `;
  } else if (isStart) {
    // ++ thông báo bắt đầu
    // +++ tên sự kiện bắt đầu (thời gian bắt đầu)
    // ++++ nội dung sự kiện
    const safeTitle = esc(payload.eventTitle || '');
    const safeStartTime = esc(payload.startTime || '');
    const noticeMins = payload.noticeMins;
    const safeDetails = esc(payload.details || '');

    bodyHtml = `
      <div style="font-size:13px; font-weight:700; color:var(--text-primary, #0f172a); margin-bottom:6px; line-height:1.4;">
        ${safeTitle} <span style="font-weight:normal; font-size:11.5px; color:var(--text-muted, #64748b);">(${safeStartTime} ${noticeMins ? `- ${isEn ? `starts in ${noticeMins}m` : `bắt đầu sau ${noticeMins} phút`}` : ''})</span>
      </div>
      ${safeDetails ? `
        <div style="background:var(--bg-subtle, #f8fafc); border:1px solid var(--border-color, #e2e8f0); border-radius:8px; padding:8px 10px; font-size:12px; color:var(--text-secondary, #334155); line-height:1.45;">
          <div style="font-size:10px; font-weight:700; color:var(--text-muted, #64748b); text-transform:uppercase; margin-bottom:3px; letter-spacing:0.3px;">
            ${isEn ? 'Event Details' : 'Nội dung sự kiện'}
          </div>
          <div>${safeDetails}</div>
        </div>
      ` : ''}
    `;
  } else {
    const safeTitle = esc(payload.title || '');
    const safeBody = esc(payload.body || '');
    bodyHtml = `
      ${safeTitle ? `<div style="font-size:13px; font-weight:700; color:var(--text-primary, #0f172a); margin-bottom:4px;">${safeTitle}</div>` : ''}
      <div style="font-size:12px; color:var(--text-secondary, #334155); white-space:pre-line; line-height:1.45; background:var(--bg-subtle, #f8fafc); padding:8px 10px; border-radius:6px; border:1px solid var(--border-color, #e2e8f0);">${safeBody}</div>
    `;
  }

  banner.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; border-bottom:1px solid var(--border-color, #e2e8f0); padding-bottom:6px;">
      <div style="display:flex; align-items:center; gap:8px;">
        ${headerBadge}
        <span style="font-size:10.5px; color:var(--text-muted, #94a3b8); font-weight:500;">${timeStr}</span>
      </div>
      <button type="button" class="close-notif-btn" style="background:transparent; border:none; color:var(--text-muted, #64748b); cursor:pointer; padding:2px 5px; border-radius:4px; font-size:15px; line-height:1; display:flex; align-items:center; justify-content:center;" title="${isEn ? 'Close' : 'Đóng'}">✕</button>
    </div>
    ${bodyHtml}
  `;

  container.appendChild(banner);

  requestAnimationFrame(() => {
    banner.style.opacity = '1';
    banner.style.transform = 'translateX(0)';
  });

  const closeBtn = banner.querySelector('.close-notif-btn');
  let autoDismissTimer = null;

  const dismiss = () => {
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
    banner.style.opacity = '0';
    banner.style.transform = 'translateX(110%)';
    setTimeout(() => {
      if (banner.parentNode) banner.parentNode.removeChild(banner);
    }, 350);
  };

  if (closeBtn) closeBtn.onclick = dismiss;
  autoDismissTimer = setTimeout(dismiss, durationSec * 1000);

  banner.onmouseenter = () => {
    if (autoDismissTimer) clearTimeout(autoDismissTimer);
  };
  banner.onmouseleave = () => {
    autoDismissTimer = setTimeout(dismiss, 3000);
  };
}
window.showSimulatedNotificationBanner = showSimulatedNotificationBanner;

/**
 * Gửi thông báo tới trình duyệt (hệ thống) đồng thời hiển thị thẻ popup trực quan
 */
function sendBrowserNotification(title, body, options = {}, meta = null) {
  let nativeShown = false;

  // 1. Gửi thông báo Native Notification nếu trình duyệt hỗ trợ và đã cấp quyền
  if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
    try {
      const notifOptions = {
        body: body,
        tag: 'chronoflow-' + Date.now(),
        requireInteraction: false,
        icon: '/favicon.ico',
        ...options
      };
      const notif = new Notification(title, notifOptions);
      nativeShown = true;
      if (notif) {
        notif.onclick = () => {
          try { window.focus(); } catch (e) {}
          try { notif.close(); } catch (e) {}
        };
      }
    } catch (err) {
      console.warn('Direct Notification constructor failed:', err);
      if (navigator.serviceWorker && navigator.serviceWorker.controller) {
        navigator.serviceWorker.getRegistration().then(reg => {
          if (reg) {
            reg.showNotification(title, { body: body, ...options });
            nativeShown = true;
          }
        }).catch(swErr => console.warn('SW notification fallback failed:', swErr));
      }
    }
  }

  // 2. Phát âm thanh chuông báo
  playNotificationChime();

  // 3. Hiển thị thẻ pop-up thông báo trực quan trong app
  showSimulatedNotificationBanner(meta || title, body, nativeShown);

  return nativeShown;
}
window.sendBrowserNotification = sendBrowserNotification;

/**
 * Yêu cầu quyền thông báo trình duyệt một cách an toàn và tương thích
 */
function requestBrowserNotificationPermission() {
  const isEn = appState.settings?.lang === 'en';
  if (typeof window === 'undefined' || !('Notification' in window)) {
    showToast(isEn ? 'Notification API not supported in this browser.' : 'Trình duyệt không hỗ trợ Notification API.');
    return;
  }

  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  const updateUI = () => {
    const appearanceMount = document.getElementById('settings-appearance-mount-point');
    if (appearanceMount) {
      appearanceMount.innerHTML = renderSettingsAppearanceHtml();
    }
  };

  try {
    const p = Notification.requestPermission();
    if (p && typeof p.then === 'function') {
      p.then(permission => {
        updateUI();
        if (permission === 'granted') {
          sendBrowserNotification(
            isEn ? 'Notifications Active' : 'Đã bật thông báo',
            isEn ? 'Browser notifications are now configured and ready!' : 'Thông báo trình duyệt đã được cấp quyền và sẵn sàng hoạt động!'
          );
          showToast(isEn ? '✓ Notification permission granted!' : '✓ Đã cấp quyền thông báo thành công!');
        } else if (permission === 'denied') {
          showToast(isEn ? '✕ Notification permission was blocked by browser.' : '✕ Quyền thông báo đã bị từ chối/chặn bởi trình duyệt.');
        }
      }).catch(err => {
        console.warn('requestPermission rejected:', err);
        updateUI();
        if (inIframe) {
          showToast(isEn 
            ? 'iFrame restriction: Click "Open New Tab" to grant native OS push permissions!' 
            : 'Do giới hạn bảo mật iFrame, hãy bấm "Mở tab mới" để cấp quyền thông báo hệ thống!');
        }
      });
    } else {
      Notification.requestPermission(permission => {
        updateUI();
        if (permission === 'granted') {
          sendBrowserNotification(
            isEn ? 'Notifications Active' : 'Đã bật thông báo',
            isEn ? 'Browser notifications are now configured and ready!' : 'Thông báo trình duyệt đã được cấp quyền và sẵn sàng hoạt động!'
          );
          showToast(isEn ? '✓ Notification permission granted!' : '✓ Đã cấp quyền thông báo thành công!');
        }
      });
    }
  } catch (err) {
    console.warn('requestPermission error:', err);
    updateUI();
    if (inIframe) {
      showToast(isEn 
        ? 'iFrame restriction: Click "Open New Tab" to grant native OS push permissions!' 
        : 'Do giới hạn bảo mật iFrame, hãy bấm "Mở tab mới" để cấp quyền thông báo hệ thống!');
    }
  }
}
window.requestBrowserNotificationPermission = requestBrowserNotificationPermission;

/**
 * Thử nghiệm thông báo giả lập (Bắn ngay thông báo để người dùng trải nghiệm thực tế)
 */
function testBrowserNotification(scenario = 'gap') {
  const isEn = appState.settings?.lang === 'en';
  const inIframe = typeof window !== 'undefined' && window.self !== window.top;

  const startNoticeMins = Number(appState.settings?.startNoticeMinutes) || 5;
  const endNoticeMins = Number(appState.settings?.endNoticeMinutes) || 5;

  let testTitle = '';
  let testBody = '';
  let payload = null;

  if (scenario === 'start') {
    const title = isEn ? 'Weekly Strategy Sync' : 'Họp chiến lược tuần';
    const startTime = '09:00';
    const details = isEn 
      ? 'Align quarterly roadmap, review sprint KPIs, and allocate key tasks for lead engineers.' 
      : 'Thảo luận chỉ tiêu KPI quý, rà soát tiến độ sprint và phân chia công việc cho các nhóm.';
    
    testTitle = `${title} (${startTime})`;
    testBody = `${title} (${startTime} - ${isEn ? `starts in ${startNoticeMins}m` : `bắt đầu sau ${startNoticeMins} phút`})\n${isEn ? 'Event details' : 'Nội dung sự kiện'}: ${details}`;

    payload = {
      type: 'start',
      eventTitle: title,
      startTime: startTime,
      noticeMins: startNoticeMins,
      details: details
    };
  } else if (scenario === 'adjacent') {
    const title = isEn ? 'Sprint Coding Session' : 'Lập trình Sprint 1';
    const endTime = '14:00';
    const nextTitle = isEn ? 'Sprint Review' : 'Sprint Review';
    const nextRange = '14:00 - 15:00';
    const nextDetails = isEn
      ? 'Demo completed features, review code diffs, and discuss sprint retro items.'
      : 'Đánh giá tiến độ Sprint, demo sản phẩm hoàn thiện và thảo luận phân công tuần mới.';

    testTitle = `${title} - ${endTime}`;
    testBody = `${title} - ${endTime} (${isEn ? `ends in ${endNoticeMins}m` : `kết thúc sau ${endNoticeMins} phút`})\n\n${isEn ? 'Next Events:' : 'Các sự kiện tiếp theo:'}\n• ${nextTitle}: ${nextRange}\n  ${isEn ? 'Details' : 'Nội dung'}: ${nextDetails}`;

    payload = {
      type: 'end',
      eventTitle: title,
      endTime: endTime,
      noticeMins: endNoticeMins,
      isAdjacent: true,
      nextEventTitle: nextTitle,
      nextEventRange: nextRange,
      nextEventDetails: nextDetails
    };
  } else {
    // Default 'gap': Có khoảng rảnh
    const title = isEn ? 'Weekly Strategy Sync' : 'Họp kế hoạch tuần';
    const endTime = '10:00';
    const freeLabel = isEn ? 'Free time (quiet)' : 'Thời gian rảnh (không ồn)';
    const freeRange = '10:00 - 11:30';
    const nextTitle = isEn ? 'Technical Documentation' : 'Viết tài liệu dự án';
    const nextRange = '11:30 - 12:30';

    testTitle = `${title} - ${endTime}`;
    testBody = `${title} - ${endTime} (${isEn ? `ends in ${endNoticeMins}m` : `kết thúc sau ${endNoticeMins} phút`})\n\n${isEn ? 'Next Events:' : 'Các sự kiện tiếp theo:'}\n• ${freeLabel}: ${freeRange}\n• ${nextTitle}: ${nextRange}`;

    payload = {
      type: 'end',
      eventTitle: title,
      endTime: endTime,
      noticeMins: endNoticeMins,
      hasGap: true,
      freeTimeLabel: freeLabel,
      freeTimeRange: freeRange,
      nextEventTitle: nextTitle,
      nextEventRange: nextRange
    };
  }

  // KÍCH HOẠT THÔNG BÁO VỚI CẢ PAYLOAD ĐỂ HIỂN THỊ POPUP ĐÚNG ĐỊNH DẠNG
  const nativeSent = sendBrowserNotification(testTitle, testBody, {}, payload);

  // Hiển thị toast thông báo trạng thái
  if (nativeSent) {
    showToast(isEn ? 'Sent native OS browser notification!' : 'Đã bắn thông báo trình duyệt ra hệ điều hành!');
  } else if (inIframe) {
    showToast(isEn ? 'Notification popup shown! (In iframe: open new tab for OS alerts)' : 'Đã hiển thị popup thông báo! (Mở tab mới để nhận pop-up từ hệ điều hành)');
  } else if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
    showToast(isEn ? 'Notification popup shown! Click "Request Permission" for OS alerts.' : 'Đã hiển thị popup thông báo! Hãy bấm "Cấp quyền" để nhận pop-up hệ thống.');
    if (Notification.permission === 'default') {
      requestBrowserNotificationPermission();
    }
  } else {
    showToast(isEn ? 'Notification popup triggered!' : 'Đã kích hoạt popup thông báo!');
  }
}
window.testBrowserNotification = testBrowserNotification;
function updateFocusThreshold(value) {
  const val = Math.max(5, Math.min(180, parseInt(value, 10) || 30));
  appState.settings.focusThresholdMinutes = val;
  saveData();
  previewFocusThreshold(val);

  if (typeof renderApp === 'function') {
    renderApp();
  }
}

/**
 * Thử nghiệm phân loại thời lượng trong Live Sandbox
 */
function previewTestDuration(mins, forcedThreshold = null) {
  const dur = Math.max(5, Math.min(180, parseInt(mins, 10) || 25));
  const threshold = forcedThreshold !== null ? forcedThreshold : (Number(appState.settings.focusThresholdMinutes) || 30);
  const isLong = dur >= threshold;
  const isEn = appState.settings.lang === 'en';
  const colors = appState.settings.colors || DEFAULT_DATA.settings.colors;

  const valEl = document.getElementById('sandbox-test-duration-val');
  if (valEl) valEl.textContent = `${dur} ${t('minShort')}`;

  const slider = document.getElementById('sandbox-test-duration-input');
  if (slider && Number(slider.value) !== dur) slider.value = dur;

  // Thẻ Focus
  const sampleCard = document.getElementById('sandbox-sample-focus-card');
  const samplePill = document.getElementById('sandbox-sample-focus-pill');
  const sampleTagText = document.getElementById('sandbox-sample-tag-text');

  if (sampleCard && samplePill) {
    if (isLong) {
      sampleCard.style.borderLeftColor = colors.focusLong;
      samplePill.className = 'smart-pill pill-focus-long';
      samplePill.textContent = isEn ? `Deep Focus (≥${threshold}m)` : `Tập trung sâu (≥${threshold}p)`;
    } else {
      sampleCard.style.borderLeftColor = colors.focusShort;
      samplePill.className = 'smart-pill pill-focus-short';
      samplePill.textContent = isEn ? `Quick Focus (<${threshold}m)` : `Tập trung nhanh (<${threshold}p)`;
    }
  }

  if (sampleTagText) {
    sampleTagText.textContent = isLong 
      ? (isEn ? `Classified as Long Focus because duration (${dur}m) ≥ threshold (${threshold}m)` : `Phân loại Tập trung Dài do thời lượng (${dur}p) ≥ ngưỡng (${threshold}p)`) 
      : (isEn ? `Classified as Short Focus because duration (${dur}m) < threshold (${threshold}m)` : `Phân loại Tập trung Ngắn do thời lượng (${dur}p) < ngưỡng (${threshold}p)`);
  }

  // Thẻ Noisy
  const sampleDistract = document.getElementById('sandbox-sample-distract-card');
  if (sampleDistract) {
    sampleDistract.style.borderLeftColor = isLong ? colors.distractLong : colors.distractShort;
    const distractPill = sampleDistract.querySelector('.smart-pill');
    if (distractPill) {
      distractPill.className = `smart-pill ${isLong ? 'pill-distract-long' : 'pill-distract-short'}`;
      distractPill.textContent = isLong ? (isEn ? 'Noisy & Long' : 'Khó tập trung - Dài') : (isEn ? 'Noisy & Short' : 'Khó tập trung - Ngắn');
    }
  }
}

/**
 * Cập nhật tùy chọn cấu hình chung trong Cài đặt
 */
function updateSettingsPreference(key, value) {
  if (!appState.settings) appState.settings = {};
  appState.settings[key] = value;
  saveData();
  
  if (key === 'timelineDaySpan') {
    if (typeof setTimelineDaySpan === 'function') {
      setTimelineDaySpan(parseInt(value, 10) || 1);
    }
  }
  
  if (typeof renderApp === 'function') {
    renderApp();
  }
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Preferences updated!' : 'Đã cập nhật tùy chọn!');
}

/**
 * Đổi ngôn ngữ trực tiếp từ giao diện Cài đặt với phản hồi tức thì
 */
function setLanguageFromSettings(lang) {
  if (appState.settings.lang === lang) return;
  appState.settings.lang = lang;
  saveData();
  updateStaticLanguageStrings();
  renderAllSettingsPanes();
  renderApp();
  showToast(lang === 'en' ? 'Switched to English' : 'Đã chuyển sang Tiếng Việt');
}

/**
 * Xác thực và cập nhật huy hiệu Client ID theo thời gian thực khi người dùng gõ
 */
function handleGCalClientIdInput(value) {
  const val = (value || '').trim();
  const hasClientId = val.length > 5;
  const isEn = appState.settings.lang === 'en';

  const badge = document.querySelector('#tab-account-sync .gcal-subcard .smart-pill');
  if (badge) {
    badge.style.background = hasClientId ? '#dcfce7' : '#fef3c7';
    badge.style.color = hasClientId ? '#15803d' : '#b45309';
    badge.textContent = hasClientId 
      ? (isEn ? '✓ Client ID Configured' : '✓ Đã cấu hình Client ID') 
      : (isEn ? '! Client ID Missing' : '! Cần điền Client ID');
  }
}

window.applyCustomColorsToRoot = applyCustomColorsToRoot;
window.previewFocusThreshold = previewFocusThreshold;
window.updateFocusThreshold = updateFocusThreshold;
window.updateColorSetting = updateColorSetting;
window.resetDefaultColors = resetDefaultColors;
window.previewTestDuration = previewTestDuration;
window.updateSettingsPreference = updateSettingsPreference;
window.setLanguageFromSettings = setLanguageFromSettings;
window.handleGCalClientIdInput = handleGCalClientIdInput;

function updateStreakGlobalThreshold(val) {
  const isEn = appState?.settings?.lang === 'en';
  const isSunday = new Date().getDay() === 0;
  if (!isSunday && appState?.settings?.streak?.thresholdEditableOnlyOnSunday !== false) {
    const msg = isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng chuẩn chuỗi kỷ luật vào Chủ Nhật!';
    if (typeof showToast === 'function') showToast(msg);
    if (typeof renderAllSettingsPanes === 'function') renderAllSettingsPanes();
    else if (typeof renderApp === 'function') renderApp();
    return false;
  }
  const num = Math.max(0.1, Math.min(1.0, Number(val) || 0.7));
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.streak) appState.settings.streak = {};
  appState.settings.streak.threshold = num;
  appState.settings.streakThreshold = num;
  touch(appState.settings.streak);
  touch(appState.settings);
  if (typeof saveData === 'function') saveData();
  if (typeof StreakEngine !== 'undefined' && typeof StreakEngine.notifyChange === 'function') {
    StreakEngine.notifyChange();
  }
  const successMsg = isEn ? 'Global streak threshold updated successfully!' : 'Đã cập nhật ngưỡng chuẩn chuỗi kỷ luật!';
  if (typeof showToast === 'function') showToast(successMsg);
  if (typeof renderAllSettingsPanes === 'function') renderAllSettingsPanes();
  else if (typeof renderApp === 'function') renderApp();
  return true;
}

function updateWeekdayThreshold(dow, val) {
  const isEn = appState?.settings?.lang === 'en';
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.streak) appState.settings.streak = {};
  if (!appState.settings.streak.weekdayThresholds) {
    appState.settings.streak.weekdayThresholds = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
  }
  if (!appState.settings.streak.weekdayThresholdsUpdatedAt || typeof appState.settings.streak.weekdayThresholdsUpdatedAt !== 'object') {
    appState.settings.streak.weekdayThresholdsUpdatedAt = {};
  }
  const parsedVal = (val === '' || val === 'null' || val === null || val === undefined) ? null : Number(val);
  appState.settings.streak.weekdayThresholds[dow] = parsedVal;
  touch(appState.settings.streak);
  appState.settings.streak.weekdayThresholdsUpdatedAt[dow] = appState.settings.streak.updatedAt;
  touch(appState.settings);
  if (typeof saveData === 'function') saveData();
  if (typeof StreakEngine !== 'undefined' && typeof StreakEngine.notifyChange === 'function') {
    StreakEngine.notifyChange();
  }
  const successMsg = isEn ? 'Weekday threshold updated successfully!' : 'Đã cập nhật ngưỡng cho ngày trong tuần!';
  if (typeof showToast === 'function') showToast(successMsg);
  if (typeof renderAllSettingsPanes === 'function') renderAllSettingsPanes();
  else if (typeof renderApp === 'function') renderApp();
  return true;
}

window.updateStreakGlobalThreshold = updateStreakGlobalThreshold;
window.updateWeekdayThreshold = updateWeekdayThreshold;

/**
 * Cập nhật cấu hình Thời Gian Chuyển Đổi (Transition Time) mới
 */
function updateTransitionToggle(field, isChecked) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.transition) {
    appState.settings.transition = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.transition));
  }
  appState.settings.transition[field] = Boolean(isChecked);
  saveData();

  // Cập nhật trạng thái hiển thị container số phút & cấu hình chi tiết theo thời gian thực
  const container = document.getElementById('transition-details-container');
  const tr = appState.settings.transition;
  const hasAny = Boolean(tr.enabledBeforeStart || tr.enabledAfterEnd);
  if (container) {
    container.style.display = hasAny ? 'flex' : 'none';
  }

  // Cập nhật viền & nền của toggle
  const chkBefore = document.getElementById('transition-chk-before');
  const chkAfter = document.getElementById('transition-chk-after');
  if (chkBefore?.closest('label')) {
    chkBefore.closest('label').style.border = tr.enabledBeforeStart ? '1px solid var(--primary)' : '1px solid var(--border-color)';
    chkBefore.closest('label').style.background = tr.enabledBeforeStart ? 'var(--bg-subtle)' : 'transparent';
  }
  if (chkAfter?.closest('label')) {
    chkAfter.closest('label').style.border = tr.enabledAfterEnd ? '1px solid var(--primary)' : '1px solid var(--border-color)';
    chkAfter.closest('label').style.background = tr.enabledAfterEnd ? 'var(--bg-subtle)' : 'transparent';
  }

  updateTransitionHeaderBadge();
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Transition setting updated' : 'Đã cập nhật cài đặt chuyển đổi');
}
window.updateTransitionToggle = updateTransitionToggle;

function updateTransitionMinutes(value) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.transition) {
    appState.settings.transition = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.transition));
  }
  const mins = Math.max(1, Math.min(120, parseInt(value, 10) || 10));
  appState.settings.transition.minutes = mins;
  saveData();
  updateTransitionHeaderBadge();
}
window.updateTransitionMinutes = updateTransitionMinutes;

function updateTransitionApplyTo(targetType, isChecked) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.transition) {
    appState.settings.transition = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.transition));
  }
  if (!appState.settings.transition.applyTo) {
    appState.settings.transition.applyTo = { task: true, fixed: false, transient: false };
  }
  appState.settings.transition.applyTo[targetType] = Boolean(isChecked);
  saveData();
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Transition targets updated' : 'Đã cập nhật đối tượng áp dụng');
}
window.updateTransitionApplyTo = updateTransitionApplyTo;

function updateTransitionConflictMode(mode) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.transition) {
    appState.settings.transition = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.transition));
  }
  appState.settings.transition.conflictMode = mode === 'sum' ? 'sum' : 'max';
  saveData();
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Conflict rule updated' : 'Đã cập nhật quy tắc liền kề');
}
window.updateTransitionConflictMode = updateTransitionConflictMode;

function updateTransitionHeaderBadge() {
  const badge = document.getElementById('transition-header-badge');
  if (!badge) return;
  const isEn = appState.settings?.lang === 'en';
  const tr = appState.settings?.transition || DEFAULT_DATA.settings.transition;
  const hasAny = Boolean(tr.enabledBeforeStart || tr.enabledAfterEnd);
  if (!hasAny) {
    badge.textContent = isEn ? 'Disabled' : 'Đang tắt';
    return;
  }
  const parts = [];
  if (tr.enabledBeforeStart) parts.push(isEn ? 'Before' : 'Trước');
  if (tr.enabledAfterEnd) parts.push(isEn ? 'After' : 'Sau');
  badge.textContent = `${tr.minutes || 10}${t('minShort')} (${parts.join(' & ')})`;
}
window.updateTransitionHeaderBadge = updateTransitionHeaderBadge;

function handleBlockClick(type, id) {
  if (type === 'scheduled') {
    const task = appState.tasks.find(t => t.id === id);
    if (task) {
      const slot = getTaskAssignedSlot(task, selectedDate) || task.assignedSlot;
      const rep = getRepeatLabel(task);
      const isDone = isTaskDoneOnDate(task, selectedDate);

      openModal(`
        <div class="modal-header">
          <h3 class="modal-title">${escapeHtml(task.title)}</h3>
          <button class="icon-btn" onclick="closeModal()">✕</button>
        </div>
        <div class="modal-body">
          ${rep ? `<div style="margin-bottom:8px;"><span class="repeat-badge">${rep}</span></div>` : ''}
          ${slot ? `
            <div style="font-size:13px; color:var(--text-secondary); margin-bottom:10px;">
              ${appState.settings.lang === 'en' ? 'Scheduled at:' : 'Đang được xếp lúc:'} <strong>${slot.start} - ${slot.end}</strong>
            </div>
          ` : ''}
          ${task.note ? `
            <div style="margin-bottom:12px;">
              <div style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:5px;">
                <span>${t('taskNoteHeading')}</span>
              </div>
              <div style="font-size:13px; color:var(--text-main); background:var(--bg-hover); border-left:3px solid var(--primary); padding:10px 12px; border-radius:4px; white-space:pre-wrap; word-break:break-word; line-height:1.5;">
                ${escapeHtml(task.note)}
              </div>
            </div>
          ` : ''}
          <div style="font-size:12px; color:var(--text-muted); margin-bottom:12px;">
            Trạng thái: <strong>${isDone ? 'Đã hoàn thành' : 'Cần làm'}</strong> • Ước lượng: ${task.estimatedMinutes || 25}p • ${task.requireQuiet ? 'Cần yên tĩnh' : 'Cho phép ồn'}
          </div>
          <div style="display:flex; gap:8px;">
            <button class="btn-secondary" onclick="toggleTaskDone('${task.id}', '${selectedDate}'); closeModal();">
              ${isDone ? 'Đánh dấu chưa xong' : 'Đánh dấu hoàn thành'}
            </button>
            <button class="btn-secondary" onclick="closeModal(); openEditTaskModal('${task.id}');">
              Sửa chi tiết
            </button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" style="color:#ef4444; margin-right:auto;" onclick="deleteTask('${task.id}'); closeModal();">${t('deleteBtn')}</button>
          <button class="btn-secondary" onclick="unassignTask('${task.id}', '${selectedDate}'); closeModal();">${t('unscheduleBtn')}</button>
          <button class="btn-primary" onclick="closeModal()">${t('cancelBtn')}</button>
        </div>
      `);
    }
  } else if (type === 'fixed') {
    openEditFixedEventModal(id);
  } else if (type === 'transient') {
    openEditTransientEventModal(id);
  }
}

// Drag and drop handlers
function handleDragStart(event, taskId) {
  event.dataTransfer.setData('text/plain', taskId);
}

function handleSlotDragOver(event) {
  event.preventDefault();
}

function handleSlotDrop(event, slotStart, slotEnd, targetDateStr = selectedDate) {
  event.preventDefault();
  const taskId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : null;
  if (taskId) {
    assignTaskToSlot(taskId, { start: slotStart, end: slotEnd }, targetDateStr);
  }
}

function quickMoveTaskQuadrant(taskId, targetQuadrant) {
  if (!taskId || !targetQuadrant) return;
  const task = (appState.tasks || []).find(t => t.id === taskId);
  if (!task || task.deleted) return;
  const isImportant = targetQuadrant === 'q1' || targetQuadrant === 'q2';
  const isUrgent = targetQuadrant === 'q1' || targetQuadrant === 'q3';
  task.isImportant = isImportant;
  task.isUrgent = isUrgent;
  task.quadrant = targetQuadrant;
  touch(task);
  saveData();
  renderApp();
  if (typeof showToast === 'function') {
    const isEn = appState.settings?.lang === 'en';
    showToast(isEn ? `Moved task to ${targetQuadrant.toUpperCase()}` : `Đã chuyển việc sang ${targetQuadrant.toUpperCase()}`);
  }
}

function handleQuadrantDragOver(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
}

function handleQuadrantDrop(event, targetQuadrant) {
  event.preventDefault();
  const taskId = event.dataTransfer ? event.dataTransfer.getData('text/plain') : null;
  if (!taskId) return;
  quickMoveTaskQuadrant(taskId, targetQuadrant);
}

function toggleMobileSidebar() {
  toggleSidebar();
}

/**
 * Chuyển đổi trạng thái Ẩn / Hiện của thanh bên trái chủ động cho mọi độ rộng màn hình
 * @param {boolean|undefined} forceState - Nếu truyền boolean thì gán trạng thái cụ thể, ngược lại toggle
 */
function toggleSidebar(forceState) {
  const sidebar = document.getElementById('app-sidebar-content');
  const backdrop = document.getElementById('sidebar-backdrop');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (!sidebar) return;

  const isMobile = window.innerWidth <= 860;

  if (isMobile) {
    // Trên màn hình di động/tablet hẹp: hoạt động dạng drawer overlay
    const shouldOpen = typeof forceState === 'boolean' ? forceState : !sidebar.classList.contains('open');
    if (shouldOpen) {
      sidebar.classList.add('open');
      if (backdrop) backdrop.classList.add('active');
    } else {
      sidebar.classList.remove('open');
      if (backdrop) backdrop.classList.remove('active');
    }
  } else {
    // Trên màn hình rộng (desktop/laptop): thu gọn hoặc mở rộng chiều rộng thanh bên
    const isCurrentlyCollapsed = sidebar.classList.contains('desktop-collapsed');
    const shouldCollapse = typeof forceState === 'boolean' ? !forceState : !isCurrentlyCollapsed;

    if (shouldCollapse) {
      sidebar.classList.add('desktop-collapsed');
      try {
        localStorage.setItem('chronoflow_sidebar_desktop_collapsed', 'true');
      } catch (e) {}
      if (toggleBtn) {
        toggleBtn.classList.add('sidebar-is-collapsed');
        toggleBtn.setAttribute('title', t('showSidebar') || 'Hiện thanh bên (Ctrl+B)');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    } else {
      sidebar.classList.remove('desktop-collapsed');
      try {
        localStorage.setItem('chronoflow_sidebar_desktop_collapsed', 'false');
      } catch (e) {}
      if (toggleBtn) {
        toggleBtn.classList.remove('sidebar-is-collapsed');
        toggleBtn.setAttribute('title', t('hideSidebar') || 'Ẩn thanh bên (Ctrl+B)');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }

    // Đồng bộ lại kích thước và bố cục sau khi hoàn tất hiệu ứng co giãn
    setTimeout(() => {
      if (typeof syncSpanButtonWidth === 'function') syncSpanButtonWidth(document);
      if (typeof checkAndResolveTagOcclusion === 'function') checkAndResolveTagOcclusion(document);
    }, 280);
  }
}

/**
 * Khôi phục trạng thái ban đầu của sidebar khi tải trang
 */
function applyInitialSidebarState() {
  const sidebar = document.getElementById('app-sidebar-content');
  const toggleBtn = document.getElementById('sidebar-toggle-btn');
  if (!sidebar) return;

  if (window.innerWidth > 860) {
    let savedCollapsed = null;
    try {
      savedCollapsed = localStorage.getItem('chronoflow_sidebar_desktop_collapsed');
    } catch (e) {}
    // Mặc định là MỞ RA khi màn hình đủ rộng (false/null), chỉ ẩn khi người dùng chủ động chọn ẩn ('true')
    if (savedCollapsed === 'true') {
      sidebar.classList.add('desktop-collapsed');
      if (toggleBtn) {
        toggleBtn.classList.add('sidebar-is-collapsed');
        toggleBtn.setAttribute('title', t('showSidebar') || 'Hiện thanh bên (Ctrl+B)');
        toggleBtn.setAttribute('aria-expanded', 'false');
      }
    } else {
      sidebar.classList.remove('desktop-collapsed');
      if (toggleBtn) {
        toggleBtn.classList.remove('sidebar-is-collapsed');
        toggleBtn.setAttribute('title', t('hideSidebar') || 'Ẩn thanh bên (Ctrl+B)');
        toggleBtn.setAttribute('aria-expanded', 'true');
      }
    }
  } else {
    sidebar.classList.remove('open');
    const backdrop = document.getElementById('sidebar-backdrop');
    if (backdrop) backdrop.classList.remove('active');
  }
}

function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-').map(Number);
  const dObj = new Date(y, m - 1, d);
  const isEn = appState.settings.lang === 'en';
  if (isEn) {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[dObj.getDay()]}, ${months[dObj.getMonth()]} ${dObj.getDate()}, ${dObj.getFullYear()}`;
  } else {
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    return `${days[dObj.getDay()]}, ngày ${dObj.getDate()}/${dObj.getMonth() + 1}/${dObj.getFullYear()}`;
  }
}

function formatDisplayDateRange(dates) {
  if (!dates || dates.length === 0) return '';
  if (dates.length === 1) return formatDisplayDate(dates[0]);
  const isEn = appState.settings.lang === 'en';
  const startStr = dates[0];
  const endStr = dates[dates.length - 1];
  const [sy, sm, sd] = startStr.split('-').map(Number);
  const [ey, em, ed] = endStr.split('-').map(Number);

  if (isEn) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (sy === ey && sm === em) {
      return `${months[sm - 1]} ${sd} – ${ed}, ${sy}`;
    } else if (sy === ey) {
      return `${months[sm - 1]} ${sd} – ${months[em - 1]} ${ed}, ${sy}`;
    } else {
      return `${months[sm - 1]} ${sd}, ${sy} – ${months[em - 1]} ${ed}, ${ey}`;
    }
  } else {
    if (sy === ey && sm === em) {
      return `${sd} – ${ed} tháng ${sm}, ${sy}`;
    } else if (sy === ey) {
      return `${sd}/${sm} – ${ed}/${em}/${sy}`;
    } else {
      return `${sd}/${sm}/${sy} – ${ed}/${em}/${ey}`;
    }
  }
}

function escapeHtml(text) {
  if (!text) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ==========================================
// BACKUP, RESTORE & CLEAN-SLATE RESET WITH 5s COUNTDOWN SAFETY
// ==========================================
let countdownInterval = null;

function openCountdownConfirmModal({ title, desc, extraHtml, alertHtml, confirmLabel, confirmClass = 'btn-primary', onConfirm }) {
  if (countdownInterval) {
    clearInterval(countdownInterval);
    countdownInterval = null;
  }
  if (window._activeCountdownInterval) {
    clearInterval(window._activeCountdownInterval);
    window._activeCountdownInterval = null;
  }

  let remainingSec = 5;
  const isEn = appState.settings.lang === 'en';
  const cancelText = isEn ? 'Cancel' : 'Hủy';

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${title}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="font-size:13px; color:var(--text-main); line-height:1.6;">
        ${desc}
      </div>

      ${extraHtml ? `
        <div>
          ${extraHtml}
        </div>
      ` : ''}

      ${alertHtml ? `
        <div style="background:var(--pill-distract-short-bg); border:1px solid var(--pill-distract-short-border); border-left:4px solid #f59e0b; border-radius:8px; padding:12px; font-size:12px; color:var(--text-main); line-height:1.5;">
          ${alertHtml}
        </div>
      ` : ''}

      <div style="background:var(--bg-subtle); border:1px solid var(--border-color); border-radius:8px; padding:10px 14px; display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:12px; font-weight:600; color:var(--text-muted);" id="countdown-status-text">
          ${isEn ? `Please wait ${remainingSec}s to confirm...` : `Vui lòng chờ ${remainingSec}s để có thể xác nhận...`}
        </span>
        <span class="smart-pill" id="countdown-badge" style="background:#e0e7ff; color:#3730a3; font-weight:800; font-size:12px; min-width:32px; text-align:center;">
          ${remainingSec}s
        </span>
      </div>
    </div>
    <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn-secondary" onclick="closeModal()">${cancelText}</button>
      <button id="btn-countdown-confirm" class="${confirmClass}" disabled onclick="window._executeCountdownAction()" style="opacity:0.5; cursor:not-allowed; transition:all 0.2s ease;">
        ${confirmLabel} (${remainingSec}s)
      </button>
    </div>
  `);

  window._executeCountdownAction = () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
      countdownInterval = null;
    }
    window._activeCountdownInterval = null;
    if (typeof onConfirm === 'function') onConfirm();
    closeModal();
  };

  const confirmBtn = document.getElementById('btn-countdown-confirm');
  const statusText = document.getElementById('countdown-status-text');
  const badge = document.getElementById('countdown-badge');

  countdownInterval = setInterval(() => {
    remainingSec--;
    if (remainingSec > 0) {
      if (confirmBtn) confirmBtn.textContent = `${confirmLabel} (${remainingSec}s)`;
      if (statusText) statusText.textContent = `⏳ ${isEn ? `Please wait ${remainingSec}s to confirm...` : `Vui lòng chờ ${remainingSec}s để có thể xác nhận...`}`;
      if (badge) badge.textContent = `${remainingSec}s`;
    } else {
      clearInterval(countdownInterval);
      countdownInterval = null;
      window._activeCountdownInterval = null;
      if (confirmBtn) {
        confirmBtn.disabled = false;
        confirmBtn.style.opacity = '1';
        confirmBtn.style.cursor = 'pointer';
        confirmBtn.textContent = confirmLabel;
      }
      if (statusText) {
        statusText.innerHTML = `<strong style="color:#166534;">${isEn ? 'Ready to confirm!' : 'Đã sẵn sàng xác nhận!'}</strong>`;
      }
      if (badge) {
        badge.style.background = '#dcfce7';
        badge.style.color = '#166534';
        badge.textContent = 'OK';
      }
    }
  }, 1000);
  window._activeCountdownInterval = countdownInterval;
}

// 1. Export Data with 5s Confirmation
async function downloadOfflineHtmlApp() {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const btn = document.getElementById('btn-download-offline-html');
  const btnText = document.getElementById('btn-download-offline-text');
  const originalText = btnText ? btnText.textContent : (isEn ? 'Build & Download Offline HTML' : 'Biên dịch (Build) & Tải File HTML Offline');

  if (btn) btn.disabled = true;
  if (btnText) btnText.textContent = isEn ? 'Building & packaging...' : 'Đang build & đóng gói...';
  showToast(isEn ? 'Building & packaging single-file HTML app...' : 'Đang biên dịch & đóng gói Single File HTML...');

  try {
    const response = await fetch('/download-offline-html');
    if (!response.ok) {
      throw new Error(`Server returned HTTP status ${response.status}`);
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ChronoFlow_Offline.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(isEn ? 'Downloaded ChronoFlow_Offline.html successfully!' : 'Đã tải thành công ChronoFlow_Offline.html!');
  } catch (err) {
    console.warn('[Offline Build Fallback Triggered]:', err);
    showToast(isEn ? 'Using Client-side fallback packaging...' : 'Chuyển sang cơ chế đóng gói Client-side Fallback...');

    try {
      // Client-side Fallback: Clone active DOM HTML snapshot
      const cloneDoc = document.documentElement.cloneNode(true);

      // Nhúng toàn bộ CSS vào file HTML Offline để hoạt động độc lập không cần máy chủ
      let inlinedCss = '';
      try {
        const cssResp = await fetch('/src/styles.css');
        if (cssResp.ok) {
          inlinedCss = await cssResp.text();
        }
      } catch (e1) {
        // Fallback thu thập từ document.styleSheets
        try {
          for (let i = 0; i < document.styleSheets.length; i++) {
            const sheet = document.styleSheets[i];
            if (sheet.cssRules) {
              for (let j = 0; j < sheet.cssRules.length; j++) {
                inlinedCss += sheet.cssRules[j].cssText + '\n';
              }
            }
          }
        } catch (e2) {}
      }

      if (inlinedCss) {
        // Gỡ bỏ thẻ link stylesheet tương đối và thay bằng thẻ style nhúng trực tiếp
        const links = cloneDoc.querySelectorAll('link[rel="stylesheet"]');
        links.forEach(l => l.remove());

        const styleEl = document.createElement('style');
        styleEl.id = 'chronoflow-embedded-styles';
        styleEl.textContent = inlinedCss;
        const head = cloneDoc.querySelector('head') || cloneDoc;
        head.appendChild(styleEl);
      }

      // Nhúng dữ liệu hiện tại để mở file là có dữ liệu đầy đủ
      if (typeof appState !== 'undefined') {
        const dataScript = document.createElement('script');
        dataScript.textContent = `
          try {
            if (!localStorage.getItem('chronoflow_data')) {
              localStorage.setItem('chronoflow_data', ${JSON.stringify(JSON.stringify(appState))});
            }
          } catch(e) {}
        `;
        const head = cloneDoc.querySelector('head') || cloneDoc;
        head.appendChild(dataScript);
      }

      const blob = new Blob(['<!DOCTYPE html>\n' + cloneDoc.outerHTML], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'ChronoFlow_Offline.html';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast(isEn ? 'Downloaded offline HTML with full inlined styles!' : 'Đã xuất file HTML Offline với toàn bộ CSS & hiệu ứng nhúng trực tiếp!');
    } catch (fallbackErr) {
      console.error('[Download Offline Error]:', fallbackErr);
      showToast(isEn ? 'Failed to export offline HTML app.' : 'Không thể xuất file HTML Offline.');
    }
  } finally {
    if (btn) btn.disabled = false;
    if (btnText) btnText.textContent = originalText;
  }
}

function executeExportData() {
  // Đảm bảo chạy migration chuẩn hóa toàn bộ metadata (updatedAt, updatedBy, deleted)
  // và giữ nguyên tất cả record có deleted: true (tombstone)
  if (typeof migrateDataRecords === 'function') {
    migrateDataRecords(appState);
  }
  if (!appState.schemaVersion || appState.schemaVersion < 2) {
    appState.schemaVersion = 2;
  }

  const exportPayload = {
    ...appState,
    schemaVersion: 2
  };

  const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `chronoflow_backup_${selectedDate || getTodayDateString()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast(t('toastBackupExported'));
}

function confirmExportData() {
  openCountdownConfirmModal({
    title: t('confirmExportTitle'),
    desc: t('confirmExportDesc'),
    alertHtml: t('confirmExportAlert'),
    confirmLabel: t('confirmExportBtn'),
    confirmClass: 'btn-primary',
    onConfirm: () => executeExportData()
  });
}

function exportDataToFile() {
  confirmExportData();
}

// ==========================================
// DỌN DẸP BẢN GHI ĐÃ XÓA MỀM (PRUNE SOFT-DELETED RECORDS)
// ==========================================
function pruneDeletedRecords(days = 90) {
  const d = Number(days) || 90;
  const cutoffTime = Date.now() - (d * 86400000);
  let prunedCount = 0;

  const isOldTombstone = (item) => {
    if (!item || typeof item !== 'object') return false;
    if (!item.deleted) return false;
    const time = Number(item.updatedAt) || 0;
    return time < cutoffTime;
  };

  // 1. tasks
  if (Array.isArray(appState.tasks)) {
    const before = appState.tasks.length;
    appState.tasks = appState.tasks.filter(t => !isOldTombstone(t));
    prunedCount += (before - appState.tasks.length);
  }

  // 2. fixedEvents
  if (Array.isArray(appState.fixedEvents)) {
    const before = appState.fixedEvents.length;
    appState.fixedEvents = appState.fixedEvents.filter(f => !isOldTombstone(f));
    prunedCount += (before - appState.fixedEvents.length);
  }

  // 3. transientEvents
  if (Array.isArray(appState.transientEvents)) {
    const before = appState.transientEvents.length;
    appState.transientEvents = appState.transientEvents.filter(tr => !isOldTombstone(tr));
    prunedCount += (before - appState.transientEvents.length);
  }

  // 4. notes
  if (Array.isArray(appState.notes)) {
    const before = appState.notes.length;
    appState.notes = appState.notes.filter(n => !isOldTombstone(n));
    prunedCount += (before - appState.notes.length);
  }

  // 5. noisyIntervals (ở root và settings)
  if (Array.isArray(appState.noisyIntervals)) {
    const before = appState.noisyIntervals.length;
    appState.noisyIntervals = appState.noisyIntervals.filter(ni => !isOldTombstone(ni));
    prunedCount += (before - appState.noisyIntervals.length);
  }
  if (appState.settings && Array.isArray(appState.settings.noisyIntervals)) {
    const before = appState.settings.noisyIntervals.length;
    appState.settings.noisyIntervals = appState.settings.noisyIntervals.filter(ni => !isOldTombstone(ni));
    prunedCount += (before - appState.settings.noisyIntervals.length);
  }

  // 6. goals: years, monthGoals, dailyGoals
  if (appState.goals && typeof appState.goals === 'object') {
    if (Array.isArray(appState.goals.years)) {
      const before = appState.goals.years.length;
      appState.goals.years = appState.goals.years.filter(g => !isOldTombstone(g));
      prunedCount += (before - appState.goals.years.length);
    }
    if (Array.isArray(appState.goals.monthGoals)) {
      const before = appState.goals.monthGoals.length;
      appState.goals.monthGoals = appState.goals.monthGoals.filter(g => !isOldTombstone(g));
      prunedCount += (before - appState.goals.monthGoals.length);
    }
    if (Array.isArray(appState.goals.dailyGoals)) {
      const before = appState.goals.dailyGoals.length;
      appState.goals.dailyGoals = appState.goals.dailyGoals.filter(g => !isOldTombstone(g));
      prunedCount += (before - appState.goals.dailyGoals.length);
    }
  }

  // Sau khi xóa xong phải lưu lại data và cập nhật maxSeenUpdatedAt nếu cần
  const now = Date.now();
  const currentMax = typeof maxSeenUpdatedAt !== 'undefined' ? (Number(maxSeenUpdatedAt) || 0) : 0;
  const newMax = Math.max(currentMax, Number(appState.maxSeenUpdatedAt) || 0, now);

  if (typeof maxSeenUpdatedAt !== 'undefined') {
    maxSeenUpdatedAt = newMax;
  }
  appState.maxSeenUpdatedAt = newMax;

  if (typeof window !== 'undefined') window.maxSeenUpdatedAt = newMax;
  if (typeof globalThis !== 'undefined') globalThis.maxSeenUpdatedAt = newMax;
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chronoflow_maxSeenUpdatedAt', String(newMax));
      localStorage.setItem('maxSeenUpdatedAt', String(newMax));
    }
  } catch (e) {}

  saveData(appState);
  renderApp();

  return prunedCount;
}

function confirmPruneDeletedRecords(days = 90) {
  const isEn = appState.settings && appState.settings.lang === 'en';
  const cutoffDateStr = new Date(Date.now() - days * 86400000).toLocaleDateString(isEn ? 'en-US' : 'vi-VN');

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${isEn ? `Prune Deleted Records Older Than ${days} Days` : `Dọn dẹp bản ghi đã xóa cũ hơn ${days} ngày`}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body" style="display:flex; flex-direction:column; gap:12px;">
      <div style="font-size:13px; color:var(--text-main); line-height:1.6;">
        ${isEn
          ? `This action will permanently purge all soft-deleted records (tombstones) updated prior to <strong>${cutoffDateStr}</strong>.`
          : `Thao tác này sẽ xóa hẳn (hard-delete) tất cả các bản ghi đã xóa mềm (tombstone) có thời gian cập nhật trước ngày <strong>${cutoffDateStr}</strong>.`}
      </div>
      <div style="background:var(--pill-distract-short-bg); border:1px solid var(--pill-distract-short-border); border-left:4px solid #f59e0b; border-radius:8px; padding:12px; font-size:12px; color:var(--text-main); line-height:1.5;">
        ${isEn
          ? 'Notice: Active tasks, events, and notes are not affected. Only records that were soft-deleted over 90 days ago will be cleared to optimize storage.'
          : 'Lưu ý: Các công việc và sự kiện đang hoạt động không bị ảnh hưởng. Chỉ các mục đã xóa mềm hơn 90 ngày mới được dọn sạch để giải phóng bộ nhớ LocalStorage.'}
      </div>
    </div>
    <div class="modal-footer" style="display:flex; justify-content:flex-end; gap:8px;">
      <button class="btn-secondary" onclick="closeModal()">${isEn ? 'Cancel' : 'Hủy'}</button>
      <button class="btn-primary" style="background:#ea580c; border-color:#ea580c;" onclick="executePruneAction(${days})">
        ${isEn ? 'Confirm Clean Up' : 'Xác Nhận Dọn Dẹp'}
      </button>
    </div>
  `);
}

function executePruneAction(days = 90) {
  closeModal();
  const count = pruneDeletedRecords(days);
  const isEn = appState.settings && appState.settings.lang === 'en';
  if (count > 0) {
    showToast(isEn ? `Successfully pruned ${count} old deleted record(s)!` : `Đã dọn dẹp thành công ${count} bản ghi đã xóa cũ hơn ${days} ngày!`);
  } else {
    showToast(isEn ? `No deleted records older than ${days} days found.` : `Không có bản ghi đã xóa nào cũ hơn ${days} ngày cần dọn dẹp.`);
  }
}

if (typeof window !== 'undefined') {
  window.pruneDeletedRecords = pruneDeletedRecords;
  window.confirmPruneDeletedRecords = confirmPruneDeletedRecords;
  window.executePruneAction = executePruneAction;
}
if (typeof globalThis !== 'undefined') {
  globalThis.pruneDeletedRecords = pruneDeletedRecords;
  globalThis.confirmPruneDeletedRecords = confirmPruneDeletedRecords;
  globalThis.executePruneAction = executePruneAction;
}

// ==========================================
// MERGE THÔNG MINH (LAST-WRITER-WINS + SOFT-DELETE)
// ==========================================
function mergeCollections(localData, incomingData) {
  const local = localData && typeof localData === 'object' ? localData : {};
  const incoming = incomingData && typeof incomingData === 'object' ? incomingData : {};

  // 1. Helper chuẩn hóa metadata record
  const getUpdatedAt = (item) => {
    if (!item || typeof item !== 'object') return 0;
    const val = item.updatedAt;
    if (val === undefined || val === null) return 0;
    const num = Number(val);
    return Number.isFinite(num) ? num : 0;
  };

  const isDeleted = (item) => Boolean(item && item.deleted);

  // 2. Hàm giải quyết xung đột cho từng cặp bản ghi cùng id (hoặc cùng key slotOverrides)
  const resolveRecordConflict = (localItem, incomingItem) => {
    const localTime = getUpdatedAt(localItem);
    const incomingTime = getUpdatedAt(incomingItem);

    let winner = localItem;
    let loser = incomingItem;

    // Quy tắc 1: Chọn bản có updatedAt lớn hơn (updatedAt cao hơn thắng)
    if (incomingTime > localTime) {
      winner = incomingItem;
      loser = localItem;
    } else if (localTime > incomingTime) {
      winner = localItem;
      loser = incomingItem;
    } else {
      // Quy tắc 2: Nếu updatedAt bằng nhau → ưu tiên bản có deleted: true
      const localDel = isDeleted(localItem);
      const incomingDel = isDeleted(incomingItem);

      if (incomingDel && !localDel) {
        winner = incomingItem;
        loser = localItem;
      } else if (localDel && !incomingDel) {
        winner = localItem;
        loser = incomingItem;
      } else {
        // Quy tắc 3: Khi updatedAt bằng nhau và cả hai đều không bị deleted (hoặc cả hai đều deleted)
        // Ưu tiên giữ bản local thay vì incoming (an toàn hơn)
        winner = localItem;
        loser = incomingItem;
      }
    }

    // Bảo toàn gcal_event_id nếu bản ghi thắng không bị xóa nhưng chưa có gcal_event_id từ thiết bị kia
    if (
      winner && typeof winner === 'object' && !isDeleted(winner) && !winner.gcal_event_id &&
      loser && typeof loser === 'object' && !isDeleted(loser) && loser.gcal_event_id
    ) {
      winner = {
        ...winner,
        gcal_event_id: loser.gcal_event_id
      };
      if (loser._syncedRepeatType !== undefined && winner._syncedRepeatType === undefined) {
        winner._syncedRepeatType = loser._syncedRepeatType;
      }
      if (loser._syncedStartDate !== undefined && winner._syncedStartDate === undefined) {
        winner._syncedStartDate = loser._syncedStartDate;
      }
    }

    return winner;
  };

  // 3. Hàm merge tổng quát cho một mảng các thực thể (theo id)
  const mergeArray = (localList, incomingList) => {
    const localArr = Array.isArray(localList) ? localList : [];
    const incomingArr = Array.isArray(incomingList) ? incomingList : [];

    const map = new Map();
    const orderedKeys = [];

    // Nạp toàn bộ item từ local vào Map
    for (const item of localArr) {
      if (!item || typeof item !== 'object') continue;
      const id = item.id;
      if (id !== undefined && id !== null && id !== '') {
        map.set(id, item);
        orderedKeys.push(id);
      } else {
        orderedKeys.push(item);
      }
    }

    // Duyệt incoming: so khớp xung đột hoặc thêm mới
    for (const item of incomingArr) {
      if (!item || typeof item !== 'object') continue;
      const id = item.id;
      if (id !== undefined && id !== null && id !== '') {
        if (map.has(id)) {
          const currentWinner = map.get(id);
          const winner = resolveRecordConflict(currentWinner, item);
          map.set(id, winner);
        } else {
          map.set(id, item);
          orderedKeys.push(id);
        }
      } else {
        orderedKeys.push(item);
      }
    }

    // Tái cấu trúc mảng đã merge và khử trùng lặp key theo thứ tự xuất hiện
    const result = [];
    const seenIds = new Set();
    for (const key of orderedKeys) {
      if (typeof key === 'object') {
        result.push(key);
      } else if (!seenIds.has(key)) {
        seenIds.add(key);
        result.push(map.get(key));
      }
    }
    return result;
  };

  // 4. Merge slotOverrides (object key-value)
  const mergeSlotOverrides = (localOverrides, incomingOverrides) => {
    const localObj = (localOverrides && typeof localOverrides === 'object') ? localOverrides : {};
    const incomingObj = (incomingOverrides && typeof incomingOverrides === 'object') ? incomingOverrides : {};

    const allKeys = new Set([...Object.keys(localObj), ...Object.keys(incomingObj)]);
    const merged = {};

    for (const key of allKeys) {
      const hasLocal = Object.prototype.hasOwnProperty.call(localObj, key);
      const hasIncoming = Object.prototype.hasOwnProperty.call(incomingObj, key);

      // Key nào không tồn tại ở một bên thì lấy từ bên còn lại
      if (hasLocal && !hasIncoming) {
        merged[key] = localObj[key];
      } else if (!hasLocal && hasIncoming) {
        merged[key] = incomingObj[key];
      } else {
        // Cả 2 bên đều có key
        const localVal = localObj[key];
        const incomingVal = incomingObj[key];

        const isLocalObj = localVal && typeof localVal === 'object';
        const isIncomingObj = incomingVal && typeof incomingVal === 'object';

        // Nếu value là object có updatedAt thì áp dụng quy tắc Last-Writer-Wins + soft-delete
        if (isLocalObj || isIncomingObj) {
          merged[key] = resolveRecordConflict(localVal, incomingVal);
        } else {
          // Giá trị nguyên thủy (không có updatedAt): ưu tiên bản local (an toàn hơn)
          merged[key] = localVal;
        }
      }
    }

    return merged;
  };

  // 5. Merge Settings: Lấy bản có updatedAt hoặc collectionMod cao hơn
  const localSettings = (local.settings && typeof local.settings === 'object') ? local.settings : {};
  const incomingSettings = (incoming.settings && typeof incoming.settings === 'object') ? incoming.settings : {};

  const getSettingsScore = (s) => {
    if (!s || typeof s !== 'object') return 0;
    const up = Number(s.updatedAt) || 0;
    const mod = Number(s.collectionMod) || 0;
    return Math.max(up, mod);
  };

  const localSettingsScore = getSettingsScore(localSettings);
  const incomingSettingsScore = getSettingsScore(incomingSettings);

  const baseSettings = incomingSettingsScore > localSettingsScore
    ? { ...localSettings, ...incomingSettings }
    : { ...incomingSettings, ...localSettings };

  // Bảo toàn thông tin OAuth / fileId cục bộ trong settings.gcal và settings.gdrive
  if (localSettings.gcal || incomingSettings.gcal) {
    const winnerGcal = (incomingSettingsScore > localSettingsScore ? incomingSettings.gcal : localSettings.gcal) || {};
    const fallbackGcal = (incomingSettingsScore > localSettingsScore ? localSettings.gcal : incomingSettings.gcal) || {};
    const mergedGcal = {
      ...fallbackGcal,
      ...winnerGcal,
      clientId: winnerGcal.clientId || fallbackGcal.clientId || '',
      apiKey: winnerGcal.apiKey || fallbackGcal.apiKey || '',
      userEmail: winnerGcal.userEmail || fallbackGcal.userEmail || '',
      syncToken: localSettings.gcal?.syncToken || incomingSettings.gcal?.syncToken || null,
      syncTypes: {
        ...(DEFAULT_DATA.settings.gcal?.syncTypes || {}),
        ...(fallbackGcal.syncTypes || {}),
        ...(winnerGcal.syncTypes || {})
      },
      syncScheduledQuadrants: {
        ...(DEFAULT_DATA.settings.gcal?.syncScheduledQuadrants || {}),
        ...(fallbackGcal.syncScheduledQuadrants || {}),
        ...(winnerGcal.syncScheduledQuadrants || {})
      },
      colorMapping: {
        ...(DEFAULT_DATA.settings.gcal?.colorMapping || {}),
        ...(fallbackGcal.colorMapping || {}),
        ...(winnerGcal.colorMapping || {})
      }
    };
    if (localSettings.gcal && typeof localSettings.gcal === 'object') {
      baseSettings.gcal = Object.assign(localSettings.gcal, mergedGcal);
    } else {
      baseSettings.gcal = mergedGcal;
    }
  }

  if (localSettings.gdrive || incomingSettings.gdrive) {
    const winnerGdrive = (incomingSettingsScore > localSettingsScore ? incomingSettings.gdrive : localSettings.gdrive) || {};
    const fallbackGdrive = (incomingSettingsScore > localSettingsScore ? localSettings.gdrive : incomingSettings.gdrive) || {};
    const mergedGdrive = {
      ...fallbackGdrive,
      ...winnerGdrive,
      fileId: localSettings.gdrive?.fileId || incomingSettings.gdrive?.fileId || null
    };
    if (localSettings.gdrive && typeof localSettings.gdrive === 'object') {
      baseSettings.gdrive = Object.assign(localSettings.gdrive, mergedGdrive);
    } else {
      baseSettings.gdrive = mergedGdrive;
    }
  }

  // Xử lý noisyIntervals nếu nằm trong settings (chuẩn ChronoFlow DEFAULT_DATA)
  if (Array.isArray(localSettings.noisyIntervals) || Array.isArray(incomingSettings.noisyIntervals)) {
    baseSettings.noisyIntervals = mergeArray(
      localSettings.noisyIntervals,
      incomingSettings.noisyIntervals
    );
  }

  // Merge Transition Settings mới nếu có
  if (localSettings.transition || incomingSettings.transition) {
    const winnerTrans = (incomingSettingsScore > localSettingsScore ? incomingSettings.transition : localSettings.transition) || {};
    const fallbackTrans = (incomingSettingsScore > localSettingsScore ? localSettings.transition : incomingSettings.transition) || {};
    baseSettings.transition = {
      ...(DEFAULT_DATA.settings.transition || {}),
      ...fallbackTrans,
      ...winnerTrans,
      applyTo: {
        ...((DEFAULT_DATA.settings.transition && DEFAULT_DATA.settings.transition.applyTo) || {}),
        ...(fallbackTrans.applyTo || {}),
        ...(winnerTrans.applyTo || {})
      }
    };
  }

  // Merge Streak Settings (threshold, weekdayThresholds / ngày lười trong tuần, weeklyRelief) theo chuẩn Last-Writer-Wins
  if (localSettings.streak || incomingSettings.streak || localSettings.streakThreshold !== undefined || incomingSettings.streakThreshold !== undefined) {
    const locStreak = (localSettings.streak && typeof localSettings.streak === 'object') ? localSettings.streak : {};
    const incStreak = (incomingSettings.streak && typeof incomingSettings.streak === 'object') ? incomingSettings.streak : {};

    const locStreakScore = Math.max(Number(locStreak.updatedAt) || 0, localSettingsScore);
    const incStreakScore = Math.max(Number(incStreak.updatedAt) || 0, incomingSettingsScore);
    const incWinsStreak = incStreakScore > locStreakScore;

    const winnerStreak = incWinsStreak ? incStreak : locStreak;
    const fallbackStreak = incWinsStreak ? locStreak : incStreak;

    // 1. Ngưỡng chuẩn toàn cục (Global threshold)
    const winnerGlobalThresh = winnerStreak.threshold !== undefined
      ? winnerStreak.threshold
      : (incWinsStreak ? incomingSettings.streakThreshold : localSettings.streakThreshold);
    const fallbackGlobalThresh = fallbackStreak.threshold !== undefined
      ? fallbackStreak.threshold
      : (incWinsStreak ? localSettings.streakThreshold : incomingSettings.streakThreshold);
    const resolvedThreshold = (typeof winnerGlobalThresh === 'number' && !isNaN(winnerGlobalThresh))
      ? winnerGlobalThresh
      : ((typeof fallbackGlobalThresh === 'number' && !isNaN(fallbackGlobalThresh)) ? fallbackGlobalThresh : 0.7);

    // 2. Ngưỡng riêng từng thứ trong tuần (weekdayThresholds: 0..6 - bao gồm cả ngày "lười" trong tuần)
    const locWT = (locStreak.weekdayThresholds && typeof locStreak.weekdayThresholds === 'object') ? locStreak.weekdayThresholds : {};
    const incWT = (incStreak.weekdayThresholds && typeof incStreak.weekdayThresholds === 'object') ? incStreak.weekdayThresholds : {};
    const locWTTime = (locStreak.weekdayThresholdsUpdatedAt && typeof locStreak.weekdayThresholdsUpdatedAt === 'object') ? locStreak.weekdayThresholdsUpdatedAt : {};
    const incWTTime = (incStreak.weekdayThresholdsUpdatedAt && typeof incStreak.weekdayThresholdsUpdatedAt === 'object') ? incStreak.weekdayThresholdsUpdatedAt : {};

    const mergedWeekdayThresholds = { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null };
    const mergedWeekdayThresholdsUpdatedAt = {};

    for (let dow = 0; dow <= 6; dow++) {
      const hasLocDow = Object.prototype.hasOwnProperty.call(locWT, dow);
      const hasIncDow = Object.prototype.hasOwnProperty.call(incWT, dow);
      const lTime = Number(locWTTime[dow]) || (hasLocDow && locWT[dow] !== null ? locStreakScore : 0);
      const iTime = Number(incWTTime[dow]) || (hasIncDow && incWT[dow] !== null ? incStreakScore : 0);

      if (iTime > lTime) {
        mergedWeekdayThresholds[dow] = incWT[dow] !== undefined ? incWT[dow] : null;
        if (iTime > 0) mergedWeekdayThresholdsUpdatedAt[dow] = iTime;
      } else if (lTime > iTime) {
        mergedWeekdayThresholds[dow] = locWT[dow] !== undefined ? locWT[dow] : null;
        if (lTime > 0) mergedWeekdayThresholdsUpdatedAt[dow] = lTime;
      } else {
        // Khi timestamp bằng nhau: nếu bản thắng có giá trị cụ thể (hoặc ưu tiên winnerStreak)
        const winVal = winnerStreak.weekdayThresholds?.[dow];
        const fbVal = fallbackStreak.weekdayThresholds?.[dow];
        mergedWeekdayThresholds[dow] = (winVal !== undefined && winVal !== null) ? winVal : (fbVal !== undefined ? fbVal : null);
        if (Math.max(lTime, iTime) > 0) {
          mergedWeekdayThresholdsUpdatedAt[dow] = Math.max(lTime, iTime);
        }
      }
    }

    // 3. Cứu trợ tuần (weeklyRelief / ngày giảm áp)
    const locRelief = (locStreak.weeklyRelief && typeof locStreak.weeklyRelief === 'object') ? locStreak.weeklyRelief : {};
    const incRelief = (incStreak.weeklyRelief && typeof incStreak.weeklyRelief === 'object') ? incStreak.weeklyRelief : {};
    const locReliefTime = Number(locRelief.updatedAt) || (locRelief.usedInWeekKey ? locStreakScore : 0);
    const incReliefTime = Number(incRelief.updatedAt) || (incRelief.usedInWeekKey ? incStreakScore : 0);

    let mergedWeeklyRelief;
    if (incReliefTime > locReliefTime) {
      mergedWeeklyRelief = { ...locRelief, ...incRelief };
    } else if (locReliefTime > incReliefTime) {
      mergedWeeklyRelief = { ...incRelief, ...locRelief };
    } else {
      // Nếu cùng timestamp, ưu tiên tuần lớn hơn hoặc có usedInWeekKey khác null
      const locKey = locRelief.usedInWeekKey || null;
      const incKey = incRelief.usedInWeekKey || null;
      const bestKey = (incKey && (!locKey || incKey > locKey)) ? incKey : locKey;
      mergedWeeklyRelief = {
        ...(incWinsStreak ? locRelief : incRelief),
        ...(incWinsStreak ? incRelief : locRelief),
        usedInWeekKey: bestKey
      };
    }

    baseSettings.streakThreshold = resolvedThreshold;
    baseSettings.streak = {
      ...(DEFAULT_DATA.settings.streak || {}),
      ...fallbackStreak,
      ...winnerStreak,
      threshold: resolvedThreshold,
      weekdayThresholds: mergedWeekdayThresholds,
      weekdayThresholdsUpdatedAt: mergedWeekdayThresholdsUpdatedAt,
      weeklyRelief: mergedWeeklyRelief,
      updatedAt: Math.max(locStreakScore, incStreakScore)
    };
  }

  // 6. Merge Goals: years, monthGoals, dailyGoals
  const localGoals = (local.goals && typeof local.goals === 'object') ? local.goals : {};
  const incomingGoals = (incoming.goals && typeof incoming.goals === 'object') ? incoming.goals : {};

  const mergedGoals = {
    ...incomingGoals,
    ...localGoals,
    years: mergeArray(localGoals.years, incomingGoals.years),
    monthGoals: mergeArray(localGoals.monthGoals, incomingGoals.monthGoals),
    dailyGoals: mergeArray(localGoals.dailyGoals, incomingGoals.dailyGoals)
  };

  // 7. Cập nhật maxSeenUpdatedAt = Math.max(local, incoming, Date.now())
  const localMaxSeen = Math.max(
    Number(local.maxSeenUpdatedAt) || 0,
    typeof maxSeenUpdatedAt !== 'undefined' ? (Number(maxSeenUpdatedAt) || 0) : 0
  );
  const incomingMaxSeen = Number(incoming.maxSeenUpdatedAt) || 0;
  const newMaxSeenUpdatedAt = Math.max(localMaxSeen, incomingMaxSeen, Date.now());

  // Đồng bộ lại bộ nhớ toàn cục & LocalStorage của máy hiện tại
  if (typeof maxSeenUpdatedAt !== 'undefined') {
    maxSeenUpdatedAt = newMaxSeenUpdatedAt;
  }
  if (typeof window !== 'undefined' && window.maxSeenUpdatedAt !== undefined) {
    window.maxSeenUpdatedAt = newMaxSeenUpdatedAt;
  }
  if (typeof globalThis !== 'undefined' && globalThis.maxSeenUpdatedAt !== undefined) {
    globalThis.maxSeenUpdatedAt = newMaxSeenUpdatedAt;
  }
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chronoflow_maxSeenUpdatedAt', String(newMaxSeenUpdatedAt));
      localStorage.setItem('maxSeenUpdatedAt', String(newMaxSeenUpdatedAt));
    }
  } catch (e) {}

  // 8. Giữ nguyên deviceId của máy hiện tại
  const currentDeviceId =
    local.deviceId ||
    (typeof deviceId !== 'undefined' ? deviceId : '') ||
    (typeof getDeviceId === 'function' ? getDeviceId() : '') ||
    (typeof localStorage !== 'undefined' ? (localStorage.getItem('chronoflow_deviceId') || localStorage.getItem('deviceId')) : '') ||
    '';

  // 9. Tạo đối tượng kết quả hợp nhất
  const mergedResult = {
    ...incoming,
    ...local,
    deviceId: currentDeviceId,
    maxSeenUpdatedAt: newMaxSeenUpdatedAt,
    schemaVersion: Math.max(Number(local.schemaVersion) || 2, Number(incoming.schemaVersion) || 2),
    settings: baseSettings,
    goals: mergedGoals,
    slotOverrides: mergeSlotOverrides(local.slotOverrides, incoming.slotOverrides),
    streakDayOverrides: mergeSlotOverrides(local.streakDayOverrides, incoming.streakDayOverrides),
    tasks: mergeArray(local.tasks, incoming.tasks),
    fixedEvents: mergeArray(local.fixedEvents, incoming.fixedEvents),
    transientEvents: mergeArray(local.transientEvents, incoming.transientEvents),
    notes: mergeArray(local.notes, incoming.notes)
  };

  // Merge changelogs (nếu có) theo id, dùng chung logic merge mảng hiện tại
  if (Array.isArray(local.changelogs) || Array.isArray(incoming.changelogs)) {
    mergedResult.changelogs = mergeArray(local.changelogs, incoming.changelogs);
  }

  // Hỗ trợ cả trường hợp noisyIntervals ở root (nếu có)
  if (Array.isArray(local.noisyIntervals) || Array.isArray(incoming.noisyIntervals)) {
    mergedResult.noisyIntervals = mergeArray(local.noisyIntervals, incoming.noisyIntervals);
  }

  // Migration bảo toàn cấu trúc & loại bỏ tàn dư dữ liệu cũ
  migrateDataRecords(mergedResult);

  return mergedResult;
}

if (typeof window !== 'undefined') {
  window.mergeCollections = mergeCollections;
}
if (typeof globalThis !== 'undefined') {
  globalThis.mergeCollections = mergeCollections;
}

// 2. Import Data with 5s Confirmation & 2 Modes (Merge vs Overwrite)
function handleFileSelectForImport(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const data = JSON.parse(e.target.result);
      if (data && data.settings && (data.tasks || Array.isArray(data.tasks))) {
        const filename = file.name;
        event.target.value = '';
        const isEn = appState.settings && appState.settings.lang === 'en';

        const importOptionsHtml = `
          <div style="display:flex; flex-direction:column; gap:10px; margin:4px 0;">
            <div style="font-size:12px; font-weight:700; color:var(--text-main); text-transform:uppercase; letter-spacing:0.5px;">
              ${isEn ? 'Select Restore Mode:' : 'Chọn chế độ khôi phục:'}
            </div>

            <!-- Lựa chọn 1: Merge thông minh (Mặc định & Khuyến nghị) -->
            <label id="label-import-merge" style="display:flex; align-items:flex-start; gap:10px; padding:11px 13px; border:2px solid var(--primary); border-radius:8px; background:var(--primary-light); cursor:pointer; transition:all 0.15s ease;">
              <input type="radio" name="import-mode" value="merge" checked onchange="window._onImportModeChange(this)" style="margin-top:3px; accent-color:var(--primary); cursor:pointer;">
              <div style="display:flex; flex-direction:column; gap:3px;">
                <div style="display:flex; align-items:center; gap:6px; flex-wrap:wrap;">
                  <strong style="color:var(--text-main); font-size:13px;">${isEn ? 'Smart Merge (keep newer records by updatedAt)' : 'Merge thông minh (giữ bản ghi mới hơn theo updatedAt)'}</strong>
                  <span style="font-size:10px; font-weight:700; background:var(--primary); color:#ffffff; padding:2px 7px; border-radius:9999px;">${isEn ? 'Recommended' : 'Khuyến nghị'}</span>
                </div>
                <span style="font-size:12px; color:var(--text-muted); line-height:1.45;">
                  ${isEn ? 'Combines workspace data based on Last-Writer-Wins and respects soft-deletes. Preserves recent modifications made on this device.' : 'Hợp nhất dữ liệu thông minh theo Last-Writer-Wins và Soft-delete. Giữ lại bản ghi mới hơn theo updatedAt và không làm mất dữ liệu trên máy hiện tại.'}
                </span>
              </div>
            </label>

            <!-- Lựa chọn 2: Ghi đè toàn bộ dữ liệu hiện tại (Hành vi cũ) -->
            <label id="label-import-overwrite" style="display:flex; align-items:flex-start; gap:10px; padding:11px 13px; border:1px solid var(--border-color); border-radius:8px; background:var(--bg-surface); cursor:pointer; transition:all 0.15s ease;">
              <input type="radio" name="import-mode" value="overwrite" onchange="window._onImportModeChange(this)" style="margin-top:3px; accent-color:var(--primary); cursor:pointer;">
              <div style="display:flex; flex-direction:column; gap:3px;">
                <strong style="color:var(--text-main); font-size:13px;">${isEn ? 'Overwrite all current workspace data' : 'Ghi đè toàn bộ dữ liệu hiện tại'}</strong>
                <span style="font-size:12px; color:var(--text-muted); line-height:1.45;">
                  ${isEn ? 'Completely replaces all current tasks, events, and notes with the backup file content (legacy behavior).' : 'Xóa và thay thế hoàn toàn toàn bộ công việc, sự kiện và ghi chú bằng nội dung trong file sao lưu (hành vi cũ).'}
                </span>
              </div>
            </label>
          </div>
        `;

        let importMode = 'merge';
        window._onImportModeChange = function(radio) {
          if (radio && radio.value) {
            importMode = radio.value;
          }
          const mergeLabel = document.getElementById('label-import-merge');
          const overwriteLabel = document.getElementById('label-import-overwrite');
          if (radio && radio.value === 'merge') {
            if (mergeLabel) {
              mergeLabel.style.border = '2px solid var(--primary)';
              mergeLabel.style.background = 'var(--primary-light)';
            }
            if (overwriteLabel) {
              overwriteLabel.style.border = '1px solid var(--border-color)';
              overwriteLabel.style.background = 'var(--bg-surface)';
            }
          } else {
            if (mergeLabel) {
              mergeLabel.style.border = '1px solid var(--border-color)';
              mergeLabel.style.background = 'var(--bg-surface)';
            }
            if (overwriteLabel) {
              overwriteLabel.style.border = '2px solid #ef4444';
              overwriteLabel.style.background = 'rgba(239, 68, 68, 0.08)';
            }
          }
        };

        openCountdownConfirmModal({
          title: t('confirmImportTitle'),
          desc: t('confirmImportDesc', { filename }),
          extraHtml: importOptionsHtml,
          alertHtml: t('confirmImportAlert'),
          confirmLabel: t('confirmImportBtn'),
          confirmClass: 'btn-primary',
          onConfirm: () => {
            executeImportData(data, importMode);
          }
        });
      } else {
        showToast('File JSON không hợp lệ hoặc thiếu cấu trúc!');
      }
    } catch (err) {
      showToast('Lỗi khi đọc file sao lưu JSON!');
    }
  };
  reader.readAsText(file);
}

function executeImportData(data, mode = 'overwrite') {
  if (!data) return;
  if (!Array.isArray(data.tasks)) data.tasks = [];
  if (!Array.isArray(data.fixedEvents)) data.fixedEvents = [];
  if (!Array.isArray(data.transientEvents)) data.transientEvents = [];
  if (!Array.isArray(data.notes)) data.notes = [];
  if (!data.slotOverrides || typeof data.slotOverrides !== 'object') data.slotOverrides = {};
  if (!data.streakDayOverrides || typeof data.streakDayOverrides !== 'object') data.streakDayOverrides = {};
  if (!data.goals || typeof data.goals !== 'object') {
    data.goals = { years: [], monthGoals: [], dailyGoals: [] };
  }
  if (!Array.isArray(data.goals.years)) data.goals.years = [];
  if (!Array.isArray(data.goals.monthGoals)) data.goals.monthGoals = [];
  if (!Array.isArray(data.goals.dailyGoals)) data.goals.dailyGoals = [];

  if (!data.settings || typeof data.settings !== 'object') {
    data.settings = JSON.parse(JSON.stringify(DEFAULT_DATA.settings));
  }
  if (!Array.isArray(data.settings.noisyIntervals)) data.settings.noisyIntervals = [];

  // Migration file data & appState trước khi import hoặc merge
  migrateDataRecords(data);
  migrateDataRecords(appState);

  const isEn = appState.settings && appState.settings.lang === 'en';

  if (mode === 'merge') {
    // Chế độ 1: Merge thông minh
    const currentData = appState;
    const merged = mergeCollections(currentData, data);
    appState = merged;
    if (typeof window !== 'undefined') window.appState = appState;
    saveData(appState);
    if (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.notifyChange === 'function') {
      window.StreakEngine.notifyChange();
    }
    renderApp();
    showToast(isEn ? 'Smart merge completed successfully!' : 'Đã merge thông minh và cập nhật dữ liệu thành công!');
  } else {
    // Chế độ 2: Ghi đè toàn bộ (hành vi cũ)
    const d = JSON.parse(JSON.stringify(data));
    appState = d;
    if (typeof window !== 'undefined') window.appState = appState;
    saveData(appState);
    if (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.notifyChange === 'function') {
      window.StreakEngine.notifyChange();
    }
    renderApp();
    showToast(t('toastDataRestored'));
  }
}

function importDataFromFile(event) {
  handleFileSelectForImport(event);
}

// 3. Reset to Blank Slate (Wipe All Data) with 5s Confirmation & Backup Suggestion
function executeResetToBlankData() {
  appState.tasks = [];
  appState.fixedEvents = [];
  appState.transientEvents = [];
  appState.notes = [];
  appState.slotOverrides = {};
  appState.goals = {
    years: [],
    monthGoals: [],
    dailyGoals: []
  };
  if (!appState.settings || typeof appState.settings !== 'object') {
    appState.settings = JSON.parse(JSON.stringify(DEFAULT_DATA.settings));
  } else {
    appState.settings.noisyIntervals = [];
  }
  saveData(appState);
  renderApp();
  showToast(t('toastResetCleanSuccess'));
}

function confirmResetToDefaultData() {
  const isEn = appState.settings.lang === 'en';
  const alertHtml = `
    <div style="font-weight:700; color:#b91c1c; margin-bottom:4px;">
      ${t('confirmResetWarningTitle')}
    </div>
    <div style="margin-bottom:8px; line-height:1.45;">
      ${t('confirmResetWarningDesc')}
    </div>
    <div style="display:flex; align-items:center; gap:8px; margin-top:6px;">
      <button type="button" class="btn-secondary" onclick="executeExportData()" style="font-size:11px; padding:4px 10px; font-weight:700; background:#ffffff; color:#1e40af; border-color:#93c5fd; display:inline-flex; align-items:center; gap:4px; cursor:pointer;">
        ${isEn ? 'Download Backup File Now First' : 'Tải File Sao Lưu Ngay Bây Giờ'}
      </button>
    </div>
  `;

  openCountdownConfirmModal({
    title: t('confirmResetTitle'),
    desc: t('confirmResetDesc'),
    alertHtml,
    confirmLabel: t('confirmResetBtn'),
    confirmClass: 'btn-secondary',
    onConfirm: () => executeResetToBlankData()
  });
}

function resetToDefaultData() {
  confirmResetToDefaultData();
}

function getBlurLabel(px, isEn = false) {
  const n = Number(px);
  if (n <= 2) return isEn ? 'Light' : 'Nhẹ';
  if (n <= 4) return isEn ? 'Medium' : 'Vừa';
  if (n <= 6) return isEn ? 'Strong' : 'Mạnh';
  if (n <= 8) return isEn ? 'Intense' : 'Rất mạnh';
  return isEn ? 'Maximum' : 'Tối đa';
}

function updateFocusBlurLevel(value) {
  const px = Math.max(1, Math.min(10, parseInt(value, 10) || 6));
  appState.settings.focusBlurPx = px;
  document.documentElement.style.setProperty('--focus-blur-px', `${px}px`);
  saveData();

  const numEl = document.getElementById('focus-blur-numeric');
  if (numEl) numEl.textContent = `${px}px`;

  const slider = document.getElementById('focus-blur-slider');
  if (slider && Number(slider.value) !== px) slider.value = px;

  const isEn = appState.settings.lang === 'en';
  const badgeEl = document.getElementById('focus-blur-val-badge');
  if (badgeEl) badgeEl.textContent = `${px}px (${getBlurLabel(px, isEn)})`;

  const previewCard = document.getElementById('focus-preview-dimmed-card');
  if (previewCard) {
    previewCard.style.filter = `blur(${px}px) grayscale(60%)`;
  }

  if (currentView === 'day') {
    const dimmedBlocks = document.querySelectorAll('.time-block.time-block-dimmed');
    dimmedBlocks.forEach(el => {
      el.style.filter = `blur(${px}px) grayscale(60%)`;
    });
  }
}

window.getBlurLabel = getBlurLabel;
window.updateFocusBlurLevel = updateFocusBlurLevel;

// ==========================================
// CÀI ĐẶT CỠ CHỮ TOÀN HỆ THỐNG (SYSTEM FONT SIZE SCALING)
// ==========================================
function getFontSizeLabel(percent, isEn = false) {
  const p = Number(percent) || 100;
  if (p <= 85) return isEn ? 'Compact (Small)' : 'Nhỏ (Gọn)';
  if (p <= 100) return isEn ? 'Standard (Default)' : 'Tiêu chuẩn (Mặc định)';
  if (p <= 115) return isEn ? 'Comfortable (Large)' : 'Lớn (Dễ đọc)';
  return isEn ? 'Large (Accessibility)' : 'Rất lớn (Trợ năng)';
}

function applySystemFontSize(percent) {
  const pct = Math.max(80, Math.min(130, parseInt(percent, 10) || 100));
  const scale = (pct / 100).toFixed(3);
  
  if (typeof document !== 'undefined' && document.documentElement) {
    document.documentElement.style.setProperty('--font-scale', scale);
    document.documentElement.style.setProperty('--font-size-percent', `${pct}%`);
    
    let level = 'medium';
    if (pct <= 85) level = 'small';
    else if (pct <= 100) level = 'medium';
    else if (pct <= 115) level = 'large';
    else level = 'xlarge';
    
    document.documentElement.setAttribute('data-font-size', level);
    document.documentElement.setAttribute('data-font-scale', String(pct));
  }
  return { percent: pct, scale: parseFloat(scale) };
}

function previewSystemFontSize(value) {
  const pct = Math.max(80, Math.min(130, parseInt(value, 10) || 100));
  applySystemFontSize(pct);
  
  const numEl = document.getElementById('font-size-numeric');
  if (numEl) numEl.textContent = `${pct}%`;
  
  const isEn = appState.settings.lang === 'en';
  const badgeEl = document.getElementById('font-size-val-badge');
  if (badgeEl) badgeEl.textContent = `${pct}% (${getFontSizeLabel(pct, isEn)})`;
  
  const slider = document.getElementById('font-size-range-slider');
  if (slider && Number(slider.value) !== pct) slider.value = pct;

  // Update active state on preset chips
  const chips = document.querySelectorAll('#settings-card-font-size .preset-chip');
  chips.forEach(chip => {
    const chipVal = parseInt(chip.textContent, 10);
    chip.classList.toggle('active', chipVal === pct);
  });
}

function updateSystemFontSize(value) {
  const pct = Math.max(80, Math.min(130, parseInt(value, 10) || 100));
  appState.settings.fontSizePercent = pct;
  applySystemFontSize(pct);
  saveData();
  
  const numEl = document.getElementById('font-size-numeric');
  if (numEl) numEl.textContent = `${pct}%`;
  
  const slider = document.getElementById('font-size-range-slider');
  if (slider && Number(slider.value) !== pct) slider.value = pct;
  
  const isEn = appState.settings.lang === 'en';
  const badgeEl = document.getElementById('font-size-val-badge');
  if (badgeEl) badgeEl.textContent = `${pct}% (${getFontSizeLabel(pct, isEn)})`;
  
  // Update active state on preset chips
  const chips = document.querySelectorAll('#settings-card-font-size .preset-chip');
  chips.forEach(chip => {
    const chipVal = parseInt(chip.textContent, 10);
    chip.classList.toggle('active', chipVal === pct);
  });
  
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('chronoflow-font-size-changed', {
      detail: { percent: pct, scale: pct / 100 }
    }));
  }
}

window.getFontSizeLabel = getFontSizeLabel;
window.applySystemFontSize = applySystemFontSize;
window.previewSystemFontSize = previewSystemFontSize;
window.updateSystemFontSize = updateSystemFontSize;

function syncFocusDimmingUI() {
  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
  const isDimmed = !!(appState && appState.settings && appState.settings.focusDimming);
  
  // 1. Cập nhật checkbox trong Modal Cài đặt
  const chk = document.getElementById('focus-dimming-checkbox');
  if (chk && chk.checked !== isDimmed) {
    chk.checked = isDimmed;
  }
  
  // 2. Cập nhật huy hiệu trạng thái trong Modal Cài đặt
  const pill = document.getElementById('focus-dimming-status-pill');
  if (pill) {
    pill.style.background = isDimmed ? 'var(--pill-focus-long-bg)' : 'var(--bg-subtle)';
    pill.style.color = isDimmed ? 'var(--pill-focus-long-text)' : 'var(--text-muted)';
    pill.textContent = isDimmed ? t('focusDimmingOn') : t('focusDimmingOff');
  }

  // 3. Cập nhật nút bấm tại thanh công cụ Timeline dưới cùng
  const timelineBtn = document.getElementById('timeline-focus-dimming-btn');
  if (timelineBtn) {
    timelineBtn.classList.toggle('btn-focus-active', isDimmed);
    timelineBtn.innerHTML = `${t('focusDimmingBtn')}: <strong>${isDimmed ? t('focusDimmingOn') : t('focusDimmingOff')}</strong>`;
  }
}

function toggleFocusDimming(forcedValue = null) {
  if (typeof forcedValue === 'boolean') {
    appState.settings.focusDimming = forcedValue;
  } else {
    appState.settings.focusDimming = !appState.settings.focusDimming;
  }
  saveData();
  renderApp();
  syncFocusDimmingUI();
  showToast(appState.settings.focusDimming ? t('toastFocusDimmingEnabled') : t('toastFocusDimmingDisabled'));
}

window.syncFocusDimmingUI = syncFocusDimmingUI;
window.toggleFocusDimming = toggleFocusDimming;

let lastDayIndicatorDate = getTodayDateString();
let lastFocusDimmingActiveKey = null;
let lastFocusDimmingUpcomingKey = null;

/**
 * Hàm nhẹ cập nhật duy nhất vạch đỏ thời gian thực mà KHÔNG vẽ lại toàn bộ DOM hoặc render lại trang.
 * Tuyệt đối không gọi renderApp() hay renderTimeline() trong bộ đếm thời gian thông thường.
 */
function updateTimeIndicatorOnly() {
  const todayStr = getTodayDateString();
  // 1. Chỉ render lại khi thực sự bước sang ngày mới (00:00)
  if (lastDayIndicatorDate !== todayStr) {
    lastDayIndicatorDate = todayStr;
    renderApp();
    return;
  }

  // 2. Cập nhật trực tiếp vị trí vạch đỏ và text thời gian nếu có trên màn hình
  const indicator = document.getElementById('timeline-live-indicator');
  const now = new Date();
  const curM = (now.getHours() * 60) + now.getMinutes();
  const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  if (indicator) {
    const PX_PER_MIN = 64 / 60;
    const top = Math.round(curM * PX_PER_MIN);
    indicator.style.top = `${top}px`;
    indicator.setAttribute('title', `${t('currentTime')}: ${timeStr}`);
    const tag = indicator.querySelector('.current-time-tag');
    if (tag && tag.textContent !== timeStr) {
      tag.textContent = timeStr;
    }
  }

  // 3. Nếu bật Focus Dimming: chỉ cập nhật khi trạng thái sự kiện "Đang diễn ra / Kế tiếp" thực sự thay đổi
  if (appState?.settings?.focusDimming && currentView === 'day') {
    const { busyIntervals } = calculateFreeTimeSlots(todayStr);
    let activeKey = null;
    let upcomingKey = null;
    let minUpcomingDiff = Infinity;

    busyIntervals.forEach(b => {
      const key = `${b.type}-${b.taskId || b.id}-${b.start}-${b.end}`;
      if (b.start <= curM && curM < b.end) {
        activeKey = key;
      } else if (b.start >= curM) {
        const diff = b.start - curM;
        if (diff < minUpcomingDiff) {
          minUpcomingDiff = diff;
          upcomingKey = key;
        }
      }
    });

    if (activeKey !== lastFocusDimmingActiveKey || upcomingKey !== lastFocusDimmingUpcomingKey) {
      lastFocusDimmingActiveKey = activeKey;
      lastFocusDimmingUpcomingKey = upcomingKey;
      // Chỉ cập nhật khi chuyển giao mốc sự kiện, dùng saveAndRestoreScroll để đứng im tuyệt đối
      shouldScrollToNow = false;
      renderApp();
    }
  }
}

window.updateTimeIndicatorOnly = updateTimeIndicatorOnly;

let notifiedEventsMap = {}; // { 'id-start-YYYY-MM-DD': true, 'id-end-YYYY-MM-DD': true }
let lastNotifiedDateStr = '';

function isNotificationEnabledForType(type) {
  if (!appState || !appState.settings) return false;
  if (appState.settings.notificationsEnabled === false) return false;
  if (type === 'fixed') return appState.settings.notifyFixed !== false;
  if (type === 'transient') return appState.settings.notifyTransient !== false;
  if (type === 'task') return appState.settings.notifyEisenhower !== false;
  return true;
}

function checkAndTriggerNotifications() {
  if (!appState || !appState.settings || appState.settings.notificationsEnabled === false) return;
  
  const now = new Date();
  const currentMins = now.getHours() * 60 + now.getMinutes();
  const dateStr = toLocalDateKey(now);

  // Khởi tạo lại bảng theo dõi khi chuyển sang ngày mới
  if (dateStr !== lastNotifiedDateStr) {
    lastNotifiedDateStr = dateStr;
    notifiedEventsMap = {};
  }

  const startNoticeMins = Number(appState.settings.startNoticeMinutes) || 5;
  const endNoticeMins = Number(appState.settings.endNoticeMinutes) || 5;

  const allEvents = [];

  // 1. Fixed Events (Sự kiện cố định)
  if (Array.isArray(appState.fixedEvents)) {
    appState.fixedEvents.forEach(fe => {
      if (isItemActiveOnDate(fe, dateStr) && fe.start && fe.end) {
        allEvents.push({
          id: fe.id || ('fe-' + fe.start),
          title: fe.title,
          start: fe.start,
          end: fe.end,
          type: 'fixed',
          description: fe.description || fe.notes || '',
          notes: fe.notes || '',
          category: fe.category || ''
        });
      }
    });
  }

  // 2. Transient Events (Sự kiện đột xuất / bất ngờ)
  if (Array.isArray(appState.transientEvents)) {
    appState.transientEvents.forEach(te => {
      if (isItemActiveOnDate(te, dateStr) && te.start && te.end) {
        allEvents.push({
          id: te.id || ('te-' + te.start),
          title: te.title,
          start: te.start,
          end: te.end,
          type: 'transient',
          description: te.description || te.notes || '',
          notes: te.notes || '',
          category: te.category || ''
        });
      }
    });
  }

  // 3. Eisenhower Tasks (Công việc từ ma trận)
  if (Array.isArray(appState.tasks)) {
    appState.tasks.forEach(t => {
      if (isItemActiveOnDate(t, dateStr) && !isTaskDoneOnDate(t, dateStr)) {
        const slot = getTaskAssignedSlot(t, dateStr);
        if (slot && slot.start && slot.end) {
          allEvents.push({
            id: t.id,
            title: t.title,
            start: slot.start,
            end: slot.end,
            type: 'task',
            description: t.description || t.notes || '',
            notes: t.notes || '',
            quadrant: t.quadrant || '',
            category: t.category || ''
          });
        }
      }
    });
  }

  // Sắp xếp sự kiện theo thời gian bắt đầu
  allEvents.sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));

  allEvents.forEach((ev, idx) => {
    // Chỉ kích hoạt thông báo nếu nhóm sự kiện này được người dùng bật trong cài đặt
    if (!isNotificationEnabledForType(ev.type)) return;

    const startMins = timeToMinutes(ev.start);
    const endMins = timeToMinutes(ev.end);

    const targetStartCheck = startMins - startNoticeMins;
    const targetEndCheck = endMins - endNoticeMins;

    const startKey = `${ev.id}-start-${dateStr}`;
    const endKey = `${ev.id}-end-${dateStr}`;

    // Kiểm tra thông báo bắt đầu
    if (currentMins >= targetStartCheck && currentMins < targetStartCheck + 2 && !notifiedEventsMap[startKey]) {
      notifiedEventsMap[startKey] = true;
      triggerStartNotification(ev, startNoticeMins);
    }

    // Kiểm tra thông báo kết thúc
    if (currentMins >= targetEndCheck && currentMins < targetEndCheck + 2 && !notifiedEventsMap[endKey]) {
      notifiedEventsMap[endKey] = true;
      const nextItems = allEvents.slice(idx + 1);
      formatAndTriggerEndNotification({ ...ev, noticeMins: endNoticeMins }, nextItems);
    }
  });
}

function triggerStartNotification(ev, noticeMins) {
  const isEn = appState.settings?.lang === 'en';
  const eventTitle = ev.title || (isEn ? 'Event' : 'Sự kiện');
  const startTime = ev.start || '';
  const details = ev.description || ev.notes || (ev.quadrant ? (isEn ? `Matrix: ${ev.quadrant}` : `Ma trận: ${ev.quadrant}`) : '') || '';

  const notifTitle = `${eventTitle} (${startTime})`;
  const notifBody = `${eventTitle} (${startTime} - ${isEn ? `starts in ${noticeMins}m` : `bắt đầu sau ${noticeMins} phút`})` + 
    (details ? `\n${isEn ? 'Event details' : 'Nội dung sự kiện'}: ${details}` : '');

  const payload = {
    type: 'start',
    eventTitle: eventTitle,
    startTime: startTime,
    noticeMins: noticeMins,
    details: details
  };

  sendBrowserNotification(notifTitle, notifBody, {}, payload);
}

/**
 * Kiểm tra xem một khoảng thời gian có trùng với khoảng thời gian ồn ào (noisy intervals) hay không
 */
function isSlotNoisy(startStr, endStr) {
  if (!appState || !appState.settings || !Array.isArray(appState.settings.noisyIntervals)) return false;
  const sMins = timeToMinutes(startStr);
  const eMins = timeToMinutes(endStr);
  return appState.settings.noisyIntervals.some(n => {
    if (!n || n.deleted || !n.start || !n.end) return false;
    const ns = timeToMinutes(n.start);
    const ne = timeToMinutes(n.end);
    return Math.max(sMins, ns) < Math.min(eMins, ne);
  });
}
window.isSlotNoisy = isSlotNoisy;

/**
 * Định dạng & Hiển thị Thông báo khi sự kiện kết thúc
 * Xử lý 2 trường hợp:
 * - Trường hợp 1: Khoảng thời gian trống giữa các sự kiện
 *     + Dòng 1: tên sự kiện - thời gian kết thúc
 *     + Các sự kiện tiếp theo:
 *         • thời gian rảnh (ồn ào, không ồn,...): mốc thời gian
 *         • tên sự kiện tiếp: mốc thời gian
 * - Trường hợp 2: Các sự kiện liền nhau (liền kề)
 *     + Dòng 1: tên sự kiện - thời gian kết thúc
 *     + Các sự kiện tiếp theo:
 *         • tên sự kiện (mốc thời gian)
 *         • một vài nội dung chính của sự kiện kế tiếp này
 */
function formatAndTriggerEndNotification(currentEvent, nextItems) {
  if (!currentEvent) return;
  const isEn = appState.settings?.lang === 'en';
  const noticeMins = Number(currentEvent.noticeMins || appState.settings?.endNoticeMinutes) || 5;
  const currentEndMins = timeToMinutes(currentEvent.end);
  const currentTitle = currentEvent.title || (isEn ? 'Event' : 'Sự kiện');
  const currentEnd = currentEvent.end || '';

  let nextEvent = null;
  if (Array.isArray(nextItems)) {
    nextEvent = nextItems.find(item => timeToMinutes(item.start) >= currentEndMins) || null;
  } else if (nextItems && typeof nextItems === 'object') {
    nextEvent = nextItems;
  }

  // Dòng 1: tên sự kiện - thời gian kết thúc
  const line1 = `${currentTitle} - ${currentEnd} (${isEn ? `ends in ${noticeMins}m` : `kết thúc sau ${noticeMins} phút`})`;
  const textLines = [line1, ''];

  const payload = {
    type: 'end',
    eventTitle: currentTitle,
    endTime: currentEnd,
    noticeMins: noticeMins
  };

  if (!nextEvent) {
    // Không còn sự kiện nào trong ngày -> khoảng rảnh tự do đến 24:00
    const gapTime = `${currentEvent.end} - 24:00`;
    const noisy = isSlotNoisy(currentEvent.end, '24:00');
    const noisyLabel = noisy 
      ? (isEn ? 'noisy' : 'ồn ào') 
      : (isEn ? 'quiet' : 'không ồn');
    
    textLines.push(isEn ? 'Next Events:' : 'Các sự kiện tiếp theo:');
    textLines.push(`• ${isEn ? 'Free time' : 'Thời gian rảnh'} (${noisyLabel}): ${gapTime}`);

    payload.hasGap = true;
    payload.freeTimeLabel = `${isEn ? 'Free time' : 'Thời gian rảnh'} (${noisyLabel})`;
    payload.freeTimeRange = gapTime;
    payload.nextEventTitle = isEn ? 'Free for remainder of day' : 'Tự do đến hết ngày';
    payload.nextEventRange = gapTime;
  } else {
    const nextStartMins = timeToMinutes(nextEvent.start);

    if (nextStartMins > currentEndMins) {
      // Trường hợp 1: Khoảng thời gian trống giữa các sự kiện
      const gapStart = currentEvent.end;
      const gapEnd = nextEvent.start;
      const noisy = isSlotNoisy(gapStart, gapEnd);
      const noisyLabel = noisy 
        ? (isEn ? 'noisy' : 'ồn ào') 
        : (isEn ? 'quiet' : 'không ồn');

      textLines.push(isEn ? 'Next Events:' : 'Các sự kiện tiếp theo:');
      textLines.push(`• ${isEn ? 'Free time' : 'Thời gian rảnh'} (${noisyLabel}): ${gapStart} - ${gapEnd}`);
      textLines.push(`• ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}`);

      payload.hasGap = true;
      payload.freeTimeLabel = `${isEn ? 'Free time' : 'Thời gian rảnh'} (${noisyLabel})`;
      payload.freeTimeRange = `${gapStart} - ${gapEnd}`;
      payload.nextEventTitle = nextEvent.title;
      payload.nextEventRange = `${nextEvent.start} - ${nextEvent.end}`;
    } else {
      // Trường hợp 2: Các sự kiện liền nhau (liền kề, không có khoảng trống)
      const nextDetails = nextEvent.description || nextEvent.notes || (nextEvent.quadrant ? (isEn ? `Matrix: ${nextEvent.quadrant}` : `Ma trận: ${nextEvent.quadrant}`) : '') || '';

      textLines.push(isEn ? 'Next Events:' : 'Các sự kiện tiếp theo:');
      textLines.push(`• ${nextEvent.title}: ${nextEvent.start} - ${nextEvent.end}`);
      if (nextDetails) {
        textLines.push(`  ${isEn ? 'Details' : 'Nội dung'}: ${nextDetails}`);
      }

      payload.isAdjacent = true;
      payload.nextEventTitle = nextEvent.title;
      payload.nextEventRange = `${nextEvent.start} - ${nextEvent.end}`;
      payload.nextEventDetails = nextDetails;
    }
  }

  const notifTitle = `${currentTitle} - ${currentEnd}`;
  const notifBody = textLines.join('\n');

  sendBrowserNotification(notifTitle, notifBody, {}, payload);
}
window.formatAndTriggerEndNotification = formatAndTriggerEndNotification;

// Tương thích ngược
function triggerEndNotification(ev, noticeMins, allEvents, currentIndex, dateStr) {
  const nextItems = allEvents.slice(currentIndex + 1);
  formatAndTriggerEndNotification({ ...ev, noticeMins }, nextItems);
}
window.triggerEndNotification = triggerEndNotification;

window.checkAndTriggerNotifications = checkAndTriggerNotifications;

// Bộ đếm thời gian thực siêu nhẹ cho vạch kẻ Timeline: cập nhật vị trí vạch đỏ mượt mà, đứng yên DOM
setInterval(updateTimeIndicatorOnly, 15000);
// Bộ kiểm tra và kích hoạt thông báo sự kiện nền mỗi 30 giây
setInterval(checkAndTriggerNotifications, 30000);

// Khởi chạy ứng dụng khi DOM tải xong
document.addEventListener('DOMContentLoaded', () => {
  applyInitialSidebarState();
  renderApp();
  ensureMobileQuickActionsFab();
  initMobileTouchGestures();
  window.addEventListener('resize', updateMobileQuickFabPosition);
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', updateMobileQuickFabPosition);
    window.visualViewport.addEventListener('scroll', updateMobileQuickFabPosition);
  }
  if (typeof autoSyncGDriveOnOpen === 'function') {
    autoSyncGDriveOnOpen();
  }
  if (typeof setupGDrivePolling === 'function') {
    setupGDrivePolling();
  }
});

/**
 * 1. getTaskQuadrant(task) → 'q1'|'q2'|'q3'|'q4' theo isImportant/isUrgent.
 */
function getTaskQuadrant(task) {
  if (!task) return 'q4';
  const imp = Boolean(task.isImportant);
  const urg = Boolean(task.isUrgent);
  if (imp && urg) return 'q1';
  if (imp && !urg) return 'q2';
  if (!imp && urg) return 'q3';
  return 'q4';
}
window.getTaskQuadrant = getTaskQuadrant;

/**
 * 2. dateInSyncScope(dateKey, scope, anchorDate):
 *    day / week / month / all như thiết kế (anchor = selectedDate hoặc hôm nay).
 */
function dateInSyncScope(dateKey, scope, anchorDate) {
  if (!dateKey) return false;
  const s = String(scope || 'day').toLowerCase();
  if (s === 'all') return true;
  const anchor = anchorDate || (typeof selectedDate !== 'undefined' ? selectedDate : null) || (typeof getTodayDateString === 'function' ? getTodayDateString() : '2026-10-21');

  if (s === 'day') {
    return dateKey === anchor;
  }
  if (s === 'month') {
    return dateKey.substring(0, 7) === anchor.substring(0, 7);
  }
  if (s === 'week') {
    const parts = anchor.split('-').map(Number);
    if (parts.length < 3) return dateKey === anchor;
    const [y, m, d] = parts;
    const dateObj = new Date(y, m - 1, d);
    const dayOfWeek = dateObj.getDay(); // 0: Sun, 1: Mon...
    const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    const monday = new Date(y, m - 1, d + diffToMonday);
    const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6);
    const startStr = typeof formatDateToYMD === 'function' ? formatDateToYMD(monday) : monday.toISOString().split('T')[0];
    const endStr = typeof formatDateToYMD === 'function' ? formatDateToYMD(sunday) : sunday.toISOString().split('T')[0];
    return dateKey >= startStr && dateKey <= endStr;
  }
  return dateKey === anchor;
}
window.dateInSyncScope = dateInSyncScope;

/**
 * 3. shouldPushScheduledTask(task, dateKey):
 *    - tasksScheduled bật
 *    - syncScheduledQuadrants[quadrant] bật
 *    - dateInSyncScope(dateKey, syncTimeScope, anchor) true
 */
function shouldPushScheduledTask(task, dateKey) {
  if (!task || !dateKey) return false;
  const gcalSettings = (appState && appState.settings && appState.settings.gcal) ? appState.settings.gcal : {};
  const syncTypes = gcalSettings.syncTypes || {};

  // - tasksScheduled bật
  if (syncTypes.tasksScheduled === false) return false;

  // - syncScheduledQuadrants[quadrant] bật
  const quadrant = getTaskQuadrant(task);
  const scheduledQuads = gcalSettings.syncScheduledQuadrants || { q1: true, q2: true, q3: false, q4: false };
  if (scheduledQuads[quadrant] === false) return false;

  // - dateInSyncScope(dateKey, syncTimeScope, anchor) true
  const syncScope = gcalSettings.syncTimeScope || 'day';
  const anchor = gcalSettings.syncAnchorDate || (typeof selectedDate !== 'undefined' ? selectedDate : null);
  if (!dateInSyncScope(dateKey, syncScope, anchor)) return false;

  return true;
}
window.shouldPushScheduledTask = shouldPushScheduledTask;

// ==========================================================
// 11. GOOGLE CALENDAR TWO-WAY SYNCHRONIZATION ENGINE
// ==========================================================

const GCAL_EVENT_COLORS = [
  { id: '1', name: 'Lavender', vi: 'Oải hương (Lavender)', hex: '#7986cb' },
  { id: '2', name: 'Sage', vi: 'Xanh xô thơm (Sage)', hex: '#33b679' },
  { id: '3', name: 'Grape', vi: 'Tím nho (Grape)', hex: '#8e24aa' },
  { id: '4', name: 'Flamingo', vi: 'Hồng flamingo', hex: '#e67c73' },
  { id: '5', name: 'Banana', vi: 'Vàng chuối (Banana)', hex: '#f6bf26' },
  { id: '6', name: 'Tangerine', vi: 'Cam quýt (Tangerine)', hex: '#f4511e' },
  { id: '7', name: 'Peacock', vi: 'Xanh lam công (Peacock)', hex: '#039be5' },
  { id: '8', name: 'Graphite', vi: 'Xám than chì (Graphite)', hex: '#616161' },
  { id: '9', name: 'Blueberry', vi: 'Xanh blueberry', hex: '#3f51b5' },
  { id: '10', name: 'Basil', vi: 'Xanh lục basil', hex: '#0b8043' },
  { id: '11', name: 'Tomato', vi: 'Đỏ tomato', hex: '#d50000' }
];

const DEFAULT_GCAL_COLOR_MAPPING = {
  mode: 'focus',      // 'focus' | 'eisenhower'
  focusLong: '10',    // Basil (#0b8043)
  focusShort: '9',    // Blueberry (#3f51b5)
  distractLong: '5',  // Banana (#f6bf26)
  distractShort: '6', // Tangerine (#f4511e)
  eisenhowerQ1: '11', // Q1: Khẩn cấp & Quan trọng -> Tomato (#d50000)
  eisenhowerQ2: '10', // Q2: Quan trọng, không khẩn -> Basil (#0b8043)
  eisenhowerQ3: '5',  // Q3: Khẩn cấp, không quan trọng -> Banana (#f6bf26)
  eisenhowerQ4: '8',  // Q4: Không khẩn, không quan trọng -> Graphite (#616161)
  transient: '11',    // Tomato (#d50000)
  fixed: '8'          // Graphite (#616161)
};

function getGCalColorObj(colorId) {
  const found = GCAL_EVENT_COLORS.find(c => String(c.id) === String(colorId));
  return found || { id: String(colorId || '1'), name: 'Color ' + colorId, vi: 'Màu ' + colorId, hex: '#039be5' };
}

function refreshGCalColorMappingUI() {
  expandedSettingsCards.add('gcal-card-colors');
  const colorCard = document.getElementById('gcal-card-colors');
  if (colorCard) {
    colorCard.classList.remove('is-collapsed');
    colorCard.classList.add('is-expanded');
    const body = colorCard.querySelector('.settings-card-body');
    const threshold = Number(appState.settings?.focusThresholdMinutes) || 30;
    if (body) {
      body.innerHTML = renderGCalColorMappingSection(threshold);
      return;
    }
  }
  const gcalMount = document.getElementById('settings-gcal-mount-point');
  if (gcalMount) gcalMount.innerHTML = renderSettingsAccountSyncHtml();
}
window.refreshGCalColorMappingUI = refreshGCalColorMappingUI;

function setGCalColorMappingMode(mode) {
  if (!appState.settings.gcal) appState.settings.gcal = {};
  if (!appState.settings.gcal.colorMapping) {
    appState.settings.gcal.colorMapping = { ...DEFAULT_GCAL_COLOR_MAPPING };
  }
  appState.settings.gcal.colorMapping.mode = mode;
  saveData();
  renderApp();
  refreshGCalColorMappingUI();
  
  const isEn = appState.settings.lang === 'en';
  if (mode === 'eisenhower') {
    showToast(isEn ? 'Color mapping rule: Eisenhower Matrix (4 Quadrants)' : 'Quy tắc màu: Ma Trận Eisenhower (4 mức quan trọng)');
  } else {
    showToast(isEn ? 'Color mapping rule: Focus Level (Smart Tags)' : 'Quy tắc màu: Mức Độ Tập Trung (Smart Tags)');
  }
}

function updateGCalColorMapping(key, newColorId) {
  if (!appState.settings.gcal) appState.settings.gcal = {};
  if (!appState.settings.gcal.colorMapping) {
    appState.settings.gcal.colorMapping = { ...DEFAULT_GCAL_COLOR_MAPPING };
  }
  appState.settings.gcal.colorMapping[key] = String(newColorId);
  saveData();
  renderApp();
  refreshGCalColorMappingUI();
  const cObj = getGCalColorObj(newColorId);
  const isEn = appState.settings.lang === 'en';
  const colorName = isEn ? cObj.name : (cObj.vi || cObj.name);
  showToast(`${t('toastGCalColorUpdated')}: ${colorName} (#${newColorId})`);
}

function resetGCalColorMapping() {
  if (!appState.settings.gcal) appState.settings.gcal = {};
  const currentMode = appState.settings.gcal.colorMapping?.mode || 'focus';
  appState.settings.gcal.colorMapping = { ...DEFAULT_GCAL_COLOR_MAPPING, mode: currentMode };
  saveData();
  renderApp();
  refreshGCalColorMappingUI();
  showToast(t('toastGCalColorsReset'));
}

function resetSingleGCalColor(key) {
  if (!appState.settings.gcal) appState.settings.gcal = {};
  if (!appState.settings.gcal.colorMapping) {
    appState.settings.gcal.colorMapping = { ...DEFAULT_GCAL_COLOR_MAPPING };
  }
  appState.settings.gcal.colorMapping[key] = DEFAULT_GCAL_COLOR_MAPPING[key] || '10';
  saveData();
  renderApp();
  refreshGCalColorMappingUI();
  const cObj = getGCalColorObj(appState.settings.gcal.colorMapping[key]);
  const isEn = appState.settings.lang === 'en';
  const colorName = isEn ? cObj.name : (cObj.vi || cObj.name);
  showToast(`${t('toastGCalColorUpdated')}: ${colorName} (#${appState.settings.gcal.colorMapping[key]})`);
}

function renderGCalColorMappingSection(threshold) {
  const mapping = appState.settings?.gcal?.colorMapping || DEFAULT_GCAL_COLOR_MAPPING;
  const isEn = appState.settings.lang === 'en';
  const currentMode = mapping.mode || 'focus';

  const focusCategories = [
    {
      key: 'focusLong',
      title: isEn ? 'Focus - Long Session' : 'Dễ tập trung - Dài',
      desc: isEn ? `Requires quiet • Duration ≥ ${threshold} mins` : `Cần yên tĩnh • Thời lượng ≥ ${threshold} phút`,
      suggestedId: '10'
    },
    {
      key: 'focusShort',
      title: isEn ? 'Focus - Short Session' : 'Dễ tập trung - Ngắn',
      desc: isEn ? `Requires quiet • Duration < ${threshold} mins` : `Cần yên tĩnh • Thời lượng < ${threshold} phút`,
      suggestedId: '9'
    },
    {
      key: 'distractLong',
      title: isEn ? 'Distract - Long Session' : 'Khó tập trung - Dài',
      desc: isEn ? `Noisy environment • Duration ≥ ${threshold} mins` : `Chấp nhận ồn ào • Thời lượng ≥ ${threshold} phút`,
      suggestedId: '5'
    },
    {
      key: 'distractShort',
      title: isEn ? 'Distract - Short Session' : 'Khó tập trung - Ngắn',
      desc: isEn ? `Noisy environment • Duration < ${threshold} mins` : `Chấp nhận ồn ào • Thời lượng < ${threshold} phút`,
      suggestedId: '6'
    }
  ];

  const eisenhowerCategories = [
    {
      key: 'eisenhowerQ1',
      title: isEn ? 'Q1: Urgent & Important (Do First)' : 'Q1: Khẩn cấp & Quan trọng (Làm ngay)',
      desc: isEn ? 'High priority, urgent deadline, critical impact' : 'Việc quan trọng gấp, khủng hoảng, hạn chót khẩn cấp',
      suggestedId: '11'
    },
    {
      key: 'eisenhowerQ2',
      title: isEn ? 'Q2: Important, Not Urgent (Schedule)' : 'Q2: Quan trọng, không khẩn (Lên lịch)',
      desc: isEn ? 'Strategic goals, deep work, growth & planning' : 'Mục tiêu chiến lược, học tập phát triển, công việc cốt lõi',
      suggestedId: '10'
    },
    {
      key: 'eisenhowerQ3',
      title: isEn ? 'Q3: Urgent, Not Important (Delegate)' : 'Q3: Khẩn cấp, không quan trọng (Ủy quyền)',
      desc: isEn ? 'Interruptions, sudden requests, delegate when possible' : 'Sự cố phát sinh, cuộc gọi ngắt quãng, nhờ vả gấp',
      suggestedId: '5'
    },
    {
      key: 'eisenhowerQ4',
      title: isEn ? 'Q4: Not Urgent, Not Important (Eliminate)' : 'Q4: Không khẩn, không quan trọng (Loại bỏ)',
      desc: isEn ? 'Low priority, leisure, optional backlog' : 'Giải trí, việc ngoài lề, việc không bắt buộc',
      suggestedId: '8'
    }
  ];

  const commonCategories = [
    {
      key: 'transient',
      title: isEn ? 'Transient / Ad-hoc Event' : 'Việc đột xuất / Phát sinh',
      desc: isEn ? 'Unexpected ad-hoc event during the day' : 'Sự kiện phát sinh đột xuất trong ngày',
      suggestedId: '11'
    },
    {
      key: 'fixed',
      title: isEn ? 'Fixed Routine Event' : 'Lịch cố định hàng ngày',
      desc: isEn ? 'Sleep, meals, recurring daily routines' : 'Ngủ, ăn uống, thói quen lặp lại hàng ngày',
      suggestedId: '8'
    }
  ];

  const dynamicCategories = currentMode === 'eisenhower' ? eisenhowerCategories : focusCategories;
  const categories = [...dynamicCategories, ...commonCategories];

  return `
    <div class="gcal-color-mapping-box">
      <div class="gcal-color-mapping-header">
        <div>
          <div style="font-weight:700; color:var(--text-primary); font-size:14px;">${t('gcalColorMappingTitle')}</div>
          <div style="font-size:12px; color:var(--text-muted); margin-top:2px; line-height:1.4;">${t('gcalColorMappingDesc')}</div>
        </div>
        <button type="button" class="btn-secondary" onclick="resetGCalColorMapping()" style="font-size:11px; padding:5px 12px; font-weight:600;">
          ${t('gcalResetColorsBtn')}
        </button>
      </div>

      <!-- THANH CHỌN QUY TẮC HIỂN THỊ MÀU (FOCUS TAGS VS EISENHOWER MATRIX) -->
      <div class="gcal-mapping-mode-bar">
        <div style="font-size:12px; font-weight:700; color:var(--text-primary); display:flex; align-items:center; gap:6px;">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
          <span>${isEn ? 'Color Mapping Rule:' : 'Quy tắc phân loại màu sắc:'}</span>
        </div>
        <div class="gcal-mapping-mode-group">
          <button type="button" class="gcal-mapping-mode-btn ${currentMode === 'focus' ? 'active' : ''}" onclick="setGCalColorMappingMode('focus')" title="${isEn ? 'Map colors by Focus & Noise environment' : 'Phân loại 4 màu đầu theo Mức độ tập trung & Môi trường'}">
            <span>🎯 ${isEn ? 'By Focus Level (Smart Tags)' : 'Theo Mức Độ Tập Trung'}</span>
          </button>
          <button type="button" class="gcal-mapping-mode-btn ${currentMode === 'eisenhower' ? 'active' : ''}" onclick="setGCalColorMappingMode('eisenhower')" title="${isEn ? 'Map colors by Eisenhower 4 Quadrants' : 'Phân loại 4 màu đầu theo Ma Trận Eisenhower'}">
            <span>⚡ ${isEn ? 'By Eisenhower (4 Quadrants)' : 'Theo Ma Trận Eisenhower'}</span>
          </button>
        </div>
      </div>

      <!-- Dải màu tham chiếu 11 màu Google Calendar -->
      <div class="gcal-palette-strip">
        <span style="font-weight:700; color:var(--text-primary); margin-right:4px;">${t('gcalPaletteTitle')}</span>
        ${GCAL_EVENT_COLORS.map(c => `
          <span class="gcal-palette-item" title="${c.id}. ${c.name} (${c.hex})">
            <span class="gcal-palette-dot" style="background-color:${c.hex};"></span>
            <span style="color:var(--text-secondary); font-weight:500;">${c.id}.${c.name}</span>
          </span>
        `).join('')}
      </div>

      <!-- Danh sách từng loại việc và bộ chọn màu tương ứng -->
      <div class="gcal-color-rows">
        ${categories.map(cat => {
          const currentId = mapping[cat.key] || cat.suggestedId;
          const currentObj = getGCalColorObj(currentId);
          const suggestedObj = getGCalColorObj(cat.suggestedId);
          const isDefault = String(currentId) === String(cat.suggestedId);

          return `
            <div class="gcal-color-row">
              <div class="gcal-color-info">
                <div class="gcal-color-title">${cat.title}</div>
                <div class="gcal-color-desc">${cat.desc}</div>
              </div>

              <div class="gcal-color-suggested" title="${isEn ? 'Standard recommended Google Calendar color' : 'Màu gợi ý chuẩn theo hệ màu Google Calendar'}">
                <span style="font-weight:600; color:var(--text-muted);">${t('gcalSuggestedBadge')}:</span>
                <span class="gcal-palette-dot" style="background-color:${suggestedObj.hex};"></span>
                <strong>${isEn ? suggestedObj.name : (suggestedObj.vi || suggestedObj.name)} (#${suggestedObj.id})</strong>
              </div>

              <div class="gcal-color-selector">
                <span class="gcal-swatch-circle" style="background-color: ${currentObj.hex};" title="Mã màu hiện tại: ${currentObj.name} (${currentObj.hex})"></span>
                <select class="gcal-color-select" onchange="updateGCalColorMapping('${cat.key}', this.value)" title="${isEn ? 'Choose Google Calendar Color' : 'Chọn màu Google Calendar'}">
                  ${GCAL_EVENT_COLORS.map(c => `
                    <option value="${c.id}" ${String(c.id) === String(currentId) ? 'selected' : ''}>
                      ${c.id}. ${isEn ? c.name : (c.vi || c.name)}
                    </option>
                  `).join('')}
                </select>
                ${isDefault ? `
                  <span class="gcal-status-tag default">${t('gcalStandardBadge')}</span>
                ` : `
                  <span class="gcal-status-tag custom">${t('gcalCustomBadge')}</span>
                  <button type="button" class="btn-secondary" onclick="resetSingleGCalColor('${cat.key}')" title="Khôi phục về màu gợi ý: ${suggestedObj.name}" style="font-size:10px; padding:3px 8px; font-weight:600;">
                    ${t('gcalResetSingleBtn')}
                  </button>
                `}
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

// ==========================================
// CHRONOFLOW & GCAL SYNC MODULE - STEP 1: STATE MANAGEMENT & TAGGING
// ==========================================

// Global Interaction Flag for Anti-Race Condition
let isUserInteracting = false;

function getUserInteractionState() {
  return isUserInteracting;
}

function setUserInteractionState(val) {
  isUserInteracting = !!val;
}

// Attach user interaction listeners
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  let inputInteractionTimer = null;
  const startInteracting = () => {
    isUserInteracting = true;
    if (inputInteractionTimer) clearTimeout(inputInteractionTimer);
  };
  const stopInteracting = () => {
    isUserInteracting = false;
  };
  const onInputEvent = () => {
    isUserInteracting = true;
    if (inputInteractionTimer) clearTimeout(inputInteractionTimer);
    inputInteractionTimer = setTimeout(() => {
      isUserInteracting = false;
    }, 1200);
  };

  document.addEventListener('mousedown', startInteracting, { passive: true });
  document.addEventListener('touchstart', startInteracting, { passive: true });
  document.addEventListener('dragstart', startInteracting, { passive: true });

  document.addEventListener('mouseup', stopInteracting, { passive: true });
  document.addEventListener('touchend', stopInteracting, { passive: true });
  document.addEventListener('drop', stopInteracting, { passive: true });
  document.addEventListener('dragend', stopInteracting, { passive: true });

  document.addEventListener('input', onInputEvent, { passive: true });
  document.addEventListener('keydown', onInputEvent, { passive: true });
  document.addEventListener('focusin', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
      isUserInteracting = true;
    }
  }, { passive: true });
  document.addEventListener('focusout', (e) => {
    if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT')) {
      if (inputInteractionTimer) clearTimeout(inputInteractionTimer);
      inputInteractionTimer = setTimeout(() => {
        isUserInteracting = false;
      }, 400);
    }
  }, { passive: true });
}

/**
 * Tạo tag ChronoFlow chuẩn theo PRD
 * @param {'task'|'transient'|'fixed'} type
 * @param {string} id
 * @returns {string}
 */
function createChronoFlowTag(type, id) {
  if (!id) return '';
  const normalizedType = String(type).toLowerCase();
  if (normalizedType === 'task') {
    return `[ChronoFlow Task | ID: ${id}]`;
  }
  if (normalizedType === 'transient') {
    return `[ChronoFlow Transient | ID: ${id}]`;
  }
  if (normalizedType === 'fixed') {
    return `[ChronoFlow Fixed | ID: ${id}]`;
  }
  if (normalizedType === 'note') {
    return `[ChronoFlow Note | ID: ${id}]`;
  }
  return `[ChronoFlow ${type} | ID: ${id}]`;
}

/**
 * Trích xuất tag ChronoFlow từ description của sự kiện Google Calendar
 * @param {string} description
 * @returns {{ type: 'task'|'transient'|'fixed'|'note'|null, id: string|null }}
 */
function extractChronoFlowTag(description) {
  if (!description || typeof description !== 'string') {
    return { type: null, id: null };
  }

  const tagRegex = /\[ChronoFlow\s+(Task|Transient|Fixed|Note)\s*\|\s*ID:\s*([^\]\r\n]+)\]/i;
  const match = description.match(tagRegex);

  if (match) {
    const rawType = match[1].toLowerCase();
    const id = match[2].trim();
    return {
      type: rawType === 'task' ? 'task' : rawType === 'transient' ? 'transient' : rawType === 'fixed' ? 'fixed' : rawType === 'note' ? 'note' : rawType,
      id
    };
  }

  return { type: null, id: null };
}

/**
 * Loại bỏ toàn bộ các tag ChronoFlow khỏi chuỗi description
 * @param {string} description
 * @returns {string}
 */
function stripChronoFlowTags(description) {
  if (!description || typeof description !== 'string') return '';
  return description
    .replace(/\[ChronoFlow\s+(Task|Transient|Fixed|Note)\s*\|\s*ID:\s*[^\]\r\n]+\]/gi, '')
    .trim();
}

/**
 * Chèn hoặc cập nhật tag ChronoFlow vào cuối description
 * @param {string} description
 * @param {'task'|'transient'|'fixed'} type
 * @param {string} id
 * @returns {string}
 */
function appendOrUpdateChronoFlowTag(description, type, id) {
  const cleanDesc = stripChronoFlowTags(description);
  const tag = createChronoFlowTag(type, id);
  if (!tag) return cleanDesc;
  return cleanDesc ? `${cleanDesc}\n${tag}` : tag;
}

let gcalTokenClient = null;
let isGcalPushing = false;
let isGcalPulling = false;
let gcalWidgetTimer = null;

/**
 * Lấy Access Token còn hạn từ LocalStorage
 */
function getGCalToken() {
  const token = localStorage.getItem('chronoflow_gcal_token');
  const exp = Number(localStorage.getItem('chronoflow_gcal_token_expires')) || 0;
  if (token && Date.now() < (exp - 30000)) {
    if (typeof window !== 'undefined') window._gcalAccessToken = token;
    return token;
  }
  if (typeof window !== 'undefined' && window._gcalAccessToken) {
    return window._gcalAccessToken;
  }
  return null;
}

/**
 * Cập nhật Widget trạng thái đồng bộ và Header Button
 */
function updateGCalSyncWidget(status, message) {
  const widget = document.getElementById('gcal-floating-widget');
  const msgEl = document.getElementById('gcal-floating-msg');
  const headerBtn = document.getElementById('header-gcal-btn');
  const headerText = document.getElementById('header-gcal-text');
  const headerIcon = document.getElementById('header-gcal-icon');

  const token = getGCalToken();
  const isConnected = !!token;

  // Cập nhật nút GCal trên Header
  if (headerBtn) {
    if (isConnected) {
      headerBtn.classList.add('connected');
    } else {
      headerBtn.classList.remove('connected');
    }

    if (status === 'pushing' || status === 'pulling') {
      headerBtn.classList.add('syncing');
      if (headerIcon) headerIcon.className = 'gcal-spin-icon';
    } else {
      headerBtn.classList.remove('syncing');
      if (headerIcon) headerIcon.className = '';
    }

    const syncTarget = typeof getHeaderSyncTarget === 'function' ? getHeaderSyncTarget() : 'gcal';
    const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
    headerBtn.setAttribute('title', syncTarget === 'gdrive'
      ? (isEn ? 'Google Drive Sync' : 'Đồng bộ Google Drive')
      : (isEn ? 'Google Calendar Sync' : 'Đồng bộ Google Calendar')
    );

    if (headerText) {
      if (status === 'pushing') headerText.textContent = isEn ? 'Saving...' : 'Đang lưu...';
      else if (status === 'pulling') headerText.textContent = isEn ? 'Pulling...' : 'Đang kéo...';
      else if (syncTarget === 'gdrive') {
        headerText.textContent = isConnected ? 'GDrive OK' : 'GDrive';
      } else {
        headerText.textContent = isConnected ? 'GCal OK' : 'GCal';
      }
    }
  }

  // Cập nhật nút Đồng bộ trong Cài đặt nếu đang mở
  const settingsSyncBtn = document.getElementById('gcal-sync-now-btn');
  if (settingsSyncBtn) {
    if (status === 'pulling' || status === 'pushing') {
      settingsSyncBtn.classList.add('gcal-sync-spinning');
      settingsSyncBtn.disabled = true;
    } else {
      settingsSyncBtn.classList.remove('gcal-sync-spinning');
      settingsSyncBtn.disabled = false;
    }
  }

  if (!widget || !msgEl) return;

  if (status === 'pushing' || status === 'pulling') {
    if (gcalWidgetTimer) clearTimeout(gcalWidgetTimer);
    msgEl.textContent = message || (status === 'pushing' ? 'Đang lưu lên Google Calendar...' : 'Đang tải từ Google Calendar...');
    widget.style.display = 'inline-flex';
  } else if (status === 'synced') {
    msgEl.textContent = message || 'Đã đồng bộ Google Calendar';
    widget.style.display = 'inline-flex';
    if (gcalWidgetTimer) clearTimeout(gcalWidgetTimer);
    gcalWidgetTimer = setTimeout(() => {
      widget.style.display = 'none';
    }, 2400);
  } else if (status === 'error') {
    msgEl.textContent = message || 'Lỗi đồng bộ Google Calendar';
    widget.style.display = 'inline-flex';
    if (gcalWidgetTimer) clearTimeout(gcalWidgetTimer);
    gcalWidgetTimer = setTimeout(() => {
      widget.style.display = 'none';
    }, 3500);
  } else {
    widget.style.display = 'none';
  }
}

/**
 * Khởi tạo Google Identity Services (GSI) Token Client
 */
function initGSI() {
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    return false;
  }
  const clientId = appState.settings?.gcal?.clientId?.trim();
  if (!clientId) return false;

  try {
    gcalTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file',
      callback: async (tokenResp) => {
        if (tokenResp.error) {
          console.error('Google Auth Error:', tokenResp);
          showToast('Lỗi đăng nhập Google: ' + (tokenResp.error_description || tokenResp.error));
          updateGCalSyncWidget('error', 'Lỗi xác thực Google');
          return;
        }
        const token = tokenResp.access_token;
        const expiresIn = Number(tokenResp.expires_in) || 3600;
        if (typeof window !== 'undefined') {
          window._gcalAccessToken = token;
        }
        localStorage.setItem('chronoflow_gcal_token', token);
        localStorage.setItem('chronoflow_gcal_token_expires', String(Date.now() + expiresIn * 1000));

        showToast('Đã kết nối Google Calendar thành công!');
        updateGCalSyncWidget('synced', 'Đã kết nối');

        await fetchGCalUserEmail(token);
        renderApp();
        const syncPrefs = loadSyncPrefs();
        if (syncPrefs.gcalEnabled) {
          syncFromGoogleCalendar(true);
        }
        if (syncPrefs.gdriveEnabled && appState.settings?.gdrive?.autoSyncOnOpen === true) {
          autoSyncGDriveOnOpen();
        }
      }
    });
    return true;
  } catch (err) {
    console.error('Init GSI error:', err);
    return false;
  }
}

/**
 * Lấy địa chỉ email người dùng Google Calendar
 */
async function fetchGCalUserEmail(token) {
  try {
    const res = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList/primary', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.id) {
        if (!appState.settings.gcal) appState.settings.gcal = {};
        appState.settings.gcal.userEmail = data.id;
        saveData();
      }
    }
  } catch (e) {
    console.warn('Cannot fetch calendar email:', e);
  }
}

function handleDriveUnauthorized() {
  if (typeof window !== 'undefined') {
    window._gcalAccessToken = null;
  }
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('chronoflow_gcal_token');
  }
  if (typeof gdrivePollingIntervalId !== 'undefined' && gdrivePollingIntervalId) {
    clearInterval(gdrivePollingIntervalId);
    gdrivePollingIntervalId = null;
  }
  const msg = 'Phiên Google hết hạn, vui lòng đăng nhập lại';
  if (typeof showToast === 'function') {
    showToast(msg, 'error');
  } else if (typeof window !== 'undefined' && typeof window.showToast === 'function') {
    window.showToast(msg, 'error');
  }
}

/**
 * Tim hoac tao file chronoflow_sync.json tren Google Drive
 * @param {string} accessToken
 * @returns {Promise<string>} fileId
 */
async function getOrCreateDriveSyncFileId(accessToken) {
  try {
    const token = accessToken || (typeof window !== 'undefined' ? window._gcalAccessToken : null);
    if (!token) {
      throw new Error('Khong tim thay access token');
    }

    const currentData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : {});
    const savedFileId = currentData?.settings?.gdrive?.fileId;

    // 1. Nếu settings.gdrive.fileId có giá trị: GET theo fileId trước
    if (savedFileId) {
      const checkRes = await fetch(`https://www.googleapis.com/drive/v3/files/${savedFileId}?fields=id,name`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (checkRes.status === 401) {
        handleDriveUnauthorized();
        throw new Error('Phiên Google hết hạn (401)');
      }
      if (checkRes.ok) {
        return savedFileId;
      }
    }

    // 2. Chỉ search name='chronoflow_sync.json' khi fileId null hoặc GET 404/không ok
    const query = encodeURIComponent("name = 'chronoflow_sync.json' and trashed = false");
    const searchRes = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&fields=files(id,name)&spaces=drive`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (searchRes.status === 401) {
      handleDriveUnauthorized();
      throw new Error('Phiên Google hết hạn (401)');
    }

    if (!searchRes.ok) {
      throw new Error(`Loi tim kiem file tren Google Drive: ${searchRes.statusText}`);
    }

    const searchData = await searchRes.json();
    let fileId = null;
    if (searchData.files && searchData.files.length > 0) {
      fileId = searchData.files[0].id;
    } else {
      const metadata = {
        name: 'chronoflow_sync.json',
        mimeType: 'application/json'
      };

      const boundary = '-------314159265358979323846';
      const delimiter = '\r\n--' + boundary + '\r\n';
      const closeDelim = '\r\n--' + boundary + '--';

      const multipartRequestBody =
        delimiter +
        'Content-Type: application/json; charset=UTF-8\r\n\r\n' +
        JSON.stringify(metadata) +
        delimiter +
        'Content-Type: application/json\r\n\r\n' +
        JSON.stringify(currentData) +
        closeDelim;

      const createRes = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': `multipart/related; boundary=${boundary}`
        },
        body: multipartRequestBody
      });

      if (createRes.status === 401) {
        handleDriveUnauthorized();
        throw new Error('Phiên Google hết hạn (401)');
      }

      if (!createRes.ok) {
        throw new Error(`Loi tao file tren Google Drive: ${createRes.statusText}`);
      }

      const createdFile = await createRes.json();
      fileId = createdFile.id;
    }

    // 3. Sau tìm/tạo OK: ghi fileId vào settings.gdrive và lưu localStorage
    if (fileId) {
      if (!currentData.settings) currentData.settings = {};
      if (!currentData.settings.gdrive) currentData.settings.gdrive = {};
      currentData.settings.gdrive.fileId = fileId;
      if (typeof window !== 'undefined' && window.d) {
        if (!window.d.settings) window.d.settings = {};
        if (!window.d.settings.gdrive) window.d.settings.gdrive = {};
        window.d.settings.gdrive.fileId = fileId;
      }
      if (typeof saveData === 'function') {
        saveData(currentData);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem('chronoflow_data', JSON.stringify(currentData));
      }
    }

    return fileId;
  } catch (err) {
    console.error('getOrCreateDriveSyncFileId error:', err);
    throw err;
  }
}

/**
 * PATCH toan bo du lieu app d len file chronoflow_sync.json tren Google Drive
 * @returns {Promise<any>}
 */
async function pushToGoogleDrive(options = {}) {
  try {
    const rawSyncPrefs = typeof localStorage !== 'undefined' ? localStorage.getItem('chronoflow_sync_prefs') : null;
    if (rawSyncPrefs !== null && !loadSyncPrefs().gdriveEnabled) {
      return { skipped: true, reason: 'gdrive_disabled' };
    }

    const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
    if (!token) {
      throw new Error('Khong co access token tai window._gcalAccessToken');
    }

    if (!options || !options.skipPull) {
      try {
        await pullFromGoogleDrive();
      } catch (pullErr) {
        const msg = String(pullErr?.message || pullErr);
        const is404 = msg.includes('404') || msg.includes('Not Found') || msg.includes('Không tìm thấy') || msg.includes('not found');
        if (!is404) {
          throw pullErr;
        }
      }
    }

    const fileId = await getOrCreateDriveSyncFileId(token);
    if (!fileId) {
      throw new Error('Khong lay duoc file ID tren Google Drive');
    }

    const currentData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : {});

    const updateRes = await fetch(`https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(currentData)
    });

    if (updateRes.status === 401) {
      handleDriveUnauthorized();
      throw new Error('Phiên Google hết hạn (401)');
    }

    if (!updateRes.ok) {
      throw new Error(`Loi cap nhat du lieu len Google Drive: ${updateRes.statusText}`);
    }

    if (currentData.settings && currentData.settings.gdrive) {
      currentData.settings.gdrive.lastSyncTime = Date.now();
      currentData.settings.gdrive.fileId = fileId;
      if (typeof saveData === 'function') {
        saveData(currentData);
      }
    }

    return await updateRes.json();
  } catch (err) {
    console.error('pushToGoogleDrive error:', err);
    throw err;
  }
}

/**
 * Tai du lieu tu file tren Google Drive ve, gop thong minh Last-Writer-Wins, cap nhat window.d, luu localStorage va goi I()
 * @returns {Promise<any>}
 */
async function pullFromGoogleDrive() {
  try {
    const rawSyncPrefs = typeof localStorage !== 'undefined' ? localStorage.getItem('chronoflow_sync_prefs') : null;
    if (rawSyncPrefs !== null && !loadSyncPrefs().gdriveEnabled) {
      return { skipped: true, reason: 'gdrive_disabled' };
    }

    const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
    if (!token) {
      throw new Error('Khong co access token tai window._gcalAccessToken');
    }

    const fileId = await getOrCreateDriveSyncFileId(token);
    if (!fileId) {
      throw new Error('Khong lay duoc file ID tren Google Drive');
    }

    const fetchRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (fetchRes.status === 401) {
      handleDriveUnauthorized();
      throw new Error('Phiên Google hết hạn (401)');
    }

    if (!fetchRes.ok) {
      throw new Error(`Loi tai du lieu tu Google Drive: ${fetchRes.statusText}`);
    }

    const incomingData = await fetchRes.json();
    const localData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : {});

    const mergedData = typeof mergeCollections === 'function'
      ? mergeCollections(localData, incomingData)
      : { ...localData, ...incomingData };

    if (mergedData.settings && mergedData.settings.gdrive) {
      mergedData.settings.gdrive.lastSyncTime = Date.now();
      mergedData.settings.gdrive.fileId = fileId;
    }

    if (typeof window !== 'undefined') {
      window.d = mergedData;
    }
    if (typeof d !== 'undefined') {
      d = mergedData;
    }
    if (typeof appState !== 'undefined') {
      appState = mergedData;
    }

    if (typeof saveData === 'function') {
      saveData(mergedData);
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem('chronoflow_data', JSON.stringify(mergedData));
    }

    if (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.notifyChange === 'function') {
      window.StreakEngine.notifyChange();
    }

    if (typeof window !== 'undefined' && typeof window.I === 'function') {
      window.I();
    } else if (typeof I === 'function') {
      I();
    } else if (typeof renderApp === 'function') {
      renderApp();
    }

    return mergedData;
  } catch (err) {
    console.error('pullFromGoogleDrive error:', err);
    throw err;
  }
}

let gdrivePollingIntervalId = null;

/**
 * Thiet lap polling chay ngam dong bo Google Drive dinh ky
 */
function setupGDrivePolling() {
  if (gdrivePollingIntervalId) {
    clearInterval(gdrivePollingIntervalId);
    gdrivePollingIntervalId = null;
  }

  const syncPrefs = loadSyncPrefs();
  if (!syncPrefs.gdriveEnabled) return;

  const appData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : null);
  if (appData?.settings?.gdrive?.pollingEnabled !== true) {
    return;
  }

  const intervalSeconds = Number(appData.settings.gdrive.pollingInterval) || 300;
  const intervalMs = Math.max(10, intervalSeconds) * 1000;

  gdrivePollingIntervalId = setInterval(async () => {
    const sp = loadSyncPrefs();
    if (!sp.gdriveEnabled) return;
    const currentAppData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : null);
    if (currentAppData?.settings?.gdrive?.pollingEnabled !== true) return;

    const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
    if (!token) return;

    try {
      const prevLastSync = Number(currentAppData?.settings?.gdrive?.lastSyncTime) || 0;
      const currentMaxSeen = Number(typeof maxSeenUpdatedAt !== 'undefined' ? maxSeenUpdatedAt : (currentAppData?.maxSeenUpdatedAt || 0));

      let maxRecordUpdate = 0;
      if (currentAppData) {
        const checkItems = (arr) => {
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (item && typeof item === 'object') {
                const up = Number(item.updatedAt) || 0;
                if (up > maxRecordUpdate) maxRecordUpdate = up;
              }
            }
          }
        };
        checkItems(currentAppData.tasks);
        checkItems(currentAppData.notes);
        checkItems(currentAppData.fixedEvents);
        checkItems(currentAppData.transientEvents);
        checkItems(currentAppData.settings?.noisyIntervals);
        checkItems(currentAppData.goals?.years);
        checkItems(currentAppData.goals?.monthGoals);
        checkItems(currentAppData.goals?.dailyGoals);
        checkItems(Object.values(currentAppData.streakDayOverrides || {}));
        checkItems(Object.values(currentAppData.slotOverrides || {}));
        checkItems([currentAppData.settings, currentAppData.settings?.streak, currentAppData.settings?.streak?.weeklyRelief]);
      }

      const localMax = Math.max(currentMaxSeen, maxRecordUpdate);

      await pullFromGoogleDrive();

      if (localMax > prevLastSync) {
        await pushToGoogleDrive({ skipPull: true });
      }
      updateGDriveBadgeTime();
    } catch (err) {
      console.error('setupGDrivePolling error:', err);
    }
  }, intervalMs);
}

/**
 * Tu dong dong bo tu Google Drive khi mo ung dung
 */
async function autoSyncGDriveOnOpen() {
  const syncPrefs = loadSyncPrefs();
  if (!syncPrefs.gdriveEnabled) return;

  const token = (typeof window !== 'undefined' && window._gcalAccessToken) || (typeof getGCalToken === 'function' ? getGCalToken() : null);
  if (typeof window !== 'undefined' && token) {
    window._gcalAccessToken = token;
  }
  const appData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : null);
  if (syncPrefs.gdriveEnabled && appData?.settings?.gdrive?.autoSyncOnOpen === true && token) {
    try {
      const currentAppData = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : null);
      const prevLastSync = Number(currentAppData?.settings?.gdrive?.lastSyncTime) || 0;
      const currentMaxSeen = Number(typeof maxSeenUpdatedAt !== 'undefined' ? maxSeenUpdatedAt : (currentAppData?.maxSeenUpdatedAt || 0));

      let maxRecordUpdate = 0;
      if (currentAppData) {
        const checkItems = (arr) => {
          if (Array.isArray(arr)) {
            for (const item of arr) {
              if (item && typeof item === 'object') {
                const up = Number(item.updatedAt) || 0;
                if (up > maxRecordUpdate) maxRecordUpdate = up;
              }
            }
          }
        };
        checkItems(currentAppData.tasks);
        checkItems(currentAppData.notes);
        checkItems(currentAppData.fixedEvents);
        checkItems(currentAppData.transientEvents);
        checkItems(currentAppData.settings?.noisyIntervals);
        checkItems(currentAppData.goals?.years);
        checkItems(currentAppData.goals?.monthGoals);
        checkItems(currentAppData.goals?.dailyGoals);
        checkItems(Object.values(currentAppData.streakDayOverrides || {}));
        checkItems(Object.values(currentAppData.slotOverrides || {}));
        checkItems([currentAppData.settings, currentAppData.settings?.streak, currentAppData.settings?.streak?.weeklyRelief]);
      }

      const localMax = Math.max(currentMaxSeen, maxRecordUpdate);

      await pullFromGoogleDrive();

      if (localMax > prevLastSync) {
        await pushToGoogleDrive({ skipPull: true });
      }
      updateGDriveBadgeTime();
    } catch (err) {
      console.error('autoSyncGDriveOnOpen error:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  window.getOrCreateDriveSyncFileId = getOrCreateDriveSyncFileId;
  window.pushToGoogleDrive = pushToGoogleDrive;
  window.pullFromGoogleDrive = pullFromGoogleDrive;
  window.setupGDrivePolling = setupGDrivePolling;
  window.autoSyncGDriveOnOpen = autoSyncGDriveOnOpen;
}

/**
 * Đăng nhập OAuth với Google Identity Services
 */
function handleGCalLogin() {
  const clientId = appState.settings?.gcal?.clientId?.trim();
  if (!clientId) {
    showToast('Vui lòng nhập Client ID và bấm Lưu Cấu Hình trước khi Đăng nhập!');
    const input = document.getElementById('gcal-client-id-input');
    if (input) input.focus();
    return;
  }
  if (!initGSI()) {
    showToast('Đang tải thư viện Google, vui lòng thử lại sau giây lát...');
    return;
  }
  if (gcalTokenClient) {
    gcalTokenClient.requestAccessToken({ prompt: '' });
  }
}

/**
 * Đăng xuất Google Calendar
 */
function handleGCalLogout() {
  const token = localStorage.getItem('chronoflow_gcal_token');
  if (token && typeof google !== 'undefined' && google.accounts && google.accounts.oauth2) {
    try {
      google.accounts.oauth2.revoke(token, () => {});
    } catch (e) {}
  }
  localStorage.removeItem('chronoflow_gcal_token');
  localStorage.removeItem('chronoflow_gcal_token_expires');
  if (appState.settings?.gcal) {
    appState.settings.gcal.userEmail = '';
    appState.settings.gcal.syncToken = null;
    appState.settings.gcal.lastSyncTime = null;
  }
  saveData();
  updateGCalSyncWidget('idle');
  renderApp();
  showToast('Đã đăng xuất khỏi Google Calendar');
}

/**
 * Lưu Client ID và thiết lập từ form Cài Đặt
 */
function saveGCalCredentials() {
  const clientIdInput = document.getElementById('gcal-client-id-input');
  const apiKeyInput = document.getElementById('gcal-api-key-input');
  const autoSyncInput = document.getElementById('gcal-auto-sync-checkbox');

  if (!appState.settings.gcal) {
    appState.settings.gcal = JSON.parse(JSON.stringify(DEFAULT_DATA.settings.gcal));
  }

  if (clientIdInput) appState.settings.gcal.clientId = clientIdInput.value.trim();
  if (apiKeyInput) appState.settings.gcal.apiKey = apiKeyInput.value.trim();
  if (autoSyncInput) appState.settings.gcal.autoSync = autoSyncInput.checked;

  const intervalInput = document.getElementById('gcal-sync-interval-select');
  if (intervalInput) {
    appState.settings.gcal.autoSyncInterval = parseInt(intervalInput.value, 10) || 60;
  }

  saveData();
  initGSI();
  restartGCalAutoSyncTimer();
  renderApp();
  showToast('Đã lưu cấu hình Google Calendar!');
}

/**
 * Ẩn/Hiện dòng chọn thời gian quét định kỳ khi bật/tắt Auto Sync
 */
function toggleAutoSyncSettingsRow(enabled) {
  const container = document.getElementById('gcal-interval-container');
  if (container) {
    container.style.display = enabled ? 'flex' : 'none';
  }
}

/**
 * Đẩy toàn bộ dữ liệu lên Google Calendar (pushAllToGCal):
 * - Tasks có assignedSlot / assignedSlotsByDate: nếu tasksScheduled → push
 * - Tasks chưa xếp lịch (còn todo, có date): nếu tasksUnscheduled → push all-day
 * - fixedEvents (!deleted): nếu fixed → push
 * - transientEvents (!deleted, source !== 'gcal'): nếu transient → push
 */
async function pushAllToGCal(manual = true) {
  const isEn = appState.settings?.lang === 'en';
  if (!loadSyncPrefs().gcalEnabled) {
    if (manual) {
      showToast(isEn ? 'Google Calendar Sync is disabled. Please enable the master switch first!' : 'Đồng bộ Google Calendar đang tắt. Vui lòng bật nút tổng trước!');
    }
    return { success: false, reason: 'gcal_disabled' };
  }

  const token = getGCalToken();
  if (!token) {
    if (manual) {
      showToast(isEn ? 'Please connect Google Calendar before pushing data!' : 'Vui lòng kết nối Google Calendar trước khi đẩy dữ liệu!');
    }
    return { success: false, reason: 'no_token' };
  }

  let pushedScheduled = 0;
  let pushedUnscheduled = 0;
  let pushedFixed = 0;
  let pushedTransient = 0;
  let pushedNotes = 0;
  let errorCount = 0;

  try {
    isGcalPushing = true;
    updateGCalSyncWidget('pushing', isEn ? 'Pushing all items to Calendar...' : 'Đang đẩy dữ liệu lên Calendar...');

    // 1. Tasks có assignedSlot / assignedSlotsByDate
    const scheduledTasks = (appState.tasks || []).filter(t => {
      if (t.deleted) return false;
      const hasByDate = t.assignedSlotsByDate && Object.values(t.assignedSlotsByDate).some(Boolean);
      return Boolean(t.assignedSlot || hasByDate);
    });

    for (const task of scheduledTasks) {
      try {
        const rawDates = task.assignedSlotsByDate && Object.keys(task.assignedSlotsByDate).length > 0
          ? Object.keys(task.assignedSlotsByDate).filter(dKey => Boolean(task.assignedSlotsByDate[dKey]))
          : [task.date || selectedDate];
        const slotDates = rawDates.length > 0 ? rawDates : [task.date || selectedDate];

        for (const d of slotDates) {
          if (shouldPushToGCal('tasksScheduled') && shouldPushScheduledTask(task, d)) {
            await pushTaskToGCal(task, 'update', d);
            pushedScheduled++;
          }
        }
      } catch (err) {
        console.error('Error pushing scheduled task:', task.title, err);
        errorCount++;
      }
    }

    // 2. Tasks chưa xếp lịch (còn todo, có date)
    const unscheduledTasks = (appState.tasks || []).filter(t => {
      if (t.deleted || t.status === 'done') return false;
      const hasByDate = t.assignedSlotsByDate && Object.values(t.assignedSlotsByDate).some(Boolean);
      const hasSlot = Boolean(t.assignedSlot || hasByDate);
      return !hasSlot && Boolean(t.date);
    });

    for (const task of unscheduledTasks) {
      try {
        if (shouldPushToGCal('tasksUnscheduled')) {
          await pushTaskToGCal(task, 'update', task.date);
          pushedUnscheduled++;
        }
      } catch (err) {
        console.error('Error pushing unscheduled task:', task.title, err);
        errorCount++;
      }
    }

    // 3. fixedEvents (!deleted)
    const fixedEvents = (appState.fixedEvents || []).filter(f => !f.deleted);
    for (const evt of fixedEvents) {
      try {
        if (shouldPushToGCal('fixed')) {
          await pushFixedEventToGCal(evt, 'update');
          pushedFixed++;
        }
      } catch (err) {
        console.error('Error pushing fixed event:', evt.title, err);
        errorCount++;
      }
    }

    // 4. transientEvents (!deleted, source !== 'gcal')
    const transientEvents = (appState.transientEvents || []).filter(tr => !tr.deleted && tr.source !== 'gcal');
    for (const tr of transientEvents) {
      try {
        if (shouldPushToGCal('transient')) {
          await pushTransientEventToGCal(tr, 'update');
          pushedTransient++;
        }
      } catch (err) {
        console.error('Error pushing transient event:', tr.title, err);
        errorCount++;
      }
    }

    // 5. notes (!deleted)
    const notesList = (appState.notes || window.d?.notes || d?.notes || []).filter(n => !n.deleted);
    for (const note of notesList) {
      try {
        if (shouldPushToGCal('notes')) {
          await pushNoteToGCal(note, 'update');
          pushedNotes++;
        }
      } catch (err) {
        console.error('Error pushing note:', note.id, err);
        errorCount++;
      }
    }

    const totalPushed = pushedScheduled + pushedUnscheduled + pushedFixed + pushedTransient + pushedNotes;

    if (totalPushed === 0) {
      if (manual) {
        showToast(isEn ? 'No items to push to Google Calendar.' : 'Không có dữ liệu nào cần đẩy lên Google Calendar.');
      }
      updateGCalSyncWidget('synced', isEn ? 'Up to date' : 'Đã đồng bộ');
      return;
    }

    const summaryMsg = isEn
      ? `Successfully pushed: ${pushedScheduled} scheduled, ${pushedUnscheduled} unscheduled, ${pushedFixed} fixed, ${pushedTransient} transient, ${pushedNotes} notes.`
      : `Đã đẩy thành công: ${pushedScheduled} task đã xếp, ${pushedUnscheduled} task chưa xếp, ${pushedFixed} việc cố định, ${pushedTransient} việc đột xuất, ${pushedNotes} ghi chú.`;

    if (errorCount === 0) {
      updateGCalSyncWidget('synced', isEn ? `Pushed ${totalPushed} items` : `Đã đẩy ${totalPushed} mục lên Calendar`);
      if (manual) {
        showToast(summaryMsg);
      }
    } else {
      updateGCalSyncWidget('synced', isEn ? `Pushed ${totalPushed} items (${errorCount} errors)` : `Đã đẩy ${totalPushed} mục (${errorCount} lỗi)`);
      if (manual) {
        showToast(`${summaryMsg} (${errorCount} lỗi).`);
      }
    }
  } catch (err) {
    console.error('pushAllToGCal error:', err);
    updateGCalSyncWidget('error', isEn ? 'Error pushing to Google Calendar' : 'Lỗi đẩy dữ liệu lên Google Calendar');
    if (manual) {
      showToast(isEn ? 'Error pushing to Google Calendar.' : 'Lỗi khi đẩy dữ liệu lên Google Calendar.');
    }
  } finally {
    isGcalPushing = false;
  }
}

/**
 * Tạo chuỗi quy tắc lặp lại iCalendar RFC5545 (RRULE) cho Việc cố định
 */
function buildGCalRRULE(item) {
  if (!item || !item.repeatType || item.repeatType === 'none') return null;
  const repeatType = item.repeatType;
  let rule = '';
  
  if (repeatType === 'daily') {
    rule = 'RRULE:FREQ=DAILY';
  } else if (repeatType === 'weekdays') {
    rule = 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR';
  } else if (repeatType === 'weekly') {
    const daysMap = { 0: 'SU', 1: 'MO', 2: 'TU', 3: 'WE', 4: 'TH', 5: 'FR', 6: 'SA' };
    const days = Array.isArray(item.repeatDays) ? item.repeatDays
               : (Array.isArray(item.daysOfWeek) ? item.daysOfWeek : []);
    if (days.length > 0) {
      const byDays = days.map(d => daysMap[d]).filter(Boolean).join(',');
      rule = `RRULE:FREQ=WEEKLY;BYDAY=${byDays}`;
    } else {
      rule = 'RRULE:FREQ=WEEKLY';
    }
  } else if (repeatType === 'monthly') {
    rule = 'RRULE:FREQ=MONTHLY';
  }

  if (rule && item.endDate) {
    const cleanEnd = item.endDate.replace(/-/g, '');
    rule += `;UNTIL=${cleanEnd}T235959Z`;
  }
  return rule ? [rule] : null;
}

// Bảng lưu timer debounce cho PUSH và khóa tuần tự theo item chống tạo sự kiện lặp
const gcalPushDebounceTimers = new Map();
const gcalItemPushLocks = new Map();

/**
 * Lên lịch đẩy dữ liệu với Debounce chống spam API
 */
function scheduleDebouncedPush(item, type, action = 'update', targetDate = selectedDate, delayMs = 300) {
  if (!loadSyncPrefs().gcalEnabled) return;
  if (!item || !item.id) return;
  const key = `${type}:${item.id}:${targetDate || ''}`;
  if (gcalPushDebounceTimers.has(key)) {
    clearTimeout(gcalPushDebounceTimers.get(key));
  }
  const timer = setTimeout(() => {
    gcalPushDebounceTimers.delete(key);
    if (!loadSyncPrefs().gcalEnabled) return;
    pushToGCal(item, type, action, targetDate);
  }, delayMs);
  gcalPushDebounceTimers.set(key, timer);
}

/**
 * Ánh xạ màu Smart Tag sang colorId của Google Calendar dựa trên cấu hình tùy chỉnh
 */
function getTaskGCalColorId(task, dateStr) {
  const mapping = appState.settings?.gcal?.colorMapping || DEFAULT_GCAL_COLOR_MAPPING;
  const mode = mapping.mode || 'focus';

  // 1. Chế độ Ma Trận Eisenhower (Mức độ quan trọng)
  if (mode === 'eisenhower') {
    const q = task.quadrant || (task.importance && task.urgency ? 'q1' : task.importance ? 'q2' : task.urgency ? 'q3' : 'q4');
    const qLower = String(q || 'q2').toLowerCase();
    if (qLower === 'q1') return mapping.eisenhowerQ1 || '11'; // Tomato
    if (qLower === 'q2') return mapping.eisenhowerQ2 || '10'; // Basil
    if (qLower === 'q3') return mapping.eisenhowerQ3 || '5';  // Banana
    if (qLower === 'q4') return mapping.eisenhowerQ4 || '8';  // Graphite
    return mapping.eisenhowerQ2 || '10';
  }

  // 2. Chế độ Mức Độ Tập Trung (Smart Tags)
  const slot = getTaskAssignedSlot(task, dateStr);
  if (slot) {
    const { freeSlots } = calculateFreeTimeSlots(dateStr);
    const matched = freeSlots.find(s => s.start <= timeToMinutes(slot.start) && s.end >= timeToMinutes(slot.end));
    if (matched && matched.tagType) {
      if (matched.tagType === 'focus-long') return mapping.focusLong || '10'; // Basil
      if (matched.tagType === 'focus-short') return mapping.focusShort || '9'; // Blueberry
      if (matched.tagType === 'distract-long') return mapping.distractLong || '5'; // Banana
      if (matched.tagType === 'distract-short') return mapping.distractShort || '6'; // Tangerine
    }
    const duration = (timeToMinutes(slot.end) - timeToMinutes(slot.start));
    const threshold = Number(appState.settings.focusThresholdMinutes) || 30;
    if (task.requireQuiet) {
      return duration >= threshold ? (mapping.focusLong || '10') : (mapping.focusShort || '9');
    } else {
      return duration >= threshold ? (mapping.distractLong || '5') : (mapping.distractShort || '6');
    }
  }
  return task.requireQuiet ? (mapping.focusLong || '10') : (mapping.distractShort || '6');
}

function shouldPushToGCal(kind) {
  const data = (typeof window !== 'undefined' && window.d) ? window.d : (typeof d !== 'undefined' ? d : (typeof appState !== 'undefined' ? appState : {}));
  const syncTypes = data?.settings?.gcal?.syncTypes || {};
  const val = syncTypes[kind];
  if (val !== undefined && val !== null) {
    return Boolean(val);
  }
  if (['tasksScheduled', 'fixed', 'transient'].includes(kind)) {
    return true;
  }
  return false;
}

if (typeof window !== 'undefined') {
  window.shouldPushToGCal = shouldPushToGCal;
}

async function findExistingGCalEventId(token, calendarId, type, itemId) {
  if (!itemId) return null;
  try {
    const tag = createChronoFlowTag(type, itemId);
    const searchUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?q=${encodeURIComponent(tag)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (searchRes.ok) {
      const searchData = await searchRes.json();
      const events = searchData.items || [];
      for (const ev of events) {
        if (ev.status === 'cancelled') continue;
        const extracted = extractChronoFlowTag(ev.description);
        if (extracted.type === type && extracted.id === itemId) {
          return ev.recurringEventId || ev.id;
        }
      }
      for (const ev of events) {
        if (ev.status === 'cancelled') continue;
        if (ev.description && ev.description.includes(tag)) {
          return ev.recurringEventId || ev.id;
        }
      }
    }
  } catch (e) {
    console.warn('findExistingGCalEventId error:', e);
  }
  return null;
}
window.findExistingGCalEventId = findExistingGCalEventId;

/**
 * MASTER PUSH ENGINE: Đẩy Task, Việc đột xuất hoặc Việc cố định lên Google Calendar
 * Sử dụng hàng đợi tuần tự theo từng (type:id) để chống Race Condition tạo sự kiện trùng lặp
 * @param {Object} item
 * @param {'task'|'transient'|'fixed'|'note'} type
 * @param {'create'|'update'|'delete'|'unassign'} action
 * @param {string} targetDate
 * @param {Object} options
 */
async function pushToGCal(item, type = 'task', action = 'update', targetDate = selectedDate, options = {}) {
  if (!loadSyncPrefs().gcalEnabled) return { success: false, reason: 'gcal_disabled' };
  const token = getGCalToken();
  if (!token || !item) return { success: false, reason: 'no_token_or_item' };

  const lockKey = item.id ? `${type}:${item.id}` : null;
  if (lockKey && gcalItemPushLocks.has(lockKey)) {
    try {
      await gcalItemPushLocks.get(lockKey);
    } catch (e) {}
  }

  const runPromise = _executePushToGCal(item, type, action, targetDate, options);
  if (lockKey) {
    gcalItemPushLocks.set(lockKey, runPromise);
  }
  try {
    return await runPromise;
  } finally {
    if (lockKey && gcalItemPushLocks.get(lockKey) === runPromise) {
      gcalItemPushLocks.delete(lockKey);
    }
  }
}

async function _executePushToGCal(item, type = 'task', action = 'update', targetDate = selectedDate, options = {}) {
  if (!loadSyncPrefs().gcalEnabled) return { success: false, reason: 'gcal_disabled' };
  const token = getGCalToken();
  if (!token || !item) return { success: false, reason: 'no_token_or_item' };

  const calendarId = encodeURIComponent(appState.settings?.gcal?.calendarId || 'primary');

  // 5. Action delete: nếu item đã có gcal_event_id thì vẫn cho xóa trên GCal (không bị chặn bởi tick)
  if (action === 'delete' || action === 'unassign' || item.deleted) {
    if (item.gcal_event_id) {
      try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${item.gcal_event_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        delete item.gcal_event_id;
        saveData();
      } catch (err) {
        console.error('Error deleting GCal event:', err);
      }
    }
    isGcalPushing = false;
    updateGCalSyncWidget('synced', 'Đã xóa trên Google Calendar');
    return { success: true, action: 'deleted' };
  }

  if (action !== 'delete' && item.deleted) {
    if (item.gcal_event_id) {
      return await _executePushToGCal(item, type, 'delete', targetDate, options);
    }
    return { success: false, reason: 'item_is_deleted' };
  }

  // Với fixed có recurrence: nếu đã có gcal_event_id và người dùng đổi repeatType hoặc startDate thì DELETE series cũ trên GCal, xóa gcal_event_id local, rồi INSERT series mới
  if (type === 'fixed') {
    const currentRepeatType = item.repeatType || 'none';
    const currentStartDate = item.startDate || item.date || targetDate;
    if (item._syncedRepeatType === undefined) item._syncedRepeatType = currentRepeatType;
    if (item._syncedStartDate === undefined) item._syncedStartDate = currentStartDate;

    if (item.gcal_event_id && (item._syncedRepeatType !== currentRepeatType || item._syncedStartDate !== currentStartDate)) {
      try {
        await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${item.gcal_event_id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error('Error deleting old recurring fixed event series on GCal:', err);
      }
      delete item.gcal_event_id;
      saveData();
    }
  }

  // Check syncTypes TRƯỚC khi tìm kiếm / INSERT để không gọi API dư thừa cho loại sự kiện đang tắt
  if (type === 'task') {
    const slot = getTaskAssignedSlot(item, targetDate);
    if (slot) {
      if (!shouldPushToGCal('tasksScheduled')) {
        isGcalPushing = false;
        updateGCalSyncWidget('idle');
        return { success: true, action: 'skipped_sync_type' };
      }
      if (!shouldPushScheduledTask(item, targetDate)) {
        isGcalPushing = false;
        updateGCalSyncWidget('idle');
        return { success: true, action: 'skipped_scheduled_filter' };
      }
    } else {
      if (!shouldPushToGCal('tasksUnscheduled')) {
        isGcalPushing = false;
        updateGCalSyncWidget('idle');
        return { success: true, action: 'skipped_sync_type' };
      }
    }
  } else if (type === 'fixed') {
    if (!shouldPushToGCal('fixed')) {
      isGcalPushing = false;
      updateGCalSyncWidget('idle');
      return { success: true, action: 'skipped_sync_type' };
    }
  } else if (type === 'transient') {
    if (!shouldPushToGCal('transient')) {
      isGcalPushing = false;
      updateGCalSyncWidget('idle');
      return { success: true, action: 'skipped_sync_type' };
    }
  } else if (type === 'note') {
    if (!shouldPushToGCal('notes')) {
      isGcalPushing = false;
      updateGCalSyncWidget('idle');
      return { success: true, action: 'skipped_sync_type' };
    }
  }

  // Trước khi INSERT (khi item chưa có gcal_event_id):
  // 1. Dùng ChronoFlow tag trong description (các hàm create/extract tag hiện có) để tìm event đã tồn tại trên Google Calendar theo type + local id.
  // 2. Nếu tìm thấy → gán item.gcal_event_id = id tìm được, rồi đi nhánh UPDATE, không INSERT.
  if (!item.gcal_event_id && item.id) {
    const foundId = await findExistingGCalEventId(token, calendarId, type, item.id);
    if (foundId) {
      item.gcal_event_id = foundId;
      saveData();
    }
  }

  try {
    isGcalPushing = true;
    updateGCalSyncWidget('pushing', 'Đang lưu lên Google Calendar...');

    const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Ho_Chi_Minh';
    const mapping = appState.settings?.gcal?.colorMapping || DEFAULT_GCAL_COLOR_MAPPING;

    let eventPayload = null;

    if (type === 'task') {
      const slot = getTaskAssignedSlot(item, targetDate);
      if (!slot) {
        // Không slot -> all-day event (start/end dùng date, không dateTime)
        const eventDate = targetDate || item.date || getTodayDateString();
        const descParts = [];
        if (item.note) descParts.push(`Ghi chú: ${item.note}`);
        const finalDesc = appendOrUpdateChronoFlowTag(descParts.join('\n'), 'task', item.id);

        eventPayload = {
          summary: item.title,
          description: finalDesc,
          start: { date: eventDate },
          end: { date: getNextDateStr(eventDate) },
          colorId: getTaskGCalColorId(item, eventDate)
        };
      } else {
        // Có slot -> timed event
        const eventDate = targetDate || item.date || getTodayDateString();
        const startIso = `${eventDate}T${slot.start}:00`;
        const endIso = `${eventDate}T${slot.end}:00`;

        const descParts = [];
        if (item.note) descParts.push(`Ghi chú: ${item.note}`);
        if (item.isImportant || item.isUrgent) {
          const eis = (item.isImportant && item.isUrgent) ? 'Quan trọng & Khẩn cấp (Làm ngay)'
                    : (item.isImportant && !item.isUrgent) ? 'Quan trọng - Không khẩn cấp (Lên kế hoạch)'
                    : (!item.isImportant && item.isUrgent) ? 'Không quan trọng - Khẩn cấp (Ủy quyền)'
                    : 'Không quan trọng - Không khẩn cấp (Loại bỏ/Thư giãn)';
          descParts.push(`Ma trận Eisenhower: ${eis}`);
        }

        const rawDesc = descParts.join('\n');
        const finalDesc = appendOrUpdateChronoFlowTag(rawDesc, 'task', item.id);
        const colorId = getTaskGCalColorId(item, eventDate);

        eventPayload = {
          summary: item.title,
          description: finalDesc,
          start: { dateTime: startIso, timeZone: userTz },
          end: { dateTime: endIso, timeZone: userTz },
          colorId: colorId
        };
      }
    } else if (type === 'transient') {
      const eventDate = item.date || targetDate || getTodayDateString();
      const startIso = `${eventDate}T${item.start}:00`;
      const endIso = `${eventDate}T${item.end}:00`;

      const rawDesc = item.note ? `Ghi chú: ${item.note}\nViệc đột xuất` : 'Việc đột xuất';
      const finalDesc = appendOrUpdateChronoFlowTag(rawDesc, 'transient', item.id);

      eventPayload = {
        summary: item.title,
        description: finalDesc,
        start: { dateTime: startIso, timeZone: userTz },
        end: { dateTime: endIso, timeZone: userTz },
        colorId: item.colorId || mapping.transient || '11'
      };
    } else if (type === 'note') {
      const eventDate = targetDate || item.date || getTodayDateString();
      const summary = "📝 " + (item.content || '').substring(0, 40);
      const rawDesc = item.content || '';
      const finalDesc = appendOrUpdateChronoFlowTag(rawDesc, 'note', item.id);

      eventPayload = {
        summary: summary,
        description: finalDesc,
        start: { date: eventDate },
        end: { date: getNextDateStr(eventDate) },
        colorId: appState.settings?.gcal?.colorMapping?.note || '9'
      };
    } else if (type === 'fixed') {
      const startDate = item.startDate || item.date || targetDate || getTodayDateString();
      const startIso = `${startDate}T${item.start}:00`;
      const endIso = `${startDate}T${item.end}:00`;

      const rawDesc = item.note ? `Ghi chú: ${item.note}\nViệc cố định` : 'Việc cố định';
      const finalDesc = appendOrUpdateChronoFlowTag(rawDesc, 'fixed', item.id);
      const recurrenceRule = buildGCalRRULE(item);

      eventPayload = {
        summary: item.title,
        description: finalDesc,
        start: { dateTime: startIso, timeZone: userTz },
        end: { dateTime: endIso, timeZone: userTz },
        colorId: item.colorId || mapping.fixed || '8'
      };

      if (recurrenceRule && recurrenceRule.length > 0) {
        eventPayload.recurrence = recurrenceRule;
      }
    }

    if (!eventPayload) {
      isGcalPushing = false;
      return { success: false, reason: 'no_payload' };
    }

    let res;
    if (item.gcal_event_id) {
      res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events/${item.gcal_event_id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });

      if (!res.ok && res.status === 404) {
        res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(eventPayload)
        });
      }
    } else {
      res = await fetch(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventPayload)
      });
    }

    if (res.ok) {
      const created = await res.json();
      item.gcal_event_id = created.recurringEventId || created.id;
      if (type === 'fixed') {
        item._syncedRepeatType = item.repeatType || 'none';
        item._syncedStartDate = item.startDate || item.date || targetDate;
      }
      b();
      updateGCalSyncWidget('synced', 'Đã lưu lên Google Calendar');
      return { success: true, eventId: item.gcal_event_id };
    } else {
      const errText = await res.text();
      console.error('Lỗi push lên GCal:', res.status, errText);
      if (res.status === 401) {
        localStorage.removeItem('chronoflow_gcal_token');
        updateGCalSyncWidget('error', 'Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại');
        showToast('Phiên đăng nhập Google đã hết hạn. Vui lòng bấm Đăng nhập lại trong Cài đặt.');
      } else if (res.status === 403) {
        updateGCalSyncWidget('error', 'Không có quyền ghi Calendar (403)');
        showToast('Google từ chối quyền ghi (403). Kiểm tra Scope calendar.events trên Cloud Console.');
      } else {
        updateGCalSyncWidget('error', `Lỗi khi lưu lên Calendar (${res.status})`);
      }
      return { success: false, status: res.status, error: errText };
    }
  } catch (err) {
    console.error('Exception pushToGCal:', err);
    updateGCalSyncWidget('error', 'Lỗi kết nối khi đẩy Calendar');
    return { success: false, error: err };
  } finally {
    isGcalPushing = false;
  }
}

/**
 * Wrapper tương thích ngược cho Task
 */
async function pushTaskToGCal(task, action = 'update', targetDate = selectedDate) {
  return pushToGCal(task, 'task', action, targetDate);
}

/**
 * Wrapper tương thích ngược cho Việc đột xuất
 */
async function pushTransientEventToGCal(evt, action = 'update') {
  return pushToGCal(evt, 'transient', action, evt.date || selectedDate);
}

/**
 * Wrapper cho Ghi chú ngày
 */
async function pushNoteToGCal(note, action = 'update') {
  return pushToGCal(note, 'note', action, note.date || selectedDate);
}

/**
 * Wrapper tương thích ngược cho Việc cố định
 */
async function pushFixedEventToGCal(evt, action = 'update') {
  return pushToGCal(evt, 'fixed', action, evt.startDate || selectedDate);
}

/**
 * MASTER PULL ENGINE: Kéo dữ liệu từ Google Calendar về ChronoFlow (Incremental Sync)
 * @param {boolean|Object} options
 * @returns {Promise<{success: boolean, count?: number, total?: number, skipped?: boolean, error?: any}>}
 */
async function pullFromGCal(options = false) {
  const manual = typeof options === 'boolean' ? options : !!options?.manual;
  if (!loadSyncPrefs().gcalEnabled) {
    if (manual) {
      const isEn = appState.settings?.lang === 'en';
      showToast(isEn ? 'Google Calendar Sync is disabled. Please enable the master switch first!' : 'Đồng bộ Google Calendar đang tắt. Vui lòng bật nút tổng trước!');
    }
    return { success: false, reason: 'gcal_disabled' };
  }

  // Anti-Race Condition: Bỏ qua vòng quét ngầm nếu người dùng đang tương tác hoặc đang PUSH
  if (!manual && (getUserInteractionState() || isGcalPushing || isGcalPulling)) {
    return { success: false, skipped: true, reason: 'user_interacting_or_busy' };
  }

  if (isGcalPushing) {
    if (!manual) return { success: false, skipped: true, reason: 'pushing' };
    await new Promise(r => setTimeout(r, 600));
  }

  const token = getGCalToken();
  if (!token) {
    if (manual) {
      handleGCalLogin();
    }
    return { success: false, reason: 'no_token' };
  }

  try {
    isGcalPulling = true;
    updateGCalSyncWidget('pulling', 'Đang tải từ Google Calendar...');

    const calendarId = encodeURIComponent(appState.settings?.gcal?.calendarId || 'primary');
    let syncToken = appState.settings?.gcal?.syncToken;
    let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=250&showDeleted=true`;

    if (syncToken) {
      url += `&syncToken=${encodeURIComponent(syncToken)}`;
    } else {
      const now = new Date();
      const timeMin = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
      const timeMax = new Date(now.getTime() + 90 * 24 * 3600 * 1000).toISOString();
      url += `&singleEvents=true&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
    }

    let res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` }
    });

    // Bắt lỗi HTTP 410 Gone (syncToken hết hạn/bị vô hiệu hóa) -> Reset token và quét dải ngày -30 đến +90 ngày
    if (res.status === 410) {
      console.warn('GCal syncToken 410 Gone -> Resetting token and performing full sync range (-30 to +90 days)');
      if (appState.settings?.gcal) {
        appState.settings.gcal.syncToken = null;
      }
      const now = new Date();
      const timeMin = new Date(now.getTime() - 30 * 24 * 3600 * 1000).toISOString();
      const timeMax = new Date(now.getTime() + 90 * 24 * 3600 * 1000).toISOString();
      url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?maxResults=250&showDeleted=true&singleEvents=true&timeMin=${encodeURIComponent(timeMin)}&timeMax=${encodeURIComponent(timeMax)}`;
      res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('chronoflow_gcal_token');
        showToast('Phiên kết nối Google Calendar đã hết hạn, vui lòng đăng nhập lại!');
      }
      throw new Error(`GCal fetch failed HTTP ${res.status}`);
    }

    const data = await res.json();
    if (data.nextSyncToken && appState.settings?.gcal) {
      appState.settings.gcal.syncToken = data.nextSyncToken;
    }

    const items = data.items || [];
    let modifiedCount = 0;
    const processedFixedIds = new Set();

    for (const item of items) {
      const eventId = item.id;
      const masterEventId = item.recurringEventId || eventId;
      const isCancelled = item.status === 'cancelled';
      const description = item.description || '';
      const summary = item.summary || 'Sự kiện Google Calendar';
      const tagInfo = extractChronoFlowTag(description);

      // 1. Xử lý Sự kiện bị Xóa/Hủy (showDeleted=true)
      if (isCancelled) {
        // Kiểm tra Task
        const task = (tagInfo.type === 'task' && tagInfo.id)
          ? appState.tasks.find(t => t.id === tagInfo.id && !t.deleted)
          : appState.tasks.find(t => (t.gcal_event_id === eventId || t.gcal_event_id === masterEventId) && !t.deleted);
        if (task) {
          task.assignedSlot = null;
          task.status = 'todo';
          delete task.gcal_event_id;
          if (task.assignedSlotsByDate) {
            delete task.assignedSlotsByDate[selectedDate];
          }
          touch(task);
          modifiedCount++;
        }

        // Kiểm tra Việc đột xuất
        const teIdx = (tagInfo.type === 'transient' && tagInfo.id)
          ? appState.transientEvents.findIndex(tr => tr.id === tagInfo.id && !tr.deleted)
          : appState.transientEvents.findIndex(tr => (tr.gcal_event_id === eventId || tr.gcal_event_id === masterEventId) && !tr.deleted);
        if (teIdx >= 0) {
          const trItem = appState.transientEvents[teIdx];
          const deletedRec = { id: trItem.id, deleted: true };
          touch(deletedRec);
          appState.transientEvents[teIdx] = deletedRec;
          modifiedCount++;
        }

        // Kiểm tra Việc cố định
        const feIdx = (tagInfo.type === 'fixed' && tagInfo.id)
          ? appState.fixedEvents.findIndex(fe => fe.id === tagInfo.id && !fe.deleted)
          : appState.fixedEvents.findIndex(fe => (fe.gcal_event_id === eventId || fe.gcal_event_id === masterEventId) && !fe.deleted);
        if (feIdx >= 0) {
          const feItem = appState.fixedEvents[feIdx];
          const deletedRec = { id: feItem.id, deleted: true };
          touch(deletedRec);
          appState.fixedEvents[feIdx] = deletedRec;
          modifiedCount++;
        }

        // Kiểm tra Ghi chú ngày
        if (Array.isArray(appState.notes)) {
          const noteIdx = (tagInfo.type === 'note' && tagInfo.id)
            ? appState.notes.findIndex(n => n.id === tagInfo.id && !n.deleted)
            : appState.notes.findIndex(n => (n.gcal_event_id === eventId || n.gcal_event_id === masterEventId) && !n.deleted);
          if (noteIdx >= 0) {
            delete appState.notes[noteIdx].gcal_event_id;
            modifiedCount++;
          }
        }
        continue;
      }

      // 2. Phân tích thời gian bắt đầu & kết thúc
      const startDT = item.start?.dateTime || item.start?.date;
      if (!startDT) continue;

      const isTimedEvent = Boolean(item.start?.dateTime);
      let dateStr = '';
      let startTime = '08:00';
      let endTime = '09:00';

      if (isTimedEvent) {
        const rawStart = item.start.dateTime;
        const rawEnd = item.end?.dateTime || item.start.dateTime;

        if (rawStart.includes('T')) {
          const parts = rawStart.split('T');
          dateStr = parts[0];
          startTime = parts[1].substring(0, 5);
        } else {
          const dStart = new Date(rawStart);
          dateStr = `${dStart.getFullYear()}-${String(dStart.getMonth() + 1).padStart(2, '0')}-${String(dStart.getDate()).padStart(2, '0')}`;
          startTime = `${String(dStart.getHours()).padStart(2, '0')}:${String(dStart.getMinutes()).padStart(2, '0')}`;
        }

        if (rawEnd.includes('T')) {
          endTime = rawEnd.split('T')[1].substring(0, 5);
        } else {
          const dEnd = new Date(rawEnd);
          endTime = `${String(dEnd.getHours()).padStart(2, '0')}:${String(dEnd.getMinutes()).padStart(2, '0')}`;
        }
      } else if (item.start?.date) {
        dateStr = item.start.date;
        startTime = '09:00';
        endTime = '10:00';
      }

      // 3. Phân loại theo Tag định danh ChronoFlow
      if (tagInfo.type === 'task' || (!tagInfo.type && appState.tasks.some(t => !t.deleted && (t.gcal_event_id === eventId || t.gcal_event_id === masterEventId)))) {
        const existingTask = (tagInfo.type === 'task' && tagInfo.id)
          ? appState.tasks.find(t => t.id === tagInfo.id)
          : appState.tasks.find(t => t.gcal_event_id === eventId || t.gcal_event_id === masterEventId);

        if (existingTask && !existingTask.deleted) {
          if (isTimedEvent && !shouldPushToGCal('tasksScheduled')) continue;
          if (!isTimedEvent && !shouldPushToGCal('tasksUnscheduled')) continue;

          existingTask.title = summary;
          const cleanNote = stripChronoFlowTags(description);
          if (cleanNote && !cleanNote.startsWith('Ma trận Eisenhower:')) {
            existingTask.note = cleanNote.replace(/^Ghi chú:\s*/i, '');
          }
          existingTask.gcal_event_id = eventId;
          existingTask.date = dateStr;
          if (isTimedEvent) {
            const assigned = { start: startTime, end: endTime };
            if (!existingTask.assignedSlotsByDate) existingTask.assignedSlotsByDate = {};
            existingTask.assignedSlotsByDate[dateStr] = assigned;
            existingTask.assignedSlot = assigned;
            existingTask.status = 'scheduled';
          }
          modifiedCount++;
        }
        continue;
      }

      if (tagInfo.type === 'transient' || (!tagInfo.type && appState.transientEvents.some(tr => !tr.deleted && (tr.gcal_event_id === eventId || tr.gcal_event_id === masterEventId) && tr.source !== 'gcal'))) {
        const existingTransient = (tagInfo.type === 'transient' && tagInfo.id)
          ? appState.transientEvents.find(tr => tr.id === tagInfo.id)
          : appState.transientEvents.find(tr => tr.gcal_event_id === eventId || tr.gcal_event_id === masterEventId);

        if (existingTransient && !existingTransient.deleted) {
          if (!shouldPushToGCal('transient')) continue;
          existingTransient.title = summary;
          existingTransient.date = dateStr;
          existingTransient.start = startTime;
          existingTransient.end = endTime;
          existingTransient.gcal_event_id = eventId;
          modifiedCount++;
        }
        continue;
      }

      if (tagInfo.type === 'fixed' || (!tagInfo.type && appState.fixedEvents.some(fe => !fe.deleted && (fe.gcal_event_id === eventId || fe.gcal_event_id === masterEventId)))) {
        const existingFixed = (tagInfo.type === 'fixed' && tagInfo.id)
          ? appState.fixedEvents.find(fe => fe.id === tagInfo.id)
          : appState.fixedEvents.find(fe => fe.gcal_event_id === eventId || fe.gcal_event_id === masterEventId);

        if (existingFixed && !existingFixed.deleted) {
          if (!shouldPushToGCal('fixed')) continue;
          // Với sự kiện lặp lại (singleEvents=true trả về nhiều instance), luôn lưu masterEventId và chỉ cập nhật 1 lần mỗi lượt pull
          existingFixed.gcal_event_id = masterEventId;
          if (!processedFixedIds.has(existingFixed.id)) {
            processedFixedIds.add(existingFixed.id);
            existingFixed.title = summary;
            existingFixed.start = startTime;
            existingFixed.end = endTime;
            modifiedCount++;
          }
        }
        continue;
      }

      if (tagInfo.type === 'note' || (!tagInfo.type && Array.isArray(appState.notes) && appState.notes.some(n => !n.deleted && (n.gcal_event_id === eventId || n.gcal_event_id === masterEventId)))) {
        const existingNote = (tagInfo.type === 'note' && tagInfo.id)
          ? (appState.notes || []).find(n => n.id === tagInfo.id)
          : (appState.notes || []).find(n => n.gcal_event_id === eventId || n.gcal_event_id === masterEventId);

        if (existingNote && !existingNote.deleted) {
          if (!shouldPushToGCal('notes')) continue;
          const cleanContent = stripChronoFlowTags(description);
          if (cleanContent) {
            existingNote.content = cleanContent;
          }
          existingNote.date = dateStr;
          existingNote.gcal_event_id = eventId;
          modifiedCount++;
        }
        continue;
      }

      // Chặn mọi sự kiện có tag ChronoFlow nhưng bản ghi local đã bị xóa khỏi rơi xuống Bước 4 tạo Việc đột xuất trùng lặp
      if (tagInfo.type) {
        continue;
      }

      // 4. SỰ KIỆN LẠ TẠO TỪ GCAL (Không có tag định danh ChronoFlow):
      // Tự động lưu thành "Việc đột xuất" (Transient Event) trong ChronoFlow nếu bật đồng bộ transient
      if (!shouldPushToGCal('transient')) {
        continue;
      }

      const existingGcalTransient = appState.transientEvents.find(tr => tr.gcal_event_id === eventId && !tr.deleted);
      const gcalColor = GCAL_EVENT_COLORS.find(c => String(c.id) === String(item.colorId));
      const cleanNote = stripChronoFlowTags(description);

      if (existingGcalTransient) {
        existingGcalTransient.title = summary;
        existingGcalTransient.date = dateStr;
        existingGcalTransient.start = startTime;
        existingGcalTransient.end = endTime;
        existingGcalTransient.colorId = item.colorId || existingGcalTransient.colorId || null;
        if (gcalColor) existingGcalTransient.color = gcalColor.hex;
        existingGcalTransient.note = cleanNote;
      } else {
        // Nếu người dùng đã xóa mềm sự kiện ngoại lai này trong ChronoFlow thì không tự động tạo lại
        const wasDeletedLocally = appState.transientEvents.some(tr => tr.deleted && (tr.gcal_event_id === eventId || tr.id === 'gcal-' + eventId.replace(/[^a-zA-Z0-9_-]/g, '')));
        if (wasDeletedLocally) {
          continue;
        }
        const newGcalTr = {
          id: 'gcal-' + eventId.replace(/[^a-zA-Z0-9_-]/g, ''),
          gcal_event_id: eventId,
          title: summary,
          note: cleanNote,
          date: dateStr,
          start: startTime,
          end: endTime,
          colorId: item.colorId || null,
          color: gcalColor ? gcalColor.hex : null,
          repeatType: 'none',
          source: 'gcal',
          deleted: false
        };
        touch(newGcalTr);
        appState.transientEvents.push(newGcalTr);
      }
      modifiedCount++;
    }

    const nowStr = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + new Date().toLocaleDateString('vi-VN');
    if (appState.settings?.gcal) {
      appState.settings.gcal.lastSyncTime = nowStr;
    }
    saveData();

    updateGCalSyncWidget('synced', `Đã đồng bộ (${items.length} thay đổi)`);
    renderApp();

    if (manual) {
      showToast('Đồng bộ Google Calendar thành công!');
    }
    if (typeof pushAllToGCal === 'function') {
      await pushAllToGCal(false);
    }
    return { success: true, count: modifiedCount, total: items.length };
  } catch (err) {
    console.error('pullFromGCal error:', err);
    updateGCalSyncWidget('error', 'Lỗi đồng bộ Google Calendar');
    if (manual) {
      showToast('Lỗi khi đồng bộ Google Calendar. Kiểm tra Client ID hoặc kết nối mạng.');
    }
    return { success: false, error: err };
  } finally {
    isGcalPulling = false;
  }
}

function updateGCalSyncTypeSetting(key, checked) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  if (!appState.settings.gcal.syncTypes || typeof appState.settings.gcal.syncTypes !== 'object') {
    appState.settings.gcal.syncTypes = {
      tasksScheduled: true,
      tasksUnscheduled: false,
      fixed: true,
      transient: true,
      notes: false
    };
  }
  appState.settings.gcal.syncTypes[key] = Boolean(checked);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    if (!window.d.settings.gcal.syncTypes) window.d.settings.gcal.syncTypes = {};
    window.d.settings.gcal.syncTypes[key] = Boolean(checked);
  }
  touch(appState.settings);
  saveData();
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? 'Updated sync types configuration' : 'Đã cập nhật cấu hình loại dữ liệu đồng bộ');
  if (typeof renderAllSettingsPanes === 'function') {
    renderAllSettingsPanes();
  }
}

function updateGCalSyncQuadrantSetting(quadrant, checked) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  if (!appState.settings.gcal.syncScheduledQuadrants || typeof appState.settings.gcal.syncScheduledQuadrants !== 'object') {
    appState.settings.gcal.syncScheduledQuadrants = { q1: true, q2: true, q3: false, q4: false };
  }
  appState.settings.gcal.syncScheduledQuadrants[quadrant] = Boolean(checked);
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    if (!window.d.settings.gcal.syncScheduledQuadrants) {
      window.d.settings.gcal.syncScheduledQuadrants = { q1: true, q2: true, q3: false, q4: false };
    }
    window.d.settings.gcal.syncScheduledQuadrants[quadrant] = Boolean(checked);
  }
  touch(appState.settings);
  saveData();
  if (typeof renderAllSettingsPanes === 'function') {
    renderAllSettingsPanes();
  }
  const isEn = appState.settings.lang === 'en';
  showToast(isEn ? `Updated Q${quadrant.substring(1).toUpperCase()} sync filter` : `Đã cập nhật lọc đồng bộ Q${quadrant.substring(1).toUpperCase()}`);
}

function updateGCalSyncTimeScope(scope) {
  if (!appState.settings) appState.settings = {};
  if (!appState.settings.gcal) appState.settings.gcal = {};
  appState.settings.gcal.syncTimeScope = scope;
  if (typeof window !== 'undefined' && window.d && window.d.settings && window.d.settings.gcal) {
    window.d.settings.gcal.syncTimeScope = scope;
  }
  touch(appState.settings);
  saveData();
  if (typeof renderAllSettingsPanes === 'function') {
    renderAllSettingsPanes();
  }
  const isEn = appState.settings.lang === 'en';
  const labelsEn = { day: 'By Day', week: 'By Week', month: 'By Month', all: 'All Time' };
  const labelsVi = { day: 'Theo ngày', week: 'Theo tuần', month: 'Theo tháng', all: 'Tất cả' };
  const scopeLabel = isEn ? (labelsEn[scope] || scope) : (labelsVi[scope] || scope);
  showToast(isEn ? `Sync time scope set to: ${scopeLabel}` : `Đã đặt phạm vi đồng bộ: ${scopeLabel}`);
}

if (typeof window !== 'undefined') {
  window.updateGCalSyncTypeSetting = updateGCalSyncTypeSetting;
  window.updateGCalSyncQuadrantSetting = updateGCalSyncQuadrantSetting;
  window.updateGCalSyncTimeScope = updateGCalSyncTimeScope;
}

/**
 * Wrapper tương thích cho nút bấm đồng bộ
 */
async function syncFromGoogleCalendar(manual = false) {
  return pullFromGCal(manual);
}

/**
 * Xử lý khi bấm nút đồng bộ trên Header (Tùy chỉnh Google Calendar hoặc Google Drive)
 */
async function triggerHeaderGCalAction() {
  const syncTarget = typeof getHeaderSyncTarget === 'function' ? getHeaderSyncTarget() : 'gcal';
  const isEn = appState.settings?.lang === 'en';
  const token = getGCalToken();

  if (syncTarget === 'gdrive') {
    if (token) {
      if (!loadSyncPrefs().gdriveEnabled) {
        showToast(isEn ? 'Google Drive Sync is disabled. Please enable it in Settings!' : 'Đồng bộ Google Drive đang tắt. Vui lòng bật trong Cài đặt!');
        if (typeof openSettingsModal === 'function') {
          openSettingsModal('tab-account-sync');
        } else {
          setView('settings');
        }
        return { skipped: true, reason: 'gdrive_disabled' };
      }
      try {
        updateGCalSyncWidget('pulling', isEn ? 'Syncing with Google Drive...' : 'Đang đồng bộ Google Drive...');
        await pullFromGoogleDrive();
        await pushToGoogleDrive({ skipPull: true });
        updateGDriveBadgeTime();
        updateGCalSyncWidget('synced', isEn ? 'Google Drive synced!' : 'Đã đồng bộ Google Drive!');
        showToast(isEn ? 'Synchronized with Google Drive successfully!' : 'Đồng bộ Google Drive thành công!');
        return { success: true, target: 'gdrive' };
      } catch (err) {
        console.error('Header GDrive sync error:', err);
        updateGCalSyncWidget('error', isEn ? 'Google Drive sync error' : 'Lỗi đồng bộ Google Drive');
        showToast(isEn ? 'Failed to sync with Google Drive: ' + (err?.message || err) : 'Lỗi đồng bộ Google Drive: ' + (err?.message || err));
        return { success: false, target: 'gdrive', error: err };
      }
    } else {
      if (appState.settings?.gcal?.clientId) {
        handleGCalLogin();
      } else {
        if (typeof openSettingsModal === 'function') {
          openSettingsModal('tab-account-sync');
        } else {
          setView('settings');
        }
        showToast(isEn ? 'Please enter Client ID in Settings to connect Google Drive!' : 'Vui lòng nhập Client ID trong Cài đặt để kết nối Google Drive!');
      }
      return { success: false, reason: 'no_token' };
    }
  }

  if (token) {
    if (!loadSyncPrefs().gcalEnabled) {
      showToast(isEn ? 'Google Calendar Sync is disabled. Please enable it in Settings!' : 'Đồng bộ Google Calendar đang tắt. Vui lòng bật trong Cài đặt!');
      if (typeof openSettingsModal === 'function') {
        openSettingsModal('tab-account-sync');
      } else {
        setView('settings');
      }
      return { skipped: true, reason: 'gcal_disabled' };
    }
    return syncFromGoogleCalendar(true);
  } else {
    if (appState.settings?.gcal?.clientId) {
      handleGCalLogin();
    } else {
      setView('settings');
      showToast('Vui lòng nhập Client ID trong Cài đặt để kết nối Google Calendar!');
      setTimeout(() => {
        const card = document.getElementById('gcal-settings-card');
        if (card) card.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  }
}

/**
 * Sao chép Origin hiện tại vào Clipboard
 */
function copyCurrentOrigin() {
  const origin = window.location.origin;
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(origin).then(() => {
      showToast(`Đã sao chép: ${origin}`);
    }).catch(() => {
      showToast(`Địa chỉ Origin: ${origin}`);
    });
  } else {
    showToast(`Địa chỉ Origin: ${origin}`);
  }
}

// Quản lý biến Timer đồng bộ nền định kỳ
let gcalAutoSyncTimer = null;

function restartGCalAutoSyncTimer() {
  if (gcalAutoSyncTimer) {
    clearInterval(gcalAutoSyncTimer);
    gcalAutoSyncTimer = null;
  }

  const syncPrefs = loadSyncPrefs();
  if (!syncPrefs.gcalEnabled) return;

  const d = (typeof window !== 'undefined' && window.d) ? window.d : (typeof appState !== 'undefined' ? appState : {});
  const isEnabled = syncPrefs.gcalEnabled && (d.settings?.gcal?.autoSync === true);
  if (!isEnabled) return;

  const seconds = Number(d.settings?.gcal?.autoSyncInterval) || 60;
  const ms = Math.max(10, seconds) * 1000;

  gcalAutoSyncTimer = setInterval(() => {
    const sp = loadSyncPrefs();
    const currD = (typeof window !== 'undefined' && window.d) ? window.d : (typeof appState !== 'undefined' ? appState : {});
    if (sp.gcalEnabled && currD.settings?.gcal?.autoSync === true && getGCalToken() && !isGcalPushing && !isGcalPulling && !getUserInteractionState()) {
      pullFromGCal(false);
    }
  }, ms);
}

// Khởi chạy timer tự động ban đầu
restartGCalAutoSyncTimer();
setupGDrivePolling();

// Khởi tạo Google Identity Services và kéo dữ liệu khi tải trang
setTimeout(() => {
  initGSI();
  const syncPrefs = loadSyncPrefs();
  const d = (typeof window !== 'undefined' && window.d) ? window.d : (typeof appState !== 'undefined' ? appState : {});
  if (syncPrefs.gcalEnabled && d.settings?.gcal?.autoSyncOnOpen === true && getGCalToken()) {
    syncFromGoogleCalendar(false);
  } else {
    updateGCalSyncWidget('idle');
  }
  if (syncPrefs.gdriveEnabled && d.settings?.gdrive?.autoSyncOnOpen === true && getGCalToken()) {
    autoSyncGDriveOnOpen();
  }
}, 1200);

// Export các hàm toàn cục cho onclick events & module interop
window.appState = appState;
window.translations = translations;
window.GCAL_EVENT_COLORS = GCAL_EVENT_COLORS;
window.DEFAULT_GCAL_COLOR_MAPPING = DEFAULT_GCAL_COLOR_MAPPING;
window.getGCalColorObj = getGCalColorObj;
window.getTaskGCalColorId = getTaskGCalColorId;
window.t = t;
window.timeToMinutes = timeToMinutes;
window.minutesToTime = minutesToTime;
window.formatDuration = formatDuration;
window.isItemActiveOnDate = isItemActiveOnDate;
window.getRepeatLabel = getRepeatLabel;
// ==========================================
// 14. MODAL THỐNG KÊ NĂNG SUẤT & INSIGHTS
// ==========================================
function calculateProductivityStats(targetDate = selectedDate) {
  const calcRes = calculateFreeTimeSlots(targetDate);
  const freeSlots = (calcRes && Array.isArray(calcRes.freeSlots)) ? calcRes.freeSlots : [];
  const threshold = (appState && appState.settings && appState.settings.focusThresholdMinutes) || 30;

  let totalFreeMins = 0;
  let focusLongMins = 0;
  let focusShortMins = 0;
  let distractLongMins = 0;
  let distractShortMins = 0;

  freeSlots.forEach(slot => {
    if (!slot) return;
    const dur = Number(slot.duration) || 0;
    totalFreeMins += dur;
    if (slot.isQuiet) {
      if (dur >= threshold) focusLongMins += dur;
      else focusShortMins += dur;
    } else {
      if (dur >= threshold) distractLongMins += dur;
      else distractShortMins += dur;
    }
  });

  const deepFocusTotalMins = focusLongMins + focusShortMins;
  const distractTotalMins = distractLongMins + distractShortMins;
  const focusPct = totalFreeMins > 0 ? Math.round((deepFocusTotalMins / totalFreeMins) * 100) : 0;

  const dayTasks = (appState && Array.isArray(appState.tasks)) ? appState.tasks.filter(t => t && isItemActiveOnDate(t, targetDate)) : [];
  const totalTasks = dayTasks.length;
  const completedTasks = dayTasks.filter(t => isTaskDoneOnDate(t, targetDate)).length;
  const scheduledTasks = dayTasks.filter(t => !!getTaskAssignedSlot(t, targetDate)).length;
  const unassignedTasks = totalTasks - scheduledTasks;
  const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const q1Count = dayTasks.filter(t => t.isImportant && t.isUrgent).length;
  const q2Count = dayTasks.filter(t => t.isImportant && !t.isUrgent).length;
  const q3Count = dayTasks.filter(t => !t.isImportant && t.isUrgent).length;
  const q4Count = dayTasks.filter(t => !t.isImportant && !t.isUrgent).length;

  return {
    totalFreeMins,
    deepFocusTotalMins,
    distractTotalMins,
    focusLongMins,
    focusShortMins,
    distractLongMins,
    distractShortMins,
    focusPct,
    totalTasks,
    completedTasks,
    scheduledTasks,
    unassignedTasks,
    completionPct,
    q1Count,
    q2Count,
    q3Count,
    q4Count,
    freeSlotsCount: freeSlots.length
  };
}

function getStreakTier(streakCount) {
  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
  if (streakCount >= 30) return isEn ? 'Diamond Legend (30+ Days)' : 'Huyền Thoại Kim Cương (30+ ngày)';
  if (streakCount >= 21) return isEn ? 'Productivity Master (21-29 Days)' : 'Bậc Thầy Năng Suất (21-29 ngày)';
  if (streakCount >= 14) return isEn ? 'Unstoppable Momentum (14-20 Days)' : 'Duy Trì Bền Bỉ (14-20 ngày)';
  if (streakCount >= 7) return isEn ? 'Iron Week Warrior (7-13 Days)' : 'Tuần Lễ Thép (7-13 ngày)';
  if (streakCount >= 3) return isEn ? 'Momentum Builder (3-6 Days)' : 'Bứt Phá Tốc Độ (3-6 ngày)';
  if (streakCount >= 1) return isEn ? 'Discipline Sprout (1-2 Days)' : 'Khởi Đầu Kỷ Luật (1-2 ngày)';
  return isEn ? 'Ready for Day 1' : 'Sẵn sàng khởi đầu Ngày 1';
}

function renderStreakHeatmapHtml(targetDateStr = selectedDate) {
  if (typeof window === 'undefined' || !window.StreakEngine) return '';
  const [yStr, mStr] = targetDateStr.split('-');
  const y = parseInt(yStr, 10);
  const m = parseInt(mStr, 10);
  const monthStats = window.StreakEngine.getMonthStats(y, m);
  const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';

  const firstDayOfWeek = new Date(y, m - 1, 1).getDay(); // 0: CN, 1: T2...
  const dayHeaders = isEn ? ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] : ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

  let cellsHtml = '';
  // Empty offset cells
  for (let i = 0; i < firstDayOfWeek; i++) {
    cellsHtml += `<div class="streak-heatmap-cell empty" style="opacity:0.2;"></div>`;
  }

  // Month days
  monthStats.dayDetails.forEach(d => {
    const ov = appState?.streakDayOverrides?.[d.date];
    const isRelievedDay = ov && !ov.deleted && ov.source === 'weeklyRelief';
    const status = isRelievedDay ? 'relieved' : d.status.toLowerCase();
    const isSelectedDay = d.date === targetDateStr;
    let titleText = `${formatDisplayDate(d.date)}`;
    if (isRelievedDay) {
      titleText += ` • ${isEn ? 'Relief Day (Reduced Threshold)' : 'Ngày Giảm Áp (Hạ Ngưỡng)'}: ${d.metrics.completed}/${d.metrics.total} tasks`;
    } else if (d.status === 'STREAK') {
      titleText += ` • ${isEn ? 'Streak Met' : 'Đạt Chuỗi'}: ${d.metrics.completed}/${d.metrics.total} tasks (${Math.round(d.metrics.rate * 100)}%)`;
    } else if (d.status === 'FROZEN') {
      titleText += ` • ${isEn ? 'Streak Frozen (Protected)' : 'Đóng Băng Bảo Vệ Chuỗi'}: ${d.metrics.completed}/${d.metrics.total} tasks`;
    } else if (d.status === 'MISSED') {
      titleText += ` • ${isEn ? 'Missed Streak' : 'Lỡ Chuỗi'}: ${d.metrics.completed}/${d.metrics.total} tasks`;
    } else if (d.status === 'PENDING') {
      titleText += ` • ${isEn ? 'Today in Progress' : 'Đang thực hiện hôm nay'}: ${d.metrics.completed}/${d.metrics.total} tasks`;
    } else {
      titleText += ` • ${isEn ? 'No Eisenhower tasks' : 'Không có task Eisenhower'}`;
    }

    cellsHtml += `
      <div class="streak-heatmap-cell ${status} ${isSelectedDay ? 'is-selected-day' : ''}" 
           title="${escapeHtml(titleText)}" 
           onclick="selectDateAndGoToDay('${d.date}'); closeModal();">
        <span>${d.day}</span>
      </div>
    `;
  });

  const consistencyPct = Math.round(monthStats.consistencyRate * 100);

  return `
    <div class="streak-heatmap-card">
      <div class="streak-heatmap-header">
        <div class="streak-heatmap-title">
          <span>${isEn ? `Discipline Matrix (Month ${m}/${y})` : `Ma Trận Kỷ Luật (Tháng ${m}/${y})`}</span>
        </div>
        <span class="streak-heatmap-rate">
          ${isEn ? `Consistency: ${consistencyPct}%` : `Tỷ lệ duy trì: ${consistencyPct}%`}
        </span>
      </div>

      <div style="display:grid; grid-template-columns:repeat(7, 1fr); gap:4px; text-align:center; font-size:10px; font-weight:700; color:var(--text-muted); margin-bottom:2px;">
        ${dayHeaders.map(h => `<div>${h}</div>`).join('')}
      </div>

      <div class="streak-heatmap-grid">
        ${cellsHtml}
      </div>

      <div class="streak-heatmap-legend">
        <span class="heatmap-legend-item"><span class="heatmap-legend-dot streak"></span> ${isEn ? 'Goal Met' : 'Đạt Chuỗi'}</span>
        <span class="heatmap-legend-item"><span class="heatmap-legend-dot frozen"></span> ${isEn ? 'Frozen' : 'Đóng Băng'}</span>
        <span class="heatmap-legend-item"><span class="heatmap-legend-dot" style="background:#8b5cf6; width:8px; height:8px; border-radius:50%; display:inline-block;"></span> ${isEn ? 'Relief Day' : 'Ngày Giảm Áp'}</span>
        <span class="heatmap-legend-item"><span class="heatmap-legend-dot missed"></span> ${isEn ? 'Missed' : 'Lỡ Chuỗi'}</span>
        <span class="heatmap-legend-item"><span class="heatmap-legend-dot pending"></span> ${isEn ? 'Today' : 'Hôm Nay'}</span>
      </div>
    </div>
  `;
}

function applyWeeklyReliefFromModal(targetDate, val) {
  if (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.applyWeeklyRelief === 'function') {
    const success = window.StreakEngine.applyWeeklyRelief(targetDate, val);
    if (success) {
      const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
      showToast(isEn ? `Weekly relief applied for ${targetDate}!` : `Đã áp dụng ngày giảm áp cho ${targetDate}!`);
      openProductivityModal(targetDate);
    }
  }
}
window.applyWeeklyReliefFromModal = applyWeeklyReliefFromModal;

function setStreakThresholdFromModal(val) {
  if (typeof window !== 'undefined' && window.StreakEngine) {
    const isEn = typeof appState !== 'undefined' && appState?.settings?.lang === 'en';
    const canEdit = typeof window.StreakEngine.canChangeThreshold === 'function' ? window.StreakEngine.canChangeThreshold() : (new Date().getDay() === 0);
    if (!canEdit) {
      showToast(isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng chuẩn chuỗi kỷ luật vào Chủ Nhật!');
      return;
    }
    window.StreakEngine.setThreshold(val);
    showToast(isEn ? `Streak threshold set to ${Math.round(val * 100)}%!` : `Đã cập nhật ngưỡng hoàn thành: ${Math.round(val * 100)}%!`);
    openProductivityModal(selectedDate);
  }
}
window.setStreakThresholdFromModal = setStreakThresholdFromModal;

function triggerStreakCelebration(streakCount) {
  if (typeof document === 'undefined') return;
  const overlay = document.createElement('div');
  overlay.className = 'streak-celebration-overlay';

  const colors = ['#f59e0b', '#ef4444', '#10b981', '#0284c7', '#8b5cf6', '#ec4899', '#facc15'];
  for (let i = 0; i < 40; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDelay = `${Math.random() * 0.8}s`;
    piece.style.animationDuration = `${2 + Math.random() * 2}s`;
    piece.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    overlay.appendChild(piece);
  }

  document.body.appendChild(overlay);
  setTimeout(() => {
    if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
  }, 4000);
}
window.triggerStreakCelebration = triggerStreakCelebration;

function openProductivityModal(targetDate = selectedDate) {
  const threshold = Number(appState?.settings?.focusThresholdMinutes) || 30;
  const stats = calculateProductivityStats(targetDate);
  const {
    totalFreeMins,
    focusLongMins,
    focusShortMins,
    distractLongMins,
    distractShortMins,
    deepFocusTotalMins,
    distractTotalMins,
    focusPct,
    totalTasks,
    completedTasks,
    scheduledTasks,
    unassignedTasks,
    completionPct,
    q1Count,
    q2Count,
    q3Count,
    q4Count,
    freeSlotsCount
  } = stats;
  const freeSlots = (calculateFreeTimeSlots(targetDate)?.freeSlots) || [];

  const isEn = appState && appState.settings && appState.settings.lang === 'en';
  const fmtHours = (mins) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    if (h === 0) return `${m} ${t('minShort')}`;
    return m > 0 ? `${h}h ${m}${t('minShort')}` : `${h}h`;
  };

  // Streak Engine State
  const streakState = (typeof window !== 'undefined' && window.StreakEngine) ? window.StreakEngine.getState() : {
    currentStreak: 0,
    bestStreak: 0,
    freezeCount: 0,
    maxFreeze: 2,
    cleanDays: 0,
    threshold: 0.7,
    todayMetrics: { total: 0, completed: 0, rate: 0, isMet: false, neededCount: 0 }
  };

  const streakTargetPercent = Math.round((streakState.threshold || 0.7) * 100);
  const cleanDaysWidth = Math.min(100, Math.round((streakState.cleanDays / 7) * 100));
  const daysUntilNextFreeze = 7 - (streakState.cleanDays || 0);
  const tierTitle = getStreakTier(streakState.currentStreak || 0);

  const targetMetrics = (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.getDayTaskMetrics === 'function')
    ? window.StreakEngine.getDayTaskMetrics(targetDate)
    : { total: 0, completed: 0, neededCount: 0, isMet: false, rate: 0 };
  const targetEffectiveThresh = (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.effectiveThreshold === 'function')
    ? window.StreakEngine.effectiveThreshold(targetDate)
    : 0.7;
  const targetThreshPct = Math.round(targetEffectiveThresh * 100);
  const canRelief = (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.canUseWeeklyRelief === 'function')
    ? window.StreakEngine.canUseWeeklyRelief(targetDate)
    : true;
  const isSunday = (typeof window !== 'undefined' && window.StreakEngine && typeof window.StreakEngine.canChangeThreshold === 'function')
    ? window.StreakEngine.canChangeThreshold()
    : (new Date().getDay() === 0);

  openModal(`
    <div class="modal-header">
      <h3 class="modal-title">${isEn ? 'Discipline Streak & Productivity Hub' : 'Chuỗi Kỷ Luật & Trung Tâm Năng Suất'}</h3>
      <button type="button" class="icon-btn modal-close-btn" onclick="closeModal()" title="Đóng (Esc)" aria-label="Đóng">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
    <div class="modal-body" style="max-height:82vh; overflow-y:auto; display:flex; flex-direction:column; gap:14px; padding:16px;">
      
      <!-- STREAK HERO BANNER -->
      <div class="streak-hero-card">
        <div class="streak-hero-top">
          <div class="streak-hero-title-wrap">
            <div class="streak-hero-number">${streakState.currentStreak || 0} ${isEn ? 'Days Streak' : 'Ngày Liên Tiếp'}</div>
            <div class="streak-hero-tier">${tierTitle}</div>
          </div>
          <div class="streak-hero-pills">
            <span class="streak-pill-record">${isEn ? 'Best' : 'Kỷ Lục'}: <strong>${streakState.bestStreak || 0} ${isEn ? 'days' : 'ngày'}</strong></span>
            <span class="streak-pill-freeze">${isEn ? 'Freeze Shields' : 'Khiên Đóng Băng'}: <strong>${streakState.freezeCount || 0}/${streakState.maxFreeze || 2}</strong></span>
          </div>
        </div>

        <!-- Clean Days Progress Bar -->
        <div class="streak-clean-days-box">
          <div class="streak-clean-days-label-row">
            <span>${isEn ? 'Freeze Accumulation Progress' : 'Tiến độ tích lũy Khiên Đóng Băng'}</span>
            <span><strong>${streakState.cleanDays || 0}/7</strong> ${isEn ? 'clean days' : 'ngày sạch'}</span>
          </div>
          <div class="streak-clean-days-bar-track">
            <div class="streak-clean-days-bar-fill" style="width: ${cleanDaysWidth}%;"></div>
          </div>
          <div class="streak-clean-days-hint">
            ${streakState.freezeCount >= 2 
              ? (isEn ? 'Maximum freeze shields reached (2/2). Your streak is fully protected.' : 'Bạn đã tích lũy tối đa 2/2 Khiên Đóng Băng. Chuỗi kỷ luật luôn được bảo hộ an toàn.') 
              : (isEn ? `Maintain ${daysUntilNextFreeze} more consecutive goal day(s) to earn +1 Freeze Shield.` : `Đạt chuẩn thêm ${daysUntilNextFreeze} ngày liên tiếp để nhận thêm +1 Khiên Đóng Băng.`)}
          </div>
        </div>
      </div>

      <!-- SELECTED DATE'S STREAK QUEST TRACKER -->
      <div class="streak-today-quest">
        <div class="streak-quest-left">
          <div class="streak-quest-title">
            <span>${isEn ? 'Discipline Goal for ' + formatDisplayDate(targetDate) : 'Mục Tiêu Kỷ Luật Ngày ' + formatDisplayDate(targetDate)}</span>
            <span style="font-size:11px; font-weight:600; color:var(--text-muted);">(${isEn ? 'Target' : 'Ngưỡng'}: ≥${targetThreshPct}%)</span>
          </div>
          <div class="streak-quest-sub">
            ${targetMetrics.total === 0 
              ? (isEn ? 'No Eisenhower tasks for this date.' : 'Chưa có task Eisenhower nào cho ngày này.')
              : (isEn 
                  ? `Completed ${targetMetrics.completed}/${targetMetrics.total} tasks (${Math.round(targetMetrics.rate * 100)}%)` 
                  : `Đã hoàn thành ${targetMetrics.completed}/${targetMetrics.total} task Eisenhower (${Math.round(targetMetrics.rate * 100)}%)`)}
          </div>
        </div>
        <div>
          ${targetMetrics.isMet ? `
            <span class="streak-quest-badge met">
              ${isEn ? 'Goal Met (+1)' : 'Đã Đạt Chuỗi (+1)'}
            </span>
          ` : (targetMetrics.total > 0 ? `
            <span class="streak-quest-badge pending">
              ${isEn ? `Need +${targetMetrics.neededCount} tasks` : `Cần +${targetMetrics.neededCount} task`}
            </span>
          ` : `
            <span class="streak-quest-badge empty">
              ${isEn ? 'No tasks' : 'Chưa có task'}
            </span>
          `)}
        </div>
      </div>

      <!-- MONTH STREAK HEATMAP -->
      ${renderStreakHeatmapHtml(targetDate)}

      <!-- WEEKLY RELIEF / NGÀY GIẢM ÁP SECTION -->
      <div class="streak-threshold-card" style="border-left: 3px solid #8b5cf6;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <strong style="font-size:12.5px; color:var(--text-primary); font-weight:700;">
            ${isEn ? 'Weekly Relief Day (1/week)' : 'Ngày Giảm Áp (1 lần/tuần)'}
          </strong>
          <span style="font-size:11px; font-weight:600; color:${canRelief ? '#8b5cf6' : '#ea580c'};">
            ${canRelief ? (isEn ? 'Available' : 'Còn lượt') : (isEn ? 'Used this week' : 'Đã dùng tuần này')}
          </span>
        </div>
        <div style="font-size:11.5px; color:var(--text-muted); margin-bottom:8px;">
          ${isEn 
            ? 'Lower the completion threshold for this specific day (must be lower than current effective threshold).' 
            : 'Hạ thấp ngưỡng hoàn thành cho riêng ngày này (chỉ cho phép chọn mức thấp hơn ngưỡng hiện tại).'}
        </div>
        ${canRelief ? `
          <div class="streak-threshold-chips">
            ${[0.5, 0.7, 0.8].filter(lvl => lvl < targetEffectiveThresh).map(lvl => `
              <button type="button" class="streak-threshold-chip" style="background:#ede9fe; color:#5b21b6; border-color:#ddd6fe;" onclick="applyWeeklyReliefFromModal('${targetDate}', ${lvl})">
                ${isEn ? `Relief to ${Math.round(lvl * 100)}%` : `Giảm áp còn ${Math.round(lvl * 100)}%`}
              </button>
            `).join('')}
            ${[0.5, 0.7, 0.8].filter(lvl => lvl < targetEffectiveThresh).length === 0 ? `
              <span style="font-size:11.5px; color:var(--text-muted); font-style:italic;">${isEn ? 'Current threshold is already at minimum (50%).' : 'Ngưỡng hiện tại đã ở mức tối thiểu (50%).'}</span>
            ` : ''}
          </div>
        ` : `
          <div style="font-size:11.5px; color:#b45309; font-weight:600; background:#fef3c7; padding:6px 10px; border-radius:6px; display:flex; align-items:center; gap:6px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${isEn ? 'Weekly relief has already been used in this ISO week.' : 'Bạn đã sử dụng Cứu Trợ Tuần trong tuần này rồi.'}</span>
          </div>
        `}
      </div>

      <!-- THRESHOLD CUSTOMIZATION -->
      <div class="streak-threshold-card">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <strong style="font-size:12.5px; color:var(--text-primary); font-weight:700;">${isEn ? 'Daily Completion Threshold' : 'Ngưỡng Hoàn Thành Giữ Chuỗi'}</strong>
          <span style="font-size:11px; color:var(--text-muted);">${isEn ? 'Selected' : 'Đang chọn'}: <strong>${streakTargetPercent}%</strong></span>
        </div>
        ${!isSunday ? `
          <div style="font-size:11.5px; color:#ea580c; font-weight:600; margin-top:4px; display:flex; align-items:center; gap:4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            <span>${isEn ? 'Standard threshold can only be edited on Sundays.' : 'Ngưỡng chuẩn toàn cục chỉ được phép thay đổi vào Chủ Nhật.'}</span>
          </div>
        ` : ''}
        <div class="streak-threshold-chips">
          <button type="button" class="streak-threshold-chip ${streakTargetPercent === 50 ? 'active' : ''} ${!isSunday ? 'disabled' : ''}" ${!isSunday ? 'disabled title="' + (isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng kỷ luật vào Chủ Nhật!') + '" style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="setStreakThresholdFromModal(0.5)">50% (${isEn ? 'Easy' : 'Thoải mái'})</button>
          <button type="button" class="streak-threshold-chip ${streakTargetPercent === 70 ? 'active' : ''} ${!isSunday ? 'disabled' : ''}" ${!isSunday ? 'disabled title="' + (isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng kỷ luật vào Chủ Nhật!') + '" style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="setStreakThresholdFromModal(0.7)">70% (${isEn ? 'Standard' : 'Chuẩn khuyến nghị'})</button>
          <button type="button" class="streak-threshold-chip ${streakTargetPercent === 80 ? 'active' : ''} ${!isSunday ? 'disabled' : ''}" ${!isSunday ? 'disabled title="' + (isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng kỷ luật vào Chủ Nhật!') + '" style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="setStreakThresholdFromModal(0.8)">80% (${isEn ? 'High Focus' : 'Kỷ luật cao'})</button>
          <button type="button" class="streak-threshold-chip ${streakTargetPercent === 100 ? 'active' : ''} ${!isSunday ? 'disabled' : ''}" ${!isSunday ? 'disabled title="' + (isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng kỷ luật vào Chủ Nhật!') + '" style="opacity:0.5; cursor:not-allowed;"' : ''} onclick="setStreakThresholdFromModal(1.0)">100% (${isEn ? 'Perfection' : 'Tuyệt đối'})</button>
        </div>
      </div>

      <!-- DATE & FREE TIME BANNER -->
      <div class="productivity-date-banner">
        <div>
          <div class="date-banner-title">${formatDisplayDate(targetDate)}</div>
          <div class="date-banner-sub">
            ${t('productivityTotalFreeSummary', { hours: fmtHours(totalFreeMins), slotsCount: freeSlots.length })}
          </div>
        </div>
        <span class="smart-pill productivity-focus-pill">
          ${focusPct}% ${t('focusRate')}
        </span>
      </div>

      <!-- TIME DISTRIBUTION GRID -->
      <div class="productivity-stat-grid">
        <div class="productivity-stat-box focus">
          <div class="stat-box-label">${t('deepFocusTime')}</div>
          <div class="stat-box-val">${fmtHours(deepFocusTotalMins)}</div>
          <div class="productivity-subtext">
            ${t('focusLongAndShortSub', { longMins: focusLongMins, threshold: threshold, shortMins: focusShortMins })}
          </div>
        </div>
        <div class="productivity-stat-box distract">
          <div class="stat-box-label">${t('distractTime')}</div>
          <div class="stat-box-val">${fmtHours(distractTotalMins)}</div>
          <div class="productivity-subtext">
            ${t('distractLongAndShortSub', { longMins: distractLongMins, shortMins: distractShortMins })}
          </div>
        </div>
        <div class="productivity-stat-box completion">
          <div class="stat-box-label">${t('completionRate')}</div>
          <div class="stat-box-val">${completionPct}%</div>
          <div class="productivity-subtext">${completedTasks} / ${totalTasks} ${t('tasksDoneLabel')}</div>
        </div>
        <div class="productivity-stat-box scheduled">
          <div class="stat-box-label">${t('scheduledRate')}</div>
          <div class="stat-box-val">${scheduledTasks} / ${totalTasks}</div>
          <div class="productivity-subtext">${unassignedTasks > 0 ? t('unassignedTasksCount', { count: unassignedTasks }) : t('allTasksScheduledLabel')}</div>
        </div>
      </div>

      <!-- EISENHOWER DISTRIBUTION -->
      <div class="productivity-eisenhower-card">
        <div class="eisenhower-card-title">${t('eisenhowerDistribution')}</div>
        <div class="eisenhower-grid">
          <div class="stat-eisen-box q1">
            <div class="stat-eisen-label">${t('q1Short')}</div>
            <div class="stat-eisen-val">${q1Count}</div>
          </div>
          <div class="stat-eisen-box q2">
            <div class="stat-eisen-label">${t('q2Short')}</div>
            <div class="stat-eisen-val">${q2Count}</div>
          </div>
          <div class="stat-eisen-box q3">
            <div class="stat-eisen-label">${t('q3Short')}</div>
            <div class="stat-eisen-val">${q3Count}</div>
          </div>
          <div class="stat-eisen-box q4">
            <div class="stat-eisen-label">${t('q4Short')}</div>
            <div class="stat-eisen-val">${q4Count}</div>
          </div>
        </div>
      </div>

      <!-- OPTIMIZATION INSIGHTS -->
      <div class="productivity-insights-card">
        <div class="insights-card-title">${t('smartInsightsTitle')}</div>
        <ul class="insights-list">
          <li>${unassignedTasks > 0 ? t('insightUnassigned', { count: unassignedTasks }) : t('insightAllScheduled')}</li>
          ${q1Count > 3 ? `<li>${t('insightQ1Heavy')}</li>` : ''}
          <li>${deepFocusTotalMins >= 120 ? t('insightDeepFocusHigh', { hours: fmtHours(deepFocusTotalMins) }) : t('insightDeepFocusLow')}</li>
        </ul>
      </div>

    </div>
    <div class="modal-footer">
      ${unassignedTasks > 0 ? `
        <button class="btn-primary" onclick="closeModal(); autoMatchAllTasks();" style="margin-right:auto;">
          ${t('autoMatchAll')}
        </button>
      ` : ''}
      <button class="btn-secondary" onclick="closeModal()">${t('cancelBtn')}</button>
    </div>
  `);
}

window.getTaskAssignedSlot = getTaskAssignedSlot;
window.isTaskDoneOnDate = isTaskDoneOnDate;
window.toggleTaskDone = toggleTaskDone;
function toggleTheme() {
  const isDarkNow = document.documentElement.classList.contains('dark-theme') || (document.body && document.body.classList.contains('dark-theme'));
  const newTheme = isDarkNow ? 'light' : 'dark';

  if (newTheme === 'dark') {
    document.documentElement.classList.add('dark-theme');
    if (document.body) document.body.classList.add('dark-theme');
  } else {
    document.documentElement.classList.remove('dark-theme');
    if (document.body) document.body.classList.remove('dark-theme');
  }

  try {
    localStorage.setItem('chronoflow_theme', newTheme);
  } catch (e) {}

  if (typeof appState !== 'undefined' && appState && appState.settings) {
    appState.settings.theme = newTheme;
  }

  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const iconSpan = document.getElementById('theme-toggle-icon');
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const iconSettings = document.getElementById('theme-toggle-icon-settings');
  const isDark = theme === 'dark' || (typeof document !== 'undefined' && (document.documentElement.classList.contains('dark-theme') || (document.body && document.body.classList.contains('dark-theme'))));

  if (iconSpan) {
    iconSpan.innerHTML = isDark 
      ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`
      : `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;
  }
  if (toggleBtn) {
    toggleBtn.setAttribute('title', isDark ? 'Chuyển sang Giao diện Sáng (Light Mode)' : 'Chuyển sang Giao diện Tối (Dark Mode)');
  }
  if (iconSettings) {
    const isEn = typeof appState !== 'undefined' && appState && appState.settings && appState.settings.lang === 'en';
    iconSettings.textContent = isDark ? (isEn ? 'Light Mode' : 'Giao diện Sáng') : (isEn ? 'Dark Mode' : 'Giao diện Tối');
  }
  const statusPill = document.getElementById('theme-status-pill-settings');
  if (statusPill) {
    const isEn = typeof appState !== 'undefined' && appState && appState.settings && appState.settings.lang === 'en';
    statusPill.textContent = isDark ? (isEn ? 'Dark Mode (Active)' : 'Giao diện Tối (Đang bật)') : (isEn ? 'Light Mode (Active)' : 'Giao diện Sáng (Mặc định)');
  }

  if (typeof renderMobileQuickFab === 'function') {
    renderMobileQuickFab();
  }
}

function applyInitialTheme() {
  try {
    const savedTheme = localStorage.getItem('chronoflow_theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

    if (isDark) {
      document.documentElement.classList.add('dark-theme');
      if (document.body) document.body.classList.add('dark-theme');
    } else {
      document.documentElement.classList.remove('dark-theme');
      if (document.body) document.body.classList.remove('dark-theme');
    }

    if (typeof appState !== 'undefined' && appState && appState.settings) {
      appState.settings.theme = isDark ? 'dark' : 'light';
    }

    updateThemeIcon(isDark ? 'dark' : 'light');
  } catch (e) {}
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyInitialTheme);
  } else {
    applyInitialTheme();
  }
}

window.calculateFreeTimeSlots = calculateFreeTimeSlots;
window.findBestFreeSlotForTask = findBestFreeSlotForTask;
window.assignTaskToSlot = assignTaskToSlot;
window.calculateTaskPlacementInSlot = calculateTaskPlacementInSlot;
window.getTransitionSettings = getTransitionSettings;
window.eventHasTransition = eventHasTransition;
window.calculateTransitionBufferBetween = calculateTransitionBufferBetween;
window.getAllEventsOnDate = getAllEventsOnDate;
window.unassignTask = unassignTask;
window.autoMatchAllTasks = autoMatchAllTasks;
window.renderApp = renderApp;
window.renderSidebar = renderSidebar;
window.renderDayView = renderDayView;
window.renderMonthView = renderMonthView;
window.renderYearView = renderYearView;
window.renderEisenhowerView = renderEisenhowerView;
window.renderSettingsView = renderSettingsView;
window.renderGCalColorMappingSection = renderGCalColorMappingSection;
window.setView = setView;
window.formatDateToYMD = formatDateToYMD;
window.getPreviousDateStr = getPreviousDateStr;
window.getNextDateStr = getNextDateStr;
window.formatDisplayDate = formatDisplayDate;
window.changeDate = changeDate;
window.changeMonth = changeMonth;
window.changeYear = changeYear;
window.goToToday = goToToday;
window.selectDateAndGoToDay = selectDateAndGoToDay;
window.selectMonthAndGo = selectMonthAndGo;
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;
window.applyInitialTheme = applyInitialTheme;
window.toggleLanguage = toggleLanguage;
window.toggleSidebar = toggleSidebar;
window.applyInitialSidebarState = applyInitialSidebarState;
window.toggleMobileSidebar = toggleSidebar;
window.openModal = openModal;
window.closeModal = closeModal;
window.openAddTaskModal = openAddTaskModal;
window.submitAddTask = submitAddTask;
window.openEditTaskModal = openEditTaskModal;
window.submitEditTask = submitEditTask;
window.deleteTask = deleteTask;
window.openAddFixedEventModal = openAddFixedEventModal;
window.openEditFixedEventModal = openEditFixedEventModal;
window.submitFixedEvent = submitFixedEvent;
window.deleteFixedEvent = deleteFixedEvent;
window.openAddTransientEventModal = openAddTransientEventModal;
window.openEventChoiceModal = openEventChoiceModal;
window.openEditTransientEventModal = openEditTransientEventModal;
window.submitTransientEvent = submitTransientEvent;
window.deleteTransientEvent = deleteTransientEvent;
window.openAddNoisyIntervalModal = openAddNoisyIntervalModal;
window.openEditNoisyIntervalModal = openEditNoisyIntervalModal;
window.submitNoisyInterval = submitNoisyInterval;
window.confirmDeleteNoisyInterval = confirmDeleteNoisyInterval;
window.excludeNoisyIntervalDate = excludeNoisyIntervalDate;
window.deleteNoisyInterval = deleteNoisyInterval;
window.openAddNoteModal = openAddNoteModal;
window.submitAddNote = submitAddNote;
window.deleteNote = deleteNote;
window.openFreeSlotModal = openFreeSlotModal;
window.promptScheduleTask = promptScheduleTask;
window.setSlotTagOverride = setSlotTagOverride;
window.toggleSlotTagDirect = toggleSlotTagDirect;
window.openDailyGoalModal = openDailyGoalModal;
window.submitDailyGoal = submitDailyGoal;
window.openYearGoalModal = openYearGoalModal;
window.submitYearGoal = submitYearGoal;
window.openAddMonthGoalModal = openAddMonthGoalModal;
window.submitMonthGoal = submitMonthGoal;
window.previewFocusThreshold = previewFocusThreshold;
window.updateFocusThreshold = updateFocusThreshold;
window.resetDefaultColors = resetDefaultColors;
window.updateColorSetting = updateColorSetting;
window.toggleFocusDimming = toggleFocusDimming;
window.setMonthZoom = setMonthZoom;
window.zoomMonth = zoomMonth;
window.handleBlockClick = handleBlockClick;
window.handleDragStart = handleDragStart;
window.handleSlotDragOver = handleSlotDragOver;
window.handleSlotDrop = handleSlotDrop;
window.exportDataToFile = exportDataToFile;
window.downloadOfflineHtmlApp = downloadOfflineHtmlApp;
window.importDataFromFile = importDataFromFile;
window.resetToDefaultData = resetToDefaultData;
window.confirmExportData = confirmExportData;
window.executeExportData = executeExportData;
window.handleFileSelectForImport = handleFileSelectForImport;
window.executeImportData = executeImportData;
window.confirmResetToDefaultData = confirmResetToDefaultData;
window.executeResetToBlankData = executeResetToBlankData;
window.openCountdownConfirmModal = openCountdownConfirmModal;
window.loadData = loadData;
window.saveData = saveData;
window.saveTask = saveTask;
window.saveFixedEvent = saveFixedEvent;

window.promptRecurringScope = promptRecurringScope;
window.selectRecurringOption = selectRecurringOption;
window.confirmRecurringScopeAction = confirmRecurringScopeAction;
window.handleRecurrenceTypeChange = handleRecurrenceTypeChange;
window.getRecurrenceFromForm = getRecurrenceFromForm;
window.renderRecurrenceInputs = renderRecurrenceInputs;
window.syncRecurrenceDate = syncRecurrenceDate;
window.updateTaskQuadrantPreview = updateTaskQuadrantPreview;
window.renderUnifiedTaskModalHtml = renderUnifiedTaskModalHtml;
window.openProductivityModal = openProductivityModal;
window.triggerGlobalUndo = triggerGlobalUndo;
window.showToast = showToast;
window.toggleManualStartTime = toggleManualStartTime;
window.toggleSidebarSection = toggleSidebarSection;
window.cycleFreeTimeMode = cycleFreeTimeMode;
window.updateFreeTimeDisplayModeSetting = updateFreeTimeDisplayModeSetting;

window.handleGCalLogin = handleGCalLogin;
window.handleGCalLogout = handleGCalLogout;
window.saveGCalCredentials = saveGCalCredentials;
window.toggleAutoSyncSettingsRow = toggleAutoSyncSettingsRow;
window.pushAllToGCal = pushAllToGCal;
window.pushAllScheduledTasks = pushAllToGCal;
window.restartGCalAutoSyncTimer = restartGCalAutoSyncTimer;
window.syncFromGoogleCalendar = syncFromGoogleCalendar;
window.triggerHeaderGCalAction = triggerHeaderGCalAction;
window.copyCurrentOrigin = copyCurrentOrigin;
window.pushTaskToGCal = pushTaskToGCal;
window.pushTransientEventToGCal = pushTransientEventToGCal;
window.pushNoteToGCal = pushNoteToGCal;
window.updateGCalColorMapping = updateGCalColorMapping;
window.resetGCalColorMapping = resetGCalColorMapping;
window.resetSingleGCalColor = resetSingleGCalColor;
window.setGCalColorMappingMode = setGCalColorMappingMode;

// Step 1: Tagging & Anti-race condition exports
window.createChronoFlowTag = createChronoFlowTag;
window.extractChronoFlowTag = extractChronoFlowTag;
window.stripChronoFlowTags = stripChronoFlowTags;
window.appendOrUpdateChronoFlowTag = appendOrUpdateChronoFlowTag;
window.getUserInteractionState = getUserInteractionState;
window.setUserInteractionState = setUserInteractionState;

// Step 2: Master PUSH engine & Debounce exports
window.buildGCalRRULE = buildGCalRRULE;
window.scheduleDebouncedPush = scheduleDebouncedPush;
window.pushToGCal = pushToGCal;
window.pushFixedEventToGCal = pushFixedEventToGCal;

// Step 3: Master PULL engine export
window.pullFromGCal = pullFromGCal;

// Step 4: Attention Energy Engine & Smart Auto-Match
window.getBaseAttentionScore = getBaseAttentionScore;
window.calculateAttentionScore = calculateAttentionScore;
window.calculateTimelineAttentionWithFatigue = calculateTimelineAttentionWithFatigue;
window.calculateAttentionEnergyTimeline = calculateAttentionEnergyTimeline;
window.findBestFreeSlotForTask = findBestFreeSlotForTask;
window.getSessionRange = getSessionRange;
window.autoMatchAllTasks = autoMatchAllTasks;
window.calculateProductivityStats = calculateProductivityStats;
window.quickMoveTaskQuadrant = quickMoveTaskQuadrant;
window.handleQuadrantDragOver = handleQuadrantDragOver;
window.handleQuadrantDrop = handleQuadrantDrop;

// Multi-day Timeline View exports (1, 3, 7 days)
window.getTimelineDates = getTimelineDates;
window.changeCalendarView = changeCalendarView;
window.cycleTimelineDaySpan = cycleTimelineDaySpan;
window.setTimelineDaySpan = setTimelineDaySpan;
window.switchToSingleDayView = switchToSingleDayView;
window.changeTimelineDate = changeTimelineDate;
window.formatDisplayDateRange = formatDisplayDateRange;
window.calculateTagTitleOverlap = calculateTagTitleOverlap;
window.checkAndResolveTagOcclusion = checkAndResolveTagOcclusion;
window.syncSpanButtonWidth = syncSpanButtonWidth;

let isGKeyActive = false;
let gKeySequenceTimer = null;

// Phím tắt toàn cục: Ctrl + B ẩn/hiện sidebar; T (Task), G - Y/M/D (Mục tiêu), E (Chắn Sự kiện), F (Cố định), N (Note), D (Làm phiền)
if (typeof window !== 'undefined' && !window._chronoFlowSidebarKeyAttached) {
  window._chronoFlowSidebarKeyAttached = true;
  window.addEventListener('keydown', (e) => {
    const activeEl = document.activeElement;
    const activeTag = activeEl ? activeEl.tagName : '';
    const isInput = activeTag === 'INPUT' || activeTag === 'TEXTAREA' || activeTag === 'SELECT' || (activeEl && activeEl.isContentEditable);

    // Ctrl + B hoặc Cmd + B: Toggle Left Sidebar
    if ((e.ctrlKey || e.metaKey) && (e.key === 'b' || e.key === 'B')) {
      if (!isInput) {
        e.preventDefault();
        toggleSidebar();
      }
      return;
    } 

    // Bỏ qua nếu có phím modifier (Ctrl, Cmd, Alt) ngoại trừ Ctrl+B ở trên
    if (e.ctrlKey || e.metaKey || e.altKey) return;

    // Kiểm tra trạng thái các modal / settings
    const settingsModal = document.getElementById('settings-overlay-modal');
    const isSettingsOpen = settingsModal && (settingsModal.classList.contains('active') || settingsModal.classList.contains('open') || (settingsModal.style.display && settingsModal.style.display !== 'none'));
    
    const modalOverlay = document.getElementById('app-modal-overlay');
    const isModalOpen = modalOverlay && (modalOverlay.classList.contains('active') || (modalOverlay.style.display && modalOverlay.style.display !== 'none'));
    
    const isEventChoiceOpen = isModalOpen && document.querySelector('#app-modal-overlay .modal-card[data-event-choice-modal="true"]');

    // Chỉ thực hiện khi KHÔNG nhập liệu và KHÔNG mở Cài đặt
    if (!isInput && !isSettingsOpen) {
      const keyLower = e.key.toLowerCase();
      const isEn = appState.settings && appState.settings.lang === 'en';

      // Trường hợp đặc biệt: Đang mở popup Chọn Sự Kiện (phím E)
      if (isEventChoiceOpen) {
        if (keyLower === 'f') {
          e.preventDefault();
          closeModal();
          if (typeof openAddFixedEventModal === 'function') openAddFixedEventModal();
          return;
        } else if (keyLower === 't') {
          e.preventDefault();
          closeModal();
          if (typeof openAddTransientEventModal === 'function') openAddTransientEventModal();
          return;
        }
      }

      // Khi KHÔNG mở bất kỳ Modal nào
      if (!isModalOpen) {
        // Phím 1, 2, 3, 4: Chuyển nhanh giữa 4 tab chính (1: Năm, 2: Tháng, 3: Ngày, 4: Ma Trận Eisenhower)
        if (e.key === '1') {
          e.preventDefault();
          setView('year');
          return;
        }
        if (e.key === '2') {
          e.preventDefault();
          setView('month');
          return;
        }
        if (e.key === '3') {
          e.preventDefault();
          setView('day');
          return;
        }
        if (e.key === '4') {
          e.preventDefault();
          setView('eisenhower');
          return;
        }

        // Chuỗi phím G -> Y / M / D (G - Y: mục tiêu năm, G - M: mục tiêu tháng, G - D: mục tiêu ngày)
        if (isGKeyActive) {
          clearTimeout(gKeySequenceTimer);
          gKeySequenceTimer = null;
          isGKeyActive = false;

          if (keyLower === 'y') {
            e.preventDefault();
            const yearNum = Number((selectedDate || '').split('-')[0]) || new Date().getFullYear();
            if (typeof openYearGoalModal === 'function') openYearGoalModal(yearNum);
            return;
          } else if (keyLower === 'm') {
            e.preventDefault();
            const ymKey = (selectedDate || '').slice(0, 7) || `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
            if (typeof openAddMonthGoalModal === 'function') openAddMonthGoalModal(ymKey);
            return;
          } else if (keyLower === 'd') {
            e.preventDefault();
            const targetDate = selectedDate || (typeof getTodayDateStr === 'function' ? getTodayDateStr() : new Date().toISOString().slice(0, 10));
            if (typeof openDailyGoalModal === 'function') openDailyGoalModal(targetDate);
            return;
          }
        }

        if (keyLower === 'g') {
          e.preventDefault();
          isGKeyActive = true;
          if (gKeySequenceTimer) clearTimeout(gKeySequenceTimer);
          gKeySequenceTimer = setTimeout(() => {
            isGKeyActive = false;
            gKeySequenceTimer = null;
          }, 2000);
          showToast(isEn ? 'Goal Shortcut: Press Y (Year), M (Month), or D (Day)' : 'Phím tắt mục tiêu: Nhấn Y (Năm), M (Tháng), hoặc D (Ngày)');
          return;
        }

        if (keyLower === 't') {
          // Phím T: Thêm nhanh Task
          e.preventDefault();
          if (typeof openAddTaskModal === 'function') openAddTaskModal();
        } else if (keyLower === 'e') {
          // Phím E: Mở popup chọn loại sự kiện (Cố định hay Đột xuất)
          e.preventDefault();
          if (typeof openEventChoiceModal === 'function') openEventChoiceModal();
        } else if (keyLower === 'f') {
          // Phím F: Thêm thẳng sự kiện Cố định
          e.preventDefault();
          if (typeof openAddFixedEventModal === 'function') openAddFixedEventModal();
        } else if (keyLower === 'n') {
          // Phím N: Thêm Note ghi chú mới
          e.preventDefault();
          if (typeof openAddNoteModal === 'function') openAddNoteModal();
        } else if (keyLower === 'd') {
          // Phím D: Thêm Khung giờ bị làm phiền / Distraction hours
          e.preventDefault();
          if (typeof openAddNoisyIntervalModal === 'function') openAddNoisyIntervalModal();
        } else if (keyLower === 's') {
          // Phím S: Mở Cài đặt hệ thống (Settings)
          e.preventDefault();
          if (typeof openSettingsModal === 'function') openSettingsModal();
        }
      }
    }

    // Escape: Đóng drawer mobile
    if (e.key === 'Escape') {
      const sidebar = document.getElementById('app-sidebar-content');
      if (sidebar && sidebar.classList.contains('open') && window.innerWidth <= 860) {
        toggleSidebar(false);
      }
    }
  });
}

// Tự động kiểm tra che khuất name tag và đồng bộ dãn nút chuyển chế độ khi cửa sổ thay đổi kích thước
if (typeof window !== 'undefined' && !window._chronoFlowResizeAttached) {
  window._chronoFlowResizeAttached = true;
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      syncSpanButtonWidth(document);
      checkAndResolveTagOcclusion(document);
    }, 80);
  });
}

// =========================================================================
// 8. PHẦN LÕI THUẬT TOÁN ĐÁNH GIÁ KỶ LUẬT (STREAK & STREAK FREEZE ENGINE)
// Retrospective History Replay Engine & Discipline Analytics
// =========================================================================

const StreakEngine = (function() {
  let _cachedState = null;
  const _listeners = new Set();

  /**
   * 1. Chuẩn hóa ngày giờ sang 'YYYY-MM-DD' theo đúng múi giờ địa phương (Local Time).
   * Tuyệt đối không dùng toISOString() để tránh lệch ngày khi người dùng làm việc vào ban đêm.
   */
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

  /**
   * Helper cộng/trừ ngày an toàn theo giờ địa phương
   */
  function addDays(dateStr, numDays) {
    const norm = toLocalDateKey(dateStr);
    const [y, m, d] = norm.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d + numDays);
    return toLocalDateKey(dateObj);
  }

  /**
   * Tính effectiveThreshold(date) theo ưu tiên: override > weekdayThresholds[dow] > settings.streak.threshold
   */
  function effectiveThreshold(dateStr) {
    const normDateStr = toLocalDateKey(dateStr);
    const overrides = (appState && appState.streakDayOverrides) || {};
    if (overrides[normDateStr] && !overrides[normDateStr].deleted && typeof overrides[normDateStr].threshold === 'number' && !isNaN(overrides[normDateStr].threshold)) {
      return overrides[normDateStr].threshold;
    }
    if (normDateStr) {
      const [y, m, d] = normDateStr.split('-').map(Number);
      const dateObj = new Date(y, m - 1, d);
      const dow = dateObj.getDay(); // 0: Sunday ... 6: Saturday
      const weekdayT = appState?.settings?.streak?.weekdayThresholds?.[dow];
      if (typeof weekdayT === 'number' && !isNaN(weekdayT)) {
        return weekdayT;
      }
    }
    if (appState?.settings?.streak?.threshold !== undefined) {
      const val = Number(appState.settings.streak.threshold);
      if (!isNaN(val)) return val;
    }
    if (appState?.settings?.streakThreshold !== undefined) {
      const val = Number(appState.settings.streakThreshold);
      if (!isNaN(val)) return val;
    }
    return 0.7;
  }

  /**
   * 2. Lấy số liệu công việc Ma trận Eisenhower trong ngày (getDayTaskMetrics):
   * - Bỏ qua hoàn toàn "Việc cố định" (fixedEvents) và "Việc đột xuất" (transientEvents).
   * - Chỉ lấy các Task thuộc Ma trận Eisenhower (tasks) có hiệu lực trong ngày dateStr (bao gồm giải nén task lặp lại).
   * - Trả về: { date, total, completed, rate, threshold, requiredCount, neededCount, isMet, activeTasks }
   */
  function getDayTaskMetrics(dateStr, customTasks = null, customThreshold = null) {
    const normDateStr = toLocalDateKey(dateStr);
    const tasksPool = Array.isArray(customTasks) ? customTasks : (appState?.tasks || []);

    // Chỉ lấy Eisenhower tasks có hiệu lực trên ngày normDateStr
    const activeTasks = tasksPool.filter(t => isItemActiveOnDate(t, normDateStr));
    const total = activeTasks.length;
    const completed = activeTasks.filter(t => isTaskDoneOnDate(t, normDateStr)).length;
    const rate = total > 0 ? (completed / total) : 0;

    let threshold = 0.7;
    if (typeof customThreshold === 'number' && !isNaN(customThreshold) && customThreshold > 0) {
      threshold = customThreshold;
    } else {
      threshold = effectiveThreshold(normDateStr);
    }

    const requiredCount = Math.ceil(total * threshold);
    const neededCount = Math.max(0, requiredCount - completed);
    const isMet = (total > 0) && (completed >= requiredCount);

    return {
      date: normDateStr,
      total,
      completed,
      rate,
      threshold,
      requiredCount,
      neededCount,
      isMet,
      activeTasks
    };
  }

  /**
   * 3. Thuật toán Quét Truy Hồi Lịch Sử (Retrospective History Replay Engine)
   * Tái hiện lại toàn bộ chuỗi kỷ luật từ ngày bắt đầu sớm nhất trong lịch sử đến hôm nay.
   */
  function evaluateStreakSystem(options = {}) {
    const todayKey = toLocalDateKey(options.customToday || new Date());
    const tasksPool = Array.isArray(options.tasks) ? options.tasks : (appState?.tasks || []);
    const customThresh = (typeof options.customThreshold === 'number' && options.customThreshold > 0) ? options.customThreshold : null;
    const threshold = customThresh !== null
      ? customThresh
      : (appState?.settings?.streak?.threshold !== undefined ? Number(appState.settings.streak.threshold) : (appState?.settings?.streakThreshold !== undefined ? Number(appState.settings.streakThreshold) : 0.7));

    // 1. Quét tìm mốc ngày bắt đầu sớm nhất trong lịch sử
    let minCandidateDate = todayKey;
    for (const t of tasksPool) {
      if (!t || t.deleted) continue;
      if (t.date && t.date < minCandidateDate) minCandidateDate = t.date;
      if (t.startDate && t.startDate < minCandidateDate) minCandidateDate = t.startDate;
      if (Array.isArray(t.completedDates)) {
        for (const cd of t.completedDates) {
          if (cd && cd < minCandidateDate) minCandidateDate = cd;
        }
      }
    }

    // 2. Tìm ngày đầu tiên trong lịch sử đạt chuẩn isMet === true (firstStreakDate)
    let firstStreakDate = null;
    let scanDate = minCandidateDate;
    while (scanDate <= todayKey) {
      const m = getDayTaskMetrics(scanDate, tasksPool, customThresh);
      if (m.isMet) {
        firstStreakDate = scanDate;
        break;
      }
      scanDate = addDays(scanDate, 1);
    }

    const todayMetrics = getDayTaskMetrics(todayKey, tasksPool, customThresh);

    // Nếu chưa từng có ngày nào đạt chuẩn trong toàn bộ lịch sử
    if (!firstStreakDate) {
      const dayStatus = {};
      if (todayMetrics.total > 0) {
        dayStatus[todayKey] = 'PENDING';
      }
      const emptyState = {
        currentStreak: 0,
        bestStreak: 0,
        freezeCount: 0,
        maxFreeze: 2,
        cleanDays: 0,
        threshold,
        todayMetrics,
        dayStatus,
        firstStreakDate: null,
        lastUpdated: new Date().toISOString()
      };
      _cachedState = emptyState;
      return emptyState;
    }

    // Khởi tạo các biến theo dõi Retrospective Engine
    let currentStreak = 0;
    let bestStreak = 0;
    let freezeCount = 0; // Tối đa 2
    let cleanDays = 0; // 0..7
    const dayStatus = {};

    const yesterdayKey = addDays(todayKey, -1);
    let cur = firstStreakDate;

    // 3. Quét tuần tự từng ngày từ firstStreakDate đến HÔM QUA (yesterdayKey)
    while (cur <= yesterdayKey) {
      const metrics = getDayTaskMetrics(cur, tasksPool, customThresh);
      if (metrics.isMet) {
        currentStreak++;
        cleanDays++;
        dayStatus[cur] = 'STREAK';
        if (cleanDays === 7) {
          freezeCount = Math.min(2, freezeCount + 1);
          cleanDays = 0;
        }
        bestStreak = Math.max(bestStreak, currentStreak);
      } else {
        if (freezeCount > 0 && currentStreak > 0) {
          freezeCount--;
          // Giữ nguyên currentStreak
          cleanDays = 0;
          dayStatus[cur] = 'FROZEN';
        } else {
          currentStreak = 0;
          cleanDays = 0;
          dayStatus[cur] = 'MISSED';
        }
      }
      cur = addDays(cur, 1);
    }

    // 4. Xử lý riêng cho ngày HÔM NAY (todayKey)
    if (todayMetrics.isMet) {
      currentStreak++;
      cleanDays++;
      if (cleanDays === 7) {
        freezeCount = Math.min(2, freezeCount + 1);
        cleanDays = 0;
      }
      bestStreak = Math.max(bestStreak, currentStreak);
      dayStatus[todayKey] = 'STREAK';
    } else {
      // Ngày hôm nay chưa kết thúc: Không phạt mất streak hay freeze của ngày hôm qua
      dayStatus[todayKey] = 'PENDING';
    }

    const state = {
      currentStreak,
      bestStreak,
      freezeCount,
      maxFreeze: 2,
      cleanDays,
      threshold,
      todayMetrics,
      dayStatus,
      firstStreakDate,
      lastUpdated: new Date().toISOString()
    };

    _cachedState = state;
    return state;
  }

  /**
   * 4. API Thống kê theo Tháng (getMonthStats)
   */
  function getMonthStats(year, month) {
    const y = parseInt(year, 10);
    const m = parseInt(month, 10);
    const daysInMonth = new Date(y, m, 0).getDate();
    const ymPrefix = `${y}-${String(m).padStart(2, '0')}`;

    const state = getState();
    let streakDays = 0;
    let frozenDays = 0;
    let missedDays = 0;
    let pendingDays = 0;
    const dayDetails = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${ymPrefix}-${String(d).padStart(2, '0')}`;
      const status = state.dayStatus[dateStr] || 'EMPTY';
      if (status === 'STREAK') streakDays++;
      else if (status === 'FROZEN') frozenDays++;
      else if (status === 'MISSED') missedDays++;
      else if (status === 'PENDING') pendingDays++;

      dayDetails.push({
        date: dateStr,
        day: d,
        status,
        metrics: getDayTaskMetrics(dateStr)
      });
    }

    const evaluatedDays = streakDays + frozenDays + missedDays;
    const consistencyRate = evaluatedDays > 0 ? ((streakDays + frozenDays) / evaluatedDays) : (streakDays / daysInMonth);

    return {
      year: y,
      month: m,
      streakDays,
      frozenDays,
      missedDays,
      pendingDays,
      totalDaysInMonth: daysInMonth,
      consistencyRate: Math.round(consistencyRate * 1000) / 1000,
      dayDetails
    };
  }

  /**
   * 5. API Thống kê theo Năm (getYearStats)
   */
  function getYearStats(year) {
    const y = parseInt(year, 10);
    const totalDaysInYear = ((y % 4 === 0 && y % 100 !== 0) || y % 400 === 0) ? 366 : 365;
    let streakDays = 0;
    let frozenDays = 0;
    let missedDays = 0;
    const monthlySummary = [];

    for (let m = 1; m <= 12; m++) {
      const mStats = getMonthStats(y, m);
      streakDays += mStats.streakDays;
      frozenDays += mStats.frozenDays;
      missedDays += mStats.missedDays;
      monthlySummary.push(mStats);
    }

    const state = getState();
    const evaluatedDays = streakDays + frozenDays + missedDays;
    const consistencyRate = evaluatedDays > 0 ? ((streakDays + frozenDays) / evaluatedDays) : 0;

    return {
      year: y,
      streakDays,
      frozenDays,
      missedDays,
      totalDaysInYear,
      bestStreakInYear: state.bestStreak,
      consistencyRate: Math.round(consistencyRate * 1000) / 1000,
      monthlySummary
    };
  }

  /**
   * 6. Thay đổi ngưỡng hoàn thành Task (0.5, 0.7, 0.8, 1.0) và lưu vào LocalStorage
   */
  /**
   * Tính ISO week key (ví dụ: '2026-W43') cho một ngày bất kỳ
   */
  function getISOWeekKey(dateInput) {
    const d = (dateInput instanceof Date) ? new Date(dateInput.getTime()) : new Date(dateInput);
    if (isNaN(d.getTime())) {
      d.setTime(Date.now());
    }
    d.setHours(0, 0, 0, 0);
    const dayNum = d.getDay() || 7;
    d.setDate(d.getDate() + 4 - dayNum);
    const year = d.getFullYear();
    const yearStart = new Date(year, 0, 1);
    const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
    return `${year}-W${String(weekNo).padStart(2, '0')}`;
  }

  /**
   * Kiểm tra xem có được phép thay đổi ngưỡng vào ngày này không (Chủ Nhật hoặc khi thresholdEditableOnlyOnSunday = false)
   */
  function canChangeThreshold(dateInput = new Date()) {
    const setting = appState?.settings?.streak?.thresholdEditableOnlyOnSunday;
    if (!setting) return true;
    const d = (dateInput instanceof Date) ? dateInput : new Date(dateInput);
    return d.getDay() === 0; // 0: Sunday
  }

  /**
   * Kiểm tra xem tuần này đã sử dụng Cứu Trợ Tuần (Weekly Relief) chưa (1 lần / tuần tính theo ISO week)
   */
  function canUseWeeklyRelief(dateInput = new Date()) {
    const weekKey = getISOWeekKey(dateInput);
    const usedWeekKey = appState?.settings?.streak?.weeklyRelief?.usedInWeekKey;
    return usedWeekKey !== weekKey;
  }

  /**
   * 6. Thay đổi ngưỡng hoàn thành Task (0.5, 0.7, 0.8, 1.0) và lưu vào LocalStorage
   * Nếu thresholdEditableOnlyOnSunday = true và hôm nay không phải Chủ Nhật -> return false + toast
   */
  function setThreshold(newThreshold) {
    if (!canChangeThreshold()) {
      const isEn = appState?.settings?.lang === 'en';
      const msg = isEn ? 'Streak threshold can only be edited on Sundays!' : 'Chỉ được phép thay đổi ngưỡng kỷ luật vào Chủ Nhật!';
      if (typeof showToast === 'function') showToast(msg);
      else if (typeof window !== 'undefined' && typeof window.showToast === 'function') window.showToast(msg);
      return false;
    }
    const val = Math.max(0.1, Math.min(1.0, Number(newThreshold) || 0.7));
    if (!appState.settings) appState.settings = {};
    if (!appState.settings.streak || typeof appState.settings.streak !== 'object') {
      appState.settings.streak = {
        threshold: val,
        weekdayThresholds: { 0: null, 1: null, 2: null, 3: null, 4: null, 5: null, 6: null },
        thresholdEditableOnlyOnSunday: true,
        weeklyRelief: { usedInWeekKey: null }
      };
    } else {
      appState.settings.streak.threshold = val;
    }
    appState.settings.streakThreshold = val;
    touch(appState.settings.streak);
    touch(appState.settings);
    if (typeof saveData === 'function') saveData();
    return notifyChange();
  }

  /**
   * 6.1 Áp dụng Cứu Trợ Tuần cho một ngày cụ thể (Weekly Relief Override)
   * - threshold < effectiveThreshold: nếu không (threshold >= effectiveThreshold), không tính override -> return false + toast
   * - 1 lần/tuần (ISO week key) -> nếu đã dùng tuần này -> return false + toast
   * - ghi streakDayOverrides, evaluate lại
   */
  function applyWeeklyRelief(dateInput, threshold) {
    const normDateStr = toLocalDateKey(dateInput);
    if (!canUseWeeklyRelief(normDateStr)) {
      const isEn = appState?.settings?.lang === 'en';
      const msg = isEn ? 'Weekly relief already used this week!' : 'Đã sử dụng Cứu Trợ Tuần trong tuần này!';
      if (typeof showToast === 'function') showToast(msg);
      else if (typeof window !== 'undefined' && typeof window.showToast === 'function') window.showToast(msg);
      return false;
    }
    const eff = effectiveThreshold(normDateStr);
    const targetThreshold = Number(threshold);
    if (isNaN(targetThreshold) || targetThreshold >= eff) {
      const isEn = appState?.settings?.lang === 'en';
      const msg = isEn ? 'Relief threshold must be less than effective threshold!' : 'Ngưỡng cứu trợ phải thấp hơn ngưỡng hiệu dụng hiện tại!';
      if (typeof showToast === 'function') showToast(msg);
      else if (typeof window !== 'undefined' && typeof window.showToast === 'function') window.showToast(msg);
      return false;
    }

    const weekKey = getISOWeekKey(normDateStr);
    if (!appState.streakDayOverrides) appState.streakDayOverrides = {};
    const overrideEntry = {
      threshold: targetThreshold,
      source: 'weeklyRelief',
      weekKey,
      deleted: false
    };
    touch(overrideEntry);
    appState.streakDayOverrides[normDateStr] = overrideEntry;

    if (!appState.settings) appState.settings = {};
    if (!appState.settings.streak) appState.settings.streak = {};
    if (!appState.settings.streak.weeklyRelief || typeof appState.settings.streak.weeklyRelief !== 'object') {
      appState.settings.streak.weeklyRelief = {};
    }
    appState.settings.streak.weeklyRelief.usedInWeekKey = weekKey;
    touch(appState.settings.streak.weeklyRelief);
    touch(appState.settings.streak);
    touch(appState.settings);

    if (typeof saveData === 'function') saveData();
    return notifyChange();
  }

  /**
   * 7. Lấy State hiện tại (hoặc tính toán lại nếu chưa có)
   */
  function getState() {
    if (!_cachedState) {
      _cachedState = evaluateStreakSystem();
    }
    return _cachedState;
  }

  /**
   * 8. Phát sự kiện thông báo cập nhật State cho toàn hệ thống & UI
   */
  function notifyChange() {
    const state = evaluateStreakSystem();
    _listeners.forEach(fn => {
      try { fn(state); } catch (err) { console.error('StreakEngine listener error:', err); }
    });
    if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
      window.dispatchEvent(new CustomEvent('streakUpdated', { detail: state }));
    }
    return state;
  }

  /**
   * 9. Đăng ký Listener nhận thông báo thay đổi
   */
  function subscribe(fn) {
    if (typeof fn === 'function') {
      _listeners.add(fn);
      return () => _listeners.delete(fn);
    }
    return () => {};
  }

  /**
   * 10. BỘ UNIT TESTS TỰ ĐỘNG (TDD TEST SUITE - 8 KỊCH BẢN BẮT BUỘC)
   * Sử dụng Mock Data độc lập, không làm ảnh hưởng đến dữ liệu người dùng.
   */
  function runUnitTests() {
    console.log('🧪 =======================================================');
    console.log('🧪 [StreakEngine TDD Suite] Khởi chạy kiểm thử tự động 8 kịch bản...');
    console.log('🧪 =======================================================');

    const results = [];
    let passedCount = 0;

    function assert(testId, name, condition, details = {}) {
      const passed = Boolean(condition);
      if (passed) passedCount++;
      results.push({ id: testId, name, passed, details });
      console.log(`${passed ? '✅ PASS' : '❌ FAIL'} [Test ${testId}]: ${name}`, passed ? '' : details);
    }

    // Helper tạo Mock Task
    function createMockTask(id, date, isImportant = true, isUrgent = false, repeatType = 'none', completedDates = []) {
      return {
        id,
        title: `Task ${id}`,
        date,
        startDate: date,
        isImportant,
        isUrgent,
        repeatType,
        completedDates,
        status: completedDates.includes(date) ? 'done' : 'todo'
      };
    }

    // =========================================================================
    // KỊCH BẢN 1: Chuỗi 7 ngày liên tiếp đạt >= 70%
    // Kì vọng: currentStreak = 7, freezeCount = 1, cleanDays = 0
    // =========================================================================
    try {
      const mockTasks1 = [];
      for (let i = 1; i <= 7; i++) {
        const dStr = `2026-09-0${i}`;
        // 2 tasks mỗi ngày, hoàn thành cả 2 (100% >= 70%)
        mockTasks1.push(createMockTask(`t1-${i}-a`, dStr, true, true, 'none', [dStr]));
        mockTasks1.push(createMockTask(`t1-${i}-b`, dStr, true, false, 'none', [dStr]));
      }
      const res1 = evaluateStreakSystem({
        tasks: mockTasks1,
        customToday: '2026-09-08', // Ngày hôm nay chưa làm gì
        customThreshold: 0.7
      });
      assert(
        1,
        'Chuỗi 7 ngày liên tiếp đạt >= 70% -> streak = 7, freeze = 1, cleanDays = 0',
        res1.currentStreak === 7 && res1.freezeCount === 1 && res1.cleanDays === 0 && res1.dayStatus['2026-09-07'] === 'STREAK',
        { currentStreak: res1.currentStreak, freezeCount: res1.freezeCount, cleanDays: res1.cleanDays }
      );
    } catch (e) {
      assert(1, 'Chuỗi 7 ngày liên tiếp đạt >= 70%', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 2: Chuỗi 14 ngày & 21 ngày liên tiếp (Giới hạn tối đa Freeze = 2)
    // Kì vọng: 14 ngày -> freeze = 2; 21 ngày -> freeze vẫn giữ ở mức 2
    // =========================================================================
    try {
      const mockTasks14 = [];
      for (let i = 1; i <= 14; i++) {
        const dayNum = String(i).padStart(2, '0');
        const dStr = `2026-08-${dayNum}`;
        mockTasks14.push(createMockTask(`t14-${i}`, dStr, true, false, 'none', [dStr]));
      }
      const mockTasks21 = [];
      for (let i = 1; i <= 21; i++) {
        const dayNum = String(i).padStart(2, '0');
        const dStr = `2026-08-${dayNum}`;
        mockTasks21.push(createMockTask(`t21-${i}`, dStr, true, false, 'none', [dStr]));
      }
      const res14 = evaluateStreakSystem({
        tasks: mockTasks14,
        customToday: '2026-08-15',
        customThreshold: 0.7
      });
      const res21 = evaluateStreakSystem({
        tasks: mockTasks21,
        customToday: '2026-08-22',
        customThreshold: 0.7
      });
      const check14 = res14.currentStreak === 14 && res14.freezeCount === 2;
      const check21 = res21.currentStreak === 21 && res21.freezeCount === 2 && res21.cleanDays === 0;
      assert(
        2,
        'Chuỗi 14 ngày (freeze=2) & 21 ngày (freeze max=2)',
        check14 && check21,
        { streak14: res14.currentStreak, freeze14: res14.freezeCount, streak21: res21.currentStreak, freeze21: res21.freezeCount }
      );
    } catch (e) {
      assert(2, 'Chuỗi 14 & 21 ngày max freeze = 2', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 3: Có 1 freeze, thêm 3 ngày đạt (cleanDays=3), ngày thứ 11 lỡ (<70%)
    // Kì vọng: Trừ freeze (freeze=0), bảo toàn streak=10, status='FROZEN', reset cleanDays=0
    // =========================================================================
    try {
      const mockTasks3 = [];
      for (let i = 1; i <= 10; i++) {
        const dStr = `2026-07-${String(i).padStart(2, '0')}`;
        mockTasks3.push(createMockTask(`t3-${i}`, dStr, true, false, 'none', [dStr]));
      }
      // Ngày 11: Có 2 task nhưng hoàn thành 0 (< 70%)
      const d11 = '2026-07-11';
      mockTasks3.push(createMockTask(`t3-11-a`, d11, true, true, 'none', []));
      mockTasks3.push(createMockTask(`t3-11-b`, d11, true, false, 'none', []));

      const res3 = evaluateStreakSystem({
        tasks: mockTasks3,
        customToday: '2026-07-12',
        customThreshold: 0.7
      });
      assert(
        3,
        'Dùng 1 Freeze khi lỡ ngày thứ 11 -> bảo toàn streak = 10, freeze = 0, cleanDays = 0, dayStatus[D11] = FROZEN',
        res3.currentStreak === 10 && res3.freezeCount === 0 && res3.cleanDays === 0 && res3.dayStatus['2026-07-11'] === 'FROZEN',
        { currentStreak: res3.currentStreak, freezeCount: res3.freezeCount, cleanDays: res3.cleanDays, d11Status: res3.dayStatus['2026-07-11'] }
      );
    } catch (e) {
      assert(3, 'Dùng Freeze bảo toàn streak', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 4: Khi freezeCount = 0 mà lỡ 1 ngày trong quá khứ
    // Kì vọng: currentStreak về 0, bestStreak vẫn giữ nguyên 10, status='MISSED'
    // =========================================================================
    try {
      const mockTasks4 = [];
      // 10 ngày đầu đạt
      for (let i = 1; i <= 10; i++) {
        const dStr = `2026-06-${String(i).padStart(2, '0')}`;
        mockTasks4.push(createMockTask(`t4-${i}`, dStr, true, false, 'none', [dStr]));
      }
      // Ngày 11 lỡ (dùng hết freeze), Ngày 12 lỡ tiếp (freeze = 0)
      const d11 = '2026-06-11';
      const d12 = '2026-06-12';
      mockTasks4.push(createMockTask(`t4-11`, d11, true, false, 'none', []));
      mockTasks4.push(createMockTask(`t4-12`, d12, true, false, 'none', []));

      const res4 = evaluateStreakSystem({
        tasks: mockTasks4,
        customToday: '2026-06-13',
        customThreshold: 0.7
      });
      assert(
        4,
        'Khi freeze = 0 mà lỡ tiếp -> streak = 0, bestStreak = 10, status = MISSED',
        res4.currentStreak === 0 && res4.bestStreak === 10 && res4.dayStatus['2026-06-12'] === 'MISSED',
        { currentStreak: res4.currentStreak, bestStreak: res4.bestStreak, d12Status: res4.dayStatus['2026-06-12'] }
      );
    } catch (e) {
      assert(4, 'Mất streak khi hết freeze', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 5: Ngày hôm nay chưa đạt 70%
    // Kì vọng: Không phạt freeze, bảo toàn streak của ngày hôm qua, status[today] = 'PENDING'
    // =========================================================================
    try {
      const mockTasks5 = [];
      for (let i = 1; i <= 5; i++) {
        const dStr = `2026-05-0${i}`;
        mockTasks5.push(createMockTask(`t5-${i}`, dStr, true, false, 'none', [dStr]));
      }
      // Hôm nay (2026-05-06) có 2 task nhưng mới làm 0 (0% < 70%)
      const today5 = '2026-05-06';
      mockTasks5.push(createMockTask(`t5-6-a`, today5, true, false, 'none', []));
      mockTasks5.push(createMockTask(`t5-6-b`, today5, true, false, 'none', []));

      const res5 = evaluateStreakSystem({
        tasks: mockTasks5,
        customToday: today5,
        customThreshold: 0.7
      });
      assert(
        5,
        'Hôm nay chưa đạt 70% -> không phạt, giữ nguyên streak = 5 của hôm qua, status = PENDING',
        res5.currentStreak === 5 && res5.dayStatus[today5] === 'PENDING' && res5.todayMetrics.isMet === false,
        { currentStreak: res5.currentStreak, todayStatus: res5.dayStatus[today5], isMet: res5.todayMetrics.isMet }
      );
    } catch (e) {
      assert(5, 'Hôm nay chưa đạt', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 6: Tick đạt hôm nay -> +1 Streak; Un-tick -> Quay về ban đầu
    // Kì vọng: Replay Engine phản ứng tức thì và chính xác
    // =========================================================================
    try {
      const mockTasks6 = [];
      for (let i = 1; i <= 5; i++) {
        const dStr = `2026-04-0${i}`;
        mockTasks6.push(createMockTask(`t6-${i}`, dStr, true, false, 'none', [dStr]));
      }
      const today6 = '2026-04-06';
      const todayTask = createMockTask('t6-today', today6, true, false, 'none', []);
      mockTasks6.push(todayTask);

      // Bước 1: Chưa tick
      const stateBefore = evaluateStreakSystem({ tasks: mockTasks6, customToday: today6 });
      
      // Bước 2: Tick hoàn thành
      todayTask.completedDates = [today6];
      todayTask.status = 'done';
      const stateTicked = evaluateStreakSystem({ tasks: mockTasks6, customToday: today6 });

      // Bước 3: Un-tick bỏ chọn
      todayTask.completedDates = [];
      todayTask.status = 'todo';
      const stateUnticked = evaluateStreakSystem({ tasks: mockTasks6, customToday: today6 });

      const pass6 = (stateBefore.currentStreak === 5 && stateBefore.dayStatus[today6] === 'PENDING') &&
                    (stateTicked.currentStreak === 6 && stateTicked.dayStatus[today6] === 'STREAK') &&
                    (stateUnticked.currentStreak === 5 && stateUnticked.dayStatus[today6] === 'PENDING');

      assert(
        6,
        'Hôm nay realtime tick đạt (+1 streak) và un-tick (lùi về trạng thái cũ)',
        pass6,
        { before: stateBefore.currentStreak, ticked: stateTicked.currentStreak, unticked: stateUnticked.currentStreak }
      );
    } catch (e) {
      assert(6, 'Tick / Untick hôm nay', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 7: Ngày chỉ có Việc cố định (Fixed Events), không có Task Eisenhower
    // Kì vọng: total = 0, isMet = false, không được tính là đạt Streak
    // =========================================================================
    try {
      const mockTasks7 = []; // Không có task Eisenhower
      const metrics7 = getDayTaskMetrics('2026-03-15', mockTasks7, 0.7);
      const res7 = evaluateStreakSystem({
        tasks: mockTasks7,
        customToday: '2026-03-15',
        customThreshold: 0.7
      });

      assert(
        7,
        'Chỉ có Việc cố định (không có task Eisenhower) -> total = 0, isMet = false, streak = 0',
        metrics7.total === 0 && metrics7.isMet === false && res7.currentStreak === 0 && res7.firstStreakDate === null,
        { total: metrics7.total, isMet: metrics7.isMet, streak: res7.currentStreak }
      );
    } catch (e) {
      assert(7, 'Chỉ có việc cố định', false, { error: e.message });
    }

    // =========================================================================
    // KỊCH BẢN 8: Giải nén chính xác số lượng Task lặp lại hàng ngày (daily) & theo thứ (weekly)
    // Kì vọng: Thứ Hai có 2 tasks, Thứ Ba có 1 task; task bị loại trừ ngày (excludedDates) không được tính
    // =========================================================================
    try {
      const mockTasks8 = [
        // Task lặp lại hàng ngày (daily)
        {
          id: 'rec-daily',
          title: 'Daily Task',
          startDate: '2026-02-01',
          repeatType: 'daily',
          isImportant: true,
          isUrgent: false,
          completedDates: []
        },
        // Task lặp lại vào T2, T4, T6 (Monday: 1, Wednesday: 3, Friday: 5)
        {
          id: 'rec-weekly',
          title: 'Weekly Task (T2, T4, T6)',
          startDate: '2026-02-01',
          repeatType: 'weekly',
          repeatDays: [1, 3, 5],
          isImportant: true,
          isUrgent: true,
          completedDates: [],
          excludedDates: ['2026-02-09'] // Ngoại lệ: Xóa ngày T2 (09/02/2026)
        }
      ];

      // 2026-02-02 là Thứ Hai -> Cả 2 tasks đều active -> total = 2
      const monMetrics = getDayTaskMetrics('2026-02-02', mockTasks8, 0.7);
      // 2026-02-03 là Thứ Ba -> Chỉ daily task active -> total = 1
      const tueMetrics = getDayTaskMetrics('2026-02-03', mockTasks8, 0.7);
      // 2026-02-09 là Thứ Hai nhưng nằm trong excludedDates -> Chỉ daily task active -> total = 1
      const excludedMonMetrics = getDayTaskMetrics('2026-02-09', mockTasks8, 0.7);

      const pass8 = monMetrics.total === 2 && tueMetrics.total === 1 && excludedMonMetrics.total === 1;

      assert(
        8,
        'Giải nén Task lặp lại hàng ngày (daily), theo thứ (weekly) và xử lý ngày ngoại lệ (excludedDates)',
        pass8,
        { mondayTotal: monMetrics.total, tuesdayTotal: tueMetrics.total, excludedMondayTotal: excludedMonMetrics.total }
      );
    } catch (e) {
      assert(8, 'Task lặp lại daily & weekly', false, { error: e.message });
    }

    console.log('🧪 =======================================================');
    console.log(`🧪 [StreakEngine TDD Suite Kết quả]: ${passedCount}/8 Testcases Passed (${Math.round(passedCount / 8 * 100)}%)`);
    console.log('🧪 =======================================================');

    return {
      passed: passedCount,
      total: 8,
      results,
      allPassed: passedCount === 8
    };
  }

  return {
    toLocalDateKey,
    addDays,
    getISOWeekKey,
    effectiveThreshold,
    getDayTaskMetrics,
    getDayMetrics: getDayTaskMetrics,
    evaluate: evaluateStreakSystem,
    evaluateStreakSystem,
    getState,
    getMonthStats,
    getYearStats,
    setThreshold,
    applyWeeklyRelief,
    canChangeThreshold,
    canUseWeeklyRelief,
    notifyChange,
    subscribe,
    runUnitTests
  };
})();

// Gắn Module StreakEngine vào window toàn cục
if (typeof window !== 'undefined') {
  window.StreakEngine = StreakEngine;
  // Khởi động tính toán State và phát sự kiện ban đầu khi ứng dụng tải
  try {
    StreakEngine.evaluate();
    setTimeout(() => {
      StreakEngine.notifyChange();
    }, 50);
  } catch (err) {
    console.warn('Lỗi khởi tạo StreakEngine ban đầu:', err);
  }
}

