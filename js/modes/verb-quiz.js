// ═══════════════════════════════════════════════════════════════════════
// VERB QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { ALL_VERBS, VERB_TENSES, VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let qList, qIdx, qMax, qHits, qStreak, qBestStreak, qWaiting, qCorrect;

export function isVerbQWaiting() { return qWaiting; }
export function verbStepQuiz(d) {
  const el = document.getElementById('verbQuizNum');
  el.value = Math.max(1, Math.min(200, (parseInt(el.value) || 10) + d));
}

export function startVerbQuiz() {
  qMax = parseInt(document.getElementById('verbQuizNum').value) || 10;
  qList = shuffle([...ALL_VERBS, ...ALL_VERBS, ...ALL_VERBS, ...ALL_VERBS]);
  qIdx = 0; qHits = 0; qStreak = 0; qBestStreak = 0; qWaiting = false;
  document.getElementById('verbQCur').textContent = '1';
  document.getElementById('verbQTotal').textContent = qMax;
  document.getElementById('verbQAcertos').textContent = '0';
  document.getElementById('verbQStreak').textContent = '0';
  document.getElementById('verbQFeedback').innerHTML = '';
  document.getElementById('verbQNextBtn').style.display = 'none';
  showScreen('verb-quiz');
  verbQuizShow();
}

export function verbQuizShow() {
  if (qIdx >= qList.length) qIdx = 0;
  const verb = qList[qIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';
  const tense = pick(VERB_TENSES);
  const person = pick(VERB_PERSONS);
  const number = pick(VERB_NUMBERS);
  const key = verbFormKey(tense, person, number);
  qCorrect = forms[key];

  if (!qCorrect || qCorrect === '—') {
    qIdx++;
    verbQuizShow();
    return;
  }

  document.getElementById('verbQCur').textContent = qIdx + 1;
  const tenseLabel = t('verb.tense.' + tense);
  const el = document.getElementById('verbQPrompt');
  el.innerHTML = `
    <div class="word-info" style="font-size:1.2rem;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${conj} ${t('verb.conjugation')}</div>
    <div class="case-info" style="margin-top:8px;">${t('verb.conjugate')}: <strong>${tenseLabel}</strong>, ${person}ª ${t('verb.persona')}, ${number}</div>
    <div class="answer-row">
      <input class="answer-input" id="verbQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="verbQSubmitBtn" onclick="window._verbQuizCheck()">OK</button>
    </div>`;
  document.getElementById('verbQFeedback').innerHTML = '';
  document.getElementById('verbQNextBtn').style.display = 'none';
  qWaiting = false;
  setTimeout(() => document.getElementById('verbQInput').focus(), 50);
  document.getElementById('verbQInput').onkeydown = function(e) {
    if (e.key === 'Enter') { e.preventDefault(); if (qWaiting) verbQuizNext(); else verbQuizCheck(); }
  };
}

export function verbQuizCheck() {
  if (qWaiting) return;
  const inp = document.getElementById('verbQInput');
  const fb = document.getElementById('verbQFeedback');
  if (checkAnswer(inp.value, qCorrect)) {
    qHits++; qStreak++;
    if (qStreak > qBestStreak) qBestStreak = qStreak;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct.streak', qCorrect, qStreak)}</div>`;
  } else {
    qStreak = 0;
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong.quiz', qCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('verbQSubmitBtn').disabled = true;
  document.getElementById('verbQAcertos').textContent = qHits;
  document.getElementById('verbQStreak').textContent = qStreak;
  if (qIdx + 1 >= qMax) {
    document.getElementById('verbQNextBtn').style.display = 'inline-block';
    document.getElementById('verbQNextBtn').textContent = t('quiz.results.title');
    document.getElementById('verbQNextBtn').onclick = verbQuizEnd;
  } else {
    document.getElementById('verbQNextBtn').style.display = 'inline-block';
    document.getElementById('verbQNextBtn').textContent = t('quiz.next');
    document.getElementById('verbQNextBtn').onclick = verbQuizNext;
  }
  qWaiting = true;
  document.getElementById('verbQNextBtn').focus();
}

export function verbQuizNext() {
  qIdx++;
  verbQuizShow();
}

export function verbQuizEnd() {
  const pct = Math.round(qHits / qMax * 100);
  let msg = '';
  if (pct === 100) msg = t('quiz.results.perfect');
  else if (pct >= 80) msg = t('quiz.results.great');
  else if (pct >= 50) msg = t('quiz.results.good');
  else msg = t('quiz.results.study');
  document.getElementById('verbQResults').innerHTML = `
    <div class="score">${qHits}/${qMax}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBestStreak}</div>
    <div class="msg">${msg}</div>`;
  showScreen('verb-quiz-results');
}
