// ═══════════════════════════════════════════════════════════════════════
// PASSIVE PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { ALL_PASSIVE_VERBS, PASSIVE_TENSES } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let prList, prIdx, prCorrect, prTotal, prHits, prWaiting;

export function isPassPrWaiting() { return prWaiting; }

export function startPassPratica() {
  prList = shuffle([...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS]);
  prIdx = 0; prTotal = 0; prHits = 0; prWaiting = false;
  document.getElementById('passPrAcertos').textContent = '0';
  document.getElementById('passPrTotal').textContent = '0';
  document.getElementById('passPrPct').textContent = '';
  document.getElementById('passPrFeedback').innerHTML = '';
  document.getElementById('passPrNextBtn').style.display = 'none';
  showScreen('pass-pratica');
  passPraticaShow();
}

export function passPraticaShow() {
  if (prIdx >= prList.length) prIdx = 0;
  const verb = prList[prIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';

  const tense = pick(PASSIVE_TENSES);
  const person = pick(VERB_PERSONS);
  const number = pick(VERB_NUMBERS);
  const key = verbFormKey(tense, person, number);
  prCorrect = forms[key];

  if (!prCorrect || prCorrect === '—') {
    prIdx++;
    passPraticaShow();
    return;
  }

  const tenseLabel = t('pass.tense.' + tense);
  const el = document.getElementById('passPrPrompt');
  el.innerHTML = `
    <div class="word-info">${nom} (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${conj} ${t('verb.conjugation')}</div>
    <div class="case-info" style="margin-top:8px;">${t('verb.conjugate')}: ${tenseLabel}, ${person}ª ${t('verb.persona')}, ${number}</div>
    <div class="answer-row">
      <input class="answer-input" id="passPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="passPrSubmitBtn" onclick="window._passPraticaCheck()">OK</button>
    </div>`;
  document.getElementById('passPrFeedback').innerHTML = '';
  document.getElementById('passPrNextBtn').style.display = 'none';
  prWaiting = false;
  setTimeout(() => document.getElementById('passPrInput').focus(), 50);
  document.getElementById('passPrInput').onkeydown = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (prWaiting) passPraticaNext(); else passPraticaCheck(); }
  };
}

export function passPraticaCheck() {
  if (prWaiting) return;
  const inp = document.getElementById('passPrInput');
  prTotal++;
  const fb = document.getElementById('passPrFeedback');
  if (checkAnswer(inp.value, prCorrect)) {
    prHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', prCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', prCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('passPrSubmitBtn').disabled = true;
  document.getElementById('passPrAcertos').textContent = prHits;
  document.getElementById('passPrTotal').textContent = prTotal;
  document.getElementById('passPrPct').textContent = prTotal ? Math.round(prHits / prTotal * 100) + '%' : '';
  document.getElementById('passPrNextBtn').style.display = 'inline-block';
  prWaiting = true;
  document.getElementById('passPrNextBtn').focus();
}

export function passPraticaNext() {
  prIdx++;
  passPraticaShow();
}
