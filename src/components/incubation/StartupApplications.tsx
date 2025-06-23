
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Plus, 
  Search, 
  Filter, 
  Lightbulb, 
  Users, 
  DollarSign, 
  TrendingUp,
  Eye,
  Edit,
  Building
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const StartupApplications = ()=> {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    selected: 0,
    rejected: 0
  });

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('startup_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApplications(data || []);
      
      // Calculate stats
      const stats = data?.reduce((acc, app) => {
        acc.total++;
        if (app.application_status === 'pending') acc.pending++;
        if (app.application_status === 'selected') acc.selected++;
        if (app.application_status === 'rejected') acc.rejected++;
        return acc;
      }, { total: 0, pending: 0, selected: 0, rejected: 0 }) || { total: 0, pending: 0, selected: 0, rejected: 0 };
      
      setStats(stats);
    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const filteredApplications = applications.filter(app => {
    const matchesSearch = 
      app.business_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.business_idea?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.industry?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || app.application_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'selected': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'rejected': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'shortlisted': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'interviewed': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-gradient flex items-center gap-2">
                <Lightbulb className="h-6 w-6 text-yellow-400" />
                Startup Applications
              </CardTitle>
              <CardDescription>
                Review and manage startup incubation applications
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={fetchApplications}
                className="hover:bg-blue-500/20"
              >
                <Filter className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Application
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Application</DialogTitle>
                  </DialogHeader>
                  <p className="text-muted-foreground">Application form would be implemented here</p>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <Lightbulb className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <Users className="h-8 w-8 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Selected</p>
                <p className="text-3xl font-bold text-green-400">{stats.selected}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rejected</p>
                <p className="text-3xl font-bold text-red-400">{stats.rejected}</p>
              </div>
              <Building className="h-8 w-8 text-red-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="futuristic-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search applications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="shortlisted">Shortlisted</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Applications List */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            {filteredApplications.length} of {applications.length} applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-4 border-yellow-500/30 border-t-yellow-500 rounded-full animate-spin"></div>
            </div>
          ) : filteredApplications.length > 0 ? (
            <div className="space-y-4">
              {filteredApplications.map((application) => (
                <div key={application.id} className="p-6 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-white">{application.business_name}</h3>
                        <Badge className={getStatusColor(application.application_status)}>
                          {application.application_status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-3 line-clamp-2">
                        {application.business_idea}
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Industry</p>
                          <p className="text-white">{application.industry || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Team Size</p>
                          <p className="text-white">{application.team_size || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Funding Required</p>
                          <p className="text-white">
                            {application.funding_required ? `$${Number(application.funding_required).toLocaleString()}` : 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applied</p>
                          <p className="text-white">
                            {format(new Date(application.created_at), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" size="sm" className="hover:bg-blue-500/20">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="hover:bg-green-500/20">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {application.notes && (
                    <div className="mt-4 p-3 rounded bg-gray-900/50">
                      <p className="text-sm text-muted-foreground mb-1">Notes:</p>
                      <p className="text-sm text-gray-300">{application.notes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Lightbulb className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No applications found matching your criteria</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
