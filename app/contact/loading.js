import Skeleton from "@/components/ui/Skeleton";

// Mirrors app/contact/page.js: title + subtitle, then the two
// matching bg-sand panels (form / info).
export default function Loading() {
  return (
    <main className="bg-cream pb-24 pt-32 md:pb-32 md:pt-40">
      <div className="container-page">
        <Skeleton className="h-10 w-56" />
        <Skeleton className="mt-4 h-4 w-full max-w-md" />
        <div className="mt-10 border-t border-ink/15" />

        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-5 rounded-2xl bg-sand p-8 md:p-10">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full sm:col-span-2" />
            </div>
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>

          <div className="rounded-2xl bg-sand p-8 md:p-10">
            <Skeleton className="h-3 w-20" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="mt-10 h-3 w-20" />
            <div className="mt-4 space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
