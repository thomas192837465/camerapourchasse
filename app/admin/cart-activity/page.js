"use client";

import { useEffect, useState } from "react";
import { subscribeToCartActivity } from "@/lib/cartActivity";

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

export default function AdminCartActivityPage() {
  const [events, setEvents] = useState([]);
  const [ready, setReady] = useState(false);
  const [, forceRerender] = useState(0);

  useEffect(() => subscribeToCartActivity((list) => {
    setEvents(list);
    setReady(true);
  }), []);

  // Rafraîchit les libellés "il y a X min" sans dépendre d'un nouvel évènement Firestore.
  useEffect(() => {
    const id = setInterval(() => forceRerender((n) => n + 1), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Activité du panier</h1>
          <p>
            {ready ? `${events.length} ajout(s) récent(s)` : "Chargement…"} — mis à jour en temps réel, visiteurs
            connectés et anonymes confondus. N'affecte pas les performances du site : l'enregistrement se fait en
            arrière-plan au moment de l'ajout au panier.
          </p>
        </div>
      </div>

      <div className="admin-card">
        {events.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quand</th>
                <th>Visiteur</th>
                <th>Produit</th>
                <th>Qté</th>
                <th>Prix</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id}>
                  <td>{timeAgo(e.createdAt)}</td>
                  <td>
                    {e.userEmail ? (
                      <span className="status-pill">{e.userEmail}</span>
                    ) : (
                      <span className="status-pill draft">
                        Invité{e.visitorId ? ` · ${e.visitorId.slice(0, 8)}` : ""}
                      </span>
                    )}
                  </td>
                  <td>
                    {e.name}
                    {e.variant ? <span className="form-hint"> — {e.variant}</span> : null}
                  </td>
                  <td>{e.qty}</td>
                  <td>€{Number(e.price || 0).toFixed(2).replace(".", ",")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>{ready ? "Aucun ajout au panier pour le moment." : "Chargement…"}</p>
        )}
      </div>
    </>
  );
}
