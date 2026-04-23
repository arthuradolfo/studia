// ═══════════════════════════════════════════════════════════════════════
// PRONOUN STUDY MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { PRONOUNS, PRON_TYPES } from '../data/pronouns.js';
import { formKey, adjFormKey } from '../helpers.js';
import { t, getMeaning, getNote, getDeclGeneralNote } from '../i18n.js';

const GENDER_LABELS = { m: 'Masculinum', f: 'Femininum', n: 'Neutrum' };
let pronSelectedType = null;

export function initPronEstudo() {
  const sel = document.getElementById('pronDecSelector');
  if (!sel) return;
  sel.innerHTML = '';

  PRON_TYPES.forEach(tp => {
    const b = document.createElement('button');
    b.textContent = t('pron.type.' + tp);
    b.dataset.tp = tp;
    b.onclick = () => {
      sel.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
      b.classList.add('selected');
      pronSelectedType = tp;
      renderPronTables(PRONOUNS.filter(p => p[0] === tp));
    };
    if (pronSelectedType === tp) b.classList.add('selected');
    sel.appendChild(b);
  });

  const allBtn = document.createElement('button');
  allBtn.textContent = t('study.all');
  allBtn.dataset.tp = 'all';
  allBtn.onclick = () => {
    sel.querySelectorAll('button').forEach(x => x.classList.remove('selected'));
    allBtn.classList.add('selected');
    pronSelectedType = 'all';
    renderPronTables(PRONOUNS);
  };
  if (pronSelectedType === 'all') allBtn.classList.add('selected');
  sel.appendChild(allBtn);

  if (pronSelectedType === 'all') renderPronTables(PRONOUNS);
  else if (pronSelectedType) renderPronTables(PRONOUNS.filter(p => p[0] === pronSelectedType));
}

function renderPronTables(prons) {
  const el = document.getElementById('pronTables');
  el.innerHTML = '';
  let shownNotes = new Set();

  prons.forEach(p => {
    const [tp, sub, nm, nf, nn, gen, forms, hasGender] = p;
    const meaning = getMeaning(nm) || '';

    const gNote = getDeclGeneralNote('pron_' + tp);
    if (gNote && !shownNotes.has(tp)) {
      shownNotes.add(tp);
      el.innerHTML += `<div class="decl-note-general"><span class="note-label">${t('pron.type.' + tp)}:</span> ${gNote}</div>`;
    }

    let table;
    if (hasGender) {
      table = genderedTable(forms);
    } else {
      table = personalTable(forms);
    }

    let note = '';
    const noteText = getNote(nm);
    if (noteText) note = `<div class="decl-note"><span class="note-label">${t('study.note.label')}</span> ${noteText}</div>`;

    const header = hasGender ? `${nm}, ${nf}, ${nn} (gen. ${gen}) = ${meaning}` : `${nm} (gen. ${gen}) = ${meaning}`;

    el.innerHTML += `<details class="decl-card">
      <summary><span class="card-title">${t('pron.study.card.title', t('pron.type.' + tp), sub)}<br><small>${header}</small></span></summary>
      <div class="card-body">${table}${note}</div>
    </details>`;
  });
}

function personalTable(forms) {
  let table = `<table class="decl-table">
    <tr><th>${t('study.table.casus')}</th><th>${t('study.table.sg')}</th><th>${t('study.table.pl')}</th></tr>`;
  CASES.forEach(c => {
    table += `<tr><td style="color:var(--parchment-dim)">${c}</td><td>${forms[formKey(c, 'Singularis')]}</td><td>${forms[formKey(c, 'Pluralis')]}</td></tr>`;
  });
  table += '</table>';
  return table;
}

function genderedTable(forms) {
  let table = `<table class="decl-table adj-table">
    <tr><th>${t('study.table.casus')}</th>`;
  GENDERS.forEach(g => { table += `<th>${GENDER_LABELS[g]}</th>`; });
  table += '</tr>';
  NUMBERS.forEach(num => {
    table += `<tr class="num-header"><td colspan="${GENDERS.length + 1}" style="text-align:center;font-weight:bold;color:var(--gold);padding:6px 0 2px;">${num}</td></tr>`;
    CASES.forEach(c => {
      table += `<tr><td style="color:var(--parchment-dim)">${c}</td>`;
      GENDERS.forEach(g => {
        table += `<td>${forms[adjFormKey(g, c, num)]}</td>`;
      });
      table += '</tr>';
    });
  });
  table += '</table>';
  return table;
}
