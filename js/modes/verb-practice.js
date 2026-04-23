// ═══════════════════════════════════════════════════════════════════════
// VERB PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { ALL_VERBS, VERB_TENSES, VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let prList, prIdx, prTotal, prHits, prWaiting, prCorrect;

export function isVerbPrWaiting() { return prWaiting; }

export function startVerbPratica() {
  prList = shuffle([...ALL_VERBS, ...ALL_VERBS, ...ALL_VERBS]);
  prIdx = 0; prTotal = 0; prHits = 0; prWaiting = false;
  document.getElementById('verbPrAcertos').textContent = '0';
  document.getElementById('verbPrTotal').textContent = '0';
  document.getElementById('verbPrPct').textContent = '';
  document.getElementById('verbPrFeedback').innerHTML = '';
  document.getElementById('verbPrNextBtn').style.display = 'none';
  showScreen('verb-pratica');
  verbPraticaShow();
}

export function verbPraticaShow() {
  if (prIdx >= prList.length) prIdx = 0;
  const verb = prList[prIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';
  const tense = pick(VERB_TENSES);
  const person = pick(VERB_PERSONS);
  const number = pick(VERB_NUMBERS);
  const key = verbFormKey(tense, person, number);
  prCorrect = forms[key];

  if (!prCorrect || prCorrect === '—') {
    prIdx++;
    verbPraticaShow();
    return;
  }

  const tenseLabel = t('verb.tense.' + tense);
  const el = document.getElementById('verbPrPrompt');
  el.innerHTML = `
    <div class="word-info" style="font-size:1.2rem;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${conj} ${t('verb.conjugation')}</div>
    <div class="case-info" style="margin-top:8px;">${t('verb.conjugate')}: <strong>${tenseLabel}</strong>, ${person}ª ${t('verb.persona')}, ${number}</div>
    <div class="answer-row">
      <input class="answer-input" id="verbPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="verbPrSubmitBtn" onclick="window._verbPraticaCheck()">OK</button>
    </div>`;
  document.getElementById('verbPrFeedback').innerHTML = '';
  document.getElementById('verbPrNextBtn').style.display = 'none';
  prWaiting = false;
  setTimeout(() => document.getElementById('verbPrInput').focus(), 50);
  document.getElementById('verbPrInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (prWaiting) verbPraticaNext(); else verbPraticaCheck(); }
  };
}

export function verbPraticaCheck() {
  if (prWaiting) return;
  const inp = document.getElementById('verbPrInput');
  prTotal++;
  const fb = document.getElementById('verbPrFeedback');
  if (checkAnswer(inp.value, prCorrect)) {
    prHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', prCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', prCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('verbPrSubmitBtn').disabled = true;
  document.getElementById('verbPrAcertos').textContent = prHits;
  document.getElementById('verbPrTotal').textContent = prTotal;
  document.getElementById('verbPrPct').textContent = prTotal ? Math.round(prHits / prTotal * 100) + '%' : '';
  document.getElementById('verbPrNextBtn').style.display = 'inline-block';
  prWaiting = true;
  document.getElementById('verbPrNextBtn').focus();
}

export function verbPraticaNext() {
  prIdx++;
  verbPraticaShow();
}
