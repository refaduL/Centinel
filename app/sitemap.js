import { getAllProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/brand";

/**
 * Next.js's file-based convention — this is picked up automatically
 * at /sitemap.xml, no manual registration needed. Product entries are
 * generated from getAllProducts() rather than hardcoded, so adding a
 * product to data/products.json means it's in the sitemap on the next
 * build with no changes here.
 *
 * SITE_URL (lib/brand.js) needs to be the real production domain for
 * this to be useful to search engines — it's a placeholder until you
 * set NEXT_PUBLIC_SITE_URL or update the fallback there.
 */
export default function sitemap() {
  const staticRoutes = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/products", priority: 0.9, changeFrequency: "weekly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
  ].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productRoutes = getAllProducts().map((product) => ({
    url: `${SITE_URL}/products/${product.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...productRoutes];
}
