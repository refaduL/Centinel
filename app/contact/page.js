import { ArrowUpRight } from "lucide-react";
import ContactForm from "@/components/contact/ContactForm";
import { BRAND_ORIGIN } from "@/lib/products";
import { BRAND_EMAIL, BRAND_PHONE, BRAND_PHONE_HREF } from "@/lib/brand";

const TITLE = "Contact | Sentinel";
const DESCRIPTION = "Questions about a piece, an order, or anything else. Get in touch.";

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: { title: TITLE, description: DESCRIPTION },
};

const SOCIALS = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Pinterest", href: "https://pinterest.com" },
];

const CONTACT_DETAILS = [
  { label: BRAND_EMAIL, href: `mailto:${BRAND_EMAIL}` },
  { label: BRAND_PHONE, href: BRAND_PHONE_HREF },
  { label: BRAND_ORIGIN, href: null },
];

/**
 * Rebalanced from the previous version, which paired the form against
 * a stack of THREE separate elements (an image, a "Find us" list, and
 * a "Follow along" list) — that column ended up considerably taller
 * than the form next to it, leaving an awkward gap of empty space
 * under the form. Two fixes: the image is gone (it wasn't load-
 * bearing content, just filler standing in for a map we don't have),
 * and "Find us"/"Follow along" are now one panel instead of two
 * separately-headed blocks. Both the form (ContactForm.jsx) and this
 * info panel are now `bg-sand rounded-2xl p-8/p-10` — matching frames
 * of comparable visual weight, so they read as a deliberate pair
 * regardless of the exact pixel height of their content.
 */
export default function ContactPage() {
  return (
    <main className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page">
        <h1 className="font-display text-display-lg">Contact us</h1>
        <p className="mt-4 max-w-md text-charcoal">
          Questions about a piece, an order, or just want to talk lamps and
          clay, we&rsquo;d like to hear it.
        </p>
        <div className="mt-10 border-t border-ink/15" />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <ContactForm />

          <div className="rounded-2xl bg-sand p-8 md:p-10">
            <p className="text-xs uppercase tracking-widest text-ink/45">Say hello</p>
            <ul className="mt-4">
              {CONTACT_DETAILS.map((item) => (
                <li key={item.label} className="border-b border-ink/10 py-3">
                  {item.href ? (
                    <a
                      href={item.href}
                      className="flex items-center justify-between text-sm text-ink transition-colors hover:text-flame"
                    >
                      {item.label}
                      <ArrowUpRight size={15} />
                    </a>
                  ) : (
                    <span className="block text-sm text-ink/70">{item.label}</span>
                  )}
                </li>
              ))}
            </ul>

            <p className="mt-10 text-xs uppercase tracking-widest text-ink/45">Stalk us</p>
            <ul className="mt-4">
              {SOCIALS.map((social) => (
                <li key={social.label} className="border-b border-ink/10 py-3 last:border-b-0">
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between text-sm text-ink transition-colors hover:text-flame"
                  >
                    {social.label}
                    <ArrowUpRight size={15} />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
