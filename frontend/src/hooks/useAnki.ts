import { useState, useEffect, useCallback } from "react";
import { api } from "../lib/api";

export interface CarteData {
  id: string;
  motEn: string;
  traductionFr: string;
  exemple: string;
  niveauFacilite: number;
  intervalle: number;
  prochainRevision: string;
  repetitions: number;
  categorie: string;
}

export function useAnki(userId: string) {
  const [cartes, setCartes] = useState<CarteData[]>([]);
  const [cartesARevoir, setCartesARevoir] = useState<CarteData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCartes = useCallback(
    async (categorie?: string) => {
      setLoading(true);
      setError(null);
      try {
        const { cartes: data } = await api.getCards(userId, categorie);
        setCartes(data as CarteData[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur");
      } finally {
        setLoading(false);
      }
    },
    [userId]
  );

  const loadCartesARevoir = useCallback(async () => {
    try {
      const { cartes: data } = await api.getDueCards(userId);
      setCartesARevoir(data as CarteData[]);
    } catch {}
  }, [userId]);

  useEffect(() => {
    loadCartes();
    loadCartesARevoir();
  }, [loadCartes, loadCartesARevoir]);

  const reviewCard = useCallback(
    async (carteId: string, niveauFacilite: 0 | 1 | 2) => {
      await api.reviewCard(carteId, niveauFacilite);
      setCartesARevoir((prev) => prev.filter((c) => c.id !== carteId));
    },
    []
  );

  const addCard = useCallback(
    async (data: {
      motEn: string;
      traductionFr: string;
      exemple?: string;
      categorie?: string;
    }) => {
      const { carte } = await api.addCard({ userId, ...data });
      setCartes((prev) => [...prev, carte as CarteData]);
    },
    [userId]
  );

  const deleteCard = useCallback(async (id: string) => {
    await api.deleteCard(id);
    setCartes((prev) => prev.filter((c) => c.id !== id));
    setCartesARevoir((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return {
    cartes,
    cartesARevoir,
    loading,
    error,
    loadCartes,
    loadCartesARevoir,
    reviewCard,
    addCard,
    deleteCard,
  };
}
