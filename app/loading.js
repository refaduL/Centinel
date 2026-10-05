import Skeleton from "@/components/ui/Skeleton";

/**
 * Next.js's file-based loading convention — shown automatically while
 * this route segment's content is being prepared, no wiring required
 * beyond this file existing. Mirrors just Hero (the above-the-fold
 * content) rather than every homepage section below it; the parts a
 * visitor sees first are what's worth covering, not the whole page.
 */
export default function Loading() {
  return (
    <section className="bg-sand px-4 py-12 md:px-14 md:py-16">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 py-10 md:grid-cols-2 md:gap-8 md:py-16">
        <div className="order-2 flex flex-col justify-center md:order-1">
          <Skeleton className="h-3 w-20" />
          <div className="mt-6 max-w-xl space-y-3">
            <Skeleton className="h-12 w-full max-w-sm" />
            <Skeleton className="h-12 w-2/3 max-w-xs" />
          </div>
          <div className="mt-6 max-w-lg space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>
          <Skeleton className="mt-8 h-11 w-48 rounded-full" />
        </div>

        <div className="order-1 mx-auto w-full max-w-xl md:order-2">
          <Skeleton className="aspect-[735/922] w-full rounded-2xl" />
        </div>
      </div>
    </section>
  );
}
