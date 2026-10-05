/**
 * The landing half of the hero's "click a piece, it falls to the
 * collection" interaction (the falling half lives in DraggablePin.jsx).
 * Deliberately plain DOM, not React state/context: the hero and the
 * collection grid are siblings with no shared state today, and
 * threading a context through app/page.js just to pass one id is a
 * lot of plumbing for "scroll here and glow briefly." ProductCard.jsx
 * gives every card the `product-${id}` DOM id this looks up.
 *
 * Silently does nothing if the id isn't on the page — e.g. the person
 * switched the collection's category tabs before clicking a hero
 * piece from a different category, filtering that card out. That's a
 * rare, low-stakes edge case; failing quietly beats a dead link.
 */
export function fallToProduct(id) {
  if (typeof document === "undefined") return;

  const el = document.getElementById(`product-${id}`);
  if (!el) return;

  const reduceMotion =
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

  el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });

  // The compact homepage card has a faint lookbook-plate number sitting
  // in normal flow just above the actual card (see ProductCard.jsx);
  // `product-${id}` is on the outer wrapper so scrollIntoView frames
  // both together, but the ring itself should hug just the visible
  // card. `.rounded-2xl` is that inner surface on both card variants;
  // falling back to `el` covers the rich variant, where the rounded
  // surface IS the outer element scrollIntoView already used.
  const target = el.querySelector(".rounded-2xl") || el;

  // Retrigger-safe: restart the CSS animation even if this card was
  // just highlighted a moment ago (two hero pieces from the same
  // product, clicked in quick succession).
  target.classList.remove("product-focus-pulse");
  // eslint-disable-next-line no-unused-expressions
  target.offsetWidth; // force reflow so the class removal registers
  target.classList.add("product-focus-pulse");
  window.setTimeout(() => target.classList.remove("product-focus-pulse"), 1800);
}
