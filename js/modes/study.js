// ═══════════════════════════════════════════════════════════════════════
// STUDY MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES } from '../data/declensions.js';
import { WORDS } from '../data/words.js';
import { formKey, wordMeaning } from '../helpers.js';
import { t, getNote, getDeclGeneralNote } from '../i18n.js';

let estudoSelectedDec=null; // track which declension is selected ('I','II',... or 'all')

export function initEstudo(){
  const byDec={};
  WORDS.forEach(w=>{(byDec[w[0]]=byDec[w[0]]||[]).push(w);});
  const keys=Object.keys(byDec).sort();
  const sel=document.getElementById('decSelector');
  sel.innerHTML='';
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.textContent=t('study.decl',k);
    b.dataset.dec=k;
    b.onclick=()=>{
      sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      estudoSelectedDec=k;
      renderTables(byDec[k]);
    };
    if(estudoSelectedDec===k) b.classList.add('selected');
    sel.appendChild(b);
  });
  const allBtn=document.createElement('button');
  allBtn.textContent=t('study.all');
  allBtn.dataset.dec='all';
  allBtn.onclick=()=>{
    sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
    allBtn.classList.add('selected');
    estudoSelectedDec='all';
    renderTables(WORDS);
  };
  if(estudoSelectedDec==='all') allBtn.classList.add('selected');
  sel.appendChild(allBtn);

  // Re-render tables if a declension was selected
  if(estudoSelectedDec==='all'){
    renderTables(WORDS);
  } else if(estudoSelectedDec && byDec[estudoSelectedDec]){
    renderTables(byDec[estudoSelectedDec]);
  }
}

function renderTables(words){
  const el=document.getElementById('tables');
  el.innerHTML='';
  let shownGeneralNotes=new Set();
  words.forEach(w=>{
    const [dec,sub,nom,gen,gender,forms]=w;
    const meaning=wordMeaning(w);
    // General note for this declension
    const generalNote=getDeclGeneralNote(dec);
    if(generalNote && !shownGeneralNotes.has(dec)){
      shownGeneralNotes.add(dec);
      el.innerHTML+=`<div class="decl-note-general"><span class="note-label">${t('study.note.general.label',dec)}</span> ${generalNote}</div>`;
    }
    let table=`<table class="decl-table">
      <tr><th>${t('study.table.casus')}</th><th>${t('study.table.sg')}</th><th>${t('study.table.pl')}</th></tr>`;
    CASES.forEach(c=>{
      table+=`<tr><td style="color:var(--parchment-dim)">${c}</td><td>${forms[formKey(c,"Singularis")]}</td><td>${forms[formKey(c,"Pluralis")]}</td></tr>`;
    });
    table+='</table>';
    let note='';
    const noteText=getNote(nom);
    if(noteText){
      note=`<div class="decl-note"><span class="note-label">${t('study.note.label')}</span> ${noteText}</div>`;
    }
    el.innerHTML+=`<details class="decl-card">
      <summary><span class="card-title">${t('study.card.title',dec,sub)}<br><small>${nom}, ${gen} (${gender}) = ${meaning}</small></span></summary>
      <div class="card-body">${table}${note}</div>
    </details>`;
  });
}
