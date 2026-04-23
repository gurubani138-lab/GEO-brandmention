"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, Send, Loader2, CheckCircle2, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ContentPage() {
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrandId, setSelectedBrandId] = useState('');
  const [inputText, setInputText] = useState('');
  const [contentType, setContentType] = useState('品牌介绍 (GEO 优化版)');
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    fetch('/api/asset/brand').then(r => r.json()).then(data => {
      setBrands(data.data || []);
      if (data.data?.length > 0) setSelectedBrandId(data.data[0].id);
    });
  }, []);

  const handleGenerate = async () => {
    if (brands.length === 0 || !inputText.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId: selectedBrandId, contentType, inputText, channel: selectedChannel }),
      });
      const data = await response.json();
      if (data.success) setResult(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <header className="mb-12">
        <h2 className="text-[32px] font-semibold text-[#1D1D1B] tracking-tight flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-[#D97757]" />
          智能改写引擎
        </h2>
        <p className="text-[#6B6B66] font-medium mt-2">基于实时品牌资产库，将素材一键转化为符合 AI 收录逻辑的结构化内容。</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 space-y-10">
          {/* Main Form */}
          <section className="claude-card p-10 bg-white shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <ClaudeSelect label="品牌主体" value={selectedBrandId} onChange={setSelectedBrandId} options={brands.map(b => ({ label: b.name, value: b.id }))} />
              <ClaudeSelect label="内容类型" value={contentType} onChange={setContentType} options={[{ label: 'GEO 优化版介绍', value: '品牌介绍 (GEO 优化版)' }, { label: '产品对比稿', value: '产品对比稿' }]} />
              <ClaudeSelect
                label="目标渠道"
                value={selectedChannel}
                onChange={setSelectedChannel}
                options={[
                  { label: '通用标准', value: 'general' },
                  { label: '小红书', value: 'xiaohongshu' },
                  { label: '知乎', value: 'zhihu' },
                  { label: '微信公众号', value: 'wechat' },
                  { label: '百家号', value: 'baijiahao' },
                  { label: '百度百科', value: 'baidubaike' },
                  { label: '今日头条', value: 'toutiao' },
                  { label: '新浪', value: 'sina' },
                  { label: '搜狐', value: 'sohu' },
                  { label: '网易', value: 'wangyi' },
                  { label: '腾讯新闻', value: 'tencentnews' },
                  { label: '抖音', value: 'douyin' },
                ]}
              />
            </div>

            <div className="space-y-4 mb-8">
              <label className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">原始输入文案</label>
              <textarea 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="在此粘贴或输入需要 GEO 改写的内容..." 
                className="claude-input min-h-[300px] resize-none text-[16px] leading-relaxed font-medium"
              />
            </div>

            <button 
              onClick={handleGenerate}
              disabled={loading || !inputText.trim()}
              className="claude-button-primary w-full flex items-center justify-center gap-3 py-4 text-sm font-bold uppercase tracking-[0.1em] border border-slate-900 shadow-none disabled:bg-slate-100 disabled:text-slate-400"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-4 h-4" />}
              {loading ? '正在执行算法优化...' : '执行 GEO 改写'}
            </button>
          </section>

          {/* Result Area */}
          {result && (
            <section className="animate-in slide-in-from-bottom-8 duration-500">
               <div className="claude-card p-10 bg-[#F9F9F8] border-[#D97757]/20">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-xl font-semibold text-[#1D1D1B] flex items-center gap-2.5">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      优化建议稿已就绪
                    </h3>
                    <button className="px-5 py-2 bg-white border border-[#E5E5E1] rounded-xl text-xs font-bold text-[#6B6B66] uppercase tracking-widest hover:border-[#D97757] transition-all">复制内容</button>
                  </div>
                  <div className="bg-white p-8 rounded-2xl border border-[#E5E5E1] shadow-sm prose prose-slate max-w-none">
                    <pre className="text-[15px] text-[#1D1D1B] whitespace-pre-wrap font-sans leading-[1.8]">
                      {result.outputText}
                    </pre>
                  </div>
               </div>
            </section>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
           <div className="claude-card p-6 bg-[#F0EFE9] border-0">
              <h4 className="text-[11px] font-bold text-[#6B6B66] uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                 <Layout className="w-4 h-4" />
                 优化约束清单
              </h4>
              <div className="space-y-6">
                 <ConstraintItem label="术语一致性" count={12} />
                 <ConstraintItem label="事实一致性" count={1} warning />
                 <ConstraintItem label="广告法合规" count="Safe" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function ClaudeSelect({ label, value, onChange, options }: any) {
  return (
    <div className="space-y-2.5">
      <label className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest ml-1">{label}</label>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-3 bg-white border border-[#E5E5E1] rounded-xl text-sm font-semibold outline-none focus:border-[#D97757] transition-all cursor-pointer">
        {options.map((o: any) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

function ConstraintItem({ label, count, warning }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-[#6B6B66] font-medium">{label}</span>
      <span className={cn("text-[11px] font-bold px-2 py-0.5 rounded-md", warning ? "bg-red-100 text-red-700" : "bg-white text-[#1D1D1B]")}>
        {count}
      </span>
    </div>
  );
}
