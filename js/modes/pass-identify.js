// ═══════════════════════════════════════════════════════════════════════
// PASSIVE IDENTIFY MODE — Identify tense/person/number from passive form
// ═══════════════════════════════════════════════════════════════════════

import { ALL_PASSIVE_VERBS, PASSIVE_TENSES } from '../data/passive.js';
import { VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { normalize, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let idList, idIdx, idTotal, idHits, idWaiting, idCorrectTense, idCorrectPerson, idCorrectNumber, idCorrectForm;

export function isPassIdWaiting() { return idWaiting; }

export function startPassIdentify() {
  idList = shuffle([...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS, ...ALL_PASSIVE_VERBS]);
  idIdx = 0; idTotal = 0; idHits = 0; idWaiting = false;
  document.getElementById('passIdAcertos').textContent = '0';
  document.getElementById('passIdTotal').textContent = '0';
  document.getElementById('passIdPct').textContent = '';
  document.getElementById('passIdFeedback').innerHTML = '';
  document.getElementById('passIdNextBtn').style.display = 'none';
  showScreen('pass-tempus');
  passIdentifyShow();
}

export function passIdentifyShow() {
  if (idIdx >= idList.length) idIdx = 0;
  const verb = idList[idIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';

  idCorrectTense = pick(PASSIVE_TENSES);
  idCorrectPerson = pick(VERB_PERSONS);
  idCorrectNumber = pick(VERB_NUMBERS);
  const key = verbFormKey(idCorrectTense, idCorrectPerson, idCorrectNumber);
  idCorrectForm = forms[key];

  if (!idCorrectForm || idCorrectForm === '—') {
    idIdx++;
    passIdentifyShow();
    return;
  }

  const el = document.getElementById('passIdPrompt');
  el.innerHTML = `
    <div class="word-info" style="font-size:1.2rem;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;letter-spacing:1px;">${idCorrectForm}</div>
    <div class="case-info" style="margin-top:8px;">${t('pass.identify.prompt')}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;align-items:flex-end;">
      <div style="flex:1;min-width:140px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.tense')}</label>
        <select class="answer-input" id="passIdTenseInput" style="width:100%;">
          ${PASSIVE_TENSES.map(te => `<option value="${te}">${t('pass.tense.' + te)}</option>`).join('')}
        </select>
      </div>
      <div style="min-width:60px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.person')}</label>
        <select class="answer-input" id="passIdPersonInput" style="width:100%;">
          ${VERB_PERSONS.map(p => `<option value="${p}">${p}ª</option>`).join('')}
        </select>
      </div>
      <div style="min-width:100px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.number')}</label>
        <select class="answer-input" id="passIdNumberInput" style="width:100%;">
          ${VERB_NUMBERS.map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
      </div>
      <button class="submit-btn" id="passIdSubmitBtn" onclick="window._passIdentifyCheck()">OK</button>
    </div>`;
  document.getElementById('passIdFeedback').innerHTML = '';
  document.getElementById('passIdNextBtn').style.display = 'none';
  idWaiting = false;
  setTimeout(() => document.getElementById('passIdTenseInput').focus(), 50);
}

export function passIdentifyCheck() {
  if (idWaiting) return;
  const tenseInp = document.getElementById('passIdTenseInput').value;
  const personInp = document.getElementById('passIdPersonInput').value;
  const numberInp = document.getElementById('passIdNumberInput').value;

  idTotal++;
  const fb = document.getElementById('passIdFeedback');
  const tenseOk = tenseInp === idCorrectTense;
  const personOk = personInp === idCorrectPerson;
  const numberOk = numberInp === idCorrectNumber;
  const allOk = tenseOk && personOk && numberOk;

  const correctDesc = `${t('pass.tense.' + idCorrectTense)}, ${idCorrectPerson}ª ${t('verb.persona')}, ${idCorrectNumber}`;

  if (allOk) {
    idHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', correctDesc)}</div>`;
  } else {
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', correctDesc)}</div>`;
  }

  document.getElementById('passIdTenseInput').disabled = true;
  document.getElementById('passIdPersonInput').disabled = true;
  document.getElementById('passIdNumberInput').disabled = true;
  document.getElementById('passIdSubmitBtn').disabled = true;
  document.getElementById('passIdAcertos').textContent = idHits;
  document.getElementById('passIdTotal').textContent = idTotal;
  document.getElementById('passIdPct').textContent = idTotal ? Math.round(idHits / idTotal * 100) + '%' : '';
  document.getElementById('passIdNextBtn').style.display = 'inline-block';
  idWaiting = true;
  document.getElementById('passIdNextBtn').focus();
}

export function passIdentifyNext() {
  idIdx++;
  passIdentifyShow();
}
