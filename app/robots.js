import { SITE_URL } from "@/lib/brand";

/**
 * Next.js's file-based convention — picked up automatically at
 * /robots.txt, no manual registration needed.
 *
 * /checkout is disallowed on purpose: it's a private, per-customer
 * flow with no content worth indexing, and there's no value in a
 * search result linking someone into the middle of someone else's
 * checkout session.
 */
export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
