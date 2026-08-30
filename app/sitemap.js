import { getPublishedProducts } from "@/lib/products";

export default async function sitemap() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const products = await getPublishedProducts({});

  const staticRoutes = ["", "/produits"].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));

  const productRoutes = products.map((p) => ({
    url: `${base}/produits/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt.seconds ? p.updatedAt.seconds * 1000 : p.updatedAt) : new Date(),
  }));

  return [...staticRoutes, ...productRoutes];
}
