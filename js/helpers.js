// ═══════════════════════════════════════════════════════════════════════
// HELPERS — shared utilities used by all modes
// ═══════════════════════════════════════════════════════════════════════

import { getMeaning } from './i18n.js';

const MACRON_MAP = {"ā":"a","ē":"e","ī":"i","ō":"o","ū":"u","Ā":"A","Ē":"E","Ī":"I","Ō":"O","Ū":"U"};

export function stripMacrons(s) {
  return s.replace(/[āēīōūĀĒĪŌŪ]/g,c=>MACRON_MAP[c]||c);
}

export function normalize(s) {
  return stripMacrons(s).trim().toLowerCase();
}

export function checkAnswer(input,correct) {
  return normalize(input)===normalize(correct);
}

export function formKey(c,n) {
  return c+"_"+n;
}

export function shuffle(a) {
  for(let i=a.length-1;i>0;i--) {
    const j=Math.floor(Math.random()*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}

export function pick(a){
  return a[Math.floor(Math.random()*a.length)];
}

// Word data format: [dec, sub, nom, gen, gender, forms]
// Meaning is now resolved via getMeaning(nom) from translation layer
export function wordMeaning(w) {
  return getMeaning(w[2]);
}
