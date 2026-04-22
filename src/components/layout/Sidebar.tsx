"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from "next-auth/react";
import { 
  Layout, 
  Database, 
  PenTool, 
  Eye, 
  BarChart2, 
  Settings,
  ShieldCheck,
  ChevronRight,
  Lightbulb,
  LogOut,
  Sparkles,
  MessageSquarePlus
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: '运营看板', href: '/', icon: Layout },
  { name: '资产管理', href: '/assets', icon: Database },
  { name: '内容生产', href: '/content', icon: MessageSquarePlus },
  { name: '观测中心', href: '/observe', icon: Eye },
  { name: '可见性分析', href: '/dashboard', icon: BarChart2 },
  { name: '内容审核', href: '/review', icon: ShieldCheck },
  { name: '优化建议', href: '/optimize', icon: Lightbulb },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="w-60 border-r border-[#E5E5E1] bg-white h-screen flex flex-col fixed left-0 top-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* Brand Header */}
      <div className="p-8 pb-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-[#1D1D1B] rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-[#1D1D1B]">BrandMention</h1>
            <p className="text-[9px] font-bold text-[#D97757] uppercase tracking-[0.2em]">Geo Agent Pro</p>
          </div>
        </Link>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "claude-nav-link group",
                isActive 
                  ? "bg-[#F0EFE9] text-[#1D1D1B]" 
                  : "text-[#6B6B66] hover:bg-[#F5F5F3] hover:text-[#1D1D1B]"
              )}
            >
              <item.icon className={cn("w-4.5 h-4.5 transition-colors", isActive ? "text-[#D97757]" : "text-[#A1A19A] group-hover:text-[#6B6B66]")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer / User Profile */}
      <div className="p-6 border-t border-[#F0EFE9]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#D97757] font-bold text-xs">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1D1D1B] truncate">{session?.user?.name || '管理员'}</p>
              <p className="text-[10px] text-[#A1A19A] font-medium uppercase tracking-tighter">Enterprise Plan</p>
            </div>
          </div>
          <button 
            onClick={() => signOut()}
            className="p-1.5 hover:bg-[#F5F5F3] rounded-lg text-[#A1A19A] hover:text-red-500 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
