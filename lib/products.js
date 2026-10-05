import products from "@/data/products.json";

/**
 * Every component reads product data through these functions —
 * never by importing data/products.json directly.
 *
 * When you're ready to move to a real database, this is the only
 * file you need to rewrite. Replace the body of each function with
 * a query (Mongo, Postgres, a CMS fetch, whatever you land on) and
 * keep the same function names + return shapes. Nothing in
 * /components or /app has to change.
 */

export function getAllProducts() {
  return products;
}

export function getProductsByCategory(category) {
  if (!category || category === "all") return products;
  return products.filter((p) => p.category === category);
}

// `top3picks` is a hand-picked flag on up to 3 products in
// products.json — not automatically the 3 highest-priced or newest,
// an actual editorial choice. To change which pieces are featured,
// flip the flag on the products you want in data/products.json rather
// than changing this function.
export function getTopPicks() {
  return products.filter((p) => p.top3picks);
}

export function getProductBySlug(slug) {
  return products.find((p) => p.id === slug) ?? null;
}

export function getCategories() {
  return [...new Set(products.map((p) => p.category))];
}

export function getAdjacentProducts(slug) {
  const index = products.findIndex((p) => p.id === slug);
  if (index === -1) return { previous: null, next: null };
  const previous = products[(index - 1 + products.length) % products.length];
  const next = products[(index + 1) % products.length];
  return { previous, next };
}

// Every product currently has one `image` string. Once you're ready
// to shoot multiple angles per product, add an `images: [...]` array
// to that product in products.json instead — this function prefers
// `images` when present and falls back to wrapping the single
// `image` in a one-item array, so ProductDetail's prev/next photo
// arrows work correctly either way without any component changes.
export function getProductImages(product) {
  if (product.images && product.images.length > 0) return product.images;
  return [product.image];
}

// For the top-picks section on the homepage: a no-background cutout
// (PNG or WebP, just the object, no backdrop) reads much better
// floating on a flat color than a regular photo with its own setting
// does. Not every product has one — `image_png` is only set on the
// products currently flagged `top3picks` — so this falls back to the
// regular `image` for anything else. Add `image_png` to a product in
// products.json and it's picked up automatically; nothing in
// FeaturedStrip.jsx needs to change.
export function getDisplayImage(product) {
  return product.image_png || product.image;
}

// BRAND_ORIGIN is where the company itself is based (used on the
// contact page and in the footer). PRODUCT_ORIGIN is where the
// catalog is made (used on the featured strip and product detail
// page) — same value today, but kept as two constants since a brand's
// office and its workshop don't have to be the same place.
export const BRAND_ORIGIN = "Chattogram, Bangladesh";
export const PRODUCT_ORIGIN = BRAND_ORIGIN;

// A fixed edition size for the "batch number" shown on the featured
// strip. Fabricated for display purposes (we don't track real batch
// sizes yet) but kept as one constant so every product's numbering is
// at least internally consistent — swap this for a real field once
// batch tracking exists.
const EDITION_SIZE = 250;

export function getBatchLabel(index) {
  const pad = (n, len) => String(n).padStart(len, "0");
  return `# ${pad(index + 1, 3)} / ${pad(EDITION_SIZE, 3)}`;
}

// Groups products into a named "edit" based on the time-of-day they
// belong to (the `scene` field already on every product) rather than
// adding a separate collection field that would just duplicate it.
const COLLECTION_NAMES = {
  daylight: "The Daylight Edit",
  golden: "The Golden Hour Edit",
  evening: "The After Dark Edit",
};

export function getCollectionName(scene) {
  return COLLECTION_NAMES[scene] ?? "The Collection";
}
