import mongoose from 'mongoose';

export interface IPayment {
  _id?: string;
  memberId: string;
  memberName: string;
  amount: number; // Total amount in BDT (monthly fee + accumulated dues)
  monthlyFee: number; // Standard monthly fee in BDT
  dueDate: Date;
  paidDate?: Date;
  status: 'due' | 'paid';
  month: string;
  year: number;
  isFirstPayment?: boolean; // True if this includes admission fee
  accumulatedDues?: number; // Amount accumulated from previous unpaid months
  createdAt?: Date;
  updatedAt?: Date;
}

const PaymentSchema = new mongoose.Schema<IPayment>({
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
    // Total amount due (monthly fee + accumulated dues + admission if first payment)
  },
  monthlyFee: {
    type: Number,
    required: true,
    // Individual monthly fee for this specific member
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
  accumulatedDues: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

PaymentSchema.index({ memberId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);