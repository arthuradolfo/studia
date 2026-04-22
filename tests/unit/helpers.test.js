import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  stripMacrons,
  normalize,
  checkAnswer,
  formKey,
  adjFormKey,
  shuffle,
  pick,
  wordMeaning,
} from '../../js/helpers.js';
// Import PT translations so getMeaning has data for wordMeaning tests
import '../../js/translations/pt.js';
import { setLang } from '../../js/i18n.js';

// Reset to default lang before each test
beforeEach(() => {
  setLang('pt');
});

// ── stripMacrons ─────────────────────────────────────────────────────

describe('stripMacrons', () => {
  it('strips all lowercase macron vowels', () => {
    expect(stripMacrons('āēīōū')).toBe('aeiou');
  });

  it('strips all uppercase macron vowels', () => {
    expect(stripMacrons('ĀĒĪŌŪ')).toBe('AEIOU');
  });

  it('passes through text without macrons unchanged', () => {
    expect(stripMacrons('hello world')).toBe('hello world');
  });

  it('handles mixed macron and non-macron text', () => {
    expect(stripMacrons('rōsa bonā')).toBe('rosa bona');
  });

  it('returns empty string for empty input', () => {
    expect(stripMacrons('')).toBe('');
  });
});

// ── normalize ────────────────────────────────────────────────────────

describe('normalize', () => {
  it('strips macrons, trims whitespace, and lowercases', () => {
    expect(normalize('  Rōsam  ')).toBe('rosam');
  });

  it('lowercases without macrons', () => {
    expect(normalize('HELLO')).toBe('hello');
  });

  it('handles empty string', () => {
    expect(normalize('')).toBe('');
  });
});

// ── checkAnswer ──────────────────────────────────────────────────────

describe('checkAnswer', () => {
  it('returns true for exact match', () => {
    expect(checkAnswer('rosam', 'rosam')).toBe(true);
  });

  it('is case-insensitive', () => {
    expect(checkAnswer('Rosam', 'rosam')).toBe(true);
  });

  it('is macron-insensitive', () => {
    expect(checkAnswer('rosam', 'rōsam')).toBe(true);
  });

  it('trims whitespace', () => {
    expect(checkAnswer('  rosam  ', 'rosam')).toBe(true);
  });

  it('returns false for wrong answer', () => {
    expect(checkAnswer('rosae', 'rosam')).toBe(false);
  });

  it('returns false for empty input vs non-empty correct', () => {
    expect(checkAnswer('', 'rosam')).toBe(false);
  });

  it('returns true for both empty', () => {
    expect(checkAnswer('', '')).toBe(true);
  });
});

// ── formKey ──────────────────────────────────────────────────────────

describe('formKey', () => {
  it('concatenates case and number with underscore', () => {
    expect(formKey('nom', 'sg')).toBe('nom_sg');
  });

  it('works with any strings', () => {
    expect(formKey('acc', 'pl')).toBe('acc_pl');
  });
});

// ── adjFormKey ───────────────────────────────────────────────────────

describe('adjFormKey', () => {
  it('concatenates gender, case, and number with underscores', () => {
    expect(adjFormKey('m', 'nom', 'sg')).toBe('m_nom_sg');
  });

  it('works with any strings', () => {
    expect(adjFormKey('f', 'gen', 'pl')).toBe('f_gen_pl');
  });
});

// ── shuffle ──────────────────────────────────────────────────────────

describe('shuffle', () => {
  it('returns the same array reference (mutates in place)', () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffle(arr);
    expect(result).toBe(arr);
  });

  it('returns array with same length', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffle(arr);
    expect(arr).toHaveLength(5);
  });

  it('contains the same elements after shuffle', () => {
    const arr = [1, 2, 3, 4, 5];
    shuffle(arr);
    expect(arr.sort()).toEqual([1, 2, 3, 4, 5]);
  });

  it('handles empty array', () => {
    const arr = [];
    expect(shuffle(arr)).toEqual([]);
  });

  it('handles single-element array', () => {
    const arr = [42];
    expect(shuffle(arr)).toEqual([42]);
  });
});

// ── pick ─────────────────────────────────────────────────────────────

describe('pick', () => {
  it('picks the first element when Math.random returns 0', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    expect(pick(['a', 'b', 'c'])).toBe('a');
    vi.restoreAllMocks();
  });

  it('picks the last element when Math.random returns 0.999', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999);
    expect(pick(['a', 'b', 'c'])).toBe('c');
    vi.restoreAllMocks();
  });

  it('picks the middle element', () => {
    // For array length 3, Math.floor(0.5 * 3) = 1 → index 1
    vi.spyOn(Math, 'random').mockReturnValue(0.5);
    expect(pick(['a', 'b', 'c'])).toBe('b');
    vi.restoreAllMocks();
  });
});

// ── wordMeaning ──────────────────────────────────────────────────────

describe('wordMeaning', () => {
  it('returns the Portuguese meaning of a word (using pt.js translations)', () => {
    setLang('pt');
    // Word data format: [dec, sub, nom, gen, gender, forms]
    const word = ['I', 'rosa, -ae', 'rosa', 'rosae', 'f.', {}];
    expect(wordMeaning(word)).toBe('rosa');
  });

  it('returns the meaning for dominus', () => {
    setLang('pt');
    const word = ['II', 'dominus, -ī', 'dominus', 'dominī', 'm.', {}];
    expect(wordMeaning(word)).toBe('senhor');
  });

  it('returns the nominative itself when no meaning is registered', () => {
    setLang('pt');
    const word = ['I', 'xyz, -is', 'xyznotfound', 'xyzis', 'm.', {}];
    expect(wordMeaning(word)).toBe('xyznotfound');
  });
});
