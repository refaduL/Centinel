import Skeleton from "@/components/ui/Skeleton";

// Mirrors CheckoutFlow's step-indicator + shipping-form step, since
// that's the step a fresh page load always lands on first.
export default function Loading() {
  return (
    <main className="min-h-[70vh] bg-paper pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page">
        <div className="mx-auto max-w-3xl">
          <div className="mb-12 flex items-center justify-center gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-3 w-14" />
                {i < 2 && <span className="ml-3 h-px w-8 bg-ink/10" />}
              </div>
            ))}
          </div>

          <div className="mx-auto max-w-md">
            <Skeleton className="mx-auto h-9 w-48" />
            <div className="mt-8 space-y-5">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
            <Skeleton className="mt-8 h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </main>
  );
}
