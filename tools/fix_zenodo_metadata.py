#!/usr/bin/env python3
"""
Fix the author list + title on the atlas's Zenodo records.

Zenodo's GitHub auto-archival defaults a record's author to whoever's name
is on the actual git commits (in this project, that's Claude -- see
PROJECT_CONTEXT.md section 9) and its title to a generic
"satbuhan/<repo>: v1.0.0" string. Neither belongs in an academic citation.
This script fixes both, for one record or for every record listed below.

ONGOING USE: every time a new tool gets its own Zenodo DOI (see this
repo's own README.md "Adding a new tool to the atlas", step 7, and
PROJECT_CONTEXT.md section 9 in the Android repo), add its
{"<zenodo-record-id>": "<the tool's real H1 title>"} entry to RECORDS
below, commit this file, then run this script for just that one new
record id. The existing entries are a record of what's already been
fixed -- re-running the script against them is harmless (idempotent),
it just re-applies the same correct metadata.

Run it from a machine that can actually reach zenodo.org -- it is NOT
reachable from inside a Claude Code session (zenodo.org is outside that
session type's network allowlist).

SETUP (one time per machine):
  1. Go to https://zenodo.org/account/settings/applications/tokens/new/
  2. Name it anything (e.g. "atlas-metadata-fix")
  3. Check the "deposit:write" and "deposit:actions" scopes
  4. Click "Create", copy the token (you only see it once)
  5. Set it as an environment variable so it's not typed into any file:
       export ZENODO_TOKEN="paste-the-token-here"      # macOS/Linux
       $env:ZENODO_TOKEN = "paste-the-token-here"       # Windows PowerShell
  6. Make sure the 'requests' library is installed:
       pip3 install requests

USAGE:
  One record (do this first for any record you haven't fixed yet --
  this script has not been tested against Zenodo's live API by the
  person who wrote it; verify the first one by hand before trusting
  a batch run):
       python3 fix_zenodo_metadata.py 24112518

  Every record in RECORDS below:
       python3 fix_zenodo_metadata.py

  After running, open https://doi.org/10.5281/zenodo.<id> and check the
  "Citation" box reads correctly before considering it done.
"""

import os
import sys
import requests

TOKEN = os.environ.get("ZENODO_TOKEN")
if not TOKEN:
    print("ERROR: set the ZENODO_TOKEN environment variable first (see the")
    print("SETUP comment at the top of this script).")
    sys.exit(1)

API = "https://zenodo.org/api/deposit/depositions"
PARAMS = {"access_token": TOKEN}

CREATORS = [
    {"name": "Karcıoğlu, Özgür"},
    {"name": "Bozatlı, Satuk Buğra Han"},
]

# record id (the number at the end of the DOI) -> real tool title.
# Fixed 2026-11-10 (first batch, all 22 atlas repos). Add a new entry
# here every time a new tool gets its own DOI -- see this file's
# docstring above.
RECORDS = {
    "24112508": "Clinical Algorithm Atlas",
    "24112518": "Acute Aortic Dissection — Interactive Management Protocol",
    "24112527": "Butyrophenone Selection — Acute Agitation & Hyperactive Delirium",
    "24112533": "Influenza Antiviral Selection — Baloxavir Marboxil vs Oseltamivir",
    "24112535": "Dexketoprofen vs Ibuprofen — Selecting an NSAID for Acute Pain",
    "24112541": "Anticoagulant Reversal in GI Haemorrhage — Interactive Decision Algorithm",
    "24112552": "The Adult with Obesity in Emergency and Critical Care",
    "24112562": "Dapagliflozin / SGLT2 Inhibitor — Overdose & Acute Illness Management",
    "24112568": "Choosing Between Lidocaine and Prilocaine-Containing Anaesthesia for Laceration Repair",
    "24112575": "Reperfusion Therapy in Acute Pulmonary Thromboembolism — Interactive Decision Algorithm",
    "24112583": "LMWH Selection & Renal Dosing in Unstable Angina / NSTEMI — Interactive Decision Algorithm",
    "24112587": "Ketamine in Head Injury — Safety Analysis & Complication Management — Interactive Decision Algorithm",
    "24112591": "Midazolam versus Clonazepam — Seizures, Acute Agitation & Anxiety — Interactive Decision Algorithm",
    "24112598": "Vasopressor (Aminergic) Agent Selection in Shock States — Interactive Decision Algorithm",
    "24112602": "Whole-Body CT in Traumatic Circulatory Shock — Interactive Decision Algorithm",
    "24112615": "Epinephrine/Adrenaline Revisited — Contemporary Decision-Making Algorithm",
    "24112619": "Ketamine in Emergency and Critical Care Medicine: Indication-Based Decision Algorithm",
    "24112623": "Fibrinolysis in STEMI When Timely Primary PCI Is Not Available: Tenecteplase versus Alteplase",
    "24112635": "Blood Gas-Guided Assessment of the Chemical Warfare Agent Casualty",
    "24112640": "Calcium Channel Blocker Toxicity — Phenotype-Guided Management",
    "24112644": "Choosing an Adjunct to Haloperidol in Hyperactive Delirium with Severe Agitation",
    "24112652": "Selection of a Neuromuscular Blocking Agent for Rapid Sequence Induction and Intubation",
    "24119391": "Pharmacological Pain Management in Elderly Patients",
}


def fix_one(record_id, title):
    print(f"--- {record_id} ---")

    # 1. unlock for editing
    r = requests.post(f"{API}/{record_id}/actions/edit", params=PARAMS)
    if r.status_code not in (200, 201, 202, 400):
        # 400 here usually just means "already in edit mode", which is fine
        print(f"  edit-unlock FAILED: {r.status_code} {r.text[:300]}")
        return False

    # 2. fetch current metadata so we only change creators + title
    r = requests.get(f"{API}/{record_id}", params=PARAMS)
    if r.status_code != 200:
        print(f"  fetch FAILED: {r.status_code} {r.text[:300]}")
        return False
    metadata = r.json().get("metadata", {})
    metadata["creators"] = CREATORS
    metadata["title"] = title

    # 3. write the updated metadata back
    r = requests.put(
        f"{API}/{record_id}",
        params=PARAMS,
        json={"metadata": metadata},
        headers={"Content-Type": "application/json"},
    )
    if r.status_code != 200:
        print(f"  update FAILED: {r.status_code} {r.text[:300]}")
        return False

    # 4. publish the change
    r = requests.post(f"{API}/{record_id}/actions/publish", params=PARAMS)
    if r.status_code not in (200, 202):
        print(f"  publish FAILED: {r.status_code} {r.text[:300]}")
        return False

    print(f"  OK -- {title}")
    return True


def main():
    if len(sys.argv) > 1:
        record_id = sys.argv[1]
        if record_id not in RECORDS:
            print(f"Unknown record id {record_id!r}. Known ids: {', '.join(RECORDS)}")
            sys.exit(1)
        fix_one(record_id, RECORDS[record_id])
        return

    ok, fail = [], []
    for record_id, title in RECORDS.items():
        if fix_one(record_id, title):
            ok.append(record_id)
        else:
            fail.append(record_id)

    print()
    print(f"Done: {len(ok)} OK, {len(fail)} failed.")
    if fail:
        print("Failed record ids:", ", ".join(fail))


if __name__ == "__main__":
    main()
