import crypto from "node:crypto";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, setDoc, Timestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

// Vérifie la signature que Shopify appose sur chaque appel de webhook (en-tête
// X-Shopify-Hmac-Sha256 : HMAC-SHA256 du corps brut de la requête, encodé en base64), avec le
// "Webhook signing secret" affiché une seule fois dans Shopify → Réglages → Notifications.
function verifyShopifyHmac(secret, rawBody, hmacHeader) {
  if (!secret || !hmacHeader) return false;
  const digest = crypto.createHmac("sha256", secret).update(rawBody, "utf8").digest("base64");
  try {
    const a = Buffer.from(digest, "base64");
    const b = Buffer.from(hmacHeader, "base64");
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

function mapOrderToDoc(order) {
  const shipping = order.shipping_address || {};
  const shopifyCustomer = order.customer || {};

  const name =
    [shipping.first_name, shipping.last_name].filter(Boolean).join(" ") ||
    [shopifyCustomer.first_name, shopifyCustomer.last_name].filter(Boolean).join(" ") ||
    order.email ||
    "";

  const customer = {
    name,
    email: order.email || shopifyCustomer.email || "",
    phone: shipping.phone || shopifyCustomer.phone || order.phone || "",
    address: [shipping.address1, shipping.address2].filter(Boolean).join(" "),
    postalCode: shipping.zip || "",
    city: shipping.city || "",
    country: shipping.country || "",
  };

  const items = (order.line_items || []).map((li) => ({
    name: li.title || "",
    variant: li.variant_title || "",
    qty: li.quantity || 1,
    price: Number(li.price) || 0,
    productId: null,
  }));

  return {
    customer,
    items,
    total: Number(order.total_price) || 0,
    shopifyOrderId: order.id,
    source: "shopify",
  };
}

// Reçoit les commandes créées côté checkout Shopify et les recopie dans notre base (collection
// "orders") pour qu'elles apparaissent dans Admin → Commandes aux côtés de celles du formulaire du
// site — à configurer dans Shopify → Réglages → Notifications → Webhooks, événement "Création de
// commande", format JSON, avec cette URL.
export async function POST(request) {
  const rawBody = await request.text();
  const hmacHeader = request.headers.get("x-shopify-hmac-sha256");
  const topic = request.headers.get("x-shopify-topic");

  console.log("[shopify webhook] appel reçu, topic :", topic);

  if (!process.env.SHOPIFY_WEBHOOK_SECRET) {
    console.error("[shopify webhook] SHOPIFY_WEBHOOK_SECRET manquant.");
    return new Response("SHOPIFY_WEBHOOK_SECRET manquant.", { status: 500 });
  }

  if (!verifyShopifyHmac(process.env.SHOPIFY_WEBHOOK_SECRET, rawBody, hmacHeader)) {
    console.error("[shopify webhook] signature invalide.");
    return new Response("Signature invalide.", { status: 401 });
  }

  let order;
  try {
    order = JSON.parse(rawBody);
  } catch (err) {
    console.error("[shopify webhook] payload JSON invalide :", err.message);
    return new Response("Payload invalide.", { status: 400 });
  }

  if (!order?.id) {
    return new Response("ok");
  }

  try {
    await signInWithEmailAndPassword(auth, process.env.CRON_ADMIN_EMAIL, process.env.CRON_ADMIN_PASSWORD);

    const ref = doc(db, "orders", `shopify-${order.id}`);
    const existing = await getDoc(ref);
    const data = mapOrderToDoc(order);

    if (existing.exists()) {
      // Ne touche jamais status/shipping/userId ici : c'est le suivi géré à la main par l'admin
      // (voir app/admin/orders/[id]/page.js), qu'un renvoi du même webhook par Shopify ne doit pas écraser.
      await setDoc(ref, data, { merge: true });
    } else {
      await setDoc(ref, {
        ...data,
        status: "nouvelle",
        shipping: { carrier: "", trackingNumber: "", trackingUrl: "" },
        userId: null,
        createdAt: order.created_at ? Timestamp.fromDate(new Date(order.created_at)) : Timestamp.now(),
      });
    }
    console.log("[shopify webhook] orders/shopify-" + order.id + " enregistrée.");
  } catch (err) {
    console.error("[shopify webhook] échec de l'enregistrement :", err.message);
  }

  return new Response("ok");
}
