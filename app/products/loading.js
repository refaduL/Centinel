import Skeleton from "@/components/ui/Skeleton";

// Mirrors app/products/page.js: the "Catalog" title, the description
// + category-tabs row, then PAGE_SIZE (6) rich cards. Kept in sync
// with that page's actual PAGE_SIZE by eye, not imported — this file
// only affects the loading flash, not real behavior, so it doesn't
// need to be pixel/count-exact.
export default function Loading() {
  return (
    <main className="bg-sand pb-24 pt-36 md:pb-32 md:pt-44">
      <div className="container-page">
        <Skeleton className="h-10 w-40" />

        <div className="mt-14">
          <div className="mb-12 flex flex-col gap-6 md:mb-16 md:flex-row md:items-end md:justify-between">
            <Skeleton className="h-5 w-full max-w-md" />
            <div className="flex gap-2">
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
              <Skeleton className="h-9 w-20 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-cream p-4">
                <Skeleton className="aspect-[4/3] w-full rounded-xl" />
                <Skeleton className="mt-4 h-5 w-3/4" />
                <Skeleton className="mt-2 h-6 w-20 rounded-full" />
                <div className="mt-3 space-y-1.5">
                  <Skeleton className="h-3.5 w-full" />
                  <Skeleton className="h-3.5 w-2/3" />
                </div>
                <div className="mt-4 flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-full" />
                  <Skeleton className="h-9 flex-1 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
