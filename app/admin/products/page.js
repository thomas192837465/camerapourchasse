"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllProductsAdmin } from "@/lib/products";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProductsAdmin()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Produits</h1>
          <p>{loading ? "Chargement…" : `${products.length} produit(s)`}</p>
        </div>
        <Link href="/admin/products/new" className="btn btn-primary">
          + Ajouter un produit
        </Link>
      </div>

      <div className="admin-card">
        {products.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>€{Number(p.price).toFixed(2).replace(".", ",")}</td>
                  <td>{p.stock}</td>
                  <td>
                    <span className={`status-pill ${p.status === "draft" ? "draft" : ""}`}>
                      {p.status === "draft" ? "Brouillon" : "Publié"}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link href={`/admin/products/${p.id}`}>Modifier</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            {loading ? "Chargement…" : "Aucun produit. Commencez par en ajouter un."}
          </p>
        )}
      </div>
    </>
  );
}
