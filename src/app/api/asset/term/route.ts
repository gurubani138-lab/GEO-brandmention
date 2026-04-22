import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { brandId, type, value } = await req.json();
    const term = await prisma.term.create({
      data: { brandId, type, value }
    });
    return NextResponse.json({ success: true, data: term });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get('brandId');
  const terms = await prisma.term.findMany({
    where: brandId ? { brandId } : undefined,
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, data: terms });
}
