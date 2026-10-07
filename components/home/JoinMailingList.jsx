"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { track } from "@vercel/analytics";
import Button from "@/components/ui/Button";
import HoneypotField from "@/components/ui/HoneypotField";
import { useSpamGuard } from "@/components/ui/useSpamGuard";

const EMPTY_FORM = { firstName: "", email: "" };

/**
 * Styled after the Saturn Skin "Join the Mailing List" reference —
 * a solid-color section, a centered card, and two rotated sticker
 * badges overlapping its corners. That's a different section from
 * the footer's own slim signup row (NewsletterSignup.jsx): this one
 * is a deliberate, bigger "before you go" moment, not the footer's
 * quiet utility bar.
 *
 * Colors stay inside the strict five — the section background is
 * `bg-clay`, which already existed as the accent's darker shade
 * (originally just a button-hover color), reused here as the rust-
 * orange backdrop the reference uses, rather than introducing a new
 * hex. No new colors were added for this component.
 *
 * The rotated badges are plain divs (border + rotate + Tailwind's
 * arbitrary shadow), not images — so they're free to reword later
 * without needing a new asset.
 *
 * No email list connected yet — same pattern as NewsletterSignup.jsx
 * and ContactForm.jsx: submitting validates and shows a thank-you
 * state locally. Wire up a real list/API call inside handleSubmit
 * when you're ready, in the non-spam branch only, so a caught bot
 * submission never actually reaches your list.
 */
export default function JoinMailingList() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isSpam } = useSpamGuard();

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email.trim()) return;
    if (isSpam(honeypot)) {
      setSubmitted(true);
      return;
    }
    track("newsletter_signup", { source: "homepage" });
    setSubmitted(true);
  };

  return (
    <section className="bg-clay px-4 py-20 md:py-28">
      <div className="relative mx-auto max-w-xl">
        <div className="absolute -left-3 -top-6 z-10 rotate-[-8deg] rounded-full border border-black bg-flame px-4 py-1.5 text-[11px] font-bold uppercase tracking-wide text-cream shadow-[0_3px_0_0_#000] sm:-left-6">
          Small batch only
        </div>

        <div className="rounded-3xl bg-cream p-8 text-center shadow-xl sm:p-12">
          <h2 className="font-display text-3xl sm:text-4xl">Join the mailing list</h2>
          <p className="mx-auto mt-3 max-w-sm text-sm text-charcoal sm:text-base">
            Be first to hear about new pieces, small-batch drops, and 10% off
            your first order.
          </p>

          {submitted ? (
            <p className="mt-8 text-sm text-charcoal">
              You&rsquo;re on the list, {form.firstName || "friend"}. Welcome.
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row"
            >
              <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
              <input
                type="text"
                value={form.firstName}
                onChange={update("firstName")}
                placeholder="First name"
                className="w-full flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-ink/40"
              />
              <input
                type="email"
                required
                value={form.email}
                onChange={update("email")}
                placeholder="Email address"
                className="w-full flex-1 rounded-full border border-ink/15 bg-paper px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-ink/40 focus:border-ink/40"
              />
              <Button type="submit" variant="primary" size="md" className="flex-shrink-0">
                Join
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
