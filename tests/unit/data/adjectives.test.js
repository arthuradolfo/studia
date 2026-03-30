import { describe, it, expect } from 'vitest';
import { ADJ_PARADIGMS, ADJ_EXTRA, ALL_ADJECTIVES } from '../../../js/data/adjectives.js';
import { GENDERS } from '../../../js/data/adj-declensions.js';
import { CASES, NUMBERS } from '../../../js/data/declensions.js';

const ADJ_KEYS = GENDERS.flatMap(g =>
  CASES.flatMap(c => NUMBERS.map(n => `${g}_${c}_${n}`))
);

describe('ADJ_PARADIGMS', () => {
  it('has 6 paradigms', () => {
    expect(ADJ_PARADIGMS).toHaveLength(6);
  });

  it('each entry is [class, sub_type, nom_m, nom_f, nom_n, gen, forms]', () => {
    ADJ_PARADIGMS.forEach(entry => {
      expect(entry).toHaveLength(7);
      const [cls, sub, nom_m, nom_f, nom_n, gen, forms] = entry;
      expect(typeof cls).toBe('string');
      expect(typeof sub).toBe('string');
      expect(typeof nom_m).toBe('string');
      expect(typeof nom_f).toBe('string');
      expect(typeof nom_n).toBe('string');
      expect(typeof gen).toBe('string');
      expect(typeof forms).toBe('object');
    });
  });

  it('each forms object has 36 keys', () => {
    ADJ_PARADIGMS.forEach(([,,,,,, forms]) => {
      expect(Object.keys(forms)).toHaveLength(36);
      expect(Object.keys(forms).sort()).toEqual(ADJ_KEYS.sort());
    });
  });

  it('contains both class I and class II', () => {
    const classes = new Set(ADJ_PARADIGMS.map(a => a[0]));
    expect(classes).toEqual(new Set(['I', 'II']));
  });
});

describe('ADJ_EXTRA', () => {
  it('has entries', () => {
    expect(ADJ_EXTRA.length).toBeGreaterThan(0);
  });

  it('each entry has 7 elements with 36-key forms', () => {
    ADJ_EXTRA.forEach(entry => {
      expect(entry).toHaveLength(7);
      const [,,,,,, forms] = entry;
      expect(Object.keys(forms)).toHaveLength(36);
    });
  });
});

describe('ALL_ADJECTIVES', () => {
  it('equals ADJ_PARADIGMS + ADJ_EXTRA concatenated', () => {
    expect(ALL_ADJECTIVES).toHaveLength(ADJ_PARADIGMS.length + ADJ_EXTRA.length);
    expect(ALL_ADJECTIVES.slice(0, ADJ_PARADIGMS.length)).toEqual(ADJ_PARADIGMS);
    expect(ALL_ADJECTIVES.slice(ADJ_PARADIGMS.length)).toEqual(ADJ_EXTRA);
  });
});
