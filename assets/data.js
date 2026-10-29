// Single source of truth for which tools appear in the atlas.
// Add a new tool here when it's published — no other file needs editing
// for the gallery itself to pick it up.

const SPECIALTIES = {
  cardio:      { label: "Cardiovascular Emergencies", short: "Cardiovascular", tagClass: "cardio" },
  psych:       { label: "Behavioral & Psychiatric Emergencies", short: "Behavioral", tagClass: "psych" },
  infectious:  { label: "Infectious Disease & Respiratory", short: "Infectious Disease", tagClass: "infectious" },
  pain:        { label: "Analgesia & Pain Management", short: "Pain Management", tagClass: "pain" },
  gi:          { label: "Gastrointestinal Haemorrhage & Anticoagulant Reversal", short: "GI Bleeding", tagClass: "gi" },
  obesity:     { label: "Obesity in Emergency & Critical Care", short: "Obesity", tagClass: "obesity" }
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
    specialty: "pain",
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
  }
];
