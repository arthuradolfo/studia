// ═══════════════════════════════════════════════════════════════════════
// ADJECTIVE LISTS — depends on adj-declensions.js
// ═══════════════════════════════════════════════════════════════════════

import {
  adj1_us, adj1_er_kept, adj1_er_changed,
  adj2_tri, adj2_bi, adj2_uni
} from './adj-declensions.js';

// Format: [class, sub_type, nom_m, nom_f, nom_n, gen, forms]

// ─── PARADIGM ADJECTIVES (study) ───
export const ADJ_PARADIGMS = [
  // 1st class — regular (-us/-a/-um)
  ["I","Triformis (-us/-a/-um)","magnus","magna","magnum","magnī",adj1_us("magn")],
  // 1st class — -er kept (miser)
  ["I","Triformis (-er/-era/-erum)","miser","misera","miserum","miserī",adj1_er_kept("miser","miser")],
  // 1st class — -er changed (pulcher)
  ["I","Triformis (-er/-ra/-rum)","pulcher","pulchra","pulchrum","pulchrī",adj1_er_changed("pulcher","pulchr")],
  // 2nd class — triform
  ["II","Triformis (3 formas)","ācer","ācris","ācre","ācris",adj2_tri("ācer","ācris","ācre","ācr")],
  // 2nd class — biform
  ["II","Biformis (-is/-e)","fortis","fortis","forte","fortis",adj2_bi("fortis","forte","fort")],
  // 2nd class — uniform
  ["II","Uniformis (-ns/-ntis)","prūdēns","prūdēns","prūdēns","prūdentis",adj2_uni("prūdēns","prūdent")],
];

// ─── EXTRA ADJECTIVES ───
export const ADJ_EXTRA = [
  // ── 1st CLASS ──
  // -us/-a/-um
  ["I","Triformis (-us/-a/-um)","bonus","bona","bonum","bonī",adj1_us("bon")],
  ["I","Triformis (-us/-a/-um)","malus","mala","malum","malī",adj1_us("mal")],
  ["I","Triformis (-us/-a/-um)","clārus","clāra","clārum","clārī",adj1_us("clār")],
  ["I","Triformis (-us/-a/-um)","altus","alta","altum","altī",adj1_us("alt")],
  ["I","Triformis (-us/-a/-um)","longus","longa","longum","longī",adj1_us("long")],
  ["I","Triformis (-us/-a/-um)","lātus","lāta","lātum","lātī",adj1_us("lāt")],
  ["I","Triformis (-us/-a/-um)","parvus","parva","parvum","parvī",adj1_us("parv")],
  ["I","Triformis (-us/-a/-um)","frigidus","frigida","frigidum","frigidī",adj1_us("frigid")],
  ["I","Triformis (-us/-a/-um)","grātus","grāta","grātum","grātī",adj1_us("grāt")],
  ["I","Triformis (-us/-a/-um)","impavidus","impavida","impavidum","impavidī",adj1_us("impavid")],
  ["I","Triformis (-us/-a/-um)","bellicōsus","bellicōsa","bellicōsum","bellicōsī",adj1_us("bellicōs")],
  ["I","Triformis (-us/-a/-um)","fēcundus","fēcunda","fēcundum","fēcundī",adj1_us("fēcund")],
  ["I","Triformis (-us/-a/-um)","antīquus","antīqua","antīquum","antīquī",adj1_us("antīqu")],
  ["I","Triformis (-us/-a/-um)","Latīnus","Latīna","Latīnum","Latīnī",adj1_us("Latīn")],
  ["I","Triformis (-us/-a/-um)","probus","proba","probum","probī",adj1_us("prob")],
  // -er/-era/-erum (stem kept)
  ["I","Triformis (-er/-era/-erum)","tener","tenera","tenerum","tenerī",adj1_er_kept("tener","tener")],
  ["I","Triformis (-er/-era/-erum)","līber","lībera","līberum","līberī",adj1_er_kept("līber","līber")],
  ["I","Triformis (-er/-era/-erum)","piger","pigra","pigrum","pigrī",adj1_er_changed("piger","pigr")],
  ["I","Triformis (-er/-era/-erum)","asper","aspera","asperum","asperī",adj1_er_kept("asper","asper")],
  ["I","Triformis (-er/-era/-erum)","prosper","prospera","prosperum","prosperī",adj1_er_kept("prosper","prosper")],
  // -er/-ra/-rum (stem changes)
  ["I","Triformis (-er/-ra/-rum)","niger","nigra","nigrum","nigrī",adj1_er_changed("niger","nigr")],
  ["I","Triformis (-er/-ra/-rum)","sacer","sacra","sacrum","sacrī",adj1_er_changed("sacer","sacr")],

  // ── 2nd CLASS ──
  // Triform
  ["II","Triformis (3 formas)","celer","celeris","celere","celeris",adj2_tri("celer","celeris","celere","celer")],
  ["II","Triformis (3 formas)","celeber","celebris","celebre","celebris",adj2_tri("celeber","celebris","celebre","celebr")],
  ["II","Triformis (3 formas)","campester","campestris","campestre","campestris",adj2_tri("campester","campestris","campestre","campestr")],
  ["II","Triformis (3 formas)","alacer","alacris","alacre","alacris",adj2_tri("alacer","alacris","alacre","alacr")],
  // Biform
  ["II","Biformis (-is/-e)","gravis","gravis","grave","gravis",adj2_bi("gravis","grave","grav")],
  ["II","Biformis (-is/-e)","brevis","brevis","breve","brevis",adj2_bi("brevis","breve","brev")],
  ["II","Biformis (-is/-e)","tristis","tristis","triste","tristis",adj2_bi("tristis","triste","trist")],
  ["II","Biformis (-is/-e)","omnis","omnis","omne","omnis",adj2_bi("omnis","omne","omn")],
  ["II","Biformis (-is/-e)","nōbilis","nōbilis","nōbile","nōbilis",adj2_bi("nōbilis","nōbile","nōbil")],
  ["II","Biformis (-is/-e)","facilis","facilis","facile","facilis",adj2_bi("facilis","facile","facil")],
  ["II","Biformis (-is/-e)","ūtilis","ūtilis","ūtile","ūtilis",adj2_bi("ūtilis","ūtile","ūtil")],
  ["II","Biformis (-is/-e)","dulcis","dulcis","dulce","dulcis",adj2_bi("dulcis","dulce","dulc")],
  ["II","Biformis (-is/-e)","fidēlis","fidēlis","fidēle","fidēlis",adj2_bi("fidēlis","fidēle","fidēl")],
  ["II","Biformis (-is/-e)","admīrābilis","admīrābilis","admīrābile","admīrābilis",adj2_bi("admīrābilis","admīrābile","admīrābil")],
  ["II","Biformis (-is/-e)","notābilis","notābilis","notābile","notābilis",adj2_bi("notābilis","notābile","notābil")],
  ["II","Biformis (-is/-e)","vehemēns","vehemēns","vehemēns","vehementis",adj2_uni("vehemēns","vehement")],
  // Uniform
  ["II","Uniformis (-x/-cis)","fēlīx","fēlīx","fēlīx","fēlīcis",adj2_uni("fēlīx","fēlīc")],
  ["II","Uniformis (-x/-cis)","audāx","audāx","audāx","audācis",adj2_uni("audāx","audāc")],
  ["II","Uniformis (-x/-cis)","simplex","simplex","simplex","simplicis",adj2_uni("simplex","simplic")],
  ["II","Uniformis (-ns/-ntis)","clēmēns","clēmēns","clēmēns","clēmentis",adj2_uni("clēmēns","clēment")],
  ["II","Uniformis (-ns/-ntis)","potēns","potēns","potēns","potentis",adj2_uni("potēns","potent")],
  ["II","Uniformis (-ns/-ntis)","sapiēns","sapiēns","sapiēns","sapientis",adj2_uni("sapiēns","sapient")],
];

export const ALL_ADJECTIVES = ADJ_PARADIGMS.concat(ADJ_EXTRA);
