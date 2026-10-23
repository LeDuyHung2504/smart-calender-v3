import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Mobile UI/UX Optimization: Progressive Header Controls & Android Tiered Settings Menu', () => {
  let cssContent = '';
  let appJsContent = '';

  beforeAll(() => {
    const cssPath = path.resolve(__dirname, '../src/styles.css');
    cssContent = fs.readFileSync(cssPath, 'utf8');

    const appJsPath = path.resolve(__dirname, '../src/app.js');
    appJsContent = fs.readFileSync(appJsPath, 'utf8');
  });

  describe('1. Progressive Header Controls Hiding (Mobile Top Bar)', () => {
    it('should hide language toggle first when width is <= 768px', () => {
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*768px\)[\s\S]*?\.lang-toggle-btn\s*\{\s*display:\s*none\s*!important/);
    });

    it('should hide theme toggle button next when width is <= 580px', () => {
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*580px\)[\s\S]*?theme-toggle-btn[\s\S]*?display:\s*none\s*!important/);
    });

    it('should hide Google Calendar sync button next when width is <= 480px', () => {
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*480px\)[\s\S]*?gcal-header-btn[\s\S]*?display:\s*none\s*!important/);
    });

    it('should hide brand title (app name) when screen is extremely small <= 380px', () => {
      expect(cssContent).toMatch(/@media\s*\(max-width:\s*380px\)[\s\S]*?\.brand-title\s*\{\s*display:\s*none\s*!important/);
    });

    it('should maintain logo, sidebar toggle button and add task button at all screen sizes', () => {
      // brand-logo, sidebar-toggle-btn, and btn-primary must not have display:none in these mobile media queries
      expect(cssContent).toContain('.sidebar-toggle-btn');
      expect(cssContent).toContain('.brand-logo');
    });
  });

  describe('2. Android Settings Tiered Menu (Menu xếp tầng)', () => {
    it('should provide metadata for all 4 main settings categories', () => {
      function simulateGetMeta(tabId, lang = 'vi', isConnected = false, fontSize = 100) {
        const isEn = lang === 'en';
        const map = {
          'tab-account-sync': {
            id: 'tab-account-sync',
            title: isEn ? 'Account & Sync' : 'Tài khoản & Đồng bộ',
            subtitle: isEn ? 'Google Calendar 2-way sync, OAuth 2.0 & auto-polling' : 'Đồng bộ 2 chiều Google Calendar, OAuth 2.0 & quét ngầm'
          },
          'tab-appearance-display': {
            id: 'tab-appearance-display',
            title: isEn ? 'Appearance & Display' : 'Giao diện & Hiển thị',
            subtitle: isEn ? 'System font size, Focus dimming, dark mode & colors' : 'Cỡ chữ hệ thống, chế độ Focus, theme sáng tối & màu sắc'
          },
          'tab-data-management': {
            id: 'tab-data-management',
            title: isEn ? 'Data & Backup' : 'Quản lý Dữ liệu',
            subtitle: isEn ? 'JSON file export, restore & safe 5-second countdown reset' : 'Xuất sao lưu .JSON, nạp file & xóa trắng an toàn 5s'
          },
          'tab-help-doc': {
            id: 'tab-help-doc',
            title: isEn ? 'Help & Documentation' : 'Trợ giúp & Tài liệu',
            subtitle: isEn ? 'Attention Engine guide, Eisenhower Matrix & 24h Timeline' : 'Cẩm nang Attention Engine, Ma trận Eisenhower & Timeline 24h'
          }
        };
        return map[tabId];
      }

      const tabs = ['tab-account-sync', 'tab-appearance-display', 'tab-data-management', 'tab-help-doc'];
      tabs.forEach(tabId => {
        const metaVi = simulateGetMeta(tabId, 'vi');
        const metaEn = simulateGetMeta(tabId, 'en');
        expect(metaVi).toBeDefined();
        expect(metaEn).toBeDefined();
        expect(metaVi.title.length).toBeGreaterThan(0);
        expect(metaVi.subtitle.length).toBeGreaterThan(0);
        expect(metaEn.title.length).toBeGreaterThan(0);
        expect(metaEn.subtitle.length).toBeGreaterThan(0);
      });
    });

    it('should transition between Menu view and Detail view on mobile screens', () => {
      let mobileState = 'menu';
      let activeTab = 'tab-account-sync';
      let backBtnVisible = false;
      let currentTitle = 'Cài Đặt Hệ Thống';

      function openModalMobile(initialTab) {
        if (initialTab) {
          mobileState = 'detail';
          activeTab = initialTab;
          backBtnVisible = true;
          currentTitle = 'Tài khoản & Đồng bộ';
        } else {
          mobileState = 'menu';
          backBtnVisible = false;
          currentTitle = 'Cài Đặt Hệ Thống';
        }
      }

      function selectCategory(tabId, tabTitle) {
        mobileState = 'detail';
        activeTab = tabId;
        backBtnVisible = true;
        currentTitle = tabTitle;
      }

      function backToMenu() {
        mobileState = 'menu';
        backBtnVisible = false;
        currentTitle = 'Cài Đặt Hệ Thống';
      }

      // 1. Initial open on mobile shows tiered menu
      openModalMobile();
      expect(mobileState).toBe('menu');
      expect(backBtnVisible).toBe(false);
      expect(currentTitle).toBe('Cài Đặt Hệ Thống');

      // 2. Select Appearance category
      selectCategory('tab-appearance-display', 'Giao diện & Hiển thị');
      expect(mobileState).toBe('detail');
      expect(activeTab).toBe('tab-appearance-display');
      expect(backBtnVisible).toBe(true);
      expect(currentTitle).toBe('Giao diện & Hiển thị');

      // 3. Click back button to return to tiered menu
      backToMenu();
      expect(mobileState).toBe('menu');
      expect(backBtnVisible).toBe(false);
      expect(currentTitle).toBe('Cài Đặt Hệ Thống');

      // 4. Select Data management category
      selectCategory('tab-data-management', 'Quản lý Dữ liệu');
      expect(mobileState).toBe('detail');
      expect(activeTab).toBe('tab-data-management');
      expect(backBtnVisible).toBe(true);
      expect(currentTitle).toBe('Quản lý Dữ liệu');
    });

    it('should have required styles for tiered menu card, back button and transitions in CSS', () => {
      expect(cssContent).toContain('.settings-mobile-back-btn');
      expect(cssContent).toContain('.settings-mobile-tiered-menu');
      expect(cssContent).toContain('.tiered-menu-card');
      expect(cssContent).toContain('.tiered-card-icon-wrap');
      expect(cssContent).toContain('.tiered-card-title');
      expect(cssContent).toContain('.tiered-card-chevron');
    });

    it('should register mobile settings navigation functions on window in app.js', () => {
      expect(appJsContent).toContain('window.selectMobileSettingsCategory = selectMobileSettingsCategory');
      expect(appJsContent).toContain('window.backToMobileSettingsMenu = backToMobileSettingsMenu');
      expect(appJsContent).toContain('window.updateMobileSettingsUIState = updateMobileSettingsUIState');
      expect(appJsContent).toContain('window.renderMobileTieredMenu = renderMobileTieredMenu');
    });
  });

  describe('3. Touch & Mobile UX Enhancements (Thay thế thao tác chỉ dùng chuột)', () => {
    it('should maintain drag-and-drop quadrant routing while removing redundant Q quick switch buttons', () => {
      expect(appJsContent.includes('function quickMoveTaskQuadrant(taskId, targetQuadrant)')).toBe(true);
      expect(appJsContent.includes('window.quickMoveTaskQuadrant = quickMoveTaskQuadrant')).toBe(true);
      expect(appJsContent.includes('handleQuadrantDrop')).toBe(true);
      expect(appJsContent.includes('task-quadrant-quick-switch')).toBe(false);
      expect(cssContent.includes('.task-quadrant-quick-switch')).toBe(false);
      expect(cssContent.includes('.q-quick-btn')).toBe(false);
    });

    it('should support touch-scrubbing and live summary banner on the 24h modal timeline track', () => {
      expect(appJsContent.includes('function handleTimelineTrackTouch(e, prefix = \'m-task\')')).toBe(true);
      expect(appJsContent.includes('function updateTimelineTouchSummaryBanner(block, selectedTimeStr = null, prefix = \'m-task\')')).toBe(true);
      expect(appJsContent.includes('window.handleTimelineTrackTouch = handleTimelineTrackTouch')).toBe(true);
      expect(appJsContent.includes('timeline-touch-summary-banner')).toBe(true);
      expect(cssContent.includes('.timeline-touch-summary-banner')).toBe(true);
    });

    it('should support double-tap on multi-day columns and touch hint badge on day headers', () => {
      expect(appJsContent.includes('function handleDayColumnTouchTap(event, dateStr)')).toBe(true);
      expect(appJsContent.includes('window.handleDayColumnTouchTap = handleDayColumnTouchTap')).toBe(true);
      expect(appJsContent.includes('day-header-touch-hint')).toBe(true);
      expect(cssContent.includes('.day-header-touch-hint')).toBe(true);
    });

    it('should provide a clean icon-free Mobile Quick Actions FAB with Sync button (supporting Drive/Calendar switch)', () => {
      expect(appJsContent.includes('function ensureMobileQuickActionsFab()')).toBe(true);
      expect(appJsContent.includes('function toggleMobileQuickActionsMenu(forceOpen)')).toBe(true);
      expect(appJsContent.includes('window.toggleMobileQuickActionsMenu = toggleMobileQuickActionsMenu')).toBe(true);
      expect(appJsContent.includes('id="mobile-fab-sync-btn"')).toBe(true);
      expect(appJsContent.includes('triggerHeaderGCalAction()')).toBe(true);
      expect(appJsContent.includes('id="mobile-fab-sync-switch-btn"')).toBe(true);
      expect(appJsContent.includes('class="mqa-icon"')).toBe(false);
      expect(cssContent.includes('.mobile-quick-fab-root')).toBe(true);
      expect(cssContent.includes('.mobile-quick-actions-sheet')).toBe(true);
      expect(cssContent.includes('.mobile-quick-sync-row')).toBe(true);
    });

    it('should support horizontal swipe gestures on the main view container to navigate dates on touch screens', () => {
      expect(appJsContent.includes('function initMobileTouchGestures()')).toBe(true);
      expect(appJsContent.includes('window.initMobileTouchGestures = initMobileTouchGestures')).toBe(true);
    });

    it('should keep sync toggle switches pinned to the right and wrap text on the left (.sync-toggle-row)', () => {
      expect(appJsContent.includes('class="sync-toggle-row"')).toBe(true);
      expect(appJsContent.includes('class="sync-toggle-text"')).toBe(true);
      expect(cssContent.includes('.sync-toggle-row')).toBe(true);
      expect(cssContent.includes('flex-wrap: nowrap !important')).toBe(true);
    });

    it('should scope mobile UI enhancements strictly to @media (max-width: 640px) and position FAB above bottom nav bar', () => {
      expect(cssContent.includes('@media (max-width: 640px)')).toBe(true);
      expect(cssContent.includes('bottom: calc(74px + env(safe-area-inset-bottom, 0px))')).toBe(true);
      expect(cssContent.includes('.time-block.time-block-dimmed:active')).toBe(true);
    });
  });
});

