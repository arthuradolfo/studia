// ═══════════════════════════════════════════════════════════════════════
// PRONOUN QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ALL_PRONOUNS } from '../data/pronouns.js';
import { checkAnswer, formKey, adjFormKey, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL = { m: 'Masculinum', f: 'Femininum', n: 'Neutrum' };
let qWords, qIdx, qTotal, qHits, qStreak, qBestStreak, qCorrect, qWaiting, qMax;

export function isPronQWaiting() { return qWaiting; }
export function pronStepQuiz(d) {
  const el = document.getElementById('pronQuizNum');
  el.value = Math.max(1, Math.min(200, (parseInt(el.value) || 10) + d));
}

function pickValidForm(forms, hasGender) {
  for (let i = 0; i < 50; i++) {
    const caso = pick(CASES), num = pick(NUMBERS);
    if (hasGender) {
      const gender = pick(GENDERS);
      const form = forms[adjFormKey(gender, caso, num)];
      if (form && form !== '—') return { caso, num, gender, form };
    } else {
      const form = forms[formKey(caso, num)];
      if (form && form !== '—') return { caso, num, gender: null, form };
    }
  }
  return null;
}

export function startPronQuiz() {
  qMax = parseInt(document.getElementById('pronQuizNum').value) || 10;
  qWords = shuffle([...ALL_PRONOUNS]);
  qIdx = 0; qHits = 0; qStreak = 0; qBestStreak = 0; qTotal = qMax; qWaiting = false;
  document.getElementById('pronQCur').textContent = '1';
  document.getElementById('pronQTotal').textContent = qMax;
  document.getElementById('pronQAcertos').textContent = '0';
  document.getElementById('pronQStreak').textContent = '0';
  document.getElementById('pronQFeedback').innerHTML = '';
  document.getElementById('pronQNextBtn').style.display = 'none';
  showScreen('pron-quiz');
  pronQuizShow();
}

export function pronQuizShow() {
  if (qIdx >= qWords.length) qIdx = 0;
  const [tp, sub, nm, nf, nn, gen, forms, hasGender] = qWords[qIdx];
  const meaning = getMeaning(nm) || '';

  const picked = pickValidForm(forms, hasGender);
  if (!picked) { qIdx++; pronQuizShow(); return; }
  qCorrect = picked.form;

  document.getElementById('pronQCur').textContent = qIdx + 1;
  const header = hasGender ? `${nm}, ${nf}, ${nn} (gen. ${gen})` : `${nm} (gen. ${gen})`;
  let caseInfo = `${t('prompt.caso')} ${picked.caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${picked.num}`;
  if (picked.gender) caseInfo = `${t('prompt.gender')} <strong>${GL[picked.gender]}</strong> &nbsp;|&nbsp; ` + caseInfo;

  const el = document.getElementById('pronQPrompt');
  el.innerHTML = `
    <div class="word-info">${header} — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.type.' + tp)} — ${sub}</div>
    <div class="case-info" style="margin-top:8px;">${caseInfo}</div>
    <div class="answer-row">
      <input class="answer-input" id="pronQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="pronQSubmitBtn" onclick="window._pronQuizCheck()">OK</button>
    </div>`;
  document.getElementById('pronQFeedback').innerHTML = '';
  document.getElementById('pronQNextBtn').style.display = 'none';
  qWaiting = false;
  setTimeout(() => document.getElementById('pronQInput').focus(), 50);
  document.getElementById('pronQInput').onkeydown = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (qWaiting) pronQuizNext(); else pronQuizCheck(); }
  };
}

export function pronQuizCheck() {
  if (qWaiting) return;
  const inp = document.getElementById('pronQInput');
  const fb = document.getElementById('pronQFeedback');
  if (checkAnswer(inp.value, qCorrect)) {
    qHits++; qStreak++;
    if (qStreak > qBestStreak) qBestStreak = qStreak;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct.streak', qCorrect, qStreak)}</div>`;
  } else {
    qStreak = 0;
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong.quiz', qCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('pronQSubmitBtn').disabled = true;
  document.getElementById('pronQAcertos').textContent = qHits;
  document.getElementById('pronQStreak').textContent = qStreak;
  if (qIdx + 1 >= qTotal) {
    document.getElementById('pronQNextBtn').style.display = 'inline-block';
    document.getElementById('pronQNextBtn').textContent = t('quiz.results.title');
    document.getElementById('pronQNextBtn').onclick = pronQuizEnd;
  } else {
    document.getElementById('pronQNextBtn').style.display = 'inline-block';
    document.getElementById('pronQNextBtn').textContent = t('quiz.next');
    document.getElementById('pronQNextBtn').onclick = pronQuizNext;
  }
  qWaiting = true;
  document.getElementById('pronQNextBtn').focus();
}

export function pronQuizNext() {
  qIdx++;
  pronQuizShow();
}

export function pronQuizEnd() {
  const pct = Math.round(qHits / qTotal * 100);
  let msg = '';
  if (pct === 100) msg = t('quiz.results.perfect');
  else if (pct >= 80) msg = t('quiz.results.great');
  else if (pct >= 50) msg = t('quiz.results.good');
  else msg = t('quiz.results.study');
  document.getElementById('pronQResults').innerHTML = `
    <div class="score">${qHits}/${qTotal}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBestStreak}</div>
    <div class="msg">${msg}</div>`;
  showScreen('pron-quiz-results');
}

export function decPronQCur() { qIdx = Math.max(0, qIdx - 1); }
