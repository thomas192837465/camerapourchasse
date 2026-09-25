/**
 * Microsoft Clarity — enregistrement de session et cartes de chaleur (gratuit).
 *
 * L'identifiant vient de l'environnement pour ne jamais être commité :
 *   NEXT_PUBLIC_CLARITY_ID   ex. "yn80ygvdud" (Clarity → Paramètres → Vue d'ensemble → ID de projet)
 *
 * Tant qu'il n'est pas défini, rien ne se charge : le site fonctionne exactement comme avant.
 */

export const CLARITY_PROJECT_ID = process.env.NEXT_PUBLIC_CLARITY_ID || "";
export const clarityEnabled = Boolean(CLARITY_PROJECT_ID);

/**
 * Marque un événement personnalisé dans Clarity (visible et filtrable dans le tableau de bord,
 * onglet Enregistrements → Filtres → Actions d'utilisateur → Événements intelligents).
 * Ne fait rien si le script Clarity n'est pas chargé (consentement refusé, ID absent, etc.).
 */
export function trackClarityEvent(name) {
  if (typeof window !== "undefined" && typeof window.clarity === "function") {
    window.clarity("event", name);
  }
}
