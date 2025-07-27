import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, User, Target, MessageCircle, CheckCircle, AlertTriangle } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  assigned_to: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  due_date: string;
  estimated_hours: number;
  actual_hours: number;
  completion_percentage: number;
  tags: string[];
}

interface TaskActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  action: 'view' | 'complete' | 'update' | null;
  onTaskUpdate: (taskId: string, updates: Partial<Task>) => void;
}

export const TaskActionModal = ({ open, onOpenChange, task, action, onTaskUpdate }: TaskActionModalProps) => {
  const { toast } = useToast();
  const [actualHours, setActualHours] = useState(task?.actual_hours || 0);
  const [completionPercentage, setCompletionPercentage] = useState(task?.completion_percentage || 0);
  const [notes, setNotes] = useState('');
  const [newStatus, setNewStatus] = useState<'pending' | 'in_progress' | 'completed' | 'cancelled'>(task?.status || 'pending');

  if (!task) return null;

  const handleCompleteTask = () => {
    onTaskUpdate(task.id, {
      status: 'completed',
      completion_percentage: 100,
      actual_hours: actualHours,
      completed_at: new Date().toISOString()
    } as any);

    toast({
      title: "Task Completed",
      description: `"${task.title}" has been marked as completed.`
    });
    
    onOpenChange(false);
  };

  const handleUpdateTask = () => {
    onTaskUpdate(task.id, {
      status: newStatus,
      completion_percentage: completionPercentage,
      actual_hours: actualHours,
      updated_at: new Date().toISOString()
    } as any);

    toast({
      title: "Task Updated",
      description: `"${task.title}" has been updated successfully.`
    });
    
    onOpenChange(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderModalContent = () => {
    switch (action) {
      case 'view':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{task.title}</h3>
                <div className="flex gap-2">
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              <p className="text-muted-foreground">{task.description}</p>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Due: {new Date(task.due_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Est: {task.estimated_hours}h</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{task.completion_percentage}%</span>
                </div>
                <Progress value={task.completion_percentage} className="h-2" />
              </div>

              {task.tags.length > 0 && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Complete Task: {task.title}</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="actualHours">Actual Hours Worked</Label>
                <Input
                  id="actualHours"
                  type="number"
                  value={actualHours}
                  onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
                  placeholder="Enter actual hours"
                  min="0"
                  step="0.5"
                />
              </div>

              <div>
                <Label htmlFor="notes">Completion Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes about the task completion..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleCompleteTask} className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-2" />
                Mark Complete
              </Button>
            </div>
          </div>
        );

      case 'update':
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Update Task: {task.title}</span>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={newStatus} onValueChange={(value) => setNewStatus(value as 'pending' | 'in_progress' | 'completed' | 'cancelled')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="completion">Completion Percentage</Label>
                <div className="space-y-2">
                  <Input
                    id="completion"
                    type="number"
                    value={completionPercentage}
                    onChange={(e) => setCompletionPercentage(parseInt(e.target.value) || 0)}
                    min="0"
                    max="100"
                    placeholder="0"
                  />
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>

              <div>
                <Label htmlFor="actualHours">Actual Hours</Label>
                <Input
                  id="actualHours"
                  type="number"
                  value={actualHours}
                  onChange={(e) => setActualHours(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="updateNotes">Update Notes</Label>
                <Textarea
                  id="updateNotes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this update..."
                  rows={3}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateTask}>
                Update Task
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (action) {
      case 'view': return 'Task Details';
      case 'complete': return 'Complete Task';
      case 'update': return 'Update Task';
      default: return 'Task Action';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{getModalTitle()}</DialogTitle>
          <DialogDescription>
            {action === 'view' && 'View complete task information and progress.'}
            {action === 'complete' && 'Mark this task as completed and log actual time spent.'}
            {action === 'update' && 'Update task status, progress, and add notes.'}
          </DialogDescription>
        </DialogHeader>
        {renderModalContent()}
      </DialogContent>
    </Dialog>
  );
};