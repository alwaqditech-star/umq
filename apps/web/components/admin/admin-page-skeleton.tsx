export function AdminPageSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-busy aria-label="Loading">
      <div className="flex items-center justify-between gap-4">
        <div className="h-8 w-40 rounded-lg bg-border/80" />
        <div className="h-9 w-28 rounded-xl bg-border/60" />
      </div>
      <div className="overflow-hidden rounded-2xl border border-border">
        <div className="h-11 border-b border-border bg-table-header" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex gap-4 border-b border-border/60 px-4 py-4 last:border-0"
          >
            <div className="h-4 flex-1 rounded bg-border/50" />
            <div className="h-4 w-24 rounded bg-border/40" />
            <div className="h-4 w-16 rounded bg-border/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
