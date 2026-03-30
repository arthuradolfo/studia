import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// MUST mock app.js BEFORE importing quiz.js to break circular dependency
vi.mock('../../../js/app.js', () => ({ showScreen: vi.fn() }));

// Register translations
import '../../../js/translations/pt.js';
import '../../../js/translations/en.js';

import { showScreen } from '../../../js/app.js';
import {
  stepQuiz,
  isQWaiting,
  decQCur,
  startQuiz,
  quizShow,
  quizCheck,
  quizNext,
  quizEnd,
} from '../../../js/modes/quiz.js';

describe('quiz mode', () => {
  let randomSpy;

  beforeEach(() => {
    document.body.innerHTML = `
      <input id="quizNum" value="3">
      <span id="qCur"></span>
      <span id="qTotal"></span>
      <span id="qAcertos"></span>
      <span id="qStreak"></span>
      <div id="qPrompt"></div>
      <div id="qFeedback"></div>
      <button id="qNextBtn"></button>
      <div id="qResults"></div>
    `;
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.useFakeTimers();
  });

  afterEach(() => {
    randomSpy.mockRestore();
    vi.useRealTimers();
  });

  describe('stepQuiz', () => {
    it('increments quizNum value', () => {
      const inp = document.getElementById('quizNum');
      inp.value = '5';
      stepQuiz(1);
      expect(inp.value).toBe('6');
    });

    it('decrements quizNum value', () => {
      const inp = document.getElementById('quizNum');
      inp.value = '5';
      stepQuiz(-1);
      expect(inp.value).toBe('4');
    });

    it('clamps to minimum 1', () => {
      const inp = document.getElementById('quizNum');
      inp.value = '1';
      stepQuiz(-1);
      expect(inp.value).toBe('1');
    });

    it('clamps to maximum 200', () => {
      const inp = document.getElementById('quizNum');
      inp.value = '200';
      stepQuiz(1);
      expect(inp.value).toBe('200');
    });
  });

  describe('startQuiz', () => {
    it('reads quizNum, resets state, calls showScreen', () => {
      document.getElementById('quizNum').value = '3';
      startQuiz();

      expect(showScreen).toHaveBeenCalledWith('quiz');
      expect(document.getElementById('qTotal').textContent).toBe('3');
      expect(document.getElementById('qAcertos').textContent).toBe('0');
      expect(document.getElementById('qStreak').textContent).toBe('0');
      // First question should be shown (qCur = 1)
      expect(document.getElementById('qCur').textContent).toBe('1');
    });
  });

  describe('quizShow', () => {
    it('renders prompt and increments qCur', () => {
      startQuiz();
      // qCur is 1 after startQuiz (which calls quizShow)
      expect(document.getElementById('qCur').textContent).toBe('1');
      expect(document.getElementById('qPrompt').innerHTML).not.toBe('');
      expect(document.getElementById('qPrompt').querySelector('.word-info')).not.toBeNull();
      expect(document.getElementById('qPrompt').querySelector('.answer-input')).not.toBeNull();
    });
  });

  describe('quizCheck', () => {
    it('correct answer: hits++, streak++', () => {
      startQuiz();

      // Submit wrong answer first to discover correct answer
      const input = document.getElementById('qInput');
      input.value = '';
      quizCheck();

      const fb = document.getElementById('qFeedback');
      const match = fb.innerHTML.match(/<strong>([^<]+)<\/strong>/);
      const correctAnswer = match[1];

      // Start fresh quiz, enter correct answer
      startQuiz();
      const input2 = document.getElementById('qInput');
      input2.value = correctAnswer;
      quizCheck();

      expect(document.getElementById('qAcertos').textContent).toBe('1');
      expect(document.getElementById('qStreak').textContent).toBe('1');
    });

    it('streak >= 3 shows streak message', () => {
      // Set quizNum high enough for 3 questions
      document.getElementById('quizNum').value = '5';
      startQuiz();

      // We need to answer 3 correct in a row.
      // With random mocked to 0.5, same word/case is picked each time.
      // Discover the correct answer first.
      let input = document.getElementById('qInput');
      input.value = '';
      quizCheck();
      const match = document.getElementById('qFeedback').innerHTML.match(/<strong>([^<]+)<\/strong>/);
      const correctAnswer = match[1];

      // Restart and answer 3 correct
      document.getElementById('quizNum').value = '5';
      startQuiz();

      for (let i = 0; i < 3; i++) {
        const inp = document.getElementById('qInput');
        inp.value = correctAnswer;
        quizCheck();
        if (i < 2) quizNext();
      }

      expect(document.getElementById('qStreak').textContent).toBe('3');
      // The feedback should contain the streak message (class "correct" with streak info)
      const fb = document.getElementById('qFeedback');
      expect(fb.querySelector('.correct')).not.toBeNull();
    });

    it('wrong answer: streak resets to 0', () => {
      document.getElementById('quizNum').value = '5';
      startQuiz();

      const input = document.getElementById('qInput');
      input.value = 'totallyWrongAnswer';
      quizCheck();

      expect(document.getElementById('qStreak').textContent).toBe('0');
    });

    it('when waiting: no-op', () => {
      startQuiz();

      const input = document.getElementById('qInput');
      input.value = 'test';
      quizCheck();

      const hitsAfterFirst = document.getElementById('qAcertos').textContent;
      // Call again while waiting
      quizCheck();
      expect(document.getElementById('qAcertos').textContent).toBe(hitsAfterFirst);
    });

    it('last question triggers quizEnd via setTimeout', () => {
      document.getElementById('quizNum').value = '1';
      startQuiz();

      const input = document.getElementById('qInput');
      input.value = 'wrong';
      quizCheck();

      // quizEnd should be scheduled via setTimeout(quizEnd, 800)
      expect(document.getElementById('qResults').innerHTML).toBe('');
      vi.advanceTimersByTime(800);

      // Now quizEnd should have fired
      expect(document.getElementById('qResults').innerHTML).not.toBe('');
      expect(showScreen).toHaveBeenCalledWith('quiz-results');
    });
  });

  describe('quizEnd', () => {
    it('shows results with 100% perfect message', () => {
      document.getElementById('quizNum').value = '1';
      startQuiz();

      // Discover correct answer
      let input = document.getElementById('qInput');
      input.value = '';
      quizCheck();
      const match = document.getElementById('qFeedback').innerHTML.match(/<strong>([^<]+)<\/strong>/);
      const correctAnswer = match[1];

      // Restart, answer correctly
      document.getElementById('quizNum').value = '1';
      startQuiz();
      input = document.getElementById('qInput');
      input.value = correctAnswer;
      quizCheck();

      vi.advanceTimersByTime(800);

      const results = document.getElementById('qResults').innerHTML;
      expect(results).toContain('1/1');
      expect(results).toContain('100%');
    });

    it('shows results with 0% study message', () => {
      document.getElementById('quizNum').value = '1';
      startQuiz();

      const input = document.getElementById('qInput');
      input.value = 'wrongAnswer';
      quizCheck();

      vi.advanceTimersByTime(800);

      const results = document.getElementById('qResults').innerHTML;
      expect(results).toContain('0/1');
      expect(results).toContain('0%');
    });
  });

  describe('decQCur', () => {
    it('decrements qCur', () => {
      startQuiz();
      // qCur is 1 after startQuiz
      expect(document.getElementById('qCur').textContent).toBe('1');

      decQCur();
      // qCur is now 0, but textContent won't update since decQCur only modifies the variable
      // The next quizShow call will set the DOM. decQCur is used before quizShow in refreshActiveScreen.
      // We verify indirectly: calling quizShow after decQCur should show qCur=1 again (0 + 1)
      quizShow();
      expect(document.getElementById('qCur').textContent).toBe('1');
    });
  });

  describe('isQWaiting', () => {
    it('returns false initially, true after check', () => {
      startQuiz();
      expect(isQWaiting()).toBe(false);

      const input = document.getElementById('qInput');
      input.value = 'test';
      quizCheck();
      expect(isQWaiting()).toBe(true);
    });
  });
});
