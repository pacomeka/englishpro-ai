// Sujets de conversation suggérés par phase
export const SUJETS_PAR_PHASE: Record<number, string[]> = {
  1: [
    "daily routine",
    "family and friends",
    "food and meals",
    "your city",
    "hobbies",
  ],
  2: [
    "work and studies",
    "travel experiences",
    "favorite movies",
    "sports and health",
    "weather",
  ],
  3: [
    "technology and social media",
    "culture and traditions",
    "environmental issues",
    "education systems",
    "current events",
  ],
  4: [
    "career goals",
    "global challenges",
    "art and creativity",
    "philosophy of life",
    "economic topics",
  ],
  5: [
    "political discussions",
    "scientific discoveries",
    "ethical dilemmas",
    "literature",
    "international relations",
  ],
  6: [
    "TOEIC preparation",
    "professional presentations",
    "academic writing",
    "complex debates",
    "business English",
  ],
};

// Labels des phases
export const PHASES_LABELS: Record<
  number,
  { titre: string; objectif: string; duree: string }
> = {
  1: {
    titre: "Fondations",
    objectif: "Vocabulaire de base, grammaire essentielle",
    duree: "Semaines 1–3",
  },
  2: {
    titre: "Expression orale",
    objectif: "Monologues, prononciation, premiers échanges",
    duree: "Semaines 4–6",
  },
  3: {
    titre: "Compréhension",
    objectif: "Immersion, dictée audio, conversation",
    duree: "Semaines 7–9",
  },
  4: {
    titre: "Fluidité",
    objectif: "Oral avancé, journal quotidien, écoute",
    duree: "Semaines 10–14",
  },
  5: {
    titre: "Maîtrise",
    objectif: "Débats, lecture, correction active",
    duree: "Semaines 15–20",
  },
  6: {
    titre: "Certification",
    objectif: "TOEIC / IELTS, bilan final",
    duree: "Semaine 24",
  },
};

export const NIVEAUX_LABELS: Record<string, string> = {
  A1: "Débutant",
  A2: "Élémentaire",
  B1: "Intermédiaire",
  B2: "Intermédiaire avancé",
  C1: "Avancé",
};

export const CATEGORIES_CARTES = [
  "Tous",
  "Actions",
  "Personnes",
  "Lieux",
  "Adjectifs",
  "Connecteurs",
  "Divers",
];
