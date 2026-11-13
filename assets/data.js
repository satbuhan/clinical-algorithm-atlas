// Single source of truth for which tools appear in the atlas.
// Add a new tool here when it's published — no other file needs editing
// for the gallery itself to pick it up.

// Grouped by the standard global EM academic/practical taxonomy (the
// organ-system / domain "chapters" any EM clinician would recognise from
// Tintinalli's/Rosen's own table of contents), not an ad hoc bucket list —
// decided jointly with Dr. Özgür Karcıoğlu and Dr. Bozatlı on 2026-11-09
// after an earlier, looser grouping (and a brief "just 4-5 buckets" idea)
// both proved unsatisfying. Order below is roughly acuity-first
// (resuscitation down to supportive/procedural care), which is also the
// order groups render in on the hub's default grouped view.
//
// Every key here currently has at least one real tool under it — deliberate:
// an empty top-level category reads as a broken filter. Organ-system
// "chapters" that are real, standard EM domains but have zero tools so far
// (Obstetric & Gynecologic, Renal & Genitourinary, Hematology & Oncology,
// Dermatologic, Musculoskeletal (non-traumatic), Environmental Injuries,
// HEENT) are intentionally NOT listed here — see README.md's "Reserved
// categories" note for the agreed names to reuse once each gets its first
// tool, rather than re-litigating names/colors at that point. Pediatric/
// geriatric populations were explicitly discussed and rejected as a
// category here — they're a patient-population axis, not an organ system,
// and would need their own filter dimension instead if ever added.
//
// A tool that still doesn't fit cleanly when the next one ships: discuss
// a change with the author team rather than deciding unilaterally (a gap
// in the process the first draft of this comment's predecessor admittedly
// left open — see succinylcholine-rocuronium-protocol's build history).
const SPECIALTIES = {
  resuscitation:        { label: "Resuscitation & Airway Management", short: "Resuscitation", tagClass: "resuscitation" },
  cardio:                { label: "Cardiovascular Emergencies", short: "Cardiovascular", tagClass: "cardio" },
  pulmonary:            { label: "Pulmonary & Respiratory Emergencies", short: "Pulmonary", tagClass: "pulmonary" },
  neuro:                { label: "Neurological Emergencies", short: "Neurology", tagClass: "neuro" },
  trauma:               { label: "Trauma & Surgical Emergencies", short: "Trauma", tagClass: "trauma" },
  psych:                { label: "Psychiatric & Behavioral Emergencies", short: "Behavioral", tagClass: "psych" },
  tox:                  { label: "Toxicology & Overdose Management", short: "Toxicology", tagClass: "tox" },
  gi:                    { label: "Gastrointestinal Emergencies", short: "Gastrointestinal", tagClass: "gi" },
  infectious:           { label: "Infectious Disease Emergencies", short: "Infectious Disease", tagClass: "infectious" },
  endocrine_metabolic:  { label: "Endocrine & Metabolic Emergencies", short: "Endocrine & Metabolic", tagClass: "endocrine_metabolic" },
  analgesia_procedural: { label: "Analgesia, Sedation & Procedural Care", short: "Analgesia & Procedural", tagClass: "analgesia_procedural" }
};

const TOOLS = [
  {
    id: "aortic-dissection",
    title: "Acute Aortic Dissection",
    subtitle: "Initial Medical Management",
    specialty: "cardio",
    summary: "Interactive, referenced walkthrough of the initial medical management algorithm for suspected or confirmed acute aortic dissection — beta-blockade, targets, and escalation to vasodilator therapy.",
    url: "https://satbuhan.github.io/aortic-dissection-protocol/",
    repo: "https://github.com/satbuhan/aortic-dissection-protocol",
    thumb: "assets/thumbs/aortic-dissection.png",
    added: "2026-10-19"
  },
  {
    id: "agitation-delirium",
    title: "Butyrophenone Selection",
    subtitle: "Acute Agitation & Hyperactive Delirium",
    specialty: "psych",
    summary: "Interactive, referenced walkthrough of the algorithm for choosing between droperidol and haloperidol in acute agitation and hyperactive delirium, with dosing and safety thresholds.",
    url: "https://satbuhan.github.io/agitation-delirium-protocol/",
    repo: "https://github.com/satbuhan/agitation-delirium-protocol",
    thumb: "assets/thumbs/agitation-delirium.png",
    added: "2026-10-25"
  },
  {
    id: "influenza-antiviral",
    title: "Influenza Antiviral Selection",
    subtitle: "Baloxavir Marboxil vs Oseltamivir",
    specialty: "infectious",
    summary: "Interactive, referenced walkthrough of the algorithm for choosing between baloxavir marboxil and oseltamivir in influenza, including severe illness and viral pneumonia, stratified by severity and complication risk.",
    url: "https://satbuhan.github.io/influenza-antiviral-protocol/",
    repo: "https://github.com/satbuhan/influenza-antiviral-protocol",
    thumb: "assets/thumbs/influenza-antiviral.png",
    added: "2026-10-26"
  },
  {
    id: "nsaid-pain",
    title: "Dexketoprofen vs Ibuprofen",
    subtitle: "Selecting an NSAID for Acute Pain",
    specialty: "analgesia_procedural",
    summary: "Interactive, referenced walkthrough of the algorithm for choosing and safely using an NSAID — dexketoprofen or ibuprofen — for acute pain, with contraindications, high-risk features, route selection, and reassessment thresholds.",
    url: "https://satbuhan.github.io/nsaid-pain-protocol/",
    repo: "https://github.com/satbuhan/nsaid-pain-protocol",
    thumb: "assets/thumbs/nsaid-pain.png",
    added: "2026-10-26"
  },
  {
    id: "anticoagulant-reversal",
    title: "Anticoagulant Reversal",
    subtitle: "In Gastrointestinal Haemorrhage",
    specialty: "gi",
    summary: "Interactive, referenced walkthrough of the decision-making algorithm for anticoagulant reversal in GI bleeding — stable vs unstable triage, and the four agent-specific reversal pathways (VKA, dabigatran, factor Xa inhibitors, heparin).",
    url: "https://satbuhan.github.io/anticoagulant-reversal-protocol/",
    repo: "https://github.com/satbuhan/anticoagulant-reversal-protocol",
    thumb: "assets/thumbs/anticoagulant-reversal.png",
    added: "2026-10-29"
  },
  {
    id: "obesity-critical-care",
    title: "The Adult with Obesity",
    subtitle: "In Emergency and Critical Care",
    specialty: "endocrine_metabolic",
    summary: "Interactive, referenced two-step summary for the adult with obesity in emergency and critical care — a trigger bundle, then nine concurrent physiological domains (airway, induction, ventilation, circulation, kidney, antimicrobials, thromboprophylaxis, nutrition, liberation from ventilation), each scaled to its own weight descriptor rather than to BMI.",
    url: "https://satbuhan.github.io/obesity-critical-care-protocol/",
    repo: "https://github.com/satbuhan/obesity-critical-care-protocol",
    thumb: "assets/thumbs/obesity-critical-care.png",
    added: "2026-10-29"
  },
  {
    id: "dapagliflozin-overdose",
    title: "Dapagliflozin / SGLT2 Inhibitor",
    subtitle: "Overdose & Acute Illness Management",
    specialty: "tox",
    summary: "Interactive, referenced walkthrough of the algorithm for suspected dapagliflozin overdose or acute illness in an SGLT2 inhibitor user — ketone-led recognition of euglycaemic ketoacidosis regardless of the glucose value, the hypoglycaemia/co-ingestant check, and why dialysis does not help in overdose.",
    url: "https://satbuhan.github.io/dapagliflozin-overdose-protocol/",
    repo: "https://github.com/satbuhan/dapagliflozin-overdose-protocol",
    thumb: "assets/thumbs/dapagliflozin-overdose.png",
    added: "2026-10-29"
  },
  {
    id: "lidocaine-prilocaine",
    title: "Lidocaine vs Prilocaine",
    subtitle: "Local Anaesthesia for Laceration Repair",
    specialty: "analgesia_procedural",
    summary: "Interactive, referenced walkthrough of the algorithm for choosing between lidocaine and prilocaine-containing local anaesthesia for laceration repair, derived from a systematic review with GRADE and MCID appraisal — prilocaine contraindication screening, the topical-cream time/wound gate, IVRA for extensive hand/forearm injury, and methaemoglobinaemia/LAST monitoring.",
    url: "https://satbuhan.github.io/lidocaine-prilocaine-protocol/",
    repo: "https://github.com/satbuhan/lidocaine-prilocaine-protocol",
    thumb: "assets/thumbs/lidocaine-prilocaine.png",
    added: "2026-10-29"
  },
  {
    id: "pte-thrombolysis",
    title: "Reperfusion Therapy",
    subtitle: "In Acute Pulmonary Thromboembolism",
    specialty: "pulmonary",
    summary: "Interactive, referenced walkthrough of the decision algorithm for thrombolytic and catheter-based reperfusion in acute PE, derived from a 73-reference narrative review — the haemodynamic-instability and RV-dysfunction/troponin gates, HI-PEITHO-informed severity criteria for catheter-directed therapy, full-dose systemic fibrinolysis dosing, and rescue reperfusion after failed lysis or arrest.",
    url: "https://satbuhan.github.io/pte-thrombolysis-protocol/",
    repo: "https://github.com/satbuhan/pte-thrombolysis-protocol",
    thumb: "assets/thumbs/pte-thrombolysis.png",
    added: "2026-10-30"
  },
  {
    id: "lmwh-nste-acs",
    title: "LMWH Selection & Renal Dosing",
    subtitle: "In Unstable Angina / NSTEMI",
    specialty: "cardio",
    summary: "Interactive, referenced walkthrough of the algorithm for choosing and dosing a parenteral anticoagulant in NSTE-ACS, derived from a 104-reference systematic review — the invasive-vs-conservative gate behind UFH vs fondaparinux, the enoxaparin/dalteparin/nadroparin priority order, and renal-function-tiered LMWH dosing down to the switch back to UFH below CrCl 15 mL/min.",
    url: "https://satbuhan.github.io/lmwh-nste-acs-protocol/",
    repo: "https://github.com/satbuhan/lmwh-nste-acs-protocol",
    thumb: "assets/thumbs/lmwh-nste-acs.png",
    added: "2026-10-31"
  },
  {
    id: "ketamine-head-injury",
    title: "Ketamine in Head Injury",
    subtitle: "Safety Analysis & Complication Management",
    specialty: "neuro",
    summary: "Interactive, referenced walkthrough of the algorithm for using ketamine in head injury, derived from a 98-reference systematic review — the three indication pathways (induction/RSI, ICU sedation, analgesia), the shock-index-gated induction dose, and management of hypotension, emergence reactions, seizures, ICP rise, and laryngospasm.",
    url: "https://satbuhan.github.io/ketamine-head-injury-protocol/",
    repo: "https://github.com/satbuhan/ketamine-head-injury-protocol",
    thumb: "assets/thumbs/ketamine-head-injury.png",
    added: "2026-11-02"
  },
  {
    id: "midazolam-clonazepam",
    title: "Midazolam versus Clonazepam",
    subtitle: "Seizures, Acute Agitation & Anxiety",
    specialty: "neuro",
    summary: "Interactive, referenced walkthrough of the decision algorithm for choosing between midazolam and clonazepam in seizure emergencies, acute agitation, and acute anxiety or panic — two parallel diagrams covering first-line benzodiazepine selection, second-line antiseizure medication, and escalation to refractory status epilepticus.",
    url: "https://satbuhan.github.io/midazolam-clonazepam-protocol/",
    repo: "https://github.com/satbuhan/midazolam-clonazepam-protocol",
    thumb: "assets/thumbs/midazolam-clonazepam.png",
    added: "2026-11-02"
  },
  {
    id: "vasopressor-shock",
    title: "Vasopressor Agent Selection",
    subtitle: "Aminergic Agents in Shock States",
    specialty: "resuscitation",
    summary: "Interactive, referenced walkthrough of the algorithm for selecting a vasopressor (aminergic) agent across the four shock types — septic/vasodilatory, cardiogenic, haemorrhagic/hypovolaemic, and obstructive — from first-line norepinephrine through the MAP ≥ 65 mmHg target reassessment to second-line and rescue agents in refractory shock.",
    url: "https://satbuhan.github.io/vasopressor-shock-protocol/",
    repo: "https://github.com/satbuhan/vasopressor-shock-protocol",
    thumb: "assets/thumbs/vasopressor-shock.png",
    added: "2026-11-04"
  },
  {
    id: "wbct-trauma",
    title: "Whole-Body CT in Traumatic Shock",
    subtitle: "A Stepwise Decision Algorithm",
    specialty: "trauma",
    summary: "Interactive, referenced walkthrough of the decision algorithm for whole-body CT (WBCT) in traumatic circulatory shock — the life-threat and environment-safety gates that decide whether to scan at all, a metabolic (not blood-pressure-only) definition of shock, the single-pass acquisition protocol, and the three immediate-action pathways once the scan is interpreted.",
    url: "https://satbuhan.github.io/wbct-trauma-protocol/",
    repo: "https://github.com/satbuhan/wbct-trauma-protocol",
    thumb: "assets/thumbs/wbct-trauma.png",
    added: "2026-11-04"
  },
  {
    id: "epinephrine-revisited",
    title: "Epinephrine/Adrenaline Revisited",
    subtitle: "Contemporary Decision-Making Algorithm",
    specialty: "resuscitation",
    summary: "Interactive, referenced walkthrough of the manuscript's own Figure 1 — three parallel decision lanes for epinephrine in anaphylaxis, cardiac arrest, and the three major shock subtypes (septic, cardiogenic, obstructive), plus a fourth panel of adverse-effect monitoring obligations and an evidence-strengths/limitations summary that applies across all of them.",
    url: "https://satbuhan.github.io/epinephrine-revisited-protocol/",
    repo: "https://github.com/satbuhan/epinephrine-revisited-protocol",
    thumb: "assets/thumbs/epinephrine-revisited.png",
    added: "2026-11-06"
  },
  {
    id: "ketamine-indications",
    title: "Ketamine in Emergency and Critical Care",
    subtitle: "Indication-Based Decision Algorithm",
    specialty: "analgesia_procedural",
    summary: "Interactive, referenced walkthrough of the manuscript's own Figure 1 — five parallel decision lanes for ketamine across procedural sedation, RSI/airway management, acute agitation, ICU analgosedation, and resuscitation of the haemodynamically unstable patient, plus shared monitoring, special-population, and revised ICP-safety panels that apply across all of them.",
    url: "https://satbuhan.github.io/ketamine-indications-protocol/",
    repo: "https://github.com/satbuhan/ketamine-indications-protocol",
    thumb: "assets/thumbs/ketamine-indications.png",
    added: "2026-11-06"
  },
  {
    id: "tenecteplase-alteplase-stemi",
    title: "Tenecteplase versus Alteplase",
    subtitle: "Fibrinolysis in STEMI When Timely Primary PCI Is Not Available",
    specialty: "cardio",
    summary: "Interactive, referenced walkthrough of the systematic review's own Figure 2 — fibrinolytic agent selection and weight/age-based dosing for ST-segment elevation myocardial infarction when timely primary PCI is not available, from eligibility and transfer-delay gating through age-adjusted tenecteplase dosing to the 60–90 minute reperfusion reassessment and rescue PCI.",
    url: "https://satbuhan.github.io/tenecteplase-alteplase-stemi-protocol/",
    repo: "https://github.com/satbuhan/tenecteplase-alteplase-stemi-protocol",
    thumb: "assets/thumbs/tenecteplase-alteplase-stemi.png",
    added: "2026-11-06"
  },
  {
    id: "cwa-blood-gas",
    title: "Blood Gas-Guided Assessment",
    subtitle: "Of the Chemical Warfare Agent Casualty",
    specialty: "tox",
    summary: "Interactive, referenced walkthrough of the systematic review's own Figure 2 — pattern-matching a single early blood gas, lactate and co-oximetry panel to the dominant chemical warfare agent class (nerve/organophosphate, blood/cyanide, or choking/vesicant), through to class-specific empirical antidote and lung-protective ventilation management, and back to serial reassessment.",
    url: "https://satbuhan.github.io/cwa-blood-gas-protocol/",
    repo: "https://github.com/satbuhan/cwa-blood-gas-protocol",
    thumb: "assets/thumbs/cwa-blood-gas.png",
    added: "2026-11-07"
  },
  {
    id: "ccb-toxicity",
    title: "Calcium Channel Blocker Toxicity",
    subtitle: "Phenotype-Guided Management",
    specialty: "tox",
    summary: "Interactive, referenced walkthrough of the scoping review's own phenotype-branched algorithm — bedside echocardiography splitting management into a vasoplegic phenotype (vasopressor-led) and a cardiogenic phenotype (HIE/glucagon-led), escalating through salvage intravenous lipid emulsion to VA-ECMO for refractory shock or cardiac arrest.",
    url: "https://satbuhan.github.io/ccb-toxicity-protocol/",
    repo: "https://github.com/satbuhan/ccb-toxicity-protocol",
    thumb: "assets/thumbs/ccb-toxicity.png",
    added: "2026-11-08"
  },
  {
    id: "haloperidol-adjunct",
    title: "Haloperidol Adjunct Selection",
    subtitle: "Midazolam vs Ketamine in Hyperactive Delirium with Severe Agitation",
    specialty: "psych",
    summary: "Interactive, referenced walkthrough of the decision algorithm for choosing midazolam or ketamine as the adjunct added to a haloperidol backbone in hyperactive delirium with severe agitation (excited delirium syndrome) — branching on withdrawal, older age, and airway-rescue readiness, through reassessment, rescue, and post-sedation care.",
    url: "https://satbuhan.github.io/haloperidol-adjunct-protocol/",
    repo: "https://github.com/satbuhan/haloperidol-adjunct-protocol",
    thumb: "assets/thumbs/haloperidol-adjunct.png",
    added: "2026-11-09"
  },
  {
    id: "succinylcholine-rocuronium",
    title: "Selection of a Neuromuscular Blocking Agent",
    subtitle: "Succinylcholine vs Rocuronium for Rapid Sequence Induction and Intubation",
    specialty: "resuscitation",
    summary: "Interactive, referenced walkthrough of the systematic review's own Figure 1 — choosing succinylcholine or rocuronium for rapid sequence induction and intubation, from contraindication screening, through the airway-rescue strategy, to whether the post-intubation analgosedation system is ready.",
    url: "https://satbuhan.github.io/succinylcholine-rocuronium-protocol/",
    repo: "https://github.com/satbuhan/succinylcholine-rocuronium-protocol",
    thumb: "assets/thumbs/succinylcholine-rocuronium.png",
    added: "2026-11-09"
  },
  {
    id: "geriatric-pain",
    title: "Pharmacological Pain Management in Elderly Patients",
    subtitle: "Geriatric Analgesic Decision Algorithm, Age 65+",
    specialty: "analgesia_procedural",
    summary: "Interactive, referenced walkthrough of the manuscript's own Figure 1 — stepwise pharmacological pain management in older adults, from assessment and red-flag exclusion, through severity-tiered drug selection (mild/moderate/severe), opioid-ADR monitoring, to renal/hepatic/cognitive-impairment caveats and core prescribing principles.",
    url: "https://satbuhan.github.io/geriatric-pain-protocol/",
    repo: "https://github.com/satbuhan/geriatric-pain-protocol",
    thumb: "assets/thumbs/geriatric-pain.png",
    added: "2026-11-10"
  },
  {
    id: "metoclopramide-ondansetron",
    title: "Metoclopramide versus Ondansetron",
    subtitle: "Antiemetic Selection by Clinical Setting",
    specialty: "gi",
    summary: "Interactive, referenced walkthrough of the systematic review's own Figure 2 — choosing between metoclopramide and ondansetron across six clinical settings (emetogenic chemotherapy, the perioperative period, paediatric gastroenteritis, pregnancy, the undifferentiated ED patient, opioid/uraemic/vestibular/palliative nausea), each with its own GRADE certainty, converging on a drug-specific safety check for QT prolongation and extrapyramidal effects.",
    url: "https://satbuhan.github.io/metoclopramide-ondansetron-protocol/",
    repo: "https://github.com/satbuhan/metoclopramide-ondansetron-protocol",
    thumb: "assets/thumbs/metoclopramide-ondansetron.png",
    added: "2026-11-12"
  },
  {
    id: "spontaneous-pneumothorax",
    title: "Needle Aspiration versus Tube Thoracostomy",
    subtitle: "Symptom-Led Management of Spontaneous Pneumothorax",
    specialty: "pulmonary",
    summary: "Interactive, referenced walkthrough of the systematic review's own Figure 1 — tension/haemodynamic-instability screening, a high-risk-feature screen, a symptom-led fork into conservative care or needle aspiration, a repeat-aspiration reassessment loop (maximum of two attempts), ambulatory or standard small-bore drainage, a 48-hour persistent-air-leak escalation checkpoint, and definitive recurrence prevention.",
    url: "https://satbuhan.github.io/spontaneous-pneumothorax-protocol/",
    repo: "https://github.com/satbuhan/spontaneous-pneumothorax-protocol",
    thumb: "assets/thumbs/spontaneous-pneumothorax.png",
    added: "2026-11-12"
  },
  {
    id: "button-battery",
    title: "Suspected or Witnessed Button Battery Exposure",
    subtitle: "Recognition and Management Pathway in a Child",
    specialty: "gi",
    summary: "Interactive, referenced walkthrough of the recognition and management pathway for paediatric button battery exposure — ingestion, nasal insertion and aural insertion — immediate actions and pre-removal mitigation, biplane radiographs, a three-way location fork (oesophagus; stomach or beyond the pylorus; nose or ear), each branch's own removal or observation pathway, and discharge safety-netting. First tool in the atlas to encode evidence certainty as box border style (solid/dashed/dotted) rather than colour.",
    url: "https://satbuhan.github.io/button-battery-protocol/",
    repo: "https://github.com/satbuhan/button-battery-protocol",
    thumb: "assets/thumbs/button-battery.png",
    added: "2026-11-13"
  }
];
