"use client";

import React, { useState, useEffect } from 'react';
import { Plus, Search, Loader2, Database, ChevronRight, Layout, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AssetsPage() {
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', industry: '', positioning: '', coreValues: '' });

  const fetchBrands = async () => {
    try {
      const res = await fetch('/api/asset/brand');
      const data = await res.json();
      setBrands(data.data || []);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  useEffect(() => { fetchBrands(); }, []);

  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/asset/brand', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) { setShowModal(false); fetchBrands(); setForm({ name: '', industry: '', positioning: '', coreValues: '' }); }
    } catch (e) { alert('添加失败'); }
  };

  return (
    <div className="w-full">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1B]">资产管理</h2>
          <p className="text-[#6B6B66] text-sm mt-1">Brand Assets & Knowledge Base</p>
        </div>
        <button onClick={() => setShowModal(true)} className="claude-button-primary scale-90 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          新增品牌
        </button>
      </header>

      <div className="flex gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#A1A19A]" />
          <input type="text" placeholder="快速筛选..." className="claude-input pl-11 py-2" />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-24"><Loader2 className="animate-spin text-[#D97757] w-8 h-8" /></div>
      ) : brands.length === 0 ? (
        <div className="claude-card p-24 text-center border-dashed bg-white">
          <Database className="w-12 h-12 text-[#E5E5E1] mx-auto mb-4" />
          <p className="text-xs text-[#A1A19A] font-bold uppercase tracking-widest">尚未接入任何品牌资产</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {brands.map((brand) => (
            <div key={brand.id} className="claude-card p-6 flex flex-col justify-between bg-white hover:border-[#D97757]/30 transition-all cursor-pointer">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F5F5F3] flex items-center justify-center text-[#1D1D1B] font-black text-sm border border-[#E5E5E1]">
                    {brand.name.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#1D1D1B] text-base">{brand.name}</h3>
                    <p className="text-[10px] text-[#A1A19A] font-black uppercase tracking-widest">{brand.industry}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#A1A19A]" />
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#F0EFE9]">
                 <StatItem label="产品" value={brand._count?.products || 0} />
                 <StatItem label="术语" value={brand._count?.terms || 0} />
                 <StatItem label="健康度" value="82%" highlight />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal 部分保持一致风格 */}
      {showModal && (
        <div className="fixed inset-0 bg-[#1D1D1B]/40 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl border border-[#E5E5E1] shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-[#F0EFE9] flex justify-between items-center bg-[#F9F9F8]">
              <h3 className="font-bold text-base text-[#1D1D1B]">接入品牌资产</h3>
              <Plus onClick={() => setShowModal(false)} className="w-5 h-5 text-[#A1A19A] cursor-pointer rotate-45" />
            </div>
            <form onSubmit={handleAddBrand} className="p-6 space-y-5">
              <div className="space-y-1.5"><label className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">品牌名</label><input required value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="claude-input py-2" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">所属行业</label><input required value={form.industry} onChange={e => setForm({...form, industry: e.target.value})} className="claude-input py-2" /></div>
              <div className="space-y-1.5"><label className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest ml-1">定位描述</label><textarea value={form.positioning} onChange={e => setForm({...form, positioning: e.target.value})} className="claude-input h-20 resize-none py-2" /></div>
              <button type="submit" className="claude-button-primary w-full py-3.5 text-xs font-black uppercase tracking-widest">立即初始化</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function StatItem({ label, value, highlight }: any) {
  return (
    <div>
      <p className="text-[9px] font-black text-[#A1A19A] uppercase tracking-widest mb-0.5">{label}</p>
      <p className={cn("text-sm font-bold", highlight ? "text-[#D97757]" : "text-[#1D1D1B]")}>{value}</p>
    </div>
  );
}
