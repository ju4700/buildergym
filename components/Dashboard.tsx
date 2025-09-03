'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { IMember } from '@/models/Member';
import { IPayment } from '@/models/Payment';

interface DashboardProps {
  members: IMember[];
  payments: IPayment[];
}

export default function Dashboard({ members, payments }: DashboardProps) {
  const [stats, setStats] = useState({
    totalMembers: 0,
    paidThisMonth: 0,
    dueThisMonth: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const currentDate = new Date();
    const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
    const currentYear = currentDate.getFullYear();

    const currentMonthPayments = payments.filter(p => 
      p.month === currentMonth && p.year === currentYear
    );

    const paidPayments = currentMonthPayments.filter(p => p.status === 'paid');
    const duePayments = currentMonthPayments.filter(p => p.status === 'due');
    const totalRevenue = paidPayments.reduce((sum, p) => sum + p.amount, 0);

    setStats({
      totalMembers: members.length,
      paidThisMonth: paidPayments.length,
      dueThisMonth: duePayments.length,
      totalRevenue,
    });
  }, [members, payments]);

  const statCards = [
    {
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Paid This Month',
      value: stats.paidThisMonth,
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Due This Month',
      value: stats.dueThisMonth,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Monthly Revenue',
      value: `$${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-full`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}