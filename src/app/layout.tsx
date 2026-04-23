import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
        <body className="h-full flex bg-[#f8f7f4]">
          <Sidebar />
          {/* pt-14 on mobile to clear the fixed top bar; no padding on md+ */}
          <main className="flex-1 overflow-y-auto min-h-screen pt-14 md:pt-0">
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
