import { Router, Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import {
  callClaudeChat,
  buildConversationSystemPrompt,
} from "../services/claude.service";

const router = Router();
const prisma = new PrismaClient();

router.post("/message", async (req: Request, res: Response) => {
  try {
    const { messages, niveau = "A2", sujet = "daily life", userId } = req.body;
    if (!messages || !Array.isArray(messages)) {
      res.status(400).json({ error: "messages requis" });
      return;
    }

    const systemPrompt = buildConversationSystemPrompt(niveau, sujet);
    const response = await callClaudeChat(messages, systemPrompt);
    res.json({ message: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Impossible de traiter le message" });
  }
});

router.post("/save", async (req: Request, res: Response) => {
  try {
    const { userId, sujet, messages, phase = 1 } = req.body;
    if (!userId || !messages) {
      res.status(400).json({ error: "Données manquantes" });
      return;
    }

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        sujet: sujet || "Conversation libre",
        messages,
        phase,
      },
    });
    res.json({ conversation });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

router.get("/history", async (req: Request, res: Response) => {
  try {
    const { userId } = req.query;
    if (!userId || typeof userId !== "string") {
      res.status(400).json({ error: "userId requis" });
      return;
    }

    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 10,
      select: {
        id: true,
        sujet: true,
        phase: true,
        createdAt: true,
      },
    });
    res.json({ conversations });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erreur serveur" });
  }
});

export default router;
