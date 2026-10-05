"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";
import { BRAND_NAME } from "@/lib/brand";

// Manually listed because each needs its own label + category filter
// link — unlike CategoryTabs (components/product/CategoryTabs.jsx),
// which derives its list automatically from whatever categories exist
// in products.json. If you add a new category (e.g. "outdoor"), add a
// matching entry here too so it gets its own nav link — this list is
// intentionally NOT auto-generated, since not every category
// necessarily deserves a permanent spot in the navbar.
//
// Every href here is an ABSOLUTE path ("/products?...", "/#manifesto")
// rather than a bare "#manifesto" — that's deliberate. A bare hash
// link only scrolls within the CURRENT page; clicked from /products,
// "#manifesto" does nothing, because there's no element with that id
// on that page. "/#manifesto" always navigates to the homepage first
// (or just scrolls, if you're already there) and then jumps to the
// section — the fix for the broken cross-page links.
const NAV_LINKS = [
  { label: "Lamps", href: "/products?category=lamps" },
  { label: "Decor", href: "/products?category=decor" },
  { label: "Dining", href: "/products?category=dining" },
];

/**
 * A wide floating bar, not a tiny hugging-content pill — `w-full
 * max-w-3xl` means it spans nearly the full available width (up to
 * the max) at every breakpoint, including mobile. That's the fix for
 * two things at once: it's what creates real negative space between
 * the logo (far left) and the icon cluster (far right) on desktop,
 * and it's what stops the mobile version looking sparse/unfinished —
 * previously the header had no explicit width, so on mobile (with
 * only a logo + 2 icons visible) it shrank to hug that little content
 * and floated as an oddly small, empty-looking chip instead of
 * reading as a proper navbar.
 *
 * Scroll behavior unchanged from before: only background-color and
 * box-shadow animate (never width/padding/radius, which would force
 * layout recalculation and was the old flicker source), with
 * hysteresis (on past 60px, off below 24px) so hovering near a single
 * threshold can't cause rapid toggling.
 */
export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount, openCart } = useCart();
  const tickingRef = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;
      requestAnimationFrame(() => {
        setIsScrolled((current) => {
          const y = window.scrollY;
          if (!current && y > 60) return true;
          if (current && y < 24) return false;
          return current;
        });
        tickingRef.current = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4 md:top-6">
      <header
        className={`pointer-events-auto flex w-full max-w-3xl items-center justify-between gap-4 rounded-full px-5 py-3 backdrop-blur-md transition-[background-color,box-shadow] duration-300 ease-light md:max-w-4xl md:px-8 md:py-4 ${
          isScrolled ? "bg-ink/95 shadow-lg" : "bg-ink/85 shadow-md"
        }`}
      >
        {/* Left: brand, on its own — the negative space to its right
            is deliberate, not a layout gap to be "fixed". */}
        <a href="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-cream">
            <Image
              src="/images/brand/logo.jpeg"
              alt=""
              width={32}
              height={32}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="font-display text-base tracking-tight text-paper md:text-lg">
            {BRAND_NAME}
          </span>
        </a>

        {/* Right: everything else, grouped together */}
        <div className="flex items-center gap-5 md:gap-8">
          <nav className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-paper/70 transition-colors hover:text-paper"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/#manifesto"
              className="ml-1 rounded-full border border-paper/25 px-3 py-1.5 text-sm text-paper/85 transition-colors hover:border-paper/50 hover:text-paper"
            >
              Our Story
            </a>
          </nav>

          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={openCart}
              aria-label={`Open cart, ${itemCount} item${itemCount === 1 ? "" : "s"}`}
              className="relative flex h-9 w-9 items-center justify-center text-paper/85 transition-colors hover:text-paper"
            >
              <ShoppingBag size={19} />
              {itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-flame text-[10px] font-medium text-ink">
                  {itemCount}
                </span>
              )}
            </button>

            <Button href="/products" size="sm" className="hidden md:inline-flex">
              Shop the collection
            </Button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="flex h-9 w-9 items-center justify-center text-paper/85 md:hidden"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <nav className="pointer-events-auto absolute left-4 right-4 top-full mt-2 rounded-2xl bg-ink/95 p-2 shadow-lg backdrop-blur-md md:hidden">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm text-paper/80 hover:bg-paper/10"
            >
              {link.label}
            </a>
          ))}
          <a
            href="/#manifesto"
            onClick={() => setMenuOpen(false)}
            className="block rounded-xl px-4 py-3 text-sm text-paper/80 hover:bg-paper/10"
          >
            Our Story
          </a>
          <a
            href="/products"
            onClick={() => setMenuOpen(false)}
            className="mt-1 block rounded-xl bg-flame px-4 py-3 text-center text-sm font-medium text-ink"
          >
            Shop the collection
          </a>
        </nav>
      )}
    </div>
  );
}
