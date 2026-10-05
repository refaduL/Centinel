import Image from "next/image";
import Link from "next/link";
import {
  PRODUCT_ORIGIN,
  getBatchLabel,
  getCollectionName,
  getDisplayImage,
} from "@/lib/products";

function formatPrice(amount, currency) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Restyled after the "Top picks from our team" reference: a plain
 * eyebrow + headline, a hairline divider, then a flat row of products
 * — name centered above a small label/value metadata table, image
 * below, no card chrome.
 *
 * Images go through getDisplayImage() (lib/products.js) rather than
 * reading product.image_png directly — it prefers the no-background
 * cutout when a product has one (only the ones flagged `top3picks` do
 * right now) and falls back to the regular photo otherwise, so this
 * never breaks if a future top pick doesn't have a cutout shot yet.
 *
 * The four metadata rows are mostly derived rather than hand-entered:
 * Collection comes from the product's existing `scene` field, Batch
 * No. is generated from array position, and Made In is one constant
 * for the whole catalog — see lib/products.js. Only Category comes
 * straight off the product. That's deliberate: it means this section
 * stays accurate automatically as products.json changes, instead of
 * needing four new fields hand-written per product.
 */
export default function FeaturedStrip({ products }) {
  return (
    <section className="bg-sand py-24 md:py-32">
      <div className="container-page">
        <p className="text-xs uppercase tracking-widest text-ink/50">
          Our debut collection
        </p>

        <h2 className="mt-3 font-display text-display-lg">
          A few pieces we&rsquo;d start with
        </h2>

        <div className="mt-12 border-t border-ink/15" />

        <div className="mt-0 grid grid-cols-1 gap-16 md:mt-16 md:grid-cols-3 md:gap-10">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="group block"
            >
              <div className="relative aspect-[4/5] w-full overflow-hidden">
                <Image
                  src={getDisplayImage(product)}
                  alt={product.name}
                  fill
                  sizes="(min-width: 768px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-light group-hover:scale-[1.03]"
                  priority={index === 0}
                />
              </div>

              <div className="mt-1 border-t border-ink/15 pt-4">
                <h3 className="text-center font-display text-xl uppercase">
                  {product.name}
                </h3>

                <dl className="mx-auto mt-4 grid w-fit grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
                  <dt className="text-right uppercase tracking-wide text-ink/45">
                    Collection
                  </dt>
                  <dd className="text-left font-medium uppercase tracking-wide text-ink/80">
                    {getCollectionName(product.scene)}
                  </dd>

                  <dt className="text-right uppercase tracking-wide text-ink/45">
                    Batch No.
                  </dt>
                  <dd className="text-left font-medium uppercase tracking-wide text-ink/80">
                    {getBatchLabel(index)}
                  </dd>

                  <dt className="text-right uppercase tracking-wide text-ink/45">
                    Category
                  </dt>
                  <dd className="text-left font-medium uppercase tracking-wide text-ink/80">
                    {product.category}
                  </dd>

                  <dt className="text-right uppercase tracking-wide text-ink/45">
                    Made in
                  </dt>
                  <dd className="text-left font-medium uppercase tracking-wide text-ink/80">
                    {PRODUCT_ORIGIN}
                  </dd>
                </dl>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
