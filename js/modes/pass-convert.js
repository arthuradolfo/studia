// ═══════════════════════════════════════════════════════════════════════
// PASSIVE CONVERT MODE — Active ↔ Passive voice conversion
// ═══════════════════════════════════════════════════════════════════════

import { ALL_PASSIVE_VERBS, PASSIVE_TENSES } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import {
  SENTENCE_PAIRS, TRANSITIVE_VERB_NOMS, SENTENCE_TENSES,
  lookupNoun, lookupTransitiveVerb, buildSentencePair
} from '../data/passive-sentences.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const CONVERTIBLE_TENSES = [
  'Praesens_Indicativus',
  'Imperfectum_Indicativus',
  'Futurum_I',
  'Praesens_Subiunctivus',
  'Imperfectum_Subiunctivus',
  'Perfectum_Indicativus',
  'Plusquamperfectum_Indicativus',
  'Futurum_II',
  'Perfectum_Subiunctivus',
  'Plusquamperfectum_Subiunctivus'
];

let cvList, cvIdx, cvTotal, cvHits, cvWaiting, cvCorrect, cvDirection;
let cvMode = 'verb';

export function isPassCvWaiting() { return cvWaiting; }

function renderModeSelector() {
  const sel = document.getElementById('passCvModeSelector');
  sel.innerHTML = '';
  ['verb', 'sentence'].forEach(mode => {
    const b = document.createElement('button');
    b.textContent = t('pass.convert.mode.' + mode);
    b.dataset.mode = mode;
    if (cvMode === mode) b.classList.add('selected');
    b.onclick = () => {
      if (cvMode === mode) return;
      cvMode = mode;
      sel.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      updateHint();
      resetStats();
      passConvertShow();
    };
    sel.appendChild(b);
  });
}

function updateHint() {
  const el = document.getElementById('passCvHint');
  if (!el) return;
  el.textContent = cvMode === 'sentence'
    ? t('pass.convert.hint.sentence')
    : t('pass.convert.hint');
}

function resetStats() {
  cvIdx = 0; cvTotal = 0; cvHits = 0; cvWaiting = false;
  document.getElementById('passCvAcertos').textContent = '0';
  document.getElementById('passCvTotal').textContent = '0';
  document.getElementById('passCvPct').textContent = '';
  document.getElementById('passCvFeedback').innerHTML = '';
  document.getElementById('passCvNextBtn').style.display = 'none';
}

export function startPassConvert() {
  cvList = shuffle([...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS]);
  resetStats();
  renderModeSelector();
  updateHint();
  showScreen('pass-conversio');
  passConvertShow();
}

export function passConvertShow() {
  if (cvMode === 'sentence') {
    passConvertShowSentence();
  } else {
    passConvertShowVerb();
  }
}

function passConvertShowVerb() {
  if (cvIdx >= cvList.length) cvIdx = 0;
  const verb = cvList[cvIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';

  const tense = pick(CONVERTIBLE_TENSES);
  const person = pick(VERB_PERSONS);
  const number = pick(VERB_NUMBERS);

  const activeKey = verbFormKey(tense, person, number);
  const passiveKey = verbFormKey('P_' + tense, person, number);
  const activeForm = forms[activeKey];
  const passiveForm = forms[passiveKey];

  if (!activeForm || activeForm === '—' || !passiveForm || passiveForm === '—') {
    cvIdx++;
    passConvertShowVerb();
    return;
  }

  cvDirection = Math.random() < 0.5 ? 'a2p' : 'p2a';
  const shownForm = cvDirection === 'a2p' ? activeForm : passiveForm;
  cvCorrect = cvDirection === 'a2p' ? passiveForm : activeForm;

  const tenseLabel = t('verb.tense.' + tense);
  const dirLabel = cvDirection === 'a2p'
    ? t('pass.convert.active.to.passive')
    : t('pass.convert.passive.to.active');
  const promptLabel = cvDirection === 'a2p'
    ? t('pass.convert.prompt.a2p')
    : t('pass.convert.prompt.p2a');

  const el = document.getElementById('passCvPrompt');
  el.innerHTML = `
    <div style="color:var(--text-dim);font-size:0.85rem;">${dirLabel}</div>
    <div class="word-info" style="font-size:1rem;margin:4px 0;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${conj} ${t('verb.conjugation')} · ${tenseLabel}, ${person}ª ${t('verb.persona')}, ${number}</div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;letter-spacing:1px;">${shownForm}</div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${promptLabel}</div>
    <div class="answer-row" style="margin-top:8px;">
      <input class="answer-input" id="passCvInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="passCvSubmitBtn" onclick="window._passConvertCheck()">OK</button>
    </div>`;
  document.getElementById('passCvFeedback').innerHTML = '';
  document.getElementById('passCvNextBtn').style.display = 'none';
  cvWaiting = false;
  setTimeout(() => document.getElementById('passCvInput').focus(), 50);
  document.getElementById('passCvInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (cvWaiting) passConvertNext(); else passConvertCheck(); }
  };
}

function passConvertShowSentence() {
  const pair = pick(SENTENCE_PAIRS);
  const agentNoun = lookupNoun(pair[0]);
  const patientNoun = lookupNoun(pair[1]);
  if (!agentNoun || !patientNoun) { passConvertShowSentence(); return; }

  const verbNom = pick(TRANSITIVE_VERB_NOMS);
  const verb = lookupTransitiveVerb(verbNom);
  if (!verb) { passConvertShowSentence(); return; }

  const tense = pick(SENTENCE_TENSES);
  const direction = Math.random() < 0.5 ? 'a2p' : 'p2a';
  const result = buildSentencePair(agentNoun, patientNoun, verb, tense, direction);
  if (!result) { passConvertShowSentence(); return; }

  cvDirection = direction;
  cvCorrect = result.correct;

  const tenseLabel = t('verb.tense.' + tense);
  const dirLabel = cvDirection === 'a2p'
    ? t('pass.convert.active.to.passive')
    : t('pass.convert.passive.to.active');
  const promptLabel = cvDirection === 'a2p'
    ? t('pass.convert.sentence.a2p')
    : t('pass.convert.sentence.p2a');

  const nom = verb[2];
  const inf = verb[3];
  const meaning = getMeaning(nom) || '';

  const el = document.getElementById('passCvPrompt');
  el.innerHTML = `
    <div style="color:var(--text-dim);font-size:0.85rem;">${dirLabel}</div>
    <div class="word-info" style="font-size:1rem;margin:4px 0;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${tenseLabel}, 3ª ${t('verb.persona')}, Singularis</div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;letter-spacing:1px;">${result.shown}</div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${promptLabel}</div>
    <div class="answer-row" style="margin-top:8px;">
      <input class="answer-input" id="passCvInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="passCvSubmitBtn" onclick="window._passConvertCheck()">OK</button>
    </div>`;
  document.getElementById('passCvFeedback').innerHTML = '';
  document.getElementById('passCvNextBtn').style.display = 'none';
  cvWaiting = false;
  setTimeout(() => document.getElementById('passCvInput').focus(), 50);
  document.getElementById('passCvInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (cvWaiting) passConvertNext(); else passConvertCheck(); }
  };
}

export function passConvertCheck() {
  if (cvWaiting) return;
  const inp = document.getElementById('passCvInput');
  cvTotal++;
  const fb = document.getElementById('passCvFeedback');
  if (checkAnswer(inp.value, cvCorrect)) {
    cvHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', cvCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', cvCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('passCvSubmitBtn').disabled = true;
  document.getElementById('passCvAcertos').textContent = cvHits;
  document.getElementById('passCvTotal').textContent = cvTotal;
  document.getElementById('passCvPct').textContent = cvTotal ? Math.round(cvHits / cvTotal * 100) + '%' : '';
  document.getElementById('passCvNextBtn').style.display = 'inline-block';
  cvWaiting = true;
  document.getElementById('passCvNextBtn').focus();
}

export function passConvertNext() {
  cvIdx++;
  passConvertShow();
}
