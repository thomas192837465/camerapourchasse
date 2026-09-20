"use client";

import { useEffect, useState } from "react";
import { getAllSubscribers } from "@/lib/subscribers";

const SOURCE_LABELS = {
  footer: "Pied de page",
  blog: "Blog",
};

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getAllSubscribers().then((list) => {
      setSubscribers(list);
      setReady(true);
    });
  }, []);

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
