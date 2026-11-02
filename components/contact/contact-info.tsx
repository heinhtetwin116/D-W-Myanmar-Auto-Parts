"use client";

import { Card, Typography } from "antd";
import {
  ClockCircleOutlined,
  EnvironmentOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import type { ContactInfoProps } from "@/types/index.type";

const { Text } = Typography;

function toTelLink(number: string) {
  const cleaned = number.trim().replace(/-/g, "");
  return cleaned.startsWith("09") ? `+959${cleaned.slice(2)}` : cleaned;
}

export default function ContactInfo({ labels }: ContactInfoProps) {
  const phoneNumbers = labels.phone
    .split("/")
    .map((number) => number.trim())
    .filter(Boolean);

  const primaryPhone = phoneNumbers[0] ?? "09765006774";
  const secondaryPhone = phoneNumbers[1] ?? "09455096809";

  return (
    <Card
      title={<span className="text-base font-semibold">{labels.title}</span>}
      className="h-full overflow-hidden rounded-xl border border-gray-200 shadow-sm"
      styles={{
        header: { minHeight: 56, paddingInline: 22 },
        body: { padding: 22 },
      }}
    >
      <div className="divide-y divide-gray-100">
        <div className="flex items-start gap-3 py-4 first:pt-0">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#a92920]">
            <EnvironmentOutlined className="text-base" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Address</p>
            <Text className="whitespace-pre-line text-sm leading-6 text-gray-800">{labels.address}</Text>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#a92920]">
            <PhoneOutlined className="text-base" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500">Phone & Viber</p>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <a href={`tel:${toTelLink(primaryPhone)}`} className="text-sm font-semibold text-gray-900 transition-colors hover:text-[#a92920]">
                {primaryPhone}
              </a>
              <a
                href="viber://chat?number=%2B959765006774"
                className="inline-flex items-center rounded-full border border-[#7360F2]/30 bg-[#7360F2]/10 px-3 py-1 text-xs font-medium text-[#6652d9] transition-colors hover:bg-[#7360F2] hover:text-white"
              >
                Chat on Viber
              </a>
            </div>
            <p className="mb-0 mt-2 text-xs text-gray-500">Phone calls only</p>
            <a href={`tel:${toTelLink(secondaryPhone)}`} className="text-sm font-medium text-gray-800 transition-colors hover:text-[#a92920]">
              {secondaryPhone}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#a92920]">
            <MailOutlined className="text-base" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Email</p>
            <a href={`mailto:${labels.email}`} className="break-all text-sm leading-6 text-gray-800 transition-colors hover:text-[#a92920]">
              {labels.email}
            </a>
          </div>
        </div>

        <div className="flex items-start gap-3 py-4 last:pb-0">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-[#a92920]">
            <ClockCircleOutlined className="text-base" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500">Opening hours</p>
            <Text className="text-sm leading-6 text-gray-800">{labels.hours}</Text>
          </div>
        </div>
      </div>
    </Card>
  );
}
