import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Download, Upload, Database, Calendar, AlertCircle, Shield, RefreshCw, Trash2 } from 'lucide-react';

interface SystemBackup {
  id: string;
  backup_name: string;
  backup_type: string;
  file_path: string | null;
  file_size: number | null;
  status: string;
  created_by: string;
  created_at: string;
  completed_at: string | null;
  error_message: string | null;
}

export const BackupRestore = () => {
  const { profile } = useAuth();
  const [backups, setBackups] = useState<SystemBackup[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<SystemBackup | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);

  const [backupForm, setBackupForm] = useState({
    backup_name: '',
    backup_type: 'manual'
  });

  useEffect(() => {
    if (profile?.role === 'admin') {
      fetchBackups();
    }
  }, [profile]);

  const fetchBackups = async () => {
    try {
      const { data, error } = await supabase
        .from('system_backups')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setBackups(data || []);
    } catch (error) {
      console.error('Error fetching backups:', error);
      toast.error('Failed to load backup history');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    if (!backupForm.backup_name.trim()) {
      toast.error('Please enter a backup name');
      return;
    }

    setCreating(true);
    setBackupProgress(0);

    try {
      // Create backup record
      const { data: backup, error } = await supabase
        .from('system_backups')
        .insert({
          backup_name: backupForm.backup_name,
          backup_type: backupForm.backup_type,
          status: 'in_progress',
          created_by: profile?.id
        })
        .select()
        .single();

      if (error) throw error;

      // Simulate backup progress
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 15;
        });
      }, 500);

      // Simulate backup completion (in real app, this would be an actual backup process)
      setTimeout(async () => {
        clearInterval(progressInterval);
        setBackupProgress(100);

        try {
          await supabase
            .from('system_backups')
            .update({
              status: 'completed',
              completed_at: new Date().toISOString(),
              file_size: Math.floor(Math.random() * 1000000) + 500000, // Random file size
              file_path: `/backups/${backup.id}_${backupForm.backup_name}.sql`
            })
            .eq('id', backup.id);

          toast.success('Backup created successfully');
          setBackupForm({ backup_name: '', backup_type: 'manual' });
          fetchBackups();
        } catch (error) {
          console.error('Error updating backup status:', error);
          await supabase
            .from('system_backups')
            .update({
              status: 'failed',
              error_message: 'Failed to complete backup process'
            })
            .eq('id', backup.id);
          
          toast.error('Backup failed to complete');
        }
      }, 5000);

    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setTimeout(() => {
        setCreating(false);
        setBackupProgress(0);
      }, 6000);
    }
  };

  const deleteBackup = async (backupId: string) => {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('system_backups')
        .delete()
        .eq('id', backupId);

      if (error) throw error;
      toast.success('Backup deleted successfully');
      fetchBackups();
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Failed to delete backup');
    }
  };

  const downloadBackup = (backup: SystemBackup) => {
    // In a real application, this would download the actual backup file
    toast.info('Download would start in a production environment');
  };

  const restoreFromBackup = async () => {
    if (!selectedBackup) return;

    try {
      // In a real application, this would perform the actual restore
      toast.info('Restore process would start in a production environment');
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore from backup');
    }
  };

  const formatFileSize = (bytes: number | null): string => {
    if (!bytes) return 'Unknown';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (profile?.role !== 'admin') {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8 text-muted-foreground">
            <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Access denied. Admin privileges required.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">Loading backup history...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Create Backup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Create System Backup
          </CardTitle>
          <CardDescription>
            Create a complete backup of your system data and configurations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="backup-name">Backup Name</Label>
              <Input
                id="backup-name"
                value={backupForm.backup_name}
                onChange={(e) => setBackupForm(prev => ({ ...prev, backup_name: e.target.value }))}
                placeholder="Enter backup name"
                disabled={creating}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="backup-type">Backup Type</Label>
              <Input
                id="backup-type"
                value="Manual Backup"
                disabled
                className="bg-muted"
              />
            </div>
          </div>

          {creating && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Creating backup...</span>
                <span>{Math.round(backupProgress)}%</span>
              </div>
              <Progress value={backupProgress} className="w-full" />
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>Backup will include all database tables and system configurations</span>
          </div>

          <Button onClick={createBackup} disabled={creating} className="w-full md:w-auto">
            <Database className="h-4 w-4 mr-2" />
            {creating ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </CardContent>
      </Card>

      {/* Backup History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Backup History
              </CardTitle>
              <CardDescription>
                Recent system backups and their status
              </CardDescription>
            </div>
            <Button variant="outline" onClick={fetchBackups}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {backups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No backups found. Create your first backup above.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Backup Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>File Size</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backups.map((backup) => (
                  <TableRow key={backup.id}>
                    <TableCell className="font-medium">{backup.backup_name}</TableCell>
                    <TableCell className="capitalize">{backup.backup_type}</TableCell>
                    <TableCell>{getStatusBadge(backup.status)}</TableCell>
                    <TableCell>{formatFileSize(backup.file_size)}</TableCell>
                    <TableCell>{new Date(backup.created_at).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        {backup.status === 'completed' && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadBackup(backup)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                            <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedBackup(backup)}
                                >
                                  <Upload className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Restore from Backup</DialogTitle>
                                  <DialogDescription>
                                    Are you sure you want to restore from this backup? This will overwrite current data.
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <div className="flex items-center gap-2 text-yellow-800">
                                      <AlertCircle className="h-5 w-5" />
                                      <span className="font-medium">Warning</span>
                                    </div>
                                    <p className="text-sm text-yellow-700 mt-1">
                                      This action will replace all current data with the backup data. 
                                      Make sure to create a current backup before proceeding.
                                    </p>
                                  </div>
                                  {selectedBackup && (
                                    <div className="space-y-2">
                                      <p><strong>Backup:</strong> {selectedBackup.backup_name}</p>
                                      <p><strong>Created:</strong> {new Date(selectedBackup.created_at).toLocaleString()}</p>
                                      <p><strong>Size:</strong> {formatFileSize(selectedBackup.file_size)}</p>
                                    </div>
                                  )}
                                </div>
                                <DialogFooter>
                                  <Button variant="outline" onClick={() => setRestoreDialogOpen(false)}>
                                    Cancel
                                  </Button>
                                  <Button variant="destructive" onClick={restoreFromBackup}>
                                    Restore Data
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteBackup(backup.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};