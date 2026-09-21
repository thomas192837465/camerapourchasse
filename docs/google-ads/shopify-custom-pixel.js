/**
 * PIXEL PERSONNALISÉ SHOPIFY — conversion d'achat Google Ads
 *
 * Ce fichier ne fait PAS partie du build Next.js. Son contenu se colle dans :
 *   Admin Shopify → Paramètres → Événements clients → Ajouter un pixel personnalisé
 *   Nom : "Google Ads - Conversion achat"
 *   Autorisations : Marketing + Analytics
 *   Puis « Connecter » (sans ça, le pixel est enregistré mais ne se déclenche jamais).
 *
 * Pourquoi ici et pas dans le code du site : le paiement se termine sur le checkout
 * hébergé Shopify, un autre domaine que wildtrail.fr. Le code Next.js n'y tourne pas.
 *
 * Les constantes ci-dessous sont celles du compte Google Ads de WildTrail
 * (action de conversion « Achat (1) », créée le 21/09/2026). Rien à modifier.
 */

const GOOGLE_ADS_ID = 'AW-18459825178';
const PURCHASE_LABEL = 'gzdvCLvmtYAdEJqoquJE';

// --- Chargement du tag Google -----------------------------------------------
const script = document.createElement('script');
script.async = true;
script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GOOGLE_ADS_ID;
document.head.appendChild(script);

window.dataLayer = window.dataLayer || [];
function gtag() { window.dataLayer.push(arguments); }
gtag('js', new Date());

// `accept_incoming` lit le paramètre _gl posé par wildtrail.fr au moment de la
// redirection (voir lib/gtag.js → decorateCheckoutUrl). C'est ce qui rattache
// la vente au clic publicitaire d'origine.
gtag('config', GOOGLE_ADS_ID, {
  allow_enhanced_conversions: true,
  linker: { accept_incoming: true },
});

// --- Conversion d'achat ------------------------------------------------------
analytics.subscribe('checkout_completed', (event) => {
  const checkout = event.data.checkout;
  if (!checkout) return;

  const addr = checkout.billingAddress || checkout.shippingAddress || {};

  // Conversions améliorées : les données client sont hachées par Google
  // côté navigateur avant envoi. Elles ne transitent jamais en clair.
  gtag('set', 'user_data', {
    email: checkout.email || undefined,
    phone_number: checkout.phone || undefined,
    address: {
      first_name: addr.firstName || undefined,
      last_name: addr.lastName || undefined,
      street: addr.address1 || undefined,
      city: addr.city || undefined,
      postal_code: addr.zip || undefined,
      country: addr.countryCode || undefined,
    },
  });

  gtag('event', 'conversion', {
    send_to: GOOGLE_ADS_ID + '/' + PURCHASE_LABEL,
    // Valeur HORS taxes et hors frais de port : c'est la marge décisionnelle,
    // pas le montant encaissé. Remplacer par checkout.totalPrice.amount si
    // l'on préfère piloter sur le chiffre d'affaires brut.
    value: (checkout.subtotalPrice && checkout.subtotalPrice.amount) || 0,
    currency: (checkout.totalPrice && checkout.totalPrice.currencyCode) || 'EUR',
    // Indispensable : évite le double comptage si le client recharge la page
    // de remerciement ou revient dessus depuis son e-mail.
    transaction_id: (checkout.order && checkout.order.id) || checkout.token,
  });
});
