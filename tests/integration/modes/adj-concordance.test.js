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
  isConcWaiting,
  startConcordance,
  concShow,
  concCheck,
  concNext,
} from '../../../js/modes/adj-concordance.js';
import { showScreen } from '../../../js/app.js';

describe('adj-concordance mode', () => {
  let randomSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    store['latin-lang'] = 'pt';
    document.body.innerHTML = `
      <div id="concPrompt"></div>
      <div id="concFeedback"></div>
      <span id="concAcertos"></span>
      <span id="concTotal"></span>
      <span id="concPct"></span>
      <button id="concNextBtn"></button>
    `;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    randomSpy.mockRestore();
  });

  describe('startConcordance', () => {
    it('resets state and calls showScreen', () => {
      startConcordance();
      expect(showScreen).toHaveBeenCalledWith('adj-concordance');
      expect(document.getElementById('concAcertos').textContent).toBe('0');
      expect(document.getElementById('concTotal').textContent).toBe('0');
      expect(document.getElementById('concPct').textContent).toBe('');
      expect(document.getElementById('concFeedback').innerHTML).toBe('');
      expect(document.getElementById('concNextBtn').style.display).toBe('none');
    });
  });

  describe('concShow', () => {
    it('renders noun + adjective prompt with 2 input fields', () => {
      startConcordance();
      const prompt = document.getElementById('concPrompt');
      // Should have two word-info divs (noun and adjective)
      const wordInfos = prompt.querySelectorAll('.word-info');
      expect(wordInfos.length).toBe(2);
      // Should have two input fields
      expect(prompt.querySelector('#concNounInput')).not.toBeNull();
      expect(prompt.querySelector('#concAdjInput')).not.toBeNull();
      // Should have a submit button
      expect(prompt.querySelector('#concSubmitBtn')).not.toBeNull();
    });

    it('shows case info with caso and numero', () => {
      startConcordance();
      const prompt = document.getElementById('concPrompt');
      expect(prompt.innerHTML).toContain('case-info');
    });
  });

  describe('concCheck', () => {
    it('both correct: shows success feedback and increments hits', () => {
      startConcordance();
      // We need to find the correct answers — get them by checking a wrong attempt
      const nounInput = document.getElementById('concNounInput');
      const adjInput = document.getElementById('concAdjInput');
      nounInput.value = 'wrong_noun';
      adjInput.value = 'wrong_adj';
      concCheck();

      const fb = document.getElementById('concFeedback');
      expect(fb.innerHTML).toContain('wrong');
      // Parse the correct answers from feedback
      const strongs = fb.querySelectorAll('strong');
      const correctNoun = strongs[0] ? strongs[0].textContent : '';
      const correctAdj = strongs[1] ? strongs[1].textContent : '';

      // Now restart and answer correctly
      startConcordance();
      document.getElementById('concNounInput').value = correctNoun;
      document.getElementById('concAdjInput').value = correctAdj;
      concCheck();

      const fb2 = document.getElementById('concFeedback');
      expect(fb2.innerHTML).toContain('correct');
      expect(document.getElementById('concAcertos').textContent).toBe('1');
      expect(document.getElementById('concTotal').textContent).toBe('1');
      expect(document.getElementById('concPct').textContent).toBe('100%');
    });

    it('noun wrong only: shows noun correction', () => {
      startConcordance();
      // Get correct adj by first getting both wrong
      const nounInput = document.getElementById('concNounInput');
      const adjInput = document.getElementById('concAdjInput');
      nounInput.value = 'wrong';
      adjInput.value = 'wrong';
      concCheck();

      const fb = document.getElementById('concFeedback');
      const strongs = fb.querySelectorAll('strong');
      const correctAdj = strongs[1] ? strongs[1].textContent : '';

      // Restart: correct adj, wrong noun
      startConcordance();
      document.getElementById('concNounInput').value = 'wrong_noun';
      document.getElementById('concAdjInput').value = correctAdj;
      concCheck();

      const fb2 = document.getElementById('concFeedback');
      expect(fb2.innerHTML).toContain('wrong');
      // Should mention noun correction
      expect(fb2.innerHTML).toContain('Substantivum');
    });

    it('adj wrong only: shows adj correction', () => {
      startConcordance();
      const nounInput = document.getElementById('concNounInput');
      const adjInput = document.getElementById('concAdjInput');
      nounInput.value = 'wrong';
      adjInput.value = 'wrong';
      concCheck();

      const fb = document.getElementById('concFeedback');
      const strongs = fb.querySelectorAll('strong');
      const correctNoun = strongs[0] ? strongs[0].textContent : '';

      // Restart: correct noun, wrong adj
      startConcordance();
      document.getElementById('concNounInput').value = correctNoun;
      document.getElementById('concAdjInput').value = 'wrong_adj';
      concCheck();

      const fb2 = document.getElementById('concFeedback');
      expect(fb2.innerHTML).toContain('wrong');
      expect(fb2.innerHTML).toContain('Adjectivum');
    });

    it('both wrong: shows both corrections', () => {
      startConcordance();
      document.getElementById('concNounInput').value = 'wrong_noun';
      document.getElementById('concAdjInput').value = 'wrong_adj';
      concCheck();

      const fb = document.getElementById('concFeedback');
      expect(fb.innerHTML).toContain('wrong');
      expect(fb.innerHTML).toContain('Substantivum');
      expect(fb.innerHTML).toContain('Adjectivum');
      // Should show two strong elements with correct answers
      const strongs = fb.querySelectorAll('strong');
      expect(strongs.length).toBe(2);
    });

    it('disables inputs and shows next button after check', () => {
      startConcordance();
      document.getElementById('concNounInput').value = 'test';
      document.getElementById('concAdjInput').value = 'test';
      concCheck();

      expect(document.getElementById('concNounInput').disabled).toBe(true);
      expect(document.getElementById('concAdjInput').disabled).toBe(true);
      expect(document.getElementById('concSubmitBtn').disabled).toBe(true);
      expect(document.getElementById('concNextBtn').style.display).toBe('inline-block');
    });

    it('does nothing when already waiting', () => {
      startConcordance();
      document.getElementById('concNounInput').value = 'test';
      document.getElementById('concAdjInput').value = 'test';
      concCheck();
      expect(document.getElementById('concTotal').textContent).toBe('1');

      concCheck();
      expect(document.getElementById('concTotal').textContent).toBe('1');
    });
  });

  describe('isConcWaiting', () => {
    it('starts false and becomes true after check', () => {
      startConcordance();
      expect(isConcWaiting()).toBe(false);
      document.getElementById('concNounInput').value = 'test';
      document.getElementById('concAdjInput').value = 'test';
      concCheck();
      expect(isConcWaiting()).toBe(true);
    });
  });

  describe('concNext', () => {
    it('increments index and resets waiting state', () => {
      startConcordance();
      document.getElementById('concNounInput').value = 'test';
      document.getElementById('concAdjInput').value = 'test';
      concCheck();
      expect(isConcWaiting()).toBe(true);

      concNext();
      expect(isConcWaiting()).toBe(false);
      expect(document.getElementById('concNextBtn').style.display).toBe('none');
    });

    it('renders a new prompt after next', () => {
      startConcordance();
      concNext();
      const prompt = document.getElementById('concPrompt');
      expect(prompt.querySelector('#concNounInput')).not.toBeNull();
      expect(prompt.querySelector('#concAdjInput')).not.toBeNull();
    });

    it('wraps around word list', () => {
      startConcordance();
      for (let i = 0; i < 200; i++) {
        concNext();
      }
      const prompt = document.getElementById('concPrompt');
      expect(prompt.innerHTML).toContain('word-info');
    });
  });
});
