import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import { LoginForm } from "@/components/login-form";
import { Suspense } from "react";

interface LoginPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export async function generateMetadata({
  params,
}: LoginPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;
  return {
    title: `${t.auth?.login?.title || "Login"} | D&W Myanmar Auto Parts`,
    description: t.auth?.login?.subtitle || "Login to your account",
  };
}

export default async function LoginPage({ params }: LoginPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      {/* <div className="w-full max-w-md"> */}
      <Suspense
        fallback={
          <div className="text-center text-muted-foreground">Loading...</div>
        }
      >
        <LoginForm locale={locale} />
      </Suspense>
      {/* </div> */}
    </div>
  );
}
