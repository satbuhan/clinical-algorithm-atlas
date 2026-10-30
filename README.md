# Clinical Algorithm Atlas

The hub page for a growing atlas of interactive, referenced
clinical-algorithm web tools — each one converted from an authored
flowchart, with the clinical reasoning and literature attached to every
step, and the algorithm itself kept byte-for-byte as drawn.

**Live site:** https://satbuhan.github.io/clinical-algorithm-atlas/

**Authors:** Dr. Özgür Karcıoğlu & Dr. Satuk Buğra Han Bozatlı

## Tools in the atlas

| Tool | Specialty | Repo |
|---|---|---|
| [Acute Aortic Dissection — Initial Medical Management](https://satbuhan.github.io/aortic-dissection-protocol/) | Cardiovascular Emergencies | [aortic-dissection-protocol](https://github.com/satbuhan/aortic-dissection-protocol) |
| [Butyrophenone Selection — Acute Agitation & Hyperactive Delirium](https://satbuhan.github.io/agitation-delirium-protocol/) | Behavioral & Psychiatric Emergencies | [agitation-delirium-protocol](https://github.com/satbuhan/agitation-delirium-protocol) |
| [Influenza Antiviral Selection — Baloxavir Marboxil vs Oseltamivir](https://satbuhan.github.io/influenza-antiviral-protocol/) | Infectious Disease & Respiratory | [influenza-antiviral-protocol](https://github.com/satbuhan/influenza-antiviral-protocol) |
| [Dexketoprofen vs Ibuprofen — Selecting an NSAID for Acute Pain](https://satbuhan.github.io/nsaid-pain-protocol/) | Analgesia & Pain Management | [nsaid-pain-protocol](https://github.com/satbuhan/nsaid-pain-protocol) |
| [Anticoagulant Reversal in Gastrointestinal Haemorrhage](https://satbuhan.github.io/anticoagulant-reversal-protocol/) | GI Haemorrhage & Anticoagulant Reversal | [anticoagulant-reversal-protocol](https://github.com/satbuhan/anticoagulant-reversal-protocol) |
| [The Adult with Obesity in Emergency and Critical Care](https://satbuhan.github.io/obesity-critical-care-protocol/) | Obesity in Emergency & Critical Care | [obesity-critical-care-protocol](https://github.com/satbuhan/obesity-critical-care-protocol) |
| [Dapagliflozin / SGLT2 Inhibitor — Overdose & Acute Illness Management](https://satbuhan.github.io/dapagliflozin-overdose-protocol/) | Toxicology & Overdose Management | [dapagliflozin-overdose-protocol](https://github.com/satbuhan/dapagliflozin-overdose-protocol) |
| [Lidocaine vs Prilocaine — Local Anaesthesia for Laceration Repair](https://satbuhan.github.io/lidocaine-prilocaine-protocol/) | Procedural Anaesthesia & Wound Care | [lidocaine-prilocaine-protocol](https://github.com/satbuhan/lidocaine-prilocaine-protocol) |
| [Reperfusion Therapy in Acute Pulmonary Thromboembolism](https://satbuhan.github.io/pte-thrombolysis-protocol/) | Cardiovascular Emergencies | [pte-thrombolysis-protocol](https://github.com/satbuhan/pte-thrombolysis-protocol) |
| [LMWH Selection & Renal Dosing in Unstable Angina / NSTEMI](https://satbuhan.github.io/lmwh-nste-acs-protocol/) | Cardiovascular Emergencies | [lmwh-nste-acs-protocol](https://github.com/satbuhan/lmwh-nste-acs-protocol) |

## What this repo is

Just the hub/index page — a card gallery with search and specialty
filters that links out to each tool's own repo and live site. It holds no
clinical content itself; each tool stays in its own independent repo with
its own GitHub Pages deployment (see
[METHODOLOGY.md](https://github.com/satbuhan/aortic-dissection-protocol/blob/main/METHODOLOGY.md)
for why, and for the full build process for the next tool).

## How it's built

Plain HTML/CSS/JS, no build step, no framework.

```
index.html          page structure, masthead, toolbar, methodology strip
assets/style.css     visual design — shared palette with the individual
                      tools (same paper/ink/navy "journal" aesthetic)
assets/data.js        ← single source of truth: the TOOLS array. Add a
                      tool here when it's published; nothing else needs
                      editing for the gallery to pick it up.
assets/app.js         renders the card grid, search, and specialty filters
assets/thumbs/        a static preview image per tool (a cropped
                      screenshot of its diagram, not a live embed — keeps
                      the hub fast regardless of what a tool's own page
                      needs to load)
```

### Adding a new tool to the atlas

1. Publish the tool itself as its own repo + GitHub Pages site, following
   `METHODOLOGY.md`.
2. Take a cropped screenshot of its diagram (top ~400px, faded to the
   paper background `#F4F3EE` at the bottom edge) and save it under
   `assets/thumbs/`.
3. Add one entry to the `TOOLS` array in `assets/data.js` — `id`, `title`,
   `subtitle`, `specialty` (add a new key to `SPECIALTIES` in the same
   file if it's a new domain), `summary`, `url`, `repo`, `thumb`, `added`.
4. Commit and push. No other file changes needed.

### Running it locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## License

Content and code are released under
[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) —
share and adapt with attribution, non-commercially, under the same license.
Each individual tool is released under the same license in its own repo.
