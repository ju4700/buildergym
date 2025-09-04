# BuilderGym - Production Deployment Guide

## 🏋️ Application Overview
BuilderGym is a comprehensive gym management system built for Bangladesh-based fitness centers. It features member registration, payment management with BDT currency, automated member ID generation, and **secure admin authentication**.

## 🔐 Security Features
- **Admin Authentication**: Username/password protection
- **Session Management**: 24-hour automatic logout
- **Protected Routes**: All gym management features require authentication
- **Environment Security**: Credentials stored in environment variables

## 🚀 Quick Start for Client

### Prerequisites
- Node.js 18+ installed
- MongoDB database (local or cloud)
- Modern web browser

### 1. Initial Setup
```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
```

### 2. Environment Configuration
Edit `.env.local` with your MongoDB connection:
```env
MONGODB_URI=mongodb://localhost:27017/buildergym
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/buildergym
```

### 3. Database Setup
```bash
# Seed initial data (optional - includes 5 sample members)
node scripts/cleanup-and-reseed.js
```

### 4. Run Application
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Application will be available at: http://localhost:3000

## 📋 Core Features

### Member Management
- **Auto-Generated IDs**: Sequential BD0001, BD0002, etc.
- **Comprehensive Profiles**: Name, age, blood group, mobile, height/weight
- **Real-time ID Validation**: Prevents duplicate member IDs
- **Advanced Search**: Search by ID, name, mobile, blood group, etc.

### Payment System
- **BDT Currency**: Full Bangladesh Taka (৳) support
- **Accumulated Dues**: Unpaid amounts roll over to next month
- **Payment Tracking**: Admission fees + monthly fees (৳500)
- **Status Management**: Mark payments as paid/due

### Dashboard Analytics
- Total members count
- Monthly payment statistics
- Revenue tracking (paid vs pending)
- Member growth metrics

## 💡 Key Business Logic

### Payment Accumulation System
1. **Regular Payment**: ৳500 per month for current members
2. **First Payment**: Admission fee + ৳500 monthly fee
3. **Overdue Logic**: Unpaid amounts add to next month's bill
4. **Example**: 
   - Month 1: ৳500 (unpaid)
   - Month 2: ৳1000 (৳500 current + ৳500 previous)
   - Month 3: ৳1500 (৳500 current + ৳1000 previous)

### Member ID Generation
- **Format**: BD + 4-digit sequential number (BD0001, BD0002...)
- **Auto-generation**: Automatic on member creation
- **Editable**: Users can modify if needed
- **Validation**: Real-time availability checking

## 🔧 Administration Guide

### Adding New Members
1. Go to "Add Member" tab
2. ID auto-generates (editable)
3. Fill required information
4. System creates first payment record automatically

### Managing Payments
1. Go to "Payments" tab
2. View all payment records
3. Edit amounts by clicking on them
4. Mark as paid/due using toggle buttons
5. Generate monthly dues for all members

### Monthly Operations
1. **End of Month**: Click "Generate Monthly Dues"
2. **Review Payments**: Check who has paid/pending
3. **Follow Up**: Contact members with accumulated dues

## 🗂️ Database Structure

### Members Collection
- id (String): Unique member ID (BD0001)
- name (String): Member full name
- admissionDate (Date): Enrollment date
- bloodGroup (String): Blood type
- mobileNumber (String): Contact number
- age (Number): Member age
- referenceId (String): Reference member
- height/weight (Number): Physical stats
- admissionFee (Number): Initial payment

### Payments Collection
- memberId (String): Reference to member
- memberName (String): Member name for quick lookup
- amount (Number): Total amount due
- monthlyFee (Number): Base monthly fee (500)
- accumulatedDues (Number): Previous unpaid amounts
- month/year (String/Number): Payment period
- status (String): 'paid' or 'due'
- isFirstPayment (Boolean): Includes admission fee

## 🔒 Security Features
- ✅ No SQL injection vulnerabilities
- ✅ Input validation on all forms
- ✅ Unique constraints on member IDs
- ✅ Protected API endpoints
- ✅ Error handling throughout

## 🌐 Production Deployment

### Recommended Hosting
- **Vercel** (recommended for Next.js)
- **Railway**
- **DigitalOcean App Platform**
- **AWS/Heroku**

### Environment Variables for Production
```env
MONGODB_URI=your_production_mongodb_uri
NODE_ENV=production
```

### Build Commands
```bash
npm run build
npm start
```

## 📞 Support Information

### Common Operations
1. **Backup Database**: Use MongoDB export tools
2. **Add Bulk Members**: Modify seeding script as needed
3. **Custom Reports**: Extend dashboard components
4. **Payment History**: All data retained in payments collection

### Troubleshooting
- **Build Errors**: Run `rm -rf .next && npm run build`
- **Database Issues**: Check MongoDB connection string
- **Module Errors**: Run `npm install` to refresh dependencies

## 📊 Performance Notes
- **Optimized Build**: ~127kB initial bundle size
- **Database Indexes**: Optimized queries on member/payment lookups
- **Responsive Design**: Works on desktop, tablet, mobile
- **Fast Loading**: Static generation where possible

---

**Application Status**: ✅ Production Ready
**Last Updated**: September 2025
**Version**: 1.0.0
