import { getRequestConfig } from "next-intl/server";

export const locales = ["my", "en"] as const;
export const defaultLocale = "my" as const;

export type Locale = (typeof locales)[number];

export function parseLocale(value: unknown): Locale {
  return typeof value === "string" && locales.includes(value as Locale)
    ? (value as Locale)
    : defaultLocale;
}

export default getRequestConfig(async ({ locale }) => {
  const finalLocale = parseLocale(locale);

  return {
    locale: finalLocale as string,
    messages: (await import(`../messages/${finalLocale}.json`)).default,
  };
});
