import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import my_MM from "antd/es/locale/my_MM";
import en_US from "antd/es/locale/en_US";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Header";

const antdLocales = {
  my: my_MM,
  en: en_US,
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  const validLocale = locales.includes(locale as Locale)
    ? (locale as Locale)
    : defaultLocale;

  setRequestLocale(validLocale);
  const messages = await getMessages({ locale: validLocale });

  if (!locales.includes(validLocale)) notFound();

  return (
    <AntdRegistry>
      <ConfigProvider locale={antdLocales[validLocale]}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <NextIntlClientProvider messages={messages} locale={validLocale}>
            {/* <Header locale={validLocale} /> */}
            <Header />
            <main className="flex-1">{children}</main>
            {/* <Footer locale={validLocale} /> */}
            <Footer />
          </NextIntlClientProvider>
        </ThemeProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
