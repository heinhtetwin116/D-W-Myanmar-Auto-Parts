"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (values: { email: string; password: string; repeatPassword: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    if (values.password !== values.repeatPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      message.error(msg);
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${window.location.origin}/protected`,
        },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
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
      <Card title="Sign up" style={{ width: "100%" }}>
        <Form onFinish={handleSignUp} layout="vertical">
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
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please input your password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>
          <Form.Item
            name="repeatPassword"
            label="Repeat Password"
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (value !== getFieldValue("password")) {
                    return Promise.reject(new Error("Passwords do not match"));
                  }
                  return Promise.resolve();
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm password" />
          </Form.Item>
          {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Sign up
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
    </div>
  );
}