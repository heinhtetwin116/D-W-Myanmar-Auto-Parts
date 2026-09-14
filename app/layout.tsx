import { ReactNode } from "react";
import localFont from "next/font/local";
import "@/app/globals.css";

const manrope = localFont({
  src: [
    {
      path: "../public/fonts/manrope/Manrope-ExtraLight.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../public/fonts/manrope/Manrope-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-manrope",
  display: "swap",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={manrope.variable}>
      <body className="font-manrope antialiased flex min-h-screen flex-col">
        {children}
      </body>
    </html>
  );
}
