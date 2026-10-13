"use client";

import Link from "next/link";
import Image from "next/image";
import { CameraIcon } from "./Icons";
import TrustRating from "./TrustRating";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { productPath } from "@/lib/productUrl";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.find((img) => img.url && img.type !== "video")?.url;
  const hasDiscount = product.compareAtPrice > product.price;
  const discountPct = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;

  function handleAdd(e) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: image || "",
      variant: product.variants?.[0]?.name || "",
      source: product.source,
      shopifyVariantId: product.shopifyVariantId,
    });
  }

  const href = productPath(product);
  const savings = hasDiscount ? product.compareAtPrice - product.price : 0;

  return (
    <article className="product-card">
      <Link className="product-thumb" href={href} tabIndex={-1} aria-hidden="true">
        <span className="product-badges">
          {product.isBestSeller ? <span className="badge">Best-seller</span> : null}
          {hasDiscount ? (
            <span className="badge badge-discount">-{discountPct}%</span>
          ) : product.isPromo ? (
            <span className="badge badge-promo">Promo</span>
          ) : null}
        </span>
        {image ? (
          <Image
            src={image}
            alt={product.images.find((i) => i.url === image)?.alt || product.name}
            fill
            sizes="(max-width: 640px) 45vw, 280px"
            style={{ objectFit: "contain" }}
          />
        ) : (
          <CameraIcon strokeWidth="1.1" />
        )}
      </Link>
      <div className="product-body">
        <h3>
          <Link href={href}>{product.name}</Link>
        </h3>
        <TrustRating average={product.rating?.average || 0} count={product.rating?.count || 0} size="sm" />
        <div className="product-card-bottom">
          <div className="price">
            {formatPrice(product.price)}
            {hasDiscount ? <span className="compare">{formatPrice(product.compareAtPrice)}</span> : null}
          </div>
          {savings >= 1 ? <span className="product-savings">Économisez {formatPrice(savings)}</span> : null}
        </div>
        <button className="btn btn-dark btn-block btn-sm" onClick={handleAdd}>
          Ajouter au panier
        </button>
      </div>
    </article>
  );
}
