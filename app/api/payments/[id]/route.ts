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
    
    const payment = await Payment.findById(id);
    if (!payment) {
      return NextResponse.json({ error: 'Payment not found' }, { status: 404 });
    }

    const updateData = { ...body };
    
    // If marking as paid, add paidDate
    if (body.status === 'paid' && !body.paidDate) {
      updateData.paidDate = new Date();
      
      // If this payment includes accumulated dues, mark all previous unpaid payments as paid
      if (payment.accumulatedDues && payment.accumulatedDues > 0) {
        await Payment.updateMany(
          {
            memberId: payment.memberId,
            status: 'due',
            $or: [
              { year: { $lt: payment.year } },
              { 
                year: payment.year,
                month: { $ne: payment.month }
              }
            ]
          },
          {
            status: 'paid',
            paidDate: new Date()
          }
        );
      }
    }
    
    // If marking as due, remove paidDate
    if (body.status === 'due') {
      updateData.paidDate = null;
    }

    const updatedPayment = await Payment.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(updatedPayment);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update payment' }, { status: 500 });
  }
}