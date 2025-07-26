import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Award, Calendar, Download, ExternalLink, Plus, Edit } from 'lucide-react';
import { toast } from 'sonner';

export function CertificationTracking() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('certifications')
        .select(`
          *,
          students:student_id (
            student_id,
            profiles:user_id (
              full_name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const createCertificationMutation = useMutation({
    mutationFn: async (certificationData: any) => {
      const { data, error } = await supabase
        .from('certifications')
        .insert([certificationData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsDialogOpen(false);
      setEditingCertification(null);
      toast.success('Certification added successfully');
    },
    onError: (error: any) => {
      toast.error(`Error adding certification: ${error.message}`);
    }
  });

  const updateCertificationMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('certifications')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certifications'] });
      setIsDialogOpen(false);
      setEditingCertification(null);
      toast.success('Certification updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const certificationData = {
      name: formData.get('name') as string,
      issuer: formData.get('issuer') as string,
      progress: parseInt(formData.get('progress') as string),
      status: formData.get('status') as string,
      issue_date: formData.get('issue_date') as string,
      expiry_date: formData.get('expiry_date') as string,
      expected_completion: formData.get('expected_completion') as string,
      credential_id: formData.get('credential_id') as string,
      skills: (formData.get('skills') as string)?.split(',').map(s => s.trim()).filter(Boolean) || []
    };

    if (editingCertification) {
      updateCertificationMutation.mutate({ id: editingCertification.id, ...certificationData });
    } else {
      createCertificationMutation.mutate(certificationData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Certification Tracking
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Issue New Certificate
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>
                  {editingCertification ? 'Edit Certification' : 'Add New Certification'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="name"
                  placeholder="Certification Name"
                  defaultValue={editingCertification?.name || ''}
                  required
                />
                <Input
                  name="issuer"
                  placeholder="Issuer"
                  defaultValue={editingCertification?.issuer || ''}
                  required
                />
                <Input
                  name="progress"
                  type="number"
                  placeholder="Progress (0-100)"
                  min="0"
                  max="100"
                  defaultValue={editingCertification?.progress || ''}
                  required
                />
                <Select name="status" defaultValue={editingCertification?.status || 'pending'}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  name="issue_date"
                  type="date"
                  placeholder="Issue Date"
                  defaultValue={editingCertification?.issue_date || ''}
                />
                <Input
                  name="expiry_date"
                  type="date"
                  placeholder="Expiry Date"
                  defaultValue={editingCertification?.expiry_date || ''}
                />
                <Input
                  name="expected_completion"
                  type="date"
                  placeholder="Expected Completion"
                  defaultValue={editingCertification?.expected_completion || ''}
                />
                <Input
                  name="credential_id"
                  placeholder="Credential ID"
                  defaultValue={editingCertification?.credential_id || ''}
                />
                <Input
                  name="skills"
                  placeholder="Skills (comma separated)"
                  defaultValue={editingCertification?.skills?.join(', ') || ''}
                />
                <Button type="submit" className="w-full">
                  {editingCertification ? 'Update' : 'Add'} Certification
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading certifications...
          </div>
        ) : certifications?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No certifications found. Add one to get started.
          </div>
        ) : (
          <div className="space-y-6">
            {certifications?.map((cert) => (
              <div key={cert.id} className="border rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{cert.name}</h3>
                    <p className="text-muted-foreground text-sm mb-1">
                      Student: {cert.students?.profiles?.full_name || 'Unassigned'}
                    </p>
                    <p className="text-muted-foreground text-sm mb-2">
                      Issuer: {cert.issuer}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {cert.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(cert.status)}>
                      {cert.status.replace('_', ' ')}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingCertification(cert);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{cert.progress}%</span>
                  </div>
                  <Progress value={cert.progress} className="h-2" />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                  {cert.status === 'completed' ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Issued: {cert.issue_date ? new Date(cert.issue_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>Expires: {cert.expiry_date ? new Date(cert.expiry_date).toLocaleDateString() : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">ID: </span>
                        {cert.credential_id || 'N/A'}
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>Expected: {cert.expected_completion ? new Date(cert.expected_completion).toLocaleDateString() : 'N/A'}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {cert.status === 'completed' ? (
                    <>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button variant="outline" size="sm">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Verify
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm">
                        View Progress
                      </Button>
                      <Button size="sm">
                        Update Status
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}