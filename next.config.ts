import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n.ts");

const nextConfig: NextConfig = {
  // cacheComponents: true, // Disabled to allow dynamic routes
};

export default withNextIntl(nextConfig);
