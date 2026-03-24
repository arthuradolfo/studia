// ═══════════════════════════════════════════════════════════════════════
// QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { ALL_WORDS } from '../data/words.js';
import { checkAnswer, formKey, pick, wordMeaning } from '../helpers.js';
import { t } from '../i18n.js';
import { showScreen } from '../app.js';

export function stepQuiz(d) {
  const inp = document.getElementById('quizNum');
  inp.value = Math.min(200, Math.max(1, (parseInt(inp.value) || 10) + d));
}

let qNum, qCur, qHits, qStreak, qBest, qCorrect, qWaiting;

export function isQWaiting() {
  return qWaiting;
}

export function decQCur() {
  qCur--;
}

export function startQuiz() {
  qNum = parseInt(document.getElementById('quizNum').value) || 10;
  if (qNum < 1) qNum = 1; if (qNum > 999) qNum = 999;
  qCur = 0; qHits = 0; qStreak = 0; qBest = 0; qWaiting = false;
  document.getElementById('qTotal').textContent = qNum;
  document.getElementById('qAcertos').textContent = '0';
  document.getElementById('qStreak').textContent = '0';
  document.getElementById('qFeedback').innerHTML = '';
  document.getElementById('qNextBtn').style.display = 'none';
  showScreen('quiz');
  quizShow();
}

export function quizShow() {
  qCur++;
  if (qCur > qNum) { quizEnd(); return; }
  document.getElementById('qCur').textContent = qCur;
  const w = pick(ALL_WORDS);
  const [dec, sub, nom, gen, gender, forms] = w;
  const meaning = wordMeaning(w);
  const caso = pick(CASES), num = pick(NUMBERS);
  qCorrect = forms[formKey(caso, num)];
  const el = document.getElementById('qPrompt');
  el.innerHTML = `
    <div class="word-info">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div class="case-info">${t('quiz.declinar', caso, num)}</div>
    <div class="answer-row">
      <input class="answer-input" id="qInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="qSubmitBtn" onclick="window._quizCheck()">OK</button>
    </div>`;
  document.getElementById('qFeedback').innerHTML = '';
  document.getElementById('qNextBtn').style.display = 'none';
  qWaiting = false;
  setTimeout(() => document.getElementById('qInput').focus(), 50);
  const inp = document.getElementById('qInput');
  inp.onkeydown = function(e) { if (e.key === 'Enter') { e.preventDefault(); if (qWaiting) quizNext(); else quizCheck(); } };
}

export function quizCheck() {
  if (qWaiting) return;
  const inp = document.getElementById('qInput');
  const answer = inp.value;
  const fb = document.getElementById('qFeedback');
  if (checkAnswer(answer, qCorrect)) {
    qHits++; qStreak++;
    if (qStreak > qBest) qBest = qStreak;
    if (qStreak >= 3) {
      fb.innerHTML = `<div class="feedback correct">${t('feedback.correct.streak', qCorrect, qStreak)}</div>`;
    } else {
      fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', qCorrect)}</div>`;
    }
  } else {
    qStreak = 0;
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong.quiz', qCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('qSubmitBtn').disabled = true;
  document.getElementById('qAcertos').textContent = qHits;
  document.getElementById('qStreak').textContent = qStreak;
  qWaiting = true;
  if (qCur < qNum) {
    document.getElementById('qNextBtn').style.display = 'inline-block';
    document.getElementById('qNextBtn').focus();
  } else {
    setTimeout(quizEnd, 800);
  }
}

export function quizNext() {
  quizShow();
}

export function quizEnd() {
  const pct = qNum > 0 ? Math.round(qHits / qNum * 100) : 0;
  let msg = '';
  if (pct === 100) msg = t('quiz.results.perfect');
  else if (pct >= 80) msg = t('quiz.results.great');
  else if (pct >= 60) msg = t('quiz.results.good');
  else msg = t('quiz.results.study');
  document.getElementById('qResults').innerHTML = `
    <div class="score">${qHits}/${qNum}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBest}</div>
    <div class="msg" style="margin-top:8px;">${msg}</div>`;
  showScreen('quiz-results');
}
