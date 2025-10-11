// app/layout.tsx
import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://awaazein26.com"),
  title: {
    default: "Awaazein 2026 — F1 Edition",
    template: "%s | Awaazein 2026",
  },
  description:
    "Awaazein is DFW’s premier South Asian a-capella competition — F1 Edition. Join us for a night where voices race to victory.",
  icons: {
    icon: "/awz-logo.png",        // favicon (browser tab)
    shortcut: "/awz-logo.png",
    apple: "/awz-logo.png",       // iOS home screen
  },
  openGraph: {
    type: "website",
    url: "https://awaazein26.com",
    title: "Awaazein 2026 — F1 Edition",
    description:
      "South Asian a-capella like you’ve never seen it — speed, precision, and harmony.",
    siteName: "Awaazein 2026",
    images: [{ url: "/awz-logo.png", width: 1200, height: 1200, alt: "Awaazein" }],
  },
  twitter: {
    card: "summary",
    title: "Awaazein 2026 — F1 Edition",
    description:
      "South Asian a-capella like you’ve never seen it — speed, precision, and harmony.",
    images: ["/awz-logo.png"],
  },
  alternates: {
    canonical: "https://awaazein26.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: "#0F1E33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
