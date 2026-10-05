import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { getAllProducts, getProductBySlug, getAdjacentProducts } from "@/lib/products";
import { SITE_URL } from "@/lib/brand";

export function generateStaticParams() {
  return getAllProducts().map((product) => ({ slug: product.id }));
}

export function generateMetadata({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return {};
  const title = `${product.name} | Sentinel`;
  return {
    title,
    description: product.description,
    openGraph: {
      title,
      description: product.description,
      images: [{ url: product.image }],
    },
  };
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  const { previous, next } = getAdjacentProducts(params.slug);

  // Structured data for search engines (price/availability rich
  // results) — "InStock" is asserted unconditionally since there's no
  // real inventory tracking yet (see the "no stock modeling" gap
  // flagged in PROGRESS.md); update this the moment that exists.
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: `${SITE_URL}${product.image}`,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/products/${product.id}`,
      priceCurrency: product.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
      <div className="container-page">
        <ProductDetail product={product} previous={previous} next={next} />
      </div>
    </main>
  );
}
