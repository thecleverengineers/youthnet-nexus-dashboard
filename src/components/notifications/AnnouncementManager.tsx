import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Megaphone, Plus, Edit, Trash2, Eye, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  target_roles: string[];
  priority: string;
  status: string;
  published_at?: string;
  expires_at?: string;
  views_count: number;
  created_at: string;
}

interface AnnouncementFormData {
  title: string;
  content: string;
  type: string;
  target_roles: string[];
  priority: string;
  expires_at: string;
}

export const AnnouncementManager = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<AnnouncementFormData>({
    title: '',
    content: '',
    type: 'general',
    target_roles: ['student', 'trainer', 'staff'],
    priority: 'normal',
    expires_at: ''
  });

  // Fetch announcements
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Announcement[];
    }
  });

  // Save announcement mutation
  const saveAnnouncementMutation = useMutation({
    mutationFn: async (data: AnnouncementFormData) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const announcementData = {
        ...data,
        created_by: user?.id,
        expires_at: data.expires_at || null
      };

      if (editingAnnouncement) {
        const { error } = await supabase
          .from('announcements')
          .update(announcementData)
          .eq('id', editingAnnouncement.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('announcements')
          .insert([announcementData]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      setShowForm(false);
      setEditingAnnouncement(null);
      resetForm();
      toast({
        title: editingAnnouncement ? "Announcement Updated" : "Announcement Created",
        description: "The announcement has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to save announcement: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Publish announcement mutation
  const publishAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase
        .from('announcements')
        .update({ 
          status: 'published',
          published_at: new Date().toISOString()
        })
        .eq('id', announcementId);
      
      if (error) throw error;

      // Create notifications for target users
      const announcement = announcements.find(a => a.id === announcementId);
      if (announcement) {
        await supabase.functions.invoke('create-notification', {
          body: {
            role: 'all', // Will be filtered by target_roles in the function
            title: `📢 ${announcement.title}`,
            message: announcement.content.substring(0, 100) + (announcement.content.length > 100 ? '...' : ''),
            type: 'system',
            priority: announcement.priority,
            metadata: {
              announcement_id: announcementId,
              announcement_type: announcement.type
            }
          }
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Published",
        description: "The announcement has been published and notifications sent.",
      });
    }
  });

  // Delete announcement mutation
  const deleteAnnouncementMutation = useMutation({
    mutationFn: async (announcementId: string) => {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['announcements'] });
      toast({
        title: "Announcement Deleted",
        description: "The announcement has been deleted successfully.",
      });
    }
  });

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      type: announcement.type,
      target_roles: announcement.target_roles,
      priority: announcement.priority,
      expires_at: announcement.expires_at ? format(new Date(announcement.expires_at), 'yyyy-MM-dd') : ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      type: 'general',
      target_roles: ['student', 'trainer', 'staff'],
      priority: 'normal',
      expires_at: ''
    });
    setEditingAnnouncement(null);
    setShowForm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveAnnouncementMutation.mutate(formData);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'draft': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'archived': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'normal': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'low': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcement Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcement Manager
          </CardTitle>
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Create Announcement
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                  </DialogTitle>
                  <DialogDescription>
                    Create announcements to broadcast important information to users.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Announcement title"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Announcement content"
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type</Label>
                      <select
                        id="type"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                      >
                        <option value="general">General</option>
                        <option value="urgent">Urgent</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="event">Event</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority">Priority</Label>
                      <select
                        id="priority"
                        className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="normal">Normal</option>
                        <option value="high">High</option>
                        <option value="critical">Critical</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Target Roles</Label>
                    <div className="flex flex-wrap gap-2">
                      {['student', 'trainer', 'staff', 'admin'].map((role) => (
                        <label key={role} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={formData.target_roles.includes(role)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setFormData({
                                  ...formData,
                                  target_roles: [...formData.target_roles, role]
                                });
                              } else {
                                setFormData({
                                  ...formData,
                                  target_roles: formData.target_roles.filter(r => r !== role)
                                });
                              }
                            }}
                          />
                          <span className="capitalize">{role}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="expires_at">Expiry Date (Optional)</Label>
                    <Input
                      id="expires_at"
                      type="date"
                      value={formData.expires_at}
                      onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveAnnouncementMutation.isPending}>
                    {saveAnnouncementMutation.isPending ? 'Saving...' : (editingAnnouncement ? 'Update' : 'Create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Target Roles</TableHead>
              <TableHead>Views</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {announcements.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{announcement.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(announcement.created_at), 'MMM dd, yyyy')}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {announcement.type}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getPriorityColor(announcement.priority)}>
                    {announcement.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(announcement.status)}>
                    {announcement.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {announcement.target_roles.map((role) => (
                      <Badge key={role} variant="secondary" className="text-xs">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {announcement.views_count}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    {announcement.status === 'draft' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => publishAnnouncementMutation.mutate(announcement.id)}
                        disabled={publishAnnouncementMutation.isPending}
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteAnnouncementMutation.mutate(announcement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {announcements.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            No announcements found
          </div>
        )}
      </CardContent>
    </Card>
  );
};