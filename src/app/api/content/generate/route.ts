import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateGeoContent } from '@/lib/llm';

export async function POST(req: NextRequest) {
  try {
    const { brandId, contentType, inputText, channel } = await req.json();

    // 1. 获取品牌资产约束
    let brand;
    if (brandId && brandId !== 'demo-brand') {
      brand = await prisma.brand.findUnique({
        where: { id: brandId },
        include: { products: true, faqs: true }
      });
    } else {
      brand = await prisma.brand.findFirst({
        include: { products: true, faqs: true }
      });
    }

    if (!brand) {
      return NextResponse.json({ 
        error: '数据库中无品牌数据，请先前往“资产中心”新增一个品牌' 
      }, { status: 404 });
    }

    // 2. 构造资产上下文
    const assetsSummary = `
      品牌全称：${brand.name}
      品牌定位：${brand.positioning || '暂无'}
      核心价值：${brand.coreValues || '暂无'}
      行业：${brand.industry}
    `;

    // 3. 调用 AI 进行生成（注意：现在的返回值是 { output, auditReport }）
    const llmResult = await generateGeoContent({
      brandName: brand.name,
      industry: brand.industry,
      contentType,
      channel: channel || 'general',
      inputText,
      assets: assetsSummary,
    });

    // 4. 创建任务记录，并将审核报告存入 auditReport 字段
    const task = await prisma.contentTask.create({
      data: {
        brandId: brand.id,
        type: 'generate',
        contentType,
        channel: channel || 'general',
        inputText,
        outputText: llmResult.output, // 提取纯文本存入
        auditReport: JSON.stringify(llmResult.auditReport), // 将对象转为字符串存入
        status: 'pending_review',
      }
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    console.error('LLM Error:', error);
    return NextResponse.json({ error: error.message || '生成出错' }, { status: 500 });
  }
}
