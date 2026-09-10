import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  getPostBySlug,
  getPublishedPosts,
  formatPostDate,
  estimateReadingTime,
  getRelatedPosts,
  getManualRelatedPosts,
} from "@/lib/posts";
import { getProductsBySlugs } from "@/lib/products";
import { getSettings } from "@/lib/settings";
import { buildFaqJsonLd } from "@/lib/schema";
import { pageMetadata } from "@/lib/metadata";
import ContentBlocks from "@/components/ContentBlocks";
import BlogToc from "@/components/BlogToc";
import BlogCard from "@/components/BlogCard";
import BlogRelatedProducts from "@/components/BlogRelatedProducts";
import BlogAboutBox from "@/components/BlogAboutBox";
import { CalendarIcon, ClockIcon, UserIcon } from "@/components/Icons";

export const revalidate = 60;

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const image = post.seo?.featuredImage?.url || post.coverImage?.url;

  return pageMetadata(`/blog/${post.slug}`, {
    title: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    images: image ? [image] : undefined,
    type: "article",
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const [seo, content, allPosts, relatedProducts] = await Promise.all([
    getSettings("seo"),
    getSettings("content"),
    getPublishedPosts(),
    getProductsBySlugs(post.relatedProductSlugs),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const postUrl = `${siteUrl}/blog/${post.slug}`;
  const image = post.seo?.featuredImage?.url || post.coverImage?.url;
  const readingTime = estimateReadingTime(post.blocks);
  const relatedPosts = getManualRelatedPosts(allPosts, post.relatedPostIds) || getRelatedPosts(allPosts, post, 3);

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

  const faqJsonLd = buildFaqJsonLd(post.blocks);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}

      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="sep">/</span>
          <Link href="/blog">Blog</Link>
          <span className="sep">/</span>
          <span className="current">{post.title}</span>
        </nav>
      </div>

      <main className="container blog-layout">
        <article className="blog-main blog-article">
          {post.category ? <span className="blog-category-badge">{post.category}</span> : null}
          <h1 className="listing-title">{post.title}</h1>
          <p className="blog-article-meta">
            {post.publishedAt ? (
              <span>
                <CalendarIcon /> {formatPostDate(post.publishedAt)}
              </span>
            ) : null}
            <span>
              <ClockIcon /> {readingTime} min de lecture
            </span>
            {post.author ? (
              <span>
                <UserIcon /> Par {post.author}
              </span>
            ) : null}
          </p>

          {post.coverImage?.url ? (
            <div className="blog-cover">
              <Image
                src={post.coverImage.url}
                alt={post.coverImage.alt || post.title}
                fill
                sizes="(max-width: 960px) 100vw, 800px"
                style={{ objectFit: "cover" }}
                priority
              />
            </div>
          ) : null}

          <ContentBlocks blocks={post.blocks} />

          {relatedPosts.length ? (
            <section className="blog-related-articles">
              <h2 className="reco-title">Articles similaires</h2>
              <div className="blog-grid">
                {relatedPosts.map((p) => (
                  <BlogCard key={p.id} post={p} />
                ))}
              </div>
            </section>
          ) : null}
        </article>

        <aside className="blog-sidebar">
          <BlogToc blocks={post.blocks} />
          <BlogRelatedProducts products={relatedProducts} />
          <BlogAboutBox title={content.blogAboutTitle} text={content.blogAboutText} />
        </aside>
      </main>
    </>
  );
}
