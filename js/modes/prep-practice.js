// ═══════════════════════════════════════════════════════════════════════
// PREPOSITION PRACTICE MODE
// ═══════════════════════════════════════════════════════════════════════

import { NUMBERS } from '../data/declensions.js';
import { PREPOSITIONS } from '../data/prepositions.js';
import { ALL_WORDS } from '../data/words.js';
import { checkAnswer, formKey, pick, shuffle, normalize } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let prPreps,prIdx,prTotal,prHits,prWaiting,prCorrect,prType;

export function isPrepPrWaiting(){ return prWaiting; }

export function startPrepPratica(){
  prPreps=shuffle([...PREPOSITIONS,...PREPOSITIONS,...PREPOSITIONS]); // repeat for variety
  prIdx=0; prTotal=0; prHits=0; prWaiting=false;
  document.getElementById('prepPrAcertos').textContent='0';
  document.getElementById('prepPrTotal').textContent='0';
  document.getElementById('prepPrPct').textContent='';
  document.getElementById('prepPrFeedback').innerHTML='';
  document.getElementById('prepPrNextBtn').style.display='none';
  showScreen('prep-pratica');
  prepPraticaShow();
}

export function prepPraticaShow(){
  if(prIdx>=prPreps.length) prIdx=0;
  const prep=prPreps[prIdx];

  // Alternate between case-identification and noun-form exercises
  prType=Math.random()<0.4?'case':'form';

  const el=document.getElementById('prepPrPrompt');
  if(prType==='case'){
    // Type 1: Which case does this preposition take?
    prCorrect=prep.case;
    el.innerHTML=`
      <div class="word-info" style="font-size:1.2rem;"><strong>${prep.prep}</strong></div>
      <div style="color:var(--text-dim);font-size:0.9rem;">${t('prep.meaning.'+prep.context)}</div>
      <div class="case-info" style="margin-top:8px;">${t('prep.which_case')}</div>
      <div class="answer-row">
        <input class="answer-input" id="prepPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Accusativus / Ablativus">
        <button class="submit-btn" id="prepPrSubmitBtn" onclick="window._prepPraticaCheck()">OK</button>
      </div>`;
  } else {
    // Type 2: Give the correct noun form after the preposition
    const word=pick(ALL_WORDS);
    const [dec,sub,nom,gen,gender,forms]=word;
    const meaning=getMeaning(nom);
    const num=pick(NUMBERS);
    prCorrect=forms[formKey(prep.case,num)];
    el.innerHTML=`
      <div class="word-info" style="font-size:1.2rem;"><strong>${prep.prep}</strong> + ${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
      <div style="color:var(--text-dim);font-size:0.9rem;">${t('prep.meaning.'+prep.context)} — ${num}</div>
      <div class="case-info" style="margin-top:8px;">${t('prep.give_form')}</div>
      <div class="answer-row">
        <input class="answer-input" id="prepPrInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
        <button class="submit-btn" id="prepPrSubmitBtn" onclick="window._prepPraticaCheck()">OK</button>
      </div>`;
  }
  document.getElementById('prepPrFeedback').innerHTML='';
  document.getElementById('prepPrNextBtn').style.display='none';
  prWaiting=false;
  setTimeout(()=>document.getElementById('prepPrInput').focus(),50);
  document.getElementById('prepPrInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();if(prWaiting)prepPraticaNext();else prepPraticaCheck();}
  };
}

export function prepPraticaCheck(){
  if(prWaiting)return;
  const inp=document.getElementById('prepPrInput');
  prTotal++;
  const fb=document.getElementById('prepPrFeedback');
  const isCorrect=prType==='case'
    ? normalize(inp.value)===normalize(prCorrect)
    : checkAnswer(inp.value,prCorrect);
  if(isCorrect){
    prHits++;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct',prCorrect)}</div>`;
  } else {
    fb.innerHTML=`<div class="feedback wrong">${t('feedback.wrong',prCorrect)}</div>`;
  }
  inp.disabled=true;
  document.getElementById('prepPrSubmitBtn').disabled=true;
  document.getElementById('prepPrAcertos').textContent=prHits;
  document.getElementById('prepPrTotal').textContent=prTotal;
  document.getElementById('prepPrPct').textContent=prTotal?Math.round(prHits/prTotal*100)+'%':'';
  document.getElementById('prepPrNextBtn').style.display='inline-block';
  prWaiting=true;
  document.getElementById('prepPrNextBtn').focus();
}

export function prepPraticaNext(){
  prIdx++;
  prepPraticaShow();
}
