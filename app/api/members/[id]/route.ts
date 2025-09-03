import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Member from '@/models/Member';
import Payment from '@/models/Payment';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();
    
    const member = await Member.findOneAndUpdate({ id }, body, { new: true });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Update member name in payment records
    await Payment.updateMany({ memberId: id }, { memberName: body.name });

    return NextResponse.json(member);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, context: RouteParams) {
  try {
    const { id } = await context.params;
    await dbConnect();
    
    const member = await Member.findOneAndDelete({ id });
    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    // Delete all payment records for this member
    await Payment.deleteMany({ memberId: id });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
  }
}