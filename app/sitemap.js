import { getPublishedProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";
import { getPublishedPosts } from "@/lib/posts";

// Sans ça, Next.js peut figer ce sitemap au moment du build sur Vercel : les produits/articles
// ajoutés ensuite depuis l'admin (sans nouveau déploiement) n'y apparaîtraient jamais.
// Régénéré au maximum toutes les heures, largement suffisant pour un sitemap.
export const revalidate = 3600;

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, categories, posts] = await Promise.all([
    getPublishedProducts({}),
    getCategories(),
    getPublishedPosts(),
  ]);

  const staticRoutes = ["", "/produits", "/blog", "/livraison", "/notre-histoire", "/mentions-legales", "/cgv"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const categoryRoutes = categories.map((c) => ({
    url: `${base}/produits/${c.slug}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/produits/${p.categoryId}/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt.seconds ? p.updatedAt.seconds * 1000 : p.updatedAt) : new Date(),
  }));

  const postRoutes = posts.map((p) => ({
    url: `${base}/blog/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes, ...postRoutes];
}
