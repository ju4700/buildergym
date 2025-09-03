const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Simple script to clear all data from the database for fresh start

async function clearDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('🗑️ Clearing all collections...');
    
    // Get all collection names
    const collections = await mongoose.connection.db.listCollections().toArray();
    
    if (collections.length === 0) {
      console.log('📭 Database is already empty.');
    } else {
      // Drop each collection
      for (let collection of collections) {
        await mongoose.connection.db.dropCollection(collection.name);
        console.log(`✅ Dropped collection: ${collection.name}`);
      }
    }
    
    console.log('🎉 Database cleared successfully! Ready for fresh start.');
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
    process.exit(0);
  }
}

clearDatabase();
