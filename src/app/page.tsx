import { prisma } from '@/lib/prisma';
import { Activity, AlertTriangle, BarChart, CheckCircle2, Clock, TrendingUp } from 'lucide-react';

async function getStats() {
  try {
    const brandCount = await prisma.brand.count();
    const sampleCount = await prisma.observationSample.count();
    const mentionCount = await prisma.observationSample.count({ where: { mentionFlag: true } });
    const errorCount = await prisma.observationSample.count({ where: { errorFlag: true } });
    const mentionRate = sampleCount > 0 ? (mentionCount / sampleCount) * 100 : 0;
    return { brandCount, sampleCount, mentionRate: mentionRate.toFixed(1), errorCount };
  } catch (e) {
    return { brandCount: 0, sampleCount: 0, mentionRate: "0.0", errorCount: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();
  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">品牌 AI 可见性概览</h2>
        <p className="text-slate-500 text-sm mt-1">实时监测品牌在中国大陆主流生成式产品中的表现</p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="监测品牌" value={stats.brandCount} icon={Activity} trend="+1 本周" color="blue" />
        <StatCard title="平均提及率" value={`${stats.mentionRate}%`} icon={TrendingUp} trend="+2.4% vs 上月" color="green" />
        <StatCard title="异常回复" value={stats.errorCount} icon={AlertTriangle} trend="-2 本周" color="orange" />
        <StatCard title="已完成观测" value={stats.sampleCount} icon={CheckCircle2} trend="共 32 题库" color="indigo" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, trend, color }: any) {
  const colors: any = { blue: "text-blue-600 bg-blue-50", green: "text-emerald-600 bg-green-50", orange: "text-orange-600 bg-orange-50", indigo: "text-indigo-600 bg-indigo-50" };
  return (
    <div className="bg-white border rounded-xl p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}><Icon className="w-5 h-5" /></div>
        <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">{trend}</span>
      </div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}
