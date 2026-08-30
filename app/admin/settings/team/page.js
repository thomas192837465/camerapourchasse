"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth";
import { getAdmins, inviteAdmin, removeAdmin } from "@/lib/admins";
import { TrashIcon } from "@/components/Icons";

function generatePassword() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  for (let i = 0; i < 12; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function TeamSettingsPage() {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(generatePassword());
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState("");
  const [created, setCreated] = useState(null);

  function loadAdmins() {
    setLoading(true);
    getAdmins()
      .then(setAdmins)
      .finally(() => setLoading(false));
  }

  useEffect(loadAdmins, []);

  async function handleInvite(e) {
    e.preventDefault();
    setError("");
    setCreated(null);
    setInviting(true);
    try {
      await inviteAdmin(email, password);
      setCreated({ email, password });
      setEmail("");
      setPassword(generatePassword());
      loadAdmins();
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("Un compte existe déjà avec cet e-mail.");
      } else if (err.code === "auth/weak-password") {
        setError("Mot de passe trop faible (6 caractères minimum).");
      } else {
        setError(err.message || "Échec de la création du compte.");
      }
    } finally {
      setInviting(false);
    }
  }

  async function handleRemove(uid) {
    if (!confirm("Retirer les droits admin de ce compte ?")) return;
    await removeAdmin(uid);
    loadAdmins();
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1>Équipe & administrateurs</h1>
          <p>Gérez qui a accès à cet espace admin.</p>
        </div>
      </div>

      <div className="admin-card">
        <h2>Inviter un administrateur</h2>
        <p className="form-hint" style={{ marginBottom: 14 }}>
          Crée directement un compte de connexion. Communiquez l'e-mail et le mot de passe temporaire à la personne
          concernée — pensez à le changer une fois connecté(e) (via la procédure de réinitialisation Firebase).
        </p>
        <form onSubmit={handleInvite}>
          <div className="form-grid">
            <div className="form-field">
              <label>E-mail</label>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-field">
              <label>Mot de passe temporaire</label>
              <input required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          {error ? <div className="banner error">{error}</div> : null}
          {created ? (
            <div className="banner success">
              Compte créé : <strong>{created.email}</strong> / <code>{created.password}</code> — notez-le
              maintenant, ce mot de passe ne sera plus réaffiché.
            </div>
          ) : null}
          <button className="btn btn-primary" type="submit" disabled={inviting}>
            {inviting ? "Création…" : "Créer le compte admin"}
          </button>
        </form>
      </div>

      <div className="admin-card">
        <h2>Administrateurs actuels</h2>
        {loading ? (
          <p>Chargement…</p>
        ) : admins.length ? (
          <table className="admin-table">
            <thead>
              <tr>
                <th>E-mail</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a.uid}>
                  <td>
                    {a.email} {a.uid === user?.uid ? <span className="form-hint">(vous)</span> : null}
                  </td>
                  <td className="row-actions">
                    {a.uid === user?.uid ? (
                      <span className="form-hint">Impossible de vous retirer vous-même</span>
                    ) : (
                      <button type="button" className="icon-btn" onClick={() => handleRemove(a.uid)} aria-label="Retirer">
                        <TrashIcon />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={{ color: "var(--ink-soft)" }}>Aucun administrateur trouvé.</p>
        )}
      </div>
    </>
  );
}
