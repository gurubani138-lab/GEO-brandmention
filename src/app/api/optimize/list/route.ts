import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const tickets = await prisma.optimizationTicket.findMany({
      include: { brand: true },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ success: true, data: tickets });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
