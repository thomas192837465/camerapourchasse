"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subscribeToThreads } from "@/lib/supportThreads";

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

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(
    () =>
      subscribeToThreads((list) => {
        setThreads(list);
        setReady(true);
      }),
    []
  );

  const unreadCount = threads.filter((t) => t.unread).length;

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
      </div>

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
