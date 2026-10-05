"use client";

import { useRef, useState } from "react";
import { Download } from "lucide-react";
import Button from "@/components/ui/Button";
import { BRAND_NAME, BRAND_TAGLINE, BRAND_PHONE } from "@/lib/brand";
import { BRAND_ORIGIN } from "@/lib/products";

function formatPrice(amount) {
  return new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: "BDT",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date) {
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(date.getMonth() + 1)}/${pad(date.getDate())}/${date.getFullYear()} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function DashedRule() {
  return <div className="border-t-2 border-dashed border-ink/25" />;
}

// A dotted "leader line" between an item name and its price, the
// classic paper-receipt trick — a flexible middle element with a
// dotted bottom border fills whatever gap is left between the two.
// Wraps fine if a product name is long; the dots just start further
// down on the wrapped line, same as a real receipt would.
function ItemLine({ label, value, muted = false }) {
  return (
    <div className={`flex items-end gap-2 ${muted ? "text-ink/60" : ""}`}>
      <span className="flex-shrink-0">{label}</span>
      <span className="mb-1 flex-1 border-b border-dotted border-ink/40" />
      <span className="flex-shrink-0">{value}</span>
    </div>
  );
}

// A fixed, deterministic bar-width pattern — purely decorative, not
// derived from the order id or any real barcode symbology. Built as
// actual SVG rects rather than a CSS repeating-gradient background:
// html2canvas (used by the download button below) has known trouble
// rendering repeating-gradient backgrounds accurately, but renders
// plain SVG shapes reliably.
const BARCODE_WIDTHS = [2, 1, 3, 1, 2, 4, 1, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 2, 4];

function Barcode() {
  let x = 0;
  const bars = BARCODE_WIDTHS.map((w, i) => {
    const barX = x;
    x += w * 3 + 3;
    return <rect key={i} x={barX} y={0} width={w * 3} height={48} fill="#1A1A1A" />;
  });
  return (
    <svg
      viewBox={`0 0 ${x} 48`}
      preserveAspectRatio="none"
      className="h-12 w-full"
      aria-hidden="true"
    >
      {bars}
    </svg>
  );
}

/**
 * Styled after the West Tenth Denim receipt reference: script brand
 * name, dashed rules, a dotted-leader itemized list in monospace, a
 * decorative barcode, and a cursive "Thank you."
 *
 * Shows SUBTOTAL and SHIPPING as their own dotted-leader lines above
 * TOTAL (not just a single total) — `subtotal`/`shipping` are passed
 * in as separate props rather than derived from `total` here, since
 * both already exist as separate values in CartContext and get
 * snapshotted alongside `lines`/`total` in CheckoutFlow.jsx's
 * `placeOrder()`.
 *
 * Kept in the strict 5-color palette (flame stands in for the
 * reference's red) rather than introducing a new color for this one
 * screen.
 *
 * "Download receipt" captures the actual rendered card as a PNG via
 * html2canvas (ref'd below) rather than exporting plain text or hand-
 * building a PDF — a screenshot of what's really on screen is far
 * lower-risk to get right without a browser to visually verify the
 * output in, since a PDF/canvas built by manually re-positioning text
 * would need to reproduce this whole layout a second time in a
 * different API. `scale: 2` renders at roughly retina density so the
 * exported image doesn't look soft.
 */
export default function OrderReceipt({ orderId, shippingInfo, lines, subtotal, shipping, total }) {
  const receiptRef = useRef(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleDownload = async () => {
    if (!receiptRef.current || isSaving) return;
    setIsSaving(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(receiptRef.current, {
        backgroundColor: "#F4E5D4", // matches bg-paper/bg-cream exactly
        scale: 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `receipt-${orderId}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      // If the capture fails for any reason (an unusual browser,
      // html2canvas hitting an unsupported CSS feature, etc.), fail
      // quietly rather than throwing — the customer already has their
      // on-screen receipt and confirmation either way.
      console.error("Could not save receipt image:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <div
        ref={receiptRef}
        className="mx-auto max-w-sm rounded-sm bg-paper px-6 py-8 shadow-2xl sm:px-8 sm:py-10"
      >
        <div className="flex items-start justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-flame">Receipt</p>
          <p className="font-mono text-xs text-ink/70">No. {orderId}</p>
        </div>

        <div className="mt-6 text-center">
          <p className="font-display text-4xl italic text-flame">{BRAND_NAME}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-ink/60">
            /{BRAND_TAGLINE}/
          </p>
        </div>

        <div className="mt-6 space-y-2">
          <DashedRule />
          <p className="py-1 text-center font-mono text-xs text-ink/70">
            DATE: {formatDate(new Date())}
          </p>
          <DashedRule />
        </div>

        <div className="mt-4 space-y-3 font-mono text-xs text-ink">
          {lines.map(({ product, quantity }) => (
            <ItemLine
              key={product.id}
              label={quantity > 1 ? `${product.name} x${quantity}` : product.name}
              value={formatPrice(product.price * quantity)}
            />
          ))}
        </div>

        <div className="mt-4">
          <DashedRule />
        </div>

        <div className="mt-3 space-y-1.5 font-mono text-xs text-ink">
          <ItemLine label="SUBTOTAL:" value={formatPrice(subtotal)} muted />
          <ItemLine label="SHIPPING:" value={formatPrice(shipping)} muted />
        </div>

        <div className="mt-3 flex items-baseline justify-between font-mono text-sm font-bold text-ink">
          <span>TOTAL:</span>
          <span>{formatPrice(total)}</span>
        </div>

        <div className="mt-8">
          <Barcode />
        </div>
        <p className="mt-2 text-center font-mono text-[10px] tracking-wide text-ink/50">
          {orderId}
        </p>

        <p className="mt-8 text-center font-display text-3xl italic text-flame">Thank you.</p>

        <p className="mt-6 text-center font-mono text-[10px] text-ink/45">
          Cash on delivery. Have {formatPrice(total)} ready at {shippingInfo.address},{" "}
          {shippingInfo.city}.
        </p>
        <p className="mt-2 text-center font-mono text-[10px] text-ink/40">
          {BRAND_PHONE}
        </p>
        <p className="text-center font-mono text-[10px] text-ink/40">{BRAND_ORIGIN}</p>
      </div>

      <div className="mt-6 flex justify-center">
        <Button variant="inverse" size="sm" onClick={handleDownload} disabled={isSaving}>
          <Download size={14} className="mr-2" />
          {isSaving ? "Saving..." : "Download receipt"}
        </Button>
      </div>
    </div>
  );
}
