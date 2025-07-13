import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClientLayout } from "../components/ClientLayout";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Health Management System",
  description: "Manage patients, medications, and treatment assignments",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body 
        className="antialiased min-h-screen bg-gray-50" 
        suppressHydrationWarning={true}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
