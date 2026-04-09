import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DevVault | The Developer Hub",
  description: "Store your favorite coding resources, build stunning case studies, and showcase your projects to the community.",
  verification: {
    google: "1-Y04mOCMJnbd6GrFG1LcyulSc_L9hi1l1zUNrfMQPc",
  },
  openGraph: {
    title: "DevVault | The Developer Hub",
    description: "Store your favorite coding resources, build stunning case studies, and showcase your projects to the community.",
    url: "https://devvault.com", // You should replace this with the actual prod URL eventually
    siteName: "DevVault",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DevVault | The Developer Hub",
    description: "Store your favorite coding resources, build stunning case studies, and showcase your projects to the community.",
  },
};

import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { CookieBanner } from "@/components/ui/CookieBanner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="data-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <CookieBanner />
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
