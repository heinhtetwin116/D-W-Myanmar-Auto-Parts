import { Suspense } from "react";
import { getMessages } from "next-intl/server";
import LoadingSpinner from "@/components/loading-spinner";
import ProductsBreadcrumb from "@/components/catalog/products-breadcrumb";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import type {
  ContactFormLabels,
  ContactInfoLabels,
  ContactPageProps,
} from "@/types/index.type";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale: rawLocale } = await params;
  const locale: Locale = locales.includes(rawLocale as Locale)
    ? (rawLocale as Locale)
    : defaultLocale;
  const messages = await getMessages({ locale });

  const t = messages.contact;
  const formLabels: ContactFormLabels = {
    name: t.form.name,
    email: t.form.email,
    phone: t.form.phone,
    message: t.form.message,
    messagePlaceholder: t.form.message_placeholder,
    submit: t.form.submit,
    submitting: t.form.submitting,
    success: t.form.success,
    error: t.form.error,
  };
  const infoLabels: ContactInfoLabels = {
    title: t.info.title,
    address: t.info.address,
    phone: t.info.phone,
    email: t.info.email,
    hours: t.info.hours,
  };

  return (
    <div className="container-custom section-padding !py-10">
      <ProductsBreadcrumb
        locale={locale}
        homeLabel={messages.common.home}
        trail={[{ label: t.title }]}
      />

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        {t.title}
      </h1>
      <p className="mt-2 mb-8 text-muted-foreground">{t.subtitle}</p>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <Suspense fallback={<LoadingSpinner />}>
            <ContactForm labels={formLabels} />
          </Suspense>
        </div>
        <div className="lg:col-span-2">
          <Suspense fallback={<LoadingSpinner />}>
            <ContactInfo labels={infoLabels} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
