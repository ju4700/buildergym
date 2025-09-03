import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';
import Member from '@/models/Member';

export async function GET() {
  try {
    await dbConnect();
    const payments = await Payment.find({}).sort({ dueDate: -1 });
    return NextResponse.json(payments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch payments' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Generate monthly dues for all members
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    const monthlyFee = 500; // Standard monthly fee in BDT
    
    const members = await Member.find({});
    const generatedPayments = [];

    for (const member of members) {
      // Check if payment already exists for this month
      const existingPayment = await Payment.findOne({
        memberId: member.id,
        month: currentMonth,
        year: currentYear,
      });

      if (!existingPayment) {
        const payment = new Payment({
          memberId: member.id,
          memberName: member.name,
          amount: monthlyFee, // Always 500 BDT for monthly dues
          monthlyFee: monthlyFee,
          dueDate: new Date(currentYear, currentDate.getMonth(), 1),
          month: currentMonth,
          year: currentYear,
          status: 'due',
          isFirstPayment: false, // This is not the first payment (no admission fee)
        });

        await payment.save();
        generatedPayments.push(payment);
      }
    }

    return NextResponse.json({ 
      message: `Generated ${generatedPayments.length} new payment records`,
      payments: generatedPayments 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate payments' }, { status: 500 });
  }
}