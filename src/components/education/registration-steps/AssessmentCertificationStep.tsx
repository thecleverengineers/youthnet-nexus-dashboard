
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AssessmentCertificationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function AssessmentCertificationStep({ formData, updateFormData }: AssessmentCertificationStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const assessmentStatusOptions = ['Pass', 'Fail', 'Not-Appeared'];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Assessment & Certification</h3>
      
      <div className="text-sm text-muted-foreground mb-4">
        Note: Assessment fields are auto-populated if Assessment Mode is SSC.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Assessment Information */}
        <div className="space-y-2">
          <Label htmlFor="assessment_mode">Assessment Mode</Label>
          <Input
            id="assessment_mode"
            value={formData.assessment_mode || ''}
            onChange={(e) => handleInputChange('assessment_mode', e.target.value)}
            placeholder="System populated based on batch details"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessment_agency_id">Assessment Agency ID</Label>
          <Input
            id="assessment_agency_id"
            value={formData.assessment_agency_id || ''}
            onChange={(e) => handleInputChange('assessment_agency_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessment_agency_name">Assessment Agency Name</Label>
          <Input
            id="assessment_agency_name"
            value={formData.assessment_agency_name || ''}
            onChange={(e) => handleInputChange('assessment_agency_name', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessor_id">Assessor ID</Label>
          <Input
            id="assessor_id"
            value={formData.assessor_id || ''}
            onChange={(e) => handleInputChange('assessor_id', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessor_name">Assessor Name</Label>
          <Input
            id="assessor_name"
            value={formData.assessor_name || ''}
            onChange={(e) => handleInputChange('assessor_name', e.target.value)}
            placeholder="System populated"
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessment_from_date">Assessment From Date</Label>
          <Input
            id="assessment_from_date"
            type="date"
            value={formData.assessment_from_date || ''}
            onChange={(e) => handleInputChange('assessment_from_date', e.target.value)}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessment_to_date">Assessment To Date</Label>
          <Input
            id="assessment_to_date"
            type="date"
            value={formData.assessment_to_date || ''}
            onChange={(e) => handleInputChange('assessment_to_date', e.target.value)}
            disabled
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="candidate_assessment_status">Assessment Status *</Label>
          <Select 
            value={formData.candidate_assessment_status} 
            onValueChange={(value) => handleInputChange('candidate_assessment_status', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select assessment status" />
            </SelectTrigger>
            <SelectContent>
              {assessmentStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="assessment_percentage">Assessment Percentage</Label>
          <Input
            id="assessment_percentage"
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={formData.assessment_percentage || ''}
            onChange={(e) => handleInputChange('assessment_percentage', parseFloat(e.target.value) || 0)}
            placeholder="Enter percentage (0-100)"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="grade">Grade</Label>
          <Input
            id="grade"
            value={formData.grade || ''}
            onChange={(e) => handleInputChange('grade', e.target.value)}
            placeholder="Enter grade"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="certifying_agency">Certifying Agency *</Label>
          <Input
            id="certifying_agency"
            value={formData.certifying_agency || ''}
            onChange={(e) => handleInputChange('certifying_agency', e.target.value)}
            placeholder="Enter certifying agency"
            required
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="certified"
              checked={formData.certified || false}
              onCheckedChange={(checked) => handleInputChange('certified', checked)}
            />
            <Label htmlFor="certified">Certified *</Label>
          </div>
        </div>

        {formData.certified && (
          <>
            <div className="space-y-2">
              <Label htmlFor="certification_date">Certification Date *</Label>
              <Input
                id="certification_date"
                type="date"
                value={formData.certification_date || ''}
                onChange={(e) => handleInputChange('certification_date', e.target.value)}
                required={formData.certified}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="certificate_name">Name of Certificate Issued</Label>
              <Input
                id="certificate_name"
                value={formData.certificate_name || ''}
                onChange={(e) => handleInputChange('certificate_name', e.target.value)}
                placeholder="Enter certificate name"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
