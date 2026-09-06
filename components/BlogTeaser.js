import Link from "next/link";
import BlogCard from "./BlogCard";

// Bande "derniers articles" affichée en bas de chaque page, juste au-dessus du pied de page —
// alimentée automatiquement par les 3 derniers articles publiés (aucun contenu à maintenir à la main).
export default function BlogTeaser({ posts }) {
  if (!posts?.length) return null;

  return (
    <section className="section blog-teaser">
      <div className="container">
        <div className="section-head-row">
          <h2 className="section-title">Nos derniers articles</h2>
          <Link href="/blog" className="blog-teaser-link">
            Voir tout le blog →
          </Link>
        </div>
        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
