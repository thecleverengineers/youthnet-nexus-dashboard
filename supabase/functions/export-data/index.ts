import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Export all tables data
    const exportData = {
      profiles: [],
      students: [],
      trainers: [],
      employees: [],
      education_courses: [],
      course_enrollments: [],
      training_programs: [],
      student_enrollments: [],
      job_postings: [],
      job_applications: [],
      incubation_projects: [],
      startup_applications: [],
      inventory_items: [],
      attendance_records: [],
      employee_tasks: [],
      leave_requests: [],
      payroll_cycles: [],
      payroll: [],
      performance_reviews: [],
      employee_training: [],
      employee_benefits: [],
      skill_assessments: [],
      certifications: [],
      livelihood_programs: [],
      local_products: [],
      analytics_dashboards: [],
      reports: []
    }

    // Export profiles
    const { data: profiles, error: profilesError } = await supabaseClient
      .from('profiles')
      .select('*')
    
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
    } else {
      exportData.profiles = profiles || []
    }

    // Export students
    const { data: students, error: studentsError } = await supabaseClient
      .from('students')
      .select('*')
    
    if (studentsError) {
      console.error('Error fetching students:', studentsError)
    } else {
      exportData.students = students || []
    }

    // Export trainers
    const { data: trainers, error: trainersError } = await supabaseClient
      .from('trainers')
      .select('*')
    
    if (trainersError) {
      console.error('Error fetching trainers:', trainersError)
    } else {
      exportData.trainers = trainers || []
    }

    // Export employees
    const { data: employees, error: employeesError } = await supabaseClient
      .from('employees')
      .select('*')
    
    if (employeesError) {
      console.error('Error fetching employees:', employeesError)
    } else {
      exportData.employees = employees || []
    }

    // Export education courses
    const { data: courses, error: coursesError } = await supabaseClient
      .from('education_courses')
      .select('*')
    
    if (coursesError) {
      console.error('Error fetching education_courses:', coursesError)
    } else {
      exportData.education_courses = courses || []
    }

    // Export course enrollments
    const { data: courseEnrollments, error: courseEnrollmentsError } = await supabaseClient
      .from('course_enrollments')
      .select('*')
    
    if (courseEnrollmentsError) {
      console.error('Error fetching course_enrollments:', courseEnrollmentsError)
    } else {
      exportData.course_enrollments = courseEnrollments || []
    }

    // Export training programs
    const { data: trainingPrograms, error: trainingProgramsError } = await supabaseClient
      .from('training_programs')
      .select('*')
    
    if (trainingProgramsError) {
      console.error('Error fetching training_programs:', trainingProgramsError)
    } else {
      exportData.training_programs = trainingPrograms || []
    }

    // Export job postings
    const { data: jobPostings, error: jobPostingsError } = await supabaseClient
      .from('job_postings')
      .select('*')
    
    if (jobPostingsError) {
      console.error('Error fetching job_postings:', jobPostingsError)
    } else {
      exportData.job_postings = jobPostings || []
    }

    // Export job applications
    const { data: jobApplications, error: jobApplicationsError } = await supabaseClient
      .from('job_applications')
      .select('*')
    
    if (jobApplicationsError) {
      console.error('Error fetching job_applications:', jobApplicationsError)
    } else {
      exportData.job_applications = jobApplications || []
    }

    // Export incubation projects
    const { data: incubationProjects, error: incubationProjectsError } = await supabaseClient
      .from('incubation_projects')
      .select('*')
    
    if (incubationProjectsError) {
      console.error('Error fetching incubation_projects:', incubationProjectsError)
    } else {
      exportData.incubation_projects = incubationProjects || []
    }

    // Export inventory items
    const { data: inventoryItems, error: inventoryItemsError } = await supabaseClient
      .from('inventory_items')
      .select('*')
    
    if (inventoryItemsError) {
      console.error('Error fetching inventory_items:', inventoryItemsError)
    } else {
      exportData.inventory_items = inventoryItems || []
    }

    // Export local products
    const { data: localProducts, error: localProductsError } = await supabaseClient
      .from('local_products')
      .select('*')
    
    if (localProductsError) {
      console.error('Error fetching local_products:', localProductsError)
    } else {
      exportData.local_products = localProducts || []
    }

    // Export livelihood programs
    const { data: livelihoodPrograms, error: livelihoodProgramsError } = await supabaseClient
      .from('livelihood_programs')
      .select('*')
    
    if (livelihoodProgramsError) {
      console.error('Error fetching livelihood_programs:', livelihoodProgramsError)
    } else {
      exportData.livelihood_programs = livelihoodPrograms || []
    }

    // Count total records
    const totalRecords = Object.values(exportData).reduce((sum, arr) => sum + arr.length, 0)

    return new Response(
      JSON.stringify({
        success: true,
        message: `Exported ${totalRecords} total records`,
        data: exportData,
        summary: Object.entries(exportData).map(([table, data]) => ({
          table,
          count: data.length
        }))
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )

  } catch (error) {
    console.error('Export error:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})