import { NextResponse } from "next/server";
import { getShopifyProductByHandle, shopifyEnabled } from "@/lib/shopify";

export async function GET(request, { params }) {
  if (!shopifyEnabled) {
    return NextResponse.json({ error: "Shopify n'est pas configuré." }, { status: 503 });
  }
  const { handle } = await params;
  try {
    const product = await getShopifyProductByHandle(handle);
    if (!product) return NextResponse.json({ error: "Produit introuvable." }, { status: 404 });
    return NextResponse.json({ product });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
