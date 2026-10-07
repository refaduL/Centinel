# Progress tracker

This file exists because big multi-part requests sometimes run out of
room in a single session before every item gets a reply sent back.
When that happens, the _code changes usually still landed_ — what's
missing is just the summary message. So:

**At the start of any session working on this project: read this file
first, then verify its claims against the actual code (grep for the
thing, don't just trust the checkbox) before assuming anything is
still outstanding.** Checked-off items have been spot-verified once
(balance-checked, greeped for stale references, or manually read) —
but re-verify rather than re-doing work from scratch.

**At the end of any session** (or before a response that implements
part of a large ask): update this file — check off what's done, add a
line for anything new that came up, and note anything left
half-finished with enough detail that a cold read of this file alone
tells you where to pick up.

Newest session at the top.

---

## Session: interactive magnet-board hero (replaces the pinboard-photo hero)

Full rebuild of the homepage hero, plus doc updates. The previous
hero (see "Session: magnetic-board pinboard hero" below) was a single
photo of a real pinboard with 3 product cutouts taped over it. This
replaces it with a built, interactive version — the "pinboard" idea
taken further rather than abandoned.

- [x] **The board itself** — `components/home/Hero.jsx` (full
      rewrite) + a new `components/home/DraggablePin.jsx` (drag, the
      load-in entrance, the click-to-fall exit — all shared behavior
      lives here, Hero.jsx only supplies what each piece looks like).
      5 pieces picked by id via `HERO_CAST`: 2 photo polaroids, 2
      die-cut stickers (need `image_png`), 1 taped photo strip
      (desktop-only), plus a brand stamp, an enamel "made in" sign,
      and a paper ticket carrying the one CTA. Every piece is
      draggable within the board's bounds.
- [x] **Entrance + the one "premium" flourish** — pieces drop in from
      above (3D tilt, motion-blurred, staggered per-piece) with no
      bounce on landing — an earlier version did bounce and read as
      cheap/shaky in testing, removed entirely rather than tuned down.
      Once settled, a single light sweep crosses the steel once
      (`screen`-blended, not `overlay` — tried first, nearly invisible
      against this light background) and never repeats.
- [x] **Click-to-fall** — clicking a product piece sends it tumbling
      off the board and scrolls to that product's card in the
      collection, which briefly glows. New `lib/fallToProduct.js` does
      the scroll+highlight; needed `id="product-<id>"` on the product
      card, which `ProductCard.jsx` already had from the old hero's
      anchor-link approach (its comment describing _why_ is now
      updated to match the current mechanism). The fall path itself
      went through several rounds based on direct user feedback
      against a reference image — zigzag, then a sine-wave flutter,
      then finally one wide train-track-style turn (straight, a broad
      bend, straight again along a new diagonal, never oscillating) —
      every keyframe stop sampled from a continuous function rather
      than hand-picked, after hand-picked values produced a rate-of-
      change jump between segments that read as a stutter.
- [x] **Mobile got its own layout, not a scaled-down desktop one** —
      below `md` the board is height-first (`calc(100dvh - 8rem)`,
      filling the opening screen) with width capped against that same
      height, rather than the reverse; two extra pieces fill what was
      otherwise dead space on tall phones, and drop out again on short
      landscape ones via plain CSS (`.mood-landscape-hide`), not a
      stacked Tailwind variant.
- [x] **Merged into this specific project** (this repo, as handed over
      — distinct from the design work above, which happened against an
      earlier snapshot). Diffed against the handed-over zip before and
      after: exactly 6 files touched —
      `components/home/Hero.jsx` (replaced), `DraggablePin.jsx` and
      `lib/fallToProduct.js` (new), `tailwind.config.js` (added the
      `pin`/`fall`/`sweep` keyframes only), `app/globals.css` (added
      `.product-focus-pulse` and `.mood-landscape-hide` only), and
      `app/page.js` (one line: `pinnedProducts={topPicks}` →
      `products={allProducts}`, since this hero picks 5 specific
      products by id rather than just the top picks). Nothing in
      checkout, cart, contact, SEO, or spam protection touched.
- [x] **Doc pass** — `CLAUDE.md`'s folder-structure tree updated for
      the two new files + its `ui/` line, which was already stale
      before this session (said "currently: Button.jsx", actually 4
      files — not something this session caused, fixed while already
      in there). Also fixed a real bug in `CLAUDE.md`: it claimed cart
      state "has no persistence," which hasn't been true since the
      Tier 1 session below added `localStorage` — README.md and this
      file already had it right, CLAUDE.md just never got updated.
      `README.md` got a new "The hero" section (previous one-liner
      described a hero that no longer exists) and the same tree fix.

**Verified this session:** every product id `HERO_CAST` references
still exists in this project's `data/products.json`, and both sticker
picks still have `image_png`. `BRAND_NAME`/`BRAND_TAGLINE`/
`BRAND_ORIGIN` exports match what Hero.jsx imports. `tailwind.config.js`
still loads (`node -e "require(...)"`) after the merge, with the
original colors/fontSize/maxWidth untouched. Full em-dash sweep on the
new Hero/DraggablePin files — all instances confirmed inside comments,
none in rendered text. Diffed the final merged project against the
original handover zip, file by file, to confirm only the 6 files above
changed.

**Open / things worth knowing:**

- No live `npm run dev` available in the environment this was built
  in — everything above was verified by direct inspection (grep,
  Node-loading the config, diffing files) and, for the animation
  physics specifically, by rendering isolated CSS test harnesses in a
  real headless browser and sampling/plotting actual positions — not
  by clicking through the real page. Worth a real run-through before
  shipping.
- The `image_png`-on-two-specific-products trap (now documented in
  README's new "The hero" section) is real and easy to trip on a
  future catalog edit — if `HERO_CAST`'s sticker picks ever lose their
  cutout, that piece breaks rather than gracefully falling back.
- The old hero's images (`public/images/hero/*.webp`) are now unused
  but weren't deleted — wasn't this session's call to make.
- The "magnetic-board pinboard hero" session below is now historical —
  left as-is rather than edited, same as any other superseded entry in
  this file, but a reader relying on it for current Hero behavior
  should read this entry instead.

---

## Session: Tier 2 - spam protection + analytics

Two asks, both scoped to "what's genuinely frontend, do it now":
spam protection for the contact form and both newsletter signups, and
analytics with real funnel visibility (not just page views).

- [x] **Spam protection** — two new shared files:
      `components/ui/useSpamGuard.js` (a hook: honeypot check + a
      1500ms minimum-fill-time trap) and
      `components/ui/HoneypotField.jsx` (the hidden field itself,
      positioned off-screen rather than `display:none`/`type="hidden"`
      since bots specifically look for those as honeypot tells).
      Wired into all three public forms: `ContactForm.jsx`,
      `NewsletterSignup.jsx` (footer), and `JoinMailingList.jsx`
      (homepage) — these were the three separate forms on the site,
      easy to miss one. A caught submission still shows the normal
      success state rather than an error — telling a bot it was
      rejected only teaches it to adapt.
      **Honest limit, told to the user directly**: this stops basic
      bots, not determined ones. Real rate limiting (blocking an IP
      after N attempts) needs server-side state, which doesn't exist
      yet — that part genuinely waits for the backend. When a backend
      is added, it should also re-check the honeypot value server-side
      rather than trusting the frontend check alone.
- [x] **Analytics** — `@vercel/analytics` added (new dependency),
      mounted once in `app/layout.js`. Chosen specifically because it
      requires zero signup/site-ID if deployed on Vercel (auto-
      associates with the deployment itself) — genuinely doable "on my
      own" with no account creation needed from the user, unlike every
      other analytics option. If not deployed on Vercel, the component
      silently no-ops; said so directly to the user rather than
      assuming their hosting.
      **Real funnel tracking, not just page views** — `track()` calls
      at the actual points the user cared about ("where people drop
      off"): `add_to_cart`/`remove_from_cart` (`CartContext.jsx`,
      with product name/price/quantity attached, not just a bare event
      name), `begin_checkout` (`CheckoutFlow.jsx`, fires once on mount
      only if the cart actually has items), `purchase` (in
      `placeOrder()`), `contact_form_submit`, and `newsletter_signup`
      (tagged `source: "footer"` vs `"homepage"` so the two forms are
      distinguishable in the dashboard) — the last two only fire on
      the non-spam path, so a caught bot submission doesn't inflate
      the numbers.
- [x] **Updated the privacy policy** — it previously stated "no
      analytics of any kind," which stopped being true the moment
      Analytics was added. Renamed "Cookies" to "Analytics" and
      rewrote both that section and the "Automatically" bullet under
      "Information we collect" to accurately describe what Vercel
      Analytics does (cookieless, no cross-site tracking, no data
      sold) — this is exactly the kind of drift the file's own top
      comment already warned about ("update the moment analytics...
      changes").

**Verified this session:** brace/paren balance across every touched
file, full em-dash sweep (all remaining instances confirmed to be
inside comments, none in rendered text), `products.json` still valid.

**Open / things worth knowing:**

- `npm install` needs to run again to pull in `@vercel/analytics`.
- Vercel Analytics only actually reports data if this is deployed on
  Vercel — if the user deploys elsewhere, this whole piece needs
  swapping for GA4/Plausible/PostHog/etc. The `track()` call sites are
  deliberately few and isolated (not spread through business logic)
  specifically to make that swap easy later.
- True rate limiting and server-side honeypot re-validation are still
  open, both waiting on the backend connection.

---

## Session: Tier 1 launch prep (404/error pages, real legal pages, cart persistence, SEO)

Scoped subset of the Tier 1 launch-readiness list from the last
session's assessment — explicitly deferring newsletter/contact-form/
order-storage until a real database is connected (per the user's own
framing), and doing everything else now.

- [x] **Custom 404** (`app/not-found.js`) and **error boundary**
      (`app/error.js`) — both branded, both use the existing design
      system (`Button`, brand fonts/colors). `app/error.js` only
      catches crashes below the root layout; added
      `app/global-error.js` too, for a crash in the root layout
      itself (Navbar/CartProvider/etc.) — that file necessarily
      includes its own `<html>/<body>` tags and deliberately avoids
      depending on anything from the layout that might have crashed
      (plain inline styles, no custom fonts assumed loaded).
- [x] **Real privacy and terms content** replacing both placeholder
      pages — written to accurately describe what this site actually
      does today (no analytics, no third-party payment processor since
      checkout is COD-only, no data sold). **Important caveat, told to
      the user directly and worth repeating here**: this is AI-written
      policy language, not lawyer-reviewed. Genuinely needs a real
      legal pass before launch, especially for Bangladesh-specific
      consumer-protection requirements. Both files have a comment
      flagging exactly which sections (Cookies/Sharing, and the
      returns window) need updating the moment analytics, a payment
      gateway, or a real return policy exist.
- [x] **Cart persistence via localStorage** (`CartContext.jsx`). Used
      the two-effect hydrate-then-save pattern specifically to avoid a
      real bug: a single naive "save on every change" effect would
      fire on the very first render with `items` still `[]`,
      overwriting whatever was actually saved before the "load" effect
      even got to read it back. Guarded with a `hasHydrated` flag so
      saving only starts after loading has finished. Also prunes any
      stale cart line whose product no longer exists in
      `data/products.json` (rather than just filtering it out of
      `lines` every render forever without ever cleaning up the
      underlying stored data). `try/catch` around both localStorage
      calls for private-browsing/storage-unavailable edge cases.
- [x] **SEO infrastructure**: `app/sitemap.js` (generates a product URL
      per catalog entry from `getAllProducts()`, not hardcoded),
      `app/robots.js` (disallows `/checkout` specifically — no SEO
      value in indexing someone's private checkout session),
      `metadataBase` + Open Graph/Twitter metadata on the root layout,
      a generated `app/opengraph-image.jsx` (Next's `ImageResponse`/
      Satori, brand name + tagline, no external image dependency),
      per-product Open Graph images (the product's own photo) and
      JSON-LD `Product` structured data (price/availability) on
      `app/products/[slug]/page.js`, and matching `openGraph` blocks
      on the products/contact pages.
      **New `SITE_URL` constant in `lib/brand.js`** (reads
      `NEXT_PUBLIC_SITE_URL` if set, falls back to a placeholder
      domain) — sitemap/robots/metadataBase all read from this one
      constant, so setting the real production domain in one place
      fixes all of them at once. **This still needs to be set to the
      real domain before launch** — right now it's a placeholder.
      Caught and fixed one bug in my own first draft here: I initially
      added a Next.js title _template_ (`"%s | Centinel"`) to the root
      metadata, which would have doubled up the brand name on every
      existing page (they all already spell out "Page | Centinel" in
      full) — removed the template before it shipped.

**Verified this session:** brace/paren balance across every touched
file, full em-dash sweep (caught one in `opengraph-image.jsx`'s `alt`
text specifically, since alt text counts as user-facing/accessible
text even though it's not visibly printed on the page), stray-
reference sweep, `products.json` still valid JSON.

**Deliberately not done this session** (per the user's own scoping):
newsletter signup, contact form, and "place order" still don't persist
anywhere real — all three need the actual database connection first.

**Open / things worth knowing:**

- `SITE_URL` in `lib/brand.js` is a placeholder domain. Set
  `NEXT_PUBLIC_SITE_URL` (or edit the fallback) to the real production
  URL before launch, or the sitemap/robots/social previews all point
  at a fake domain.
- Privacy/terms content needs real legal review, not just a read-
  through — flagged above and in both files' own comments.
- Couldn't verify the generated `opengraph-image.jsx` renders
  correctly without a real browser/deploy to check the actual PNG
  output — Satori's CSS subset is more limited than regular CSS, so
  it's the one file this session most worth a manual check on.

---

## Session: route-aware footer (conditional bg, hidden on checkout)

Two related asks: conditional footer background color per route, and
hiding the footer entirely during checkout.

- [x] `components/layout/Footer.jsx` converted to a client component
      (`usePathname()` needs one) — the only client component in
      `components/layout/` now. `bg-clay` on the homepage specifically
      (matches `JoinMailingList` right above it there), `bg-sand`
      everywhere else. Returns `null` entirely on any `/checkout`
      route — a deliberate distraction-free checkout, not an
      oversight.

**Verified this session:** brace/paren balance, em-dash sweep (both
comments only, nothing in rendered text).

**Open / nothing outstanding from this request.** If more no-footer
routes are needed later, extend the same `pathname.startsWith(...)`
check near the top of `Footer.jsx` rather than adding a second
condition elsewhere.

---

## Session: cart-state buttons, image-based receipt export, skeleton loading

Three separate fixes:

- [x] **Add to cart button didn't reflect cart state.** Added
      `isInCart(productId)` to `CartContext.jsx` (checks membership in
      `items`). All three add-to-cart locations — `ProductCard.jsx`'s
      compact-variant sliding bar, its rich-variant Button, and
      `ProductDetail.jsx`'s main Button — now toggle between "Add to
      cart" and "Remove from cart" based on it. Caught a UX bug while
      building this: the compact card's bar is hidden-until-hover on
      desktop, so once toggled to "Remove from cart" it would've
      stayed invisible until the next hover — fixed by forcing it
      permanently visible once `inCart` is true, not just on
      hover/focus.
- [x] **Receipt export changed from plain text to a PNG image.** Added
      `html2canvas` (new dependency) to capture the actual rendered
      receipt card and download it as `receipt-<orderId>.png`, at
      `scale: 2` for retina sharpness. Dynamically imported (`await
    import("html2canvas")`) inside the click handler rather than a
      top-level import, so the library only loads when someone
      actually clicks download, not on every checkout page load.
      **Also replaced the barcode's CSS `repeating-linear-gradient`
      with real SVG `<rect>` bars** — html2canvas has known trouble
      rendering repeating-gradient backgrounds accurately, but renders
      plain SVG shapes reliably; this was a correctness fix for the
      export, not a visual change to the on-screen version (it should
      look the same either way).
- [x] **Skeleton loading added**, using Next.js's file-based
      `loading.js` convention (automatic Suspense boundary per route
      segment, no manual wiring beyond the file existing). New
      `components/ui/Skeleton.jsx` primitive (a shimmering block,
      moving-gradient sweep rather than flat opacity-pulse — the
      animation lives in `app/globals.css` as a `.skeleton` utility
      class + `skeleton-shimmer` keyframe, already covered by the
      existing `prefers-reduced-motion` block). Added `loading.js` for
      `/` (mirrors just Hero, the above-the-fold content), `/products`
      (mirrors the rich card grid), `/products/[slug]` (mirrors
      ProductDetail), `/checkout` (mirrors the shipping-form step),
      and `/contact` (mirrors the two matching panels). Each one's
      skeleton shapes are sized to roughly match their real
      counterparts specifically to minimize layout shift when real
      content swaps in.

**Worth being honest about**: this project's data fetching
(`lib/products.js`) is synchronous local JSON reads — there's no
actual network/database latency for these skeletons to cover _yet_.
They're not wasted effort though: Next.js still shows `loading.js`
during real client-side route-transition latency (the round trip to
the server + RSC payload), and — more importantly — this is exactly
the mechanism that will start actually mattering the moment
`lib/products.js`'s functions are rewritten to hit a real database,
which the whole data layer was already built to anticipate.

**Verified this session:** brace/paren balance across every touched
file, em-dash sweep on all new/edited rendered text.

**Open / things worth knowing:**

- Wasn't able to visually test the html2canvas capture in a real
  browser (no browser available in this environment) — the SVG-
  barcode swap specifically addresses html2canvas's most commonly-
  reported rendering gap, but worth a real click-through to confirm
  the exported PNG looks right before relying on it.
- `npm install` needs to run again to actually pull in `html2canvas`
  (added to `package.json`, not yet installed in this environment).

---

## Session: user-provided Hero/Footer replacement + receipt shipping line + download button

Two asks: (1) fully replace Hero.jsx and Footer.jsx with versions the
user edited themselves outside this conversation, (2) fix the
checkout receipt — it was missing a shipping charge line, and needed
a button to download/save the order info.

- [x] `components/home/Hero.jsx` and `components/layout/Footer.jsx`
      replaced verbatim with the user-provided files. Notable
      intentional change worth knowing: Hero's board image reverted
      to the ORIGINAL `magnetic-board.webp` (with the user's own
      pre-existing pinned photos baked in) rather than the
      `magnetic-board-clean.webp` version from last session — that's
      a deliberate choice in the file they provided, not something I
      should second-guess or revert.
- [x] New Footer introduces links to `/privacy` and `/terms`, which
      didn't exist as routes — would have 404'd. Added minimal, openly
      -labeled placeholder pages (`app/privacy/page.js`,
      `app/terms/page.js`) rather than leaving the links broken or
      silently removing them. Each page says in its own comment and
      copy that it's a placeholder pending real policy text.
      **NewsletterSignup.jsx** is no longer imported by the new
      Footer, but it's still used by `JoinMailingList.jsx` — not
      orphaned, no action needed.
- [x] Checkout receipt fix — `CheckoutFlow.jsx`'s `placeOrder()` now
      snapshots `subtotal` and `shipping` alongside `lines`/`total`
      (previously only `lines`/`total` were captured, so there was
      no shipping figure available to show even though `useCart()`
      already exposes it). `OrderReceipt.jsx` now renders SUBTOTAL and
      SHIPPING as their own dotted-leader lines above TOTAL.
- [x] Added a "Download receipt" button to `OrderReceipt.jsx` — builds
      a plain-text version of the same receipt (Blob + a temporary
      anchor click, triggers a normal browser file download) and saves
      it as `receipt-<orderId>.txt`. Deliberately not a PDF/image
      export — that would need a new dependency (jsPDF, html2canvas,
      etc.) and is much harder to verify without a real browser to
      render it in; plain text needed neither. The button uses
      `variant="inverse"`, matching "Continue shopping" right below it
      — both sit on the same `bg-flame` band, where the quieter
      `ghost` variant (designed for light backgrounds) would be hard
      to see.

**Verified this session:** brace/paren balance across every touched
file, em-dash sweep on rendered text in the new receipt code, full
stray-reference and bare-hash-link sweep across the whole project.

**Open / things worth knowing:**

- The download is plain text, not a styled PDF or image. If a
  visually-formatted downloadable receipt is wanted later, that's a
  bigger addition (a new rendering dependency) — flagging now so it's
  a deliberate choice, not a surprise.
- Didn't touch the Hero/Footer positioning values themselves per the
  user's explicit "I fixed the positioning... fully replace" — verify
  those render as intended in an actual browser, since neither I nor
  they have confirmed the final look here.

---

## Session: magnetic-board pinboard hero

Redesigned the homepage Hero as a magnetic pinboard: user provided a
real reference photo of their own pinboard (with a no-bg crop), then
asked to pin product photos on it with a "hand" cursor and click-to-
scroll to the product in ProductShowcase.

- [x] The reference photo's interior had the user's own existing
      pinned photos baked in (a cat, a wedding, a dalmatian, etc.) —
      using it as-is would've put random unrelated photos on the
      homepage. Fixed by scanline-sampling the image in Python/PIL to
      find the exact frame boundary and one small area of interior
      metal free of any pins, then tiling that clean patch (mirrored/
      flipped per tile to hide seams, slight Gaussian blur) back into
      the interior — while leaving the original, real photographed
      wood frame completely untouched. Saved as
      `public/images/hero/magnetic-board-clean.webp`. Verified the
      alpha channel survived correctly (interior opaque, frame opaque,
      outside-frame transparent) before using it.
- [x] `components/product/ProductCard.jsx` — the compact variant's
      root `<article>` now has `id={`product-${id}`}` +
      `scroll-mt-28` (clearance for the fixed navbar), so an anchor
      link can scroll to one exact product card.
- [x] `components/home/Hero.jsx` rebuilt: 2-column layout (headline/
      CTA left, pinboard right), 3 pinned products absolutely
      positioned over the board image at hand-placed percentage
      coordinates, each rotated, with a small magnet-dot accent and a
      product-name label that fades in on hover. `cursor-grab` /
      `active:cursor-grabbing` for the "hand" cursor cue —
      nothing is actually draggable, it's a pure interaction signal.
      Pinned images use `drop-shadow` (not `box-shadow`) so the shadow
      follows the cutout's actual silhouette rather than boxing an
      invisible rectangle.
- [x] `app/page.js` now passes `topPicks` to `Hero` as
      `pinnedProducts` — deliberately the SAME 3 products already
      fetched for `FeaturedStrip`, not a separately curated list,
      because those are currently the only products with an
      `image_png` cutout (see `getDisplayImage()` in `lib/products.js`).
      A regular photographed product shot would look like a rectangle
      taped to the board rather than a floating cutout.

**Verified this session:** brace/paren balance on all touched files,
confirmed the `image_png` files referenced by the 3 top-picks products
exist on disk, confirmed the cleaned board image's alpha channel is
correct (opaque interior/frame, transparent surround) before wiring it
into Hero.

**Open / things worth knowing:**

- The pin positions (`PIN_POSITIONS` in `Hero.jsx`) are hand-placed
  percentages chosen by reasoning about the board's interior bounds
  found via the Python scan, not verified in an actual rendered
  browser — worth a visual check, especially at narrow mobile widths
  where the board scales down a lot.
- Only 3 products can currently be pinned (only `topPicks` has cutout
  images). Shooting more `image_png` cutouts is what unlocks pinning
  more products — no code changes needed, `Hero.jsx` renders whatever
  list `app/page.js` passes it.
- If the _original_ board photo (with the user's own existing pinned
  items) is actually preferred over the cleaned version, that's a
  one-line swap in `Hero.jsx` (`magnetic-board.webp` instead of
  `magnetic-board-clean.webp`) — both files are in
  `public/images/hero/`.

---

## Session: repository inspection + CLAUDE.md

Read-only inspection requested (stack, structure, routing, components,
styling, data flow, auth, dependencies, conventions) plus a CLAUDE.md
documenting only what's actually observed in the repo, no invented
conventions. No existing files were modified.

- [x] Created `CLAUDE.md` at the project root — tech stack, folder
      structure, coding/React/styling/data conventions, build commands,
      constraints (no backend, no auth, no test framework).

**Open / nothing outstanding from this request.**

---

## Session: cart button clarity, footer v3, category taxonomy change, contact balance, receipt-style confirmation

5 separate asks this time:

- [x] 1. Homepage product card's quick-add button isn't understandable
     (icon-only Plus). Make it an actual legible "Add to cart" action.
- [x] 2. New footer reference (Leeuwarder Golfclub) — follow it, update
     current footer again.
- [x] 3. Category taxonomy changes from lamps/ceramics to **lamps,
     decor, dining** — update products.json category values,
     CategoryTabs labels, Navbar links, Footer links.
- [x] 4. Contact page layout feels unbalanced — fix it, and swap in
     playful copy ("Stalk us" instead of "Follow us," etc.).
- [x] 5. Checkout confirmation screen should look like a physical
     receipt (reference: West Tenth Denim receipt — script logo,
     dashed dividers, dotted-leader itemized list, barcode, monospace
     typewriter feel).

**Progress notes (update as completed):**

- [x] Task 1 done — `ProductCard.jsx` compact variant: icon-only Plus
      button replaced with a full "Add to cart" bar (text + icon) that
      slides up from the bottom of the image on hover/focus (desktop)
      or sits visible by default (touch). Fixed an HTML-validity bug
      along the way — first draft nested the `<button>` inside the
      `<Link>` (invalid, a button can't nest inside an anchor); it's
      now a sibling positioned over the same area instead.
- [x] Task 3 mostly done — `data/products.json` category values split
      from `ceramics` into `decor` (vessels/planters/vases) and
      `dining` (tumblers), `CategoryTabs.jsx` LABELS map updated,
      `Navbar.jsx` NAV_LINKS updated (dropped the redundant "Contact"
      entry that had crept in while I was at it, to keep the same item
      count/pill width as before — Lamps/Decor/Dining + "Our Story" is
      the same total as the old Lamps/Ceramics/Contact + "Our Story").
- [x] Task 2 done — `Footer.jsx` rebuilt around the Leeuwarder
      Golfclub reference: back to `bg-ink` (not `bg-charcoal`, that
      reference's footer is genuinely near-black), rounded TOP corners
      only, brand mark bleeding above that rounded edge via a
      negative-margin wrapper, centered name+tagline, then a two-column
      Contact/Quick-links layout with two `variant="inverse"` CTA
      buttons. Also fixed the category links here to decor/dining
      (task 3's remaining piece).
- [x] Task 4 done — `app/contact/page.js` rebalanced. Root cause of
      "not balanced": the form was paired against THREE stacked
      elements (image + two separately-headed link lists), making that
      column much taller than the form. Fixed by dropping the image
      (it was filler, not real content) and merging the two lists into
      one panel. Both the form and the info panel are now matching
      `bg-sand rounded-2xl` frames so they read as an intentional pair
      regardless of exact content height. Renamed "Follow along" to
      "Stalk us" per the ask, and "Find us" to "Say hello."
- [x] Task 5 done — new `components/checkout/OrderReceipt.jsx`
      following the West Tenth Denim reference: script brand name,
      dashed rules, a dotted-leader itemized list in monospace, a
      pure-CSS decorative barcode (a repeating-gradient background,
      no image asset, not scannable, same as a real receipt's barcode
      being decorative to everyone but the store's own scanner),
      "Thank you." in italic display type. Sits on a `bg-flame` band
      instead of the usual dashed `CheckoutCard` shell (stacking two
      decorative frames looked cluttered, not more retro).
      **Found and fixed a real bug while wiring this in**: the
      confirmation screen was reading `lines`/`total` live from
      `useCart()`, but `clearCart()` runs right before that screen
      renders, so it would have shown an empty receipt (this bug
      already existed in the previous plain-text confirmation too, it
      would've silently shown ৳0, just less obviously broken than an
      empty itemized list makes it). Fixed with an `orderSnapshot`
      captured in local state at the moment of `placeOrder()`, before
      `clearCart()` runs.

**Verified this session:** brace/paren balance across every file,
stray-reference sweep (including a check for any remaining
`category=ceramics` links after the taxonomy change), bare-hash
cross-page link check, and a full em-dash sweep confirming zero
remain in rendered text.

**Open / nothing outstanding from this request.**

---

## Session: footer overhaul, no em dashes, product showcase spacing + card redesign

Request had 4 parts: (1) footer links weren't visible/accessible,
redesign like Saturn Skin with columns; (2) never use em dashes
anywhere; (3) fix awkward heading/subtitle/filter spacing on the
product showcase; (4) make the homepage product listing visually
distinctive.

- [x] `Footer.jsx` rebuilt again — full-width `bg-charcoal` (not
      `bg-ink`, so it doesn't repeat a color the visitor just saw one
      section up in Manifesto/JoinMailingList), wordmark left, 3
      labeled link columns right (Shop/Studio/Connect) instead of the
      old single slim row. Content still constrained by
      `container-page` like every other section — "full width" means
      the background spans edge to edge, not the text.
- [x] Em dash sweep: grepped every `.jsx`/`.js` file, found ~174
      occurrences, fixed the ~23 that were in actual rendered
      user-facing text (headings, body copy, page `<title>` strings —
      used `|` as the title separator). Left em dashes inside `//` and
      `/** */` code comments alone — no visitor ever sees those, and
      rewriting 150+ of them serves no functional purpose. Spot-check
      command if you need to re-verify:
      `grep -n "—" -r . --include="*.jsx" --include="*.js" | grep -v "^\./.*: *//\|^\./.*:\s*\*"`
      (should only return comment lines).
- [x] `ProductCatalog.jsx` now owns its own heading (`title`/
      `description` props) in the SAME flex row as `CategoryTabs`,
      instead of the caller rendering a heading separately above with
      tabs floating alone on their own row below (the actual cause of
      the "awkward spacing" — an unbalanced row with nothing paired
      against the tabs). Fixed once here, both `ProductShowcase.jsx`
      (homepage) and `app/products/page.js` updated to use it.
- [x] `ProductCard.jsx` compact variant (homepage grid) redesigned:
      a large faint index number (01, 02, 03...) in normal flow above
      each card with a slight negative-margin tuck-under, a framed
      card with hover lift, and the category shown as a small
      flame-tinted pill instead of plain uppercase text.
      Deliberately did NOT do an absolutely-positioned bleed-behind-
      the-card version of the number — that depends on precise font-
      metric math I can't visually verify without a browser, and a
      wrong overlap reads as a bug. `ProductGrid.jsx` passes `index`
      through for this; resets per grid (so filtering by category
      renumbers from 01) since it's meant to read as "which plate is
      this in what you're looking at now," not a permanent ID
      (`sku` already covers that).
- [x] README updated: product-data JSON example, footer section,
      Button variant list — all already matched reality from last
      session's edits, only small wording tweaks needed this time.

**Verified this session:** brace/paren balance across every file,
grep sweep for stale references, grep sweep confirming zero em dashes
remain in rendered text (comments only).

**Open / nothing outstanding from this request.** One thing worth a
real browser check next time you're testing: the ProductCard number's
`-mt-3`/`-mt-4` tuck-under amount was chosen by reading the Tailwind
values, not by looking at it rendered — worth eyeballing on an actual
screen in case it needs a pixel nudge either direction.

---

## Session: subscription/footer/retro-checkout + FeaturedStrip data update

Request had 4 parts: (1) redesign the newsletter signup like the narra
reference, (2) redesign the footer like narra, (3) retro-style the
checkout flow, (4) adopt the user's own updated FeaturedStrip.jsx +
products.json (new product, new `image_png` cutout fields, renamed
`top3picks` picks).

- [x] Adopt user-provided `FeaturedStrip.jsx` — kept their layout
      (centered name, metadata table) but routed the image through
      `getDisplayImage()` instead of reading `product.image_png`
      directly, so a future top-pick without a cutout shot degrades to
      its regular photo instead of a broken image.
- [x] `lib/products.js`: added `PRODUCT_ORIGIN` (alias of
      `BRAND_ORIGIN`), updated `getDisplayImage()` to read the
      `image_png` field name (was `cutoutImage` in an earlier session).
- [x] Adopted user-provided `products.json` — new product
      `black-ceramic-desk-lamp`, `top3picks` now
      `tapered-red-dome-lamp` / `black-ceramic-desk-lamp` /
      `brutalist-stone-vase-set`.
- [x] Copied the 3 new `-no-bg.webp` cutouts + the new product's
      regular `.jpeg` into `public/images/products/` — verified every
      path in `products.json` resolves to a real file on disk.
- [x] `NewsletterSignup.jsx` — matches narra: sits directly on the
      footer's dark bg (no separate light strip), plain cream pill
      button. Added `Button` `variant="inverse"` for this (see
      `components/ui/Button.jsx`) since the hard black shadow on
      primary/secondary needs a light background to read against.
- [x] `JoinMailingList.jsx` (new, homepage-only, between Manifesto and
      ProductShowcase — see `app/page.js`) — the _other_ reference
      (Saturn Skin's "Join the Mailing List" card) went here rather
      than into the footer: a bigger, deliberate "before you go"
      moment with two rotated sticker badges, distinct from the
      footer's quiet utility bar. Reuses `bg-clay` (already existed as
      the accent's hover shade) as its background rather than adding a
      new color.
- [x] `Footer.jsx` — rewritten as one continuous dark panel wrapped as
      a rounded floating card with page margin (same visual language
      as `Hero.jsx`), giant wordmark, one slim link row (not the old
      4-column block), social icons as circles, copyright line. Email/
      phone dropped from the footer body — that's on `/contact` now,
      and narra's own footer doesn't repeat it either.
- [x] `CheckoutFlow.jsx` — retro pass: everything now renders inside a
      shared `CheckoutCard` shell (dashed border, rounded-[2rem]) with
      a rotated corner sticker badge reading "Cash on delivery,"
      `border-2` throughout instead of hairlines, dashed step-connector
      in the step indicator. Still strictly the 5-color palette — the
      retro feel is borders/shapes, not new colors.
- [x] README updated to match all of the above (product-data JSON
      example, footer section, checkout section, Button variant list).

**Verified this session:** brace/paren balance across every `.js`/
`.jsx` file, grep sweep for stale references (`cutoutImage`,
`getFeaturedProducts`, `.featured`, `Lumen`, bare-hash cross-page
links), and confirmed every image path in `products.json` resolves to
a file that actually exists in `public/`.

**Open / nothing outstanding from this request.**

---

## Session: Centinel rebrand + navbar/all-products/product-detail overhaul

(Summarized from before this file existed — see git history / the
zip from that turn for exact diffs if needed.)

- [x] Renamed brand to "Centinel," tagline "Objects for your
      considered living," centralized in `lib/brand.js`.
- [x] Logo wired into navbar (`public/images/brand/logo.jpeg`) + used
      as `app/icon.jpeg` favicon.
- [x] `top3picks` boolean replacing `featured` (superseded by the
      session above, which changed which 3 products are flagged).
- [x] Fixed `/products` → `#manifesto` cross-page link bug — every
      such link is now `/#manifesto` (absolute), not a bare hash.
- [x] Built full checkout flow (later restyled retro — see above).
- [x] Footer made global, first version built (later restyled to
      match narra — see above).
- [x] Contact page built (`/contact`).

---

## Template for a new entry

```
## Session: <short description>

- [ ] task
- [ ] task

**Open / carrying into next session:** <what's left, if anything>
```
