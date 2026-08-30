import { getPublishedProducts } from "@/lib/products";
import { getCategories } from "@/lib/categories";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const [products, categories] = await Promise.all([getPublishedProducts({}), getCategories()]);

  const staticRoutes = ["", "/produits", "/mentions-legales", "/cgv"].map((path) => ({
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

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
