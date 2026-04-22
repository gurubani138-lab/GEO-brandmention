import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import * as XLSX from 'xlsx';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandId = searchParams.get('brandId');

    const samples = await prisma.observationSample.findMany({
      where: brandId ? { question: { brandId } } : undefined,
      include: { question: { include: { brand: true } } },
      orderBy: { createdAt: 'desc' }
    });

    // 转换为 Excel 格式
    const data = samples.map(s => ({
      '观测时间': s.createdAt.toLocaleString(),
      '品牌': s.question.brand.name,
      '观测问题': s.question.text,
      'AI平台': s.platform,
      '是否提及': s.mentionFlag ? '是' : '否',
      '事实异常': s.errorFlag ? '是' : '否',
      '回答内容摘要': s.answerText.substring(0, 100) + '...'
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GEO观测报告");
    
    const buf = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    return new NextResponse(buf, {
      headers: {
        'Content-Disposition': 'attachment; filename="GEO_Report.xlsx"',
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
