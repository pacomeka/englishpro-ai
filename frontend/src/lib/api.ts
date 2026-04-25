const BASE_URL = import.meta.env.VITE_API_URL || "/api";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Erreur réseau" }));
    throw new Error(err.error || "Erreur serveur");
  }
  return res.json();
}

export const api = {
  // Exercises
  generateExercises: (niveau: string, phase: number) =>
    request<{ exercises: unknown[] }>("/exercises/generate", {
      method: "POST",
      body: JSON.stringify({ niveau, phase }),
    }),

  correctAnswer: (
    reponseUtilisateur: string,
    reponseCorrecte: string,
    niveau: string
  ) =>
    request<{
      correct: boolean;
      score: number;
      feedback: string;
      conseil: string;
    }>("/exercises/correct", {
      method: "POST",
      body: JSON.stringify({ reponseUtilisateur, reponseCorrecte, niveau }),
    }),

  // Sessions
  getSessions: (userId: string) =>
    request<{ sessions: unknown[] }>(`/sessions?userId=${userId}`),

  saveSession: (data: {
    userId: string;
    dureeMin: number;
    score: number;
    phase: number;
    activites: unknown[];
  }) =>
    request<{ session: unknown }>("/sessions", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getStreak: (userId: string) =>
    request<{ streak: number }>(`/sessions/streak?userId=${userId}`),

  // Cards
  getCards: (userId: string, categorie?: string) =>
    request<{ cartes: unknown[] }>(
      `/cards?userId=${userId}${categorie ? `&categorie=${categorie}` : ""}`
    ),

  getDueCards: (userId: string) =>
    request<{ cartes: unknown[] }>(`/cards/due?userId=${userId}`),

  addCard: (data: {
    userId: string;
    motEn: string;
    traductionFr: string;
    exemple?: string;
    categorie?: string;
  }) =>
    request<{ carte: unknown }>("/cards", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  reviewCard: (carteId: string, niveauFacilite: 0 | 1 | 2) =>
    request<{ carte: unknown }>("/cards/review", {
      method: "POST",
      body: JSON.stringify({ carteId, niveauFacilite }),
    }),

  generateExample: (mot: string, niveau: string) =>
    request<{ exemple: string; traduction: string }>("/cards/example", {
      method: "POST",
      body: JSON.stringify({ mot, niveau }),
    }),

  seedCards: (userId: string, niveau: string) =>
    request<{ added: number; total: number }>("/cards/seed", {
      method: "POST",
      body: JSON.stringify({ userId, niveau }),
    }),

  deleteCard: (id: string) =>
    request<{ success: boolean }>(`/cards/${id}`, { method: "DELETE" }),

  // Progress
  getDashboard: (userId: string) =>
    request<{
      streakJours: number;
      motsAppris: number;
      scoreMoyen: number;
      heuresTotal: number;
      phaseActuelle: number;
      semaineActuelle: number;
      niveauActuel: string;
      cartesARevoir: number;
      prochaineSession: string | null;
      progressionHebdo: unknown[];
    }>(`/progress/dashboard?userId=${userId}`),

  getWeeklyProgress: (userId: string) =>
    request<{ progressions: unknown[] }>(`/progress/weekly?userId=${userId}`),

  // Conversation
  sendMessage: (
    messages: Array<{ role: "user" | "assistant"; content: string }>,
    niveau: string,
    sujet: string,
    userId: string
  ) =>
    request<{ message: string }>("/conversation/message", {
      method: "POST",
      body: JSON.stringify({ messages, niveau, sujet, userId }),
    }),

  saveConversation: (data: {
    userId: string;
    sujet: string;
    messages: unknown[];
    phase: number;
  }) =>
    request<{ conversation: unknown }>("/conversation/save", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getConversationHistory: (userId: string) =>
    request<{ conversations: unknown[] }>(
      `/conversation/history?userId=${userId}`
    ),
};
