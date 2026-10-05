"use client";

import { useState } from "react";
import Image from "next/image";
import { X, Minus, Plus } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartDrawer() {
  const { lines, itemCount, subtotal, shipping, total, isOpen, closeCart, updateQuantity, removeItem } =
    useCart();
  const [agreed, setAgreed] = useState(false);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden="true"
        onClick={closeCart}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      {/* Panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className={`fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col bg-paper shadow-2xl transition-transform duration-300 ease-light ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-lg">Cart ({itemCount})</h2>
          <button
            type="button"
            onClick={closeCart}
            className="text-sm text-ink/60 transition-colors hover:text-ink"
          >
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink/50">Your cart is empty.</p>
          ) : (
            <ul>
              {lines.map(({ product, quantity }) => (
                <li key={product.id} className="flex gap-4 border-b border-ink/10 py-6">
                  <div className="relative h-24 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-sand">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-base leading-snug">{product.name}</p>
                        <p className="mt-1 text-sm text-ink/60">
                          {formatPrice(product.price)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(product.id)}
                        aria-label={`Remove ${product.name} from cart`}
                        className="text-ink/40 transition-colors hover:text-ink"
                      >
                        <X size={16} />
                      </button>
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-ink/15 px-2 py-1">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          aria-label="Decrease quantity"
                          className="text-ink/60 hover:text-ink"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-4 text-center text-sm">{quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          aria-label="Increase quantity"
                          className="text-ink/60 hover:text-ink"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <p className="text-xs text-ink/45">{product.material}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 px-6 py-6">
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-ink/60">Subtotal</dt>
                <dd>{formatPrice(subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-ink/60">Shipping (estimate)</dt>
                <dd>{formatPrice(shipping)}</dd>
              </div>
              <div className="flex justify-between border-t border-ink/10 pt-2 font-medium">
                <dt>Total</dt>
                <dd>{formatPrice(total)}</dd>
              </div>
            </dl>

            <label className="mt-5 flex items-start gap-2 text-xs text-ink/60">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5"
              />
              I agree to the terms and understand international orders may
              incur customs charges on arrival.
            </label>

            {agreed ? (
              <Button
                href="/checkout"
                variant="primary"
                size="lg"
                onClick={closeCart}
                className="mt-4 w-full"
              >
                Proceed to checkout
              </Button>
            ) : (
              <Button variant="primary" size="lg" disabled className="mt-4 w-full">
                Proceed to checkout
              </Button>
            )}
            {/* Cash on delivery is the only payment method live right
                now — see components/checkout/CheckoutFlow.jsx. The
                terms checkbox above gates entry to /checkout; the
                actual order isn't placed until the review step there. */}
          </div>
        )}
      </aside>
    </>
  );
}
