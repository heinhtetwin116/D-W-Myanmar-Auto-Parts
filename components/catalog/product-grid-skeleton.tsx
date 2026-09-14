"use client";

import { Card, Skeleton } from "antd";

interface ProductGridSkeletonProps {
  count?: number;
}

/**
 * Skeleton placeholder grid mirroring the product card layout.
 * Client-island only: antd `Skeleton` must not be imported by Server
 * Components. Render inside a `<Suspense>` boundary around suspended
 * content so filters stay interactive while results reload.
 */
export default function ProductGridSkeleton({
  count = 8,
}: ProductGridSkeletonProps) {
  return (
    <div
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <Card key={index} className="h-full">
          <Skeleton.Image active className="!h-44 !w-full" />
          <Skeleton active title={{ width: "60%" }} paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </div>
  );
}
