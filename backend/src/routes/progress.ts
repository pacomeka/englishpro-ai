import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/dashboard", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessions: { orderBy: { date: "desc" }, take: 30 },
        cartes: { select: { prochainRevision: true, repetitions: true } },
        progression: { orderBy: { createdAt: "desc" }, take: 12 },
      },
    });

    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }

    // Calcul du streak
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const sessionDates = [
      ...new Set(
        user.sessions.map((s) => {
          const d = new Date(s.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    let streak = 0;
    for (let i = 0; i < sessionDates.length; i++) {
      const expected = today.getTime() - i * 86400000;
      if (sessionDates[i] === expected) streak++;
      else break;
    }

    // Nombre de mots appris (révisés au moins une fois)
    const motsAppris = user.cartes.filter((c) => c.repetitions > 0).length;

    // Score moyen
    const scores = user.sessions.map((s) => s.score).filter((s) => s > 0);
    const scoreMoyen =
      scores.length > 0
        ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
        : 0;

    // Heures totales
    const heuresTotal = Math.round(
      user.sessions.reduce((acc, s) => acc + s.dureeMin, 0) / 60
    );

    // Cartes à revoir
    const cartesARevoir = user.cartes.filter(
      (c) => new Date(c.prochainRevision) <= new Date()
    ).length;

    // Phase actuelle basée sur les semaines
    const dateInscription = new Date(user.dateInscription);
    const diffDays = Math.floor(
      (Date.now() - dateInscription.getTime()) / 86400000
    );
    const semaineActuelle = Math.min(Math.floor(diffDays / 7) + 1, 24);
    const phaseActuelle = getPhase(semaineActuelle);

    res.json({
      streakJours: streak,
      motsAppris,
      scoreMoyen,
      heuresTotal,
      phaseActuelle,
      semaineActuelle,
      niveauActuel: user.niveauActuel,
      cartesARevoir,
      prochaineSession: null,
      progressionHebdo: user.progression.slice(0, 8).reverse(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/weekly", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const progressions = await prisma.progression.findMany({
      where: { userId },
      orderBy: { semaine: "asc" },
      take: 12,
    });

    res.json({ progressions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

function getPhase(semaine: number): number {
  if (semaine <= 3) return 1;
  if (semaine <= 6) return 2;
  if (semaine <= 9) return 3;
  if (semaine <= 14) return 4;
  if (semaine <= 20) return 5;
  return 6;
}

export default router;
