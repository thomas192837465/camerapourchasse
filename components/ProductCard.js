"use client";

import Link from "next/link";
import { CameraIcon, StarRating } from "./Icons";
import { useCart } from "@/lib/cart-context";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const image = product.images?.find((img) => img.url)?.url;

  function handleAdd(e) {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: image || "",
      variant: product.variants?.[0]?.name || "",
    });
  }

  return (
    <article className="product-card">
      <Link className="product-thumb" href={`/produits/${product.slug}`}>
        {product.isBestSeller ? <span className="badge">Best-seller</span> : null}
        {image ? (
          <img src={image} alt={product.images.find((i) => i.url === image)?.alt || product.name} />
        ) : (
          <CameraIcon strokeWidth="1.1" />
        )}
      </Link>
      <div className="product-body">
        <h3>
          <Link href={`/produits/${product.slug}`}>{product.name}</Link>
        </h3>
        <StarRating average={product.rating?.average} count={product.rating?.count} />
        <div className="price">
          €{product.price.toFixed(2).replace(".", ",")}
          {product.compareAtPrice ? (
            <span className="compare">€{product.compareAtPrice.toFixed(2).replace(".", ",")}</span>
          ) : null}
        </div>
        <button className="btn btn-primary btn-block btn-sm" onClick={handleAdd}>
          Ajouter au Panier
        </button>
      </div>
    </article>
  );
}
