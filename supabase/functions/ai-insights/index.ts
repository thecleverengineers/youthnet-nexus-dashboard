import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InsightRequest {
  type: 'employee_attrition' | 'student_success' | 'job_placement' | 'skill_gap' | 'all';
  timeframe?: 'week' | 'month' | 'quarter';
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { type, timeframe = 'month' }: InsightRequest = await req.json();

    console.log(`Generating AI insights for type: ${type}, timeframe: ${timeframe}`);

    let insights: any[] = [];

    switch (type) {
      case 'employee_attrition':
        insights = await generateEmployeeAttritionInsights(supabase);
        break;
      case 'student_success':
        insights = await generateStudentSuccessInsights(supabase);
        break;
      case 'job_placement':
        insights = await generateJobPlacementInsights(supabase);
        break;
      case 'skill_gap':
        insights = await generateSkillGapInsights(supabase);
        break;
      case 'all':
        const [attrition, success, placement, skillGap] = await Promise.all([
          generateEmployeeAttritionInsights(supabase),
          generateStudentSuccessInsights(supabase),
          generateJobPlacementInsights(supabase),
          generateSkillGapInsights(supabase)
        ]);
        insights = [...attrition, ...success, ...placement, ...skillGap];
        break;
      default:
        throw new Error(`Unknown insight type: ${type}`);
    }

    console.log(`Generated ${insights.length} insights`);

    return new Response(
      JSON.stringify({ insights, generated_at: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error generating AI insights:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate insights', details: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }, 
        status: 500 
      }
    );
  }
});

async function generateEmployeeAttritionInsights(supabase: any) {
  const { data: employees } = await supabase
    .from('employees')
    .select(`
      id, employee_id, department, position, hire_date, salary,
      attendance_tracking(*),
      employee_tasks(*)
    `);

  const insights = [];

  for (const emp of employees || []) {
    let riskScore = 0;
    const riskFactors = [];

    // Calculate attendance rate
    const attendance = emp.attendance_tracking || [];
    const presentDays = attendance.filter((a: any) => a.status === 'present').length;
    const attendanceRate = attendance.length > 0 ? presentDays / attendance.length : 0.8;

    // Calculate task completion rate
    const tasks = emp.employee_tasks || [];
    const completedTasks = tasks.filter((t: any) => t.status === 'completed').length;
    const taskCompletionRate = tasks.length > 0 ? completedTasks / tasks.length : 0.8;

    // Calculate tenure
    const hireDate = new Date(emp.hire_date);
    const now = new Date();
    const tenure = (now.getTime() - hireDate.getTime()) / (1000 * 60 * 60 * 24 * 365);

    // Risk assessment
    if (attendanceRate < 0.85) {
      riskScore += 0.3;
      riskFactors.push('Low attendance rate');
    }
    
    if (taskCompletionRate < 0.8) {
      riskScore += 0.3;
      riskFactors.push('Low task completion rate');
    }
    
    if (tenure > 2 && (attendanceRate + taskCompletionRate) / 2 < 0.7) {
      riskScore += 0.4;
      riskFactors.push('Declining performance with tenure');
    }

    if (riskScore > 0.5) {
      insights.push({
        id: `attrition-${emp.id}`,
        type: 'prediction',
        title: `Attrition Risk: ${emp.department}`,
        description: `Employee ${emp.employee_id} in ${emp.position} showing attrition risk indicators`,
        confidence: Math.min(riskScore, 1),
        impact: riskScore > 0.7 ? 'high' : 'medium',
        category: 'HR Analytics',
        data: {
          employeeId: emp.id,
          department: emp.department,
          position: emp.position,
          riskFactors,
          attendanceRate: Math.round(attendanceRate * 100),
          taskCompletionRate: Math.round(taskCompletionRate * 100),
          tenure: Math.round(tenure * 10) / 10
        },
        created_at: new Date().toISOString()
      });
    }
  }

  return insights;
}

async function generateStudentSuccessInsights(supabase: any) {
  const { data: students } = await supabase
    .from('students')
    .select(`
      id, student_id, name,
      skill_assessments(*),
      student_enrollments(*)
    `);

  const insights = [];

  for (const student of students || []) {
    let successScore = 0;
    const successFactors = [];

    const assessments = student.skill_assessments || [];
    const enrollments = student.student_enrollments || [];

    // Calculate average assessment score
    const avgScore = assessments.length > 0 
      ? assessments.reduce((sum: number, a: any) => sum + (a.score || 0), 0) / assessments.length 
      : 0;

    // Calculate completion rate
    const completedAssessments = assessments.filter((a: any) => a.status === 'completed').length;
    const completionRate = assessments.length > 0 ? completedAssessments / assessments.length : 0;

    // Success factors
    if (avgScore > 80) {
      successScore += 0.4;
      successFactors.push('High assessment scores');
    }
    
    if (completionRate > 0.9) {
      successScore += 0.3;
      successFactors.push('Excellent completion rate');
    }
    
    if (enrollments.length > 2) {
      successScore += 0.3;
      successFactors.push('Multiple program enrollments');
    }

    if (successScore > 0.6) {
      insights.push({
        id: `success-${student.id}`,
        type: 'prediction',
        title: `High Success Probability: ${student.name}`,
        description: `Student showing excellent performance indicators across multiple metrics`,
        confidence: Math.min(successScore, 1),
        impact: 'high',
        category: 'Education Analytics',
        data: {
          studentId: student.id,
          studentName: student.name,
          successFactors,
          avgScore: Math.round(avgScore),
          completionRate: Math.round(completionRate * 100),
          enrollmentCount: enrollments.length
        },
        created_at: new Date().toISOString()
      });
    }
  }

  return insights;
}

async function generateJobPlacementInsights(supabase: any) {
  const { data: jobs } = await supabase.from('job_postings').select('*');
  const { data: students } = await supabase.from('students').select(`
    id, student_id, name,
    skill_assessments(*)
  `);

  const insights = [];

  for (const student of students || []) {
    const studentSkills = (student.skill_assessments || [])
      .map((sa: any) => sa.skill_name?.toLowerCase())
      .filter(Boolean);

    for (const job of jobs || []) {
      const jobSkills = (job.requirements || '')
        .toLowerCase()
        .split(/[,\s]+/)
        .filter((skill: string) => skill.length > 2);

      const matchedSkills = studentSkills.filter((skill: string) => 
        jobSkills.some((jobSkill: string) => jobSkill.includes(skill) || skill.includes(jobSkill))
      );

      const matchScore = matchedSkills.length / Math.max(jobSkills.length, 1);

      if (matchScore > 0.6) {
        insights.push({
          id: `match-${student.id}-${job.id}`,
          type: 'recommendation',
          title: `Job Match: ${job.title}`,
          description: `Strong skill alignment between ${student.name} and ${job.company}`,
          confidence: Math.min(matchScore, 1),
          impact: matchScore > 0.8 ? 'high' : 'medium',
          category: 'Job Placement',
          data: {
            studentId: student.id,
            studentName: student.name,
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            matchedSkills,
            matchScore: Math.round(matchScore * 100)
          },
          created_at: new Date().toISOString()
        });
      }
    }
  }

  return insights.slice(0, 20); // Limit to top 20 matches
}

async function generateSkillGapInsights(supabase: any) {
  const { data: jobs } = await supabase.from('job_postings').select('*');
  const { data: assessments } = await supabase.from('skill_assessments').select('*');

  const insights = [];

  // Analyze skill demand from job postings
  const skillDemand: Record<string, number> = {};
  jobs?.forEach((job: any) => {
    const skills = (job.requirements || '').toLowerCase().split(/[,\s]+/);
    skills.forEach((skill: string) => {
      if (skill.length > 2) {
        skillDemand[skill] = (skillDemand[skill] || 0) + 1;
      }
    });
  });

  // Analyze skill supply from assessments
  const skillSupply: Record<string, number> = {};
  assessments?.forEach((assessment: any) => {
    const skill = assessment.skill_name?.toLowerCase();
    if (skill) {
      skillSupply[skill] = (skillSupply[skill] || 0) + 1;
    }
  });

  // Identify gaps
  Object.entries(skillDemand).forEach(([skill, demand]) => {
    const supply = skillSupply[skill] || 0;
    const gap = demand - supply;
    
    if (gap > 3) { // Significant gap threshold
      insights.push({
        id: `gap-${skill}`,
        type: 'trend',
        title: `Skill Gap: ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
        description: `High market demand (${demand} positions) vs limited talent supply (${supply} assessed)`,
        confidence: 0.8,
        impact: gap > 10 ? 'high' : 'medium',
        category: 'Skill Development',
        data: {
          skill,
          demand,
          supply,
          gap,
          recommendedAction: 'Increase training programs for this skill'
        },
        created_at: new Date().toISOString()
      });
    }
  });

  return insights.sort((a, b) => b.data.gap - a.data.gap).slice(0, 10);
}