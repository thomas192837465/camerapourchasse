"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMarkIcon } from "@/components/Icons";
import { login, useAuth } from "@/lib/auth";
import { firebaseEnabled } from "@/lib/firebase";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, isAdmin, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setError("Identifiants incorrects, ou compte inexistant.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!firebaseEnabled) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="logo">
            <span className="logo-mark"><LogoMarkIcon /></span>
          </div>
          <h1>Admin non disponible</h1>
          <div className="banner warning">
            Firebase n'est pas encore configuré. Complétez <code>.env.local</code> à partir de{" "}
            <code>.env.local.example</code> puis redémarrez le serveur.
          </div>
        </div>
      </div>
    );
  }

  if (!loading && user && !isAdmin) {
    return (
      <div className="login-shell">
        <div className="login-card">
          <div className="logo"><span className="logo-mark"><LogoMarkIcon /></span></div>
          <h1>Compte non autorisé</h1>
          <p className="subtitle">
            Ce compte ({user.email}) n'a pas encore accès à l'admin. Dans la console Firebase → Firestore, créez un
            document dans la collection <code>admins</code> avec pour identifiant :
          </p>
          <div className="banner success" style={{ wordBreak: "break-all", fontFamily: "monospace" }}>{user.uid}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="logo">
          <span className="logo-mark">
            <LogoMarkIcon />
          </span>
        </div>
        <h1>Connexion Admin</h1>
        <p className="subtitle">Caméra Chasse Pro</p>

        <form onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">E-mail</label>
            <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="form-field">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error ? <div className="banner error">{error}</div> : null}
          <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
            {submitting ? "Connexion…" : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
