// ═══════════════════════════════════════════════════════════════════════
// PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { ALL_WORDS } from '../data/words.js';
import { checkAnswer, formKey, pick, shuffle, wordMeaning } from '../helpers.js';
import { t } from '../i18n.js';
import { showScreen } from '../app.js';

let prWords,prIdx,prCorrect,prTotal,prHits,prWaiting;

export function isPrWaiting() { return prWaiting; }

export function startPratica(){
  prWords=shuffle([...ALL_WORDS]);
  prIdx=0; prTotal=0; prHits=0; prWaiting=false;
  document.getElementById('prAcertos').textContent='0';
  document.getElementById('prTotal').textContent='0';
  document.getElementById('prPct').textContent='';
  document.getElementById('prFeedback').innerHTML='';
  document.getElementById('prNextBtn').style.display='none';
  showScreen('pratica');
  praticaShow();
}

export function praticaShow(){
  if(prIdx>=prWords.length) prIdx=0;
  const [dec,sub,nom,gen,gender,forms]=prWords[prIdx];
  const meaning=wordMeaning(prWords[prIdx]);
  const caso=pick(CASES), num=pick(NUMBERS);
  prCorrect=forms[formKey(caso,num)];
  const el=document.getElementById('prPrompt');
  el.innerHTML=`
    <div class="word-info">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${t('prompt.declinatio',dec,sub)}</div>
    <div class="case-info" style="margin-top:8px;">${t('prompt.caso')} ${caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${num}</div>
    <div class="answer-row">
      <input class="answer-input" id="prInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="prSubmitBtn" onclick="window._praticaCheck()">OK</button>
    </div>`;
  document.getElementById('prFeedback').innerHTML='';
  document.getElementById('prNextBtn').style.display='none';
  prWaiting=false;
  setTimeout(()=>document.getElementById('prInput').focus(),50);
  const inp=document.getElementById('prInput');
  inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();if(prWaiting)praticaNext();else praticaCheck();}};
}

export function praticaCheck(){
  if(prWaiting)return;
  const inp=document.getElementById('prInput');
  const answer=inp.value;
  prTotal++;
  const fb=document.getElementById('prFeedback');
  if(checkAnswer(answer,prCorrect)){
    prHits++;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct',prCorrect)}</div>`;
  } else {
    fb.innerHTML=`<div class="feedback wrong">${t('feedback.wrong',prCorrect)}</div>`;
  }
  inp.disabled=true;
  document.getElementById('prSubmitBtn').disabled=true;
  document.getElementById('prAcertos').textContent=prHits;
  document.getElementById('prTotal').textContent=prTotal;
  document.getElementById('prPct').textContent=prTotal?Math.round(prHits/prTotal*100)+'%':'';
  document.getElementById('prNextBtn').style.display='inline-block';
  prWaiting=true;
  document.getElementById('prNextBtn').focus();
}

export function praticaNext(){
  prIdx++;
  praticaShow();
}
