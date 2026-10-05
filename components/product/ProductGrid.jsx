import ProductCard from "./ProductCard";

/**
 * Single column below `sm` (640px) on purpose — that's the fix for
 * product names wrapping onto 2-3 lines on phones. Two columns on a
 * ~375px phone leaves each card only ~160px wide, which is tight
 * enough that longer names wrapped even with line-clamp fighting it.
 * One full-width column gives names room to breathe; line-clamp-1 in
 * ProductCard is the backstop for names too long even at full width.
 *
 * `index` is passed through to ProductCard for the "compact" variant's
 * lookbook-plate number (01, 02, 03...) — it resets per grid, so
 * filtering by category renumbers from 01 rather than keeping each
 * product's position in the unfiltered catalog. That's deliberate:
 * the number is meant to read as "which plate is this in what you're
 * looking at right now," not a permanent ID (products.json's `sku`
 * already covers that job).
 */
export default function ProductGrid({ products, variant = "compact" }) {
  if (!products.length) {
    return (
      <p className="py-16 text-center text-sm text-ink/50">
        Nothing here yet. Check back soon.
      </p>
    );
  }

  const gridClass =
    variant === "rich"
      ? "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      : "grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2 md:grid-cols-3";

  return (
    <div className={gridClass}>
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} variant={variant} index={index} />
      ))}
    </div>
  );
}
