import { Router, Request, Response } from "express";
import {
  generateExercises,
  correctAnswer,
} from "../services/claude.service";

const router = Router();

router.post("/generate", async (req: Request, res: Response) => {
  try {
    const { niveau = "A2", phase = 1 } = req.body;
    const exercises = await generateExercises(niveau, phase);
    res.json({ exercises });
  } catch (err) {
    console.error("Error generating exercises:", err);
    res.status(500).json({ error: "Impossible de générer les exercices" });
  }
});

router.post("/correct", async (req: Request, res: Response) => {
  try {
    const { reponseUtilisateur, reponseCorrecte, niveau = "A2" } = req.body;
    if (!reponseUtilisateur || !reponseCorrecte) {
      res.status(400).json({ error: "Données manquantes" });
      return;
    }
    const correction = await correctAnswer(
      reponseUtilisateur,
      reponseCorrecte,
      niveau
    );
    res.json(correction);
  } catch (err) {
    console.error("Error correcting answer:", err);
    res.status(500).json({ error: "Impossible de corriger la réponse" });
  }
});

export default router;
