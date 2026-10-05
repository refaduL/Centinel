import Link from "next/link";

/**
 * Every "hard shadow + press down on click" button on the site should
 * go through this component instead of copy-pasting the className.
 * That's not just DRY — it means the one signature detail (the black
 * offset shadow that compresses on :active) only has to be tuned in
 * one place if it ever needs adjusting.
 *
 * variant="primary"    solid accent fill — Add to cart, Buy Now, Proceed to checkout
 * variant="secondary"  outline only — More Details, secondary actions
 * variant="ghost"      no border/shadow at all — quiet inline actions
 * variant="inverse"    plain solid cream pill, no border/shadow — for
 *                       use ON DARK BACKGROUNDS (e.g. the footer's
 *                       newsletter row), where the hard black shadow
 *                       of primary/secondary would disappear against
 *                       a near-black bg instead of standing out
 *
 * size="sm"  compact, e.g. inside the navbar pill
 * size="md"  the default — product cards, most places
 * size="lg"  the big full-width kind — product detail page, cart drawer
 *
 * Renders a Next.js <Link> when given an `href`, a <button> otherwise
 * — same look either way, so callers don't need to think about which
 * element they're getting.
 *
 * Note: `active:translate-y-*` lives inside each variant string, not
 * in BASE — two conflicting arbitrary-value utilities (translate-y-[2px]
 * vs translate-y-0) on the same element land in an unpredictable order
 * in Tailwind's generated stylesheet, so overriding one from BASE via
 * a variant string isn't reliable. Keeping it out of BASE avoids that
 * entirely.
 */
const BASE =
  "inline-flex items-center justify-center rounded-full font-medium transition-all disabled:cursor-not-allowed disabled:opacity-40";

const VARIANTS = {
  primary:
    "border border-black bg-flame text-ink shadow-[0_4px_0_0_#000] hover:bg-clay active:translate-y-[2px] active:shadow-[0_2px_0_0_#000] disabled:shadow-[0_4px_0_0_#000] disabled:hover:bg-flame disabled:active:translate-y-0",
  secondary:
    "border border-black bg-transparent text-ink shadow-[0_4px_0_0_#000] hover:bg-ink hover:text-paper active:translate-y-[2px] active:shadow-[0_2px_0_0_#000] disabled:shadow-[0_4px_0_0_#000] disabled:active:translate-y-0",
  // !shadow-none (not just shadow-none): SIZES.sm carries its own
  // shadow-[...] utility, and two same-specificity utility classes
  // are resolved by their order in Tailwind's *generated* stylesheet,
  // not by the order they appear in this className string — so a
  // plain shadow-none here isn't guaranteed to beat sm's shadow. The
  // `!` forces !important, which wins regardless of generation order.
  ghost: "border border-ink/20 text-ink !shadow-none hover:border-ink",
  inverse: "border border-cream bg-cream text-ink !shadow-none hover:bg-cream/85",
};

const SIZES = {
  sm: "px-4 py-1.5 text-sm shadow-[0_3px_0_0_#000] active:shadow-[0_1px_0_0_#000]",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base md:py-4",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  className = "",
  children,
  ...props
}) {
  const classes = `${BASE} ${VARIANTS[variant]} ${SIZES[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={props.type ?? "button"} className={classes} {...props}>
      {children}
    </button>
  );
}
