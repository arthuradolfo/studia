// ═══════════════════════════════════════════════════════════════════════
// APP — Navigation, language toggle, theme/zoom, init
// ═══════════════════════════════════════════════════════════════════════

import { t, getLang, setLang, applyTranslations } from './i18n.js';
import './translations/pt.js';
import './translations/en.js';
import { WORDS, EXTRA_WORDS, ALL_WORDS } from './data/words.js';
import { ADJ_PARADIGMS, ADJ_EXTRA, ALL_ADJECTIVES } from './data/adjectives.js';
import { PREPOSITIONS } from './data/prepositions.js';
import { wordMeaning } from './helpers.js';
import { initEstudo } from './modes/study.js';
import { startPratica, praticaShow, praticaCheck, praticaNext, isPrWaiting } from './modes/practice.js';
import { stepQuiz, startQuiz, quizShow, quizCheck, quizNext, quizEnd, isQWaiting, decQCur } from './modes/quiz.js';
import { startDesafio, checkDesafio, getDesafioWord } from './modes/challenge.js';
// Adjective modes
import { initAdjEstudo } from './modes/adj-study.js';
import { startAdjPratica, adjPraticaShow, adjPraticaCheck, adjPraticaNext, isAdjPrWaiting } from './modes/adj-practice.js';
import { adjStepQuiz, startAdjQuiz, adjQuizShow, adjQuizCheck, adjQuizNext, adjQuizEnd, isAdjQWaiting, decAdjQCur } from './modes/adj-quiz.js';
import { startAdjDesafio, checkAdjDesafio, getDesafioAdj } from './modes/adj-challenge.js';
import { startConcordance, concShow, concCheck, concNext, isConcWaiting } from './modes/adj-concordance.js';
// Preposition modes
import { initPrepEstudo } from './modes/prep-study.js';
import { startPrepPratica, prepPraticaShow, prepPraticaCheck, prepPraticaNext, isPrepPrWaiting } from './modes/prep-practice.js';
import { prepStepQuiz, startPrepQuiz, prepQuizShow, prepQuizCheck, prepQuizNext, prepQuizEnd, isPrepQWaiting } from './modes/prep-quiz.js';

// ─── Navigation ───
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(
    s => s.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
  // Init screens that need rendering on entry
  if(id==='adj-estudo') initAdjEstudo();
  if(id==='prep-estudo') initPrepEstudo();
}

// ─── Language toggle ───
function refreshActiveScreen() {
  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;
  const id = activeScreen.id;

  // Always rebuild estudo selectors
  initEstudo();

  if (id === 'pratica') {
    if (!isPrWaiting()) praticaShow();
    else document.getElementById('prNextBtn').textContent = t('practice.next');
  } else if (id === 'quiz') {
    if (!isQWaiting()) { decQCur(); quizShow(); }
    else document.getElementById('qNextBtn').textContent = t('quiz.next');
  } else if (id === 'quiz-results') {
    quizEnd();
  } else if (id === 'desafio') {
    const desafioWord = getDesafioWord();
    if (desafioWord) {
      const [dec, sub, nom, gen, gender, forms] = desafioWord;
      const meaning = wordMeaning(desafioWord);
      document.getElementById('desafioWord').innerHTML = `
        <div class="word-info" style="font-size:1.1rem;">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
        <div style="color:var(--text-dim);font-size:0.9rem;">${t('study.card.title', dec, sub)}</div>`;
      const btn = document.getElementById('desafioSubmit');
      if (btn) {
        const resultsShown = document.getElementById('desafioResults').innerHTML !== '';
        btn.textContent = resultsShown ? t('challenge.new') : t('challenge.submit');
      }
    }
  } else if (id === 'adj-estudo') {
    initAdjEstudo();
  } else if (id === 'adj-pratica') {
    if (!isAdjPrWaiting()) adjPraticaShow();
  } else if (id === 'adj-quiz') {
    if (!isAdjQWaiting()) { decAdjQCur(); adjQuizShow(); }
  } else if (id === 'adj-quiz-results') {
    adjQuizEnd();
  } else if (id === 'adj-concordance') {
    if (!isConcWaiting()) concShow();
  } else if (id === 'prep-estudo') {
    initPrepEstudo();
  } else if (id === 'prep-pratica') {
    if (!isPrepPrWaiting()) prepPraticaShow();
  } else if (id === 'prep-quiz') {
    if (!isPrepQWaiting()) prepQuizShow();
  } else if (id === 'prep-quiz-results') {
    prepQuizEnd();
  }
}

function toggleLang() {
  const current = getLang();
  const next = current === 'pt' ? 'en' : 'pt';
  setLang(next);
  applyTranslations();
  updateLangBtn();
  updateThemeBtn();
  updateWordCounts();
  refreshActiveScreen();
}

function updateLangBtn() {
  const btn = document.getElementById('langBtn');
  if (btn) btn.textContent = t('lang.toggle');
}

// ─── Zoom ───
let zoomLevel = parseInt(localStorage.getItem('latin-zoom')) || 100;
document.documentElement.style.fontSize = zoomLevel + '%';
function zoom(dir) {
  zoomLevel = Math.min(150, Math.max(60, zoomLevel + dir * 10));
  document.documentElement.style.fontSize = zoomLevel + '%';
  localStorage.setItem('latin-zoom', zoomLevel);
}

// ─── Theme ───
let lightTheme = localStorage.getItem('latin-theme') === 'light';
if (lightTheme) document.documentElement.classList.add('light');
function toggleTheme() {
  lightTheme = !lightTheme;
  document.documentElement.classList.toggle('light', lightTheme);
  localStorage.setItem('latin-theme', lightTheme ? 'light' : 'dark');
  updateThemeBtn();
}
function updateThemeBtn() {
  const btn = document.getElementById('themeBtn');
  btn.textContent = lightTheme ? '☾' : '☀';
  btn.title = lightTheme ? t('theme.light') : t('theme.dark');
}

// ─── Word counts ───
function updateWordCounts() {
  const wc = document.getElementById('wordCount');
  if (wc) wc.textContent = t('menu.wordcount', ALL_WORDS.length, WORDS.length, EXTRA_WORDS.length);
  const awc = document.getElementById('adjWordCount');
  if (awc) awc.textContent = t('adj.wordcount', ALL_ADJECTIVES.length, ADJ_PARADIGMS.length, ADJ_EXTRA.length);
  const pwc = document.getElementById('prepWordCount');
  if (pwc) pwc.textContent = t('prep.wordcount', PREPOSITIONS.length);
}

// ─── Expose functions to HTML onclick handlers ───
window.showScreen = showScreen;
window.toggleTheme = toggleTheme;
window.toggleLang = toggleLang;
window.zoom = zoom;
// Nomina
window.startPratica = startPratica;
window.startQuiz = startQuiz;
window.stepQuiz = stepQuiz;
window.startDesafio = startDesafio;
window.checkDesafio = checkDesafio;
window._praticaCheck = praticaCheck;
window._praticaNext = praticaNext;
window._quizCheck = quizCheck;
window._quizNext = quizNext;
// Adjectiva
window.startAdjPratica = startAdjPratica;
window._adjPraticaCheck = adjPraticaCheck;
window._adjPraticaNext = adjPraticaNext;
window.adjStepQuiz = adjStepQuiz;
window.startAdjQuiz = startAdjQuiz;
window._adjQuizCheck = adjQuizCheck;
window._adjQuizNext = adjQuizNext;
window.startAdjDesafio = startAdjDesafio;
window.checkAdjDesafio = checkAdjDesafio;
window.startConcordance = startConcordance;
window._concCheck = concCheck;
window._concNext = concNext;
// Praepositiones
window.startPrepPratica = startPrepPratica;
window._prepPraticaCheck = prepPraticaCheck;
window._prepPraticaNext = prepPraticaNext;
window.prepStepQuiz = prepStepQuiz;
window.startPrepQuiz = startPrepQuiz;
window._prepQuizCheck = prepQuizCheck;
window._prepQuizNext = prepQuizNext;

// ─── Init ───
updateThemeBtn();
applyTranslations();
updateLangBtn();
updateWordCounts();
initEstudo();
