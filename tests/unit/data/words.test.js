import { describe, it, expect } from 'vitest';
import { WORDS, EXTRA_WORDS, ALL_WORDS } from '../../../js/data/words.js';
import { CASES, NUMBERS } from '../../../js/data/declensions.js';

const FORM_KEYS = CASES.flatMap(c => NUMBERS.map(n => `${c}_${n}`));

describe('WORDS (paradigms)', () => {
  it('has 19 entries', () => {
    expect(WORDS).toHaveLength(19);
  });

  it('each entry is a 6-element array', () => {
    WORDS.forEach(w => expect(w).toHaveLength(6));
  });

  it('each entry has [declension, sub_type, nom, gen, gender, forms]', () => {
    WORDS.forEach(([decl, sub, nom, gen, gender, forms]) => {
      expect(typeof decl).toBe('string');
      expect(typeof sub).toBe('string');
      expect(typeof nom).toBe('string');
      expect(typeof gen).toBe('string');
      expect(typeof gender).toBe('string');
      expect(typeof forms).toBe('object');
    });
  });

  it('each forms object has exactly 12 keys', () => {
    WORDS.forEach(([,,,, , forms]) => {
      expect(Object.keys(forms)).toHaveLength(12);
      expect(Object.keys(forms).sort()).toEqual(FORM_KEYS.sort());
    });
  });

  it('contains all 5 declensions', () => {
    const decls = new Set(WORDS.map(w => w[0]));
    expect(decls).toEqual(new Set(['I', 'II', 'III', 'IV', 'V']));
  });
});

describe('EXTRA_WORDS', () => {
  it('has entries', () => {
    expect(EXTRA_WORDS.length).toBeGreaterThan(0);
  });

  it('each entry is a 6-element array with valid forms', () => {
    EXTRA_WORDS.forEach(([decl, sub, nom, gen, gender, forms]) => {
      expect([decl, sub, nom, gen, gender]).toSatisfy(arr =>
        arr.every(v => typeof v === 'string')
      );
      expect(Object.keys(forms)).toHaveLength(12);
    });
  });
});

describe('ALL_WORDS', () => {
  it('equals WORDS + EXTRA_WORDS concatenated', () => {
    expect(ALL_WORDS).toHaveLength(WORDS.length + EXTRA_WORDS.length);
    expect(ALL_WORDS.slice(0, WORDS.length)).toEqual(WORDS);
    expect(ALL_WORDS.slice(WORDS.length)).toEqual(EXTRA_WORDS);
  });

  it('contains all 5 declensions across both lists', () => {
    const decls = new Set(ALL_WORDS.map(w => w[0]));
    expect(decls).toEqual(new Set(['I', 'II', 'III', 'IV', 'V']));
  });
});
