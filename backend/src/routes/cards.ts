import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { calculerProchainRevision, VOCABULAIRE_BASE } from "../services/anki.service";
import { generateExample } from "../services/claude.service";

const router = Router();
const prisma = new PrismaClient();

router.get("/", async (req: Request, res: Response) => {
  try {
    const { userId, categorie } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const where: { userId: string; categorie?: string } = { userId };
    if (categorie && typeof categorie === "string") {
      where.categorie = categorie;
    }

    const cartes = await prisma.carte.findMany({
      where,
      orderBy: { prochainRevision: "asc" },
    });
    res.json({ cartes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/due", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const cartes = await prisma.carte.findMany({
      where: {
        userId,
        prochainRevision: { lte: new Date() },
      },
      orderBy: { prochainRevision: "asc" },
      take: 20,
    });
    res.json({ cartes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const { userId, motEn, traductionFr, exemple, categorie } = req.body;
    if (!userId || !motEn || !traductionFr) {
      res.status(400).json({ error: "Données manquantes" });
      return;
    }

    const carte = await prisma.carte.create({
      data: {
        userId,
        motEn,
        traductionFr,
        exemple: exemple || "",
        categorie: categorie || "Divers",
      },
    });
    res.json({ carte });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/review", async (req: Request, res: Response) => {
  try {
    const { carteId, niveauFacilite } = req.body;
    if (!carteId || niveauFacilite === undefined) {
      res.status(400).json({ error: "Données manquantes" });
      return;
    }

    const carte = await prisma.carte.findUnique({ where: { id: carteId } });
    if (!carte) {
      res.status(404).json({ error: "Carte introuvable" });
      return;
    }

    const { nouvelIntervalle, nouvelleDate } = calculerProchainRevision(
      niveauFacilite,
      carte.intervalle,
      carte.repetitions
    );

    const updated = await prisma.carte.update({
      where: { id: carteId },
      data: {
        niveauFacilite,
        intervalle: nouvelIntervalle,
        prochainRevision: nouvelleDate,
        repetitions: carte.repetitions + 1,
      },
    });
    res.json({ carte: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.post("/example", async (req: Request, res: Response) => {
  try {
    const { mot, niveau = "A2" } = req.body;
    if (!mot) {
      res.status(400).json({ error: "mot requis" });
      return;
    }
    const result = await generateExample(mot, niveau);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de générer l'exemple" });
  }
});

router.post("/seed", async (req: Request, res: Response) => {
  try {
    const { userId, niveau = "A2" } = req.body;
    if (!userId) {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const niveauxOrdre = ["A1", "A2", "B1", "B2"];
    const niveauIndex = niveauxOrdre.indexOf(niveau);
    const niveauxInclus = niveauxOrdre.slice(0, niveauIndex + 1);

    const mots = VOCABULAIRE_BASE.filter((m) =>
      niveauxInclus.includes(m.niveau)
    );

    const existing = await prisma.carte.findMany({
      where: { userId },
      select: { motEn: true },
    });
    const existingWords = new Set(existing.map((c) => c.motEn));

    const nouveaux = mots.filter((m) => !existingWords.has(m.motEn));

    if (nouveaux.length > 0) {
      await prisma.carte.createMany({
        data: nouveaux.map((m) => ({
          userId,
          motEn: m.motEn,
          traductionFr: m.traductionFr,
          exemple: m.exemple,
          categorie: m.categorie,
        })),
      });
    }

    res.json({ added: nouveaux.length, total: mots.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.delete("/:id", async (req: Request, res: Response) => {
  try {
    await prisma.carte.delete({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
