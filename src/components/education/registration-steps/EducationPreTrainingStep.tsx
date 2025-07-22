
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface EducationPreTrainingStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function EducationPreTrainingStep({ formData, updateFormData }: EducationPreTrainingStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const preTrainingStatusOptions = ['Fresher', 'Experienced'];
  const employmentStatusOptions = [
    'Employed through Partner', 'Employed through Employer', 'Upskilled', 
    'Opted for Higher Studies', 'Self Employed'
  ];
  const heardAboutUsOptions = [
    'Internet', 'Friends/Relatives', 'Kaushal Mela', 'Newsletter', 'Others'
  ];

  const isExperienced = formData.pre_training_status === 'Experienced';

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Education & Pre-Training Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="pre_training_status">Pre-Training Status *</Label>
          <Select value={formData.pre_training_status} onValueChange={(value) => handleInputChange('pre_training_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select pre-training status" />
            </SelectTrigger>
            <SelectContent>
              {preTrainingStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {isExperienced && (
          <>
            <div className="space-y-2">
              <Label htmlFor="previous_experience_sector">Previous Experience Sector *</Label>
              <Input
                id="previous_experience_sector"
                value={formData.previous_experience_sector}
                onChange={(e) => handleInputChange('previous_experience_sector', e.target.value)}
                placeholder="Enter sector"
                required={isExperienced}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="months_of_previous_experience">Months of Previous Experience *</Label>
              <Input
                id="months_of_previous_experience"
                type="number"
                min="1"
                max="500"
                value={formData.months_of_previous_experience}
                onChange={(e) => handleInputChange('months_of_previous_experience', parseInt(e.target.value) || 0)}
                placeholder="Enter months (1-500)"
                required={isExperienced}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="employed"
                  checked={formData.employed}
                  onCheckedChange={(checked) => handleInputChange('employed', checked)}
                />
                <Label htmlFor="employed">Currently Employed *</Label>
              </div>
            </div>

            {formData.employed && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="employment_status">Employment Status *</Label>
                  <Select value={formData.employment_status} onValueChange={(value) => handleInputChange('employment_status', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select employment status" />
                    </SelectTrigger>
                    <SelectContent>
                      {employmentStatusOptions.map(option => (
                        <SelectItem key={option} value={option}>{option}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="employment_details">Employment Details *</Label>
                  <Textarea
                    id="employment_details"
                    value={formData.employment_details}
                    onChange={(e) => handleInputChange('employment_details', e.target.value)}
                    placeholder="Enter employment details (max 100 characters)"
                    maxLength={100}
                    required={formData.employed}
                  />
                </div>
              </>
            )}
          </>
        )}

        <div className="space-y-2">
          <Label htmlFor="heard_about_us">How did you hear about us?</Label>
          <Select value={formData.heard_about_us} onValueChange={(value) => handleInputChange('heard_about_us', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select option" />
            </SelectTrigger>
            <SelectContent>
              {heardAboutUsOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="currently_enrolled"
              checked={formData.currently_enrolled}
              onCheckedChange={(checked) => handleInputChange('currently_enrolled', checked)}
            />
            <Label htmlFor="currently_enrolled">Currently Enrolled</Label>
          </div>
        </div>
      </div>

      {formData.currently_enrolled && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-md font-medium text-blue-700 mb-4">Current Enrollment Details</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="training_status">Training Status *</Label>
              <Select value={formData.training_status} onValueChange={(value) => handleInputChange('training_status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select training status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Dropout">Dropout</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidate_training_attendance_percentage">Training Attendance Percentage *</Label>
              <Input
                id="candidate_training_attendance_percentage"
                type="number"
                min="0"
                max="100"
                value={formData.candidate_training_attendance_percentage}
                onChange={(e) => handleInputChange('candidate_training_attendance_percentage', parseFloat(e.target.value) || 0)}
                placeholder="Enter percentage (0-100)"
                required={formData.currently_enrolled}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="candidate_course_fee">Course Fee</Label>
              <Input
                id="candidate_course_fee"
                type="number"
                min="0"
                value={formData.candidate_course_fee}
                onChange={(e) => handleInputChange('candidate_course_fee', parseFloat(e.target.value) || 0)}
                placeholder="Enter course fee"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
