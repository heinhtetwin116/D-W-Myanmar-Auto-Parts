import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ConfigProvider } from "antd";
import my_MM from "antd/es/locale/my_MM";
import en_US from "antd/es/locale/en_US";
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "@/app/globals.css";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

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

  if (!locales.includes(validLocale)) notFound();

  return (
    <html lang={validLocale} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased flex min-h-screen flex-col">
        <AntdRegistry>
          <ConfigProvider locale={antdLocales[validLocale]}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <Header locale={validLocale} />
              <main className="flex-1">{children}</main>
              <Footer locale={validLocale} />
            </ThemeProvider>
          </ConfigProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
