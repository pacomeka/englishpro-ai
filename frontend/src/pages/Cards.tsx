import { useState, useCallback } from "react";
import {
  Plus,
  Search,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Trash2,
  BookOpen,
  Zap,
  X,
} from "lucide-react";
import { useAnki, CarteData } from "../hooks/useAnki";
import { useUser } from "../context/UserContext";
import { CATEGORIES_CARTES } from "../lib/prompts";
import { api } from "../lib/api";

// Carte de révision mode flip
function RevisionCard({
  carte,
  onResult,
}: {
  carte: CarteData;
  onResult: (facilite: 0 | 1 | 2) => void;
}) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-4">
      <div
        className="card min-h-48 flex flex-col items-center justify-center cursor-pointer select-none text-center"
        onClick={() => setFlipped((f) => !f)}
      >
        {!flipped ? (
          <div className="space-y-2">
            <p className="text-3xl font-bold text-gray-900">{carte.motEn}</p>
            <p className="text-gray-400 text-sm">Touchez pour voir la traduction</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-2xl font-bold text-blue-600">{carte.traductionFr}</p>
            <p className="text-sm text-gray-600 italic">"{carte.exemple}"</p>
          </div>
        )}
      </div>

      {flipped && (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => onResult(0)}
            className="py-3 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 font-semibold text-sm hover:bg-red-100"
          >
            😓 Difficile
          </button>
          <button
            onClick={() => onResult(1)}
            className="py-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-amber-600 font-semibold text-sm hover:bg-amber-100"
          >
            🙂 Correct
          </button>
          <button
            onClick={() => onResult(2)}
            className="py-3 rounded-xl border-2 border-green-200 bg-green-50 text-green-600 font-semibold text-sm hover:bg-green-100"
          >
            😊 Facile
          </button>
        </div>
      )}
    </div>
  );
}

// Modal ajout de carte
function AddCardModal({
  onClose,
  onAdd,
  niveau,
}: {
  onClose: () => void;
  onAdd: (data: {
    motEn: string;
    traductionFr: string;
    exemple?: string;
    categorie?: string;
  }) => Promise<void>;
  niveau: string;
}) {
  const [motEn, setMotEn] = useState("");
  const [traductionFr, setTraductionFr] = useState("");
  const [exemple, setExemple] = useState("");
  const [categorie, setCategorie] = useState("Divers");
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateExample = async () => {
    if (!motEn.trim()) return;
    setGenerating(true);
    try {
      const { exemple: ex } = await api.generateExample(motEn, niveau);
      setExemple(ex);
    } catch {}
    setGenerating(false);
  };

  const handleSubmit = async () => {
    if (!motEn.trim() || !traductionFr.trim()) return;
    setLoading(true);
    try {
      await onAdd({ motEn, traductionFr, exemple, categorie });
      onClose();
    } catch {}
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end md:items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900">Nouvelle carte</h3>
          <button onClick={onClose}>
            <X className="text-gray-500" size={20} />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot en anglais *
            </label>
            <input
              type="text"
              value={motEn}
              onChange={(e) => setMotEn(e.target.value)}
              placeholder="e.g. opportunity"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Traduction en français *
            </label>
            <input
              type="text"
              value={traductionFr}
              onChange={(e) => setTraductionFr(e.target.value)}
              placeholder="e.g. opportunité"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Exemple
              </label>
              <button
                onClick={generateExample}
                disabled={!motEn.trim() || generating}
                className="text-xs text-blue-600 font-medium flex items-center gap-1 disabled:opacity-50"
              >
                <Zap size={12} />
                {generating ? "Génération..." : "Générer par IA"}
              </button>
            </div>
            <input
              type="text"
              value={exemple}
              onChange={(e) => setExemple(e.target.value)}
              placeholder="This is a great opportunity."
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Catégorie
            </label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            >
              {CATEGORIES_CARTES.filter((c) => c !== "Tous").map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!motEn.trim() || !traductionFr.trim() || loading}
          className="btn-primary w-full"
        >
          {loading ? "Ajout en cours..." : "Ajouter la carte"}
        </button>
      </div>
    </div>
  );
}

export default function Cards() {
  const { userId, niveau } = useUser();
  const { cartes, cartesARevoir, loading, reviewCard, addCard, deleteCard, loadCartes } =
    useAnki(userId);
  const [mode, setMode] = useState<"browse" | "review">("browse");
  const [revisionIndex, setRevisionIndex] = useState(0);
  const [revisionDone, setRevisionDone] = useState(false);
  const [search, setSearch] = useState("");
  const [categorie, setCategorie] = useState("Tous");
  const [showAddModal, setShowAddModal] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleResult = useCallback(
    async (facilite: 0 | 1 | 2) => {
      const carte = cartesARevoir[revisionIndex];
      if (!carte) return;
      await reviewCard(carte.id, facilite);
      if (revisionIndex >= cartesARevoir.length - 1) {
        setRevisionDone(true);
      } else {
        setRevisionIndex((i) => i + 1);
      }
    },
    [cartesARevoir, revisionIndex, reviewCard]
  );

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const result = await api.seedCards(userId, niveau);
      await loadCartes();
      alert(`${result.added} nouveaux mots ajoutés !`);
    } catch {}
    setSeeding(false);
  };

  const filtered = cartes.filter((c) => {
    const matchSearch =
      !search ||
      c.motEn.toLowerCase().includes(search.toLowerCase()) ||
      c.traductionFr.toLowerCase().includes(search.toLowerCase());
    const matchCat = categorie === "Tous" || c.categorie === categorie;
    return matchSearch && matchCat;
  });

  // Mode révision
  if (mode === "review") {
    if (cartesARevoir.length === 0 || revisionDone) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Révision Anki</h2>
          <div className="card text-center space-y-4 py-8">
            <div className="text-5xl">🎉</div>
            <p className="text-xl font-bold text-gray-800">
              {revisionDone
                ? "Révision terminée !"
                : "Aucune carte à réviser pour l'instant."}
            </p>
            <p className="text-gray-500 text-sm">
              Revenez plus tard selon votre calendrier SM-2.
            </p>
            <button
              onClick={() => {
                setMode("browse");
                setRevisionIndex(0);
                setRevisionDone(false);
              }}
              className="btn-secondary mx-auto w-fit"
            >
              Retour aux cartes
            </button>
          </div>
        </div>
      );
    }

    const carte = cartesARevoir[revisionIndex];
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Révision</h2>
          <span className="text-sm text-gray-500">
            {revisionIndex + 1}/{cartesARevoir.length}
          </span>
        </div>

        <div className="w-full bg-gray-100 rounded-full h-2">
          <div
            className="bg-blue-600 rounded-full h-2 transition-all"
            style={{
              width: `${((revisionIndex) / cartesARevoir.length) * 100}%`,
            }}
          />
        </div>

        <RevisionCard carte={carte} onResult={handleResult} />

        <button
          onClick={() => setMode("browse")}
          className="btn-secondary w-full text-sm"
        >
          Arrêter la révision
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mes cartes</h2>
          <p className="text-gray-500 text-sm mt-0.5">
            {cartes.length} cartes · {cartesARevoir.length} à revoir
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white p-2.5 rounded-xl"
        >
          <Plus size={20} />
        </button>
      </div>

      {/* Bouton révision */}
      {cartesARevoir.length > 0 && (
        <button
          onClick={() => {
            setRevisionIndex(0);
            setRevisionDone(false);
            setMode("review");
          }}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <RotateCcw size={18} />
          Réviser {cartesARevoir.length} carte
          {cartesARevoir.length > 1 ? "s" : ""}
        </button>
      )}

      {/* Seed */}
      <button
        onClick={handleSeed}
        disabled={seeding}
        className="w-full btn-secondary flex items-center justify-center gap-2 text-sm"
      >
        <BookOpen size={16} />
        {seeding ? "Chargement..." : "Charger le vocabulaire de base"}
      </button>

      {/* Filtres */}
      <div className="space-y-2">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un mot..."
            className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-400 text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES_CARTES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategorie(cat)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                categorie === cat
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des cartes */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card text-center py-8 text-gray-500">
          <BookOpen className="mx-auto mb-2 text-gray-300" size={40} />
          <p>Aucune carte trouvée.</p>
          <p className="text-sm mt-1">
            Ajoutez des mots ou chargez le vocabulaire de base.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((carte) => (
            <CarteItem
              key={carte.id}
              carte={carte}
              onDelete={deleteCard}
            />
          ))}
        </div>
      )}

      {showAddModal && (
        <AddCardModal
          onClose={() => setShowAddModal(false)}
          onAdd={addCard}
          niveau={niveau}
        />
      )}
    </div>
  );
}

function CarteItem({
  carte,
  onDelete,
}: {
  carte: CarteData;
  onDelete: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const isDue = new Date(carte.prochainRevision) <= new Date();

  return (
    <div className={`card border ${isDue ? "border-amber-200" : "border-gray-100"}`}>
      <div
        className="flex items-center gap-3 cursor-pointer"
        onClick={() => setExpanded((e) => !e)}
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900">{carte.motEn}</span>
            {isDue && (
              <span className="badge bg-amber-50 text-amber-600">
                À réviser
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 truncate">{carte.traductionFr}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-gray-400 badge bg-gray-50">
            {carte.categorie}
          </span>
          {expanded ? (
            <ChevronUp size={16} className="text-gray-400" />
          ) : (
            <ChevronDown size={16} className="text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
          {carte.exemple && (
            <p className="text-sm text-gray-600 italic">"{carte.exemple}"</p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Répétitions : {carte.repetitions}</span>
            <span>
              Prochain :{" "}
              {new Date(carte.prochainRevision).toLocaleDateString("fr-FR")}
            </span>
          </div>
          <button
            onClick={() => onDelete(carte.id)}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600"
          >
            <Trash2 size={13} />
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
