
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ClipboardCheck, Plus, TrendingUp, Target } from 'lucide-react';
import { toast } from 'sonner';

export const OutcomeAssessment = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: assessments, isLoading } = useQuery({
    queryKey: ['outcome-assessments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('outcome_assessments')
        .select(`
          *,
          livelihood_programs:program_id (
            program_name,
            focus_area
          )
        `)
        .order('assessment_date', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  const { data: programs } = useQuery({
    queryKey: ['livelihood-programs-for-assessment'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('livelihood_programs')
        .select('id, program_name')
        .eq('program_status', 'active')
        .order('program_name');

      if (error) throw error;
      return data || [];
    }
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (assessmentData: any) => {
      const { data, error } = await supabase
        .from('outcome_assessments')
        .insert([assessmentData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outcome-assessments'] });
      setIsDialogOpen(false);
      toast.success('Assessment created successfully');
    },
    onError: (error: any) => {
      toast.error(`Error creating assessment: ${error.message}`);
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assessmentData = {
      program_id: formData.get('program_id') as string,
      participant_id: formData.get('participant_id') as string,
      assessment_type: formData.get('assessment_type') as string,
      assessment_date: formData.get('assessment_date') as string,
      scores: {
        skill_improvement: parseInt(formData.get('skill_score') as string),
        knowledge_gain: parseInt(formData.get('knowledge_score') as string),
        livelihood_impact: parseInt(formData.get('livelihood_score') as string)
      },
      improvements: (formData.get('improvements') as string).split(',').map(i => i.trim()).filter(i => i),
      challenges: (formData.get('challenges') as string).split(',').map(c => c.trim()).filter(c => c),
      recommendations: formData.get('recommendations') as string
    };

    createAssessmentMutation.mutate(assessmentData);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'pre_assessment': return 'bg-blue-100 text-blue-800';
      case 'mid_assessment': return 'bg-yellow-100 text-yellow-800';
      case 'post_assessment': return 'bg-green-100 text-green-800';
      case 'follow_up': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Calculate summary stats
  const totalAssessments = assessments?.length || 0;
  const avgSkillScore = assessments?.reduce((sum, a) => sum + ((a.scores as any)?.skill_improvement || 0), 0) / totalAssessments || 0;
  const avgLivelihoodImpact = assessments?.reduce((sum, a) => sum + ((a.scores as any)?.livelihood_impact || 0), 0) / totalAssessments || 0;
  const completedCount = assessments?.filter(a => a.assessment_type === 'post_assessment').length || 0;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Assessments</p>
                <p className="text-3xl font-bold text-primary">{totalAssessments}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Skill Score</p>
                <p className="text-3xl font-bold text-blue-600">{avgSkillScore.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Livelihood Impact</p>
                <p className="text-3xl font-bold text-green-600">{avgLivelihoodImpact.toFixed(1)}</p>
              </div>
              <Target className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-3xl font-bold text-orange-600">{completedCount}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Assessment Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <ClipboardCheck className="h-5 w-5" />
                Outcome Assessments
              </CardTitle>
              <CardDescription>Assess program outcomes and effectiveness</CardDescription>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Assessment
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create Outcome Assessment</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select name="program_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Program" />
                    </SelectTrigger>
                    <SelectContent>
                      {programs?.map(program => (
                        <SelectItem key={program.id} value={program.id}>
                          {program.program_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="participant_id"
                    placeholder="Participant ID"
                    required
                  />
                  
                  <Select name="assessment_type" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Assessment Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pre_assessment">Pre Assessment</SelectItem>
                      <SelectItem value="mid_assessment">Mid Assessment</SelectItem>
                      <SelectItem value="post_assessment">Post Assessment</SelectItem>
                      <SelectItem value="follow_up">Follow Up</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    name="assessment_date"
                    type="date"
                    required
                  />
                  
                  <div className="grid grid-cols-1 gap-2">
                    <Input
                      name="skill_score"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Skill Improvement Score (1-10)"
                      required
                    />
                    <Input
                      name="knowledge_score"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Knowledge Gain Score (1-10)"
                      required
                    />
                    <Input
                      name="livelihood_score"
                      type="number"
                      min="1"
                      max="10"
                      placeholder="Livelihood Impact Score (1-10)"
                      required
                    />
                  </div>
                  
                  <Textarea
                    name="improvements"
                    placeholder="Key Improvements (comma-separated)"
                  />
                  
                  <Textarea
                    name="challenges"
                    placeholder="Challenges Faced (comma-separated)"
                  />
                  
                  <Textarea
                    name="recommendations"
                    placeholder="Recommendations"
                  />
                  
                  <Button type="submit" className="w-full">
                    Create Assessment
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading assessments...
            </div>
          ) : assessments?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No assessments found. Create one to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Program</TableHead>
                  <TableHead>Participant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Scores</TableHead>
                  <TableHead>Recommendations</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assessments?.map((assessment) => (
                  <TableRow key={assessment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{assessment.livelihood_programs?.program_name}</div>
                        <div className="text-sm text-muted-foreground">{assessment.livelihood_programs?.focus_area}</div>
                      </div>
                    </TableCell>
                    <TableCell>{assessment.participant_id}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(assessment.assessment_type)}>
                        {assessment.assessment_type.replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(assessment.assessment_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Skill: {(assessment.scores as any)?.skill_improvement || 0}/10</div>
                        <div>Impact: {(assessment.scores as any)?.livelihood_impact || 0}/10</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm truncate max-w-40">
                        {assessment.recommendations || 'No recommendations'}
                      </div>
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
