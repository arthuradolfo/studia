// ═══════════════════════════════════════════════════════════════════════
// PASSIVE QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { ALL_PASSIVE_VERBS, PASSIVE_TENSES } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let qList, qIdx, qTotal, qHits, qStreak, qBestStreak, qCorrect, qWaiting, qMax;

export function isPassQWaiting() { return qWaiting; }
export function passStepQuiz(d) {
  const el = document.getElementById('passQuizNum');
  el.value = Math.max(1, Math.min(200, (parseInt(el.value) || 10) + d));
}

export function startPassQuiz() {
  qMax = parseInt(document.getElementById('passQuizNum').value) || 10;
  qList = shuffle([...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS]);
  qIdx = 0; qHits = 0; qStreak = 0; qBestStreak = 0; qTotal = qMax; qWaiting = false;
  document.getElementById('passQCur').textContent = '1';
  document.getElementById('passQTotal').textContent = qMax;
  document.getElementById('passQAcertos').textContent = '0';
  document.getElementById('passQStreak').textContent = '0';
  document.getElementById('passQFeedback').innerHTML = '';
  document.getElementById('passQNextBtn').style.display = 'none';
  showScreen('pass-quiz');
  passQuizShow();
}

export function passQuizShow() {
  if (qIdx >= qList.length) qIdx = 0;
  const verb = qList[qIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';

  const tense = pick(PASSIVE_TENSES);
  const person = pick(VERB_PERSONS);
  const number = pick(VERB_NUMBERS);
  const key = verbFormKey(tense, person, number);
  qCorrect = forms[key];

  if (!qCorrect || qCorrect === '—') {
    qIdx++;
    passQuizShow();
    return;
  }

  document.getElementById('passQCur').textContent = qIdx + 1;
  const tenseLabel = t('pass.tense.' + tense);
  const el = document.getElementById('passQPrompt');
  el.innerHTML = `
    <div class="word-info">${nom} (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${conj} ${t('verb.conjugation')}</div>
    <div class="case-info" style="margin-top:8px;">${t('verb.conjugate')}: ${tenseLabel}, ${person}ª ${t('verb.persona')}, ${number}</div>
    <div class="answer-row">
      <input class="answer-input" id="passQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="passQSubmitBtn" onclick="window._passQuizCheck()">OK</button>
    </div>`;
  document.getElementById('passQFeedback').innerHTML = '';
  document.getElementById('passQNextBtn').style.display = 'none';
  qWaiting = false;
  setTimeout(() => document.getElementById('passQInput').focus(), 50);
  document.getElementById('passQInput').onkeydown = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (qWaiting) passQuizNext(); else passQuizCheck(); }
  };
}

export function passQuizCheck() {
  if (qWaiting) return;
  const inp = document.getElementById('passQInput');
  const fb = document.getElementById('passQFeedback');
  if (checkAnswer(inp.value, qCorrect)) {
    qHits++; qStreak++;
    if (qStreak > qBestStreak) qBestStreak = qStreak;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct.streak', qCorrect, qStreak)}</div>`;
  } else {
    qStreak = 0;
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong.quiz', qCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('passQSubmitBtn').disabled = true;
  document.getElementById('passQAcertos').textContent = qHits;
  document.getElementById('passQStreak').textContent = qStreak;
  if (qIdx + 1 >= qTotal) {
    document.getElementById('passQNextBtn').style.display = 'inline-block';
    document.getElementById('passQNextBtn').textContent = t('quiz.results.title');
    document.getElementById('passQNextBtn').onclick = passQuizEnd;
  } else {
    document.getElementById('passQNextBtn').style.display = 'inline-block';
    document.getElementById('passQNextBtn').textContent = t('quiz.next');
    document.getElementById('passQNextBtn').onclick = passQuizNext;
  }
  qWaiting = true;
  document.getElementById('passQNextBtn').focus();
}

export function passQuizNext() {
  qIdx++;
  passQuizShow();
}

export function passQuizEnd() {
  const pct = Math.round(qHits / qTotal * 100);
  let msg = '';
  if (pct === 100) msg = t('quiz.results.perfect');
  else if (pct >= 80) msg = t('quiz.results.great');
  else if (pct >= 50) msg = t('quiz.results.good');
  else msg = t('quiz.results.study');
  document.getElementById('passQResults').innerHTML = `
    <div class="score">${qHits}/${qTotal}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBestStreak}</div>
    <div class="msg">${msg}</div>`;
  showScreen('pass-quiz-results');
}

export function decPassQCur() { qIdx = Math.max(0, qIdx - 1); }
