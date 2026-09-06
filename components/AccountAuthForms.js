"use client";

import { useState } from "react";
import { login, signup } from "@/lib/auth";

function friendlyAuthError(err) {
  const code = err?.code || "";
  if (code.includes("email-already-in-use")) return "Un compte existe déjà avec cet e-mail.";
  if (code.includes("invalid-credential") || code.includes("wrong-password") || code.includes("user-not-found")) {
    return "E-mail ou mot de passe incorrect.";
  }
  if (code.includes("weak-password")) return "Le mot de passe doit contenir au moins 6 caractères.";
  return err?.message || "Une erreur est survenue.";
}

export default function AccountAuthForms() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function set(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      if (mode === "signup") {
        await signup(form.email, form.password, form.name);
        // onAuthStateChanged capture l'utilisateur avant que updateProfile() (nom) ne soit propagé :
        // un rechargement complet garantit que le nom s'affiche dès l'arrivée sur le compte.
        window.location.href = "/compte";
        return;
      }
      await login(form.email, form.password);
    } catch (err) {
      setError(friendlyAuthError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <div className="account-auth-tabs">
        <button type="button" className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
          Se connecter
        </button>
        <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")}>
          Créer un compte
        </button>
      </div>

      <form className="form-card account-auth-form" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <div className="form-field">
            <label htmlFor="acc-name">Nom complet</label>
            <input id="acc-name" required value={form.name} onChange={set("name")} />
          </div>
        ) : null}
        <div className="form-field">
          <label htmlFor="acc-email">E-mail</label>
          <input id="acc-email" type="email" required value={form.email} onChange={set("email")} />
        </div>
        <div className="form-field">
          <label htmlFor="acc-password">Mot de passe</label>
          <input
            id="acc-password"
            type="password"
            required
            minLength={6}
            value={form.password}
            onChange={set("password")}
          />
        </div>

        {error ? <div className="banner error">{error}</div> : null}

        <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
          {submitting ? "…" : mode === "signup" ? "Créer mon compte" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
