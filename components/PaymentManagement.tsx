'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, DollarSign, Search } from 'lucide-react';
import { IPayment } from '@/models/Payment';
import { formatCurrency } from '@/lib/paymentUtils';

interface PaymentManagementProps {
  payments: IPayment[];
  onUpdatePayment: (paymentId: string, status: 'paid' | 'due', amount?: number) => void;
  onGenerateMonthlyDues: () => void;
  isLoading?: boolean;
}

export default function PaymentManagement({ 
  payments, 
  onUpdatePayment, 
  onGenerateMonthlyDues, 
  isLoading 
}: PaymentManagementProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingPayment, setEditingPayment] = useState<string | null>(null);
  const [tempAmount, setTempAmount] = useState<number>(0);

  // Check if monthly payments already generated for current month
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  const nextMonth = new Date(currentYear, currentDate.getMonth() + 1);
  const nextMonthName = nextMonth.toLocaleString('default', { month: 'long' });
  const nextYear = nextMonth.getFullYear();
  
  const currentMonthPayments = payments.filter(p => 
    p.month === currentMonth && p.year === currentYear
  );
  
  const hasCurrentMonthPayments = currentMonthPayments.length > 0;
  const totalMembersWithCurrentPayments = currentMonthPayments.length;

  const filteredPayments = payments.filter(payment =>
    (payment.memberName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.memberId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (payment.month || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAmountUpdate = (paymentId: string, amount: number, status: 'paid' | 'due') => {
    onUpdatePayment(paymentId, status, amount);
    setEditingPayment(null);
  };

  const startEditing = (payment: IPayment) => {
    setEditingPayment(payment._id!);
    setTempAmount(payment.amount);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <DollarSign className="h-6 w-6" />
            Payment Management
          </CardTitle>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search payments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button 
              onClick={onGenerateMonthlyDues}
              disabled={isLoading || hasCurrentMonthPayments}
              className={`${
                hasCurrentMonthPayments 
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                  : 'bg-gray-900 hover:bg-gray-800 text-white'
              }`}
              title={
                hasCurrentMonthPayments 
                  ? `Payments already generated for ${currentMonth} ${currentYear}` 
                  : `Generate monthly payments for all members for ${currentMonth} ${currentYear}`
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              {hasCurrentMonthPayments 
                ? `${currentMonth} Payments Generated ✓` 
                : 'Generate Monthly Dues'
              }
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className={`mb-4 p-3 rounded-lg border ${
            hasCurrentMonthPayments 
              ? 'bg-green-50 border-green-200' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <p className={`text-sm ${
              hasCurrentMonthPayments 
                ? 'text-green-800' 
                : 'text-blue-800'
            }`}>
              {hasCurrentMonthPayments ? (
                <>
                  <strong>✅ {currentMonth} {currentYear} Payments Generated:</strong> Monthly dues have been created for {totalMembersWithCurrentPayments} members based on their individual monthly fees. 
                  <br />
                  <span className="text-green-600">Next generation available: {nextMonthName} {nextYear}</span>
                </>
              ) : (
                <>
                  <strong>Monthly Dues:</strong> Click "Generate Monthly Dues" to create payment records for all members for {currentMonth} {currentYear} based on their individual monthly fees. This will only create new records - existing payments for the current month won't be duplicated.
                </>
              )}
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold text-gray-900">Member</th>
                  <th className="text-left p-3 font-semibold text-gray-900 hidden sm:table-cell">Month/Year</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Amount</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPayments.map((payment) => (
                  <tr key={payment._id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-3">
                      <div>
                        <div className="font-medium text-gray-900">{payment.memberName}</div>
                        <div className="text-sm text-gray-500">ID: {payment.memberId}</div>
                        <div className="text-sm text-gray-500 sm:hidden">
                          {payment.month} {payment.year}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-700 hidden sm:table-cell">
                      {payment.month} {payment.year}
                    </td>
                    <td className="p-3">
                      {editingPayment === payment._id ? (
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-gray-600">৳</span>
                          <Input
                            type="number"
                            step="1"
                            min="0"
                            value={tempAmount}
                            onChange={(e) => setTempAmount(Number(e.target.value))}
                            className="w-24"
                            placeholder="Amount in BDT"
                            onBlur={() => setEditingPayment(null)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleAmountUpdate(payment._id!, tempAmount, payment.status);
                              }
                              if (e.key === 'Escape') {
                                setEditingPayment(null);
                              }
                            }}
                            autoFocus
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => startEditing(payment)}
                          className="text-gray-900 hover:text-gray-700 font-medium"
                        >
                          <div>
                            <div>{formatCurrency(payment.amount)}</div>
                            {payment.isFirstPayment && (
                              <div className="text-xs text-gray-500">(Admission + Monthly)</div>
                            )}
                            {payment.accumulatedDues && payment.accumulatedDues > 0 && (
                              <div className="text-xs text-orange-600">
                                ({formatCurrency(payment.monthlyFee)} current + {formatCurrency(payment.accumulatedDues)} previous)
                              </div>
                            )}
                          </div>
                        </button>
                      )}
                    </td>
                    <td className="p-3">
                      <Badge 
                        variant={payment.status === 'paid' ? 'default' : 'destructive'}
                        className={
                          payment.status === 'paid' 
                            ? 'bg-green-100 text-green-800 border-green-200' 
                            : 'bg-red-100 text-red-800 border-red-200'
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="p-3">
                      <Button
                        size="sm"
                        variant={payment.status === 'paid' ? 'outline' : 'default'}
                        onClick={() => onUpdatePayment(
                          payment._id!, 
                          payment.status === 'paid' ? 'due' : 'paid'
                        )}
                        className={
                          payment.status === 'paid' 
                            ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }
                      >
                        {payment.status === 'paid' ? 'Mark Due' : 'Mark Paid'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            {filteredPayments.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? 'No payments found matching your search.' : 'No payment records yet.'}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}