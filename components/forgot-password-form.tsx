"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useState } from "react";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async (values: { email: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/update-password`
        : "/auth/update-password";

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo,
        },
      );
      if (error) throw error;
      setSuccess(true);
      message.success("Password reset email sent!");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} {...props}>
      {success ? (
        <Card title="Check Your Email" style={{ width: "100%" }}>
          <p style={{ color: "#8c8c8c" }}>
            If you registered using your email and password, you will receive a
            password reset email.
          </p>
        </Card>
      ) : (
        <Card title="Reset Your Password" style={{ width: "100%" }}>
          <Form onFinish={handleForgotPassword} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="m@example.com" type="email" />
            </Form.Item>
            {error && (
              <div style={{ color: "red", marginBottom: 16 }}>{error}</div>
            )}
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                loading={isLoading}
              >
                Send reset email
              </Button>
            </Form.Item>
          </Form>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            Already have an account?{" "}
            <Link href="/auth/login" style={{ marginLeft: 8 }}>
              Login
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
