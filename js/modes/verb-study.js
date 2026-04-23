// ═══════════════════════════════════════════════════════════════════════
// VERB STUDY MODE
// ═══════════════════════════════════════════════════════════════════════

import { VERBS, VERB_TENSES, VERB_TENSES_INF, VERB_TENSES_PERF, VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { t, getMeaning, getDeclGeneralNote } from '../i18n.js';

let currentTenseGroup = 'infectum';

export function initVerbEstudo() {
  const tenseEl = document.getElementById('verbTenseSelector');
  if (!tenseEl) return;

  const groups = ['infectum', 'perfectum', 'all'];
  tenseEl.innerHTML = groups.map(g => {
    const label = t('verb.tense.group.' + g);
    return `<button class="${currentTenseGroup === g ? 'selected' : ''}" onclick="window._verbFilterTense('${g}')">${label}</button>`;
  }).join('');

  renderVerbTables();
}

function renderVerbTables() {
  const el = document.getElementById('verbTables');
  if (!el) return;

  const verbs = VERBS;

  const tenses = currentTenseGroup === 'infectum' ? VERB_TENSES_INF
    : currentTenseGroup === 'perfectum' ? VERB_TENSES_PERF
    : VERB_TENSES;

  let html = '';

  html += `<details class="decl-card">
    <summary><strong>${t('verb.primitiva.title')}</strong></summary>`;
  html += primitivaTable(VERBS.slice(0, 3));
  html += primitivaTable(VERBS.slice(3));
  const primNote = getDeclGeneralNote('verb_primitiva');
  if (primNote) html += `<div class="decl-note"><span class="note-label">${t('study.note.label')}</span> ${primNote}</div>`;
  html += '</details>';

  for (const tense of tenses) {
    const tenseLabel = t('verb.tense.' + tense);

    html += `<details class="decl-card">
      <summary><strong>${tenseLabel}</strong></summary>`;

    html += verbTable(VERBS.slice(0, 3), tense);
    html += verbTable(VERBS.slice(3), tense);

    const tenseNote = getDeclGeneralNote('verb_' + tense);
    if (tenseNote) html += `<div class="decl-note"><span class="note-label">${t('study.note.label')}</span> ${tenseNote}</div>`;

    html += '</details>';
  }

  el.innerHTML = html;
}

function primitivaTable(verbs) {
  const rows = [
    ['verb.primitiva.praesens', 2],
    ['verb.primitiva.infinitivus', 3],
    ['verb.primitiva.perfectum', 4],
    ['verb.primitiva.supinum', 5],
  ];

  let html = `<table class="decl-table" style="table-layout:fixed;">`;
  html += `<colgroup><col style="width:25%">`;
  for (let i = 0; i < verbs.length; i++) html += `<col>`;
  html += `</colgroup>`;

  html += '<tr><th></th>';
  for (const v of verbs) {
    const conjLabel = v[0] === 'Irr.' ? 'Irr.' : v[0];
    html += `<th style="text-align:left;">${conjLabel}</th>`;
  }
  html += '</tr>';

  for (const [key, idx] of rows) {
    const label = t(key);
    html += `<tr><td style="color:var(--parchment-dim);white-space:nowrap;">${label}</td>`;
    for (const v of verbs) {
      html += `<td>${v[idx] || '—'}</td>`;
    }
    html += '</tr>';
  }

  html += '</table>';
  return html;
}

function verbTable(verbs, tense) {
  let html = `<table class="decl-table" style="table-layout:fixed;">`;
  html += `<colgroup><col style="width:15%">`;
  for (let i = 0; i < verbs.length; i++) html += `<col>`;
  html += `</colgroup>`;

  html += '<tr><th></th>';
  for (const v of verbs) {
    const meaning = getMeaning(v[2]) || '';
    html += `<th><strong>${v[2]}</strong><br><small class="meaning">${meaning}</small></th>`;
  }
  html += '</tr>';

  html += '<tr><td></td>';
  for (const v of verbs) {
    const conjLabel = v[0] === 'Irr.' ? 'Irr.' : v[0];
    html += `<td style="color:var(--text-dim);font-size:0.8rem;">${conjLabel}</td>`;
  }
  html += '</tr>';

  for (const num of VERB_NUMBERS) {
    for (const p of VERB_PERSONS) {
      const label = `${p}ª ${num === 'Singularis' ? 'sg.' : 'pl.'}`;
      html += `<tr><td style="color:var(--parchment-dim);white-space:nowrap;">${label}</td>`;
      for (const v of verbs) {
        const forms = v[6];
        const form = forms[verbFormKey(tense, p, num)] || '—';
        html += `<td>${form}</td>`;
      }
      html += '</tr>';
    }
  }

  html += '</table>';
  return html;
}

export function _verbFilterTense(g) {
  currentTenseGroup = g;
  initVerbEstudo();
}
