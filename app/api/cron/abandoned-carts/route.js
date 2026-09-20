import { NextResponse } from "next/server";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { getAbandonedCarts, markReminderSent } from "@/lib/cartRecovery";
import { sendEmail, emailEnabled } from "@/lib/email";
import { getSettings } from "@/lib/settings";

// Relance un panier "site" (/commande, hors Shopify) laissé sans commande depuis au moins 1h après
// que le client a saisi son e-mail — voir lib/cartRecovery.js pour pourquoi Shopify n'est pas
// concerné ici (il a son propre système natif de relance).
const ABANDONED_AFTER_MS = 60 * 60 * 1000;

// Déclenché par Vercel Cron (voir vercel.json) : Vercel ajoute automatiquement l'en-tête
// "Authorization: Bearer $CRON_SECRET" sur ces appels, ce qui empêche n'importe qui d'autre de
// déclencher l'envoi de relances en appelant cette URL.
export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }

  if (!emailEnabled) {
    return NextResponse.json({ error: "Resend n'est pas configuré (RESEND_API_KEY / RESEND_FROM_EMAIL)." }, { status: 503 });
  }

  const adminEmail = process.env.CRON_ADMIN_EMAIL;
  const adminPassword = process.env.CRON_ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return NextResponse.json({ error: "CRON_ADMIN_EMAIL / CRON_ADMIN_PASSWORD manquants." }, { status: 500 });
  }

  try {
    // Les paniers en cours ne sont lisibles que par un admin (voir firestore.rules) — on s'y
    // connecte avec un compte admin existant, comme scripts/publish-draft.mjs.
    await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

    const [carts, seo] = await Promise.all([getAbandonedCarts(ABANDONED_AFTER_MS), getSettings("seo")]);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

    let sent = 0;
    for (const cart of carts) {
      const itemsHtml = cart.items
        .map((it) => `<li>${it.qty} × ${it.name} — €${(it.qty * it.price).toFixed(2).replace(".", ",")}</li>`)
        .join("");

      const result = await sendEmail({
        to: cart.email,
        subject: "Vous avez oublié quelque chose dans votre panier",
        html: `
          <p>Bonjour,</p>
          <p>Vous avez laissé ces articles dans votre panier sur ${seo.siteTitle || "notre boutique"} :</p>
          <ul>${itemsHtml}</ul>
          <p><strong>Total : €${Number(cart.total).toFixed(2).replace(".", ",")}</strong></p>
          <p><a href="${siteUrl}/panier">Reprendre ma commande</a></p>
        `,
      });

      if (!result.error) {
        await markReminderSent(cart.id);
        sent += 1;
      }
    }

    await signOut(auth);
    return NextResponse.json({ checked: carts.length, sent });
  } catch (err) {
    return NextResponse.json({ error: err.message || "Échec de la tâche." }, { status: 500 });
  }
}
