'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { IMember } from '@/models/Member';
import { generateMemberId, checkMemberIdAvailability, generateNextAvailableId } from '@/lib/memberIdUtils';

interface MemberFormProps {
  member?: IMember;
  onSubmit: (member: Omit<IMember, '_id'>) => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export default function MemberForm({ member, onSubmit, onCancel, isLoading }: MemberFormProps) {
  const [formData, setFormData] = useState({
    id: member?.id || '',
    name: member?.name || '',
    admissionDate: member?.admissionDate ? new Date(member.admissionDate).toISOString().split('T')[0] : '',
    bloodGroup: member?.bloodGroup || '',
    mobileNumber: member?.mobileNumber || '',
    age: member?.age || '',
    referenceId: member?.referenceId || '',
    height: member?.height || '',
    weight: member?.weight || '',
    admissionFee: member?.admissionFee || 2000, // Fixed admission fee
    discountedFee: member?.discountedFee || '',
    monthlySalary: member?.monthlySalary || '',
    bodyType: member?.bodyType || '',
  });

  const [idStatus, setIdStatus] = useState<{
    isChecking: boolean;
    isAvailable: boolean | null;
    message: string;
    suggestion?: string;
  }>({
    isChecking: false,
    isAvailable: null,
    message: '',
  });

  // Auto-generate ID for new members
  useEffect(() => {
    if (!member) {
      generateNextAvailableId().then(autoId => {
        setFormData(prev => ({ ...prev, id: autoId }));
        checkIdAvailability(autoId);
      });
    }
  }, [member]);

  // Reset form when member prop changes (including when it becomes null/undefined)
  useEffect(() => {
    setFormData({
      id: member?.id || '',
      name: member?.name || '',
      admissionDate: member?.admissionDate ? new Date(member.admissionDate).toISOString().split('T')[0] : '',
      bloodGroup: member?.bloodGroup || '',
      mobileNumber: member?.mobileNumber || '',
      age: member?.age || '',
      referenceId: member?.referenceId || '',
      height: member?.height || '',
      weight: member?.weight || '',
      admissionFee: 2000, // Always fixed at 2000
      discountedFee: member?.discountedFee || '',
      monthlySalary: member?.monthlySalary || '',
      bodyType: member?.bodyType || '',
    });
    
    // Reset ID status when switching between add/edit
    if (member) {
      setIdStatus({
        isChecking: false,
        isAvailable: true,
        message: 'Existing member ID',
      });
    } else {
      setIdStatus({
        isChecking: false,
        isAvailable: null,
        message: '',
      });
    }
  }, [member]);

  // Debounced ID availability check
  useEffect(() => {
    if (!formData.id || member) return; // Skip if editing existing member

    const timeoutId = setTimeout(() => {
      checkIdAvailability(formData.id);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.id, member]);

  const checkIdAvailability = async (memberId: string) => {
    if (!memberId) return;

    setIdStatus(prev => ({ ...prev, isChecking: true }));

    try {
      const result = await checkMemberIdAvailability(memberId);
      setIdStatus({
        isChecking: false,
        isAvailable: result.available,
        message: result.message,
        suggestion: result.suggestion,
      });
    } catch (error) {
      setIdStatus({
        isChecking: false,
        isAvailable: false,
        message: 'Error checking ID availability',
      });
    }
  };

  const useSuggestion = () => {
    if (idStatus.suggestion) {
      setFormData(prev => ({ ...prev, id: idStatus.suggestion! }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For new members, check if ID is available before submitting
    if (!member && !idStatus.isAvailable) {
      alert('Please use an available Member ID before submitting.');
      return;
    }
    
    onSubmit({
      ...formData,
      admissionDate: new Date(formData.admissionDate),
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      admissionFee: Number(formData.admissionFee),
      discountedFee: Number(formData.discountedFee),
      monthlySalary: Number(formData.monthlySalary),
      bodyType: formData.bodyType as 'Normal' | 'Fatty',
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">
          {member ? 'Edit Member' : 'Add New Member'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="id">Member ID *</Label>
              <div className="space-y-2">
                <Input
                  id="id"
                  value={formData.id}
                  onChange={(e) => handleChange('id', e.target.value)}
                  placeholder="Enter unique member ID (e.g., BD0001)"
                  required
                  disabled={!!member}
                  className={
                    !member && idStatus.isAvailable !== null
                      ? idStatus.isAvailable
                        ? 'border-green-500 focus:border-green-500'
                        : 'border-red-500 focus:border-red-500'
                      : ''
                  }
                />
                {!member && (
                  <div className="text-sm">
                    {idStatus.isChecking ? (
                      <span className="text-gray-500">Checking availability...</span>
                    ) : idStatus.isAvailable !== null ? (
                      <div className="space-y-2">
                        <span
                          className={
                            idStatus.isAvailable ? 'text-green-600' : 'text-red-600'
                          }
                        >
                          {idStatus.message}
                        </span>
                        {!idStatus.isAvailable && idStatus.suggestion && (
                          <div className="flex items-center gap-2">
                            <span className="text-gray-600">
                              Suggestion: {idStatus.suggestion}
                            </span>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={useSuggestion}
                              className="text-xs px-2 py-1 h-6"
                            >
                              Use This
                            </Button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">Auto-generated ID (editable)</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Enter member name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionDate">Admission Date *</Label>
              <Input
                id="admissionDate"
                type="date"
                value={formData.admissionDate}
                onChange={(e) => handleChange('admissionDate', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group *</Label>
              <Select
                value={formData.bloodGroup}
                onValueChange={(value) => handleChange('bloodGroup', value)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select blood group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                placeholder="Enter mobile number (e.g., +880-1711-123456)"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder="Enter age"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="referenceId">Reference ID *</Label>
              <Input
                id="referenceId"
                value={formData.referenceId}
                onChange={(e) => handleChange('referenceId', e.target.value)}
                placeholder="Enter reference ID"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm) *</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                value={formData.height}
                onChange={(e) => handleChange('height', e.target.value)}
                placeholder="Enter height in cm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => handleChange('weight', e.target.value)}
                placeholder="Enter weight in kg"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admissionFee">Admission Fee (BDT) *</Label>
              <Input
                id="admissionFee"
                type="number"
                step="1"
                min="0"
                value={2000}
                disabled
                className="bg-gray-100"
                placeholder="Fixed admission fee"
                required
              />
              <p className="text-sm text-gray-500">Fixed admission fee: ৳2000</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountedFee">Discounted Fee (BDT) *</Label>
              <Input
                id="discountedFee"
                type="number"
                step="1"
                min="0"
                value={formData.discountedFee}
                onChange={(e) => handleChange('discountedFee', e.target.value)}
                placeholder="Enter actual fee after discount (e.g., 1800)"
                required
              />
              <p className="text-sm text-gray-500">Actual admission amount to be paid (after any discount)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlySalary">Monthly Fee (BDT) *</Label>
              <Input
                id="monthlySalary"
                type="number"
                step="1"
                min="0"
                value={formData.monthlySalary}
                onChange={(e) => handleChange('monthlySalary', e.target.value)}
                placeholder="Enter monthly fee for this member (e.g., 500)"
                required
              />
              <p className="text-sm text-gray-500">Individual monthly fee for this member</p>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label>Body Type *</Label>
              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="normal"
                    name="bodyType"
                    value="Normal"
                    checked={formData.bodyType === 'Normal'}
                    onChange={(e) => handleChange('bodyType', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    required
                  />
                  <Label htmlFor="normal" className="text-sm font-normal cursor-pointer">
                    Normal Figure
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="fatty"
                    name="bodyType"
                    value="Fatty"
                    checked={formData.bodyType === 'Fatty'}
                    onChange={(e) => handleChange('bodyType', e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                    required
                  />
                  <Label htmlFor="fatty" className="text-sm font-normal cursor-pointer">
                    Fatty Figure
                  </Label>
                </div>
              </div>
              <p className="text-sm text-gray-500">Select the member's body type classification</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
              disabled={
                isLoading || 
                (!member && (!idStatus.isAvailable || idStatus.isChecking))
              }
            >
              {isLoading ? 'Saving...' : (member ? 'Update Member' : 'Add Member')}
            </Button>
            {onCancel && (
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}