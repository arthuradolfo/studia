import { vi, describe, it, expect, beforeEach } from 'vitest';

// Register translations so t() works
import '../../../js/translations/pt.js';
import '../../../js/translations/en.js';

import { WORDS } from '../../../js/data/words.js';
import { CASES } from '../../../js/data/declensions.js';
import { initEstudo } from '../../../js/modes/study.js';

describe('study mode — initEstudo', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="decSelector"></div>
      <div id="tables"></div>
    `;
  });

  it('creates buttons for each declension plus "All"', () => {
    initEstudo();
    const buttons = document.querySelectorAll('#decSelector button');
    // Declensions I–V = 5 buttons + 1 "All" button
    const decSet = new Set(WORDS.map(w => w[0]));
    expect(buttons.length).toBe(decSet.size + 1);
    // Last button should be "All"
    const lastBtn = buttons[buttons.length - 1];
    expect(lastBtn.dataset.dec).toBe('all');
  });

  it('clicking a declension button populates tables with only that declension', () => {
    initEstudo();
    const buttons = document.querySelectorAll('#decSelector button');
    // Click the first declension button (I)
    const firstBtn = buttons[0];
    firstBtn.click();

    const dec = firstBtn.dataset.dec;
    const expectedWords = WORDS.filter(w => w[0] === dec);
    const tables = document.querySelectorAll('#tables .decl-card');
    expect(tables.length).toBe(expectedWords.length);

    // Verify selected class
    expect(firstBtn.classList.contains('selected')).toBe(true);
  });

  it('clicking "All" shows all 19 WORDS', () => {
    initEstudo();
    const buttons = document.querySelectorAll('#decSelector button');
    const allBtn = buttons[buttons.length - 1];
    allBtn.click();

    const cards = document.querySelectorAll('#tables .decl-card');
    expect(cards.length).toBe(WORDS.length);
    expect(WORDS.length).toBe(19);
  });

  it('each table has 6 case rows', () => {
    initEstudo();
    // Click "All" to render all tables
    const buttons = document.querySelectorAll('#decSelector button');
    buttons[buttons.length - 1].click();

    const tables = document.querySelectorAll('#tables .decl-table');
    expect(tables.length).toBe(WORDS.length);
    tables.forEach(table => {
      // header row + 6 case rows
      const rows = table.querySelectorAll('tr');
      expect(rows.length).toBe(CASES.length + 1);
    });
  });

  it('re-calling initEstudo preserves selected state', () => {
    initEstudo();
    // Click declension II
    const buttons = document.querySelectorAll('#decSelector button');
    const btn2 = Array.from(buttons).find(b => b.dataset.dec === 'II');
    btn2.click();

    // Re-call initEstudo — should preserve "II" selected
    initEstudo();
    const newButtons = document.querySelectorAll('#decSelector button');
    const newBtn2 = Array.from(newButtons).find(b => b.dataset.dec === 'II');
    expect(newBtn2.classList.contains('selected')).toBe(true);

    // Tables should still show declension II words
    const expectedWords = WORDS.filter(w => w[0] === 'II');
    const cards = document.querySelectorAll('#tables .decl-card');
    expect(cards.length).toBe(expectedWords.length);
  });
});
