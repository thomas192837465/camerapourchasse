import { NextResponse } from "next/server";
import { getShopifyProductContent } from "@/lib/shopifyContent";
import { getBundledVariant } from "@/lib/products";

// Suggestion de carte SD (ou tout autre produit "pack") pour un produit ajouté au panier SANS
// passer par le sélecteur de la fiche produit (ex : "Ajouter au panier" depuis une page catégorie)
// — utilisé par le panier latéral pour proposer le même complément que sur la fiche produit.
// Lit directement l'overlay de contenu Shopify (lecture publique, sûre même si le produit
// n'existe pas) plutôt que getProductById, qui plante sur un produit Shopify (voir lib/products.js).
export async function GET(request) {
  const productId = request.nextUrl.searchParams.get("productId");
  if (!productId) {
    return NextResponse.json({ bundle: null });
  }

  try {
    const content = await getShopifyProductContent(productId);
    const bundle = await getBundledVariant(content.pack);
    return NextResponse.json({ bundle });
  } catch (err) {
    console.error("Échec de la suggestion de carte SD :", err);
    return NextResponse.json({ bundle: null });
  }
}
