import { getMessages } from "next-intl/server";
import { Metadata } from "next";
import { SignUpForm } from "@/components/sign-up-form";
import { Suspense } from "react";

interface SignUpPageProps {
  params: Promise<{ locale: "my" | "en" }>;
}

export async function generateMetadata({
  params,
}: SignUpPageProps): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const t = messages;
  return {
    title: `${t.auth?.signup?.title || "Sign Up"} | D&W Myanmar Auto Parts`,
    description: t.auth?.signup?.subtitle || "Create your account",
  };
}

export default async function SignUpPage({ params }: SignUpPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* <div className="w-full max-w-md"> */}

      <Suspense
        fallback={
          <div className="text-center text-muted-foreground">Loading...</div>
        }
      >
        <SignUpForm locale={locale} />
      </Suspense>
      {/* </div> */}
    </div>
  );
}
