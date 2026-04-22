import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    // 自动创建一个默认组织（商用版需改为真实 Auth 获取）
    let org = await prisma.organization.findFirst();
    if (!org) {
      org = await prisma.organization.create({
        data: { name: '默认组织', id: 'default-org' }
      });
    }

    const brand = await prisma.brand.create({
      data: {
        orgId: org.id,
        name: data.name,
        industry: data.industry,
        positioning: data.positioning,
        coreValues: data.coreValues,
        status: 'active'
      }
    });

    return NextResponse.json({ success: true, data: brand });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  const brands = await prisma.brand.findMany({
    include: { _count: { select: { products: true, faqs: true, evidences: true } } }
  });
  return NextResponse.json({ success: true, data: brands });
}
