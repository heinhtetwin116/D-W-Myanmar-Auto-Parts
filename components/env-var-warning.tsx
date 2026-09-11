import { Badge, Button, Space } from "antd";

export function EnvVarWarning() {
  return (
    <Space>
      <Badge status="warning" text="Supabase environment variables required" />
      <Space>
        <Button size="small" disabled>
          Sign in
        </Button>
        <Button type="primary" size="small" disabled>
          Sign up
        </Button>
      </Space>
    </Space>
  );
}
