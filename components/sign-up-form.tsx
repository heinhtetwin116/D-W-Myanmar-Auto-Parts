"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { message } from "antd";

interface SignUpFormProps {
  locale: "my" | "en";
}

export function SignUpForm({ locale }: SignUpFormProps) {
  const t = useTranslations("auth.signup");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    username: "",
  });
  const [error, setError] = useState<string | null>(null);

  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  const hasMinLength = password.length >= 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // Client-side validation
    if (
      !hasLowercase ||
      !hasUppercase ||
      !hasNumber ||
      !hasSpecial ||
      !hasMinLength
    ) {
      setError(t("password_requirements"));
      setIsLoading(false);
      return;
    }

    const supabase = createClient();

    try {
      const { error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: password,
        options: {
          data: {
            username: formData.username,
          },
        },
      });

      if (authError) throw authError;

      message.success(t("submitting"));
      router.push(`/${locale}/auth/sign-up-success`);
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

      {/* Sign Up Form */}
      <form className="space-y-4" onSubmit={handleSubmit}>
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

        <div>
          <label className="block text-sm font-semibold text-primary mb-1">
            {t("username")}
          </label>
          <input
            type="text"
            required
            value={formData.username}
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            placeholder="johndoe"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent text-foreground text-sm"
          />
        </div>

        {/* Password Requirements */}
        <div className="grid grid-cols-2 gap-y-1 text-xs py-1 text-muted-foreground">
          <span className={hasLowercase ? "text-success font-medium" : ""}>
            • {t("requirements.lowercase")}
          </span>
          <span className={hasSpecial ? "text-success font-medium" : ""}>
            • {t("requirements.special")}
          </span>
          <span className={hasUppercase ? "text-success font-medium" : ""}>
            • {t("requirements.uppercase")}
          </span>
          <span className={hasMinLength ? "text-success font-medium" : ""}>
            • {t("requirements.min_length")}
          </span>
          <span className={hasNumber ? "text-success font-medium" : ""}>
            • {t("requirements.number")}
          </span>
        </div>

        {/* Error Message */}
        {error && (
          <div className="text-sm text-destructive text-center" role="alert">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-accent hover:opacity-90 text-accent-foreground font-medium py-2.5 px-4 rounded-md text-sm transition-opacity shadow-sm disabled:opacity-50 disabled:cursor-not-allowed hex-bloom"
        >
          {isLoading ? t("submitting") : t("submit")}
        </button>
      </form>

      {/* Login Link */}
      <p className="text-center text-sm text-muted-foreground">
        {t("has_account")}{" "}
        <Link
          href={`/${locale}/auth/login`}
          className="text-accent hover:underline font-semibold"
        >
          {t("login_link")}
        </Link>
      </p>
    </div>
  );
}
