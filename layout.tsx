import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Vital Dental Lab - نظام إدارة المعمل السني السحابي | تطوير دكتور عقلان الكامل",
  description: "نظام سحابي متكامل ومتطور لإدارة معامل الأسنان - Vital Dental Lab Cloud System v4.0 - تصميم وتطوير دكتور عقلان الكامل",
  version: "4.0.0",
  authors: [{ name: "دكتور عقلان الكامل" }],
  keywords: "معمل أسنان, إدارة معمل سني, نظام سحابي, Vital Dental Lab, دكتور عقلان الكامل",
  manifest: "/manifest.json",
  themeColor: "#7C3AED",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vital Dental Lab",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800&family=Tajawal:wght@300;400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/lab-logo.png" sizes="32x32" />
        <link rel="icon" type="image/png" href="/lab-logo.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/lab-logo.png" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="theme-color" content="#7C3AED" />
        <meta name="application-name" content="Vital Dental Lab" />
        <meta name="apple-mobile-web-app-title" content="Vital Lab" />
      </head>
      <body
        className="antialiased"
        style={{ fontFamily: "'Tajawal', sans-serif" }}
        suppressHydrationWarning
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
