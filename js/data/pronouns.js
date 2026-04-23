// ═══════════════════════════════════════════════════════════════════════
// PRONOUN DATA — All Latin pronoun forms (hardcoded)
// ═══════════════════════════════════════════════════════════════════════

import { _f } from './declensions.js';

export const PRON_TYPES = ['Persōnāle', 'Possessīvum', 'Demonstratīvum', 'Relātīvum'];

function _af(mF, fF, nF) {
  const r = {};
  for (const [k, v] of Object.entries(mF)) r['m_' + k] = v;
  for (const [k, v] of Object.entries(fF)) r['f_' + k] = v;
  for (const [k, v] of Object.entries(nF)) r['n_' + k] = v;
  return r;
}

// ─── Personal Pronouns (no gender) ───

const ego = _f(
  'ego', 'meī', 'mihi', 'mē', '—', 'mē',
  'nōs', 'nostrum/nostrī', 'nōbīs', 'nōs', '—', 'nōbīs'
);

const tu = _f(
  'tū', 'tuī', 'tibi', 'tē', 'tū', 'tē',
  'vōs', 'vestrum/vestrī', 'vōbīs', 'vōs', 'vōs', 'vōbīs'
);

const se = _f(
  '—', 'suī', 'sibi', 'sē', '—', 'sē',
  '—', 'suī', 'sibi', 'sē', '—', 'sē'
);

// ─── Possessive Pronouns (M/F/N, decline like 1st class adjectives) ───

const meus = _af(
  _f('meus', 'meī', 'meō', 'meum', 'mī', 'meō',
     'meī', 'meōrum', 'meīs', 'meōs', 'meī', 'meīs'),
  _f('mea', 'meae', 'meae', 'meam', 'mea', 'meā',
     'meae', 'meārum', 'meīs', 'meās', 'meae', 'meīs'),
  _f('meum', 'meī', 'meō', 'meum', 'meum', 'meō',
     'mea', 'meōrum', 'meīs', 'mea', 'mea', 'meīs')
);

const tuus = _af(
  _f('tuus', 'tuī', 'tuō', 'tuum', 'tue', 'tuō',
     'tuī', 'tuōrum', 'tuīs', 'tuōs', 'tuī', 'tuīs'),
  _f('tua', 'tuae', 'tuae', 'tuam', 'tua', 'tuā',
     'tuae', 'tuārum', 'tuīs', 'tuās', 'tuae', 'tuīs'),
  _f('tuum', 'tuī', 'tuō', 'tuum', 'tuum', 'tuō',
     'tua', 'tuōrum', 'tuīs', 'tua', 'tua', 'tuīs')
);

const noster = _af(
  _f('noster', 'nostrī', 'nostrō', 'nostrum', 'noster', 'nostrō',
     'nostrī', 'nostrōrum', 'nostrīs', 'nostrōs', 'nostrī', 'nostrīs'),
  _f('nostra', 'nostrae', 'nostrae', 'nostram', 'nostra', 'nostrā',
     'nostrae', 'nostrārum', 'nostrīs', 'nostrās', 'nostrae', 'nostrīs'),
  _f('nostrum', 'nostrī', 'nostrō', 'nostrum', 'nostrum', 'nostrō',
     'nostra', 'nostrōrum', 'nostrīs', 'nostra', 'nostra', 'nostrīs')
);

const vester = _af(
  _f('vester', 'vestrī', 'vestrō', 'vestrum', 'vester', 'vestrō',
     'vestrī', 'vestrōrum', 'vestrīs', 'vestrōs', 'vestrī', 'vestrīs'),
  _f('vestra', 'vestrae', 'vestrae', 'vestram', 'vestra', 'vestrā',
     'vestrae', 'vestrārum', 'vestrīs', 'vestrās', 'vestrae', 'vestrīs'),
  _f('vestrum', 'vestrī', 'vestrō', 'vestrum', 'vestrum', 'vestrō',
     'vestra', 'vestrōrum', 'vestrīs', 'vestra', 'vestra', 'vestrīs')
);

const suus = _af(
  _f('suus', 'suī', 'suō', 'suum', 'sue', 'suō',
     'suī', 'suōrum', 'suīs', 'suōs', 'suī', 'suīs'),
  _f('sua', 'suae', 'suae', 'suam', 'sua', 'suā',
     'suae', 'suārum', 'suīs', 'suās', 'suae', 'suīs'),
  _f('suum', 'suī', 'suō', 'suum', 'suum', 'suō',
     'sua', 'suōrum', 'suīs', 'sua', 'sua', 'suīs')
);

// ─── Demonstrative Pronouns (fully irregular) ───

const is_ea_id = _af(
  _f('is', 'eius', 'eī', 'eum', 'is', 'eō',
     'eī/iī', 'eōrum', 'eīs/iīs', 'eōs', 'eī/iī', 'eīs/iīs'),
  _f('ea', 'eius', 'eī', 'eam', 'ea', 'eā',
     'eae', 'eārum', 'eīs/iīs', 'eās', 'eae', 'eīs/iīs'),
  _f('id', 'eius', 'eī', 'id', 'id', 'eō',
     'ea', 'eōrum', 'eīs/iīs', 'ea', 'ea', 'eīs/iīs')
);

const hic_haec_hoc = _af(
  _f('hic', 'huius', 'huic', 'hunc', 'hic', 'hōc',
     'hī', 'hōrum', 'hīs', 'hōs', 'hī', 'hīs'),
  _f('haec', 'huius', 'huic', 'hanc', 'haec', 'hāc',
     'hae', 'hārum', 'hīs', 'hās', 'hae', 'hīs'),
  _f('hoc', 'huius', 'huic', 'hoc', 'hoc', 'hōc',
     'haec', 'hōrum', 'hīs', 'haec', 'haec', 'hīs')
);

const ille_illa_illud = _af(
  _f('ille', 'illīus', 'illī', 'illum', 'ille', 'illō',
     'illī', 'illōrum', 'illīs', 'illōs', 'illī', 'illīs'),
  _f('illa', 'illīus', 'illī', 'illam', 'illa', 'illā',
     'illae', 'illārum', 'illīs', 'illās', 'illae', 'illīs'),
  _f('illud', 'illīus', 'illī', 'illud', 'illud', 'illō',
     'illa', 'illōrum', 'illīs', 'illa', 'illa', 'illīs')
);

// ─── Relative Pronoun ───

const qui_quae_quod = _af(
  _f('quī', 'cuius', 'cui', 'quem', 'quī', 'quō',
     'quī', 'quōrum', 'quibus', 'quōs', 'quī', 'quibus'),
  _f('quae', 'cuius', 'cui', 'quam', 'quae', 'quā',
     'quae', 'quārum', 'quibus', 'quās', 'quae', 'quibus'),
  _f('quod', 'cuius', 'cui', 'quod', 'quod', 'quō',
     'quae', 'quōrum', 'quibus', 'quae', 'quae', 'quibus')
);

// ─── Pronoun array: [type, subtype, nom_m, nom_f, nom_n, gen, forms, hasGender] ───

export const PRONOUNS = [
  // Personal
  ['Persōnāle', '1ª persōna sg.', 'ego', 'ego', 'ego', 'meī', ego, false],
  ['Persōnāle', '2ª persōna sg.', 'tū', 'tū', 'tū', 'tuī', tu, false],
  ['Persōnāle', '3ª persōna (refl.)', 'sē', 'sē', 'sē', 'suī', se, false],
  // Possessive
  ['Possessīvum', '1ª persōna sg.', 'meus', 'mea', 'meum', 'meī', meus, true],
  ['Possessīvum', '2ª persōna sg.', 'tuus', 'tua', 'tuum', 'tuī', tuus, true],
  ['Possessīvum', '1ª persōna pl.', 'noster', 'nostra', 'nostrum', 'nostrī', noster, true],
  ['Possessīvum', '2ª persōna pl.', 'vester', 'vestra', 'vestrum', 'vestrī', vester, true],
  ['Possessīvum', '3ª persōna (refl.)', 'suus', 'sua', 'suum', 'suī', suus, true],
  // Demonstrative
  ['Demonstratīvum', 'is, ea, id', 'is', 'ea', 'id', 'eius', is_ea_id, true],
  ['Demonstratīvum', 'hic, haec, hoc', 'hic', 'haec', 'hoc', 'huius', hic_haec_hoc, true],
  ['Demonstratīvum', 'ille, illa, illud', 'ille', 'illa', 'illud', 'illīus', ille_illa_illud, true],
  // Relative
  ['Relātīvum', 'quī, quae, quod', 'quī', 'quae', 'quod', 'cuius', qui_quae_quod, true],
];

export const ALL_PRONOUNS = PRONOUNS;
