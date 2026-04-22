"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Database, 
  PenTool, 
  Eye, 
  BarChart3, 
  Settings,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: '工作台', href: '/', icon: LayoutDashboard },
  { name: '资产中心', href: '/assets', icon: Database },
  { name: '内容生产', href: '/content', icon: PenTool },
  { name: '问答观测', href: '/observe', icon: Eye },
  { name: '可见性看板', href: '/dashboard', icon: BarChart3 },
  { name: '审核中心', href: '/review', icon: ShieldCheck },
  { name: '系统设置', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 border-r bg-slate-50/50 h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          GEO 智能体
        </h1>
        <p className="text-xs text-slate-400 mt-1">Brand AI Visibility Cloud</p>
      </div>
      
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive 
                  ? "bg-white text-blue-600 shadow-sm border border-slate-200" 
                  : "text-slate-600 hover:bg-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")} />
                {item.name}
              </div>
              {isActive && <ChevronRight className="w-3 h-3 text-blue-400" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-900 truncate">京东云官方账号</p>
            <p className="text-[10px] text-slate-500 truncate">专业版 | 5 品牌</p>
          </div>
        </div>
      </div>
    </div>
  );
}
