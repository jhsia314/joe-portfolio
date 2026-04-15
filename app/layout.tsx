import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from '@vercel/analytics/next';
import Providers from './providers'

const satoshi = localFont({
  src: [
    { path: "../public/fonts/satoshi-300.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/satoshi-700.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/satoshi-900.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Joe Hsia, Design Leader",
  description:
    "22 years building products and design organizations at Google, Meta, Yahoo, and enterprise SaaS. Currently VP of Product Design at Safe Security.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${satoshi.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Blocking script: apply saved theme before first paint to avoid flash */}
        <script dangerouslySetInnerHTML={{ __html: `
          try {
            var t = localStorage.getItem('theme');
            if (t) document.documentElement.setAttribute('data-theme', t);
          } catch(e) {}
        `}} />
      </head>
     <body className="min-h-full flex flex-col">
  <Providers>
    {children}
  </Providers>
  <Analytics />
</body>
    </html>
  );
}
