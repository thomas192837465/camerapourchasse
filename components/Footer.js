"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMarkIcon } from "./Icons";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";
import { addSubscriber } from "@/lib/subscribers";
import { CONSENT_MODE, OPEN_CONSENT_EVENT } from "@/lib/gtag";

/**
 * Rouvre la bannière de consentement. Le RGPD impose que retirer son
 * consentement soit aussi simple que de le donner : ce lien est ce qui rend
 * la bannière réversible. Rien n'est rendu si le mode consentement est inactif,
 * pour ne pas afficher un lien qui n'ouvrirait rien.
 */
function CookiePreferencesLink() {
  if (!CONSENT_MODE) return null;
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        font: "inherit",
        color: "inherit",
        cursor: "pointer",
        textAlign: "left",
      }}
    >
      Préférences cookies
    </button>
  );
}

export default function Footer({ content }) {
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubscribe(e) {
    e.preventDefault();
    setError("");
    const email = e.target.elements.email.value;
    setSubmitting(true);
    try {
      await addSubscriber(email, "footer");
      setSubscribed(true);
    } catch (err) {
      setError(err.message || "Une erreur est survenue, veuillez réessayer.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link href="/" className="logo footer-logo">
            {content.logoImageLight?.url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="logo-image"
                src={cloudinaryTransform(content.logoImageLight.url, "h_96,q_auto,f_auto")}
                alt={content.logoImageLight.alt || content.logoImage?.alt || ""}
              />
            ) : content.logoImage?.url ? (
              // Logo principal recoloré en blanc par CSS (voir .logo-image-invert) tant qu'aucune
              // version "fond sombre" n'est envoyée dans l'admin.
              // eslint-disable-next-line @next/next/no-img-element
              <img
                className="logo-image logo-image-invert"
                src={cloudinaryTransform(content.logoImage.url, "h_96,q_auto,f_auto")}
                alt={content.logoImage.alt || ""}
              />
            ) : (
              <>
                <span className="logo-mark">
                  <LogoMarkIcon />
                </span>
                <span className="logo-text">
                  <span className="line1" style={{ color: "#fff" }}>{content.logoLine1}</span>
                  <span className="line2" style={{ color: "var(--accent)" }}>{content.logoLine2}</span>
                </span>
              </>
            )}
          </Link>
          <p>{content.footerDescription}</p>
        </div>

        <div className="footer-dynamic-columns">
          {(content.footerColumns || []).map((col) => (
            <div key={col.id}>
              <h4>{col.title}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.id}>
                    <Link href={link.href || "#"}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div>
          <h4>Légal</h4>
          <ul>
            <li><Link href="/mentions-legales">Mentions légales</Link></li>
            <li><Link href="/cgv">CGV</Link></li>
            <li><CookiePreferencesLink /></li>
          </ul>
        </div>

        <div className="footer-newsletter">
          <h4>{content.newsletterTitle}</h4>
          {subscribed ? (
            <p className="footer-newsletter-thanks">Merci ! Vous êtes bien inscrit(e).</p>
          ) : (
            <form onSubmit={handleSubscribe}>
              <input type="email" name="email" required placeholder="Votre e-mail" aria-label="E-mail" />
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? "Envoi…" : "S'inscrire"}
              </button>
              {error ? <p className="footer-newsletter-thanks" style={{ color: "var(--gold)" }}>{error}</p> : null}
            </form>
          )}
        </div>
      </div>
      <div className="footer-bottom">
        <div>© {new Date().getFullYear()} {content.logoLine1} {content.logoLine2}. Tous droits réservés.</div>
      </div>
    </footer>
  );
}
