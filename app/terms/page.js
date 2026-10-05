import { BRAND_NAME, BRAND_EMAIL } from "@/lib/brand";
import { BRAND_ORIGIN } from "@/lib/products";

export const metadata = {
  title: "Terms | Sentinel",
  description: "The terms that govern using Sentinel and placing an order.",
};

/**
 * Real terms content, not a placeholder — but written by an AI
 * assistant, not a lawyer. Accurate to how this site actually works
 * today (cash-on-delivery only, no account system, small-batch stock
 * that can sell out). Same caveat as privacy/page.js: worth a real
 * legal review before launch, particularly the "Returns and
 * exchanges" window and anything Bangladesh-specific consumer-
 * protection law requires that isn't captured here. Update "Orders
 * and payment" the moment a card/mobile-banking payment method
 * actually goes live (see PAYMENT_METHODS in
 * components/checkout/CheckoutFlow.jsx).
 */
export default function TermsPage() {
  return (
    <main className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-display-lg">Terms</h1>
        <p className="mt-3 text-sm text-ink/50">Last updated: 2026</p>

        <div className="mt-10 space-y-10 text-charcoal">
          <section>
            <p>
              These terms govern your use of this site and any order you place
              with {BRAND_NAME}. Placing an order means you agree to what's
              described below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Products and pricing</h2>
            <p className="mt-3">
              Every piece is made in small batches, so small variations in
              glaze, grain, and finish are part of the piece, not a defect.
              Prices are shown in BDT and may change without notice; the price
              shown at checkout is the price that applies to your order. If a
              listed price is clearly a pricing error, we may cancel the order
              and let you know.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Orders and payment</h2>
            <p className="mt-3">
              Placing an order is an offer to buy, which we may accept or
              decline (for example, if an item has sold out since your cart was
              last updated). Cash on delivery is currently the only payment
              method: you pay in cash when your order arrives. Card and mobile
              banking are shown as coming soon and aren't live yet.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Shipping</h2>
            <p className="mt-3">
              Shipping costs and estimates are shown at checkout. Delivery
              timing is an estimate, not a guarantee. We're not responsible
              for delays caused by couriers or events outside our control.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Returns and exchanges</h2>
            <p className="mt-3">
              If a piece arrives damaged or isn't what you ordered, contact us
              within 7 days of delivery and we'll sort out a replacement or
              refund. Because each piece is made in small batches, minor
              natural variation in glaze or texture isn't grounds for a return
              on its own.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Intellectual property</h2>
            <p className="mt-3">
              The text, photography, and design on this site belong to{" "}
              {BRAND_NAME} and may not be reused without permission.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Limitation of liability</h2>
            <p className="mt-3">
              We aim for accuracy on every page, but this site is provided as
              is, without warranties beyond what's required by law. To the
              extent the law allows, {BRAND_NAME} isn't liable for indirect or
              consequential loss arising from using this site or a product
              bought through it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Governing law</h2>
            <p className="mt-3">
              These terms are governed by the laws of Bangladesh, where{" "}
              {BRAND_NAME} is based ({BRAND_ORIGIN}).
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Changes to these terms</h2>
            <p className="mt-3">
              If these terms change in any meaningful way, we'll update the
              date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Contact</h2>
            <p className="mt-3">
              Questions about these terms:{" "}
              <a href={`mailto:${BRAND_EMAIL}`} className="text-flame hover:underline">
                {BRAND_EMAIL}
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
