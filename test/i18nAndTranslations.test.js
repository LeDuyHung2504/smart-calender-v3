import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

describe('ChronoFlow i18n & Translation Parity Suite', () => {
  let translations = {};

  beforeAll(() => {
    const appJsPath = path.resolve(__dirname, '../src/app.js');
    const content = fs.readFileSync(appJsPath, 'utf8');

    // Extract the translations object using regex
    const match = content.match(/const translations = (\{[\s\S]*?\n\};\n)/);
    if (match) {
      // Evaluate translations in a safe sandbox
      const fn = new Function(`return ${match[1]}`);
      translations = fn();
    }
  });

  it('should successfully extract translations from app.js', () => {
    expect(translations).toBeDefined();
    expect(translations.vi).toBeDefined();
    expect(translations.en).toBeDefined();
  });

  it('should have parity for core navigation keys', () => {
    const coreKeys = ['navYear', 'navMonth', 'navDay', 'navEisenhower', 'navSettings', 'btnAddTask'];
    coreKeys.forEach(key => {
      expect(translations.vi[key], `vi.${key} should exist`).toBeDefined();
      expect(translations.en[key], `en.${key} should exist`).toBeDefined();
    });
  });

  it('should have parity for modal, goal, and task action keys', () => {
    const actionKeys = [
      'todayBtn', 'prevBtn', 'nextBtn', 'editBtn', 'deleteBtn',
      'saveBtn', 'cancelBtn', 'addNote', 'goalMonth', 'goalYear'
    ];
    actionKeys.forEach(key => {
      expect(translations.vi[key], `vi.${key} should exist`).toBeDefined();
      expect(translations.en[key], `en.${key} should exist`).toBeDefined();
    });
  });

  it('should not contain empty string translations for vi or en', () => {
    for (const [k, v] of Object.entries(translations.vi)) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
    for (const [k, v] of Object.entries(translations.en)) {
      expect(typeof v).toBe('string');
      expect(v.length).toBeGreaterThan(0);
    }
  });
});
