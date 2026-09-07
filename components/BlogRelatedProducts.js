import Link from "next/link";
import Image from "next/image";
import TrustRating from "./TrustRating";
import { CameraIcon, ChevronRightIcon } from "./Icons";

export default function BlogRelatedProducts({ products }) {
  if (!products?.length) return null;

  return (
    <div className="blog-sidebar-card">
      <h3>Produits recommandés</h3>
      <div className="blog-sidebar-products">
        {products.map((product) => {
          const image = product.images?.find((img) => img.url)?.url;
          return (
            <Link
              key={product.id}
              href={`/produits/${product.categoryId}/${product.slug}`}
              className="blog-sidebar-product"
            >
              <span className="blog-sidebar-product-thumb">
                {image ? (
                  <Image src={image} alt={product.name} fill sizes="56px" style={{ objectFit: "cover" }} />
                ) : (
                  <CameraIcon strokeWidth="1.1" />
                )}
              </span>
              <span className="blog-sidebar-product-body">
                <TrustRating average={product.rating?.average || 0} count={product.rating?.count} showLabel={false} size="sm" />
                <strong>{product.name}</strong>
                <span className="blog-sidebar-product-price">€{product.price.toFixed(2).replace(".", ",")}</span>
              </span>
              <span className="blog-sidebar-product-arrow">
                <ChevronRightIcon />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
