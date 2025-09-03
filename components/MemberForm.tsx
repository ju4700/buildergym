'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IMember } from '@/models/Member';

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
    idNumber: member?.idNumber || '',
    age: member?.age || '',
    referenceId: member?.referenceId || '',
    height: member?.height || '',
    weight: member?.weight || '',
    admissionFee: member?.admissionFee || '',
    normalFigure: member?.normalFigure || '',
    fattyFigure: member?.fattyFigure || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      admissionDate: new Date(formData.admissionDate),
      age: Number(formData.age),
      height: Number(formData.height),
      weight: Number(formData.weight),
      admissionFee: Number(formData.admissionFee),
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
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => handleChange('id', e.target.value)}
                placeholder="Enter unique member ID"
                required
                disabled={!!member}
              />
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
              <Input
                id="bloodGroup"
                value={formData.bloodGroup}
                onChange={(e) => handleChange('bloodGroup', e.target.value)}
                placeholder="e.g., A+, B-, O+"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Mobile Number *</Label>
              <Input
                id="mobileNumber"
                value={formData.mobileNumber}
                onChange={(e) => handleChange('mobileNumber', e.target.value)}
                placeholder="Enter mobile number"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="idNumber">ID Number *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleChange('idNumber', e.target.value)}
                placeholder="Enter ID number"
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
                value={formData.admissionFee}
                onChange={(e) => handleChange('admissionFee', e.target.value)}
                placeholder="Enter admission fee in BDT (e.g., 2000)"
                required
              />
              <p className="text-sm text-gray-500">Note: Monthly fee is 500 BDT (added automatically)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="normalFigure">Normal Figure *</Label>
              <Input
                id="normalFigure"
                value={formData.normalFigure}
                onChange={(e) => handleChange('normalFigure', e.target.value)}
                placeholder="Enter normal figure"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="fattyFigure">Fatty Figure *</Label>
              <Input
                id="fattyFigure"
                value={formData.fattyFigure}
                onChange={(e) => handleChange('fattyFigure', e.target.value)}
                placeholder="Enter fatty figure"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
              disabled={isLoading}
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