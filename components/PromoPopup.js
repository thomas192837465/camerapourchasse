"use client";

import { useEffect, useState } from "react";
import { addSubscriber } from "@/lib/subscribers";
import { CONSENT_DECIDED_EVENT, consentDecided } from "@/lib/gtag";
import { CloseIcon } from "./Icons";

const SEEN_KEY = "wt_promo_popup_seen";

// Popup d'acquisition e-mail (code de bienvenue) : ne s'affiche qu'une seule fois par visiteur,
// qu'il aille au bout ou qu'il ferme la popup — voir SEEN_KEY dans le stockage local du navigateur.
export default function PromoPopup({ content }) {
  const [open, setOpen] = useState(false);
  // Une fois la popup fermée (ou déjà vue lors d'une visite précédente), un petit bouton flottant
  // reste accessible en bas à droite pour la rouvrir — sans lui, un visiteur qui ferme par réflexe
  // perd tout accès au code promo pour le reste de sa visite.
  const [showFab, setShowFab] = useState(false);
  const [step, setStep] = useState("teaser");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (content.promoPopupEnabled === false) return undefined;
    try {
      if (localStorage.getItem(SEEN_KEY)) {
        setShowFab(true);
        return undefined;
      }
    } catch {
      return undefined;
    }

    // La bannière de consentement passe avant : empiler deux surcouches donne
    // l'impression d'un site qui réclame, et fait cliquer au hasard sur le RGPD.
    let timer;
    const arm = () => {
      timer = setTimeout(() => setOpen(true), 2500);
    };

    if (consentDecided()) {
      arm();
      return () => clearTimeout(timer);
    }

    window.addEventListener(CONSENT_DECIDED_EVENT, arm, { once: true });
    return () => {
      window.removeEventListener(CONSENT_DECIDED_EVENT, arm);
      clearTimeout(timer);
    };
  }, [content.promoPopupEnabled]);

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {}
  }

  function close() {
    setOpen(false);
    markSeen();
    setShowFab(true);
  }

  function reopen() {
    setOpen(true);
    setShowFab(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await addSubscriber(email, "popup");
      await fetch("/api/promo-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      markSeen();
      setStep("success");
    } catch (err) {
      setError(err.message || "Une erreur est survenue, réessayez.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) {
    return showFab ? (
      <button type="button" className="promo-fab" onClick={reopen} aria-label="Voir mon code de réduction">
        🎁
      </button>
    ) : null;
  }

  return (
    <div className="promo-popup-overlay" onClick={close}>
      <div className="promo-popup" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="promo-popup-close" onClick={close} aria-label="Fermer">
          <CloseIcon />
        </button>

        {step === "teaser" ? (
          <div className="promo-popup-body">
            <span className="promo-popup-emoji" aria-hidden="true">🎁</span>
            <h2 className="promo-popup-title">-5€ sur votre première commande</h2>
            <p className="promo-popup-text">
              Obtenez votre code de réduction, valable immédiatement sur votre prochaine caméra de chasse.
            </p>
            <button type="button" className="btn btn-primary promo-popup-cta" onClick={() => setStep("form")}>
              Obtenir mon code promo
            </button>
          </div>
        ) : null}

        {step === "form" ? (
          <div className="promo-popup-body">
            <h2 className="promo-popup-title">Venez récupérer votre code dans vos e-mails</h2>
            <p className="promo-popup-text">Indiquez votre adresse e-mail, votre code de réduction vous y attendra.</p>
            <form onSubmit={handleSubmit} className="promo-popup-form">
              <input
                type="email"
                required
                placeholder="votre@email.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error ? <p className="promo-popup-error">{error}</p> : null}
              <button type="submit" className="btn btn-primary promo-popup-cta" disabled={submitting}>
                {submitting ? "Envoi…" : "Recevoir mon code"}
              </button>
            </form>
          </div>
        ) : null}

        {step === "success" ? (
          <div className="promo-popup-body">
            <span className="promo-popup-emoji" aria-hidden="true">📬</span>
            <h2 className="promo-popup-title">C'est envoyé !</h2>
            <p className="promo-popup-text">Allez voir votre boîte mail : votre code de réduction vous y attend.</p>
            <button type="button" className="btn btn-outline promo-popup-cta" onClick={close}>
              Fermer
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
