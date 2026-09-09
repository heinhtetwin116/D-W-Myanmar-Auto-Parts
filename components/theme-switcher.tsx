"use client";

import { Button, Dropdown, Space } from "antd";
import { SunOutlined, MoonOutlined, LaptopOutlined } from "@ant-design/icons";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const menuItems = [
    {
      label: (
        <Space>
          <SunOutlined />
          <span>Light</span>
        </Space>
      ),
      key: "light",
      onClick: () => setTheme("light"),
    },
    {
      label: (
        <Space>
          <MoonOutlined />
          <span>Dark</span>
        </Space>
      ),
      key: "dark",
      onClick: () => setTheme("dark"),
    },
    {
      label: (
        <Space>
          <LaptopOutlined />
          <span>System</span>
        </Space>
      ),
      key: "system",
      onClick: () => setTheme("system"),
    },
  ];

  const getIcon = () => {
    if (theme === "light") return <SunOutlined />;
    if (theme === "dark") return <MoonOutlined />;
    return <LaptopOutlined />;
  };

  return (
    <Dropdown
      menu={{
        items: menuItems,
      }}
      placement="bottomRight"
    >
      <Button type="text" size="small" icon={getIcon()} />
    </Dropdown>
  );
};

export { ThemeSwitcher };