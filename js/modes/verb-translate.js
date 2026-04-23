// ═══════════════════════════════════════════════════════════════════════
// VERB TRANSLATE MODE — Translate PT/EN phrase to Latin form
// ═══════════════════════════════════════════════════════════════════════

import { VERBS, VERB_TENSES, VERB_PERSONS, VERB_NUMBERS, verbFormKey, getVerbTranslation, VERB_TRANSLATIONS_PT, VERB_TRANSLATIONS_EN } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getLang, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let trList, trIdx, trTotal, trHits, trWaiting, trCorrect;

export function isVerbTrWaiting() { return trWaiting; }

function getTranslatableVerbs() {
  const data = getLang() === 'pt' ? VERB_TRANSLATIONS_PT : VERB_TRANSLATIONS_EN;
  return VERBS.filter(v => data[v[2]]);
}

export function startVerbTranslate() {
  const verbs = getTranslatableVerbs();
  trList = shuffle([...verbs, ...verbs, ...verbs]);
  trIdx = 0; trTotal = 0; trHits = 0; trWaiting = false;
  document.getElementById('verbTrAcertos').textContent = '0';
  document.getElementById('verbTrTotal').textContent = '0';
  document.getElementById('verbTrPct').textContent = '';
  document.getElementById('verbTrFeedback').innerHTML = '';
  document.getElementById('verbTrNextBtn').style.display = 'none';
  showScreen('verb-traducao');
  verbTranslateShow();
}

export function verbTranslateShow() {
  const verbs = getTranslatableVerbs();
  if (trIdx >= trList.length) trIdx = 0;
  if (!verbs.length) return;

  const verb = trList[trIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const tense = pick(VERB_TENSES);
  const personIdx = Math.floor(Math.random() * 6);
  const person = VERB_PERSONS[personIdx % 3];
  const number = VERB_NUMBERS[personIdx < 3 ? 0 : 1];
  const key = verbFormKey(tense, person, number);
  trCorrect = forms[key];

  if (!trCorrect || trCorrect === '—') {
    trIdx++;
    verbTranslateShow();
    return;
  }

  const translation = getVerbTranslation(getLang(), nom, tense, personIdx);
  if (!translation) {
    trIdx++;
    verbTranslateShow();
    return;
  }

  const tenseLabel = t('verb.tense.' + tense);
  const el = document.getElementById('verbTrPrompt');
  el.innerHTML = `
    <div style="color:var(--text-dim);font-size:0.9rem;">${t('verb.translate.prompt')}</div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;font-style:italic;">"${translation}"</div>
    <div style="color:var(--text-dim);font-size:0.85rem;">(${nom} — ${tenseLabel}, ${person}ª ${t('verb.persona')}, ${number})</div>
    <div class="answer-row" style="margin-top:12px;">
      <input class="answer-input" id="verbTrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="verbTrSubmitBtn" onclick="window._verbTranslateCheck()">OK</button>
    </div>`;
  document.getElementById('verbTrFeedback').innerHTML = '';
  document.getElementById('verbTrNextBtn').style.display = 'none';
  trWaiting = false;
  setTimeout(() => document.getElementById('verbTrInput').focus(), 50);
  document.getElementById('verbTrInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (trWaiting) verbTranslateNext(); else verbTranslateCheck(); }
  };
}

export function verbTranslateCheck() {
  if (trWaiting) return;
  const inp = document.getElementById('verbTrInput');
  trTotal++;
  const fb = document.getElementById('verbTrFeedback');
  if (checkAnswer(inp.value, trCorrect)) {
    trHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', trCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', trCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('verbTrSubmitBtn').disabled = true;
  document.getElementById('verbTrAcertos').textContent = trHits;
  document.getElementById('verbTrTotal').textContent = trTotal;
  document.getElementById('verbTrPct').textContent = trTotal ? Math.round(trHits / trTotal * 100) + '%' : '';
  document.getElementById('verbTrNextBtn').style.display = 'inline-block';
  trWaiting = true;
  document.getElementById('verbTrNextBtn').focus();
}

export function verbTranslateNext() {
  trIdx++;
  verbTranslateShow();
}
