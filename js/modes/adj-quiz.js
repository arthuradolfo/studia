// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { GENDERS } from '../data/adj-declensions.js';
import { ALL_ADJECTIVES } from '../data/adjectives.js';
import { checkAnswer, adjFormKey, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

const GL={m:"Masculinum",f:"Femininum",n:"Neutrum"};
let qWords,qIdx,qTotal,qHits,qStreak,qBestStreak,qCorrect,qWaiting,qMax;

export function isAdjQWaiting(){ return qWaiting; }
export function adjStepQuiz(d){
  const el=document.getElementById('adjQuizNum');
  el.value=Math.max(1,Math.min(200,(parseInt(el.value)||10)+d));
}

export function startAdjQuiz(){
  qMax=parseInt(document.getElementById('adjQuizNum').value)||10;
  qWords=shuffle([...ALL_ADJECTIVES]);
  qIdx=0;qHits=0;qStreak=0;qBestStreak=0;qTotal=qMax;qWaiting=false;
  document.getElementById('adjQCur').textContent='1';
  document.getElementById('adjQTotal').textContent=qMax;
  document.getElementById('adjQAcertos').textContent='0';
  document.getElementById('adjQStreak').textContent='0';
  document.getElementById('adjQFeedback').innerHTML='';
  document.getElementById('adjQNextBtn').style.display='none';
  showScreen('adj-quiz');
  adjQuizShow();
}

export function adjQuizShow(){
  if(qIdx>=qWords.length) qIdx=0;
  const [cls,sub,nm,nf,nn,gen,forms]=qWords[qIdx];
  const meaning=getMeaning(nm);
  const caso=pick(CASES), num=pick(NUMBERS), gender=pick(GENDERS);
  qCorrect=forms[adjFormKey(gender,caso,num)];
  document.getElementById('adjQCur').textContent=qIdx+1;
  const el=document.getElementById('adjQPrompt');
  el.innerHTML=`
    <div class="word-info">${nm}, ${nf}, ${nn} (gen. ${gen}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${t('adj.study.class',cls)} — ${sub}</div>
    <div class="case-info" style="margin-top:8px;">
      ${t('prompt.gender')} <strong>${GL[gender]}</strong> &nbsp;|&nbsp;
      ${t('prompt.caso')} ${caso} &nbsp;|&nbsp; ${t('prompt.numero')} ${num}
    </div>
    <div class="answer-row">
      <input class="answer-input" id="adjQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
      <button class="submit-btn" id="adjQSubmitBtn" onclick="window._adjQuizCheck()">OK</button>
    </div>`;
  document.getElementById('adjQFeedback').innerHTML='';
  document.getElementById('adjQNextBtn').style.display='none';
  qWaiting=false;
  setTimeout(()=>document.getElementById('adjQInput').focus(),50);
  document.getElementById('adjQInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();if(qWaiting)adjQuizNext();else adjQuizCheck();}
  };
}

export function adjQuizCheck(){
  if(qWaiting)return;
  const inp=document.getElementById('adjQInput');
  const fb=document.getElementById('adjQFeedback');
  if(checkAnswer(inp.value,qCorrect)){
    qHits++;qStreak++;
    if(qStreak>qBestStreak) qBestStreak=qStreak;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct.streak',qCorrect,qStreak)}</div>`;
  } else {
    qStreak=0;
    fb.innerHTML=`<div class="feedback wrong">${t('feedback.wrong.quiz',qCorrect)}</div>`;
  }
  inp.disabled=true;
  document.getElementById('adjQSubmitBtn').disabled=true;
  document.getElementById('adjQAcertos').textContent=qHits;
  document.getElementById('adjQStreak').textContent=qStreak;
  if(qIdx+1>=qTotal){
    document.getElementById('adjQNextBtn').style.display='inline-block';
    document.getElementById('adjQNextBtn').textContent=t('quiz.results.title');
    document.getElementById('adjQNextBtn').onclick=adjQuizEnd;
  } else {
    document.getElementById('adjQNextBtn').style.display='inline-block';
    document.getElementById('adjQNextBtn').textContent=t('quiz.next');
    document.getElementById('adjQNextBtn').onclick=adjQuizNext;
  }
  qWaiting=true;
  document.getElementById('adjQNextBtn').focus();
}

export function adjQuizNext(){
  qIdx++;
  adjQuizShow();
}

export function adjQuizEnd(){
  const pct=Math.round(qHits/qTotal*100);
  let msg='';
  if(pct===100) msg=t('quiz.results.perfect');
  else if(pct>=80) msg=t('quiz.results.great');
  else if(pct>=50) msg=t('quiz.results.good');
  else msg=t('quiz.results.study');
  document.getElementById('adjQResults').innerHTML=`
    <div class="score">${qHits}/${qTotal}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBestStreak}</div>
    <div class="msg">${msg}</div>`;
  showScreen('adj-quiz-results');
}

export function decAdjQCur(){ qIdx=Math.max(0,qIdx-1); }
