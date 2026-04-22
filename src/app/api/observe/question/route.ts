import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { brandId, text, category, priority } = await req.json();
    const question = await prisma.observationQuestion.create({
      data: { brandId, text, category, priority: priority || 'medium' }
    });
    return NextResponse.json({ success: true, data: question });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get('brandId');

  const questions = await prisma.observationQuestion.findMany({
    where: brandId ? { brandId } : undefined,
    include: { brand: true, samples: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });
  return NextResponse.json({ success: true, data: questions });
}
