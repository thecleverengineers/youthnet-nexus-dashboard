
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Shield, CheckCircle, Database, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { authConfig } from '@/config/auth';

interface AppInstallerProps {
  onInstallComplete: () => void;
}

interface DatabaseConfig {
  host: string;
  name: string;
  user: string;
  password: string;
}

export function AppInstaller({ onInstallComplete }: AppInstallerProps) {
  const [currentStep, setCurrentStep] = useState<'api-secret' | 'database' | 'complete'>('api-secret');
  const [apiSecret, setApiSecret] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [isSettingUpDatabase, setIsSettingUpDatabase] = useState(false);
  const [error, setError] = useState('');
  const [databaseConfig, setDatabaseConfig] = useState<DatabaseConfig>({
    host: 'localhost',
    name: 'youthnet_db',
    user: 'root',
    password: ''
  });

  const validateApiSecret = async () => {
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
        localStorage.setItem('api_secret', apiSecret.trim());
        toast.success('API Secret validated successfully!');
        setCurrentStep('database');
      } else {
        setError(data.message || 'Invalid API Secret. Please contact your administrator.');
      }
    } catch (error) {
      console.error('API Secret validation error:', error);
      setError('Failed to validate API Secret. Please check your connection and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const setupDatabase = async () => {
    if (!databaseConfig.host || !databaseConfig.name || !databaseConfig.user) {
      setError('Host, Database Name, and Username are required');
      return;
    }

    setIsSettingUpDatabase(true);
    setError('');

    try {
      const response = await fetch(`${authConfig.php.apiUrl}/api/install/database`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Secret': apiSecret.trim(),
        },
        body: JSON.stringify({
          action: 'setup_database',
          database: databaseConfig
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('app_installed', 'true');
        localStorage.setItem('installation_date', new Date().toISOString());
        
        toast.success('Database setup completed successfully!');
        setCurrentStep('complete');
        setTimeout(() => {
          onInstallComplete();
        }, 2000);
      } else {
        setError(data.message || 'Failed to setup database. Please check your database credentials.');
      }
    } catch (error) {
      console.error('Database setup error:', error);
      setError('Failed to setup database. Please check your connection and try again.');
    } finally {
      setIsSettingUpDatabase(false);
    }
  };

  const handleDatabaseConfigChange = (field: keyof DatabaseConfig, value: string) => {
    setDatabaseConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (currentStep === 'complete') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-green-600">Installation Complete!</CardTitle>
            <CardDescription>
              YouthNet Management System has been successfully activated and configured.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center text-sm text-muted-foreground">
              <p>Redirecting to the application...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
            {currentStep === 'api-secret' ? (
              <Shield className="w-6 h-6 text-white" />
            ) : (
              <Database className="w-6 h-6 text-white" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentStep === 'api-secret' ? 'YouthNet Activation' : 'Database Setup'}
          </CardTitle>
          <CardDescription>
            {currentStep === 'api-secret' 
              ? 'Enter your 10-digit API secret to activate the application'
              : 'Configure your database connection to complete the installation'
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {currentStep === 'api-secret' && (
            <>
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

              <Button
                onClick={validateApiSecret}
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
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Validate & Continue
                  </>
                )}
              </Button>
            </>
          )}

          {currentStep === 'database' && (
            <>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="dbHost">Database Host</Label>
                  <Input
                    id="dbHost"
                    type="text"
                    placeholder="localhost"
                    value={databaseConfig.host}
                    onChange={(e) => handleDatabaseConfigChange('host', e.target.value)}
                    disabled={isSettingUpDatabase}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dbName">Database Name</Label>
                  <Input
                    id="dbName"
                    type="text"
                    placeholder="youthnet_db"
                    value={databaseConfig.name}
                    onChange={(e) => handleDatabaseConfigChange('name', e.target.value)}
                    disabled={isSettingUpDatabase}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dbUser">Database Username</Label>
                  <Input
                    id="dbUser"
                    type="text"
                    placeholder="root"
                    value={databaseConfig.user}
                    onChange={(e) => handleDatabaseConfigChange('user', e.target.value)}
                    disabled={isSettingUpDatabase}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dbPassword">Database Password</Label>
                  <Input
                    id="dbPassword"
                    type="password"
                    placeholder="Enter database password"
                    value={databaseConfig.password}
                    onChange={(e) => handleDatabaseConfigChange('password', e.target.value)}
                    disabled={isSettingUpDatabase}
                  />
                </div>
              </div>

              <Button
                onClick={setupDatabase}
                disabled={isSettingUpDatabase || !databaseConfig.host || !databaseConfig.name || !databaseConfig.user}
                className="w-full"
              >
                {isSettingUpDatabase ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Setting up Database...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Setup Database & Complete Installation
                  </>
                )}
              </Button>
            </>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-muted-foreground">
            {currentStep === 'api-secret' ? (
              <>
                <p>Step 1 of 2: API Validation</p>
                <p>Contact your administrator if you need assistance.</p>
              </>
            ) : (
              <>
                <p>Step 2 of 2: Database Configuration</p>
                <p>The system will automatically import the required database schema.</p>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
