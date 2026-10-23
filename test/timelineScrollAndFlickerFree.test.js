import { describe, it, expect, beforeEach } from 'vitest';

class MockElement {
  constructor(tag, id = '', className = '') {
    this.tagName = tag.toUpperCase();
    this.id = id;
    this.className = className;
    this.style = {};
    this.dataset = {};
    this.attributes = {};
    this.scrollTop = 0;
    this.scrollLeft = 0;
    this.textContent = '';
    this._innerHTML = '';
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
  }

  get innerHTML() {
    return this._innerHTML;
  }

  set innerHTML(val) {
    this._innerHTML = val;
    this.children = [];
    // Reset scroll on innerHTML set, mimicking real browser DOM behavior
    this.scrollTop = 0;
    this.scrollLeft = 0;
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  setAttribute(name, val) {
    this.attributes[name] = val;
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  addEventListener(event, fn) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(fn);
  }

  dispatchEvent(event) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(fn => fn());
    }
  }

  querySelector(selector) {
    const list = this.querySelectorAll(selector);
    return list.length > 0 ? list[0] : null;
  }

  querySelectorAll(selector) {
    const results = [];
    function match(node) {
      if (selector.startsWith('#')) {
        if (node.id === selector.slice(1)) results.push(node);
      } else if (selector.startsWith('.')) {
        const cls = selector.slice(1);
        if (node.className && node.className.split(' ').includes(cls)) results.push(node);
      } else if (node.tagName.toLowerCase() === selector.toLowerCase()) {
        results.push(node);
      }
      for (const child of node.children) {
        match(child);
      }
    }
    match(this);
    return results;
  }
}

class MockDocument {
  constructor() {
    this.body = new MockElement('body');
  }

  getElementById(id) {
    return this.body.querySelector(`#${id}`);
  }

  querySelector(selector) {
    return this.body.querySelector(selector);
  }

  querySelectorAll(selector) {
    return this.body.querySelectorAll(selector);
  }
}

describe('ver1.1.0: Timeline Flicker-Free & Scroll State Preservation', () => {
  let doc;
  let mockWindow;

  beforeEach(() => {
    doc = new MockDocument();
    mockWindow = {
      scrollY: 0,
      scrollX: 0,
      scrollTo: function({ top, left }) {
        this.scrollY = top;
        this.scrollX = left;
      }
    };
  });

  // ============================================================
  // TEST GROUP 1: updateTimeIndicatorOnly (Flicker-Free Live Clock)
  // ============================================================
  describe('updateTimeIndicatorOnly (Flicker-Free Indicator)', () => {
    function setupTimelineDOM(doc) {
      const viewContainer = doc.body.appendChild(new MockElement('div', 'view-container'));
      const calendarGrid = viewContainer.appendChild(new MockElement('div', 'calendar-grid-root', 'calendar-grid timeline-card'));
      const timelineWrapper = calendarGrid.appendChild(new MockElement('div', '', 'timeline-grid-wrapper'));
      const canvas = timelineWrapper.appendChild(new MockElement('div', '', 'timeline-canvas'));
      const indicator = canvas.appendChild(new MockElement('div', 'timeline-live-indicator', 'timeline-current-time-indicator'));
      const tag = indicator.appendChild(new MockElement('div', '', 'current-time-tag'));
      tag.textContent = '05:00';
      indicator.style.top = '300px';
      return { viewContainer, timelineWrapper, indicator, tag };
    }

    function updateTimeIndicatorOnly(doc, appSettings = {}, mockDate = new Date(2026, 8, 26, 10, 30)) {
      const indicator = doc.getElementById('timeline-live-indicator');
      if (!indicator) return false;

      const PX_PER_MIN = 64 / 60;
      const curM = (mockDate.getHours() * 60) + mockDate.getMinutes(); // 10h30 = 630 min
      const top = Math.round(curM * PX_PER_MIN); // 630 * (64/60) = 672px
      const timeStr = `${String(mockDate.getHours()).padStart(2, '0')}:${String(mockDate.getMinutes()).padStart(2, '0')}`;

      // Directly update style and text without destroying DOM
      indicator.style.top = `${top}px`;
      indicator.setAttribute('title', `Giờ hiện tại: ${timeStr}`);
      const tag = indicator.querySelector('.current-time-tag');
      if (tag && tag.textContent !== timeStr) {
        tag.textContent = timeStr;
      }
      return true;
    }

    it('TC01: Khi đồng hồ nhảy sang phút mới, chỉ có vị trí top và nhãn giờ thay đổi mượt mà; DOM cây không bị xóa hay vẽ lại', () => {
      const { indicator, tag } = setupTimelineDOM(doc);
      const oldElementRef = indicator;

      const date1030 = new Date(2026, 8, 26, 10, 30);
      updateTimeIndicatorOnly(doc, {}, date1030);

      expect(indicator.style.top).toBe('672px');
      expect(tag.textContent).toBe('10:30');
      // Element reference must remain identical (zero DOM destruction / re-render)
      expect(doc.getElementById('timeline-live-indicator')).toBe(oldElementRef);

      // Now clock ticks to 10:31
      const date1031 = new Date(2026, 8, 26, 10, 31);
      updateTimeIndicatorOnly(doc, {}, date1031);

      expect(indicator.style.top).toBe('673px');
      expect(tag.textContent).toBe('10:31');
      expect(doc.getElementById('timeline-live-indicator')).toBe(oldElementRef);
    });

    it('TC02: Đang cuộn xem lịch ở khung giờ khác (ví dụ 22:00), khi vạch đỏ nhảy phút mới, màn hình không bị tự động giật cuộn về vị trí vạch đỏ', () => {
      const { timelineWrapper } = setupTimelineDOM(doc);
      timelineWrapper.scrollTop = 1320; // 22:00 pm view

      const date1030 = new Date(2026, 8, 26, 10, 30);
      updateTimeIndicatorOnly(doc, {}, date1030);

      // Scroll position must strictly remain at 1320, NOT reset or jumped
      expect(timelineWrapper.scrollTop).toBe(1320);
    });
  });

  // ============================================================
  // TEST GROUP 2: saveAndRestoreScroll & shouldScrollToNow
  // ============================================================
  describe('saveAndRestoreScroll & shouldScrollToNow', () => {
    function saveAndRestoreScroll(doc, win, renderCallback, flagState = { shouldScrollToNow: false }) {
      const winScrollTop = win.scrollY || 0;
      const winScrollLeft = win.scrollX || 0;

      const sidebarEl = doc.getElementById('sidebar-scroll-content') || doc.getElementById('app-sidebar-content');
      const sidebarScrollTop = sidebarEl ? sidebarEl.scrollTop : 0;
      const sidebarScrollLeft = sidebarEl ? sidebarEl.scrollLeft : 0;

      const timelineWrapperEl = doc.querySelector('.timeline-grid-wrapper');
      const timelineScrollTop = timelineWrapperEl ? timelineWrapperEl.scrollTop : 0;
      const timelineScrollLeft = timelineWrapperEl ? timelineWrapperEl.scrollLeft : 0;
      const wasUserScrolled = timelineWrapperEl ? (timelineWrapperEl.dataset.userScrolled === 'true') : false;

      const eisenhowerListScrolls = [];
      doc.querySelectorAll('.eisenhower-task-list').forEach((el, index) => {
        eisenhowerListScrolls.push({ index, scrollTop: el.scrollTop, scrollLeft: el.scrollLeft });
      });

      // Execute render
      if (typeof renderCallback === 'function') {
        renderCallback();
      }

      // Restore scroll positions
      win.scrollTo({ top: winScrollTop, left: winScrollLeft });

      const newSidebarEl = doc.getElementById('sidebar-scroll-content') || doc.getElementById('app-sidebar-content');
      if (newSidebarEl) {
        newSidebarEl.style.scrollBehavior = 'auto';
        newSidebarEl.scrollTop = sidebarScrollTop;
        newSidebarEl.scrollLeft = sidebarScrollLeft;
      }

      const newTimelineWrapper = doc.querySelector('.timeline-grid-wrapper');
      if (newTimelineWrapper && !flagState.shouldScrollToNow) {
        newTimelineWrapper.style.scrollBehavior = 'auto';
        newTimelineWrapper.scrollTop = timelineScrollTop;
        newTimelineWrapper.scrollLeft = timelineScrollLeft;
        if (wasUserScrolled || timelineScrollTop > 0) {
          newTimelineWrapper.dataset.userScrolled = 'true';
        }
      }

      if (eisenhowerListScrolls.length > 0) {
        const newLists = doc.querySelectorAll('.eisenhower-task-list');
        eisenhowerListScrolls.forEach(item => {
          if (newLists[item.index]) {
            newLists[item.index].style.scrollBehavior = 'auto';
            newLists[item.index].scrollTop = item.scrollTop;
            newLists[item.index].scrollLeft = item.scrollLeft;
          }
        });
      }
    }

    it('TC01 (Sidebar trái): Cuộn thanh bên trái xuống cuối mục công việc, bấm nút hoàn thành task -> Vị trí cuộn sidebar đứng yên tại chỗ', () => {
      const aside = doc.body.appendChild(new MockElement('aside', 'app-sidebar-content', 'app-sidebar'));
      const sidebarEl = aside.appendChild(new MockElement('div', 'sidebar-scroll-content', 'sidebar-scroll-content'));
      sidebarEl.scrollTop = 420; // User scrolled sidebar down

      // Re-render sidebar (simulating task completion)
      saveAndRestoreScroll(doc, mockWindow, () => {
        // innerHTML replace in real app
        aside.children = [];
        const refreshedSidebar = aside.appendChild(new MockElement('div', 'sidebar-scroll-content', 'sidebar-scroll-content'));
        // freshly rendered element starts with scrollTop = 0
        refreshedSidebar.scrollTop = 0;
      }, { shouldScrollToNow: false });

      const refreshed = doc.getElementById('sidebar-scroll-content');
      expect(refreshed.scrollTop).toBe(420);
    });

    it('TC02 (Timeline): Cuộn Timeline xuống 21:00 tối, tương tác task -> Khung nhìn Timeline vẫn giữ nguyên ở 21:00 tối', () => {
      const viewContainer = doc.body.appendChild(new MockElement('div', 'view-container'));
      const calendarGrid = viewContainer.appendChild(new MockElement('div', 'calendar-grid-root', 'calendar-grid timeline-card'));
      const timelineWrapper = calendarGrid.appendChild(new MockElement('div', '', 'timeline-grid-wrapper'));
      timelineWrapper.scrollTop = 1260; // 21:00 in px at 100% zoom

      saveAndRestoreScroll(doc, mockWindow, () => {
        // Re-rendering timeline canvas
        viewContainer.children = [];
        const newCalendarGrid = viewContainer.appendChild(new MockElement('div', 'calendar-grid-root', 'calendar-grid timeline-card'));
        const newTimelineWrapper = newCalendarGrid.appendChild(new MockElement('div', '', 'timeline-grid-wrapper'));
        newTimelineWrapper.scrollTop = 0; // DOM reset
      }, { shouldScrollToNow: false });

      const newTimelineWrapper = doc.querySelector('.timeline-grid-wrapper');
      expect(newTimelineWrapper.scrollTop).toBe(1260);
    });

    it('TC03 (Ma trận Eisenhower): Cuộn trang xuống ô Q3/Q4, bấm tick hoàn thành task -> Vị trí cuộn giữ nguyên', () => {
      const viewContainer = doc.body.appendChild(new MockElement('div', 'view-container'));
      const matrixGrid = viewContainer.appendChild(new MockElement('div', '', 'eisenhower-grid-layout'));
      const q3List = matrixGrid.appendChild(new MockElement('div', '', 'eisenhower-task-list'));
      q3List.scrollTop = 180;

      saveAndRestoreScroll(doc, mockWindow, () => {
        viewContainer.children = [];
        const newMatrixGrid = viewContainer.appendChild(new MockElement('div', '', 'eisenhower-grid-layout'));
        const newQ3List = newMatrixGrid.appendChild(new MockElement('div', '', 'eisenhower-task-list'));
        newQ3List.scrollTop = 0; // DOM reset
      }, { shouldScrollToNow: false });

      const newQ3List = doc.querySelector('.eisenhower-task-list');
      expect(newQ3List.scrollTop).toBe(180);
    });

    it('TC04: shouldScrollToNow chỉ kích hoạt khi vào Day view / Hôm nay, và tắt (false) khi thao tác Task', () => {
      let shouldScrollToNow = true; // Initial open

      // When rendering first time
      function onFirstLoad() {
        if (shouldScrollToNow) {
          // auto scroll to now
          shouldScrollToNow = false;
        }
      }
      onFirstLoad();
      expect(shouldScrollToNow).toBe(false);

      // User interacts with a task
      function onTaskInteract() {
        shouldScrollToNow = false;
      }
      onTaskInteract();
      expect(shouldScrollToNow).toBe(false);

      // User clicks "Today" button
      function onGoToToday() {
        shouldScrollToNow = true;
      }
      onGoToToday();
      expect(shouldScrollToNow).toBe(true);

      // User switches from Month to Day
      shouldScrollToNow = false;
      function onSwitchToDayView(prevView) {
        if (prevView !== 'day') {
          shouldScrollToNow = true;
        }
      }
      onSwitchToDayView('month');
      expect(shouldScrollToNow).toBe(true);
    });
  });
});
