// ═══════════════════════════════════════════════════════════════════════
// PRONOUN CHALLENGE MODE — 12 or 36 field grid
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { PRONOUNS } from '../data/pronouns.js';
import { checkAnswer, formKey, adjFormKey, pick } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL = { m: 'Masculinum', f: 'Femininum', n: 'Neutrum' };
let desafioForms, desafioPron, desafioHasGender;

export function getDesafioPron() { return desafioPron; }

export function startPronDesafio() {
  desafioPron = pick(PRONOUNS);
  const [tp, sub, nm, nf, nn, gen, forms, hasGender] = desafioPron;
  const meaning = getMeaning(nm) || '';
  desafioForms = forms;
  desafioHasGender = hasGender;

  const header = hasGender ? `${nm}, ${nf}, ${nn} (gen. ${gen})` : `${nm} (gen. ${gen})`;
  document.getElementById('pronDesafioWord').innerHTML = `
    <div class="word-info" style="font-size:1.1rem;">${header} — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${t('pron.type.' + tp)} — ${sub}</div>`;

  const hintEl = document.getElementById('pronDesafioHint');
  if (hintEl) hintEl.textContent = t(hasGender ? 'pron.challenge.hint.gendered' : 'pron.challenge.hint.personal');

  const grid = document.getElementById('pronDesafioGrid');
  grid.innerHTML = '';
  grid.className = hasGender ? 'challenge-grid adj-challenge-grid' : 'challenge-grid';

  if (hasGender) {
    buildGenderedGrid(grid, forms);
  } else {
    buildPersonalGrid(grid, forms);
  }

  document.getElementById('pronDesafioResults').innerHTML = '';
  const btn = document.getElementById('pronDesafioSubmit');
  btn.style.display = 'inline-block';
  btn.textContent = t('challenge.submit');
  btn.onclick = checkPronDesafio;
  showScreen('pron-desafio');

  const inputs = grid.querySelectorAll('input:not([disabled])');
  inputs.forEach((inp, i) => {
    inp.onkeydown = function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (i < inputs.length - 1) inputs[i + 1].focus();
        else checkPronDesafio();
      }
    };
  });
  setTimeout(() => { if (inputs[0]) inputs[0].focus(); }, 50);
}

function buildPersonalGrid(grid, forms) {
  NUMBERS.forEach(num => {
    const col = document.createElement('div');
    col.className = 'challenge-col';
    col.innerHTML = `<h3>${num}</h3>`;
    CASES.forEach(c => {
      const row = document.createElement('div');
      row.className = 'challenge-row';
      const id = `pronDes_${c}_${num}`;
      const form = forms[formKey(c, num)];
      const disabled = (!form || form === '—');
      row.innerHTML = `<label>${c}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false"${disabled ? ' disabled placeholder="—"' : ''}>`;
      col.appendChild(row);
    });
    grid.appendChild(col);
  });
}

function buildGenderedGrid(grid, forms) {
  GENDERS.forEach(g => {
    const col = document.createElement('div');
    col.className = 'challenge-col';
    col.innerHTML = `<h3>${GL[g]}</h3>`;
    NUMBERS.forEach(num => {
      col.innerHTML += `<div class="num-label">${num}</div>`;
      CASES.forEach(c => {
        const row = document.createElement('div');
        row.className = 'challenge-row';
        const id = `pronDes_${g}_${c}_${num}`;
        row.innerHTML = `<label>${c}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        col.appendChild(row);
      });
    });
    grid.appendChild(col);
  });
}

export function checkPronDesafio() {
  let hits = 0, total = 0, errors = [];

  if (desafioHasGender) {
    GENDERS.forEach(g => {
      NUMBERS.forEach(num => {
        CASES.forEach(c => {
          const id = `pronDes_${g}_${c}_${num}`;
          const inp = document.getElementById(id);
          const correct = desafioForms[adjFormKey(g, c, num)];
          total++;
          if (checkAnswer(inp.value, correct)) {
            hits++;
            inp.classList.add('correct-field');
            inp.classList.remove('wrong-field');
          } else {
            inp.classList.add('wrong-field');
            inp.classList.remove('correct-field');
            errors.push({ gender: GL[g], caso: c, num, given: inp.value || t('feedback.empty'), correct });
          }
          inp.disabled = true;
        });
      });
    });
  } else {
    NUMBERS.forEach(num => {
      CASES.forEach(c => {
        const id = `pronDes_${c}_${num}`;
        const inp = document.getElementById(id);
        const correct = desafioForms[formKey(c, num)];
        if (!correct || correct === '—') return;
        total++;
        if (checkAnswer(inp.value, correct)) {
          hits++;
          inp.classList.add('correct-field');
          inp.classList.remove('wrong-field');
        } else {
          inp.classList.add('wrong-field');
          inp.classList.remove('correct-field');
          errors.push({ caso: c, num, given: inp.value || t('feedback.empty'), correct });
        }
        inp.disabled = true;
      });
    });
  }

  const pct = Math.round(hits / total * 100);
  let msg = '';
  if (pct === 100) msg = t('challenge.perfect');
  else if (pct >= 80) msg = t('challenge.almost');

  const res = document.getElementById('pronDesafioResults');
  let html = `<div class="results-box"><div class="score">${hits}/${total}</div><div class="pct">${pct}%</div>
    ${msg ? `<div class="msg">${msg}</div>` : ''}`;
  if (errors.length) {
    html += `<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e => {
      const prefix = e.gender ? `${e.gender} ` : '';
      html += `<div class="err-row">${prefix}${e.caso} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html += `</div>`;
  }
  html += `</div>`;
  res.innerHTML = html;
  const btn = document.getElementById('pronDesafioSubmit');
  btn.textContent = t('challenge.new');
  btn.onclick = startPronDesafio;
}
