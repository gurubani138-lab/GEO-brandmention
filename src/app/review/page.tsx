"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Check, X, Loader2, FileText, LayoutPanelTop } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/review');
      const data = await res.json();
      setTasks(data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleAction = async (taskId: string, action: 'approve' | 'reject') => {
    setProcessing(taskId);
    try {
      await fetch('/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, action })
      });
      fetchTasks();
    } catch (e) {
      alert('操作失败');
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-12">
        <h2 className="text-[32px] font-semibold text-[#1D1D1B] tracking-tight">内容审核中心</h2>
        <p className="text-[#6B6B66] font-medium mt-2">确保每一条 AI 生成的文案均符合广告法合规与品牌调性要求。</p>
      </header>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#D97757] w-8 h-8" /></div>
      ) : tasks.length === 0 ? (
        <div className="claude-card p-32 text-center border-dashed bg-white">
          <ShieldCheck className="w-12 h-12 text-[#E5E5E1] mx-auto mb-4" />
          <p className="text-[#A1A19A] font-semibold">暂无待审核文案。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {tasks.map((task) => (
            <div key={task.id} className="claude-card p-10 bg-white group">
              <div className="flex justify-between items-center mb-10 pb-6 border-b border-[#F0EFE9]">
                <div className="flex items-center gap-4">
                   <span className="text-[10px] font-bold px-3 py-1 bg-[#F5F5F3] text-[#6B6B66] rounded-md uppercase tracking-[0.1em] border border-[#E5E5E1]">
                     {task.contentType}
                   </span>
                   <h3 className="text-lg font-semibold text-[#1D1D1B]">{task.brand.name}</h3>
                </div>
                <p className="text-[11px] font-mono text-[#A1A19A]">{new Date(task.createdAt).toLocaleString()}</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5" /> 原始内容录入
                  </h4>
                  <div className="p-8 bg-[#F9F9F8] rounded-[20px] text-[14px] text-[#6B6B66] leading-[1.8] border border-[#F0EFE9] h-[320px] overflow-y-auto">
                    {task.inputText}
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="text-[11px] font-bold text-[#D97757] uppercase tracking-widest flex items-center gap-2">
                    <LayoutPanelTop className="w-3.5 h-3.5" /> AI 优化预览
                  </h4>
                  <div className="p-8 bg-white rounded-[20px] text-[15px] text-[#1D1D1B] leading-[1.8] border border-[#D97757]/20 shadow-[0_0_20px_rgba(217,119,87,0.03)] h-[320px] overflow-y-auto font-medium">
                    {task.outputText}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex justify-end gap-5">
                 <button 
                   disabled={!!processing}
                   onClick={() => handleAction(task.id, 'reject')}
                   className="px-8 py-3 rounded-xl text-sm font-bold text-[#6B6B66] hover:bg-red-50 hover:text-red-600 transition-all border border-transparent"
                 >
                   <X className="w-4 h-4 inline-block mr-2" />
                   打回修正
                 </button>
                 <button 
                   disabled={!!processing}
                   onClick={() => handleAction(task.id, 'approve')}
                   className="claude-button-primary px-10 border border-slate-900 shadow-none"
                 >
                   {processing === task.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 inline-block mr-2" />}
                   批准分发
                 </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
