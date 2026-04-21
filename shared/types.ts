export type Niveau = "A1" | "A2" | "B1" | "B2" | "C1";
export type Phase = 1 | 2 | 3 | 4 | 5 | 6;
export type ExerciseType =
  | "traduction"
  | "conjugaison"
  | "choix_multiple"
  | "phrase_libre";

export interface Exercise {
  id: string;
  type: ExerciseType;
  question: string;
  reponse_correcte: string;
  indice: string;
  explication: string;
  options?: string[]; // pour choix_multiple
}

export interface CorrectionResult {
  correct: boolean;
  score: number;
  feedback: string;
  conseil: string;
}

export interface User {
  id: string;
  email: string;
  nom: string;
  niveauInitial: Niveau;
  niveauActuel: Niveau;
  dateInscription: string;
}

export interface Session {
  id: string;
  userId: string;
  date: string;
  dureeMin: number;
  score: number;
  phase: Phase;
  activites: ActivityResult[];
}

export interface ActivityResult {
  type: string;
  score: number;
  dureeMin: number;
}

export interface Carte {
  id: string;
  userId: string;
  motEn: string;
  traductionFr: string;
  exemple: string;
  niveauFacilite: 0 | 1 | 2;
  intervalle: number;
  prochainRevision: string;
  repetitions: number;
}

export interface Progression {
  id: string;
  userId: string;
  semaine: number;
  moisAnnee: string;
  motsAppris: number;
  scoreMoyen: number;
  streakJours: number;
  tempsTotal: number;
}

export interface DashboardStats {
  streakJours: number;
  motsAppris: number;
  scoreMoyen: number;
  heuresTotal: number;
  phaseActuelle: Phase;
  semaineActuelle: number;
  niveauActuel: Niveau;
  cartesARevoir: number;
  prochaineSession: string | null;
}

export interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface GenerateExampleResult {
  exemple: string;
  traduction: string;
}
