import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, firebaseEnabled } from "@/lib/firebase";
import { recordInboundEmail } from "@/lib/supportThreads";
import { sendEmail, emailEnabled } from "@/lib/email";
import { getSettings } from "@/lib/settings";

// Formulaire de la page /contact. Le message est rangé dans Admin → Messages clients (un fil par
// adresse e-mail, comme un e-mail reçu : on y répond depuis l'admin) et une copie part par e-mail
// à l'adresse de Réglages → Légal, pour être prévenu tout de suite.
export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège invisible : rempli = robot. On répond "ok" sans rien enregistrer.
  if (body.website) return NextResponse.json({ ok: true });

  const name = clean(body.name, 80);
  const email = clean(body.email, 120).toLowerCase();
  const subject = clean(body.subject, 80) || "Message depuis le site";
  const order = clean(body.order, 40);
  const message = String(body.message || "").trim().slice(0, 5000);

  if (!name) return NextResponse.json({ error: "Indiquez votre nom." }, { status: 400 });
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }
  if (message.length < 5) return NextResponse.json({ error: "Votre message est vide." }, { status: 400 });

  const fullSubject = `[Contact] ${subject}${order ? ` · commande ${order}` : ""}`;
  const text = `${message}\n\n—\n${name} <${email}>${order ? `\nCommande : ${order}` : ""}`;
  const html = `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p style="color:#666">— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;${
    order ? `<br>Commande : ${escapeHtml(order)}` : ""
  }</p>`;

  let stored = false;
  if (firebaseEnabled && process.env.CRON_ADMIN_EMAIL && process.env.CRON_ADMIN_PASSWORD) {
    try {
      // supportThreads est réservé à l'admin (firestore.rules) : même compte que le webhook Resend.
      await signInWithEmailAndPassword(auth, process.env.CRON_ADMIN_EMAIL, process.env.CRON_ADMIN_PASSWORD);
      await recordInboundEmail({ from: `${name} <${email}>`, subject: fullSubject, html, text });
      stored = true;
    } catch (err) {
      console.error("[contact] enregistrement dans Messages clients impossible :", err.message);
    }
  }

  let mailed = false;
  if (emailEnabled) {
    const legal = await getSettings("legal");
    if (legal.email) {
      const res = await sendEmail({
        to: legal.email,
        subject: fullSubject,
        html: `${html}<p style="color:#666;font-size:13px">Répondez depuis Admin → Messages clients${
          stored ? "" : " (attention : ce message n'a pas pu y être enregistré, répondez directement à " + escapeHtml(email) + ")"
        }.</p>`,
      });
      mailed = !res.error && !res.skipped;
    }
  }

  if (!stored && !mailed) {
    return NextResponse.json(
      { error: "L'envoi a échoué. Réessayez dans un instant ou écrivez-nous directement par e-mail." },
      { status: 503 }
    );
  }
  return NextResponse.json({ ok: true });
}

function clean(value, max) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim().slice(0, max);
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
