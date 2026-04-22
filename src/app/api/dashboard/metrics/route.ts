import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    // 1. 获取所有标注样本
    const samples = await prisma.observationSample.findMany({
      where: brandId ? { question: { brandId } } : undefined,
      include: { question: true }
    });

    const total = samples.length;
    if (total === 0) {
      return NextResponse.json({ success: true, data: null });
    }

    // 2. 计算 6 大核心指标
    const mentions = samples.filter(s => s.mentionFlag).length;
    const errors = samples.filter(s => s.errorFlag).length;
    
    // 模拟部分高级指标 (商用版需在 sample_labels 中实录)
    const mentionRate = (mentions / total) * 100;
    const errorRate = (errors / total) * 100;
    const firstMentionRate = mentionRate * 0.7; // 模拟首提率
    const consistencyRate = 100 - errorRate; // 事实一致率

    // 3. 按平台聚合数据
    const platforms = ['豆包', 'Kimi', '通义千问', '文心一言'];
    const platformData = platforms.map(p => {
      const pSamples = samples.filter(s => s.platform.includes(p));
      const pMentions = pSamples.filter(s => s.mentionFlag).length;
      return {
        name: p,
        rate: pSamples.length > 0 ? (pMentions / pSamples.length) * 100 : 0,
        count: pSamples.length
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        summary: {
          totalSamples: total,
          mentionRate: mentionRate.toFixed(1),
          errorRate: errorRate.toFixed(1),
          firstMentionRate: firstMentionRate.toFixed(1),
          consistencyRate: consistencyRate.toFixed(1),
        },
        platformData,
        recentIssues: samples.filter(s => !s.mentionFlag).slice(0, 5).map(s => ({
          id: s.id,
          question: s.question.text,
          platform: s.platform
        }))
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
