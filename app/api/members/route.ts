import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Member from '@/models/Member';
import Payment from '@/models/Payment';

export async function GET() {
  try {
    await dbConnect();
    const members = await Member.find({}).sort({ createdAt: -1 });
    return NextResponse.json(members);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch members' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Check if member ID already exists
    const existingMember = await Member.findOne({ id: body.id });
    if (existingMember) {
      return NextResponse.json({ error: 'Member ID already exists' }, { status: 400 });
    }

    const member = new Member(body);
    await member.save();

    // Create initial payment record for the admission month
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const payment = new Payment({
      memberId: member.id,
      memberName: member.name,
      amount: 0, // Default amount, can be updated later
      dueDate: new Date(currentYear, currentDate.getMonth(), 1),
      month: currentMonth,
      year: currentYear,
      status: 'due',
    });

    await payment.save();

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
  }
}