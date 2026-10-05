/**
 * The base building block for every loading.js file in app/ — a
 * shimmering placeholder block. Compose these to roughly match the
 * real content's shape/dimensions (image aspect ratios, text line
 * heights, button sizes) so there's minimal layout shift when the
 * real content replaces it; that match is intentional in each
 * loading.js file, not just "some gray boxes."
 *
 * `rounded-md` is the default so callers don't need to repeat it for
 * ordinary text-line/block skeletons — override via className (e.g.
 * `rounded-full` for a pill/circle, `rounded-2xl` for a big image
 * placeholder) when the real element isn't a plain rectangle.
 */
export default function Skeleton({ className = "" }) {
  return <div className={`skeleton rounded-md ${className}`} aria-hidden="true" />;
}
