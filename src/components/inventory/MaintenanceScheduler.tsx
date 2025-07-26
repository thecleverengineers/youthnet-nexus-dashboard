import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Calendar, Clock, Wrench, Plus, Edit } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';

export const MaintenanceScheduler = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: maintenanceTasks, isLoading } = useQuery({
    queryKey: ['maintenance-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .select(`
          *,
          inventory_items:asset_id (
            name,
            category
          ),
          profiles:assigned_to (
            full_name
          )
        `)
        .order('next_due_date', { ascending: true });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: inventoryItems } = useQuery({
    queryKey: ['inventory-items-for-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_items')
        .select('id, name, category')
        .order('name');

      if (error) throw error;
      return data || [];
    }
  });

  const { data: assignees } = useQuery({
    queryKey: ['assignees-for-maintenance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name')
        .order('full_name');

      if (error) throw error;
      return data || [];
    }
  });

  const createTaskMutation = useMutation({
    mutationFn: async (taskData: any) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .insert([taskData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      setIsDialogOpen(false);
      setEditingTask(null);
      toast.success('Maintenance task scheduled successfully');
    },
    onError: (error: any) => {
      toast.error(`Error scheduling task: ${error.message}`);
    }
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      setIsDialogOpen(false);
      setEditingTask(null);
      toast.success('Maintenance task updated successfully');
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('maintenance_schedules')
        .update({ status: 'completed' })
        .eq('id', taskId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['maintenance-schedules'] });
      toast.success('Task marked as completed');
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const taskData = {
      asset_id: formData.get('asset_id') as string,
      task_name: formData.get('task_name') as string,
      task_description: formData.get('task_description') as string,
      frequency: formData.get('frequency') as string,
      next_due_date: formData.get('next_due_date') as string,
      assigned_to: formData.get('assigned_to') as string,
      priority: formData.get('priority') as string,
      estimated_duration: parseInt(formData.get('estimated_duration') as string),
      cost_estimate: parseFloat(formData.get('cost_estimate') as string),
      status: formData.get('status') as string || 'scheduled'
    };

    if (editingTask) {
      updateTaskMutation.mutate({ id: editingTask.id, ...taskData });
    } else {
      createTaskMutation.mutate(taskData);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusFromDate = (dueDate: string, currentStatus: string) => {
    if (currentStatus === 'completed') return currentStatus;
    const today = new Date();
    const due = new Date(dueDate);
    return due < today ? 'overdue' : 'scheduled';
  };

  // Calculate summary stats
  const scheduledCount = maintenanceTasks?.filter(t => getStatusFromDate(t.next_due_date, t.status) === 'scheduled').length || 0;
  const overdueCount = maintenanceTasks?.filter(t => getStatusFromDate(t.next_due_date, t.status) === 'overdue').length || 0;
  const completedCount = maintenanceTasks?.filter(t => t.status === 'completed').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Scheduled</p>
                <p className="text-3xl font-bold text-blue-600">{scheduledCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-3xl font-bold text-red-600">{overdueCount}</p>
              </div>
              <Clock className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-green-600">{completedCount}</p>
              </div>
              <Wrench className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Maintenance Schedule Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Wrench className="h-5 w-5" />
                Maintenance Schedule
              </CardTitle>
              <CardDescription>
                Schedule and track maintenance tasks for your assets
              </CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Task
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTask ? 'Edit Maintenance Task' : 'Schedule New Maintenance Task'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="asset_id" defaultValue={editingTask?.asset_id || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {inventoryItems?.map(item => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.category})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="task_name"
                    placeholder="Task Name"
                    defaultValue={editingTask?.task_name || ''}
                    required
                  />
                  
                  <Textarea
                    name="task_description"
                    placeholder="Task Description"
                    defaultValue={editingTask?.task_description || ''}
                  />
                  
                  <Select name="frequency" defaultValue={editingTask?.frequency || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                      <SelectItem value="as_needed">As Needed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="next_due_date"
                    type="date"
                    placeholder="Next Due Date"
                    defaultValue={editingTask?.next_due_date || ''}
                    required
                  />
                  
                  <Select name="assigned_to" defaultValue={editingTask?.assigned_to || ''}>
                    <SelectTrigger>
                      <SelectValue placeholder="Assign To" />
                    </SelectTrigger>
                    <SelectContent>
                      {assignees?.map(person => (
                        <SelectItem key={person.id} value={person.id}>
                          {person.full_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select name="priority" defaultValue={editingTask?.priority || 'medium'}>
                    <SelectTrigger>
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="estimated_duration"
                    type="number"
                    placeholder="Estimated Duration (minutes)"
                    defaultValue={editingTask?.estimated_duration || ''}
                  />
                  
                  <Input
                    name="cost_estimate"
                    type="number"
                    step="0.01"
                    placeholder="Cost Estimate"
                    defaultValue={editingTask?.cost_estimate || ''}
                  />
                  
                  <Button type="submit" className="w-full">
                    {editingTask ? 'Update Task' : 'Schedule Task'}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading maintenance schedule...
            </div>
          ) : maintenanceTasks?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No maintenance tasks scheduled. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Asset</TableHead>
                  <TableHead>Task</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Assigned To</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {maintenanceTasks?.map((task) => {
                  const currentStatus = getStatusFromDate(task.next_due_date, task.status);
                  return (
                    <TableRow key={task.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.inventory_items?.name}</div>
                          <div className="text-sm text-muted-foreground">{task.inventory_items?.category}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{task.task_name}</div>
                          <div className="text-sm text-muted-foreground">{task.frequency}</div>
                        </div>
                      </TableCell>
                      <TableCell>{new Date(task.next_due_date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(currentStatus)}>
                          {currentStatus.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>{task.profiles?.full_name || 'Unassigned'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {task.status !== 'completed' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => completeTaskMutation.mutate(task.id)}
                            >
                              Complete
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setEditingTask(task);
                              setIsDialogOpen(true);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};