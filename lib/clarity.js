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
