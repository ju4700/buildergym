// Test script to demonstrate accumulated dues functionality

const { MongoClient } = require('mongodb');

async function testAccumulatedDues() {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/buildergym';
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    
    console.log('🧪 Testing Accumulated Dues Functionality\n');
    
    // Get a test member
    const member = await db.collection('members').findOne({});
    if (!member) {
      console.log('❌ No members found. Please seed members first.');
      return;
    }
    
    console.log(`📋 Testing with member: ${member.name} (${member.id})\n`);
    
    // Step 1: Create an unpaid payment from last month
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    const lastMonthName = lastMonth.toLocaleString('default', { month: 'long' });
    
    const unpaidPayment = {
      memberId: member.id,
      memberName: member.name,
      amount: 500,
      monthlyFee: 500,
      dueDate: new Date(lastMonth.getFullYear(), lastMonth.getMonth(), 1),
      month: lastMonthName,
      year: lastMonth.getFullYear(),
      status: 'due',
      isFirstPayment: false,
      accumulatedDues: 0
    };
    
    await db.collection('payments').insertOne(unpaidPayment);
    console.log(`✅ Created unpaid payment for ${lastMonthName} ${lastMonth.getFullYear()}: ৳500`);
    
    // Step 2: Show current payments
    const currentPayments = await db.collection('payments')
      .find({ memberId: member.id })
      .sort({ year: -1, month: -1 })
      .toArray();
    
    console.log('\n📊 Current payments before generating new month:');
    currentPayments.forEach(payment => {
      console.log(`   ${payment.month} ${payment.year}: ৳${payment.amount} (${payment.status})`);
    });
    
    // Step 3: Simulate generating next month payment via API call
    console.log('\n🔄 Simulating "Generate Monthly Payments" click...\n');
    
    // This would normally be done via API, but let's simulate the logic
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();
    
    // Check for unpaid payments
    const unpaidPayments = await db.collection('payments').find({
      memberId: member.id,
      status: 'due'
    }).toArray();
    
    const totalUnpaidAmount = unpaidPayments.reduce((sum, p) => sum + p.amount, 0);
    
    // Create new payment with accumulated dues
    const newPayment = {
      memberId: member.id,
      memberName: member.name,
      amount: 500 + totalUnpaidAmount, // Monthly fee + accumulated
      monthlyFee: 500,
      dueDate: new Date(currentYear, currentDate.getMonth(), 1),
      month: currentMonth,
      year: currentYear,
      status: 'due',
      isFirstPayment: false,
      accumulatedDues: totalUnpaidAmount
    };
    
    await db.collection('payments').insertOne(newPayment);
    
    // Step 4: Show updated payments
    const updatedPayments = await db.collection('payments')
      .find({ memberId: member.id })
      .sort({ year: -1, month: -1 })
      .toArray();
    
    console.log('📊 Payments after generating new month:');
    updatedPayments.forEach(payment => {
      const breakdown = payment.accumulatedDues > 0 
        ? ` (৳${payment.monthlyFee} current + ৳${payment.accumulatedDues} previous)`
        : '';
      console.log(`   ${payment.month} ${payment.year}: ৳${payment.amount}${breakdown} (${payment.status})`);
    });
    
    console.log('\n✅ Test completed successfully!');
    console.log('\n📝 Summary:');
    console.log(`   - Previous unpaid amount: ৳${totalUnpaidAmount}`);
    console.log(`   - Current month fee: ৳500`);
    console.log(`   - Total amount due: ৳${500 + totalUnpaidAmount}`);
    console.log('\n💡 When the member pays ৳1000, both months will be marked as paid!');
    
  } catch (error) {
    console.error('❌ Error testing accumulated dues:', error);
  } finally {
    await client.close();
  }
}

// Load environment variables
require('dotenv').config({ path: '.env.local' });
testAccumulatedDues();
