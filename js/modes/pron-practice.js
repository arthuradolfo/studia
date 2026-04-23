// ═══════════════════════════════════════════════════════════════════════
// PRONOUN PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ALL_PRONOUNS } from '../data/pronouns.js';
import { checkAnswer, formKey, adjFormKey, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL = { m: 'Masculinum', f: 'Femininum', n: 'Neutrum' };
let prWords, prIdx, prCorrect, prTotal, prHits, prWaiting;

export function isPronPrWaiting() { return prWaiting; }

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

export function startPronPratica() {
  prWords = shuffle([...ALL_PRONOUNS]);
  prIdx = 0; prTotal = 0; prHits = 0; prWaiting = false;
  document.getElementById('pronPrAcertos').textContent = '0';
  document.getElementById('pronPrTotal').textContent = '0';
  document.getElementById('pronPrPct').textContent = '';
  document.getElementById('pronPrFeedback').innerHTML = '';
  document.getElementById('pronPrNextBtn').style.display = 'none';
  showScreen('pron-pratica');
  pronPraticaShow();
}

export function pronPraticaShow() {
  if (prIdx >= prWords.length) prIdx = 0;
  const [tp, sub, nm, nf, nn, gen, forms, hasGender] = prWords[prIdx];
  const meaning = getMeaning(nm) || '';

  const picked = pickValidForm(forms, hasGender);
  if (!picked) { prIdx++; pronPraticaShow(); return; }
  prCorrect = picked.form;

  const header = hasGender ? `${nm}, ${nf}, ${nn} (gen. ${gen})` : `${nm} (gen. ${gen})`;
  const el = document.getElementById('pronPrPrompt');
  let caseInfo = `${t('prompt.caso')} ${picked.caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${picked.num}`;
  if (picked.gender) caseInfo = `${t('prompt.gender')} <strong>${GL[picked.gender]}</strong> &nbsp;|&nbsp; ` + caseInfo;

  el.innerHTML = `
    <div class="word-info">${header} — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.type.' + tp)} — ${sub}</div>
    <div class="case-info" style="margin-top:8px;">${caseInfo}</div>
    <div class="answer-row">
      <input class="answer-input" id="pronPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="pronPrSubmitBtn" onclick="window._pronPraticaCheck()">OK</button>
    </div>`;
  document.getElementById('pronPrFeedback').innerHTML = '';
  document.getElementById('pronPrNextBtn').style.display = 'none';
  prWaiting = false;
  setTimeout(() => document.getElementById('pronPrInput').focus(), 50);
  document.getElementById('pronPrInput').onkeydown = function (e) {
    if (e.key === 'Enter') { e.preventDefault(); if (prWaiting) pronPraticaNext(); else pronPraticaCheck(); }
  };
}

export function pronPraticaCheck() {
  if (prWaiting) return;
  const inp = document.getElementById('pronPrInput');
  prTotal++;
  const fb = document.getElementById('pronPrFeedback');
  if (checkAnswer(inp.value, prCorrect)) {
    prHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', prCorrect)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', prCorrect)}</div>`;
  }
  inp.disabled = true;
  document.getElementById('pronPrSubmitBtn').disabled = true;
  document.getElementById('pronPrAcertos').textContent = prHits;
  document.getElementById('pronPrTotal').textContent = prTotal;
  document.getElementById('pronPrPct').textContent = prTotal ? Math.round(prHits / prTotal * 100) + '%' : '';
  document.getElementById('pronPrNextBtn').style.display = 'inline-block';
  prWaiting = true;
  document.getElementById('pronPrNextBtn').focus();
}

export function pronPraticaNext() {
  prIdx++;
  pronPraticaShow();
}
