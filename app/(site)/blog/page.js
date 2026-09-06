import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import BlogCard from "@/components/BlogCard";

export async function generateMetadata() {
  return {
    title: "Blog",
    description: "Conseils, guides et actualités sur les caméras de chasse : autonomie, installation, réglementation.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogIndexPage() {
  const posts = await getPublishedPosts();

  return (
    <main className="container">
      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <span className="current">Blog</span>
      </nav>

      <h1 className="listing-title">Blog</h1>

      {posts.length ? (
        <div className="blog-grid">
          {posts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p style={{ color: "var(--ink-soft)" }}>Aucun article pour le moment.</p>
      )}
    </main>
  );
}
