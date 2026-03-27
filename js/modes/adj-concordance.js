// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE CONCORDANCE MODE — noun + adjective agreement
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { ALL_ADJECTIVES } from '../data/adjectives.js';
import { ALL_WORDS } from '../data/words.js';
import { checkAnswer, formKey, adjFormKey, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GENDER_MAP={"m.":"m","f.":"f","n.":"n","m./f.":"m"};
const GL={m:"Masculinum",f:"Femininum",n:"Neutrum"};
let cWords,cAdjs,cIdx,cTotal,cHits,cWaiting,cCorrectNoun,cCorrectAdj;

export function isConcWaiting(){ return cWaiting; }

export function startConcordance(){
  cWords=shuffle([...ALL_WORDS]);
  cAdjs=shuffle([...ALL_ADJECTIVES]);
  cIdx=0; cTotal=0; cHits=0; cWaiting=false;
  document.getElementById('concAcertos').textContent='0';
  document.getElementById('concTotal').textContent='0';
  document.getElementById('concPct').textContent='';
  document.getElementById('concFeedback').innerHTML='';
  document.getElementById('concNextBtn').style.display='none';
  showScreen('adj-concordance');
  concShow();
}

export function concShow(){
  if(cIdx>=cWords.length) cIdx=0;
  const word=cWords[cIdx];
  const [dec,sub,nom,gen,gender,nounForms]=word;
  const nounMeaning=getMeaning(nom);

  // Map noun gender to adjective gender key
  const g=GENDER_MAP[gender]||"m";

  // Pick random adjective
  const adj=pick(cAdjs);
  const [cls,asub,anm,anf,ann,agen,adjForms]=adj;
  const adjMeaning=getMeaning(anm);

  const caso=pick(CASES), num=pick(NUMBERS);
  cCorrectNoun=nounForms[formKey(caso,num)];
  cCorrectAdj=adjForms[adjFormKey(g,caso,num)];

  const el=document.getElementById('concPrompt');
  el.innerHTML=`
    <div class="word-info">${nom}, ${gen} (${gender}) — <span class="meaning">${nounMeaning}</span></div>
    <div class="word-info" style="margin-top:4px;">${anm}, ${anf}, ${ann} (gen. ${agen}) — <span class="meaning">${adjMeaning}</span></div>
    <div class="case-info" style="margin-top:8px;">
      ${t('prompt.caso')} ${caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${num} &nbsp;|&nbsp; ${GL[g]}
    </div>
    <div class="concordance-row" style="margin-top:12px;">
      <div class="conc-field">
        <label>${t('conc.noun')}</label>
        <input class="answer-input" id="concNounInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${nom}...">
      </div>
      <div class="conc-field">
        <label>${t('conc.adj')}</label>
        <input class="answer-input" id="concAdjInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${anm}...">
      </div>
      <button class="submit-btn" id="concSubmitBtn" onclick="window._concCheck()">OK</button>
    </div>`;
  document.getElementById('concFeedback').innerHTML='';
  document.getElementById('concNextBtn').style.display='none';
  cWaiting=false;
  setTimeout(()=>document.getElementById('concNounInput').focus(),50);

  // Enter key navigation
  document.getElementById('concNounInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();document.getElementById('concAdjInput').focus();}
  };
  document.getElementById('concAdjInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();if(cWaiting)concNext();else concCheck();}
  };
}

export function concCheck(){
  if(cWaiting)return;
  const nInp=document.getElementById('concNounInput');
  const aInp=document.getElementById('concAdjInput');
  cTotal++;
  const nOk=checkAnswer(nInp.value,cCorrectNoun);
  const aOk=checkAnswer(aInp.value,cCorrectAdj);
  const fb=document.getElementById('concFeedback');
  if(nOk&&aOk){
    cHits++;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct',cCorrectNoun+' '+cCorrectAdj)}</div>`;
  } else {
    let msg='';
    if(!nOk) msg+=`${t('conc.noun')}: ${nInp.value||t('feedback.empty')} → <strong>${cCorrectNoun}</strong> `;
    if(!aOk) msg+=`${t('conc.adj')}: ${aInp.value||t('feedback.empty')} → <strong>${cCorrectAdj}</strong>`;
    fb.innerHTML=`<div class="feedback wrong">✗ ${msg}</div>`;
  }
  nInp.disabled=true; aInp.disabled=true;
  document.getElementById('concSubmitBtn').disabled=true;
  document.getElementById('concAcertos').textContent=cHits;
  document.getElementById('concTotal').textContent=cTotal;
  document.getElementById('concPct').textContent=cTotal?Math.round(cHits/cTotal*100)+'%':'';
  document.getElementById('concNextBtn').style.display='inline-block';
  cWaiting=true;
  document.getElementById('concNextBtn').focus();
}

export function concNext(){
  cIdx++;
  concShow();
}
