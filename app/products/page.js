import ProductCatalog from "@/components/product/ProductCatalog";
import { getAllProducts, getCategories } from "@/lib/products";

const TITLE = "Catalog | Sentinel";
const DESCRIPTION = "The full Sentinel catalog of lamps and ceramics, made in small batches.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

// How many cards show before the "View more" button appears. Bump
// this up if the catalog grows and you want a fuller first screen.
const PAGE_SIZE = 6;

/**
 * Linked from the navbar's "Lamps" / "Ceramics" / "Shop the collection"
 * items. ?category=lamps (etc.) preselects the matching tab via
 * ProductCatalog's initialCategory prop, the tab still switches
 * freely from there, this only sets where it starts.
 *
 * "Catalog" is this page's own big page-level headline, kept separate
 * from ProductCatalog's internal title/description slot (which would
 * duplicate it) — only `description` is passed through, so it lands
 * on the same row as the category tabs instead of floating alone.
 *
 * Uses the "rich" ProductCard variant (image, name, price pill,
 * description, two actions), styled after the CATALOG card
 * reference. The homepage keeps the leaner "compact" variant.
 */
export default function ProductsPage({ searchParams }) {
  const products = getAllProducts();
  const categories = getCategories();
  const initialCategory = searchParams?.category ?? "all";

  return (
    <main className="bg-sand pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="container-page">
        <p className="font-display text-4xl italic text-ink md:text-5xl">Catalog</p>

        <div className="mt-14">
          <ProductCatalog
            description="Made in small batches, so small variations in glaze and grain are part of the piece, not a flaw in it."
            products={products}
            categories={categories}
            initialCategory={initialCategory}
            variant="rich"
            initialLimit={PAGE_SIZE}
          />
        </div>
      </div>
    </main>
  );
}
