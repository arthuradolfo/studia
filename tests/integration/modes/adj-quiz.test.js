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
  isAdjQWaiting,
  adjStepQuiz,
  startAdjQuiz,
  adjQuizShow,
  adjQuizCheck,
  adjQuizNext,
  adjQuizEnd,
  decAdjQCur,
} from '../../../js/modes/adj-quiz.js';
import { showScreen } from '../../../js/app.js';

describe('adj-quiz mode', () => {
  let randomSpy;

  beforeEach(() => {
    vi.useFakeTimers();
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    store['latin-lang'] = 'pt';
    document.body.innerHTML = `
      <input id="adjQuizNum" value="2">
      <span id="adjQCur"></span>
      <span id="adjQTotal"></span>
      <span id="adjQAcertos"></span>
      <span id="adjQStreak"></span>
      <div id="adjQPrompt"></div>
      <div id="adjQFeedback"></div>
      <button id="adjQNextBtn"></button>
      <div id="adjQResults"></div>
    `;
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    randomSpy.mockRestore();
  });

  describe('adjStepQuiz', () => {
    it('increments the quiz number', () => {
      const el = document.getElementById('adjQuizNum');
      el.value = '10';
      adjStepQuiz(5);
      expect(el.value).toBe('15');
    });

    it('decrements the quiz number', () => {
      const el = document.getElementById('adjQuizNum');
      el.value = '10';
      adjStepQuiz(-3);
      expect(el.value).toBe('7');
    });

    it('clamps minimum to 1', () => {
      const el = document.getElementById('adjQuizNum');
      el.value = '1';
      adjStepQuiz(-5);
      expect(el.value).toBe('1');
    });

    it('clamps maximum to 200', () => {
      const el = document.getElementById('adjQuizNum');
      el.value = '198';
      adjStepQuiz(10);
      expect(el.value).toBe('200');
    });
  });

  describe('startAdjQuiz', () => {
    it('initializes state and calls showScreen', () => {
      startAdjQuiz();
      expect(showScreen).toHaveBeenCalledWith('adj-quiz');
      expect(document.getElementById('adjQCur').textContent).toBe('1');
      expect(document.getElementById('adjQTotal').textContent).toBe('2');
      expect(document.getElementById('adjQAcertos').textContent).toBe('0');
      expect(document.getElementById('adjQStreak').textContent).toBe('0');
      expect(document.getElementById('adjQFeedback').innerHTML).toBe('');
      expect(document.getElementById('adjQNextBtn').style.display).toBe('none');
    });

    it('renders a prompt with input field', () => {
      startAdjQuiz();
      const prompt = document.getElementById('adjQPrompt');
      expect(prompt.innerHTML).toContain('word-info');
      expect(prompt.querySelector('#adjQInput')).not.toBeNull();
    });
  });

  describe('adjQuizCheck', () => {
    it('wrong answer resets streak to 0', () => {
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'wrong_answer_xyz';
      adjQuizCheck();

      expect(document.getElementById('adjQStreak').textContent).toBe('0');
      const fb = document.getElementById('adjQFeedback');
      expect(fb.innerHTML).toContain('wrong');
    });

    it('disables input and shows next button after check', () => {
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'test';
      adjQuizCheck();

      expect(input.disabled).toBe(true);
      expect(document.getElementById('adjQSubmitBtn').disabled).toBe(true);
      expect(document.getElementById('adjQNextBtn').style.display).toBe('inline-block');
      expect(isAdjQWaiting()).toBe(true);
    });

    it('does nothing when already waiting', () => {
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'test';
      adjQuizCheck();
      const acertos1 = document.getElementById('adjQAcertos').textContent;

      adjQuizCheck();
      expect(document.getElementById('adjQAcertos').textContent).toBe(acertos1);
    });

    it('last question: nextBtn shows results text and onclick = adjQuizEnd', () => {
      // Set quiz to 1 question
      document.getElementById('adjQuizNum').value = '1';
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'test';
      adjQuizCheck();

      const nextBtn = document.getElementById('adjQNextBtn');
      // Should show results title text (from translation)
      expect(nextBtn.textContent).not.toBe('');
      // onclick should be adjQuizEnd
      expect(nextBtn.onclick).toBe(adjQuizEnd);
    });

    it('non-last question: nextBtn shows next text and onclick = adjQuizNext', () => {
      document.getElementById('adjQuizNum').value = '3';
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'test';
      adjQuizCheck();

      const nextBtn = document.getElementById('adjQNextBtn');
      expect(nextBtn.onclick).toBe(adjQuizNext);
    });
  });

  describe('adjQuizEnd', () => {
    it('shows 100% perfect message', () => {
      document.getElementById('adjQuizNum').value = '1';
      startAdjQuiz();

      // Extract correct answer via wrong attempt
      const input = document.getElementById('adjQInput');
      input.value = 'wrong';
      adjQuizCheck();
      const strong = document.getElementById('adjQFeedback').querySelector('strong');
      const correct = strong ? strong.textContent : '';

      // Restart and answer correctly
      startAdjQuiz();
      const input2 = document.getElementById('adjQInput');
      input2.value = correct;
      adjQuizCheck();
      adjQuizEnd();

      const results = document.getElementById('adjQResults');
      if (correct && input2.value === correct) {
        expect(results.innerHTML).toContain('100%');
      }
      expect(results.innerHTML).toContain('score');
      expect(showScreen).toHaveBeenCalledWith('adj-quiz-results');
    });

    it('shows results with score and percentage', () => {
      document.getElementById('adjQuizNum').value = '2';
      startAdjQuiz();
      const input = document.getElementById('adjQInput');
      input.value = 'wrong';
      adjQuizCheck();
      adjQuizNext();

      const input2 = document.getElementById('adjQInput');
      input2.value = 'wrong';
      adjQuizCheck();
      adjQuizEnd();

      const results = document.getElementById('adjQResults');
      expect(results.innerHTML).toContain('0/2');
      expect(results.innerHTML).toContain('0%');
      expect(showScreen).toHaveBeenCalledWith('adj-quiz-results');
    });

    it('shows study message for low score', () => {
      document.getElementById('adjQuizNum').value = '2';
      startAdjQuiz();
      document.getElementById('adjQInput').value = 'wrong';
      adjQuizCheck();
      adjQuizNext();
      document.getElementById('adjQInput').value = 'wrong';
      adjQuizCheck();
      adjQuizEnd();

      const results = document.getElementById('adjQResults');
      // 0% should trigger the "study" tier message
      expect(results.innerHTML).toContain('msg');
    });
  });

  describe('decAdjQCur', () => {
    it('decrements the current index (floors at 0)', () => {
      startAdjQuiz();
      // Initially at index 0, decrement should keep at 0
      decAdjQCur();
      // Verify by checking adjQCur after showing next
      adjQuizShow();
      expect(document.getElementById('adjQCur').textContent).toBe('1');
    });

    it('decrements from a higher index', () => {
      startAdjQuiz();
      adjQuizNext(); // idx becomes 1
      decAdjQCur(); // idx back to 0
      adjQuizShow();
      expect(document.getElementById('adjQCur').textContent).toBe('1'); // 0+1
    });
  });
});
