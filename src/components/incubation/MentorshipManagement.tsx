
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Plus, 
  Star, 
  MessageCircle, 
  Calendar,
  Award,
  Target,
  Clock,
  Building2,
  Mail,
  Phone
} from 'lucide-react';

export const MentorshipManagement = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [mentors] = useState([
    {
      id: 1,
      name: 'Dr. Rajesh Kumar',
      expertise: 'Technology & AI',
      company: 'Google India',
      experience: '15+ years',
      rating: 4.9,
      activeMentees: 8,
      totalMentees: 23,
      avatar: '/api/placeholder/40/40',
      status: 'active',
      email: 'rajesh@google.com',
      phone: '+91-9876543210',
      bio: 'Former CTO at leading tech companies, specializing in AI and machine learning.',
      achievements: ['100+ mentees placed', 'AI Innovation Award 2023']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      expertise: 'Business Strategy',
      company: 'McKinsey & Company',
      experience: '12+ years',
      rating: 4.8,
      activeMentees: 6,
      totalMentees: 18,
      avatar: '/api/placeholder/40/40',
      status: 'active',
      email: 'priya@mckinsey.com',
      phone: '+91-9876543211',
      bio: 'Strategy consultant helping startups scale and raise funding.',
      achievements: ['₹500Cr+ funding facilitated', 'Strategy Expert of Year 2023']
    },
    {
      id: 3,
      name: 'Amit Singh',
      expertise: 'FinTech & Payments',
      company: 'Paytm',
      experience: '10+ years',
      rating: 4.7,
      activeMentees: 5,
      totalMentees: 15,
      avatar: '/api/placeholder/40/40',
      status: 'busy',
      email: 'amit@paytm.com',
      phone: '+91-9876543212',
      bio: 'Product leader in digital payments and financial services.',
      achievements: ['50M+ users impacted', 'Product Innovation Award']
    }
  ]);

  const [mentorships] = useState([
    {
      id: 1,
      mentorName: 'Dr. Rajesh Kumar',
      menteeName: 'TechNova Solutions',
      founderName: 'Raj Kumar',
      startDate: '2024-01-15',
      duration: '6 months',
      focus: 'Product Development',
      status: 'active',
      progress: 65,
      nextSession: '2024-01-25 14:00',
      totalSessions: 12,
      completedSessions: 8
    },
    {
      id: 2,
      mentorName: 'Priya Sharma',
      menteeName: 'GreenEnergy Innovations',
      founderName: 'Priya Sharma',
      startDate: '2024-01-10',
      duration: '4 months',
      focus: 'Business Strategy',
      status: 'active',
      progress: 45,
      nextSession: '2024-01-26 10:00',
      totalSessions: 10,
      completedSessions: 4
    }
  ]);

  const [mentorshipStats] = useState({
    totalMentors: 15,
    activeMentorships: 24,
    completedMentorships: 47,
    averageRating: 4.7,
    successRate: 85,
    totalSessions: 189
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
      case 'busy':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Busy</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const assignMentor = () => {
    toast({
      title: "Mentor Assigned",
      description: "Mentorship has been successfully assigned.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Mentorship Management</h2>
          <p className="text-muted-foreground">Connect startups with mentors and track progress</p>
        </div>
        <Button className="professional-button" onClick={assignMentor}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Mentor
        </Button>
      </div>

      {/* Mentorship Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Mentors</p>
                <p className="text-3xl font-bold">{mentorshipStats.totalMentors}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Active Mentorships</p>
                <p className="text-3xl font-bold text-green-400">{mentorshipStats.activeMentorships}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <Target className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-purple-400">{mentorshipStats.successRate}%</p>
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
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-400">{mentorshipStats.averageRating}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mentors List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Available Mentors</CardTitle>
          <CardDescription>Experienced professionals available for mentorship</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {mentors.map((mentor) => (
              <Card key={mentor.id} className="p-4 border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={mentor.avatar} alt={mentor.name} />
                      <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="space-y-2">
                      <div>
                        <h3 className="font-semibold text-lg">{mentor.name}</h3>
                        <p className="text-sm text-muted-foreground">{mentor.company} • {mentor.experience}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{mentor.expertise}</Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-400 fill-current" />
                          <span className="text-sm">{mentor.rating}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {mentor.activeMentees} active mentees
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground max-w-md">{mentor.bio}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(mentor.status)}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline">View Profile</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle>{mentor.name}</DialogTitle>
                          <DialogDescription>{mentor.expertise} Expert</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={mentor.avatar} alt={mentor.name} />
                              <AvatarFallback>{mentor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold">{mentor.name}</h3>
                              <p className="text-sm text-muted-foreground">{mentor.company}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span className="text-sm">{mentor.rating} ({mentor.totalMentees} mentees)</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3" />
                              {mentor.email}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3" />
                              {mentor.phone}
                            </div>
                          </div>
                          
                          <div>
                            <Label className="font-medium">Achievements</Label>
                            <div className="space-y-1 mt-1">
                              {mentor.achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-2 text-sm">
                                  <Award className="h-3 w-3 text-yellow-400" />
                                  {achievement}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Mentorships */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Active Mentorships</CardTitle>
          <CardDescription>Current mentor-mentee relationships and their progress</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Mentorship</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Focus Area</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Next Session</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mentorships.map((mentorship) => (
                  <TableRow key={mentorship.id} className="border-white/10">
                    <TableCell>
                      <div>
                        <div className="font-medium">{mentorship.menteeName}</div>
                        <div className="text-sm text-muted-foreground">
                          Mentor: {mentorship.mentorName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="text-sm">{mentorship.duration}</div>
                        <div className="text-xs text-muted-foreground">Since {mentorship.startDate}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{mentorship.focus}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {mentorship.completedSessions}/{mentorship.totalSessions} sessions
                        </div>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${mentorship.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {mentorship.nextSession}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <MessageCircle className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Calendar className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
