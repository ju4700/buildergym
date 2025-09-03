import mongoose from 'mongoose';

export interface IMember {
  _id?: string;
  id: string;
  name: string;
  admissionDate: Date;
  bloodGroup: string;
  mobileNumber: string;
  idNumber: string;
  age: number;
  referenceId: string;
  height: number;
  weight: number;
  admissionFee: number;
  normalFigure: string;
  fattyFigure: string;
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
    // Admission fee in BDT (Bangladeshi Taka)
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

export default mongoose.models.Member || mongoose.model<IMember>('Member', MemberSchema);