'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import Dashboard from '@/components/Dashboard';
import MemberForm from '@/components/MemberForm';
import MembersTable from '@/components/MembersTable';
import PaymentManagement from '@/components/PaymentManagement';
import { IMember } from '@/models/Member';
import { IPayment } from '@/models/Payment';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [members, setMembers] = useState<IMember[]>([]);
  const [payments, setPayments] = useState<IPayment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingMember, setEditingMember] = useState<IMember | null>(null);

  useEffect(() => {
    fetchMembers();
    fetchPayments();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      toast.error('Failed to fetch members');
    }
  };

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data);
      }
    } catch (error) {
      toast.error('Failed to fetch payments');
    }
  };

  const handleAddMember = async (memberData: Omit<IMember, '_id'>) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        await fetchMembers();
        await fetchPayments();
        setActiveTab('members');
        toast.success('Member added successfully');
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to add member');
      }
    } catch (error) {
      toast.error('Failed to add member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMember = async (memberData: Omit<IMember, '_id'>) => {
    if (!editingMember) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/members/${editingMember.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(memberData),
      });

      if (response.ok) {
        await fetchMembers();
        await fetchPayments();
        setEditingMember(null);
        setActiveTab('members');
        toast.success('Member updated successfully');
      } else {
        toast.error('Failed to update member');
      }
    } catch (error) {
      toast.error('Failed to update member');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member? This will also delete all payment records.')) {
      return;
    }

    try {
      const response = await fetch(`/api/members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchMembers();
        await fetchPayments();
        toast.success('Member deleted successfully');
      } else {
        toast.error('Failed to delete member');
      }
    } catch (error) {
      toast.error('Failed to delete member');
    }
  };

  const handleUpdatePayment = async (paymentId: string, status: 'paid' | 'due', amount?: number) => {
    try {
      const updateData: { status: 'paid' | 'due'; amount?: number } = { status };
      if (amount !== undefined) {
        updateData.amount = amount;
      }

      const response = await fetch(`/api/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });

      if (response.ok) {
        await fetchPayments();
        toast.success(`Payment marked as ${status}`);
      } else {
        toast.error('Failed to update payment');
      }
    } catch (error) {
      toast.error('Failed to update payment');
    }
  };

  const handleGenerateMonthlyDues = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/payments', {
        method: 'POST',
      });

      if (response.ok) {
        const result = await response.json();
        await fetchPayments();
        toast.success(result.message);
      } else {
        toast.error('Failed to generate monthly dues');
      }
    } catch (error) {
      toast.error('Failed to generate monthly dues');
    } finally {
      setIsLoading(false);
    }
  };

  const startEditing = (member: IMember) => {
    setEditingMember(member);
    setActiveTab('add-member');
  };

  const cancelEditing = () => {
    setEditingMember(null);
    setActiveTab('members');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <Dashboard members={members} payments={payments} />
          </div>
        )}

        {activeTab === 'members' && (
          <MembersTable
            members={members}
            payments={payments}
            onEdit={startEditing}
            onDelete={handleDeleteMember}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'add-member' && (
          <MemberForm
            member={editingMember || undefined}
            onSubmit={editingMember ? handleEditMember : handleAddMember}
            onCancel={editingMember ? cancelEditing : undefined}
            isLoading={isLoading}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentManagement
            payments={payments}
            onUpdatePayment={handleUpdatePayment}
            onGenerateMonthlyDues={handleGenerateMonthlyDues}
            isLoading={isLoading}
          />
        )}
      </main>
    </div>
  );
}