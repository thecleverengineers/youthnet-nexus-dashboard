
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface PersonalInformationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function PersonalInformationStep({ formData, updateFormData }: PersonalInformationStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const salutationOptions = ['Mr', 'Ms', 'Mrs', 'Mx'];
  const genderOptions = ['Male', 'Female', 'Transgender'];
  const maritalStatusOptions = [
    'Single/Unmarried', 'Married', 'Widowed', 'Divorced', 'Separated', 'Not to be Disclosed'
  ];
  const religionOptions = [
    'Atheist', 'Hindu', 'Sikh', 'Muslim', 'Christian', 'Buddhist', 'Jews', 'Other', 'Not to be Disclosed'
  ];
  const categoryOptions = ['General', 'OBC', 'SC', 'ST', 'Not to be Disclosed'];
  const disabilityTypes = [
    'Locomotor Disability', 'Leprosy Cured Person', 'Dwarfism', 'Acid Attack Victims',
    'Blindness/Visual Impairment', 'Low-vision (Visual Impairment)', 'Deaf', 'Hard of Hearing',
    'Speech and Language Disability', 'Intellectual Disability /Mental Retardation', 
    'Autism Spectrum Disorder', 'Specific Learning Disabilities', 'Mental Behavior-Mental Illness',
    'Haemophilia', 'Thalassemia', 'Sickle Cell Disease', 'Deaf Blindness', 'Cerebral Palsy',
    'Multiple Sclerosis', 'Muscular Dystrophy', 'Persons with spine deformity/spine injury'
  ];
  const idTypes = [
    'Aadhar ID', 'PAN Card', 'Voter ID Card', 'Domicile Certificate', 'ST/SC Certificate',
    'Permanent Residential Certificate (PRC)', 'Driving License', 'Ration Card',
    'Birth Certificate issued by govt.', 'BPL Card', 'National Population Register (NPR) Card',
    'Identity proof by Gazetted officers', 'Passport', 'Jail Identification Card / Number',
    'School leaving certificate / 10th certificate', 'Letter of domicile from SDM / DM / Govt. Authority', 'Other'
  ];

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Personal Information</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="salutation">Salutation *</Label>
          <Select value={formData.salutation} onValueChange={(value) => handleInputChange('salutation', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select salutation" />
            </SelectTrigger>
            <SelectContent>
              {salutationOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="full_name">Full Name *</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => handleInputChange('full_name', e.target.value)}
            placeholder="Enter full name (max 50 characters)"
            maxLength={50}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              {genderOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="date_of_birth">Date of Birth *</Label>
          <Input
            id="date_of_birth"
            type="date"
            value={formData.date_of_birth}
            onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email_id">Email ID *</Label>
          <Input
            id="email_id"
            type="email"
            value={formData.email_id}
            onChange={(e) => handleInputChange('email_id', e.target.value)}
            placeholder="Enter email address"
            maxLength={50}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="marital_status">Marital Status</Label>
          <Select value={formData.marital_status} onValueChange={(value) => handleInputChange('marital_status', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select marital status" />
            </SelectTrigger>
            <SelectContent>
              {maritalStatusOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fathers_name">Father's Name</Label>
          <Input
            id="fathers_name"
            value={formData.fathers_name}
            onChange={(e) => handleInputChange('fathers_name', e.target.value)}
            placeholder="Enter father's name"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mothers_name">Mother's Name</Label>
          <Input
            id="mothers_name"
            value={formData.mothers_name}
            onChange={(e) => handleInputChange('mothers_name', e.target.value)}
            placeholder="Enter mother's name"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="guardians_name">Guardian's Name</Label>
          <Input
            id="guardians_name"
            value={formData.guardians_name}
            onChange={(e) => handleInputChange('guardians_name', e.target.value)}
            placeholder="Enter guardian's name"
            maxLength={50}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="religion">Religion *</Label>
          <Select value={formData.religion} onValueChange={(value) => handleInputChange('religion', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select religion" />
            </SelectTrigger>
            <SelectContent>
              {religionOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="disability"
              checked={formData.disability}
              onCheckedChange={(checked) => handleInputChange('disability', checked)}
            />
            <Label htmlFor="disability">Disability *</Label>
          </div>
        </div>

        {formData.disability && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="type_of_disability">Type of Disability *</Label>
            <Select value={formData.type_of_disability} onValueChange={(value) => handleInputChange('type_of_disability', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select disability type" />
              </SelectTrigger>
              <SelectContent>
                {disabilityTypes.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="domicile_state">Domicile State *</Label>
          <Input
            id="domicile_state"
            value={formData.domicile_state}
            onChange={(e) => handleInputChange('domicile_state', e.target.value)}
            placeholder="Enter domicile state"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="domicile_district">Domicile District *</Label>
          <Input
            id="domicile_district"
            value={formData.domicile_district}
            onChange={(e) => handleInputChange('domicile_district', e.target.value)}
            placeholder="Enter domicile district"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="id_type">ID Type *</Label>
          <Select value={formData.id_type} onValueChange={(value) => handleInputChange('id_type', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select ID type" />
            </SelectTrigger>
            <SelectContent>
              {idTypes.map(option => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.id_type !== 'Aadhar ID' && (
          <div className="space-y-2">
            <Label htmlFor="type_of_alternate_id">Type of Alternate ID</Label>
            <Select value={formData.type_of_alternate_id} onValueChange={(value) => handleInputChange('type_of_alternate_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select alternate ID type" />
              </SelectTrigger>
              <SelectContent>
                {idTypes.filter(type => type !== formData.id_type).map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="id_no">ID Number *</Label>
          <Input
            id="id_no"
            value={formData.id_no}
            onChange={(e) => handleInputChange('id_no', e.target.value)}
            placeholder="Enter ID number"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country_code">Country Code *</Label>
          <Input
            id="country_code"
            value={formData.country_code}
            onChange={(e) => handleInputChange('country_code', e.target.value)}
            placeholder="+91"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile_no">Mobile Number *</Label>
          <Input
            id="mobile_no"
            value={formData.mobile_no}
            onChange={(e) => handleInputChange('mobile_no', e.target.value)}
            placeholder="Enter 10-digit mobile number"
            maxLength={10}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="education_level">Education Level *</Label>
          <Input
            id="education_level"
            value={formData.education_level}
            onChange={(e) => handleInputChange('education_level', e.target.value)}
            placeholder="Enter education level"
            required
          />
        </div>
      </div>
    </div>
  );
}
