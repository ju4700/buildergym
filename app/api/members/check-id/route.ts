import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Member from '@/models/Member';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(request.url);
    const memberId = searchParams.get('id');
    
    if (!memberId) {
      return NextResponse.json({ error: 'Member ID is required' }, { status: 400 });
    }

    // Check if member ID already exists
    const existingMember = await Member.findOne({ id: memberId });
    
    if (existingMember) {
      // Generate a suggestion
      const allMembers = await Member.find({}, 'id').lean();
      const currentYear = new Date().getFullYear();
      const prefix = `GM${currentYear}`;
      
      // Find next available sequential number
      const currentYearMembers = allMembers
        .filter(member => member.id.startsWith(prefix))
        .map(member => {
          const numPart = member.id.replace(prefix, '');
          return parseInt(numPart) || 0;
        })
        .sort((a, b) => b - a);
      
      const nextNum = currentYearMembers.length > 0 ? currentYearMembers[0] + 1 : 1001;
      const suggestion = `${prefix}${nextNum.toString().padStart(4, '0')}`;
      
      return NextResponse.json({ 
        available: false, 
        suggestion,
        message: `Member ID "${memberId}" is already taken`
      });
    }

    return NextResponse.json({ 
      available: true,
      message: `Member ID "${memberId}" is available`
    });
    
  } catch (error) {
    console.error('Error checking member ID:', error);
    return NextResponse.json({ error: 'Failed to check member ID' }, { status: 500 });
  }
}
