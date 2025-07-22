
-- Create enums for various dropdown fields
CREATE TYPE salutation_type AS ENUM ('Mr', 'Ms', 'Mrs', 'Mx');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Transgender');
CREATE TYPE marital_status_type AS ENUM ('Single/Unmarried', 'Married', 'Widowed', 'Divorced', 'Separated', 'Not to be Disclosed');
CREATE TYPE religion_type AS ENUM ('Atheist', 'Hindu', 'Sikh', 'Muslim', 'Christian', 'Buddhist', 'Jews', 'Other', 'Not to be Disclosed');
CREATE TYPE category_type AS ENUM ('General', 'OBC', 'SC', 'ST', 'Not to be Disclosed');
CREATE TYPE id_type AS ENUM ('Aadhar ID', 'PAN Card', 'Voter ID Card', 'Domicile Certificate', 'ST/SC Certificate', 'Permanent Residential Certificate (PRC)', 'Driving License', 'Ration Card', 'Birth Certificate issued by govt.', 'BPL Card', 'National Population Register (NPR) Card', 'Identity proof by Gazetted officers', 'Passport', 'Jail Identification Card / Number', 'School leaving certificate / 10th certificate', 'Letter of domicile from SDM / DM / Govt. Authority', 'Other');
CREATE TYPE disability_type AS ENUM ('Locomotor Disability', 'Leprosy Cured Person', 'Dwarfism', 'Acid Attack Victims', 'Blindness/Visual Impairment', 'Low-vision (Visual Impairment)', 'Deaf', 'Hard of Hearing', 'Speech and Language Disability', 'Intellectual Disability /Mental Retardation', 'Autism Spectrum Disorder', 'Specific Learning Disabilities', 'Mental Behavior-Mental Illness', 'Haemophilia', 'Thalassemia', 'Sickle Cell Disease', 'Deaf Blindness', 'Cerebral Palsy', 'Multiple Sclerosis', 'Muscular Dystrophy', 'Persons with spine deformity/spine injury');
CREATE TYPE pre_training_status_type AS ENUM ('Fresher', 'Experienced');
CREATE TYPE employment_status_type AS ENUM ('Employed through Partner', 'Employed through Employer', 'Upskilled', 'Opted for Higher Studies', 'Self Employed');
CREATE TYPE heard_about_us_type AS ENUM ('Internet', 'Friends/Relatives', 'Kaushal Mela', 'Newsletter', 'Others');
CREATE TYPE training_status_type AS ENUM ('Completed', 'Dropout');
CREATE TYPE placement_status_type AS ENUM ('Yes', 'No');
CREATE TYPE placement_type AS ENUM ('Domestic', 'International');
CREATE TYPE employment_type AS ENUM ('Salaried', 'Waged', 'Self Employed', 'UpSkilled', 'Opted for Higher Studies');
CREATE TYPE assessment_status_type AS ENUM ('Pass', 'Fail', 'Not-Appeared');

-- Create comprehensive student details table
CREATE TABLE public.student_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  candidate_id TEXT UNIQUE,
  
  -- Personal Information
  salutation salutation_type,
  full_name TEXT NOT NULL,
  gender gender_type NOT NULL,
  date_of_birth DATE NOT NULL,
  email_id TEXT NOT NULL,
  marital_status marital_status_type,
  fathers_name TEXT,
  mothers_name TEXT,
  guardians_name TEXT,
  religion religion_type NOT NULL,
  category category_type NOT NULL,
  
  -- Disability Information
  disability BOOLEAN NOT NULL DEFAULT false,
  type_of_disability disability_type,
  
  -- Location Information
  domicile_state TEXT NOT NULL,
  domicile_district TEXT NOT NULL,
  
  -- ID Information
  id_type id_type NOT NULL,
  type_of_alternate_id id_type,
  id_no TEXT NOT NULL,
  country_code TEXT NOT NULL,
  mobile_no TEXT NOT NULL,
  
  -- Education
  education_level TEXT NOT NULL,
  
  -- Permanent Address
  permanent_address TEXT NOT NULL,
  permanent_address_state TEXT NOT NULL,
  permanent_address_district TEXT NOT NULL,
  permanent_address_pin_code TEXT NOT NULL,
  permanent_address_city TEXT,
  permanent_address_tehsil TEXT,
  permanent_address_constituency TEXT NOT NULL,
  
  -- Communication Address
  communication_same_as_permanent BOOLEAN NOT NULL DEFAULT true,
  communication_address_state TEXT,
  communication_address_district TEXT,
  communication_address_pin_code TEXT,
  communication_address_city TEXT,
  communication_address_tehsil TEXT,
  communication_address_constituency TEXT,
  
  -- Pre-Training Information
  pre_training_status pre_training_status_type NOT NULL,
  previous_experience_sector TEXT,
  months_of_previous_experience INTEGER,
  employed BOOLEAN,
  employment_status employment_status_type,
  employment_details TEXT,
  heard_about_us heard_about_us_type,
  
  -- Training Information
  currently_enrolled BOOLEAN DEFAULT false,
  schemes TEXT[],
  training_status training_status_type,
  candidate_training_attendance_percentage DECIMAL(5,2),
  candidate_course_fee DECIMAL(10,2),
  sdms_enrolment_number TEXT,
  skilling_category TEXT,
  
  -- Batch Information
  batch_id TEXT,
  batch_start_date DATE,
  batch_end_date DATE,
  trainer_id TEXT,
  trainer_name TEXT,
  
  -- Course Information
  course_id TEXT,
  course_name TEXT,
  course_type TEXT,
  sector_covered TEXT,
  course_fee DECIMAL(10,2),
  fee_paid_by TEXT,
  
  -- Training Center Information
  tc_id TEXT,
  tc_name TEXT,
  tc_centre TEXT,
  tc_district TEXT,
  tc_pin_code TEXT,
  
  -- Assessment Information
  assessment_mode TEXT,
  assessment_agency_id TEXT,
  assessment_agency_name TEXT,
  assessor_id TEXT,
  assessor_name TEXT,
  assessment_from_date DATE,
  assessment_to_date DATE,
  candidate_assessment_status assessment_status_type,
  assessment_percentage DECIMAL(5,2),
  grade TEXT,
  certifying_agency TEXT,
  certified BOOLEAN DEFAULT false,
  certification_date DATE,
  certificate_name TEXT,
  
  -- Placement Information
  placement_status placement_status_type,
  placement_type placement_type,
  country_of_placement TEXT,
  employment_type employment_type,
  apprenticeship BOOLEAN DEFAULT false,
  undertaking_self_employed BOOLEAN,
  proof_upskilling_provided BOOLEAN,
  type_of_proof TEXT,
  date_of_joining DATE,
  
  -- Employer Information
  employer_name TEXT,
  employer_contact_person_name TEXT,
  employer_contact_person_designation TEXT,
  employer_contact_no TEXT,
  employer_email_id TEXT,
  location_of_employer_state TEXT,
  location_of_employer_district TEXT,
  feedback_collected_from_employer BOOLEAN,
  frequency_of_feedback TEXT,
  
  -- Work Location
  state_of_placement_or_work TEXT,
  district_of_placement_or_work TEXT,
  
  -- Earnings
  monthly_earning_before_training DECIMAL(10,2),
  monthly_current_earning DECIMAL(10,2),
  
  -- Placement Tracking
  placement_tracking_status_1 BOOLEAN,
  placement_tracking_date_1 DATE,
  placement_tracking_status_2 BOOLEAN,
  placement_tracking_date_2 DATE,
  placement_tracking_status_3 BOOLEAN,
  placement_tracking_date_3 DATE,
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_details
ALTER TABLE public.student_details ENABLE ROW LEVEL SECURITY;

-- Create policy for student details
CREATE POLICY "Authenticated users can manage student details" ON public.student_details
  FOR ALL USING (true);

-- Create function to generate candidate ID
CREATE OR REPLACE FUNCTION generate_candidate_id()
RETURNS TEXT AS $$
DECLARE
  new_id TEXT;
  counter INTEGER := 1;
BEGIN
  LOOP
    new_id := 'CAN' || LPAD(counter::text, 6, '0');
    IF NOT EXISTS (SELECT 1 FROM public.student_details WHERE candidate_id = new_id) THEN
      RETURN new_id;
    END IF;
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate candidate ID
CREATE OR REPLACE FUNCTION auto_generate_candidate_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.candidate_id IS NULL THEN
    NEW.candidate_id := generate_candidate_id();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_candidate_id
  BEFORE INSERT ON public.student_details
  FOR EACH ROW
  EXECUTE FUNCTION auto_generate_candidate_id();
