import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Search, Edit, Trash2, Eye, Mail, Phone, Calendar, Award, BookOpen } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export const TrainerManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewTrainer, setViewTrainer] = useState<any>(null);
  const [editingTrainer, setEditingTrainer] = useState<any>(null);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    trainer_id: '',
    full_name: '',
    email: '',
    phone: '',
    address: '',
    specialization: '',
    experience_years: 0
  });

  // Fetch trainers with profiles
  const { data: trainers = [], isLoading } = useQuery({
    queryKey: ['trainers-management'],
    queryFn: async () => {
      const { data: trainersData, error } = await supabase
        .from('trainers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Fetch profiles separately
      const trainersWithProfiles = await Promise.all(
        (trainersData || []).map(async (trainer) => {
          if (trainer.user_id) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('full_name, email, phone, address')
              .eq('user_id', trainer.user_id)
              .single();
            
            return { ...trainer, profiles: profile || undefined };
          }
          return { ...trainer, profiles: undefined };
        })
      );

      return trainersWithProfiles;
    }
  });

  // Create trainer mutation
  const createTrainerMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const userId = crypto.randomUUID();
      
      // First create a profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          address: data.address,
          role: 'trainer'
        });

      if (profileError) throw profileError;

      // Then create the trainer
      const { data: trainer, error: trainerError } = await supabase
        .from('trainers')
        .insert({
          trainer_id: data.trainer_id,
          user_id: userId,
          specialization: data.specialization,
          experience_years: data.experience_years
        })
        .select()
        .single();

      if (trainerError) throw trainerError;
      return trainer;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers-management'] });
      toast({ title: 'Trainer created successfully' });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error creating trainer', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Update trainer mutation
  const updateTrainerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      // Update trainer
      const { error: trainerError } = await supabase
        .from('trainers')
        .update({
          trainer_id: data.trainer_id,
          specialization: data.specialization,
          experience_years: data.experience_years
        })
        .eq('id', id);

      if (trainerError) throw trainerError;

      // Update profile if user_id exists
      const trainer = trainers.find(t => t.id === id);
      if (trainer?.user_id) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: data.full_name,
            email: data.email,
            phone: data.phone,
            address: data.address
          })
          .eq('user_id', trainer.user_id);

        if (profileError) throw profileError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers-management'] });
      toast({ title: 'Trainer updated successfully' });
      setEditingTrainer(null);
      resetForm();
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error updating trainer', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  // Delete trainer mutation
  const deleteTrainerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('trainers')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['trainers-management'] });
      toast({ title: 'Trainer deleted successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Error deleting trainer', 
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const filteredTrainers = trainers.filter(trainer => {
    const matchesSearch = 
      trainer.trainer_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trainer.specialization?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const resetForm = () => {
    setFormData({
      trainer_id: '',
      full_name: '',
      email: '',
      phone: '',
      address: '',
      specialization: '',
      experience_years: 0
    });
  };

  const handleEdit = (trainer: any) => {
    setEditingTrainer(trainer);
    setFormData({
      trainer_id: trainer.trainer_id,
      full_name: trainer.profiles?.full_name || '',
      email: trainer.profiles?.email || '',
      phone: trainer.profiles?.phone || '',
      address: trainer.profiles?.address || '',
      specialization: trainer.specialization || '',
      experience_years: trainer.experience_years || 0
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTrainer) {
      updateTrainerMutation.mutate({ id: editingTrainer.id, data: formData });
    } else {
      createTrainerMutation.mutate(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-foreground">{trainers.length}</div>
            <p className="text-sm text-muted-foreground">Total Trainers</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-400">
              {trainers.filter(t => t.experience_years >= 5).length}
            </div>
            <p className="text-sm text-muted-foreground">Senior Trainers (5+ years)</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-400">
              {trainers.filter(t => t.profiles).length}
            </div>
            <p className="text-sm text-muted-foreground">With Profiles</p>
          </CardContent>
        </Card>
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-amber-400">
              {trainers.filter(t => !t.profiles).length}
            </div>
            <p className="text-sm text-muted-foreground">Without Profile</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Trainer Management</CardTitle>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add Trainer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingTrainer ? 'Edit Trainer' : 'Add New Trainer'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="trainer_id">Trainer ID</Label>
                    <Input
                      id="trainer_id"
                      value={formData.trainer_id}
                      onChange={(e) => setFormData({ ...formData, trainer_id: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="specialization">Specialization</Label>
                      <Input
                        id="specialization"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        placeholder="e.g., Web Development, Data Science"
                      />
                    </div>
                    <div>
                      <Label htmlFor="experience_years">Years of Experience</Label>
                      <Input
                        id="experience_years"
                        type="number"
                        value={formData.experience_years}
                        onChange={(e) => setFormData({ ...formData, experience_years: parseInt(e.target.value) || 0 })}
                        min="0"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      rows={2}
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false);
                        setEditingTrainer(null);
                        resetForm();
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingTrainer ? 'Update' : 'Create'} Trainer
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search trainers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Trainers Grid */}
          {isLoading ? (
            <div className="text-center py-8">Loading trainers...</div>
          ) : filteredTrainers.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No trainers found
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTrainers.map((trainer) => (
                <Card key={trainer.id} className="futuristic-card hover-lift">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white">
                            {trainer.profiles?.full_name?.split(' ').map(n => n[0]).join('') || trainer.trainer_id.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {trainer.profiles?.full_name || `Trainer ${trainer.trainer_id}`}
                          </h3>
                          <p className="text-sm text-muted-foreground">{trainer.trainer_id}</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewTrainer(trainer)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleEdit(trainer);
                            setIsDialogOpen(true);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this trainer?')) {
                              deleteTrainerMutation.mutate(trainer.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 text-sm">
                      {trainer.specialization && (
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-3 w-3 text-purple-400" />
                          <span className="text-muted-foreground">{trainer.specialization}</span>
                        </div>
                      )}
                      {trainer.experience_years !== null && trainer.experience_years !== undefined && (
                        <div className="flex items-center gap-2">
                          <Award className="h-3 w-3 text-amber-400" />
                          <span className="text-muted-foreground">{trainer.experience_years} years experience</span>
                        </div>
                      )}
                      {trainer.profiles?.email && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{trainer.profiles.email}</span>
                        </div>
                      )}
                      {trainer.profiles?.phone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{trainer.profiles.phone}</span>
                        </div>
                      )}
                      {!trainer.profiles && (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">
                          No Profile
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* View Trainer Dialog */}
      <Dialog open={!!viewTrainer} onOpenChange={() => setViewTrainer(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Trainer Details</DialogTitle>
          </DialogHeader>
          {viewTrainer && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xl">
                    {viewTrainer.profiles?.full_name?.split(' ').map(n => n[0]).join('') || viewTrainer.trainer_id.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-semibold">
                    {viewTrainer.profiles?.full_name || `Trainer ${viewTrainer.trainer_id}`}
                  </h3>
                  <p className="text-muted-foreground">{viewTrainer.trainer_id}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Email</Label>
                  <p className="text-muted-foreground">
                    {viewTrainer.profiles?.email || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-muted-foreground">
                    {viewTrainer.profiles?.phone || 'Not provided'}
                  </p>
                </div>
                <div>
                  <Label>Specialization</Label>
                  <p className="text-muted-foreground">
                    {viewTrainer.specialization || 'Not specified'}
                  </p>
                </div>
                <div>
                  <Label>Experience</Label>
                  <p className="text-muted-foreground">
                    {viewTrainer.experience_years ? `${viewTrainer.experience_years} years` : 'Not specified'}
                  </p>
                </div>
              </div>

              {viewTrainer.profiles?.address && (
                <div>
                  <Label>Address</Label>
                  <p className="text-muted-foreground">{viewTrainer.profiles.address}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};