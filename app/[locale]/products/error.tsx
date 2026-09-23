"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";
import { useTranslations } from "next-intl";

interface ProductsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the products catalog segment (list + detail).
 * Rendered when ERPNext is unreachable or catalog fetching fails.
 * Uses `useTranslations` (client hook) since error boundaries only
 * receive `{ error, reset }` props, not route params.
 */
export default function ProductsError({ error, reset }: ProductsErrorProps) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error("Products segment failed:", error);
  }, [error]);

  return (
    <div className="container-custom section-padding !py-10">
      <Result
        status="warning"
        title={t("error")}
        extra={
          <Button type="primary" onClick={() => reset()} className="hex-bloom">
            {t("retry")}
          </Button>
        }
      />
    </div>
  );
}
