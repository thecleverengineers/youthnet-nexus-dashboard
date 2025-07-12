
-- YouthNet MIS Database Schema
-- MySQL Version

CREATE DATABASE IF NOT EXISTS youthnet_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE youthnet_db;

-- Users table (main authentication table)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('admin', 'staff', 'trainer', 'student') NOT NULL DEFAULT 'student',
    is_email_verified BOOLEAN DEFAULT FALSE,
    email_verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP NULL,
    last_login TIMESTAMP NULL,
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_status (status)
);

-- Students table
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    student_id VARCHAR(50) NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    education_level ENUM('high_school', 'diploma', 'bachelor', 'master', 'phd', 'other'),
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(100),
    status ENUM('pending', 'active', 'graduated', 'dropped_out', 'suspended') DEFAULT 'active',
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip_code VARCHAR(20),
    address_country VARCHAR(100),
    cgpa DECIMAL(3,2) CHECK (cgpa >= 0 AND cgpa <= 10),
    credits_completed INT DEFAULT 0,
    expected_graduation DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status),
    INDEX idx_enrollment_date (enrollment_date)
);

-- Trainers table
CREATE TABLE trainers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    trainer_id VARCHAR(50) NOT NULL UNIQUE,
    specialization JSON,
    experience_years INT DEFAULT 0,
    qualification JSON,
    certifications JSON,
    hire_date DATE DEFAULT (CURRENT_DATE),
    employment_type ENUM('full_time', 'part_time', 'contract', 'consultant') DEFAULT 'full_time',
    salary DECIMAL(12,2),
    currency VARCHAR(10) DEFAULT 'INR',
    status ENUM('active', 'inactive', 'on_leave', 'terminated') DEFAULT 'active',
    skills JSON,
    performance_rating DECIMAL(2,1) CHECK (performance_rating >= 1 AND performance_rating <= 5),
    total_students_trained INT DEFAULT 0,
    average_student_rating DECIMAL(2,1) CHECK (average_student_rating >= 1 AND average_student_rating <= 5),
    courses_delivered INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_status (status),
    INDEX idx_hire_date (hire_date)
);

-- Employees table
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    employee_id VARCHAR(50) NOT NULL UNIQUE,
    department ENUM('administration', 'hr', 'education', 'training', 'placement', 'incubation', 'livelihood', 'it', 'finance', 'marketing') NOT NULL,
    position VARCHAR(255) NOT NULL,
    employment_type ENUM('full_time', 'part_time', 'contract', 'intern') DEFAULT 'full_time',
    employment_status ENUM('active', 'inactive', 'on_leave', 'terminated') DEFAULT 'active',
    hire_date DATE DEFAULT (CURRENT_DATE),
    probation_end_date DATE,
    contract_end_date DATE,
    salary DECIMAL(12,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'INR',
    pay_scale VARCHAR(50),
    manager_id INT,
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    marital_status ENUM('single', 'married', 'divorced', 'widowed'),
    address_street VARCHAR(255),
    address_city VARCHAR(100),
    address_state VARCHAR(100),
    address_zip_code VARCHAR(20),
    address_country VARCHAR(100),
    emergency_contact_name VARCHAR(255),
    emergency_contact_relationship VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_email VARCHAR(255),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(255),
    bank_ifsc_code VARCHAR(20),
    bank_account_type VARCHAR(50),
    pan_number VARCHAR(20),
    aadhar_number VARCHAR(20),
    passport_number VARCHAR(50),
    driving_license VARCHAR(50),
    skills JSON,
    current_performance_rating DECIMAL(2,1) CHECK (current_performance_rating >= 1 AND current_performance_rating <= 5),
    last_review_date DATE,
    next_review_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_employee_id (employee_id),
    INDEX idx_department (department),
    INDEX idx_employment_status (employment_status),
    INDEX idx_hire_date (hire_date),
    INDEX idx_manager_id (manager_id)
);

-- Training programs table
CREATE TABLE training_programs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    duration_weeks INT NOT NULL DEFAULT 1,
    max_participants INT DEFAULT 20,
    trainer_id INT,
    start_date DATE,
    end_date DATE,
    status ENUM('pending', 'active', 'completed', 'cancelled') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (trainer_id) REFERENCES trainers(id) ON DELETE SET NULL,
    INDEX idx_trainer_id (trainer_id),
    INDEX idx_status (status),
    INDEX idx_start_date (start_date)
);

-- Student enrollments table
CREATE TABLE student_enrollments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    program_id INT NOT NULL,
    enrollment_date DATE DEFAULT (CURRENT_DATE),
    completion_date DATE,
    grade VARCHAR(10),
    status ENUM('pending', 'active', 'completed', 'dropped') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (program_id) REFERENCES training_programs(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (student_id, program_id),
    INDEX idx_student_id (student_id),
    INDEX idx_program_id (program_id),
    INDEX idx_status (status)
);

-- Job postings table
CREATE TABLE job_postings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT,
    requirements TEXT,
    location VARCHAR(255),
    salary_range VARCHAR(100),
    job_type ENUM('full_time', 'part_time', 'contract', 'internship'),
    posted_by INT,
    posted_date DATE DEFAULT (CURRENT_DATE),
    closing_date DATE,
    status ENUM('open', 'closed', 'filled') DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (posted_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_posted_by (posted_by),
    INDEX idx_status (status),
    INDEX idx_posted_date (posted_date)
);

-- Job applications table
CREATE TABLE job_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    student_id INT NOT NULL,
    application_date DATE DEFAULT (CURRENT_DATE),
    status ENUM('pending', 'shortlisted', 'interviewed', 'selected', 'rejected') DEFAULT 'pending',
    notes TEXT,
    interview_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    UNIQUE KEY unique_application (job_id, student_id),
    INDEX idx_job_id (job_id),
    INDEX idx_student_id (student_id),
    INDEX idx_status (status)
);

-- Incubation projects table
CREATE TABLE incubation_projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    founder_id INT,
    mentor_id INT,
    start_date DATE DEFAULT (CURRENT_DATE),
    expected_completion DATE,
    status ENUM('idea', 'development', 'testing', 'launched', 'suspended') DEFAULT 'idea',
    funding_amount DECIMAL(12,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (founder_id) REFERENCES students(id) ON DELETE SET NULL,
    FOREIGN KEY (mentor_id) REFERENCES trainers(id) ON DELETE SET NULL,
    INDEX idx_founder_id (founder_id),
    INDEX idx_mentor_id (mentor_id),
    INDEX idx_status (status)
);

-- Inventory items table
CREATE TABLE inventory_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE,
    purchase_price DECIMAL(10,2),
    current_value DECIMAL(10,2),
    location VARCHAR(255),
    status ENUM('available', 'in_use', 'maintenance', 'damaged', 'disposed') DEFAULT 'available',
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_category (category),
    INDEX idx_status (status),
    INDEX idx_assigned_to (assigned_to)
);

-- Reports table
CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type ENUM('monthly', 'quarterly', 'annual', 'custom') NOT NULL,
    department VARCHAR(100),
    generated_by INT,
    data JSON,
    file_url VARCHAR(255),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    period_start DATE,
    period_end DATE,
    FOREIGN KEY (generated_by) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_generated_by (generated_by),
    INDEX idx_type (type),
    INDEX idx_department (department)
);

-- Create demo users
INSERT INTO users (email, password, full_name, role, status) VALUES
('admin@youthnet.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin', 'active'),
('staff@youthnet.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Staff User', 'staff', 'active'),
('trainer@youthnet.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Trainer User', 'trainer', 'active'),
('student@youthnet.in', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Student User', 'student', 'active');

-- Note: The password hash above is for 'password' - you should change these in production
