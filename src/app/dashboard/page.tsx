"use client";

import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Target, 
  ShieldAlert, 
  ExternalLink,
  Download,
  Loader2,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [selectedBrand, setSelectedBrand] = useState('all');

  const fetchMetrics = async () => {
    setLoading(true);
    try {
      const url = selectedBrand === 'all' ? '/api/dashboard/metrics' : `/api/dashboard/metrics?brandId=${selectedBrand}`;
      const res = await fetch(url);
      const json = await res.json();
      setData(json.data);
      
      const bRes = await fetch('/api/asset/brand');
      const bJson = await bRes.json();
      setBrands(bJson.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMetrics(); }, [selectedBrand]);

  if (loading) return <div className="flex justify-center py-40"><Loader2 className="w-10 h-10 animate-spin text-[#D97757]" /></div>;

  return (
    <div className="w-full">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-[32px] font-semibold text-[#1D1D1B] tracking-tight">可见性分析</h2>
            <p className="text-[#6B6B66] font-medium mt-2 text-sm uppercase tracking-widest">Brand Authority Benchmark</p>
          </div>
          <div className="flex gap-4">
            <select 
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="bg-white border border-[#E5E5E1] px-5 py-2.5 rounded-xl text-sm font-semibold outline-none focus:border-[#D97757] transition-all"
            >
              <option value="all">全域品牌汇总</option>
              {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <a 
              href="/api/report/export"
              className="claude-button-primary flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              导出报表
            </a>
          </div>
        </header>

        {!data ? (
          <div className="claude-card p-32 text-center border-dashed bg-white">
             <AlertCircle className="w-12 h-12 text-[#E5E5E1] mx-auto mb-4" />
             <p className="text-[#A1A19A] font-semibold">尚未产生观测样本，请先发起任务。</p>
          </div>
        ) : (
          <div className="space-y-10">
            {/* 指标矩阵 */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               <ClaudeMetricCard title="总体提及率" value={`${data.summary.mentionRate}%`} icon={Target} description="AI搜索引擎索引占比" />
               <ClaudeMetricCard title="首提占比" value={`${data.summary.firstMentionRate}%`} icon={TrendingUp} description="排名第一的概率" />
               <ClaudeMetricCard title="事实一致率" value={`${data.summary.consistencyRate}%`} icon={ShieldAlert} description="信息准确度评分" />
               <ClaudeMetricCard title="异常回复率" value={`${data.summary.errorRate}%`} icon={AlertCircle} description="需干预的风险点" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               <div className="lg:col-span-2 claude-card p-10 bg-white">
                  <h3 className="text-lg font-semibold text-[#1D1D1B] mb-10 flex justify-between items-center">
                     多平台可见性分级
                     <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-[0.2em]">Platform Sync</span>
                  </h3>
                  <div className="space-y-10">
                     {data.platformData.map((p: any) => (
                       <div key={p.name} className="group">
                          <div className="flex justify-between mb-3 items-end">
                             <span className="text-[15px] font-semibold text-[#1D1D1B]">{p.name}</span>
                             <span className="text-xs font-mono font-bold text-[#D97757]">{p.rate.toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-[#F5F5F3] rounded-full h-2 overflow-hidden border border-[#E5E5E1]">
                             <div 
                               className="h-full bg-[#1D1D1B] rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(0,0,0,0.1)]"
                               style={{ width: `${p.rate}%` }}
                             />
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="claude-card p-10 bg-[#1D1D1B] text-white border-0 shadow-2xl">
                  <h3 className="font-bold text-[#D97757] mb-8 text-[11px] uppercase tracking-[0.2em] flex items-center gap-2">
                     亟需优化漏洞
                  </h3>
                  <div className="space-y-6">
                     {data.recentIssues.map((issue: any) => (
                       <div key={issue.id} className="group cursor-pointer">
                          <p className="text-[14px] font-medium text-slate-200 line-clamp-2 leading-relaxed group-hover:text-white transition-colors">{issue.question}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <span className="text-[9px] font-bold px-2 py-0.5 bg-white/10 text-slate-400 rounded uppercase tracking-widest">{issue.platform}</span>
                            <ChevronRight className="w-3 h-3 text-slate-600 group-hover:translate-x-1 transition-transform" />
                          </div>
                       </div>
                     ))}
                  </div>
                  <button className="w-full mt-10 py-4 bg-white/10 hover:bg-white/20 border border-white/5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all">
                     进入全域优化流
                  </button>
               </div>
            </div>
          </div>
        )}
    </div>
  );
}

function ClaudeMetricCard({ title, value, icon: Icon, description }: any) {
  return (
    <div className="claude-card p-8 bg-white">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-[#F9F9F8] border border-[#E5E5E1]">
        <Icon className="w-5 h-5 text-[#D97757]" />
      </div>
      <p className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest mb-1">{title}</p>
      <h4 className="text-3xl font-semibold text-[#1D1D1B] tracking-tight">{value}</h4>
      <p className="text-[11px] text-[#6B6B66] mt-4 font-medium italic border-t border-[#F0EFE9] pt-4">{description}</p>
    </div>
  );
}
