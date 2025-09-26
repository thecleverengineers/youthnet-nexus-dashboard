import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Briefcase, Plus, AlertTriangle } from 'lucide-react';

interface JobPostingsProps {
  detailed?: boolean;
}

export function JobPostings({ detailed = false }: JobPostingsProps) {
  // The job_postings table doesn't exist yet
  // This component needs database tables to be created first
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Postings
            </CardTitle>
            <CardDescription>
              Manage and track job opportunities
            </CardDescription>
          </div>
          <Button disabled>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border-amber-200 bg-amber-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Database Setup Required</p>
              <p className="text-sm text-amber-700 mt-1">
                The job postings feature requires the following database tables:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                <li>job_postings - To store job listings and details</li>
                <li>job_applications - To track candidate applications</li>
                <li>job_skills - To define required skills</li>
                <li>job_categories - To organize job types</li>
              </ul>
              <p className="text-sm text-amber-700 mt-3">
                Please contact your administrator to complete the setup.
              </p>
            </div>
          </div>
        </div>

        {/* Placeholder showing what would be displayed */}
        <div className="mt-6 space-y-4">
          <div className="text-center py-8 text-muted-foreground">
            <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No job postings available</p>
            <p className="text-xs mt-1">Job postings will appear here once the system is configured</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}