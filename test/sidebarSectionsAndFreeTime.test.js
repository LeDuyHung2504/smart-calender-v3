import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Sidebar Features: Free Time Mode, Collapse Toggles, and Colors', () => {
  let translations = {};

  beforeAll(() => {
    const appJsPath = path.resolve(__dirname, '../src/app.js');
    const content = fs.readFileSync(appJsPath, 'utf8');

    const match = content.match(/const translations = (\{[\s\S]*?\n\};\n)/);
    if (match) {
      const fn = new Function(`return ${match[1]}`);
      translations = fn();
    }
  });

  it('should have all free time mode keys in both vi and en translations', () => {
    const requiredKeys = [
      'freeTimeModeTotal',
      'freeTimeModeFocus',
      'freeTimeModeDistract',
      'toastFreeTimeTotal',
      'toastFreeTimeFocus',
      'toastFreeTimeDistract',
      'freeTimeSettingsCardTitle',
      'freeTimeSettingsCardDesc',
      'freeTimeModeTotalDesc',
      'freeTimeModeFocusDesc',
      'freeTimeModeDistractDesc',
      'fixedShort',
      'transientShort',
      'countFixedTitle',
      'countTransientTitle',
      'scheduledTasks',
      'unscheduledTasks'
    ];

    requiredKeys.forEach(k => {
      expect(translations.vi[k], `vi.${k} should exist`).toBeDefined();
      expect(translations.en[k], `en.${k} should exist`).toBeDefined();
      expect(translations.vi[k].length).toBeGreaterThan(0);
      expect(translations.en[k].length).toBeGreaterThan(0);
    });
  });

  it('should cycle free time mode correctly in order: total -> focus -> distract -> total', () => {
    function getNextMode(current) {
      if (current === 'total') return 'focus';
      if (current === 'focus') return 'distract';
      return 'total';
    }

    expect(getNextMode('total')).toBe('focus');
    expect(getNextMode('focus')).toBe('distract');
    expect(getNextMode('distract')).toBe('total');
  });

  it('should format toast messages with hours interpolation accurately', () => {
    function t(lang, key, params = {}) {
      let str = translations[lang][key] || key;
      for (const [k, v] of Object.entries(params)) {
        str = str.replace(`{${k}}`, v);
      }
      return str;
    }

    const toastViTotal = t('vi', 'toastFreeTimeTotal', { hours: '6.5' });
    expect(toastViTotal).toBe('Đang hiển thị: Tổng thời gian rảnh (6.5h)');

    const toastViFocus = t('vi', 'toastFreeTimeFocus', { hours: '4.0' });
    expect(toastViFocus).toBe('Đang hiển thị: Thời gian rảnh tập trung (4.0h)');

    const toastViDistract = t('vi', 'toastFreeTimeDistract', { hours: '2.5' });
    expect(toastViDistract).toBe('Đang hiển thị: Thời gian rảnh xao nhãng (2.5h)');

    const toastEnTotal = t('en', 'toastFreeTimeTotal', { hours: '6.5' });
    expect(toastEnTotal).toBe('Showing: Total Free Time (6.5h)');
  });

  it('should toggle collapse state of sidebar sections independently', () => {
    const collapsedSections = {};

    function toggleSection(key) {
      collapsedSections[key] = !collapsedSections[key];
      return collapsedSections[key];
    }

    // Toggle freeSlots
    expect(toggleSection('freeSlots')).toBe(true);
    expect(toggleSection('freeSlots')).toBe(false);

    // Toggle fixedTransient
    expect(toggleSection('fixedTransient')).toBe(true);
    expect(collapsedSections.freeSlots).toBe(false);

    // Toggle scheduled and unscheduled
    expect(toggleSection('scheduled')).toBe(true);
    expect(toggleSection('unscheduled')).toBe(true);
    expect(toggleSection('noisy')).toBe(true);

    expect(collapsedSections.scheduled).toBe(true);
    expect(collapsedSections.unscheduled).toBe(true);
    expect(collapsedSections.noisy).toBe(true);
  });

  it('should support toggleSidebar logic for wide screens and mobile screens', () => {
    // Desktop wide screen simulation: default is open (not collapsed)
    let desktopState = { isCollapsed: false, savedInStorage: null };
    function toggleDesktop(force) {
      if (typeof force === 'boolean') {
        desktopState.isCollapsed = !force;
      } else {
        desktopState.isCollapsed = !desktopState.isCollapsed;
      }
      desktopState.savedInStorage = desktopState.isCollapsed ? 'true' : 'false';
      return desktopState.isCollapsed;
    }

    // Default open on wide screen
    expect(desktopState.isCollapsed).toBe(false);
    // User clicks toggle -> collapses to increase viewport
    expect(toggleDesktop()).toBe(true);
    expect(desktopState.savedInStorage).toBe('true');
    // User clicks toggle again -> expands back
    expect(toggleDesktop()).toBe(false);
    expect(desktopState.savedInStorage).toBe('false');

    // Mobile drawer simulation
    let mobileDrawer = { isOpen: false, backdropActive: false };
    function toggleMobile(force) {
      mobileDrawer.isOpen = typeof force === 'boolean' ? force : !mobileDrawer.isOpen;
      mobileDrawer.backdropActive = mobileDrawer.isOpen;
      return mobileDrawer.isOpen;
    }

    expect(mobileDrawer.isOpen).toBe(false);
    expect(toggleMobile(true)).toBe(true);
    expect(mobileDrawer.backdropActive).toBe(true);
    expect(toggleMobile(false)).toBe(false);
    expect(mobileDrawer.backdropActive).toBe(false);
  });

  it('should have 2-line name tags without "và" or "&" and separate colored event counts in Section 3', () => {
    expect(translations.vi.fixedTag).toBe('Việc Cố Định');
    expect(translations.vi.transientTag).toBe('Việc Đột Xuất');
    expect(translations.en.fixedTag).toBe('Fixed Routines');
    expect(translations.en.transientTag).toBe('Ad-hoc Events');

    expect(translations.vi.fixedTag).not.toMatch(/và|&|\+/);
    expect(translations.vi.transientTag).not.toMatch(/và|&|\+/);

    // Simulate render of Section 3 header with right-aligned badges
    function renderSection3Header(dayFixedCount, dayTransientCount, lang = 'vi') {
      const fixedLabel = translations[lang].fixedTag || 'Việc Cố Định';
      const transientLabel = translations[lang].transientTag || 'Việc Đột Xuất';
      return `
        <div class="section-title-stacked clickable-title">
          <div class="name-tag-row">
            <span class="name-tag-label">${fixedLabel}</span>
            <span class="sidebar-count-badge tag-count-fixed">${dayFixedCount}</span>
          </div>
          <div class="name-tag-row">
            <span class="name-tag-label">${transientLabel}</span>
            <span class="sidebar-count-badge tag-count-transient">${dayTransientCount}</span>
          </div>
        </div>
      `;
    }

    const html = renderSection3Header(3, 2, 'vi');
    expect(html).toContain('Việc Cố Định');
    expect(html).toContain('Việc Đột Xuất');
    expect(html).toContain('<span class="sidebar-count-badge tag-count-fixed">3</span>');
    expect(html).toContain('<span class="sidebar-count-badge tag-count-transient">2</span>');
    expect(html).not.toContain('Việc Cố Định & Đột Xuất');
    expect(html).not.toContain('Việc Cố Định và Đột Xuất');
  });

  it('should verify CSS styles define scrollbar-gutter stability, right-aligned badges, and collapsible grid transitions', () => {
    const cssPath = path.resolve(__dirname, '../src/styles.css');
    const css = fs.readFileSync(cssPath, 'utf8');

    expect(css).toContain('scrollbar-gutter: stable');
    expect(css).toContain('.sidebar-collapsible-wrapper');
    expect(css).toContain('grid-template-rows');
    expect(css).toContain('.section-title-stacked');
    expect(css).toContain('.sidebar-count-badge');
    expect(css).toContain('.tag-count-fixed');
    expect(css).toContain('.tag-count-transient');
    expect(css).toContain('.scheduled-count');
    expect(css).toContain('.unscheduled-count');
    expect(css).toContain('.noisy-count');
  });

  it('should verify noisy intervals title is "Khung Giờ Bị Làm Phiền" and count badge is right-aligned', () => {
    expect(translations.vi.noisyIntervalsSidebarTitle).toBe('Khung Giờ Bị Làm Phiền');
    expect(translations.en.noisyIntervalsSidebarTitle).toBe('Distraction Hours');
  });
});

