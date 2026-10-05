"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { track } from "@vercel/analytics";
import Button from "@/components/ui/Button";
import HoneypotField from "@/components/ui/HoneypotField";
import { useSpamGuard } from "@/components/ui/useSpamGuard";

const EMPTY_FORM = { fullName: "", email: "", phone: "", message: "" };

/**
 * No email backend wired up yet — submitting just validates the
 * fields and shows a confirmation state. To make this real: add an
 * API route (e.g. app/api/contact/route.js) that sends the payload
 * to an email service (Resend, SendGrid, etc.) or writes it
 * somewhere, and call it with fetch() inside handleSubmit below
 * instead of going straight to setSubmitted(true). When you do,
 * re-check `honeypot` and the submit timing server-side too — see
 * the comment in useSpamGuard.js for why the frontend check alone
 * isn't enough on its own.
 *
 * A caught "spam" submission still shows the normal success state
 * (rather than an error) — telling a bot it was rejected only teaches
 * it to adapt; showing success and quietly doing nothing is the
 * standard honeypot pattern.
 */
export default function ContactForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [honeypot, setHoneypot] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { isSpam } = useSpamGuard();

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Both branches look identical right now because there's no real
    // API call yet to skip — the point of checking here is that once
    // one exists (see the comment above), it goes in the `else`
    // branch only, so a caught spam submission never actually reaches
    // your inbox/database while still looking successful to the bot.
    if (isSpam(honeypot)) {
      setSubmitted(true);
      return;
    }
    track("contact_form_submit");
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-2xl bg-sand p-8 text-center md:p-10">
        <CheckCircle2 size={32} className="mx-auto text-flame" />
        <p className="mt-4 font-display text-xl">Message sent</p>
        <p className="mt-2 text-sm text-charcoal">
          Thanks, {form.fullName.split(" ")[0] || "there"}, we&rsquo;ll get back to
          you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-2xl bg-sand p-8 md:p-10">
      <HoneypotField value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-ink/50">Full name</span>
          <input
            required
            value={form.fullName}
            onChange={update("fullName")}
            className="mt-1.5 w-full border-b border-ink/20 bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-ink/50">Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={update("email")}
            className="mt-1.5 w-full border-b border-ink/20 bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-wide text-ink/50">
            Phone <span className="normal-case text-ink/35">(optional)</span>
          </span>
          <input
            type="tel"
            value={form.phone}
            onChange={update("phone")}
            className="mt-1.5 w-full border-b border-ink/20 bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-xs uppercase tracking-wide text-ink/50">Message</span>
        <textarea
          required
          rows={4}
          value={form.message}
          onChange={update("message")}
          className="mt-1.5 w-full resize-none border-b border-ink/20 bg-transparent py-2 text-sm outline-none transition-colors focus:border-ink"
        />
      </label>

      <Button type="submit" variant="primary" size="lg" className="mt-2">
        Send message
      </Button>
    </form>
  );
}
