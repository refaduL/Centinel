# Centinel

_Objects for your considered living._

> **Working across multiple sessions?** Check `PROGRESS.md` first —
> it tracks what's been asked and done turn-by-turn, specifically so a
> new session can pick up mid-task instead of re-discovering state.

A Next.js (App Router) + Tailwind storefront — a floating pill navbar,
a moodboard-style hero, a homepage product showcase, a full catalog
page, individual product pages, a slide-over cart, a working
step-by-step checkout (cash on delivery), and a contact page.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. This project was put together without a
network connection, so `npm install` hasn't been run yet — do that
first; it generates the lockfile and pulls in exact dependency
versions (Next, Tailwind, lucide-react, html2canvas, @vercel/analytics).

## Folder structure

```
app/
  layout.js              Root layout — fonts, CartProvider, Navbar, Footer, CartDrawer
  page.js                 Home page — assembles the sections below
  globals.css             Tailwind base + a few global rules
  icon.jpeg                Favicon (the logo)
  products/
    page.js                All-products page (supports ?category=lamps etc.)
    [slug]/page.js          Single product detail page
  checkout/
    page.js                 /checkout — wraps CheckoutFlow
  contact/
    page.js                 /contact — headline + form + social/contact links

components/
  layout/
    Navbar.jsx             The floating pill nav — see below
    Footer.jsx              Global footer — see below
    NewsletterSignup.jsx     Small client component used inside Footer
  home/
    Hero.jsx                Interactive magnet-board hero — see below
    DraggablePin.jsx        Drag/entrance/fall behavior for every piece on
                             the board; Hero.jsx supplies what each looks
                             like, this owns how it moves
    FeaturedStrip.jsx       "Top picks" section — see Product photos below
    Manifesto.jsx           Short brand statement
    ProductShowcase.jsx     Homepage wrapper around ProductCatalog
    JoinMailingList.jsx     Homepage-only "Join the mailing list" moment —
                             see below, distinct from the footer's signup row
  product/
    ProductCatalog.jsx      Shared tabs + grid + "View more" logic (used by
                             ProductShowcase AND app/products/page.js)
    ProductCard.jsx         Single product — "compact" (homepage) and "rich"
                             (catalog page) variants
    ProductGrid.jsx         Lays out a list of ProductCards
    ProductDetail.jsx       The interactive half of the product page —
                             quantity, add to cart, photo gallery arrows
    CategoryTabs.jsx        The "All / Lamps / Ceramics" filter control
  cart/
    CartContext.jsx         Cart state (items, totals, open/closed) — see below
    CartDrawer.jsx           The slide-over cart panel
  checkout/
    CheckoutFlow.jsx         Shipping → Payment → Review → Confirmation
  contact/
    ContactForm.jsx          The contact page's form (mock submit)
  ui/
    Button.jsx               The one hard-shadow button component — see below

data/
  products.json           Placeholder product data — see below

lib/
  brand.js                Brand name/tagline/contact constants — see below
  products.js             The ONLY file that reads data/products.json

public/images/
  brand/logo.jpeg          The logo
  products/                Product photography
  moodboard/                Design-reference images (not products, not
                             rendered anywhere in the UI)
```

## Brand constants

`lib/brand.js` is the one place `BRAND_NAME` ("Centinel"),
`BRAND_TAGLINE` ("Objects for your considered living"), `BRAND_EMAIL`,
`BRAND_PHONE`, `BRAND_PHONE_HREF`, and `SITE_URL` are defined. Navbar,
Footer, Manifesto, and the contact page all import from here instead
of hardcoding the strings — a rebrand or a real phone number replacing
the placeholder is a one-file change. (`BRAND_ORIGIN`, the "made in"
string, lives in `lib/products.js` instead, alongside the other
catalog-derived display helpers — see below.)

**`SITE_URL` needs to be the real production domain before launch.**
It reads `process.env.NEXT_PUBLIC_SITE_URL` if set, otherwise falls
back to a placeholder (`https://Centinel.example.com`) — and it's the
single source `app/sitemap.js`, `app/robots.js`, and
`metadataBase`/Open Graph tags in `app/layout.js` all read from, so
fixing it in one place fixes the sitemap, robots.txt, and every page's
social-share preview at once. See "SEO" below.

## Working with product data

Every component reads products through the functions in
`lib/products.js` (`getAllProducts`, `getProductsByCategory`,
`getTopPicks`, `getProductBySlug`, `getAdjacentProducts`,
`getCategories`, plus the derived helpers below) — nothing imports
`data/products.json` directly. When you're ready to move to a real
database, rewrite the **inside** of those functions to run a query
instead of filtering an array, and keep the same names and return
shapes — nothing in `app/` or `components/` has to change.

To add a product, add an object to `data/products.json`:

```json
{
  "id": "unique-slug",
  "name": "Product Name",
  "category": "lamps", // lamps | decor | dining — new values
  // show up in the tabs automatically
  "material": "Material description",
  "price": 12000,
  "currency": "BDT",
  "description": "One or two sentences.",
  "scene": "golden", // daylight | golden | evening — used to
  // derive a "Collection" name on the
  // featured strip, see getCollectionName()
  "top3picks": false, // hand-picked, not automatic — see below
  "image": "/images/products/your-file.jpg",
  "image_png": null, // no-background cutout — see "Product photos"
  "tags": ["desk", "chrome"],
  "sku": "LC-112"
}
```

Drop the image file in `public/images/products/`. A few display fields
are deliberately _derived_ rather than stored, so they can't drift out
of sync with the rest of the catalog:

- **Collection name** (shown on the featured strip) comes from the
  `scene` field via `getCollectionName()`.
- **Batch number** is generated from a product's position in the array
  via `getBatchLabel()` — cosmetic, not a real tracked batch size yet.
- **Country of origin** is two constants in `lib/products.js`:
  `BRAND_ORIGIN` (where the company is based — contact page, footer)
  and `PRODUCT_ORIGIN` (where the catalog is made — featured strip,
  product detail page). Same value today (`PRODUCT_ORIGIN` is just an
  alias of `BRAND_ORIGIN`), kept as two names since a brand's office
  and its workshop don't have to be the same place.

**`top3picks`** is a hand-picked flag, not "the 3 newest" or "the 3
most expensive" computed automatically — exactly 3 products in
`data/products.json` currently have it set to `true`
(`tapered-red-dome-lamp`, `black-ceramic-desk-lamp`,
`brutalist-stone-vase-set`). To change which pieces are featured on
the homepage, flip the flag on the products you want instead of
changing `getTopPicks()` in `lib/products.js`.

## Product photos

Every product has a regular `image` (a photo with its own background/
setting). Two things layer on top of that without needing component
changes:

- **Multiple angles**: add an `images: [...]` array to a product and
  the prev/next arrows on its detail page (`ProductDetail.jsx`) appear
  automatically — they're hidden (not faked) for any product that
  still only has one photo. `getProductImages()` in `lib/products.js`
  handles the fallback.
- **No-background "cutout" photos**: `image_png` (a PNG or WebP with a
  transparent background — the name predates the WebP ones, kept for
  continuity) is set on the 3 products currently flagged `top3picks`,
  and `null` on everything else. `FeaturedStrip.jsx` renders these, and
  goes through `getDisplayImage()` in `lib/products.js` rather than
  reading `product.image_png` directly — that function prefers the
  cutout when one exists and falls back to the regular `image`
  otherwise, so a future top pick without a cutout shot yet won't
  break, it'll just show its regular photo instead.

## The hero

`components/home/Hero.jsx` is a fridge-door magnet board, not a banner
image: a dark frame, a brushed-steel face, and loose pieces (product
polaroids, two die-cut stickers, an enamel "made in" sign, a brand
stamp, a paper ticket carrying the one CTA) held on with round
magnets. Every piece is draggable. All behavior — drag, the load-in
entrance, the click-to-fall exit — lives in one shared helper,
`DraggablePin.jsx`; Hero.jsx only supplies what each piece looks like
and where it sits.

**Picking the cast.** Hero doesn't render arbitrary products — it
picks exactly 5 by id, via a `HERO_CAST` map at the top of the file
(two as photo polaroids, two as die-cut stickers, one as a taped photo
strip, desktop-only). Rename or remove one of those ids in
`products.json` and that one piece just quietly doesn't render —
nothing crashes. **One real trap here**: the two sticker pieces read
`product.image_png` directly, not through `getDisplayImage()` (see
"Product photos" above) — Hero needs to know definitively that a piece
_is_ a cutout, not fall back to a regular photo the way that helper
does, since a sticker rendered from a regular photo (with its own
background) would look like a plain rectangle taped over the board,
not a floating cutout. That means if a future catalog edit ever removes `image_png` from
whichever two products are currently in `HERO_CAST`'s `stickerA`/
`stickerB` slots, that sticker breaks (a broken image) — it does not
gracefully fall back to the regular photo the way FeaturedStrip's
pieces would. Today those two happen to also be 2 of the 3
`top3picks` products, but that's just how the data currently lines
up — `image_png` and `top3picks` are independent fields in
`products.json`, nothing in code ties one to the other.

**The entrance.** On load, every piece drops in from above (tilted
back in 3D, motion-blurred, `animate-pin`), staggered by each piece's
own `delay` prop so they land one after another rather than all at
once. No bounce/overshoot on landing — deliberately: an earlier
version did overshoot and read as cheap/shaky. Once everything's
settled, a single glint of light sweeps once across the steel
(`animate-sweep`, a `screen`-blended cream gradient — `overlay` was
tried first and was nearly invisible against this light background —
worth remembering if you ever touch that blend mode) — the one
"premium" flourish, and a deliberate callback to copy already on the
board ("The light changes everything").

**Click-to-fall.** Clicking a product piece (not the ticket, sign, or
stamp) doesn't navigate it away — it falls off the board and the page
scrolls to that exact product's card in the collection grid below,
which briefly glows (`.product-focus-pulse` in `globals.css`). This
needs an `id` of `product-<id>` + `scroll-mt-28` on the product card
(already on `ProductCard.jsx`'s compact variant — see that file) and
`lib/fallToProduct.js`, which does the actual
`scrollIntoView`-plus-highlight once the fall animation finishes.
The fall itself (the `fall` keyframe in `tailwind.config.js`) is
tuned to look like real falling paper, not a straight drop or a
mechanical zigzag: a brief straight drop first (inertia), then one
wide, train-track-style turn — straight, a broad smooth bend, straight
again along a new diagonal, never oscillating back and forth — with
rotation that speeds up as it falls and a single lift-and-level tilt
right at the start. Every keyframe stop in there was sampled from a
continuous function (gravity easing, a smoothstep-blended turn), not
hand-picked, because hand-picked stops produced visible rate-of-change
jumps between segments that read as a stutter. A modified click
(ctrl/cmd/shift, middle-click) or keyboard Enter skips the fall
entirely and goes straight to the product page via the piece's own
`<Link>` — checked via `e.detail === 0` to tell a real pointer click
from a keyboard/assistive-tech-triggered one, since `e.button` alone
can't (both report `0`).

**Mobile is a different shape, not just a smaller one.** From `md`
up, the board is landscape (16:10) and its _width_ is capped against
viewport height, so it never runs off the bottom of a short laptop
screen. Below `md`, the board is portrait and the relationship flips —
its _height_ targets `calc(100dvh - 8rem)` (filling the opening
screen like a hero should) with _width_ then capped against that same
height, so a short/landscape phone shrinks the whole board
proportionally instead of stretching it into a flat strip. Two
pieces (`.mood-landscape-hide` in `globals.css`) drop out specifically
on short landscape phones, where the board is too squat for them to
fit without crowding — plain CSS there, not a stacked Tailwind
variant, since it's load-bearing enough to want to read directly
rather than trust to variant-stacking order.

## The navbar

`components/layout/Navbar.jsx` is a floating pill, `fixed` near the
top of the viewport, `w-full max-w-3xl` — wide, not a tiny
hugging-content chip, which is what creates the negative space between
the logo (far left) and the icon cluster (far right), and what keeps
the mobile version from looking sparse. It only animates
`background-color` and `box-shadow` on scroll (never width, padding,
or border-radius, which would force layout recalculation), and uses a
hysteresis window (on past 60px, off below 24px) rather than a single
threshold, so hovering right at the boundary can't cause flicker.

Every link in `NAV_LINKS` — and in Footer — uses an **absolute path**
(`/#manifesto`, not `#manifesto`). A bare hash only scrolls within
whatever page you're currently on; clicked from `/products` it did
nothing, because there's no `#manifesto` element there. This was a
real bug in an earlier version — fixed by always including the
leading `/`.

Because the navbar is `fixed`, it's removed from normal document flow,
so any page that doesn't have a big hero card up top (like
`/products`, the product detail page, `/checkout`, `/contact`) adds
its own `pt-32`-ish top padding to keep content clear of it.

## The footer

`components/layout/Footer.jsx` is **global** — rendered once in
`app/layout.js`. Currently a user-authored version (replaced wholesale
in a later session, not iterated on top of the previous one): a
rounded card (`bg-ink`, `rounded-[2rem]`) floating on a page-level
background, with the brand mark absolutely positioned to cross over
the card's top edge, and a low-opacity decorative SVG contour-line
pattern behind the content. Below the mark: centered brand name +
tagline + two `variant="inverse"` CTA buttons, then a three-column row
(Find us / Stalk us / Quick links), then a bottom legal bar (Privacy
policy, Terms, copyright).

**Route-aware, via `usePathname()`** (which is why this file is a
client component — the only one in `components/layout/`): the
page-level background is `bg-clay` on the homepage specifically (same
color `JoinMailingList` uses right above it there) and `bg-sand`
everywhere else, so it doesn't clash with whatever a given page's own
background happens to be. On any `/checkout` route, `Footer` returns
`null` and renders nothing at all — a deliberate, focused/distraction-
free checkout, not an oversight. Both behaviors live in the same
`if`/ternary near the top of the component; extend the `/checkout`
check if more no-footer routes are ever needed.

**No newsletter signup row in this version** — `NewsletterSignup.jsx`
is no longer imported here (it's still used by
`components/home/JoinMailingList.jsx`, so it isn't an orphaned file).

The bottom bar's `/privacy` and `/terms` links point to real pages
with real (if AI-drafted, not lawyer-reviewed — see "Legal pages"
below) policy content, not placeholder text.

`Footer.jsx`'s own `COLUMNS` array duplicates the category links
already in `Navbar.jsx`'s `NAV_LINKS` (lamps/decor/dining) rather than
importing one shared list — they need different shapes (flat vs.
nested under headings). If the category taxonomy changes again,
update both files.

## Join the mailing list (homepage)

`components/home/JoinMailingList.jsx` sits on the homepage between
`Manifesto` and `ProductShowcase`. Styled after the Saturn Skin
reference: a solid `bg-clay` section (reusing the accent's existing
hover-shade color, not a new one), a centered cream card, and two
rotated sticker badges overlapping its corners (plain `div`s with
`rotate-*` + a border, not images, so the wording is free to change
later without new assets). This is the site's one newsletter-signup
moment now that the footer's own version has been removed — see "The
footer" above.

## The cart

`components/cart/CartContext.jsx` stores `{ productId, quantity }`
pairs and joins them against `getAllProducts()` on read, so it never
goes stale relative to price or name changes elsewhere in the catalog.
Shipping estimate and total are computed once here too (`shipping`,
`total` in the context value) rather than separately in `CartDrawer`
and `CheckoutFlow`, so the two can't drift apart. `CartProvider` wraps
the whole app in `app/layout.js`; any component can call `useCart()`
for `items` / `itemCount` / `subtotal` / `shipping` / `total`, or call
`addItem` / `removeItem` / `updateQuantity` / `clearCart` /
`openCart` / `closeCart` / `isInCart`.

**Persists to `localStorage`** under the key `Centinel-cart-v1` — a
refresh or closed tab no longer loses the cart. Implemented as two
effects: one that loads from `localStorage` once on mount (and prunes
any line whose product no longer exists in `products.json`), and one
that saves on every change, gated behind a `hasHydrated` flag so the
save effect can't fire with the initial empty array and overwrite real
saved data before the load effect gets a chance to read it back. Both
localStorage calls are wrapped in `try/catch` for private-browsing/
storage-unavailable cases — the cart just doesn't persist that one
session rather than crashing. Still just this one browser's local
storage, not a real account or server-side cart — see the comment at
the top of `CartContext.jsx` for what to change when that's needed.

Every "Add to cart" button (`ProductCard.jsx`'s both variants,
`ProductDetail.jsx`) calls `isInCart(product.id)` and toggles to
"Remove from cart" when true, rather than always showing "Add to
cart" regardless of whether it's already there.

`components/cart/CartDrawer.jsx` is the slide-over panel, rendered
once (also in `app/layout.js`). Its "Proceed to checkout" button stays
inert until the terms checkbox is ticked, then becomes a real link to
`/checkout` (and closes the drawer on click).

## Checkout

`/checkout` (`app/checkout/page.js` → `components/checkout/CheckoutFlow.jsx`)
is a 3-step flow — Shipping details → Payment method → Review — ending
in a confirmation screen with a generated order number, then clears
the cart. **Cash on delivery is the only method actually wired up.**
Card and Mobile Banking show as visibly _disabled_ options in the
payment step (not hidden) — see the `PAYMENT_METHODS` array at the top
of `CheckoutFlow.jsx` for exactly what to change to turn one on: give
it a real `id`, drop `disabled: true`, and add whatever that
integration needs (e.g. a Stripe Elements form) gated on
`paymentMethod === "card"`.

Styled deliberately differently from the rest of the site through
Shipping/Payment/Review — a retro, dashed-border "poster card" look
(`CheckoutCard`, the shared shell those three steps render inside), a
rotated corner sticker badge announcing "Cash on delivery," and
`border-2` throughout instead of the hairline borders used elsewhere.
Still strictly the same 5-color palette — the retro feel comes from
borders/shapes, not new colors.

The final confirmation screen is a physical-receipt look instead
(`components/checkout/OrderReceipt.jsx`) rather than reusing
`CheckoutCard` — script brand name, dashed dividers, a dotted-leader
itemized list in monospace showing SUBTOTAL/SHIPPING/TOTAL as separate
lines, a decorative barcode (real SVG `<rect>` bars, not a real
scannable barcode), on a bold `bg-flame` band. Stacking it inside
`CheckoutCard` too would have been two decorative frames at once; this
reads calmer.

Below the receipt, a "Download receipt" button saves an actual PNG
screenshot of the rendered card (`receipt-<orderId>.png`) via
`html2canvas`, dynamically imported inside the click handler so the
library only loads when someone actually clicks it, not on every
checkout page load. A screenshot of what's really on screen was
chosen over hand-building a PDF specifically because it's much
lower-risk to get right without a real browser to verify rendering in
— a PDF would mean re-implementing this whole layout a second time in
a different API. The barcode uses real SVG rects rather than a CSS
`repeating-linear-gradient` background for the same reason:
html2canvas has known trouble capturing repeating-gradient
backgrounds accurately.

There's no backend behind any of this yet — `placeOrder()` in
`CheckoutFlow.jsx` generates a client-side order id and calls
`clearCart()`. **One thing to know if you wire up a real backend**:
`placeOrder()` also snapshots `{ lines, subtotal, shipping, total }`
into `orderSnapshot`
state _before_ calling `clearCart()` — the receipt reads from that
snapshot, not live from `useCart()`, because the live cart is already
empty by the time the confirmation screen renders. Keep that
snapshot-before-clear ordering (or the equivalent from your API
response) or the receipt will render with zero items.

## Contact page

`/contact` — a form (`components/contact/ContactForm.jsx`, mock
submit, no email backend yet) beside a matching info panel ("Say
hello" for email/phone/location, "Stalk us" for socials). Both are
`bg-sand rounded-2xl` panels of comparable visual weight on purpose —
an earlier version paired the form against three stacked elements
(an image plus two separately-headed lists), which made that column
much taller than the form and left an awkward gap underneath it.
Same pattern as checkout for wiring up real email: the `handleSubmit`
comment in `ContactForm.jsx` says exactly what to replace to send
real emails (an API route + a service like Resend).

## Legal pages

`/privacy` and `/terms` have real, specific policy content (not
generic boilerplate, not placeholder text) — written to accurately
describe what this site actually does today: no analytics, no
third-party payment processor (checkout is cash-on-delivery only), no
data sold to anyone. **This is AI-drafted policy language, not
lawyer-reviewed** — genuinely get a real legal review before launch,
especially for Bangladesh-specific consumer-protection requirements
and the returns-window language in `app/terms/page.js`. Both files
have a comment flagging exactly which sections need updating the
moment something changes — adding analytics, a payment gateway, or a
real return policy all belong there the day they're added.

## Error pages

Three Next.js file-based conventions, all branded rather than left as
framework defaults:

- `app/not-found.js` — shown for any unmatched route, and for the
  explicit `notFound()` call in `app/products/[slug]/page.js` when a
  slug doesn't match a real product.
- `app/error.js` — catches a crash anywhere below the root layout
  (Navbar/Footer still render around it). Must be a Client Component
  per Next.js's convention; logs to `console.error` for now — that's
  the one place to send errors to Sentry/etc. once you have one.
- `app/global-error.js` — the fallback for a crash in the root layout
  _itself_ (Navbar, CartProvider, fonts). `app/error.js` can't catch
  that, since it renders inside the very layout that would have
  crashed, so this file replaces the entire `<html>` document and
  deliberately avoids depending on anything from that layout (plain
  inline styles, no custom fonts assumed loaded) — the point is that
  it still renders something even if that layout is broken.

## SEO

- `app/sitemap.js` — generates a URL for every static page plus one
  per product, pulling the product list from `getAllProducts()` so a
  new product is in the sitemap on the next build with no changes
  needed here.
- `app/robots.js` — allows everything except `/checkout` (a private,
  per-customer flow with nothing worth indexing).
- `metadataBase` + Open Graph/Twitter metadata on the root layout
  (`app/layout.js`), so social shares get a real preview instead of a
  bare link.
- `app/opengraph-image.jsx` — a generated fallback social-share image
  (brand name + tagline) via Next's `ImageResponse`/Satori, not a
  static asset. Satori's supported CSS is a real subset of normal
  CSS/Tailwind (plain inline style objects only) — if you ever edit
  this file, keep that constraint in mind.
- The product detail page (`app/products/[slug]/page.js`) overrides
  Open Graph with the product's own photo, and renders JSON-LD
  `Product` structured data (name/price/currency/availability) for
  search engines. Availability is hardcoded `"InStock"` since there's
  no real inventory tracking yet — see "Notes" below.

All of this reads `SITE_URL` from `lib/brand.js`, which is currently a
**placeholder domain** — see "Brand constants" above for what to set
before launch.

## Spam protection

Two shared files back all three public forms: `components/ui/
useSpamGuard.js` (a hook — a honeypot check plus a 1500ms minimum-
fill-time trap; bots routinely submit forms within milliseconds of
loading them) and `components/ui/HoneypotField.jsx` (the trap field
itself, positioned off-screen rather than `display:none`/
`type="hidden"`, since bots specifically look for those two as
honeypot tells). Wired into `ContactForm.jsx`, `NewsletterSignup.jsx`
(footer), and `JoinMailingList.jsx` (homepage) — all three separate
signup/contact forms on the site.

A caught submission still shows the normal success state, not an
error — telling a bot it was rejected only teaches it to adapt;
showing success and quietly doing nothing is the standard pattern.

**This stops basic bots, not determined ones.** Real rate limiting
(blocking an IP after N attempts) needs server-side state, which
doesn't exist yet. When a real backend is connected, it should also
re-check the honeypot field's value itself, not trust the frontend
check alone — a bot that reads this source can simply stop filling
in a field it can see the code for.

## Analytics

`@vercel/analytics` (`<Analytics />` in `app/layout.js`) — chosen
specifically because it needs zero signup or site ID if this is
deployed on Vercel; it auto-associates with the deployment itself.
**If hosted elsewhere, this component silently does nothing** — swap
it for GA4/Plausible/PostHog/whichever you prefer instead.

Beyond automatic page views, `track()` is called at the actual funnel
points, not just scattered everywhere: `add_to_cart` /
`remove_from_cart` (`CartContext.jsx`, with product name/price/
quantity attached), `begin_checkout` (`CheckoutFlow.jsx`, only fires
if the cart actually has items), `purchase` (`placeOrder()`),
`contact_form_submit`, and `newsletter_signup` (tagged
`source: "footer"` vs `"homepage"` so the two signup forms are
distinguishable in the dashboard). The last two only fire on the
non-spam path — a bot's caught submission doesn't inflate the count.

If you switch analytics providers later, these `track()` calls are
deliberately the only places analytics logic lives — they're not
mixed into business logic, so swapping providers means updating these
specific call sites, not hunting through the codebase.

## Loading states

Every route (`/`, `/products`, `/products/[slug]`, `/checkout`,
`/contact`) has a `loading.js` next to its `page.js` — Next.js's
file-based convention, an automatic Suspense boundary with no manual
wiring beyond the file existing. Each one is built from
`components/ui/Skeleton.jsx` (a shimmering placeholder block, a moving
gradient sweep rather than a flat opacity-pulse — the actual animation
is a `.skeleton` utility class + `skeleton-shimmer` keyframe in
`app/globals.css`) and is shaped to roughly match its real page's
layout and dimensions, specifically to minimize layout shift once the
real content replaces it.

**Worth knowing**: `lib/products.js`'s data fetching is synchronous
local JSON reads — there's no real network/database latency for these
to cover _yet_. They're not wasted effort: Next.js still shows
`loading.js` during genuine client-side route-transition latency (the
round trip to the server + RSC payload), and this is exactly the
mechanism that starts actually mattering the moment `lib/products.js`
is rewritten to hit a real database — nothing here needs to change
when that happens.

## The design system

- **Colors are strict — five, on purpose.** `tailwind.config.js` →
  `theme.extend.colors`: `sand` (#E7D3C1), `cream`/`paper` (#F4E5D4,
  same value two names), `flame` (#E55A28, the accent), `ink`
  (#1A1A1A), `charcoal` (#333333). `clay` (#C94A1A) is the one
  addition beyond that five — it's the accent's hover/pressed shade,
  used automatically by `Button`'s primary variant. Don't reach for an
  arbitrary hex (`bg-[#...]`) or a new named color without checking
  this list first; the whole site is meant to stay inside it.
- **`components/ui/Button.jsx`** is the one place the "hard shadow,
  presses down on click" button style lives — `variant="primary"`
  (solid fill, e.g. Add to cart), `variant="secondary"` (outline,
  e.g. Details/View more), `variant="ghost"` (no border/shadow, quiet
  actions), `variant="inverse"` (plain cream pill, no border/shadow —
  for use on dark backgrounds like the footer's signup row, where the
  hard black shadow of primary/secondary would disappear instead of
  standing out), sizes `sm`/`md`/`lg`. Every button sitewide goes
  through this rather than a one-off className. Renders a `<Link>`
  when given an `href`, a `<button>` otherwise. Note: its base display
  is `inline-flex` — to center one with `mx-auto` you'll need to wrap
  it in a `flex justify-center` container instead, since `mx-auto`
  only centers block-level boxes (see `CheckoutFlow.jsx`'s review step
  for an example).

## The all-products page

`app/products/page.js` uses `ProductCard`'s `variant="rich"` (image,
name in the accent color, a price pill, description, Add to
cart/Details side by side) — styled after the CATALOG card reference.
The homepage keeps `variant="compact"` (the leaner version) since it's
just a teaser, not the full shop.

Two mobile-specific fixes worth knowing about if you're extending
either card:

- **Product names are `line-clamp-1`** in both variants — a
  deliberate fix, not a style choice. Longer names were wrapping to
  2–3 lines on narrow phone cards; this guarantees one line with an
  ellipsis instead.
- **`ProductGrid` is single-column below the `sm` breakpoint** (640px)
  rather than two columns all the way down to phone width, which left
  each card too narrow. Combined with `line-clamp-1` as a backstop,
  this should hold even for longer names added later.

- **The homepage grid's quick-add is a labeled "Add to cart" bar**,
  not an icon-only button — it slides up from the bottom of the image
  on hover/keyboard focus (desktop), or sits visible by default on
  touch devices (no hover state to reveal it there). An earlier
  version used an unlabeled `Plus` icon, which tested as unclear about
  what it actually did.

`ProductCatalog` also takes an `initialLimit` prop — the products page
passes `6`, which shows a real "View more" button once the filtered
list is longer than that. Leave it unset (`Infinity`, the default) for
contexts like the homepage where showing everything is fine.

**Adding a new category** (e.g. "outdoor"): the categories list itself
is never hardcoded — `getCategories()` derives it from whatever
`category` values exist in `products.json` (currently `lamps` /
`decor` / `dining`), so a new one shows up as a tab automatically.
Three places you'll still want to touch by hand:

- `components/product/CategoryTabs.jsx` — add a line to the `LABELS`
  map for a nicer display name (optional; without it, the tab just
  shows the raw category string).
- `components/layout/Navbar.jsx` — add an entry to `NAV_LINKS` if the
  category deserves its own permanent nav link (not every category
  necessarily does, which is why this one isn't auto-generated).
- `components/layout/Footer.jsx` — same idea, its own `COLUMNS` array.

## Notes / things you'll likely want to change

- **Fonts**: Fraunces (display) + Inter (body), loaded via
  `next/font/google` in `app/layout.js`.
- **Product highlight badges**: the 4 icon badges on the product page
  ("Hand-finished," "Small batch," etc.) are universal across the
  whole catalog right now, not per-product — see the `HIGHLIGHTS`
  array at the top of `ProductDetail.jsx` if you want per-product
  claims instead.
- **Payment**: only cash on delivery works. Card and mobile banking
  are scaffolded but disabled — see "Checkout" above.
- **Email**: neither the contact form nor the newsletter signup
  actually sends anything yet — both need a backend (API route +
  email/list service) wired in.
- **Orders aren't stored anywhere real yet.** `placeOrder()` in
  `CheckoutFlow.jsx` generates a client-side order id and clears the
  cart — no database, no order notification email to you, no record
  of the sale exists once the confirmation screen is closed. This is
  the single most important thing to fix before real launch; it's
  waiting on connecting a real database/backend.
- **No inventory/stock tracking.** Every product is always shown as
  purchasable and `"InStock"` in its JSON-LD, regardless of real
  availability — same database dependency as above.
- **`SITE_URL` in `lib/brand.js` is a placeholder domain** — see
  "Brand constants" above. Sitemap, robots.txt, and every social-share
  preview point at a fake URL until this is set to the real one.
- **Spam protection is frontend-only right now** (honeypot + a
  minimum-fill-time trap — see "Spam protection" above). Real rate
  limiting and server-side honeypot re-validation both need the
  backend to exist first.
- **Analytics only reports data if deployed on Vercel** — see
  "Analytics" above for what to swap if hosting elsewhere.
