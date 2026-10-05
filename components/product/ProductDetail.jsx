"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Check, ChevronLeft, ChevronRight, Flame, Boxes, Leaf, Globe, ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import { BRAND_ORIGIN, getProductImages } from "@/lib/products";
import Button from "@/components/ui/Button";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Universal, not per-product — every piece we sell is small-batch and
// hand-finished, so these four apply to the whole catalog rather than
// needing their own field in products.json. If a product ever needs
// its own specific claims (e.g. "dimmable" for one lamp), turn this
// into a per-product `highlights` array instead.
const HIGHLIGHTS = [
  { icon: Flame, label: "Hand-finished" },
  { icon: Boxes, label: "Small batch" },
  { icon: Leaf, label: "Sustainably sourced" },
  { icon: Globe, label: "Ships worldwide" },
];

/**
 * Right-panel hierarchy (title → price+material → description →
 * quantity → full-width Add to cart → highlight badges) follows the
 * MANA product-page reference you shared, rebuilt in our own type and
 * the strict 5-color palette instead of copied wholesale.
 *
 * The Add to cart button reflects actual cart state via `isInCart()`
 * — once added, it switches to "Remove from cart" (outline style)
 * rather than staying on "Add to cart" regardless of whether the
 * product is already there. Removing takes out the whole line for
 * this product; the quantity stepper above only controls how many
 * get added on the next "Add to cart" click.
 */
export default function ProductDetail({ product, previous, next }) {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const { addItem, removeItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  // Reads product.images if it exists, otherwise wraps the single
  // product.image in a one-item array — see getProductImages() in
  // lib/products.js. The arrows below only render once a product
  // actually has more than one photo, so add entries to a product's
  // `images` array in products.json to turn them on; nothing else
  // needs to change.
  const images = getProductImages(product);
  const hasMultipleImages = images.length > 1;

  const showPrevImage = () => setActiveImage((i) => (i - 1 + images.length) % images.length);
  const showNextImage = () => setActiveImage((i) => (i + 1) % images.length);

  return (
    <div>
      <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-sand md:aspect-[4/5]">
          <Image
            src={images[activeImage]}
            alt={product.name}
            fill
            sizes="(min-width: 768px) 50vw, 100vw"
            priority
            className="object-cover"
          />

          {hasMultipleImages && (
            <>
              <button
                type="button"
                onClick={showPrevImage}
                aria-label="Previous photo"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition-transform hover:scale-105"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={showNextImage}
                aria-label="Next photo"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/90 text-ink shadow-md transition-transform hover:scale-105"
              >
                <ChevronRight size={18} />
              </button>
              <span className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-cream">
                {activeImage + 1} / {images.length}
              </span>
            </>
          )}
        </div>

        {/* Info panel */}
        <div>
          <p className="text-xs uppercase tracking-widest text-ink/45">{product.category}</p>
          <h1 className="mt-2 font-display text-display-md">{product.name}</h1>

          <div className="mt-3 flex items-baseline gap-4">
            <span className="text-xl font-medium">{formatPrice(product.price, product.currency)}</span>
            <span className="text-base text-charcoal">{product.material}</span>
          </div>

          <p className="mt-6 max-w-md text-charcoal">{product.description}</p>

          <div className="mt-8 flex items-center gap-3 rounded-full border border-ink/15 px-3 py-2 w-fit">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="Decrease quantity"
              className="text-ink/60 hover:text-ink"
            >
              <Minus size={14} />
            </button>
            <span className="w-4 text-center text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => q + 1)}
              aria-label="Increase quantity"
              className="text-ink/60 hover:text-ink"
            >
              <Plus size={14} />
            </button>
          </div>

          <Button
            variant={inCart ? "secondary" : "primary"}
            size="lg"
            onClick={() => (inCart ? removeItem(product.id) : addItem(product.id, quantity))}
            className="mt-4 w-full"
          >
            {inCart ? (
              <>
                <Check size={16} className="mr-2" />
                Remove from cart
              </>
            ) : (
              "Add to cart"
            )}
          </Button>

          <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8 sm:grid-cols-4">
            {HIGHLIGHTS.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <Icon size={20} className="text-ink/60" />
                <span className="text-xs text-ink/55">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <p className="mx-auto mt-16 max-w-2xl text-balance text-center text-charcoal md:mt-24">
        Made from {product.material.toLowerCase()}, finished by hand in small
        batches, {BRAND_ORIGIN}.
      </p>

      <div className="mt-12 flex items-center justify-between border-t border-ink/10 pt-6 text-sm text-ink/60">
        {previous ? (
          <Link
            href={`/products/${previous.id}`}
            className="flex items-center gap-2 transition-colors hover:text-ink"
          >
            <ArrowRight size={14} className="rotate-180" />
            {previous.name}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link
            href={`/products/${next.id}`}
            className="flex items-center gap-2 transition-colors hover:text-ink"
          >
            {next.name}
            <ArrowRight size={14} />
          </Link>
        )}
      </div>
    </div>
  );
}
