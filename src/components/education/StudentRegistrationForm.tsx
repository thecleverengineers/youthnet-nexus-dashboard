
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PersonalInformationStep } from './registration-steps/PersonalInformationStep';
import { AddressInformationStep } from './registration-steps/AddressInformationStep';
import { EducationPreTrainingStep } from './registration-steps/EducationPreTrainingStep';
import { TrainingBatchStep } from './registration-steps/TrainingBatchStep';
import { AssessmentCertificationStep } from './registration-steps/AssessmentCertificationStep';
import { PlacementInformationStep } from './registration-steps/PlacementInformationStep';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';

interface StudentFormData {
  // Personal Information
  salutation: string;
  full_name: string;
  gender: string;
  date_of_birth: string;
  email_id: string;
  marital_status: string;
  fathers_name: string;
  mothers_name: string;
  guardians_name: string;
  religion: string;
  category: string;
  disability: boolean;
  type_of_disability: string;
  domicile_state: string;
  domicile_district: string;
  id_type: string;
  type_of_alternate_id: string;
  id_no: string;
  country_code: string;
  mobile_no: string;
  education_level: string;
  
  // Address Information
  permanent_address: string;
  permanent_address_state: string;
  permanent_address_district: string;
  permanent_address_pin_code: string;
  permanent_address_city: string;
  permanent_address_tehsil: string;
  permanent_address_constituency: string;
  communication_same_as_permanent: boolean;
  communication_address_state: string;
  communication_address_district: string;
  communication_address_pin_code: string;
  communication_address_city: string;
  communication_address_tehsil: string;
  communication_address_constituency: string;
  
  // Pre-Training Information
  pre_training_status: string;
  previous_experience_sector: string;
  months_of_previous_experience: number;
  employed: boolean;
  employment_status: string;
  employment_details: string;
  heard_about_us: string;
  
  // Training Information
  currently_enrolled: boolean;
  schemes: string[];
  training_status: string;
  candidate_training_attendance_percentage: number;
  candidate_course_fee: number;
  
  // Assessment & Certification
  assessment_mode: string;
  candidate_assessment_status: string;
  assessment_percentage: number;
  grade: string;
  certified: boolean;
  certification_date: string;
  certificate_name: string;
  
  // Placement Information
  placement_status: string;
  placement_type: string;
  country_of_placement: string;
  employment_type: string;
  apprenticeship: boolean;
  date_of_joining: string;
  employer_name: string;
  employer_contact_person_name: string;
  employer_contact_no: string;
  employer_email_id: string;
  monthly_earning_before_training: number;
  monthly_current_earning: number;
}

const initialFormData: StudentFormData = {
  salutation: '',
  full_name: '',
  gender: '',
  date_of_birth: '',
  email_id: '',
  marital_status: '',
  fathers_name: '',
  mothers_name: '',
  guardians_name: '',
  religion: '',
  category: '',
  disability: false,
  type_of_disability: '',
  domicile_state: '',
  domicile_district: '',
  id_type: '',
  type_of_alternate_id: '',
  id_no: '',
  country_code: '',
  mobile_no: '',
  education_level: '',
  permanent_address: '',
  permanent_address_state: '',
  permanent_address_district: '',
  permanent_address_pin_code: '',
  permanent_address_city: '',
  permanent_address_tehsil: '',
  permanent_address_constituency: '',
  communication_same_as_permanent: true,
  communication_address_state: '',
  communication_address_district: '',
  communication_address_pin_code: '',
  communication_address_city: '',
  communication_address_tehsil: '',
  communication_address_constituency: '',
  pre_training_status: '',
  previous_experience_sector: '',
  months_of_previous_experience: 0,
  employed: false,
  employment_status: '',
  employment_details: '',
  heard_about_us: '',
  currently_enrolled: false,
  schemes: [],
  training_status: '',
  candidate_training_attendance_percentage: 0,
  candidate_course_fee: 0,
  assessment_mode: '',
  candidate_assessment_status: '',
  assessment_percentage: 0,
  grade: '',
  certified: false,
  certification_date: '',
  certificate_name: '',
  placement_status: '',
  placement_type: '',
  country_of_placement: '',
  employment_type: '',
  apprenticeship: false,
  date_of_joining: '',
  employer_name: '',
  employer_contact_person_name: '',
  employer_contact_no: '',
  employer_email_id: '',
  monthly_earning_before_training: 0,
  monthly_current_earning: 0,
};

const steps = [
  { id: 1, title: 'Personal Information', component: PersonalInformationStep },
  { id: 2, title: 'Address Information', component: AddressInformationStep },
  { id: 3, title: 'Education & Pre-Training', component: EducationPreTrainingStep },
  { id: 4, title: 'Training & Batch Details', component: TrainingBatchStep },
  { id: 5, title: 'Assessment & Certification', component: AssessmentCertificationStep },
  { id: 6, title: 'Placement Information', component: PlacementInformationStep },
];

export function StudentRegistrationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [loading, setLoading] = useState(false);

  const updateFormData = (stepData: Partial<StudentFormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First, get or create student record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('User not authenticated');
        return;
      }

      // Get student ID
      const { data: studentData, error: studentError } = await supabase
        .from('students')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (studentError) {
        toast.error('Student record not found');
        return;
      }

      // Insert student details
      const { error } = await supabase
        .from('student_details')
        .insert({
          student_id: studentData.id,
          ...formData,
          date_of_birth: formData.date_of_birth || null,
          certification_date: formData.certification_date || null,
          date_of_joining: formData.date_of_joining || null,
        });

      if (error) {
        console.error('Error saving student details:', error);
        toast.error('Failed to save student details');
        return;
      }

      toast.success('Student registration completed successfully!');
      setFormData(initialFormData);
      setCurrentStep(1);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;
  const progress = (currentStep / steps.length) * 100;

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center mb-4">
          Student Registration
        </CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep} of {steps.length}</span>
            <span>{steps[currentStep - 1].title}</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
        />
        
        <div className="flex justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex gap-2">
            {currentStep === steps.length ? (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Saving...' : 'Complete Registration'}
              </Button>
            ) : (
              <Button onClick={nextStep}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
