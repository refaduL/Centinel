"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { track } from "@vercel/analytics";
import { CheckCircle2, CreditCard, Smartphone, Truck } from "lucide-react";
import { useCart } from "@/components/cart/CartContext";
import Button from "@/components/ui/Button";
import OrderReceipt from "@/components/checkout/OrderReceipt";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

const STEPS = ["Shipping", "Payment", "Review"];

// Only "cod" is wired to anything real. The other two render as
// visibly disabled options rather than being hidden — showing what's
// coming is more honest than pretending the site only ever intended
// to take cash. To turn one on later: give it a real `id`, remove its
// `disabled: true`, and add whatever its actual payment integration
// needs (e.g. a Stripe Elements form for "card") inside the payment
// step below, gated on `paymentMethod === "card"`.
const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on delivery",
    description: "Pay in cash when your order arrives.",
    icon: Truck,
  },
  {
    id: "card",
    label: "Credit or debit card",
    description: "Coming soon.",
    icon: CreditCard,
    disabled: true,
  },
  {
    id: "mobile",
    label: "Mobile banking",
    description: "Coming soon.",
    icon: Smartphone,
    disabled: true,
  },
];

const EMPTY_SHIPPING = { fullName: "", phone: "", address: "", city: "" };

/**
 * Retro-styled per your reference (dashed-border poster cards, a
 * rotated corner sticker, bold graphic borders) — layered on top of
 * the strict 5-color palette rather than introducing new colors. The
 * dashed `CheckoutCard` shell carries that feel through Shipping/
 * Payment/Review; the final confirmation screen is its own thing
 * instead, a receipt (see OrderReceipt.jsx) on a bold flame-colored
 * backdrop rather than inside the dashed card — stacking two
 * decorative frames on top of each other read as cluttered rather
 * than as more retro.
 */
export default function CheckoutFlow() {
  const { lines, subtotal, shipping, total, clearCart } = useCart();
  const [step, setStep] = useState(0); // index into STEPS
  const [shippingInfo, setShippingInfo] = useState(EMPTY_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderId, setOrderId] = useState(null);
  // A snapshot of what was in the cart at the moment of purchase.
  // Needed because `clearCart()` below empties the live cart from
  // CartContext immediately — without this, the receipt would render
  // with zero items and a ৳0 total by the time this component
  // re-renders with `orderId` set, since `lines`/`subtotal`/`shipping`/
  // `total` above are all read live from context, not frozen at order
  // time.
  const [orderSnapshot, setOrderSnapshot] = useState(null);

  // Funnel visibility — fires once when someone actually reaches this
  // page with something in their cart (not for an empty-cart visit,
  // which shows a different screen below and isn't really "starting
  // checkout"). See the comment on <Analytics /> in app/layout.js.
  useEffect(() => {
    if (lines.length > 0) {
      track("begin_checkout", { itemCount: lines.length, total });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shippingComplete = Object.values(shippingInfo).every((v) => v.trim().length > 0);

  const placeOrder = () => {
    // No backend yet — this simulates order creation with a
    // client-generated id, snapshots the order for the receipt, and
    // empties the cart. Wiring a real backend means replacing this
    // function's body with an API call and setting orderId (and
    // orderSnapshot, from the same response) instead; everything
    // below it (the confirmation screen) can stay as-is.
    const id = `SNT-${Date.now().toString(36).toUpperCase()}`;
    setOrderSnapshot({ lines, subtotal, shipping, total });
    setOrderId(id);
    clearCart();
    track("purchase", { orderId: id, itemCount: lines.length, total, paymentMethod });
  };

  if (orderId && orderSnapshot) {
    return (
      <div className="rounded-[2.5rem] bg-flame px-4 py-16 md:py-20">
        <OrderReceipt
          orderId={orderId}
          shippingInfo={shippingInfo}
          lines={orderSnapshot.lines}
          subtotal={orderSnapshot.subtotal}
          shipping={orderSnapshot.shipping}
          total={orderSnapshot.total}
        />
        <div className="mt-10 flex justify-center">
          <Button href="/products" variant="inverse" size="lg">
            Continue shopping
          </Button>
        </div>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <CheckoutCard>
        <div className="mx-auto max-w-md text-center">
          <p className="text-charcoal">Your cart is empty. Nothing to check out yet.</p>
          <Button href="/products" variant="primary" size="lg" className="mt-6">
            Browse the catalog
          </Button>
        </div>
      </CheckoutCard>
    );
  }

  return (
    <CheckoutCard>
      {/* Step indicator */}
      <ol className="mb-12 flex items-center justify-center gap-3 text-sm">
        {STEPS.map((label, index) => (
          <li key={label} className="flex items-center gap-3">
            <span
              className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-xs font-medium ${
                index === step
                  ? "border-ink bg-flame text-ink"
                  : index < step
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/25 text-ink/40"
              }`}
            >
              {index + 1}
            </span>
            <span className={index === step ? "font-medium text-ink" : "text-ink/45"}>
              {label}
            </span>
            {index < STEPS.length - 1 && (
              <span className="ml-2 w-8 border-t-2 border-dashed border-ink/30" />
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <ShippingStep
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
          onContinue={() => setStep(1)}
          canContinue={shippingComplete}
        />
      )}

      {step === 1 && (
        <PaymentStep
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          onBack={() => setStep(0)}
          onContinue={() => setStep(2)}
        />
      )}

      {step === 2 && (
        <ReviewStep
          lines={lines}
          subtotal={subtotal}
          shipping={shipping}
          total={total}
          shippingInfo={shippingInfo}
          paymentMethod={paymentMethod}
          onEditShipping={() => setStep(0)}
          onEditPayment={() => setStep(1)}
          onPlaceOrder={placeOrder}
        />
      )}
    </CheckoutCard>
  );
}

/**
 * The dashed-border poster-card shell every step (and the empty/
 * confirmation states) render inside, plus the rotated corner sticker.
 * Pulled into one component so the shell only needs to be built once —
 * if this look gets reused elsewhere (a promo card, say), lift it into
 * components/ui/ instead of copying the classNames.
 */
function CheckoutCard({ children }) {
  return (
    <div className="relative mx-auto max-w-3xl rounded-[2rem] border-2 border-dashed border-ink bg-cream px-6 py-12 md:px-16 md:py-16">
      <span className="absolute -top-4 right-6 -rotate-6 rounded-full border-2 border-ink bg-flame px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-ink shadow-[0_3px_0_0_#000] sm:right-10">
        Cash on delivery
      </span>
      {children}
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-wide text-ink/50">{label}</span>
      <input
        {...props}
        className="mt-1.5 w-full rounded-xl border-2 border-ink/70 bg-paper px-3.5 py-2.5 text-sm outline-none transition-colors focus:border-ink"
      />
    </label>
  );
}

function ShippingStep({ shippingInfo, setShippingInfo, onContinue, canContinue }) {
  const update = (key) => (e) => setShippingInfo((prev) => ({ ...prev, [key]: e.target.value }));

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-display-md">Shipping details</h1>
      <div className="mt-8 space-y-5">
        <Field label="Full name" value={shippingInfo.fullName} onChange={update("fullName")} />
        <Field label="Phone number" type="tel" value={shippingInfo.phone} onChange={update("phone")} />
        <Field label="Address" value={shippingInfo.address} onChange={update("address")} />
        <Field label="City" value={shippingInfo.city} onChange={update("city")} />
      </div>
      <Button
        variant="primary"
        size="lg"
        disabled={!canContinue}
        onClick={onContinue}
        className="mt-8 w-full"
      >
        Continue to payment
      </Button>
    </div>
  );
}

function PaymentStep({ paymentMethod, setPaymentMethod, onBack, onContinue }) {
  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-display-md">Payment method</h1>
      <div className="mt-8 space-y-3">
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const isActive = paymentMethod === method.id;
          return (
            <button
              key={method.id}
              type="button"
              disabled={method.disabled}
              onClick={() => setPaymentMethod(method.id)}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 px-4 py-4 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                isActive ? "border-ink bg-flame/15" : "border-ink/25 hover:border-ink/50"
              }`}
            >
              <Icon size={20} className="flex-shrink-0 text-ink/70" />
              <span className="flex-1">
                <span className="block text-sm font-medium text-ink">{method.label}</span>
                <span className="block text-xs text-ink/50">{method.description}</span>
              </span>
              {isActive && <CheckCircle2 size={18} className="flex-shrink-0 text-flame" />}
            </button>
          );
        })}
      </div>
      <div className="mt-8 flex gap-3">
        <Button variant="secondary" size="lg" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="primary" size="lg" onClick={onContinue} className="flex-1">
          Continue to review
        </Button>
      </div>
    </div>
  );
}

function ReviewStep({
  lines,
  subtotal,
  shipping,
  total,
  shippingInfo,
  paymentMethod,
  onEditShipping,
  onEditPayment,
  onPlaceOrder,
}) {
  const method = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  return (
    <div>
      <h1 className="text-center font-display text-display-md">Review your order</h1>

      <div className="mt-10 grid grid-cols-1 gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-ink/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-ink/50">Shipping to</p>
              <button type="button" onClick={onEditShipping} className="text-xs text-flame hover:underline">
                Edit
              </button>
            </div>
            <p className="mt-2 text-sm text-ink">
              {shippingInfo.fullName}
              <br />
              {shippingInfo.address}, {shippingInfo.city}
              <br />
              {shippingInfo.phone}
            </p>
          </div>

          <div className="rounded-2xl border-2 border-ink/20 p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-wide text-ink/50">Payment method</p>
              <button type="button" onClick={onEditPayment} className="text-xs text-flame hover:underline">
                Edit
              </button>
            </div>
            <p className="mt-2 text-sm text-ink">{method?.label}</p>
          </div>
        </div>

        <div className="rounded-2xl border-2 border-ink/20 p-5">
          <ul className="space-y-4">
            {lines.map(({ product, quantity }) => (
              <li key={product.id} className="flex gap-3">
                <div className="relative h-14 w-12 flex-shrink-0 overflow-hidden rounded-md bg-sand">
                  <Image src={product.image} alt={product.name} fill sizes="48px" className="object-cover" />
                </div>
                <div className="flex-1 text-sm">
                  <p className="line-clamp-1 text-ink">{product.name}</p>
                  <p className="text-ink/45">Qty {quantity}</p>
                </div>
                <p className="text-sm text-ink/80">{formatPrice(product.price * quantity)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-5 space-y-2 border-t-2 border-dashed border-ink/20 pt-4 text-sm">
            <div className="flex justify-between text-ink/60">
              <dt>Subtotal</dt>
              <dd>{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between text-ink/60">
              <dt>Shipping</dt>
              <dd>{formatPrice(shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-ink/10 pt-2 font-medium text-ink">
              <dt>Total</dt>
              <dd>{formatPrice(total)}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="mt-10 flex justify-center">
        <Button variant="primary" size="lg" onClick={onPlaceOrder} className="w-full max-w-md">
          Place order, pay on delivery
        </Button>
      </div>
    </div>
  );
}
