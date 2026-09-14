"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface UpdatePasswordFormProps {
  locale: "my" | "en";
  className?: string;
}

export function UpdatePasswordForm({
  locale,
  className,
  ...props
}: UpdatePasswordFormProps) {
  const t = useTranslations("auth.update_password");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (values: { password: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      message.success(t("success"));
      router.push(`/${locale}/protected`);
      router.refresh();
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
      <Card title={t("title")} style={{ width: "100%" }}>
        <Form onFinish={handleUpdatePassword} layout="vertical">
          <Form.Item
            name="password"
            label={t("password")}
            rules={[
              { required: true, message: t("password_required") },
              { min: 8, message: t("password_min_length") },
            ]}
          >
            <Input.Password placeholder={t("password_placeholder")} />
          </Form.Item>
          {error && (
            <div style={{ color: "hsl(var(--destructive))", marginBottom: 16 }}>
              {error}
            </div>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              {isLoading ? t("submitting") : t("submit")}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
