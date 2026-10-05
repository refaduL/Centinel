"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus, Check } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Two variants, one component:
 *
 * "compact" (default) — the homepage showcase. Redesigned around one
 * device borrowed from the featured strip's "Batch No." motif: a
 * large, faint index number in normal flow just above each card, like
 * a lookbook's numbered plates, with a slight negative margin so the
 * card tucks up under the number's baseline rather than just sitting
 * below it with a plain gap. It's not decoration for its own sake —
 * it's the same edition-numbering idea used elsewhere on the site
 * (see getBatchLabel() in lib/products.js), just rendered as a visual
 * instead of text. Combined with a framed card (soft shadow, hover
 * lift) and a colored category badge instead of plain uppercase text,
 * this is meant to be the site's most visually confident grid — the
 * "rich" catalog-page cards intentionally stay calmer since they're
 * carrying more information (description, two actions) already.
 *
 * "rich" — the /products catalog page, styled after the "CATALOG"
 * card reference: a soft card (not the hard-shadow button style —
 * that's intentionally reserved for buttons only, so it still stands
 * out against a calmer card), name in the accent color, a price pill,
 * a short description, and two actions side by side.
 *
 * The compact variant's root `<article>` carries `id={`product-${id}`}`
 * — that's the scroll target the homepage's magnet-board Hero uses:
 * clicking one of its product pieces sends it tumbling off the board
 * (see DraggablePin.jsx's `fallToId`), then `lib/fallToProduct.js`
 * scrolls straight to that exact card here (not just the section in
 * general) and gives it a brief highlight pulse. `scroll-mt-28`
 * alongside the id keeps the fixed navbar from covering the card once
 * scrolled there.
 *
 * `line-clamp-1` on the name in BOTH variants is a deliberate fix, not
 * decoration — long names were wrapping to 2–3 lines on narrow mobile
 * cards and breaking the layout. This guarantees one line and an
 * ellipsis instead, no matter how long a future product name is.
 *
 * Both variants' cart button reflect actual cart state via
 * `isInCart()` rather than always reading "Add to cart" regardless of
 * whether it's already there — once added, it switches to "Remove
 * from cart" (which removes the whole line for that product; the
 * quantity stepper on the product detail page is the place for finer
 * control than a single unit).
 */
export default function ProductCard({ product, variant = "compact", index = 0 }) {
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  if (variant === "rich") {
    return (
      <article className="flex flex-col rounded-2xl bg-cream p-4 shadow-md">
        <Link href={`/products/${product.id}`} className="block">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-sand">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        </Link>

        <div className="mt-4 flex-1">
          <Link href={`/products/${product.id}`}>
            <h3 className="line-clamp-1 font-display text-lg text-flame">{product.name}</h3>
          </Link>
          <span className="mt-1.5 inline-block rounded-full bg-ink px-3 py-1 text-xs font-medium text-cream">
            {formatPrice(product.price, product.currency)}
          </span>
          <p className="mt-3 line-clamp-2 text-sm text-charcoal">{product.description}</p>
        </div>

        <div className="mt-4 flex gap-2">
          <Button
            variant={inCart ? "secondary" : "primary"}
            size="sm"
            onClick={() => (inCart ? removeItem(product.id) : addItem(product.id))}
            className="flex-1"
          >
            {inCart ? "Remove from cart" : "Add to cart"}
          </Button>
          <Button href={`/products/${product.id}`} variant="secondary" size="sm" className="flex-1">
            Details
          </Button>
        </div>
      </article>
    );
  }

  return (
    <article id={`product-${product.id}`} className="group scroll-mt-28">
      {/* The lookbook-plate number, sitting in normal flow just above
          the card rather than absolutely bled behind it — that's a
          deliberate simplification: getting an overlapping bleed
          effect right depends on exact font-metric/line-height math
          that's genuinely risky to tune correctly without a browser
          to check it in, and a wrong overlap reads as a bug, not a
          feature. This version is guaranteed legible at any size.
          aria-hidden since it's a visual echo of position, not
          information a screen reader needs — the grid itself already
          conveys each product's place/count. */}
      <span
        aria-hidden="true"
        className="block select-none pl-1 font-display text-4xl leading-none text-ink/15 transition-colors duration-300 group-hover:text-flame/40 sm:text-5xl"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <div className="relative -mt-3 rounded-2xl bg-cream p-3 shadow-sm transition-all duration-300 ease-light group-hover:-translate-y-1.5 group-hover:shadow-xl sm:-mt-4">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-sand">
          <Link href={`/products/${product.id}`} className="absolute inset-0 block">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 768px) 33vw, 50vw"
              className="object-cover transition-transform duration-700 ease-light group-hover:scale-[1.04]"
            />
          </Link>

          {/* A legible "Add to cart" bar, not an unlabeled icon — the
              icon-only circular button here before tested as unclear
              about what it actually did. Visible by default on touch
              devices (no hover state to reveal it there); on desktop
              it's tucked below the image edge and slides up on hover
              (or keyboard focus, via focus-within, so it's reachable
              without a mouse too). A sibling of the Link above, not
              nested inside it — a <button> inside an <a> is invalid
              HTML and behaves unpredictably across browsers. */}
          {/* Once `inCart` is true, the bar stays visible unconditionally
              (not just visible-by-default-on-mobile/hidden-until-hover-on-
              desktop) — otherwise the "Remove from cart" confirmation
              would be invisible on desktop until the next hover, which
              defeats the point of showing it at all. */}
          <div
            className={`pointer-events-none absolute inset-x-0 bottom-0 transition-transform duration-300 ease-light ${
              inCart
                ? "translate-y-0"
                : "translate-y-0 md:translate-y-full md:group-hover:translate-y-0 md:focus-within:translate-y-0"
            }`}
          >
            <button
              type="button"
              onClick={() => (inCart ? removeItem(product.id) : addItem(product.id))}
              className={`pointer-events-auto flex w-full items-center justify-center gap-2 rounded-b-xl py-2.5 text-sm font-medium transition-colors ${
                inCart ? "bg-charcoal text-cream hover:bg-ink" : "bg-ink text-cream hover:bg-charcoal"
              }`}
            >
              {inCart ? <Check size={14} /> : <Plus size={14} />}
              {inCart ? "Remove from cart" : "Add to cart"}
            </button>
          </div>
        </div>

        <Link href={`/products/${product.id}`} className="mt-4 block px-1 pb-1">
          <span className="inline-block rounded-full bg-flame/15 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-flame">
            {product.category}
          </span>

          <div className="mt-2 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="line-clamp-1 font-display text-lg leading-snug">{product.name}</h3>
              <p className="mt-0.5 font-mono text-xs text-ink/40">{product.sku}</p>
            </div>
            <p className="whitespace-nowrap pt-0.5 font-body text-sm font-medium text-ink/80">
              {formatPrice(product.price, product.currency)}
            </p>
          </div>
        </Link>
      </div>
    </article>
  );
}
