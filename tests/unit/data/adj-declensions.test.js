import { describe, it, expect } from 'vitest';
import {
  GENDERS,
  adj1_us, adj1_er_kept, adj1_er_changed,
  adj2_tri, adj2_bi, adj2_uni
} from '../../../js/data/adj-declensions.js';

import { CASES, NUMBERS } from '../../../js/data/declensions.js';

const ALL_ADJ_KEYS = GENDERS.flatMap(g =>
  CASES.flatMap(c => NUMBERS.map(n => `${g}_${c}_${n}`))
);

function expectValidAdjForms(forms) {
  const keys = Object.keys(forms);
  expect(keys).toHaveLength(36);
  expect(keys.sort()).toEqual(ALL_ADJ_KEYS.sort());
  Object.values(forms).forEach(v => expect(typeof v).toBe('string'));
}

describe('GENDERS', () => {
  it('has m, f, n', () => {
    expect(GENDERS).toEqual(['m', 'f', 'n']);
  });
});

describe('adj1_us — 1st class regular (-us/-a/-um)', () => {
  const f = adj1_us('magn');
  it('returns 36 keys with gender prefixes', () => expectValidAdjForms(f));

  it('masculine follows 2nd declension -us', () => {
    expect(f.m_Nominativus_Singularis).toBe('magnus');
    expect(f.m_Genitivus_Singularis).toBe('magnī');
    expect(f.m_Vocativus_Singularis).toBe('magne');
  });

  it('feminine follows 1st declension', () => {
    expect(f.f_Nominativus_Singularis).toBe('magna');
    expect(f.f_Genitivus_Singularis).toBe('magnae');
  });

  it('neuter follows 2nd declension -um', () => {
    expect(f.n_Nominativus_Singularis).toBe('magnum');
    expect(f.n_Accusativus_Singularis).toBe('magnum');
    expect(f.n_Vocativus_Singularis).toBe('magnum');
    expect(f.n_Nominativus_Pluralis).toBe('magna');
  });
});

describe('adj1_er_kept — 1st class -er (stem kept)', () => {
  const f = adj1_er_kept('miser', 'miser');
  it('returns 36 keys', () => expectValidAdjForms(f));

  it('masculine nom.sg preserves -er', () => {
    expect(f.m_Nominativus_Singularis).toBe('miser');
    expect(f.m_Genitivus_Singularis).toBe('miserī');
  });

  it('feminine follows 1st declension from stem', () => {
    expect(f.f_Nominativus_Singularis).toBe('misera');
  });

  it('neuter follows 2nd declension -um from stem', () => {
    expect(f.n_Nominativus_Singularis).toBe('miserum');
  });
});

describe('adj1_er_changed — 1st class -er (stem changes)', () => {
  const f = adj1_er_changed('pulcher', 'pulchr');
  it('returns 36 keys', () => expectValidAdjForms(f));

  it('masculine nom.sg preserves full -er form', () => {
    expect(f.m_Nominativus_Singularis).toBe('pulcher');
    expect(f.m_Genitivus_Singularis).toBe('pulchrī');
  });

  it('feminine uses changed stem', () => {
    expect(f.f_Nominativus_Singularis).toBe('pulchra');
  });

  it('neuter uses changed stem', () => {
    expect(f.n_Nominativus_Singularis).toBe('pulchrum');
  });
});

describe('adj2_tri — 2nd class triform', () => {
  const f = adj2_tri('ācer', 'ācris', 'ācre', 'ācr');
  it('returns 36 keys', () => expectValidAdjForms(f));

  it('three different nominatives', () => {
    expect(f.m_Nominativus_Singularis).toBe('ācer');
    expect(f.f_Nominativus_Singularis).toBe('ācris');
    expect(f.n_Nominativus_Singularis).toBe('ācre');
  });

  it('neuter acc.sg = nom.sg', () => {
    expect(f.n_Accusativus_Singularis).toBe('ācre');
  });

  it('neuter plural in -ia', () => {
    expect(f.n_Nominativus_Pluralis).toBe('ācria');
    expect(f.n_Accusativus_Pluralis).toBe('ācria');
    expect(f.n_Vocativus_Pluralis).toBe('ācria');
  });

  it('gen.pl -ium for all genders', () => {
    expect(f.m_Genitivus_Pluralis).toBe('ācrium');
    expect(f.f_Genitivus_Pluralis).toBe('ācrium');
    expect(f.n_Genitivus_Pluralis).toBe('ācrium');
  });

  it('abl.sg -ī for all genders (i-stem)', () => {
    expect(f.m_Ablativus_Singularis).toBe('ācrī');
    expect(f.f_Ablativus_Singularis).toBe('ācrī');
    expect(f.n_Ablativus_Singularis).toBe('ācrī');
  });
});

describe('adj2_bi — 2nd class biform', () => {
  const f = adj2_bi('fortis', 'forte', 'fort');
  it('returns 36 keys', () => expectValidAdjForms(f));

  it('m/f share same nominative', () => {
    expect(f.m_Nominativus_Singularis).toBe('fortis');
    expect(f.f_Nominativus_Singularis).toBe('fortis');
    expect(f.n_Nominativus_Singularis).toBe('forte');
  });

  it('neuter acc.sg = nom.sg', () => {
    expect(f.n_Accusativus_Singularis).toBe('forte');
  });

  it('neuter plural in -ia', () => {
    expect(f.n_Nominativus_Pluralis).toBe('fortia');
  });
});

describe('adj2_uni — 2nd class uniform', () => {
  const f = adj2_uni('prūdēns', 'prūdent');
  it('returns 36 keys', () => expectValidAdjForms(f));

  it('all genders share nominative', () => {
    expect(f.m_Nominativus_Singularis).toBe('prūdēns');
    expect(f.f_Nominativus_Singularis).toBe('prūdēns');
    expect(f.n_Nominativus_Singularis).toBe('prūdēns');
  });

  it('neuter acc.sg = nom.sg (but m/f has -em)', () => {
    expect(f.n_Accusativus_Singularis).toBe('prūdēns');
    expect(f.m_Accusativus_Singularis).toBe('prūdentem');
    expect(f.f_Accusativus_Singularis).toBe('prūdentem');
  });

  it('neuter plural in -ia', () => {
    expect(f.n_Nominativus_Pluralis).toBe('prūdentia');
  });
});
