// ═══════════════════════════════════════════════════════════════════════
// DATA LAYER
// ═══════════════════════════════════════════════════════════════════════

const CASES = ["Nominativus","Genitivus","Dativus","Accusativus","Vocativus","Ablativus"];
const NUMBERS = ["Singularis","Pluralis"];

function _f(ns,gs,ds,acs,vs,ab,np,gp,dp,acp,vp,abp) {
  return {
    "Nominativus_Singularis":ns,"Genitivus_Singularis":gs,"Dativus_Singularis":ds,
    "Accusativus_Singularis":acs,"Vocativus_Singularis":vs,"Ablativus_Singularis":ab,
    "Nominativus_Pluralis":np,"Genitivus_Pluralis":gp,"Dativus_Pluralis":dp,
    "Accusativus_Pluralis":acp,"Vocativus_Pluralis":vp,"Ablativus_Pluralis":abp
  };
}

function decl1(s){return _f(s+"a",s+"ae",s+"ae",s+"am",s+"a",s+"ā",s+"ae",s+"ārum",s+"īs",s+"ās",s+"ae",s+"īs");}
function decl2_us(s){return _f(s+"us",s+"ī",s+"ō",s+"um",s+"e",s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
function decl2_ius(s){return _f(s+"ius",s+"iī",s+"iō",s+"ium",s+"ī",s+"iō",s+"iī",s+"iōrum",s+"iīs",s+"iōs",s+"iī",s+"iīs");}
function decl2_er(nom,s){return _f(nom,s+"ī",s+"ō",s+"um",nom,s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
function decl2_ir(nom,s){return _f(nom,s+"ī",s+"ō",s+"um",nom,s+"ō",s+"ī",s+"ōrum",s+"īs",s+"ōs",s+"ī",s+"īs");}
function decl2_um(s){return _f(s+"um",s+"ī",s+"ō",s+"um",s+"um",s+"ō",s+"a",s+"ōrum",s+"īs",s+"a",s+"a",s+"īs");}
function decl3_cons(nom,s,g="m."){
  if(g==="n.")return _f(nom,s+"is",s+"ī",nom,nom,s+"e",s+"a",s+"um",s+"ibus",s+"a",s+"a",s+"ibus");
  return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"um",s+"ibus",s+"ēs",s+"ēs",s+"ibus");
}
function decl3_mixed(nom,s){return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
function decl3_i(nom,s){return _f(nom,s+"is",s+"ī",s+"em",nom,s+"e",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
function decl3_i_turris(nom,s){return _f(nom,s+"is",s+"ī",s+"im",nom,s+"ī",s+"ēs",s+"ium",s+"ibus",s+"ēs",s+"ēs",s+"ibus");}
function decl3_neut_e(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
function decl3_neut_al(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
function decl3_neut_ar(nom,s){return _f(nom,s+"is",s+"ī",nom,nom,s+"ī",s+"ia",s+"ium",s+"ibus",s+"ia",s+"ia",s+"ibus");}
function decl4_us(s){return _f(s+"us",s+"ūs",s+"uī",s+"um",s+"us",s+"ū",s+"ūs",s+"uum",s+"ibus",s+"ūs",s+"ūs",s+"ibus");}
function decl4_u(s){return _f(s+"ū",s+"ūs",s+"ū",s+"ū",s+"ū",s+"ū",s+"ua",s+"uum",s+"ibus",s+"ua",s+"ua",s+"ibus");}
function decl5(nom,s,gs,ds){
  const g=gs||(s+"eī");const d=ds||g;
  return _f(nom,g,d,s+"em",nom,s+"ē",nom,s+"ērum",s+"ēbus",nom,nom,s+"ēbus");
}

// ─── WORDS (study paradigms) ───
const WORDS = [
  ["I","Feminina (-a, -ae)","rosa","rosae","f.","rosa",decl1("ros")],
  ["II","Masculina (-us, -ī)","dominus","dominī","m.","senhor",decl2_us("domin")],
  ["II","Masculina (-er, -ī) — puer","puer","puerī","m.","menino",decl2_er("puer","puer")],
  ["II","Masculina (-er, -ī) — ager","ager","agrī","m.","campo",decl2_er("ager","agr")],
  ["II","Masculina (-ir, -ī) — vir","vir","virī","m.","homem",decl2_ir("vir","vir")],
  ["II","Neutra (-um, -ī)","bellum","bellī","n.","guerra",decl2_um("bell")],
  ["III","Consoante (m.)","rex","regis","m.","rei",decl3_cons("rex","reg")],
  ["III","Consoante (f.)","nox","noctis","f.","noite",decl3_mixed("nox","noct")],
  ["III","Tema em -i (m./f.)","civis","civis","m./f.","cidadão",decl3_i("civis","civ")],
  ["III","Neutra (consoante) — corpus","corpus","corporis","n.","corpo",decl3_cons("corpus","corpor","n.")],
  ["III","Neutra (consoante) — caput","caput","capitis","n.","cabeça",decl3_cons("caput","capit","n.")],
  ["III","Neutra (consoante) — nōmen","nōmen","nōminis","n.","nome",decl3_cons("nōmen","nōmin","n.")],
  ["III","Neutra (tema em -i) — mare","mare","maris","n.","mar",decl3_neut_e("mare","mar")],
  ["III","Neutra (tema em -i) — animal","animal","animālis","n.","animal",decl3_neut_al("animal","animāl")],
  ["III","Neutra (tema em -i) — exemplar","exemplar","exemplāris","n.","exemplar",decl3_neut_ar("exemplar","exemplār")],
  ["IV","Masculina (-us, -ūs)","fructus","fructūs","m.","fruto",decl4_us("fruct")],
  ["IV","Neutra (-ū, -ūs)","cornū","cornūs","n.","chifre",decl4_u("corn")],
  ["V","Feminina (-ēs, -eī)","rēs","reī","f.","coisa",decl5("rēs","r","reī","reī")],
  ["V","m./f. (-ēs, -ēī)","diēs","diēī","m./f.","dia",decl5("diēs","di","diēī","diēī")],
];

// ─── EXTRA WORDS ───
const EXTRA_WORDS = [
  // I DECLINATIO
  ["I","Feminina (-a, -ae)","aqua","aquae","f.","água",decl1("aqu")],
  ["I","Feminina (-a, -ae)","terra","terrae","f.","terra",decl1("terr")],
  ["I","Feminina (-a, -ae)","puella","puellae","f.","menina",decl1("puell")],
  ["I","Masculina (-a, -ae)","nauta","nautae","m.","marinheiro",decl1("naut")],
  ["I","Masculina (-a, -ae)","agricola","agricolae","m.","agricultor",decl1("agricol")],
  ["I","Feminina (-a, -ae)","via","viae","f.","caminho",decl1("vi")],
  ["I","Feminina (-a, -ae)","vita","vitae","f.","vida",decl1("vit")],
  ["I","Feminina (-a, -ae)","fīlia","fīliae","f.","filha",decl1("fīli")],
  ["I","Feminina (-a, -ae)","silva","silvae","f.","floresta",decl1("silv")],
  ["I","Feminina (-a, -ae)","patria","patriae","f.","pátria",decl1("patri")],
  ["I","Feminina (-a, -ae)","porta","portae","f.","porta/portão",decl1("port")],
  ["I","Feminina (-a, -ae)","causa","causae","f.","causa",decl1("caus")],
  ["I","Feminina (-a, -ae)","cūra","cūrae","f.","cuidado",decl1("cūr")],
  ["I","Feminina (-a, -ae)","fōrma","fōrmae","f.","forma/beleza",decl1("fōrm")],
  ["I","Feminina (-a, -ae)","fortūna","fortūnae","f.","fortuna",decl1("fortūn")],
  ["I","Feminina (-a, -ae)","grātia","grātiae","f.","graça/favor",decl1("grāti")],
  ["I","Feminina (-a, -ae)","īra","īrae","f.","ira",decl1("īr")],
  ["I","Feminina (-a, -ae)","līttera","lītterae","f.","letra",decl1("lītter")],
  ["I","Feminina (-a, -ae)","nātūra","nātūrae","f.","natureza",decl1("nātūr")],
  ["I","Feminina (-a, -ae)","pecūnia","pecūniae","f.","dinheiro",decl1("pecūni")],
  ["I","Feminina (-a, -ae)","poena","poenae","f.","pena/castigo",decl1("poen")],
  ["I","Feminina (-a, -ae)","prōvincia","prōvinciae","f.","província",decl1("prōvinci")],
  ["I","Feminina (-a, -ae)","sapientia","sapientiae","f.","sabedoria",decl1("sapienti")],
  ["I","Masculina (-a, -ae)","poēta","poētae","m.","poeta",decl1("poēt")],
  ["I","Masculina (-a, -ae)","incola","incolae","m.","habitante",decl1("incol")],
  ["I","Feminina (-a, -ae)","fāma","fāmae","f.","fama/reputação",decl1("fām")],
  ["I","Feminina (-a, -ae)","flamma","flammae","f.","chama",decl1("flamm")],
  ["I","Feminina (-a, -ae)","pugna","pugnae","f.","luta/batalha",decl1("pugn")],
  // II DECLINATIO
  ["II","Masculina (-us, -ī)","servus","servī","m.","escravo",decl2_us("serv")],
  ["II","Masculina (-us, -ī)","amīcus","amīcī","m.","amigo",decl2_us("amīc")],
  ["II","Masculina (-us, -ī)","filius","filiī","m.","filho",decl2_ius("fil")],
  ["II","Neutra (-um, -ī)","verbum","verbī","n.","palavra",decl2_um("verb")],
  ["II","Neutra (-um, -ī)","templum","templī","n.","templo",decl2_um("templ")],
  ["II","Masculina (-er, -ī) — magister","magister","magistrī","m.","mestre",decl2_er("magister","magistr")],
  ["II","Masculina (-us, -ī)","animus","animī","m.","ânimo/alma",decl2_us("anim")],
  ["II","Masculina (-us, -ī)","campus","campī","m.","planície",decl2_us("camp")],
  ["II","Masculina (-us, -ī)","equus","equī","m.","cavalo",decl2_us("equ")],
  ["II","Masculina (-us, -ī)","locus","locī","m.","lugar",decl2_us("loc")],
  ["II","Masculina (-us, -ī)","modus","modī","m.","modo/medida",decl2_us("mod")],
  ["II","Masculina (-us, -ī)","mūrus","mūrī","m.","muro",decl2_us("mūr")],
  ["II","Masculina (-us, -ī)","numerus","numerī","m.","número",decl2_us("numer")],
  ["II","Masculina (-us, -ī)","populus","populī","m.","povo",decl2_us("popul")],
  ["II","Masculina (-us, -ī)","ventus","ventī","m.","vento",decl2_us("vent")],
  ["II","Masculina (-us, -ī)","annus","annī","m.","ano",decl2_us("ann")],
  ["II","Masculina (-us, -ī)","gladius","gladiī","m.","espada",decl2_ius("glad")],
  ["II","Masculina (-us, -ī)","deus","deī","m.","deus",decl2_us("de")],
  ["II","Masculina (-us, -ī)","hortus","hortī","m.","jardim",decl2_us("hort")],
  ["II","Masculina (-us, -ī)","oculus","oculī","m.","olho",decl2_us("ocul")],
  ["II","Masculina (-er, -ī) — liber","liber","librī","m.","livro",decl2_er("liber","libr")],
  ["II","Masculina (-er, -ī) — socer","socer","socerī","m.","sogro",decl2_er("socer","socer")],
  ["II","Neutra (-um, -ī)","dōnum","dōnī","n.","dom/presente",decl2_um("dōn")],
  ["II","Neutra (-um, -ī)","oppidum","oppidī","n.","cidade fortificada",decl2_um("oppid")],
  ["II","Neutra (-um, -ī)","periculum","periculī","n.","perigo",decl2_um("pericul")],
  ["II","Neutra (-um, -ī)","rēgnum","rēgnī","n.","reino",decl2_um("rēgn")],
  ["II","Neutra (-um, -ī)","signum","signī","n.","sinal/estandarte",decl2_um("sign")],
  ["II","Neutra (-um, -ī)","cōnsilium","cōnsiliī","n.","conselho/plano",decl2_um("cōnsili")],
  ["II","Neutra (-um, -ī)","praemium","praemiī","n.","prêmio",decl2_um("praemi")],
  ["II","Neutra (-um, -ī)","auxilium","auxiliī","n.","auxílio",decl2_um("auxili")],
  ["II","Masculina (-us, -ī)","discipulus","discipulī","m.","aluno",decl2_us("discipul")],
  ["II","Masculina (-us, -ī)","medicus","medicī","m.","médico",decl2_us("medic")],
  // III DECLINATIO
  ["III","Consoante (m.)","mīles","mīlitis","m.","soldado",decl3_cons("mīles","mīlit")],
  ["III","Consoante (m.)","cōnsul","cōnsulis","m.","cônsul",decl3_cons("cōnsul","cōnsul")],
  ["III","Consoante (f.)","vōx","vōcis","f.","voz",decl3_cons("vōx","vōc","f.")],
  ["III","Consoante (f.)","lēx","lēgis","f.","lei",decl3_cons("lēx","lēg","f.")],
  ["III","Consoante (m.)","pater","patris","m.","pai",decl3_cons("pater","patr")],
  ["III","Consoante (f.)","māter","mātris","f.","mãe",decl3_cons("māter","mātr","f.")],
  ["III","Consoante (m.)","homō","hominis","m.","homem",decl3_cons("homō","homin")],
  ["III","Consoante (n.) — tempus","tempus","temporis","n.","tempo",decl3_cons("tempus","tempor","n.")],
  ["III","Consoante (n.) — flūmen","flūmen","flūminis","n.","rio",decl3_cons("flūmen","flūmin","n.")],
  ["III","Misto (f.) — urbs","urbs","urbis","f.","cidade",decl3_mixed("urbs","urb")],
  ["III","Misto (m.) — mōns","mōns","montis","m.","monte",decl3_mixed("mōns","mont")],
  ["III","Tema em -i (m.)","hostis","hostis","m.","inimigo",decl3_i("hostis","host")],
  ["III","Tema em -i (f.)","turris","turris","f.","torre",decl3_i_turris("turris","turr")],
  ["III","Consoante (m.)","dux","ducis","m.","líder/general",decl3_cons("dux","duc")],
  ["III","Consoante (m.)","prīnceps","prīncipis","m.","príncipe/primeiro",decl3_cons("prīnceps","prīncip")],
  ["III","Consoante (m.)","sōl","sōlis","m.","sol",decl3_cons("sōl","sōl")],
  ["III","Consoante (m.)","leō","leōnis","m.","leão",decl3_cons("leō","leōn")],
  ["III","Consoante (m.)","sermō","sermōnis","m.","discurso",decl3_cons("sermō","sermōn")],
  ["III","Consoante (m.)","ōrdō","ōrdinis","m.","ordem/fileira",decl3_cons("ōrdō","ōrdin")],
  ["III","Consoante (m.)","imperātor","imperātōris","m.","imperador/general",decl3_cons("imperātor","imperātōr")],
  ["III","Consoante (m.)","ōrātor","ōrātōris","m.","orador",decl3_cons("ōrātor","ōrātōr")],
  ["III","Consoante (m.)","labor","labōris","m.","trabalho",decl3_cons("labor","labōr")],
  ["III","Consoante (m.)","honor","honōris","m.","honra",decl3_cons("honor","honōr")],
  ["III","Consoante (m.)","frāter","frātris","m.","irmão",decl3_cons("frāter","frātr")],
  ["III","Consoante (m.)","senātor","senātōris","m.","senador",decl3_cons("senātor","senātōr")],
  ["III","Consoante (m.)","pastor","pastōris","m.","pastor",decl3_cons("pastor","pastōr")],
  ["III","Consoante (m.)","iūdex","iūdicis","m.","juiz",decl3_cons("iūdex","iūdic")],
  ["III","Consoante (m.)","pēs","pedis","m.","pé",decl3_cons("pēs","ped")],
  ["III","Consoante (m.)","custōs","custōdis","m.","guarda",decl3_cons("custōs","custōd")],
  ["III","Consoante (f.)","crux","crucis","f.","cruz",decl3_cons("crux","cruc","f.")],
  ["III","Consoante (m.)","nepōs","nepōtis","m.","neto",decl3_cons("nepōs","nepōt")],
  ["III","Consoante (m.)","sacerdōs","sacerdōtis","m.","sacerdote",decl3_cons("sacerdōs","sacerdōt")],
  ["III","Consoante (f.)","pāx","pācis","f.","paz",decl3_cons("pāx","pāc","f.")],
  ["III","Consoante (f.)","lūx","lūcis","f.","luz",decl3_cons("lūx","lūc","f.")],
  ["III","Consoante (f.)","virtūs","virtūtis","f.","virtude/coragem",decl3_cons("virtūs","virtūt","f.")],
  ["III","Consoante (f.)","salūs","salūtis","f.","saúde/salvação",decl3_cons("salūs","salūt","f.")],
  ["III","Consoante (f.)","lībertās","lībertātis","f.","liberdade",decl3_cons("lībertās","lībertāt","f.")],
  ["III","Consoante (f.)","cīvitās","cīvitātis","f.","cidadania/estado",decl3_cons("cīvitās","cīvitāt","f.")],
  ["III","Consoante (f.)","vēritās","vēritātis","f.","verdade",decl3_cons("vēritās","vēritāt","f.")],
  ["III","Consoante (f.)","aetās","aetātis","f.","idade/época",decl3_cons("aetās","aetāt","f.")],
  ["III","Consoante (f.)","voluntās","voluntātis","f.","vontade",decl3_cons("voluntās","voluntāt","f.")],
  ["III","Consoante (f.)","potestās","potestātis","f.","poder",decl3_cons("potestās","potestāt","f.")],
  ["III","Consoante (f.)","mulier","mulieris","f.","mulher",decl3_cons("mulier","mulier","f.")],
  ["III","Consoante (f.)","soror","sorōris","f.","irmã",decl3_cons("soror","sorōr","f.")],
  ["III","Consoante (f.)","uxor","uxōris","f.","esposa",decl3_cons("uxor","uxōr","f.")],
  ["III","Consoante (f.)","arbor","arboris","f.","árvore",decl3_cons("arbor","arbor","f.")],
  ["III","Consoante (n.)","iter","itineris","n.","caminho/viagem",decl3_cons("iter","itiner","n.")],
  ["III","Consoante (n.)","genus","generis","n.","gênero/tipo",decl3_cons("genus","gener","n.")],
  ["III","Consoante (n.)","opus","operis","n.","obra/trabalho",decl3_cons("opus","oper","n.")],
  ["III","Consoante (n.)","lītus","lītoris","n.","litoral/praia",decl3_cons("lītus","lītor","n.")],
  ["III","Consoante (n.)","sīdus","sīderis","n.","estrela/constelação",decl3_cons("sīdus","sīder","n.")],
  ["III","Consoante (n.)","vulnus","vulneris","n.","ferida",decl3_cons("vulnus","vulner","n.")],
  ["III","Consoante (n.)","carmen","carminis","n.","canto/poema",decl3_cons("carmen","carmin","n.")],
  ["III","Consoante (n.)","lūmen","lūminis","n.","luz/lume",decl3_cons("lūmen","lūmin","n.")],
  ["III","Consoante (n.)","ōmen","ōminis","n.","presságio",decl3_cons("ōmen","ōmin","n.")],
  ["III","Misto (f.)","pars","partis","f.","parte",decl3_mixed("pars","part")],
  ["III","Misto (f.)","ars","artis","f.","arte",decl3_mixed("ars","art")],
  ["III","Misto (f.)","mors","mortis","f.","morte",decl3_mixed("mors","mort")],
  ["III","Misto (f.)","gēns","gentis","f.","família/nação",decl3_mixed("gēns","gent")],
  ["III","Misto (f.)","mēns","mentis","f.","mente",decl3_mixed("mēns","ment")],
  ["III","Misto (m.)","pōns","pontis","m.","ponte",decl3_mixed("pōns","pont")],
  ["III","Misto (m.)","dēns","dentis","m.","dente",decl3_mixed("dēns","dent")],
  ["III","Misto (f.)","frons","frontis","f.","fronte/fachada",decl3_mixed("frons","front")],
  ["III","Misto (f.)","stirps","stirpis","f.","tronco/raiz",decl3_mixed("stirps","stirp")],
  ["III","Tema em -i (m.)","ignis","ignis","m.","fogo",decl3_i("ignis","ign")],
  ["III","Tema em -i (f.)","nāvis","nāvis","f.","navio",decl3_i_turris("nāvis","nāv")],
  ["III","Tema em -i (f.)","classis","classis","f.","frota/classe",decl3_i("classis","class")],
  ["III","Tema em -i (f.)","febris","febris","f.","febre",decl3_i_turris("febris","febr")],
  ["III","Tema em -i (f.)","sitis","sitis","f.","sede",decl3_i_turris("sitis","sit")],
  ["III","Tema em -i (m.)","collis","collis","m.","colina",decl3_i("collis","coll")],
  ["III","Tema em -i (m.)","fīnis","fīnis","m.","fim/fronteira",decl3_i("fīnis","fīn")],
  ["III","Neutra (-e)","sedīle","sedīlis","n.","assento",decl3_neut_e("sedīle","sedīl")],
  ["III","Neutra (-al)","tribūnal","tribūnālis","n.","tribunal",decl3_neut_al("tribūnal","tribūnāl")],
  ["III","Neutra (-al)","vectigal","vectigālis","n.","imposto",decl3_neut_al("vectigal","vectigāl")],
  ["III","Neutra (-al)","capital","capitālis","n.","crime capital",decl3_neut_al("capital","capitāl")],
  ["III","Neutra (-ar)","calcar","calcāris","n.","esporão",decl3_neut_ar("calcar","calcār")],
  ["III","Neutra (-ar)","pulvīnar","pulvīnāris","n.","almofada sagrada",decl3_neut_ar("pulvīnar","pulvīnār")],
  // IV DECLINATIO
  ["IV","Feminina (-us, -ūs)","manus","manūs","f.","mão",decl4_us("man")],
  ["IV","Masculina (-us, -ūs)","lacus","lacūs","m.","lago",decl4_us("lac")],
  ["IV","Neutra (-ū, -ūs)","genū","genūs","n.","joelho",decl4_u("gen")],
  ["IV","Masculina (-us, -ūs)","exercitus","exercitūs","m.","exército",decl4_us("exercit")],
  ["IV","Masculina (-us, -ūs)","senātus","senātūs","m.","senado",decl4_us("senāt")],
  ["IV","Masculina (-us, -ūs)","cursus","cursūs","m.","corrida/curso",decl4_us("curs")],
  ["IV","Masculina (-us, -ūs)","cāsus","cāsūs","m.","queda/caso",decl4_us("cās")],
  ["IV","Masculina (-us, -ūs)","ēventus","ēventūs","m.","resultado",decl4_us("ēvent")],
  ["IV","Masculina (-us, -ūs)","impetus","impetūs","m.","ataque/ímpeto",decl4_us("impet")],
  ["IV","Masculina (-us, -ūs)","metus","metūs","m.","medo",decl4_us("met")],
  ["IV","Masculina (-us, -ūs)","passus","passūs","m.","passo",decl4_us("pass")],
  ["IV","Masculina (-us, -ūs)","portus","portūs","m.","porto",decl4_us("port")],
  ["IV","Masculina (-us, -ūs)","ritus","ritūs","m.","rito",decl4_us("rit")],
  ["IV","Masculina (-us, -ūs)","spiritus","spiritūs","m.","espírito/sopro",decl4_us("spirit")],
  ["IV","Masculina (-us, -ūs)","vultus","vultūs","m.","rosto/expressão",decl4_us("vult")],
  ["IV","Feminina (-us, -ūs)","domus","domūs","f.","casa",decl4_us("dom")],
  ["IV","Feminina (-us, -ūs)","tribus","tribūs","f.","tribo",decl4_us("trib")],
  ["IV","Feminina (-us, -ūs)","acus","acūs","f.","agulha",decl4_us("ac")],
  ["IV","Neutra (-ū, -ūs)","verū","verūs","n.","espeto",decl4_u("ver")],
  ["IV","Neutra (-ū, -ūs)","gelū","gelūs","n.","gelo/frio",decl4_u("gel")],
  ["IV","Masculina (-us, -ūs)","gradus","gradūs","m.","passo/degrau",decl4_us("grad")],
  ["IV","Masculina (-us, -ūs)","adventus","adventūs","m.","chegada",decl4_us("advent")],
  ["IV","Masculina (-us, -ūs)","comitātus","comitātūs","m.","comitiva",decl4_us("comitāt")],
  // V DECLINATIO
  ["V","Feminina (-ēs, -ēī)","fidēs","fideī","f.","fé",decl5("fidēs","fid","fideī","fideī")],
  ["V","Feminina (-ēs, -ēī)","spēs","speī","f.","esperança",decl5("spēs","sp","speī","speī")],
  ["V","Feminina (-ēs, -ēī)","faciēs","faciēī","f.","face/aspecto",decl5("faciēs","faci","faciēī","faciēī")],
  ["V","Feminina (-ēs, -ēī)","effigiēs","effigiēī","f.","imagem/estátua",decl5("effigiēs","effigi","effigiēī","effigiēī")],
  ["V","Feminina (-ēs, -ēī)","māteriēs","māteriēī","f.","matéria",decl5("māteriēs","māteri","māteriēī","māteriēī")],
  ["V","Feminina (-ēs, -ēī)","seriēs","seriēī","f.","série/sequência",decl5("seriēs","seri","seriēī","seriēī")],
  ["V","Feminina (-ēs, -ēī)","speciēs","speciēī","f.","aparência/espécie",decl5("speciēs","speci","speciēī","speciēī")],
  ["V","Feminina (-ēs, -ēī)","glaciēs","glaciēī","f.","gelo",decl5("glaciēs","glaci","glaciēī","glaciēī")],
  ["V","Feminina (-ēs, -ēī)","prōgeniēs","prōgeniēī","f.","descendência",decl5("prōgeniēs","prōgeni","prōgeniēī","prōgeniēī")],
  ["V","Feminina (-ēs, -ēī)","plānitiēs","plānitiēī","f.","planície",decl5("plānitiēs","plāniti","plānitiēī","plānitiēī")],
  ["V","Feminina (-ēs, -eī)","aciēs","acieī","f.","linha de batalha/fio",decl5("aciēs","aci","acieī","acieī")],
  ["V","Feminina (-ēs, -eī)","pernitiēs","pernitiēī","f.","destruição",decl5("pernitiēs","perniti","pernitiēī","pernitiēī")],
  ["V","Feminina (-ēs, -eī)","requiēs","requieī","f.","descanso",decl5("requiēs","requi","requieī","requieī")],
  ["V","Feminina (-ēs, -eī)","cariēs","carieī","f.","podridão",decl5("cariēs","cari","carieī","carieī")],
  ["V","Feminina (-ēs, -eī)","rabbiēs","rabieī","f.","raiva/fúria",decl5("rabbiēs","rabbi","rabieī","rabieī")],
  ["V","Feminina (-ēs, -eī)","canītiēs","canītiēī","f.","cabelo branco/velhice",decl5("canītiēs","canīti","canītiēī","canītiēī")],
  ["V","Feminina (-ēs, -eī)","lūxuriēs","lūxuriēī","f.","luxúria",decl5("lūxuriēs","lūxuri","lūxuriēī","lūxuriēī")],
  ["V","Feminina (-ēs, -eī)","māceriēs","māceriēī","f.","parede/cerca",decl5("māceriēs","māceri","māceriēī","māceriēī")],
];

const ALL_WORDS = WORDS.concat(EXTRA_WORDS);

// ═══════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════

const MACRON_MAP = {"ā":"a","ē":"e","ī":"i","ō":"o","ū":"u","Ā":"A","Ē":"E","Ī":"I","Ō":"O","Ū":"U"};
function stripMacrons(s){return s.replace(/[āēīōūĀĒĪŌŪ]/g,c=>MACRON_MAP[c]||c);}
function normalize(s){return stripMacrons(s).trim().toLowerCase();}
function checkAnswer(input,correct){return normalize(input)===normalize(correct);}
function formKey(c,n){return c+"_"+n;}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function pick(a){return a[Math.floor(Math.random()*a.length)];}

// ═══════════════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════════════

function showScreen(id){
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

// ═══════════════════════════════════════════════════════════════════════
// ESTUDO — NOTAS GRAMATICAIS (do declinationes.md)
// ═══════════════════════════════════════════════════════════════════════

// Notes keyed by nom_sg of the paradigm word
const NOTES = {
  "rosa": `Alguns substantivos da 1ª declinação são masculinos (e.g. <em>nauta, -ae</em> — marinheiro; <em>agricola, -ae</em> — agricultor; <em>poēta, -ae</em> — poeta). <small>(Allen &amp; Greenough, §42; Faria; Ernout &amp; Thomas)</small>`,

  "dominus": `Alguns substantivos da 2ª declinação são femininos, apesar da terminação em -us: nomes de árvores (<em>fagus, -ī</em> — faia; <em>pīnus, -ī</em> — pinheiro), cidades (<em>Corinthus, -ī</em>), ilhas (<em>Rhodus, -ī</em>), países (<em>Aegyptus, -ī</em>), e palavras como <em>humus, -ī</em> (solo), <em>alvus, -ī</em> (ventre), <em>colus, -ī</em> (roca) e <em>vannus, -ī</em> (peneira). <small>(Allen &amp; Greenough, §48; Faria; Ernout &amp; Thomas)</small>`,

  "vir": `<em>Vir</em> é o único substantivo em -ir da 2ª declinação. Seus compostos seguem o mesmo padrão: <em>triumvir, -ī</em> (triúnviro), <em>decemvir, -ī</em> (decênviro). <small>(Allen &amp; Greenough, §47; Faria; Ernout &amp; Thomas)</small>`,

  "nox": `Embora <em>rex</em> e <em>nox</em> sejam ambos imparissilábicos (tema em consoante), <em>nox</em> apresenta <strong>-ium</strong> no genitivo plural em vez de <strong>-um</strong>. A regra é: substantivos imparissilábicos cujo tema termina em <strong>dois ou mais fonemas consonantais</strong> antes do <em>-is</em> do genitivo singular (noct-is: /kt/) seguem o genitivo plural dos temas em -i (-ium). Já <em>rex</em> (reg-is: apenas /g/) segue a flexão pura em consoante (-um). Outros exemplos como <em>nox</em>: <em>urbs, urbis</em> (gen. pl. <em>urbium</em>), <em>mons, montis</em> (gen. pl. <em>montium</em>), <em>ars, artis</em> (gen. pl. <em>artium</em>). <small>(Allen &amp; Greenough, §71; Faria; Ernout &amp; Thomas)</small>`,

  "civis": `<em>Civis</em> é um substantivo de <strong>gênero comum</strong> (<em>commune</em>) — a forma não muda, e o gênero é determinado pelo referente e indicado pelo adjetivo: <em>civis Rōmānus</em> (m.) / <em>civis Rōmāna</em> (f.). Outros exemplos de gênero comum na 3ª declinação: <em>hostis</em> (inimigo/a), <em>testis</em> (testemunha), <em>comes</em> (companheiro/a). <small>(Allen &amp; Greenough, §34; Faria; Ernout &amp; Thomas)</small>`,

  "corpus": `Neutros de tema em consoante seguem a regra geral: nom./acus./voc. plural em <strong>-a</strong>, genitivo plural em <strong>-um</strong>, ablativo singular em <strong>-e</strong>. As terminações mais comuns no nominativo são <strong>-us</strong> (<em>corpus, temporis</em>), <strong>-ut</strong> (<em>caput, capitis</em>) e <strong>-men</strong> (<em>nōmen, nōminis</em>; <em>flūmen, flūminis</em>). Nos em -men, o radical se forma com o sufixo -min- (nōmen → nōmin-). <small>(Allen &amp; Greenough, §58–59, §63–64; Faria; Ernout &amp; Thomas)</small>`,

  "mare": `Neutros de tema em -i diferem dos de tema em consoante em três pontos: nom./acus./voc. plural em <strong>-ia</strong> (não -a), genitivo plural em <strong>-ium</strong> (não -um), e ablativo singular em <strong>-ī</strong> (não -e). As terminações mais comuns no nominativo são <strong>-e</strong> (<em>mare, maris</em>), <strong>-al</strong> (<em>animal, animālis</em>; <em>tribūnal, tribūnālis</em>) e <strong>-ar</strong> (<em>exemplar, exemplāris</em>; <em>calcar, calcāris</em>). <small>(Allen &amp; Greenough, §68–69; Faria; Ernout &amp; Thomas)</small>`,

  "diēs": `<em>Diēs</em> pode ser masculino ou feminino no singular; no plural é sempre masculino. <small>(Allen &amp; Greenough, §97; Faria; Ernout &amp; Thomas)</small>`,
};

// General note for III declension (shown before the III tables)
const DECL_GENERAL_NOTES = {
  "III": `A 3ª declinação reúne dois grandes grupos, classificados pelo <strong>tema</strong> — a raiz à qual se adicionam as desinências. Nos de <strong>tema em consoante</strong> (imparissilábicos), o radical termina em consoante (e.g. <em>reg-</em>, <em>corpor-</em>); nos de <strong>tema em -i</strong> (parissilábicos), o radical termina na vogal -i- (e.g. <em>civ-i-</em>, <em>mar-i-</em>). O nome "imparissilábico" vem do número <strong>desigual</strong> de sílabas entre nominativo e genitivo singular (<em>rex</em> / <em>re-gis</em>: 1 vs. 2), enquanto "parissilábico" indica número <strong>igual</strong> (<em>ci-vis</em> / <em>ci-vis</em>: 2 vs. 2). Essa divisão atravessa <strong>todos os gêneros</strong> e explica as variações nas desinências:
<table><tr><th>Desinência</th><th>Tema em consoante</th><th>Tema em -i</th></tr>
<tr><td>Gen. plural (m./f./n.)</td><td><strong>-um</strong></td><td><strong>-ium</strong></td></tr>
<tr><td>Abl. singular (neutro)</td><td><strong>-e</strong></td><td><strong>-ī</strong></td></tr>
<tr><td>Nom./acus./voc. pl. (neutro)</td><td><strong>-a</strong></td><td><strong>-ia</strong></td></tr></table>
Há ainda os chamados <strong>mistos</strong>: imparissilábicos cujo tema termina em duas ou mais consoantes antes do <em>-is</em> (e.g. <em>nox, noct-is</em>: /kt/), que adotam o gen. plural em <strong>-ium</strong> dos temas em -i, mesmo sendo imparissilábicos. <small>(Allen &amp; Greenough, §54–78; Faria; Ernout &amp; Thomas)</small>`,
};

// ═══════════════════════════════════════════════════════════════════════
// ESTUDO
// ═══════════════════════════════════════════════════════════════════════

function initEstudo(){
  const byDec={};
  WORDS.forEach(w=>{(byDec[w[0]]=byDec[w[0]]||[]).push(w);});
  const keys=Object.keys(byDec).sort();
  const sel=document.getElementById('decSelector');
  sel.innerHTML='';
  keys.forEach(k=>{
    const b=document.createElement('button');
    b.textContent=k+'ª Decl.';
    b.onclick=()=>{
      sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
      b.classList.add('selected');
      renderTables(byDec[k]);
    };
    sel.appendChild(b);
  });
  const allBtn=document.createElement('button');
  allBtn.textContent='Todas';
  allBtn.onclick=()=>{
    sel.querySelectorAll('button').forEach(x=>x.classList.remove('selected'));
    allBtn.classList.add('selected');
    renderTables(WORDS);
  };
  sel.appendChild(allBtn);
}

function renderTables(words){
  const el=document.getElementById('tables');
  el.innerHTML='';
  let shownGeneralNotes=new Set();
  words.forEach(w=>{
    const [dec,sub,nom,gen,gender,meaning,forms]=w;
    // General note for this declension (shown once before first table of that decl)
    if(DECL_GENERAL_NOTES[dec] && !shownGeneralNotes.has(dec)){
      shownGeneralNotes.add(dec);
      el.innerHTML+=`<div class="decl-note-general"><span class="note-label">Nota geral (${dec}ª decl.):</span> ${DECL_GENERAL_NOTES[dec]}</div>`;
    }
    let table=`<table class="decl-table">
      <tr><th>Casus</th><th>Singularis</th><th>Pluralis</th></tr>`;
    CASES.forEach(c=>{
      table+=`<tr><td style="color:var(--parchment-dim)">${c}</td><td>${forms[formKey(c,"Singularis")]}</td><td>${forms[formKey(c,"Pluralis")]}</td></tr>`;
    });
    table+='</table>';
    let note='';
    if(NOTES[nom]){
      note=`<div class="decl-note"><span class="note-label">Nota:</span> ${NOTES[nom]}</div>`;
    }
    el.innerHTML+=`<details class="decl-card">
      <summary><span class="card-title">${dec}ª Declinatio — ${sub}<br><small>${nom}, ${gen} (${gender}) = ${meaning}</small></span></summary>
      <div class="card-body">${table}${note}</div>
    </details>`;
  });
}

// ═══════════════════════════════════════════════════════════════════════
// PRÁTICA
// ═══════════════════════════════════════════════════════════════════════

let prWords,prIdx,prCorrect,prTotal,prHits,prWaiting;

function startPratica(){
  prWords=shuffle([...ALL_WORDS]);
  prIdx=0; prTotal=0; prHits=0; prWaiting=false;
  document.getElementById('prAcertos').textContent='0';
  document.getElementById('prTotal').textContent='0';
  document.getElementById('prPct').textContent='';
  document.getElementById('prFeedback').innerHTML='';
  document.getElementById('prNextBtn').style.display='none';
  showScreen('pratica');
  praticaShow();
}

function praticaShow(){
  if(prIdx>=prWords.length) prIdx=0;
  const [dec,sub,nom,gen,gender,meaning,forms]=prWords[prIdx];
  const caso=pick(CASES), num=pick(NUMBERS);
  prCorrect=forms[formKey(caso,num)];
  const el=document.getElementById('prPrompt');
  el.innerHTML=`
    <div class="word-info">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.85rem;">${dec}ª Declinatio, ${sub}</div>
    <div class="case-info" style="margin-top:8px;">Caso: ${caso} &nbsp;|&nbsp; Número: ${num}</div>
    <div class="answer-row">
      <input class="answer-input" id="prInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Sua resposta...">
      <button class="submit-btn" id="prSubmitBtn" onclick="praticaCheck()">OK</button>
    </div>`;
  document.getElementById('prFeedback').innerHTML='';
  document.getElementById('prNextBtn').style.display='none';
  prWaiting=false;
  setTimeout(()=>document.getElementById('prInput').focus(),50);
  const inp=document.getElementById('prInput');
  inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();if(prWaiting)praticaNext();else praticaCheck();}};
}

function praticaCheck(){
  if(prWaiting)return;
  const inp=document.getElementById('prInput');
  const answer=inp.value;
  prTotal++;
  const fb=document.getElementById('prFeedback');
  if(checkAnswer(answer,prCorrect)){
    prHits++;
    fb.innerHTML=`<div class="feedback correct">✓ Correto! (${prCorrect})</div>`;
  } else {
    fb.innerHTML=`<div class="feedback wrong">✗ Errado. Resposta correta: <strong>${prCorrect}</strong></div>`;
  }
  inp.disabled=true;
  document.getElementById('prSubmitBtn').disabled=true;
  document.getElementById('prAcertos').textContent=prHits;
  document.getElementById('prTotal').textContent=prTotal;
  document.getElementById('prPct').textContent=prTotal?Math.round(prHits/prTotal*100)+'%':'';
  document.getElementById('prNextBtn').style.display='inline-block';
  prWaiting=true;
  document.getElementById('prNextBtn').focus();
}

function praticaNext(){
  prIdx++;
  praticaShow();
}

// ═══════════════════════════════════════════════════════════════════════
// QUIZ
// ═══════════════════════════════════════════════════════════════════════

function stepQuiz(d){
  const inp=document.getElementById('quizNum');
  inp.value=Math.min(200,Math.max(1,(parseInt(inp.value)||10)+d));
}

let qNum,qCur,qHits,qStreak,qBest,qCorrect,qWaiting;

function startQuiz(){
  qNum=parseInt(document.getElementById('quizNum').value)||10;
  if(qNum<1)qNum=1; if(qNum>999)qNum=999;
  qCur=0; qHits=0; qStreak=0; qBest=0; qWaiting=false;
  document.getElementById('qTotal').textContent=qNum;
  document.getElementById('qAcertos').textContent='0';
  document.getElementById('qStreak').textContent='0';
  document.getElementById('qFeedback').innerHTML='';
  document.getElementById('qNextBtn').style.display='none';
  showScreen('quiz');
  quizShow();
}

function quizShow(){
  qCur++;
  if(qCur>qNum){quizEnd();return;}
  document.getElementById('qCur').textContent=qCur;
  const w=pick(ALL_WORDS);
  const [dec,sub,nom,gen,gender,meaning,forms]=w;
  const caso=pick(CASES), num=pick(NUMBERS);
  qCorrect=forms[formKey(caso,num)];
  const el=document.getElementById('qPrompt');
  el.innerHTML=`
    <div class="word-info">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div class="case-info">Declinar no ${caso}, ${num}:</div>
    <div class="answer-row">
      <input class="answer-input" id="qInput" type="text" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Sua resposta...">
      <button class="submit-btn" id="qSubmitBtn" onclick="quizCheck()">OK</button>
    </div>`;
  document.getElementById('qFeedback').innerHTML='';
  document.getElementById('qNextBtn').style.display='none';
  qWaiting=false;
  setTimeout(()=>document.getElementById('qInput').focus(),50);
  const inp=document.getElementById('qInput');
  inp.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();if(qWaiting)quizNext();else quizCheck();}};
}

function quizCheck(){
  if(qWaiting)return;
  const inp=document.getElementById('qInput');
  const answer=inp.value;
  const fb=document.getElementById('qFeedback');
  if(checkAnswer(answer,qCorrect)){
    qHits++; qStreak++;
    if(qStreak>qBest) qBest=qStreak;
    let extra=qStreak>=3?` — Sequência: ${qStreak}!`:'';
    fb.innerHTML=`<div class="feedback correct">✓ Correto! (${qCorrect})${extra}</div>`;
  } else {
    qStreak=0;
    fb.innerHTML=`<div class="feedback wrong">✗ Errado. Correto: <strong>${qCorrect}</strong></div>`;
  }
  inp.disabled=true;
  document.getElementById('qSubmitBtn').disabled=true;
  document.getElementById('qAcertos').textContent=qHits;
  document.getElementById('qStreak').textContent=qStreak;
  qWaiting=true;
  if(qCur<qNum){
    document.getElementById('qNextBtn').style.display='inline-block';
    document.getElementById('qNextBtn').focus();
  } else {
    // Last question — show results after brief delay
    setTimeout(quizEnd,800);
  }
}

function quizNext(){
  quizShow();
}

function quizEnd(){
  const pct=qNum>0?Math.round(qHits/qNum*100):0;
  let msg='';
  if(pct===100) msg='Excelente! Perfeito!';
  else if(pct>=80) msg='Muito bem! Continue praticando.';
  else if(pct>=60) msg='Bom, mas revise as declinações que errou.';
  else msg='Recomendo voltar ao modo Estudo antes de tentar novamente.';
  document.getElementById('qResults').innerHTML=`
    <div class="score">${qHits}/${qNum}</div>
    <div class="pct">${pct}%</div>
    <div>Melhor sequência: ${qBest}</div>
    <div class="msg" style="margin-top:8px;">${msg}</div>`;
  showScreen('quiz-results');
}

// ═══════════════════════════════════════════════════════════════════════
// DESAFIO
// ═══════════════════════════════════════════════════════════════════════

let desafioForms, desafioWord;

function startDesafio(){
  desafioWord=pick(WORDS);
  const [dec,sub,nom,gen,gender,meaning,forms]=desafioWord;
  desafioForms=forms;
  document.getElementById('desafioWord').innerHTML=`
    <div class="word-info" style="font-size:1.1rem;">${nom}, ${gen} (${gender}) — <span class="meaning">${meaning}</span></div>
    <div style="color:var(--text-dim);font-size:0.9rem;">${dec}ª Declinatio — ${sub}</div>`;

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
  document.getElementById('desafioSubmit').textContent='Verificar';
  showScreen('desafio');
  // Focus first input
  setTimeout(()=>{
    const first=document.getElementById(`des_${CASES[0]}_${NUMBERS[0]}`);
    if(first)first.focus();
  },50);
  // Tab order: Enter moves to next field
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

function checkDesafio(){
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
        errors.push({caso:c,num:num,given:inp.value||'(vazio)',correct:correct});
      }
      inp.disabled=true;
    });
  });
  const pct=Math.round(hits/total*100);
  let msg='';
  if(pct===100) msg='Perfeito! Tente outra palavra.';
  else if(pct>=80) msg='Quase lá! Revise os erros abaixo.';
  const res=document.getElementById('desafioResults');
  let html=`<div class="results-box">
    <div class="score">${hits}/${total}</div>
    <div class="pct">${pct}%</div>
    ${msg?`<div class="msg">${msg}</div>`:''}`;
  if(errors.length){
    html+=`<div class="error-list"><h3 style="color:var(--red);font-size:0.9rem;margin:8px 0 4px;">Erros:</h3>`;
    errors.forEach(e=>{
      html+=`<div class="err-row">${e.caso} ${e.num}: ${e.given} → <span class="correct-val">${e.correct}</span></div>`;
    });
    html+=`</div>`;
  }
  html+=`</div>`;
  res.innerHTML=html;
  // Change button to retry
  const btn=document.getElementById('desafioSubmit');
  btn.textContent='Nova Palavra';
  btn.onclick=startDesafio;
}

// ═══════════════════════════════════════════════════════════════════════
// INIT
// ═══════════════════════════════════════════════════════════════════════

let zoomLevel = parseInt(localStorage.getItem('latin-zoom'))||100;
document.documentElement.style.fontSize = zoomLevel+'%';
function zoom(dir){
  zoomLevel = Math.min(150, Math.max(60, zoomLevel + dir*10));
  document.documentElement.style.fontSize = zoomLevel+'%';
  localStorage.setItem('latin-zoom', zoomLevel);
}

// Theme
let lightTheme = localStorage.getItem('latin-theme')==='light';
if(lightTheme) document.documentElement.classList.add('light');
updateThemeBtn();
function toggleTheme(){
  lightTheme=!lightTheme;
  document.documentElement.classList.toggle('light', lightTheme);
  localStorage.setItem('latin-theme', lightTheme?'light':'dark');
  updateThemeBtn();
}
function updateThemeBtn(){
  document.getElementById('themeBtn').textContent=lightTheme?'☾':'☀';
  document.getElementById('themeBtn').title=lightTheme?'Tema escuro':'Tema claro';
}

document.getElementById('wordCount').textContent=
  `${ALL_WORDS.length} palavras · ${WORDS.length} paradigmas de estudo · ${EXTRA_WORDS.length} palavras extras`;
initEstudo();
