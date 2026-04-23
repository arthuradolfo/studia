// ═══════════════════════════════════════════════════════════════════════
// VERB IDENTIFY MODE — Identify tense/person/number from a conjugated form
// ═══════════════════════════════════════════════════════════════════════

import { ALL_VERBS, VERB_TENSES, VERB_PERSONS, VERB_NUMBERS, verbFormKey } from '../data/verbs.js';
import { normalize, pick, shuffle } from '../helpers.js';
import { t, getMeaning } from '../i18n.js';
import { showScreen } from '../app.js';

let idList, idIdx, idTotal, idHits, idWaiting, idCorrectTense, idCorrectPerson, idCorrectNumber, idCorrectForm;

export function isVerbIdWaiting() { return idWaiting; }

export function startVerbIdentify() {
  idList = shuffle([...ALL_VERBS, ...ALL_VERBS, ...ALL_VERBS]);
  idIdx = 0; idTotal = 0; idHits = 0; idWaiting = false;
  document.getElementById('verbIdAcertos').textContent = '0';
  document.getElementById('verbIdTotal').textContent = '0';
  document.getElementById('verbIdPct').textContent = '';
  document.getElementById('verbIdFeedback').innerHTML = '';
  document.getElementById('verbIdNextBtn').style.display = 'none';
  showScreen('verb-tempus');
  verbIdentifyShow();
}

export function verbIdentifyShow() {
  if (idIdx >= idList.length) idIdx = 0;
  const verb = idList[idIdx];
  const [conj, type, nom, inf, perf, sup, forms] = verb;
  const meaning = getMeaning(nom) || '';

  idCorrectTense = pick(VERB_TENSES);
  idCorrectPerson = pick(VERB_PERSONS);
  idCorrectNumber = pick(VERB_NUMBERS);
  const key = verbFormKey(idCorrectTense, idCorrectPerson, idCorrectNumber);
  idCorrectForm = forms[key];

  if (!idCorrectForm || idCorrectForm === '—') {
    idIdx++;
    verbIdentifyShow();
    return;
  }

  const el = document.getElementById('verbIdPrompt');
  el.innerHTML = `
    <div class="word-info" style="font-size:1.2rem;"><strong>${nom}</strong> (${inf}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--gold);font-size:1.3rem;margin:12px 0;letter-spacing:1px;">${idCorrectForm}</div>
    <div class="case-info" style="margin-top:8px;">${t('verb.identify.prompt')}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;align-items:flex-end;">
      <div style="flex:1;min-width:140px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.tense')}</label>
        <select class="answer-input" id="verbIdTenseInput" style="width:100%;">
          ${VERB_TENSES.map(te => `<option value="${te}">${t('verb.tense.' + te)}</option>`).join('')}
        </select>
      </div>
      <div style="min-width:60px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.person')}</label>
        <select class="answer-input" id="verbIdPersonInput" style="width:100%;">
          ${VERB_PERSONS.map(p => `<option value="${p}">${p}ª</option>`).join('')}
        </select>
      </div>
      <div style="min-width:100px;">
        <label style="font-size:0.8rem;color:var(--text-dim);">${t('verb.identify.number')}</label>
        <select class="answer-input" id="verbIdNumberInput" style="width:100%;">
          ${VERB_NUMBERS.map(n => `<option value="${n}">${n}</option>`).join('')}
        </select>
      </div>
      <button class="submit-btn" id="verbIdSubmitBtn" onclick="window._verbIdentifyCheck()">OK</button>
    </div>`;
  document.getElementById('verbIdFeedback').innerHTML = '';
  document.getElementById('verbIdNextBtn').style.display = 'none';
  idWaiting = false;
  setTimeout(() => document.getElementById('verbIdTenseInput').focus(), 50);
}

export function verbIdentifyCheck() {
  if (idWaiting) return;
  const tenseInp = document.getElementById('verbIdTenseInput').value;
  const personInp = document.getElementById('verbIdPersonInput').value;
  const numberInp = document.getElementById('verbIdNumberInput').value;

  idTotal++;
  const fb = document.getElementById('verbIdFeedback');
  const tenseOk = tenseInp === idCorrectTense;
  const personOk = personInp === idCorrectPerson;
  const numberOk = numberInp === idCorrectNumber;
  const allOk = tenseOk && personOk && numberOk;

  const correctDesc = `${t('verb.tense.' + idCorrectTense)}, ${idCorrectPerson}ª ${t('verb.persona')}, ${idCorrectNumber}`;

  if (allOk) {
    idHits++;
    fb.innerHTML = `<div class="feedback correct">${t('feedback.correct', correctDesc)}</div>`;
  } else {
    let details = [];
    if (!tenseOk) details.push(t('verb.identify.tense') + ' ' + t('verb.tense.' + idCorrectTense));
    if (!personOk) details.push(t('verb.identify.person') + ' ' + idCorrectPerson + 'ª');
    if (!numberOk) details.push(t('verb.identify.number') + ' ' + idCorrectNumber);
    fb.innerHTML = `<div class="feedback wrong">${t('feedback.wrong', correctDesc)}</div>`;
  }

  document.getElementById('verbIdTenseInput').disabled = true;
  document.getElementById('verbIdPersonInput').disabled = true;
  document.getElementById('verbIdNumberInput').disabled = true;
  document.getElementById('verbIdSubmitBtn').disabled = true;
  document.getElementById('verbIdAcertos').textContent = idHits;
  document.getElementById('verbIdTotal').textContent = idTotal;
  document.getElementById('verbIdPct').textContent = idTotal ? Math.round(idHits / idTotal * 100) + '%' : '';
  document.getElementById('verbIdNextBtn').style.display = 'inline-block';
  idWaiting = true;
  document.getElementById('verbIdNextBtn').focus();
}

export function verbIdentifyNext() {
  idIdx++;
  verbIdentifyShow();
}
