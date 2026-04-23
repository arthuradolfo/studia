# Studia — Declinationes Latinae

A Latin declension learning system with interactive drills and reference materials.

## Table of Contents

- [Features](#features)
- [Structure](#structure)
- [Usage](#usage)
- [Language](#language)
- [Testing](#testing)

## Features

- **4 study modes**: Estudo (reference tables), Prática (random drills), Quiz (scored test), Desafio (full-word challenge)
- **175+ Latin words** across all 5 declensions
- **Macron-tolerant input** — type `a` instead of `ā`
- **Dark/light theme** with zoom controls
- **CLI drill** in Python for terminal practice
- **PDF reference** with styled declension tables

## Structure

```
studia/
├── index.html              # Web interface (entry point)
├── css/style.css           # Styles
├── js/
│   ├── app.js              # Application orchestrator
│   ├── helpers.js           # Shared utilities
│   ├── i18n.js              # Translation engine
│   ├── data/                # Declension generators, word lists, adjectives, prepositions
│   ├── modes/               # Study, practice, quiz, challenge modes (nouns/adj/prep)
│   └── translations/        # Portuguese & English UI strings
├── tests/
│   ├── unit/                # Unit tests (data, helpers, i18n)
│   └── integration/         # Integration tests (modes, app)
├── docs/
│   ├── declinationes.md     # Reference tables (source)
│   └── declinationes.pdf    # Reference tables (rendered)
└── scripts/
    ├── declinationes_drill.py  # CLI drill (Python 3)
    ├── md2pdf.sh               # Markdown → PDF build script
    └── template.tex            # LaTeX template for PDF
```

## Usage

### Web

The app uses ES modules and needs a local server:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open [http://localhost:3000](http://localhost:3000) (serve) or [http://localhost:8000](http://localhost:8000) (python).

### CLI

```bash
python3 scripts/declinationes_drill.py
```

### Build PDF

Requires Pandoc and pdflatex:

```bash
scripts/md2pdf.sh
```

## Language

UI is in Portuguese. Latin content follows Classical Latin with scholarly references (Allen & Greenough, Faria, Ernout & Thomas).

## Testing

Tests use [Vitest](https://vitest.dev/) with jsdom for DOM simulation.

```bash
npm test                # run all tests
npm run test:watch      # watch mode
npm run test:coverage   # run with coverage report
```

**295 tests** across 20 files:
- **Unit tests** — declension generators, adjective generators, word/adjective/preposition data integrity, helpers, i18n (100% coverage on data layer)
- **Integration tests** — all 12 mode files (study, practice, quiz, challenge for nouns/adjectives/prepositions, concordance) and app orchestrator
