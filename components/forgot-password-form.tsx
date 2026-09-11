"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface ForgotPasswordFormProps {
  locale: "my" | "en";
  className?: string;
}

export function ForgotPasswordForm({
  locale,
  className,
  ...props
}: ForgotPasswordFormProps) {
  const t = useTranslations("auth.forgot_password");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/${locale}/auth/update-password`
        : `/${locale}/auth/update-password`;

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo,
        },
      );
      if (error) throw error;
      setSuccess(true);
      message.success(t("success"));
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : t("error");
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} {...props}>
      {success ? (
        <Card title={t("success")} style={{ width: "100%" }}>
          <p style={{ color: "hsl(var(--muted-foreground))" }}>
            {t("success")}
          </p>
        </Card>
      ) : (
        <Card title={t("title")} style={{ width: "100%" }}>
          <Form onFinish={handleForgotPassword} layout="vertical">
            <Form.Item
              name="email"
              label={t("email")}
              rules={[
                { required: true, message: t("email_required") },
                { type: "email", message: t("email_invalid") },
              ]}
            >
              <Input placeholder="m@example.com" type="email" />
            </Form.Item>
            {error && (
              <div
                style={{ color: "hsl(var(--destructive))", marginBottom: 16 }}
              >
                {error}
              </div>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                {isLoading ? t("submitting") : t("submit")}
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <Link href={`/${locale}/auth/login`} style={{ marginLeft: 8 }}>
              {t("back_to_login")}
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
