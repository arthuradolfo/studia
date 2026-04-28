// ═══════════════════════════════════════════════════════════════════════
// PASSIVE VOICE DATA — Passive conjugation generators + verb lists
// ═══════════════════════════════════════════════════════════════════════

import { VERBS, EXTRA_VERBS, verbFormKey } from './verbs.js';

export const PASSIVE_TENSES_INF = [
  'P_Praesens_Indicativus',
  'P_Imperfectum_Indicativus',
  'P_Futurum_I',
  'P_Praesens_Subiunctivus',
  'P_Imperfectum_Subiunctivus'
];

export const PASSIVE_TENSES_PERF = [
  'P_Perfectum_Indicativus',
  'P_Plusquamperfectum_Indicativus',
  'P_Futurum_II',
  'P_Perfectum_Subiunctivus',
  'P_Plusquamperfectum_Subiunctivus'
];

export const PASSIVE_TENSES = [...PASSIVE_TENSES_INF, ...PASSIVE_TENSES_PERF];

// ─── Esse forms for analytic perfectum ───

const ESSE = {
  pres:     ['sum','es','est','sumus','estis','sunt'],
  impf:     ['eram','erās','erat','erāmus','erātis','erant'],
  fut:      ['erō','eris','erit','erimus','eritis','erunt'],
  pres_subj:['sim','sīs','sit','sīmus','sītis','sint'],
  impf_subj:['essem','essēs','esset','essēmus','essētis','essent']
};

const PN_KEYS = [
  ['1','Singularis'],['2','Singularis'],['3','Singularis'],
  ['1','Pluralis'],['2','Pluralis'],['3','Pluralis']
];

function addPassivePerfectum(f, supStem) {
  const part = supStem + 'us/-a/-um';
  const tenseMap = {
    'P_Perfectum_Indicativus': ESSE.pres,
    'P_Plusquamperfectum_Indicativus': ESSE.impf,
    'P_Futurum_II': ESSE.fut,
    'P_Perfectum_Subiunctivus': ESSE.pres_subj,
    'P_Plusquamperfectum_Subiunctivus': ESSE.impf_subj
  };
  for (const [tense, esseForms] of Object.entries(tenseMap)) {
    PN_KEYS.forEach(([p, n], i) => {
      f[verbFormKey(tense, p, n)] = part + ' ' + esseForms[i];
    });
  }
}

// ─── 1st Conjugation Passive: amō → amor ───
function passiveConj1(stem, supStem) {
  const f = {};
  // Praesens Indicativus
  f[verbFormKey('P_Praesens_Indicativus','1','Singularis')] = stem + 'or';
  f[verbFormKey('P_Praesens_Indicativus','2','Singularis')] = stem + 'āris';
  f[verbFormKey('P_Praesens_Indicativus','3','Singularis')] = stem + 'ātur';
  f[verbFormKey('P_Praesens_Indicativus','1','Pluralis')]   = stem + 'āmur';
  f[verbFormKey('P_Praesens_Indicativus','2','Pluralis')]   = stem + 'āminī';
  f[verbFormKey('P_Praesens_Indicativus','3','Pluralis')]   = stem + 'antur';
  // Imperfectum Indicativus
  f[verbFormKey('P_Imperfectum_Indicativus','1','Singularis')] = stem + 'ābar';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Singularis')] = stem + 'ābāris';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Singularis')] = stem + 'ābātur';
  f[verbFormKey('P_Imperfectum_Indicativus','1','Pluralis')]   = stem + 'ābāmur';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Pluralis')]   = stem + 'ābāminī';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Pluralis')]   = stem + 'ābantur';
  // Futurum I
  f[verbFormKey('P_Futurum_I','1','Singularis')] = stem + 'ābor';
  f[verbFormKey('P_Futurum_I','2','Singularis')] = stem + 'āberis';
  f[verbFormKey('P_Futurum_I','3','Singularis')] = stem + 'ābitur';
  f[verbFormKey('P_Futurum_I','1','Pluralis')]   = stem + 'ābimur';
  f[verbFormKey('P_Futurum_I','2','Pluralis')]   = stem + 'ābiminī';
  f[verbFormKey('P_Futurum_I','3','Pluralis')]   = stem + 'ābuntur';
  // Praesens Subiunctivus
  const s = stem.replace(/a$/, '');
  f[verbFormKey('P_Praesens_Subiunctivus','1','Singularis')] = s + 'er';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Singularis')] = s + 'ēris';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Singularis')] = s + 'ētur';
  f[verbFormKey('P_Praesens_Subiunctivus','1','Pluralis')]   = s + 'ēmur';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Pluralis')]   = s + 'ēminī';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Pluralis')]   = s + 'entur';
  // Imperfectum Subiunctivus (from passive infinitive: stem + ārī)
  const inf = stem + 'ārī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Singularis')] = stem + 'ārer';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Singularis')] = stem + 'ārēris';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Singularis')] = stem + 'ārētur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Pluralis')]   = stem + 'ārēmur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Pluralis')]   = stem + 'ārēminī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Pluralis')]   = stem + 'ārentur';

  addPassivePerfectum(f, supStem);
  return f;
}

// ─── 2nd Conjugation Passive: deleō → deleor ───
function passiveConj2(stem, supStem) {
  const f = {};
  // Praesens Indicativus
  f[verbFormKey('P_Praesens_Indicativus','1','Singularis')] = stem + 'eor';
  f[verbFormKey('P_Praesens_Indicativus','2','Singularis')] = stem + 'ēris';
  f[verbFormKey('P_Praesens_Indicativus','3','Singularis')] = stem + 'ētur';
  f[verbFormKey('P_Praesens_Indicativus','1','Pluralis')]   = stem + 'ēmur';
  f[verbFormKey('P_Praesens_Indicativus','2','Pluralis')]   = stem + 'ēminī';
  f[verbFormKey('P_Praesens_Indicativus','3','Pluralis')]   = stem + 'entur';
  // Imperfectum Indicativus
  f[verbFormKey('P_Imperfectum_Indicativus','1','Singularis')] = stem + 'ēbar';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Singularis')] = stem + 'ēbāris';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Singularis')] = stem + 'ēbātur';
  f[verbFormKey('P_Imperfectum_Indicativus','1','Pluralis')]   = stem + 'ēbāmur';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Pluralis')]   = stem + 'ēbāminī';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Pluralis')]   = stem + 'ēbantur';
  // Futurum I
  f[verbFormKey('P_Futurum_I','1','Singularis')] = stem + 'ēbor';
  f[verbFormKey('P_Futurum_I','2','Singularis')] = stem + 'ēberis';
  f[verbFormKey('P_Futurum_I','3','Singularis')] = stem + 'ēbitur';
  f[verbFormKey('P_Futurum_I','1','Pluralis')]   = stem + 'ēbimur';
  f[verbFormKey('P_Futurum_I','2','Pluralis')]   = stem + 'ēbiminī';
  f[verbFormKey('P_Futurum_I','3','Pluralis')]   = stem + 'ēbuntur';
  // Praesens Subiunctivus
  f[verbFormKey('P_Praesens_Subiunctivus','1','Singularis')] = stem + 'ear';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Singularis')] = stem + 'eāris';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Singularis')] = stem + 'eātur';
  f[verbFormKey('P_Praesens_Subiunctivus','1','Pluralis')]   = stem + 'eāmur';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Pluralis')]   = stem + 'eāminī';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Pluralis')]   = stem + 'eantur';
  // Imperfectum Subiunctivus
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Singularis')] = stem + 'ērer';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Singularis')] = stem + 'ērēris';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Singularis')] = stem + 'ērētur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Pluralis')]   = stem + 'ērēmur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Pluralis')]   = stem + 'ērēminī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Pluralis')]   = stem + 'ērentur';

  addPassivePerfectum(f, supStem);
  return f;
}

// ─── 3rd Conjugation Passive: legō → legor ───
function passiveConj3(stem, supStem) {
  const f = {};
  // Praesens Indicativus
  f[verbFormKey('P_Praesens_Indicativus','1','Singularis')] = stem + 'or';
  f[verbFormKey('P_Praesens_Indicativus','2','Singularis')] = stem + 'eris';
  f[verbFormKey('P_Praesens_Indicativus','3','Singularis')] = stem + 'itur';
  f[verbFormKey('P_Praesens_Indicativus','1','Pluralis')]   = stem + 'imur';
  f[verbFormKey('P_Praesens_Indicativus','2','Pluralis')]   = stem + 'iminī';
  f[verbFormKey('P_Praesens_Indicativus','3','Pluralis')]   = stem + 'untur';
  // Imperfectum Indicativus
  f[verbFormKey('P_Imperfectum_Indicativus','1','Singularis')] = stem + 'ēbar';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Singularis')] = stem + 'ēbāris';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Singularis')] = stem + 'ēbātur';
  f[verbFormKey('P_Imperfectum_Indicativus','1','Pluralis')]   = stem + 'ēbāmur';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Pluralis')]   = stem + 'ēbāminī';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Pluralis')]   = stem + 'ēbantur';
  // Futurum I (3rd uses -ar, -ēris, -ētur pattern)
  f[verbFormKey('P_Futurum_I','1','Singularis')] = stem + 'ar';
  f[verbFormKey('P_Futurum_I','2','Singularis')] = stem + 'ēris';
  f[verbFormKey('P_Futurum_I','3','Singularis')] = stem + 'ētur';
  f[verbFormKey('P_Futurum_I','1','Pluralis')]   = stem + 'ēmur';
  f[verbFormKey('P_Futurum_I','2','Pluralis')]   = stem + 'ēminī';
  f[verbFormKey('P_Futurum_I','3','Pluralis')]   = stem + 'entur';
  // Praesens Subiunctivus
  f[verbFormKey('P_Praesens_Subiunctivus','1','Singularis')] = stem + 'ar';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Singularis')] = stem + 'āris';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Singularis')] = stem + 'ātur';
  f[verbFormKey('P_Praesens_Subiunctivus','1','Pluralis')]   = stem + 'āmur';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Pluralis')]   = stem + 'āminī';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Pluralis')]   = stem + 'antur';
  // Imperfectum Subiunctivus (from passive infinitive: stem + ī)
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Singularis')] = stem + 'erer';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Singularis')] = stem + 'erēris';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Singularis')] = stem + 'erētur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Pluralis')]   = stem + 'erēmur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Pluralis')]   = stem + 'erēminī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Pluralis')]   = stem + 'erentur';

  addPassivePerfectum(f, supStem);
  return f;
}

// ─── 3rd Conjugation -iō Passive: capiō → capior ───
function passiveConj3io(stem, supStem) {
  const f = {};
  // Praesens Indicativus
  f[verbFormKey('P_Praesens_Indicativus','1','Singularis')] = stem + 'ior';
  f[verbFormKey('P_Praesens_Indicativus','2','Singularis')] = stem + 'eris';
  f[verbFormKey('P_Praesens_Indicativus','3','Singularis')] = stem + 'itur';
  f[verbFormKey('P_Praesens_Indicativus','1','Pluralis')]   = stem + 'imur';
  f[verbFormKey('P_Praesens_Indicativus','2','Pluralis')]   = stem + 'iminī';
  f[verbFormKey('P_Praesens_Indicativus','3','Pluralis')]   = stem + 'iuntur';
  // Imperfectum Indicativus
  f[verbFormKey('P_Imperfectum_Indicativus','1','Singularis')] = stem + 'iēbar';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Singularis')] = stem + 'iēbāris';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Singularis')] = stem + 'iēbātur';
  f[verbFormKey('P_Imperfectum_Indicativus','1','Pluralis')]   = stem + 'iēbāmur';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Pluralis')]   = stem + 'iēbāminī';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Pluralis')]   = stem + 'iēbantur';
  // Futurum I
  f[verbFormKey('P_Futurum_I','1','Singularis')] = stem + 'iar';
  f[verbFormKey('P_Futurum_I','2','Singularis')] = stem + 'iēris';
  f[verbFormKey('P_Futurum_I','3','Singularis')] = stem + 'iētur';
  f[verbFormKey('P_Futurum_I','1','Pluralis')]   = stem + 'iēmur';
  f[verbFormKey('P_Futurum_I','2','Pluralis')]   = stem + 'iēminī';
  f[verbFormKey('P_Futurum_I','3','Pluralis')]   = stem + 'ientur';
  // Praesens Subiunctivus
  f[verbFormKey('P_Praesens_Subiunctivus','1','Singularis')] = stem + 'iar';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Singularis')] = stem + 'iāris';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Singularis')] = stem + 'iātur';
  f[verbFormKey('P_Praesens_Subiunctivus','1','Pluralis')]   = stem + 'iāmur';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Pluralis')]   = stem + 'iāminī';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Pluralis')]   = stem + 'iantur';
  // Imperfectum Subiunctivus (from passive infinitive: stem + ī)
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Singularis')] = stem + 'erer';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Singularis')] = stem + 'erēris';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Singularis')] = stem + 'erētur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Pluralis')]   = stem + 'erēmur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Pluralis')]   = stem + 'erēminī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Pluralis')]   = stem + 'erentur';

  addPassivePerfectum(f, supStem);
  return f;
}

// ─── 4th Conjugation Passive: audiō → audior ───
function passiveConj4(stem, supStem) {
  const f = {};
  // Praesens Indicativus
  f[verbFormKey('P_Praesens_Indicativus','1','Singularis')] = stem + 'ior';
  f[verbFormKey('P_Praesens_Indicativus','2','Singularis')] = stem + 'īris';
  f[verbFormKey('P_Praesens_Indicativus','3','Singularis')] = stem + 'ītur';
  f[verbFormKey('P_Praesens_Indicativus','1','Pluralis')]   = stem + 'īmur';
  f[verbFormKey('P_Praesens_Indicativus','2','Pluralis')]   = stem + 'īminī';
  f[verbFormKey('P_Praesens_Indicativus','3','Pluralis')]   = stem + 'iuntur';
  // Imperfectum Indicativus
  f[verbFormKey('P_Imperfectum_Indicativus','1','Singularis')] = stem + 'iēbar';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Singularis')] = stem + 'iēbāris';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Singularis')] = stem + 'iēbātur';
  f[verbFormKey('P_Imperfectum_Indicativus','1','Pluralis')]   = stem + 'iēbāmur';
  f[verbFormKey('P_Imperfectum_Indicativus','2','Pluralis')]   = stem + 'iēbāminī';
  f[verbFormKey('P_Imperfectum_Indicativus','3','Pluralis')]   = stem + 'iēbantur';
  // Futurum I
  f[verbFormKey('P_Futurum_I','1','Singularis')] = stem + 'iar';
  f[verbFormKey('P_Futurum_I','2','Singularis')] = stem + 'iēris';
  f[verbFormKey('P_Futurum_I','3','Singularis')] = stem + 'iētur';
  f[verbFormKey('P_Futurum_I','1','Pluralis')]   = stem + 'iēmur';
  f[verbFormKey('P_Futurum_I','2','Pluralis')]   = stem + 'iēminī';
  f[verbFormKey('P_Futurum_I','3','Pluralis')]   = stem + 'ientur';
  // Praesens Subiunctivus
  f[verbFormKey('P_Praesens_Subiunctivus','1','Singularis')] = stem + 'iar';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Singularis')] = stem + 'iāris';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Singularis')] = stem + 'iātur';
  f[verbFormKey('P_Praesens_Subiunctivus','1','Pluralis')]   = stem + 'iāmur';
  f[verbFormKey('P_Praesens_Subiunctivus','2','Pluralis')]   = stem + 'iāminī';
  f[verbFormKey('P_Praesens_Subiunctivus','3','Pluralis')]   = stem + 'iantur';
  // Imperfectum Subiunctivus (from passive infinitive: stem + īrī)
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Singularis')] = stem + 'īrer';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Singularis')] = stem + 'īrēris';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Singularis')] = stem + 'īrētur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','1','Pluralis')]   = stem + 'īrēmur';
  f[verbFormKey('P_Imperfectum_Subiunctivus','2','Pluralis')]   = stem + 'īrēminī';
  f[verbFormKey('P_Imperfectum_Subiunctivus','3','Pluralis')]   = stem + 'īrentur';

  addPassivePerfectum(f, supStem);
  return f;
}

// ─── Passive infinitive helper ───
export function passiveInfinitive(conj, stem) {
  if (conj === 'I')      return stem + 'ārī';
  if (conj === 'II')     return stem + 'ērī';
  if (conj === 'III')    return stem + 'ī';
  if (conj === 'III-io') return stem + 'ī';
  if (conj === 'IV')     return stem + 'īrī';
  return '—';
}

// ─── Build passive verb entry ───
// Keeps the same 7-tuple structure but merges passive forms into the forms object
// Returns null for verbs that can't have passive (no supinum, or esse)

function getPassiveGenerator(conj) {
  if (conj === 'I')      return passiveConj1;
  if (conj === 'II')     return passiveConj2;
  if (conj === 'III')    return passiveConj3;
  if (conj === 'III-io') return passiveConj3io;
  if (conj === 'IV')     return passiveConj4;
  return null;
}

function getStem(conj, nom) {
  if (conj === 'I')      return nom.replace(/ō$/, '').replace(/o$/, '');
  if (conj === 'II')     return nom.replace(/eō$/, '').replace(/eo$/, '');
  if (conj === 'III')    return nom.replace(/ō$/, '').replace(/o$/, '');
  if (conj === 'III-io') return nom.replace(/iō$/, '').replace(/io$/, '');
  if (conj === 'IV')     return nom.replace(/iō$/, '').replace(/io$/, '');
  return nom;
}

function getSupStem(supinum) {
  return supinum.replace(/um$/, '');
}

function buildPassiveVerb(verb) {
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  if (sup === '—' || conj === 'Irr.') return null;
  const gen = getPassiveGenerator(conj);
  if (!gen) return null;
  const stem = getStem(conj, nom);
  const supStem = getSupStem(sup);
  const passiveForms = gen(stem, supStem);
  const mergedForms = { ...forms, ...passiveForms };
  return [conj, type, nom, inf, perf, sup, mergedForms];
}

export const PASSIVE_VERBS = VERBS.map(buildPassiveVerb).filter(Boolean);
export const PASSIVE_EXTRA = EXTRA_VERBS.map(buildPassiveVerb).filter(Boolean);
export const ALL_PASSIVE_VERBS = [...PASSIVE_VERBS, ...PASSIVE_EXTRA];

// ─── Passive translation data for pass-translate mode ───

export const PASSIVE_TRANSLATIONS_PT = {
  'amō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'P_Praesens_Indicativus':              ['sou amado/a','és amado/a','é amado/a','somos amados/as','sois amados/as','são amados/as'],
    'P_Imperfectum_Indicativus':           ['era amado/a','eras amado/a','era amado/a','éramos amados/as','éreis amados/as','eram amados/as'],
    'P_Futurum_I':                          ['serei amado/a','serás amado/a','será amado/a','seremos amados/as','sereis amados/as','serão amados/as'],
    'P_Praesens_Subiunctivus':             ['seja amado/a','sejas amado/a','seja amado/a','sejamos amados/as','sejais amados/as','sejam amados/as'],
    'P_Imperfectum_Subiunctivus':          ['fosse amado/a','fosses amado/a','fosse amado/a','fôssemos amados/as','fôsseis amados/as','fossem amados/as'],
    'P_Perfectum_Indicativus':             ['fui amado/a','foste amado/a','foi amado/a','fomos amados/as','fostes amados/as','foram amados/as'],
    'P_Plusquamperfectum_Indicativus':      ['fora amado/a','foras amado/a','fora amado/a','fôramos amados/as','fôreis amados/as','foram amados/as'],
    'P_Futurum_II':                         ['terei sido amado/a','terás sido amado/a','terá sido amado/a','teremos sido amados/as','tereis sido amados/as','terão sido amados/as'],
    'P_Perfectum_Subiunctivus':            ['tenha sido amado/a','tenhas sido amado/a','tenha sido amado/a','tenhamos sido amados/as','tenhais sido amados/as','tenham sido amados/as'],
    'P_Plusquamperfectum_Subiunctivus':    ['tivesse sido amado/a','tivesses sido amado/a','tivesse sido amado/a','tivéssemos sido amados/as','tivésseis sido amados/as','tivessem sido amados/as'],
  },
  'legō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'P_Praesens_Indicativus':              ['sou lido/a','és lido/a','é lido/a','somos lidos/as','sois lidos/as','são lidos/as'],
    'P_Imperfectum_Indicativus':           ['era lido/a','eras lido/a','era lido/a','éramos lidos/as','éreis lidos/as','eram lidos/as'],
    'P_Futurum_I':                          ['serei lido/a','serás lido/a','será lido/a','seremos lidos/as','sereis lidos/as','serão lidos/as'],
    'P_Praesens_Subiunctivus':             ['seja lido/a','sejas lido/a','seja lido/a','sejamos lidos/as','sejais lidos/as','sejam lidos/as'],
    'P_Imperfectum_Subiunctivus':          ['fosse lido/a','fosses lido/a','fosse lido/a','fôssemos lidos/as','fôsseis lidos/as','fossem lidos/as'],
    'P_Perfectum_Indicativus':             ['fui lido/a','foste lido/a','foi lido/a','fomos lidos/as','fostes lidos/as','foram lidos/as'],
    'P_Plusquamperfectum_Indicativus':      ['fora lido/a','foras lido/a','fora lido/a','fôramos lidos/as','fôreis lidos/as','foram lidos/as'],
    'P_Futurum_II':                         ['terei sido lido/a','terás sido lido/a','terá sido lido/a','teremos sido lidos/as','tereis sido lidos/as','terão sido lidos/as'],
    'P_Perfectum_Subiunctivus':            ['tenha sido lido/a','tenhas sido lido/a','tenha sido lido/a','tenhamos sido lidos/as','tenhais sido lidos/as','tenham sido lidos/as'],
    'P_Plusquamperfectum_Subiunctivus':    ['tivesse sido lido/a','tivesses sido lido/a','tivesse sido lido/a','tivéssemos sido lidos/as','tivésseis sido lidos/as','tivessem sido lidos/as'],
  },
  'audiō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'P_Praesens_Indicativus':              ['sou ouvido/a','és ouvido/a','é ouvido/a','somos ouvidos/as','sois ouvidos/as','são ouvidos/as'],
    'P_Imperfectum_Indicativus':           ['era ouvido/a','eras ouvido/a','era ouvido/a','éramos ouvidos/as','éreis ouvidos/as','eram ouvidos/as'],
    'P_Futurum_I':                          ['serei ouvido/a','serás ouvido/a','será ouvido/a','seremos ouvidos/as','sereis ouvidos/as','serão ouvidos/as'],
    'P_Praesens_Subiunctivus':             ['seja ouvido/a','sejas ouvido/a','seja ouvido/a','sejamos ouvidos/as','sejais ouvidos/as','sejam ouvidos/as'],
    'P_Imperfectum_Subiunctivus':          ['fosse ouvido/a','fosses ouvido/a','fosse ouvido/a','fôssemos ouvidos/as','fôsseis ouvidos/as','fossem ouvidos/as'],
    'P_Perfectum_Indicativus':             ['fui ouvido/a','foste ouvido/a','foi ouvido/a','fomos ouvidos/as','fostes ouvidos/as','foram ouvidos/as'],
    'P_Plusquamperfectum_Indicativus':      ['fora ouvido/a','foras ouvido/a','fora ouvido/a','fôramos ouvidos/as','fôreis ouvidos/as','foram ouvidos/as'],
    'P_Futurum_II':                         ['terei sido ouvido/a','terás sido ouvido/a','terá sido ouvido/a','teremos sido ouvidos/as','tereis sido ouvidos/as','terão sido ouvidos/as'],
    'P_Perfectum_Subiunctivus':            ['tenha sido ouvido/a','tenhas sido ouvido/a','tenha sido ouvido/a','tenhamos sido ouvidos/as','tenhais sido ouvidos/as','tenham sido ouvidos/as'],
    'P_Plusquamperfectum_Subiunctivus':    ['tivesse sido ouvido/a','tivesses sido ouvido/a','tivesse sido ouvido/a','tivéssemos sido ouvidos/as','tivésseis sido ouvidos/as','tivessem sido ouvidos/as'],
  },
};

export const PASSIVE_TRANSLATIONS_EN = {
  'amō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'P_Praesens_Indicativus':              ['am loved','are loved','is loved','are loved','are loved','are loved'],
    'P_Imperfectum_Indicativus':           ['was being loved','were being loved','was being loved','were being loved','were being loved','were being loved'],
    'P_Futurum_I':                          ['will be loved','will be loved','will be loved','will be loved','will be loved','will be loved'],
    'P_Praesens_Subiunctivus':             ['may be loved','may be loved','may be loved','may be loved','may be loved','may be loved'],
    'P_Imperfectum_Subiunctivus':          ['were to be loved','were to be loved','were to be loved','were to be loved','were to be loved','were to be loved'],
    'P_Perfectum_Indicativus':             ['was loved','were loved','was loved','were loved','were loved','were loved'],
    'P_Plusquamperfectum_Indicativus':      ['had been loved','had been loved','had been loved','had been loved','had been loved','had been loved'],
    'P_Futurum_II':                         ['will have been loved','will have been loved','will have been loved','will have been loved','will have been loved','will have been loved'],
    'P_Perfectum_Subiunctivus':            ['may have been loved','may have been loved','may have been loved','may have been loved','may have been loved','may have been loved'],
    'P_Plusquamperfectum_Subiunctivus':    ['had been loved','had been loved','had been loved','had been loved','had been loved','had been loved'],
  },
  'legō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'P_Praesens_Indicativus':              ['am read','are read','is read','are read','are read','are read'],
    'P_Imperfectum_Indicativus':           ['was being read','were being read','was being read','were being read','were being read','were being read'],
    'P_Futurum_I':                          ['will be read','will be read','will be read','will be read','will be read','will be read'],
    'P_Praesens_Subiunctivus':             ['may be read','may be read','may be read','may be read','may be read','may be read'],
    'P_Imperfectum_Subiunctivus':          ['were to be read','were to be read','were to be read','were to be read','were to be read','were to be read'],
    'P_Perfectum_Indicativus':             ['was read','were read','was read','were read','were read','were read'],
    'P_Plusquamperfectum_Indicativus':      ['had been read','had been read','had been read','had been read','had been read','had been read'],
    'P_Futurum_II':                         ['will have been read','will have been read','will have been read','will have been read','will have been read','will have been read'],
    'P_Perfectum_Subiunctivus':            ['may have been read','may have been read','may have been read','may have been read','may have been read','may have been read'],
    'P_Plusquamperfectum_Subiunctivus':    ['had been read','had been read','had been read','had been read','had been read','had been read'],
  },
  'audiō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'P_Praesens_Indicativus':              ['am heard','are heard','is heard','are heard','are heard','are heard'],
    'P_Imperfectum_Indicativus':           ['was being heard','were being heard','was being heard','were being heard','were being heard','were being heard'],
    'P_Futurum_I':                          ['will be heard','will be heard','will be heard','will be heard','will be heard','will be heard'],
    'P_Praesens_Subiunctivus':             ['may be heard','may be heard','may be heard','may be heard','may be heard','may be heard'],
    'P_Imperfectum_Subiunctivus':          ['were to be heard','were to be heard','were to be heard','were to be heard','were to be heard','were to be heard'],
    'P_Perfectum_Indicativus':             ['was heard','were heard','was heard','were heard','were heard','were heard'],
    'P_Plusquamperfectum_Indicativus':      ['had been heard','had been heard','had been heard','had been heard','had been heard','had been heard'],
    'P_Futurum_II':                         ['will have been heard','will have been heard','will have been heard','will have been heard','will have been heard','will have been heard'],
    'P_Perfectum_Subiunctivus':            ['may have been heard','may have been heard','may have been heard','may have been heard','may have been heard','may have been heard'],
    'P_Plusquamperfectum_Subiunctivus':    ['had been heard','had been heard','had been heard','had been heard','had been heard','had been heard'],
  },
};

export function getPassiveTranslation(lang, verbNom, tense, personIdx) {
  const data = lang === 'pt' ? PASSIVE_TRANSLATIONS_PT : PASSIVE_TRANSLATIONS_EN;
  const v = data[verbNom];
  if (!v || !v[tense]) return null;
  const form = v[tense][personIdx];
  if (!form) return null;
  const subj = v.subj[personIdx];
  return `${subj} ${form}`;
}
