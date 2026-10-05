"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";
import CategoryTabs from "@/components/product/CategoryTabs";
import ProductGrid from "@/components/product/ProductGrid";
import Button from "@/components/ui/Button";

/**
 * Heading + tabs + grid + "View more," all in one component now (it
 * used to be just tabs + grid, with the caller rendering its own
 * heading above in a separate block). That split was the cause of
 * the awkward spacing: the heading sat alone, then a big gap, then
 * the tabs floated by themselves on their own row, right-aligned with
 * nothing on the left — the whole row read as unbalanced whitespace,
 * not a real header bar. Now heading and tabs share ONE flex row
 * (stacking only on mobile, where there isn't width for both), so
 * this fix only has to happen in one place instead of being patched
 * separately in ProductShowcase.jsx and app/products/page.js.
 *
 * `initialLimit` adds a "View more" button that reveals the rest of
 * the filtered list instead of dumping everything at once, genuinely
 * useful once the catalog grows past a screenful, not just decoration.
 * Leave it unset (the default) for the homepage, where showing
 * everything at once is fine with only a handful of products.
 *
 * Categories are NOT hardcoded anywhere in this file, see the
 * comment at the top of CategoryTabs.jsx for how a new category
 * (e.g. "home-decor") flows through automatically from products.json.
 */
export default function ProductCatalog({
  title,
  description,
  products,
  categories,
  initialCategory = "all",
  variant = "compact",
  initialLimit = Infinity,
}) {
  const [active, setActive] = useState(
    categories.includes(initialCategory) ? initialCategory : "all"
  );
  const [limit, setLimit] = useState(initialLimit);

  const filtered = useMemo(() => {
    if (active === "all") return products;
    return products.filter((product) => product.category === active);
  }, [products, active]);

  const visible = filtered.slice(0, limit);
  const hasMore = limit < filtered.length;

  return (
    <div>
      <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
        {(title || description) && (
          <div>
            {title && <h2 className="font-display text-display-md">{title}</h2>}
            {description && (
              <p className="mt-2 max-w-md text-sm text-ink/55">{description}</p>
            )}
          </div>
        )}

        <CategoryTabs
          categories={["all", ...categories]}
          active={active}
          onChange={(category) => {
            setActive(category);
            setLimit(initialLimit); // reset paging when the filter changes
          }}
        />
      </div>

      <ProductGrid products={visible} variant={variant} />

      {hasMore && (
        <div className="mt-14 flex justify-center">
          <Button
            variant="secondary"
            onClick={() => setLimit((current) => current + initialLimit)}
          >
            View more
            <ChevronDown size={16} className="ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
