import dbConnect from '../lib/mongodb';
import Member from '../models/Member';
import Payment from '../models/Payment';

// Sample Bangladeshi gym members data
const bangladeshiMembers = [
  {
    id: 'BGM001',
    name: 'Mohammad Rahman',
    admissionDate: new Date('2024-01-15'),
    bloodGroup: 'O+',
    mobileNumber: '+8801712345678',
    idNumber: '1234567890123',
    age: 28,
    referenceId: 'REF001',
    height: 170,
    weight: 75,
    admissionFee: 2000,
    normalFigure: '40-32-38',
    fattyFigure: '15%'
  },
  {
    id: 'BGM002',
    name: 'Fatima Khatun',
    admissionDate: new Date('2024-02-20'),
    bloodGroup: 'A+',
    mobileNumber: '+8801823456789',
    idNumber: '2345678901234',
    age: 25,
    referenceId: 'REF002',
    height: 162,
    weight: 58,
    admissionFee: 1800,
    normalFigure: '36-28-36',
    fattyFigure: '18%'
  },
  {
    id: 'BGM003',
    name: 'Abdul Karim',
    admissionDate: new Date('2024-03-10'),
    bloodGroup: 'B+',
    mobileNumber: '+8801934567890',
    idNumber: '3456789012345',
    age: 32,
    referenceId: 'REF003',
    height: 175,
    weight: 82,
    admissionFee: 2200,
    normalFigure: '42-34-40',
    fattyFigure: '12%'
  },
  {
    id: 'BGM004',
    name: 'Rashida Begum',
    admissionDate: new Date('2024-04-05'),
    bloodGroup: 'AB+',
    mobileNumber: '+8801645678901',
    idNumber: '4567890123456',
    age: 30,
    referenceId: 'REF004',
    height: 165,
    weight: 63,
    admissionFee: 1900,
    normalFigure: '38-30-38',
    fattyFigure: '20%'
  },
  {
    id: 'BGM005',
    name: 'Shahidul Islam',
    admissionDate: new Date('2024-05-12'),
    bloodGroup: 'O-',
    mobileNumber: '+8801756789012',
    idNumber: '5678901234567',
    age: 26,
    referenceId: 'REF005',
    height: 168,
    weight: 70,
    admissionFee: 2100,
    normalFigure: '38-30-36',
    fattyFigure: '14%'
  }
];

async function seedBangladeshiMembers() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await dbConnect();
    
    console.log('🧹 Checking for existing members...');
    
    for (const memberData of bangladeshiMembers) {
      // Check if member already exists
      const existingMember = await Member.findOne({ id: memberData.id });
      
      if (existingMember) {
        console.log(`⚠️  Member ${memberData.name} (${memberData.id}) already exists, skipping...`);
        continue;
      }
      
      // Create new member
      const member = new Member(memberData);
      await member.save();
      console.log(`✅ Added member: ${memberData.name} (${memberData.id})`);
      
      // Create initial payment record for the current month
      const currentDate = new Date();
      const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
      const currentYear = currentDate.getFullYear();
      
      // Check if payment record already exists
      const existingPayment = await Payment.findOne({
        memberId: memberData.id,
        month: currentMonth,
        year: currentYear
      });
      
      if (!existingPayment) {
        const payment = new Payment({
          memberId: memberData.id,
          memberName: memberData.name,
          amount: 1500, // Monthly fee in BDT
          dueDate: new Date(currentYear, currentDate.getMonth(), 1),
          month: currentMonth,
          year: currentYear,
          status: 'due'
        });
        
        await payment.save();
        console.log(`💳 Created payment record for ${memberData.name}`);
      }
    }
    
    console.log('🎉 Successfully added Bangladeshi gym members!');
    console.log('📊 Database seeding completed.');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedBangladeshiMembers();
