"use client";

import React from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { 
  Sparkles, ArrowRight, CheckCircle2, Zap, Globe, BarChart3, ShieldCheck,
  Mail, Phone, MessageCircle, Database, Eye, MessageSquareText, Search,
  Cpu, Rocket, Heart, Trophy, Fingerprint
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LandingPage() {
  const { data: session } = useSession();

  return (
    <div className="fixed inset-0 bg-[#F9F9F8] overflow-y-auto z-[200]">
      {/* Navigation */}
      <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-[#E5E5E1] z-50">
        <div className="max-w-[1400px] mx-auto px-10 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#1D1D1B] rounded-lg flex items-center justify-center">
              <Sparkles className="text-white w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#1D1D1B]">BrandMention</h1>
          </div>
          <div className="hidden lg:flex items-center gap-10">
            <a href="#what-is-geo" className="text-sm font-medium text-[#6B6B66] hover:text-[#1D1D1B] transition-colors">什么是GEO</a>
            <a href="#solutions" className="text-sm font-medium text-[#6B6B66] hover:text-[#1D1D1B] transition-colors">解决方案</a>
            <a href="#platforms" className="text-sm font-medium text-[#6B6B66] hover:text-[#1D1D1B] transition-colors">覆盖平台</a>
            <a href="#pricing" className="text-sm font-medium text-[#6B6B66] hover:text-[#1D1D1B] transition-colors">定价方案</a>
            <a href="#about" className="text-sm font-medium text-[#6B6B66] hover:text-[#1D1D1B] transition-colors">关于我们</a>
          </div>
          <div className="flex items-center gap-4">
            {!session ? (
              <>
                <Link href="/auth/signin" className="text-sm font-bold text-[#1D1D1B] hover:text-[#D97757]">登录</Link>
                <Link href="/auth/signin" className="claude-button-primary scale-90">免费预约演示</Link>
              </>
            ) : (
              <Link href="/console" className="claude-button-primary scale-90 flex items-center gap-2">
                进入工作台 <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-10">
        <div className="max-w-[1200px] mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-50 border border-orange-100 rounded-full text-[12px] font-black text-[#D97757] uppercase tracking-widest mb-10">
            <Zap className="w-3 h-3" /> The Next Frontier of Digital Marketing
          </div>
          <h2 className="text-[64px] font-black text-[#1D1D1B] leading-[1.1] tracking-tight mb-8">
            在 AI 搜索时代 <br />
            <span className="text-[#D97757]">让您的品牌被优先提及</span>
          </h2>
          <p className="text-[20px] text-[#6B6B66] max-w-3xl mx-auto leading-relaxed mb-12 font-medium">
            传统 SEO 已死。BrandMention 助力品牌在生成式 AI (GEO) 生态中构建“机器可读”的数字资产，实现权威引用与可见性爆发。
          </p>
          <div className="flex justify-center gap-6">
            <Link href={session ? "/console" : "/auth/signin"} className="claude-button-primary px-10 py-5 text-lg no-underline">
              立即开启 GEO 优化
            </Link>
            <button className="px-10 py-5 bg-white border border-[#E5E5E1] rounded-xl text-lg font-bold hover:bg-[#F5F5F3] transition-all">
              下载 2024 行业白皮书
            </button>
          </div>
        </div>
      </section>

      {/* What is GEO Section */}
      <section id="what-is-geo" className="py-32 bg-white border-y border-[#F0EFE9]">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="claude-card p-12 bg-[#F9F9F8] border-0 relative overflow-hidden">
               <div className="relative z-10">
                  <div className="p-3 bg-white w-fit rounded-xl border border-[#E5E5E1] mb-8">
                    <Search className="w-6 h-6 text-[#D97757]" />
                  </div>
                  <h3 className="text-3xl font-black text-[#1D1D1B] mb-6">什么是 GEO？</h3>
                  <p className="text-[#6B6B66] leading-[1.8] mb-6">
                    GEO (Generative Engine Optimization) 即<b>生成式引擎优化</b>。不同于传统搜索引擎展示链接，AI 引擎直接给出答案。
                  </p>
                  <div className="space-y-4">
                    {[
                      "从关键词匹配进化为语义理解",
                      "从点击率导向进化为权威性引用导向",
                      "依赖结构化数据与真实的第三方证据链"
                    ].map(item => (
                      <div key={item} className="flex items-center gap-3 text-sm font-bold text-[#1D1D1B]">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
                      </div>
                    ))}
                  </div>
               </div>
            </div>
            <div className="space-y-8">
               <h3 className="text-4xl font-black text-[#1D1D1B] leading-tight">不再只是排名，<br />而是成为“标准答案”</h3>
               <p className="text-[#6B6B66] text-lg leading-relaxed">
                 当用户询问“哪个云服务更懂金融？”或“推荐几款高端人体工学椅”时，BrandMention 确保 AI 能够通过我们的<b>证据引擎</b>精准锁定您的品牌。
               </p>
               <button className="text-[#D97757] font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:translate-x-1 transition-transform">
                 深入了解技术细节 <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section id="platforms" className="py-32">
        <div className="max-w-[1400px] mx-auto px-10">
           <div className="text-center mb-20">
              <span className="text-[11px] font-black text-[#D97757] uppercase tracking-[0.2em] mb-4 block">Full Ecosystem</span>
              <h3 className="text-3xl font-black text-[#1D1D1B]">多平台全覆盖观测</h3>
              <p className="text-[#A1A19A] mt-4 font-medium uppercase tracking-widest text-xs">兼容中国大陆及全球主流生成式产品</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {[
                { name: '豆包 (Doubao)', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/doubao.png' },
                { name: 'Kimi AI', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/kimi.png' },
                { name: '通义千问', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/qwen.png' },
                { name: '文心一言', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/baichuan.png' }, // Baichuan placeholder for Wenxin
                { name: '腾讯元宝', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/yuanbao.png' },
                { name: 'ChatGPT', logo: 'https://unpkg.com/@lobehub/icons-static-png@latest/light/openai.png' }
              ].map(p => (
                <div key={p.name} className="claude-card p-8 bg-white flex flex-col items-center justify-center text-center group hover:border-[#D97757]/30 transition-all duration-300">
                   <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-sm border border-[#F0EFE9] bg-white overflow-hidden p-2">
                      <img src={p.logo} alt={p.name} className="w-full h-full object-contain" onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://www.google.com/s2/favicons?domain=openai.com&sz=128'; // Fallback icon
                      }} />
                   </div>
                   <p className="text-[13px] font-black text-[#1D1D1B] tracking-tight">{p.name}</p>
                   <span className="text-[9px] font-bold text-[#A1A19A] uppercase tracking-widest mt-2 opacity-0 group-hover:opacity-100 transition-opacity">Full Support</span>
                </div>
              ))}
           </div>
        </div>
      </section>

      {/* Industry Insights */}
      <section className="py-32 bg-[#1D1D1B] text-white">
        <div className="max-w-[1400px] mx-auto px-10">
           <div className="flex justify-between items-end mb-24">
              <div className="max-w-xl">
                 <h3 className="text-4xl font-black tracking-tight mb-6">行业洞察与增量报告</h3>
                 <p className="text-slate-400 text-lg">我们的数据显示，GEO 优化后的品牌在 AI 问答中的提及率平均提升了 82%。</p>
              </div>
              <div className="text-right hidden md:block">
                 <p className="text-5xl font-black text-[#D97757] mb-2">200k+</p>
                 <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">每日采集观测样本</p>
              </div>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <InsightCard icon={Cpu} title="高新科技/SaaS" value="92%" desc="针对复杂技术参数执行结构化转换，让 AI 能够“秒读”您的核心竞争力。" />
              <InsightCard icon={Rocket} title="消费电子/硬件" value="78%" desc="实装真实测评证据链，提升 AI 搜索引擎在推荐场景下的首提权重。" />
              <InsightCard icon={Fingerprint} title="金融/专业服务" value="85%" desc="侧重合规性与权威信源挂接，消除 AI 幻觉，确保品牌信息无误传。" />
           </div>
        </div>
      </section>

      {/* Solutions Details */}
      <section id="solutions" className="py-32 bg-white">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="text-center mb-24">
            <h3 className="text-3xl font-black text-[#1D1D1B]">针对性 GEO 解决方案</h3>
            <p className="text-[#6B6B66] mt-4 font-medium uppercase tracking-widest text-xs">Tailored Strategies for your brand</p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
             <SolutionItem 
               title="品牌出海可见性加速" 
               desc="帮助中国品牌在海外主流 AI 平台 (ChatGPT, Claude, Gemini) 快速建立认知度，突破文化与语言导致的推荐偏见。"
             />
             <SolutionItem 
               title="品牌舆情合规治理" 
               desc="实时监测 AI 搜索引擎中的品牌错漏、幻觉与竞品恶意覆盖，自动下发归因报告并执行内容补强。"
             />
             <SolutionItem 
               title="全域内容资产结构化" 
               desc="将企业的非结构化知识资产 (PDF, 公众号, PPT) 批量转化为 AI 友好型语料，确保各平台口径一致。"
             />
             <SolutionItem 
               title="GEO 代理运营平台" 
               desc="为营销代理商提供多客户、多品牌看板与自动化月报导出，量化 GEO 运营的每一个价值节点。"
             />
          </div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-32">
        <div className="max-w-[1200px] mx-auto px-10">
          <div className="claude-card p-16 bg-[#F9F9F8] border-0 text-center flex flex-col items-center">
            <span className="text-[11px] font-black text-[#D97757] uppercase tracking-[0.2em] mb-6 block">About BrandMention</span>
            <h3 className="text-4xl font-black text-[#1D1D1B] mb-8 tracking-tight">博恩时代旗下的 <br />AI 可见性技术先锋</h3>
            <p className="text-[#6B6B66] text-lg max-w-2xl leading-relaxed mb-12">
              博恩团队由前大模型架构师与资深数字营销专家组成。我们深知生成式 AI 正在重构人类获取信息的方式。我们的使命是利用技术力量，让优秀的中国品牌在 AI 时代更具可见性与可引用性。
            </p>
            <div className="flex gap-20">
               <div className="text-center">
                  <p className="text-3xl font-black text-[#1D1D1B] mb-2">100+</p>
                  <p className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest">头部品牌长期信任</p>
               </div>
               <div className="text-center">
                  <p className="text-3xl font-black text-[#1D1D1B] mb-2">10亿+</p>
                  <p className="text-[10px] font-black text-[#A1A19A] uppercase tracking-widest">全域 AI 训练观测样本</p>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing - Reuse previously good style with content extension */}
      <section id="pricing" className="py-32 bg-white border-y border-[#F0EFE9]">
        <div className="max-w-[1400px] mx-auto px-10">
          <div className="text-center mb-24">
            <h3 className="text-3xl font-black text-[#1D1D1B]">透明的定价方案</h3>
            <p className="text-[#6B6B66] mt-4 font-medium uppercase tracking-widest text-xs">Scalable pricing for brands of all sizes</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <PriceCard title="标准版" price="¥ 4,999" sub="月" items={["5 品牌主体", "1,000 条/月 观测", "标准内容生成", "基础看板"]} />
            <PriceCard title="专业版" price="¥ 12,999" sub="月" items={["20 品牌主体", "5,000 条/月 观测", "全渠道分发适配", "自动化诊断工单", "一键报表导出"]} featured />
            <PriceCard title="企业版" price="On-Demand定制" items={["无限品牌主体", "定制化爬虫频率", "私有化部署支持", "专属咨询服务", "API/Webhook 集成"]} />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32">
        <div className="max-w-[1200px] mx-auto px-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div>
            <h3 className="text-4xl font-black mb-8 tracking-tight text-[#1D1D1B]">准备好开启 <br /><span className="text-[#D97757]">GEO 增长之旅了吗？</span></h3>
            <p className="text-[#6B6B66] font-medium mb-12 text-lg">立即联系我们的资深顾问，获取您的品牌 AI 可见性基线报告。</p>
            <div className="space-y-8">
              <div className="flex items-center gap-4 text-[#1D1D1B] font-bold">
                <div className="w-12 h-12 bg-white border border-[#E5E5E1] rounded-2xl flex items-center justify-center"><Mail className="w-5 h-5" /></div>
                contact@brandmention.com
              </div>
              <div className="flex items-center gap-4 text-[#1D1D1B] font-bold">
                <div className="w-12 h-12 bg-white border border-[#E5E5E1] rounded-2xl flex items-center justify-center"><Phone className="w-5 h-5" /></div>
                400-888-XXXX
              </div>
            </div>
          </div>
          <form className="claude-card p-10 bg-white space-y-6">
            <div className="grid grid-cols-2 gap-6">
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">您的姓名</label>
                  <input className="claude-input py-2" placeholder="Zhang San" />
               </div>
               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">企业邮箱</label>
                  <input className="claude-input py-2" placeholder="name@company.com" />
               </div>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">所属行业</label>
               <select className="claude-input py-2"><option>SaaS/科技</option><option>消费零售</option><option>工业制造</option></select>
            </div>
            <div className="space-y-1.5">
               <label className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-widest">您的具体需求</label>
               <textarea className="claude-input h-32 resize-none" placeholder="描述您的品牌面临的 AI 搜索可见性问题..." />
            </div>
            <button type="submit" className="claude-button-primary w-full py-4 text-sm font-bold uppercase tracking-widest border border-slate-900 shadow-none">
               发送咨询请求
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-10 text-center border-t border-[#F0EFE9]">
        <p className="text-[11px] text-[#A1A19A] font-black uppercase tracking-[0.2em]">
          &copy; 2024 BrandMention AI. All rights reserved. <br />
          博恩时代（BrandMention）旗下品牌 AI 可见性运营平台
        </p>
      </footer>
    </div>
  );
}

function InsightCard({ icon: Icon, title, value, desc }: any) {
  return (
    <div className="claude-card bg-white/5 border-white/10 p-8 hover:bg-white/10 transition-all group border-0">
       <Icon className="w-8 h-8 text-[#D97757] mb-8 group-hover:scale-110 transition-transform" />
       <h4 className="text-lg font-bold mb-4">{title}</h4>
       <p className="text-3xl font-black text-[#D97757] mb-6">{value} <span className="text-xs text-slate-500 font-bold tracking-widest uppercase">Increase</span></p>
       <p className="text-slate-400 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

function SolutionItem({ title, desc }: any) {
  return (
    <div className="claude-card p-8 bg-[#F9F9F8]/50 hover:bg-white hover:border-[#D97757]/30 transition-all border-dashed group">
       <div className="flex justify-between items-start mb-6">
          <h4 className="text-xl font-bold text-[#1D1D1B] tracking-tight">{title}</h4>
          <CheckCircle2 className="w-5 h-5 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
       </div>
       <p className="text-[#6B6B66] text-sm leading-[1.8] font-medium">{desc}</p>
    </div>
  );
}

function PriceCard({ title, price, sub, items, featured }: any) {
  return (
    <div className={cn(
      "claude-card p-10 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:-translate-y-2 group",
      featured ? "border-[#1D1D1B] border-2 shadow-2xl z-10 bg-white" : "bg-white hover:border-[#D97757]/30"
    )}>
      {featured && <div className="absolute top-0 right-0 bg-[#1D1D1B] text-white text-[9px] font-black uppercase px-4 py-1 tracking-widest">Most Popular</div>}
      <h4 className="text-sm font-black text-[#6B6B66] uppercase tracking-[0.2em] mb-8">{title}</h4>
      <div className="flex items-baseline gap-2 mb-10">
        <span className="text-4xl font-black text-[#1D1D1B]">{price}</span>
        {sub && <span className="text-[#A1A19A] font-bold text-sm">/ {sub}</span>}
      </div>
      <div className="space-y-4 mb-10">
        {items.map((item: string) => (
          <div key={item} className="flex items-center gap-3 text-[13px] font-medium text-[#1D1D1B]">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
          </div>
        ))}
      </div>
      
      {/* 使用 mt-auto 强制按钮底部对齐，并增加 group-hover 联动色值 */}
      <button className={cn(
        "w-full py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all mt-auto",
        featured 
          ? "bg-[#1D1D1B] text-white hover:bg-slate-800" 
          : "bg-[#F9F9F8] text-[#1D1D1B] border border-[#E5E5E1] group-hover:bg-[#1D1D1B] group-hover:text-white group-hover:border-[#1D1D1B]"
      )}>立即选择方案</button>
    </div>
  );
}
