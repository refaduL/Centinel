"use client";

import { useRef, useState } from "react";
import { fallToProduct } from "@/lib/fallToProduct";

// Shared across every pin so the one you just touched always lands on
// top of the pile, like picking a card off a real board and pressing
// it back on. Module-level on purpose: it is not render state.
let topZ = 10;

// How long the "falls off the board" drop takes before we scroll to
// its product in the collection. Must match the `fall` keyframe's own
// duration in tailwind.config.js — this is what hands off from "piece
// is still animating" to "go scroll now."
const FALL_MS = 1200;

/**
 * One loose thing on the magnet board. Owns ONLY behavior (drag, lift,
 * stacking, entrance, and — for product pieces — the "click sends it
 * to the collection" fall); what the thing looks like is passed in as
 * children by Hero.jsx, which stays a server component.
 *
 * Two nested elements, deliberately:
 *   outer  = position + drag offset (transform: translate3d)
 *   inner  = rotation + entrance/fall keyframes + "lifted" scale
 * At rest, rotation lives on the standalone CSS `rotate` property
 * (not `transform`) so it can't clash with the `animate-pin` /
 * `animate-fall` keyframes or the lift scale, which all live on
 * `transform`. Mid-fall, that standalone `rotate` is zeroed out and
 * handed to the `fall` keyframe instead (via the `--rot` custom
 * property, read inside its `transform`) — the keyframe needs to OWN
 * rotation for that one animation, since it's tumbling the piece
 * through multiple angles, not holding one static tilt.
 *
 * Drag rules worth knowing before changing anything:
 * - Pointer capture is taken only AFTER the pointer has moved a few
 *   pixels. Capturing on pointerdown would retarget the later click
 *   to this wrapper and break the links/buttons inside (a plain tap on
 *   the ticket's button must still just be a click).
 * - After a real drag, the trailing click is swallowed, so dropping a
 *   polaroid never fires its click behavior by accident.
 * - `md:touch-none` only from tablet up. On phones the board is part
 *   of a scrolling page, and trapping touch here would make the hero
 *   a scroll dead zone; there, a touch-drag just scrolls (pointercancel
 *   ends the gesture harmlessly).
 * - Pieces are clamped to the board face (`[data-board]`) so nothing
 *   can be flung out of reach behind the frame.
 *
 * `fallToId`, when set (product pieces only — polaroids and stickers),
 * turns a plain click into a send-to-collection gesture instead of
 * following the child's own `<Link>`: the piece flutters off the
 * board (see the `fall` keyframe in tailwind.config.js — a curved
 * sway, not a straight drop or a sawtooth zigzag; the trajectory was
 * sampled and plotted before this was ported in, not just eyeballed)
 * and, once it's clear, the page scrolls
 * to that product's card in the collection grid and gives it a brief
 * highlight (see lib/fallToProduct.js). Anything that isn't a plain
 * primary-button mouse/touch click is left alone and falls through to
 * the Link untouched: a modified click (ctrl/cmd/shift) for opening a
 * new tab, and — checked via `e.detail === 0`, which is how a browser
 * marks a click as keyboard- or assistive-tech-triggered rather than
 * from an actual pointer — keyboard Enter and screen reader
 * activation. Verified directly (Playwright: a real click reports
 * `detail: 1`, a focused Enter-press reports `detail: 0`, `button: 0`
 * in both — `button` alone can't tell them apart). The fall is a
 * progressive enhancement over the Link, not a replacement.
 */
export default function DraggablePin({
  className = "",
  rotate = 0,
  delay = 0,
  fallToId,
  children,
}) {
  const ref = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [z, setZ] = useState(1);
  const [lifted, setLifted] = useState(false);
  const [fallen, setFallen] = useState(false);

  const onPointerDown = (e) => {
    if (fallen) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const board = ref.current.closest("[data-board]");
    if (!board) return;
    drag.current = {
      sx: e.clientX,
      sy: e.clientY,
      ox: offset.x,
      oy: offset.y,
      board: board.getBoundingClientRect(),
      rect: ref.current.getBoundingClientRect(),
    };
    moved.current = false;
    setZ(++topZ);
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    let dx = e.clientX - d.sx;
    let dy = e.clientY - d.sy;
    if (!moved.current) {
      if (Math.hypot(dx, dy) < 4) return;
      moved.current = true;
      ref.current.setPointerCapture(e.pointerId);
      setLifted(true);
    }
    dx = Math.min(Math.max(dx, d.board.left - d.rect.left), d.board.right - d.rect.right);
    dy = Math.min(Math.max(dy, d.board.top - d.rect.top), d.board.bottom - d.rect.bottom);
    setOffset({ x: d.ox + dx, y: d.oy + dy });
  };

  const endDrag = () => {
    drag.current = null;
    setLifted(false);
  };

  return (
    <div
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onClickCapture={(e) => {
        if (moved.current) {
          e.preventDefault();
          e.stopPropagation();
          moved.current = false;
          return;
        }
        if (
          fallToId &&
          !fallen &&
          e.button === 0 &&
          e.detail !== 0 &&
          !e.metaKey &&
          !e.ctrlKey &&
          !e.shiftKey &&
          !e.altKey
        ) {
          e.preventDefault();
          e.stopPropagation();
          setZ(++topZ);
          setFallen(true);
          window.setTimeout(() => fallToProduct(fallToId), FALL_MS);
        }
      }}
      className={`absolute select-none md:touch-none ${fallen ? "pointer-events-none" : ""} ${
        lifted ? "cursor-grabbing" : "cursor-grab"
      } ${className}`}
      style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`, zIndex: z }}
    >
      <div
        className={`transition-[transform,filter] duration-200 ease-light ${
          fallen ? "animate-fall" : "animate-pin"
        } ${lifted ? "scale-[1.05] drop-shadow-2xl" : ""}`}
        style={
          fallen
            ? {
                "--rot": `${rotate}deg`,
                // One drift direction for the whole fall, not a
                // reversing zigzag — picked from which way the piece
                // was already leaning, so it keeps tumbling the
                // direction it was tilted rather than an arbitrary one.
                "--drift": rotate < 0 ? -1 : 1,
                rotate: "0deg",
                animationDelay: "0ms",
              }
            : { rotate: `${rotate}deg`, translate: "0 0", opacity: 1, animationDelay: `${delay}ms` }
        }
      >
        {children}
      </div>
    </div>
  );
}
