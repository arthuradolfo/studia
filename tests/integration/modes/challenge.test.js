import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// MUST mock app.js BEFORE importing challenge.js to break circular dependency
vi.mock('../../../js/app.js', () => ({ showScreen: vi.fn() }));

// Register translations
import '../../../js/translations/pt.js';
import '../../../js/translations/en.js';

import { showScreen } from '../../../js/app.js';
import { CASES, NUMBERS } from '../../../js/data/declensions.js';
import { WORDS } from '../../../js/data/words.js';
import { formKey } from '../../../js/helpers.js';
import {
  getDesafioWord,
  startDesafio,
  checkDesafio,
} from '../../../js/modes/challenge.js';

describe('challenge mode', () => {
  let randomSpy;

  beforeEach(() => {
    document.body.innerHTML = `
      <div id="desafioWord"></div>
      <div id="desafioGrid"></div>
      <div id="desafioResults"></div>
      <button id="desafioSubmit"></button>
    `;
    randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.5);
    vi.useFakeTimers();
  });

  afterEach(() => {
    randomSpy.mockRestore();
    vi.useRealTimers();
  });

  it('startDesafio creates 12 input fields (6 cases x 2 numbers)', () => {
    startDesafio();

    const inputs = document.querySelectorAll('#desafioGrid input');
    expect(inputs.length).toBe(CASES.length * NUMBERS.length);
    expect(inputs.length).toBe(12);
    expect(showScreen).toHaveBeenCalledWith('desafio');
  });

  it('getDesafioWord returns the selected word', () => {
    startDesafio();

    const word = getDesafioWord();
    expect(word).not.toBeNull();
    expect(word).not.toBeUndefined();
    // Word should be from WORDS array
    expect(WORDS).toContain(word);
    // Should be an array with expected structure [dec, sub, nom, gen, gender, forms]
    expect(word.length).toBe(6);
  });

  it('checkDesafio with all correct: 12/12, 100%, perfect message', () => {
    startDesafio();

    const word = getDesafioWord();
    const forms = word[5];

    // Fill in all correct answers
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        const id = `des_${c}_${num}`;
        const input = document.getElementById(id);
        input.value = forms[formKey(c, num)];
      });
    });

    checkDesafio();

    const results = document.getElementById('desafioResults').innerHTML;
    expect(results).toContain('12/12');
    expect(results).toContain('100%');
  });

  it('checkDesafio with all wrong: 0/12, error list', () => {
    startDesafio();

    // Fill in all wrong answers
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        const id = `des_${c}_${num}`;
        const input = document.getElementById(id);
        input.value = 'zzzzWrong';
      });
    });

    checkDesafio();

    const results = document.getElementById('desafioResults').innerHTML;
    expect(results).toContain('0/12');
    expect(results).toContain('0%');
    // Should have error rows
    expect(document.querySelectorAll('#desafioResults .err-row').length).toBe(12);
  });

  it('correct inputs get correct-field class, wrong get wrong-field class', () => {
    startDesafio();

    const word = getDesafioWord();
    const forms = word[5];

    // Fill first input correct, second wrong
    const firstCase = CASES[0];
    const firstNum = NUMBERS[0];
    const secondCase = CASES[1];
    const secondNum = NUMBERS[0];

    document.getElementById(`des_${firstCase}_${firstNum}`).value = forms[formKey(firstCase, firstNum)];
    document.getElementById(`des_${secondCase}_${secondNum}`).value = 'zzzzWrong';

    // Fill remaining with wrong values
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        const id = `des_${c}_${num}`;
        const input = document.getElementById(id);
        if (!input.value) input.value = 'zzzzWrong';
      });
    });

    checkDesafio();

    const correctInput = document.getElementById(`des_${firstCase}_${firstNum}`);
    const wrongInput = document.getElementById(`des_${secondCase}_${secondNum}`);

    expect(correctInput.classList.contains('correct-field')).toBe(true);
    expect(correctInput.classList.contains('wrong-field')).toBe(false);
    expect(wrongInput.classList.contains('wrong-field')).toBe(true);
    expect(wrongInput.classList.contains('correct-field')).toBe(false);
  });

  it('all inputs disabled after check', () => {
    startDesafio();

    // Fill in all inputs (wrong is fine)
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        document.getElementById(`des_${c}_${num}`).value = 'test';
      });
    });

    checkDesafio();

    const inputs = document.querySelectorAll('#desafioGrid input');
    inputs.forEach(inp => {
      expect(inp.disabled).toBe(true);
    });
  });

  it('submit button changes to "new" text after check', () => {
    startDesafio();

    const btn = document.getElementById('desafioSubmit');
    // Before check, button has "submit" text
    const submitText = btn.textContent;

    // Fill in inputs and check
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        document.getElementById(`des_${c}_${num}`).value = 'test';
      });
    });

    checkDesafio();

    // After check, button text should change to "new" text
    expect(btn.textContent).not.toBe(submitText);
  });
});
