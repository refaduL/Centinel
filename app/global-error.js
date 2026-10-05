"use client";

import { useEffect } from "react";

/**
 * Next.js's file-based convention for a crash in the ROOT layout
 * itself (Navbar, CartProvider, fonts, etc.) — app/error.js can't
 * catch that, since it renders inside the very layout that would
 * have crashed. This file replaces the entire <html> document, so it
 * needs its own <html>/<body> tags and deliberately avoids depending
 * on anything from the root layout (no Navbar, no custom fonts assumed
 * loaded) — the point of this file is to still render something even
 * if that layout is broken.
 */
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "Georgia, serif", background: "#F4E5D4" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "3rem", fontStyle: "italic", color: "#E55A28", margin: 0 }}>
              Oops.
            </p>
            <h1 style={{ fontSize: "1.5rem", marginTop: "1rem", color: "#1A1A1A" }}>
              Something went wrong.
            </h1>
            <p style={{ color: "#333333", marginTop: "0.75rem" }}>
              That&rsquo;s on us, not you.
            </p>
            <button
              onClick={reset}
              style={{
                marginTop: "2rem",
                padding: "0.75rem 1.5rem",
                borderRadius: "9999px",
                border: "1px solid #000",
                background: "#E55A28",
                color: "#1A1A1A",
                fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
