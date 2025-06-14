
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface StartupFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const StartupForm = ({ onSuccess, onCancel }: StartupFormProps) => {
  const { register, handleSubmit, reset } = useForm();
  const { toast } = useToast();

  const onSubmit = async (data: any) => {
    try {
      const { error } = await supabase
        .from('startup_applications')
        .insert([{
          business_name: data.business_name,
          business_idea: data.business_idea,
          industry: data.industry,
          team_size: parseInt(data.team_size) || null,
          funding_required: parseFloat(data.funding_required) || null,
          notes: data.notes
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Startup application submitted successfully",
      });

      reset();
      onSuccess();
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Submit Startup Application</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="business_name">Business Name</Label>
            <Input id="business_name" {...register('business_name', { required: true })} />
          </div>

          <div>
            <Label htmlFor="business_idea">Business Idea</Label>
            <Textarea id="business_idea" {...register('business_idea', { required: true })} rows={4} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="industry">Industry</Label>
              <Input id="industry" {...register('industry')} placeholder="e.g., Technology, Healthcare" />
            </div>
            <div>
              <Label htmlFor="team_size">Team Size</Label>
              <Input id="team_size" type="number" {...register('team_size')} />
            </div>
          </div>

          <div>
            <Label htmlFor="funding_required">Funding Required</Label>
            <Input id="funding_required" type="number" step="0.01" {...register('funding_required')} />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea id="notes" {...register('notes')} rows={3} />
          </div>

          <div className="flex gap-2">
            <Button type="submit">Submit Application</Button>
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
