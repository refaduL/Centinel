/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        /**
         * The brand's fixed palette — five colors only, mapped from
         * the :root spec you gave:
         *   --bg-sand:        sand
         *   --bg-cream:       cream (also aliased as `paper`, since
         *                     that's the name already used as the
         *                     main background everywhere in this
         *                     project — same value, two names)
         *   --accent-orange:  flame (kept this name rather than
         *                     "orange" to avoid colliding with
         *                     Tailwind's own built-in orange-50..900
         *                     scale)
         *   --text-ink:       ink
         *   --text-charcoal:  charcoal
         *
         * `clay` isn't in your spec — it's the accent's hover/pressed
         * shade (#C94A1A), used on buttons that darken on hover.
         *
         * Do not add new colors here without checking with the brand
         * spec first — this palette is meant to stay exactly five
         * colors, not grow a new one per section.
         */
        ink: "#1A1A1A",
        charcoal: "#333333",
        paper: "#F4E5D4",
        cream: "#F4E5D4",
        sand: "#E7D3C1",
        flame: "#E55A28",
        clay: "#C94A1A",
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 6rem)", { lineHeight: "1.02", letterSpacing: "-0.01em" }],
        "display-lg": ["clamp(2.25rem, 4.2vw, 3.75rem)", { lineHeight: "1.05", letterSpacing: "-0.01em" }],
        "display-md": ["clamp(1.75rem, 2.6vw, 2.5rem)", { lineHeight: "1.1" }],
      },
      maxWidth: {
        prose: "38rem",
      },
      // Hero magnet board. Two one-shot animations:
      //
      // `pin` — the load entrance. A single confident deceleration
      // (no bounce/overshoot — that read as cheap and shaky in
      // testing), with the piece tilted back in 3D and motion-blurred
      // at the start so it reads as dropping FAST from a height and
      // leveling out flat onto the board, not fading in place. The
      // board's own `sweep` (below) plays once this has settled,
      // which is the actual "premium" moment — a glint of light
      // crossing the steel, tying back to the lamps/lighting copy
      // already on the board ("The light changes everything").
      //
      // `fall` — the click-to-send-to-collection exit (DraggablePin's
      // `fallToId`). Real falling paper doesn't drop in a straight
      // line OR zigzag randomly — it flutters: a brief straight drop
      // first (inertia — rotation doesn't start the instant it leaves
      // the board), then ONE wide, train-track-style turn (straight,
      // a broad smooth bend, then straight again along a new diagonal
      // — built by blending two straight lines through a smoothstep
      // weight, not an oscillating sine), with rotation that speeds up
      // as it goes, and a single lift-and-level `rotateX` dip (the
      // piece tilting up off the board's surface before it tumbles
      // away).
      //
      // Every stop in both keyframes below is SAMPLED FROM CONTINUOUS
      // FUNCTIONS of time (gravity-like easing for the fall itself, an
      // eased ramp for rotation, a smoothstep-blended turn for the
      // sway, a single bump for the rotateX dip), not hand-picked —
      // hand-picked values produced visible rate-of-change jumps
      // between segments that read as a stutter even when each value
      // looked reasonable in isolation. The turn's position is keyed
      // to DISTANCE FALLEN (the same gravity-eased progress driving
      // translateY), not raw time, so it stays in step with the fall
      // rather than drifting out of sync as it accelerates.
      //
      // Both verified before being written here: each generator's own
      // per-segment rate table (checked directly for jumps) and the
      // rendered result's actual center-point trajectory, sampled via
      // the Web Animations API and plotted, to confirm the real shape
      // — a drop-and-settle for `pin`, a clean straight-curve-straight
      // path for `fall` — not just eyeballed.
      //
      // Builds on the piece's own resting tilt via the `--rot` custom
      // property (set inline in DraggablePin); `--drift` (also inline,
      // ±1) picks which way the turn bends from the sign of the
      // piece's own tilt, so pieces vary from each other.
      keyframes: {
        pin: {
          "0%": {
            opacity: "0",
            transform: "perspective(900px) translateY(-26cqw) rotateX(55deg) scale(0.9)",
            filter: "blur(10px)",
          },
          "60%": { opacity: "1", filter: "blur(0px)" },
          "100%": { opacity: "1", transform: "none", filter: "blur(0px)" },
        },
        sweep: {
          "0%": { opacity: "0", backgroundPosition: "-40% -40%" },
          "14%": { opacity: "1" },
          "38%": { opacity: "1", backgroundPosition: "40% 40%" },
          "55%": { opacity: "0" },
          "100%": { opacity: "0" },
        },
        fall: {
          "0%": {
            opacity: "1",
            transform: "translateY(0%) translateX(0%) rotate(var(--rot, 0deg)) rotateX(0deg) scale(1)",
          },
          "8%": {
            transform: "translateY(3.82%) translateX(0%) rotate(var(--rot, 0deg)) rotateX(0deg) scale(0.982)",
          },
          "16%": {
            transform:
              "translateY(12.42%) translateX(0%) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 4.87deg)) rotateX(12.24deg) scale(0.965)",
          },
          "24%": {
            transform:
              "translateY(24.75%) translateX(0%) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 13.78deg)) rotateX(22.35deg) scale(0.947)",
          },
          "32%": {
            transform:
              "translateY(40.36%) translateX(0%) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 25.32deg)) rotateX(28.57deg) scale(0.93)",
          },
          "40%": {
            transform:
              "translateY(58.97%) translateX(calc(var(--drift, 1) * -0.88%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 38.98deg)) rotateX(29.82deg) scale(0.912)",
          },
          "48%": {
            transform:
              "translateY(80.4%) translateX(calc(var(--drift, 1) * -1.61%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 54.47deg)) rotateX(25.88deg) scale(0.894)",
          },
          "56%": {
            transform:
              "translateY(104.49%) translateX(calc(var(--drift, 1) * 0.61%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 71.6deg)) rotateX(17.43deg) scale(0.877)",
          },
          "64%": {
            transform:
              "translateY(131.12%) translateX(calc(var(--drift, 1) * 7.73%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 90.23deg)) rotateX(5.95deg) scale(0.859)",
          },
          "72%": {
            transform:
              "translateY(160.19%) translateX(calc(var(--drift, 1) * 18.01%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 110.24deg)) rotateX(0deg) scale(0.842)",
          },
          "80%": {
            transform:
              "translateY(191.61%) translateX(calc(var(--drift, 1) * 27.57%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 131.54deg)) rotateX(0deg) scale(0.824)",
          },
          "88%": {
            opacity: "0.75",
            transform:
              "translateY(225.31%) translateX(calc(var(--drift, 1) * 37.8%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 154.07deg)) rotateX(0deg) scale(0.806)",
          },
          "94%": {
            opacity: "0.38",
            transform:
              "translateY(252.04%) translateX(calc(var(--drift, 1) * 45.91%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 171.72deg)) rotateX(0deg) scale(0.793)",
          },
          "100%": {
            opacity: "0",
            transform:
              "translateY(280%) translateX(calc(var(--drift, 1) * 54.4%)) rotate(calc(var(--rot, 0deg) + var(--drift, 1) * 190deg)) rotateX(0deg) scale(0.78)",
          },
        },
      },
      animation: {
        pin: "pin 1.1s cubic-bezier(0.16, 1, 0.3, 1) backwards",
        sweep: "sweep 2.2s cubic-bezier(0.4, 0, 0.2, 1) 1.6s both",
        fall: "fall 1.2s linear forwards",
      },
      transitionTimingFunction: {
        light: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
