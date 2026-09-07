import Link from "next/link";
import { getPublishedPosts, getCategoryCounts } from "@/lib/posts";
import { getSettings } from "@/lib/settings";
import BlogCard from "@/components/BlogCard";
import BlogSidebar from "@/components/BlogSidebar";

const PAGE_SIZE = 5;

// Évite que cette page reste figée sur une version mise en cache au moment du build (voir
// app/(site)/page.js) : un article publié depuis l'admin doit apparaître sans nouveau déploiement.
export const revalidate = 60;

export async function generateMetadata() {
  return {
    title: "Blog",
    description: "Conseils, guides et actualités sur les caméras de chasse : autonomie, installation, réglementation.",
    alternates: { canonical: "/blog" },
  };
}

export default async function BlogIndexPage({ searchParams }) {
  const sp = await searchParams;
  const search = (sp?.q || "").trim();
  const page = Math.max(1, Number(sp?.page) || 1);

  const [allPosts, content] = await Promise.all([getPublishedPosts(), getSettings("content")]);

  const categories = getCategoryCounts(allPosts);
  const recentPosts = allPosts.slice(0, 3);

  const filtered = search
    ? allPosts.filter((p) => {
        const haystack = `${p.title} ${p.excerpt} ${p.category}`.toLowerCase();
        return haystack.includes(search.toLowerCase());
      })
    : allPosts;

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pagePosts = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const [featuredPost, ...restPosts] = pagePosts;

  function pageHref(n) {
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (n > 1) params.set("page", String(n));
    const qs = params.toString();
    return `/blog${qs ? `?${qs}` : ""}`;
  }

  return (
    <>
      <div className="container">
        <nav className="breadcrumb">
          <Link href="/">Accueil</Link>
          <span className="sep">/</span>
          <span className="current">Blog</span>
        </nav>
      </div>

      <section className="blog-hero-band">
        <div className="container">
          <h1>{content.blogPageTitle}</h1>
          {content.blogPageSubtitle ? <p>{content.blogPageSubtitle}</p> : null}
        </div>
      </section>

      <main className="container blog-layout">
        <div className="blog-main">
          {search ? (
            <p className="blog-search-status">
              Résultats pour « {search} » ({filtered.length})
            </p>
          ) : null}

          {pagePosts.length ? (
            <>
              {featuredPost ? <BlogCard post={featuredPost} featured /> : null}
              {restPosts.length ? (
                <div className="blog-grid">
                  {restPosts.map((post) => (
                    <BlogCard key={post.id} post={post} />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <p style={{ color: "var(--ink-soft)" }}>
              {search ? "Aucun article ne correspond à cette recherche." : "Aucun article pour le moment."}
            </p>
          )}

          {pageCount > 1 ? (
            <div className="pagination">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Link key={n} href={pageHref(n)} className={n === currentPage ? "active" : ""}>
                  {n}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <BlogSidebar categories={categories} recentPosts={recentPosts} newsletterTitle={content.newsletterTitle} />
      </main>
    </>
  );
}
