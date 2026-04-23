import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Layout,
  Database,
  MessageSquarePlus,
  Eye,
  BarChart2,
  ShieldCheck,
  Lightbulb,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default async function ConsolePage() {
  const [brandCount, pendingReviewCount, openTicketCount, sampleCount] =
    await Promise.all([
      prisma.brand.count(),
      prisma.contentTask.count({ where: { status: "pending_review" } }),
      prisma.optimizationTicket.count({ where: { status: "open" } }),
      prisma.observationSample.count(),
    ]);

  const [latestReviews, latestTickets, latestIssues] = await Promise.all([
    prisma.contentTask.findMany({
      where: { status: "pending_review" },
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.optimizationTicket.findMany({
      where: { status: "open" },
      include: { brand: true },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.observationSample.findMany({
      where: { mentionFlag: false },
      include: { question: { include: { brand: true } } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="w-full">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-10">
        <div>
          <h2 className="text-[32px] font-semibold text-[#1D1D1B] tracking-tight">
            运营看板
          </h2>
          <p className="text-[#6B6B66] font-medium mt-2 text-sm uppercase tracking-widest">
            Operations Command Center
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <QuickLink href="/assets" icon={Database} label="录入资产" />
          <QuickLink href="/content" icon={MessageSquarePlus} label="内容生产" />
          <QuickLink href="/observe" icon={Eye} label="发起观测" />
          <QuickLink href="/dashboard" icon={BarChart2} label="可见性分析" />
        </div>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="品牌资产"
          value={brandCount}
          icon={Layout}
          hint="已创建品牌数"
          href="/assets"
        />
        <MetricCard
          title="待审核内容"
          value={pendingReviewCount}
          icon={ShieldCheck}
          hint="需要人工审核"
          href="/review"
        />
        <MetricCard
          title="开放优化单"
          value={openTicketCount}
          icon={Lightbulb}
          hint="待跟进的漏洞"
          href="/optimize"
        />
        <MetricCard
          title="观测样本"
          value={sampleCount}
          icon={Eye}
          hint="累计采集样本"
          href="/observe"
        />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <Panel
          title="待审核队列"
          subtitle="Pending Review"
          emptyText="暂无待审核内容"
          href="/review"
          items={latestReviews.map((t) => ({
            id: t.id,
            title: t.outputText?.slice(0, 56) || "（无输出内容）",
            meta: t.brand?.name ? `品牌：${t.brand.name}` : "品牌：-",
          }))}
        />
        <Panel
          title="最新优化单"
          subtitle="Open Tickets"
          emptyText="暂无开放优化单"
          href="/optimize"
          items={latestTickets.map((t) => ({
            id: t.id,
            title: t.title,
            meta: t.brand?.name ? `品牌：${t.brand.name}` : "品牌：-",
          }))}
        />
        <Panel
          title="最近缺失提及"
          subtitle="Missed Mentions"
          emptyText="暂无缺失提及样本"
          href="/dashboard"
          items={latestIssues.map((s) => ({
            id: s.id,
            title: s.question?.text || "（未知问题）",
            meta: `品牌：${s.question?.brand?.name || "-"} · ${s.platform}`,
          }))}
        />
      </section>

      {(brandCount === 0 || sampleCount === 0) && (
        <div className="claude-card p-10 bg-white mt-8 border-dashed">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#F9F9F8] border border-[#E5E5E1]">
              <AlertCircle className="w-5 h-5 text-[#D97757]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-[#1D1D1B]">
                还差一步即可生成可见性数据
              </p>
              <p className="text-xs text-[#6B6B66] font-medium mt-1 leading-relaxed">
                {brandCount === 0
                  ? "先到「资产管理」创建品牌与素材，再到「观测中心」发起任务。"
                  : "到「观测中心」发起任务，采集样本后即可在「可见性分析」看到指标。"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: any;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-white border border-[#E5E5E1] text-[#1D1D1B] hover:bg-[#F5F5F3] hover:border-[#D1D1CD] transition-all active:scale-[0.98]"
    >
      <Icon className="w-4 h-4" />
      {label}
    </Link>
  );
}

function MetricCard({
  title,
  value,
  icon: Icon,
  hint,
  href,
}: {
  title: string;
  value: number;
  icon: any;
  hint: string;
  href: string;
}) {
  return (
    <Link href={href} className="claude-card p-8 bg-white group">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-6 bg-[#F9F9F8] border border-[#E5E5E1]">
        <Icon className="w-5 h-5 text-[#D97757]" />
      </div>
      <p className="text-[11px] font-bold text-[#A1A19A] uppercase tracking-widest mb-1">
        {title}
      </p>
      <div className="flex items-end justify-between gap-3">
        <h4 className="text-3xl font-semibold text-[#1D1D1B] tracking-tight">
          {value}
        </h4>
        <ChevronRight className="w-4 h-4 text-[#D9D9D4] group-hover:text-[#A1A19A] transition-colors" />
      </div>
      <p className="text-[11px] text-[#6B6B66] mt-4 font-medium italic border-t border-[#F0EFE9] pt-4">
        {hint}
      </p>
    </Link>
  );
}

function Panel({
  title,
  subtitle,
  items,
  href,
  emptyText,
}: {
  title: string;
  subtitle: string;
  items: Array<{ id: string; title: string; meta: string }>;
  href: string;
  emptyText: string;
}) {
  return (
    <div className="claude-card p-10 bg-white">
      <div className="flex items-end justify-between gap-6 mb-8">
        <h3 className="text-lg font-semibold text-[#1D1D1B]">{title}</h3>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold text-[#A1A19A] uppercase tracking-[0.2em]">
            {subtitle}
          </span>
          <Link
            href={href}
            className="text-[11px] font-bold text-[#D97757] hover:text-[#C25F3F] transition-colors"
          >
            查看全部
          </Link>
        </div>
      </div>

      {items.length === 0 ? (
        <p className="text-xs text-[#A1A19A] font-semibold">{emptyText}</p>
      ) : (
        <div className="space-y-5">
          {items.map((it) => (
            <div key={it.id} className="group">
              <p className="text-[14px] font-medium text-[#1D1D1B] line-clamp-2 leading-relaxed group-hover:text-black transition-colors">
                {it.title}
              </p>
              <p className="text-[11px] mt-2 text-[#A1A19A] font-semibold">
                {it.meta}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
