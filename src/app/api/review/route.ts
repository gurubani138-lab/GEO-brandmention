import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const reviews = await prisma.contentTask.findMany({
    where: { status: 'pending_review' },
    include: { brand: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ success: true, data: reviews });
}

export async function POST(req: NextRequest) {
  try {
    const { taskId, action, comment } = await req.json(); // action: 'approve' | 'reject'
    
    const task = await prisma.contentTask.update({
      where: { id: taskId },
      data: {
        status: action === 'approve' ? 'approved' : 'rejected'
      }
    });

    return NextResponse.json({ success: true, data: task });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
