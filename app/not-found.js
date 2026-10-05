import Button from "@/components/ui/Button";

export const metadata = {
  title: "Page not found | Sentinel",
};

/**
 * Next.js's file-based convention — used both for unmatched routes
 * automatically, and for any explicit notFound() call (e.g.
 * app/products/[slug]/page.js calls it when a slug doesn't match a
 * real product). No wiring needed beyond this file existing.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-24">
      <div className="text-center">
        <p className="font-display text-8xl italic text-flame">404</p>
        <h1 className="mt-4 font-display text-display-md">
          This piece isn&rsquo;t on the shelf.
        </h1>
        <p className="mt-3 text-charcoal">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or has moved.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/" variant="primary" size="md">
            Back home
          </Button>
          <Button href="/products" variant="secondary" size="md">
            Browse the catalog
          </Button>
        </div>
      </div>
    </main>
  );
}
