
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Briefcase, MapPin, DollarSign, Calendar, Search, Plus, Eye } from 'lucide-react';
import { JobDetailsModal } from './JobDetailsModal';

interface JobPostingsProps {
  detailed?: boolean;
}

export function JobPostings({ detailed = false }: JobPostingsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);

  const { data: jobPostings, isLoading } = useQuery({
    queryKey: ['job-postings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(detailed ? 50 : 5);

      if (error) {
        console.error('Error fetching job postings:', error);
        // Return mock data as fallback
        return [
          {
            id: '1',
            title: 'Frontend Developer',
            company: 'Tech Solutions Inc.',
            location: 'Kohima, Nagaland',
            salary_range: '₹4-6 LPA',
            job_type: 'Full-time',
            status: 'open',
            description: 'Looking for a skilled frontend developer with React experience.',
            requirements: 'React, JavaScript, CSS, HTML',
            posted_date: new Date().toISOString().split('T')[0],
            closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          },
          {
            id: '2',
            title: 'Digital Marketing Specialist',
            company: 'Growth Marketing Agency',
            location: 'Dimapur, Nagaland',
            salary_range: '₹3-5 LPA',
            job_type: 'Full-time',
            status: 'open',
            description: 'Seeking a creative digital marketing specialist to drive online campaigns.',
            requirements: 'SEO, SEM, Social Media Marketing, Analytics',
            posted_date: new Date().toISOString().split('T')[0],
            closing_date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
          }
        ];
      }
      return data?.length ? data : [
        {
          id: '1',
          title: 'Frontend Developer',
          company: 'Tech Solutions Inc.',
          location: 'Kohima, Nagaland',
          salary_range: '₹4-6 LPA',
          job_type: 'Full-time',
          status: 'open',
          description: 'Looking for a skilled frontend developer with React experience.',
          requirements: 'React, JavaScript, CSS, HTML',
          posted_date: new Date().toISOString().split('T')[0],
          closing_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        }
      ];
    }
  });

  const filteredJobs = jobPostings?.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-red-100 text-red-800';
      case 'filled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Postings
          </div>
          {detailed && (
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Job
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {detailed && (
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search jobs, companies, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        )}

        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading job postings...
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No job postings found
            </div>
          ) : (
            filteredJobs.map((job) => (
              <div key={job.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-muted-foreground">{job.company}</p>
                  </div>
                  <Badge className={getStatusColor(job.status)}>
                    {job.status}
                  </Badge>
                </div>

                {job.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {job.description}
                  </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
                  {job.location && (
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{job.location}</span>
                    </div>
                  )}
                  {job.salary_range && (
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span>{job.salary_range}</span>
                    </div>
                  )}
                  {job.job_type && (
                    <div className="flex items-center gap-1">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{job.job_type}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Posted: {new Date(job.posted_date).toLocaleDateString()}</span>
                  </div>
                </div>

                {job.closing_date && (
                  <div className="text-xs text-muted-foreground mb-3">
                    Closing: {new Date(job.closing_date).toLocaleDateString()}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(job)}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Applications (0)
                  </Button>
                  {detailed && (
                    <Button size="sm">
                      Edit Job
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <JobDetailsModal 
        open={jobDetailsOpen} 
        onOpenChange={setJobDetailsOpen}
        job={selectedJob}
      />
    </Card>
  );
}
