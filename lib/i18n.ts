// import { notFound } from "next/navigation";
import { getRequestConfig } from "next-intl/server";

export const locales = ["my", "en"] as const;
export const defaultLocale = "my" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ locale }) => {
  const finalLocale = locales.includes(locale as Locale)
    ? locale
    : defaultLocale;

  return {
    locale: finalLocale as string,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
