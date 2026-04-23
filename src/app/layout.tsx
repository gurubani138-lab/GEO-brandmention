"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "@/components/layout/Providers";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <html lang="zh-CN">
      <body className={`antialiased bg-[#F9F9F8] text-[#1D1D1B]`}>
        <Providers>
          <div className="flex min-h-screen">
            {!isLandingPage && <Sidebar />}
            <main className={`flex-1 ${!isLandingPage ? 'ml-60' : ''} min-w-0`}>
              <div className={isLandingPage ? "" : "w-full px-[75px] py-10"}>
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
