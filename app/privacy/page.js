import { BRAND_EMAIL, BRAND_NAME } from "@/lib/brand";
import { BRAND_ORIGIN } from "@/lib/products";

export const metadata = {
  title: "Privacy policy | Centinel",
  description: "How Centinel collects, uses, and protects your information.",
};

/**
 * Real policy content, not a placeholder — but written by an AI
 * assistant, not a lawyer. It's accurate to what this site actually
 * does today (cookieless page-view analytics via Vercel Analytics, no
 * third-party payment processor since checkout is cash-on-delivery
 * only, no data sold to anyone) rather than generic boilerplate
 * copied from elsewhere. Still genuinely worth a real legal review
 * before launch, especially for Bangladesh-specific consumer-
 * protection requirements and if you ever ship to customers outside
 * Bangladesh (which can trigger rules like GDPR depending on who's
 * buying). Update the sections below (particularly "Analytics" and
 * "Sharing your information") the moment any of that changes —
 * switching analytics providers, adding a payment gateway, an email
 * service, etc. all belong here the day they're added, not after the
 * fact.
 */
export default function PrivacyPage() {
  return (
    <main className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page max-w-2xl">
        <h1 className="font-display text-display-lg">Privacy policy</h1>
        <p className="mt-3 text-sm text-ink/50">Last updated: 2026</p>

        <div className="mt-10 space-y-10 text-charcoal">
          <section>
            <p>
              This policy explains what information {BRAND_NAME} collects when
              you use this site, why we collect it, and what you can do about
              it. By using this site, you agree to what's described below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">
              Information we collect
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5">
              <li>
                <strong>When you place an order:</strong> your name, phone
                number, delivery address, and the items you've ordered.
              </li>
              <li>
                <strong>When you contact us or join our mailing list:</strong>{" "}
                your name and email address, and anything you write in the
                message field.
              </li>
              <li>
                <strong>Automatically, when you browse:</strong> basic,
                aggregated visit data (which pages are viewed, roughly how
                visitors found the site) via Vercel Analytics, a cookieless
                analytics tool. It doesn't use tracking cookies and doesn't
                build a profile tied to you individually. It's also used to
                record when a cart, checkout, or form action happens (e.g. an
                item was added to a cart) so we can see where visitors run into
                trouble, again without identifying who did it.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">How we use it</h2>
            <p className="mt-3">
              Solely to fulfill your order, respond to what you've asked us,
              and, if you've opted in, send occasional updates about new pieces
              or offers. We don't use your information for anything else, and we
              don't build advertising profiles from it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Analytics</h2>
            <p className="mt-3">
              This site uses Vercel Analytics to understand traffic and how
              visitors move through it (for example, where in checkout people
              tend to stop). It's cookieless, doesn't sell or share data with
              advertisers, and doesn't track you across other sites. We don't
              currently run any advertising or cross-site tracking of any kind.
              If that changes, this section will be updated to say exactly
              what's added and why.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">
              Sharing your information
            </h2>
            <p className="mt-3">
              We don't sell or rent your information to anyone. Checkout is
              currently cash-on-delivery only, so no third-party payment
              processor ever receives your details. If that changes (e.g. a card
              payment provider is added later), this section will name exactly
              who and what's shared with them.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">
              How long we keep it
            </h2>
            <p className="mt-3">
              We keep order information for as long as reasonably needed for
              record-keeping and to handle any questions about a past order. You
              can ask us to delete your information at any time. See "Your
              rights" below.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Your rights</h2>
            <p className="mt-3">
              You can ask us what information we hold about you, ask us to
              correct it, ask us to delete it, or unsubscribe from any mailing
              list at any time. Email{" "}
              <a
                href={`mailto:${BRAND_EMAIL}`}
                className="text-flame hover:underline"
              >
                {BRAND_EMAIL}
              </a>{" "}
              and we'll act on it promptly.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">
              Children's privacy
            </h2>
            <p className="mt-3">
              This site is not directed at children, and we don't knowingly
              collect information from anyone under 13.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">
              Changes to this policy
            </h2>
            <p className="mt-3">
              If this policy changes in any meaningful way, we'll update the
              date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl text-ink">Contact</h2>
            <p className="mt-3">
              Questions about this policy or your information:{" "}
              <a
                href={`mailto:${BRAND_EMAIL}`}
                className="text-flame hover:underline"
              >
                {BRAND_EMAIL}
              </a>
              . {BRAND_NAME} is based in {BRAND_ORIGIN}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
