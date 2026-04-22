import { prisma } from '@/lib/prisma';
import { Eye, Search, ExternalLink, MessageSquare, AlertCircle } from 'lucide-react';

export default async function ObservePage() {
  const samples = await prisma.observationSample.findMany({
    include: {
      question: true
    },
    orderBy: { createdAt: 'desc' },
    take: 15
  });

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">问答观测中心</h2>
          <p className="text-slate-500 text-sm mt-1">采集主流 AI 平台对品牌相关问题的真实回答</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-white flex items-center gap-2">
            管理题库
          </button>
          <button className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-slate-800 shadow-sm transition-colors">
            发起观测任务
          </button>
        </div>
      </header>

      {/* 观测样本表格 */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">观测问题</th>
              <th className="px-6 py-4 font-semibold text-slate-700 w-32">观测平台</th>
              <th className="px-6 py-4 font-semibold text-slate-700 w-32">品牌提及</th>
              <th className="px-6 py-4 font-semibold text-slate-700 w-32">事实合规</th>
              <th className="px-6 py-4 font-semibold text-slate-700 w-40">观测时间</th>
              <th className="px-6 py-4 font-semibold text-slate-700 w-24">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {samples.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-20 text-slate-400 italic">暂无观测数据</td>
              </tr>
            ) : (
              samples.map(sample => (
                <tr key={sample.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 line-clamp-1">{sample.question.text}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-tighter">{sample.question.category}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded text-xs font-medium text-slate-600">
                      {sample.platform}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${sample.mentionFlag ? 'bg-green-500' : 'bg-slate-300'}`} />
                      <span className={sample.mentionFlag ? 'text-green-600 font-medium' : 'text-slate-400'}>
                        {sample.mentionFlag ? '已提及' : '未命中'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {sample.errorFlag ? (
                      <div className="flex items-center gap-1.5 text-orange-500 font-medium">
                        <AlertCircle className="w-3 h-3" />
                        <span>异常</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">--</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {sample.createdAt.toLocaleDateString()} {sample.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 快捷摘要 */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 border rounded-lg flex items-start gap-4">
          <div className="p-2 bg-blue-50 rounded text-blue-600">
            <Eye className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">累计样本量</p>
            <p className="text-lg font-bold text-slate-800">{samples.length}</p>
          </div>
        </div>
        <div className="p-4 border rounded-lg flex items-start gap-4">
          <div className="p-2 bg-purple-50 rounded text-purple-600">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-500">待标注样本</p>
            <p className="text-lg font-bold text-slate-800">0</p>
          </div>
        </div>
      </div>
    </div>
  );
}
