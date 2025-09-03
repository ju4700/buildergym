import mongoose from 'mongoose';

export interface IPayment {
  _id?: string;
  memberId: string;
  memberName: string;
  amount: number;
  dueDate: Date;
  paidDate?: Date;
  status: 'due' | 'paid';
  month: string;
  year: number;
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
    default: 0,
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
}, {
  timestamps: true,
});

PaymentSchema.index({ memberId: 1, month: 1, year: 1 }, { unique: true });

export default mongoose.models.Payment || mongoose.model<IPayment>('Payment', PaymentSchema);