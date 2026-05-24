import type { Metadata } from "next";
import "./globals.css";
import MainProvider from "@/components/MainProvider";

export const metadata: Metadata = {
  title: "Ecommerce App",
  description: "Modern ecommerce app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <MainProvider>{children}</MainProvider>
      </body>
    </html>
  );
}