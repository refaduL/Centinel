// The one place the brand name and tagline are defined. Every page's
// metadata, the navbar wordmark, and the footer all import from here
// rather than hardcoding the strings — change a rename to this file
// alone instead of hunting through every component.
export const BRAND_NAME = "Sentinel";
export const BRAND_TAGLINE = "Objects for your considered living";

// Used by app/sitemap.js, app/robots.js, and metadataBase/Open Graph
// tags in app/layout.js — replace with the real production domain
// before launch (or set NEXT_PUBLIC_SITE_URL as an env var, which
// takes priority over this fallback wherever it's read).
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://sentinel.example.com";

// Placeholder contact details — swap these for the real ones
// whenever you have them. Used by both Footer.jsx and the contact
// page, so there's one place to update rather than two.
export const BRAND_EMAIL = "hello@sentinel.shop";
export const BRAND_PHONE = "+880 1XXX-XXXXXX";
export const BRAND_PHONE_HREF = "tel:+8801XXXXXXXXX";
