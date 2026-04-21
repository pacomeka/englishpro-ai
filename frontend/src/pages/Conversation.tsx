import { useState, useRef, useEffect } from "react";
import { Send, RefreshCw, Square, Shuffle } from "lucide-react";
import { api } from "../lib/api";
import { useUser } from "../context/UserContext";
import { SUJETS_PAR_PHASE } from "../lib/prompts";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export default function Conversation() {
  const { userId, niveau, phase } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sujet, setSujet] = useState(() => {
    const sujets = SUJETS_PAR_PHASE[phase] ?? SUJETS_PAR_PHASE[1];
    return sujets[0];
  });
  const [started, setStarted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const sujetsDisponibles = SUJETS_PAR_PHASE[phase] ?? SUJETS_PAR_PHASE[1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startConversation = () => {
    const welcome: Message = {
      role: "assistant",
      content: `Hi! Let's talk about **${sujet}**. How are you today? What can you tell me about this topic?`,
      timestamp: new Date().toISOString(),
    };
    setMessages([welcome]);
    setStarted(true);
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMsg: Message = {
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    const isEnd =
      input.trim().toLowerCase() === "stop" ||
      input.trim().toLowerCase() === "fin";

    try {
      const { message } = await api.sendMessage(
        newMessages.map((m) => ({ role: m.role, content: m.content })),
        niveau,
        sujet,
        userId
      );

      const assistantMsg: Message = {
        role: "assistant",
        content: message,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      if (isEnd) {
        // Auto-save après fin de conversation
        await handleSave([...newMessages, assistantMsg]);
      }
    } catch (err) {
      const errorMsg: Message = {
        role: "assistant",
        content: "Sorry, I had a problem responding. Please try again!",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
    setLoading(false);
  };

  const handleSave = async (msgs = messages) => {
    setSaving(true);
    try {
      await api.saveConversation({
        userId,
        sujet,
        messages: msgs,
        phase,
      });
      setSaved(true);
    } catch {}
    setSaving(false);
  };

  const reset = () => {
    setMessages([]);
    setStarted(false);
    setSaved(false);
    const randomSujet =
      sujetsDisponibles[Math.floor(Math.random() * sujetsDisponibles.length)];
    setSujet(randomSujet);
  };

  // Écran de démarrage
  if (!started) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Conversation libre</h2>
          <p className="text-gray-500 mt-1">Pratiquez l'anglais avec Claude</p>
        </div>

        <div className="card space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sujet de conversation
            </label>
            <div className="space-y-2">
              {sujetsDisponibles.map((s) => (
                <button
                  key={s}
                  onClick={() => setSujet(s)}
                  className={`w-full text-left px-4 py-3 rounded-xl border-2 transition-colors text-sm font-medium capitalize ${
                    sujet === s
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-blue-50 border-blue-100">
            <p className="text-sm text-blue-800">
              💬 Claude joue le rôle d'un natif bienveillant. Les corrections
              sont données à la <strong>fin</strong> de la conversation
              (dites <strong>"stop"</strong> ou <strong>"fin"</strong> pour terminer).
            </p>
          </div>

          <button
            onClick={startConversation}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Démarrer la conversation
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-gray-900 capitalize">{sujet}</h2>
          <p className="text-xs text-gray-500">Niveau {niveau} · Tapez "stop" pour terminer</p>
        </div>
        <div className="flex gap-2">
          {messages.length > 1 && !saved && (
            <button
              onClick={() => handleSave()}
              disabled={saving}
              className="text-xs text-blue-600 font-medium px-3 py-1.5 bg-blue-50 rounded-lg"
            >
              {saving ? "..." : "Sauvegarder"}
            </button>
          )}
          <button
            onClick={reset}
            className="p-2 text-gray-500 hover:text-gray-700 bg-gray-100 rounded-lg"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {saved && (
        <div className="mb-2 px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-xs text-green-700 font-medium">
          ✅ Conversation sauvegardée
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 py-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === "user"
                  ? "bg-blue-600 text-white rounded-br-md"
                  : "bg-white border border-gray-100 text-gray-800 rounded-bl-md shadow-sm"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
              <div className="flex gap-1">
                {[0, 150, 300].map((d) => (
                  <div
                    key={d}
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-3 shrink-0 border-t border-gray-100">
        <div className="flex gap-2 items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message in English..."
            rows={2}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white p-3 rounded-xl transition-colors shrink-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Entrée pour envoyer · Dites "stop" pour finir
        </p>
      </div>
    </div>
  );
}
