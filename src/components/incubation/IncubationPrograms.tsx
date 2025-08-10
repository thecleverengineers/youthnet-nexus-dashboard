
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Lightbulb, 
  Plus, 
  Edit, 
  Eye, 
  Users, 
  Calendar, 
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Award
} from 'lucide-react';

export const IncubationPrograms = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<any>(null);
  
  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    duration: '',
    maxParticipants: '',
    industry: '',
    stage: 'idea',
    requirements: '',
    benefits: '',
  });

  const [programs] = useState([
    {
      id: 1,
      name: 'Tech Innovation Accelerator',
      description: 'Accelerator program for technology startups focusing on AI, blockchain, and IoT solutions.',
      duration: '12 weeks',
      maxParticipants: 20,
      currentParticipants: 18,
      industry: 'Technology',
      stage: 'active',
      startDate: '2024-01-15',
      endDate: '2024-04-08',
      status: 'active',
      cohort: 'Cohort 2024-Q1',
      success_rate: 85,
      funding_raised: '₹2.4 Cr',
      applications: 156
    },
    {
      id: 2,
      name: 'Social Impact Incubator',
      description: 'Supporting startups that create positive social and environmental impact in local communities.',
      duration: '16 weeks',
      maxParticipants: 15,
      currentParticipants: 12,
      industry: 'Social Impact',
      stage: 'active',
      startDate: '2024-01-01',
      endDate: '2024-04-22',
      status: 'active',
      cohort: 'Cohort 2024-SI1',
      success_rate: 78,
      funding_raised: '₹1.8 Cr',
      applications: 89
    },
    {
      id: 3,
      name: 'E-commerce & Retail Innovation',
      description: 'Program designed for startups revolutionizing retail, e-commerce, and customer experience.',
      duration: '10 weeks',
      maxParticipants: 25,
      currentParticipants: 25,
      industry: 'E-commerce',
      stage: 'completed',
      startDate: '2023-10-01',
      endDate: '2023-12-10',
      status: 'completed',
      cohort: 'Cohort 2023-Q4',
      success_rate: 92,
      funding_raised: '₹3.2 Cr',
      applications: 203
    },
    {
      id: 4,
      name: 'FinTech Accelerator',
      description: 'Specialized program for financial technology innovations including digital payments and banking.',
      duration: '14 weeks',
      maxParticipants: 12,
      currentParticipants: 8,
      industry: 'FinTech',
      stage: 'enrolling',
      startDate: '2024-02-01',
      endDate: '2024-05-06',
      status: 'enrolling',
      cohort: 'Cohort 2024-FT1',
      success_rate: 88,
      funding_raised: '₹1.5 Cr',
      applications: 67
    }
  ]);

  const [curriculumModules] = useState([
    { id: 1, name: 'Ideation & Validation', duration: '2 weeks', completed: true },
    { id: 2, name: 'Business Model Design', duration: '2 weeks', completed: true },
    { id: 3, name: 'MVP Development', duration: '3 weeks', completed: false },
    { id: 4, name: 'Market Testing', duration: '2 weeks', completed: false },
    { id: 5, name: 'Fundraising Strategy', duration: '2 weeks', completed: false },
    { id: 6, name: 'Pitch Preparation', duration: '1 week', completed: false },
  ]);

  const handleCreateProgram = () => {
    if (!newProgram.name || !newProgram.description) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Program Created",
      description: `${newProgram.name} has been created successfully.`,
    });
    
    setShowCreateDialog(false);
    setNewProgram({
      name: '',
      description: '',
      duration: '',
      maxParticipants: '',
      industry: '',
      stage: 'idea',
      requirements: '',
      benefits: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
      case 'enrolling':
        return <Badge className="bg-blue-500/20 text-blue-300">Enrolling</Badge>;
      case 'completed':
        return <Badge className="bg-gray-500/20 text-gray-300">Completed</Badge>;
      case 'paused':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Paused</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Incubation Programs</h2>
          <p className="text-muted-foreground">Manage startup incubation and acceleration programs</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="professional-button">
              <Plus className="mr-2 h-4 w-4" />
              Create Program
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Incubation Program</DialogTitle>
              <DialogDescription>Set up a new startup incubation or acceleration program</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="space-y-2">
                <Label htmlFor="programName">Program Name</Label>
                <Input
                  id="programName"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  placeholder="Enter program name..."
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  placeholder="Describe the program objectives and focus..."
                  className="professional-input min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={newProgram.duration}
                    onChange={(e) => setNewProgram({ ...newProgram, duration: e.target.value })}
                    placeholder="e.g., 12 weeks"
                    className="professional-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxParticipants">Max Participants</Label>
                  <Input
                    id="maxParticipants"
                    type="number"
                    value={newProgram.maxParticipants}
                    onChange={(e) => setNewProgram({ ...newProgram, maxParticipants: e.target.value })}
                    placeholder="20"
                    className="professional-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry Focus</Label>
                <Select value={newProgram.industry} onValueChange={(value) => setNewProgram({ ...newProgram, industry: value })}>
                  <SelectTrigger className="professional-input">
                    <SelectValue placeholder="Select industry focus" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technology">Technology</SelectItem>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="fintech">FinTech</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                    <SelectItem value="social-impact">Social Impact</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="agriculture">Agriculture</SelectItem>
                    <SelectItem value="general">General</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={newProgram.requirements}
                  onChange={(e) => setNewProgram({ ...newProgram, requirements: e.target.value })}
                  placeholder="List eligibility criteria and requirements..."
                  className="professional-input min-h-[60px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefits">Benefits & Offerings</Label>
                <Textarea
                  id="benefits"
                  value={newProgram.benefits}
                  onChange={(e) => setNewProgram({ ...newProgram, benefits: e.target.value })}
                  placeholder="Describe program benefits, mentorship, funding, etc..."
                  className="professional-input min-h-[60px]"
                />
              </div>

              <Button onClick={handleCreateProgram} className="w-full professional-button">
                Create Program
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Program Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Programs</p>
                <p className="text-3xl font-bold text-green-400">3</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Lightbulb className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Startups</p>
                <p className="text-3xl font-bold text-blue-400">73</p>
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
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-purple-400">85%</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Award className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Funding Raised</p>
                <p className="text-3xl font-bold text-yellow-400">₹7.9Cr</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Programs List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Incubation Programs</CardTitle>
          <CardDescription>Manage and monitor all incubation programs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {programs.map((program) => (
              <Card key={program.id} className="p-4 border border-white/10 hover-lift">
                <div className="space-y-4">
                  {/* Program Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{program.name}</h3>
                        {getStatusBadge(program.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{program.description}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {program.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {program.currentParticipants}/{program.maxParticipants} participants
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {program.startDate} - {program.endDate}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="h-3 w-3" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{program.name}</DialogTitle>
                            <DialogDescription>{program.cohort}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Program Details</Label>
                                <div className="space-y-1 text-sm">
                                  <div>Industry: {program.industry}</div>
                                  <div>Duration: {program.duration}</div>
                                  <div>Participants: {program.currentParticipants}/{program.maxParticipants}</div>
                                  <div>Applications: {program.applications}</div>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label>Success Metrics</Label>
                                <div className="space-y-1 text-sm">
                                  <div>Success Rate: {program.success_rate}%</div>
                                  <div>Funding Raised: {program.funding_raised}</div>
                                  <div>Status: {program.status}</div>
                                </div>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Curriculum Progress</Label>
                              <div className="space-y-2">
                                {curriculumModules.map((module) => (
                                  <div key={module.id} className="flex items-center justify-between p-2 border border-white/10 rounded">
                                    <div className="flex items-center gap-2">
                                      {module.completed ? (
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                      ) : (
                                        <Clock className="h-4 w-4 text-gray-400" />
                                      )}
                                      <span className="text-sm">{module.name}</span>
                                    </div>
                                    <Badge variant="outline">{module.duration}</Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="outline">
                        <Edit className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  {/* Program Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Program Progress</span>
                      <span>{Math.round((new Date().getTime() - new Date(program.startDate).getTime()) / (new Date(program.endDate).getTime() - new Date(program.startDate).getTime()) * 100)}%</span>
                    </div>
                    <Progress 
                      value={Math.round((new Date().getTime() - new Date(program.startDate).getTime()) / (new Date(program.endDate).getTime() - new Date(program.startDate).getTime()) * 100)} 
                      className="h-2" 
                    />
                  </div>

                  {/* Program Stats */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline">{program.industry}</Badge>
                      <Badge variant="outline">{program.cohort}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400" />
                        {program.success_rate}% success
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3 text-green-400" />
                        {program.funding_raised} raised
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
