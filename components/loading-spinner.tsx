import type { LoadingSpinnerProps } from "@/types/index.type";

/**
 * Server-safe loading spinner (plain HTML + semantic tokens, no antd).
 * Safe to use in Server Component `Suspense` fallbacks and route
 * `loading.tsx` files where antd imports are not allowed.
 */
export default function LoadingSpinner({
  label = "Loading",
  className = "flex justify-center py-16",
}: LoadingSpinnerProps) {
  return (
    <div className={className} role="status" aria-label={label}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-accent" />
    </div>
  );
}
