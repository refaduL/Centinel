# CLAUDE.md

Guidance for Claude Code (or any AI assistant) working in this repository.
Everything below reflects conventions actually observed in the codebase —
nothing here is aspirational or assumed.

## Technology stack

- **Next.js 14.2.5**, App Router (`app/` directory), JavaScript only — no
  TypeScript anywhere in the project.
- **React 18**.
- **Tailwind CSS 3.4** for all styling. No CSS modules, no styled-components,
  no Sass.
- **lucide-react** for icons — the only UI dependency beyond Tailwind/React.
- No state-management library (Context API only), no ORM/database client,
  no auth library, no test framework, no TypeScript.

## Project structure

```
app/                          App Router pages
  layout.js                   Root layout — fonts, CartProvider, Navbar,
                               Footer, CartDrawer all mount here globally
  page.js                     Homepage
  globals.css                 Tailwind directives + small global rules
  products/page.js             /products (catalog, ?category= filter)
  products/[slug]/page.js       /products/:slug (product detail)
  checkout/page.js              /checkout
  contact/page.js               /contact

components/                   Organized by domain, not by type
  layout/                      Navbar, Footer, NewsletterSignup
  home/                        Homepage-only sections (Hero + its
                               DraggablePin.jsx helper, Manifesto,
                               FeaturedStrip, JoinMailingList, ProductShowcase)
  product/                     Product listing/detail components
  cart/                        CartContext (state) + CartDrawer (UI)
  checkout/                    CheckoutFlow + OrderReceipt
  contact/                     ContactForm
  ui/                          Shared primitives: Button.jsx, Skeleton.jsx,
                               plus HoneypotField.jsx/useSpamGuard.js (the
                               spam-guard pair — see "Spam protection" in
                               README.md)

data/products.json             The only data source in the project
lib/products.js                ALL product data access goes through here —
                                never import data/products.json directly
lib/brand.js                   Brand name/tagline/contact constants
lib/fallToProduct.js           Scroll-to-and-highlight helper the hero's
                                pinned pieces use on click — see README.md

public/images/                 Static image assets
```

There is no `app/api/` directory — no backend routes exist. Cart, checkout,
and the contact form are client-side simulations only.

## Coding conventions

- **JavaScript, not TypeScript.** `.js` for plain modules and non-component
  files, `.jsx` for anything returning JSX.
- **PascalCase** for component files and component names
  (`ProductCard.jsx`, `CartDrawer.jsx`). **camelCase** for utility/lib files
  (`products.js`, `brand.js`).
- **Path alias `@/`** maps to the project root (configured in
  `jsconfig.json`) — imports use `@/lib/products`, `@/components/ui/Button`,
  never relative `../../` chains.
- **Comments explain *why*, not *what***, and are used heavily and
  substantively throughout the codebase — design decisions, trade-offs, and
  "if you need to change X, edit Y" pointers are the norm, not sparse
  one-liners. Match this density and style when adding code.
- **No em dashes in user-facing text** (headings, body copy, button labels,
  page `<title>`/`<meta>` strings). Em dashes remain acceptable inside code
  comments only. Page titles use `|` as a separator
  (e.g. `"Catalog | Sentinel"`).
- Functions and derived values are preferred over hardcoded/duplicated data
  — e.g. batch numbers and collection names in `lib/products.js` are
  computed from existing fields rather than stored as new redundant JSON
  fields.

## React / Next.js conventions

- **Server components by default.** `"use client"` is added only when a
  component actually needs state, effects, or event handlers. Check before
  adding it — many components in this project are plain server components
  even though they live alongside client ones in the same folder.
- **Page-level data fetching happens in the page file** (e.g.
  `app/products/page.js` calls `getAllProducts()`/`getCategories()` and
  passes results down as props); presentational components receive data via
  props, they don't fetch it themselves.
- Shared/reusable UI logic is factored into one component and parameterized
  with a `variant` prop rather than duplicated
  (e.g. `ProductCard` has `variant="compact" | "rich"`;
  `Button` has `variant="primary" | "secondary" | "ghost" | "inverse"`).
- Cart state is a single `CartContext` (`components/cart/CartContext.jsx`),
  provided once in `app/layout.js`, consumed via a `useCart()` hook.
  **It persists to `localStorage`** (key `sentinel-cart-v1`) via a
  two-effect hydrate-then-save pattern gated on a `hasHydrated` flag —
  see README.md's "The cart" section before touching this file; a naive
  single "save on every change" effect will fire on first render with
  an empty array and silently wipe out real saved data.

## Styling conventions

- **Strict 5-color palette**, defined once in `tailwind.config.js`:
  `sand` (#E7D3C1), `cream`/`paper` (#F4E5D4 — same value, two names),
  `flame` (#E55A28, the accent), `ink` (#1A1A1A), `charcoal` (#333333),
  plus one derived shade `clay` (#C94A1A, the accent's hover state).
  **Do not introduce a new color or an arbitrary hex (`bg-[#...]`)** without
  checking this file first — it's a deliberate constraint, stated explicitly
  in a comment in `tailwind.config.js`.
- Custom font-size tokens (`display-xl`, `display-lg`, `display-md`) and a
  custom easing (`ease-light`) are defined in the Tailwind theme extension —
  prefer these over ad hoc arbitrary values when they fit.
- All primary/secondary/destructive buttons go through
  `components/ui/Button.jsx` rather than one-off `className` strings on a
  raw `<button>`. It has a non-obvious Tailwind gotcha documented inline:
  conflicting arbitrary-value utilities (e.g. two different
  `translate-y-[...]` values) resolve unpredictably by Tailwind's *generated
  stylesheet order*, not by className string order — read the comments in
  that file before touching its className composition.
- `container-page` is a custom utility class (in `globals.css`) for the
  standard centered max-width content wrapper — used instead of repeating
  `mx-auto max-w-6xl px-6 md:px-10` inline.

## API / data conventions

- **No backend exists.** All "API-like" behavior (cart, checkout order
  placement, contact form submission) is simulated client-side with
  in-memory state.
- **All product data access goes through `lib/products.js`** — components
  never import `data/products.json` directly. When a real backend is added,
  only the function bodies in this file should need to change.
- Display fields are derived where possible instead of duplicated in JSON —
  e.g. `getBatchLabel()`, `getCollectionName()`, `getDisplayImage()` compute
  values from existing fields rather than the JSON storing them redundantly.
- Known placeholders explicitly flagged in comments as needing real
  integration later: cart persistence, checkout payment processing (only
  "cash on delivery" is functional; card/mobile banking are visibly
  disabled, not hidden), and the contact form's email sending.

## Testing / build commands

No test suite or test framework is present in this repository.

```bash
npm install     # not yet run in this environment — no lockfile present
npm run dev     # start dev server
npm run build   # production build
npm run start   # run production build
npm run lint    # next lint (eslint-config-next)
```

## Important constraints

- **No authentication system exists.** Don't assume or add one without
  being asked.
- **No API routes exist.** Anything that looks like it needs a backend
  (checkout payment, email sending, cart persistence) is a known,
  explicitly-documented gap — check the relevant file's comments before
  building around it, as the intended extension point is often already
  described.
- **Read `PROGRESS.md` before starting work.** This project uses it as a
  running log of what's been done across sessions, specifically so work can
  resume correctly if a session ends mid-task. Verify its claims against
  the actual code rather than trusting it blindly, but check it first.
- **Read `README.md`** for deeper documentation of specific
  subsystems (cart, checkout, the design system, the product data model) —
  it is extensive and current.
- Only cash-on-delivery is a functional payment method; treat card/mobile
  banking as intentionally disabled, not broken.
