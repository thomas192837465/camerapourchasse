"use client";

import { useEffect, useState } from "react";
import { getAllPostsAdmin } from "@/lib/posts";

// Sélection manuelle des articles affichés dans la section "Articles similaires" — si rien n'est
// choisi, le site retombe automatiquement sur les articles de même catégorie (voir getRelatedPosts).
export default function RelatedPostsField({ value, onChange, excludeId }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getAllPostsAdmin().then((list) => {
      setPosts(list.filter((p) => p.id !== excludeId && p.status === "published"));
      setLoading(false);
    });
  }, [excludeId]);

  const selected = value || [];

  function toggle(id) {
    onChange(selected.includes(id) ? selected.filter((s) => s !== id) : [...selected, id]);
  }

  const filtered = search ? posts.filter((p) => p.title.toLowerCase().includes(search.toLowerCase())) : posts;

  return (
    <div className="admin-picker-field">
      <input
        type="text"
        placeholder="Rechercher un article..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {loading ? (
        <p className="form-hint">Chargement des articles…</p>
      ) : (
        <div className="admin-picker-list">
          {filtered.length ? (
            filtered.map((p) => (
              <label key={p.id} className="admin-picker-item">
                <input type="checkbox" checked={selected.includes(p.id)} onChange={() => toggle(p.id)} />
                <span>{p.title}</span>
              </label>
            ))
          ) : (
            <p className="form-hint">Aucun autre article publié.</p>
          )}
        </div>
      )}
    </div>
  );
}
