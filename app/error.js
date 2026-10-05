"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

/**
 * Next.js's file-based convention — wraps everything below the root
 * layout in an error boundary automatically (Navbar/Footer still
 * render around this, since the root layout itself didn't crash).
 * Must be a Client Component; Next.js requires this file to export a
 * component that accepts `error` and `reset`.
 *
 * For a crash in the root layout itself (Navbar, CartProvider, etc.),
 * see app/global-error.js instead — this file can't catch that,
 * since it renders inside the layout that would have crashed.
 */
export default function Error({ error, reset }) {
  useEffect(() => {
    // No error-reporting service wired up yet — this is the one place
    // to send `error` to Sentry/etc. once you have one.
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-cream px-4 py-24">
      <div className="text-center">
        <p className="font-display text-6xl italic text-flame">Oops.</p>
        <h1 className="mt-4 font-display text-display-md">Something went wrong.</h1>
        <p className="mt-3 max-w-sm text-charcoal">
          That&rsquo;s on us, not you. Try again, or head back home.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} variant="primary" size="md">
            Try again
          </Button>
          <Button href="/" variant="secondary" size="md">
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
