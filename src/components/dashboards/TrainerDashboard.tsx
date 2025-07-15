
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, BookOpen, Clock, Award } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export function TrainerDashboard() {
  const { user } = useAuth();
  const [trainer, setTrainer] = useState<any>(null);
  const [programs, setPrograms] = useState<any[]>([]);

  useEffect(() => {
    if (user) {
      fetchTrainerData();
    }
  }, [user]);

  const fetchTrainerData = async () => {
    if (!user) return;

    try {
      const { data: trainerData } = await supabase
        .from('trainers')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (trainerData) {
        setTrainer(trainerData);

        const { data: programData } = await supabase
          .from('training_programs')
          .select('*')
          .eq('trainer_id', trainerData.id);

        setPrograms(programData || []);
      }
    } catch (error) {
      console.error('Error in fetchTrainerData:', error);
    }
  };

  // Show dashboard immediately with default content
  const displayTrainer = trainer || { 
    trainer_id: 'Loading...', 
    specialization: 'General Training',
    experience_years: 0
  };
  const displayPrograms = programs.length > 0 ? programs : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-2">Trainer Dashboard</h1>
        <p className="opacity-90">Trainer ID: {displayTrainer.trainer_id}</p>
        {displayTrainer.specialization && (
          <p className="opacity-90">Specialization: {displayTrainer.specialization}</p>
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
            <div className="text-2xl font-bold">{displayPrograms.length}</div>
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
              {displayPrograms.filter(p => p.status === 'active').length}
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
              {displayTrainer.experience_years || 0}
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
          {displayPrograms.length > 0 ? (
            <div className="space-y-4">
              {displayPrograms.map((program) => (
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
