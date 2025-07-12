
import { useState, useEffect } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { enhancedApi } from '@/lib/enhanced-api';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, RefreshCw, AlertTriangle, CheckCircle } from 'lucide-react';

interface ConnectionStatusProps {
  showDetails?: boolean;
  className?: string;
}

export function ConnectionStatus({ showDetails = false, className = '' }: ConnectionStatusProps) {
  const { isOnline, retryConnection } = useUnifiedAuth();
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    responseTime: number;
    lastCheck: Date | null;
  }>({
    connected: false,
    responseTime: 0,
    lastCheck: null,
  });
  const [checking, setChecking] = useState(false);

  const checkApiConnection = async () => {
    setChecking(true);
    try {
      const health = await enhancedApi.healthCheck();
      setApiStatus({
        connected: health.api,
        responseTime: health.response_time,
        lastCheck: new Date(),
      });
    } catch (error) {
      setApiStatus({
        connected: false,
        responseTime: -1,
        lastCheck: new Date(),
      });
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkApiConnection();
    
    const interval = setInterval(checkApiConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleRetryConnection = async () => {
    await Promise.all([
      checkApiConnection(),
      retryConnection?.()
    ]);
  };

  const getStatusColor = () => {
    if (!isOnline) return 'destructive';
    if (!apiStatus.connected) return 'destructive';
    if (apiStatus.responseTime > 2000) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="h-4 w-4" />;
    if (!apiStatus.connected) return <AlertTriangle className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getStatusText = () => {
    if (!isOnline) return 'No Internet';
    if (!apiStatus.connected) return 'API Disconnected';
    if (apiStatus.responseTime > 2000) return 'Slow Connection';
    return 'Connected';
  };

  if (!showDetails && isOnline && apiStatus.connected) {
    return null; // Hide when everything is working fine
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant={getStatusColor()} className="flex items-center gap-1">
          {getStatusIcon()}
          {getStatusText()}
        </Badge>
        
        {showDetails && apiStatus.lastCheck && (
          <span className="text-xs text-muted-foreground">
            Last checked: {apiStatus.lastCheck.toLocaleTimeString()}
          </span>
        )}
      </div>

      {showDetails && (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4" />
              <span>Internet: {isOnline ? 'Connected' : 'Disconnected'}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`h-2 w-2 rounded-full ${apiStatus.connected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>API: {apiStatus.connected ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          {apiStatus.connected && apiStatus.responseTime > 0 && (
            <div className="text-sm text-muted-foreground">
              Response time: {apiStatus.responseTime}ms
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRetryConnection}
              disabled={checking}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${checking ? 'animate-spin' : ''}`} />
              {checking ? 'Checking...' : 'Retry'}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={checkApiConnection}
              disabled={checking}
            >
              Check Status
            </Button>
          </div>
        </div>
      )}

      {(!isOnline || !apiStatus.connected) && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {!isOnline 
              ? 'You are currently offline. Some features may not work properly.'
              : 'Unable to connect to the server. Please check your connection and try again.'
            }
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
