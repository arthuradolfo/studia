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
    """I declinatio: rosa pattern (stem = ros)."""
    return _forms(
        stem+"a",    stem+"ae",    stem+"ae",   stem+"am",   stem+"a",    stem+"ā",
        stem+"ae",   stem+"ārum",  stem+"īs",   stem+"ās",   stem+"ae",   stem+"īs",
    )


def decl2_us(stem):
    """II declinatio: dominus pattern (stem = domin)."""
    return _forms(
        stem+"us",   stem+"ī",     stem+"ō",    stem+"um",   stem+"e",    stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_ius(stem):
    """II declinatio: filius pattern — voc.sg = stem+ī (not -ie)."""
    return _forms(
        stem+"ius",  stem+"iī",    stem+"iō",   stem+"ium",  stem+"ī",    stem+"iō",
        stem+"iī",   stem+"iōrum", stem+"iīs",  stem+"iōs",  stem+"iī",   stem+"iīs",
    )


def decl2_er(nom, stem):
    """II declinatio: ager/agrī pattern (nom stays, stem loses -e-)."""
    return _forms(
        nom,         stem+"ī",     stem+"ō",    stem+"um",   nom,         stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_ir(nom, stem):
    """II declinatio: vir/virī pattern."""
    return _forms(
        nom,         stem+"ī",     stem+"ō",    stem+"um",   nom,         stem+"ō",
        stem+"ī",    stem+"ōrum",  stem+"īs",   stem+"ōs",   stem+"ī",    stem+"īs",
    )


def decl2_um(stem):
    """II declinatio neutra: bellum pattern (stem = bell)."""
    return _forms(
        stem+"um",   stem+"ī",     stem+"ō",    stem+"um",   stem+"um",   stem+"ō",
        stem+"a",    stem+"ōrum",  stem+"īs",   stem+"a",    stem+"a",    stem+"īs",
    )


def decl3_cons(nom, stem, gender="m."):
    """III declinatio consonant stem: rex/reg-, gen.pl -um."""
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
    """III declinatio mixed: urbs/urbis — like consonant but gen.pl -ium."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"em",   nom,         stem+"e",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_i(nom, stem, gender="m."):
    """III declinatio i-stem (m./f.): civis/civis — gen.pl -ium, abl.sg -e."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"em",   nom,         stem+"e",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_i_turris(nom, stem):
    """III declinatio i-stem (f.) — turris type: acc.sg -im, abl.sg -ī."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    stem+"im",   nom,         stem+"ī",
        stem+"ēs",   stem+"ium",   stem+"ibus", stem+"ēs",   stem+"ēs",   stem+"ibus",
    )


def decl3_neut_e(nom, stem):
    """III declinatio neuter i-stem -e: mare/maris — abl.sg -ī, nom.pl -ia."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl3_neut_al(nom, stem):
    """III declinatio neuter i-stem -al: animal/animālis — abl.sg -ī, nom.pl -ia."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl3_neut_ar(nom, stem):
    """III declinatio neuter i-stem -ar: exemplar/exemplāris — same pattern as -al."""
    return _forms(
        nom,         stem+"is",    stem+"ī",    nom,         nom,         stem+"ī",
        stem+"ia",   stem+"ium",   stem+"ibus", stem+"ia",   stem+"ia",   stem+"ibus",
    )


def decl4_us(stem):
    """IV declinatio m./f.: fructus pattern (stem = fruct)."""
    return _forms(
        stem+"us",   stem+"ūs",    stem+"uī",   stem+"um",   stem+"us",   stem+"ū",
        stem+"ūs",   stem+"uum",   stem+"ibus", stem+"ūs",   stem+"ūs",   stem+"ibus",
    )


def decl4_u(stem):
    """IV declinatio neutra: cornū pattern (stem = corn)."""
    return _forms(
        stem+"ū",    stem+"ūs",    stem+"ū",    stem+"ū",    stem+"ū",    stem+"ū",
        stem+"ua",   stem+"uum",   stem+"ibus", stem+"ua",   stem+"ua",   stem+"ibus",
    )


def decl5(nom, stem, gen_sg=None, dat_sg=None):
    """V declinatio: rēs/reī pattern. stem = r for rēs, di for diēs, etc.
    gen_sg/dat_sg override for vowel variants (reī vs diēī)."""
    g = gen_sg or (stem + "eī")
    d = dat_sg or g
    return _forms(
        nom,         g,            d,           stem+"em",   nom,         stem+"ē",
        nom,         stem+"ērum",  stem+"ēbus", nom,         nom,         stem+"ēbus",
    )


# ─── Paradigmas de estudo (19 palavras) ─────────────────────────────────────
# Cada entrada: (declinação, subtipo, nom_sg, gen_sg, gênero, significado, forms)

WORDS = [
    # ── I Declinatio ──
    ("I", "Feminina (-a, -ae)", "rosa", "rosae", "f.", "rosa",
     decl1("ros")),

    # ── II Declinatio ──
    ("II", "Masculina (-us, -ī)", "dominus", "dominī", "m.", "senhor",
     decl2_us("domin")),
    ("II", "Masculina (-er, -ī) — puer", "puer", "puerī", "m.", "menino",
     decl2_er("puer", "puer")),
    ("II", "Masculina (-er, -ī) — ager", "ager", "agrī", "m.", "campo",
     decl2_er("ager", "agr")),
    ("II", "Masculina (-ir, -ī) — vir", "vir", "virī", "m.", "homem",
     decl2_ir("vir", "vir")),
    ("II", "Neutra (-um, -ī)", "bellum", "bellī", "n.", "guerra",
     decl2_um("bell")),

    # ── III Declinatio ──
    ("III", "Consoante (m.)", "rex", "regis", "m.", "rei",
     decl3_cons("rex", "reg")),
    ("III", "Consoante (f.)", "nox", "noctis", "f.", "noite",
     decl3_mixed("nox", "noct")),
    ("III", "Tema em -i (m./f.)", "civis", "civis", "m./f.", "cidadão",
     decl3_i("civis", "civ")),
    ("III", "Neutra (consoante) — corpus", "corpus", "corporis", "n.", "corpo",
     decl3_cons("corpus", "corpor", "n.")),
    ("III", "Neutra (consoante) — caput", "caput", "capitis", "n.", "cabeça",
     decl3_cons("caput", "capit", "n.")),
    ("III", "Neutra (consoante) — nōmen", "nōmen", "nōminis", "n.", "nome",
     decl3_cons("nōmen", "nōmin", "n.")),
    ("III", "Neutra (tema em -i) — mare", "mare", "maris", "n.", "mar",
     decl3_neut_e("mare", "mar")),
    ("III", "Neutra (tema em -i) — animal", "animal", "animālis", "n.", "animal",
     decl3_neut_al("animal", "animāl")),
    ("III", "Neutra (tema em -i) — exemplar", "exemplar", "exemplāris", "n.", "exemplar",
     decl3_neut_ar("exemplar", "exemplār")),

    # ── IV Declinatio ──
    ("IV", "Masculina (-us, -ūs)", "fructus", "fructūs", "m.", "fruto",
     decl4_us("fruct")),
    ("IV", "Neutra (-ū, -ūs)", "cornū", "cornūs", "n.", "chifre",
     decl4_u("corn")),

    # ── V Declinatio ──
    ("V", "Feminina (-ēs, -eī)", "rēs", "reī", "f.", "coisa",
     decl5("rēs", "r", gen_sg="reī", dat_sg="reī")),
    ("V", "m./f. (-ēs, -ēī)", "diēs", "diēī", "m./f.", "dia",
     decl5("diēs", "di", gen_sg="diēī", dat_sg="diēī")),
]


# ─── Palavras extras (só para quiz/prática/desafio, não aparecem no estudo) ──

EXTRA_WORDS = [
    # ═══════════════════════════════════════════════════════════════════════════
    # I DECLINATIO (~25 palavras)
    # ═══════════════════════════════════════════════════════════════════════════
    # -- já existiam --
    ("I", "Feminina (-a, -ae)", "aqua", "aquae", "f.", "água", decl1("aqu")),
    ("I", "Feminina (-a, -ae)", "terra", "terrae", "f.", "terra", decl1("terr")),
    ("I", "Feminina (-a, -ae)", "puella", "puellae", "f.", "menina", decl1("puell")),
    ("I", "Masculina (-a, -ae)", "nauta", "nautae", "m.", "marinheiro", decl1("naut")),
    ("I", "Masculina (-a, -ae)", "agricola", "agricolae", "m.", "agricultor", decl1("agricol")),
    # -- novas --
    ("I", "Feminina (-a, -ae)", "via", "viae", "f.", "caminho", decl1("vi")),
    ("I", "Feminina (-a, -ae)", "vita", "vitae", "f.", "vida", decl1("vit")),
    ("I", "Feminina (-a, -ae)", "fīlia", "fīliae", "f.", "filha", decl1("fīli")),
    ("I", "Feminina (-a, -ae)", "silva", "silvae", "f.", "floresta", decl1("silv")),
    ("I", "Feminina (-a, -ae)", "patria", "patriae", "f.", "pátria", decl1("patri")),
    ("I", "Feminina (-a, -ae)", "porta", "portae", "f.", "porta/portão", decl1("port")),
    ("I", "Feminina (-a, -ae)", "causa", "causae", "f.", "causa", decl1("caus")),
    ("I", "Feminina (-a, -ae)", "cūra", "cūrae", "f.", "cuidado", decl1("cūr")),
    ("I", "Feminina (-a, -ae)", "fōrma", "fōrmae", "f.", "forma/beleza", decl1("fōrm")),
    ("I", "Feminina (-a, -ae)", "fortūna", "fortūnae", "f.", "fortuna", decl1("fortūn")),
    ("I", "Feminina (-a, -ae)", "grātia", "grātiae", "f.", "graça/favor", decl1("grāti")),
    ("I", "Feminina (-a, -ae)", "īra", "īrae", "f.", "ira", decl1("īr")),
    ("I", "Feminina (-a, -ae)", "līttera", "lītterae", "f.", "letra", decl1("lītter")),
    ("I", "Feminina (-a, -ae)", "nātūra", "nātūrae", "f.", "natureza", decl1("nātūr")),
    ("I", "Feminina (-a, -ae)", "pecūnia", "pecūniae", "f.", "dinheiro", decl1("pecūni")),
    ("I", "Feminina (-a, -ae)", "poena", "poenae", "f.", "pena/castigo", decl1("poen")),
    ("I", "Feminina (-a, -ae)", "prōvincia", "prōvinciae", "f.", "província", decl1("prōvinci")),
    ("I", "Feminina (-a, -ae)", "sapientia", "sapientiae", "f.", "sabedoria", decl1("sapienti")),
    ("I", "Masculina (-a, -ae)", "poēta", "poētae", "m.", "poeta", decl1("poēt")),
    ("I", "Masculina (-a, -ae)", "incola", "incolae", "m.", "habitante", decl1("incol")),
    ("I", "Feminina (-a, -ae)", "fāma", "fāmae", "f.", "fama/reputação", decl1("fām")),
    ("I", "Feminina (-a, -ae)", "flamma", "flammae", "f.", "chama", decl1("flamm")),
    ("I", "Feminina (-a, -ae)", "pugna", "pugnae", "f.", "luta/batalha", decl1("pugn")),

    # ═══════════════════════════════════════════════════════════════════════════
    # II DECLINATIO (~30 palavras)
    # ═══════════════════════════════════════════════════════════════════════════
    # -- já existiam --
    ("II", "Masculina (-us, -ī)", "servus", "servī", "m.", "escravo", decl2_us("serv")),
    ("II", "Masculina (-us, -ī)", "amīcus", "amīcī", "m.", "amigo", decl2_us("amīc")),
    ("II", "Masculina (-us, -ī)", "filius", "filiī", "m.", "filho", decl2_ius("fil")),
    ("II", "Neutra (-um, -ī)", "verbum", "verbī", "n.", "palavra", decl2_um("verb")),
    ("II", "Neutra (-um, -ī)", "templum", "templī", "n.", "templo", decl2_um("templ")),
    ("II", "Masculina (-er, -ī) — magister", "magister", "magistrī", "m.", "mestre",
     decl2_er("magister", "magistr")),
    # -- novas -us --
    ("II", "Masculina (-us, -ī)", "animus", "animī", "m.", "ânimo/alma", decl2_us("anim")),
    ("II", "Masculina (-us, -ī)", "campus", "campī", "m.", "planície", decl2_us("camp")),
    ("II", "Masculina (-us, -ī)", "equus", "equī", "m.", "cavalo", decl2_us("equ")),
    ("II", "Masculina (-us, -ī)", "locus", "locī", "m.", "lugar", decl2_us("loc")),
    ("II", "Masculina (-us, -ī)", "modus", "modī", "m.", "modo/medida", decl2_us("mod")),
    ("II", "Masculina (-us, -ī)", "mūrus", "mūrī", "m.", "muro", decl2_us("mūr")),
    ("II", "Masculina (-us, -ī)", "numerus", "numerī", "m.", "número", decl2_us("numer")),
    ("II", "Masculina (-us, -ī)", "populus", "populī", "m.", "povo", decl2_us("popul")),
    ("II", "Masculina (-us, -ī)", "ventus", "ventī", "m.", "vento", decl2_us("vent")),
    ("II", "Masculina (-us, -ī)", "annus", "annī", "m.", "ano", decl2_us("ann")),
    ("II", "Masculina (-us, -ī)", "gladius", "gladiī", "m.", "espada", decl2_ius("glad")),
    ("II", "Masculina (-us, -ī)", "deus", "deī", "m.", "deus", decl2_us("de")),
    ("II", "Masculina (-us, -ī)", "hortus", "hortī", "m.", "jardim", decl2_us("hort")),
    ("II", "Masculina (-us, -ī)", "oculus", "oculī", "m.", "olho", decl2_us("ocul")),
    # -- novas -er --
    ("II", "Masculina (-er, -ī) — liber", "liber", "librī", "m.", "livro",
     decl2_er("liber", "libr")),
    ("II", "Masculina (-er, -ī) — socer", "socer", "socerī", "m.", "sogro",
     decl2_er("socer", "socer")),
    # -- novas -um (neutras) --
    ("II", "Neutra (-um, -ī)", "dōnum", "dōnī", "n.", "dom/presente", decl2_um("dōn")),
    ("II", "Neutra (-um, -ī)", "oppidum", "oppidī", "n.", "cidade fortificada", decl2_um("oppid")),
    ("II", "Neutra (-um, -ī)", "periculum", "periculī", "n.", "perigo", decl2_um("pericul")),
    ("II", "Neutra (-um, -ī)", "rēgnum", "rēgnī", "n.", "reino", decl2_um("rēgn")),
    ("II", "Neutra (-um, -ī)", "signum", "signī", "n.", "sinal/estandarte", decl2_um("sign")),
    ("II", "Neutra (-um, -ī)", "cōnsilium", "cōnsiliī", "n.", "conselho/plano", decl2_um("cōnsili")),
    ("II", "Neutra (-um, -ī)", "praemium", "praemiī", "n.", "prêmio", decl2_um("praemi")),
    ("II", "Neutra (-um, -ī)", "auxilium", "auxiliī", "n.", "auxílio", decl2_um("auxili")),
    ("II", "Masculina (-us, -ī)", "discipulus", "discipulī", "m.", "aluno", decl2_us("discipul")),
    ("II", "Masculina (-us, -ī)", "medicus", "medicī", "m.", "médico", decl2_us("medic")),

    # ═══════════════════════════════════════════════════════════════════════════
    # III DECLINATIO (~60 palavras)
    # ═══════════════════════════════════════════════════════════════════════════
    # -- já existiam --
    ("III", "Consoante (m.)", "mīles", "mīlitis", "m.", "soldado",
     decl3_cons("mīles", "mīlit")),
    ("III", "Consoante (m.)", "cōnsul", "cōnsulis", "m.", "cônsul",
     decl3_cons("cōnsul", "cōnsul")),
    ("III", "Consoante (f.)", "vōx", "vōcis", "f.", "voz",
     decl3_cons("vōx", "vōc", "f.")),
    ("III", "Consoante (f.)", "lēx", "lēgis", "f.", "lei",
     decl3_cons("lēx", "lēg", "f.")),
    ("III", "Consoante (m.)", "pater", "patris", "m.", "pai",
     decl3_cons("pater", "patr")),
    ("III", "Consoante (f.)", "māter", "mātris", "f.", "mãe",
     decl3_cons("māter", "mātr", "f.")),
    ("III", "Consoante (m.)", "homō", "hominis", "m.", "homem",
     decl3_cons("homō", "homin")),
    ("III", "Consoante (n.) — tempus", "tempus", "temporis", "n.", "tempo",
     decl3_cons("tempus", "tempor", "n.")),
    ("III", "Consoante (n.) — flūmen", "flūmen", "flūminis", "n.", "rio",
     decl3_cons("flūmen", "flūmin", "n.")),
    ("III", "Misto (f.) — urbs", "urbs", "urbis", "f.", "cidade",
     decl3_mixed("urbs", "urb")),
    ("III", "Misto (m.) — mōns", "mōns", "montis", "m.", "monte",
     decl3_mixed("mōns", "mont")),
    ("III", "Tema em -i (m.)", "hostis", "hostis", "m.", "inimigo",
     decl3_i("hostis", "host")),
    ("III", "Tema em -i (f.)", "turris", "turris", "f.", "torre",
     decl3_i_turris("turris", "turr")),

    # -- novas: consoante masc --
    ("III", "Consoante (m.)", "dux", "ducis", "m.", "líder/general",
     decl3_cons("dux", "duc")),
    ("III", "Consoante (m.)", "prīnceps", "prīncipis", "m.", "príncipe/primeiro",
     decl3_cons("prīnceps", "prīncip")),
    ("III", "Consoante (m.)", "sōl", "sōlis", "m.", "sol",
     decl3_cons("sōl", "sōl")),
    ("III", "Consoante (m.)", "leō", "leōnis", "m.", "leão",
     decl3_cons("leō", "leōn")),
    ("III", "Consoante (m.)", "sermō", "sermōnis", "m.", "discurso",
     decl3_cons("sermō", "sermōn")),
    ("III", "Consoante (m.)", "ōrdō", "ōrdinis", "m.", "ordem/fileira",
     decl3_cons("ōrdō", "ōrdin")),
    ("III", "Consoante (m.)", "imperātor", "imperātōris", "m.", "imperador/general",
     decl3_cons("imperātor", "imperātōr")),
    ("III", "Consoante (m.)", "ōrātor", "ōrātōris", "m.", "orador",
     decl3_cons("ōrātor", "ōrātōr")),
    ("III", "Consoante (m.)", "labor", "labōris", "m.", "trabalho",
     decl3_cons("labor", "labōr")),
    ("III", "Consoante (m.)", "honor", "honōris", "m.", "honra",
     decl3_cons("honor", "honōr")),
    ("III", "Consoante (m.)", "frāter", "frātris", "m.", "irmão",
     decl3_cons("frāter", "frātr")),
    ("III", "Consoante (m.)", "senātor", "senātōris", "m.", "senador",
     decl3_cons("senātor", "senātōr")),
    ("III", "Consoante (m.)", "pastor", "pastōris", "m.", "pastor",
     decl3_cons("pastor", "pastōr")),
    ("III", "Consoante (m.)", "iūdex", "iūdicis", "m.", "juiz",
     decl3_cons("iūdex", "iūdic")),
    ("III", "Consoante (m.)", "pēs", "pedis", "m.", "pé",
     decl3_cons("pēs", "ped")),
    ("III", "Consoante (m.)", "custōs", "custōdis", "m.", "guarda",
     decl3_cons("custōs", "custōd")),
    ("III", "Consoante (f.)", "crux", "crucis", "f.", "cruz",
     decl3_cons("crux", "cruc", "f.")),
    ("III", "Consoante (m.)", "nepōs", "nepōtis", "m.", "neto",
     decl3_cons("nepōs", "nepōt")),
    ("III", "Consoante (m.)", "sacerdōs", "sacerdōtis", "m.", "sacerdote",
     decl3_cons("sacerdōs", "sacerdōt")),

    # -- novas: consoante fem --
    ("III", "Consoante (f.)", "pāx", "pācis", "f.", "paz",
     decl3_cons("pāx", "pāc", "f.")),
    ("III", "Consoante (f.)", "lūx", "lūcis", "f.", "luz",
     decl3_cons("lūx", "lūc", "f.")),
    ("III", "Consoante (f.)", "virtūs", "virtūtis", "f.", "virtude/coragem",
     decl3_cons("virtūs", "virtūt", "f.")),
    ("III", "Consoante (f.)", "salūs", "salūtis", "f.", "saúde/salvação",
     decl3_cons("salūs", "salūt", "f.")),
    ("III", "Consoante (f.)", "lībertās", "lībertātis", "f.", "liberdade",
     decl3_cons("lībertās", "lībertāt", "f.")),
    ("III", "Consoante (f.)", "cīvitās", "cīvitātis", "f.", "cidadania/estado",
     decl3_cons("cīvitās", "cīvitāt", "f.")),
    ("III", "Consoante (f.)", "vēritās", "vēritātis", "f.", "verdade",
     decl3_cons("vēritās", "vēritāt", "f.")),
    ("III", "Consoante (f.)", "aetās", "aetātis", "f.", "idade/época",
     decl3_cons("aetās", "aetāt", "f.")),
    ("III", "Consoante (f.)", "voluntās", "voluntātis", "f.", "vontade",
     decl3_cons("voluntās", "voluntāt", "f.")),
    ("III", "Consoante (f.)", "potestās", "potestātis", "f.", "poder",
     decl3_cons("potestās", "potestāt", "f.")),
    ("III", "Consoante (f.)", "mulier", "mulieris", "f.", "mulher",
     decl3_cons("mulier", "mulier", "f.")),
    ("III", "Consoante (f.)", "soror", "sorōris", "f.", "irmã",
     decl3_cons("soror", "sorōr", "f.")),
    ("III", "Consoante (f.)", "uxor", "uxōris", "f.", "esposa",
     decl3_cons("uxor", "uxōr", "f.")),
    ("III", "Consoante (f.)", "arbor", "arboris", "f.", "árvore",
     decl3_cons("arbor", "arbor", "f.")),

    # -- novas: consoante neutra --
    ("III", "Consoante (n.)", "iter", "itineris", "n.", "caminho/viagem",
     decl3_cons("iter", "itiner", "n.")),
    ("III", "Consoante (n.)", "genus", "generis", "n.", "gênero/tipo",
     decl3_cons("genus", "gener", "n.")),
    ("III", "Consoante (n.)", "opus", "operis", "n.", "obra/trabalho",
     decl3_cons("opus", "oper", "n.")),
    ("III", "Consoante (n.)", "lītus", "lītoris", "n.", "litoral/praia",
     decl3_cons("lītus", "lītor", "n.")),
    ("III", "Consoante (n.)", "sīdus", "sīderis", "n.", "estrela/constelação",
     decl3_cons("sīdus", "sīder", "n.")),
    ("III", "Consoante (n.)", "vulnus", "vulneris", "n.", "ferida",
     decl3_cons("vulnus", "vulner", "n.")),
    ("III", "Consoante (n.)", "carmen", "carminis", "n.", "canto/poema",
     decl3_cons("carmen", "carmin", "n.")),
    ("III", "Consoante (n.)", "lūmen", "lūminis", "n.", "luz/lume",
     decl3_cons("lūmen", "lūmin", "n.")),
    ("III", "Consoante (n.)", "ōmen", "ōminis", "n.", "presságio",
     decl3_cons("ōmen", "ōmin", "n.")),

    # -- novas: misto --
    ("III", "Misto (f.)", "pars", "partis", "f.", "parte",
     decl3_mixed("pars", "part")),
    ("III", "Misto (f.)", "ars", "artis", "f.", "arte",
     decl3_mixed("ars", "art")),
    ("III", "Misto (f.)", "mors", "mortis", "f.", "morte",
     decl3_mixed("mors", "mort")),
    ("III", "Misto (f.)", "gēns", "gentis", "f.", "família/nação",
     decl3_mixed("gēns", "gent")),
    ("III", "Misto (f.)", "mēns", "mentis", "f.", "mente",
     decl3_mixed("mēns", "ment")),
    ("III", "Misto (m.)", "pōns", "pontis", "m.", "ponte",
     decl3_mixed("pōns", "pont")),
    ("III", "Misto (m.)", "dēns", "dentis", "m.", "dente",
     decl3_mixed("dēns", "dent")),
    ("III", "Misto (f.)", "frons", "frontis", "f.", "fronte/fachada",
     decl3_mixed("frons", "front")),
    ("III", "Misto (f.)", "stirps", "stirpis", "f.", "tronco/raiz",
     decl3_mixed("stirps", "stirp")),
    # -- novas: i-stem m/f --
    ("III", "Tema em -i (m.)", "ignis", "ignis", "m.", "fogo",
     decl3_i("ignis", "ign")),
    ("III", "Tema em -i (f.)", "nāvis", "nāvis", "f.", "navio",
     decl3_i_turris("nāvis", "nāv")),
    ("III", "Tema em -i (f.)", "classis", "classis", "f.", "frota/classe",
     decl3_i("classis", "class")),
    ("III", "Tema em -i (f.)", "febris", "febris", "f.", "febre",
     decl3_i_turris("febris", "febr")),
    ("III", "Tema em -i (f.)", "sitis", "sitis", "f.", "sede",
     decl3_i_turris("sitis", "sit")),
    ("III", "Tema em -i (m.)", "collis", "collis", "m.", "colina",
     decl3_i("collis", "coll")),
    ("III", "Tema em -i (m.)", "fīnis", "fīnis", "m.", "fim/fronteira",
     decl3_i("fīnis", "fīn")),

    # -- novas: neut -e --
    ("III", "Neutra (-e)", "sedīle", "sedīlis", "n.", "assento",
     decl3_neut_e("sedīle", "sedīl")),

    # -- novas: neut -al --
    ("III", "Neutra (-al)", "tribūnal", "tribūnālis", "n.", "tribunal",
     decl3_neut_al("tribūnal", "tribūnāl")),
    ("III", "Neutra (-al)", "vectigal", "vectigālis", "n.", "imposto",
     decl3_neut_al("vectigal", "vectigāl")),
    ("III", "Neutra (-al)", "capital", "capitālis", "n.", "crime capital",
     decl3_neut_al("capital", "capitāl")),

    # -- novas: neut -ar --
    ("III", "Neutra (-ar)", "calcar", "calcāris", "n.", "esporão",
     decl3_neut_ar("calcar", "calcār")),
    ("III", "Neutra (-ar)", "pulvīnar", "pulvīnāris", "n.", "almofada sagrada",
     decl3_neut_ar("pulvīnar", "pulvīnār")),

    # ═══════════════════════════════════════════════════════════════════════════
    # IV DECLINATIO (~20 palavras)
    # ═══════════════════════════════════════════════════════════════════════════
    # -- já existiam --
    ("IV", "Feminina (-us, -ūs)", "manus", "manūs", "f.", "mão", decl4_us("man")),
    ("IV", "Masculina (-us, -ūs)", "lacus", "lacūs", "m.", "lago", decl4_us("lac")),
    ("IV", "Neutra (-ū, -ūs)", "genū", "genūs", "n.", "joelho", decl4_u("gen")),
    # -- novas -us --
    ("IV", "Masculina (-us, -ūs)", "exercitus", "exercitūs", "m.", "exército", decl4_us("exercit")),
    ("IV", "Masculina (-us, -ūs)", "senātus", "senātūs", "m.", "senado", decl4_us("senāt")),
    ("IV", "Masculina (-us, -ūs)", "cursus", "cursūs", "m.", "corrida/curso", decl4_us("curs")),
    ("IV", "Masculina (-us, -ūs)", "cāsus", "cāsūs", "m.", "queda/caso", decl4_us("cās")),
    ("IV", "Masculina (-us, -ūs)", "ēventus", "ēventūs", "m.", "resultado", decl4_us("ēvent")),
    ("IV", "Masculina (-us, -ūs)", "impetus", "impetūs", "m.", "ataque/ímpeto", decl4_us("impet")),
    ("IV", "Masculina (-us, -ūs)", "metus", "metūs", "m.", "medo", decl4_us("met")),
    ("IV", "Masculina (-us, -ūs)", "passus", "passūs", "m.", "passo", decl4_us("pass")),
    ("IV", "Masculina (-us, -ūs)", "portus", "portūs", "m.", "porto", decl4_us("port")),
    ("IV", "Masculina (-us, -ūs)", "ritus", "ritūs", "m.", "rito", decl4_us("rit")),
    ("IV", "Masculina (-us, -ūs)", "spiritus", "spiritūs", "m.", "espírito/sopro", decl4_us("spirit")),
    ("IV", "Masculina (-us, -ūs)", "vultus", "vultūs", "m.", "rosto/expressão", decl4_us("vult")),
    ("IV", "Feminina (-us, -ūs)", "domus", "domūs", "f.", "casa", decl4_us("dom")),
    ("IV", "Feminina (-us, -ūs)", "tribus", "tribūs", "f.", "tribo", decl4_us("trib")),
    ("IV", "Feminina (-us, -ūs)", "acus", "acūs", "f.", "agulha", decl4_us("ac")),
    # -- novas -ū (neutras) --
    ("IV", "Neutra (-ū, -ūs)", "verū", "verūs", "n.", "espeto", decl4_u("ver")),
    ("IV", "Neutra (-ū, -ūs)", "gelū", "gelūs", "n.", "gelo/frio", decl4_u("gel")),
    ("IV", "Masculina (-us, -ūs)", "gradus", "gradūs", "m.", "passo/degrau", decl4_us("grad")),
    ("IV", "Masculina (-us, -ūs)", "adventus", "adventūs", "m.", "chegada", decl4_us("advent")),
    ("IV", "Masculina (-us, -ūs)", "comitātus", "comitātūs", "m.", "comitiva", decl4_us("comitāt")),

    # ═══════════════════════════════════════════════════════════════════════════
    # V DECLINATIO (~20 palavras)
    # ═══════════════════════════════════════════════════════════════════════════
    # -- já existiam --
    ("V", "Feminina (-ēs, -ēī)", "fidēs", "fideī", "f.", "fé",
     decl5("fidēs", "fid", gen_sg="fideī", dat_sg="fideī")),
    ("V", "Feminina (-ēs, -ēī)", "spēs", "speī", "f.", "esperança",
     decl5("spēs", "sp", gen_sg="speī", dat_sg="speī")),
    # -- novas --
    ("V", "Feminina (-ēs, -ēī)", "faciēs", "faciēī", "f.", "face/aspecto",
     decl5("faciēs", "faci", gen_sg="faciēī", dat_sg="faciēī")),
    ("V", "Feminina (-ēs, -ēī)", "effigiēs", "effigiēī", "f.", "imagem/estátua",
     decl5("effigiēs", "effigi", gen_sg="effigiēī", dat_sg="effigiēī")),
    ("V", "Feminina (-ēs, -ēī)", "māteriēs", "māteriēī", "f.", "matéria",
     decl5("māteriēs", "māteri", gen_sg="māteriēī", dat_sg="māteriēī")),
    ("V", "Feminina (-ēs, -ēī)", "seriēs", "seriēī", "f.", "série/sequência",
     decl5("seriēs", "seri", gen_sg="seriēī", dat_sg="seriēī")),
    ("V", "Feminina (-ēs, -ēī)", "speciēs", "speciēī", "f.", "aparência/espécie",
     decl5("speciēs", "speci", gen_sg="speciēī", dat_sg="speciēī")),
    ("V", "Feminina (-ēs, -ēī)", "glaciēs", "glaciēī", "f.", "gelo",
     decl5("glaciēs", "glaci", gen_sg="glaciēī", dat_sg="glaciēī")),
    ("V", "Feminina (-ēs, -ēī)", "prōgeniēs", "prōgeniēī", "f.", "descendência",
     decl5("prōgeniēs", "prōgeni", gen_sg="prōgeniēī", dat_sg="prōgeniēī")),
    ("V", "Feminina (-ēs, -ēī)", "plānitiēs", "plānitiēī", "f.", "planície",
     decl5("plānitiēs", "plāniti", gen_sg="plānitiēī", dat_sg="plānitiēī")),
    ("V", "Feminina (-ēs, -eī)", "aciēs", "acieī", "f.", "linha de batalha/fio",
     decl5("aciēs", "aci", gen_sg="acieī", dat_sg="acieī")),
    ("V", "Feminina (-ēs, -eī)", "pernitiēs", "pernitiēī", "f.", "destruição",
     decl5("pernitiēs", "perniti", gen_sg="pernitiēī", dat_sg="pernitiēī")),
    ("V", "Feminina (-ēs, -eī)", "requiēs", "requieī", "f.", "descanso",
     decl5("requiēs", "requi", gen_sg="requieī", dat_sg="requieī")),
    ("V", "Feminina (-ēs, -eī)", "cariēs", "carieī", "f.", "podridão",
     decl5("cariēs", "cari", gen_sg="carieī", dat_sg="carieī")),
    ("V", "Feminina (-ēs, -eī)", "rabbiēs", "rabieī", "f.", "raiva/fúria",
     decl5("rabbiēs", "rabbi", gen_sg="rabieī", dat_sg="rabieī")),
    ("V", "Feminina (-ēs, -eī)", "canītiēs", "canītiēī", "f.", "cabelo branco/velhice",
     decl5("canītiēs", "canīti", gen_sg="canītiēī", dat_sg="canītiēī")),
    ("V", "Feminina (-ēs, -eī)", "lūxuriēs", "lūxuriēī", "f.", "luxúria",
     decl5("lūxuriēs", "lūxuri", gen_sg="lūxuriēī", dat_sg="lūxuriēī")),
    ("V", "Feminina (-ēs, -eī)", "māceriēs", "māceriēī", "f.", "parede/cerca",
     decl5("māceriēs", "māceri", gen_sg="māceriēī", dat_sg="māceriēī")),
]

# Palavras do estudo + extras = pool completo para quiz/prática/desafio
ALL_DRILL_WORDS = WORDS + EXTRA_WORDS

# ─── Helpers ─────────────────────────────────────────────────────────────────

# Normalization: strip macrons for comparison so the user doesn't need
# a special keyboard.  Correct macron forms are still shown as feedback.

MACRON_MAP = str.maketrans("āēīōūĀĒĪŌŪ", "aeioaAEIOA")  # ū→a? fix below
# We build a proper map:
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
        # Use ANSI: clear screen + clear scrollback + move cursor to top
        sys.stdout.write("\033[2J\033[3J\033[H")
        sys.stdout.flush()


def prompt(msg: str = "") -> str:
    try:
        return input(msg)
    except (EOFError, KeyboardInterrupt):
        print()
        return ""


def pause():
    prompt("\n[Enter para continuar] ")


def header(title: str):
    w = 60
    print()
    print("═" * w)
    print(f"  {title}")
    print("═" * w)


def word_label(w) -> str:
    dec, sub, nom, gen, gender, meaning, _ = w
    return f"{nom}, {gen} ({gender}) — {meaning}  [{dec}a decl., {sub}]"


# ─── Modo 1: Estudo ─────────────────────────────────────────────────────────

def show_table(w):
    dec, sub, nom, gen, gender, meaning, forms = w
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
    header("MODO ESTUDO — Tabelas completas")

    # Group by declination
    by_dec: dict[str, list] = {}
    for w in WORDS:
        by_dec.setdefault(w[0], []).append(w)

    print("\n  Declinações disponíveis:")
    dec_keys = sorted(by_dec.keys())
    for i, dk in enumerate(dec_keys, 1):
        words_in = ", ".join(w[2] for w in by_dec[dk])
        print(f"    {i}. {dk}a Declinatio  ({words_in})")
    print(f"    {len(dec_keys) + 1}. Todas")
    print(f"    0. Voltar")

    choice = prompt("\n  Escolha: ").strip()
    if choice == "0":
        return

    if choice == str(len(dec_keys) + 1):
        selected = WORDS
    elif choice.isdigit() and 1 <= int(choice) <= len(dec_keys):
        selected = by_dec[dec_keys[int(choice) - 1]]
    else:
        print("  Opção inválida.")
        pause()
        return

    clear_screen()
    for w in selected:
        show_table(w)
    pause()


# ─── Modo 2: Prática ────────────────────────────────────────────────────────

def modo_pratica():
    clear_screen()
    header("MODO PRÁTICA — Preencha a forma correta")
    print("  (digite 'sair' para voltar ao menu)\n")
    print("  Dica: não precisa digitar macrons (ā→a é aceito).\n")

    words = list(ALL_DRILL_WORDS)
    random.shuffle(words)

    total = 0
    correct_count = 0

    for w in words:
        dec, sub, nom, gen, gender, meaning, forms = w
        caso = random.choice(CASES)
        num = random.choice(NUMBERS)
        correct = forms[(caso, num)]

        print(f"  ┌─ {nom}, {gen} ({gender}) — {meaning}")
        print(f"  │  {dec}a Declinatio, {sub}")
        print(f"  │  Caso: {caso}  |  Número: {num}")
        answer = prompt("  └─ Resposta: ").strip()

        if answer.lower() == "sair":
            break

        total += 1
        if check_answer(answer, correct):
            correct_count += 1
            print(f"  ✓ Correto!  ({correct})\n")
        else:
            print(f"  ✗ Errado.  Resposta correta: {correct}\n")

    if total > 0:
        pct = correct_count / total * 100
        print(f"\n  Resultado: {correct_count}/{total} ({pct:.0f}%)")
    pause()


# ─── Modo 3: Quiz ───────────────────────────────────────────────────────────

def modo_quiz():
    clear_screen()
    header("MODO QUIZ — Perguntas aleatórias com pontuação")

    n_str = prompt("  Quantas perguntas? [10] ").strip()
    n = int(n_str) if n_str.isdigit() and int(n_str) > 0 else 10

    print(f"\n  {n} perguntas. Digite 'sair' para encerrar.\n")
    print("  Dica: não precisa digitar macrons (ā→a é aceito).\n")

    correct_count = 0
    streak = 0
    best_streak = 0

    for i in range(1, n + 1):
        w = random.choice(ALL_DRILL_WORDS)
        dec, sub, nom, gen, gender, meaning, forms = w
        caso = random.choice(CASES)
        num = random.choice(NUMBERS)
        correct = forms[(caso, num)]

        print(f"  ── Pergunta {i}/{n} ──")
        print(f"  Palavra: {nom}, {gen} ({gender}) — {meaning}")
        print(f"  Declinar no {caso}, {num}:")
        answer = prompt("  > ").strip()

        if answer.lower() == "sair":
            n = i - 1
            break

        if check_answer(answer, correct):
            correct_count += 1
            streak += 1
            if streak > best_streak:
                best_streak = streak
            print(f"  ✓ Correto!  ({correct})")
            if streak >= 3:
                print(f"     Sequência: {streak}!")
        else:
            streak = 0
            print(f"  ✗ Errado.  Correto: {correct}")
        print()

    if n > 0:
        pct = correct_count / n * 100
        header("Resultado do Quiz")
        print(f"  Acertos:          {correct_count}/{n} ({pct:.0f}%)")
        print(f"  Melhor sequência: {best_streak}")
        if pct == 100:
            print("  Excelente! Perfeito!")
        elif pct >= 80:
            print("  Muito bem! Continue praticando.")
        elif pct >= 60:
            print("  Bom, mas revise as declinações que errou.")
        else:
            print("  Recomendo voltar ao modo Estudo antes de tentar novamente.")
    pause()


# ─── Modo 4: Desafio ────────────────────────────────────────────────────────

def modo_desafio():
    clear_screen()
    header("MODO DESAFIO — Decline a palavra inteira")
    print("  Você receberá uma palavra e deverá preencher todos os 12 campos")
    print("  (6 casos × 2 números).")
    print("  Digite 'sair' para voltar.\n")
    print("  Dica: não precisa digitar macrons (ā→a é aceito).\n")

    w = random.choice(WORDS)
    dec, sub, nom, gen, gender, meaning, forms = w

    header(f"Decline: {nom}, {gen} ({gender}) — {meaning}")
    print(f"  {dec}a Declinatio — {sub}\n")

    total = 0
    correct_count = 0
    errors = []

    for num in NUMBERS:
        print(f"  ── {num} ──")
        for caso in CASES:
            correct = forms[(caso, num)]
            answer = prompt(f"    {caso:<14}: ").strip()
            if answer.lower() == "sair":
                if total > 0:
                    pct = correct_count / total * 100
                    print(f"\n  Parcial: {correct_count}/{total} ({pct:.0f}%)")
                pause()
                return
            total += 1
            if check_answer(answer, correct):
                correct_count += 1
                print(f"    ✓ ({correct})")
            else:
                errors.append((caso, num, correct, answer))
                print(f"    ✗ Correto: {correct}")
        print()

    pct = correct_count / total * 100
    header("Resultado do Desafio")
    print(f"  Palavra: {nom}, {gen} ({gender})")
    print(f"  Acertos: {correct_count}/{total} ({pct:.0f}%)")

    if errors:
        print("\n  Erros:")
        for caso, num, correct, given in errors:
            print(f"    {caso:<14} {num:<12}  você: {given or '(vazio)':<16}  correto: {correct}")

    if pct == 100:
        print("\n  Perfeito! Tente outra palavra.")
    pause()


# ─── Menu principal ──────────────────────────────────────────────────────────

def main():
    while True:
        clear_screen()
        header("DECLINATIONES LATINAE — Drill de Memorização")
        print()
        print("  1. Estudo    — Ver tabelas completas")
        print("  2. Prática   — Preencher formas aleatórias")
        print("  3. Quiz      — Perguntas com pontuação")
        print("  4. Desafio   — Declinar palavra inteira")
        print("  0. Sair")
        print()
        choice = prompt("  Escolha: ").strip()

        if choice == "1":
            modo_estudo()
        elif choice == "2":
            modo_pratica()
        elif choice == "3":
            modo_quiz()
        elif choice == "4":
            modo_desafio()
        elif choice == "0":
            print("\n  Vale! Bons estudos.\n")
            sys.exit(0)
        else:
            print("  Opção inválida.")
            pause()


if __name__ == "__main__":
    main()
