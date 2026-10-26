// Single source of truth for which tools appear in the atlas.
// Add a new tool here when it's published — no other file needs editing
// for the gallery itself to pick it up.

const SPECIALTIES = {
  cardio:      { label: "Cardiovascular Emergencies", short: "Cardiovascular", tagClass: "cardio" },
  psych:       { label: "Behavioral & Psychiatric Emergencies", short: "Behavioral", tagClass: "psych" },
  infectious:  { label: "Infectious Disease & Respiratory", short: "Infectious Disease", tagClass: "infectious" }
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
  }
];
