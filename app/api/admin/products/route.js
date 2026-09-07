import { NextResponse } from "next/server";
import { getPublishedProducts } from "@/lib/products";

// Le token Shopify est privé (server-only) : le picker de produits de l'admin (composant
// client) ne peut pas appeler getPublishedProducts() directement, il passe par cette route.
export async function GET() {
  try {
    const products = await getPublishedProducts();
    return NextResponse.json({ products });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
