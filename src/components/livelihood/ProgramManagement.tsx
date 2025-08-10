
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  Calendar, 
  Target, 
  TrendingUp,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { ProgramForm } from './ProgramForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';

export const ProgramManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const { toast } = useToast();

  // Mock advanced program data
  const [programStats] = useState({
    totalPrograms: 24,
    activePrograms: 18,
    completedPrograms: 47,
    totalParticipants: 1247,
    successRate: 78,
    totalBudget: 2400000,
    impactScore: 85
  });

  const [participants] = useState([
    {
      id: 1,
      name: 'John Doe',
      program: 'Digital Marketing',
      progress: 75,
      status: 'active',
      joinDate: '2024-01-15',
      completionDate: null,
      skills: ['SEO', 'Content Marketing', 'Analytics']
    },
    {
      id: 2,
      name: 'Jane Smith',
      program: 'Web Development',
      progress: 100,
      status: 'completed',
      joinDate: '2023-12-01',
      completionDate: '2024-01-20',
      skills: ['React', 'Node.js', 'Database Design']
    }
  ]);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: 'Career Fair 2024',
      date: '2024-02-15',
      type: 'networking',
      participants: 150,
      programs: ['All Programs']
    },
    {
      id: 2,
      title: 'Skills Assessment Workshop',
      date: '2024-02-20',
      type: 'assessment',
      participants: 45,
      programs: ['Digital Marketing', 'Web Development']
    }
  ]);

  const { data: programs, isLoading, refetch } = useQuery({
    queryKey: ['livelihood_programs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('livelihood_programs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const deleteProgram = async (id: string) => {
    try {
      const { error } = await supabase
        .from('livelihood_programs')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Program deleted successfully",
      });

      refetch();
    } catch (error) {
      console.error('Error deleting program:', error);
      toast({
        title: "Error",
        description: "Failed to delete program",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showForm) {
    return <ProgramForm onSuccess={() => { setShowForm(false); refetch(); }} onCancel={() => setShowForm(false)} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gradient">Advanced Livelihood Programs</h2>
          <p className="text-muted-foreground">Comprehensive program management with analytics and tracking</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="professional-button">
          <Plus className="h-4 w-4 mr-2" />
          Create Program
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Programs</p>
                <p className="text-3xl font-bold">{programStats.totalPrograms}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Participants</p>
                <p className="text-3xl font-bold text-green-400">{programStats.totalParticipants}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Users className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-purple-400">{programStats.successRate}%</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Budget</p>
                <p className="text-3xl font-bold text-yellow-400">${(programStats.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="participants">Participants</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search programs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {/* Programs Table */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Programs Overview</CardTitle>
              <CardDescription>All livelihood development programs</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8 text-muted-foreground">
                  Loading programs...
                </div>
              ) : programs?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No programs found. Click "Create Program" to get started.
                </div>
              ) : (
                <div className="border border-white/10 rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-white/10">
                        <TableHead>Program</TableHead>
                        <TableHead>Focus Area</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Participants</TableHead>
                        <TableHead>Budget</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {programs?.map((program) => (
                        <TableRow key={program.id} className="border-white/10">
                          <TableCell>
                            <div>
                              <div className="font-medium">{program.program_name}</div>
                              <div className="text-sm text-muted-foreground">{program.target_demographic}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{program.focus_area}</Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {program.duration_months} months
                            </div>
                          </TableCell>
                          <TableCell>{program.max_participants || 'Unlimited'}</TableCell>
                          <TableCell>${program.budget?.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(program.status)}>
                              {program.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => deleteProgram(program.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="participants" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Participant Management</CardTitle>
              <CardDescription>Track participant progress and achievements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <Card key={participant.id} className="p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div>
                          <h3 className="font-semibold">{participant.name}</h3>
                          <p className="text-sm text-muted-foreground">{participant.program}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Progress value={participant.progress} className="w-24" />
                            <span className="text-sm">{participant.progress}%</span>
                          </div>
                          <Badge className={participant.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-blue-500/20 text-blue-300'}>
                            {participant.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {participant.skills.map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">
                          Joined: {participant.joinDate}
                        </div>
                        {participant.completionDate && (
                          <div className="text-sm text-green-400">
                            Completed: {participant.completionDate}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Program Success Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Completion Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={78} className="w-20" />
                      <span className="text-sm">78%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Employment Rate</span>
                    <div className="flex items-center gap-2">
                      <Progress value={65} className="w-20" />
                      <span className="text-sm">65%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Skill Advancement</span>
                    <div className="flex items-center gap-2">
                      <Progress value={82} className="w-20" />
                      <span className="text-sm">82%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Impact Assessment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-400">{programStats.impactScore}</div>
                    <div className="text-sm text-muted-foreground">Overall Impact Score</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Community Engagement</span>
                      <span className="text-sm">92%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Economic Impact</span>
                      <span className="text-sm">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sustainability</span>
                      <span className="text-sm">85%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
              <CardDescription>Program-related events and activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map((event) => (
                  <Card key={event.id} className="p-4 border border-white/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{event.title}</h3>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {event.date}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-3 w-3" />
                            {event.participants} participants
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{event.type}</Badge>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
