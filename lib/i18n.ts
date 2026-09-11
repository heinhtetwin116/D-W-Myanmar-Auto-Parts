import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["my", "en"] as const;
export const defaultLocale = "my" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as Locale)) notFound();

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
