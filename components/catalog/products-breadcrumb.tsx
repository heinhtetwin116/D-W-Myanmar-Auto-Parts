"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";
import type { ProductsBreadcrumbProps } from "@/types/index.type";

export default function ProductsBreadcrumb({
  locale,
  homeLabel,
  trail,
}: ProductsBreadcrumbProps) {
  return (
    <Breadcrumb
      className="mb-4"
      items={[
        {
          title: (
            <Link href={`/${locale}/`}>
              <HomeOutlined /> {homeLabel}
            </Link>
          ),
        },
        ...trail.map((item) => ({
          title: item.href ? (
            <Link href={item.href}>{item.label}</Link>
          ) : (
            item.label
          ),
        })),
      ]}
    />
  );
}
