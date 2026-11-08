import Link from "next/link";
import Image from "next/image";
import TrustRating from "./TrustRating";
import { CameraIcon, ChevronRightIcon } from "./Icons";
import { formatPrice } from "@/lib/format";
import { productPath } from "@/lib/productUrl";

/**
 * Carte produit glissée dans le texte d'un article (bloc « Caméra » de l'admin, ou inséré
 * automatiquement entre les sections). Lien vers la fiche : c'est là que se choisissent pack et
 * carte SD. Textes (étiquette, bouton) modifiables dans Admin → Réglages → Contenu → Page "Blog".
 */
export default function ProductInlineCard({ product, note, label = "Notre sélection", cta = "Voir la caméra" }) {
  if (!product) return null;
  const href = productPath(product);
  const image = product.images?.find((img) => img.url && img.type !== "video");
  const hasDiscount = product.compareAtPrice > product.price;
  const text = note || product.shortDescription || "";

  return (
    <aside className="blog-product-card">
      <Link href={href} className="blog-product-card-media" tabIndex={-1} aria-hidden="true">
        {image ? (
          <Image src={image.url} alt={image.alt || product.name} fill sizes="(max-width: 640px) 100vw, 200px" style={{ objectFit: "contain" }} />
        ) : (
          <CameraIcon strokeWidth="1.1" />
        )}
      </Link>
      <div className="blog-product-card-body">
        {label ? <span className="blog-product-card-label">{label}</span> : null}
        <Link href={href} className="blog-product-card-name">
          {product.name}
        </Link>
        {product.rating?.count ? (
          <TrustRating average={product.rating.average || 0} count={product.rating.count} size="sm" />
        ) : null}
        {text ? <p className="blog-product-card-text">{text}</p> : null}
        <div className="blog-product-card-foot">
          <span className="blog-product-card-price">
            {formatPrice(product.price)}
            {hasDiscount ? <s>{formatPrice(product.compareAtPrice)}</s> : null}
          </span>
          <Link href={href} className="btn btn-primary btn-sm">
            {cta} <ChevronRightIcon />
          </Link>
        </div>
      </div>
    </aside>
  );
}
