import { prisma } from '@/lib/prisma';
import { Plus, Search, Filter, MoreVertical } from 'lucide-react';

export default async function AssetsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { products: true, faqs: true, evidences: true }
      }
    }
  });

  return (
    <div className="p-8">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">资产中心</h2>
          <p className="text-slate-500 text-sm mt-1">管理品牌核心资料、产品参数及合规证据链</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm">
          <Plus className="w-4 h-4" />
          新增品牌
        </button>
      </header>

      {/* 搜索与过滤 */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索品牌或产品名称..." 
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
        </div>
        <button className="px-4 py-2 border rounded-lg text-sm font-medium text-slate-600 flex items-center gap-2 hover:bg-white transition-colors">
          <Filter className="w-4 h-4" />
          筛选
        </button>
      </div>

      {/* 品牌列表 */}
      <div className="grid grid-cols-1 gap-4">
        {brands.length === 0 ? (
          <div className="text-center py-20 bg-white border border-dashed rounded-xl">
            <p className="text-slate-400 text-sm">暂无品牌数据，请先新增品牌</p>
          </div>
        ) : (
          brands.map((brand) => (
            <div key={brand.id} className="bg-white border rounded-xl p-6 hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold">
                    {brand.name.substring(0, 1)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{brand.name}</h3>
                    <p className="text-xs text-slate-500">{brand.industry} | {brand.status === 'active' ? '正常运营' : '草稿'}</p>
                  </div>
                </div>
                <button className="p-1 hover:bg-slate-50 rounded text-slate-400">
                  <MoreVertical className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-3 gap-8 py-4 border-y border-slate-50 mt-4">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider mb-1">关联产品</p>
                  <p className="text-lg font-bold text-slate-700">{brand._count.products}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider mb-1">标准 FAQ</p>
                  <p className="text-lg font-bold text-slate-700">{brand._count.faqs}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-medium tracking-wider mb-1">证据材料</p>
                  <p className="text-lg font-bold text-slate-700">{brand._count.evidences}</p>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-medium">机器可读性: 82%</span>
                  <span className="px-2 py-1 bg-green-50 text-emerald-600 rounded text-[10px] font-medium">基线已建立</span>
                </div>
                <div className="flex gap-3 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                  <button className="text-xs font-medium text-slate-400 hover:text-slate-600">快速改写</button>
                  <button className="text-xs font-medium text-blue-600 hover:underline">管理资料</button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
