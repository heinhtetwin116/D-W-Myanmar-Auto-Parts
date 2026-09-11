import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import { ForgotPasswordForm } from "@/components/forgot-password-form";
import { Suspense } from "react";

interface ForgotPasswordPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export async function generateMetadata({
  params,
}: ForgotPasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;
  return {
    title: `${t.auth?.forgot_password?.title || "Reset Password"} | D&W Myanmar Auto Parts`,
    description: t.auth?.forgot_password?.subtitle || "Reset your password",
  };
}

export default async function ForgotPasswordPage({
  params,
}: ForgotPasswordPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.auth?.forgot_password?.title || "Reset Your Password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t.auth?.forgot_password?.subtitle ||
              "Enter your email to receive a reset link"}
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-center text-muted-foreground">Loading...</div>
          }
        >
          <ForgotPasswordForm locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
