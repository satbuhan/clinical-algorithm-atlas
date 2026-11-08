// Single source of truth for which tools appear in the atlas.
// Add a new tool here when it's published — no other file needs editing
// for the gallery itself to pick it up.

// Grouped by organ system / clinical domain first (cardiopulmonary, GI,
// neuro — the primary mental model a clinician searches by), with the
// remaining tools that don't sit under one organ system kept as their own
// categories below. Re-grouped 2026-11-02 at Dr. Özgür Karcıoğlu's request,
// to keep the hub's grouped view legible as more tools are added — expect
// this list to keep evolving as new tools don't fit cleanly (that's fine,
// adjust it then rather than forcing a fit now).
const SPECIALTIES = {
  cardio:               { label: "Cardiopulmonary Emergencies", short: "Cardiopulmonary", tagClass: "cardio" },
  gi:                    { label: "Gastrointestinal Emergencies", short: "Gastrointestinal", tagClass: "gi" },
  neuro:                { label: "Neurological Emergencies & Critical Care", short: "Neurology", tagClass: "neuro" },
  infectious:           { label: "Infectious Disease & Respiratory", short: "Infectious Disease", tagClass: "infectious" },
  psych:                { label: "Behavioral & Psychiatric Emergencies", short: "Behavioral", tagClass: "psych" },
  analgesia_procedural: { label: "Analgesia & Procedural Care", short: "Analgesia & Procedural", tagClass: "analgesia_procedural" },
  tox:                  { label: "Toxicology & Overdose Management", short: "Toxicology", tagClass: "tox" },
  obesity:              { label: "Obesity in Emergency & Critical Care", short: "Obesity", tagClass: "obesity" },
  trauma:               { label: "Trauma & Surgical Emergencies", short: "Trauma", tagClass: "trauma" }
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
    specialty: "obesity",
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
    specialty: "cardio",
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
    specialty: "cardio",
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
    specialty: "cardio",
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
  }
];
