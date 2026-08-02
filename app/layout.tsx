import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/chrome/TopNav";
import { SideRail } from "@/components/chrome/SideRail";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Swadhyaya";
const APP_DESCRIPTION =
  "Learn linear algebra by playing. From a number on a line to SVD, eigen, and PCA — see it, drag it, discover the formula. No memorization, no jargon.";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: `${APP_NAME} — Linear Algebra, Intuition-First`,
    template: `%s · ${APP_NAME}`,
  },
  description: APP_DESCRIPTION,
  applicationName: APP_NAME,
  keywords: [
    "linear algebra",
    "intuition",
    "math",
    "interactive learning",
    "eigenvalues",
    "SVD",
    "PCA",
    "Strang",
    "Sudarshan Iyengar",
  ],
  authors: [{ name: "Mudita Agrawal" }],
  creator: "Mudita Agrawal",
  publisher: APP_NAME,
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: APP_URL,
    siteName: APP_NAME,
    title: `${APP_NAME} — Linear Algebra, Intuition-First`,
    description: APP_DESCRIPTION,
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: `${APP_NAME} — Linear algebra, intuition-first`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_NAME} — Linear Algebra, Intuition-First`,
    description: APP_DESCRIPTION,
    images: ["/og-image.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-canvas text-ink min-h-screen">
        <TopNav />
        <div className="flex">
          <SideRail />
          <main className="flex-1 min-h-[calc(100vh-56px)]">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}