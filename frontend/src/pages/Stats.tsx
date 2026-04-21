import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { TrendingUp, BookOpen, Clock, Trophy } from "lucide-react";
import { useProgress } from "../hooks/useProgress";
import { useUser } from "../context/UserContext";
import { NIVEAUX_LABELS } from "../lib/prompts";

const DEMO_WEEKLY = [
  { semaine: 1, scoreMoyen: 62, motsAppris: 28, tempsTotal: 180 },
  { semaine: 2, scoreMoyen: 70, motsAppris: 42, tempsTotal: 210 },
  { semaine: 3, scoreMoyen: 75, motsAppris: 56, tempsTotal: 200 },
  { semaine: 4, scoreMoyen: 78, motsAppris: 70, tempsTotal: 230 },
  { semaine: 5, scoreMoyen: 82, motsAppris: 84, tempsTotal: 240 },
  { semaine: 6, scoreMoyen: 85, motsAppris: 100, tempsTotal: 250 },
];

export default function Stats() {
  const { userId } = useUser();
  const { dashboard, loading } = useProgress(userId);

  const weeklyData =
    dashboard?.progressionHebdo && dashboard.progressionHebdo.length > 0
      ? dashboard.progressionHebdo
      : DEMO_WEEKLY;

  const niveauxProgression = [
    { niveau: "A1", label: "Débutant", semaine: 0, atteint: true },
    { niveau: "A2", label: "Élémentaire", semaine: 1, atteint: true },
    { niveau: "B1", label: "Intermédiaire", semaine: 9, atteint: false },
    { niveau: "B2", label: "Avancé", semaine: 20, atteint: false },
    { niveau: "B2+", label: "Objectif", semaine: 24, atteint: false },
  ];

  if (loading && !dashboard) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Statistiques</h2>
        <p className="text-gray-500 mt-1">Votre progression semaine par semaine</p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          {
            icon: Trophy,
            label: "Score moyen",
            value: `${dashboard?.scoreMoyen ?? 0}%`,
            sub: "Sur toutes les sessions",
            color: "text-yellow-500",
            bg: "bg-yellow-50",
          },
          {
            icon: BookOpen,
            label: "Mots appris",
            value: dashboard?.motsAppris ?? 0,
            sub: "Depuis le début",
            color: "text-blue-500",
            bg: "bg-blue-50",
          },
          {
            icon: Clock,
            label: "Temps total",
            value: `${dashboard?.heuresTotal ?? 0}h`,
            sub: "De pratique",
            color: "text-purple-500",
            bg: "bg-purple-50",
          },
          {
            icon: TrendingUp,
            label: "Streak actuel",
            value: `${dashboard?.streakJours ?? 0}j`,
            sub: "Jours consécutifs",
            color: "text-orange-500",
            bg: "bg-orange-50",
          },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className="card">
            <div className={`${bg} w-9 h-9 rounded-xl flex items-center justify-center mb-2`}>
              <Icon className={color} size={18} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm font-medium text-gray-700">{label}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Score moyen par semaine */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Score moyen par semaine</h3>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="semaine"
              tickFormatter={(v) => `S${v}`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <Tooltip
              formatter={(v: number) => [`${v}%`, "Score"]}
              labelFormatter={(l) => `Semaine ${l}`}
            />
            <Line
              type="monotone"
              dataKey="scoreMoyen"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={{ fill: "#2563eb", r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Mots appris par semaine */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Mots appris par semaine</h3>
        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="semaine"
              tickFormatter={(v) => `S${v}`}
              tick={{ fontSize: 11, fill: "#9ca3af" }}
            />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} />
            <Tooltip
              formatter={(v: number) => [v, "Mots"]}
              labelFormatter={(l) => `Semaine ${l}`}
            />
            <Bar dataKey="motsAppris" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Progression des niveaux */}
      <div className="card">
        <h3 className="font-semibold text-gray-800 mb-4">Parcours de niveaux</h3>
        <div className="space-y-3">
          {niveauxProgression.map((n) => {
            const isCurrent = n.niveau === (dashboard?.niveauActuel ?? "A2");
            return (
              <div key={n.niveau} className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${
                    n.atteint || isCurrent
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {n.niveau}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium text-sm ${
                        isCurrent ? "text-blue-600" : "text-gray-700"
                      }`}
                    >
                      {NIVEAUX_LABELS[n.niveau] ?? n.label}
                    </p>
                    {isCurrent && (
                      <span className="badge bg-blue-50 text-blue-600">
                        Niveau actuel
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {n.semaine === 0 ? "Niveau de départ" : `Semaine ${n.semaine}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prédiction */}
      <div className="card bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
        <div className="flex items-start gap-3">
          <TrendingUp className="text-indigo-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-semibold text-indigo-800">Prédiction IA</p>
            <p className="text-sm text-indigo-600 mt-1">
              À votre rythme actuel, vous atteindrez{" "}
              <strong>B1 dans environ 7 semaines</strong> et{" "}
              <strong>B2+ en 24 semaines</strong>.
            </p>
            <p className="text-xs text-indigo-500 mt-1">
              Continuez à pratiquer chaque soir pour tenir l'objectif !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
