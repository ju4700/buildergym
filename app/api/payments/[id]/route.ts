import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();
    
    const updateData = { ...body };
    
    // If marking as paid, add paidDate
    if (body.status === 'paid' && !body.paidDate) {
      updateData.paidDate = new Date();
    }
    
    // If marking as due, remove paidDate
    if (body.status === 'due') {
      updateData.paidDate = null;
    }

    const payment = await Payment.findByIdAndUpdate(id, updateData, { new: true });
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    return NextResponse.json(payment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}