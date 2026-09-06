"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllPostsAdmin, formatPostDate } from "@/lib/posts";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllPostsAdmin()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Blog</h1>
          <p>{loading ? "Chargement…" : `${posts.length} article(s)`} — alimente automatiquement /blog et le bloc "derniers articles" du pied de page.</p>
        </div>
        <Link href="/admin/blog/new" className="btn btn-primary">
          + Nouvel article
        </Link>
      </div>

      <div className="admin-card">
        {posts.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Slug</th>
                <th>Date de publication</th>
                <th>Statut</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{p.slug}</td>
                  <td>{formatPostDate(p.publishedAt)}</td>
                  <td>
                    <span className={`status-pill ${p.status === "published" ? "" : "draft"}`}>
                      {p.status === "published" ? "Publié" : "Brouillon"}
                    </span>
                  </td>
                  <td className="row-actions">
                    <Link href={`/admin/blog/${p.id}`}>Modifier</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>
            {loading ? "Chargement…" : "Aucun article. Commencez par en ajouter un."}
          </p>
        )}
      </div>
    </>
  );
}
