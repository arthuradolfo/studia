// ═══════════════════════════════════════════════════════════════════════
// CHALLENGE MODE
// ═══════════════════════════════════════════════════════════════════════

import { CASES, NUMBERS } from '../data/declensions.js';
import { WORDS } from '../data/words.js';
import { checkAnswer, formKey, pick, wordMeaning } from '../helpers.js';
import { t } from '../i18n.js';
import { showScreen } from '../app.js';

let desafioForms, desafioWord;

export function getDesafioWord() { return desafioWord; }

export function startDesafio(){
  desafioWord=pick(WORDS);
  const [dec,sub,nom,gen,gender,forms]=desafioWord;
  const meaning=wordMeaning(desafioWord);
  desafioForms=forms;
  document.getElementById('desafioWord').innerHTML=`
    <div class="word-info" style="font-size:1.1rem;">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${t('study.card.title',dec,sub)}</div>`;

  const grid=document.getElementById('desafioGrid');
  grid.innerHTML='';
  NUMBERS.forEach(num=>{
    const col=document.createElement('div');
    col.className='challenge-col';
    col.innerHTML=`<h3>${num}</h3>`;
    CASES.forEach(c=>{
      const row=document.createElement('div');
      row.className='challenge-row';
      const id=`des_${c}_${num}`;
      row.innerHTML=`<label>${c}</label><input id="${id}" type="text" autocomplete="off" autocapitalize="off" spellcheck="false">`;
      col.appendChild(row);
    });
    grid.appendChild(col);
  });

  document.getElementById('desafioResults').innerHTML='';
  document.getElementById('desafioSubmit').style.display='inline-block';
  document.getElementById('desafioSubmit').textContent=t('challenge.submit');
  document.getElementById('desafioSubmit').onclick=checkDesafio;
  showScreen('desafio');
  setTimeout(()=>{
    const first=document.getElementById(`des_${CASES[0]}_${NUMBERS[0]}`);
    if(first)first.focus();
  },50);
  const inputs=grid.querySelectorAll('input');
  inputs.forEach((inp,i)=>{
    inp.onkeydown=function(e){
      if(e.key==='Enter'){
        e.preventDefault();
        if(i<inputs.length-1) inputs[i+1].focus();
        else checkDesafio();
      }
    };
  });
}

export function checkDesafio(){
  let hits=0, total=0, errors=[];
  NUMBERS.forEach(num=>{
    CASES.forEach(c=>{
      const id=`des_${c}_${num}`;
      const inp=document.getElementById(id);
      const correct=desafioForms[formKey(c,num)];
      total++;
      if(checkAnswer(inp.value,correct)){
        hits++;
        inp.classList.add('correct-field');
        inp.classList.remove('wrong-field');
      } else {
        inp.classList.add('wrong-field');
        inp.classList.remove('correct-field');
        errors.push({caso:c,num:num,given:inp.value||t('feedback.empty'),correct:correct});
      }
      inp.disabled=true;
    });
  });
  const pct=Math.round(hits/total*100);
  let msg='';
  if(pct===100) msg=t('challenge.perfect');
  else if(pct>=80) msg=t('challenge.almost');
  const res=document.getElementById('desafioResults');
  let html=`<div class="results-box">
    <div class="score">${hits}/${total}</div>
    <div class="pct">${pct}%</div>
    ${msg?`<div class="msg">${msg}</div>`:''}`;
  if(errors.length){
    html+=`<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">${t('challenge.errors')}</h3>`;
    errors.forEach(e=>{
      html+=`<div class="err-row">${e.caso} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html+=`</div>`;
  }
  html+=`</div>`;
  res.innerHTML=html;
  const btn=document.getElementById('desafioSubmit');
  btn.textContent=t('challenge.new');
  btn.onclick=startDesafio;
}
