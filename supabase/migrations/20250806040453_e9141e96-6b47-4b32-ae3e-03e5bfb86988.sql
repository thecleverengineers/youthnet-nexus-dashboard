-- Insert sample students with proper UUIDs
INSERT INTO public.students (user_id, student_id, date_of_birth, gender, education_level, emergency_contact, emergency_phone, status) VALUES
(gen_random_uuid(), 'STU2024002', '1996-07-22', 'female', 'Bachelor Degree', 'Sarah Johnson', '+91-9876543211', 'active'),
(gen_random_uuid(), 'STU2024003', '1994-11-08', 'male', 'Diploma', 'Michael Brown', '+91-9876543212', 'pending'),
(gen_random_uuid(), 'STU2024004', '1997-05-12', 'female', 'High School Graduate', 'Emily Davis', '+91-9876543213', 'active'),
(gen_random_uuid(), 'STU2024005', '1993-09-30', 'other', 'Master Degree', 'Alex Wilson', '+91-9876543214', 'completed');

-- Insert sample trainers with proper UUIDs
INSERT INTO public.trainers (user_id, trainer_id, specialization, experience_years) VALUES
(gen_random_uuid(), 'TRN2024002', 'Digital Marketing', 8),
(gen_random_uuid(), 'TRN2024003', 'Data Science', 6);

-- Insert sample enrollments with existing data
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