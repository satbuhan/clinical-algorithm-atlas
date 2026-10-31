#!/usr/bin/env python3
"""Regenerate assets/concepts.json — the cross-atlas glossary-term index.

What this does
---------------
Every tool in the atlas is an independent repo with its own GLOSSARY array
in assets/content.js (see METHODOLOGY.md's "Cross-atlas concept links"
section). This script scans every sibling tool repo for GLOSSARY terms
that appear in 2+ tools, and writes the result to assets/concepts.json in
*this* repo. Every tool fetches that one file at runtime and, when a term
it defines also appears here, adds an "Also covered in: <tool> ->" line
under that term's definition — deep-linking straight to the node it's
defined from in the other tool.

Requirements
------------
- Node.js on PATH (used to safely `require()` each tool's content.js and
  data.js rather than regex-parsing JavaScript).
- All tool repos cloned as sibling directories of this repo, i.e.
    some-parent-dir/
      clinical-algorithm-atlas/   <- this repo (and this script)
      aortic-dissection-protocol/
      lmwh-nste-acs-protocol/
      ...

Usage
-----
    python3 tools/gen_concepts.py

Then commit and push the updated assets/concepts.json. No other repo
needs to change -- every tool picks up the new index on its next load.

IMPORTANT: this script proposes candidate cross-links by exact string
match on the lowercased `match` field. A shared string does not always
mean the same clinical concept in two tools' contexts (e.g. "lipid
emulsion" as a drug-formulation vehicle in one tool vs. the LAST-rescue
antidote in another, found and excluded the first time this index was
built). ALWAYS read each new candidate pair's `def` text by hand before
adding it to CURATED_TERMS / removing it from EXCLUDE_PAIRS below --
never ship an automatically-generated pairing unreviewed.
"""
import json
import subprocess
import re
import os
import sys
import datetime

ATLAS_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARENT_DIR = os.path.dirname(ATLAS_ROOT)

# Every sibling tool repo's directory name. Keep this in sync with
# METHODOLOGY.md's "Existing tools:" line.
REPOS = [
    "aortic-dissection-protocol",
    "agitation-delirium-protocol",
    "influenza-antiviral-protocol",
    "nsaid-pain-protocol",
    "anticoagulant-reversal-protocol",
    "obesity-critical-care-protocol",
    "dapagliflozin-overdose-protocol",
    "lidocaine-prilocaine-protocol",
    "pte-thrombolysis-protocol",
    "lmwh-nste-acs-protocol",
]

# Reviewed by hand: (repo, lowercased term) pairs that share a GLOSSARY
# match string with another tool but do NOT mean the same clinical concept
# there, so must never be cross-linked. Add to this list whenever a new
# candidate pair turns out, on reading both `def` fields, to be a false
# positive -- do not just delete the term from one tool's GLOSSARY.
EXCLUDE_PAIRS = {
    ("aortic-dissection-protocol", "lipid emulsion"),  # drug vehicle, not the LAST antidote
}


def node_require_json(js_path, export_js):
    """Run `require(js_path).<export_js>` under Node and parse the JSON it prints."""
    out = subprocess.run(
        ["node", "-e", f"console.log(JSON.stringify(require({json.dumps(js_path)}).{export_js}))"],
        capture_output=True, text=True
    )
    if out.returncode != 0:
        print(f"  ERROR requiring {js_path}: {out.stderr}", file=sys.stderr)
        return None
    return json.loads(out.stdout)


def make_requireable(content_js_path, tmp_path):
    """Copy a tool's content.js to a temp file with a module.exports tail
    appended, since the originals are plain browser scripts with bare
    `const NODES = [...]` etc. and no exports of their own."""
    with open(content_js_path, encoding="utf-8") as f:
        src = f.read()
    src += (
        "\nmodule.exports = {"
        " REFERENCES: typeof REFERENCES!=='undefined'?REFERENCES:[],"
        " NODES: typeof NODES!=='undefined'?NODES:[],"
        " GLOSSARY: typeof GLOSSARY!=='undefined'?GLOSSARY:[] };\n"
    )
    with open(tmp_path, "w", encoding="utf-8") as f:
        f.write(src)


def find_node_for_term(nodes, term):
    """First node (in document order) whose meaning/rationale/cautions/dose
    text contains `term` as a whole word -- i.e. where linkify() would
    actually turn it into a clickable button in that tool's own UI."""
    pattern = re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)
    for n in nodes:
        blobs = [n.get("meaning", ""), n.get("rationale", "")]
        blobs += n.get("cautions") or []
        for pair in (n.get("dose") or []):
            blobs.extend(pair)
        if pattern.search(" ".join(blobs)):
            return n["id"]
    return None


def main():
    tmp_dir = "/tmp/gen_concepts_tmp"
    os.makedirs(tmp_dir, exist_ok=True)

    # tool id -> {title, subtitle, url}, straight from the hub's own TOOLS array
    data_js_tmp = os.path.join(tmp_dir, "_data.js")
    make_requireable(os.path.join(ATLAS_ROOT, "assets", "data.js"), data_js_tmp)
    # data.js only exports TOOLS/SPECIALTIES as bare consts too -- patch similarly
    with open(os.path.join(ATLAS_ROOT, "assets", "data.js"), encoding="utf-8") as f:
        data_src = f.read()
    data_src += "\nmodule.exports = { TOOLS: typeof TOOLS!=='undefined'?TOOLS:[] };\n"
    with open(data_js_tmp, "w", encoding="utf-8") as f:
        f.write(data_src)
    tools_meta_list = node_require_json(data_js_tmp, "TOOLS") or []
    meta_by_id = {t["id"]: t for t in tools_meta_list}

    def repo_to_id(repo):
        return repo[:-len("-protocol")] if repo.endswith("-protocol") else repo

    by_term = {}
    for repo in REPOS:
        content_path = os.path.join(PARENT_DIR, repo, "assets", "content.js")
        if not os.path.isfile(content_path):
            print(f"  SKIP (not found): {content_path}")
            continue
        tmp_path = os.path.join(tmp_dir, f"_{repo}.js")
        make_requireable(content_path, tmp_path)
        glossary = node_require_json(tmp_path, "GLOSSARY") or []
        nodes = node_require_json(tmp_path, "NODES") or []

        tool_id = repo_to_id(repo)
        meta = meta_by_id.get(tool_id)
        if not meta:
            print(f"  WARNING: no data.js TOOLS entry for id={tool_id!r} (repo {repo}) -- skipping")
            continue

        for g in glossary:
            key = g["match"].strip().lower()
            if (repo, key) in EXCLUDE_PAIRS:
                continue
            node_id = find_node_for_term(nodes, g["match"])
            by_term.setdefault(key, []).append({
                "tool": repo,
                "title": meta["title"],
                "subtitle": meta.get("subtitle", ""),
                "url": meta["url"],
                "match": g["match"],
                "full": g.get("full", ""),
                "def": g["def"],
                "nodeId": node_id,
            })

    shared = {k: v for k, v in by_term.items() if len({o["tool"] for o in v}) > 1}

    out_path = os.path.join(ATLAS_ROOT, "assets", "concepts.json")
    payload = {
        "generated": datetime.date.today().isoformat(),
        "terms": shared,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n{len(shared)} shared term(s) written to {out_path}:")
    for k, v in shared.items():
        print(f"  {k}: " + ", ".join(f"{o['tool']}#{o['nodeId']}" for o in v))
    print(
        "\nReview each pair above against EXCLUDE_PAIRS before committing -- "
        "a shared string is a candidate, not a confirmed match."
    )


if __name__ == "__main__":
    main()
