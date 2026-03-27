// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE STUDY MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ADJ_PARADIGMS } from '../data/adjectives.js';
import { adjFormKey } from '../helpers.js';
import { t, getMeaning, getNote, getDeclGeneralNote } from '../i18n.js';

const GENDER_LABELS = {m:"Masculinum",f:"Femininum",n:"Neutrum"};
let adjEstudoSelectedClass=null;

export function initAdjEstudo(){
  const byClass={};
  ADJ_PARADIGMS.forEach(a=>{(byClass[a[0]]=byClass[a[0]]||[]).push(a);});
  const keys=Object.keys(byClass).sort();
  const sel=document.getElementById('adjDecSelector');
  sel.innerHTML='';
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.textContent=t('adj.study.class',k);
    b.dataset.cls=k;
    b.onclick=()=>{
      sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      adjEstudoSelectedClass=k;
      renderAdjTables(byClass[k]);
    };
    if(adjEstudoSelectedClass===k) b.classList.add('selected');
    sel.appendChild(b);
  });
  const allBtn=document.createElement('button');
  allBtn.textContent=t('study.all');
  allBtn.dataset.cls='all';
  allBtn.onclick=()=>{
    sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
    allBtn.classList.add('selected');
    adjEstudoSelectedClass='all';
    renderAdjTables(ADJ_PARADIGMS);
  };
  if(adjEstudoSelectedClass==='all') allBtn.classList.add('selected');
  sel.appendChild(allBtn);

  if(adjEstudoSelectedClass==='all') renderAdjTables(ADJ_PARADIGMS);
  else if(adjEstudoSelectedClass && byClass[adjEstudoSelectedClass]) renderAdjTables(byClass[adjEstudoSelectedClass]);
}

function renderAdjTables(adjs){
  const el=document.getElementById('adjTables');
  el.innerHTML='';
  let shownNotes=new Set();
  adjs.forEach(a=>{
    const [cls,sub,nm,nf,nn,gen,forms]=a;
    const meaning=getMeaning(nm);
    // General note
    const gNote=getDeclGeneralNote('adj_'+cls);
    if(gNote && !shownNotes.has(cls)){
      shownNotes.add(cls);
      el.innerHTML+=`<div class="decl-note-general"><span class="note-label">${t('adj.study.note.general',cls)}</span> ${gNote}</div>`;
    }
    // 3-column table
    let table=`<table class="decl-table adj-table">
      <tr><th>${t('study.table.casus')}</th>`;
    GENDERS.forEach(g=>{ table+=`<th>${GENDER_LABELS[g]}</th>`; });
    table+='</tr>';
    NUMBERS.forEach(num=>{
      table+=`<tr class="num-header"><td colspan="${GENDERS.length+1}" style="text-align:center;font-weight:bold;color:var(--gold);padding:6px 0 2px;">${num}</td></tr>`;
      CASES.forEach(c=>{
        table+=`<tr><td style="color:var(--parchment-dim)">${c}</td>`;
        GENDERS.forEach(g=>{
          table+=`<td>${forms[adjFormKey(g,c,num)]}</td>`;
        });
        table+='</tr>';
      });
    });
    table+='</table>';
    let note='';
    const noteText=getNote(nm);
    if(noteText) note=`<div class="decl-note"><span class="note-label">${t('study.note.label')}</span> ${noteText}</div>`;
    el.innerHTML+=`<details class="decl-card">
      <summary><span class="card-title">${t('adj.study.card.title',cls,sub)}<br><small>${nm}, ${nf}, ${nn} (gen. ${gen}) = ${meaning}</small></span></summary>
      <div class="card-body">${table}${note}</div>
    </details>`;
  });
}
