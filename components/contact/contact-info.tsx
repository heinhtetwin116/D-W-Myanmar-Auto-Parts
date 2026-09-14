"use client";

import { Card, Typography } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { ContactInfoProps } from "@/types/index.type";

const { Title, Text } = Typography;

export default function ContactInfo({ labels }: ContactInfoProps) {
  const rows = [
    { icon: <EnvironmentOutlined />, content: labels.address },
    {
      icon: <PhoneOutlined />,
      content: <a href={`tel:${labels.phone}`}>{labels.phone}</a>,
    },
    {
      icon: <MailOutlined />,
      content: <a href={`mailto:${labels.email}`}>{labels.email}</a>,
    },
    { icon: <ClockCircleOutlined />, content: labels.hours },
  ];

  return (
    <Card title={labels.title} className="h-full">
      <ul className="space-y-4">
        {rows.map((row, index) => (
          <li key={index} className="flex items-start gap-3">
            <Text type="secondary" className="mt-0.5 text-base text-accent">
              {row.icon}
            </Text>
            <Text>{row.content}</Text>
          </li>
        ))}
      </ul>
      <Title level={5} className="!mt-6 !mb-0">
        D&W Myanmar Auto Parts
      </Title>
    </Card>
  );
}
