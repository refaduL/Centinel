import Hero from "@/components/home/Hero";
import Manifesto from "@/components/home/Manifesto";
import FeaturedStrip from "@/components/home/FeaturedStrip";
import ProductShowcase from "@/components/home/ProductShowcase";
import JoinMailingList from "@/components/home/JoinMailingList";
import { getAllProducts, getTopPicks, getCategories } from "@/lib/products";

// Navbar and Footer are both rendered once in app/layout.js — every
// page shares them, so neither is imported or repeated here.
export default function HomePage() {
  const allProducts = getAllProducts();
  const topPicks = getTopPicks();
  const categories = getCategories();

  return (
    <main>
      {/* Hero (the magnet-board version) picks its own cast of 5
          products by id — see HERO_CAST in Hero.jsx — so it needs the
          full catalog, not just topPicks. Two of those five (the
          sticker pieces specifically) need an `image_png` cutout;
          the rest use a regular photo. If you rename or remove a
          product referenced in HERO_CAST, that one piece just quietly
          doesn't render — nothing crashes. */}
      <Hero products={allProducts} />
      <FeaturedStrip products={topPicks} />
      <Manifesto />
      <ProductShowcase products={allProducts} categories={categories} />
      <JoinMailingList />
    </main>
  );
}
