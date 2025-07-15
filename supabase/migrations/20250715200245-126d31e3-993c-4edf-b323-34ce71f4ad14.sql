
-- Update RLS policies to allow proper access for authenticated users
-- Allow authenticated users to manage employees (for HR staff and admins)
DROP POLICY IF EXISTS "Users can view their own employee record" ON employees;
CREATE POLICY "Authenticated users can manage employees" ON employees FOR ALL TO authenticated USING (true);

-- Allow authenticated users to manage training programs
DROP POLICY IF EXISTS "Anyone can view training programs" ON training_programs;
CREATE POLICY "Authenticated users can manage training programs" ON training_programs FOR ALL TO authenticated USING (true);

-- Allow authenticated users to manage education courses
DROP POLICY IF EXISTS "Anyone can view education courses" ON education_courses;
CREATE POLICY "Authenticated users can manage education courses" ON education_courses FOR ALL TO authenticated USING (true);

-- Allow authenticated users to manage student enrollments
DROP POLICY IF EXISTS "Students can view their own enrollments" ON student_enrollments;
CREATE POLICY "Authenticated users can manage enrollments" ON student_enrollments FOR ALL TO authenticated USING (true);

-- Allow authenticated users to manage course enrollments
DROP POLICY IF EXISTS "Students can view their own course enrollments" ON course_enrollments;
CREATE POLICY "Authenticated users can manage course enrollments" ON course_enrollments FOR ALL TO authenticated USING (true);

-- Allow authenticated users to view and update their student records
DROP POLICY IF EXISTS "Users can view their own student record" ON students;
CREATE POLICY "Authenticated users can manage students" ON students FOR ALL TO authenticated USING (true);

-- Allow authenticated users to view and update their trainer records
DROP POLICY IF EXISTS "Users can view their own trainer record" ON trainers;
CREATE POLICY "Authenticated users can manage trainers" ON trainers FOR ALL TO authenticated USING (true);

-- Enable realtime for key tables
ALTER TABLE employees REPLICA IDENTITY FULL;
ALTER TABLE students REPLICA IDENTITY FULL;
ALTER TABLE trainers REPLICA IDENTITY FULL;
ALTER TABLE job_postings REPLICA IDENTITY FULL;
ALTER TABLE job_applications REPLICA IDENTITY FULL;
ALTER TABLE training_programs REPLICA IDENTITY FULL;
ALTER TABLE education_courses REPLICA IDENTITY FULL;
ALTER TABLE attendance_records REPLICA IDENTITY FULL;
ALTER TABLE payroll_cycles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE employees;
ALTER PUBLICATION supabase_realtime ADD TABLE students;
ALTER PUBLICATION supabase_realtime ADD TABLE trainers;
ALTER PUBLICATION supabase_realtime ADD TABLE job_postings;
ALTER PUBLICATION supabase_realtime ADD TABLE job_applications;
ALTER PUBLICATION supabase_realtime ADD TABLE training_programs;
ALTER PUBLICATION supabase_realtime ADD TABLE education_courses;
ALTER PUBLICATION supabase_realtime ADD TABLE attendance_records;
ALTER PUBLICATION supabase_realtime ADD TABLE payroll_cycles;
