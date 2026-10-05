import Skeleton from "@/components/ui/Skeleton";

// Mirrors ProductDetail.jsx: image, category label, title, price
// row, description, quantity stepper + Add to cart, then the 4
// highlight badges.
export default function Loading() {
  return (
    <main className="bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 md:gap-16">
          <Skeleton className="aspect-square w-full rounded-2xl md:aspect-[4/5]" />

          <div>
            <Skeleton className="h-3 w-16" />
            <Skeleton className="mt-3 h-9 w-2/3" />

            <div className="mt-4 flex items-baseline gap-4">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-5 w-28" />
            </div>

            <div className="mt-6 max-w-md space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <Skeleton className="mt-8 h-11 w-32 rounded-full" />
            <Skeleton className="mt-4 h-14 w-full rounded-full" />

            <div className="mt-10 grid grid-cols-2 gap-6 border-t border-ink/10 pt-8 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2">
                  <Skeleton className="h-5 w-5 rounded-full" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
