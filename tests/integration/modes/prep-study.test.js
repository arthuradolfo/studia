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
import { initPrepEstudo } from '../../../js/modes/prep-study.js';

describe('prep-study – initPrepEstudo', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="prepTables"></div>';
  });

  it('renders two tables (accusative + ablative)', () => {
    initPrepEstudo();
    const tables = document.querySelectorAll('#prepTables table');
    expect(tables.length).toBe(2);
  });

  it('renders two section headings', () => {
    initPrepEstudo();
    const headings = document.querySelectorAll('#prepTables h3');
    expect(headings.length).toBe(2);
  });

  it('accusative section has 11 preposition rows', () => {
    initPrepEstudo();
    const tables = document.querySelectorAll('#prepTables table');
    // First table = accusative; rows minus header row
    const rows = tables[0].querySelectorAll('tr');
    expect(rows.length - 1).toBe(11);
  });

  it('ablative section has 9 preposition rows', () => {
    initPrepEstudo();
    const tables = document.querySelectorAll('#prepTables table');
    const rows = tables[1].querySelectorAll('tr');
    expect(rows.length - 1).toBe(9);
  });

  it('each row shows preposition + case abbreviation', () => {
    initPrepEstudo();
    const firstRow = document.querySelector('#prepTables table tr:nth-child(2) td');
    expect(firstRow.innerHTML).toContain('Acc.');
    const tables = document.querySelectorAll('#prepTables table');
    const ablFirstRow = tables[1].querySelector('tr:nth-child(2) td');
    expect(ablFirstRow.innerHTML).toContain('Abl.');
  });
});
