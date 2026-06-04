export function PageContentSkeleton() {
  return (
    <div
      className="container-umq animate-pulse py-14 sm:py-20"
      aria-busy
      aria-label="Loading"
    >
      <div className="mx-auto max-w-3xl space-y-4">
        <div className="h-4 w-24 rounded-lg bg-border/80" />
        <div className="h-12 w-3/4 max-w-md rounded-xl bg-border/80" />
        <div className="h-5 w-full rounded-lg bg-border/60" />
        <div className="h-5 w-5/6 rounded-lg bg-border/60" />
      </div>
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-48 rounded-2xl border border-border/60 bg-surface/50"
          />
        ))}
      </div>
    </div>
  );
}
