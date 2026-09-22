"use client";

import { useCallback, useEffect, useState } from "react";
import {
  CONSENT_MODE,
  OPEN_CONSENT_EVENT,
  readStoredConsent,
  saveConsent,
} from "@/lib/gtag";

/**
 * Bannière de consentement aux cookies (RGPD / directive ePrivacy).
 *
 * Trois règles non négociables, et la raison de chacune :
 *
 * 1. **Refuser est aussi simple qu'accepter.** Un bouton « Tout refuser » au même
 *    niveau visuel que « Tout accepter ». C'est le point sur lequel la CNIL a
 *    sanctionné le plus de sites : enterrer le refus dans un sous-menu invalide
 *    le consentement recueilli.
 * 2. **Aucune case pré-cochée.** Le consentement doit être un acte positif ;
 *    l'inaction ne vaut pas accord.
 * 3. **Le refus est mémorisé.** Sinon la bannière revient à chaque page, ce qui
 *    revient à redemander jusqu'à l'épuisement du visiteur.
 *
 * Tant que `NEXT_PUBLIC_CONSENT_MODE` n'est pas à "1", ce composant ne rend rien :
 * le site se comporte exactement comme avant son ajout.
 *
 * Le choix est réappliqué à chaque chargement directement dans le script d'init
 * de `GoogleTag` (de façon synchrone, avant le premier hit) — ici on ne traite
 * que l'expression d'un nouveau choix.
 */

const PURPOSES = [
  {
    key: "analytics",
    title: "Mesure d'audience",
    description:
      "Compter les visites et comprendre quelles pages sont utiles. Données agrégées, jamais revendues.",
  },
  {
    key: "ads",
    title: "Publicité",
    description:
      "Savoir quelles annonces mènent à une commande, pour arrêter de payer celles qui ne servent à rien.",
  },
];

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [detailed, setDetailed] = useState(false);
  const [choices, setChoices] = useState({ analytics: false, ads: false });

  const openBanner = useCallback(() => {
    const stored = readStoredConsent();
    setChoices({
      analytics: Boolean(stored && stored.analytics),
      ads: Boolean(stored && stored.ads),
    });
    setDetailed(Boolean(stored));
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!CONSENT_MODE) return undefined;

    // Aucun choix exprimé à ce jour : on demande.
    if (!readStoredConsent()) setOpen(true);

    // Permet au pied de page de rouvrir les préférences — le retrait du
    // consentement doit rester possible à tout moment.
    window.addEventListener(OPEN_CONSENT_EVENT, openBanner);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, openBanner);
  }, [openBanner]);

  if (!CONSENT_MODE || !open) return null;

  function decide(prefs) {
    saveConsent(prefs);
    setOpen(false);
    setDetailed(false);
  }

  return (
    <div style={overlay} role="dialog" aria-modal="false" aria-labelledby="consent-title">
      <div style={panel}>
        <h2 id="consent-title" style={title}>
          Cookies et mesure d&apos;audience
        </h2>

        <p style={text}>
          Nous utilisons des cookies pour faire fonctionner la boutique, mesurer
          l&apos;audience du site et évaluer nos campagnes publicitaires. Les cookies
          strictement nécessaires (panier, session, sécurité) sont toujours actifs ;
          les autres dépendent de vous. Vous pouvez changer d&apos;avis à tout moment
          depuis le lien « Préférences cookies » en bas de page.
        </p>

        {detailed ? (
          <div style={purposeList}>
            {PURPOSES.map((purpose) => (
              <label key={purpose.key} style={purposeRow}>
                <input
                  type="checkbox"
                  checked={choices[purpose.key]}
                  onChange={(e) =>
                    setChoices((prev) => ({ ...prev, [purpose.key]: e.target.checked }))
                  }
                  style={{ marginTop: "0.25rem", flexShrink: 0 }}
                />
                <span>
                  <strong style={{ display: "block" }}>{purpose.title}</strong>
                  <span style={purposeDesc}>{purpose.description}</span>
                </span>
              </label>
            ))}
          </div>
        ) : null}

        <div style={actions}>
          <button
            type="button"
            style={{ ...button, ...buttonPrimary }}
            onClick={() => decide({ analytics: true, ads: true })}
          >
            Tout accepter
          </button>
          <button
            type="button"
            style={{ ...button, ...buttonSecondary }}
            onClick={() => decide({ analytics: false, ads: false })}
          >
            Tout refuser
          </button>
          {detailed ? (
            <button
              type="button"
              style={{ ...button, ...buttonSecondary }}
              onClick={() => decide(choices)}
            >
              Enregistrer mes choix
            </button>
          ) : (
            <button type="button" style={buttonLink} onClick={() => setDetailed(true)}>
              Personnaliser
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* --- Styles en ligne : le composant reste autonome, rien à ajouter au CSS global. --- */

const overlay = {
  position: "fixed",
  insetInline: 0,
  bottom: 0,
  zIndex: 9999,
  display: "flex",
  justifyContent: "center",
  padding: "1rem",
  pointerEvents: "none",
};

const panel = {
  pointerEvents: "auto",
  width: "min(46rem, 100%)",
  background: "var(--card, #fff)",
  color: "var(--ink, #1b1b1b)",
  border: "1px solid var(--border, #e2e2e2)",
  borderRadius: "0.9rem",
  boxShadow: "0 12px 40px rgba(0,0,0,0.18)",
  padding: "1.25rem 1.4rem",
};

const title = { margin: "0 0 0.5rem", fontSize: "1.05rem", fontWeight: 700 };

const text = {
  margin: "0 0 1rem",
  fontSize: "0.9rem",
  lineHeight: 1.55,
  color: "var(--ink-soft, #4a4a4a)",
};

const purposeList = {
  display: "grid",
  gap: "0.75rem",
  margin: "0 0 1rem",
  paddingTop: "0.9rem",
  borderTop: "1px solid var(--border, #e2e2e2)",
};

const purposeRow = {
  display: "flex",
  gap: "0.65rem",
  alignItems: "flex-start",
  fontSize: "0.88rem",
  cursor: "pointer",
};

const purposeDesc = { color: "var(--ink-soft, #4a4a4a)", lineHeight: 1.5 };

const actions = { display: "flex", flexWrap: "wrap", gap: "0.6rem", alignItems: "center" };

const button = {
  border: "1px solid transparent",
  borderRadius: "0.55rem",
  padding: "0.6rem 1.1rem",
  fontSize: "0.9rem",
  fontWeight: 600,
  cursor: "pointer",
  font: "inherit",
};

// « Tout refuser » partage exactement la taille et le poids de « Tout accepter » :
// une hiérarchie visuelle entre les deux vicierait le consentement.
const buttonPrimary = { background: "var(--green-700, #2c5b3d)", color: "#fff" };

const buttonSecondary = {
  background: "transparent",
  color: "var(--ink, #1b1b1b)",
  borderColor: "var(--border, #cfcfcf)",
};

const buttonLink = {
  background: "none",
  border: "none",
  padding: "0.6rem 0.4rem",
  fontSize: "0.88rem",
  color: "var(--ink-soft, #4a4a4a)",
  textDecoration: "underline",
  cursor: "pointer",
  font: "inherit",
};
