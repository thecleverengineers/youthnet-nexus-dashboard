import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewProgramModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const NewProgramModal = ({ open, onOpenChange }: NewProgramModalProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    title: '',
    mentor: '',
    mentee: '',
    duration: '',
    goals: [] as string[]
  });
  const [newGoal, setNewGoal] = useState('');

  const addGoal = () => {
    if (newGoal.trim() && !formData.goals.includes(newGoal.trim())) {
      setFormData(prev => ({ ...prev, goals: [...prev.goals, newGoal.trim()] }));
      setNewGoal('');
    }
  };

  const removeGoal = (goalToRemove: string) => {
    setFormData(prev => ({ 
      ...prev, 
      goals: prev.goals.filter(goal => goal !== goalToRemove) 
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.mentor || !formData.mentee || !formData.duration) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically save to database
    toast({
      title: "Success",
      description: "Mentorship program created successfully"
    });

    onOpenChange(false);
    setFormData({
      title: '',
      mentor: '',
      mentee: '',
      duration: '',
      goals: []
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Mentorship Program</DialogTitle>
          <DialogDescription>
            Set up a new mentorship program with goals and timeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Program Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Tech Career Mentorship"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mentor">Mentor *</Label>
              <Input
                id="mentor"
                value={formData.mentor}
                onChange={(e) => setFormData({ ...formData, mentor: e.target.value })}
                placeholder="Mentor name"
                required
              />
            </div>
            <div>
              <Label htmlFor="mentee">Mentee *</Label>
              <Input
                id="mentee"
                value={formData.mentee}
                onChange={(e) => setFormData({ ...formData, mentee: e.target.value })}
                placeholder="Mentee name"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="duration">Duration *</Label>
            <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select duration" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3 months">3 months</SelectItem>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="9 months">9 months</SelectItem>
                <SelectItem value="12 months">12 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Program Goals</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Add a goal"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGoal())}
              />
              <Button type="button" onClick={addGoal} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.goals.map((goal, index) => (
                <Badge key={index} variant="secondary" className="gap-1">
                  {goal}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => removeGoal(goal)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Create Program
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};