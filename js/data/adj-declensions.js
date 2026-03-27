// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE DECLENSION GENERATORS
// ═══════════════════════════════════════════════════════════════════════

import {
  _f, decl1, decl2_us, decl2_um, decl2_er
} from './declensions.js';

export const GENDERS = ["m","f","n"];

// Merge 3 gendered form objects into one with g_ prefix
function _af(mF,fF,nF){
  const r={};
  for(const [k,v] of Object.entries(mF)) r["m_"+k]=v;
  for(const [k,v] of Object.entries(fF)) r["f_"+k]=v;
  for(const [k,v] of Object.entries(nF)) r["n_"+k]=v;
  return r;
}

// ─── 1st CLASS (1st/2nd declension) ───

// magnus, -a, -um
export function adj1_us(s){
  return _af(decl2_us(s),decl1(s),decl2_um(s));
}

// miser, -era, -erum (stem kept in oblique)
export function adj1_er_kept(nom,s){
  return _af(decl2_er(nom,s),decl1(s),decl2_um(s));
}

// pulcher, -chra, -chrum (stem changes)
export function adj1_er_changed(nom,s){
  return _af(decl2_er(nom,s),decl1(s),decl2_um(s));
}

// ─── 2nd CLASS (3rd declension) ───
// Key features: abl.sg -ī, gen.pl -ium, neut nom/acc/voc pl -ia

// Triform: acer, acris, acre
export function adj2_tri(nom_m,nom_f,nom_n,s){
  return _af(
    _f(nom_m,s+"is",s+"ī",s+"em",nom_m,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom_f,s+"is",s+"ī",s+"em",nom_f,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom_n,s+"is",s+"ī",nom_n,nom_n,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus")
  );
}

// Biform: fortis, forte (m/f same, n different)
export function adj2_bi(nom_mf,nom_n,s){
  return _af(
    _f(nom_mf,s+"is",s+"ī",s+"em",nom_mf,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom_mf,s+"is",s+"ī",s+"em",nom_mf,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom_n,s+"is",s+"ī",nom_n,nom_n,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus")
  );
}

// Uniform: prudens, prudentis (one form for all genders in nom)
export function adj2_uni(nom,s){
  return _af(
    _f(nom,s+"is",s+"ī",s+"em",nom,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom,s+"is",s+"ī",s+"em",nom,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus"),
    _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus")
  );
}
