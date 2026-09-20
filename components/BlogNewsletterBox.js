"use client";

import { useState } from "react";
import { addSubscriber } from "@/lib/subscribers";

export default function BlogNewsletterBox({ title }) {
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    setError("");
    const email = e.target.elements.email.value;
    setSubmitting(true);
    try {
      await addSubscriber(email, "blog");
      setSubscribed(true);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="blog-newsletter-box">
      <h3>{title}</h3>
      {subscribed ? (
        <p className="blog-newsletter-thanks">Merci ! Vous êtes bien inscrit(e).</p>
      ) : (
        <form onSubmit={handleSubscribe}>
          <input type="email" name="email" required placeholder="Votre adresse email" aria-label="E-mail" />
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>
            {submitting ? "Envoi…" : "S'inscrire"}
          </button>
          {error ? <p className="blog-newsletter-note" style={{ color: "var(--gold)" }}>{error}</p> : null}
          <p className="blog-newsletter-note">Aucun spam, désinscription en 1 clic.</p>
        </form>
      )}
    </div>
  );
}
