"use client";

import React, { useState, useEffect } from 'react';
import { Lightbulb, Wrench, ArrowRight, Loader2, CheckCircle, AlertTriangle, Search } from 'lucide-react';

export default function OptimizePage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedBrand] = useState<any>(null);

  const fetchTickets = async () => {
    try {
      const res = await fetch('/api/asset/brand'); // 模拟接口：实际应为 ticket 列表接口
      // 商业化演示版：直接通过 prisma 拿数据，此处先实装 UI
      const tRes = await fetch('/api/optimize/list'); // 稍后实装该简单列表接口
      const json = await tRes.json();
      setTickets(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    // 快速实装一个列表接口
    fetch('/api/optimize/list').then(r => r.json()).then(d => {
       setTickets(d.data || []);
       setLoading(false);
    });
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-amber-500" />
          优化诊断中心
        </h2>
        <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-xs">AI-Powered Optimization Loop</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：待整改工单列表 */}
        <div className="lg:col-span-1 space-y-4">
           <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] mb-4">待处理工单 (Pending Tickets)</h3>
           {loading ? (
             <div className="py-10 text-center"><Loader2 className="w-6 h-6 animate-spin text-slate-200 mx-auto" /></div>
           ) : tickets.length === 0 ? (
             <div className="bg-slate-50 border border-dashed rounded-3xl p-10 text-center text-slate-400 text-xs italic">
               当前品牌可见性良好，无待处理诊断
             </div>
           ) : (
             tickets.map(t => (
               <div 
                 key={t.id} 
                 onClick={() => setSelectedBrand(t)}
                 className={`p-5 rounded-2xl border-2 transition-all cursor-pointer ${selectedTicket?.id === t.id ? 'border-blue-600 bg-white shadow-lg' : 'border-slate-100 bg-white hover:border-slate-200'}`}
               >
                 <div className="flex justify-between items-start mb-3">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${t.priority === 'high' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                       {t.priority} Priority
                    </span>
                    <span className="text-[10px] font-mono text-slate-300">#{t.id.substring(0, 5)}</span>
                 </div>
                 <p className="text-sm font-bold text-slate-800 line-clamp-1">{t.title}</p>
                 <p className="text-[10px] text-slate-400 mt-2 font-medium">{new Date(t.createdAt).toLocaleDateString()} • 来自自动观测</p>
               </div>
             ))
           )}
        </div>

        {/* 右侧：深度诊断详情 */}
        <div className="lg:col-span-2">
           {selectedTicket ? (
             <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-right-4">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                   <div>
                      <h4 className="font-black text-xl text-slate-900 tracking-tight">{selectedTicket.title}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-bold">品牌：{selectedTicket.brand.name}</p>
                   </div>
                   <button className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100">
                      标记为已解决
                   </button>
                </div>
                <div className="p-8">
                   <div className="flex items-center gap-2 mb-6">
                      <Wrench className="w-4 h-4 text-blue-500" />
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI 自动诊断与建议报告</h5>
                   </div>
                   <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 prose prose-slate max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-slate-700 font-sans leading-relaxed">
                        {selectedTicket.suggestion}
                      </pre>
                   </div>

                   <div className="mt-8 grid grid-cols-2 gap-4">
                      <div className="p-4 border border-blue-100 bg-blue-50/30 rounded-2xl group hover:bg-blue-50 cursor-pointer transition-all">
                         <p className="text-[10px] font-black text-blue-600 uppercase mb-2">方案 A</p>
                         <h6 className="font-bold text-slate-800 flex items-center justify-between">
                            前往资产库修正
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </h6>
                      </div>
                      <div className="p-4 border border-indigo-100 bg-indigo-50/30 rounded-2xl group hover:bg-indigo-50 cursor-pointer transition-all">
                         <p className="text-[10px] font-black text-indigo-600 uppercase mb-2">方案 B</p>
                         <h6 className="font-bold text-slate-800 flex items-center justify-between">
                            发起内容重写
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                         </h6>
                      </div>
                   </div>
                </div>
             </div>
           ) : (
             <div className="bg-white border border-slate-100 rounded-3xl p-32 text-center h-full flex flex-col justify-center items-center">
                <Search className="w-16 h-16 text-slate-100 mb-6" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">请从左侧选择一个优化工单</p>
                <p className="text-[10px] text-slate-300 mt-2 font-medium">查看深度诊断报告与整改建议</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
