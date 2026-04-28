// ═══════════════════════════════════════════════════════════════════════
// PASSIVE TRANSLATE MODE — Translate PT/EN phrase to Latin passive form
// ═══════════════════════════════════════════════════════════════════════

import { PASSIVE_VERBS, PASSIVE_TENSES, PASSIVE_TRANSLATIONS_PT, PASSIVE_TRANSLATIONS_EN, getPassiveTranslation } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getLang, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let trList, trIdx, trTotal, trHits, trWaiting, trCorrect;

export function isPassTrWaiting() { return trWaiting; }

function getTranslatableVerbs() {
  const data = getLang() === 'pt' ? PASSIVE_TRANSLATIONS_PT : PASSIVE_TRANSLATIONS_EN;
  return PASSIVE_VERBS.filter(v => data[v[2]]);
}

export function startPassTranslate() {
  const verbs = getTranslatableVerbs();
  trList = shuffle([...verbs, ...verbs, ...verbs]);
  trIdx = 0; trTotal = 0; trHits = 0; trWaiting = false;
  document.getElementById('passTrAcertos').textContent = '0';
  document.getElementById('passTrTotal').textContent = '0';
  document.getElementById('passTrPct').textContent = '';
  document.getElementById('passTrFeedback').innerHTML = '';
  document.getElementById('passTrNextBtn').style.display = 'none';
  showScreen('pass-traducao');
  passTranslateShow();
}

export function passTranslateShow() {
  const verbs = getTranslatableVerbs();
  if (trIdx >= trList.length) trIdx = 0;
  if (!verbs.length) return;

  const verb = trList[trIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const tense = pick(PASSIVE_TENSES);
  const personIdx = Math.floor(Math.random() * 6);
  const person = VERB_PERSONS[personIdx % 3];
  const number = VERB_NUMBERS[personIdx < 3 ? 0 : 1];
  const key = verbFormKey(tense, person, number);
  trCorrect = forms[key];

  if (!trCorrect || trCorrect === '—') {
    trIdx++;
    passTranslateShow();
    return;
  }

  const translation = getPassiveTranslation(getLang(), nom, tense, personIdx);
  if (!translation) {
    trIdx++;
    passTranslateShow();
    return;
  }

  const tenseLabel = t('pass.tense.' + tense);
  const el = document.getElementById('passTrPrompt');
  el.innerHTML = `
    <div style="color:var(--text-dim);font-size:0.9rem;">${t('pass.translate.prompt')}</div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;font-style:italic;">"${translation}"</div>
    <div style="color:var(--text-dim);font-size:0.85rem;">(${nom} — ${tenseLabel}, ${person}ª ${t('verb.persona')}, ${number})</div>
    <div class="answer-row" style="margin-top:12px;">
      <input class="answer-input" id="passTrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="passTrSubmitBtn" onclick="window._passTranslateCheck()">OK</button>
    </div>`;
  document.getElementById('passTrFeedback').innerHTML = '';
  document.getElementById('passTrNextBtn').style.display = 'none';
  trWaiting = false;
  setTimeout(() => document.getElementById('passTrInput').focus(), 50);
  document.getElementById('passTrInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (trWaiting) passTranslateNext(); else passTranslateCheck(); }
  };
}

export function passTranslateCheck() {
  if (trWaiting) return;
  const inp = document.getElementById('passTrInput');
  trTotal++;
  const fb = document.getElementById('passTrFeedback');
  if (checkAnswer(inp.value, trCorrect)) {
    trHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', trCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', trCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('passTrSubmitBtn').disabled = true;
  document.getElementById('passTrAcertos').textContent = trHits;
  document.getElementById('passTrTotal').textContent = trTotal;
  document.getElementById('passTrPct').textContent = trTotal ? Math.round(trHits / trTotal * 100) + '%' : '';
  document.getElementById('passTrNextBtn').style.display = 'inline-block';
  trWaiting = true;
  document.getElementById('passTrNextBtn').focus();
}

export function passTranslateNext() {
  trIdx++;
  passTranslateShow();
}
