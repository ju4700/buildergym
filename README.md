# BuilderGym - Gym Management System

A modern, feature-rich gym management system designed for Bangladesh-based fitness centers.

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your MongoDB connection string
   ```

3. **Run Application**
   ```bash
   npm run dev
   ```

4. **Clear Database (Optional)**
   ```bash
   node scripts/clear-database.js
   ```

5. **Access Application**
   Open http://localhost:3000 in your browser

## Key Features

- 🆔 **Auto Member IDs** - Sequential BD0001, BD0002 format
- 💰 **BDT Currency** - Full Bangladesh Taka support (৳500/month)
- 📊 **Payment Accumulation** - Unpaid amounts roll over to next month
- 🔍 **Advanced Search** - Find members by ID, name, mobile, etc.
- 📱 **Responsive Design** - Works on all devices

## Database Status

The system starts with a **clean, empty database** ready for your gym members.

To clear the database at any time, run:
```bash
node scripts/clear-database.js
```

## Support

For detailed setup and administration guide, see `PRODUCTION_GUIDE.md`

---

✅ **Status**: Production Ready | **Last Updated**: September 2025
