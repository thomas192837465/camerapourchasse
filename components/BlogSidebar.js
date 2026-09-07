import Link from "next/link";
import Image from "next/image";
import { formatPostDate } from "@/lib/posts";
import SearchBar from "./SearchBar";
import BlogNewsletterBox from "./BlogNewsletterBox";

export default function BlogSidebar({ categories, recentPosts, newsletterTitle }) {
  return (
    <aside className="blog-sidebar">
      <SearchBar placeholder="Rechercher un article..." />

      {categories.length ? (
        <div className="blog-sidebar-card">
          <h3>Catégories</h3>
          <ul className="blog-categories-list">
            {categories.map((cat) => (
              <li key={cat.name}>
                <Link href={`/blog?q=${encodeURIComponent(cat.name)}`}>
                  <span>{cat.name}</span>
                  <span className="blog-category-count">{cat.count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {recentPosts.length ? (
        <div className="blog-sidebar-card">
          <h3>Articles récents</h3>
          <ul className="blog-recent-list">
            {recentPosts.map((post) => (
              <li key={post.id}>
                <Link href={`/blog/${post.slug}`} className="blog-recent-thumb">
                  {post.coverImage?.url ? (
                    <Image src={post.coverImage.url} alt={post.coverImage.alt || post.title} fill sizes="56px" style={{ objectFit: "cover" }} />
                  ) : null}
                </Link>
                <div>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                  {post.publishedAt ? <span className="blog-recent-date">{formatPostDate(post.publishedAt)}</span> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <BlogNewsletterBox title={newsletterTitle} />
    </aside>
  );
}
