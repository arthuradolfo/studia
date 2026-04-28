// ═══════════════════════════════════════════════════════════════════════
// PASSIVE CHALLENGE MODE — Full 6-form grid for one passive tense
// ═══════════════════════════════════════════════════════════════════════

import { PASSIVE_VERBS, PASSIVE_TENSES } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let desafioVerb, desafioTense, desafioForms;

export function getDesafioPass() { return desafioVerb; }

export function startPassDesafio() {
  desafioVerb = pick(PASSIVE_VERBS);
  desafioTense = pick(PASSIVE_TENSES);
  const [conj, type, nom, inf, perf, sup, forms] = desafioVerb;
  desafioForms = forms;
  const meaning = getMeaning(nom) || '';
  const tenseLabel = t('pass.tense.' + desafioTense);

  document.getElementById('passDesafioWord').innerHTML = `
    <div class="word-info" style="font-size:1.1rem;"><strong>${nom}, ${inf}${perf !== '—' ? ', ' + perf : ''}${sup !== '—' ? ', ' + sup : ''}</strong> — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${conj} ${t('verb.conjugation')}</div>
    <div style="color:var(--gold);font-size:1rem;margin-top:8px;">${t('pass.challenge.tense')}: <strong>${tenseLabel}</strong></div>`;

  const hintEl = document.getElementById('passDesafioHint');
  if (hintEl) hintEl.textContent = t('pass.challenge.hint');

  const grid = document.getElementById('passDesafioGrid');
  grid.innerHTML = '';
  grid.className = 'challenge-grid';

  VERB_NUMBERS.forEach(num => {
    const col = document.createElement('div');
    col.className = 'challenge-col';
    col.innerHTML = `<h3>${num}</h3>`;
    VERB_PERSONS.forEach(p => {
      const row = document.createElement('div');
      row.className = 'challenge-row';
      const id = `passDes_${p}_${num}`;
      row.innerHTML = `<label>${p}ª</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      col.appendChild(row);
    });
    grid.appendChild(col);
  });

  document.getElementById('passDesafioResults').innerHTML = '';
  const btn = document.getElementById('passDesafioSubmit');
  btn.style.display = 'inline-block';
  btn.textContent = t('challenge.submit');
  btn.onclick = checkPassDesafio;
  showScreen('pass-desafio');

  const inputs = grid.querySelectorAll('input');
  inputs.forEach((inp, i) => {
    inp.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else checkPassDesafio();
      }
    };
  });
  setTimeout(() => { if (inputs[0]) inputs[0].focus(); }, 50);
}

export function checkPassDesafio() {
  let hits = 0, total = 0, errors = [];

  VERB_NUMBERS.forEach(num => {
    VERB_PERSONS.forEach(p => {
      const id = `passDes_${p}_${num}`;
      const inp = document.getElementById(id);
      const correct = desafioForms[verbFormKey(desafioTense, p, num)];
      if (!correct || correct === '—') return;
      total++;
      if (checkAnswer(inp.value, correct)) {
        hits++;
        inp.classList.add('correct-field');
        inp.classList.remove('wrong-field');
      } else {
        inp.classList.add('wrong-field');
        inp.classList.remove('correct-field');
        errors.push({ person: p + 'ª', num, given: inp.value || t('feedback.empty'), correct });
      }
      inp.disabled = true;
    });
  });

  const pct = Math.round(hits / total * 100);
  let msg = '';
  if (pct === 100) msg = t('challenge.perfect');
  else if (pct >= 80) msg = t('challenge.almost');

  const res = document.getElementById('passDesafioResults');
  let html = `<div class="results-box"><div class="score">${hits}/${total}</div><div class="pct">${pct}%</div>
    ${msg ? `<div class="msg">${msg}</div>` : ''}`;
  if (errors.length) {
    html += `<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e => {
      html += `<div class="err-row">${e.person} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  res.innerHTML = html;
  const btn = document.getElementById('passDesafioSubmit');
  btn.textContent = t('challenge.new');
  btn.onclick = startPassDesafio;
}
