"use client";

import Link from "next/link";
import { Breadcrumb } from "antd";
import { HomeOutlined } from "@ant-design/icons";

interface ProductsBreadcrumbProps {
  locale: string;
  homeLabel: string;
  productsLabel: string;
  currentLabel?: string;
}

export default function ProductsBreadcrumb({
  locale,
  homeLabel,
  productsLabel,
  currentLabel,
}: ProductsBreadcrumbProps) {
  const items: { title: React.ReactNode }[] = [
    {
      title: (
        <Link href={`/${locale}/`}>
          <HomeOutlined /> {homeLabel}
        </Link>
      ),
    },
    {
      title: currentLabel ? (
        <Link href={`/${locale}/products`}>{productsLabel}</Link>
      ) : (
        productsLabel
      ),
    },
  ];

  if (currentLabel) {
    items.push({ title: currentLabel });
  }

  return <Breadcrumb className="mb-4" items={items} />;
}
