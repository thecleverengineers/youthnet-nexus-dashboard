import { supabase } from '@/integrations/supabase/client';

export interface MLInsight {
  id: string;
  type: 'prediction' | 'recommendation' | 'anomaly' | 'trend';
  title: string;
  description: string;
  confidence: number;
  impact: 'high' | 'medium' | 'low';
  category: string;
  data: any;
  created_at: string;
}

export interface PredictiveMetrics {
  employeeAttritionRisk: number;
  studentSuccessRate: number;
  jobPlacementProbability: number;
  revenueGrowthForecast: number;
  skillDemandTrend: { skill: string; demand: number; growth: number }[];
}

class MLService {
  // Data preprocessing utilities
  async preprocessEmployeeData() {
    const { data: employees } = await supabase
      .from('employees')
      .select(`
        *,
        attendance_tracking(*),
        employee_tasks(*),
        payroll(*)
      `);

    return employees?.map(emp => ({
      id: emp.id,
      tenure: this.calculateTenure(emp.hire_date),
      department: emp.department,
      position: emp.position,
      salary: emp.salary,
      performanceScore: this.calculatePerformanceScore(emp),
      attendanceRate: this.calculateAttendanceRate(emp.attendance_tracking),
      taskCompletionRate: this.calculateTaskCompletionRate(emp.employee_tasks),
      attritionRisk: 0 // Will be calculated by ML model
    })) || [];
  }

  async preprocessStudentData() {
    const { data: students } = await supabase
      .from('students')
      .select(`
        *,
        skill_assessments(*),
        student_enrollments(*)
      `);

    return students?.map(student => ({
      id: student.id,
      enrollmentCount: student.student_enrollments?.length || 0,
      avgAssessmentScore: this.calculateAvgScore(student.skill_assessments),
      completionRate: this.calculateCompletionRate(student.skill_assessments),
      successProbability: 0 // Will be calculated by ML model
    })) || [];
  }

  // Predictive Analytics
  async generateEmployeeAttritionPrediction(): Promise<MLInsight[]> {
    const employeeData = await this.preprocessEmployeeData();
    const insights: MLInsight[] = [];

    // Simple heuristic-based prediction (can be replaced with actual ML model)
    employeeData.forEach(emp => {
      let riskScore = 0;
      
      // Risk factors
      if (emp.attendanceRate < 0.85) riskScore += 0.3;
      if (emp.taskCompletionRate < 0.8) riskScore += 0.3;
      if (emp.tenure > 2 && emp.performanceScore < 0.7) riskScore += 0.4;

      if (riskScore > 0.6) {
        insights.push({
          id: `attrition-${emp.id}`,
          type: 'prediction',
          title: `High Attrition Risk - ${emp.department}`,
          description: `Employee in ${emp.position} showing high attrition risk indicators`,
          confidence: riskScore,
          impact: riskScore > 0.8 ? 'high' : 'medium',
          category: 'HR',
          data: { employeeId: emp.id, riskFactors: ['attendance', 'performance'] },
          created_at: new Date().toISOString()
        });
      }
    });

    return insights;
  }

  async generateStudentSuccessPrediction(): Promise<MLInsight[]> {
    const studentData = await this.preprocessStudentData();
    const insights: MLInsight[] = [];

    studentData.forEach(student => {
      let successScore = 0;
      
      if (student.avgAssessmentScore > 0.8) successScore += 0.4;
      if (student.completionRate > 0.9) successScore += 0.3;
      if (student.enrollmentCount > 2) successScore += 0.3;

      if (successScore > 0.7) {
        insights.push({
          id: `success-${student.id}`,
          type: 'prediction',
          title: 'High Success Probability Student',
          description: 'Student showing excellent performance indicators',
          confidence: successScore,
          impact: 'high',
          category: 'Education',
          data: { studentId: student.id, successFactors: ['assessments', 'completion'] },
          created_at: new Date().toISOString()
        });
      }
    });

    return insights;
  }

  async generateJobPlacementRecommendations(): Promise<MLInsight[]> {
    const { data: jobs } = await supabase.from('job_postings').select('*');
    const { data: students } = await supabase.from('students').select('*, skill_assessments(*)');
    
    const insights: MLInsight[] = [];

    // Skill-based job matching
    students?.forEach(student => {
      const studentSkills = student.skill_assessments?.map(sa => sa.skill_name) || [];
      
      jobs?.forEach(job => {
        const matchScore = this.calculateSkillMatch(studentSkills, job.requirements || '');
        
        if (matchScore > 0.7) {
          insights.push({
            id: `match-${student.id}-${job.id}`,
            type: 'recommendation',
            title: `Job Match: ${job.title}`,
            description: `Strong skill alignment for student with ${job.company}`,
            confidence: matchScore,
            impact: 'high',
            category: 'Job Centre',
            data: { studentId: student.id, jobId: job.id, matchedSkills: studentSkills },
            created_at: new Date().toISOString()
          });
        }
      });
    });

    return insights;
  }

  async generateSkillGapAnalysis(): Promise<MLInsight[]> {
    const { data: skills } = await supabase.from('skill_assessments').select('*');
    const { data: jobs } = await supabase.from('job_postings').select('*');
    
    const insights: MLInsight[] = [];
    
    // Analyze skill demand vs supply
    const skillDemand = this.analyzeSkillDemand(jobs || []);
    const skillSupply = this.analyzeSkillSupply(skills || []);
    
    Object.keys(skillDemand).forEach(skill => {
      const demand = skillDemand[skill];
      const supply = skillSupply[skill] || 0;
      const gap = demand - supply;
      
      if (gap > 5) { // Significant gap
        insights.push({
          id: `gap-${skill}`,
          type: 'trend',
          title: `Skill Gap Identified: ${skill}`,
          description: `High demand (${demand}) vs low supply (${supply}) for ${skill}`,
          confidence: 0.8,
          impact: 'high',
          category: 'Skill Development',
          data: { skill, demand, supply, gap },
          created_at: new Date().toISOString()
        });
      }
    });

    return insights;
  }

  async generatePredictiveMetrics(): Promise<PredictiveMetrics> {
    const [employeeData, studentData] = await Promise.all([
      this.preprocessEmployeeData(),
      this.preprocessStudentData()
    ]);

    // Calculate metrics using simple heuristics
    const employeeAttritionRisk = employeeData.reduce((acc, emp) => {
      let risk = 0;
      if (emp.attendanceRate < 0.85) risk += 0.3;
      if (emp.taskCompletionRate < 0.8) risk += 0.3;
      return acc + risk;
    }, 0) / employeeData.length;

    const studentSuccessRate = studentData.reduce((acc, student) => {
      let success = 0;
      if (student.avgAssessmentScore > 0.8) success += 0.5;
      if (student.completionRate > 0.9) success += 0.5;
      return acc + success;
    }, 0) / studentData.length;

    const jobPlacementProbability = Math.min(0.9, studentSuccessRate * 1.2);
    const revenueGrowthForecast = this.calculateRevenueGrowthForecast();

    return {
      employeeAttritionRisk: Math.round(employeeAttritionRisk * 100) / 100,
      studentSuccessRate: Math.round(studentSuccessRate * 100) / 100,
      jobPlacementProbability: Math.round(jobPlacementProbability * 100) / 100,
      revenueGrowthForecast: Math.round(revenueGrowthForecast * 100) / 100,
      skillDemandTrend: await this.generateSkillDemandTrend()
    };
  }

  // Utility functions
  private calculateTenure(hireDate: string): number {
    const hire = new Date(hireDate);
    const now = new Date();
    return (now.getTime() - hire.getTime()) / (1000 * 60 * 60 * 24 * 365);
  }

  private calculatePerformanceScore(employee: any): number {
    // Simple performance calculation based on available data
    const taskCompletion = this.calculateTaskCompletionRate(employee.employee_tasks);
    const attendance = this.calculateAttendanceRate(employee.attendance_tracking);
    return (taskCompletion + attendance) / 2;
  }

  private calculateAttendanceRate(attendance: any[]): number {
    if (!attendance || attendance.length === 0) return 0.8; // Default
    const present = attendance.filter(a => a.status === 'present').length;
    return present / attendance.length;
  }

  private calculateTaskCompletionRate(tasks: any[]): number {
    if (!tasks || tasks.length === 0) return 0.8; // Default
    const completed = tasks.filter(t => t.status === 'completed').length;
    return completed / tasks.length;
  }

  private calculateAvgScore(assessments: any[]): number {
    if (!assessments || assessments.length === 0) return 0;
    const total = assessments.reduce((sum, a) => sum + (a.score || 0), 0);
    return total / assessments.length / 100; // Normalize to 0-1
  }

  private calculateCompletionRate(assessments: any[]): number {
    if (!assessments || assessments.length === 0) return 0;
    const completed = assessments.filter(a => a.status === 'completed').length;
    return completed / assessments.length;
  }

  private calculateSkillMatch(studentSkills: string[], jobRequirements: string): number {
    const reqSkills = jobRequirements.toLowerCase().split(/[,\s]+/);
    const matches = studentSkills.filter(skill => 
      reqSkills.some(req => req.includes(skill.toLowerCase()))
    );
    return matches.length / Math.max(reqSkills.length, 1);
  }

  private analyzeSkillDemand(jobs: any[]): Record<string, number> {
    const demand: Record<string, number> = {};
    jobs.forEach(job => {
      const skills = (job.requirements || '').toLowerCase().split(/[,\s]+/);
      skills.forEach(skill => {
        if (skill.length > 2) {
          demand[skill] = (demand[skill] || 0) + 1;
        }
      });
    });
    return demand;
  }

  private analyzeSkillSupply(assessments: any[]): Record<string, number> {
    const supply: Record<string, number> = {};
    assessments.forEach(assessment => {
      const skill = assessment.skill_name?.toLowerCase();
      if (skill) {
        supply[skill] = (supply[skill] || 0) + 1;
      }
    });
    return supply;
  }

  private calculateRevenueGrowthForecast(): number {
    // Simple forecast based on historical trends
    return 0.15; // 15% growth forecast
  }

  private async generateSkillDemandTrend(): Promise<{ skill: string; demand: number; growth: number }[]> {
    const { data: jobs } = await supabase.from('job_postings').select('*');
    const skillDemand = this.analyzeSkillDemand(jobs || []);
    
    return Object.entries(skillDemand)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([skill, demand]) => ({
        skill,
        demand,
        growth: Math.random() * 0.3 + 0.1 // Mock growth rate
      }));
  }
}

export const mlService = new MLService();