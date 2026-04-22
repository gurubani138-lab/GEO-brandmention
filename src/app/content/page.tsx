import { prisma } from '@/lib/prisma';
import { PenTool, Wand2, History, Send } from 'lucide-react';

export default async function ContentPage() {
  const tasks = await prisma.contentTask.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10
  });

  return (
    <div className="p-8">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900">内容生产中心</h2>
        <p className="text-slate-500 text-sm mt-1">在品牌资产约束下，批量产出 AI 友好型内容</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧：创建任务 */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-blue-500" />
              新建生成任务
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">选择品牌</label>
                <select className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:outline-none">
                  <option>京东云 (JD Cloud)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-500">内容类型</label>
                <select className="w-full p-2 border rounded-lg text-sm bg-slate-50 focus:outline-none">
                  <option>品牌介绍 (GEO 优化版)</option>
                  <option>产品对比稿</option>
                  <option>场景化 FAQ</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5 mb-6">
              <label className="text-xs font-medium text-slate-500">输入原始文本/需求 (可选)</label>
              <textarea 
                placeholder="请输入原始内容，智能体将结合资产库进行 GEO 友好化改写..." 
                className="w-full p-3 border rounded-lg text-sm min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500/10"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-sm transition-colors">
              <Send className="w-4 h-4" />
              开始智能生成
            </button>
          </section>

          {/* 生成记录 */}
          <section className="bg-white border rounded-xl p-6 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              最近生成历史
            </h3>
            <div className="space-y-3">
              {tasks.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-xs text-slate-400 font-mono italic">-- 暂无历史生成任务 --</p>
                </div>
              ) : (
                tasks.map(task => (
                  <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-50 rounded text-blue-600">
                        <PenTool className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-700">{task.contentType}</p>
                        <p className="text-[10px] text-slate-400">{task.createdAt.toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-green-50 text-green-600 rounded-full font-medium">已完成</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* 右侧：资产约束提醒 */}
        <div className="space-y-6">
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-lg">
            <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              资产约束状态
            </h4>
            <div className="space-y-4">
              <ConstraintItem label="品牌词库" status="ready" count={12} />
              <ConstraintItem label="禁用语库" status="ready" count={5} />
              <ConstraintItem label="合规证据" status="ready" count={32} />
              <ConstraintItem label="产品参数" status="warning" count={2} />
            </div>
            <p className="text-[10px] text-slate-400 mt-6 leading-relaxed">
              * 智能体将在生成过程中强制校验以上资产，确保内容不脱离事实边界且满足 GEO 结构化要求。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function ConstraintItem({ label, status, count }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-xs text-slate-300">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono">{count}</span>
        <div className={`w-1.5 h-1.5 rounded-full ${status === 'ready' ? 'bg-blue-400' : 'bg-orange-400'}`} />
      </div>
    </div>
  );
}
