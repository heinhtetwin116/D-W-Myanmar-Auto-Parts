import type { ReactNode } from "react";
import Link from "next/link";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  ArrowRight,
  Boxes,
  Clock,
  Eye,
  Handshake,
  MonitorSmartphone,
  RefreshCcw,
  ScanSearch,
  Truck,
  UserCheck,
  Wrench,
} from "lucide-react";
import Reveal from "@/components/about/reveal";
import { parseLocale } from "@/lib/i18n";
import Image from "next/image";

const milestones = ["m1", "m2", "m3"] as const;

const principles = [
  { id: "oem", Icon: ScanSearch },
  { id: "supply", Icon: Truck },
  { id: "time", Icon: Clock },
  { id: "transparency", Icon: Eye },
  { id: "customer", Icon: UserCheck },
  { id: "improvement", Icon: RefreshCcw },
] as const;

const flow = [
  { id: "step1", Icon: Wrench },
  { id: "step2", Icon: Boxes },
  { id: "step3", Icon: MonitorSmartphone },
  { id: "step4", Icon: Handshake },
] as const;

const h2 =
  "text-3xl font-bold tracking-tight text-foreground text-balance sm:text-4xl";
const btnBase =
  "inline-flex h-11 items-center justify-center gap-2 rounded-sm px-6 text-sm font-semibold transition-shadow hover:shadow-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = parseLocale((await params).locale);
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "about" });
  const linkClass =
    "font-semibold text-accent underline underline-offset-4 hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring";
  const rich = {
    p: (chunks: ReactNode) => (
      <Link href={`/${locale}/products`} className={linkClass}>
        {chunks}
      </Link>
    ),
    c: (chunks: ReactNode) => (
      <Link href={`/${locale}/contact`} className={linkClass}>
        {chunks}
      </Link>
    ),
  };

  return (
    <div className="flex flex-col overflow-x-hidden">
      {/* 1. Hero */}
      <section className="border-b border-border bg-background">
        <div className="container-custom grid items-center gap-10 py-16 sm:py-20 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-bold uppercase tracking-[0.2em] text-accent">
              {t("hero.eyebrow")}
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
              {t.rich("hero.subtitle", rich)}
            </p>
          </div>

          <div aria-hidden="true">
            <Image
              src="/images/auto_parts.png"
              alt=""
              className="object-cover rounded-lg"
              priority
              width={600}
              height={600}
            />
          </div>
        </div>
      </section>

      {/* 2. Introduction */}
      <section className="section-padding bg-secondary">
        <div className="container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal delay={100}>
            <dl className="grid grid-cols-3 gap-4">
              {[
                ["30+", t("intro.stat_years")],
                ["4", t("intro.stat_countries")],
                ["1995", t("intro.stat_since")],
              ].map(([value, label]) => (
                <div key={label} className="border-l-2 border-accent pl-4">
                  <dd className="text-3xl font-extrabold text-foreground sm:text-4xl">
                    {value}
                  </dd>
                  <dt className="mt-1 text-xs text-muted-foreground sm:text-sm">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal>
            <h2 className={h2}>{t("intro.title")}</h2>
            <p className="mt-6 leading-relaxed">{t("intro.p1")}</p>
            <p className="mt-4 leading-relaxed text-foreground">
              {t("intro.p2")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 3. Timeline */}
      <section
        aria-labelledby="story-title"
        className="section-padding border-y border-border bg-background"
      >
        <div className="container-custom">
          <h2 id="story-title" className={`${h2} mb-14`}>
            {t("story.title")}
          </h2>
          <ol
            aria-label={t("story.label")}
            className="relative grid gap-10 lg:grid-cols-3 lg:gap-8"
          >
            {/* connecting line: vertical on mobile, horizontal on desktop */}
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-[11px] top-2 w-0.5 bg-border lg:bottom-auto lg:left-0 lg:right-0 lg:top-[11px] lg:h-0.5 lg:w-auto"
            />
            {milestones.map((m, i) => (
              <li key={m} className="relative pl-10 lg:pl-0 lg:pt-12">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-accent bg-background lg:top-0"
                >
                  <span className="h-2 w-2 rounded-full bg-accent" />
                </span>

                <Reveal delay={i * 150}>
                  <div className="h-[400px] rounded-lg bg-card p-6 shadow-default">
                    <p className="text-5xl font-extrabold tracking-tight text-accent">
                      {t(`story.${m}.year`)}
                    </p>

                    <h3 className="mt-3 text-lg font-bold text-foreground">
                      {t(`story.${m}.title`)}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed">
                      {t.rich(`story.${m}.p1`, rich)}
                    </p>

                    <p className="mt-3 text-sm leading-relaxed">
                      {t(`story.${m}.p2`)}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Vision */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-6 -top-10 select-none text-[12rem] font-extrabold leading-none text-accent opacity-40 sm:text-[18rem]"
        >
          30
        </span>
        <div className="container-custom section-padding relative">
          <Reveal className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground">
              {t("vision.eyebrow")}
            </p>
            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl">
              {t("vision.title")}
            </h2>
            <p className="mt-8 max-w-2xl border-l-4 border-accent pl-5 text-base leading-relaxed sm:text-lg">
              {t("vision.statement")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5. Principles */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="max-w-2xl">
            <h2 className={h2}>{t("principles.title")}</h2>
            <p className="mt-4">{t("principles.subtitle")}</p>
          </div>
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {principles.map(({ id, Icon }, i) => (
              <li key={id}>
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <article className="group h-full rounded-lg bg-card p-6 shadow-default transition-shadow duration-300 hover:shadow-hover">
                    <div className="flex items-center gap-4">
                      <span className="flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <h3 className="text-lg font-bold text-foreground">
                        {t(`principles.${id}.title`)}
                      </h3>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {t(`principles.${id}.description`)}
                    </p>
                  </article>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 6. Digital transformation */}
      <section className="section-padding bg-secondary">
        <div className="container-custom grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <h2 className={h2}>{t("digital.title")}</h2>
            <p className="mt-6 leading-relaxed">
              {t.rich("digital.text1", rich)}
            </p>
            <p className="mt-4 leading-relaxed">
              {t.rich("digital.text2", rich)}
            </p>
          </Reveal>
          <Reveal delay={100}>
            <ol aria-label={t("digital.flow_label")} className="flex flex-col">
              {flow.map(({ id, Icon }, i) => (
                <li key={id} className="flex flex-col items-stretch">
                  <div
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      i === flow.length - 1
                        ? "border-accent bg-card shadow-default"
                        : "border-border bg-card"
                    }`}
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted-foreground">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-semibold text-foreground">
                      {t(`digital.${id}`)}
                    </span>
                    <span className="ml-auto text-xs text-muted-foreground">
                      0{i + 1}
                    </span>
                  </div>
                  {i < flow.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="mx-auto flex h-8 items-center"
                    >
                      <span className="h-full w-0.5 bg-border" />
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Reveal>
        </div>
      </section>

      {/* 7. CTA */}
      <section className="pb-16 sm:pb-24">
        <div className="container-custom">
          <div className="rounded-lg bg-primary px-6 py-14 text-center text-primary-foreground sm:px-12">
            <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-xl">{t("cta.text")}</p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href={`/${locale}/products`}
                className={`${btnBase} w-full bg-accent text-accent-foreground sm:w-auto`}
              >
                {t("cta.products")}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                href={`/${locale}/contact`}
                className={`${btnBase} w-full border border-primary-foreground text-primary-foreground sm:w-auto`}
              >
                {t("cta.contact")}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
