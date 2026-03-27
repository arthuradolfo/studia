// ═══════════════════════════════════════════════════════════════════════
// PREPOSITION STUDY MODE
// ═══════════════════════════════════════════════════════════════════════

import { PREP_ACC, PREP_ABL } from '../data/prepositions.js';
import { t } from '../i18n.js';

export function initPrepEstudo(){
  const el=document.getElementById('prepTables');
  el.innerHTML='';

  // Accusative table
  let html=`<h3 style="color:var(--gold);margin:16px 0 8px;">${t('prep.acc.title')}</h3>`;
  html+=`<table class="decl-table"><tr><th>${t('prep.col.prep')}</th><th>${t('prep.col.meaning')}</th></tr>`;
  PREP_ACC.forEach(p=>{
    html+=`<tr><td><strong>${p.prep}</strong> + Acc.</td><td>${t('prep.meaning.'+p.context)}</td></tr>`;
  });
  html+='</table>';

  // Ablative table
  html+=`<h3 style="color:var(--gold);margin:24px 0 8px;">${t('prep.abl.title')}</h3>`;
  html+=`<table class="decl-table"><tr><th>${t('prep.col.prep')}</th><th>${t('prep.col.meaning')}</th></tr>`;
  PREP_ABL.forEach(p=>{
    html+=`<tr><td><strong>${p.prep}</strong> + Abl.</td><td>${t('prep.meaning.'+p.context)}</td></tr>`;
  });
  html+='</table>';

  el.innerHTML=html;
}
