"use client";

import React from 'react';
import { Settings, Cpu, Globe, Bell, Lock, Database } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          系统全局配置
        </h2>
        <p className="text-slate-500 font-medium mt-2 text-sm uppercase tracking-widest">Global System Administration</p>
      </header>

      <div className="space-y-8">
        {/* 模型配置 */}
        <section className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-50 rounded-2xl"><Cpu className="text-blue-600 w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">AI 引擎调度</h3>
                <p className="text-xs text-slate-400 font-medium">配置 GEO 生成与标注的核心模型供应商</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">当前生成模型</label>
                <select className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold">
                  <option>Kimi (Moonshot-v1-8k)</option>
                  <option>DeepSeek-V2</option>
                  <option>GPT-4o (Global)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider">自动标注模型</label>
                <select className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-sm font-bold">
                  <option>Kimi ( Moonshot-v1-32k)</option>
                  <option>文心一言 4.0</option>
                </select>
              </div>
           </div>
        </section>

        {/* 观测策略 */}
        <section className="bg-white border-2 border-slate-100 rounded-3xl p-8 shadow-sm">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-50 rounded-2xl"><Globe className="text-indigo-600 w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-slate-800 text-lg">全自动观测策略</h3>
                <p className="text-xs text-slate-400 font-medium">设置 AI 搜索引擎的自动采样频率</p>
              </div>
           </div>
           <div className="space-y-6">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-bold text-slate-700">自动观测周期</span>
                 <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-slate-200">每天</button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold border-0 shadow-lg shadow-indigo-200">每周</button>
                    <button className="px-4 py-2 bg-white rounded-xl text-xs font-bold border border-slate-200">手动</button>
                 </div>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                 <span className="text-sm font-bold text-slate-700">启用真实快照截图</span>
                 <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 shadow-inner shadow-emerald-700/20 cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
              </div>
           </div>
        </section>

        {/* 数据库状态 */}
        <section className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-800 rounded-2xl"><Database className="text-blue-400 w-6 h-6" /></div>
              <div>
                <h3 className="font-bold text-white text-lg tracking-tight">存储与租户状态</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Multi-tenant Infrastructure</p>
              </div>
           </div>
           <div className="grid grid-cols-3 gap-6 relative z-10">
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">数据库类型</p>
                 <p className="font-mono text-sm font-bold text-blue-400">PostgreSQL (Prod)</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">当前租户数</p>
                 <p className="font-mono text-sm font-bold text-blue-400">12 Organizations</p>
              </div>
              <div className="text-center">
                 <p className="text-[10px] font-black text-slate-500 uppercase mb-1">OSS 空间占用</p>
                 <p className="font-mono text-sm font-bold text-blue-400">1.2 GB</p>
              </div>
           </div>
           <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-600/5 rounded-full blur-3xl"></div>
        </section>
      </div>
    </div>
  );
}
