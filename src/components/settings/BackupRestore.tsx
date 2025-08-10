
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Download, 
  Upload, 
  RefreshCw, 
  Calendar, 
  Clock, 
  HardDrive, 
  Database, 
  Shield,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  Settings
} from 'lucide-react';

export const BackupRestore = () => {
  const { toast } = useToast();
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isRestoring, setIsRestoring] = useState(false);
  
  const [backupConfig, setBackupConfig] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    compressionEnabled: true,
    encryptionEnabled: true,
    remoteStorage: false,
    storageLocation: '/backups',
    maxBackupSize: 5, // GB
  });

  const [backupHistory] = useState([
    {
      id: 1,
      name: 'Full System Backup',
      date: '2024-01-10 02:00:00',
      size: '2.4 GB',
      type: 'Automatic',
      status: 'completed',
      duration: '12 min',
      location: '/backups/auto/2024-01-10.backup'
    },
    {
      id: 2,
      name: 'Manual Database Backup',
      date: '2024-01-09 14:30:00',
      size: '850 MB',
      type: 'Manual',
      status: 'completed',
      duration: '4 min',
      location: '/backups/manual/db-2024-01-09.sql'
    },
    {
      id: 3,
      name: 'System Configuration Backup',
      date: '2024-01-08 10:15:00',
      size: '45 MB',
      type: 'Manual',
      status: 'completed',
      duration: '1 min',
      location: '/backups/config/config-2024-01-08.tar.gz'
    },
    {
      id: 4,
      name: 'Full System Backup',
      date: '2024-01-07 02:00:00',
      size: '2.3 GB',
      type: 'Automatic',
      status: 'failed',
      duration: '0 min',
      error: 'Insufficient disk space'
    },
  ]);

  const handleCreateBackup = async (type: string) => {
    setIsBackingUp(true);
    setBackupProgress(0);
    
    // Simulate backup progress
    const interval = setInterval(() => {
      setBackupProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackingUp(false);
          toast({
            title: "Backup Created",
            description: `${type} backup completed successfully.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);
  };

  const handleRestore = async (backupId: number) => {
    setIsRestoring(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Restore Completed",
        description: "System has been restored successfully.",
      });
    } catch (error) {
      toast({
        title: "Restore Failed",
        description: "Failed to restore from backup. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'running':
        return <Badge className="bg-blue-500/20 text-blue-300">Running</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Backup</TabsTrigger>
          <TabsTrigger value="history">Backup History</TabsTrigger>
          <TabsTrigger value="settings">Backup Settings</TabsTrigger>
        </TabsList>

        {/* Create Backup Tab */}
        <TabsContent value="create" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Full System</CardTitle>
                </div>
                <CardDescription>Complete system backup including database, files, and configuration</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full professional-button" 
                  onClick={() => handleCreateBackup('Full System')}
                  disabled={isBackingUp}
                >
                  {isBackingUp ? (
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Create Full Backup
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Database Only</CardTitle>
                </div>
                <CardDescription>Backup only the database content and structure</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateBackup('Database')}
                  disabled={isBackingUp}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Backup Database
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Configuration</CardTitle>
                </div>
                <CardDescription>Backup system configuration and settings only</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full" 
                  variant="outline"
                  onClick={() => handleCreateBackup('Configuration')}
                  disabled={isBackingUp}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Backup Config
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Backup Progress */}
          {isBackingUp && (
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RefreshCw className="h-5 w-5 animate-spin" />
                  Backup in Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Creating backup...</span>
                    <span>{backupProgress}%</span>
                  </div>
                  <Progress value={backupProgress} className="w-full" />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common backup and restore operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Import Backup
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Schedule Backup
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Verify Backups
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Backup Verification</DialogTitle>
                      <DialogDescription>
                        Check the integrity of your backup files
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded">
                        <span>Latest Full Backup</span>
                        <Badge className="bg-green-500/20 text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Valid
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded">
                        <span>Database Backup</span>
                        <Badge className="bg-green-500/20 text-green-300">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Valid
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border border-white/10 rounded">
                        <span>Configuration Backup</span>
                        <Badge variant="outline" className="text-yellow-300">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Warning
                        </Badge>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Backup History</CardTitle>
              <CardDescription>View and manage your backup history</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Backup Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {backupHistory.map((backup) => (
                      <TableRow key={backup.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <div className="font-medium">{backup.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Duration: {backup.duration}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{backup.date.split(' ')[0]}</div>
                            <div className="text-muted-foreground">{backup.date.split(' ')[1]}</div>
                          </div>
                        </TableCell>
                        <TableCell>{backup.size}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{backup.type}</Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(backup.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRestore(backup.id)}
                              disabled={backup.status !== 'completed' || isRestoring}
                            >
                              {isRestoring ? (
                                <RefreshCw className="h-3 w-3 animate-spin" />
                              ) : (
                                <Upload className="h-3 w-3" />
                              )}
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-3 w-3" />
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
        </TabsContent>

        {/* Backup Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Automatic Backup Configuration</CardTitle>
              <CardDescription>Configure automated backup settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="font-medium">Enable Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">Automatically create system backups</p>
                </div>
                <Switch
                  checked={backupConfig.autoBackup}
                  onCheckedChange={(checked) => setBackupConfig({ ...backupConfig, autoBackup: checked })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="frequency">Backup Frequency</Label>
                  <Select value={backupConfig.backupFrequency} onValueChange={(value) => setBackupConfig({ ...backupConfig, backupFrequency: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupTime">Backup Time</Label>
                  <Input
                    id="backupTime"
                    type="time"
                    value={backupConfig.backupTime}
                    onChange={(e) => setBackupConfig({ ...backupConfig, backupTime: e.target.value })}
                    className="professional-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retention">Retention Period (days)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={backupConfig.retentionDays}
                    onChange={(e) => setBackupConfig({ ...backupConfig, retentionDays: parseInt(e.target.value) })}
                    className="professional-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxSize">Max Backup Size (GB)</Label>
                  <Input
                    id="maxSize"
                    type="number"
                    value={backupConfig.maxBackupSize}
                    onChange={(e) => setBackupConfig({ ...backupConfig, maxBackupSize: parseInt(e.target.value) })}
                    className="professional-input"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="compression"
                    checked={backupConfig.compressionEnabled}
                    onCheckedChange={(checked) => setBackupConfig({ ...backupConfig, compressionEnabled: checked })}
                  />
                  <Label htmlFor="compression">Enable Compression</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="encryption"
                    checked={backupConfig.encryptionEnabled}
                    onCheckedChange={(checked) => setBackupConfig({ ...backupConfig, encryptionEnabled: checked })}
                  />
                  <Label htmlFor="encryption">Enable Encryption</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="remoteStorage"
                    checked={backupConfig.remoteStorage}
                    onCheckedChange={(checked) => setBackupConfig({ ...backupConfig, remoteStorage: checked })}
                  />
                  <Label htmlFor="remoteStorage">Upload to Remote Storage</Label>
                </div>
              </div>

              <Button className="professional-button">
                Save Backup Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
