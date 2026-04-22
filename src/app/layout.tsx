import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: "BrandMention GEO 智能体",
  description: "品牌 AI 可见性运营平台",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`antialiased bg-[#F9F9F8] text-[#1D1D1B]`}>
        <Providers>
          <div className="flex h-screen overflow-hidden">
            <Sidebar />
            {/* 边距从 150px 缩小至 75px，内容区横向伸展，更贴合大屏排版 */}
            <main className="flex-1 ml-60 h-screen overflow-y-auto overflow-x-hidden">
              <div className="w-full px-[75px] py-10">
                {children}
              </div>
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
