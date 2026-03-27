// ═══════════════════════════════════════════════════════════════════════
// PREPOSITION DATA
// ═══════════════════════════════════════════════════════════════════════

// Each entry: { prep, case, context, group }
// context is the i18n key suffix for the meaning

export const PREPOSITIONS = [
  // ─── With Accusative ───
  {prep:"in",  case:"Accusativus",context:"direction", group:"accusativus"},
  {prep:"ad",  case:"Accusativus",context:"toward",    group:"accusativus"},
  {prep:"per", case:"Accusativus",context:"through",   group:"accusativus"},
  {prep:"post",case:"Accusativus",context:"after",     group:"accusativus"},
  {prep:"inter",case:"Accusativus",context:"between",  group:"accusativus"},
  {prep:"apud",case:"Accusativus",context:"at_near",   group:"accusativus"},
  {prep:"ante",case:"Accusativus",context:"before",    group:"accusativus"},
  {prep:"contrā",case:"Accusativus",context:"against", group:"accusativus"},
  {prep:"trāns",case:"Accusativus",context:"across",   group:"accusativus"},
  {prep:"ob",  case:"Accusativus",context:"because_of",group:"accusativus"},
  {prep:"suprā",case:"Accusativus",context:"above",    group:"accusativus"},

  // ─── With Ablative ───
  {prep:"in",  case:"Ablativus",context:"location",    group:"ablativus"},
  {prep:"ē/ex",case:"Ablativus",context:"out_of",      group:"ablativus"},
  {prep:"ā/ab",case:"Ablativus",context:"from_by",     group:"ablativus"},
  {prep:"dē",  case:"Ablativus",context:"down_from",   group:"ablativus"},
  {prep:"cum", case:"Ablativus",context:"with",        group:"ablativus"},
  {prep:"sine",case:"Ablativus",context:"without",     group:"ablativus"},
  {prep:"prō", case:"Ablativus",context:"for_behalf",  group:"ablativus"},
  {prep:"prae",case:"Ablativus",context:"in_front",    group:"ablativus"},
  {prep:"sub", case:"Ablativus",context:"under",       group:"ablativus"},
];

export const PREP_ACC = PREPOSITIONS.filter(p=>p.group==="accusativus");
export const PREP_ABL = PREPOSITIONS.filter(p=>p.group==="ablativus");
