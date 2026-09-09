"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const [form] = Form.useForm();

  const handleLogin = async (values: { email: string; password: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      if (error) throw error;
      router.push("/protected");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "An error occurred";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={className} {...props}>
      <Card title="Login" extra={<Link href="/auth/forgot-password">Forgot your password?</Link>} style={{ width: "100%" }}>
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: "Please input your email" }]}>
            <Input placeholder="m@example.com" type="email" />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: "Please input your password" }]}>
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link href="/auth/sign-up" style={{ marginLeft: 8 }}>
            Sign up
          </Link>
        </div>
      </Card>
    </div>
  );
}