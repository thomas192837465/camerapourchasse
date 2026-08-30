"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders, ORDER_STATUSES } from "@/lib/orders";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllOrders()
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = (value) => ORDER_STATUSES.find((s) => s.value === value)?.label || value;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Commandes</h1>
          <p>
            {loading ? "Chargement…" : `${orders.length} commande(s)`} — suivi manuel en attendant la connexion
            Shopify.
          </p>
        </div>
      </div>

      <div className="admin-card">
        {orders.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Articles</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Suivi</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    {o.customer?.name}
                    <div className="form-hint">{o.customer?.email}</div>
                  </td>
                  <td>{o.items?.reduce((n, it) => n + it.qty, 0)} article(s)</td>
                  <td>€{Number(o.total).toFixed(2).replace(".", ",")}</td>
                  <td>
                    <span className={`status-pill ${o.status === "annulee" ? "annulee" : ""}`}>
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td>{o.shipping?.trackingNumber || "—"}</td>
                  <td>
                    <Link href={`/admin/orders/${o.id}`}>Gérer</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>{loading ? "Chargement…" : "Aucune commande pour le moment."}</p>
        )}
      </div>
    </>
  );
}
