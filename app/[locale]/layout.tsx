import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import my_MM from "antd/es/locale/my_MM";
import en_US from "antd/es/locale/en_US";
// import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { locales, parseLocale } from "@/lib/i18n";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import QueryProvider from "@/components/providers/query-provider";
import { CartProvider } from "@/components/cart/cart-provider";
import type { LocaleLayoutProps } from "@/types/index.type";

const antdLocales = {
  my: my_MM,
  en: en_US,
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const validLocale = parseLocale(locale);

  if (!locales.includes(validLocale)) notFound();

  setRequestLocale(validLocale);
  const messages = await getMessages({ locale: validLocale });

  return (
    <AntdRegistry>
      <ConfigProvider
        locale={antdLocales[validLocale]}
        theme={{
          token: {
            colorPrimary: "#A81C24",
            borderRadius: 8,
            fontFamily: "Manrope, system-ui, sans-serif",
          },
        }}
      >
        <ConfigProvider
          locale={antdLocales[validLocale]}
          theme={{
            token: {
              colorPrimary: "#A81C24",
              borderRadius: 8,
              fontFamily: "Manrope, system-ui, sans-serif",
            },
          }}
        >
          <NextIntlClientProvider messages={messages} locale={validLocale}>
            <QueryProvider>
              <CartProvider>
                <Header />
                <main className="flex-1">{children}</main>
                <Footer />
              </CartProvider>
            </QueryProvider>
          </NextIntlClientProvider>
        </ConfigProvider>
      </ConfigProvider>
    </AntdRegistry>
  );
}
