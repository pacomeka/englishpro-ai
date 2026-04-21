import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(
  prompt: string,
  maxTokens = 1000
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function callClaudeChat(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string,
  maxTokens = 500
): Promise<string> {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    system: systemPrompt,
    messages,
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateExercises(niveau: string, phase: number) {
  const prompt = `Tu es un professeur d'anglais expert pour apprenants francophones.
Génère 5 exercices JSON pour un apprenant de niveau ${niveau} en Phase ${phase}.

Chaque exercice doit avoir ce format JSON exact :
{
  "id": "ex_1",
  "type": "traduction" | "conjugaison" | "choix_multiple" | "phrase_libre",
  "question": "...",
  "reponse_correcte": "...",
  "indice": "...",
  "explication": "Explication en français de la règle grammaticale",
  "options": ["option1", "option2", "option3", "option4"]
}

Pour le type "choix_multiple", inclure 4 options dont une correcte.
Pour les autres types, options peut être omis ou vide.

Réponds UNIQUEMENT avec un tableau JSON valide. Aucun texte avant ou après.`;

  const raw = await callClaude(prompt, 2000);
  return JSON.parse(raw);
}

export async function correctAnswer(
  reponseUtilisateur: string,
  reponseCorrecte: string,
  niveau: string
) {
  const prompt = `Tu es un professeur d'anglais bienveillant pour francophones.
L'apprenant de niveau ${niveau} a répondu : "${reponseUtilisateur}"
La bonne réponse était : "${reponseCorrecte}"

Évalue la réponse et réponds en JSON :
{
  "correct": true | false,
  "score": 0-100,
  "feedback": "Explication courte et encourageante en français",
  "conseil": "Un conseil pratique pour retenir la règle"
}

Réponds UNIQUEMENT avec le JSON. Aucun texte avant ou après.`;

  const raw = await callClaude(prompt, 500);
  return JSON.parse(raw);
}

export async function generateExample(mot: string, niveau: string) {
  const prompt = `Génère une phrase-exemple naturelle et simple pour le mot anglais "${mot}".
La phrase doit être de niveau ${niveau}, facile à comprendre pour un francophone.

Réponds UNIQUEMENT avec ce JSON :
{
  "exemple": "The sentence in English.",
  "traduction": "La traduction en français."
}`;

  const raw = await callClaude(prompt, 300);
  return JSON.parse(raw);
}

export function buildConversationSystemPrompt(
  niveau: string,
  sujet: string
): string {
  return `You are a friendly native English speaker having a casual conversation with a French learner at ${niveau} level.
- Speak naturally but not too fast
- If they make a grammar mistake, continue the conversation normally
- At the END of the conversation (when they say "stop" or "fin"), provide a brief correction summary in French
- Keep responses short (2-3 sentences max)
- Topic: ${sujet}`;
}
