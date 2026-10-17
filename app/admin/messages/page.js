"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { subscribeToThreads, sendNewMessage } from "@/lib/supportThreads";
import { getAllOrders } from "@/lib/orders";
import { useAuth } from "@/lib/auth";

function timeAgo(iso) {
  if (!iso) return "à l'instant";
  const sec = Math.floor(Math.max(0, Date.now() - new Date(iso).getTime()) / 1000);
  if (sec < 60) return "à l'instant";
  const min = Math.floor(sec / 60);
  if (min < 60) return `il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `il y a ${h} h`;
  return `il y a ${Math.floor(h / 24)} j`;
}

/** Liste des clients ayant commandé, un par adresse e-mail (la plus récente commande fixe le nom
 * affiché) — sert de carnet d'adresses pour écrire en premier à un client depuis "Nouveau message". */
function customersFromOrders(orders) {
  const byEmail = new Map();
  for (const o of orders) {
    const email = o.customer?.email?.trim().toLowerCase();
    if (!email || byEmail.has(email)) continue;
    byEmail.set(email, { email, name: o.customer?.name || email });
  }
  return Array.from(byEmail.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export default function AdminMessagesPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [ready, setReady] = useState(false);
  const [customers, setCustomers] = useState([]);

  const [showForm, setShowForm] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  useEffect(
    () =>
      subscribeToThreads((list) => {
        setThreads(list);
        setReady(true);
      }),
    []
  );

  useEffect(() => {
    getAllOrders().then((orders) => setCustomers(customersFromOrders(orders)));
  }, []);

  const unreadCount = threads.filter((t) => t.unread).length;

  async function handleSend(e) {
    e.preventDefault();
    if (!recipient || !subject.trim() || !body.trim()) return;
    setSending(true);
    setError("");
    try {
      const customer = customers.find((c) => c.email === recipient);
      const html = body
        .split("\n\n")
        .map((p) => `<p>${p.replace(/\n/g, "<br/>")}</p>`)
        .join("");
      const idToken = await user.getIdToken();
      await sendNewMessage({
        customerEmail: recipient,
        customerName: customer?.name,
        subject: subject.trim(),
        html,
        text: body,
        idToken,
      });
      router.push(`/admin/messages/${encodeURIComponent(recipient)}`);
    } catch (err) {
      setError(err.message || "Échec de l'envoi.");
      setSending(false);
    }
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Messages clients</h1>
          <p>
            {ready ? `${threads.length} conversation(s), dont ${unreadCount} non lue(s)` : "Chargement…"} — e-mails
            reçus à votre adresse de contact, en temps réel.
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm((v) => !v)}>
          {showForm ? "Annuler" : "Nouveau message"}
        </button>
      </div>

      {showForm ? (
        <div className="admin-card">
          <h2>Nouveau message</h2>
          <form onSubmit={handleSend}>
            <div className="form-grid">
              <div className="form-field">
                <label>Destinataire</label>
                <select value={recipient} onChange={(e) => setRecipient(e.target.value)} required>
                  <option value="" disabled>
                    {customers.length ? "Choisir un client ayant commandé…" : "Aucun client n'a encore commandé"}
                  </option>
                  {customers.map((c) => (
                    <option key={c.email} value={c.email}>
                      {c.name} ({c.email})
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-field">
                <label>Objet</label>
                <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Objet du message" required />
              </div>
            </div>
            <div className="form-field" style={{ marginTop: 14 }}>
              <label>Message</label>
              <textarea rows={5} value={body} onChange={(e) => setBody(e.target.value)} style={{ width: "100%", resize: "vertical" }} required />
            </div>
            {error ? (
              <p className="form-hint" style={{ color: "var(--gold)" }}>
                {error}
              </p>
            ) : null}
            <button className="btn btn-primary" type="submit" disabled={sending} style={{ marginTop: 10 }}>
              {sending ? "Envoi…" : "Envoyer"}
            </button>
          </form>
        </div>
      ) : null}

      <div className="admin-card">
        {threads.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Dernier message</th>
                <th>Quand</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {threads.map((t) => (
                <tr key={t.id} style={{ fontWeight: t.unread ? 700 : 400 }}>
                  <td>
                    {t.customerName}
                    <div className="form-hint" style={{ fontWeight: 400 }}>
                      {t.customerEmail}
                    </div>
                  </td>
                  <td>
                    {t.lastDirection === "outbound" ? "Vous : " : ""}
                    {t.lastMessagePreview}
                  </td>
                  <td>{timeAgo(t.lastMessageAt)}</td>
                  <td>
                    <Link href={`/admin/messages/${encodeURIComponent(t.id)}`}>Ouvrir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>{ready ? "Aucun message pour le moment." : "Chargement…"}</p>
        )}
      </div>
    </>
  );
}
