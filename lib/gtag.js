/**
 * Tag Google (Google Ads + GA4) — configuration et helpers d'événements.
 *
 * Les identifiants viennent de l'environnement pour ne jamais être commités :
 *   NEXT_PUBLIC_GOOGLE_ADS_ID   ex. "AW-1234567890"
 *   NEXT_PUBLIC_GA4_ID          ex. "G-ABCD123456"   (facultatif)
 *   NEXT_PUBLIC_CONSENT_MODE    "1" pour activer le mode consentement v2 (RGPD)
 *
 * Tant qu'aucun identifiant n'est défini, le tag ne se charge pas du tout :
 * le site fonctionne exactement comme avant.
 */

export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID || "";
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID || "";
export const CONSENT_MODE = process.env.NEXT_PUBLIC_CONSENT_MODE === "1";

export const googleTagEnabled = Boolean(GOOGLE_ADS_ID || GA4_ID);

/** Domaine Shopify du checkout hébergé, pour la mesure inter-domaines. */
export const CHECKOUT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN || "";

function hasGtag() {
  return typeof window !== "undefined" && typeof window.gtag === "function";
}

/** Envoie un événement gtag. No-op silencieux si le tag n'est pas chargé. */
export function gtagEvent(name, params = {}) {
  if (!hasGtag()) return;
  window.gtag("event", name, params);
}

/** Met en forme les articles du panier au format `items` de gtag. */
export function toGtagItems(items = []) {
  return items.map((it) => ({
    item_id: it.shopifyVariantId || it.productId,
    item_name: it.name,
    item_variant: it.variant || undefined,
    price: Number(it.price) || 0,
    quantity: it.qty || 1,
  }));
}

/** Vue d'une fiche produit. */
export function trackViewItem({ id, name, price, currency = "EUR" }) {
  gtagEvent("view_item", {
    currency,
    value: Number(price) || 0,
    items: [{ item_id: id, item_name: name, price: Number(price) || 0, quantity: 1 }],
  });
}

/** Ajout au panier. */
export function trackAddToCart({ items, value, currency = "EUR" }) {
  gtagEvent("add_to_cart", { currency, value: Number(value) || 0, items: toGtagItems(items) });
}

/** Départ vers le paiement. */
export function trackBeginCheckout({ items, value, currency = "EUR" }) {
  gtagEvent("begin_checkout", { currency, value: Number(value) || 0, items: toGtagItems(items) });
}

/**
 * Mesure inter-domaines.
 *
 * Le clic publicitaire arrive sur wildtrail.fr (avec son gclid), mais le paiement
 * se termine sur le domaine Shopify. Sans passage explicite du paramètre de liaison,
 * Google Ads ne rattache pas la vente au clic et la campagne paraît ne rien rapporter.
 *
 * `gtag('get', id, 'linker_param', cb)` renvoie un paramètre `_gl=...` à coller sur
 * l'URL de destination ; le tag du pixel Shopify le lit grâce à `accept_incoming: true`.
 *
 * Retourne toujours une URL exploitable : en cas d'absence de tag ou de dépassement
 * du délai, on redirige sans décoration plutôt que de bloquer l'achat.
 */
export function decorateCheckoutUrl(url, timeoutMs = 1000) {
  const id = GOOGLE_ADS_ID || GA4_ID;
  if (!hasGtag() || !id || !url) return Promise.resolve(url);

  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    // Filet de sécurité : jamais de panier bloqué par le tracking.
    const timer = setTimeout(() => done(url), timeoutMs);

    try {
      window.gtag("get", id, "linker_param", (linkerParam) => {
        clearTimeout(timer);
        if (!linkerParam) return done(url);
        done(url + (url.includes("?") ? "&" : "?") + linkerParam);
      });
    } catch {
      clearTimeout(timer);
      done(url);
    }
  });
}

/**
 * Accorde le consentement publicitaire (à appeler depuis la bannière cookies).
 * Utile uniquement si NEXT_PUBLIC_CONSENT_MODE=1.
 */
export function grantAdConsent() {
  if (!hasGtag()) return;
  window.gtag("consent", "update", {
    ad_storage: "granted",
    ad_user_data: "granted",
    ad_personalization: "granted",
    analytics_storage: "granted",
  });
}

export function denyAdConsent() {
  if (!hasGtag()) return;
  window.gtag("consent", "update", {
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    analytics_storage: "denied",
  });
}
