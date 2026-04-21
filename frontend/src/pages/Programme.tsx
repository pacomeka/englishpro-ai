import { CheckCircle2, Circle, Lock } from "lucide-react";
import { useUser } from "../context/UserContext";
import { useProgress } from "../hooks/useProgress";
import { PHASES_LABELS } from "../lib/prompts";

const PHASES_DETAIL = [
  {
    phase: 1,
    semaines: "1–3",
    dureeSession: "30 min",
    activites: [
      "Vocabulaire Anki : 10 nouveaux mots/jour",
      "Écoute : BBC 6 Minute English",
      "Grammaire : Présent simple, past simple",
    ],
  },
  {
    phase: 2,
    semaines: "4–6",
    dureeSession: "35 min",
    activites: [
      "Monologue guidé de 2 minutes",
      "Shadowing (imitation d'un natif)",
      "Conversation avec Claude",
    ],
  },
  {
    phase: 3,
    semaines: "7–9",
    dureeSession: "40 min",
    activites: [
      "Séries Netflix en VO sous-titres anglais",
      "Dictée audio (30 sec → retranscription)",
      "10 messages avec un natif par soir",
    ],
  },
  {
    phase: 4,
    semaines: "10–14",
    dureeSession: "40 min",
    activites: [
      "Journal quotidien 5–8 phrases",
      "VOA Learning English ou TED Talks Easy",
      "Oral avancé : discussions libres",
    ],
  },
  {
    phase: 5,
    semaines: "15–20",
    dureeSession: "45 min",
    activites: [
      "Débat sur sujet d'actualité avec Claude",
      "Lecture : articles BBC News",
      "Correction active des anciens journaux",
    ],
  },
  {
    phase: 6,
    semaines: "24",
    dureeSession: "45 min",
    activites: [
      "Préparation TOEIC / IELTS",
      "Test EF SET gratuit en ligne",
      "Bilan final avec Claude",
    ],
  },
];

const NIVEAUX_CIBLES = ["A2", "A2+", "B1", "B1+", "B2", "B2+"];
const PHASE_COLORS = [
  "blue",
  "indigo",
  "violet",
  "purple",
  "pink",
  "emerald",
];

const COLOR_MAP: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-500" },
  indigo: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200", dot: "bg-indigo-500" },
  violet: { bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-200", dot: "bg-violet-500" },
  purple: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", dot: "bg-purple-500" },
  pink: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200", dot: "bg-pink-500" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
};

export default function Programme() {
  const { userId } = useUser();
  const { dashboard } = useProgress(userId);
  const phaseActuelle = dashboard?.phaseActuelle ?? 1;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Programme</h2>
        <p className="text-gray-500 mt-1">
          Votre parcours vers le niveau B2+ en 6 mois
        </p>
      </div>

      {/* Objectif final */}
      <div className="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-emerald-100 text-sm">Objectif final</p>
            <p className="text-2xl font-bold mt-1">B2+ en 6 mois</p>
            <p className="text-emerald-100 text-sm mt-1">
              TOEIC 785+ · IELTS 6.5+
            </p>
          </div>
          <div className="text-5xl">🎯</div>
        </div>
      </div>

      {/* Timeline des phases */}
      <div className="space-y-4">
        {PHASES_DETAIL.map((p, idx) => {
          const color = PHASE_COLORS[idx];
          const c = COLOR_MAP[color];
          const isCompleted = p.phase < phaseActuelle;
          const isCurrent = p.phase === phaseActuelle;
          const isLocked = p.phase > phaseActuelle;
          const phaseLabel = PHASES_LABELS[p.phase];

          return (
            <div
              key={p.phase}
              className={`card border ${c.border} ${isCurrent ? "shadow-md" : ""} ${isLocked ? "opacity-60" : ""}`}
            >
              <div className="flex items-start gap-3">
                {/* Icône statut */}
                <div className="mt-0.5 shrink-0">
                  {isCompleted ? (
                    <CheckCircle2 className="text-emerald-500" size={24} />
                  ) : isCurrent ? (
                    <div className={`w-6 h-6 rounded-full ${c.dot} flex items-center justify-center`}>
                      <span className="text-white text-xs font-bold">{p.phase}</span>
                    </div>
                  ) : (
                    <Lock className="text-gray-400" size={22} />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">
                      Phase {p.phase} — {phaseLabel.titre}
                    </h3>
                    {isCurrent && (
                      <span className={`badge ${c.bg} ${c.text}`}>
                        En cours
                      </span>
                    )}
                    {isCompleted && (
                      <span className="badge bg-emerald-50 text-emerald-700">
                        Terminée
                      </span>
                    )}
                  </div>

                  <div className="flex gap-3 mt-1 text-xs text-gray-500">
                    <span>📅 Semaines {p.semaines}</span>
                    <span>⏱ {p.dureeSession}/soir</span>
                    <span>🎯 {NIVEAUX_CIBLES[idx]}</span>
                  </div>

                  <ul className="mt-3 space-y-1.5">
                    {p.activites.map((act, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className={`mt-1 w-1.5 h-1.5 rounded-full ${c.dot} shrink-0`} />
                        {act}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Connexion entre phases */}
      <div className="card bg-gray-50 text-center">
        <p className="text-sm text-gray-600">
          Chaque phase se débloque automatiquement selon votre progression.
          <br />
          <span className="font-medium text-gray-800">
            Pratiquez 30 min chaque soir pour avancer.
          </span>
        </p>
      </div>
    </div>
  );
}
