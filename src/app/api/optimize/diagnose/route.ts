import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.MOONSHOT_API_KEY,
  baseURL: process.env.MOONSHOT_BASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const { sampleId } = await req.json();

    // 1. 获取样本及其背后的品牌资产
    const sample = await prisma.observationSample.findUnique({
      where: { id: sampleId },
      include: { 
        question: { include: { brand: true } } 
      }
    });

    if (!sample) return NextResponse.json({ error: '样本不存在' }, { status: 404 });

    const brand = sample.question.brand;

    // 2. 调用 Kimi 进行深度归因分析
    const prompt = `你是一个 GEO (生成式引擎优化) 诊断专家。
针对以下情况进行归因分析：
问题：${sample.question.text}
平台回答：${sample.answerText}
预期提及品牌：${brand.name}
品牌定位：${brand.positioning}
核心价值：${brand.coreValues}

请分析为什么 AI 没有提到该品牌或回答有误。
输出格式：
1. 归因分析（如：内容覆盖不足、关键词权重低、缺乏权威信源佐证等）
2. 具体的优化建议（如：在官网增加 X 页面，重写 Y 问答，补充 Z 资质链接等）
直接输出 Markdown 格式。`;

    const completion = await openai.chat.completions.create({
      model: 'moonshot-v1-8k',
      messages: [{ role: 'user', content: prompt }],
    });

    const suggestionText = completion.choices[0].message.content || '';

    // 3. 自动生成一个优化工单
    const ticket = await prisma.optimizationTicket.create({
      data: {
        brandId: brand.id,
        title: `针对问题【${sample.question.text.substring(0, 10)}...】的可见性优化`,
        suggestion: suggestionText,
        status: 'open',
        priority: 'high',
      }
    });

    return NextResponse.json({ success: true, data: ticket });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
