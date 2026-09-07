import Link from "next/link";
import Image from "next/image";
import { formatPostDate } from "@/lib/posts";
import { CameraIcon } from "./Icons";

export default function BlogCard({ post, featured = false }) {
  return (
    <article className={`blog-card${featured ? " blog-card-featured" : ""}`}>
      <Link className="blog-card-thumb" href={`/blog/${post.slug}`}>
        {post.category ? <span className="blog-card-badge">{post.category}</span> : null}
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes={featured ? "(max-width: 768px) 100vw, 480px" : "(max-width: 640px) 100vw, 320px"}
            style={{ objectFit: "cover" }}
            priority={featured}
          />
        ) : (
          <CameraIcon strokeWidth="1.1" />
        )}
      </Link>
      <div className="blog-card-body">
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
        <div className="blog-card-footer">
          {post.publishedAt ? <span className="blog-card-date">{formatPostDate(post.publishedAt)}</span> : <span />}
          <Link href={`/blog/${post.slug}`} className="blog-card-link">
            Lire l'article →
          </Link>
        </div>
      </div>
    </article>
  );
}
