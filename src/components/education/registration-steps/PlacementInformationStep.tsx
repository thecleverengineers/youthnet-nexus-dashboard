
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface PlacementInformationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function PlacementInformationStep({ formData, updateFormData }: PlacementInformationStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const placementStatusOptions = ['Yes', 'No'];
  const placementTypeOptions = ['Domestic', 'International'];
  const employmentTypeOptions = ['Salaried', 'Waged', 'Self Employed', 'UpSkilled', 'Opted for Higher Studies'];
  const typeOfProofOptions = [
    'Certifying skill enhancement from employer', 'Promotion', 'Increase in salary'
  ];

  const isPlaced = formData.placement_status === 'Yes';
  const isInternational = formData.placement_type === 'International';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Placement Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Basic Placement Information */}
        <div className="space-y-2">
          <Label htmlFor="placement_status">Placement Status *</Label>
          <Select value={formData.placement_status} onValueChange={(value) => handleInputChange('placement_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select placement status" />
            </SelectTrigger>
            <SelectContent>
              {placementStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isPlaced && (
          <>
            <div className="space-y-2">
              <Label htmlFor="placement_type">Placement Type *</Label>
              <Select value={formData.placement_type} onValueChange={(value) => handleInputChange('placement_type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select placement type" />
                </SelectTrigger>
                <SelectContent>
                  {placementTypeOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {isInternational && (
              <div className="space-y-2">
                <Label htmlFor="country_of_placement">Country of Placement *</Label>
                <Input
                  id="country_of_placement"
                  value={formData.country_of_placement || ''}
                  onChange={(e) => handleInputChange('country_of_placement', e.target.value)}
                  placeholder="Enter country"
                  required={isInternational}
                />
              </div>
            )}

            {!isInternational && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employment_type">Employment Type *</Label>
                  <Select value={formData.employment_type} onValueChange={(value) => handleInputChange('employment_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment type" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentTypeOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="apprenticeship"
                      checked={formData.apprenticeship || false}
                      onCheckedChange={(checked) => handleInputChange('apprenticeship', checked)}
                    />
                    <Label htmlFor="apprenticeship">Apprenticeship *</Label>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date_of_joining">Date of Joining *</Label>
                  <Input
                    id="date_of_joining"
                    type="date"
                    value={formData.date_of_joining || ''}
                    onChange={(e) => handleInputChange('date_of_joining', e.target.value)}
                    required={!isInternational}
                  />
                </div>

                {/* Employer Information */}
                <div className="space-y-2">
                  <Label htmlFor="employer_name">Employer Name *</Label>
                  <Input
                    id="employer_name"
                    value={formData.employer_name || ''}
                    onChange={(e) => handleInputChange('employer_name', e.target.value)}
                    placeholder="Enter employer name"
                    maxLength={50}
                    required={!isInternational}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer_contact_person_name">Contact Person Name *</Label>
                  <Input
                    id="employer_contact_person_name"
                    value={formData.employer_contact_person_name || ''}
                    onChange={(e) => handleInputChange('employer_contact_person_name', e.target.value)}
                    placeholder="Enter contact person name"
                    maxLength={50}
                    required={!isInternational}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer_contact_no">Contact Number *</Label>
                  <Input
                    id="employer_contact_no"
                    value={formData.employer_contact_no || ''}
                    onChange={(e) => handleInputChange('employer_contact_no', e.target.value)}
                    placeholder="Enter contact number"
                    maxLength={11}
                    required={!isInternational}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employer_email_id">Employer Email *</Label>
                  <Input
                    id="employer_email_id"
                    type="email"
                    value={formData.employer_email_id || ''}
                    onChange={(e) => handleInputChange('employer_email_id', e.target.value)}
                    placeholder="Enter employer email"
                    maxLength={50}
                    required={!isInternational}
                  />
                </div>

                {/* Earnings */}
                <div className="space-y-2">
                  <Label htmlFor="monthly_earning_before_training">Monthly Earning Before Training *</Label>
                  <Input
                    id="monthly_earning_before_training"
                    type="number"
                    min="0"
                    max="500000"
                    value={formData.monthly_earning_before_training || ''}
                    onChange={(e) => handleInputChange('monthly_earning_before_training', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount (0-500000)"
                    required={!isInternational}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="monthly_current_earning">Monthly Current Earning *</Label>
                  <Input
                    id="monthly_current_earning"
                    type="number"
                    min="0"
                    max="500000"
                    value={formData.monthly_current_earning || ''}
                    onChange={(e) => handleInputChange('monthly_current_earning', parseFloat(e.target.value) || 0)}
                    placeholder="Enter amount (0-500000)"
                    required={!isInternational}
                  />
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Additional Information Section */}
      {isPlaced && !isInternational && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-md font-medium text-gray-700 mb-4">Additional Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="undertaking_self_employed"
                  checked={formData.undertaking_self_employed || false}
                  onCheckedChange={(checked) => handleInputChange('undertaking_self_employed', checked)}
                />
                <Label htmlFor="undertaking_self_employed">Self Employment Undertaking</Label>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="proof_upskilling_provided"
                  checked={formData.proof_upskilling_provided || false}
                  onCheckedChange={(checked) => handleInputChange('proof_upskilling_provided', checked)}
                />
                <Label htmlFor="proof_upskilling_provided">Proof of Upskilling Provided</Label>
              </div>
            </div>

            {formData.proof_upskilling_provided && (
              <div className="space-y-2">
                <Label htmlFor="type_of_proof">Type of Proof *</Label>
                <Select value={formData.type_of_proof} onValueChange={(value) => handleInputChange('type_of_proof', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select proof type" />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOfProofOptions.map(option => (
                      <SelectItem key={option} value={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
