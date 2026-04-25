-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "niveauInitial" TEXT NOT NULL DEFAULT 'A2',
    "niveauActuel" TEXT NOT NULL DEFAULT 'A2',
    "dateInscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dureeMin" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "phase" INTEGER NOT NULL,
    "activites" JSONB NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Carte" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "motEn" TEXT NOT NULL,
    "traductionFr" TEXT NOT NULL,
    "exemple" TEXT NOT NULL,
    "niveauFacilite" INTEGER NOT NULL DEFAULT 2,
    "intervalle" INTEGER NOT NULL DEFAULT 1,
    "prochainRevision" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "repetitions" INTEGER NOT NULL DEFAULT 0,
    "categorie" TEXT NOT NULL DEFAULT 'Divers',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Carte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Progression" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "semaine" INTEGER NOT NULL,
    "moisAnnee" TEXT NOT NULL,
    "motsAppris" INTEGER NOT NULL DEFAULT 0,
    "scoreMoyen" INTEGER NOT NULL DEFAULT 0,
    "streakJours" INTEGER NOT NULL DEFAULT 0,
    "tempsTotal" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Progression_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sujet" TEXT NOT NULL,
    "messages" JSONB NOT NULL,
    "phase" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Carte" ADD CONSTRAINT "Carte_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progression" ADD CONSTRAINT "Progression_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
