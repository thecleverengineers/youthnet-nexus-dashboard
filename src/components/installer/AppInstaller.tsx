
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { authConfig } from '@/config/auth';

interface AppInstallerProps {
  onInstallComplete: () => void;
}

export function AppInstaller({ onInstallComplete }: AppInstallerProps) {
  const [apiSecret, setApiSecret] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateAndInstall = async () => {
    if (!apiSecret.trim()) {
      setError('API Secret is required');
      return;
    }

    if (!/^\d{10}$/.test(apiSecret.trim())) {
      setError('API Secret must be exactly 10 digits');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      const response = await fetch(`${authConfig.php.apiUrl}/api/install/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': apiSecret.trim(),
        },
        body: JSON.stringify({
          action: 'validate_installation'
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Store activation status and API secret
        localStorage.setItem('app_installed', 'true');
        localStorage.setItem('api_secret', apiSecret.trim());
        localStorage.setItem('installation_date', new Date().toISOString());
        
        toast.success('Application activated successfully!');
        onInstallComplete();
      } else {
        setError(data.message || 'Invalid API Secret. Please contact your administrator.');
      }
    } catch (error) {
      console.error('Installation validation error:', error);
      setError('Failed to validate API Secret. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">YouthNet Activation</CardTitle>
          <CardDescription>
            Enter your 10-digit API secret to activate the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input
              id="apiSecret"
              type="password"
              placeholder="Enter 10-digit API secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
              maxLength={10}
              className="text-center font-mono"
              disabled={isValidating}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button
            onClick={validateAndInstall}
            disabled={isValidating || !apiSecret.trim()}
            className="w-full"
          >
            {isValidating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Activate Application
              </>
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            <p>This is a one-time activation process.</p>
            <p>Contact your administrator if you need assistance.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
