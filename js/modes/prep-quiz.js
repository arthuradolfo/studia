// ═══════════════════════════════════════════════════════════════════════
// PREPOSITION QUIZ MODE
// ═══════════════════════════════════════════════════════════════════════

import { NUMBERS } from '../data/declensions.js';
import { PREPOSITIONS } from '../data/prepositions.js';
import { ALL_WORDS } from '../data/words.js';
import { checkAnswer, formKey, pick, shuffle, normalize } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let qPreps,qIdx,qMax,qHits,qStreak,qBestStreak,qWaiting,qCorrect,qType;

export function isPrepQWaiting(){ return qWaiting; }
export function prepStepQuiz(d){
  const el=document.getElementById('prepQuizNum');
  el.value=Math.max(1,Math.min(200,(parseInt(el.value)||10)+d));
}

export function startPrepQuiz(){
  qMax=parseInt(document.getElementById('prepQuizNum').value)||10;
  qPreps=shuffle([...PREPOSITIONS,...PREPOSITIONS,...PREPOSITIONS,...PREPOSITIONS]);
  qIdx=0;qHits=0;qStreak=0;qBestStreak=0;qWaiting=false;
  document.getElementById('prepQCur').textContent='1';
  document.getElementById('prepQTotal').textContent=qMax;
  document.getElementById('prepQAcertos').textContent='0';
  document.getElementById('prepQStreak').textContent='0';
  document.getElementById('prepQFeedback').innerHTML='';
  document.getElementById('prepQNextBtn').style.display='none';
  showScreen('prep-quiz');
  prepQuizShow();
}

export function prepQuizShow(){
  if(qIdx>=qPreps.length) qIdx=0;
  const prep=qPreps[qIdx];
  qType=Math.random()<0.4?'case':'form';
  document.getElementById('prepQCur').textContent=qIdx+1;
  const el=document.getElementById('prepQPrompt');

  if(qType==='case'){
    qCorrect=prep.case;
    el.innerHTML=`
      <div class="word-info" style="font-size:1.2rem;"><strong>${prep.prep}</strong></div>
      <div style="color:var(--text-dim);font-size:0.9rem;">${t('prep.meaning.'+prep.context)}</div>
      <div class="case-info" style="margin-top:8px;">${t('prep.which_case')}</div>
      <div class="answer-row">
        <input class="answer-input" id="prepQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Accusativus / Ablativus">
        <button class="submit-btn" id="prepQSubmitBtn" onclick="window._prepQuizCheck()">OK</button>
      </div>`;
  } else {
    const word=pick(ALL_WORDS);
    const [dec,sub,nom,gen,gender,forms]=word;
    const meaning=getMeaning(nom);
    const num=pick(NUMBERS);
    qCorrect=forms[formKey(prep.case,num)];
    el.innerHTML=`
      <div class="word-info" style="font-size:1.2rem;"><strong>${prep.prep}</strong> + ${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
      <div style="color:var(--text-dim);font-size:0.9rem;">${t('prep.meaning.'+prep.context)} — ${num}</div>
      <div class="case-info" style="margin-top:8px;">${t('prep.give_form')}</div>
      <div class="answer-row">
        <input class="answer-input" id="prepQInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="${t('practice.placeholder')}">
        <button class="submit-btn" id="prepQSubmitBtn" onclick="window._prepQuizCheck()">OK</button>
      </div>`;
  }
  document.getElementById('prepQFeedback').innerHTML='';
  document.getElementById('prepQNextBtn').style.display='none';
  qWaiting=false;
  setTimeout(()=>document.getElementById('prepQInput').focus(),50);
  document.getElementById('prepQInput').onkeydown=function(e){
    if(e.key==='Enter'){e.preventDefault();if(qWaiting)prepQuizNext();else prepQuizCheck();}
  };
}

export function prepQuizCheck(){
  if(qWaiting)return;
  const inp=document.getElementById('prepQInput');
  const fb=document.getElementById('prepQFeedback');
  const isCorrect=qType==='case'
    ? normalize(inp.value)===normalize(qCorrect)
    : checkAnswer(inp.value,qCorrect);
  if(isCorrect){
    qHits++;qStreak++;
    if(qStreak>qBestStreak) qBestStreak=qStreak;
    fb.innerHTML=`<div class="feedback correct">${t('feedback.correct.streak',qCorrect,qStreak)}</div>`;
  } else {
    qStreak=0;
    fb.innerHTML=`<div class="feedback wrong">${t('feedback.wrong.quiz',qCorrect)}</div>`;
  }
  inp.disabled=true;
  document.getElementById('prepQSubmitBtn').disabled=true;
  document.getElementById('prepQAcertos').textContent=qHits;
  document.getElementById('prepQStreak').textContent=qStreak;
  if(qIdx+1>=qMax){
    document.getElementById('prepQNextBtn').style.display='inline-block';
    document.getElementById('prepQNextBtn').textContent=t('quiz.results.title');
    document.getElementById('prepQNextBtn').onclick=prepQuizEnd;
  } else {
    document.getElementById('prepQNextBtn').style.display='inline-block';
    document.getElementById('prepQNextBtn').textContent=t('quiz.next');
    document.getElementById('prepQNextBtn').onclick=prepQuizNext;
  }
  qWaiting=true;
  document.getElementById('prepQNextBtn').focus();
}

export function prepQuizNext(){
  qIdx++;
  prepQuizShow();
}

export function prepQuizEnd(){
  const pct=Math.round(qHits/qMax*100);
  let msg='';
  if(pct===100) msg=t('quiz.results.perfect');
  else if(pct>=80) msg=t('quiz.results.great');
  else if(pct>=50) msg=t('quiz.results.good');
  else msg=t('quiz.results.study');
  document.getElementById('prepQResults').innerHTML=`
    <div class="score">${qHits}/${qMax}</div>
    <div class="pct">${pct}%</div>
    <div>${t('quiz.results.best.streak')} ${qBestStreak}</div>
    <div class="msg">${msg}</div>`;
  showScreen('prep-quiz-results');
}
