# Gemini manuscript-condensation prompt

Paste this into Gemini along with the manuscript file — and the authors' own
decision-algorithm figure image too, when there is one — when the manuscript
is too long to upload directly into the atlas-build session. See
`METHODOLOGY.md`'s "Manuscript condensation via external AI" section for why
this step exists and what it does and doesn't replace.

v3 (2026-11-17) — merged in a separate box-by-box figure-extraction variant
that had been used ad hoc for manuscripts with their own figure (now one
prompt handles both a manuscript-with-figure and a text-only manuscript, see
"## 4. Clinical content" below). Also added calculator-candidate flagging:
now that the atlas builds interactive calculators for named clinical scores
(HAS-BLED, CHA₂DS₂-VASc, ...), Gemini should notice and name a score when it
sees one so it doesn't get missed during a later build — but it only flags
it here, never researches or sources it. **That part of the plan hasn't
changed**: a flagged score still gets logged as a candidate in
`calculator-sourcebook/README.md`, researched there via Perplexity (using
`calculator-sourcebook/calculator-research-prompt.md`), and independently
re-verified before any calculator is built — exactly as HAS-BLED and
CHA₂DS₂-VASc were.

v2 (2026-11-09) — rewritten after the first version's output wasn't actually valid
Markdown; this version is explicit about output format and bans any wrapper text
around the document.

---

```
You are condensing a long academic manuscript — and, if one is attached, its
own decision-algorithm figure — into a single, structured Markdown document
for someone else to build an interactive web tool from. They will never see
the original manuscript or figure, only what you produce, so completeness and
exactness matter more than brevity. This is pure condensation and extraction:
never verify, fact-check, or assess whether a cited reference is real,
correct, or trustworthy — that happens independently, separately, afterward.

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

## 1. Manuscript metadata
Full title, authors (or "blinded" if a blinded submission), journal/status,
year, the manuscript's own stated type (systematic review, narrative review,
scoping review, etc.), and approximate word count.

## 2. Abstract / Purpose
The manuscript's own abstract, condensed only for length — never reworded to
change its meaning. If a figure/algorithm is attached, also quote verbatim the
exact sentence(s) where the manuscript states that figure's PURPOSE, with the
section or paragraph number it's quoted from.

## 3. Methodology summary
Review type, databases searched, search date range, PICOS or equivalent
inclusion/exclusion criteria, number of included studies/references, quality-
assessment framework used (e.g. PRISMA, GRADE, Newcastle-Ottawa), and any
limitations the manuscript states about its own methodology. Keep this short
— a paragraph, not a page.

## 4. Clinical content

**If a figure/algorithm image is attached:** go through EVERY labeled box,
diamond, and branch in it, in the figure's own reading order. For each one
give:
- The box's exact label text, transcribed by you from the image, so it can
  be cross-checked directly against the figure
- What this step means, drawn from the manuscript's own text (never your own
  medical knowledge)
- WHY the algorithm calls for this step — the manuscript's own stated
  rationale
- Any specific number/dose/threshold tied to this box, exactly as stated,
  including its precision and unit (e.g. "65 mmHg", never "around 65")
- The manuscript's own reference number(s) backing this box's content,
  exactly as numbered in the manuscript's reference list (never renumbered)
- The section/page number where you found this, so it can be checked
- **Calculator-candidate flag**: if this box's step is, or depends on, a
  named, weighted multi-criterion scoring system — e.g. HAS-BLED,
  CHA₂DS₂-VASc, Wells score, PESI/sPESI, Ranson's criteria, Glasgow Coma
  Scale, qSOFA, CURB-65, APACHE II, Child-Pugh, MELD, Cockcroft-Gault,
  Charlson Comorbidity Index, or any other named score not in this list —
  tag the box inline with `⚠ CALCULATOR CANDIDATE: <score name>` and list
  its components/point values exactly as given in the manuscript or figure.
  If the manuscript names the score without detailing its components, say
  that instead of filling them in. Do not research, verify, or source the
  score itself here — naming it is the whole job; sourcing it is a separate
  later step by someone else.

Flag explicitly, inline, anywhere a number or threshold in a box is sourced
from an EXTERNAL guideline the review cites (not the review's own primary-
literature synthesis) — this matters for how it gets written up later. If the
figure and the manuscript text disagree anywhere, or a branch's logic is
ambiguous, say so explicitly (`UNCLEAR — manuscript says: "<exact quote>"`)
rather than resolving it yourself.

**If no figure is attached:** organise this section by topic or decision
point instead, following the manuscript's own structure. For every claim,
tag it with the reference number(s) that support it, exactly as numbered in
the manuscript — e.g. "Lipid emulsion is rescue-only, not first-line
[12,47]." Never paraphrase a numeric threshold, dose, or cutoff — copy the
manuscript's own number and unit exactly. The same calculator-candidate
flagging above still applies to any named scoring system mentioned in the
text, wherever it appears.

## 5. Guideline-sourced details not in the manuscript's own data
A separate list of every figure/table/algorithm/text value that's sourced
from an external guideline the manuscript cites, rather than from the
review's own pooled/charted data — so the reader can tell the review's own
evidence apart from an externally-adopted threshold.

## 6. Calculator candidates flagged in this manuscript
A short bulleted summary of every `⚠ CALCULATOR CANDIDATE` tagged in section
4 — score name plus which box or section it came from — or "None flagged."
if there weren't any. This section exists purely so a flagged score doesn't
get missed, buried in a long document.

## 7. Complete reference list
The ENTIRE reference list, exactly as numbered and written in the manuscript
— full citation text for every single reference, verbatim, in original
order. Do not skip, summarize, combine, or renumber any entry, even under
length pressure — condense prose, never the reference list. Include each
reference's DOI if the manuscript gives one in-text or in the list; if it
doesn't, write "no DOI given" rather than inventing or guessing one.

HARD RULES (apply throughout, not just in one section):
- Never invent, estimate, or fill in a gap in the manuscript. If it isn't
  there, say so (`UNCLEAR` or "not stated in the manuscript") rather than
  supplying a plausible-sounding value.
- Never paraphrase a number, dose, unit, or threshold — copy it exactly as
  written, including its precision.
- Never shorten, sample, or drop references, even under length pressure —
  condense prose, never the reference list.
- Flagging a calculator candidate is naming, not researching — never assess,
  verify, or guess at a flagged score's own derivation, validity, or
  sourcing; that is a separate step done by someone else afterward.
```
