import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

import exercisesRouter from "./routes/exercises";
import sessionsRouter from "./routes/sessions";
import cardsRouter from "./routes/cards";
import progressRouter from "./routes/progress";
import conversationRouter from "./routes/conversation";
import authRouter from "./routes/auth";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.use("/api/exercises", exercisesRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/cards", cardsRouter);
app.use("/api/progress", progressRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/auth", authRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({ error: "Erreur interne du serveur" });
  }
);

app.listen(PORT, () => {
  console.log(`🚀 Backend EnglishPro AI démarré sur http://localhost:${PORT}`);
});

export default app;
