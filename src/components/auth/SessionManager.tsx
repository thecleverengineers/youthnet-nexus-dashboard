import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Monitor, Smartphone, Tablet, Trash2, Shield, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserSession {
  id: string;
  session_token: string;
  device_info: any;
  ip_address: string;
  user_agent: string;
  is_active: boolean;
  expires_at: string;
  created_at: string;
  updated_at: string;
}

export const SessionManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user sessions
  const { data: sessions = [], isLoading } = useQuery({
    queryKey: ['user-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as UserSession[];
    }
  });

  // Terminate session mutation
  const terminateSessionMutation = useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .eq('id', sessionId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      toast({
        title: "Session Terminated",
        description: "The session has been successfully terminated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to terminate session: " + error.message,
        variant: "destructive",
      });
    }
  });

  // Terminate all sessions mutation
  const terminateAllSessionsMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('user_sessions')
        .update({ is_active: false })
        .neq('id', 'current'); // Keep current session active
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-sessions'] });
      toast({
        title: "All Sessions Terminated",
        description: "All other sessions have been terminated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to terminate sessions: " + error.message,
        variant: "destructive",
      });
    }
  });

  const getDeviceIcon = (userAgent: string) => {
    if (userAgent?.toLowerCase().includes('mobile')) return <Smartphone className="h-4 w-4" />;
    if (userAgent?.toLowerCase().includes('tablet')) return <Tablet className="h-4 w-4" />;
    return <Monitor className="h-4 w-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  if (isLoading) {
    return (
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Session Manager
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
            <Shield className="h-5 w-5" />
            Session Manager
          </CardTitle>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  Terminate All Sessions
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Terminate All Sessions?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will log you out from all devices except this one. You'll need to login again on other devices.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={() => terminateAllSessionsMutation.mutate()}
                    disabled={terminateAllSessionsMutation.isPending}
                  >
                    Terminate All
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{sessions.length} total sessions</span>
            <span>•</span>
            <span>{sessions.filter(s => s.is_active && !isExpired(s.expires_at)).length} active</span>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getDeviceIcon(session.user_agent)}
                      <div>
                        <div className="font-medium">
                          {session.device_info?.browser || 'Unknown Browser'}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {session.device_info?.os || 'Unknown OS'}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {session.ip_address}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={
                        session.is_active && !isExpired(session.expires_at) 
                          ? "default" 
                          : "secondary"
                      }
                    >
                      {session.is_active && !isExpired(session.expires_at) ? 'Active' : 'Inactive'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {formatDate(session.updated_at)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          disabled={!session.is_active || isExpired(session.expires_at)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Terminate Session?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will log out this device immediately. The user will need to login again.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => terminateSessionMutation.mutate(session.id)}
                            disabled={terminateSessionMutation.isPending}
                          >
                            Terminate
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {sessions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No active sessions found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};