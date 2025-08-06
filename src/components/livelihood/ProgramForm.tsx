
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { useToast } from '@/hooks/use-toast';

interface ProgramFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ProgramForm = ({ onSuccess, onCancel }: ProgramFormProps) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabaseHelpers.livelihood_programs
        .insert([{
          program_name: data.program_name,
          focus_area: data.focus_area,
          target_demographic: data.target_demographic,
          duration_months: parseInt(data.duration_weeks) || null,
          max_participants: parseInt(data.max_participants) || null,
          budget: parseFloat(data.budget) || null,
          expected_outcomes: data.expected_outcomes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Program created successfully",
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error creating program:', error);
      toast({
        title: "Error",
        description: "Failed to create program",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Livelihood Program</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="program_name">Program Name</Label>
            <Input id="program_name" {...register('program_name', { required: true })} />
          </div>

          <div>
            <Label htmlFor="focus_area">Focus Area</Label>
            <Input id="focus_area" {...register('focus_area', { required: true })} placeholder="e.g., Agriculture, Handicrafts, Technology" />
          </div>

          <div>
            <Label htmlFor="target_demographic">Target Demographic</Label>
            <Input id="target_demographic" {...register('target_demographic')} placeholder="e.g., Rural women, Youth, Farmers" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="duration_weeks">Duration (months)</Label>
              <Input id="duration_weeks" type="number" {...register('duration_weeks')} />
            </div>
            <div>
              <Label htmlFor="max_participants">Max Participants</Label>
              <Input id="max_participants" type="number" {...register('max_participants')} />
            </div>
          </div>

          <div>
            <Label htmlFor="budget">Budget</Label>
            <Input id="budget" type="number" step="0.01" {...register('budget')} />
          </div>

          <div>
            <Label htmlFor="expected_outcomes">Expected Outcomes (comma-separated)</Label>
            <Textarea id="expected_outcomes" {...register('expected_outcomes')} placeholder="Increased income, Skill development, Job creation" />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Create Program</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
