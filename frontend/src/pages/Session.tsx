import { useState, useCallback } from "react";
import {
  PlayCircle,
  ChevronRight,
  Lightbulb,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Timer,
  Star,
} from "lucide-react";
import { useSession } from "../hooks/useSession";
import { useUser } from "../context/UserContext";
import { api } from "../lib/api";

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function ExerciseCard({
  exercise,
  onSubmit,
  correcting,
}: {
  exercise: {
    id: string;
    type: string;
    question: string;
    reponse_correcte: string;
    indice: string;
    explication: string;
    options?: string[];
  };
  onSubmit: (rep: string) => void;
  correcting: boolean;
}) {
  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);

  const handleSubmit = () => {
    if (!answer.trim()) return;
    onSubmit(answer.trim());
  };

  return (
    <div className="space-y-4">
      {/* Type badge */}
      <div className="flex items-center gap-2">
        <span className="badge bg-blue-100 text-blue-700 capitalize">
          {exercise.type.replace("_", " ")}
        </span>
      </div>

      {/* Question */}
      <div className="card bg-blue-50 border-blue-100">
        <p className="text-gray-800 font-medium text-base leading-relaxed">
          {exercise.question}
        </p>
      </div>

      {/* Réponse */}
      {exercise.type === "choix_multiple" && exercise.options ? (
        <div className="space-y-2">
          {exercise.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => setAnswer(opt)}
              className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors font-medium text-sm ${
                answer === opt
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
              }`}
            >
              {String.fromCharCode(65 + i)}. {opt}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Votre réponse en anglais..."
          rows={3}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
          }}
        />
      )}

      {/* Indice */}
      <button
        onClick={() => setShowHint(!showHint)}
        className="flex items-center gap-2 text-amber-600 text-sm font-medium"
      >
        <Lightbulb size={16} />
        {showHint ? "Cacher" : "Voir"} l'indice
      </button>
      {showHint && (
        <div className="card bg-amber-50 border-amber-100 text-sm text-amber-800">
          💡 {exercise.indice}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!answer.trim() || correcting}
        className="btn-primary w-full flex items-center justify-center gap-2"
      >
        {correcting ? (
          <>
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            Correction en cours...
          </>
        ) : (
          <>
            Valider ma réponse
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}

function CorrectionCard({
  correction,
  exercise,
  onNext,
  isLast,
}: {
  correction: { correct: boolean; score: number; feedback: string; conseil: string };
  exercise: { reponse_correcte: string; explication: string };
  onNext: () => void;
  isLast: boolean;
}) {
  return (
    <div className="space-y-4">
      {/* Résultat */}
      <div
        className={`card border-2 ${
          correction.correct
            ? "border-green-200 bg-green-50"
            : "border-red-100 bg-red-50"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          {correction.correct ? (
            <CheckCircle2 className="text-green-500" size={28} />
          ) : (
            <XCircle className="text-red-400" size={28} />
          )}
          <div>
            <p
              className={`font-bold text-lg ${
                correction.correct ? "text-green-700" : "text-red-600"
              }`}
            >
              {correction.correct ? "Correct !" : "Pas tout à fait..."}
            </p>
            <p className="text-sm text-gray-500">Score : {correction.score}/100</p>
          </div>
        </div>
        <p className="text-gray-700 text-sm">{correction.feedback}</p>
      </div>

      {/* Bonne réponse */}
      {!correction.correct && (
        <div className="card bg-gray-50 border-gray-100">
          <p className="text-xs text-gray-500 mb-1">Bonne réponse</p>
          <p className="font-semibold text-gray-800">{exercise.reponse_correcte}</p>
        </div>
      )}

      {/* Explication grammaticale */}
      <div className="card bg-indigo-50 border-indigo-100">
        <p className="text-xs text-indigo-500 mb-1 font-medium uppercase tracking-wide">
          Règle grammaticale
        </p>
        <p className="text-sm text-indigo-800">{exercise.explication}</p>
      </div>

      {/* Conseil */}
      <div className="card bg-amber-50 border-amber-100">
        <p className="text-xs text-amber-500 mb-1 font-medium uppercase tracking-wide">
          Conseil
        </p>
        <p className="text-sm text-amber-800">💡 {correction.conseil}</p>
      </div>

      <button onClick={onNext} className="btn-primary w-full flex items-center justify-center gap-2">
        {isLast ? (
          <>
            <Star size={18} />
            Voir mon score final
          </>
        ) : (
          <>
            Exercice suivant
            <ChevronRight size={18} />
          </>
        )}
      </button>
    </div>
  );
}

function SessionComplete({
  score,
  time,
  onSave,
  onRestart,
  saving,
}: {
  score: number;
  time: number;
  onSave: () => void;
  onRestart: () => void;
  saving: boolean;
}) {
  const emoji = score >= 80 ? "🏆" : score >= 60 ? "⭐" : "💪";
  const message =
    score >= 80
      ? "Excellent travail !"
      : score >= 60
      ? "Bonne session !"
      : "Continue, tu progresses !";

  return (
    <div className="text-center space-y-6 py-4">
      <div className="text-7xl">{emoji}</div>
      <div>
        <h2 className="text-3xl font-bold text-gray-900">{score}%</h2>
        <p className="text-xl font-medium text-gray-600 mt-1">{message}</p>
        <p className="text-gray-500 mt-2">
          Durée : {formatTime(time)} · {Math.floor(time / 60)} min de pratique
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={onSave}
          disabled={saving}
          className="btn-primary w-full flex items-center justify-center gap-2"
        >
          {saving ? (
            <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <CheckCircle2 size={18} />
          )}
          Sauvegarder la session
        </button>
        <button onClick={onRestart} className="btn-secondary w-full flex items-center justify-center gap-2">
          <RotateCcw size={18} />
          Nouvelle session
        </button>
      </div>
    </div>
  );
}

export default function Session() {
  const { userId, niveau, phase } = useUser();
  const { state, loadExercises, submitAnswer, nextExercise, reset } = useSession(
    niveau,
    phase
  );
  const [currentCorrection, setCurrentCorrection] = useState<null | {
    correct: boolean;
    score: number;
    feedback: string;
    conseil: string;
  }>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const exercise = state.exercises[state.currentIndex];

  const handleSubmit = useCallback(
    async (reponse: string) => {
      const correction = await submitAnswer(reponse);
      if (correction) setCurrentCorrection(correction);
    },
    [submitAnswer]
  );

  const handleNext = () => {
    setCurrentCorrection(null);
    nextExercise();
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveSession({
        userId,
        dureeMin: Math.round(state.timerSeconds / 60),
        score: state.sessionScore,
        phase,
        activites: [],
      });
      setSaved(true);
    } catch {}
    setSaving(false);
  };

  // Écran de démarrage
  if (!state.exercises.length && !state.loading && !state.error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Session du soir</h2>
          <p className="text-gray-500 mt-1">
            Phase {phase} · Niveau {niveau}
          </p>
        </div>

        <div className="card text-center space-y-4 py-8">
          <div className="text-6xl">🌙</div>
          <h3 className="text-xl font-bold text-gray-800">
            Prêt pour ce soir ?
          </h3>
          <p className="text-gray-500 text-sm">
            5 exercices personnalisés générés par IA
            <br />
            pour votre niveau {niveau} — Phase {phase}
          </p>
          <button
            onClick={loadExercises}
            className="btn-primary mx-auto flex items-center gap-2 w-fit"
          >
            <PlayCircle size={20} />
            Démarrer la session
          </button>
        </div>
      </div>
    );
  }

  // Chargement
  if (state.loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <p className="text-gray-500">Génération des exercices par IA...</p>
      </div>
    );
  }

  // Erreur
  if (state.error) {
    return (
      <div className="card text-center space-y-4 py-8">
        <div className="text-5xl">😕</div>
        <p className="text-gray-600">{state.error}</p>
        <button onClick={loadExercises} className="btn-primary mx-auto w-fit">
          Réessayer
        </button>
      </div>
    );
  }

  // Session terminée
  if (state.completed) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Session terminée</h2>
        <SessionComplete
          score={state.sessionScore}
          time={state.timerSeconds}
          onSave={handleSave}
          onRestart={reset}
          saving={saving}
        />
        {saved && (
          <div className="card bg-green-50 border-green-200 text-center">
            <p className="text-green-700 font-medium">✅ Session sauvegardée !</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header avec timer et progression */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Session du soir</h2>
          <p className="text-sm text-gray-500">
            Exercice {state.currentIndex + 1}/{state.exercises.length}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
          <Timer size={15} className="text-gray-500" />
          <span className="font-mono font-semibold text-gray-700 text-sm">
            {formatTime(state.timerSeconds)}
          </span>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className="bg-blue-600 rounded-full h-2 transition-all duration-300"
          style={{
            width: `${((state.currentIndex + (currentCorrection ? 1 : 0)) /
              state.exercises.length) *
              100}%`,
          }}
        />
      </div>

      {/* Score courant */}
      {Object.keys(state.answers).length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <Star size={15} className="text-yellow-500" />
          <span className="text-gray-600">
            Score courant :{" "}
            <span className="font-semibold text-gray-800">
              {state.sessionScore}%
            </span>
          </span>
        </div>
      )}

      {/* Exercice ou correction */}
      {exercise &&
        (currentCorrection ? (
          <CorrectionCard
            correction={currentCorrection}
            exercise={exercise}
            onNext={handleNext}
            isLast={state.currentIndex === state.exercises.length - 1}
          />
        ) : (
          <ExerciseCard
            exercise={exercise}
            onSubmit={handleSubmit}
            correcting={state.correcting}
          />
        ))}
    </div>
  );
}
