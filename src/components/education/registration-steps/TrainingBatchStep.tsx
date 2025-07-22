
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TrainingBatchStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function TrainingBatchStep({ formData, updateFormData }: TrainingBatchStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Training & Batch Details</h3>
      
      <div className="text-sm text-muted-foreground mb-4">
        Note: Most fields in this section are system-populated after candidate enrollment in a batch.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Batch Information */}
        <div className="space-y-2">
          <Label htmlFor="batch_id">Batch ID</Label>
          <Input
            id="batch_id"
            value={formData.batch_id || ''}
            onChange={(e) => handleInputChange('batch_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_start_date">Batch Start Date</Label>
          <Input
            id="batch_start_date"
            type="date"
            value={formData.batch_start_date || ''}
            onChange={(e) => handleInputChange('batch_start_date', e.target.value)}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="batch_end_date">Batch End Date</Label>
          <Input
            id="batch_end_date"
            type="date"
            value={formData.batch_end_date || ''}
            onChange={(e) => handleInputChange('batch_end_date', e.target.value)}
            disabled
          />
        </div>

        {/* Trainer Information */}
        <div className="space-y-2">
          <Label htmlFor="trainer_id">Trainer ID</Label>
          <Input
            id="trainer_id"
            value={formData.trainer_id || ''}
            onChange={(e) => handleInputChange('trainer_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="trainer_name">Trainer Name</Label>
          <Input
            id="trainer_name"
            value={formData.trainer_name || ''}
            onChange={(e) => handleInputChange('trainer_name', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        {/* Course Information */}
        <div className="space-y-2">
          <Label htmlFor="course_id">Course ID</Label>
          <Input
            id="course_id"
            value={formData.course_id || ''}
            onChange={(e) => handleInputChange('course_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_name">Course Name</Label>
          <Input
            id="course_name"
            value={formData.course_name || ''}
            onChange={(e) => handleInputChange('course_name', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_type">Course Type</Label>
          <Input
            id="course_type"
            value={formData.course_type || ''}
            onChange={(e) => handleInputChange('course_type', e.target.value)}
            placeholder="QP/NOS Aligned or Non-QP NOS Aligned"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sector_covered">Sector Covered</Label>
          <Input
            id="sector_covered"
            value={formData.sector_covered || ''}
            onChange={(e) => handleInputChange('sector_covered', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="course_fee">Course Fee</Label>
          <Input
            id="course_fee"
            type="number"
            value={formData.course_fee || ''}
            onChange={(e) => handleInputChange('course_fee', parseFloat(e.target.value) || 0)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fee_paid_by">Fee Paid By</Label>
          <Input
            id="fee_paid_by"
            value={formData.fee_paid_by || ''}
            onChange={(e) => handleInputChange('fee_paid_by', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        {/* Training Center Information */}
        <div className="space-y-2">
          <Label htmlFor="tc_id">TC ID</Label>
          <Input
            id="tc_id"
            value={formData.tc_id || ''}
            onChange={(e) => handleInputChange('tc_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tc_name">TC Name</Label>
          <Input
            id="tc_name"
            value={formData.tc_name || ''}
            onChange={(e) => handleInputChange('tc_name', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tc_centre">TC Centre</Label>
          <Input
            id="tc_centre"
            value={formData.tc_centre || ''}
            onChange={(e) => handleInputChange('tc_centre', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tc_district">TC District</Label>
          <Input
            id="tc_district"
            value={formData.tc_district || ''}
            onChange={(e) => handleInputChange('tc_district', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tc_pin_code">TC PIN Code</Label>
          <Input
            id="tc_pin_code"
            value={formData.tc_pin_code || ''}
            onChange={(e) => handleInputChange('tc_pin_code', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>
      </div>
    </div>
  );
}
