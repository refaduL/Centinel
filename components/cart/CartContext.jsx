"use client";

import { getAllProducts } from "@/lib/products";
import { track } from "@vercel/analytics";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

// Bump this if the shape of a cart item (currently { productId,
// quantity }) ever changes incompatibly — old localStorage data under
// the previous key just gets ignored (see the try/catch below) rather
// than crashing anything.
const STORAGE_KEY = "Centinel-cart-v1";

// Flat shipping estimate, shown once the cart has items — lives here
// (not duplicated in CartDrawer and the checkout flow separately) so
// there's exactly one number to update if it ever needs to change or
// become a real calculated rate.
const SHIPPING_ESTIMATE = 150; // BDT

/**
 * The cart persists to localStorage now (see the two effects right
 * below the state declarations) — it survives a refresh or closed
 * tab, but it's still just this one browser's local storage, not a
 * real account/server-side cart. Swapping that for something more
 * real (a server cart tied to a session/cookie, Shopify's cart API,
 * etc.) only means rewriting what's inside CartProvider — every
 * component that calls useCart() keeps working unchanged.
 *
 * `items` is stored as { productId, quantity } pairs rather than full
 * product objects, and joined against getAllProducts() on read. That
 * way the cart never goes stale relative to price/name changes in the
 * catalog — there's only one source of truth for product data. It
 * also means localStorage only ever holds IDs and counts, nothing
 * about prices or names that could go stale sitting in a browser.
 */
export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  // Tracks whether the one-time load-from-localStorage effect (below)
  // has run yet. Without this, the save-to-localStorage effect would
  // fire on the very first render with `items` still at its initial
  // `[]` — writing an empty cart over whatever was actually saved,
  // before the load effect even gets a chance to read it back.
  const [hasHydrated, setHasHydrated] = useState(false);

  // Runs once on mount. Server-rendered HTML always has an empty
  // cart (there's no localStorage on the server), so starting `items`
  // at `[]` and only populating it here, after mount, avoids a
  // hydration mismatch between server and client markup.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Drop any item whose product no longer exists (e.g. it was
          // removed from products.json since this cart was saved) —
          // otherwise it lingers in localStorage forever, always
          // filtered out of `lines` below but never actually cleaned
          // up, since nothing else ever looks at raw `items` again.
          const catalog = getAllProducts();
          const valid = parsed.filter((item) =>
            catalog.some((product) => product.id === item.productId),
          );
          setItems(valid);
        }
      }
    } catch {
      // Malformed JSON, or localStorage unavailable (private
      // browsing in some browsers, etc.) — just start with an empty
      // cart rather than crashing.
    }
    setHasHydrated(true);
  }, []);

  // Runs whenever the cart changes, but only after the load effect
  // above has already run — see the comment on `hasHydrated`.
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage full or unavailable — the cart still works for this
      // session, it just won't survive a refresh this one time.
    }
  }, [items, hasHydrated]);

  const addItem = (productId, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === productId);
      if (existing) {
        return current.map((item) =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...current, { productId, quantity }];
    });
    setIsOpen(true);

    // Funnel visibility — see the comment on <Analytics /> in
    // app/layout.js for where these events end up and how to switch
    // providers. Looked up here (rather than passed in by the
    // caller) so every add-to-cart button gets consistent event data
    // without each of the three call sites needing to build it.
    const product = getAllProducts().find((p) => p.id === productId);
    track("add_to_cart", {
      productId,
      name: product?.name ?? "unknown",
      price: product?.price ?? 0,
      quantity,
    });
  };

  const removeItem = (productId) => {
    setItems((current) =>
      current.filter((item) => item.productId !== productId),
    );
    track("remove_from_cart", { productId });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) {
      removeItem(productId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      ),
    );
  };

  // Called once an order is successfully placed (see
  // components/checkout/CheckoutFlow.jsx) — empties the cart without
  // touching isOpen, since by that point the drawer is already closed.
  const clearCart = () => setItems([]);

  // Lets an "Add to cart" button reflect whether the product is
  // already in the cart (and switch to "Remove from cart") instead of
  // always showing "Add to cart" regardless of actual state.
  const isInCart = (productId) =>
    items.some((item) => item.productId === productId);

  const lines = useMemo(() => {
    const catalog = getAllProducts();
    return items
      .map((item) => {
        const product = catalog.find((p) => p.id === item.productId);
        if (!product) return null;
        return { ...item, product };
      })
      .filter(Boolean);
  }, [items]);

  const itemCount = useMemo(
    () => lines.reduce((sum, line) => sum + line.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () =>
      lines.reduce((sum, line) => sum + line.product.price * line.quantity, 0),
    [lines],
  );
  const shipping = lines.length > 0 ? SHIPPING_ESTIMATE : 0;
  const total = subtotal + shipping;

  const value = {
    lines,
    itemCount,
    subtotal,
    shipping,
    total,
    isOpen,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
