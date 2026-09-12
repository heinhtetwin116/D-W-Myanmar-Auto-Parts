"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { message } from "antd";

interface LoginFormProps {
  locale: "my" | "en";
}

export function LoginForm({ locale }: LoginFormProps) {
  const t = useTranslations("auth.login");
  // const commonT = useTranslations('common');
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const supabase = createClient();

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw authError;

      message.success(t("submitting"));
      router.push(`/${locale}/protected`);
      router.refresh();
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : t("error");
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Logo Section */}
      <div className="flex justify-center">
        <Image
          src="/DW_FullLogo.png"
          alt="Company Logo"
          width={72}
          height={72}
          priority
          className="h-16 w-auto object-contain"
        />
      </div>

      {/* Heading */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-primary font-serif">
          {t("title")}
        </h1>
        <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
      </div>

      {/* Sign In Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
        {/* Email Field */}
        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            {t("email")}
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            placeholder="john@example.com"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Password Field */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="block text-sm font-semibold text-primary">
              {t("password")}
            </label>
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-xs text-accent hover:underline font-medium"
            >
              {showPassword ? t("hide_password") : t("show_password")}
            </button>
          </div>
          <input
            type={showPassword ? "text" : "password"}
            required
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive text-center" role="alert">
            {error}
          </div>
        )}

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            href={`/${locale}/auth/forgot-password`}
            className="text-xs text-accent hover:underline font-medium"
          >
            {t("forgot_password")}
          </Link>
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-2.5 px-4 rounded-md text-sm transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      {/* Sign Up Link */}
      <p className="text-center text-sm text-muted-foreground">
        {t("no_account")}{" "}
        <Link
          href={`/${locale}/auth/sign-up`}
          className="text-accent hover:underline font-semibold"
        >
          {t("signup_link")}
        </Link>
      </p>

      {/* Footer Legal Links */}
      <div className="pt-6 border-t border-gray-100 flex items-center justify-center gap-4 text-xs text-gray-400">
        <Link href="/terms" className="hover:text-accent transition-colors">
          Terms of Service
        </Link>
        <span className="w-px h-3 bg-gray-300"></span>
        <Link href="/privacy" className="hover:text-accent transition-colors">
          Privacy Policy
        </Link>
        <span className="w-px h-3 bg-gray-300"></span>
        <Link href="/help" className="hover:text-accent transition-colors">
          Help Center
        </Link>
      </div>
    </div>
  );
}
