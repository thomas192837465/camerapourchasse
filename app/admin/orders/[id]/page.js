"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getOrderById, updateOrder, ORDER_STATUSES } from "@/lib/orders";

export default function AdminOrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [shipping, setShipping] = useState({ carrier: "", trackingNumber: "", trackingUrl: "" });
  const [status, setStatus] = useState("nouvelle");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getOrderById(id).then((o) => {
      setOrder(o);
      if (o) {
        setShipping(o.shipping || { carrier: "", trackingNumber: "", trackingUrl: "" });
        setStatus(o.status || "nouvelle");
      }
    });
  }, [id]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateOrder(id, { status, shipping });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (!order) return <p>Chargement…</p>;

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Commande {id}</h1>
          <p>Passée le {order.createdAt?.seconds ? new Date(order.createdAt.seconds * 1000).toLocaleString("fr-FR") : "—"}</p>
        </div>
        <button className="btn btn-outline" onClick={() => router.push("/admin/orders")}>
          ← Retour
        </button>
      </div>

      <div className="admin-card">
        <h2>Client</h2>
        <p>{order.customer?.name}</p>
        <p className="form-hint">{order.customer?.email} · {order.customer?.phone}</p>
        <p className="form-hint">
          {order.customer?.address}, {order.customer?.postalCode} {order.customer?.city}, {order.customer?.country}
        </p>
      </div>

      <div className="admin-card">
        <h2>Articles</h2>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Produit</th>
              <th>Variante</th>
              <th>Qté</th>
              <th>Prix</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((it, i) => (
              <tr key={i}>
                <td>{it.name}</td>
                <td>{it.variant || "—"}</td>
                <td>{it.qty}</td>
                <td>€{Number(it.price).toFixed(2).replace(".", ",")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="summary-row total" style={{ marginTop: 14 }}>
          <span>Total</span>
          <span>€{Number(order.total).toFixed(2).replace(".", ",")}</span>
        </div>
      </div>

      <div className="admin-card">
        <h2>Statut & suivi</h2>
        <p className="form-hint" style={{ marginBottom: 14 }}>
          À renseigner manuellement pour le moment ({order.source === "shopify" ? "importée de Shopify" : "commande du site"}
          ) — sera automatisé lors du branchement Shopify (voir Réglages → Shopify).
        </p>
        <div className="form-grid">
          <div className="form-field">
            <label>Statut</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
              {ORDER_STATUSES.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Transporteur</label>
            <input value={shipping.carrier} onChange={(e) => setShipping({ ...shipping, carrier: e.target.value })} />
          </div>
          <div className="form-field">
            <label>Numéro de suivi</label>
            <input
              value={shipping.trackingNumber}
              onChange={(e) => setShipping({ ...shipping, trackingNumber: e.target.value })}
            />
          </div>
          <div className="form-field">
            <label>Lien de suivi</label>
            <input
              value={shipping.trackingUrl}
              onChange={(e) => setShipping({ ...shipping, trackingUrl: e.target.value })}
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
          {saving ? "Enregistrement…" : saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>
    </>
  );
}
