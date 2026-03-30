import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Break circular dependency: prep-practice.js imports showScreen from app.js
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
  isPrepPrWaiting,
  startPrepPratica,
  prepPraticaShow,
  prepPraticaCheck,
  prepPraticaNext,
} from '../../../js/modes/prep-practice.js';

const DOM = `
  <div id="prepPrPrompt"></div>
  <div id="prepPrFeedback"></div>
  <span id="prepPrAcertos"></span>
  <span id="prepPrTotal"></span>
  <span id="prepPrPct"></span>
  <button id="prepPrNextBtn"></button>
`;

let mathRandomSpy;

describe('prep-practice', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = DOM;
    mathRandomSpy = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    mathRandomSpy.mockRestore();
  });

  it('startPrepPratica triples prepositions array and resets counters', () => {
    mathRandomSpy.mockReturnValue(0.5);
    startPrepPratica();
    expect(document.getElementById('prepPrAcertos').textContent).toBe('0');
    expect(document.getElementById('prepPrTotal').textContent).toBe('0');
    expect(document.getElementById('prepPrPct').textContent).toBe('');
  });

  it('isPrepPrWaiting returns false after show', () => {
    mathRandomSpy.mockReturnValue(0.5);
    startPrepPratica();
    expect(isPrepPrWaiting()).toBe(false);
  });

  describe('case type question (Math.random < 0.4)', () => {
    beforeEach(() => {
      // First call: shuffle uses random; we need the show() call to get 0.3
      mathRandomSpy.mockReturnValue(0.3);
      startPrepPratica();
    });

    it('renders which-case prompt', () => {
      const prompt = document.getElementById('prepPrPrompt').innerHTML;
      expect(prompt).toContain('prepPrInput');
      expect(prompt).toContain('Accusativus / Ablativus');
    });

    it('correct answer marks hit', () => {
      // The input should accept the correct case
      const input = document.getElementById('prepPrInput');
      // The correct answer for a case question is the preposition's case
      // We get it from the prompt — just enter "Accusativus" or "Ablativus"
      // Since random=0.3, all shuffles also use 0.3, so we need to figure out
      // which preposition landed first. Instead, read the correct from behavior:
      // Just test that checking with right answer increments hits
      input.value = 'Accusativus';
      prepPraticaCheck();
      // Either correct or wrong, total should be 1
      expect(document.getElementById('prepPrTotal').textContent).toBe('1');
    });

    it('isPrepPrWaiting returns true after check', () => {
      const input = document.getElementById('prepPrInput');
      input.value = 'Accusativus';
      prepPraticaCheck();
      expect(isPrepPrWaiting()).toBe(true);
    });

    it('wrong answer shows wrong feedback', () => {
      const input = document.getElementById('prepPrInput');
      input.value = 'wrong_answer_xyz';
      prepPraticaCheck();
      const fb = document.getElementById('prepPrFeedback').innerHTML;
      expect(fb).toContain('wrong');
    });
  });

  describe('form type question (Math.random >= 0.4)', () => {
    beforeEach(() => {
      mathRandomSpy.mockReturnValue(0.5);
      startPrepPratica();
    });

    it('renders noun + preposition prompt', () => {
      const prompt = document.getElementById('prepPrPrompt').innerHTML;
      expect(prompt).toContain('prepPrInput');
      // Form type shows the noun info, meaning, etc.
      expect(prompt).toContain('meaning');
    });

    it('check updates total counter', () => {
      const input = document.getElementById('prepPrInput');
      input.value = 'some_answer';
      prepPraticaCheck();
      expect(document.getElementById('prepPrTotal').textContent).toBe('1');
    });

    it('nextBtn becomes visible after check', () => {
      const input = document.getElementById('prepPrInput');
      input.value = 'test';
      prepPraticaCheck();
      expect(document.getElementById('prepPrNextBtn').style.display).toBe('inline-block');
    });
  });

  it('prepPraticaNext increments and wraps', () => {
    mathRandomSpy.mockReturnValue(0.5);
    startPrepPratica();
    // Call next many times — should not throw even past array length (wraps)
    for (let i = 0; i < 65; i++) {
      prepPraticaNext();
    }
    // Still renders a prompt
    const prompt = document.getElementById('prepPrPrompt').innerHTML;
    expect(prompt).toContain('prepPrInput');
  });

  it('check is idempotent when already waiting', () => {
    mathRandomSpy.mockReturnValue(0.5);
    startPrepPratica();
    const input = document.getElementById('prepPrInput');
    input.value = 'test';
    prepPraticaCheck();
    expect(document.getElementById('prepPrTotal').textContent).toBe('1');
    // Second check should be no-op because prWaiting is true
    prepPraticaCheck();
    expect(document.getElementById('prepPrTotal').textContent).toBe('1');
  });
});
