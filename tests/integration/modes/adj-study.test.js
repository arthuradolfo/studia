import { vi, describe, it, expect, beforeEach } from 'vitest';

const store = {};
Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (k) => store[k] ?? null,
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: (k) => { delete store[k]; },
    clear: () => { for (const k in store) delete store[k]; },
  },
  writable: true,
  configurable: true,
});

import '../../../js/translations/pt.js';
import '../../../js/translations/en.js';

import { initAdjEstudo } from '../../../js/modes/adj-study.js';
import { CASES, NUMBERS } from '../../../js/data/declensions.js';
import { GENDERS } from '../../../js/data/adj-declensions.js';
import { ADJ_PARADIGMS } from '../../../js/data/adjectives.js';

describe('adj-study mode', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="adjDecSelector"></div>
      <div id="adjTables"></div>
    `;
    store['latin-lang'] = 'pt';
  });

  it('creates buttons for each class plus "All"', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const buttons = sel.querySelectorAll('button');
    // ADJ_PARADIGMS has classes I and II, plus an "All" button
    const classes = [...new Set(ADJ_PARADIGMS.map(a => a[0]))].sort();
    expect(buttons.length).toBe(classes.length + 1);
    // Last button is "All"
    expect(buttons[buttons.length - 1].dataset.cls).toBe('all');
  });

  it('clicking a class button renders 3-gender tables', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const firstBtn = sel.querySelector('button');
    firstBtn.click();

    const tables = document.getElementById('adjTables');
    const thElements = tables.querySelectorAll('th');
    const thTexts = [...thElements].map(th => th.textContent);
    // Each table has headers: Casus, Masculinum, Femininum, Neutrum
    expect(thTexts).toContain('Masculinum');
    expect(thTexts).toContain('Femininum');
    expect(thTexts).toContain('Neutrum');
  });

  it('tables have rows for 6 cases x 2 numbers', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const firstBtn = sel.querySelector('button');
    firstBtn.click();

    const tables = document.getElementById('adjTables');
    // Each adj-table should have: 1 header row + 2 num-header rows + 12 case rows = 15 rows
    const adjTables = tables.querySelectorAll('table.adj-table');
    expect(adjTables.length).toBeGreaterThan(0);
    adjTables.forEach(table => {
      const numHeaders = table.querySelectorAll('tr.num-header');
      expect(numHeaders.length).toBe(NUMBERS.length);
      // Count case rows (non-header, non-num-header rows, minus the th row)
      const allRows = table.querySelectorAll('tr');
      // 1 header + 2 num-header + (6 cases * 2 numbers) = 15
      expect(allRows.length).toBe(1 + NUMBERS.length + CASES.length * NUMBERS.length);
    });
  });

  it('clicking "All" renders all paradigms', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const allBtn = [...sel.querySelectorAll('button')].find(b => b.dataset.cls === 'all');
    allBtn.click();

    const tables = document.getElementById('adjTables');
    const adjTables = tables.querySelectorAll('table.adj-table');
    expect(adjTables.length).toBe(ADJ_PARADIGMS.length);
  });

  it('marks the clicked button as selected and removes from others', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const buttons = sel.querySelectorAll('button');
    buttons[0].click();
    expect(buttons[0].classList.contains('selected')).toBe(true);
    expect(buttons[1].classList.contains('selected')).toBe(false);

    buttons[1].click();
    expect(buttons[0].classList.contains('selected')).toBe(false);
    expect(buttons[1].classList.contains('selected')).toBe(true);
  });

  it('re-calling initAdjEstudo preserves selected state', () => {
    initAdjEstudo();
    const sel = document.getElementById('adjDecSelector');
    const allBtn = [...sel.querySelectorAll('button')].find(b => b.dataset.cls === 'all');
    allBtn.click();
    expect(allBtn.classList.contains('selected')).toBe(true);

    // Re-call init — should preserve 'all' selection
    initAdjEstudo();
    const sel2 = document.getElementById('adjDecSelector');
    const allBtn2 = [...sel2.querySelectorAll('button')].find(b => b.dataset.cls === 'all');
    expect(allBtn2.classList.contains('selected')).toBe(true);
    // Tables should also be rendered
    const tables = document.getElementById('adjTables');
    expect(tables.querySelectorAll('table.adj-table').length).toBe(ADJ_PARADIGMS.length);
  });
});
