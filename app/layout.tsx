import type { Metadata } from "next";
import "./globals.css";
import { TopNav } from "@/components/chrome/TopNav";
import { SideRail } from "@/components/chrome/SideRail";

export const metadata: Metadata = {
  title: "Swadhyaya — Linear Algebra, Intuition-First",
  description:
    "Learn linear algebra by playing. From a number on a line to SVD, eigen, and PCA — see it, drag it, discover the formula. No memorization, no jargon.",
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
