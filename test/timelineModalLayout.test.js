import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('Task Modal Timeline Vertical Expansion and Layout', () => {
  const appJsPath = path.resolve(__dirname, '../src/app.js');
  const stylesCssPath = path.resolve(__dirname, '../src/styles.css');
  const appJsContent = fs.readFileSync(appJsPath, 'utf-8');
  const stylesCssContent = fs.readFileSync(stylesCssPath, 'utf-8');

  it('maintains default width of 290px for the timeline panel without changing default width', () => {
    expect(appJsContent).toContain('class="task-modal-timeline-col"');
    expect(appJsContent).toContain('width:290px');
  });

  it('configures split layout with align-items:stretch so timeline extends down to match form and recurrence section', () => {
    expect(appJsContent).toContain('task-modal-split-layout" style="display:flex; gap:20px; align-items:stretch; width:100%;');
    expect(appJsContent).toContain('align-self:stretch');
  });

  it('expands timeline track wrapper with flex:1 and min-height 480px', () => {
    expect(appJsContent).toContain('id="${prefix}-timeline-track-wrapper" class="task-modal-timeline-track-wrapper" style="display:flex; gap:8px; align-items:stretch; flex:1; min-height:480px;');
  });

  it('provides 2-hour detail markings for comprehensive 24h timeline visibility', () => {
    const requiredHourMarks = [
      '<span>00:00</span>',
      '<span>02:00</span>',
      '<span>04:00</span>',
      '<span>06:00</span>',
      '<span>08:00</span>',
      '<span>10:00</span>',
      '<span>12:00</span>',
      '<span>14:00</span>',
      '<span>16:00</span>',
      '<span>18:00</span>',
      '<span>20:00</span>',
      '<span>22:00</span>',
      '<span>24:00</span>'
    ];

    requiredHourMarks.forEach(mark => {
      expect(appJsContent).toContain(mark);
    });
  });

  it('contains subtle background grid lines and responsive style rules in styles.css', () => {
    expect(stylesCssContent).toContain('.task-modal-timeline-track {');
    expect(stylesCssContent).toContain('repeating-linear-gradient');
    expect(stylesCssContent).toContain('.task-modal-timeline-track-wrapper {');
  });
});
