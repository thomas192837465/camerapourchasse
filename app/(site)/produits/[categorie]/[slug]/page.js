import { notFound, permanentRedirect } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { productPath } from "@/lib/productUrl";

// Ancienne adresse des fiches (/produits/{catégorie}/{produit}) : redirection permanente vers
// l'adresse actuelle /produits/{produit}, pour garder les liens et le référencement existants.
export default async function LegacyProductUrl({ params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();
  permanentRedirect(productPath(product));
}
