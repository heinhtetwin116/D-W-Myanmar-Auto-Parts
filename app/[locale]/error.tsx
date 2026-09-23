"use client";

import { useEffect } from "react";
import { Button, Result } from "antd";
import { useTranslations } from "next-intl";

interface LocaleErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

/**
 * Error boundary for the locale segment (home, about, contact, and any
 * other page without its own boundary — `products/error.tsx` still takes
 * precedence for that segment). Rendered when ERPNext is unreachable or
 * catalog fetching fails, e.g. the home page's Featured/Latest sections.
 * Uses `useTranslations` (client hook) since error boundaries only
 * receive `{ error, reset }` props, not route params.
 */
export default function LocaleError({ error, reset }: LocaleErrorProps) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error("Locale segment failed:", error);
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
