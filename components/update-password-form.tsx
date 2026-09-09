"use client";

import { createClient } from "@/lib/supabase/client";
import { Button, Card, Form, Input, message } from "antd";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function UpdatePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleUpdatePassword = async (values: { password: string }) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.updateUser({ password: values.password });
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
      <Card title="Reset Your Password" style={{ width: "100%" }}>
        <Form onFinish={handleUpdatePassword} layout="vertical">
          <Form.Item
            name="password"
            label="New password"
            rules={[
              { required: true, message: "Please input your new password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="New password" />
          </Form.Item>
          {error && <div style={{ color: "red", marginBottom: 16 }}>{error}</div>}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={isLoading}>
              Save new password
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}