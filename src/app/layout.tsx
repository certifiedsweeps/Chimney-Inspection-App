import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Chimney Inspection Pro",
  description: "Professional chimney inspection reports — NFPA 211 compliant",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="h-full flex bg-[#f8f7f4]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto min-h-screen">{children}</main>
      </body>
    </html>
  );
}
