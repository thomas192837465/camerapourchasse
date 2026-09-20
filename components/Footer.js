"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMarkIcon } from "./Icons";
import { cloudinaryTransform } from "@/lib/cloudinaryUrl";
import { addSubscriber } from "@/lib/subscribers";

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
          <div className="logo">
            <span className="logo-mark" style={{ background: "rgba(255,255,255,0.1)" }}>
              {content.logoImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={cloudinaryTransform(content.logoImage.url, "w_120,q_auto,f_auto")} alt={content.logoImage.alt || ""} />
              ) : (
                <LogoMarkIcon />
              )}
            </span>
            <span className="logo-text">
              <span className="line1" style={{ color: "#fff" }}>{content.logoLine1}</span>
              <span className="line2" style={{ color: "#9fc79a" }}>{content.logoLine2}</span>
            </span>
          </div>
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
              {error ? <p className="footer-newsletter-thanks" style={{ color: "#f0a93a" }}>{error}</p> : null}
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
