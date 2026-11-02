"use client";

import { useState } from "react";
import { Button, Card, Form, Input, message } from "antd";
import { createClient } from "@/lib/supabase/client";
import type { ContactFormProps, NewEnquiry } from "@/types/index.type";

export default function ContactForm({ labels }: ContactFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values: NewEnquiry) => {
    const supabase = createClient();
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.from("enquiries").insert({
        name: values.name.trim(),
        email: values.email.trim(),
        phone: values.phone?.trim() || null,
        message: values.message.trim(),
      });
      if (error) throw error;
      setSuccess(true);
      form.resetFields();
      message.success(labels.success);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : labels.error;
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <Card className="shadow-sm">
        <div className="py-8 text-center space-y-4">
          <p className="text-success font-medium text-base">{labels.success}</p>
          <Button type="default" onClick={() => setSuccess(false)}>
            {labels.submit}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
          <Form.Item
            name="name"
            label={labels.name}
            rules={[{ required: true, message: labels.name }]}
          >
            <Input placeholder={labels.name} />
          </Form.Item>
          <Form.Item
            name="email"
            label={labels.email}
            rules={[
              { required: true, message: labels.email },
              { type: "email", message: labels.email },
            ]}
          >
            <Input placeholder={labels.email} type="email" />
          </Form.Item>
        </div>

        <Form.Item name="phone" label={labels.phone}>
          <Input placeholder={labels.phone} type="tel" />
        </Form.Item>

        <Form.Item
          name="message"
          label={labels.message}
          rules={[{ required: true, message: labels.message }]}
        >
          <Input.TextArea placeholder={labels.messagePlaceholder} rows={5} />
        </Form.Item>

        {error && (
          <p role="alert" className="mb-4 text-sm text-destructive">
            {error}
          </p>
        )}

        <Form.Item className="!mb-0">
          <Button
            type="primary"
            htmlType="submit"
            block
            loading={isLoading}
            className="hex-bloom h-10 font-semibold"
          >
            {isLoading ? labels.submitting : labels.submit}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
}
