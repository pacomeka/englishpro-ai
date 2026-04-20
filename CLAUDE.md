# CLAUDE.md — EnglishPro AI

> Ce fichier est lu automatiquement par Claude Code à chaque session.
> Il contient toutes les instructions nécessaires pour construire l'application EnglishPro AI.

---

## MISSION

Tu es le développeur principal de **EnglishPro AI**, une application web d'apprentissage de l'anglais assistée par IA, destinée aux apprenants francophones débutants-intermédiaires (niveau scolaire). L'objectif est d'emmener l'utilisateur au niveau B2+ en 6 mois, avec 30 minutes de pratique chaque soir.

---

## STACK TECHNIQUE

```
Frontend  : React 18 + TypeScript + TailwindCSS
Backend   : Node.js + Express + Prisma ORM
Base de données : PostgreSQL
IA        : API Anthropic Claude Sonnet (claude-sonnet-4-20250514)
Audio     : Web Speech API (TTS) + Whisper API (reconnaissance vocale)
Auth      : Clerk (OAuth Google + email)
Hébergement : Vercel (frontend) + Railway (backend)
```

### Variables d'environnement requises (.env)
```
ANTHROPIC_API_KEY=sk-ant-...
DATABASE_URL=postgresql://...
CLERK_SECRET_KEY=...
CLERK_PUBLISHABLE_KEY=...
```

---

## STRUCTURE DU PROJET

```
englishpro-ai/
├── CLAUDE.md                  ← ce fichier
├── frontend/
│   ├── src/
│   │   ├── components/        ← composants UI réutilisables
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx      ← tableau de bord principal
│   │   │   ├── Session.tsx        ← session du soir interactive
│   │   │   ├── Cards.tsx          ← cartes Anki (répétition espacée)
│   │   │   ├── Programme.tsx      ← timeline des 6 phases
│   │   │   ├── Conversation.tsx   ← chat libre en anglais avec Claude
│   │   │   └── Stats.tsx          ← statistiques et progression
│   │   ├── hooks/
│   │   │   ├── useSession.ts
│   │   │   ├── useAnki.ts
│   │   │   └── useProgress.ts
│   │   └── lib/
│   │       ├── api.ts             ← appels vers le backend
│   │       └── prompts.ts         ← prompts Claude centralisés
│   └── package.json
├── backend/
│   ├── routes/
│   │   ├── sessions.ts
│   │   ├── cards.ts
│   │   ├── progress.ts
│   │   └── auth.ts
│   ├── services/
│   │   ├── claude.service.ts      ← toute la logique API Anthropic
│   │   └── anki.service.ts        ← algorithme SM-2
│   ├── prisma/
│   │   └── schema.prisma
│   └── package.json
└── shared/
    └── types.ts                   ← types TypeScript partagés
```

---

## MODÈLE DE DONNÉES (Prisma)

```prisma
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  nom            String
  niveauInitial  String   @default("A2")
  niveauActuel   String   @default("A2")
  dateInscription DateTime @default(now())
  sessions       Session[]
  cartes         Carte[]
  progression    Progression[]
}

model Session {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  date        DateTime @default(now())
  dureeMin    Int
  score       Int
  phase       Int
  activites   Json
}

model Carte {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  motEn           String
  traductionFr    String
  exemple         String
  niveauFacilite  Int      @default(2)
  intervalle      Int      @default(1)
  prochainRevision DateTime @default(now())
  repetitions     Int      @default(0)
}

model Progression {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  semaine     Int
  moisAnnee   String
  motsAppris  Int      @default(0)
  scoreMoyen  Int      @default(0)
  streakJours Int      @default(0)
  tempsTotal  Int      @default(0)
}
```

---

## PROGRAMME PÉDAGOGIQUE — 6 PHASES

### Phase 1 — Fondations (Semaines 1–3)
- **Vocabulaire** : Anki intégré, 10 nouveaux mots/jour, top 1000 mots fréquents
- **Écoute** : BBC 6 Minute English, 2 écoutes par épisode
- **Grammaire** : Présent simple, present continuous, past simple
- **Durée session** : 30 min (3 × 10 min)

### Phase 2 — Expression orale (Semaines 4–6)
- **Expression** : Monologue guidé de 2 minutes sur un sujet proposé
- **Prononciation** : Shadowing (imitation d'un natif phrase par phrase)
- **Interaction** : Premiers messages sur HelloTalk + conversation avec Claude
- **Durée session** : 35 min

### Phase 3 — Compréhension (Semaines 7–9)
- **Immersion** : Séries Netflix en VO sous-titres anglais
- **Dictée audio** : 30 sec d'écoute → retranscription → correction
- **Conversation** : 10 messages échangés avec un natif par soir
- **Durée session** : 40 min

### Phase 4 — Fluidité (Semaines 10–14)
- **Oral avancé** : Appel audio avec partenaire HelloTalk (20 min)
- **Écriture** : Journal quotidien 5–8 phrases sans traducteur
- **Écoute** : VOA Learning English ou TED Talks Easy
- **Durée session** : 40 min

### Phase 5 — Maîtrise (Semaines 15–20)
- **Débat** : Discussion sur sujet d'actualité avec partenaire ou Claude
- **Lecture** : Articles BBC News, blogs en anglais
- **Correction active** : Relecture des anciens journaux, correction des erreurs
- **Durée session** : 45 min

### Phase 6 — Certification (Semaine 24)
- Préparation TOEIC / IELTS
- Test EF SET gratuit en ligne
- Bilan final avec Claude
- **Objectif** : B2+ (TOEIC 785+, IELTS 6.5+)

---

## FONCTIONNALITÉS DÉTAILLÉES

### 1. Session du soir (priorité MVP)
- Minuteur global (30–45 min selon la phase)
- 3 blocs d'activité avec minuteur individuel de 10 min
- Exercices générés dynamiquement via API Claude
- Correction instantanée avec explication pédagogique en français
- Score de session (0–100) affiché en fin de session
- Sauvegarde automatique en base de données

### 2. Système Anki intégré (priorité MVP)
- Algorithme SM-2 de répétition espacée
- Base de 3 000 mots pré-chargés par niveaux A1→B2
- Ajout manuel de mots avec génération d'exemple via Claude
- Filtres par catégorie (Actions, Personnes, Temps, Lieu, etc.)
- Export CSV compatible Anki desktop

### 3. Tableau de bord (priorité MVP)
- Phase actuelle + semaine en cours
- Streak de jours consécutifs avec alerte si risque de rupture
- Prochain rappel de session
- Graphique de progression hebdomadaire
- 4 métriques : jours streak, mots appris, score moyen, heures totales

### 4. Conversation libre avec Claude
- Chat en anglais avec Claude jouant un natif bienveillant
- Corrections post-échange (pas pendant) pour ne pas briser le flux
- Sujets suggérés selon la phase et les centres d'intérêt
- Historique des conversations sauvegardé

### 5. Statistiques
- Graphiques : mots appris par semaine, score moyen, temps étudié
- Prédiction de niveau : date estimée de passage au niveau suivant
- Top 5 des points faibles grammaticaux
- Rapport mensuel PDF envoyé par email

---

## PROMPTS CLAUDE — À UTILISER EXACTEMENT

### generate_exercise (POST /api/exercises/generate)
```
Tu es un professeur d'anglais expert pour apprenants francophones.
Génère 5 exercices JSON pour un apprenant de niveau {niveau} en Phase {phase}.

Chaque exercice doit avoir ce format JSON exact :
{
  "id": "ex_1",
  "type": "traduction" | "conjugaison" | "choix_multiple" | "phrase_libre",
  "question": "...",
  "reponse_correcte": "...",
  "indice": "...",
  "explication": "Explication en français de la règle grammaticale"
}

Réponds UNIQUEMENT avec un tableau JSON valide. Aucun texte avant ou après.
```

### correct_answer (POST /api/exercises/correct)
```
Tu es un professeur d'anglais bienveillant pour francophones.
L'apprenant de niveau {niveau} a répondu : "{reponse_utilisateur}"
La bonne réponse était : "{reponse_correcte}"

Évalue la réponse et réponds en JSON :
{
  "correct": true | false,
  "score": 0-100,
  "feedback": "Explication courte et encourageante en français",
  "conseil": "Un conseil pratique pour retenir la règle"
}

Réponds UNIQUEMENT avec le JSON. Aucun texte avant ou après.
```

### conversation_coach (chat /api/conversation)
```
You are a friendly native English speaker having a casual conversation 
with a French learner at {niveau} level. 
- Speak naturally but not too fast
- If they make a grammar mistake, continue the conversation normally
- At the END of the conversation (when they say "stop" or "fin"), 
  provide a brief correction summary in French
- Keep responses short (2-3 sentences max)
- Topic: {sujet}
```

### generate_example (POST /api/cards/example)
```
Génère une phrase-exemple naturelle et simple pour le mot anglais "{mot}".
La phrase doit être de niveau {niveau}, facile à comprendre pour un francophone.

Réponds UNIQUEMENT avec ce JSON :
{
  "exemple": "The sentence in English.",
  "traduction": "La traduction en français."
}
```

---

## APPEL API CLAUDE — MODÈLE À UTILISER

```typescript
// backend/services/claude.service.ts
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function callClaude(prompt: string, maxTokens = 1000) {
  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: maxTokens,
    messages: [{ role: "user", content: prompt }],
  });
  return response.content[0].type === "text" ? response.content[0].text : "";
}

export async function generateExercises(niveau: string, phase: number) {
  const prompt = `[utilise le prompt generate_exercise avec niveau=${niveau} et phase=${phase}]`;
  const raw = await callClaude(prompt);
  return JSON.parse(raw);
}

export async function correctAnswer(reponseUtilisateur: string, reponseCorrecte: string, niveau: string) {
  const prompt = `[utilise le prompt correct_answer]`;
  const raw = await callClaude(prompt);
  return JSON.parse(raw);
}
```

---

## ALGORITHME SM-2 (Répétition espacée)

```typescript
// backend/services/anki.service.ts
export function calculerProchainRevision(
  niveauFacilite: number,  // 0=difficile, 1=correct, 2=facile
  intervalle: number,
  repetitions: number
): { nouvelIntervalle: number; nouvelleDate: Date } {
  let nouvelIntervalle: number;

  if (niveauFacilite === 0) {
    nouvelIntervalle = 1;
  } else if (repetitions === 0) {
    nouvelIntervalle = 1;
  } else if (repetitions === 1) {
    nouvelIntervalle = 6;
  } else {
    nouvelIntervalle = Math.round(intervalle * 2.5);
  }

  const nouvelleDate = new Date();
  nouvelleDate.setDate(nouvelleDate.getDate() + nouvelIntervalle);

  return { nouvelIntervalle, nouvelleDate };
}
```

---

## PLAN DE DÉVELOPPEMENT — ORDRE D'EXÉCUTION

### v0.1 — MVP (à construire en premier)
- [ ] Initialiser frontend React + TypeScript + TailwindCSS
- [ ] Initialiser backend Node.js + Express + Prisma
- [ ] Configurer PostgreSQL et les migrations
- [ ] Page Session du soir (minuteur + exercices + correction)
- [ ] Endpoint POST /api/exercises/generate (appel Claude)
- [ ] Endpoint POST /api/exercises/correct (appel Claude)
- [ ] Page Mes cartes Anki (affichage + révision)
- [ ] Tableau de bord minimal (streak + phase)

### v0.2 — Programme complet
- [ ] Page Programme avec timeline des 6 phases
- [ ] Logique de passage de phase automatique
- [ ] Statistiques hebdomadaires
- [ ] Système de badges et gamification

### v0.3 — Module vocal
- [ ] Intégration Web Speech API (TTS)
- [ ] Shadowing avec score de prononciation
- [ ] Conversation vocale avec Claude

### v0.4 — Finitions
- [ ] Mode sombre
- [ ] PWA (Progressive Web App) pour mobile
- [ ] Rapport mensuel PDF
- [ ] Déploiement Vercel + Railway

---

## RÈGLES DE DÉVELOPPEMENT

1. **TypeScript strict** — pas de `any`, types explicites partout
2. **Composants React fonctionnels** — hooks uniquement, pas de classes
3. **Gestion d'erreurs** — try/catch sur tous les appels Claude API
4. **Feedback immédiat** — spinner pendant les appels API, jamais d'écran blanc
5. **Mobile first** — chaque composant doit être responsive dès le départ
6. **Français dans l'UI** — toute l'interface est en français, les exercices en anglais
7. **JSON structuré** — tous les échanges avec Claude retournent du JSON parseable
8. **Pas de lorem ipsum** — utiliser des vraies données de démonstration anglais/français

---

## COMMANDES DE DÉMARRAGE

```bash
# Installation
cd frontend && npm install
cd ../backend && npm install

# Base de données
cd backend && npx prisma migrate dev

# Développement
cd frontend && npm run dev        # http://localhost:3000
cd backend && npm run dev         # http://localhost:4000

# Build production
cd frontend && npm run build
cd backend && npm run build
```

---

## CONTEXTE UTILISATEUR CIBLE

- **Localisation** : Abidjan, Côte d'Ivoire (et Afrique francophone)
- **Niveau de départ** : Bases scolaires (A2)
- **Objectif** : B2+ en 6 mois
- **Moment d'utilisation** : Le soir, 30 min
- **Appareil principal** : Smartphone (donc mobile-first obligatoire)
- **Connexion** : 3G/4G (optimiser les performances réseau)
- **Langue native** : Français

---

*Fichier généré avec Claude (Anthropic) — Avril 2026*
*Projet : EnglishPro AI — Cahier des charges v1.0*
