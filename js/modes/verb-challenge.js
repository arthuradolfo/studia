// ═══════════════════════════════════════════════════════════════════════
// VERB CHALLENGE MODE — Conjugate all 6 person/number forms for a tense
// ═══════════════════════════════════════════════════════════════════════

import { VERBS, VERB_TENSES, VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { checkAnswer, pick } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let desafioVerb, desafioTense, desafioForms;

export function getDesafioVerb() { return desafioVerb; }

export function startVerbDesafio() {
  desafioVerb = pick(VERBS);
  desafioTense = pick(VERB_TENSES);
  const [conj, type, nom, inf, perf, sup, forms] = desafioVerb;
  desafioForms = forms;
  const meaning = getMeaning(nom) || '';
  const tenseLabel = t('verb.tense.' + desafioTense);

  document.getElementById('verbDesafioWord').innerHTML = `
    <div class="word-info" style="font-size:1.1rem;"><strong>${nom}, ${inf}${perf !== '—' ? ', ' + perf : ''}${sup !== '—' ? ', ' + sup : ''}</strong> — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${conj} ${t('verb.conjugation')}</div>
    <div style="color:var(--gold);font-size:1rem;margin-top:8px;">${t('verb.challenge.tense')}: <strong>${tenseLabel}</strong></div>`;

  const grid = document.getElementById('verbDesafioGrid');
  grid.innerHTML = '';

  const persons = desafioTense === 'Imperativus_Praesens' ? ['2']
               : desafioTense === 'Imperativus_Futurus' ? ['2','3']
               : VERB_PERSONS;

  // Two columns: Singularis / Pluralis
  VERB_NUMBERS.forEach(num => {
    const col = document.createElement('div');
    col.className = 'challenge-col';
    col.innerHTML = `<h3>${num}</h3>`;
    persons.forEach(p => {
      const row = document.createElement('div');
      row.className = 'challenge-row';
      const id = `vdes_${p}_${num}`;
      row.innerHTML = `<label>${p}ª ${t('verb.persona')}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      col.appendChild(row);
    });
    grid.appendChild(col);
  });

  document.getElementById('verbDesafioResults').innerHTML = '';
  document.getElementById('verbDesafioSubmit').style.display = 'inline-block';
  document.getElementById('verbDesafioSubmit').textContent = t('challenge.submit');
  document.getElementById('verbDesafioSubmit').onclick = checkVerbDesafio;
  showScreen('verb-desafio');

  setTimeout(() => {
    const first = document.getElementById(`vdes_${persons[0]}_${VERB_NUMBERS[0]}`);
    if (first) first.focus();
  }, 50);

  const inputs = grid.querySelectorAll('input');
  inputs.forEach((inp, i) => {
    inp.onkeydown = function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else checkVerbDesafio();
      }
    };
  });
}

export function checkVerbDesafio() {
  let hits = 0, total = 0, errors = [];
  const persons = desafioTense === 'Imperativus_Praesens' ? ['2']
               : desafioTense === 'Imperativus_Futurus' ? ['2','3']
               : VERB_PERSONS;
  VERB_NUMBERS.forEach(num => {
    persons.forEach(p => {
      const id = `vdes_${p}_${num}`;
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
        errors.push({ persona: p + 'ª', num, given: inp.value || t('feedback.empty'), correct });
      }
      inp.disabled = true;
    });
  });

  const pct = Math.round(hits / total * 100);
  let msg = '';
  if (pct === 100) msg = t('challenge.perfect');
  else if (pct >= 80) msg = t('challenge.almost');

  const res = document.getElementById('verbDesafioResults');
  let html = `<div class="results-box">
    <div class="score">${hits}/${total}</div>
    <div class="pct">${pct}%</div>
    ${msg ? `<div class="msg">${msg}</div>` : ''}`;
  if (errors.length) {
    html += `<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e => {
      html += `<div class="err-row">${e.persona} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html += '</div>';
  }
  html += '</div>';
  res.innerHTML = html;

  const btn = document.getElementById('verbDesafioSubmit');
  btn.textContent = t('challenge.new');
  btn.onclick = startVerbDesafio;
}
