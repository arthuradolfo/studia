// ═══════════════════════════════════════════════════════════════════════
// PASSIVE STUDY MODE — Conjugation tables for passive voice
// ═══════════════════════════════════════════════════════════════════════

import { PASSIVE_VERBS, PASSIVE_TENSES_INF, PASSIVE_TENSES_PERF, PASSIVE_TENSES, passiveInfinitive } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { t, getMeaning, getNote, getDeclGeneralNote } from '../i18n.js';

let currentTenseGroup = 'all';

export function initPassEstudo() {
  const sel = document.getElementById('passTenseSelector');
  if (!sel) return;
  sel.innerHTML = '';

  const groups = [
    { key: 'infectum', label: t('pass.tense.group.infectum') },
    { key: 'perfectum', label: t('pass.tense.group.perfectum') },
    { key: 'all', label: t('pass.tense.group.all') }
  ];

  groups.forEach(g => {
    const b = document.createElement('button');
    b.textContent = g.label;
    b.dataset.group = g.key;
    b.onclick = () => { _passFilterTense(g.key); };
    if (currentTenseGroup === g.key) b.classList.add('selected');
    sel.appendChild(b);
  });

  renderPassTables();
}

export function _passFilterTense(g) {
  currentTenseGroup = g;
  const sel = document.getElementById('passTenseSelector');
  sel.querySelectorAll('button').forEach(b =>
    b.classList.toggle('selected', b.dataset.group === g)
  );
  renderPassTables();
}

function renderPassTables() {
  const el = document.getElementById('passTables');
  el.innerHTML = '';

  let tenses;
  if (currentTenseGroup === 'infectum') tenses = PASSIVE_TENSES_INF;
  else if (currentTenseGroup === 'perfectum') tenses = PASSIVE_TENSES_PERF;
  else tenses = PASSIVE_TENSES;

  const core = PASSIVE_VERBS.slice(0, 5);

  // Primitiva passive table
  el.innerHTML += `<details class="decl-card" open>
    <summary><span class="card-title">${t('pass.study.inf.passiva')} / ${t('pass.study.part.passado')}</span></summary>
    <div class="card-body">${primitivaPassiveTable(core)}</div>
  </details>`;

  // General notes
  if (currentTenseGroup !== 'perfectum') {
    const note = t('pass.note.synthetic');
    el.innerHTML += `<div class="decl-note-general"><span class="note-label">${t('pass.tense.group.infectum')}:</span> ${note}</div>`;
  }
  if (currentTenseGroup !== 'infectum') {
    const note = t('pass.note.analytic');
    el.innerHTML += `<div class="decl-note-general"><span class="note-label">${t('pass.tense.group.perfectum')}:</span> ${note}</div>`;
  }

  // Tense tables
  tenses.forEach(tense => {
    const tenseLabel = t('pass.tense.' + tense);
    el.innerHTML += `<details class="decl-card">
      <summary><span class="card-title">${tenseLabel}</span></summary>
      <div class="card-body">${passiveTable(core, tense)}</div>
    </details>`;
  });
}

function primitivaPassiveTable(verbs) {
  let table = `<table class="decl-table"><tr>
    <th style="width:25%"></th>`;
  verbs.forEach(v => { table += `<th>${v[2]}<br><small style="color:var(--text-dim)">${v[0]}</small></th>`; });
  table += '</tr><tr><td style="color:var(--parchment-dim)">Inf. Passīvī</td>';
  verbs.forEach(v => {
    const stem = v[2].replace(/[iī]?[oō]$/, '');
    table += `<td>${passiveInfinitive(v[0], stem)}</td>`;
  });
  table += '</tr><tr><td style="color:var(--parchment-dim)">Part. Passīvī</td>';
  verbs.forEach(v => {
    const supStem = v[5].replace(/um$/, '');
    table += `<td>${supStem}us, -a, -um</td>`;
  });
  table += '</tr></table>';
  return table;
}

function passiveTable(verbs, tense) {
  let table = `<table class="decl-table"><tr>
    <th></th>`;
  verbs.forEach(v => {
    table += `<th>${v[2]}<br><small style="color:var(--text-dim)">${v[0]}</small></th>`;
  });
  table += '</tr>';
  VERB_NUMBERS.forEach(num => {
    table += `<tr class="num-header"><td colspan="${verbs.length + 1}" style="text-align:center;font-weight:bold;color:var(--gold);padding:6px 0 2px;">${num}</td></tr>`;
    VERB_PERSONS.forEach(p => {
      table += `<tr><td style="color:var(--parchment-dim)">${p}ª</td>`;
      verbs.forEach(v => {
        const form = v[6][verbFormKey(tense, p, num)] || '—';
        table += `<td>${form}</td>`;
      });
      table += '</tr>';
    });
  });
  table += '</table>';
  return table;
}
