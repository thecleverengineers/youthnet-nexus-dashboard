-- Insert sample data for education system

-- Sample training programs
INSERT INTO public.training_programs (name, description, duration_weeks, max_participants, status, start_date, end_date) VALUES
('Web Development Fundamentals', 'Learn HTML, CSS, JavaScript and React basics', 12, 25, 'active', '2024-01-15', '2024-04-15'),
('Digital Marketing Mastery', 'Complete digital marketing course covering SEO, SEM, and social media', 8, 20, 'active', '2024-02-01', '2024-04-01'),
('Data Analysis with Python', 'Introduction to data analysis using Python and pandas', 10, 15, 'active', '2024-01-20', '2024-04-01'),
('Mobile App Development', 'Build native mobile apps using React Native', 16, 12, 'pending', '2024-03-01', '2024-06-30'),
('Entrepreneurship Bootcamp', 'Learn business fundamentals and startup methodology', 6, 30, 'completed', '2023-10-01', '2023-12-15');

-- Sample education courses
INSERT INTO public.education_courses (course_name, course_code, description, duration_months, credits, department, max_students, status) VALUES
('Computer Science Fundamentals', 'CS101', 'Introduction to programming and computer science concepts', 4, 4, 'Technology', 40, 'active'),
('Business Administration', 'BA201', 'Principles of business management and administration', 6, 6, 'Business', 35, 'active'),
('Digital Literacy', 'DL100', 'Basic computer skills and digital literacy', 2, 2, 'Technology', 50, 'active'),
('English Communication', 'EN150', 'English language and communication skills', 3, 3, 'Language', 45, 'active'),
('Financial Management', 'FM301', 'Personal and business financial management', 4, 4, 'Business', 25, 'active');