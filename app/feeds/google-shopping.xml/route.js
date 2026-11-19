import { getPublishedProducts } from "@/lib/products";
import { productPath } from "@/lib/productUrl";

// Régénère le flux au maximum toutes les heures (comme votre sitemap)
export const revalidate = 3600;

/** Échappe les caractères spéciaux XML (&, <, >, ", ') */
function escapeXml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Nettoie les balises HTML éventuelles de la description */
function stripHtml(html) {
  if (!html) return "";
  return String(html)
    .replace(/<[^>]*>?/gm, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** S'assure que l'URL d'image est complète (https://...) et exploitable par Google */
function normalizeImageUrl(url, base) {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return `${base}${trimmed.startsWith("/") ? "" : "/"}${trimmed}`;
}

export async function GET() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://camerapourchasse.fr").replace(/\/$/, "");

  // Récupère tous vos produits publiés (Firestore natifs + produits Shopify fusionnés)
  const products = await getPublishedProducts({});

  const itemsXml = products
    .map((p) => {
      // 1. Extraction de toutes les photos (en excluant les vidéos)
      const rawImages = Array.isArray(p.images) ? p.images : [];
      const photoUrls = rawImages
        .filter((img) => {
          if (!img) return false;
          if (typeof img === "string") return true;
          return img.type !== "video" && Boolean(img.url);
        })
        .map((img) => (typeof img === "string" ? img : img.url))
        .map((url) => normalizeImageUrl(url, base))
        .filter(Boolean);

      // Google Merchant refuse tout produit sans photo : on ignore le produit s'il n'en a pas
      if (photoUrls.length === 0) return "";

      // Photo principale + jusqu'à 10 photos secondaires autorisées par Google
      const mainImage = photoUrls[0];
      const additionalImages = photoUrls.slice(1, 11);

      // 2. Préparation des champs obligatoires Google Merchant
      const id = escapeXml(p.sku || p.id);
      const title = escapeXml((p.name || "Produit").slice(0, 150));
      const rawDesc = stripHtml(p.description || p.shortDescription || p.name || "");
      const description = escapeXml(rawDesc.slice(0, 5000));
      const link = escapeXml(`${base}${productPath(p)}`);

      // Gestion du prix et d'éventuelles promotions (sale_price)
      const hasSale =
        typeof p.compareAtPrice === "number" &&
        typeof p.price === "number" &&
        p.compareAtPrice > p.price;

      const regularPrice = hasSale ? p.compareAtPrice : p.price;
      if (typeof regularPrice !== "number" || regularPrice <= 0) return "";

      const priceTag = `<g:price>${regularPrice.toFixed(2)} EUR</g:price>`;
      const salePriceTag = hasSale
        ? `\n      <g:sale_price>${p.price.toFixed(2)} EUR</g:sale_price>`
        : "";

      // Disponibilité (si stock absent/undefined sur certains produits, considéré en stock sauf si stock <= 0)
      const inStock = typeof p.stock === "number" ? p.stock > 0 : true;
      const availability = inStock ? "in_stock" : "out_of_stock";

      // Marque et code-barres (GTIN/EAN) si renseignés
      const brand = escapeXml(p.brand || p.marque || "Caméra Pour Chasse");
      const gtin = p.gtin || p.ean || p.barcode;
      const gtinTag = gtin ? `\n      <g:gtin>${escapeXml(gtin)}</g:gtin>` : "";

      // 3. Balises des photos secondaires
      const additionalImagesXml = additionalImages
        .map((imgUrl) => `\n      <g:additional_image_link>${escapeXml(imgUrl)}</g:additional_image_link>`)
        .join("");

      return `    <item>
      <g:id>${id}</g:id>
      <g:title>${title}</g:title>
      <g:description>${description}</g:description>
      <g:link>${link}</g:link>
      ${priceTag}${salePriceTag}
      <g:availability>${availability}</g:availability>
      <g:condition>new</g:condition>
      <g:brand>${brand}</g:brand>${gtinTag}
      <g:image_link>${escapeXml(mainImage)}</g:image_link>${additionalImagesXml}
    </item>`;
    })
    .filter(Boolean)
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
  <channel>
    <title>Caméra Pour Chasse - Catalogue</title>
    <link>${escapeXml(base)}</link>
    <description>Flux produits Google Merchant Center</description>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
    },
  });
}