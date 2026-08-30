import Link from "next/link";
import Image from "next/image";
import { CameraIcon } from "./Icons";

export default function CategoryGrid({ title, categories }) {
  return (
    <section className="section">
      <h2 className="section-title">{title}</h2>
      <div className="categories-grid">
        {categories.map((cat) => (
          <Link key={cat.id} className="category-card" href={`/produits/${cat.slug}`}>
            {cat.image?.url ? (
              <Image
                src={cat.image.url}
                alt={cat.image.alt || cat.name}
                fill
                sizes="(max-width: 960px) 100vw, 33vw"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <span className="category-card-placeholder">
                <CameraIcon />
              </span>
            )}
            <span className="category-card-overlay" aria-hidden="true" />
            <h3>{cat.name}</h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
