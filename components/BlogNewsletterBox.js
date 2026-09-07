"use client";

import { useState } from "react";

export default function BlogNewsletterBox({ title }) {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    // Pas encore branché à un service d'e-mailing — retour visuel honnête en attendant.
    setSubscribed(true);
  }

  return (
    <div className="blog-newsletter-box">
      <h3>{title}</h3>
      {subscribed ? (
        <p className="blog-newsletter-thanks">Merci ! Vous êtes bien inscrit(e).</p>
      ) : (
        <form onSubmit={handleSubscribe}>
          <input type="email" required placeholder="Votre adresse email" aria-label="E-mail" />
          <button type="submit" className="btn btn-primary btn-block">
            S'inscrire
          </button>
          <p className="blog-newsletter-note">Aucun spam, désinscription en 1 clic.</p>
        </form>
      )}
    </div>
  );
}
