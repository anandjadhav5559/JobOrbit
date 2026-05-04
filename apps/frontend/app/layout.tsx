import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | JobOrbit",
    default: "JobOrbit — Explore. Apply. Grow.",
  },
  description:
    "JobOrbit is a modern professional networking platform for discovering opportunities, connecting with professionals, and growing your career.",
  keywords: ["jobs", "networking", "career", "professional", "hiring"],
  openGraph: {
    siteName: "JobOrbit",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-bg-primary text-text-primary antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
