// Utility functions for payment calculations

export function calculateOverdueMonths(payments: any[], memberId: string): number {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Get all payments for this member that are due
  const memberPayments = payments.filter(
    p => p.memberId === memberId && p.status === 'due'
  );

  // Count how many are actually overdue (past the current month)
  let overdueCount = 0;
  
  for (const payment of memberPayments) {
    const paymentDate = new Date(payment.year, getMonthIndex(payment.month));
    const currentMonthDate = new Date(currentYear, currentMonth);
    
    if (paymentDate < currentMonthDate) {
      overdueCount++;
    }
  }

  return overdueCount;
}

export function getMonthIndex(monthName: string): number {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months.indexOf(monthName);
}

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function getPaymentStatusWithOverdue(payments: any[], memberId: string): {
  status: 'paid' | 'due' | 'overdue';
  overdueCount: number;
  displayText: string;
} {
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();

  // Check current month payment
  const currentPayment = payments.find(p => 
    p.memberId === memberId && 
    p.month === currentMonth && 
    p.year === currentYear
  );

  const overdueCount = calculateOverdueMonths(payments, memberId);

  if (currentPayment?.status === 'paid' && overdueCount === 0) {
    return {
      status: 'paid',
      overdueCount: 0,
      displayText: 'Paid'
    };
  }

  if (overdueCount > 0) {
    return {
      status: 'overdue',
      overdueCount,
      displayText: `Due x ${overdueCount + (currentPayment?.status === 'due' ? 1 : 0)}`
    };
  }

  return {
    status: 'due',
    overdueCount: 0,
    displayText: 'Due'
  };
}
