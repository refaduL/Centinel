"use client";

import { usePathname } from "next/navigation";
import Button from "@/components/ui/Button";
import {
  BRAND_EMAIL,
  BRAND_NAME,
  BRAND_PHONE,
  BRAND_PHONE_HREF,
  BRAND_TAGLINE,
} from "@/lib/brand";
import { BRAND_ORIGIN } from "@/lib/products";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

// Category links kept in sync with the taxonomy in data/products.json
const COLUMNS = [
  {
    heading: "Shop",
    links: [
      { label: "All products", href: "/products" },
      { label: "Lamps", href: "/products?category=lamps" },
      { label: "Decor", href: "/products?category=decor" },
      { label: "Dining", href: "/products?category=dining" },
    ],
  },
  {
    heading: "Studio",
    links: [
      { label: "Our story", href: "/#manifesto" },
      { label: "Contact us", href: "/contact" },
    ],
  },
];

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
];

export default function Footer() {
  const pathname = usePathname();

  // Checkout intentionally has no footer at all — a focused,
  // distraction-free checkout (fewer places to click away from the
  // purchase) is a deliberate, common e-commerce pattern, not an
  // oversight. Returning null here (rather than, say, an empty
  // fragment) means nothing renders, no wrapper markup left behind.
  if (pathname.startsWith("/checkout")) return null;

  // bg-clay only on the homepage, where it's the same color
  // JoinMailingList uses right above it — bg-sand everywhere else, so
  // the footer doesn't clash with whatever a given page's own bottom
  // section happens to be (e.g. bg-sand is already the /products and
  // /contact page backgrounds).
  const isHomepage = pathname === "/";
  const bgClass = isHomepage ? "bg-clay" : "bg-sand";

  return (
    <footer className={`w-full ${bgClass} px-3 pb-3 pt-20 sm:px-5 sm:pb-5 sm:pt-24`}>
      {/* =========================================================
          FOOTER CARD
         ========================================================= */}
      <div className="relative mx-auto max-w-7xl rounded-[2rem] bg-ink text-cream sm:rounded-[2.5rem]">
        {/* =======================================================
            LOGO
            Large mark crossing the top edge, just like reference
           ======================================================= */}
        <div className="absolute left-1/2 top-0 z-20 -translate-x-1/2 -translate-y-[52%]">
          <div className="flex h-20 w-20 items-center justify-center sm:h-24 sm:w-24">
            <Image
              src="/images/brand/logo.jpeg"
              alt=""
              width={96}
              height={96}
              className="h-full w-full object-contain"
            />
          </div>
        </div>

        {/* =======================================================
            SUBTLE CONTOUR BACKGROUND
           ======================================================= */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem] opacity-[0.075] sm:rounded-[2.5rem]"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1200 520"
            preserveAspectRatio="none"
          >
            <path
              d="M-100 95 C 100 5, 260 175, 450 85 S 800 10, 1300 120"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 125 C 100 35, 260 205, 450 115 S 800 40, 1300 150"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 155 C 100 65, 260 235, 450 145 S 800 70, 1300 180"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 185 C 100 95, 260 265, 450 175 S 800 100, 1300 210"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 215 C 100 125, 260 295, 450 205 S 800 130, 1300 240"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 245 C 100 155, 260 325, 450 235 S 800 160, 1300 270"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
            <path
              d="M-100 275 C 100 185, 260 355, 450 265 S 800 190, 1300 300"
              fill="none"
              stroke="#F4E5D4"
              strokeWidth="1"
            />
          </svg>
        </div>

        <div className="relative px-6 pb-5 pt-14 sm:px-10 sm:pb-6 sm:pt-16 lg:px-12">
          {/* =======================================================
              CENTER BRAND AREA
              This intentionally follows the reference:
              brand → tagline → buttons
             ======================================================= */}
          <div className="flex flex-col items-center text-center">
            <h2 className="font-display text-4xl leading-[0.9] tracking-tight text-cream sm:text-5xl md:text-6xl">
              {BRAND_NAME}
            </h2>

            <p className="mt-3 text-sm italic text-cream/60 sm:text-base">
              {BRAND_TAGLINE}
            </p>

            {/* Reference-style pill buttons */}
            <div className="mt-6 flex items-center justify-center gap-2">
              <Button href="/products" variant="inverse" size="sm">
                Shop collection
              </Button>

              <Button href="/contact" variant="inverse" size="sm">
                Get in touch
              </Button>
            </div>
          </div>

          {/* =======================================================
              LOWER CONTENT
              Left = Contact + socials
              Right = Quick links
             ======================================================= */}
          <div className="mt-12 grid grid-cols-2 gap-10 border-t border-cream/10 pt-8 sm:grid-cols-3 sm:gap-12">
            {/* CONTACT */}
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream/45">
                FIND US
              </p>

              <ul className="mt-3 space-y-1.5">
                <li>
                  <a
                    href={`mailto:${BRAND_EMAIL}`}
                    className="group inline-flex items-center gap-1.5 text-xs text-cream/75 transition-colors hover:text-flame sm:text-sm"
                  >
                    {BRAND_EMAIL}
                    <ArrowUpRight
                      size={12}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>

                <li>
                  <a
                    href={BRAND_PHONE_HREF}
                    className="group inline-flex items-center gap-1.5 text-xs text-cream/75 transition-colors hover:text-flame sm:text-sm"
                  >
                    {BRAND_PHONE}
                    <ArrowUpRight
                      size={12}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                </li>

                <li className="text-xs text-cream/45 sm:text-sm">
                  {BRAND_ORIGIN}
                </li>
              </ul>
            </div>

            {/* FOLLOW */}
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream/45">
                STALK US
              </p>

              <ul className="mt-3 space-y-1.5">
                {SOCIALS.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group inline-flex items-center gap-1.5 text-xs text-cream/75 transition-colors hover:text-flame sm:text-sm"
                    >
                      {social.label}
                      <ArrowUpRight
                        size={12}
                        className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* QUICK LINKS */}
            <div className="col-span-2 sm:col-span-1 sm:justify-self-end sm:min-w-[220px]">
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-cream/45">
                Quick links
              </p>

              <div className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2">
                {COLUMNS.flatMap((column) => column.links).map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="group inline-flex items-center gap-1 text-xs text-cream/75 transition-colors hover:text-flame sm:text-sm"
                  >
                    {link.label}
                    <ArrowUpRight
                      size={12}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* =======================================================
              BOTTOM LEGAL BAR
             ======================================================= */}
          <div className="mt-8 flex flex-row items-center justify-end gap-4 border-t border-cream/10 pt-5 text-[9px] text-cream/35">
            <a
              href="/privacy"
              className="transition-colors hover:text-cream/60"
            >
              Privacy policy
            </a>

            <a href="/terms" className="transition-colors hover:text-cream/60">
              Terms
            </a>

            <p>
              © {new Date().getFullYear()} {BRAND_NAME}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
