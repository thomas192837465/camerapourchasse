import { NextResponse } from "next/server";
import { getShopifyProducts, shopifyEnabled } from "@/lib/shopify";

export async function GET() {
  if (!shopifyEnabled) {
    return NextResponse.json({ error: "Shopify n'est pas configuré." }, { status: 503 });
  }
  try {
    const products = await getShopifyProducts();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
