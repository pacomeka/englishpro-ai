import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }
    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      take: 10,
    });
    res.json({ sessions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, dureeMin, score, phase, activites } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId requis" });
      return;
    }
    const session = await prisma.session.create({
      data: {
        userId,
        dureeMin: dureeMin || 30,
        score: score || 0,
        phase: phase || 1,
        activites: activites || [],
      },
    });

    // Mettre à jour la progression
    const now = new Date();
    const moisAnnee = `${now.getMonth() + 1}-${now.getFullYear()}`;
    const semaine = getWeekNumber(now);

    const existing = await prisma.progression.findFirst({
      where: { userId, semaine, moisAnnee },
    });

    if (existing) {
      await prisma.progression.update({
        where: { id: existing.id },
        data: {
          scoreMoyen: Math.round((existing.scoreMoyen + score) / 2),
          tempsTotal: existing.tempsTotal + (dureeMin || 30),
        },
      });
    } else {
      await prisma.progression.create({
        data: {
          userId,
          semaine,
          moisAnnee,
          scoreMoyen: score || 0,
          tempsTotal: dureeMin || 30,
        },
      });
    }

    res.json({ session });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/streak", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const sessions = await prisma.session.findMany({
      where: { userId },
      orderBy: { date: "desc" },
      select: { date: true },
    });

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sessionDates = [
      ...new Set(
        sessions.map((s) => {
          const d = new Date(s.date);
          d.setHours(0, 0, 0, 0);
          return d.getTime();
        })
      ),
    ].sort((a, b) => b - a);

    for (let i = 0; i < sessionDates.length; i++) {
      const expected = today.getTime() - i * 86400000;
      if (sessionDates[i] === expected) {
        streak++;
      } else {
        break;
      }
    }

    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

function getWeekNumber(date: Date): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
  const week1 = new Date(d.getFullYear(), 0, 4);
  return (
    1 +
    Math.round(
      ((d.getTime() - week1.getTime()) / 86400000 -
        3 +
        ((week1.getDay() + 6) % 7)) /
        7
    )
  );
}

export default router;
