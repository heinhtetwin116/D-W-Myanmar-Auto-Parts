import { getMessages } from "next-intl/server";
import { Card } from "antd";
import { Suspense } from "react";

interface AuthErrorPageProps {
  params: Promise<{ locale: "my" | "en" }>;
  searchParams: Promise<{ error?: string }>;
}

interface ErrorMessages {
  title: string;
  code_error: string;
  unspecified: string;
}

async function ErrorContent({
  searchParams,
  t,
}: {
  searchParams: Promise<{ error?: string }>;
  t: ErrorMessages;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "14px" }}>
          {t.code_error || "Code error"}: {params.error}
        </p>
      ) : (
        <p style={{ color: "hsl(var(--muted-foreground))", fontSize: "14px" }}>
          {t.unspecified || "An unspecified error occurred."}
        </p>
      )}
    </>
  );
}

export default async function AuthErrorPage({
  params,
  searchParams,
}: AuthErrorPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card
          title={t.auth?.error?.title || "Sorry, something went wrong."}
          style={{ width: "100%" }}
        >
          <Suspense>
            <ErrorContent
              searchParams={searchParams}
              t={t.auth?.error as ErrorMessages}
            />
          </Suspense>
        </Card>
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  return [{ locale: "my" }, { locale: "en" }];
}
