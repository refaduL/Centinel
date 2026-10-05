"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";
import Button from "@/components/ui/Button";
import HoneypotField from "@/components/ui/HoneypotField";
import { useSpamGuard } from "@/components/ui/useSpamGuard";

/**
 * Matches the narra reference directly: sits ON the footer's dark
 * background (not a separate light strip anymore, see Footer.jsx for
 * why that changed), cream text and a plain cream input/button rather
 * than the site's usual hard-shadow buttons. That's `variant="inverse"`
 * on the Button, the black-shadow primary/secondary styles need a
 * light background to read against; against a dark background like
 * the footer's, that shadow would just disappear.
 *
 * No email list is actually connected yet — submitting just validates
 * and shows a thank-you state locally. Wiring this up for real means
 * posting `email` to whichever list you use (Mailchimp, Klaviyo, a
 * simple API route that appends to a sheet/db, etc.) inside
 * handleSubmit instead of going straight to setSubmitted(true) — put
 * that real call in the non-spam branch only, same as ContactForm.jsx,
 * so a caught bot submission never actually reaches your list.
 */
export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isSpam } = useSpamGuard();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    if (isSpam(honeypot)) {
      setSubmitted(true);
      return;
    }
    track("newsletter_signup", { source: "footer" });
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <p className="text-sm text-cream/80">
        You&rsquo;re on the list. Look out for 10% off in your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
    >
      <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      <p className="whitespace-nowrap text-sm text-cream/90 sm:text-base">
        Sign up and get 10% off
      </p>
      <div className="flex w-full gap-2 sm:w-auto">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email Address"
          className="w-full min-w-0 flex-1 rounded-full border border-cream/25 bg-transparent px-4 py-2.5 text-sm text-cream outline-none transition-colors placeholder:text-cream/40 focus:border-cream/60 sm:w-64"
        />
        <Button type="submit" variant="inverse" size="sm" className="flex-shrink-0">
          Submit
        </Button>
      </div>
    </form>
  );
}
