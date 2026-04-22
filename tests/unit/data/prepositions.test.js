import { describe, it, expect } from 'vitest';
import { PREPOSITIONS, PREP_ACC, PREP_ABL } from '../../../js/data/prepositions.js';

describe('PREPOSITIONS', () => {
  it('has 20 entries', () => {
    expect(PREPOSITIONS).toHaveLength(20);
  });

  it('each entry has prep, case, context, group', () => {
    PREPOSITIONS.forEach(p => {
      expect(typeof p.prep).toBe('string');
      expect(typeof p.case).toBe('string');
      expect(typeof p.context).toBe('string');
      expect(typeof p.group).toBe('string');
    });
  });

  it('case values are only Accusativus or Ablativus', () => {
    const cases = new Set(PREPOSITIONS.map(p => p.case));
    expect(cases).toEqual(new Set(['Accusativus', 'Ablativus']));
  });

  it('group values are only accusativus or ablativus', () => {
    const groups = new Set(PREPOSITIONS.map(p => p.group));
    expect(groups).toEqual(new Set(['accusativus', 'ablativus']));
  });

  it('"in" appears in both accusative and ablative groups', () => {
    const inPreps = PREPOSITIONS.filter(p => p.prep === 'in');
    expect(inPreps).toHaveLength(2);
    expect(inPreps.map(p => p.group).sort()).toEqual(['ablativus', 'accusativus']);
  });
});

describe('PREP_ACC', () => {
  it('has 11 accusative entries', () => {
    expect(PREP_ACC).toHaveLength(11);
  });

  it('all have group=accusativus', () => {
    PREP_ACC.forEach(p => expect(p.group).toBe('accusativus'));
  });

  it('all have case=Accusativus', () => {
    PREP_ACC.forEach(p => expect(p.case).toBe('Accusativus'));
  });
});

describe('PREP_ABL', () => {
  it('has 9 ablative entries', () => {
    expect(PREP_ABL).toHaveLength(9);
  });

  it('all have group=ablativus', () => {
    PREP_ABL.forEach(p => expect(p.group).toBe('ablativus'));
  });

  it('all have case=Ablativus', () => {
    PREP_ABL.forEach(p => expect(p.case).toBe('Ablativus'));
  });
});

describe('partition completeness', () => {
  it('PREP_ACC + PREP_ABL equals PREPOSITIONS', () => {
    expect(PREP_ACC.length + PREP_ABL.length).toBe(PREPOSITIONS.length);
  });
});
