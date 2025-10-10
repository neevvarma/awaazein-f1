// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

const title = "Awaazein 2026 — F1 Edition";
const description =
  "DFW’s premier South Asian a-capella competition. Feb 21, 2026 — Irving, TX.";

export const metadata: Metadata = {
  metadataBase: new URL("https://awaazein26.com"),
  title,
  description,
  alternates: { canonical: "https://awaazein26.com" },
  openGraph: {
    type: "website",
    url: "https://awaazein26.com",
    title,
    description,
    siteName: "Awaazein 2026",
    images: [{ url: "/awz-logo.png", width: 1200, height: 630, alt: "Awaazein" }],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/awz-logo.png"],
  },
  robots: { index: true, follow: true },
  icons: [{ rel: "icon", url: "/awz-logo.png" }],
  themeColor: "#0F1E33",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
