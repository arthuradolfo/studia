// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ALL_ADJECTIVES } from '../data/adjectives.js';
import { checkAnswer, adjFormKey, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL={m:"Masculinum",f:"Femininum",n:"Neutrum"};
let prWords,prIdx,prCorrect,prTotal,prHits,prWaiting;

export function isAdjPrWaiting(){ return prWaiting; }

export function startAdjPratica(){
  prWords=shuffle([...ALL_ADJECTIVES]);
  prIdx=0; prTotal=0; prHits=0; prWaiting=false;
  document.getElementById('adjPrAcertos').textContent='0';
  document.getElementById('adjPrTotal').textContent='0';
  document.getElementById('adjPrPct').textContent='';
  document.getElementById('adjPrFeedback').innerHTML='';
  document.getElementById('adjPrNextBtn').style.display='none';
  showScreen('adj-pratica');
  adjPraticaShow();
}

export function adjPraticaShow(){
  if(prIdx>=prWords.length) prIdx=0;
  const [cls,sub,nm,nf,nn,gen,forms]=prWords[prIdx];
  const meaning=getMeaning(nm);
  const caso=pick(CASES), num=pick(NUMBERS), gender=pick(GENDERS);
  prCorrect=forms[adjFormKey(gender,caso,num)];
  const el=document.getElementById('adjPrPrompt');
  el.innerHTML=`
    <div class="word-info">${nm}, ${nf}, ${nn} (gen. ${gen}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${t('adj.study.class',cls)} — ${sub}</div>
    <div class="case-info" style="margin-top:8px;">
      ${t('prompt.gender')} <strong>${GL[gender]}</strong> &nbsp;|&nbsp;
      ${t('prompt.caso')} ${caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${num}
    </div>
    <div class="answer-row">
      <input class="answer-input" id="adjPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="adjPrSubmitBtn" onclick="window._adjPraticaCheck()">OK</button>
    </div>`;
  document.getElementById('adjPrFeedback').innerHTML='';
  document.getElementById('adjPrNextBtn').style.display='none';
  prWaiting=false;
  setTimeout(()=>document.getElementById('adjPrInput').focus(),50);
  document.getElementById('adjPrInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();if(prWaiting)adjPraticaNext();else adjPraticaCheck();}
  };
}

export function adjPraticaCheck(){
  if(prWaiting)return;
  const inp=document.getElementById('adjPrInput');
  prTotal++;
  const fb=document.getElementById('adjPrFeedback');
  if(checkAnswer(inp.value,prCorrect)){
    prHits++;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct',prCorrect)}</div>`;
  } else {
    fb.innerHTML=`<div class="feedback wrong">${t('feedback.wrong',prCorrect)}</div>`;
  }
  inp.disabled=true;
  document.getElementById('adjPrSubmitBtn').disabled=true;
  document.getElementById('adjPrAcertos').textContent=prHits;
  document.getElementById('adjPrTotal').textContent=prTotal;
  document.getElementById('adjPrPct').textContent=prTotal?Math.round(prHits/prTotal*100)+'%':'';
  document.getElementById('adjPrNextBtn').style.display='inline-block';
  prWaiting=true;
  document.getElementById('adjPrNextBtn').focus();
}

export function adjPraticaNext(){
  prIdx++;
  adjPraticaShow();
}
