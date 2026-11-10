#!/usr/bin/env python3
"""Regenerate assets/search_index.json -- the hub's full-text search index.

What this does
---------------
Every tool in the atlas is an independent repo with its own NODES and
GLOSSARY arrays in assets/content.js (see METHODOLOGY.md). This script
scans every sibling tool repo and builds one flat list of searchable
entries, written to assets/search_index.json in *this* repo:

  - one "tool" entry per tool (title + subtitle), linking to the tool's
    homepage -- so searching a tool's own name/topic finds it even if
    the exact words never appear in any single node.
  - one "node" entry per NODE in every tool, with that node's label, sub,
    meaning, rationale, dose text and cautions concatenated into one
    searchable blob -- PLUS, folded in, the full/def text of any
    GLOSSARY term that actually appears in that node's text (the same
    node-resolution gen_concepts.py uses for its cross-links), so a
    search for the spelled-out form of an abbreviation still lands on
    the right box.

GLOSSARY terms are deliberately NOT indexed as their own separate
entries -- folding their text into whichever node actually displays them
avoids showing two near-duplicate hits for the same box.

Every node entry's link is "<tool url>#node-<id>". Every tool's own
app.js already opens that node automatically on arrival -- this is the
exact same hash convention concepts.json's "Also covered in" links use,
so nothing needs to change in any of the 21 tool repos for this to work.

Requirements / usage: identical to gen_concepts.py (Node.js on PATH, all
tool repos cloned as siblings of this repo). Run:
    python3 tools/gen_search_index.py
then commit and push the updated assets/search_index.json. No other repo
needs to change. Re-run this whenever a tool's content.js changes, or a
new tool is added (and add its repo name to REPOS below first).
"""
import json
import subprocess
import re
import os
import sys
import datetime

ATLAS_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PARENT_DIR = os.path.dirname(ATLAS_ROOT)

# Keep this in sync with gen_concepts.py's REPOS list and with
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
    "ketamine-head-injury-protocol",
    "midazolam-clonazepam-protocol",
    "vasopressor-shock-protocol",
    "wbct-trauma-protocol",
    "epinephrine-revisited-protocol",
    "ketamine-indications-protocol",
    "tenecteplase-alteplase-stemi-protocol",
    "cwa-blood-gas-protocol",
    "ccb-toxicity-protocol",
    "haloperidol-adjunct-protocol",
    "succinylcholine-rocuronium-protocol",
    "geriatric-pain-protocol",
]


def node_require_json(js_path, export_js):
    out = subprocess.run(
        ["node", "-e", f"console.log(JSON.stringify(require({json.dumps(js_path)}).{export_js}))"],
        capture_output=True, text=True
    )
    if out.returncode != 0:
        print(f"  ERROR requiring {js_path}: {out.stderr}", file=sys.stderr)
        return None
    return json.loads(out.stdout)


def make_requireable(content_js_path, tmp_path):
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
    """Same resolution gen_concepts.py uses: first node (document order)
    whose meaning/rationale/cautions/dose text contains `term` as a whole
    word -- i.e. where linkify() would actually turn it into a clickable
    button in that tool's own UI."""
    pattern = re.compile(r"\b" + re.escape(term) + r"\b", re.IGNORECASE)
    for n in nodes:
        blobs = [n.get("meaning", ""), n.get("rationale", "")]
        blobs += n.get("cautions") or []
        for pair in (n.get("dose") or []):
            blobs.extend(pair)
        if pattern.search(" ".join(blobs)):
            return n["id"]
    return None


def node_text_blob(n, glossary):
    parts = [n.get("label", ""), n.get("sub", ""), n.get("meaning", ""), n.get("rationale", "")]
    for pair in (n.get("dose") or []):
        parts.extend(pair)
    parts += n.get("cautions") or []
    for g in glossary:
        if find_node_for_term([n], g["match"]) == n["id"]:
            parts.append(g.get("full", ""))
            parts.append(g.get("def", ""))
    return " — ".join(p for p in parts if p)


def main():
    tmp_dir = "/tmp/gen_search_index_tmp"
    os.makedirs(tmp_dir, exist_ok=True)

    data_js_tmp = os.path.join(tmp_dir, "_data.js")
    with open(os.path.join(ATLAS_ROOT, "assets", "data.js"), encoding="utf-8") as f:
        data_src = f.read()
    data_src += "\nmodule.exports = { TOOLS: typeof TOOLS!=='undefined'?TOOLS:[] };\n"
    with open(data_js_tmp, "w", encoding="utf-8") as f:
        f.write(data_src)
    tools_meta_list = node_require_json(data_js_tmp, "TOOLS") or []

    def repo_to_id(repo):
        return repo[:-len("-protocol")] if repo.endswith("-protocol") else repo

    meta_by_id = {t["id"]: t for t in tools_meta_list}

    entries = []
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

        entries.append({
            "tool": repo,
            "title": meta["title"],
            "url": meta["url"],
            "type": "tool",
            "nodeId": None,
            "nodeLabel": None,
            "text": (meta["title"] + " " + meta.get("subtitle", "")).strip(),
        })

        for n in nodes:
            entries.append({
                "tool": repo,
                "title": meta["title"],
                "url": meta["url"],
                "type": "node",
                "nodeId": n["id"],
                "nodeLabel": n.get("label", ""),
                "text": node_text_blob(n, glossary),
            })

    out_path = os.path.join(ATLAS_ROOT, "assets", "search_index.json")
    payload = {
        "generated": datetime.date.today().isoformat(),
        "entries": entries,
    }
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
        f.write("\n")

    print(f"\n{len(entries)} entries written to {out_path}")
    print(f"({len(REPOS)} tools scanned)")


if __name__ == "__main__":
    main()
