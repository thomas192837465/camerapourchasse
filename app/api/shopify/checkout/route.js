import { NextResponse } from "next/server";
import { createShopifyCheckoutUrl, shopifyEnabled } from "@/lib/shopify";

export async function POST(request) {
  if (!shopifyEnabled) {
    return NextResponse.json({ error: "Shopify n'est pas configuré." }, { status: 503 });
  }

  const { lines } = await request.json();
  if (!Array.isArray(lines) || !lines.length || lines.some((l) => !l.variantId || !l.quantity)) {
    return NextResponse.json({ error: "Panier invalide." }, { status: 400 });
  }

  try {
    const checkoutUrl = await createShopifyCheckoutUrl(lines);
    return NextResponse.json({ checkoutUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
