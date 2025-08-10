
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
  Edit, 
  Eye,
  GraduationCap,
  Clock,
  Star,
  BookOpen,
  Calendar,
  Award
} from 'lucide-react';

export const InstructorManagement = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [instructors] = useState([
    {
      id: 1,
      name: 'Dr. Samita Reddy',
      email: 'samita@youthnet.com',
      phone: '+91-9876543210',
      specialization: 'Data Science & AI',
      experience: '8 years',
      qualification: 'PhD in Computer Science',
      rating: 4.8,
      activeCourses: 3,
      totalStudents: 156,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      joinDate: '2022-01-15',
      courses: ['Machine Learning Fundamentals', 'Python Programming', 'Data Analytics']
    },
    {
      id: 2,
      name: 'Prof. Rajesh Kumar',
      email: 'rajesh@youthnet.com',
      phone: '+91-9876543211',
      specialization: 'Web Development',
      experience: '12 years',
      qualification: 'M.Tech in IT',
      rating: 4.9,
      activeCourses: 4,
      totalStudents: 203,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      joinDate: '2021-08-10',
      courses: ['React.js Fundamentals', 'Node.js Backend', 'Full Stack Development', 'JavaScript Mastery']
    },
    {
      id: 3,
      name: 'Ms. Priya Sharma',
      email: 'priya@youthnet.com',
      phone: '+91-9876543212',
      specialization: 'Digital Marketing',
      experience: '6 years',
      qualification: 'MBA in Marketing',
      rating: 4.7,
      activeCourses: 2,
      totalStudents: 89,
      status: 'on_leave',
      avatar: '/api/placeholder/40/40',
      joinDate: '2022-06-20',
      courses: ['SEO & Content Marketing', 'Social Media Strategy']
    },
    {
      id: 4,
      name: 'Dr. Amit Singh',
      email: 'amit@youthnet.com',
      phone: '+91-9876543213',
      specialization: 'Cybersecurity',
      experience: '10 years',
      qualification: 'PhD in Cybersecurity',
      rating: 4.6,
      activeCourses: 2,
      totalStudents: 67,
      status: 'active',
      avatar: '/api/placeholder/40/40',
      joinDate: '2023-02-01',
      courses: ['Ethical Hacking', 'Network Security']
    }
  ]);

  const [instructorStats] = useState({
    totalInstructors: 12,
    activeInstructors: 10,
    totalCourses: 25,
    averageRating: 4.7,
    totalStudents: 515,
    onLeave: 2
  });

  const [newInstructor, setNewInstructor] = useState({
    name: '',
    email: '',
    phone: '',
    specialization: '',
    qualification: '',
    experience: '',
  });

  const handleCreateInstructor = () => {
    if (!newInstructor.name || !newInstructor.email) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Instructor Added",
      description: `${newInstructor.name} has been added successfully.`,
    });
    
    setShowCreateDialog(false);
    setNewInstructor({
      name: '',
      email: '',
      phone: '',
      specialization: '',
      qualification: '',
      experience: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-300">Active</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-500/20 text-yellow-300">On Leave</Badge>;
      case 'inactive':
        return <Badge className="bg-gray-500/20 text-gray-300">Inactive</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Instructor Management</h2>
          <p className="text-muted-foreground">Manage course instructors and their assignments</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="professional-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Instructor
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Instructor</DialogTitle>
              <DialogDescription>Add a new instructor to the system</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={newInstructor.name}
                  onChange={(e) => setNewInstructor({ ...newInstructor, name: e.target.value })}
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newInstructor.email}
                  onChange={(e) => setNewInstructor({ ...newInstructor, email: e.target.value })}
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newInstructor.phone}
                  onChange={(e) => setNewInstructor({ ...newInstructor, phone: e.target.value })}
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization</Label>
                <Input
                  id="specialization"
                  value={newInstructor.specialization}
                  onChange={(e) => setNewInstructor({ ...newInstructor, specialization: e.target.value })}
                  className="professional-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="qualification">Qualification</Label>
                <Input
                  id="qualification"
                  value={newInstructor.qualification}
                  onChange={(e) => setNewInstructor({ ...newInstructor, qualification: e.target.value })}
                  className="professional-input"
                />
              </div>

              <Button onClick={handleCreateInstructor} className="w-full professional-button">
                Add Instructor
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Instructor Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Instructors</p>
                <p className="text-3xl font-bold">{instructorStats.totalInstructors}</p>
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
                <p className="text-sm text-muted-foreground">Active Courses</p>
                <p className="text-3xl font-bold text-green-400">{instructorStats.totalCourses}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <BookOpen className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Students</p>
                <p className="text-3xl font-bold text-purple-400">{instructorStats.totalStudents}</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <GraduationCap className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Rating</p>
                <p className="text-3xl font-bold text-yellow-400">{instructorStats.averageRating}</p>
              </div>
              <div className="p-2 bg-yellow-500/20 rounded-lg">
                <Star className="h-6 w-6 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructors List */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Instructors</CardTitle>
          <CardDescription>Manage instructor profiles and course assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Instructor</TableHead>
                  <TableHead>Specialization</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead>Students</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {instructors.map((instructor) => (
                  <TableRow key={instructor.id} className="border-white/10">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={instructor.avatar} alt={instructor.name} />
                          <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{instructor.name}</div>
                          <div className="text-sm text-muted-foreground">{instructor.email}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{instructor.specialization}</Badge>
                    </TableCell>
                    <TableCell>{instructor.experience}</TableCell>
                    <TableCell>{instructor.activeCourses}</TableCell>
                    <TableCell>{instructor.totalStudents}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span>{instructor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(instructor.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md">
                            <DialogHeader>
                              <DialogTitle>{instructor.name}</DialogTitle>
                              <DialogDescription>{instructor.specialization} Instructor</DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-16">
                                  <AvatarImage src={instructor.avatar} alt={instructor.name} />
                                  <AvatarFallback>{instructor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold">{instructor.name}</h3>
                                  <p className="text-sm text-muted-foreground">{instructor.qualification}</p>
                                  <p className="text-sm text-muted-foreground">{instructor.experience} experience</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <Label>Active Courses</Label>
                                  <p>{instructor.activeCourses}</p>
                                </div>
                                <div>
                                  <Label>Total Students</Label>
                                  <p>{instructor.totalStudents}</p>
                                </div>
                                <div>
                                  <Label>Rating</Label>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                    <span>{instructor.rating}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Join Date</Label>
                                  <p>{instructor.joinDate}</p>
                                </div>
                              </div>
                              
                              <div>
                                <Label>Courses Teaching</Label>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {instructor.courses.map((course, index) => (
                                    <Badge key={index} variant="outline" className="text-xs">
                                      {course}
                                    </Badge>
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
