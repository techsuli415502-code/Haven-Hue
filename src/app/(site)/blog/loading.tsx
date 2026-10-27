export default function BlogLoading() {
  return (
    <div className="container-page py-10 lg:py-14" aria-busy="true" aria-label="Loading articles">
      <div className="mb-8 h-9 w-64 animate-pulse rounded-lg bg-secondary" />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card">
            <div className="aspect-[16/10] animate-pulse bg-secondary" />
            <div className="space-y-2 p-5">
              <div className="h-5 w-3/4 animate-pulse rounded bg-secondary" />
              <div className="h-4 w-full animate-pulse rounded bg-secondary" />
              <div className="h-4 w-2/3 animate-pulse rounded bg-secondary" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
