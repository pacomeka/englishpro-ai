import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../lib/api";

export interface ExerciseData {
  id: string;
  type: string;
  question: string;
  reponse_correcte: string;
  indice: string;
  explication: string;
  options?: string[];
}

export interface SessionState {
  exercises: ExerciseData[];
  currentIndex: number;
  answers: Record<string, { reponse: string; correct: boolean; score: number; feedback: string }>;
  sessionScore: number;
  loading: boolean;
  correcting: boolean;
  error: string | null;
  completed: boolean;
  timerSeconds: number;
  timerActive: boolean;
}

export function useSession(niveau: string, phase: number) {
  const [state, setState] = useState<SessionState>({
    exercises: [],
    currentIndex: 0,
    answers: {},
    sessionScore: 0,
    loading: false,
    correcting: false,
    error: null,
    completed: false,
    timerSeconds: 0,
    timerActive: false,
  });

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadExercises = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const { exercises } = await api.generateExercises(niveau, phase);
      setState((s) => ({
        ...s,
        exercises: exercises as ExerciseData[],
        loading: false,
        currentIndex: 0,
        answers: {},
        sessionScore: 0,
        completed: false,
        timerSeconds: 0,
        timerActive: true,
      }));
    } catch (err) {
      setState((s) => ({
        ...s,
        loading: false,
        error: err instanceof Error ? err.message : "Erreur de chargement",
      }));
    }
  }, [niveau, phase]);

  useEffect(() => {
    if (state.timerActive) {
      timerRef.current = setInterval(() => {
        setState((s) => ({ ...s, timerSeconds: s.timerSeconds + 1 }));
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.timerActive]);

  const submitAnswer = useCallback(
    async (reponse: string) => {
      const exercise = state.exercises[state.currentIndex];
      if (!exercise) return;

      setState((s) => ({ ...s, correcting: true }));
      try {
        const correction = await api.correctAnswer(
          reponse,
          exercise.reponse_correcte,
          niveau
        );

        setState((s) => {
          const newAnswers = {
            ...s.answers,
            [exercise.id]: {
              reponse,
              correct: correction.correct,
              score: correction.score,
              feedback: correction.feedback,
            },
          };
          const scores = Object.values(newAnswers).map((a) => a.score);
          const avgScore = Math.round(
            scores.reduce((a, b) => a + b, 0) / scores.length
          );

          return {
            ...s,
            correcting: false,
            answers: newAnswers,
            sessionScore: avgScore,
          };
        });

        return correction;
      } catch {
        setState((s) => ({ ...s, correcting: false }));
        return null;
      }
    },
    [state.exercises, state.currentIndex, niveau]
  );

  const nextExercise = useCallback(() => {
    setState((s) => {
      const next = s.currentIndex + 1;
      if (next >= s.exercises.length) {
        return { ...s, completed: true, timerActive: false };
      }
      return { ...s, currentIndex: next };
    });
  }, []);

  const reset = useCallback(() => {
    setState({
      exercises: [],
      currentIndex: 0,
      answers: {},
      sessionScore: 0,
      loading: false,
      correcting: false,
      error: null,
      completed: false,
      timerSeconds: 0,
      timerActive: false,
    });
  }, []);

  return { state, loadExercises, submitAnswer, nextExercise, reset };
}
