import { useNavigate } from "react-router-dom";
import {
  Flame,
  BookOpen,
  Trophy,
  Clock,
  ChevronRight,
  AlertCircle,
  PlayCircle,
  Star,
} from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { useUser } from "../context/UserContext";
import { PHASES_LABELS, NIVEAUX_LABELS } from "../lib/prompts";

export default function Dashboard() {
  const { userId, nom } = useUser();
  const { dashboard, loading } = useProgress(userId);
  const navigate = useNavigate();

  const phase = dashboard?.phaseActuelle ?? 1;
  const phaseInfo = PHASES_LABELS[phase];

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  const stats = [
    {
      icon: Flame,
      label: "Streak",
      value: `${dashboard?.streakJours ?? 0}j`,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
    {
      icon: BookOpen,
      label: "Mots appris",
      value: dashboard?.motsAppris ?? 0,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Trophy,
      label: "Score moyen",
      value: `${dashboard?.scoreMoyen ?? 0}%`,
      color: "text-yellow-500",
      bg: "bg-yellow-50",
    },
    {
      icon: Clock,
      label: "Heures totales",
      value: `${dashboard?.heuresTotal ?? 0}h`,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Bonsoir, {nom} 👋
        </h2>
        <p className="text-gray-500 mt-1">
          Niveau actuel :{" "}
          <span className="font-semibold text-blue-600">
            {dashboard?.niveauActuel ?? "A2"} —{" "}
            {NIVEAUX_LABELS[dashboard?.niveauActuel ?? "A2"]}
          </span>
        </p>
      </div>

      {/* Phase actuelle */}
      <div className="card bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-blue-200 text-sm font-medium">
              Phase {phase} • {phaseInfo?.duree}
            </p>
            <h3 className="text-xl font-bold mt-1">{phaseInfo?.titre}</h3>
            <p className="text-blue-100 text-sm mt-1">{phaseInfo?.objectif}</p>
          </div>
          <div className="bg-white/20 rounded-xl px-3 py-1.5">
            <span className="text-sm font-semibold">
              Sem. {dashboard?.semaineActuelle ?? 1}
            </span>
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-blue-200 mb-1">
            <span>Progression vers B2+</span>
            <span>
              {Math.round(((dashboard?.semaineActuelle ?? 1) / 24) * 100)}%
            </span>
          </div>
          <div className="w-full bg-blue-500/40 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{
                width: `${Math.round(
                  ((dashboard?.semaineActuelle ?? 1) / 24) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Alerte cartes à revoir */}
      {(dashboard?.cartesARevoir ?? 0) > 0 && (
        <div
          className="flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 cursor-pointer"
          onClick={() => navigate("/cards")}
        >
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <div className="flex-1">
            <p className="text-amber-800 font-medium text-sm">
              {dashboard?.cartesARevoir} cartes à réviser
            </p>
            <p className="text-amber-600 text-xs">
              Touchez pour commencer la révision
            </p>
          </div>
          <ChevronRight className="text-amber-400" size={18} />
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map(({ icon: Icon, label, value, color, bg }) => (
          <div key={label} className="card flex items-center gap-3">
            <div className={`${bg} p-2.5 rounded-xl`}>
              <Icon className={color} size={20} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-lg font-bold text-gray-900">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton session du soir */}
      <button
        onClick={() => navigate("/session")}
        className="w-full btn-primary flex items-center justify-center gap-3 text-lg py-4"
      >
        <PlayCircle size={24} />
        Commencer la session du soir
      </button>

      {/* Actions rapides */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700 text-sm uppercase tracking-wide">
          Accès rapide
        </h3>
        {[
          {
            to: "/cards",
            icon: BookOpen,
            label: "Réviser mes cartes Anki",
            sub: `${dashboard?.cartesARevoir ?? 0} à revoir aujourd'hui`,
          },
          {
            to: "/conversation",
            icon: Star,
            label: "Conversation libre",
            sub: "Pratiquer avec Claude",
          },
          {
            to: "/programme",
            icon: ChevronRight,
            label: "Voir le programme",
            sub: "6 phases vers B2+",
          },
        ].map(({ to, icon: Icon, label, sub }) => (
          <div
            key={to}
            onClick={() => navigate(to)}
            className="card flex items-center gap-3 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="bg-gray-100 p-2.5 rounded-xl">
              <Icon className="text-gray-600" size={18} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-gray-800 text-sm">{label}</p>
              <p className="text-xs text-gray-500">{sub}</p>
            </div>
            <ChevronRight className="text-gray-400" size={16} />
          </div>
        ))}
      </div>
    </div>
  );
}
