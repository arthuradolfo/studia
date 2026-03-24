// ═══════════════════════════════════════════════════════════════════════
// DECLENSION GENERATORS — pure data logic
// ═══════════════════════════════════════════════════════════════════════

export const CASES = ["Nominativus","Genitivus","Dativus","Accusativus","Vocativus","Ablativus"];
export const NUMBERS = ["Singularis","Pluralis"];

function _f(ns,gs,ds,acs,vs,ab,np,gp,dp,acp,vp,abp) {
  return {
    "Nominativus_Singularis":ns,"Genitivus_Singularis":gs,"Dativus_Singularis":ds,
    "Accusativus_Singularis":acs,"Vocativus_Singularis":vs,"Ablativus_Singularis":ab,
    "Nominativus_Pluralis":np,"Genitivus_Pluralis":gp,"Dativus_Pluralis":dp,
    "Accusativus_Pluralis":acp,"Vocativus_Pluralis":vp,"Ablativus_Pluralis":abp
  };
}

export function decl1(s){return _f(s+"a",s+"ae",s+"ae",s+"am",s+"a",s+"ā",s+"ae",s+"ārum",s+"īs",s+"ās",s+"ae",s+"īs");}
export function decl2_us(s){return _f(s+"us",s+"ī",s+"ō",s+"um",s+"e",s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
export function decl2_ius(s){return _f(s+"ius",s+"iī",s+"iō",s+"ium",s+"ī",s+"iō",s+"iī",s+"iōrum",s+"iīs",s+"iōs",s+"iī",s+"iīs");}
export function decl2_er(nom,s){return _f(nom,s+"ī",s+"ō",s+"um",nom,s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
export function decl2_ir(nom,s){return _f(nom,s+"ī",s+"ō",s+"um",nom,s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
export function decl2_um(s){return _f(s+"um",s+"ī",s+"ō",s+"um",s+"um",s+"ō",s+"a",s+"ōrum",s+"īs",s+"a",s+"a",s+"īs");}
export function decl3_cons(nom,s,g="m."){
  if(g==="n.")return _f(nom,s+"is",s+"ī",nom,nom,s+"e",s+"a",s+"um",s+"ibus",s+"a",s+"a",s+"ibus");
  return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"um",s+"ibus",s+"ēs",s+"ēs",s+"ibus");
}
export function decl3_mixed(nom,s){return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
export function decl3_i(nom,s){return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
export function decl3_i_turris(nom,s){return _f(nom,s+"is",s+"ī",s+"im",nom,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
export function decl3_neut_e(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
export function decl3_neut_al(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
export function decl3_neut_ar(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
export function decl4_us(s){return _f(s+"us",s+"ūs",s+"uī",s+"um",s+"us",s+"ū",s+"ūs",s+"uum",s+"ibus",s+"ūs",s+"ūs",s+"ibus");}
export function decl4_u(s){return _f(s+"ū",s+"ūs",s+"ū",s+"ū",s+"ū",s+"ū",s+"ua",s+"uum",s+"ibus",s+"ua",s+"ua",s+"ibus");}
export function decl5(nom,s,gs,ds){
  const g=gs||(s+"eī");const d=ds||g;
  return _f(nom,g,d,s+"em",nom,s+"ē",nom,s+"ērum",s+"ēbus",nom,nom,s+"ēbus");
}
