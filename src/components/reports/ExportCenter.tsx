
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Download, Plus, FileText, Calendar } from 'lucide-react';
import { toast } from 'sonner';

export const ExportCenter = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: exportRequests, isLoading } = useQuery({
    queryKey: ['export-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('export_requests')
        .select('*')
        .order('requested_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createExportMutation = useMutation({
    mutationFn: async (exportData: any) => {
      const { data, error } = await supabase
        .from('export_requests')
        .insert([exportData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['export-requests'] });
      setIsDialogOpen(false);
      toast.success('Export request created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating export request: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const exportData = {
      export_type: formData.get('export_type') as string,
      data_source: formData.get('data_source') as string,
      format: formData.get('format') as string,
      filters: {
        date_from: formData.get('date_from') as string,
        date_to: formData.get('date_to') as string,
        department: formData.get('department') as string
      },
      status: 'pending'
    };

    createExportMutation.mutate(exportData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'csv': return '📊';
      case 'excel': return '📈';
      case 'pdf': return '📄';
      case 'json': return '🔧';
      default: return '📁';
    }
  };

  // Calculate summary stats
  const totalRequests = exportRequests?.length || 0;
  const completedRequests = exportRequests?.filter(r => r.status === 'completed').length || 0;
  const pendingRequests = exportRequests?.filter(r => r.status === 'pending').length || 0;
  const failedRequests = exportRequests?.filter(r => r.status === 'failed').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Requests</p>
                <p className="text-3xl font-bold text-primary">{totalRequests}</p>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedRequests}</p>
              </div>
              <Download className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingRequests}</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-3xl font-bold text-red-600">{failedRequests}</p>
              </div>
              <FileText className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Export Center */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Data Export Center
              </CardTitle>
              <CardDescription>Export data in various formats</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Export
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Export Request</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="export_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Export Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student_data">Student Data</SelectItem>
                      <SelectItem value="employee_data">Employee Data</SelectItem>
                      <SelectItem value="attendance_records">Attendance Records</SelectItem>
                      <SelectItem value="financial_reports">Financial Reports</SelectItem>
                      <SelectItem value="inventory_data">Inventory Data</SelectItem>
                      <SelectItem value="job_applications">Job Applications</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select name="data_source" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Data Source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education Department</SelectItem>
                      <SelectItem value="hr">HR Administration</SelectItem>
                      <SelectItem value="incubation">Incubation</SelectItem>
                      <SelectItem value="job_centre">Job Centre</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                      <SelectItem value="all">All Departments</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select name="format" required>
                    <SelectTrigger>
                      <SelectValue placeholder="File Format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="excel">Excel (XLSX)</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      name="date_from"
                      type="date"
                      placeholder="From Date"
                    />
                    <Input
                      name="date_to"
                      type="date"
                      placeholder="To Date"
                    />
                  </div>
                  
                  <Select name="department">
                    <SelectTrigger>
                      <SelectValue placeholder="Filter by Department (Optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="hr">HR</SelectItem>
                      <SelectItem value="incubation">Incubation</SelectItem>
                      <SelectItem value="job_centre">Job Centre</SelectItem>
                      <SelectItem value="inventory">Inventory</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button type="submit" className="w-full">
                    Create Export Request
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading export requests...
            </div>
          ) : exportRequests?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No export requests found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Export Type</TableHead>
                  <TableHead>Data Source</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Requested</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {exportRequests?.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="font-medium">
                        {request.export_type.replace('_', ' ').toUpperCase()}
                      </div>
                    </TableCell>
                    <TableCell>{request.data_source}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span>{getFormatIcon(request.format)}</span>
                        <span className="uppercase">{request.format}</span>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(request.requested_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {request.status === 'completed' && request.file_url ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(request.file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      ) : request.status === 'failed' ? (
                        <Button size="sm" variant="outline" disabled>
                          Retry
                        </Button>
                      ) : (
                        <span className="text-sm text-muted-foreground">Processing...</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
