"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth";
import { getOrdersByUser, ORDER_STATUSES } from "@/lib/orders";

function statusLabel(value) {
  return ORDER_STATUSES.find((s) => s.value === value)?.label || value;
}

export default function AccountDashboard({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrdersByUser(user.uid).then((o) => {
      setOrders(o);
      setLoading(false);
    });
  }, [user.uid]);

  return (
    <div>
      <div className="account-summary">
        <p>
          Connecté en tant que <strong>{user.displayName || user.email}</strong>
        </p>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => logout()}>
          Se déconnecter
        </button>
      </div>

      <h2 className="reco-title" style={{ marginTop: 32 }}>
        Mes commandes
      </h2>

      {loading ? (
        <p style={{ color: "var(--ink-soft)" }}>Chargement…</p>
      ) : orders.length ? (
        <div style={{ overflowX: "auto" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>N° commande</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id.slice(0, 8)}</td>
                  <td>{o.createdAt?.seconds ? new Date(o.createdAt.seconds * 1000).toLocaleDateString("fr-FR") : "—"}</td>
                  <td>€{Number(o.total).toFixed(2).replace(".", ",")}</td>
                  <td>
                    <span className={`status-pill ${o.status === "annulee" ? "annulee" : ""}`}>
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link href={`/commande/confirmation/${o.id}`}>Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={{ color: "var(--ink-soft)" }}>
          Aucune commande pour le moment. Les commandes payées en ligne par carte bancaire n'apparaissent pas ici —
          leur suivi se fait par l'e-mail de confirmation envoyé après l'achat.
        </p>
      )}
    </div>
  );
}
