import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

vi.mock('../../../js/app.js', () => ({ showScreen: vi.fn() }));

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

import {
  getDesafioAdj,
  startAdjDesafio,
  checkAdjDesafio,
} from '../../../js/modes/adj-challenge.js';
import { showScreen } from '../../../js/app.js';
import { CASES, NUMBERS } from '../../../js/data/declensions.js';
import { GENDERS } from '../../../js/data/adj-declensions.js';
import { adjFormKey } from '../../../js/helpers.js';

describe('adj-challenge mode', () => {
  let randomSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    store['latin-lang'] = 'pt';
    document.body.innerHTML = `
      <div id="adjDesafioWord"></div>
      <div id="adjDesafioGrid"></div>
      <div id="adjDesafioResults"></div>
      <button id="adjDesafioSubmit"></button>
    `;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    randomSpy.mockRestore();
  });

  describe('startAdjDesafio', () => {
    it('creates 36 input fields (3 genders x 6 cases x 2 numbers)', () => {
      startAdjDesafio();
      const grid = document.getElementById('adjDesafioGrid');
      const inputs = grid.querySelectorAll('input');
      expect(inputs.length).toBe(GENDERS.length * CASES.length * NUMBERS.length);
    });

    it('calls showScreen with adj-desafio', () => {
      startAdjDesafio();
      expect(showScreen).toHaveBeenCalledWith('adj-desafio');
    });

    it('renders word info', () => {
      startAdjDesafio();
      const wordDiv = document.getElementById('adjDesafioWord');
      expect(wordDiv.innerHTML).toContain('word-info');
      expect(wordDiv.innerHTML).toContain('meaning');
    });

    it('creates 3 gender columns with headers', () => {
      startAdjDesafio();
      const grid = document.getElementById('adjDesafioGrid');
      const cols = grid.querySelectorAll('.challenge-col');
      expect(cols.length).toBe(GENDERS.length);
      const headers = grid.querySelectorAll('h3');
      const headerTexts = [...headers].map(h => h.textContent);
      expect(headerTexts).toContain('Masculinum');
      expect(headerTexts).toContain('Femininum');
      expect(headerTexts).toContain('Neutrum');
    });

    it('each input has correct id pattern', () => {
      startAdjDesafio();
      const grid = document.getElementById('adjDesafioGrid');
      GENDERS.forEach(g => {
        NUMBERS.forEach(num => {
          CASES.forEach(c => {
            const id = `adjDes_${g}_${c}_${num}`;
            const input = document.getElementById(id);
            expect(input).not.toBeNull();
          });
        });
      });
    });
  });

  describe('getDesafioAdj', () => {
    it('returns the selected adjective after startAdjDesafio', () => {
      startAdjDesafio();
      const adj = getDesafioAdj();
      expect(adj).toBeDefined();
      expect(Array.isArray(adj)).toBe(true);
      expect(adj.length).toBe(7);
    });
  });

  describe('checkAdjDesafio', () => {
    it('marks correct fields with correct-field class', () => {
      startAdjDesafio();
      const adj = getDesafioAdj();
      const forms = adj[6];

      // Fill all inputs with correct answers
      GENDERS.forEach(g => {
        NUMBERS.forEach(num => {
          CASES.forEach(c => {
            const id = `adjDes_${g}_${c}_${num}`;
            const input = document.getElementById(id);
            input.value = forms[adjFormKey(g, c, num)];
          });
        });
      });

      checkAdjDesafio();

      // All inputs should have correct-field class
      const grid = document.getElementById('adjDesafioGrid');
      const inputs = grid.querySelectorAll('input');
      inputs.forEach(inp => {
        expect(inp.classList.contains('correct-field')).toBe(true);
        expect(inp.classList.contains('wrong-field')).toBe(false);
      });

      // Results should show 100%
      const results = document.getElementById('adjDesafioResults');
      expect(results.innerHTML).toContain('100%');
      expect(results.innerHTML).toContain('36/36');
    });

    it('marks wrong fields with wrong-field class', () => {
      startAdjDesafio();

      // Leave all inputs empty (wrong answers)
      checkAdjDesafio();

      const grid = document.getElementById('adjDesafioGrid');
      const inputs = grid.querySelectorAll('input');
      inputs.forEach(inp => {
        expect(inp.classList.contains('wrong-field')).toBe(true);
        expect(inp.disabled).toBe(true);
      });
    });

    it('error list shows gender/case/number details for wrong answers', () => {
      startAdjDesafio();

      // Fill only the first input correctly, leave rest empty
      const adj = getDesafioAdj();
      const forms = adj[6];
      const firstG = GENDERS[0];
      const firstNum = NUMBERS[0];
      const firstC = CASES[0];
      const firstId = `adjDes_${firstG}_${firstC}_${firstNum}`;
      document.getElementById(firstId).value = forms[adjFormKey(firstG, firstC, firstNum)];

      checkAdjDesafio();

      const results = document.getElementById('adjDesafioResults');
      expect(results.innerHTML).toContain('error-list');
      expect(results.innerHTML).toContain('1/36');
      // Error entries should contain gender label and case info
      const errRows = results.querySelectorAll('.err-row');
      expect(errRows.length).toBe(35);
      // Each error row mentions the correct value
      errRows.forEach(row => {
        expect(row.querySelector('.correct-val')).not.toBeNull();
      });
    });

    it('disables all inputs after check', () => {
      startAdjDesafio();
      checkAdjDesafio();

      const grid = document.getElementById('adjDesafioGrid');
      const inputs = grid.querySelectorAll('input');
      inputs.forEach(inp => {
        expect(inp.disabled).toBe(true);
      });
    });

    it('submit button changes to "new word" after check', () => {
      startAdjDesafio();
      checkAdjDesafio();

      const btn = document.getElementById('adjDesafioSubmit');
      // After check, button text changes to the "new" translation
      expect(btn.textContent).not.toBe('');
      // onclick should be startAdjDesafio
      expect(btn.onclick).toBe(startAdjDesafio);
    });
  });
});
