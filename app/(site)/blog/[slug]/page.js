import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, formatPostDate } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import ContentBlocks from "@/components/ContentBlocks";
import BlogToc from "@/components/BlogToc";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const image = post.seo?.featuredImage?.url || post.coverImage?.url;

  return {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: image ? [image] : [],
      type: "article",
    },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const seo = await getSettings("seo");
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const image = post.seo?.featuredImage?.url || post.coverImage?.url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: image ? [image] : undefined,
    datePublished: post.publishedAt || undefined,
    dateModified: post.updatedAt || post.publishedAt || undefined,
    author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: seo.siteTitle },
    publisher: { "@type": "Organization", name: seo.siteTitle },
    mainEntityOfPage: postUrl,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: postUrl },
    ],
  };

  return (
    <main className="container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      <nav className="breadcrumb">
        <Link href="/">Accueil</Link>
        <span className="sep">/</span>
        <Link href="/blog">Blog</Link>
        <span className="sep">/</span>
        <span className="current">{post.title}</span>
      </nav>

      <article className="blog-article">
        <h1 className="listing-title">{post.title}</h1>
        <p className="blog-article-meta">
          {post.author ? <span>{post.author}</span> : null}
          {post.publishedAt ? <span>{formatPostDate(post.publishedAt)}</span> : null}
        </p>

        {post.coverImage?.url ? (
          <div className="blog-cover">
            <Image
              src={post.coverImage.url}
              alt={post.coverImage.alt || post.title}
              fill
              sizes="(max-width: 960px) 100vw, 900px"
              style={{ objectFit: "cover" }}
              priority
            />
          </div>
        ) : null}

        <BlogToc blocks={post.blocks} />

        <ContentBlocks blocks={post.blocks} />
      </article>
    </main>
  );
}
