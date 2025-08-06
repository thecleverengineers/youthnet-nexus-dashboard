-- Remove the foreign key constraint from profiles table and add sample data
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_user_id_fkey;

-- Insert sample profiles for education system
INSERT INTO public.profiles (user_id, full_name, email, phone, role) VALUES
('00000000-0000-0000-0000-000000000001', 'Jane Smith', 'jane.smith@example.com', '+91-9876543211', 'student'),
('00000000-0000-0000-0000-000000000002', 'Robert Johnson', 'robert.johnson@example.com', '+91-9876543212', 'student'),
('00000000-0000-0000-0000-000000000003', 'Maria Garcia', 'maria.garcia@example.com', '+91-9876543213', 'student'),
('00000000-0000-0000-0000-000000000004', 'David Lee', 'david.lee@example.com', '+91-9876543214', 'student'),
('00000000-0000-0000-0000-000000000005', 'Dr. Sarah Kumar', 'sarah.kumar@youthnet.in', '+91-9876543220', 'trainer'),
('00000000-0000-0000-0000-000000000006', 'Prof. Raj Patel', 'raj.patel@youthnet.in', '+91-9876543221', 'trainer');

-- Update training programs with trainer assignments
UPDATE public.training_programs 
SET trainer_id = (SELECT id FROM public.trainers WHERE trainer_id = 'TRN2024002' LIMIT 1)
WHERE name = 'Digital Marketing Mastery';

UPDATE public.training_programs 
SET trainer_id = (SELECT id FROM public.trainers WHERE trainer_id = 'TRN2024003' LIMIT 1)
WHERE name = 'Data Analysis with Python';

-- Insert sample enrollments
INSERT INTO public.student_enrollments (student_id, program_id, enrollment_date, status, grade) VALUES
((SELECT id FROM public.students WHERE student_id = 'STU2024002'), 
 (SELECT id FROM public.training_programs WHERE name = 'Digital Marketing Mastery'), 
 '2024-02-05', 'active', NULL),
((SELECT id FROM public.students WHERE student_id = 'STU2024003'), 
 (SELECT id FROM public.training_programs WHERE name = 'Data Analysis with Python'), 
 '2024-01-25', 'pending', NULL),
((SELECT id FROM public.students WHERE student_id = 'STU2024004'), 
 (SELECT id FROM public.training_programs WHERE name = 'Web Development Fundamentals'), 
 '2024-01-22', 'active', NULL),
((SELECT id FROM public.students WHERE student_id = 'STU2024005'), 
 (SELECT id FROM public.training_programs WHERE name = 'Entrepreneurship Bootcamp'), 
 '2023-10-05', 'completed', 'A');

-- Insert sample course enrollments
INSERT INTO public.course_enrollments (student_id, course_id, enrollment_date, status, final_grade) VALUES
((SELECT id FROM public.students WHERE student_id = 'STU2024002'), 
 (SELECT id FROM public.education_courses WHERE course_code = 'BA201'), 
 '2024-01-18', 'enrolled', NULL),
((SELECT id FROM public.students WHERE student_id = 'STU2024004'), 
 (SELECT id FROM public.education_courses WHERE course_code = 'DL100'), 
 '2024-01-20', 'enrolled', NULL),
((SELECT id FROM public.students WHERE student_id = 'STU2024005'), 
 (SELECT id FROM public.education_courses WHERE course_code = 'FM301'), 
 '2023-09-01', 'completed', 'A+');