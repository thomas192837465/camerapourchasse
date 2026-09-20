"use client";

import { useEffect, useState } from "react";
import { getAllSubscribers } from "@/lib/subscribers";
import { getAllBroadcasts } from "@/lib/broadcasts";
import { useAuth } from "@/lib/auth";
import ContentBlocksEditor from "@/components/admin/ContentBlocksEditor";

const SOURCE_LABELS = {
  footer: "Pied de page",
  blog: "Blog",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

function formatDateTime(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminSubscribersPage() {
  const { user } = useAuth();
  const [subscribers, setSubscribers] = useState([]);
  const [ready, setReady] = useState(false);
  const [subject, setSubject] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [broadcasts, setBroadcasts] = useState([]);
  const [broadcastsReady, setBroadcastsReady] = useState(false);

  useEffect(() => {
    getAllSubscribers().then((list) => {
      setSubscribers(list);
      setReady(true);
    });
    loadBroadcasts();
  }, []);

  function loadBroadcasts() {
    getAllBroadcasts().then((list) => {
      setBroadcasts(list);
      setBroadcastsReady(true);
    });
  }

  async function handleSend(e) {
    e.preventDefault();
    setError("");
    setResult(null);

    if (!window.confirm(`Envoyer ce message à ${subscribers.length} inscrit(s) ? Cette action est irréversible.`)) {
      return;
    }

    setSending(true);
    try {
      const idToken = await user.getIdToken();
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken, subject, blocks }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Échec de l'envoi.");
      setResult(data);
      setSubject("");
      setBlocks([]);
      loadBroadcasts();
    } catch (err) {
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setSending(false);
    }
  }

  function exportCsv() {
    const rows = [["E-mail", "Source", "Date d'inscription"], ...subscribers.map((s) => [s.email, SOURCE_LABELS[s.source] || s.source, formatDate(s.createdAt)])];
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inscrits-newsletter.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Inscrits newsletter</h1>
          <p>{ready ? `${subscribers.length} inscrit(s)` : "Chargement…"} — opt-in explicite uniquement (formulaires du pied de page et du blog).</p>
        </div>
        {subscribers.length ? (
          <button className="btn btn-outline" onClick={exportCsv}>
            Exporter en CSV
          </button>
        ) : null}
      </div>

      <div className="admin-card">
        <h2>Envoyer un message à toute la liste</h2>
        <p className="form-hint" style={{ marginBottom: 14 }}>
          Envoyé individuellement à chacun des {subscribers.length} inscrit(s) via Resend, automatiquement habillé
          aux couleurs et au logo du site (réglages "Thème" et "Contenu"). Un lien de désinscription est ajouté
          automatiquement en bas de chaque e-mail.
        </p>
        <form onSubmit={handleSend}>
          <div className="form-field">
            <label>Sujet</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} required />
          </div>
          <div style={{ marginTop: 14 }}>
            <ContentBlocksEditor blocks={blocks} onChange={setBlocks} />
          </div>
          {error ? <div className="banner error" style={{ marginTop: 12 }}>{error}</div> : null}
          {result ? (
            <div className="banner" style={{ marginTop: 12 }}>
              Envoyé à {result.sent} / {result.total} inscrit(s).
            </div>
          ) : null}
          <button
            type="submit"
            className="btn btn-primary"
            style={{ marginTop: 12 }}
            disabled={sending || !subscribers.length}
          >
            {sending ? "Envoi en cours…" : `Envoyer à ${subscribers.length} inscrit(s)`}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Historique des envois</h2>
        <p className="form-hint" style={{ marginBottom: 14 }}>
          Taux d'ouverture indicatif : de nombreux clients mails (Gmail, Outlook…) bloquent le pixel de suivi par
          défaut, donc le vrai nombre de lectures est presque toujours plus élevé que ce chiffre.
        </p>
        {broadcasts.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sujet</th>
                <th>Envoyé le</th>
                <th>Destinataires</th>
                <th>Ouvertures</th>
              </tr>
            </thead>
            <tbody>
              {broadcasts.map((b) => (
                <tr key={b.id}>
                  <td>{b.subject}</td>
                  <td>{formatDateTime(b.sentAt)}</td>
                  <td>{b.total}</td>
                  <td>
                    {b.opened} / {b.total} {b.total ? `(${Math.round((b.opened / b.total) * 100)}%)` : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>{broadcastsReady ? "Aucun envoi pour le moment." : "Chargement…"}</p>
        )}
      </div>

      <div className="admin-card">
        {subscribers.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th>Source</th>
                <th>Inscrit le</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{SOURCE_LABELS[s.source] || s.source}</td>
                  <td>{formatDate(s.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>{ready ? "Aucun inscrit pour le moment." : "Chargement…"}</p>
        )}
      </div>
    </>
  );
}
