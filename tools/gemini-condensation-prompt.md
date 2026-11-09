# Gemini manuscript-condensation prompt

Paste this into Gemini along with the manuscript file, when the manuscript is too
long to upload directly into the atlas-build session. See
`METHODOLOGY.md`'s "Manuscript condensation via external AI" section for why this
step exists and what it does and doesn't replace.

v2 (2026-11-09) — rewritten after the first version's output wasn't actually valid
Markdown; this version is explicit about output format and bans any wrapper text
around the document.

---

```
You are condensing a long academic manuscript into a single, structured Markdown
document for someone else to build an interactive web tool from. They will never
see the original manuscript — only what you produce — so completeness and
exactness matter more than brevity.

OUTPUT FORMAT — follow this exactly:
- Your entire reply must be ONE valid Markdown document, nothing else.
- Do not add any introductory sentence ("Here is the condensed document...") or
  closing remark. The first character of your reply is the first `#` of the
  document; the last character is the end of the reference list.
- Use real Markdown syntax throughout: `#`/`##`/`###` for section headers (never
  bold text pretending to be a header), `-` for bullet lists, `1.`/`2.` for
  ordered lists, `**bold**` only for genuine emphasis, and a blank line between
  block elements. No HTML tags. No tables unless the source itself has a table
  you are transcribing.
- Do not wrap the whole document in a code fence.

CONTENT — produce these sections, in this order:

## Manuscript metadata
Title, authors (if given), journal, article type (e.g. scoping review,
systematic review, narrative review), year.

## Abstract / summary
The manuscript's own abstract, condensed only for length — never reworded to
change its meaning.

## Purpose statement
A verbatim quote of the manuscript's stated purpose/aim, with the section or
paragraph number it's quoted from.

## Methodology
Review type, databases searched, search date range, PICOS or equivalent
inclusion/exclusion criteria, quality-assessment framework used (e.g. PRISMA,
GRADE, Newcastle-Ottawa), and any limitations the manuscript states about its
own methodology.

## Clinical content
Organise this by topic or decision point, following the manuscript's own
structure (e.g. matching the sections/boxes of its own figure/algorithm, if it
has one). For every claim, tag it with the reference number(s) that support it,
exactly as numbered in the manuscript's own reference list — e.g. "Lipid
emulsion is rescue-only, not first-line [12,47]." Never paraphrase a numeric
threshold, dose, or cutoff — copy the manuscript's own number and unit exactly.
If something is ambiguous or you are not fully sure how to read it, write
`UNCLEAR — manuscript says: "<exact quote>"` rather than guessing or smoothing
it over.

## Guideline-sourced details not in the manuscript's own text
A separate section flagging any figure/table/algorithm value that is sourced
from an external guideline the manuscript cites, rather than from the review's
own pooled/charted data — so the reader can tell the review's own evidence
apart from an externally-adopted threshold.

## References
The manuscript's complete reference list, copied verbatim — every single
entry, never shortened or sampled even if you had to condense the narrative
sections above. For each reference, include its DOI if the manuscript gives
one; if it doesn't, write "no DOI given" rather than inventing or guessing one.
Do not renumber references — keep the manuscript's own numbering exactly, since
the clinical-content section above cites by that same numbering.

HARD RULES (apply throughout, not just in one section):
- Never invent, estimate, or fill in a gap in the manuscript. If it isn't
  there, say so (`UNCLEAR` or "not stated in the manuscript") rather than
  supplying a plausible-sounding value.
- Never paraphrase a number, dose, unit, or threshold — copy it exactly as
  written, including its precision (e.g. "65 mmHg", not "around 65").
- Never shorten, sample, or drop references, even under length pressure —
  condense prose, never the reference list.
```
