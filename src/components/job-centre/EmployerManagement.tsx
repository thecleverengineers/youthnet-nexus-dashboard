
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Building2, MapPin, Phone, Mail, Plus } from 'lucide-react';

export function EmployerManagement() {
  const { data: employers, isLoading } = useQuery({
    queryKey: ['employers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('job_postings')
        .select('company, location')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group by company and get unique employers
      const uniqueEmployers = data?.reduce((acc: any[], curr) => {
        const existing = acc.find(emp => emp.company === curr.company);
        if (!existing) {
          acc.push({
            id: acc.length + 1,
            company: curr.company,
            location: curr.location,
            activeJobs: data.filter(job => job.company === curr.company).length,
            status: 'active'
          });
        }
        return acc;
      }, []) || [];

      return uniqueEmployers;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Employer Management
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Employer
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading employers...
            </div>
          ) : employers?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No employers found
            </div>
          ) : (
            employers?.map((employer) => (
              <div key={employer.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{employer.company}</h3>
                    {employer.location && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{employer.location}</span>
                      </div>
                    )}
                  </div>
                  <Badge className="bg-green-100 text-green-800">
                    {employer.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 mb-3 text-sm text-muted-foreground">
                  <span>Active Jobs: {employer.activeJobs}</span>
                  <span>Partnership Since: 2023</span>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
