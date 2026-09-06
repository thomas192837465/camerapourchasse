import Link from "next/link";
import Image from "next/image";
import { formatPostDate } from "@/lib/posts";
import { CameraIcon } from "./Icons";

export default function BlogCard({ post }) {
  return (
    <article className="blog-card">
      <Link className="blog-card-thumb" href={`/blog/${post.slug}`}>
        {post.coverImage?.url ? (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            style={{ objectFit: "cover" }}
          />
        ) : (
          <CameraIcon strokeWidth="1.1" />
        )}
      </Link>
      <div className="blog-card-body">
        {post.publishedAt ? <span className="blog-card-date">{formatPostDate(post.publishedAt)}</span> : null}
        <h3>
          <Link href={`/blog/${post.slug}`}>{post.title}</Link>
        </h3>
        {post.excerpt ? <p>{post.excerpt}</p> : null}
      </div>
    </article>
  );
}
