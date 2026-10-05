import { ImageResponse } from "next/og";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

/**
 * Next.js's file-based convention — a file named opengraph-image.jsx
 * anywhere in app/ is automatically picked up and used for that route
 * segment's og:image (and its children, unless they define their own).
 * This one at the root is the sitewide fallback.
 *
 * Runs at request time via the Edge runtime and Satori (which is what
 * `next/og`'s ImageResponse uses under the hood) — note that Satori's
 * supported CSS is a constrained subset, not full Tailwind/CSS: plain
 * inline style objects only, no Tailwind classes, no CSS custom
 * properties. Colors are spelled out as literal hex values matching
 * tailwind.config.js's palette (sand/flame/ink) rather than reused
 * from there directly, since that file's tokens aren't accessible in
 * this constrained rendering context.
 */
export const alt = `${BRAND_NAME}: ${BRAND_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #E7D3C1 0%, #F4E5D4 50%, #E55A28 100%)",
        }}
      >
        <div
          style={{
            fontSize: 140,
            fontStyle: "italic",
            color: "#1A1A1A",
            fontFamily: "Georgia, serif",
          }}
        >
          {BRAND_NAME}
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 32,
            color: "#333333",
            letterSpacing: 4,
            textTransform: "uppercase",
          }}
        >
          {BRAND_TAGLINE}
        </div>
      </div>
    ),
    { ...size }
  );
}
