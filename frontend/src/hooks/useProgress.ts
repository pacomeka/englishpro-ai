import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

export interface DashboardData {
  streakJours: number;
  motsAppris: number;
  scoreMoyen: number;
  heuresTotal: number;
  phaseActuelle: number;
  semaineActuelle: number;
  niveauActuel: string;
  cartesARevoir: number;
  prochaineSession: string | null;
  progressionHebdo: Array<{
    semaine: number;
    scoreMoyen: number;
    motsAppris: number;
    tempsTotal: number;
  }>;
}

export function useProgress(userId: string) {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDashboard(userId);
      setDashboard(data as DashboardData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur");
      // Données de démo si le backend n'est pas disponible
      setDashboard({
        streakJours: 7,
        motsAppris: 84,
        scoreMoyen: 78,
        heuresTotal: 4,
        phaseActuelle: 1,
        semaineActuelle: 2,
        niveauActuel: "A2",
        cartesARevoir: 12,
        prochaineSession: null,
        progressionHebdo: [
          { semaine: 1, scoreMoyen: 65, motsAppris: 30, tempsTotal: 210 },
          { semaine: 2, scoreMoyen: 78, motsAppris: 54, tempsTotal: 240 },
        ],
      });
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return { dashboard, loading, error, reload: loadDashboard };
}
