#!/usr/bin/env python3
"""
Declinationes Latinae — Drill interativo para memorização das 5 declinações.

Modos:
  1. Estudo   — mostra as tabelas completas de cada declinação
  2. Prática  — preencha a forma correta dado caso/número/palavra
  3. Quiz     — perguntas aleatórias com pontuação
  4. Desafio  — declinar a palavra inteira (todos os 12 campos)

Uso:
  python3 declinationes_drill.py
"""

import random
import sys
import os
import json

# ─── i18n ─────────────────────────────────────────────────────────────────────

CONFIG_DIR = os.path.expanduser("~/.config/studia")
CONFIG_FILE = os.path.join(CONFIG_DIR, "config.json")

TRANSLATIONS = {
    "pt": {
        "header.title": "DECLINATIONES LATINAE — Drill de Memorização",
        "menu.1": "1. Estudo    — Ver tabelas completas",
        "menu.2": "2. Prática   — Preencher formas aleatórias",
        "menu.3": "3. Quiz      — Perguntas com pontuação",
        "menu.4": "4. Desafio   — Declinar palavra inteira",
        "menu.5": "5. Idioma / Language",
        "menu.0": "0. Sair",
        "menu.choose": "  Escolha: ",
        "menu.invalid": "  Opção inválida.",
        "menu.exit": "\n  Vale! Bons estudos.\n",
        "keyword.exit": "sair",
        # Study
        "study.title": "MODO ESTUDO — Tabelas completas",
        "study.available": "\n  Declinações disponíveis:",
        "study.all": "Todas",
        "study.back": "Voltar",
        "study.choose": "\n  Escolha: ",
        # Practice
        "practice.title": "MODO PRÁTICA — Preencha a forma correta",
        "practice.exit.hint": "  (digite '{0}' para voltar ao menu)\n",
        "practice.macron.hint": "  Dica: não precisa digitar macrons (ā→a é aceito).\n",
        "practice.answer": "  └─ Resposta: ",
        "practice.correct": "  ✓ Correto!  ({0})\n",
        "practice.wrong": "  ✗ Errado.  Resposta correta: {0}\n",
        "practice.result": "\n  Resultado: {0}/{1} ({2:.0f}%)",
        # Quiz
        "quiz.title": "MODO QUIZ — Perguntas aleatórias com pontuação",
        "quiz.how.many": "  Quantas perguntas? [10] ",
        "quiz.n.questions": "\n  {0} perguntas. Digite '{1}' para encerrar.\n",
        "quiz.macron.hint": "  Dica: não precisa digitar macrons (ā→a é aceito).\n",
        "quiz.question": "  ── Pergunta {0}/{1} ──",
        "quiz.word": "  Palavra: {0}, {1} ({2}) — {3}",
        "quiz.decline": "  Declinar no {0}, {1}:",
        "quiz.prompt": "  > ",
        "quiz.correct": "  ✓ Correto!  ({0})",
        "quiz.streak": "     Sequência: {0}!",
        "quiz.wrong": "  ✗ Errado.  Correto: {0}",
        "quiz.results.title": "Resultado do Quiz",
        "quiz.results.score": "  Acertos:          {0}/{1} ({2:.0f}%)",
        "quiz.results.streak": "  Melhor sequência: {0}",
        "quiz.results.perfect": "  Excelente! Perfeito!",
        "quiz.results.great": "  Muito bem! Continue praticando.",
        "quiz.results.good": "  Bom, mas revise as declinações que errou.",
        "quiz.results.study": "  Recomendo voltar ao modo Estudo antes de tentar novamente.",
        # Challenge
        "challenge.title": "MODO DESAFIO — Decline a palavra inteira",
        "challenge.instructions": "  Você receberá uma palavra e deverá preencher todos os 12 campos\n  (6 casos × 2 números).",
        "challenge.exit.hint": "  Digite '{0}' para voltar.\n",
        "challenge.macron.hint": "  Dica: não precisa digitar macrons (ā→a é aceito).\n",
        "challenge.decline": "Decline: {0}, {1} ({2}) — {3}",
        "challenge.correct": "    ✓ ({0})",
        "challenge.wrong": "    ✗ Correto: {0}",
        "challenge.partial": "\n  Parcial: {0}/{1} ({2:.0f}%)",
        "challenge.results.title": "Resultado do Desafio",
        "challenge.results.word": "  Palavra: {0}, {1} ({2})",
        "challenge.results.score": "  Acertos: {0}/{1} ({2:.0f}%)",
        "challenge.results.errors": "\n  Erros:",
        "challenge.results.error.row": "    {0:<14} {1:<12}  você: {2:<16}  correto: {3}",
        "challenge.results.empty": "(vazio)",
        "challenge.results.perfect": "\n  Perfeito! Tente outra palavra.",
        # General
        "pause": "\n[Enter para continuar] ",
        # Language menu
        "lang.title": "IDIOMA / LANGUAGE",
        "lang.current": "  Idioma atual / Current language: {0}",
        "lang.1": "  1. Português",
        "lang.2": "  2. English",
        "lang.0": "  0. Voltar / Back",
        "lang.choose": "  Escolha / Choose: ",
        "lang.changed": "  Idioma alterado para: {0}",
    },
    "en": {
        "header.title": "DECLINATIONES LATINAE — Memorization Drill",
        "menu.1": "1. Study     — View complete tables",
        "menu.2": "2. Practice  — Fill in random forms",
        "menu.3": "3. Quiz      — Questions with scoring",
        "menu.4": "4. Challenge — Decline entire word",
        "menu.5": "5. Idioma / Language",
        "menu.0": "0. Exit",
        "menu.choose": "  Choose: ",
        "menu.invalid": "  Invalid option.",
        "menu.exit": "\n  Vale! Happy studying.\n",
        "keyword.exit": "exit",
        # Study
        "study.title": "STUDY MODE — Complete tables",
        "study.available": "\n  Available declensions:",
        "study.all": "All",
        "study.back": "Back",
        "study.choose": "\n  Choose: ",
        # Practice
        "practice.title": "PRACTICE MODE — Fill in the correct form",
        "practice.exit.hint": "  (type '{0}' to return to menu)\n",
        "practice.macron.hint": "  Hint: macrons are not required (ā→a is accepted).\n",
        "practice.answer": "  └─ Answer: ",
        "practice.correct": "  ✓ Correct!  ({0})\n",
        "practice.wrong": "  ✗ Wrong.  Correct answer: {0}\n",
        "practice.result": "\n  Result: {0}/{1} ({2:.0f}%)",
        # Quiz
        "quiz.title": "QUIZ MODE — Random questions with scoring",
        "quiz.how.many": "  How many questions? [10] ",
        "quiz.n.questions": "\n  {0} questions. Type '{1}' to end.\n",
        "quiz.macron.hint": "  Hint: macrons are not required (ā→a is accepted).\n",
        "quiz.question": "  ── Question {0}/{1} ──",
        "quiz.word": "  Word: {0}, {1} ({2}) — {3}",
        "quiz.decline": "  Decline in {0}, {1}:",
        "quiz.prompt": "  > ",
        "quiz.correct": "  ✓ Correct!  ({0})",
        "quiz.streak": "     Streak: {0}!",
        "quiz.wrong": "  ✗ Wrong.  Correct: {0}",
        "quiz.results.title": "Quiz Results",
        "quiz.results.score": "  Correct:          {0}/{1} ({2:.0f}%)",
        "quiz.results.streak": "  Best streak:      {0}",
        "quiz.results.perfect": "  Excellent! Perfect score!",
        "quiz.results.great": "  Well done! Keep practicing.",
        "quiz.results.good": "  Good, but review the declensions you got wrong.",
        "quiz.results.study": "  I recommend going back to Study mode before trying again.",
        # Challenge
        "challenge.title": "CHALLENGE MODE — Decline the entire word",
        "challenge.instructions": "  You will receive a word and must fill in all 12 fields\n  (6 cases × 2 numbers).",
        "challenge.exit.hint": "  Type '{0}' to go back.\n",
        "challenge.macron.hint": "  Hint: macrons are not required (ā→a is accepted).\n",
        "challenge.decline": "Decline: {0}, {1} ({2}) — {3}",
        "challenge.correct": "    ✓ ({0})",
        "challenge.wrong": "    ✗ Correct: {0}",
        "challenge.partial": "\n  Partial: {0}/{1} ({2:.0f}%)",
        "challenge.results.title": "Challenge Results",
        "challenge.results.word": "  Word: {0}, {1} ({2})",
        "challenge.results.score": "  Correct: {0}/{1} ({2:.0f}%)",
        "challenge.results.errors": "\n  Errors:",
        "challenge.results.error.row": "    {0:<14} {1:<12}  yours: {2:<16}  correct: {3}",
        "challenge.results.empty": "(empty)",
        "challenge.results.perfect": "\n  Perfect! Try another word.",
        # General
        "pause": "\n[Press Enter to continue] ",
        # Language menu
        "lang.title": "IDIOMA / LANGUAGE",
        "lang.current": "  Idioma atual / Current language: {0}",
        "lang.1": "  1. Português",
        "lang.2": "  2. English",
        "lang.0": "  0. Voltar / Back",
        "lang.choose": "  Escolha / Choose: ",
        "lang.changed": "  Language changed to: {0}",
    },
}

MEANINGS = {
    "pt": {
        "rosa": "rosa", "dominus": "senhor", "puer": "menino", "ager": "campo",
        "vir": "homem", "bellum": "guerra", "rex": "rei", "nox": "noite",
        "civis": "cidadão", "corpus": "corpo", "caput": "cabeça",
        "nōmen": "nome", "mare": "mar", "animal": "animal",
        "exemplar": "exemplar", "fructus": "fruto", "cornū": "chifre",
        "rēs": "coisa", "diēs": "dia", "aqua": "água", "terra": "terra",
        "puella": "menina", "nauta": "marinheiro", "agricola": "agricultor",
        "via": "caminho", "vita": "vida", "fīlia": "filha", "silva": "floresta",
        "patria": "pátria", "porta": "porta/portão", "causa": "causa",
        "cūra": "cuidado", "fōrma": "forma/beleza", "fortūna": "fortuna",
        "grātia": "graça/favor", "īra": "ira", "līttera": "letra",
        "nātūra": "natureza", "pecūnia": "dinheiro", "poena": "pena/castigo",
        "prōvincia": "província", "sapientia": "sabedoria", "poēta": "poeta",
        "incola": "habitante", "fāma": "fama/reputação", "flamma": "chama",
        "pugna": "luta/batalha", "servus": "escravo", "amīcus": "amigo",
        "filius": "filho", "verbum": "palavra", "templum": "templo",
        "magister": "mestre", "animus": "ânimo/alma", "campus": "planície",
        "equus": "cavalo", "locus": "lugar", "modus": "modo/medida",
        "mūrus": "muro", "numerus": "número", "populus": "povo",
        "ventus": "vento", "annus": "ano", "gladius": "espada", "deus": "deus",
        "hortus": "jardim", "oculus": "olho", "liber": "livro", "socer": "sogro",
        "dōnum": "dom/presente", "oppidum": "cidade fortificada",
        "periculum": "perigo", "rēgnum": "reino", "signum": "sinal/estandarte",
        "cōnsilium": "conselho/plano", "praemium": "prêmio",
        "auxilium": "auxílio", "discipulus": "aluno", "medicus": "médico",
        "mīles": "soldado", "cōnsul": "cônsul", "vōx": "voz", "lēx": "lei",
        "pater": "pai", "māter": "mãe", "homō": "homem", "tempus": "tempo",
        "flūmen": "rio", "urbs": "cidade", "mōns": "monte", "hostis": "inimigo",
        "turris": "torre", "dux": "líder/general", "prīnceps": "príncipe/primeiro",
        "sōl": "sol", "leō": "leão", "sermō": "discurso",
        "ōrdō": "ordem/fileira", "imperātor": "imperador/general",
        "ōrātor": "orador", "labor": "trabalho", "honor": "honra",
        "frāter": "irmão", "senātor": "senador", "pastor": "pastor",
        "iūdex": "juiz", "pēs": "pé", "custōs": "guarda", "crux": "cruz",
        "nepōs": "neto", "sacerdōs": "sacerdote", "pāx": "paz", "lūx": "luz",
        "virtūs": "virtude/coragem", "salūs": "saúde/salvação",
        "lībertās": "liberdade", "cīvitās": "cidadania/estado",
        "vēritās": "verdade", "aetās": "idade/época", "voluntās": "vontade",
        "potestās": "poder", "mulier": "mulher", "soror": "irmã",
        "uxor": "esposa", "arbor": "árvore", "iter": "caminho/viagem",
        "genus": "gênero/tipo", "opus": "obra/trabalho",
        "lītus": "litoral/praia", "sīdus": "estrela/constelação",
        "vulnus": "ferida", "carmen": "canto/poema", "lūmen": "luz/lume",
        "ōmen": "presságio", "pars": "parte", "ars": "arte", "mors": "morte",
        "gēns": "família/nação", "mēns": "mente", "pōns": "ponte",
        "dēns": "dente", "frons": "fronte/fachada", "stirps": "tronco/raiz",
        "ignis": "fogo", "nāvis": "navio", "classis": "frota/classe",
        "febris": "febre", "sitis": "sede", "collis": "colina",
        "fīnis": "fim/fronteira", "sedīle": "assento", "tribūnal": "tribunal",
        "vectigal": "imposto", "capital": "crime capital", "calcar": "esporão",
        "pulvīnar": "almofada sagrada", "manus": "mão", "lacus": "lago",
        "genū": "joelho", "exercitus": "exército", "senātus": "senado",
        "cursus": "corrida/curso", "cāsus": "queda/caso",
        "ēventus": "resultado", "impetus": "ataque/ímpeto", "metus": "medo",
        "passus": "passo", "portus": "porto", "ritus": "rito",
        "spiritus": "espírito/sopro", "vultus": "rosto/expressão",
        "domus": "casa", "tribus": "tribo", "acus": "agulha",
        "verū": "espeto", "gelū": "gelo/frio", "gradus": "passo/degrau",
        "adventus": "chegada", "comitātus": "comitiva", "fidēs": "fé",
        "spēs": "esperança", "faciēs": "face/aspecto",
        "effigiēs": "imagem/estátua", "māteriēs": "matéria",
        "seriēs": "série/sequência", "speciēs": "aparência/espécie",
        "glaciēs": "gelo", "prōgeniēs": "descendência",
        "plānitiēs": "planície", "aciēs": "linha de batalha/fio",
        "pernitiēs": "destruição", "requiēs": "descanso",
        "cariēs": "podridão", "rabbiēs": "raiva/fúria",
        "canītiēs": "cabelo branco/velhice", "lūxuriēs": "luxúria",
        "māceriēs": "parede/cerca",
    },
    "en": {
        "rosa": "rose", "dominus": "lord/master", "puer": "boy", "ager": "field",
        "vir": "man", "bellum": "war", "rex": "king", "nox": "night",
        "civis": "citizen", "corpus": "body", "caput": "head",
        "nōmen": "name", "mare": "sea", "animal": "animal",
        "exemplar": "example/model", "fructus": "fruit", "cornū": "horn",
        "rēs": "thing", "diēs": "day", "aqua": "water", "terra": "earth/land",
        "puella": "girl", "nauta": "sailor", "agricola": "farmer",
        "via": "road/way", "vita": "life", "fīlia": "daughter",
        "silva": "forest", "patria": "homeland", "porta": "gate/door",
        "causa": "cause/reason", "cūra": "care/concern",
        "fōrma": "form/beauty", "fortūna": "fortune", "grātia": "grace/favor",
        "īra": "anger/wrath", "līttera": "letter", "nātūra": "nature",
        "pecūnia": "money", "poena": "punishment/penalty",
        "prōvincia": "province", "sapientia": "wisdom", "poēta": "poet",
        "incola": "inhabitant", "fāma": "fame/reputation", "flamma": "flame",
        "pugna": "fight/battle", "servus": "slave", "amīcus": "friend",
        "filius": "son", "verbum": "word", "templum": "temple",
        "magister": "teacher/master", "animus": "spirit/soul",
        "campus": "plain/field", "equus": "horse", "locus": "place",
        "modus": "manner/measure", "mūrus": "wall", "numerus": "number",
        "populus": "people", "ventus": "wind", "annus": "year",
        "gladius": "sword", "deus": "god", "hortus": "garden",
        "oculus": "eye", "liber": "book", "socer": "father-in-law",
        "dōnum": "gift", "oppidum": "fortified town", "periculum": "danger",
        "rēgnum": "kingdom", "signum": "sign/standard",
        "cōnsilium": "counsel/plan", "praemium": "reward/prize",
        "auxilium": "aid/help", "discipulus": "student", "medicus": "doctor",
        "mīles": "soldier", "cōnsul": "consul", "vōx": "voice", "lēx": "law",
        "pater": "father", "māter": "mother", "homō": "man/human",
        "tempus": "time", "flūmen": "river", "urbs": "city",
        "mōns": "mountain", "hostis": "enemy", "turris": "tower",
        "dux": "leader/general", "prīnceps": "prince/chief", "sōl": "sun",
        "leō": "lion", "sermō": "speech/discourse", "ōrdō": "order/rank",
        "imperātor": "emperor/commander", "ōrātor": "orator/speaker",
        "labor": "work/toil", "honor": "honor", "frāter": "brother",
        "senātor": "senator", "pastor": "shepherd", "iūdex": "judge",
        "pēs": "foot", "custōs": "guard", "crux": "cross",
        "nepōs": "grandson", "sacerdōs": "priest", "pāx": "peace",
        "lūx": "light", "virtūs": "virtue/courage",
        "salūs": "health/salvation", "lībertās": "freedom",
        "cīvitās": "citizenship/state", "vēritās": "truth",
        "aetās": "age/era", "voluntās": "will", "potestās": "power",
        "mulier": "woman", "soror": "sister", "uxor": "wife",
        "arbor": "tree", "iter": "road/journey", "genus": "kind/type",
        "opus": "work", "lītus": "shore/beach",
        "sīdus": "star/constellation", "vulnus": "wound",
        "carmen": "song/poem", "lūmen": "light/lamp", "ōmen": "omen",
        "pars": "part", "ars": "art/skill", "mors": "death",
        "gēns": "clan/nation", "mēns": "mind", "pōns": "bridge",
        "dēns": "tooth", "frons": "forehead/front", "stirps": "trunk/root",
        "ignis": "fire", "nāvis": "ship", "classis": "fleet/class",
        "febris": "fever", "sitis": "thirst", "collis": "hill",
        "fīnis": "end/boundary", "sedīle": "seat", "tribūnal": "tribunal",
        "vectigal": "tax", "capital": "capital offense", "calcar": "spur",
        "pulvīnar": "sacred cushion", "manus": "hand", "lacus": "lake",
        "genū": "knee", "exercitus": "army", "senātus": "senate",
        "cursus": "race/course", "cāsus": "fall/chance",
        "ēventus": "outcome", "impetus": "attack/charge", "metus": "fear",
        "passus": "step/pace", "portus": "harbor/port", "ritus": "rite",
        "spiritus": "spirit/breath", "vultus": "face/expression",
        "domus": "house/home", "tribus": "tribe", "acus": "needle",
        "verū": "spit", "gelū": "ice/cold", "gradus": "step/degree",
        "adventus": "arrival", "comitātus": "retinue", "fidēs": "faith",
        "spēs": "hope", "faciēs": "face/appearance",
        "effigiēs": "image/statue", "māteriēs": "matter/material",
        "seriēs": "series/sequence", "speciēs": "appearance/species",
        "glaciēs": "ice", "prōgeniēs": "offspring",
        "plānitiēs": "plain", "aciēs": "battle line/edge",
        "pernitiēs": "destruction", "requiēs": "rest", "cariēs": "decay",
        "rabbiēs": "rage/fury", "canītiēs": "grey hair/old age",
        "lūxuriēs": "luxury/excess", "māceriēs": "wall/fence",
    },
}

LANG = "pt"


def load_lang():
    """Load language from config file."""
    global LANG
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            config = json.load(f)
            LANG = config.get("lang", "pt")
    except (FileNotFoundError, json.JSONDecodeError, PermissionError):
        LANG = "pt"


def save_lang(code: str):
    """Save language to config file."""
    global LANG
    LANG = code
    config = {}
    try:
        with open(CONFIG_FILE, "r", encoding="utf-8") as f:
            config = json.load(f)
    except (FileNotFoundError, json.JSONDecodeError, PermissionError):
        pass
    config["lang"] = code
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(CONFIG_FILE, "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)


def t(key: str, *args) -> str:
    """Translate a key using the current language."""
    strings = TRANSLATIONS.get(LANG, TRANSLATIONS["pt"])
    s = strings.get(key)
    if s is None:
        s = TRANSLATIONS["pt"].get(key, key)
    if args:
        return s.format(*args)
    return s


def get_meaning(nom: str) -> str:
    """Get the meaning of a word in the current language."""
    m = MEANINGS.get(LANG, MEANINGS["pt"])
    return m.get(nom, nom)


# ─── Dados ───────────────────────────────────────────────────────────────────

CASES = [
    "Nominativus",
    "Genitivus",
    "Dativus",
    "Accusativus",
    "Vocativus",
    "Ablativus",
]

NUMBERS = ["Singularis", "Pluralis"]


# ─── Geradores de declinação ─────────────────────────────────────────────────
# Cada gerador retorna o dict {(caso, número): forma} a partir do radical.

def _forms(ns, gs, ds, acs, vs, ab, np, gp, dp, acp, vp, abp):
    """Helper: builds the 12-form dict from positional args."""
    return {
        ("Nominativus", "Singularis"): ns,
        ("Genitivus",   "Singularis"): gs,
        ("Dativus",     "Singularis"): ds,
        ("Accusativus", "Singularis"): acs,
        ("Vocativus",   "Singularis"): vs,
        ("Ablativus",   "Singularis"): ab,
        ("Nominativus", "Pluralis"):   np,
        ("Genitivus",   "Pluralis"):   gp,
        ("Dativus",     "Pluralis"):   dp,
        ("Accusativus", "Pluralis"):   acp,
        ("Vocativus",   "Pluralis"):   vp,
        ("Ablativus",   "Pluralis"):   abp,
    }


def decl1(stem):
    return _forms(
        stem+"a",    stem+"ae",    stem+"ae",   stem+"am",   stem+"a",    stem+"ā",
        stem+"ae",   stem+"ārum",  stem+"īs",   stem+"ās",   stem+"ae",   stem+"īs",
    )


def decl2_us(stem):
    return _forms(
        stem+"us",   stem+"ī",     stem+"ō",    stem+"um",   stem+"e",    stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_ius(stem):
    return _forms(
        stem+"ius",  stem+"iī",    stem+"iō",   stem+"ium",  stem+"ī",    stem+"iō",
        stem+"iī",   stem+"iōrum", stem+"iīs",  stem+"iōs",  stem+"iī",   stem+"iīs",
    )


def decl2_er(nom, stem):
    return _forms(
        nom,         stem+"ī",     stem+"ō",    stem+"um",   nom,         stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_ir(nom, stem):
    return _forms(
        nom,         stem+"ī",     stem+"ō",    stem+"um",   nom,         stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_um(stem):
    return _forms(
        stem+"um",   stem+"ī",     stem+"ō",    stem+"um",   stem+"um",   stem+"ō",
        stem+"a",    stem+"ōrum",  stem+"īs",   stem+"a",    stem+"a",    stem+"īs",
    )


def decl3_cons(nom, stem, gender="m."):
    if gender == "n.":
        return _forms(
            nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"e",
            stem+"a",    stem+"um",    stem+"ibus", stem+"a",    stem+"a",    stem+"ibus",
        )
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"em",   nom,         stem+"e",
        stem+"ēs",   stem+"um",    stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_mixed(nom, stem, gender="m."):
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"em",   nom,         stem+"e",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_i(nom, stem, gender="m."):
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"em",   nom,         stem+"e",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_i_turris(nom, stem):
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"im",   nom,         stem+"ī",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_neut_e(nom, stem):
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl3_neut_al(nom, stem):
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl3_neut_ar(nom, stem):
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl4_us(stem):
    return _forms(
        stem+"us",   stem+"ūs",    stem+"uī",   stem+"um",   stem+"us",   stem+"ū",
        stem+"ūs",   stem+"uum",   stem+"ibus", stem+"ūs",   stem+"ūs",   stem+"ibus",
    )


def decl4_u(stem):
    return _forms(
        stem+"ū",    stem+"ūs",    stem+"ū",    stem+"ū",    stem+"ū",    stem+"ū",
        stem+"ua",   stem+"uum",   stem+"ibus", stem+"ua",   stem+"ua",   stem+"ibus",
    )


def decl5(nom, stem, gen_sg=None, dat_sg=None):
    g = gen_sg or (stem + "eī")
    d = dat_sg or g
    return _forms(
        nom,         g,            d,           stem+"em",   nom,         stem+"ē",
        nom,         stem+"ērum",  stem+"ēbus", nom,         nom,         stem+"ēbus",
    )


# ─── Paradigmas de estudo (19 palavras) ─────────────────────────────────────
# Cada entrada: (declinação, subtipo, nom_sg, gen_sg, gênero, forms)
# Meaning is resolved dynamically via get_meaning(nom_sg)

WORDS = [
    ("I", "Feminina (-a, -ae)", "rosa", "rosae", "f.",
     decl1("ros")),
    ("II", "Masculina (-us, -ī)", "dominus", "dominī", "m.",
     decl2_us("domin")),
    ("II", "Masculina (-er, -ī) — puer", "puer", "puerī", "m.",
     decl2_er("puer", "puer")),
    ("II", "Masculina (-er, -ī) — ager", "ager", "agrī", "m.",
     decl2_er("ager", "agr")),
    ("II", "Masculina (-ir, -ī) — vir", "vir", "virī", "m.",
     decl2_ir("vir", "vir")),
    ("II", "Neutra (-um, -ī)", "bellum", "bellī", "n.",
     decl2_um("bell")),
    ("III", "Consoante (m.)", "rex", "regis", "m.",
     decl3_cons("rex", "reg")),
    ("III", "Consoante (f.)", "nox", "noctis", "f.",
     decl3_mixed("nox", "noct")),
    ("III", "Tema em -i (m./f.)", "civis", "civis", "m./f.",
     decl3_i("civis", "civ")),
    ("III", "Neutra (consoante) — corpus", "corpus", "corporis", "n.",
     decl3_cons("corpus", "corpor", "n.")),
    ("III", "Neutra (consoante) — caput", "caput", "capitis", "n.",
     decl3_cons("caput", "capit", "n.")),
    ("III", "Neutra (consoante) — nōmen", "nōmen", "nōminis", "n.",
     decl3_cons("nōmen", "nōmin", "n.")),
    ("III", "Neutra (tema em -i) — mare", "mare", "maris", "n.",
     decl3_neut_e("mare", "mar")),
    ("III", "Neutra (tema em -i) — animal", "animal", "animālis", "n.",
     decl3_neut_al("animal", "animāl")),
    ("III", "Neutra (tema em -i) — exemplar", "exemplar", "exemplāris", "n.",
     decl3_neut_ar("exemplar", "exemplār")),
    ("IV", "Masculina (-us, -ūs)", "fructus", "fructūs", "m.",
     decl4_us("fruct")),
    ("IV", "Neutra (-ū, -ūs)", "cornū", "cornūs", "n.",
     decl4_u("corn")),
    ("V", "Feminina (-ēs, -eī)", "rēs", "reī", "f.",
     decl5("rēs", "r", gen_sg="reī", dat_sg="reī")),
    ("V", "m./f. (-ēs, -ēī)", "diēs", "diēī", "m./f.",
     decl5("diēs", "di", gen_sg="diēī", dat_sg="diēī")),
]


EXTRA_WORDS = [
    # I DECLINATIO
    ("I", "Feminina (-a, -ae)", "aqua", "aquae", "f.", decl1("aqu")),
    ("I", "Feminina (-a, -ae)", "terra", "terrae", "f.", decl1("terr")),
    ("I", "Feminina (-a, -ae)", "puella", "puellae", "f.", decl1("puell")),
    ("I", "Masculina (-a, -ae)", "nauta", "nautae", "m.", decl1("naut")),
    ("I", "Masculina (-a, -ae)", "agricola", "agricolae", "m.", decl1("agricol")),
    ("I", "Feminina (-a, -ae)", "via", "viae", "f.", decl1("vi")),
    ("I", "Feminina (-a, -ae)", "vita", "vitae", "f.", decl1("vit")),
    ("I", "Feminina (-a, -ae)", "fīlia", "fīliae", "f.", decl1("fīli")),
    ("I", "Feminina (-a, -ae)", "silva", "silvae", "f.", decl1("silv")),
    ("I", "Feminina (-a, -ae)", "patria", "patriae", "f.", decl1("patri")),
    ("I", "Feminina (-a, -ae)", "porta", "portae", "f.", decl1("port")),
    ("I", "Feminina (-a, -ae)", "causa", "causae", "f.", decl1("caus")),
    ("I", "Feminina (-a, -ae)", "cūra", "cūrae", "f.", decl1("cūr")),
    ("I", "Feminina (-a, -ae)", "fōrma", "fōrmae", "f.", decl1("fōrm")),
    ("I", "Feminina (-a, -ae)", "fortūna", "fortūnae", "f.", decl1("fortūn")),
    ("I", "Feminina (-a, -ae)", "grātia", "grātiae", "f.", decl1("grāti")),
    ("I", "Feminina (-a, -ae)", "īra", "īrae", "f.", decl1("īr")),
    ("I", "Feminina (-a, -ae)", "līttera", "lītterae", "f.", decl1("lītter")),
    ("I", "Feminina (-a, -ae)", "nātūra", "nātūrae", "f.", decl1("nātūr")),
    ("I", "Feminina (-a, -ae)", "pecūnia", "pecūniae", "f.", decl1("pecūni")),
    ("I", "Feminina (-a, -ae)", "poena", "poenae", "f.", decl1("poen")),
    ("I", "Feminina (-a, -ae)", "prōvincia", "prōvinciae", "f.", decl1("prōvinci")),
    ("I", "Feminina (-a, -ae)", "sapientia", "sapientiae", "f.", decl1("sapienti")),
    ("I", "Masculina (-a, -ae)", "poēta", "poētae", "m.", decl1("poēt")),
    ("I", "Masculina (-a, -ae)", "incola", "incolae", "m.", decl1("incol")),
    ("I", "Feminina (-a, -ae)", "fāma", "fāmae", "f.", decl1("fām")),
    ("I", "Feminina (-a, -ae)", "flamma", "flammae", "f.", decl1("flamm")),
    ("I", "Feminina (-a, -ae)", "pugna", "pugnae", "f.", decl1("pugn")),
    # II DECLINATIO
    ("II", "Masculina (-us, -ī)", "servus", "servī", "m.", decl2_us("serv")),
    ("II", "Masculina (-us, -ī)", "amīcus", "amīcī", "m.", decl2_us("amīc")),
    ("II", "Masculina (-us, -ī)", "filius", "filiī", "m.", decl2_ius("fil")),
    ("II", "Neutra (-um, -ī)", "verbum", "verbī", "n.", decl2_um("verb")),
    ("II", "Neutra (-um, -ī)", "templum", "templī", "n.", decl2_um("templ")),
    ("II", "Masculina (-er, -ī) — magister", "magister", "magistrī", "m.",
     decl2_er("magister", "magistr")),
    ("II", "Masculina (-us, -ī)", "animus", "animī", "m.", decl2_us("anim")),
    ("II", "Masculina (-us, -ī)", "campus", "campī", "m.", decl2_us("camp")),
    ("II", "Masculina (-us, -ī)", "equus", "equī", "m.", decl2_us("equ")),
    ("II", "Masculina (-us, -ī)", "locus", "locī", "m.", decl2_us("loc")),
    ("II", "Masculina (-us, -ī)", "modus", "modī", "m.", decl2_us("mod")),
    ("II", "Masculina (-us, -ī)", "mūrus", "mūrī", "m.", decl2_us("mūr")),
    ("II", "Masculina (-us, -ī)", "numerus", "numerī", "m.", decl2_us("numer")),
    ("II", "Masculina (-us, -ī)", "populus", "populī", "m.", decl2_us("popul")),
    ("II", "Masculina (-us, -ī)", "ventus", "ventī", "m.", decl2_us("vent")),
    ("II", "Masculina (-us, -ī)", "annus", "annī", "m.", decl2_us("ann")),
    ("II", "Masculina (-us, -ī)", "gladius", "gladiī", "m.", decl2_ius("glad")),
    ("II", "Masculina (-us, -ī)", "deus", "deī", "m.", decl2_us("de")),
    ("II", "Masculina (-us, -ī)", "hortus", "hortī", "m.", decl2_us("hort")),
    ("II", "Masculina (-us, -ī)", "oculus", "oculī", "m.", decl2_us("ocul")),
    ("II", "Masculina (-er, -ī) — liber", "liber", "librī", "m.",
     decl2_er("liber", "libr")),
    ("II", "Masculina (-er, -ī) — socer", "socer", "socerī", "m.",
     decl2_er("socer", "socer")),
    ("II", "Neutra (-um, -ī)", "dōnum", "dōnī", "n.", decl2_um("dōn")),
    ("II", "Neutra (-um, -ī)", "oppidum", "oppidī", "n.", decl2_um("oppid")),
    ("II", "Neutra (-um, -ī)", "periculum", "periculī", "n.", decl2_um("pericul")),
    ("II", "Neutra (-um, -ī)", "rēgnum", "rēgnī", "n.", decl2_um("rēgn")),
    ("II", "Neutra (-um, -ī)", "signum", "signī", "n.", decl2_um("sign")),
    ("II", "Neutra (-um, -ī)", "cōnsilium", "cōnsiliī", "n.", decl2_um("cōnsili")),
    ("II", "Neutra (-um, -ī)", "praemium", "praemiī", "n.", decl2_um("praemi")),
    ("II", "Neutra (-um, -ī)", "auxilium", "auxiliī", "n.", decl2_um("auxili")),
    ("II", "Masculina (-us, -ī)", "discipulus", "discipulī", "m.", decl2_us("discipul")),
    ("II", "Masculina (-us, -ī)", "medicus", "medicī", "m.", decl2_us("medic")),
    # III DECLINATIO
    ("III", "Consoante (m.)", "mīles", "mīlitis", "m.",
     decl3_cons("mīles", "mīlit")),
    ("III", "Consoante (m.)", "cōnsul", "cōnsulis", "m.",
     decl3_cons("cōnsul", "cōnsul")),
    ("III", "Consoante (f.)", "vōx", "vōcis", "f.",
     decl3_cons("vōx", "vōc", "f.")),
    ("III", "Consoante (f.)", "lēx", "lēgis", "f.",
     decl3_cons("lēx", "lēg", "f.")),
    ("III", "Consoante (m.)", "pater", "patris", "m.",
     decl3_cons("pater", "patr")),
    ("III", "Consoante (f.)", "māter", "mātris", "f.",
     decl3_cons("māter", "mātr", "f.")),
    ("III", "Consoante (m.)", "homō", "hominis", "m.",
     decl3_cons("homō", "homin")),
    ("III", "Consoante (n.) — tempus", "tempus", "temporis", "n.",
     decl3_cons("tempus", "tempor", "n.")),
    ("III", "Consoante (n.) — flūmen", "flūmen", "flūminis", "n.",
     decl3_cons("flūmen", "flūmin", "n.")),
    ("III", "Misto (f.) — urbs", "urbs", "urbis", "f.",
     decl3_mixed("urbs", "urb")),
    ("III", "Misto (m.) — mōns", "mōns", "montis", "m.",
     decl3_mixed("mōns", "mont")),
    ("III", "Tema em -i (m.)", "hostis", "hostis", "m.",
     decl3_i("hostis", "host")),
    ("III", "Tema em -i (f.)", "turris", "turris", "f.",
     decl3_i_turris("turris", "turr")),
    ("III", "Consoante (m.)", "dux", "ducis", "m.",
     decl3_cons("dux", "duc")),
    ("III", "Consoante (m.)", "prīnceps", "prīncipis", "m.",
     decl3_cons("prīnceps", "prīncip")),
    ("III", "Consoante (m.)", "sōl", "sōlis", "m.",
     decl3_cons("sōl", "sōl")),
    ("III", "Consoante (m.)", "leō", "leōnis", "m.",
     decl3_cons("leō", "leōn")),
    ("III", "Consoante (m.)", "sermō", "sermōnis", "m.",
     decl3_cons("sermō", "sermōn")),
    ("III", "Consoante (m.)", "ōrdō", "ōrdinis", "m.",
     decl3_cons("ōrdō", "ōrdin")),
    ("III", "Consoante (m.)", "imperātor", "imperātōris", "m.",
     decl3_cons("imperātor", "imperātōr")),
    ("III", "Consoante (m.)", "ōrātor", "ōrātōris", "m.",
     decl3_cons("ōrātor", "ōrātōr")),
    ("III", "Consoante (m.)", "labor", "labōris", "m.",
     decl3_cons("labor", "labōr")),
    ("III", "Consoante (m.)", "honor", "honōris", "m.",
     decl3_cons("honor", "honōr")),
    ("III", "Consoante (m.)", "frāter", "frātris", "m.",
     decl3_cons("frāter", "frātr")),
    ("III", "Consoante (m.)", "senātor", "senātōris", "m.",
     decl3_cons("senātor", "senātōr")),
    ("III", "Consoante (m.)", "pastor", "pastōris", "m.",
     decl3_cons("pastor", "pastōr")),
    ("III", "Consoante (m.)", "iūdex", "iūdicis", "m.",
     decl3_cons("iūdex", "iūdic")),
    ("III", "Consoante (m.)", "pēs", "pedis", "m.",
     decl3_cons("pēs", "ped")),
    ("III", "Consoante (m.)", "custōs", "custōdis", "m.",
     decl3_cons("custōs", "custōd")),
    ("III", "Consoante (f.)", "crux", "crucis", "f.",
     decl3_cons("crux", "cruc", "f.")),
    ("III", "Consoante (m.)", "nepōs", "nepōtis", "m.",
     decl3_cons("nepōs", "nepōt")),
    ("III", "Consoante (m.)", "sacerdōs", "sacerdōtis", "m.",
     decl3_cons("sacerdōs", "sacerdōt")),
    ("III", "Consoante (f.)", "pāx", "pācis", "f.",
     decl3_cons("pāx", "pāc", "f.")),
    ("III", "Consoante (f.)", "lūx", "lūcis", "f.",
     decl3_cons("lūx", "lūc", "f.")),
    ("III", "Consoante (f.)", "virtūs", "virtūtis", "f.",
     decl3_cons("virtūs", "virtūt", "f.")),
    ("III", "Consoante (f.)", "salūs", "salūtis", "f.",
     decl3_cons("salūs", "salūt", "f.")),
    ("III", "Consoante (f.)", "lībertās", "lībertātis", "f.",
     decl3_cons("lībertās", "lībertāt", "f.")),
    ("III", "Consoante (f.)", "cīvitās", "cīvitātis", "f.",
     decl3_cons("cīvitās", "cīvitāt", "f.")),
    ("III", "Consoante (f.)", "vēritās", "vēritātis", "f.",
     decl3_cons("vēritās", "vēritāt", "f.")),
    ("III", "Consoante (f.)", "aetās", "aetātis", "f.",
     decl3_cons("aetās", "aetāt", "f.")),
    ("III", "Consoante (f.)", "voluntās", "voluntātis", "f.",
     decl3_cons("voluntās", "voluntāt", "f.")),
    ("III", "Consoante (f.)", "potestās", "potestātis", "f.",
     decl3_cons("potestās", "potestāt", "f.")),
    ("III", "Consoante (f.)", "mulier", "mulieris", "f.",
     decl3_cons("mulier", "mulier", "f.")),
    ("III", "Consoante (f.)", "soror", "sorōris", "f.",
     decl3_cons("soror", "sorōr", "f.")),
    ("III", "Consoante (f.)", "uxor", "uxōris", "f.",
     decl3_cons("uxor", "uxōr", "f.")),
    ("III", "Consoante (f.)", "arbor", "arboris", "f.",
     decl3_cons("arbor", "arbor", "f.")),
    ("III", "Consoante (n.)", "iter", "itineris", "n.",
     decl3_cons("iter", "itiner", "n.")),
    ("III", "Consoante (n.)", "genus", "generis", "n.",
     decl3_cons("genus", "gener", "n.")),
    ("III", "Consoante (n.)", "opus", "operis", "n.",
     decl3_cons("opus", "oper", "n.")),
    ("III", "Consoante (n.)", "lītus", "lītoris", "n.",
     decl3_cons("lītus", "lītor", "n.")),
    ("III", "Consoante (n.)", "sīdus", "sīderis", "n.",
     decl3_cons("sīdus", "sīder", "n.")),
    ("III", "Consoante (n.)", "vulnus", "vulneris", "n.",
     decl3_cons("vulnus", "vulner", "n.")),
    ("III", "Consoante (n.)", "carmen", "carminis", "n.",
     decl3_cons("carmen", "carmin", "n.")),
    ("III", "Consoante (n.)", "lūmen", "lūminis", "n.",
     decl3_cons("lūmen", "lūmin", "n.")),
    ("III", "Consoante (n.)", "ōmen", "ōminis", "n.",
     decl3_cons("ōmen", "ōmin", "n.")),
    ("III", "Misto (f.)", "pars", "partis", "f.",
     decl3_mixed("pars", "part")),
    ("III", "Misto (f.)", "ars", "artis", "f.",
     decl3_mixed("ars", "art")),
    ("III", "Misto (f.)", "mors", "mortis", "f.",
     decl3_mixed("mors", "mort")),
    ("III", "Misto (f.)", "gēns", "gentis", "f.",
     decl3_mixed("gēns", "gent")),
    ("III", "Misto (f.)", "mēns", "mentis", "f.",
     decl3_mixed("mēns", "ment")),
    ("III", "Misto (m.)", "pōns", "pontis", "m.",
     decl3_mixed("pōns", "pont")),
    ("III", "Misto (m.)", "dēns", "dentis", "m.",
     decl3_mixed("dēns", "dent")),
    ("III", "Misto (f.)", "frons", "frontis", "f.",
     decl3_mixed("frons", "front")),
    ("III", "Misto (f.)", "stirps", "stirpis", "f.",
     decl3_mixed("stirps", "stirp")),
    ("III", "Tema em -i (m.)", "ignis", "ignis", "m.",
     decl3_i("ignis", "ign")),
    ("III", "Tema em -i (f.)", "nāvis", "nāvis", "f.",
     decl3_i_turris("nāvis", "nāv")),
    ("III", "Tema em -i (f.)", "classis", "classis", "f.",
     decl3_i("classis", "class")),
    ("III", "Tema em -i (f.)", "febris", "febris", "f.",
     decl3_i_turris("febris", "febr")),
    ("III", "Tema em -i (f.)", "sitis", "sitis", "f.",
     decl3_i_turris("sitis", "sit")),
    ("III", "Tema em -i (m.)", "collis", "collis", "m.",
     decl3_i("collis", "coll")),
    ("III", "Tema em -i (m.)", "fīnis", "fīnis", "m.",
     decl3_i("fīnis", "fīn")),
    ("III", "Neutra (-e)", "sedīle", "sedīlis", "n.",
     decl3_neut_e("sedīle", "sedīl")),
    ("III", "Neutra (-al)", "tribūnal", "tribūnālis", "n.",
     decl3_neut_al("tribūnal", "tribūnāl")),
    ("III", "Neutra (-al)", "vectigal", "vectigālis", "n.",
     decl3_neut_al("vectigal", "vectigāl")),
    ("III", "Neutra (-al)", "capital", "capitālis", "n.",
     decl3_neut_al("capital", "capitāl")),
    ("III", "Neutra (-ar)", "calcar", "calcāris", "n.",
     decl3_neut_ar("calcar", "calcār")),
    ("III", "Neutra (-ar)", "pulvīnar", "pulvīnāris", "n.",
     decl3_neut_ar("pulvīnar", "pulvīnār")),
    # IV DECLINATIO
    ("IV", "Feminina (-us, -ūs)", "manus", "manūs", "f.", decl4_us("man")),
    ("IV", "Masculina (-us, -ūs)", "lacus", "lacūs", "m.", decl4_us("lac")),
    ("IV", "Neutra (-ū, -ūs)", "genū", "genūs", "n.", decl4_u("gen")),
    ("IV", "Masculina (-us, -ūs)", "exercitus", "exercitūs", "m.", decl4_us("exercit")),
    ("IV", "Masculina (-us, -ūs)", "senātus", "senātūs", "m.", decl4_us("senāt")),
    ("IV", "Masculina (-us, -ūs)", "cursus", "cursūs", "m.", decl4_us("curs")),
    ("IV", "Masculina (-us, -ūs)", "cāsus", "cāsūs", "m.", decl4_us("cās")),
    ("IV", "Masculina (-us, -ūs)", "ēventus", "ēventūs", "m.", decl4_us("ēvent")),
    ("IV", "Masculina (-us, -ūs)", "impetus", "impetūs", "m.", decl4_us("impet")),
    ("IV", "Masculina (-us, -ūs)", "metus", "metūs", "m.", decl4_us("met")),
    ("IV", "Masculina (-us, -ūs)", "passus", "passūs", "m.", decl4_us("pass")),
    ("IV", "Masculina (-us, -ūs)", "portus", "portūs", "m.", decl4_us("port")),
    ("IV", "Masculina (-us, -ūs)", "ritus", "ritūs", "m.", decl4_us("rit")),
    ("IV", "Masculina (-us, -ūs)", "spiritus", "spiritūs", "m.", decl4_us("spirit")),
    ("IV", "Masculina (-us, -ūs)", "vultus", "vultūs", "m.", decl4_us("vult")),
    ("IV", "Feminina (-us, -ūs)", "domus", "domūs", "f.", decl4_us("dom")),
    ("IV", "Feminina (-us, -ūs)", "tribus", "tribūs", "f.", decl4_us("trib")),
    ("IV", "Feminina (-us, -ūs)", "acus", "acūs", "f.", decl4_us("ac")),
    ("IV", "Neutra (-ū, -ūs)", "verū", "verūs", "n.", decl4_u("ver")),
    ("IV", "Neutra (-ū, -ūs)", "gelū", "gelūs", "n.", decl4_u("gel")),
    ("IV", "Masculina (-us, -ūs)", "gradus", "gradūs", "m.", decl4_us("grad")),
    ("IV", "Masculina (-us, -ūs)", "adventus", "adventūs", "m.", decl4_us("advent")),
    ("IV", "Masculina (-us, -ūs)", "comitātus", "comitātūs", "m.", decl4_us("comitāt")),
    # V DECLINATIO
    ("V", "Feminina (-ēs, -ēī)", "fidēs", "fideī", "f.",
     decl5("fidēs", "fid", gen_sg="fideī", dat_sg="fideī")),
    ("V", "Feminina (-ēs, -ēī)", "spēs", "speī", "f.",
     decl5("spēs", "sp", gen_sg="speī", dat_sg="speī")),
    ("V", "Feminina (-ēs, -ēī)", "faciēs", "faciēī", "f.",
     decl5("faciēs", "faci", gen_sg="faciēī", dat_sg="faciēī")),
    ("V", "Feminina (-ēs, -ēī)", "effigiēs", "effigiēī", "f.",
     decl5("effigiēs", "effigi", gen_sg="effigiēī", dat_sg="effigiēī")),
    ("V", "Feminina (-ēs, -ēī)", "māteriēs", "māteriēī", "f.",
     decl5("māteriēs", "māteri", gen_sg="māteriēī", dat_sg="māteriēī")),
    ("V", "Feminina (-ēs, -ēī)", "seriēs", "seriēī", "f.",
     decl5("seriēs", "seri", gen_sg="seriēī", dat_sg="seriēī")),
    ("V", "Feminina (-ēs, -ēī)", "speciēs", "speciēī", "f.",
     decl5("speciēs", "speci", gen_sg="speciēī", dat_sg="speciēī")),
    ("V", "Feminina (-ēs, -ēī)", "glaciēs", "glaciēī", "f.",
     decl5("glaciēs", "glaci", gen_sg="glaciēī", dat_sg="glaciēī")),
    ("V", "Feminina (-ēs, -ēī)", "prōgeniēs", "prōgeniēī", "f.",
     decl5("prōgeniēs", "prōgeni", gen_sg="prōgeniēī", dat_sg="prōgeniēī")),
    ("V", "Feminina (-ēs, -ēī)", "plānitiēs", "plānitiēī", "f.",
     decl5("plānitiēs", "plāniti", gen_sg="plānitiēī", dat_sg="plānitiēī")),
    ("V", "Feminina (-ēs, -eī)", "aciēs", "acieī", "f.",
     decl5("aciēs", "aci", gen_sg="acieī", dat_sg="acieī")),
    ("V", "Feminina (-ēs, -eī)", "pernitiēs", "pernitiēī", "f.",
     decl5("pernitiēs", "perniti", gen_sg="pernitiēī", dat_sg="pernitiēī")),
    ("V", "Feminina (-ēs, -eī)", "requiēs", "requieī", "f.",
     decl5("requiēs", "requi", gen_sg="requieī", dat_sg="requieī")),
    ("V", "Feminina (-ēs, -eī)", "cariēs", "carieī", "f.",
     decl5("cariēs", "cari", gen_sg="carieī", dat_sg="carieī")),
    ("V", "Feminina (-ēs, -eī)", "rabbiēs", "rabieī", "f.",
     decl5("rabbiēs", "rabbi", gen_sg="rabieī", dat_sg="rabieī")),
    ("V", "Feminina (-ēs, -eī)", "canītiēs", "canītiēī", "f.",
     decl5("canītiēs", "canīti", gen_sg="canītiēī", dat_sg="canītiēī")),
    ("V", "Feminina (-ēs, -eī)", "lūxuriēs", "lūxuriēī", "f.",
     decl5("lūxuriēs", "lūxuri", gen_sg="lūxuriēī", dat_sg="lūxuriēī")),
    ("V", "Feminina (-ēs, -eī)", "māceriēs", "māceriēī", "f.",
     decl5("māceriēs", "māceri", gen_sg="māceriēī", dat_sg="māceriēī")),
]

ALL_DRILL_WORDS = WORDS + EXTRA_WORDS

# ─── Helpers ─────────────────────────────────────────────────────────────────

_MACRON_PAIRS = [
    ("ā", "a"), ("ē", "e"), ("ī", "i"), ("ō", "o"), ("ū", "u"),
    ("Ā", "A"), ("Ē", "E"), ("Ī", "I"), ("Ō", "O"), ("Ū", "U"),
]
MACRON_MAP = str.maketrans({k: v for k, v in _MACRON_PAIRS})


def strip_macrons(s: str) -> str:
    return s.translate(MACRON_MAP)


def normalize(s: str) -> str:
    return strip_macrons(s).strip().lower()


def check_answer(user_input: str, correct: str) -> bool:
    return normalize(user_input) == normalize(correct)


def clear_screen():
    if os.name == "nt":
        os.system("cls")
    else:
        sys.stdout.write("\033[2J\033[3J\033[H")
        sys.stdout.flush()


def prompt(msg: str = "") -> str:
    try:
        return input(msg)
    except (EOFError, KeyboardInterrupt):
        print()
        return ""


def pause():
    prompt(t("pause"))


def header(title: str):
    w = 60
    print()
    print("═" * w)
    print(f"  {title}")
    print("═" * w)


def word_label(w) -> str:
    dec, sub, nom, gen, gender, _ = w
    meaning = get_meaning(nom)
    return f"{nom}, {gen} ({gender}) — {meaning}  [{dec}a decl., {sub}]"


# ─── Modo 1: Estudo ─────────────────────────────────────────────────────────

def show_table(w):
    dec, sub, nom, gen, gender, forms = w
    meaning = get_meaning(nom)
    header(f"{dec}a Declinatio — {sub}")
    print(f"  {nom}, {gen} ({gender}) = {meaning}\n")
    print(f"  {'Casus':<14} {'Singularis':<16} {'Pluralis':<16}")
    print(f"  {'─' * 14} {'─' * 16} {'─' * 16}")
    for c in CASES:
        sg = forms[(c, "Singularis")]
        pl = forms[(c, "Pluralis")]
        print(f"  {c:<14} {sg:<16} {pl:<16}")
    print()


def modo_estudo():
    clear_screen()
    header(t("study.title"))

    by_dec: dict[str, list] = {}
    for w in WORDS:
        by_dec.setdefault(w[0], []).append(w)

    print(t("study.available"))
    dec_keys = sorted(by_dec.keys())
    for i, dk in enumerate(dec_keys, 1):
        words_in = ", ".join(w[2] for w in by_dec[dk])
        print(f"    {i}. {dk}a Declinatio  ({words_in})")
    print(f"    {len(dec_keys) + 1}. {t('study.all')}")
    print(f"    0. {t('study.back')}")

    choice = prompt(t("study.choose")).strip()
    if choice == "0":
        return

    if choice == str(len(dec_keys) + 1):
        selected = WORDS
    elif choice.isdigit() and 1 <= int(choice) <= len(dec_keys):
        selected = by_dec[dec_keys[int(choice) - 1]]
    else:
        print(t("menu.invalid"))
        pause()
        return

    clear_screen()
    for w in selected:
        show_table(w)
    pause()


# ─── Modo 2: Prática ────────────────────────────────────────────────────────

def modo_pratica():
    clear_screen()
    header(t("practice.title"))
    exit_kw = t("keyword.exit")
    print(t("practice.exit.hint", exit_kw))
    print(t("practice.macron.hint"))

    words = list(ALL_DRILL_WORDS)
    random.shuffle(words)

    total = 0
    correct_count = 0

    for w in words:
        dec, sub, nom, gen, gender, forms = w
        meaning = get_meaning(nom)
        caso = random.choice(CASES)
        num = random.choice(NUMBERS)
        correct = forms[(caso, num)]

        print(f"  ┌─ {nom}, {gen} ({gender}) — {meaning}")
        print(f"  │  {dec}a Declinatio, {sub}")
        print(f"  │  {t('prompt.caso')[:-1]} {caso}  |  {t('prompt.numero')[:-1]} {num}")
        answer = prompt(t("practice.answer")).strip()

        if answer.lower() == exit_kw:
            break

        total += 1
        if check_answer(answer, correct):
            correct_count += 1
            print(t("practice.correct", correct))
        else:
            print(t("practice.wrong", correct))

    if total > 0:
        pct = correct_count / total * 100
        print(t("practice.result", correct_count, total, pct))
    pause()


# ─── Modo 3: Quiz ───────────────────────────────────────────────────────────

def modo_quiz():
    clear_screen()
    header(t("quiz.title"))

    n_str = prompt(t("quiz.how.many")).strip()
    n = int(n_str) if n_str.isdigit() and int(n_str) > 0 else 10

    exit_kw = t("keyword.exit")
    print(t("quiz.n.questions", n, exit_kw))
    print(t("quiz.macron.hint"))

    correct_count = 0
    streak = 0
    best_streak = 0

    for i in range(1, n + 1):
        w = random.choice(ALL_DRILL_WORDS)
        dec, sub, nom, gen, gender, forms = w
        meaning = get_meaning(nom)
        caso = random.choice(CASES)
        num = random.choice(NUMBERS)
        correct = forms[(caso, num)]

        print(t("quiz.question", i, n))
        print(t("quiz.word", nom, gen, gender, meaning))
        print(t("quiz.decline", caso, num))
        answer = prompt(t("quiz.prompt")).strip()

        if answer.lower() == exit_kw:
            n = i - 1
            break

        if check_answer(answer, correct):
            correct_count += 1
            streak += 1
            if streak > best_streak:
                best_streak = streak
            print(t("quiz.correct", correct))
            if streak >= 3:
                print(t("quiz.streak", streak))
        else:
            streak = 0
            print(t("quiz.wrong", correct))
        print()

    if n > 0:
        pct = correct_count / n * 100
        header(t("quiz.results.title"))
        print(t("quiz.results.score", correct_count, n, pct))
        print(t("quiz.results.streak", best_streak))
        if pct == 100:
            print(t("quiz.results.perfect"))
        elif pct >= 80:
            print(t("quiz.results.great"))
        elif pct >= 60:
            print(t("quiz.results.good"))
        else:
            print(t("quiz.results.study"))
    pause()


# ─── Modo 4: Desafio ────────────────────────────────────────────────────────

def modo_desafio():
    clear_screen()
    header(t("challenge.title"))
    exit_kw = t("keyword.exit")
    print(t("challenge.instructions"))
    print(t("challenge.exit.hint", exit_kw))
    print(t("challenge.macron.hint"))

    w = random.choice(WORDS)
    dec, sub, nom, gen, gender, forms = w
    meaning = get_meaning(nom)

    header(t("challenge.decline", nom, gen, gender, meaning))
    print(f"  {dec}a Declinatio — {sub}\n")

    total = 0
    correct_count = 0
    errors = []

    for num in NUMBERS:
        print(f"  ── {num} ──")
        for caso in CASES:
            correct = forms[(caso, num)]
            answer = prompt(f"    {caso:<14}: ").strip()
            if answer.lower() == exit_kw:
                if total > 0:
                    pct = correct_count / total * 100
                    print(t("challenge.partial", correct_count, total, pct))
                pause()
                return
            total += 1
            if check_answer(answer, correct):
                correct_count += 1
                print(t("challenge.correct", correct))
            else:
                errors.append((caso, num, correct, answer))
                print(t("challenge.wrong", correct))
        print()

    pct = correct_count / total * 100
    header(t("challenge.results.title"))
    print(t("challenge.results.word", nom, gen, gender))
    print(t("challenge.results.score", correct_count, total, pct))

    if errors:
        print(t("challenge.results.errors"))
        empty = t("challenge.results.empty")
        for caso, num, correct, given in errors:
            print(t("challenge.results.error.row", caso, num, given or empty, correct))

    if pct == 100:
        print(t("challenge.results.perfect"))
    pause()


# ─── Modo 5: Language ───────────────────────────────────────────────────────

def modo_idioma():
    clear_screen()
    header(t("lang.title"))
    lang_name = "Português" if LANG == "pt" else "English"
    print(t("lang.current", lang_name))
    print()
    print(t("lang.1"))
    print(t("lang.2"))
    print(t("lang.0"))
    print()
    choice = prompt(t("lang.choose")).strip()
    if choice == "1":
        save_lang("pt")
        print(t("lang.changed", "Português"))
        pause()
    elif choice == "2":
        save_lang("en")
        print(t("lang.changed", "English"))
        pause()


# ─── Menu principal ──────────────────────────────────────────────────────────

def main():
    load_lang()

    while True:
        clear_screen()
        header(t("header.title"))
        print()
        print(f"  {t('menu.1')}")
        print(f"  {t('menu.2')}")
        print(f"  {t('menu.3')}")
        print(f"  {t('menu.4')}")
        print(f"  {t('menu.5')}")
        print(f"  {t('menu.0')}")
        print()
        choice = prompt(t("menu.choose")).strip()

        if choice == "1":
            modo_estudo()
        elif choice == "2":
            modo_pratica()
        elif choice == "3":
            modo_quiz()
        elif choice == "4":
            modo_desafio()
        elif choice == "5":
            modo_idioma()
        elif choice == "0":
            print(t("menu.exit"))
            sys.exit(0)
        else:
            print(t("menu.invalid"))
            pause()


if __name__ == "__main__":
    main()
