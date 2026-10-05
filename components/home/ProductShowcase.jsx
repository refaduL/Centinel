import ProductCatalog from "@/components/product/ProductCatalog";

export default function ProductShowcase({ products, categories }) {
  return (
    <section id="collection" className="bg-paper py-24 md:py-32">
      <div className="container-page">
        <ProductCatalog
          title="The collection"
          description="Every piece is made in small batches. What you see is close to what ships, so small variations in glaze and grain are included."
          products={products}
          categories={categories}
        />
      </div>
    </section>
  );
}
