"use client";

import { useState } from "react";
import Link from "next/link";
import { LogoMarkIcon } from "./Icons";

export default function Footer({ content }) {
  const [subscribed, setSubscribed] = useState(false);

  function handleSubscribe(e) {
    e.preventDefault();
    // Pas encore branché à un service d'e-mailing — retour visuel honnête en attendant.
    setSubscribed(true);
  }

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-mark" style={{ background: "rgba(255,255,255,0.1)" }}>
              {content.logoImage?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={content.logoImage.url} alt={content.logoImage.alt || ""} />
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
              <input type="email" required placeholder="Votre e-mail" aria-label="E-mail" />
              <button type="submit" className="btn btn-primary">
                S'inscrire
              </button>
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
