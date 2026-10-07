/**
 * The hero is a fridge-door magnet board, not a banner. Everything
 * on it is a real piece of the brand pinned up: product polaroids,
 * die-cut stickers of the top picks, an enamel "street sign" for the
 * workshop's city, a brand stamp, and a paper ticket that carries the
 * one call to action. Every piece can be dragged (see
 * DraggablePin.jsx). Clicking a PRODUCT piece doesn't navigate it
 * away — it falls off the board and the page scrolls down to that
 * product's card in the collection, briefly highlighted (the
 * `fallToId` prop on those DraggablePins; see lib/fallToProduct.js).
 * A modified click (ctrl/cmd/shift, middle-click) or keyboard Enter
 * still goes straight to the product page via the piece's own Link —
 * the fall is an enhancement over that, not a replacement. Structure
 * follows the reference photo: a dark frame, a brushed-metal face,
 * and loose cards held by round magnets.
 *
 * Strict 5-color palette, as everywhere else: the "steel" is sand with
 * a faint brushed-line texture and one soft sheen (rgba of ink/cream,
 * not new colors); frame is ink; paper is cream; magnets are ink,
 * charcoal, flame, clay.
 *
 * Sizing: the board face is a CSS container (`containerType:
 * inline-size`) and every measurement inside uses `cqw` (1% of the
 * board's width). That is why the whole composition scales as one
 * object, type included, instead of needing a font-size per
 * breakpoint. Positions are percentages for the same reason. Two
 * layouts live in the classNames below: phone (a taller, height-first
 * board — see the frame's own comment — with eight pieces) and md+ (a
 * landscape board with nine). `.mood-landscape-hide` (globals.css)
 * drops two of the phone pieces specifically on short landscape
 * phones, where the board is too squat for them to fit without
 * crowding — plain CSS there, not a stacked Tailwind variant, since
 * it's load-bearing enough to want to read it directly.
 *
 * Data: Hero receives the full product list from app/page.js and picks
 * its cast by id (HERO_CAST). If an id is renamed or removed, that
 * piece simply doesn't render, nothing crashes.
 *
 * Only the h1 lives on the black headline card, so the page keeps
 * exactly one h1.
 */
import DraggablePin from "@/components/home/DraggablePin";
import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { BRAND_ORIGIN } from "@/lib/products";
import Image from "next/image";
import Link from "next/link";

const HERO_CAST = {
  polaroid: "glossy-red-mushroom-lamp",
  polaroid2: "terracotta-wide-belly-pot",
  strip: "matte-black-dome-lamp",
  stickerA: "tapered-red-dome-lamp",
  stickerB: "brutalist-stone-vase-set",
};

// One resting shadow for every paper piece so the board reads as a
// single light source (top-left). Lift on drag is handled in the pin.
const PAPER_SHADOW =
  "shadow-[0_1px_1px_rgba(26,26,26,0.3),0_7px_14px_-5px_rgba(26,26,26,0.45)]";

// Die-cut sticker outline: four hard offset shadows in cream fake a
// white sticker border around an irregular cutout, then one soft
// shadow lifts it off the board. In `cqw` (not px) like everything
// else on the board, so the border stays the same relative thickness
// whether the board is rendered at phone or ultrawide size.
// (cream = #F4E5D4, ink = #1A1A1A)
const STICKER_FILTER =
  "drop-shadow(0.3cqw 0 0 #F4E5D4) drop-shadow(-0.3cqw 0 0 #F4E5D4) drop-shadow(0 0.3cqw 0 #F4E5D4) drop-shadow(0 -0.3cqw 0 #F4E5D4) drop-shadow(0 0.9cqw 1cqw rgba(26,26,26,0.4))";

// Grain, at a very low opacity, so the steel board reads as a
// material rather than a flat gradient. One SVG feTurbulence data URI,
// tiled — no network request, no extra colors (blended via multiply).
const GRAIN_BG =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")";

// The one-time "glint" that sweeps across the board after the pieces
// land (see the `sweep` keyframe in tailwind.config.js) — cream via a
// `screen` blend, so it brightens the steel without introducing a new
// color. `screen` over `overlay`: tested both directly, and overlay's
// effect on a background this light is barely perceptible (overlay
// preserves light/dark base tones and mainly shifts midtones), while
// screen reliably brightens regardless of what's underneath. A
// diagonal band, not a hard edge, so it reads as light catching
// brushed metal rather than a loading bar.
const SWEEP_BG =
  "linear-gradient(115deg, transparent 38%, rgba(244,229,212,0.75) 50%, transparent 62%)";

const price = (p) =>
  new Intl.NumberFormat("en-BD", {
    style: "currency",
    currency: p.currency,
    maximumFractionDigits: 0,
  }).format(p.price);

const MAGNET_TONE = {
  ink: "bg-ink",
  charcoal: "bg-charcoal",
  flame: "bg-flame",
  clay: "bg-clay",
};

function Magnet({
  tone = "ink",
  className = "left-1/2 top-[3%] -translate-x-1/2",
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute z-10 h-[5cqw] w-[5cqw] rounded-full shadow-[0_2px_3px_rgba(26,26,26,0.5),inset_0_-1px_2px_rgba(26,26,26,0.4)] md:h-[1.8cqw] md:w-[1.8cqw] ${MAGNET_TONE[tone]} ${className}`}
      style={{
        backgroundImage:
          "radial-gradient(circle at 35% 30%, rgba(244,229,212,0.55), transparent 48%)",
      }}
    />
  );
}

function Polaroid({ product, tone, priority = false }) {
  return (
    <Link
      href={`/products/${product.id}`}
      draggable={false}
      className={`relative block bg-cream p-[2.2cqw] pb-[2.6cqw] md:p-[0.8cqw] md:pb-[1cqw] ${PAPER_SHADOW}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
        <Image
          src={product.image}
          alt={product.name}
          fill
          priority={priority}
          draggable={false}
          sizes="(min-width: 768px) 16vw, 40vw"
          className="object-cover"
        />
      </div>
      <p className="mt-[1.6cqw] line-clamp-1 font-display text-[3.4cqw] italic leading-none text-ink md:mt-[0.6cqw] md:text-[1.15cqw]">
        {product.name}
      </p>
      <p className="mt-[0.8cqw] text-[3cqw] leading-none text-ink/55 md:mt-[0.3cqw] md:text-[0.95cqw]">
        {price(product)}
      </p>
      <Magnet tone={tone} />
    </Link>
  );
}

// The site's shared <Button> is deliberately NOT used here: its sizes
// are fixed rem/px values, which look right at one size but throw off
// the board's scaling at the extremes (a tiny board on a short
// landscape phone, or a huge one on an ultrawide monitor). This is the
// same primary style — black border, flame fill, hard offset shadow,
// clay hover, press-down active state — rebuilt with `cqw` so it
// scales exactly like the ticket it sits on.
function TicketButton({ children, ...props }) {
  return (
    <Link
      {...props}
      className="inline-flex items-center justify-center rounded-full border border-black bg-flame font-bold text-cream shadow-[0_0.4cqw_0_0_#000] transition-all hover:bg-clay active:translate-y-[0.2cqw] active:shadow-[0_0.2cqw_0_0_#000] px-[4cqw] py-[2cqw] text-[3cqw] md:px-[1.3cqw] md:py-[0.6cqw] md:text-[0.98cqw]"
    >
      {children}
    </Link>
  );
}

function Sticker({ product }) {
  return (
    <Link
      href={`/products/${product.id}`}
      draggable={false}
      className="block"
      aria-label={product.name}
    >
      <Image
        src={product.image_png}
        alt={product.name}
        width={736}
        height={product.id === HERO_CAST.stickerA ? 736 : 981}
        draggable={false}
        sizes="(min-width: 768px) 16vw, 34vw"
        className="h-auto w-full"
        style={{ filter: STICKER_FILTER }}
      />
    </Link>
  );
}

export default function Hero({ products }) {
  const byId = (id) => products.find((p) => p.id === id);
  const polaroid = byId(HERO_CAST.polaroid);
  const polaroid2 = byId(HERO_CAST.polaroid2);
  const strip = byId(HERO_CAST.strip);
  const stickerA = byId(HERO_CAST.stickerA);
  const stickerB = byId(HERO_CAST.stickerB);
  const [city, country] = BRAND_ORIGIN.split(", ");

  return (
    <section className="bg-paper px-4 pb-8 pt-24 md:px-10 md:pb-12 md:pt-28">
      {/* Frame. On phones this is height-first: it targets exactly the
          space left after the section's own padding (pt-24 + pb-8 =
          8rem), so the board fills the opening screen the way a hero
          should, instead of sitting at content height with dead paper
          below it. Width is capped against that same height (at the
          board's own 4:5 ratio) so a short or landscape phone doesn't
          widen the frame into a flat strip — it shrinks in step and
          stays centered, like the framed treatment used from md up.
          From md the roles swap: width is capped by height (16:10 board,
          against pt-28 + pb-12 = 10rem of chrome) the same way, but
          height is auto, matching a landscape board on a landscape
          screen. */}
      <div className="mx-auto max-w-[1400px] rounded-[1.1rem] bg-ink p-[9px] shadow-[0_18px_40px_-16px_rgba(26,26,26,0.6)] h-[calc(100dvh_-_8rem)] w-[min(100%,calc((100dvh_-_8rem)*0.8))] md:h-auto md:w-[min(100%,calc((100dvh_-_10rem)*1.6))] md:rounded-[1.4rem] md:p-[15px]">
        <div
          data-board
          role="region"
          aria-label="Centinel magnet board. Drag the pieces around."
          className="relative h-full w-full overflow-hidden rounded-[0.6rem] bg-sand md:aspect-[16/10] md:h-auto md:rounded-[0.8rem]"
          style={{
            containerType: "inline-size",
            // Brushed-steel lines + one diagonal sheen, both just
            // alpha versions of ink/cream (no extra colors).
            backgroundImage:
              "linear-gradient(115deg, transparent 28%, rgba(244,229,212,0.55) 46%, transparent 64%), repeating-linear-gradient(90deg, rgba(26,26,26,0.035) 0 1px, transparent 1px 3px)",
            boxShadow: "inset 0 2px 10px rgba(26,26,26,0.35)",
          }}
        >
          {/* Low-opacity grain so the steel reads as a material, not a
              flat gradient. Multiply blend keeps it just texture, never
              a new color. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-0 opacity-[0.05] mix-blend-multiply"
            style={{ backgroundImage: GRAIN_BG }}
          />

          {/* The signature moment: once the pieces have landed, a
              glint of light sweeps once across the whole board — the
              actual "wow," not the entrance itself. Thematically it's
              the payoff for copy that's already on the board ("The
              light changes everything"): light literally catching the
              brushed steel. z-15 so it crosses IN FRONT of every
              piece at rest (they sit at z-1 until dragged/clicked);
              `backgroundSize` oversized so the diagonal band has room
              to travel corner-to-corner without its hard edge
              entering the frame. One-shot (`animate-sweep`, which is
              a 2.2s sweep after a 1.6s delay, `both` fill, in
              tailwind.config.js) — it never repeats, because a light
              sweep that loops reads as a loading spinner, not a
              reveal. */}
          {/* <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15] animate-sweep opacity-0 mix-blend-screen"
            style={{ backgroundImage: SWEEP_BG, backgroundSize: "250% 250%" }}
          /> */}

          {/* Headline card, the loudest piece: black, inset keyline,
              magnet at the bottom like the reference card. */}
          <DraggablePin
            className="left-[4%] top-[3%] w-[74%] md:left-[34%] md:top-[7%] md:w-[30%]"
            rotate={-1.5}
            delay={0}
          >
            <div
              className={`relative bg-ink p-[2.2cqw] md:p-[0.7cqw] ${PAPER_SHADOW}`}
            >
              <div className="border border-cream/45 px-[4cqw] pb-[9cqw] pt-[5cqw] text-center md:px-[1.2cqw] md:pb-[3.2cqw] md:pt-[1.7cqw]">
                <p className="text-[3.2cqw] text-cream/70 md:text-[0.9cqw]">
                  {BRAND_TAGLINE}
                </p>
                <h1 className="mt-[4cqw] text-balance font-display text-[10.5cqw] leading-[0.98] text-cream md:mt-[1.4cqw] md:text-[3cqw]">
                  Make space for warmth.
                </h1>
              </div>
              <Magnet
                tone="clay"
                className="bottom-[7%] left-1/2 -translate-x-1/2"
              />
            </div>
          </DraggablePin>

          {/* Enamel street-sign plate for the workshop's city. */}
          <DraggablePin
            className="hidden md:block md:left-[6%] md:top-[50%] md:w-[11%]"
            rotate={-2}
            delay={280}
          >
            <div
              className={`rounded-[1.2cqw] bg-ink p-[0.9cqw] md:rounded-[0.5cqw] md:p-[0.3cqw] ${PAPER_SHADOW}`}
            >
              <div className="rounded-[0.8cqw] border border-cream/80 px-[1.5cqw] py-[1.8cqw] text-center text-cream md:rounded-[0.3cqw] md:px-[0.4cqw] md:py-[0.5cqw]">
                <p className="text-[2.6cqw] leading-none text-cream/70 md:text-[0.75cqw]">
                  Based on
                </p>
                <p className="mt-[0.8cqw] font-display text-[5cqw] leading-none md:mt-[0.25cqw] md:text-[1.5cqw]">
                  {city}
                </p>
                <p className="mt-[0.8cqw] text-[2.6cqw] leading-none text-cream/70 md:mt-[0.25cqw] md:text-[0.75cqw]">
                  {country}
                </p>
              </div>
            </div>
          </DraggablePin>

          {stickerA && (
            <DraggablePin
              className="left-[60%] top-[2%] w-[36%] md:left-[58%] md:top-[5%] md:w-[15%]"
              rotate={6}
              delay={140}
              fallToId={stickerA.id}
            >
              <Sticker product={stickerA} />
            </DraggablePin>
          )}

          {polaroid && (
            <DraggablePin
              className="left-[4%] top-[30%] w-[42%] md:left-[7%] md:top-[9%] md:w-[15%]"
              rotate={-5}
              delay={70}
              fallToId={polaroid.id}
            >
              <Polaroid product={polaroid} tone="ink" priority />
            </DraggablePin>
          )}

          {/* Photo strip held by washi tape instead of a magnet, so not
              every piece is pinned the same way. Desktop only. */}
          {strip && (
            <DraggablePin
              className="left-[70%] top-[40%] w-[26%] md:left-[79%] md:top-[11%] md:w-[12%]"
              rotate={3}
              delay={210}
              fallToId={strip.id}
            >
              <Link
                href={`/products/${strip.id}`}
                draggable={false}
                className={`relative block border-[0.5cqw] border-cream bg-cream ${PAPER_SHADOW}`}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                  <Image
                    src={strip.image}
                    alt={strip.name}
                    fill
                    draggable={false}
                    sizes="12vw"
                    className="object-cover"
                  />
                </div>
                <span
                  aria-hidden="true"
                  className="absolute -top-[1.1cqw] left-1/2 h-[1.9cqw] w-[45%] -translate-x-1/2 -rotate-3 bg-flame/70"
                />
              </Link>
            </DraggablePin>
          )}

          {polaroid2 && (
            <DraggablePin
              className="left-[6%] top-[62%] w-[30%] md:left-[19%] md:top-[54%] md:w-[14%]"
              rotate={4}
              delay={350}
              fallToId={polaroid2.id}
            >
              <Polaroid product={polaroid2} tone="flame" />
            </DraggablePin>
          )}

          {/* The call to action is a paper ticket, the only piece with
              a button on it. Same "hard shadow" Button as the rest of
              the site so it still reads as the primary action. */}
          <DraggablePin
            className="left-[4%] top-[78%] w-[92%] md:left-[36%] md:top-[63%] md:w-[29%]"
            rotate={-3}
            delay={420}
          >
            <div
              className={`bg-cream px-[3.5cqw] py-[3.5cqw] md:px-[1.4cqw] md:py-[1.3cqw] ${PAPER_SHADOW}`}
            >
              <p className="font-mono text-[2.8cqw] text-ink/55 md:text-[0.9cqw]">
                One way. Centinel to your shelf.
              </p>
              <p className="mt-[1.6cqw] font-display text-[5.4cqw] leading-tight text-ink md:mt-[0.5cqw] md:text-[1.9cqw]">
                Lamps, decor and dining.
              </p>
              <p className="mt-[1.4cqw] max-w-[95%] text-[3.2cqw] leading-snug text-charcoal md:mt-[0.4cqw] md:text-[1cqw]">
                Hand-finished in small batches, for the hours between daylight
                and dark.
              </p>
              <div className="mt-[3cqw] flex items-center border-t-2 border-dashed border-ink/30 pt-[3cqw] md:mt-[1cqw] md:pt-[1cqw]">
                <TicketButton href="#collection">
                  See the collection
                </TicketButton>
              </div>
            </div>
          </DraggablePin>

          {/* Now on mobile too (it was desktop-only before this pass) —
              the taller, height-first mobile board left a dead gap in
              the middle once it filled the screen properly, and this
              is what closes it. `.mood-landscape-hide` (globals.css) drops it
              again specifically on short landscape phones, where the
              board is squat and this piece has nowhere safe to sit —
              the six-piece layout is the floor for that shape. */}
          {stickerB && (
            <DraggablePin
              className="left-[44%] top-[51%] w-[33%] mood-landscape-hide md:left-[68%] md:top-[36%] md:w-[16%]"
              rotate={-4}
              delay={490}
              fallToId={stickerB.id}
            >
              <Sticker product={stickerB} />
            </DraggablePin>
          )}

          {/* Sunburst note. Mobile is placed in the mid-left band that the
              ticket + stickerB leave open on the taller phone board; md+ keeps
              the original bottom-right corner placement. Every measurement has
              a mobile base in cqw and an md: override, like the rest of the
              board — the badge and its left gutter in particular need to be
              physically larger on a narrow board or they vanish. */}
          <DraggablePin
            className="left-[52%] top-[68%] w-[44%] mood-landscape-hide md:left-[72%] md:top-[73%] md:w-[20%]"
            rotate={-9}
            delay={560}
          >
            <div
              className={`relative bg-cream px-[2.4cqw] py-[2.6cqw] pl-[7.2cqw] md:px-[1.1cqw] md:py-[1.3cqw] md:pl-[3.4cqw] ${PAPER_SHADOW}`}
            >
              <span
                aria-hidden="true"
                className="absolute -left-[3.2cqw] top-1/2 h-[9cqw] w-[9cqw] -translate-y-1/2 rounded-full border-2 border-ink md:-left-[1.6cqw] md:h-[4.6cqw] md:w-[4.6cqw]"
                style={{
                  backgroundImage:
                    "repeating-conic-gradient(#E55A28 0deg 12deg, #F4E5D4 12deg 24deg)",
                }}
              />
              <p className="font-display text-[3.4cqw] italic leading-[1.05] text-ink md:text-[1.6cqw]">
                The light changes everything.
              </p>
            </div>
          </DraggablePin>

          {/* Brand mark: the name debossed on a torn scrap of flame paper.
              No furniture — the torn edges and the deboss carry it alone.
              clipPath tears all four sides with irregular notch depths (uniform
              notches read as a die-cut; uneven ones read as torn paper).
              Deboss is a stacked pair: a dark ink copy offset down-right under
              a cream copy, so the word reads as pressed INTO the flame paper,
              not printed on it. md+: dead center, the anchor the scatter
              orbits. Mobile: upper-middle-right, clear of headline + stickerA.
              `whitespace-nowrap` keeps the name on one line; the mobile type
              size + `px-[6cqw]` are sized so the first and last letters clear
              the deepest left/right notches — see the sizing note below if it
              still shaves on a wider display face. */}
          <DraggablePin
            className="z-300 left-[50%] top-[28%] w-[48%] md:left-[42%] md:top-[40%] md:w-[17%] md:-translate-x-1/2 md:-translate-y-1/2"
            rotate={-2.5}
            delay={35}
          >
            <div
              className="relative bg-flame px-[6cqw] py-[4.4cqw] md:px-[2cqw] md:py-[1.7cqw]"
              style={{
                // Torn on all four edges. The polygon walks the perimeter:
                // top L→R, right T→B, bottom R→L, left B→T. Every notch is a
                // slightly different depth so the scrap reads as ripped, not
                // stamped. Left/right notches stay shallow (≤2.5%) so they
                // never reach the text.
                clipPath:
                  "polygon(" +
                  "0% 3%, 4% 1%, 9% 4%, 14% 1.5%, 20% 3.5%, 26% 1%, 32% 4%, 38% 1.5%, 44% 3.5%, 50% 1%, 56% 4%, 62% 1.5%, 68% 3.5%, 74% 1%, 80% 4%, 86% 1.5%, 92% 3.5%, 96% 1%, 100% 3%," +
                  "98% 10%, 100% 18%, 97.5% 26%, 100% 34%, 98% 42%, 100% 50%, 97.5% 58%, 100% 66%, 98% 74%, 100% 82%, 97.5% 90%, 100% 97%," +
                  "96% 99%, 92% 96.5%, 86% 99%, 80% 96%, 74% 99%, 68% 96.5%, 62% 99%, 56% 96%, 50% 99%, 44% 96.5%, 38% 99%, 32% 96%, 26% 99%, 20% 96.5%, 14% 99%, 9% 96%, 4% 99%, 0% 97%," +
                  "2% 90%, 0% 82%, 2.5% 74%, 0% 66%, 2% 58%, 0% 50%, 2.5% 42%, 0% 34%, 2% 26%, 0% 18%, 2.5% 10%" +
                  ")",
                filter:
                  "drop-shadow(0 1px 0 rgba(26,26,26,0.25)) drop-shadow(0 8px 14px -5px rgba(26,26,26,0.55))",
              }}
            >
              <div className="relative flex justify-center">
                <p
                  aria-hidden="true"
                  className="absolute left-0 right-0 text-center font-display text-[8cqw] uppercase leading-[1] tracking-[0.02em] whitespace-nowrap text-ink/75 md:text-[2.6cqw]"
                  style={{ transform: "translate(0.3cqw, 0.3cqw)" }}
                >
                  {BRAND_NAME}
                </p>
                <p className="relative font-display text-[8cqw] uppercase leading-[1] tracking-[0.02em] whitespace-nowrap text-cream md:text-[2.6cqw]">
                  {BRAND_NAME}
                </p>
              </div>
            </div>
          </DraggablePin>

          <p className="pointer-events-none absolute bottom-[1.6cqw] left-[3cqw] z-0 text-[2.8cqw] text-ink/50 md:bottom-[1.1cqw] md:left-[1.6cqw] md:text-[0.95cqw]">
            Since 2026. Go on, move things around.
          </p>
        </div>
      </div>
    </section>
  );
}
