
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  requirements: string;
  location: string;
  salary_range: string;
  job_type: string;
  status: string;
  posted_date: string;
  closing_date: string;
  posted_by: string;
}

export interface JobApplication {
  id: string;
  job_id: string;
  student_id: string;
  application_date: string;
  status: string;
  interview_date?: string;
  notes?: string;
  job_postings?: JobPosting;
  students?: {
    student_id: string;
    profiles?: {
      full_name: string;
      email: string;
    };
  };
}

export const jobService = {
  async fetchJobPostings() {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .order('posted_date', { ascending: false });

    if (error) {
      console.error('Error fetching job postings:', error);
      toast.error('Failed to fetch job postings');
      return [];
    }

    return data || [];
  },

  async createJobPosting(jobData: any) {
    const { data, error } = await supabase
      .from('job_postings')
      .insert({
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        requirements: jobData.requirements,
        location: jobData.location,
        salary_range: jobData.salary_range,
        job_type: jobData.job_type,
        closing_date: jobData.closing_date,
        status: 'open'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating job posting:', error);
      toast.error('Failed to create job posting');
      return null;
    }

    toast.success('Job posting created successfully');
    return data;
  },

  async fetchJobApplications() {
    const { data, error } = await supabase
      .from('job_applications')
      .select(`
        *,
        job_postings (
          title,
          company
        ),
        students (
          student_id,
          profiles (
            full_name,
            email
          )
        )
      `)
      .order('application_date', { ascending: false });

    if (error) {
      console.error('Error fetching job applications:', error);
      toast.error('Failed to fetch job applications');
      return [];
    }

    return data || [];
  },

  async updateApplicationStatus(applicationId: string, status: string, notes?: string) {
    const updates: any = { status };
    if (notes) updates.notes = notes;

    const { data, error } = await supabase
      .from('job_applications')
      .update(updates)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) {
      console.error('Error updating application:', error);
      toast.error('Failed to update application');
      return null;
    }

    toast.success('Application status updated');
    return data;
  }
};
