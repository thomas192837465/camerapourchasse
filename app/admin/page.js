"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/products";
import { getAllOrders, ORDER_STATUSES } from "@/lib/orders";

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getAllProductsAdmin(), getAllOrders()])
      .then(([p, o]) => {
        setProducts(p);
        setOrders(o);
      })
      .finally(() => setLoading(false));
  }, []);

  const statusLabel = (value) => ORDER_STATUSES.find((s) => s.value === value)?.label || value;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Vue d'ensemble de votre boutique.</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="value">{loading ? "…" : products.length}</div>
          <div className="label">Produits</div>
        </div>
        <div className="stat-card">
          <div className="value">{loading ? "…" : orders.length}</div>
          <div className="label">Commandes</div>
        </div>
        <div className="stat-card">
          <div className="value">
            {loading ? "…" : orders.filter((o) => o.status === "nouvelle").length}
          </div>
          <div className="label">Nouvelles commandes</div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Dernières commandes</h2>
        {orders.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Total</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o.id}>
                  <td>{o.customer?.name}</td>
                  <td>€{Number(o.total).toFixed(2).replace(".", ",")}</td>
                  <td>
                    <span className={`status-pill ${o.status === "annulee" ? "annulee" : ""}`}>
                      {statusLabel(o.status)}
                    </span>
                  </td>
                  <td>
                    <Link href={`/admin/orders/${o.id}`}>Voir</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>Aucune commande pour le moment.</p>
        )}
      </div>

      <div className="admin-card">
        <h2>Actions rapides</h2>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/admin/products/new" className="btn btn-primary">
            Ajouter un produit
          </Link>
          <Link href="/admin/orders" className="btn btn-outline">
            Voir les commandes
          </Link>
        </div>
      </div>
    </>
  );
}
