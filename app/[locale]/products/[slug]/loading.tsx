/**
 * Route loading state for the product detail page.
 * Server-safe: plain HTML + `animate-pulse` shimmer only (no antd imports
 * allowed in Server Components). Mirrors the breadcrumb, image card, info
 * column, and specs table of the detail layout.
 */
export default function ProductDetailLoading() {
  return (
    <div
      className="container-custom section-padding !py-10 animate-pulse"
      aria-hidden="true"
    >
      <div className="mb-6 h-5 w-64 rounded bg-muted" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex min-h-80 items-center justify-center bg-muted">
            <div className="h-24 w-24 rounded-full bg-border" />
          </div>
        </div>

        <div>
          <div className="mb-2 flex gap-2">
            <div className="h-6 w-24 rounded-full bg-muted" />
            <div className="h-6 w-20 rounded-full bg-muted" />
          </div>
          <div className="mb-1 h-9 w-3/4 rounded bg-muted" />
          <div className="mb-4 h-4 w-32 rounded bg-muted" />
          <div className="mb-4 h-10 w-48 rounded bg-muted" />
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
          </div>
          <div className="mt-6 flex gap-3">
            <div className="h-10 w-40 rounded-lg bg-muted" />
            <div className="h-10 w-40 rounded-lg bg-muted" />
          </div>
          <div className="mt-6 space-y-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex gap-4">
                <div className="h-8 w-1/3 rounded bg-muted" />
                <div className="h-8 w-2/3 rounded bg-muted" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <div className="mb-6 h-8 w-56 rounded bg-muted" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-lg border border-border p-5">
              <div className="mb-4 h-44 rounded-md bg-muted" />
              <div className="mb-2 h-5 w-full rounded bg-muted" />
              <div className="h-5 w-24 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
