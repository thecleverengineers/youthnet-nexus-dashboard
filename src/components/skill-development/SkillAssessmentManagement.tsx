import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { Plus, Users, UserCheck, Award, Clock, Target, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface SkillAssessmentManagementProps {
  detailed?: boolean;
}

export function SkillAssessmentManagement({ detailed = false }: SkillAssessmentManagementProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignTrainerDialog, setShowAssignTrainerDialog] = useState(false);
  const [showAssignStudentDialog, setShowAssignStudentDialog] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [selectedTrainer, setSelectedTrainer] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");
  
  const [newAssessment, setNewAssessment] = useState({
    skill_name: "",
    description: "",
    level: "beginner",
    max_score: 100,
    passing_score: 70,
    duration_minutes: 60
  });

  // Check user role
  const { data: userProfile } = useQuery({
    queryKey: ["userProfile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user
  });

  const isAdmin = userProfile?.role === "admin";
  const isTrainer = userProfile?.role === "trainer";

  // Fetch trainer info if user is trainer
  const { data: trainerInfo } = useQuery({
    queryKey: ["trainerInfo", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select("*")
        .eq("user_id", user?.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: isTrainer
  });

  // Fetch assessments with assignments
  const { data: assessments, isLoading } = useQuery({
    queryKey: ["skillAssessments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("skill_assessments")
        .select(`
          *,
          skill_assessment_trainers(
            *,
            trainer:trainers(
              *,
              profile:profiles!trainers_user_id_fkey(*)
            )
          ),
          skill_assessment_students(
            *,
            student:profiles!skill_assessment_students_student_id_fkey(*),
            trainer:trainers(
              *,
              profile:profiles!trainers_user_id_fkey(*)
            )
          )
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch available trainers
  const { data: trainers } = useQuery({
    queryKey: ["trainers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trainers")
        .select(`
          *,
          profile:profiles!trainers_user_id_fkey(*)
        `);
      if (error) throw error;
      return data;
    }
  });

  // Fetch students
  const { data: students } = useQuery({
    queryKey: ["students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student");
      if (error) throw error;
      return data;
    }
  });

  // Create assessment mutation
  const createAssessmentMutation = useMutation({
    mutationFn: async (assessment: typeof newAssessment) => {
      const { data, error } = await supabase
        .from("skill_assessments")
        .insert([{ ...assessment, created_by: user?.id }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillAssessments"] });
      toast.success("Assessment created successfully");
      setShowCreateDialog(false);
      setNewAssessment({
        skill_name: "",
        description: "",
        level: "beginner",
        max_score: 100,
        passing_score: 70,
        duration_minutes: 60
      });
    },
    onError: (error) => {
      toast.error("Failed to create assessment");
      console.error(error);
    }
  });

  // Assign trainer mutation
  const assignTrainerMutation = useMutation({
    mutationFn: async ({ assessmentId, trainerId }: { assessmentId: string; trainerId: string }) => {
      const { data, error } = await supabase
        .from("skill_assessment_trainers")
        .insert([{
          assessment_id: assessmentId,
          trainer_id: trainerId,
          assigned_by: user?.id
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillAssessments"] });
      toast.success("Trainer assigned successfully");
      setShowAssignTrainerDialog(false);
      setSelectedTrainer("");
    },
    onError: (error: any) => {
      if (error.message?.includes("duplicate")) {
        toast.error("Trainer already assigned to this assessment");
      } else {
        toast.error("Failed to assign trainer");
      }
      console.error(error);
    }
  });

  // Assign student mutation
  const assignStudentMutation = useMutation({
    mutationFn: async ({ assessmentId, studentId }: { assessmentId: string; studentId: string }) => {
      const { data, error } = await supabase
        .from("skill_assessment_students")
        .insert([{
          assessment_id: assessmentId,
          student_id: studentId,
          trainer_id: trainerInfo?.id,
          assigned_by: user?.id,
          status: "pending"
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skillAssessments"] });
      toast.success("Student assigned successfully");
      setShowAssignStudentDialog(false);
      setSelectedStudent("");
    },
    onError: (error: any) => {
      if (error.message?.includes("duplicate")) {
        toast.error("Student already assigned to this assessment");
      } else {
        toast.error("Failed to assign student");
      }
      console.error(error);
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-purple-100 text-purple-800";
      case "intermediate":
        return "bg-orange-100 text-orange-800";
      case "advanced":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Check if trainer is assigned to assessment
  const isTrainerAssigned = (assessment: any) => {
    return assessment?.skill_assessment_trainers?.some(
      (at: any) => at.trainer_id === trainerInfo?.id
    );
  };

  if (isLoading) {
    return <div>Loading assessments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Skill Assessments</h2>
        <div className="flex gap-2">
          {isAdmin && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Assessment
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4">
        {assessments?.map((assessment) => (
          <Card key={assessment.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{assessment.skill_name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">{assessment.description}</p>
                </div>
                <div className="flex gap-2">
                  <Badge className={getLevelColor(assessment.level || "beginner")}>
                    {assessment.level}
                  </Badge>
                  <Badge variant="outline">
                    <Target className="mr-1 h-3 w-3" />
                    {assessment.passing_score}/{assessment.max_score}
                  </Badge>
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {assessment.duration_minutes} min
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Assigned Trainers */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <Users className="mr-1 h-4 w-4" />
                    Assigned Trainers ({assessment.skill_assessment_trainers?.length || 0})
                  </h4>
                  {isAdmin && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setShowAssignTrainerDialog(true);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Assign Trainer
                    </Button>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {assessment.skill_assessment_trainers?.map((at: any) => (
                    <Badge key={at.id} variant="secondary">
                      {at.trainer?.profile?.full_name || "Unknown Trainer"}
                    </Badge>
                  ))}
                  {(!assessment.skill_assessment_trainers || assessment.skill_assessment_trainers.length === 0) && (
                    <span className="text-sm text-muted-foreground">No trainers assigned</span>
                  )}
                </div>
              </div>

              {/* Assigned Students */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-sm font-medium flex items-center">
                    <UserCheck className="mr-1 h-4 w-4" />
                    Assigned Students ({assessment.skill_assessment_students?.length || 0})
                  </h4>
                  {isTrainer && isTrainerAssigned(assessment) && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedAssessment(assessment);
                        setShowAssignStudentDialog(true);
                      }}
                    >
                      <Plus className="mr-1 h-3 w-3" />
                      Assign Student
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {assessment.skill_assessment_students?.map((as: any) => (
                    <div key={as.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{as.student?.full_name || "Unknown Student"}</span>
                        <Badge className={getStatusColor(as.status)}>
                          {as.status}
                        </Badge>
                        {as.score && (
                          <Badge variant={as.score >= assessment.passing_score ? "default" : "destructive"}>
                            Score: {as.score}/{assessment.max_score}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {as.progress > 0 && (
                          <div className="flex items-center gap-2">
                            <Progress value={as.progress} className="w-20" />
                            <span className="text-xs text-muted-foreground">{as.progress}%</span>
                          </div>
                        )}
                        <span className="text-xs text-muted-foreground">
                          by {as.trainer?.profile?.full_name}
                        </span>
                      </div>
                    </div>
                  ))}
                  {(!assessment.skill_assessment_students || assessment.skill_assessment_students.length === 0) && (
                    <span className="text-sm text-muted-foreground">No students assigned</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Create Assessment Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Assessment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="skill_name">Skill Name</Label>
              <Input
                id="skill_name"
                value={newAssessment.skill_name}
                onChange={(e) => setNewAssessment({ ...newAssessment, skill_name: e.target.value })}
                placeholder="e.g., JavaScript Programming"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newAssessment.description}
                onChange={(e) => setNewAssessment({ ...newAssessment, description: e.target.value })}
                placeholder="Assessment description..."
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <Select
                  value={newAssessment.level}
                  onValueChange={(value) => setNewAssessment({ ...newAssessment, level: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newAssessment.duration_minutes}
                  onChange={(e) => setNewAssessment({ ...newAssessment, duration_minutes: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="max_score">Max Score</Label>
                <Input
                  id="max_score"
                  type="number"
                  value={newAssessment.max_score}
                  onChange={(e) => setNewAssessment({ ...newAssessment, max_score: parseInt(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="passing_score">Passing Score</Label>
                <Input
                  id="passing_score"
                  type="number"
                  value={newAssessment.passing_score}
                  onChange={(e) => setNewAssessment({ ...newAssessment, passing_score: parseInt(e.target.value) })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => createAssessmentMutation.mutate(newAssessment)}>
              Create Assessment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Trainer Dialog */}
      <Dialog open={showAssignTrainerDialog} onOpenChange={setShowAssignTrainerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Trainer to {selectedAssessment?.skill_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="trainer">Select Trainer</Label>
              <Select value={selectedTrainer} onValueChange={setSelectedTrainer}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a trainer..." />
                </SelectTrigger>
                <SelectContent>
                  {trainers?.map((trainer: any) => (
                    <SelectItem key={trainer.id} value={trainer.id}>
                      {trainer.profile?.full_name} ({trainer.trainer_id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignTrainerDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => assignTrainerMutation.mutate({
                assessmentId: selectedAssessment?.id,
                trainerId: selectedTrainer
              })}
              disabled={!selectedTrainer}
            >
              Assign Trainer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Student Dialog */}
      <Dialog open={showAssignStudentDialog} onOpenChange={setShowAssignStudentDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Student to {selectedAssessment?.skill_name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="student">Select Student</Label>
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a student..." />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student: any) => (
                    <SelectItem key={student.user_id} value={student.user_id}>
                      {student.full_name} ({student.student_id || student.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAssignStudentDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => assignStudentMutation.mutate({
                assessmentId: selectedAssessment?.id,
                studentId: selectedStudent
              })}
              disabled={!selectedStudent}
            >
              Assign Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}