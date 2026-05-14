// ═══════════════════════════════════════════════════════════════════════
// PRONOUN SENTENCES MODE — Relative pronoun sentence exercises
// ═══════════════════════════════════════════════════════════════════════

import { PRON_SENTENCES, PRON_CASES, PRON_FUNCTIONS } from '../data/pron-sentences.js';
import { checkAnswer, shuffle } from '../helpers.js';
import { t } from '../i18n.js';
import { showScreen } from '../app.js';

const GENDERS_LABELS = { m: 'Masculinum', f: 'Femininum', n: 'Neutrum' };

let stList, stIdx, stTotal, stHits, stWaiting, stCurrent;

export function isPronStWaiting() { return stWaiting; }

export function startPronSentences() {
  stList = shuffle([...PRON_SENTENCES]);
  stIdx = 0; stTotal = 0; stHits = 0; stWaiting = false;
  document.getElementById('pronStAcertos').textContent = '0';
  document.getElementById('pronStTotal').textContent = '0';
  document.getElementById('pronStPct').textContent = '';
  document.getElementById('pronStFeedback').innerHTML = '';
  document.getElementById('pronStNextBtn').style.display = 'none';
  showScreen('pron-sententia');
  pronSentenceShow();
}

export function pronSentenceShow() {
  if (stIdx >= stList.length) stIdx = 0;
  stCurrent = stList[stIdx];

  const el = document.getElementById('pronStPrompt');

  if (stCurrent.type === 'fill') {
    const display = stCurrent.latin.replace('___', '<span style="border-bottom:2px solid var(--gold);padding:0 12px;">?</span>');
    el.innerHTML = `
      <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.sentences.fill.prompt')}</div>
      <div style="font-size:1.2rem;margin:12px 0;line-height:1.6;">${display}</div>
      <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.sentences.antecedent')}: <strong>${stCurrent.antecedent}</strong> (${GENDERS_LABELS[stCurrent.gender]}, ${stCurrent.number})</div>
      <div class="answer-row" style="margin-top:12px;">
        <input class="answer-input" id="pronStInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
        <button class="submit-btn" id="pronStSubmitBtn" onclick="window._pronSentenceCheck()">OK</button>
      </div>`;
  } else {
    el.innerHTML = `
      <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.sentences.analyze.prompt')}</div>
      <div style="font-size:1.2rem;margin:12px 0;line-height:1.6;">${stCurrent.latin}</div>
      <div style="color:var(--text-dim);font-size:0.85rem;">${t('pron.sentences.pronoun')}: <strong>${stCurrent.pronoun}</strong> &nbsp;|&nbsp; ${t('pron.sentences.antecedent')}: <strong>${stCurrent.antecedent}</strong></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;align-items:flex-end;">
        <div style="flex:1;min-width:130px;">
          <label style="font-size:0.8rem;color:var(--text-dim);">${t('pron.sentences.case')}</label>
          <select class="answer-input" id="pronStCaseInput" style="width:100%;">
            ${PRON_CASES.map(c => `<option value="${c}">${c}</option>`).join('')}
          </select>
        </div>
        <div style="flex:1;min-width:100px;">
          <label style="font-size:0.8rem;color:var(--text-dim);">${t('pron.sentences.function')}</label>
          <select class="answer-input" id="pronStFuncInput" style="width:100%;">
            ${PRON_FUNCTIONS.map(f => `<option value="${f}">${f}</option>`).join('')}
          </select>
        </div>
        <button class="submit-btn" id="pronStSubmitBtn" onclick="window._pronSentenceCheck()">OK</button>
      </div>`;
  }

  document.getElementById('pronStFeedback').innerHTML = '';
  document.getElementById('pronStNextBtn').style.display = 'none';
  stWaiting = false;

  setTimeout(() => {
    const inp = document.getElementById('pronStInput') || document.getElementById('pronStCaseInput');
    if (inp) inp.focus();
  }, 50);

  const inp = document.getElementById('pronStInput');
  if (inp) {
    inp.onkeydown = function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (stWaiting) pronSentenceNext(); else pronSentenceCheck(); }
    };
  }
}

export function pronSentenceCheck() {
  if (stWaiting) return;
  stTotal++;
  const fb = document.getElementById('pronStFeedback');
  let correct = false;

  if (stCurrent.type === 'fill') {
    const inp = document.getElementById('pronStInput');
    correct = checkAnswer(inp.value, stCurrent.answer);
    inp.disabled = true;
  } else {
    const caseVal = document.getElementById('pronStCaseInput').value;
    const funcVal = document.getElementById('pronStFuncInput').value;
    correct = caseVal === stCurrent.case && funcVal === stCurrent.function;
    document.getElementById('pronStCaseInput').disabled = true;
    document.getElementById('pronStFuncInput').disabled = true;
  }

  document.getElementById('pronStSubmitBtn').disabled = true;

  const explanation = `
    <div style="margin-top:8px;font-size:0.85rem;color:var(--text-dim);line-height:1.5;">
      <div><strong>${t('pron.sentences.main')}:</strong> ${stCurrent.mainClause}</div>
      <div><strong>${t('pron.sentences.sub')}:</strong> ${stCurrent.subClause}</div>
      <div style="margin-top:4px;">${t('pron.sentences.answer')}: <strong>${stCurrent.answer}</strong> — ${GENDERS_LABELS[stCurrent.gender]} ${stCurrent.number}, ${stCurrent.case} (${stCurrent.function})</div>
      <div style="font-style:italic;margin-top:4px;">${stCurrent.translation}</div>
    </div>`;

  if (correct) {
    stHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', stCurrent.answer)}</div>${explanation}`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', stCurrent.answer)}</div>${explanation}`;
  }

  document.getElementById('pronStAcertos').textContent = stHits;
  document.getElementById('pronStTotal').textContent = stTotal;
  document.getElementById('pronStPct').textContent = stTotal ? Math.round(stHits / stTotal * 100) + '%' : '';
  document.getElementById('pronStNextBtn').style.display = 'inline-block';
  stWaiting = true;
  document.getElementById('pronStNextBtn').focus();
}

export function pronSentenceNext() {
  stIdx++;
  pronSentenceShow();
}
