import { Fraunces, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/components/cart/CartContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { BRAND_NAME, BRAND_TAGLINE, SITE_URL } from "@/lib/brand";
import "./globals.css";

// Display serif — warm, slightly irregular, carries the brand's
// personality in every headline. Body stays quiet in Inter so the
// serif is the only "loud" typographic choice on the page.
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-body",
  display: "swap",
});

const DESCRIPTION =
  "Lamps and ceramics designed around one idea: the light changes everything. Hand-finished pieces for the hours between daylight and dark.";

// Page <title>/<meta> tags default to these; individual pages
// override `title` in their own metadata export (see
// app/products/page.js etc.) but should keep reusing BRAND_TAGLINE/
// DESCRIPTION rather than writing a new one each time.
//
// `metadataBase` is required for Next.js to resolve the relative
// openGraph/twitter image paths below into the absolute URLs social
// platforms need — it reads SITE_URL from lib/brand.js, so fixing
// that one constant (or setting NEXT_PUBLIC_SITE_URL) fixes every
// page's social preview at once. `opengraph-image.jsx` in this same
// folder is what actually renders the image being pointed to.
export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
  description: DESCRIPTION,
  icons: {
    icon: "/icon.jpeg",
  },
  openGraph: {
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: BRAND_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <CartProvider>
          <Navbar />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>
        {/* Vercel Analytics — page views + the track() calls scattered
            through the cart/checkout/form components (search for
            `import { track }` to find them all). Needs zero setup or
            site ID IF this is deployed on Vercel; it auto-associates
            with the deployment itself. If you're hosting elsewhere,
            this component silently does nothing — swap it for
            Plausible/GA4/PostHog/etc. instead, whichever you prefer,
            and update the `track()` calls to that provider's API
            (they're a small, deliberately isolated set of calls, not
            spread through business logic). */}
        <Analytics />
      </body>
    </html>
  );
}
