// ═══════════════════════════════════════════════════════════════════════
// PASSIVE SENTENCE DATA — Noun pairs + sentence builder for conversion
// ═══════════════════════════════════════════════════════════════════════

import { ALL_WORDS } from './words.js';
import { ALL_PASSIVE_VERBS } from './passive.js';
import { stripMacrons } from '../helpers.js';
import { verbFormKey } from './verbs.js';

// ─── 25 curated noun pairs: [agentNom, patientNom] ───

export const SENTENCE_PAIRS = [
  ['magister', 'discipulus'],
  ['magister', 'puella'],
  ['dominus', 'servus'],
  ['rex', 'mīles'],
  ['rex', 'populus'],
  ['dux', 'hostis'],
  ['dux', 'mīles'],
  ['imperātor', 'exercitus'],
  ['pater', 'filius'],
  ['pater', 'fīlia'],
  ['māter', 'filius'],
  ['māter', 'fīlia'],
  ['agricola', 'equus'],
  ['agricola', 'terra'],
  ['nauta', 'nāvis'],
  ['poēta', 'carmen'],
  ['iūdex', 'lēx'],
  ['senātor', 'cōnsilium'],
  ['custōs', 'porta'],
  ['pastor', 'animal'],
  ['medicus', 'vulnus'],
  ['frāter', 'līttera'],
  ['puella', 'rosa'],
  ['dominus', 'dōnum'],
  ['servus', 'aqua'],
];

// ─── 15 transitive verbs (by nominative) ───

export const TRANSITIVE_VERB_NOMS = [
  'amō', 'laudō', 'vocō', 'portō',
  'deleō', 'videō', 'doceō', 'moneō',
  'legō', 'dūcō', 'scrībō', 'mittō',
  'capiō', 'audiō', 'faciō',
];

// ─── Esse 3sg forms for analytic perfectum ───

const ESSE_3SG = {
  'P_Perfectum_Indicativus': 'est',
  'P_Plusquamperfectum_Indicativus': 'erat',
  'P_Futurum_II': 'erit',
  'P_Perfectum_Subiunctivus': 'sit',
  'P_Plusquamperfectum_Subiunctivus': 'esset',
};

const INFECTUM_TENSES = [
  'Praesens_Indicativus',
  'Imperfectum_Indicativus',
  'Futurum_I',
  'Praesens_Subiunctivus',
  'Imperfectum_Subiunctivus',
];

const PERFECTUM_TENSES = [
  'Perfectum_Indicativus',
  'Plusquamperfectum_Indicativus',
  'Futurum_II',
  'Perfectum_Subiunctivus',
  'Plusquamperfectum_Subiunctivus',
];

export const SENTENCE_TENSES = [...INFECTUM_TENSES, ...PERFECTUM_TENSES];

// ─── Helpers ───

export function lookupNoun(nom) {
  const w = ALL_WORDS.find(w => w[2] === nom);
  if (!w) return null;
  const forms = w[5];
  return {
    nom: forms['Nominativus_Singularis'],
    acc: forms['Accusativus_Singularis'],
    abl: forms['Ablativus_Singularis'],
    gender: w[4],
  };
}

export function lookupTransitiveVerb(nom) {
  return ALL_PASSIVE_VERBS.find(v => v[2] === nom) || null;
}

export function aPreposition(nextWord) {
  const ch = stripMacrons(nextWord[0]).toLowerCase();
  return ('aeiou'.includes(ch) || ch === 'h') ? 'ab' : 'ā';
}

export function resolveParticiple(supStem, gender) {
  if (gender === 'n.') return supStem + 'um';
  if (gender === 'f.') return supStem + 'a';
  return supStem + 'us';
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function isInfectum(tense) {
  return INFECTUM_TENSES.includes(tense);
}

function getSupStem(verb) {
  return verb[5].replace(/um$/, '');
}

// ─── Sentence builder ───

export function buildSentencePair(agentNoun, patientNoun, verb, tense, direction) {
  const forms = verb[6];
  const activeKey = verbFormKey(tense, '3', 'Singularis');
  const passiveKey = verbFormKey('P_' + tense, '3', 'Singularis');

  const activeVerb = forms[activeKey];
  if (!activeVerb || activeVerb === '—') return null;

  let passiveVerb;
  if (isInfectum(tense)) {
    passiveVerb = forms[passiveKey];
    if (!passiveVerb || passiveVerb === '—') return null;
  } else {
    const esse = ESSE_3SG['P_' + tense];
    if (!esse) return null;
    const subjectGender = direction === 'a2p' ? patientNoun.gender : agentNoun.gender;
    const participle = resolveParticiple(getSupStem(verb), subjectGender);
    passiveVerb = participle + ' ' + esse;
  }

  const prep = aPreposition(agentNoun.abl);

  const activeSentence = capitalize(agentNoun.nom) + ' ' + patientNoun.acc + ' ' + activeVerb;
  const passiveSentence = capitalize(patientNoun.nom) + ' ' + prep + ' ' + agentNoun.abl + ' ' + passiveVerb;

  if (direction === 'a2p') {
    return { shown: activeSentence, correct: passiveSentence };
  } else {
    return { shown: passiveSentence, correct: activeSentence };
  }
}
