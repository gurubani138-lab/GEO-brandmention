import { prisma } from '@/lib/prisma';
import { LineChart, AlertCircle, Users, Plus, MessageSquareText, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

async function getStats() {
  try {
    const [brandCount, taskCount, sampleCount] = await Promise.all([
      prisma.brand.count(),
      prisma.contentTask.count(),
      prisma.observationSample.count(),
    ]);
    const mentionCount = await prisma.observationSample.count({ where: { mentionFlag: true } });
    const mentionRate = sampleCount > 0 ? (mentionCount / sampleCount) * 100 : 0;
    return { brandCount, taskCount, sampleCount, mentionRate: mentionRate.toFixed(1) };
  } catch (e) {
    return { brandCount: 0, taskCount: 0, sampleCount: 0, mentionRate: "0.0" };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <div className="space-y-10">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-[#1D1D1B] tracking-tight">运营概览</h2>
          <p className="text-[#6B6B66] text-sm mt-1">Brand Intelligence Dashboard</p>
        </div>
        <Link href="/assets" className="claude-button-primary">
          <Plus className="w-4 h-4" />
          新增品牌资产
        </Link>
      </header>

      {/* 4列紧凑指标 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <ClaudeStatCard title="监测品牌" value={stats.brandCount} sub="活跃品牌主体" />
        <ClaudeStatCard title="平均可见性" value={`${stats.mentionRate}%`} sub="全平台提及率" highlight />
        <ClaudeStatCard title="待优化点" value={2} sub="高优先级任务" warning />
        <ClaudeStatCard title="已存样本" value={stats.sampleCount} sub="全域采样数据" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="claude-card p-8 bg-white h-full">
            <h3 className="text-sm font-bold text-[#1D1D1B] mb-8 uppercase tracking-widest flex items-center gap-2">
              <LineChart className="w-4 h-4 text-[#D97757]" />
              实时可见性趋势
            </h3>
            <div className="h-64 bg-[#F9F9F8] rounded-2xl border border-dashed border-[#E5E5E1] flex flex-col items-center justify-center text-[#A1A19A] space-y-2">
              <p className="font-medium">图表引擎准备中</p>
              <p className="text-[10px] uppercase">Real-time Data Streaming</p>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
           <div className="claude-card p-8 bg-[#1D1D1B] text-white border-0">
              <MessageSquareText className="w-6 h-6 text-[#D97757] mb-8" />
              <h4 className="text-lg font-bold mb-3">AI 诊断建议</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-10 font-medium">
                当前“京东云”在微信平台的内容可理解性分值为 72，建议增加结构化产品参数表。
              </p>
              <Link href="/optimize" className="block w-full py-3.5 bg-white/10 hover:bg-white/20 text-center rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/5">
                立即优化
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}

function ClaudeStatCard({ title, value, sub, highlight, warning }: any) {
  return (
    <div className="claude-card p-6 bg-white flex flex-col justify-between min-h-[140px]">
      <p className="text-[#A1A19A] text-[10px] font-black uppercase tracking-[0.1em] mb-4">{title}</p>
      <div>
        <div className="flex items-baseline gap-2">
          <h4 className="text-3xl font-bold text-[#1D1D1B] tracking-tighter">{value}</h4>
          {highlight && <span className="text-emerald-600 text-[10px] font-bold">+2.4%</span>}
        </div>
        <p className={cn("text-[11px] mt-2 font-medium", warning ? "text-red-500" : "text-[#6B6B66]")}>{sub}</p>
      </div>
    </div>
  );
}
