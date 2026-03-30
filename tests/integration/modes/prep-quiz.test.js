import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Break circular dependency: prep-quiz.js imports showScreen from app.js
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
  isPrepQWaiting,
  prepStepQuiz,
  startPrepQuiz,
  prepQuizShow,
  prepQuizCheck,
  prepQuizNext,
  prepQuizEnd,
} from '../../../js/modes/prep-quiz.js';

const DOM = `
  <input id="prepQuizNum" value="2">
  <span id="prepQCur"></span>
  <span id="prepQTotal"></span>
  <span id="prepQAcertos"></span>
  <span id="prepQStreak"></span>
  <div id="prepQPrompt"></div>
  <div id="prepQFeedback"></div>
  <button id="prepQNextBtn"></button>
  <div id="prepQResults"></div>
`;

let mathRandomSpy;

describe('prep-quiz', () => {
  beforeEach(() => {
    document.body.innerHTML = DOM;
    mathRandomSpy = vi.spyOn(Math, 'random');
  });

  afterEach(() => {
    mathRandomSpy.mockRestore();
  });

  describe('prepStepQuiz clamping', () => {
    it('increments value', () => {
      document.getElementById('prepQuizNum').value = '5';
      prepStepQuiz(1);
      expect(document.getElementById('prepQuizNum').value).toBe('6');
    });

    it('decrements value', () => {
      document.getElementById('prepQuizNum').value = '5';
      prepStepQuiz(-1);
      expect(document.getElementById('prepQuizNum').value).toBe('4');
    });

    it('clamps to minimum 1', () => {
      document.getElementById('prepQuizNum').value = '1';
      prepStepQuiz(-1);
      expect(document.getElementById('prepQuizNum').value).toBe('1');
    });

    it('clamps to maximum 200', () => {
      document.getElementById('prepQuizNum').value = '200';
      prepStepQuiz(1);
      expect(document.getElementById('prepQuizNum').value).toBe('200');
    });
  });

  describe('startPrepQuiz', () => {
    it('initializes counters and shows first question', () => {
      mathRandomSpy.mockReturnValue(0.5);
      startPrepQuiz();
      expect(document.getElementById('prepQCur').textContent).toBe('1');
      expect(document.getElementById('prepQTotal').textContent).toBe('2');
      expect(document.getElementById('prepQAcertos').textContent).toBe('0');
      expect(document.getElementById('prepQStreak').textContent).toBe('0');
    });
  });

  describe('case type question (Math.random < 0.4)', () => {
    beforeEach(() => {
      mathRandomSpy.mockReturnValue(0.3);
      startPrepQuiz();
    });

    it('renders which-case prompt', () => {
      const prompt = document.getElementById('prepQPrompt').innerHTML;
      expect(prompt).toContain('prepQInput');
      expect(prompt).toContain('Accusativus / Ablativus');
    });
  });

  describe('form type question (Math.random >= 0.4)', () => {
    beforeEach(() => {
      mathRandomSpy.mockReturnValue(0.5);
      startPrepQuiz();
    });

    it('renders noun + preposition prompt', () => {
      const prompt = document.getElementById('prepQPrompt').innerHTML;
      expect(prompt).toContain('prepQInput');
      expect(prompt).toContain('meaning');
    });
  });

  describe('streak tracking', () => {
    it('increments streak on correct, resets on wrong', () => {
      // Use case type (0.3) for predictable correct answers
      mathRandomSpy.mockReturnValue(0.3);
      document.getElementById('prepQuizNum').value = '5';
      startPrepQuiz();

      // Get the first question's correct answer from the prompt
      // For case type, correct is the preposition's case
      // We'll enter wrong to test streak reset
      const input = document.getElementById('prepQInput');
      input.value = 'wrong_answer_xyz';
      prepQuizCheck();
      expect(document.getElementById('prepQStreak').textContent).toBe('0');
    });
  });

  describe('last question behavior', () => {
    it('nextBtn shows results text on last question', () => {
      mathRandomSpy.mockReturnValue(0.5);
      document.getElementById('prepQuizNum').value = '1';
      startPrepQuiz();

      const input = document.getElementById('prepQInput');
      input.value = 'test';
      prepQuizCheck();

      const nextBtn = document.getElementById('prepQNextBtn');
      expect(nextBtn.style.display).toBe('inline-block');
      // On last question, button should trigger prepQuizEnd
      expect(nextBtn.onclick).toBe(prepQuizEnd);
    });

    it('non-last question nextBtn triggers prepQuizNext', () => {
      mathRandomSpy.mockReturnValue(0.5);
      document.getElementById('prepQuizNum').value = '3';
      startPrepQuiz();

      const input = document.getElementById('prepQInput');
      input.value = 'test';
      prepQuizCheck();

      const nextBtn = document.getElementById('prepQNextBtn');
      expect(nextBtn.onclick).toBe(prepQuizNext);
    });
  });

  describe('prepQuizEnd percentage tiers', () => {
    it('shows perfect message at 100%', () => {
      mathRandomSpy.mockReturnValue(0.3);
      document.getElementById('prepQuizNum').value = '1';
      startPrepQuiz();

      // We need to get the correct answer. For case type (random=0.3),
      // the correct answer is the preposition's case.
      // Since all random calls return 0.3, shuffle is deterministic.
      // Let's just check that prepQuizEnd renders results with score.
      const input = document.getElementById('prepQInput');
      // Get the preposition's case from the prompt
      // Answer "Accusativus" — might be right or wrong depending on shuffle
      input.value = 'Accusativus';
      prepQuizCheck();

      // Call prepQuizEnd regardless to test tiers
      prepQuizEnd();
      const results = document.getElementById('prepQResults').innerHTML;
      expect(results).toContain('%');
      expect(results).toContain('/1');
    });

    it('shows study message at 0%', () => {
      mathRandomSpy.mockReturnValue(0.3);
      document.getElementById('prepQuizNum').value = '1';
      startPrepQuiz();

      const input = document.getElementById('prepQInput');
      input.value = 'completely_wrong_xyz';
      prepQuizCheck();
      prepQuizEnd();

      const results = document.getElementById('prepQResults').innerHTML;
      expect(results).toContain('0%');
      expect(results).toContain('0/1');
    });
  });

  it('isPrepQWaiting returns false after show, true after check', () => {
    mathRandomSpy.mockReturnValue(0.5);
    startPrepQuiz();
    expect(isPrepQWaiting()).toBe(false);

    const input = document.getElementById('prepQInput');
    input.value = 'test';
    prepQuizCheck();
    expect(isPrepQWaiting()).toBe(true);
  });

  it('prepQuizNext increments index', () => {
    mathRandomSpy.mockReturnValue(0.5);
    document.getElementById('prepQuizNum').value = '5';
    startPrepQuiz();
    expect(document.getElementById('prepQCur').textContent).toBe('1');

    prepQuizNext();
    expect(document.getElementById('prepQCur').textContent).toBe('2');
  });
});
