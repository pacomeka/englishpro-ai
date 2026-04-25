export function calculerProchainRevision(
  niveauFacilite: number,
  intervalle: number,
  repetitions: number
): { nouvelIntervalle: number; nouvelleDate: Date } {
  let nouvelIntervalle: number;

  if (niveauFacilite === 0) {
    nouvelIntervalle = 1;
  } else if (repetitions === 0) {
    nouvelIntervalle = 1;
  } else if (repetitions === 1) {
    nouvelIntervalle = 6;
  } else {
    nouvelIntervalle = Math.round(intervalle * 2.5);
  }

  const nouvelleDate = new Date();
  nouvelleDate.setDate(nouvelleDate.getDate() + nouvelIntervalle);

  return { nouvelIntervalle, nouvelleDate };
}

export function getCartesARevoir(
  cartes: Array<{ prochainRevision: Date | string }>
): number {
  const now = new Date();
  return cartes.filter((c) => new Date(c.prochainRevision) <= now).length;
}

// 3000 mots pré-chargés par niveaux A1→B2 (échantillon de base)
export const VOCABULAIRE_BASE: Array<{
  motEn: string;
  traductionFr: string;
  exemple: string;
  niveau: string;
  categorie: string;
}> = [
  // A1 - Actions basiques
  { motEn: "go", traductionFr: "aller", exemple: "I go to school every day.", niveau: "A1", categorie: "Actions" },
  { motEn: "come", traductionFr: "venir", exemple: "Come here, please.", niveau: "A1", categorie: "Actions" },
  { motEn: "eat", traductionFr: "manger", exemple: "We eat dinner at 7pm.", niveau: "A1", categorie: "Actions" },
  { motEn: "drink", traductionFr: "boire", exemple: "I drink water every morning.", niveau: "A1", categorie: "Actions" },
  { motEn: "sleep", traductionFr: "dormir", exemple: "I sleep eight hours a night.", niveau: "A1", categorie: "Actions" },
  { motEn: "work", traductionFr: "travailler", exemple: "She works in a hospital.", niveau: "A1", categorie: "Actions" },
  { motEn: "play", traductionFr: "jouer", exemple: "The children play in the park.", niveau: "A1", categorie: "Actions" },
  { motEn: "speak", traductionFr: "parler", exemple: "Do you speak English?", niveau: "A1", categorie: "Actions" },
  { motEn: "read", traductionFr: "lire", exemple: "I read books every evening.", niveau: "A1", categorie: "Actions" },
  { motEn: "write", traductionFr: "écrire", exemple: "Please write your name here.", niveau: "A1", categorie: "Actions" },
  // A1 - Personnes
  { motEn: "friend", traductionFr: "ami(e)", exemple: "She is my best friend.", niveau: "A1", categorie: "Personnes" },
  { motEn: "family", traductionFr: "famille", exemple: "My family is very important to me.", niveau: "A1", categorie: "Personnes" },
  { motEn: "mother", traductionFr: "mère", exemple: "My mother is a teacher.", niveau: "A1", categorie: "Personnes" },
  { motEn: "father", traductionFr: "père", exemple: "His father works in Abidjan.", niveau: "A1", categorie: "Personnes" },
  { motEn: "brother", traductionFr: "frère", exemple: "I have two brothers.", niveau: "A1", categorie: "Personnes" },
  { motEn: "sister", traductionFr: "sœur", exemple: "My sister lives in Paris.", niveau: "A1", categorie: "Personnes" },
  { motEn: "teacher", traductionFr: "professeur", exemple: "The teacher explains grammar.", niveau: "A1", categorie: "Personnes" },
  { motEn: "student", traductionFr: "étudiant(e)", exemple: "She is a good student.", niveau: "A1", categorie: "Personnes" },
  // A1 - Lieux
  { motEn: "school", traductionFr: "école", exemple: "I go to school by bus.", niveau: "A1", categorie: "Lieux" },
  { motEn: "home", traductionFr: "maison / chez soi", exemple: "Let's go home now.", niveau: "A1", categorie: "Lieux" },
  { motEn: "market", traductionFr: "marché", exemple: "We buy food at the market.", niveau: "A1", categorie: "Lieux" },
  { motEn: "hospital", traductionFr: "hôpital", exemple: "The hospital is near the school.", niveau: "A1", categorie: "Lieux" },
  { motEn: "office", traductionFr: "bureau", exemple: "He works in a big office.", niveau: "A1", categorie: "Lieux" },
  // A2 - Adjectifs
  { motEn: "happy", traductionFr: "heureux/heureuse", exemple: "I am very happy today.", niveau: "A2", categorie: "Adjectifs" },
  { motEn: "tired", traductionFr: "fatigué(e)", exemple: "She feels tired after work.", niveau: "A2", categorie: "Adjectifs" },
  { motEn: "hungry", traductionFr: "avoir faim", exemple: "Are you hungry? Let's eat.", niveau: "A2", categorie: "Adjectifs" },
  { motEn: "busy", traductionFr: "occupé(e)", exemple: "Sorry, I'm very busy right now.", niveau: "A2", categorie: "Adjectifs" },
  { motEn: "beautiful", traductionFr: "beau/belle", exemple: "It's a beautiful day today.", niveau: "A2", categorie: "Adjectifs" },
  { motEn: "important", traductionFr: "important(e)", exemple: "Education is very important.", niveau: "A2", categorie: "Adjectifs" },
  // A2 - Verbes courants
  { motEn: "understand", traductionFr: "comprendre", exemple: "Do you understand the question?", niveau: "A2", categorie: "Actions" },
  { motEn: "help", traductionFr: "aider", exemple: "Can you help me, please?", niveau: "A2", categorie: "Actions" },
  { motEn: "think", traductionFr: "penser", exemple: "I think you are right.", niveau: "A2", categorie: "Actions" },
  { motEn: "want", traductionFr: "vouloir", exemple: "I want to learn English.", niveau: "A2", categorie: "Actions" },
  { motEn: "need", traductionFr: "avoir besoin de", exemple: "I need more practice.", niveau: "A2", categorie: "Actions" },
  { motEn: "know", traductionFr: "savoir / connaître", exemple: "Do you know this word?", niveau: "A2", categorie: "Actions" },
  { motEn: "learn", traductionFr: "apprendre", exemple: "I learn English every day.", niveau: "A2", categorie: "Actions" },
  { motEn: "try", traductionFr: "essayer", exemple: "Try to speak more English.", niveau: "A2", categorie: "Actions" },
  // B1 - Vocabulaire intermédiaire
  { motEn: "opportunity", traductionFr: "opportunité", exemple: "This is a great opportunity.", niveau: "B1", categorie: "Divers" },
  { motEn: "experience", traductionFr: "expérience", exemple: "I have experience in this field.", niveau: "B1", categorie: "Divers" },
  { motEn: "challenge", traductionFr: "défi", exemple: "Learning English is a challenge.", niveau: "B1", categorie: "Divers" },
  { motEn: "achieve", traductionFr: "réaliser / atteindre", exemple: "You can achieve your goals.", niveau: "B1", categorie: "Actions" },
  { motEn: "improve", traductionFr: "améliorer", exemple: "I want to improve my English.", niveau: "B1", categorie: "Actions" },
  { motEn: "describe", traductionFr: "décrire", exemple: "Can you describe your city?", niveau: "B1", categorie: "Actions" },
  { motEn: "explain", traductionFr: "expliquer", exemple: "Please explain your answer.", niveau: "B1", categorie: "Actions" },
  { motEn: "suggest", traductionFr: "suggérer", exemple: "I suggest we start early.", niveau: "B1", categorie: "Actions" },
  { motEn: "manage", traductionFr: "gérer / réussir à", exemple: "He manages a team of ten.", niveau: "B1", categorie: "Actions" },
  { motEn: "develop", traductionFr: "développer", exemple: "We need to develop new skills.", niveau: "B1", categorie: "Actions" },
  // B2 - Vocabulaire avancé
  { motEn: "negotiate", traductionFr: "négocier", exemple: "They negotiated a better deal.", niveau: "B2", categorie: "Actions" },
  { motEn: "perspective", traductionFr: "perspective", exemple: "From my perspective, this is wrong.", niveau: "B2", categorie: "Divers" },
  { motEn: "significant", traductionFr: "significatif / important", exemple: "There was a significant improvement.", niveau: "B2", categorie: "Adjectifs" },
  { motEn: "consequence", traductionFr: "conséquence", exemple: "What are the consequences?", niveau: "B2", categorie: "Divers" },
  { motEn: "furthermore", traductionFr: "de plus / en outre", exemple: "Furthermore, we need more data.", niveau: "B2", categorie: "Connecteurs" },
  { motEn: "nevertheless", traductionFr: "néanmoins", exemple: "Nevertheless, we continued.", niveau: "B2", categorie: "Connecteurs" },
  { motEn: "approximately", traductionFr: "approximativement", exemple: "It costs approximately $50.", niveau: "B2", categorie: "Divers" },
  { motEn: "acknowledge", traductionFr: "reconnaître / admettre", exemple: "I acknowledge my mistake.", niveau: "B2", categorie: "Actions" },
];
