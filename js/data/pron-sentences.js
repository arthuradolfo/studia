// ═══════════════════════════════════════════════════════════════════════
// PRONOUN SENTENCE DATA — Relative pronoun exercises
// ═══════════════════════════════════════════════════════════════════════

// Type: 'fill' = fill the blank with correct relative pronoun
// Type: 'analyze' = identify case/gender/number/function of given pronoun

export const PRON_SENTENCES = [
  // ─── Fill-in-the-blank (Type II from RELATIVOS_COMPLETO) ───
  {
    type: 'fill',
    latin: 'Omnēs rēs ___ Deus creāvit optimae sunt.',
    answer: 'quās',
    antecedent: 'rēs',
    gender: 'f', number: 'Pluralis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Omnēs rēs optimae sunt',
    subClause: 'quās Deus creāvit',
    translation: 'Todas as coisas que Deus criou são ótimas.'
  },
  {
    type: 'fill',
    latin: 'Fīliās ___ pater aegrotus est ēducāvī.',
    answer: 'quārum',
    antecedent: 'fīliās',
    gender: 'f', number: 'Pluralis', case: 'Genitivus',
    function: 'adjunto adnominal',
    mainClause: 'Fīliās ēducāvī',
    subClause: 'quārum pater aegrotus est',
    translation: 'Eduquei as filhas cujo pai está doente.'
  },
  {
    type: 'fill',
    latin: 'Informā nōs magister ad artēs ___ vītam exōrnant.',
    answer: 'quae',
    antecedent: 'artēs',
    gender: 'f', number: 'Pluralis', case: 'Nominativus',
    function: 'sujeito',
    mainClause: 'Informā nōs magister ad artēs',
    subClause: 'quae vītam exōrnant',
    translation: 'Instrui-nos, professor, para as artes que adornam a vida.'
  },
  {
    type: 'fill',
    latin: 'Cīvēs urbis ___ expugnāvistis miserrimī sunt.',
    answer: 'quam',
    antecedent: 'urbis',
    gender: 'f', number: 'Singularis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Cīvēs urbis miserrimī sunt',
    subClause: 'quam expugnāvistis',
    translation: 'Os cidadãos da cidade que conquistastes são miseráveis.'
  },
  {
    type: 'fill',
    latin: 'Animal ___ sanguinem habet cor habet.',
    answer: 'quod',
    antecedent: 'animal',
    gender: 'n', number: 'Singularis', case: 'Nominativus',
    function: 'sujeito',
    mainClause: 'Animal cor habet',
    subClause: 'quod sanguinem habet',
    translation: 'O animal que tem sangue tem coração.'
  },
  {
    type: 'fill',
    latin: 'Rēgem ___ lēgēs sānctae sunt cīvēs colunt.',
    answer: 'cuius',
    antecedent: 'rēgem',
    gender: 'm', number: 'Singularis', case: 'Genitivus',
    function: 'adjunto adnominal',
    mainClause: 'Rēgem cīvēs colunt',
    subClause: 'cuius lēgēs sānctae sunt',
    translation: 'Os cidadãos honram o rei cujas leis são sagradas.'
  },
  {
    type: 'fill',
    latin: 'Ducēs ___ populus Rōmānus magnōs honōrēs mandāvit multī fuērunt.',
    answer: 'quibus',
    antecedent: 'ducēs',
    gender: 'm', number: 'Pluralis', case: 'Dativus',
    function: 'OI',
    mainClause: 'Ducēs multī fuērunt',
    subClause: 'quibus populus Rōmānus magnōs honōrēs mandāvit',
    translation: 'Foram muitos os líderes a quem o povo romano confiou grandes honras.'
  },
  {
    type: 'fill',
    latin: 'Amīcus ___ pecūniam dēbeō aegrotus est.',
    answer: 'cui',
    antecedent: 'amīcus',
    gender: 'm', number: 'Singularis', case: 'Dativus',
    function: 'OI',
    mainClause: 'Amīcus aegrotus est',
    subClause: 'cui pecūniam dēbeō',
    translation: 'O amigo a quem devo dinheiro está doente.'
  },
  {
    type: 'fill',
    latin: 'Incrēmentum ___ imperiō Augustus dedit magnum fuit.',
    answer: 'quod',
    antecedent: 'incrēmentum',
    gender: 'n', number: 'Singularis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Incrēmentum magnum fuit',
    subClause: 'quod imperiō Augustus dedit',
    translation: 'O aumento que Augusto deu ao império foi grande.'
  },
  {
    type: 'fill',
    latin: 'Lēgēs ___ Persae habent nōn sunt sācrae.',
    answer: 'quās',
    antecedent: 'lēgēs',
    gender: 'f', number: 'Pluralis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Lēgēs nōn sunt sācrae',
    subClause: 'quās Persae habent',
    translation: 'As leis que os persas têm não são sagradas.'
  },

  // ─── Analysis (Type I from RELATIVOS_COMPLETO) ───
  {
    type: 'analyze',
    latin: 'Magister laudat discipulōs quī dīligentēs sunt.',
    pronoun: 'quī',
    answer: 'quī',
    antecedent: 'discipulōs',
    gender: 'm', number: 'Pluralis', case: 'Nominativus',
    function: 'sujeito',
    mainClause: 'Magister laudat discipulōs',
    subClause: 'quī dīligentēs sunt',
    translation: 'O professor louva os alunos que são diligentes.'
  },
  {
    type: 'analyze',
    latin: 'Nōn omnēs agrī quōs ille agricola possidet fertilēs sunt.',
    pronoun: 'quōs',
    answer: 'quōs',
    antecedent: 'agrī',
    gender: 'm', number: 'Pluralis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Nōn omnēs agrī fertilēs sunt',
    subClause: 'quōs ille agricola possidet',
    translation: 'Nem todos os campos que aquele agricultor possui são férteis.'
  },
  {
    type: 'analyze',
    latin: 'Pater imāginem quam mihi dōnāvistī laudāvit.',
    pronoun: 'quam',
    answer: 'quam',
    antecedent: 'imāginem',
    gender: 'f', number: 'Singularis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Pater imāginem laudāvit',
    subClause: 'quam mihi dōnāvistī',
    translation: 'O pai louvou a imagem que me presenteaste.'
  },
  {
    type: 'analyze',
    latin: 'Pater cuius fīliās ēducāvī aegrotus est.',
    pronoun: 'cuius',
    answer: 'cuius',
    antecedent: 'pater',
    gender: 'm', number: 'Singularis', case: 'Genitivus',
    function: 'adjunto adnominal',
    mainClause: 'Pater aegrotus est',
    subClause: 'cuius fīliās ēducāvī',
    translation: 'O pai cujas filhas eduquei está doente.'
  },
  {
    type: 'analyze',
    latin: 'Rēx cui omnēs obtemperant ipse lēgibus obtemperat.',
    pronoun: 'cui',
    answer: 'cui',
    antecedent: 'rēx',
    gender: 'm', number: 'Singularis', case: 'Dativus',
    function: 'OI',
    mainClause: 'Rēx ipse lēgibus obtemperat',
    subClause: 'cui omnēs obtemperant',
    translation: 'O rei a quem todos obedecem ele próprio obedece às leis.'
  },
  {
    type: 'analyze',
    latin: 'Vir quem vidēs amīcus meus est.',
    pronoun: 'quem',
    answer: 'quem',
    antecedent: 'vir',
    gender: 'm', number: 'Singularis', case: 'Accusativus',
    function: 'OD',
    mainClause: 'Vir amīcus meus est',
    subClause: 'quem vidēs',
    translation: 'O homem que vês é meu amigo.'
  },
  {
    type: 'analyze',
    latin: 'Fēminās quae in viā ambulant vidēmus.',
    pronoun: 'quae',
    answer: 'quae',
    antecedent: 'fēminās',
    gender: 'f', number: 'Pluralis', case: 'Nominativus',
    function: 'sujeito',
    mainClause: 'Fēminās vidēmus',
    subClause: 'quae in viā ambulant',
    translation: 'Vemos as mulheres que passeiam na rua.'
  },
  {
    type: 'analyze',
    latin: 'Poēta cuius amīcus erat caecus puerum audiēbat.',
    pronoun: 'cuius',
    answer: 'cuius',
    antecedent: 'poēta',
    gender: 'm', number: 'Singularis', case: 'Genitivus',
    function: 'adjunto adnominal',
    mainClause: 'Poēta puerum audiēbat',
    subClause: 'cuius amīcus erat caecus',
    translation: 'O poeta cujo amigo era cego ouvia o menino.'
  },
];

export const PRON_CASES = ['Nominativus', 'Genitivus', 'Dativus', 'Accusativus', 'Ablativus'];
export const PRON_FUNCTIONS = ['sujeito', 'OD', 'OI', 'adjunto adnominal', 'adjunto adverbial'];
