import mongoose from 'mongoose';

export interface IMember {
  _id?: string;
  id: string;
  name: string;
  admissionDate: Date;
  bloodGroup: string;
  mobileNumber: string;
  age: number;
  referenceId: string;
  height: number;
  weight: number;
  admissionFee: number; // Fixed at 2000
  discountedFee: number; // Actual admission fee after discount
  monthlySalary: number; // Individual monthly fee for this member
  bodyType: 'Normal' | 'Fatty'; // Single selectable body type
  image?: string; // Base64 encoded image data
  createdAt?: Date;
  updatedAt?: Date;
}

const MemberSchema = new mongoose.Schema<IMember>({
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
    default: 2000, // Fixed admission fee in BDT
  },
  discountedFee: {
    type: Number,
    required: true,
    // Actual admission fee after discount
  },
  monthlySalary: {
    type: Number,
    required: true,
    // Individual monthly fee for this member
  },
  bodyType: {
    type: String,
    required: true,
    enum: ['Normal', 'Fatty'],
    // Single selectable body type option
  },
  image: {
    type: String,
    required: false,
    // Base64 encoded image data
  },
}, {
  timestamps: true,
});

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);