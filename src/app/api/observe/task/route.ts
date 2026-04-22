import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { scraper } from '@/lib/scraper';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: process.env.MOONSHOT_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { brandId } = await req.json();

    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
      include: { products: true, faqs: true, questions: true }
    });

    if (!brand || brand.questions.length === 0) {
      return NextResponse.json({ error: '请先添加观测题目' }, { status: 400 });
    }

    const assetsSummary = `品牌:${brand.name}, 行业:${brand.industry}, 价值:${brand.coreValues}`;
    await scraper.init();
    
    const results = [];

    for (const q of brand.questions) {
      const scrapeResult = await scraper.scrapeKimi(q.text);
      if (!scrapeResult.success) continue;

      const answerText = scrapeResult.answer;
      const brandKeywords = [brand.name, ...(brand.alias?.split(',') || [])];
      const mentionFlag = brandKeywords.some(kw => answerText.includes(kw.trim()));
      
      // --- 商用核心：事实一致性校验 (LLM-based Check) ---
      let consistencyScore = 100;
      let errorFlag = false;
      if (mentionFlag) {
        const checkPrompt = `你是一个事实核查员。
          标准事实：${assetsSummary}
          AI的回答：${answerText}
          请对比两者，判断AI是否说错。直接返回分数(0-100)，100为满分，其他任何文字都不要返回。`;
        
        const checkRes = await openai.chat.completions.create({
          model: 'moonshot-v1-8k',
          messages: [{ role: 'user', content: checkPrompt }],
        });
        consistencyScore = parseInt(checkRes.choices[0].message.content?.trim() || '100');
        if (consistencyScore < 80) errorFlag = true;
      }

      const sample = await prisma.observationSample.create({
        data: {
          questionId: q.id,
          platform: 'Kimi Real Scraper',
          answerText,
          mentionFlag,
          errorFlag,
          consistencyScore,
          snapshotUrl: 'https://demo-oss-cdn.com/real_snap.png'
        }
      });

      // --- 自动工单触发逻辑 ---
      if (!mentionFlag || errorFlag) {
         await prisma.optimizationTicket.create({
           data: {
             brandId: brand.id,
             title: `自动诊断: 问题【${q.text.substring(0, 10)}】表现不佳`,
             suggestion: !mentionFlag ? '分析原因为内容覆盖不足，建议通过内容中心生成针对性 FAQ 并发布。' : '分析原因为 AI 提取了错误事实，建议修正资产库中的核心参数。',
             status: 'open',
             priority: 'high'
           }
         });
      }
      
      results.push(sample);
    }

    await scraper.close();
    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
