// ═══════════════════════════════════════════════════════════════════════
// APP — Navigation, language toggle, theme/zoom, init
// ═══════════════════════════════════════════════════════════════════════

import { t, getLang, setLang, applyTranslations } from './i18n.js';
import './translations/pt.js';
import './translations/en.js';
import { WORDS, EXTRA_WORDS, ALL_WORDS } from './data/words.js';
import { wordMeaning } from './helpers.js';
import { initEstudo } from './modes/study.js';
import { startPratica, praticaShow, praticaCheck, praticaNext, isPrWaiting } from './modes/practice.js';
import { stepQuiz, startQuiz, quizShow, quizCheck, quizNext, quizEnd, isQWaiting, decQCur } from './modes/quiz.js';
import { startDesafio, checkDesafio, getDesafioWord } from './modes/challenge.js';

// ─── Navigation ───
export function showScreen(id) {
  document.querySelectorAll('.screen').forEach(
    s => s.classList.remove('active')
  );
  document.getElementById(id).classList.add('active');
}

// ─── Language toggle ───
function refreshActiveScreen() {
  const activeScreen = document.querySelector('.screen.active');
  if (!activeScreen) return;
  const id = activeScreen.id;

  // Always rebuild estudo selector (translated button labels)
  initEstudo();

  if (id === 'pratica') {
    if (!isPrWaiting()) praticaShow();
    else {
      document.getElementById('prNextBtn').textContent = t('practice.next');
    }
  } else if (id === 'quiz') {
    if (!isQWaiting()) {
      decQCur();
      quizShow();
    } else {
      document.getElementById('qNextBtn').textContent = t('quiz.next');
    }
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
  }
}

function toggleLang() {
  const current = getLang();
  const next = current === 'pt' ? 'en' : 'pt';
  setLang(next);
  applyTranslations();
  updateLangBtn();
  updateThemeBtn();
  updateWordCount();
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

// ─── Word count ───
function updateWordCount() {
  document.getElementById('wordCount').textContent =
    t('menu.wordcount', ALL_WORDS.length, WORDS.length, EXTRA_WORDS.length);
}

// ─── Expose functions to HTML onclick handlers ───
window.showScreen = showScreen;
window.toggleTheme = toggleTheme;
window.toggleLang = toggleLang;
window.zoom = zoom;
window.startPratica = startPratica;
window.startQuiz = startQuiz;
window.stepQuiz = stepQuiz;
window.startDesafio = startDesafio;
window.checkDesafio = checkDesafio;
window._praticaCheck = praticaCheck;
window._praticaNext = praticaNext;
window._quizCheck = quizCheck;
window._quizNext = quizNext;

// ─── Init ───
updateThemeBtn();
applyTranslations();
updateLangBtn();
updateWordCount();
initEstudo();
