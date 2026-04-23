"use client";

import React, { useState, useEffect } from 'react';
import { Eye, Plus, Send, Loader2, X, AlertCircle, CheckCircle2, ChevronRight, Globe, LayoutList } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ObservePage() {
  const [questions, setQuestions] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runningBrandId, setRunningBrandId] = useState<string | null>(null);
  const [selectedObserveBrandId, setSelectedObserveBrandId] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ brandId: '', text: '', category: '品牌认知' });

  const fetchData = async () => {
    try {
      const [qRes, bRes] = await Promise.all([
        fetch('/api/observe/question'),
        fetch('/api/asset/brand'),
      ]);
      const [qData, bData] = await Promise.all([qRes.json(), bRes.json()]);
      setQuestions(qData.data || []);
      setBrands(bData.data || []);
      if (bData.data?.length > 0) {
        setForm(f => ({ ...f, brandId: bData.data[0].id }));
        setSelectedObserveBrandId(bData.data[0].id);
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/observe/question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    if (res.ok) { setShowModal(false); fetchData(); setForm({ ...form, text: '' }); }
  };

  const runObservation = async (brandId: string) => {
    setRunningBrandId(brandId);
    try {
      const res = await fetch('/api/observe/task', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId })
      });
      const data = await res.json();
      if (data.success) { alert(`完成数据采集！`); fetchData(); }
    } catch (e) { alert('任务启动失败'); } finally { setRunningBrandId(null); }
  };

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-10">
        <div className="max-w-2xl">
          <h2 className="text-2xl font-black text-[#1D1D1B] tracking-tight">问答观测中心</h2>
          <p className="text-[#6B6B66] text-sm mt-1">实时监测主流 AI 搜索引擎对品牌核心问题的反馈深度。</p>
        </div>
        <div className="flex flex-wrap justify-end gap-3">
          <button onClick={() => setShowModal(true)} className="px-5 py-2.5 rounded-xl text-xs font-black uppercase border border-[#E5E5E1] bg-white hover:bg-[#F9F9F8] transition-all flex items-center gap-2">
            <Plus className="w-3.5 h-3.5 text-[#D97757]" />
            配置题库
          </button>
          <div className="flex items-center gap-3">
            <div className="space-y-1">
              <div className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">
                选择品牌
              </div>
              <select
                value={selectedObserveBrandId}
                onChange={(e) => setSelectedObserveBrandId(e.target.value)}
                disabled={brands.length === 0 || !!runningBrandId}
                className="w-[220px] p-2.5 bg-white border border-[#E5E5E1] rounded-xl text-xs font-black outline-none focus:border-[#D97757] transition-all cursor-pointer disabled:bg-slate-50 disabled:text-slate-400"
              >
                {brands.length === 0 && (
                  <option value="">暂无品牌</option>
                )}
                {brands.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled={!selectedObserveBrandId || !!runningBrandId}
              onClick={() => selectedObserveBrandId && runObservation(selectedObserveBrandId)}
              className="claude-button-primary py-2.5 text-xs font-black uppercase flex items-center gap-2"
            >
              {runningBrandId === selectedObserveBrandId ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Globe className="w-3.5 h-3.5 text-orange-400" />
              )}
              观测
            </button>
          </div>
        </div>
      </header>

      {/* 表格：100% 宽度，左右紧凑 */}
      <div className="claude-card overflow-hidden bg-white w-full shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-[#F0EFE9] bg-[#F9F9F8]/50">
              <th className="px-10 py-5 text-[10px] font-black text-[#A1A19A] uppercase tracking-widest">问题详情 (Prompt)</th>
              <th className="px-10 py-5 text-[10px] font-black text-[#A1A19A] uppercase tracking-widest w-[180px]">品牌主体</th>
              <th className="px-10 py-5 text-[10px] font-black text-[#A1A19A] uppercase tracking-widest w-[180px]">可见性状态</th>
              <th className="px-10 py-5 text-[10px] font-black text-[#A1A19A] uppercase tracking-widest w-[220px]">采样时间</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F0EFE9]">
            {questions.length === 0 ? (
              <tr><td colSpan={4} className="px-10 py-24 text-center text-[#A1A19A] font-medium italic">尚未配置任何观测题目</td></tr>
            ) : (
              questions.map(q => (
                <tr key={q.id} className="group hover:bg-[#F9F9F8] transition-all">
                  <td className="px-10 py-7">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-[#F5F5F3] rounded-lg mt-0.5"><LayoutList className="w-4 h-4 text-slate-400" /></div>
                      <div>
                        <p className="text-[15px] font-bold text-[#1D1D1B] leading-relaxed mb-1">{q.text}</p>
                        <span className="text-[9px] font-black text-[#D97757] uppercase tracking-widest bg-orange-50 px-2 py-0.5 rounded border border-orange-100">{q.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    <div className="flex items-center gap-2">
                       <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-[10px] font-black">{q.brand.name[0]}</div>
                       <span className="text-xs font-bold text-[#6B6B66]">{q.brand.name}</span>
                    </div>
                  </td>
                  <td className="px-10 py-7">
                    {q.samples[0] ? (
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        q.samples[0].mentionFlag ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-500 border-red-100"
                      )}>
                        {q.samples[0].mentionFlag ? "Mentioned" : "Missed"}
                      </div>
                    ) : <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Pending</span>}
                  </td>
                  <td className="px-10 py-7">
                     {q.samples[0] ? (
                       <div className="flex items-center gap-4">
                          <p className="text-[11px] font-mono text-[#A1A19A] font-bold">{new Date(q.samples[0].createdAt).toLocaleDateString()} {new Date(q.samples[0].createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</p>
                          <button className="text-[9px] font-black text-[#D97757] uppercase tracking-widest hover:underline transition-all">Details</button>
                       </div>
                     ) : "--"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal - 紧凑版 */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1D1D1B]/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95">
             <div className="p-8 border-b border-[#F0EFE9] flex justify-between items-center bg-[#F9F9F8]">
                <h3 className="font-bold text-lg text-[#1D1D1B]">配置观测题库</h3>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-[#E5E5E1] rounded-full transition-all"><X className="w-5 h-5 text-[#6B6B66]" /></button>
             </div>
             <form onSubmit={handleAddQuestion} className="p-8 space-y-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">目标监测品牌</label>
                   <select required value={form.brandId} onChange={e => setForm({...form, brandId: e.target.value})} className="claude-input py-3.5">
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">观测问题 (Prompt)</label>
                   <textarea required value={form.text} onChange={e => setForm({...form, text: e.target.value})} className="claude-input h-32 resize-none leading-relaxed" placeholder="输入真实的用户提问..." />
                </div>
                <button type="submit" className="claude-button-primary w-full py-4 text-xs font-black uppercase tracking-widest border border-slate-900 shadow-none mt-4">
                   确认接入观测任务流
                </button>
             </form>
          </div>
        </div>
      )}
    </div>
  );
}
