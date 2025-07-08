
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

export function TrainerDashboard() {
  const { user } = useUnifiedAuth();
  const [trainer, setTrainer] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchTrainerData();
    }
  }, [user]);

  const fetchTrainerData = async () => {
    if (!user) return;

    try {
      // Fetch trainer record
      const { data: trainerData, error: trainerError } = await supabase
        .from('trainers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (trainerError && trainerError.code !== 'PGRST116') {
        console.error('Error fetching trainer:', trainerError);
      } else if (trainerData) {
        setTrainer(trainerData);

        // Fetch programs assigned to this trainer
        const { data: programData, error: programError } = await supabase
          .from('training_programs')
          .select('*')
          .eq('trainer_id', trainerData.id);

        if (programError) {
          console.error('Error fetching programs:', programError);
        } else {
          setPrograms(programData || []);
        }
      }
    } catch (error) {
      console.error('Error in fetchTrainerData:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Trainer Profile Not Found</h3>
            <p className="text-gray-600">
              Your trainer profile is being set up. Please contact administration if this persists.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Trainer Dashboard</h1>
        <p className="opacity-90">Trainer ID: {trainer.trainer_id}</p>
        {trainer.specialization && (
          <p className="opacity-90">Specialization: {trainer.specialization}</p>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Programs</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{programs.length}</div>
            <p className="text-xs text-muted-foreground">
              Total assigned
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {programs.filter(p => p.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trainer.experience_years || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Years of experience
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <Card>
        <CardHeader>
          <CardTitle>My Training Programs</CardTitle>
        </CardHeader>
        <CardContent>
          {programs.length > 0 ? (
            <div className="space-y-4">
              {programs.map((program) => (
                <div key={program.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold">{program.name}</h3>
                    <Badge variant={program.status === 'active' ? 'default' : 'secondary'}>
                      {program.status}
                    </Badge>
                  </div>
                  {program.description && (
                    <p className="text-sm text-gray-600 mb-2">
                      {program.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {program.duration_weeks} weeks
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {program.max_participants} participants
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Programs Assigned</h3>
              <p className="text-gray-600">
                You haven't been assigned any training programs yet.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
