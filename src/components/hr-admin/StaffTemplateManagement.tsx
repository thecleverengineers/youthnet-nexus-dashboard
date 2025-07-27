import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Plus, Edit, DollarSign, GraduationCap } from 'lucide-react';
import { toast } from 'sonner';
import { staffService } from '@/services/staffService';

export function StaffTemplateManagement() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: templates, isLoading } = useQuery({
    queryKey: ['staff-templates'],
    queryFn: staffService.getStaffTemplates
  });

  const createTemplateMutation = useMutation({
    mutationFn: staffService.createStaffTemplate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-templates'] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      toast.success('Staff template created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating template: ${error.message}`);
    }
  });

  const updateTemplateMutation = useMutation({
    mutationFn: ({ id, ...updateData }: any) => staffService.updateStaffTemplate(id, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff-templates'] });
      setIsDialogOpen(false);
      setEditingTemplate(null);
      toast.success('Staff template updated successfully');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const templateData = {
      role_name: formData.get('role_name') as string,
      description: formData.get('description') as string,
      responsibilities: (formData.get('responsibilities') as string)?.split('\n').filter(Boolean) || [],
      required_qualifications: (formData.get('required_qualifications') as string)?.split('\n').filter(Boolean) || [],
      salary_range_min: parseFloat(formData.get('salary_range_min') as string) || 0,
      salary_range_max: parseFloat(formData.get('salary_range_max') as string) || 0,
      permissions: [],
      is_active: true
    };

    if (editingTemplate) {
      updateTemplateMutation.mutate({ id: editingTemplate.id, ...templateData });
    } else {
      createTemplateMutation.mutate(templateData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Staff Role Templates
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? 'Edit Staff Template' : 'Create Staff Template'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  name="role_name"
                  placeholder="Role Name"
                  defaultValue={editingTemplate?.role_name || ''}
                  required
                />
                <Textarea
                  name="description"
                  placeholder="Role Description"
                  defaultValue={editingTemplate?.description || ''}
                  rows={3}
                />
                <Textarea
                  name="responsibilities"
                  placeholder="Responsibilities (one per line)"
                  defaultValue={editingTemplate?.responsibilities?.join('\n') || ''}
                  rows={4}
                />
                <Textarea
                  name="required_qualifications"
                  placeholder="Required Qualifications (one per line)"
                  defaultValue={editingTemplate?.required_qualifications?.join('\n') || ''}
                  rows={3}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    name="salary_range_min"
                    type="number"
                    placeholder="Min Salary"
                    defaultValue={editingTemplate?.salary_range_min || ''}
                  />
                  <Input
                    name="salary_range_max"
                    type="number"
                    placeholder="Max Salary"
                    defaultValue={editingTemplate?.salary_range_max || ''}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingTemplate ? 'Update' : 'Create'} Template
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Loading templates...
          </div>
        ) : templates?.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No staff templates found. Create one to get started.
          </div>
        ) : (
          <div className="grid gap-4">
            {templates?.map((template) => (
              <div key={template.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-lg">{template.role_name}</h3>
                    <p className="text-sm text-muted-foreground">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingTemplate(template);
                        setIsDialogOpen(true);
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {template.salary_range_min && template.salary_range_max && (
                  <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      ${template.salary_range_min?.toLocaleString()} - ${template.salary_range_max?.toLocaleString()}
                    </span>
                  </div>
                )}

                {template.responsibilities && template.responsibilities.length > 0 && (
                  <div className="mb-3">
                    <h4 className="text-sm font-medium mb-2">Key Responsibilities:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      {template.responsibilities.slice(0, 3).map((resp, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                          {resp}
                        </li>
                      ))}
                      {template.responsibilities.length > 3 && (
                        <li className="text-xs">
                          +{template.responsibilities.length - 3} more responsibilities
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                {template.required_qualifications && template.required_qualifications.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Required Qualifications:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {template.required_qualifications.slice(0, 3).map((qual, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {qual}
                        </Badge>
                      ))}
                      {template.required_qualifications.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.required_qualifications.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}