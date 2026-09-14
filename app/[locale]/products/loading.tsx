/**
 * Route loading state for the product catalog.
 * Server-safe: plain HTML + `animate-pulse` shimmer only (no antd imports
 * allowed in Server Components). Mirrors the catalog masthead, sidebar
 * rail, toolbar, and card grid so the layout doesn't jump on load.
 */
export default function ProductsLoading() {
  return (
    <div
      className="container-custom section-padding !py-10 animate-pulse"
      aria-hidden="true"
    >
      <div className="mb-4 h-5 w-48 rounded bg-muted" />
      <div className="flex justify-between items-end border-b border-border py-8">
        <div>
          <div className="h-9 w-64 rounded bg-muted" />
          <div className="mt-2 h-4 w-96 max-w-full rounded bg-muted" />
        </div>
        <div className="h-5 w-32 rounded bg-muted" />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row py-8">
        <aside className="w-full shrink-0 lg:w-56">
          <div className="space-y-8">
            <div>
              <div className="mb-2 h-6 w-40 rounded bg-muted border-b border-border pb-2" />
              <div className="space-y-2">
                {Array.from({ length: 6 }, (_, index) => (
                  <div key={index} className="h-9 rounded bg-muted" />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 h-6 w-32 rounded bg-muted border-b border-border pb-2" />
              <div className="space-y-2">
                {Array.from({ length: 4 }, (_, index) => (
                  <div key={index} className="h-9 rounded bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 min-w-0">
          <div className="mb-6 h-10 rounded bg-muted" />
          <div className="mb-6 flex items-center justify-between gap-4 border-b border-border pb-5">
            <div className="flex gap-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} className="h-7 w-20 rounded-full bg-muted" />
              ))}
            </div>
            <div className="h-9 w-40 rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="rounded-lg border border-border p-5">
                <div className="mb-4 h-48 rounded-md bg-muted" />
                <div className="mb-2 h-3 w-20 rounded bg-muted" />
                <div className="mb-2 h-5 w-full rounded bg-muted" />
                <div className="mb-3 h-4 w-3/4 rounded bg-muted" />
                <div className="h-5 w-24 rounded bg-muted" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
