import { describe, it, expect } from 'vitest';
import {
  CASES, NUMBERS, _f,
  decl1, decl2_us, decl2_ius, decl2_er, decl2_ir, decl2_um,
  decl3_cons, decl3_mixed, decl3_i, decl3_i_turris,
  decl3_neut_e, decl3_neut_al, decl3_neut_ar,
  decl4_us, decl4_ubus, decl4_u, decl5
} from '../../../js/data/declensions.js';

const ALL_KEYS = CASES.flatMap(c => NUMBERS.map(n => `${c}_${n}`));

describe('CASES and NUMBERS', () => {
  it('CASES has 6 Latin cases', () => {
    expect(CASES).toEqual([
      'Nominativus', 'Genitivus', 'Dativus',
      'Accusativus', 'Vocativus', 'Ablativus'
    ]);
  });

  it('NUMBERS has Singularis and Pluralis', () => {
    expect(NUMBERS).toEqual(['Singularis', 'Pluralis']);
  });
});

describe('_f helper', () => {
  it('maps 12 positional args to 12 case-number keys', () => {
    const result = _f('a','b','c','d','e','f','g','h','i','j','k','l');
    expect(Object.keys(result)).toHaveLength(12);
    expect(result).toEqual({
      Nominativus_Singularis: 'a', Genitivus_Singularis: 'b',
      Dativus_Singularis: 'c', Accusativus_Singularis: 'd',
      Vocativus_Singularis: 'e', Ablativus_Singularis: 'f',
      Nominativus_Pluralis: 'g', Genitivus_Pluralis: 'h',
      Dativus_Pluralis: 'i', Accusativus_Pluralis: 'j',
      Vocativus_Pluralis: 'k', Ablativus_Pluralis: 'l',
    });
  });
});

/** Verify every declension function returns exactly the 12 expected keys */
function expectValidForms(forms) {
  expect(Object.keys(forms).sort()).toEqual(ALL_KEYS.sort());
  Object.values(forms).forEach(v => expect(typeof v).toBe('string'));
}

describe('decl1 — 1st declension', () => {
  const f = decl1('ros');
  it('returns 12 keys', () => expectValidForms(f));
  it('rosa paradigm', () => {
    expect(f.Nominativus_Singularis).toBe('rosa');
    expect(f.Genitivus_Singularis).toBe('rosae');
    expect(f.Accusativus_Singularis).toBe('rosam');
    expect(f.Ablativus_Singularis).toBe('rosā');
    expect(f.Genitivus_Pluralis).toBe('rosārum');
    expect(f.Dativus_Pluralis).toBe('rosīs');
    expect(f.Accusativus_Pluralis).toBe('rosās');
  });
});

describe('decl2_us — 2nd declension -us', () => {
  const f = decl2_us('domin');
  it('returns 12 keys', () => expectValidForms(f));
  it('dominus paradigm', () => {
    expect(f.Nominativus_Singularis).toBe('dominus');
    expect(f.Genitivus_Singularis).toBe('dominī');
    expect(f.Vocativus_Singularis).toBe('domine');
    expect(f.Accusativus_Pluralis).toBe('dominōs');
  });
});

describe('decl2_ius — 2nd declension -ius', () => {
  const f = decl2_ius('fil');
  it('returns 12 keys', () => expectValidForms(f));
  it('filius paradigm — vocative -ī', () => {
    expect(f.Nominativus_Singularis).toBe('filius');
    expect(f.Vocativus_Singularis).toBe('filī');
    expect(f.Genitivus_Singularis).toBe('filiī');
  });
});

describe('decl2_er — 2nd declension -er', () => {
  it('puer (stem kept)', () => {
    const f = decl2_er('puer', 'puer');
    expectValidForms(f);
    expect(f.Nominativus_Singularis).toBe('puer');
    expect(f.Vocativus_Singularis).toBe('puer');
    expect(f.Genitivus_Singularis).toBe('puerī');
  });

  it('ager (stem changes)', () => {
    const f = decl2_er('ager', 'agr');
    expect(f.Nominativus_Singularis).toBe('ager');
    expect(f.Genitivus_Singularis).toBe('agrī');
  });
});

describe('decl2_ir — 2nd declension -ir', () => {
  const f = decl2_ir('vir', 'vir');
  it('returns 12 keys', () => expectValidForms(f));
  it('vir paradigm', () => {
    expect(f.Nominativus_Singularis).toBe('vir');
    expect(f.Vocativus_Singularis).toBe('vir');
    expect(f.Genitivus_Singularis).toBe('virī');
  });
});

describe('decl2_um — 2nd declension neuter', () => {
  const f = decl2_um('bell');
  it('returns 12 keys', () => expectValidForms(f));
  it('bellum paradigm — neuter nom=acc=voc', () => {
    expect(f.Nominativus_Singularis).toBe('bellum');
    expect(f.Accusativus_Singularis).toBe('bellum');
    expect(f.Vocativus_Singularis).toBe('bellum');
    expect(f.Nominativus_Pluralis).toBe('bella');
    expect(f.Accusativus_Pluralis).toBe('bella');
    expect(f.Vocativus_Pluralis).toBe('bella');
  });
});

describe('decl3_cons — 3rd declension consonant stem', () => {
  it('masculine/feminine (default g="m.")', () => {
    const f = decl3_cons('rex', 'reg');
    expectValidForms(f);
    expect(f.Nominativus_Singularis).toBe('rex');
    expect(f.Genitivus_Singularis).toBe('regis');
    expect(f.Accusativus_Singularis).toBe('regem');
    expect(f.Nominativus_Pluralis).toBe('regēs');
    expect(f.Genitivus_Pluralis).toBe('regum');
  });

  it('masculine with explicit g="m."', () => {
    const f = decl3_cons('rex', 'reg', 'm.');
    expect(f.Accusativus_Singularis).toBe('regem');
    expect(f.Nominativus_Pluralis).toBe('regēs');
  });

  it('feminine (g="f.") — same as m. branch', () => {
    const f = decl3_cons('vōx', 'vōc', 'f.');
    expect(f.Accusativus_Singularis).toBe('vōcem');
    expect(f.Nominativus_Pluralis).toBe('vōcēs');
    expect(f.Genitivus_Pluralis).toBe('vōcum');
  });

  it('neuter (g="n.") — nom=acc=voc, plural -a', () => {
    const f = decl3_cons('corpus', 'corpor', 'n.');
    expectValidForms(f);
    expect(f.Nominativus_Singularis).toBe('corpus');
    expect(f.Accusativus_Singularis).toBe('corpus');
    expect(f.Vocativus_Singularis).toBe('corpus');
    expect(f.Ablativus_Singularis).toBe('corpore');
    expect(f.Nominativus_Pluralis).toBe('corpora');
    expect(f.Accusativus_Pluralis).toBe('corpora');
    expect(f.Vocativus_Pluralis).toBe('corpora');
    expect(f.Genitivus_Pluralis).toBe('corporum');
  });
});

describe('decl3_mixed — 3rd declension mixed', () => {
  const f = decl3_mixed('nox', 'noct');
  it('returns 12 keys', () => expectValidForms(f));
  it('gen.pl -ium (not -um like consonant)', () => {
    expect(f.Genitivus_Pluralis).toBe('noctium');
  });
});

describe('decl3_i — 3rd declension i-stem', () => {
  const f = decl3_i('civis', 'civ');
  it('returns 12 keys', () => expectValidForms(f));
  it('acc.sg -em, abl.sg -e, gen.pl -ium', () => {
    expect(f.Accusativus_Singularis).toBe('civem');
    expect(f.Ablativus_Singularis).toBe('cive');
    expect(f.Genitivus_Pluralis).toBe('civium');
  });
});

describe('decl3_i_turris — 3rd declension i-stem (turris type)', () => {
  const f = decl3_i_turris('turris', 'turr');
  it('returns 12 keys', () => expectValidForms(f));
  it('acc.sg -im, abl.sg -ī (special)', () => {
    expect(f.Accusativus_Singularis).toBe('turrim');
    expect(f.Ablativus_Singularis).toBe('turrī');
  });
});

describe('decl3 neuter i-stems (e, al, ar)', () => {
  it('decl3_neut_e — mare', () => {
    const f = decl3_neut_e('mare', 'mar');
    expectValidForms(f);
    expect(f.Nominativus_Singularis).toBe('mare');
    expect(f.Accusativus_Singularis).toBe('mare');
    expect(f.Ablativus_Singularis).toBe('marī');
    expect(f.Nominativus_Pluralis).toBe('maria');
    expect(f.Genitivus_Pluralis).toBe('marium');
  });

  it('decl3_neut_al — animal', () => {
    const f = decl3_neut_al('animal', 'animāl');
    expectValidForms(f);
    expect(f.Ablativus_Singularis).toBe('animālī');
    expect(f.Nominativus_Pluralis).toBe('animālia');
  });

  it('decl3_neut_ar — exemplar', () => {
    const f = decl3_neut_ar('exemplar', 'exemplār');
    expectValidForms(f);
    expect(f.Ablativus_Singularis).toBe('exemplārī');
    expect(f.Nominativus_Pluralis).toBe('exemplāria');
  });
});

describe('decl4_us — 4th declension -us', () => {
  const f = decl4_us('fruct');
  it('returns 12 keys', () => expectValidForms(f));
  it('fructus paradigm', () => {
    expect(f.Nominativus_Singularis).toBe('fructus');
    expect(f.Genitivus_Singularis).toBe('fructūs');
    expect(f.Dativus_Singularis).toBe('fructuī');
    expect(f.Dativus_Pluralis).toBe('fructibus');
    expect(f.Ablativus_Pluralis).toBe('fructibus');
  });
});

describe('decl4_ubus — 4th declension -ubus variant', () => {
  const f = decl4_ubus('lac');
  it('returns 12 keys', () => expectValidForms(f));
  it('dat/abl pl in -ubus (not -ibus)', () => {
    expect(f.Dativus_Pluralis).toBe('lacubus');
    expect(f.Ablativus_Pluralis).toBe('lacubus');
  });

  it('differs from decl4_us only in dat/abl pl', () => {
    const us = decl4_us('lac');
    const ubus = decl4_ubus('lac');
    expect(us.Dativus_Pluralis).toBe('lacibus');
    expect(ubus.Dativus_Pluralis).toBe('lacubus');
    // All other forms identical
    for (const k of ALL_KEYS) {
      if (k === 'Dativus_Pluralis' || k === 'Ablativus_Pluralis') continue;
      expect(ubus[k]).toBe(us[k]);
    }
  });
});

describe('decl4_u — 4th declension neuter', () => {
  const f = decl4_u('corn');
  it('returns 12 keys', () => expectValidForms(f));
  it('cornū paradigm — many identical forms', () => {
    expect(f.Nominativus_Singularis).toBe('cornū');
    expect(f.Dativus_Singularis).toBe('cornū');
    expect(f.Nominativus_Pluralis).toBe('cornua');
    expect(f.Accusativus_Pluralis).toBe('cornua');
  });
});

describe('decl5 — 5th declension', () => {
  it('with all 4 args (rēs)', () => {
    const f = decl5('rēs', 'r', 'reī', 'reī');
    expectValidForms(f);
    expect(f.Nominativus_Singularis).toBe('rēs');
    expect(f.Genitivus_Singularis).toBe('reī');
    expect(f.Dativus_Singularis).toBe('reī');
    expect(f.Accusativus_Singularis).toBe('rem');
    expect(f.Ablativus_Singularis).toBe('rē');
    expect(f.Nominativus_Pluralis).toBe('rēs');
    expect(f.Genitivus_Pluralis).toBe('rērum');
    expect(f.Dativus_Pluralis).toBe('rēbus');
  });

  it('with 2 args — gs and ds default to s+"eī"', () => {
    const f = decl5('diēs', 'di');
    expect(f.Genitivus_Singularis).toBe('dieī');
    expect(f.Dativus_Singularis).toBe('dieī');
  });

  it('with 3 args — ds defaults to gs', () => {
    const f = decl5('fidēs', 'fid', 'fideī');
    expect(f.Genitivus_Singularis).toBe('fideī');
    expect(f.Dativus_Singularis).toBe('fideī');
  });

  it('with 4 args — different gs and ds', () => {
    const f = decl5('testēs', 'test', 'testGEN', 'testDAT');
    expect(f.Genitivus_Singularis).toBe('testGEN');
    expect(f.Dativus_Singularis).toBe('testDAT');
  });
});
