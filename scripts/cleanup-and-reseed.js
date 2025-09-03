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
  },
  monthlyFee: {
    type: Number,
    default: 500,
  },
  paymentDate: {
    type: Date,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  month: {
    type: String,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['paid', 'due', 'overdue'],
    default: 'due',
  },
  isFirstPayment: {
    type: Boolean,
    default: false,
  },
});

const Member = mongoose.model('Member', MemberSchema);
const Payment = mongoose.model('Payment', PaymentSchema);

// Updated members data for September 2025
const bangladeshiMembers = [
  {
    id: 'BD0001',
    name: 'রাহুল আহমেদ (Rahul Ahmed)',
    admissionDate: new Date('2025-09-01'),
    bloodGroup: 'B+',
    mobileNumber: '+880-1711-123456',
    age: 28,
    referenceId: 'REF001',
    height: 175,
    weight: 70,
    admissionFee: 5000,
    normalFigure: '36-32-34',
    fattyFigure: '38-34-36',
  },
  {
    id: 'BD0002',
    name: 'ফাতিমা খান (Fatima Khan)',
    admissionDate: new Date('2025-09-02'),
    bloodGroup: 'A+',
    mobileNumber: '+880-1712-234567',
    age: 25,
    referenceId: 'REF002',
    height: 162,
    weight: 55,
    admissionFee: 4500,
    normalFigure: '34-28-36',
    fattyFigure: '36-30-38',
  },
  {
    id: 'BD0003',
    name: 'মোহাম্মদ করিম (Mohammad Karim)',
    admissionDate: new Date('2025-09-03'),
    bloodGroup: 'O+',
    mobileNumber: '+880-1713-345678',
    age: 32,
    referenceId: 'REF003',
    height: 180,
    weight: 85,
    admissionFee: 6000,
    normalFigure: '42-36-38',
    fattyFigure: '44-38-40',
  },
  {
    id: 'BD0004',
    name: 'সালমা বেগম (Salma Begum)',
    admissionDate: new Date('2025-09-01'),
    bloodGroup: 'AB+',
    mobileNumber: '+880-1714-456789',
    age: 30,
    referenceId: 'REF004',
    height: 165,
    weight: 60,
    admissionFee: 5500,
    normalFigure: '36-30-38',
    fattyFigure: '38-32-40',
  },
  {
    id: 'BD0005',
    name: 'তানভীর হাসান (Tanvir Hasan)',
    admissionDate: new Date('2025-09-02'),
    bloodGroup: 'B-',
    mobileNumber: '+880-1715-567890',
    age: 26,
    referenceId: 'REF005',
    height: 178,
    weight: 75,
    admissionFee: 5200,
    normalFigure: '40-34-36',
    fattyFigure: '42-36-38',
  },
];

async function cleanupAndReseed() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildergym';
    await mongoose.connect(mongoUri);
    console.log('🔗 Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Cleaning up existing data...');
    await Member.deleteMany({});
    await Payment.deleteMany({});
    console.log('✅ Cleared all members and payments');

    // Add fresh members with September 2025 dates
    console.log('🌱 Seeding fresh data for September 2025...');
    
    for (const memberData of bangladeshiMembers) {
      // Create member
      const member = new Member(memberData);
      await member.save();
      console.log(`✅ Added member: ${memberData.name} (${memberData.id})`);

      // Create initial payment record for September 2025
      const monthlyFee = 500;
      const payment = new Payment({
        memberId: member.id,
        memberName: member.name,
        amount: member.admissionFee + monthlyFee,
        monthlyFee: monthlyFee,
        dueDate: new Date(2025, 8, 1), // September 1, 2025 (month is 0-indexed)
        month: 'September',
        year: 2025,
        status: 'due',
        isFirstPayment: true,
      });

      await payment.save();
      console.log(`💰 Created payment record for ${memberData.name}`);
    }

    console.log('\n🎉 Successfully cleaned and reseeded database!');
    console.log('📊 Summary:');
    console.log(`- Total members in database: ${await Member.countDocuments()}`);
    console.log(`- Total payment records: ${await Payment.countDocuments()}`);
    console.log('- All data is now for September 2025');

  } catch (error) {
    console.error('❌ Error during cleanup and reseed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

cleanupAndReseed();
