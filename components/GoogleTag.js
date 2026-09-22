import Script from "next/script";
import {
  GOOGLE_ADS_ID,
  GA4_ID,
  CONSENT_MODE,
  CHECKOUT_DOMAIN,
  CONSENT_STORAGE_KEY,
  googleTagEnabled,
} from "@/lib/gtag";

/**
 * Charge le tag Google (gtag.js) sur l'ensemble du site.
 *
 * Ne rend rien tant que NEXT_PUBLIC_GOOGLE_ADS_ID / NEXT_PUBLIC_GA4_ID ne sont pas
 * définis : aucun script tiers, aucun cookie, aucun impact sur les performances.
 *
 * `linker.domains` déclare wildtrail.fr et le domaine du checkout Shopify comme un
 * même ensemble de mesure, pour que le clic publicitaire soit rattaché à la vente.
 */
export default function GoogleTag() {
  if (!googleTagEnabled) return null;

  const primaryId = GA4_ID || GOOGLE_ADS_ID;
  const siteHost = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.wildtrail.fr")
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "");
  const linkerDomains = [siteHost, CHECKOUT_DOMAIN].filter(Boolean);

  const linkerConfig = linkerDomains.length
    ? `linker: { domains: ${JSON.stringify(linkerDomains)}, decorate_forms: true, accept_incoming: true },`
    : "";

  // Le choix déjà exprimé est réappliqué ici, de façon synchrone, avant le premier
  // hit — et non depuis React. Attendre l'hydratation ferait partir la première
  // mesure en « refusé » pour un visiteur qui avait pourtant accepté.
  const consentDefault = CONSENT_MODE
    ? `gtag('consent', 'default', {
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
        analytics_storage: 'denied',
        wait_for_update: 500
      });
      try {
        var stored = JSON.parse(localStorage.getItem('${CONSENT_STORAGE_KEY}') || 'null');
        if (stored) {
          var ads = stored.ads === true ? 'granted' : 'denied';
          gtag('consent', 'update', {
            ad_storage: ads,
            ad_user_data: ads,
            ad_personalization: ads,
            analytics_storage: stored.analytics === true ? 'granted' : 'denied'
          });
        }
      } catch (e) {}`
    : "";

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${primaryId}`}
        strategy="afterInteractive"
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          ${consentDefault}
          gtag('js', new Date());
          ${GA4_ID ? `gtag('config', '${GA4_ID}', { ${linkerConfig} });` : ""}
          ${
            GOOGLE_ADS_ID
              ? `gtag('config', '${GOOGLE_ADS_ID}', { ${linkerConfig} allow_enhanced_conversions: true });`
              : ""
          }
        `}
      </Script>
    </>
  );
}
