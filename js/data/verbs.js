// ═══════════════════════════════════════════════════════════════════════
// VERB DATA — Conjugation generators + verb lists
// ═══════════════════════════════════════════════════════════════════════

export const VERB_PERSONS = ['1','2','3'];
export const VERB_NUMBERS = ['Singularis','Pluralis'];

export const VERB_TENSES_INF = [
  'Praesens_Indicativus',
  'Imperfectum_Indicativus',
  'Futurum_I',
  'Praesens_Subiunctivus',
  'Imperfectum_Subiunctivus',
  'Imperativus_Praesens',
  'Imperativus_Futurus'
];

export const VERB_TENSES_PERF = [
  'Perfectum_Indicativus',
  'Plusquamperfectum_Indicativus',
  'Futurum_II',
  'Perfectum_Subiunctivus',
  'Plusquamperfectum_Subiunctivus'
];

export const VERB_TENSES = [...VERB_TENSES_INF, ...VERB_TENSES_PERF];

export function verbFormKey(tense, person, number) {
  return `${tense}_${person}_${number}`;
}

// ─── Person-number endings ───

const PN = {
  inf: { '1_Singularis':'','2_Singularis':'s','3_Singularis':'t',
         '1_Pluralis':'mus','2_Pluralis':'tis','3_Pluralis':'nt' },
  perf_ind: { '1_Singularis':'ī','2_Singularis':'istī','3_Singularis':'it',
              '1_Pluralis':'imus','2_Pluralis':'istis','3_Pluralis':'ērunt' },
  plupf_ind: { '1_Singularis':'eram','2_Singularis':'erās','3_Singularis':'erat',
               '1_Pluralis':'erāmus','2_Pluralis':'erātis','3_Pluralis':'erant' },
  fut_ii: { '1_Singularis':'erō','2_Singularis':'eris','3_Singularis':'erit',
            '1_Pluralis':'erimus','2_Pluralis':'eritis','3_Pluralis':'erint' },
  perf_subj: { '1_Singularis':'erim','2_Singularis':'erīs','3_Singularis':'erit',
               '1_Pluralis':'erīmus','2_Pluralis':'erītis','3_Pluralis':'erint' },
  plupf_subj: { '1_Singularis':'issem','2_Singularis':'issēs','3_Singularis':'isset',
                '1_Pluralis':'issēmus','2_Pluralis':'issētis','3_Pluralis':'issent' }
};

function addPerfectum(forms, perfStem) {
  for (const [pn, end] of Object.entries(PN.perf_ind))
    forms[`Perfectum_Indicativus_${pn}`] = perfStem + end;
  for (const [pn, end] of Object.entries(PN.plupf_ind))
    forms[`Plusquamperfectum_Indicativus_${pn}`] = perfStem + end;
  for (const [pn, end] of Object.entries(PN.fut_ii))
    forms[`Futurum_II_${pn}`] = perfStem + end;
  for (const [pn, end] of Object.entries(PN.perf_subj))
    forms[`Perfectum_Subiunctivus_${pn}`] = perfStem + end;
  for (const [pn, end] of Object.entries(PN.plupf_subj))
    forms[`Plusquamperfectum_Subiunctivus_${pn}`] = perfStem + end;
}

// ─── 1st Conjugation: amō, amāre ───
export function conj1(stem, perfStem) {
  const f = {};
  // Praesens Indicativus
  f['Praesens_Indicativus_1_Singularis'] = stem + 'ō';
  f['Praesens_Indicativus_2_Singularis'] = stem + 'ās';
  f['Praesens_Indicativus_3_Singularis'] = stem + 'at';
  f['Praesens_Indicativus_1_Pluralis']   = stem + 'āmus';
  f['Praesens_Indicativus_2_Pluralis']   = stem + 'ātis';
  f['Praesens_Indicativus_3_Pluralis']   = stem + 'ant';
  // Imperfectum Indicativus
  f['Imperfectum_Indicativus_1_Singularis'] = stem + 'ābam';
  f['Imperfectum_Indicativus_2_Singularis'] = stem + 'ābās';
  f['Imperfectum_Indicativus_3_Singularis'] = stem + 'ābat';
  f['Imperfectum_Indicativus_1_Pluralis']   = stem + 'ābāmus';
  f['Imperfectum_Indicativus_2_Pluralis']   = stem + 'ābātis';
  f['Imperfectum_Indicativus_3_Pluralis']   = stem + 'ābant';
  // Futurum I
  f['Futurum_I_1_Singularis'] = stem + 'ābō';
  f['Futurum_I_2_Singularis'] = stem + 'ābis';
  f['Futurum_I_3_Singularis'] = stem + 'ābit';
  f['Futurum_I_1_Pluralis']   = stem + 'ābimus';
  f['Futurum_I_2_Pluralis']   = stem + 'ābitis';
  f['Futurum_I_3_Pluralis']   = stem + 'ābunt';
  // Praesens Subiunctivus
  f['Praesens_Subiunctivus_1_Singularis'] = stem.replace(/a$/,'') + 'em';
  f['Praesens_Subiunctivus_2_Singularis'] = stem.replace(/a$/,'') + 'ēs';
  f['Praesens_Subiunctivus_3_Singularis'] = stem.replace(/a$/,'') + 'et';
  f['Praesens_Subiunctivus_1_Pluralis']   = stem.replace(/a$/,'') + 'ēmus';
  f['Praesens_Subiunctivus_2_Pluralis']   = stem.replace(/a$/,'') + 'ētis';
  f['Praesens_Subiunctivus_3_Pluralis']   = stem.replace(/a$/,'') + 'ent';
  // Imperfectum Subiunctivus (from infinitive: stem + āre + endings)
  const inf = stem + 'āre';
  f['Imperfectum_Subiunctivus_1_Singularis'] = inf + 'm';
  f['Imperfectum_Subiunctivus_2_Singularis'] = inf + 's'; // amārēs
  f['Imperfectum_Subiunctivus_3_Singularis'] = inf + 't';
  f['Imperfectum_Subiunctivus_1_Pluralis']   = inf + 'mus'; // amārēmus
  f['Imperfectum_Subiunctivus_2_Pluralis']   = inf + 'tis';
  f['Imperfectum_Subiunctivus_3_Pluralis']   = inf + 'nt';
  // Imperativus Praesens
  f['Imperativus_Praesens_2_Singularis'] = stem + 'ā';
  f['Imperativus_Praesens_2_Pluralis']   = stem + 'āte';
  // Imperativus Futurus
  f['Imperativus_Futurus_2_Singularis'] = stem + 'ātō';
  f['Imperativus_Futurus_3_Singularis'] = stem + 'ātō';
  f['Imperativus_Futurus_2_Pluralis']   = stem + 'ātōte';
  f['Imperativus_Futurus_3_Pluralis']   = stem + 'antō';

  addPerfectum(f, perfStem);
  return f;
}

// ─── 2nd Conjugation: deleō, delēre ───
export function conj2(stem, perfStem) {
  const f = {};
  // Praesens Indicativus
  f['Praesens_Indicativus_1_Singularis'] = stem + 'eō';
  f['Praesens_Indicativus_2_Singularis'] = stem + 'ēs';
  f['Praesens_Indicativus_3_Singularis'] = stem + 'et';
  f['Praesens_Indicativus_1_Pluralis']   = stem + 'ēmus';
  f['Praesens_Indicativus_2_Pluralis']   = stem + 'ētis';
  f['Praesens_Indicativus_3_Pluralis']   = stem + 'ent';
  // Imperfectum Indicativus
  f['Imperfectum_Indicativus_1_Singularis'] = stem + 'ēbam';
  f['Imperfectum_Indicativus_2_Singularis'] = stem + 'ēbās';
  f['Imperfectum_Indicativus_3_Singularis'] = stem + 'ēbat';
  f['Imperfectum_Indicativus_1_Pluralis']   = stem + 'ēbāmus';
  f['Imperfectum_Indicativus_2_Pluralis']   = stem + 'ēbātis';
  f['Imperfectum_Indicativus_3_Pluralis']   = stem + 'ēbant';
  // Futurum I
  f['Futurum_I_1_Singularis'] = stem + 'ēbō';
  f['Futurum_I_2_Singularis'] = stem + 'ēbis';
  f['Futurum_I_3_Singularis'] = stem + 'ēbit';
  f['Futurum_I_1_Pluralis']   = stem + 'ēbimus';
  f['Futurum_I_2_Pluralis']   = stem + 'ēbitis';
  f['Futurum_I_3_Pluralis']   = stem + 'ēbunt';
  // Praesens Subiunctivus
  f['Praesens_Subiunctivus_1_Singularis'] = stem + 'eam';
  f['Praesens_Subiunctivus_2_Singularis'] = stem + 'eās';
  f['Praesens_Subiunctivus_3_Singularis'] = stem + 'eat';
  f['Praesens_Subiunctivus_1_Pluralis']   = stem + 'eāmus';
  f['Praesens_Subiunctivus_2_Pluralis']   = stem + 'eātis';
  f['Praesens_Subiunctivus_3_Pluralis']   = stem + 'eant';
  // Imperfectum Subiunctivus
  const inf = stem + 'ēre';
  f['Imperfectum_Subiunctivus_1_Singularis'] = inf + 'm';
  f['Imperfectum_Subiunctivus_2_Singularis'] = inf + 's';
  f['Imperfectum_Subiunctivus_3_Singularis'] = inf + 't';
  f['Imperfectum_Subiunctivus_1_Pluralis']   = inf + 'mus';
  f['Imperfectum_Subiunctivus_2_Pluralis']   = inf + 'tis';
  f['Imperfectum_Subiunctivus_3_Pluralis']   = inf + 'nt';
  // Imperativus Praesens
  f['Imperativus_Praesens_2_Singularis'] = stem + 'ē';
  f['Imperativus_Praesens_2_Pluralis']   = stem + 'ēte';
  // Imperativus Futurus
  f['Imperativus_Futurus_2_Singularis'] = stem + 'ētō';
  f['Imperativus_Futurus_3_Singularis'] = stem + 'ētō';
  f['Imperativus_Futurus_2_Pluralis']   = stem + 'ētōte';
  f['Imperativus_Futurus_3_Pluralis']   = stem + 'entō';

  addPerfectum(f, perfStem);
  return f;
}

// ─── 3rd Conjugation: legō, legere ───
export function conj3(stem, perfStem) {
  const f = {};
  // Praesens Indicativus
  f['Praesens_Indicativus_1_Singularis'] = stem + 'ō';
  f['Praesens_Indicativus_2_Singularis'] = stem + 'is';
  f['Praesens_Indicativus_3_Singularis'] = stem + 'it';
  f['Praesens_Indicativus_1_Pluralis']   = stem + 'imus';
  f['Praesens_Indicativus_2_Pluralis']   = stem + 'itis';
  f['Praesens_Indicativus_3_Pluralis']   = stem + 'unt';
  // Imperfectum Indicativus
  f['Imperfectum_Indicativus_1_Singularis'] = stem + 'ēbam';
  f['Imperfectum_Indicativus_2_Singularis'] = stem + 'ēbās';
  f['Imperfectum_Indicativus_3_Singularis'] = stem + 'ēbat';
  f['Imperfectum_Indicativus_1_Pluralis']   = stem + 'ēbāmus';
  f['Imperfectum_Indicativus_2_Pluralis']   = stem + 'ēbātis';
  f['Imperfectum_Indicativus_3_Pluralis']   = stem + 'ēbant';
  // Futurum I
  f['Futurum_I_1_Singularis'] = stem + 'am';
  f['Futurum_I_2_Singularis'] = stem + 'ēs';
  f['Futurum_I_3_Singularis'] = stem + 'et';
  f['Futurum_I_1_Pluralis']   = stem + 'ēmus';
  f['Futurum_I_2_Pluralis']   = stem + 'ētis';
  f['Futurum_I_3_Pluralis']   = stem + 'ent';
  // Praesens Subiunctivus
  f['Praesens_Subiunctivus_1_Singularis'] = stem + 'am';
  f['Praesens_Subiunctivus_2_Singularis'] = stem + 'ās';
  f['Praesens_Subiunctivus_3_Singularis'] = stem + 'at';
  f['Praesens_Subiunctivus_1_Pluralis']   = stem + 'āmus';
  f['Praesens_Subiunctivus_2_Pluralis']   = stem + 'ātis';
  f['Praesens_Subiunctivus_3_Pluralis']   = stem + 'ant';
  // Imperfectum Subiunctivus
  const inf = stem + 'ere';
  f['Imperfectum_Subiunctivus_1_Singularis'] = inf + 'm';
  f['Imperfectum_Subiunctivus_2_Singularis'] = inf + 's';
  f['Imperfectum_Subiunctivus_3_Singularis'] = inf + 't';
  f['Imperfectum_Subiunctivus_1_Pluralis']   = inf + 'mus';
  f['Imperfectum_Subiunctivus_2_Pluralis']   = inf + 'tis';
  f['Imperfectum_Subiunctivus_3_Pluralis']   = inf + 'nt';
  // Imperativus Praesens
  f['Imperativus_Praesens_2_Singularis'] = stem + 'e';
  f['Imperativus_Praesens_2_Pluralis']   = stem + 'ite';
  // Imperativus Futurus
  f['Imperativus_Futurus_2_Singularis'] = stem + 'itō';
  f['Imperativus_Futurus_3_Singularis'] = stem + 'itō';
  f['Imperativus_Futurus_2_Pluralis']   = stem + 'itōte';
  f['Imperativus_Futurus_3_Pluralis']   = stem + 'untō';

  addPerfectum(f, perfStem);
  return f;
}

// ─── 3rd Conjugation Special (io): capiō, capere ───
export function conj3io(stem, perfStem) {
  const f = {};
  // Praesens Indicativus (follows 4th pattern for infectum from Root I)
  f['Praesens_Indicativus_1_Singularis'] = stem + 'iō';
  f['Praesens_Indicativus_2_Singularis'] = stem + 'is';
  f['Praesens_Indicativus_3_Singularis'] = stem + 'it';
  f['Praesens_Indicativus_1_Pluralis']   = stem + 'imus';
  f['Praesens_Indicativus_2_Pluralis']   = stem + 'itis';
  f['Praesens_Indicativus_3_Pluralis']   = stem + 'iunt';
  // Imperfectum Indicativus
  f['Imperfectum_Indicativus_1_Singularis'] = stem + 'iēbam';
  f['Imperfectum_Indicativus_2_Singularis'] = stem + 'iēbās';
  f['Imperfectum_Indicativus_3_Singularis'] = stem + 'iēbat';
  f['Imperfectum_Indicativus_1_Pluralis']   = stem + 'iēbāmus';
  f['Imperfectum_Indicativus_2_Pluralis']   = stem + 'iēbātis';
  f['Imperfectum_Indicativus_3_Pluralis']   = stem + 'iēbant';
  // Futurum I
  f['Futurum_I_1_Singularis'] = stem + 'iam';
  f['Futurum_I_2_Singularis'] = stem + 'iēs';
  f['Futurum_I_3_Singularis'] = stem + 'iet';
  f['Futurum_I_1_Pluralis']   = stem + 'iēmus';
  f['Futurum_I_2_Pluralis']   = stem + 'iētis';
  f['Futurum_I_3_Pluralis']   = stem + 'ient';
  // Praesens Subiunctivus
  f['Praesens_Subiunctivus_1_Singularis'] = stem + 'iam';
  f['Praesens_Subiunctivus_2_Singularis'] = stem + 'iās';
  f['Praesens_Subiunctivus_3_Singularis'] = stem + 'iat';
  f['Praesens_Subiunctivus_1_Pluralis']   = stem + 'iāmus';
  f['Praesens_Subiunctivus_2_Pluralis']   = stem + 'iātis';
  f['Praesens_Subiunctivus_3_Pluralis']   = stem + 'iant';
  // Imperfectum Subiunctivus (from actual infinitive — 3rd conj pattern)
  const inf = stem + 'ere';
  f['Imperfectum_Subiunctivus_1_Singularis'] = inf + 'm';
  f['Imperfectum_Subiunctivus_2_Singularis'] = inf + 's';
  f['Imperfectum_Subiunctivus_3_Singularis'] = inf + 't';
  f['Imperfectum_Subiunctivus_1_Pluralis']   = inf + 'mus';
  f['Imperfectum_Subiunctivus_2_Pluralis']   = inf + 'tis';
  f['Imperfectum_Subiunctivus_3_Pluralis']   = inf + 'nt';
  // Imperativus Praesens
  f['Imperativus_Praesens_2_Singularis'] = stem + 'e';
  f['Imperativus_Praesens_2_Pluralis']   = stem + 'ite';
  // Imperativus Futurus
  f['Imperativus_Futurus_2_Singularis'] = stem + 'itō';
  f['Imperativus_Futurus_3_Singularis'] = stem + 'itō';
  f['Imperativus_Futurus_2_Pluralis']   = stem + 'itōte';
  f['Imperativus_Futurus_3_Pluralis']   = stem + 'iuntō';

  addPerfectum(f, perfStem);
  return f;
}

// ─── 4th Conjugation: audiō, audīre ───
export function conj4(stem, perfStem) {
  const f = {};
  // Praesens Indicativus
  f['Praesens_Indicativus_1_Singularis'] = stem + 'iō';
  f['Praesens_Indicativus_2_Singularis'] = stem + 'īs';
  f['Praesens_Indicativus_3_Singularis'] = stem + 'it';
  f['Praesens_Indicativus_1_Pluralis']   = stem + 'īmus';
  f['Praesens_Indicativus_2_Pluralis']   = stem + 'ītis';
  f['Praesens_Indicativus_3_Pluralis']   = stem + 'iunt';
  // Imperfectum Indicativus
  f['Imperfectum_Indicativus_1_Singularis'] = stem + 'iēbam';
  f['Imperfectum_Indicativus_2_Singularis'] = stem + 'iēbās';
  f['Imperfectum_Indicativus_3_Singularis'] = stem + 'iēbat';
  f['Imperfectum_Indicativus_1_Pluralis']   = stem + 'iēbāmus';
  f['Imperfectum_Indicativus_2_Pluralis']   = stem + 'iēbātis';
  f['Imperfectum_Indicativus_3_Pluralis']   = stem + 'iēbant';
  // Futurum I
  f['Futurum_I_1_Singularis'] = stem + 'iam';
  f['Futurum_I_2_Singularis'] = stem + 'iēs';
  f['Futurum_I_3_Singularis'] = stem + 'iet';
  f['Futurum_I_1_Pluralis']   = stem + 'iēmus';
  f['Futurum_I_2_Pluralis']   = stem + 'iētis';
  f['Futurum_I_3_Pluralis']   = stem + 'ient';
  // Praesens Subiunctivus
  f['Praesens_Subiunctivus_1_Singularis'] = stem + 'iam';
  f['Praesens_Subiunctivus_2_Singularis'] = stem + 'iās';
  f['Praesens_Subiunctivus_3_Singularis'] = stem + 'iat';
  f['Praesens_Subiunctivus_1_Pluralis']   = stem + 'iāmus';
  f['Praesens_Subiunctivus_2_Pluralis']   = stem + 'iātis';
  f['Praesens_Subiunctivus_3_Pluralis']   = stem + 'iant';
  // Imperfectum Subiunctivus
  const inf = stem + 'īre';
  f['Imperfectum_Subiunctivus_1_Singularis'] = inf + 'm';
  f['Imperfectum_Subiunctivus_2_Singularis'] = inf + 's';
  f['Imperfectum_Subiunctivus_3_Singularis'] = inf + 't';
  f['Imperfectum_Subiunctivus_1_Pluralis']   = inf + 'mus';
  f['Imperfectum_Subiunctivus_2_Pluralis']   = inf + 'tis';
  f['Imperfectum_Subiunctivus_3_Pluralis']   = inf + 'nt';
  // Imperativus Praesens
  f['Imperativus_Praesens_2_Singularis'] = stem + 'ī';
  f['Imperativus_Praesens_2_Pluralis']   = stem + 'īte';
  // Imperativus Futurus
  f['Imperativus_Futurus_2_Singularis'] = stem + 'ītō';
  f['Imperativus_Futurus_3_Singularis'] = stem + 'ītō';
  f['Imperativus_Futurus_2_Pluralis']   = stem + 'ītōte';
  f['Imperativus_Futurus_3_Pluralis']   = stem + 'iuntō';

  addPerfectum(f, perfStem);
  return f;
}

// ─── Irregular: esse (sum, es, esse, fuī) ───
export function esse() {
  return {
    // Praesens Indicativus
    'Praesens_Indicativus_1_Singularis': 'sum',
    'Praesens_Indicativus_2_Singularis': 'es',
    'Praesens_Indicativus_3_Singularis': 'est',
    'Praesens_Indicativus_1_Pluralis':   'sumus',
    'Praesens_Indicativus_2_Pluralis':   'estis',
    'Praesens_Indicativus_3_Pluralis':   'sunt',
    // Imperfectum Indicativus
    'Imperfectum_Indicativus_1_Singularis': 'eram',
    'Imperfectum_Indicativus_2_Singularis': 'erās',
    'Imperfectum_Indicativus_3_Singularis': 'erat',
    'Imperfectum_Indicativus_1_Pluralis':   'erāmus',
    'Imperfectum_Indicativus_2_Pluralis':   'erātis',
    'Imperfectum_Indicativus_3_Pluralis':   'erant',
    // Futurum I
    'Futurum_I_1_Singularis': 'erō',
    'Futurum_I_2_Singularis': 'eris',
    'Futurum_I_3_Singularis': 'erit',
    'Futurum_I_1_Pluralis':   'erimus',
    'Futurum_I_2_Pluralis':   'eritis',
    'Futurum_I_3_Pluralis':   'erunt',
    // Praesens Subiunctivus
    'Praesens_Subiunctivus_1_Singularis': 'sim',
    'Praesens_Subiunctivus_2_Singularis': 'sīs',
    'Praesens_Subiunctivus_3_Singularis': 'sit',
    'Praesens_Subiunctivus_1_Pluralis':   'sīmus',
    'Praesens_Subiunctivus_2_Pluralis':   'sītis',
    'Praesens_Subiunctivus_3_Pluralis':   'sint',
    // Imperfectum Subiunctivus
    'Imperfectum_Subiunctivus_1_Singularis': 'essem',
    'Imperfectum_Subiunctivus_2_Singularis': 'essēs',
    'Imperfectum_Subiunctivus_3_Singularis': 'esset',
    'Imperfectum_Subiunctivus_1_Pluralis':   'essēmus',
    'Imperfectum_Subiunctivus_2_Pluralis':   'essētis',
    'Imperfectum_Subiunctivus_3_Pluralis':   'essent',
    // Imperativus Praesens
    'Imperativus_Praesens_2_Singularis': 'es',
    'Imperativus_Praesens_2_Pluralis':   'este',
    // Imperativus Futurus
    'Imperativus_Futurus_2_Singularis': 'estō',
    'Imperativus_Futurus_3_Singularis': 'estō',
    'Imperativus_Futurus_2_Pluralis':   'estōte',
    'Imperativus_Futurus_3_Pluralis':   'suntō',
    // Perfectum Indicativus
    'Perfectum_Indicativus_1_Singularis': 'fuī',
    'Perfectum_Indicativus_2_Singularis': 'fuistī',
    'Perfectum_Indicativus_3_Singularis': 'fuit',
    'Perfectum_Indicativus_1_Pluralis':   'fuimus',
    'Perfectum_Indicativus_2_Pluralis':   'fuistis',
    'Perfectum_Indicativus_3_Pluralis':   'fuērunt',
    // Plusquamperfectum Indicativus
    'Plusquamperfectum_Indicativus_1_Singularis': 'fueram',
    'Plusquamperfectum_Indicativus_2_Singularis': 'fuerās',
    'Plusquamperfectum_Indicativus_3_Singularis': 'fuerat',
    'Plusquamperfectum_Indicativus_1_Pluralis':   'fuerāmus',
    'Plusquamperfectum_Indicativus_2_Pluralis':   'fuerātis',
    'Plusquamperfectum_Indicativus_3_Pluralis':   'fuerant',
    // Futurum II
    'Futurum_II_1_Singularis': 'fuerō',
    'Futurum_II_2_Singularis': 'fueris',
    'Futurum_II_3_Singularis': 'fuerit',
    'Futurum_II_1_Pluralis':   'fuerimus',
    'Futurum_II_2_Pluralis':   'fueritis',
    'Futurum_II_3_Pluralis':   'fuerint',
    // Perfectum Subiunctivus
    'Perfectum_Subiunctivus_1_Singularis': 'fuerim',
    'Perfectum_Subiunctivus_2_Singularis': 'fuerīs',
    'Perfectum_Subiunctivus_3_Singularis': 'fuerit',
    'Perfectum_Subiunctivus_1_Pluralis':   'fuerīmus',
    'Perfectum_Subiunctivus_2_Pluralis':   'fuerītis',
    'Perfectum_Subiunctivus_3_Pluralis':   'fuerint',
    // Plusquamperfectum Subiunctivus
    'Plusquamperfectum_Subiunctivus_1_Singularis': 'fuissem',
    'Plusquamperfectum_Subiunctivus_2_Singularis': 'fuissēs',
    'Plusquamperfectum_Subiunctivus_3_Singularis': 'fuisset',
    'Plusquamperfectum_Subiunctivus_1_Pluralis':   'fuissēmus',
    'Plusquamperfectum_Subiunctivus_2_Pluralis':   'fuissētis',
    'Plusquamperfectum_Subiunctivus_3_Pluralis':   'fuissent',
  };
}

// ═══════════════════════════════════════════════════════════════════════
// VERB DATA
// Format: [conjugation, type, 1ps_pres, infinitive, perf_1ps, supinum, forms]
// ═══════════════════════════════════════════════════════════════════════

export const VERBS = [
  // Core paradigms (one per conjugation + esse)
  ["I",      "Regulāris (-ō, -āre)",       "amō",   "amāre",   "amāvī",   "amātum",  conj1("am","amāv")],
  ["II",     "Regulāris (-eō, -ēre)",      "deleō", "delēre",  "delēvī",  "delētum", conj2("del","delēv")],
  ["III",    "Regulāris (-ō, -ere)",        "legō",  "legere",  "lēgī",    "lēctum",  conj3("leg","lēg")],
  ["III-io", "Speciālis (-iō, -ere)",       "capiō", "capere",  "cēpī",    "captum",  conj3io("cap","cēp")],
  ["IV",     "Regulāris (-iō, -īre)",       "audiō", "audīre",  "audīvī",  "audītum", conj4("aud","audīv")],
  ["Irr.",   "Irregulāre (esse)",           "sum",   "esse",    "fuī",     "—",       esse()],
];

export const EXTRA_VERBS = [
  // I Conjugation
  ["I", "Regulāris (-ō, -āre)", "cantō",    "cantāre",    "cantāvī",    "cantātum",    conj1("cant","cantāv")],
  ["I", "Regulāris (-ō, -āre)", "laudō",    "laudāre",    "laudāvī",    "laudātum",    conj1("laud","laudāv")],
  ["I", "Regulāris (-ō, -āre)", "vocō",     "vocāre",     "vocāvī",     "vocātum",     conj1("voc","vocāv")],
  ["I", "Regulāris (-ō, -āre)", "portō",    "portāre",    "portāvī",    "portātum",    conj1("port","portāv")],
  ["I", "Regulāris (-ō, -āre)", "pugnō",    "pugnāre",    "pugnāvī",    "pugnātum",    conj1("pugn","pugnāv")],
  ["I", "Regulāris (-ō, -āre)", "habitō",   "habitāre",   "habitāvī",   "habitātum",   conj1("habit","habitāv")],
  // II Conjugation
  ["II", "Regulāris (-eō, -ēre)", "videō",  "vidēre",     "vīdī",       "vīsum",       conj2("vid","vīd")],
  ["II", "Regulāris (-eō, -ēre)", "moveō",  "movēre",     "mōvī",       "mōtum",       conj2("mov","mōv")],
  ["II", "Regulāris (-eō, -ēre)", "habeō",  "habēre",     "habuī",      "habitum",     conj2("hab","habu")],
  ["II", "Regulāris (-eō, -ēre)", "timeō",  "timēre",     "timuī",      "—",           conj2("tim","timu")],
  ["II", "Regulāris (-eō, -ēre)", "doceō",  "docēre",     "docuī",      "doctum",      conj2("doc","docu")],
  ["II", "Regulāris (-eō, -ēre)", "moneō",  "monēre",     "monuī",      "monitum",     conj2("mon","monu")],
  // III Conjugation
  ["III", "Regulāris (-ō, -ere)", "dūcō",   "dūcere",     "dūxī",       "ductum",      conj3("dūc","dūx")],
  ["III", "Regulāris (-ō, -ere)", "scrībō",  "scrībere",   "scrīpsī",    "scrīptum",    conj3("scrīb","scrīps")],
  ["III", "Regulāris (-ō, -ere)", "mittō",  "mittere",    "mīsī",       "missum",      conj3("mitt","mīs")],
  ["III", "Regulāris (-ō, -ere)", "dīcō",   "dīcere",     "dīxī",       "dictum",      conj3("dīc","dīx")],
  // III-io Conjugation
  ["III-io", "Speciālis (-iō, -ere)", "faciō",   "facere",   "fēcī",      "factum",      conj3io("fac","fēc")],
  ["III-io", "Speciālis (-iō, -ere)", "cupiō",   "cupere",   "cupīvī",    "cupītum",     conj3io("cup","cupīv")],
  ["III-io", "Speciālis (-iō, -ere)", "decipiō", "decipere", "decēpī",    "deceptum",    conj3io("decip","decēp")],
  // IV Conjugation
  ["IV", "Regulāris (-iō, -īre)", "veniō",  "venīre",     "vēnī",       "ventum",      conj4("ven","vēn")],
  ["IV", "Regulāris (-iō, -īre)", "sciō",   "scīre",      "scīvī",      "scītum",      conj4("sc","scīv")],
  ["IV", "Regulāris (-iō, -īre)", "sentiō", "sentīre",    "sēnsī",      "sēnsum",      conj4("sent","sēns")],
  ["IV", "Regulāris (-iō, -īre)", "dormiō", "dormīre",    "dormīvī",    "dormītum",    conj4("dorm","dormīv")],
];

export const ALL_VERBS = [...VERBS, ...EXTRA_VERBS];

// ─── Translation data for verb-translate mode ───
// Maps tense keys to PT and EN translation templates
// {0} = infinitive meaning (e.g. "amar"), {1} = subject pronoun
export const VERB_TRANSLATE_TEMPLATES = {
  pt: {
    'Praesens_Indicativus': [
      '{1} {inf_pres}',           // eu amo
    ],
    'Imperfectum_Indicativus': [
      '{1} {inf_imperf}',         // eu amava
    ],
    'Futurum_I': [
      '{1} {inf_fut}',            // eu amarei
    ],
    'Praesens_Subiunctivus': [
      'que {1} {inf_pres_subj}',  // que eu ame
    ],
    'Imperfectum_Subiunctivus': [
      'se {1} {inf_imperf_subj}', // se eu amasse
    ],
    'Perfectum_Indicativus': [
      '{1} {inf_perf}',           // eu amei
    ],
    'Plusquamperfectum_Indicativus': [
      '{1} {inf_plupf}',          // eu tinha amado
    ],
    'Futurum_II': [
      '{1} {inf_fut_perf}',       // eu terei amado
    ],
    'Perfectum_Subiunctivus': [
      'que {1} {inf_perf_subj}',  // que eu tenha amado
    ],
    'Plusquamperfectum_Subiunctivus': [
      'se {1} {inf_plupf_subj}',  // se eu tivesse amado
    ],
  },
  en: {
    'Praesens_Indicativus': ['{1} {inf_pres}'],
    'Imperfectum_Indicativus': ['{1} {inf_imperf}'],
    'Futurum_I': ['{1} {inf_fut}'],
    'Praesens_Subiunctivus': ['that {1} may {inf_base}'],
    'Imperfectum_Subiunctivus': ['if {1} {inf_imperf_subj}'],
    'Perfectum_Indicativus': ['{1} {inf_perf}'],
    'Plusquamperfectum_Indicativus': ['{1} {inf_plupf}'],
    'Futurum_II': ['{1} {inf_fut_perf}'],
    'Perfectum_Subiunctivus': ['that {1} may have {inf_pp}'],
    'Plusquamperfectum_Subiunctivus': ['if {1} had {inf_pp}'],
  }
};

// Per-verb translation forms (PT)
// Each verb has conjugated translations keyed by tense+person+number
export const VERB_TRANSLATIONS_PT = {
  'amō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['amo','amas','ama','amamos','amais','amam'],
    'Imperfectum_Indicativus':           ['amava','amavas','amava','amávamos','amáveis','amavam'],
    'Futurum_I':                          ['amarei','amarás','amará','amaremos','amareis','amarão'],
    'Praesens_Subiunctivus':             ['ame','ames','ame','amemos','ameis','amem'],
    'Imperfectum_Subiunctivus':          ['amasse','amasses','amasse','amássemos','amásseis','amassem'],
    'Perfectum_Indicativus':             ['amei','amaste','amou','amamos','amastes','amaram'],
    'Plusquamperfectum_Indicativus':      ['tinha amado','tinhas amado','tinha amado','tínhamos amado','tínheis amado','tinham amado'],
    'Futurum_II':                         ['terei amado','terás amado','terá amado','teremos amado','tereis amado','terão amado'],
    'Perfectum_Subiunctivus':            ['tenha amado','tenhas amado','tenha amado','tenhamos amado','tenhais amado','tenham amado'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse amado','tivesses amado','tivesse amado','tivéssemos amado','tivésseis amado','tivessem amado'],
    'Imperativus_Praesens':              [null,'ama',null,null,'amai',null],
    'Imperativus_Futurus':               [null,'ama','ame',null,'amai','amem'],
  },
  'deleō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['destruo','destruis','destrui','destruímos','destruís','destruem'],
    'Imperfectum_Indicativus':           ['destruía','destruías','destruía','destruíamos','destruíeis','destruíam'],
    'Futurum_I':                          ['destruirei','destruirás','destruirá','destruiremos','destruireis','destruirão'],
    'Praesens_Subiunctivus':             ['destrua','destruas','destrua','destruamos','destruais','destruam'],
    'Imperfectum_Subiunctivus':          ['destruísse','destruísses','destruísse','destruíssemos','destruísseis','destruíssem'],
    'Perfectum_Indicativus':             ['destruí','destruíste','destruiu','destruímos','destruístes','destruíram'],
    'Plusquamperfectum_Indicativus':      ['tinha destruído','tinhas destruído','tinha destruído','tínhamos destruído','tínheis destruído','tinham destruído'],
    'Futurum_II':                         ['terei destruído','terás destruído','terá destruído','teremos destruído','tereis destruído','terão destruído'],
    'Perfectum_Subiunctivus':            ['tenha destruído','tenhas destruído','tenha destruído','tenhamos destruído','tenhais destruído','tenham destruído'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse destruído','tivesses destruído','tivesse destruído','tivéssemos destruído','tivésseis destruído','tivessem destruído'],
    'Imperativus_Praesens':              [null,'destrói',null,null,'destruí',null],
    'Imperativus_Futurus':               [null,'destrói','destrua',null,'destruí','destruam'],
  },
  'legō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['leio','lês','lê','lemos','ledes','leem'],
    'Imperfectum_Indicativus':           ['lia','lias','lia','líamos','líeis','liam'],
    'Futurum_I':                          ['lerei','lerás','lerá','leremos','lereis','lerão'],
    'Praesens_Subiunctivus':             ['leia','leias','leia','leiamos','leiais','leiam'],
    'Imperfectum_Subiunctivus':          ['lesse','lesses','lesse','lêssemos','lêsseis','lessem'],
    'Perfectum_Indicativus':             ['li','leste','leu','lemos','lestes','leram'],
    'Plusquamperfectum_Indicativus':      ['tinha lido','tinhas lido','tinha lido','tínhamos lido','tínheis lido','tinham lido'],
    'Futurum_II':                         ['terei lido','terás lido','terá lido','teremos lido','tereis lido','terão lido'],
    'Perfectum_Subiunctivus':            ['tenha lido','tenhas lido','tenha lido','tenhamos lido','tenhais lido','tenham lido'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse lido','tivesses lido','tivesse lido','tivéssemos lido','tivésseis lido','tivessem lido'],
    'Imperativus_Praesens':              [null,'lê',null,null,'lede',null],
    'Imperativus_Futurus':               [null,'lê','leia',null,'lede','leiam'],
  },
  'capiō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['tomo','tomas','toma','tomamos','tomais','tomam'],
    'Imperfectum_Indicativus':           ['tomava','tomavas','tomava','tomávamos','tomáveis','tomavam'],
    'Futurum_I':                          ['tomarei','tomarás','tomará','tomaremos','tomareis','tomarão'],
    'Praesens_Subiunctivus':             ['tome','tomes','tome','tomemos','tomeis','tomem'],
    'Imperfectum_Subiunctivus':          ['tomasse','tomasses','tomasse','tomássemos','tomásseis','tomassem'],
    'Perfectum_Indicativus':             ['tomei','tomaste','tomou','tomamos','tomastes','tomaram'],
    'Plusquamperfectum_Indicativus':      ['tinha tomado','tinhas tomado','tinha tomado','tínhamos tomado','tínheis tomado','tinham tomado'],
    'Futurum_II':                         ['terei tomado','terás tomado','terá tomado','teremos tomado','tereis tomado','terão tomado'],
    'Perfectum_Subiunctivus':            ['tenha tomado','tenhas tomado','tenha tomado','tenhamos tomado','tenhais tomado','tenham tomado'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse tomado','tivesses tomado','tivesse tomado','tivéssemos tomado','tivésseis tomado','tivessem tomado'],
    'Imperativus_Praesens':              [null,'toma',null,null,'tomai',null],
    'Imperativus_Futurus':               [null,'toma','tome',null,'tomai','tomem'],
  },
  'audiō': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['ouço','ouves','ouve','ouvimos','ouvis','ouvem'],
    'Imperfectum_Indicativus':           ['ouvia','ouvias','ouvia','ouvíamos','ouvíeis','ouviam'],
    'Futurum_I':                          ['ouvirei','ouvirás','ouvirá','ouviremos','ouvireis','ouvirão'],
    'Praesens_Subiunctivus':             ['ouça','ouças','ouça','ouçamos','ouçais','ouçam'],
    'Imperfectum_Subiunctivus':          ['ouvisse','ouvisses','ouvisse','ouvíssemos','ouvísseis','ouvissem'],
    'Perfectum_Indicativus':             ['ouvi','ouviste','ouviu','ouvimos','ouvistes','ouviram'],
    'Plusquamperfectum_Indicativus':      ['tinha ouvido','tinhas ouvido','tinha ouvido','tínhamos ouvido','tínheis ouvido','tinham ouvido'],
    'Futurum_II':                         ['terei ouvido','terás ouvido','terá ouvido','teremos ouvido','tereis ouvido','terão ouvido'],
    'Perfectum_Subiunctivus':            ['tenha ouvido','tenhas ouvido','tenha ouvido','tenhamos ouvido','tenhais ouvido','tenham ouvido'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse ouvido','tivesses ouvido','tivesse ouvido','tivéssemos ouvido','tivésseis ouvido','tivessem ouvido'],
    'Imperativus_Praesens':              [null,'ouve',null,null,'ouvi',null],
    'Imperativus_Futurus':               [null,'ouve','ouça',null,'ouvi','ouçam'],
  },
  'sum': {
    subj: ['eu','tu','ele/ela','nós','vós','eles/elas'],
    'Praesens_Indicativus':              ['sou','és','é','somos','sois','são'],
    'Imperfectum_Indicativus':           ['era','eras','era','éramos','éreis','eram'],
    'Futurum_I':                          ['serei','serás','será','seremos','sereis','serão'],
    'Praesens_Subiunctivus':             ['seja','sejas','seja','sejamos','sejais','sejam'],
    'Imperfectum_Subiunctivus':          ['fosse','fosses','fosse','fôssemos','fôsseis','fossem'],
    'Perfectum_Indicativus':             ['fui','foste','foi','fomos','fostes','foram'],
    'Plusquamperfectum_Indicativus':      ['tinha sido','tinhas sido','tinha sido','tínhamos sido','tínheis sido','tinham sido'],
    'Futurum_II':                         ['terei sido','terás sido','terá sido','teremos sido','tereis sido','terão sido'],
    'Perfectum_Subiunctivus':            ['tenha sido','tenhas sido','tenha sido','tenhamos sido','tenhais sido','tenham sido'],
    'Plusquamperfectum_Subiunctivus':    ['tivesse sido','tivesses sido','tivesse sido','tivéssemos sido','tivésseis sido','tivessem sido'],
    'Imperativus_Praesens':              [null,'sê',null,null,'sede',null],
    'Imperativus_Futurus':               [null,'sê','seja',null,'sede','sejam'],
  },
};

// EN translations (for verb-translate mode)
export const VERB_TRANSLATIONS_EN = {
  'amō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'Praesens_Indicativus':              ['love','love','loves','love','love','love'],
    'Imperfectum_Indicativus':           ['was loving','were loving','was loving','were loving','were loving','were loving'],
    'Futurum_I':                          ['will love','will love','will love','will love','will love','will love'],
    'Praesens_Subiunctivus':             ['may love','may love','may love','may love','may love','may love'],
    'Imperfectum_Subiunctivus':          ['were to love','were to love','were to love','were to love','were to love','were to love'],
    'Perfectum_Indicativus':             ['loved','loved','loved','loved','loved','loved'],
    'Plusquamperfectum_Indicativus':      ['had loved','had loved','had loved','had loved','had loved','had loved'],
    'Futurum_II':                         ['will have loved','will have loved','will have loved','will have loved','will have loved','will have loved'],
    'Perfectum_Subiunctivus':            ['may have loved','may have loved','may have loved','may have loved','may have loved','may have loved'],
    'Plusquamperfectum_Subiunctivus':    ['had loved','had loved','had loved','had loved','had loved','had loved'],
    'Imperativus_Praesens':              [null,'love!',null,null,'love!',null],
    'Imperativus_Futurus':               [null,'love!','let him/her love!',null,'love!','let them love!'],
  },
  'legō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'Praesens_Indicativus':              ['read','read','reads','read','read','read'],
    'Imperfectum_Indicativus':           ['was reading','were reading','was reading','were reading','were reading','were reading'],
    'Futurum_I':                          ['will read','will read','will read','will read','will read','will read'],
    'Praesens_Subiunctivus':             ['may read','may read','may read','may read','may read','may read'],
    'Imperfectum_Subiunctivus':          ['were to read','were to read','were to read','were to read','were to read','were to read'],
    'Perfectum_Indicativus':             ['read','read','read','read','read','read'],
    'Plusquamperfectum_Indicativus':      ['had read','had read','had read','had read','had read','had read'],
    'Futurum_II':                         ['will have read','will have read','will have read','will have read','will have read','will have read'],
    'Perfectum_Subiunctivus':            ['may have read','may have read','may have read','may have read','may have read','may have read'],
    'Plusquamperfectum_Subiunctivus':    ['had read','had read','had read','had read','had read','had read'],
    'Imperativus_Praesens':              [null,'read!',null,null,'read!',null],
    'Imperativus_Futurus':               [null,'read!','let him/her read!',null,'read!','let them read!'],
  },
  'audiō': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'Praesens_Indicativus':              ['hear','hear','hears','hear','hear','hear'],
    'Imperfectum_Indicativus':           ['was hearing','were hearing','was hearing','were hearing','were hearing','were hearing'],
    'Futurum_I':                          ['will hear','will hear','will hear','will hear','will hear','will hear'],
    'Praesens_Subiunctivus':             ['may hear','may hear','may hear','may hear','may hear','may hear'],
    'Imperfectum_Subiunctivus':          ['were to hear','were to hear','were to hear','were to hear','were to hear','were to hear'],
    'Perfectum_Indicativus':             ['heard','heard','heard','heard','heard','heard'],
    'Plusquamperfectum_Indicativus':      ['had heard','had heard','had heard','had heard','had heard','had heard'],
    'Futurum_II':                         ['will have heard','will have heard','will have heard','will have heard','will have heard','will have heard'],
    'Perfectum_Subiunctivus':            ['may have heard','may have heard','may have heard','may have heard','may have heard','may have heard'],
    'Plusquamperfectum_Subiunctivus':    ['had heard','had heard','had heard','had heard','had heard','had heard'],
    'Imperativus_Praesens':              [null,'hear!',null,null,'hear!',null],
    'Imperativus_Futurus':               [null,'hear!','let him/her hear!',null,'hear!','let them hear!'],
  },
  'sum': {
    subj: ['I','you','he/she','we','you (pl.)','they'],
    'Praesens_Indicativus':              ['am','are','is','are','are','are'],
    'Imperfectum_Indicativus':           ['was','were','was','were','were','were'],
    'Futurum_I':                          ['will be','will be','will be','will be','will be','will be'],
    'Praesens_Subiunctivus':             ['may be','may be','may be','may be','may be','may be'],
    'Imperfectum_Subiunctivus':          ['were','were','were','were','were','were'],
    'Perfectum_Indicativus':             ['was/have been','were/have been','was/has been','were/have been','were/have been','were/have been'],
    'Plusquamperfectum_Indicativus':      ['had been','had been','had been','had been','had been','had been'],
    'Futurum_II':                         ['will have been','will have been','will have been','will have been','will have been','will have been'],
    'Perfectum_Subiunctivus':            ['may have been','may have been','may have been','may have been','may have been','may have been'],
    'Plusquamperfectum_Subiunctivus':    ['had been','had been','had been','had been','had been','had been'],
    'Imperativus_Praesens':              [null,'be!',null,null,'be!',null],
    'Imperativus_Futurus':               [null,'be!','let him/her be!',null,'be!','let them be!'],
  },
};

// Helper to get translation for a specific verb form
export function getVerbTranslation(lang, verbNom, tense, personIdx) {
  const data = lang === 'pt' ? VERB_TRANSLATIONS_PT : VERB_TRANSLATIONS_EN;
  const v = data[verbNom];
  if (!v || !v[tense]) return null;
  const form = v[tense][personIdx];
  if (!form) return null;
  if (tense === 'Imperativus_Praesens' || tense === 'Imperativus_Futurus') return form;
  const subj = v.subj[personIdx];
  return `${subj} ${form}`;
}
