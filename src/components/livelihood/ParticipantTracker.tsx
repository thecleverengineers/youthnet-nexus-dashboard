
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Users, 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Calendar,
  Phone,
  Mail,
  MapPin,
  Trophy,
  Clock,
  Target
} from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  program: string;
  enrollmentDate: string;
  status: 'active' | 'completed' | 'withdrawn' | 'on_hold';
  progress: number;
  attendance: number;
  skills: string[];
  notes: string;
  lastActivity: string;
}

export const ParticipantTracker = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+91 98765 43210',
      address: 'Kohima, Nagaland',
      program: 'Agricultural Development',
      enrollmentDate: '2024-01-15',
      status: 'active',
      progress: 75,
      attendance: 85,
      skills: ['Organic Farming', 'Crop Management', 'Marketing'],
      notes: 'Excellent progress in organic farming techniques',
      lastActivity: '2024-01-20'
    },
    {
      id: '2',
      name: 'Mary Konyak',
      email: 'mary@example.com',
      phone: '+91 98765 43211',
      address: 'Mon, Nagaland',
      program: 'Handicraft Business',
      enrollmentDate: '2024-01-10',
      status: 'active',
      progress: 60,
      attendance: 92,
      skills: ['Weaving', 'Product Design', 'E-commerce'],
      notes: 'Strong traditional skills, learning digital marketing',
      lastActivity: '2024-01-19'
    },
    {
      id: '3',
      name: 'David Ao',
      email: 'david@example.com',
      phone: '+91 98765 43212',
      address: 'Mokokchung, Nagaland',
      program: 'Tourism Development',
      enrollmentDate: '2023-12-01',
      status: 'completed',
      progress: 100,
      attendance: 96,
      skills: ['Tour Planning', 'Customer Service', 'Digital Marketing'],
      notes: 'Successfully completed program and started own tourism business',
      lastActivity: '2024-01-15'
    }
  ]);

  const [newParticipant, setNewParticipant] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    program: '',
    skills: '',
    notes: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'withdrawn': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const filteredParticipants = participants.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.program.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || participant.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleAddParticipant = () => {
    if (!newParticipant.name || !newParticipant.email || !newParticipant.program) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const participant: Participant = {
      id: Date.now().toString(),
      ...newParticipant,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status: 'active',
      progress: 0,
      attendance: 100,
      skills: newParticipant.skills.split(',').map(s => s.trim()).filter(s => s),
      lastActivity: new Date().toISOString().split('T')[0]
    };

    setParticipants(prev => [...prev, participant]);
    setNewParticipant({ name: '', email: '', phone: '', address: '', program: '', skills: '', notes: '' });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Participant added successfully"
    });
  };

  const stats = {
    total: participants.length,
    active: participants.filter(p => p.status === 'active').length,
    completed: participants.filter(p => p.status === 'completed').length,
    averageProgress: Math.round(participants.reduce((acc, p) => acc + p.progress, 0) / participants.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Participant Tracker</h2>
          <p className="text-muted-foreground">Monitor participant progress and engagement</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Participant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Participant</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={newParticipant.name}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newParticipant.email}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newParticipant.phone}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newParticipant.address}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Enter address"
                />
              </div>
              <div>
                <Label htmlFor="program">Program *</Label>
                <Select 
                  value={newParticipant.program} 
                  onValueChange={(value) => setNewParticipant(prev => ({ ...prev, program: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select program" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agricultural Development">Agricultural Development</SelectItem>
                    <SelectItem value="Handicraft Business">Handicraft Business</SelectItem>
                    <SelectItem value="Tourism Development">Tourism Development</SelectItem>
                    <SelectItem value="Digital Skills">Digital Skills</SelectItem>
                    <SelectItem value="Entrepreneurship">Entrepreneurship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input
                  id="skills"
                  value={newParticipant.skills}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, skills: e.target.value }))}
                  placeholder="e.g., Farming, Marketing, Leadership"
                />
              </div>
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={newParticipant.notes}
                  onChange={(e) => setNewParticipant(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Additional notes about the participant"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddParticipant} className="flex-1">Add Participant</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Trophy className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Avg Progress</p>
                <p className="text-2xl font-bold">{stats.averageProgress}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search participants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="withdrawn">Withdrawn</SelectItem>
                <SelectItem value="on_hold">On Hold</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Participants List */}
      <div className="grid gap-4">
        {filteredParticipants.map((participant) => (
          <Card key={participant.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{participant.name}</h3>
                    <Badge className={getStatusColor(participant.status)}>
                      {participant.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{participant.program}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail className="h-4 w-4" />
                      {participant.email}
                    </div>
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4" />
                      {participant.phone}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {participant.address}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{participant.progress}%</span>
                  </div>
                  <Progress value={participant.progress} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span>{participant.attendance}%</span>
                  </div>
                  <Progress value={participant.attendance} className="h-2" />
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Enrolled: {new Date(participant.enrollmentDate).toLocaleDateString()}
                </div>
              </div>

              <div className="mb-3">
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-1">
                  {participant.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              {participant.notes && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-sm">{participant.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
