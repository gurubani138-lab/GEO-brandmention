import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const samples = await prisma.observationSample.findMany({
      include: { question: true },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    return NextResponse.json({ success: true, data: samples });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
