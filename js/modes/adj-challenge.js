// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE CHALLENGE MODE — 36-field grid
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ADJ_PARADIGMS } from '../data/adjectives.js';
import { checkAnswer, adjFormKey, pick } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL={m:"Masculinum",f:"Femininum",n:"Neutrum"};
let desafioForms, desafioAdj;

export function getDesafioAdj(){ return desafioAdj; }

export function startAdjDesafio(){
  desafioAdj=pick(ADJ_PARADIGMS);
  const [cls,sub,nm,nf,nn,gen,forms]=desafioAdj;
  const meaning=getMeaning(nm);
  desafioForms=forms;

  document.getElementById('adjDesafioWord').innerHTML=`
    <div class="word-info" style="font-size:1.1rem;">${nm}, ${nf}, ${nn} (gen. ${gen}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${t('adj.study.class',cls)} — ${sub}</div>`;

  const grid=document.getElementById('adjDesafioGrid');
  grid.innerHTML='';
  GENDERS.forEach(g=>{
    const col=document.createElement('div');
    col.className='challenge-col';
    col.innerHTML=`<h3>${GL[g]}</h3>`;
    NUMBERS.forEach(num=>{
      col.innerHTML+=`<div class="num-label">${num}</div>`;
      CASES.forEach(c=>{
        const row=document.createElement('div');
        row.className='challenge-row';
        const id=`adjDes_${g}_${c}_${num}`;
        row.innerHTML=`<label>${c}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
        col.appendChild(row);
      });
    });
    grid.appendChild(col);
  });

  document.getElementById('adjDesafioResults').innerHTML='';
  const btn=document.getElementById('adjDesafioSubmit');
  btn.style.display='inline-block';
  btn.textContent=t('challenge.submit');
  btn.onclick=checkAdjDesafio;
  showScreen('adj-desafio');

  // Tab through inputs with Enter
  const inputs=grid.querySelectorAll('input');
  inputs.forEach((inp,i)=>{
    inp.onkeydown=function(e){
      if(e.key==='Enter'){
        e.preventDefault();
        if(i<inputs.length-1) inputs[i+1].focus();
        else checkAdjDesafio();
      }
    };
  });
  setTimeout(()=>{if(inputs[0])inputs[0].focus();},50);
}

export function checkAdjDesafio(){
  let hits=0, total=0, errors=[];
  GENDERS.forEach(g=>{
    NUMBERS.forEach(num=>{
      CASES.forEach(c=>{
        const id=`adjDes_${g}_${c}_${num}`;
        const inp=document.getElementById(id);
        const correct=desafioForms[adjFormKey(g,c,num)];
        total++;
        if(checkAnswer(inp.value,correct)){
          hits++;
          inp.classList.add('correct-field');
          inp.classList.remove('wrong-field');
        } else {
          inp.classList.add('wrong-field');
          inp.classList.remove('correct-field');
          errors.push({gender:GL[g],caso:c,num,given:inp.value||t('feedback.empty'),correct});
        }
        inp.disabled=true;
      });
    });
  });
  const pct=Math.round(hits/total*100);
  let msg='';
  if(pct===100) msg=t('challenge.perfect');
  else if(pct>=80) msg=t('challenge.almost');
  const res=document.getElementById('adjDesafioResults');
  let html=`<div class="results-box"><div class="score">${hits}/${total}</div><div class="pct">${pct}%</div>
    ${msg?`<div class="msg">${msg}</div>`:''}`;
  if(errors.length){
    html+=`<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e=>{
      html+=`<div class="err-row">${e.gender} ${e.caso} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html+=`</div>`;
  }
  html+=`</div>`;
  res.innerHTML=html;
  const btn=document.getElementById('adjDesafioSubmit');
  btn.textContent=t('challenge.new');
  btn.onclick=startAdjDesafio;
}
