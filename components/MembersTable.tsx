'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Trash2, Calendar } from 'lucide-react';
import { IMember } from '@/models/Member';
import { IPayment } from '@/models/Payment';
import { getPaymentStatusWithOverdue, formatCurrency } from '@/lib/paymentUtils';

interface MembersTableProps {
  members: IMember[];
  payments: IPayment[];
  onEdit: (member: IMember) => void;
  onDelete: (memberId: string) => void;
  isLoading?: boolean;
}

export default function MembersTable({ members, payments, onEdit, onDelete, isLoading }: MembersTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const getPaymentStatusInfo = (memberId: string) => {
    return getPaymentStatusWithOverdue(payments, memberId);
  };

  const filteredMembers = members.filter(member =>
    Object.values(member).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center text-gray-500">Loading members...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Members Directory</CardTitle>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3 font-semibold text-gray-900">ID</th>
                <th className="text-left p-3 font-semibold text-gray-900">Name</th>
                <th className="text-left p-3 font-semibold text-gray-900 hidden sm:table-cell">Mobile</th>
                <th className="text-left p-3 font-semibold text-gray-900 hidden md:table-cell">Blood Group</th>
                <th className="text-left p-3 font-semibold text-gray-900 hidden lg:table-cell">Age</th>
                <th className="text-left p-3 font-semibold text-gray-900 hidden xl:table-cell">Admission Fee</th>
                <th className="text-left p-3 font-semibold text-gray-900">Payment Status</th>
                <th className="text-left p-3 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member._id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-900">{member.id}</td>
                  <td className="p-3">
                    <div>
                      <div className="font-medium text-gray-900">{member.name}</div>
                      <div className="text-sm text-gray-500 sm:hidden">{member.mobileNumber}</div>
                    </div>
                  </td>
                  <td className="p-3 text-gray-700 hidden sm:table-cell">{member.mobileNumber}</td>
                  <td className="p-3 text-gray-700 hidden md:table-cell">{member.bloodGroup}</td>
                  <td className="p-3 text-gray-700 hidden lg:table-cell">{member.age}</td>
                  <td className="p-3 text-gray-700 hidden xl:table-cell">{formatCurrency(member.admissionFee)}</td>
                  <td className="p-3">
                    {(() => {
                      const statusInfo = getPaymentStatusInfo(member.id);
                      return (
                        <Badge 
                          variant={statusInfo.status === 'paid' ? 'default' : 'destructive'}
                          className={
                            statusInfo.status === 'paid' 
                              ? 'bg-green-100 text-green-800 border-green-200' 
                              : statusInfo.status === 'overdue'
                              ? 'bg-orange-100 text-orange-800 border-orange-200'
                              : 'bg-red-100 text-red-800 border-red-200'
                          }
                        >
                          {statusInfo.displayText}
                        </Badge>
                      );
                    })()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEdit(member)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onDelete(member.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredMembers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              {searchTerm ? 'No members found matching your search.' : 'No members added yet.'}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}