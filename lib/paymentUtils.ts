// Utility functions for payment calculations

export function formatCurrency(amount: number): string {
  return `৳${amount.toLocaleString('en-BD')}`;
}

export function getPaymentStatus(payments: any[], memberId: string): {
  status: 'paid' | 'due';
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

  if (currentPayment?.status === 'paid') {
    return {
      status: 'paid',
      displayText: 'Paid'
    };
  }

  return {
    status: 'due',
    displayText: 'Due'
  };
}
