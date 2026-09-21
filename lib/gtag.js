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

/**
 * Normalise un domaine : « https://boutique.myshopify.com/ » devient
 * « boutique.myshopify.com ». Google compare des noms d'hôte, pas des URL —
 * une valeur avec protocole ou slash final ne correspondrait à rien.
 */
function normalizeDomain(value) {
  return (value || "")
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/:\d+$/, "");
}

/** Domaine Shopify du checkout hébergé, pour la mesure inter-domaines. */
export const CHECKOUT_DOMAIN = normalizeDomain(process.env.NEXT_PUBLIC_SHOPIFY_CHECKOUT_DOMAIN);

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

const CLICK_ID_PARAMS = ["gclid", "wbraid", "gbraid"];

/**
 * Récupère l'identifiant de clic publicitaire : d'abord dans l'URL courante,
 * sinon dans le cookie `_gcl_aw` que gtag pose au format `GCL.<horodatage>.<gclid>`.
 *
 * Le cookie est indispensable : le visiteur arrive sur la page d'accueil avec son
 * gclid, puis navigue vers une fiche produit — à ce moment l'URL ne le contient plus.
 */
export function getAdClickId() {
  if (typeof window === "undefined") return null;
  try {
    const params = new URLSearchParams(window.location.search);
    for (const key of CLICK_ID_PARAMS) {
      const value = params.get(key);
      if (value) return { key, value };
    }

    const match = document.cookie.match(/(?:^|;\s*)_gcl_aw=([^;]+)/);
    if (match) {
      const gclid = decodeURIComponent(match[1]).split(".").slice(2).join(".");
      if (gclid) return { key: "gclid", value: gclid };
    }
  } catch {
    // Cookies inaccessibles : on redirige sans décoration.
  }
  return null;
}

function appendParam(url, extra) {
  if (!extra) return url;
  return url + (url.includes("?") ? "&" : "?") + extra;
}

/**
 * Mesure inter-domaines.
 *
 * Le clic publicitaire arrive sur wildtrail.fr (avec son gclid), mais le paiement
 * se termine sur le domaine Shopify. Sans passage explicite de l'identifiant de clic,
 * Google Ads ne rattache pas la vente au clic et la campagne paraît ne rien rapporter.
 *
 * Deux mécanismes, dans cet ordre :
 *
 * 1. Le **gclid recollé sur l'URL** de destination. C'est le mécanisme principal ici :
 *    gtag le lit nativement depuis l'URL sur l'autre domaine. Indispensable, car
 *    `linker_param` est une fonction de GA4 — une configuration Google Ads seule
 *    renvoie toujours une valeur vide, ce qui ferait échouer toute l'attribution.
 * 2. Le paramètre `_gl` de `linker_param`, ajouté en plus quand un GA4 est configuré.
 *
 * Retourne toujours une URL exploitable : en cas d'absence de tag ou de dépassement
 * du délai, on redirige sans décoration plutôt que de bloquer l'achat.
 */
export function decorateCheckoutUrl(url, timeoutMs = 1000) {
  if (typeof window === "undefined" || !url) return Promise.resolve(url);

  const click = getAdClickId();
  const withClickId = click
    ? appendParam(url, `${click.key}=${encodeURIComponent(click.value)}`)
    : url;

  const id = GA4_ID || GOOGLE_ADS_ID;
  if (!hasGtag() || !id) return Promise.resolve(withClickId);

  return new Promise((resolve) => {
    let settled = false;
    const done = (value) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };

    // Filet de sécurité : jamais de panier bloqué par le tracking.
    const timer = setTimeout(() => done(withClickId), timeoutMs);

    try {
      window.gtag("get", id, "linker_param", (linkerParam) => {
        clearTimeout(timer);
        done(appendParam(withClickId, linkerParam));
      });
    } catch {
      clearTimeout(timer);
      done(withClickId);
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
