import { createClient } from "@/lib/supabase/server";
import { type EmailOtpType } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { type NextRequest } from "next/server";
import { locales, defaultLocale, type Locale } from "@/lib/i18n";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const next = searchParams.get("next");

  // Extract locale from next param or referer
  let locale: Locale = defaultLocale;
  if (next) {
    const localeMatch = locales.find((l) => next.startsWith(`/${l}/`));
    if (localeMatch) locale = localeMatch;
  }

  const defaultNext = `/${locale}`;

  if (token_hash && type) {
    const supabase = await createClient();

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // redirect user to specified redirect URL or root of app
      redirect(next || defaultNext);
    } else {
      // redirect the user to an error page with some instructions
      redirect(`/${locale}/auth/error?error=${error?.message}`);
    }
  }

  // redirect the user to an error page with some instructions
  redirect(`/${locale}/auth/error?error=No token hash or type`);
}
