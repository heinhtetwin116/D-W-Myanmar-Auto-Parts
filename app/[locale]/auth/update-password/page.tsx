import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import { UpdatePasswordForm } from "@/components/update-password-form";
import { Suspense } from "react";

interface UpdatePasswordPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export async function generateMetadata({
  params,
}: UpdatePasswordPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;
  return {
    title: `${t.auth?.update_password?.title || "Update Password"} | D&W Myanmar Auto Parts`,
    description: t.auth?.update_password?.subtitle || "Update your password",
  };
}

export default async function UpdatePasswordPage({
  params,
}: UpdatePasswordPageProps) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t.auth?.update_password?.title || "Update Password"}
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            {t.auth?.update_password?.subtitle || "Enter your new password"}
          </p>
        </div>
        <Suspense
          fallback={
            <div className="text-center text-muted-foreground">Loading...</div>
          }
        >
          <UpdatePasswordForm locale={locale} />
        </Suspense>
      </div>
    </div>
  );
}
