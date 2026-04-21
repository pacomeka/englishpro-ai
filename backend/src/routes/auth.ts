import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const router = Router();
const prisma = new PrismaClient();

// Création ou récupération d'utilisateur (appelé après auth Clerk)
router.post("/sync", async (req: Request, res: Response) => {
  try {
    const { email, nom, niveauInitial = "A2" } = req.body;
    if (!email || !nom) {
      res.status(400).json({ error: "email et nom requis" });
      return;
    }

    const user = await prisma.user.upsert({
      where: { email },
      update: { nom },
      create: { email, nom, niveauInitial, niveauActuel: niveauInitial },
    });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/me", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ error: "Utilisateur introuvable" });
      return;
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
