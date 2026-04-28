// ═══════════════════════════════════════════════════════════════════════
// PASSIVE SYNOPSIS MODE — All 10 passive tenses for 1 person/number
// ═══════════════════════════════════════════════════════════════════════

import { PASSIVE_VERBS, PASSIVE_TENSES, PASSIVE_TENSES_INF } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let synVerb, synPerson, synNumber, synForms;

export function startPassSynopsis() {
  synVerb = pick(PASSIVE_VERBS);
  synPerson = pick(VERB_PERSONS);
  synNumber = pick(VERB_NUMBERS);
  const [conj, type, nom, inf, perf, sup, forms] = synVerb;
  synForms = forms;
  const meaning = getMeaning(nom) || '';

  document.getElementById('passSynopsisWord').innerHTML = `
    <div class="word-info" style="font-size:1.1rem;"><strong>${nom}, ${inf}${perf !== '—' ? ', ' + perf : ''}${sup !== '—' ? ', ' + sup : ''}</strong> — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${conj} ${t('verb.conjugation')}</div>
    <div style="color:var(--gold);font-size:1rem;margin-top:8px;">${t('pass.synopsis.prompt')}: <strong>${synPerson}ª ${t('verb.persona')}, ${synNumber}</strong></div>`;

  const grid = document.getElementById('passSynopsisGrid');
  grid.innerHTML = '';

  const infCol = document.createElement('div');
  infCol.className = 'challenge-col';
  infCol.innerHTML = `<h3>${t('pass.tense.group.infectum')}</h3>`;

  const perfCol = document.createElement('div');
  perfCol.className = 'challenge-col';
  perfCol.innerHTML = `<h3>${t('pass.tense.group.perfectum')}</h3>`;

  PASSIVE_TENSES.forEach((tense, i) => {
    const tenseLabel = t('pass.tense.' + tense);
    const row = document.createElement('div');
    row.className = 'challenge-row';
    const id = `pvsyn_${tense}`;
    row.innerHTML = `<label style="font-size:0.85rem;">${tenseLabel}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
    if (i < PASSIVE_TENSES_INF.length) infCol.appendChild(row);
    else perfCol.appendChild(row);
  });

  grid.appendChild(infCol);
  grid.appendChild(perfCol);

  document.getElementById('passSynopsisResults').innerHTML = '';
  document.getElementById('passSynopsisSubmit').style.display = 'inline-block';
  document.getElementById('passSynopsisSubmit').textContent = t('challenge.submit');
  document.getElementById('passSynopsisSubmit').onclick = checkPassSynopsis;
  showScreen('pass-synopsis');

  setTimeout(() => {
    const first = document.getElementById(`pvsyn_${PASSIVE_TENSES[0]}`);
    if (first) first.focus();
  }, 50);

  const inputs = grid.querySelectorAll('input');
  inputs.forEach((inp, i) => {
    inp.onkeydown = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else checkPassSynopsis();
      }
    };
  });
}

export function checkPassSynopsis() {
  let hits = 0, total = 0, errors = [];
  PASSIVE_TENSES.forEach(tense => {
    const id = `pvsyn_${tense}`;
    const inp = document.getElementById(id);
    const correct = synForms[verbFormKey(tense, synPerson, synNumber)];
    if (!correct || correct === '—') return;
    total++;
    if (checkAnswer(inp.value, correct)) {
      hits++;
      inp.classList.add('correct-field');
      inp.classList.remove('wrong-field');
    } else {
      inp.classList.add('wrong-field');
      inp.classList.remove('correct-field');
      const tenseLabel = t('pass.tense.' + tense);
      errors.push({ tense: tenseLabel, given: inp.value || t('feedback.empty'), correct });
    }
    inp.disabled = true;
  });

  const pct = Math.round(hits / total * 100);
  let msg = '';
  if (pct === 100) msg = t('challenge.perfect');
  else if (pct >= 80) msg = t('challenge.almost');

  const res = document.getElementById('passSynopsisResults');
  let html = `<div class="results-box">
    <div class="score">${hits}/${total}</div>
    <div class="pct">${pct}%</div>
    ${msg ? `<div class="msg">${msg}</div>` : ''}`;
  if (errors.length) {
    html += `<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e => {
      html += `<div class="err-row">${e.tense}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html += '</div>';
  }
  html += '</div>';
  res.innerHTML = html;

  const btn = document.getElementById('passSynopsisSubmit');
  btn.textContent = t('challenge.new');
  btn.onclick = startPassSynopsis;
}
