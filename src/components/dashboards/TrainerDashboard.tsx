
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabaseHelpers, Trainer, TrainingProgram } from '@/utils/supabaseHelpers';

export const TrainerDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const [trainerData, setTrainerData] = useState<Trainer | null>(null);
  const [programs, setPrograms] = useState<TrainingProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadTrainerData();
    }
  }, [user]);

  const loadTrainerData = async () => {
    try {
      // Fetch trainer record
      const { data: trainer } = await supabaseHelpers.trainers
        .select('*')
        .eq('user_id', user.id)
        .single();

      setTrainerData(trainer);

      // Fetch training programs
      const { data: programData } = await supabaseHelpers.training_programs
        .select(`
          *,
          student_enrollments(count)
        `)
        .eq('trainer_id', trainer?.id);

      setPrograms(programData || []);
    } catch (error) {
      console.error('Error loading trainer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Welcome, {profile?.full_name}!</h1>
                  <p className="text-muted-foreground">Trainer ID: {trainerData?.trainer_id}</p>
                  <p className="text-sm text-muted-foreground">Specialization: {trainerData?.specialization}</p>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 mt-1">
                    Trainer
                  </Badge>
                </div>
              </div>
              <Button variant="outline" onClick={signOut} className="hover:bg-red-500/20">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active Programs</p>
                  <p className="text-2xl font-bold text-white">
                    {programs.filter(p => p.status === 'active').length}
                  </p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Students</p>
                  <p className="text-2xl font-bold text-green-400">150</p>
                </div>
                <Users className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="text-2xl font-bold text-yellow-400">{trainerData?.experience_years || 0} Years</p>
                </div>
                <Award className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold text-purple-400">92%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Training Programs */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-purple-400" />
              Your Training Programs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {programs.length > 0 ? (
              <div className="space-y-4">
                {programs.map((program) => (
                  <div key={program.id} className="p-4 rounded-lg bg-gray-800/50 hover:bg-gray-800/70 transition-colors">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-white">{program.name}</h4>
                        <p className="text-sm text-muted-foreground">{program.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Duration: {program.duration_weeks} weeks • Max Students: {program.max_participants}
                        </p>
                      </div>
                      <Badge 
                        className={
                          program.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                          program.status === 'completed' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                          'bg-gray-500/20 text-gray-400 border-gray-500/30'
                        }
                      >
                        {program.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No programs assigned yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
