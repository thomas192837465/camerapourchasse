"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getThread,
  subscribeToThreadMessages,
  markThreadRead,
  replyToThread,
} from "@/lib/supportThreads";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

// Les messages reçus sont un contenu externe non fiable (n'importe qui peut écrire un e-mail) : on
// n'affiche jamais leur HTML brut (risque d'injection), seulement le texte, toujours échappé par
// React — jamais de dangerouslySetInnerHTML ici.
function messageBodyText(m) {
  if (m.text) return m.text;
  if (m.html) return m.html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return "(message vide)";
}

export default function AdminMessageThreadPage() {
  const { id } = useParams();
  const threadId = decodeURIComponent(id);
  const router = useRouter();
  const [thread, setThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    getThread(threadId).then(setThread);
    markThreadRead(threadId);
    return subscribeToThreadMessages(threadId, setMessages);
  }, [threadId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function handleReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setSending(true);
    setError("");
    try {
      const html = reply
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");
      await replyToThread(threadId, { html, text: reply });
      setReply("");
    } catch (err) {
      setError(err.message || "Échec de l'envoi.");
    } finally {
      setSending(false);
    }
  }

  if (!thread) return <p>Chargement…</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>{thread.customerName}</h1>
          <p>{thread.customerEmail}</p>
        </div>
        <button className="btn btn-outline" onClick={() => router.push("/admin/messages")}>
          ← Retour
        </button>
      </div>

      <div className="admin-card">
        <div style={{ display: "flex", flexDirection: "column", gap: 16, maxHeight: "55vh", overflowY: "auto" }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                alignSelf: m.direction === "outbound" ? "flex-end" : "flex-start",
                maxWidth: "75%",
                background: m.direction === "outbound" ? "var(--green-50)" : "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "10px 14px",
              }}
            >
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{messageBodyText(m)}</p>
              <p className="form-hint" style={{ marginTop: 6, marginBottom: 0, textAlign: "right" }}>
                {m.direction === "outbound" ? "Vous" : thread.customerName} · {formatDate(m.createdAt)}
              </p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Répondre</h2>
        <form onSubmit={handleReply}>
          <textarea
            rows={5}
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Votre réponse — le client la recevra par e-mail, dans le même fil que son message."
            style={{ width: "100%", resize: "vertical" }}
          />
          {error ? (
            <p className="form-hint" style={{ color: "var(--gold)" }}>
              {error}
            </p>
          ) : null}
          <button className="btn btn-primary" type="submit" disabled={sending} style={{ marginTop: 10 }}>
            {sending ? "Envoi…" : "Envoyer la réponse"}
          </button>
        </form>
      </div>
    </>
  );
}
