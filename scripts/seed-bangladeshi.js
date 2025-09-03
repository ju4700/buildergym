const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Member Schema
const MemberSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  admissionDate: {
    type: Date,
    required: true,
  },
  bloodGroup: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: String,
    required: true,
  },
  idNumber: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  referenceId: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  admissionFee: {
    type: Number,
    required: true,
  },
  normalFigure: {
    type: String,
    required: true,
  },
  fattyFigure: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

// Payment Schema
const PaymentSchema = new mongoose.Schema({
  memberId: {
    type: String,
    required: true,
  },
  memberName: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    default: 500,
  },
  monthlyFee: {
    type: Number,
    required: true,
    default: 500,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  paidDate: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['due', 'paid'],
    default: 'due',
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  isFirstPayment: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

PaymentSchema.index({ memberId: 1, month: 1, year: 1 }, { unique: true });

const Member = mongoose.model('Member', MemberSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// Sample Bangladeshi gym members
const bangladeshiMembers = [
  {
    id: 'BD001',
    name: 'রাহুল আহমেদ (Rahul Ahmed)',
    admissionDate: new Date('2024-01-15'),
    bloodGroup: 'B+',
    mobileNumber: '+880-1711-123456',
    idNumber: '1234567890123', // Bangladeshi NID format
    age: 28,
    referenceId: 'REF001',
    height: 175, // cm
    weight: 70, // kg
    admissionFee: 5000, // BDT
    normalFigure: '36-32-34',
    fattyFigure: '38-34-36',
  },
  {
    id: 'BD002',
    name: 'ফাতিমা খান (Fatima Khan)',
    admissionDate: new Date('2024-02-10'),
    bloodGroup: 'A+',
    mobileNumber: '+880-1712-234567',
    idNumber: '2345678901234',
    age: 25,
    referenceId: 'REF002',
    height: 162, // cm
    weight: 55, // kg
    admissionFee: 4500, // BDT
    normalFigure: '34-28-36',
    fattyFigure: '36-30-38',
  },
  {
    id: 'BD003',
    name: 'মোহাম্মদ করিম (Mohammad Karim)',
    admissionDate: new Date('2024-03-05'),
    bloodGroup: 'O+',
    mobileNumber: '+880-1713-345678',
    idNumber: '3456789012345',
    age: 32,
    referenceId: 'REF003',
    height: 180, // cm
    weight: 85, // kg
    admissionFee: 6000, // BDT
    normalFigure: '42-36-38',
    fattyFigure: '44-38-40',
  },
  {
    id: 'BD004',
    name: 'সালমা বেগম (Salma Begum)',
    admissionDate: new Date('2024-04-20'),
    bloodGroup: 'AB+',
    mobileNumber: '+880-1714-456789',
    idNumber: '4567890123456',
    age: 30,
    referenceId: 'REF004',
    height: 165, // cm
    weight: 60, // kg
    admissionFee: 5500, // BDT
    normalFigure: '36-30-38',
    fattyFigure: '38-32-40',
  },
  {
    id: 'BD005',
    name: 'তানভীর হাসান (Tanvir Hasan)',
    admissionDate: new Date('2024-05-15'),
    bloodGroup: 'B-',
    mobileNumber: '+880-1715-567890',
    idNumber: '5678901234567',
    age: 26,
    referenceId: 'REF005',
    height: 178, // cm
    weight: 75, // kg
    admissionFee: 5200, // BDT
    normalFigure: '40-34-36',
    fattyFigure: '42-36-38',
  },
];

async function seedBangladeshiMembers() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data (optional - remove this if you want to keep existing data)
    // await Member.deleteMany({});
    // await Payment.deleteMany({});
    // console.log('🗑️ Cleared existing data');

    // Insert members
    console.log('📝 Adding Bangladeshi gym members...');
    
    for (const memberData of bangladeshiMembers) {
      try {
        // Check if member already exists
        const existingMember = await Member.findOne({ id: memberData.id });
        if (existingMember) {
          console.log(`⚠️ Member ${memberData.name} (${memberData.id}) already exists, skipping...`);
          continue;
        }

        // Create member
        const member = new Member(memberData);
        await member.save();
        console.log(`✅ Added member: ${memberData.name} (${memberData.id})`);

        // Create initial payment record
        const currentDate = new Date();
        const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
        const currentYear = currentDate.getFullYear();
        const monthlyFee = 500; // Monthly fee in BDT

        const payment = new Payment({
          memberId: member.id,
          memberName: member.name,
          amount: member.admissionFee + monthlyFee, // Admission fee + monthly fee for first payment
          monthlyFee: monthlyFee,
          dueDate: new Date(currentYear, currentDate.getMonth(), 1),
          month: currentMonth,
          year: currentYear,
          status: 'due',
          isFirstPayment: true,
        });

        await payment.save();
        console.log(`💰 Created payment record for ${memberData.name}`);

      } catch (error) {
        if (error.code === 11000) {
          console.log(`⚠️ Member ${memberData.name} already exists, skipping...`);
        } else {
          console.error(`❌ Error adding ${memberData.name}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Successfully seeded Bangladeshi gym members!');
    console.log('📊 Summary:');
    console.log(`- Total members in database: ${await Member.countDocuments()}`);
    console.log(`- Total payment records: ${await Payment.countDocuments()}`);

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the seeding function
seedBangladeshiMembers();
