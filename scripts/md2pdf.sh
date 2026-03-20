#!/usr/bin/env bash
# md2pdf.sh — Convert a Markdown file to PDF using pandoc + pdflatex
# Usage: ./md2pdf.sh <input.md> [output.pdf]

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Usage: $0 <input.md> [output.pdf]"
  exit 1
fi

INPUT="$1"
OUTPUT="${2:-${INPUT%.md}.pdf}"

if [ ! -f "$INPUT" ]; then
  echo "Error: file '$INPUT' not found"
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
TEX_TMP="${OUTPUT%.pdf}.tmp.tex"

# Step 1: Markdown -> LaTeX (using custom template)
pandoc "$INPUT" \
  -o "$TEX_TMP" \
  --standalone \
  --template="$SCRIPT_DIR/template.tex" \
  --pdf-engine=pdflatex \
  -V lang=pt-BR

# Step 2: Add vertical lines to longtable column specs
# {@{}lll@{}} -> {|l|l|l|}
perl -i -pe '
  s/\{\@\{\}([lcr]+)\@\{\}\}/"{|" . join("|", split("", $1)) . "|}"/ge if /\\begin\{longtable\}/;
' "$TEX_TMP"

# Step 3: Style table headers with colored background
# After \toprule row, color the header row
perl -i -0777 -pe '
  s/(\\toprule\\noalign\{\}\n)(.*?)(\\\\)\n(\\midrule)/
    $1 . "\\rowcolor{headerbg}" . $2 . $3 . "\n" . $4/ge;
' "$TEX_TMP"

# Step 4: Remove \endhead and \endlastfoot blocks (prevents duplicate headers)
perl -i -pe '
  s/\\endhead//g;
  s/\\bottomrule\\noalign\{\}\n?//g;
  s/\\endlastfoot//g;
' "$TEX_TMP"

# Step 5: Add \hline before \end{longtable} to ensure bottom border
perl -i -pe '
  s/\\end\{longtable\}/\\hline\n\\end{longtable}/g;
' "$TEX_TMP"

# Step 5: Style blockquotes (Nota:) as colored note boxes
perl -i -0777 -pe '
  s/\\begin\{quote\}\n(.*?)\\end\{quote\}/
    "\\begin{mdframed}[backgroundcolor=notebg,linecolor=noteborder,linewidth=2pt,topline=false,bottomline=false,rightline=false,innerleftmargin=10pt,innerrightmargin=10pt,innertopmargin=8pt,innerbottommargin=8pt]\n{\\small " . $1 . "}\\end{mdframed}"/ges;
' "$TEX_TMP"

# Step 6: Keep tables together (prevent page breaks mid-table)
perl -i -pe '
  s/\\begin\{longtable\}/\\needspace{8\\baselineskip}\\begin{longtable}/g;
' "$TEX_TMP"

# Add needspace package to preamble
perl -i -pe '
  s/(\\usepackage\{mdframed\})/\1\n\\usepackage{needspace}/;
' "$TEX_TMP"

# Step 7: LaTeX -> PDF (two passes for refs)
OUTDIR="$(cd "$(dirname "$OUTPUT")" && pwd)"
pdflatex -interaction=nonstopmode -output-directory="$OUTDIR" "$TEX_TMP" > /dev/null 2>&1 || true
pdflatex -interaction=nonstopmode -output-directory="$OUTDIR" "$TEX_TMP" > /dev/null 2>&1 || true

# Clean up
TEX_BASE="${TEX_TMP%.tex}"
mv "${TEX_BASE}.pdf" "$OUTPUT" 2>/dev/null || true
rm -f "$TEX_TMP" "${TEX_BASE}.aux" "${TEX_BASE}.log" "${TEX_BASE}.out"

echo "Generated: $OUTPUT"
