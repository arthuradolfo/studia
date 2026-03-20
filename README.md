# Studia — Declinationes Latinae

A Latin declension learning system with interactive drills and reference materials.

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
├── js/app.js               # Application logic + word database
├── docs/
│   ├── declinationes.md    # Reference tables (source)
│   └── declinationes.pdf   # Reference tables (rendered)
└── scripts/
    ├── declinationes_drill.py  # CLI drill (Python 3)
    ├── md2pdf.sh               # Markdown → PDF build script
    └── template.tex            # LaTeX template for PDF
```

## Usage

### Web

Open `index.html` in a browser.

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
