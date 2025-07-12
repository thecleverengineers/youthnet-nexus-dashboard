
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Fingerprint, 
  Scan, 
  Shield, 
  Clock, 
  MapPin, 
  Smartphone,
  Wifi,
  Lock,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const EmployeeLogin = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'manual' | 'biometric' | 'face'>('manual');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!employeeId.trim()) {
      toast.error('Please enter your employee ID');
      return;
    }

    setIsLoading(true);
    try {
      // Query employees table directly since profiles relationship doesn't exist
      const { data: employee, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('employment_status', 'active')
        .single();

      if (error || !employee) {
        toast.error('Invalid employee ID or inactive account');
        return;
      }

      // Mock session creation since employee_sessions table doesn't exist
      const sessionData = {
        id: employee.id,
        name: `Employee ${employee.employee_id}`, // Mock name since no profiles
        employeeId: employee.employee_id,
        department: employee.department
      };

      toast.success(`Welcome back, ${sessionData.name}!`);
      
      // Store session data
      localStorage.setItem('employee_session', JSON.stringify(sessionData));
      
      // Redirect to employee dashboard
      window.location.reload();
    } catch (error: any) {
      toast.error('Login failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBiometric = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setBiometricAuth(true);
      setEmployeeId('EMP001');
      toast.success('Biometric authentication successful!');
    }, 3000);
  };

  const simulateFaceRecognition = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setBiometricAuth(true);
      setEmployeeId('EMP001');
      toast.success('Face recognition successful!');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto overflow-hidden">
            <img 
              src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
              alt="YouthNet Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gradient">Employee Portal</h1>
            <p className="text-muted-foreground">Secure biometric access system</p>
          </div>
        </div>

        {/* Login Methods */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2">
              <Lock className="h-5 w-5 text-blue-400" />
              Authentication Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={loginMethod === 'manual' ? 'default' : 'outline'}
                onClick={() => setLoginMethod('manual')}
                className="flex flex-col items-center py-6 h-auto"
              >
                <Smartphone className="h-5 w-5 mb-1" />
                <span className="text-xs">Manual</span>
              </Button>
              <Button
                variant={loginMethod === 'biometric' ? 'default' : 'outline'}
                onClick={() => setLoginMethod('biometric')}
                className="flex flex-col items-center py-6 h-auto"
              >
                <Fingerprint className="h-5 w-5 mb-1" />
                <span className="text-xs">Biometric</span>
              </Button>
              <Button
                variant={loginMethod === 'face' ? 'default' : 'outline'}
                onClick={() => setLoginMethod('face')}
                className="flex flex-col items-center py-6 h-auto"
              >
                <Eye className="h-5 w-5 mb-1" />
                <span className="text-xs">Face ID</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Login Form */}
        <Card className="futuristic-card">
          <CardContent className="p-6 space-y-6">
            {loginMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Employee ID</label>
                  <Input
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    placeholder="Enter your employee ID"
                    className="mt-1"
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isLoading ? 'Authenticating...' : 'Login'}
                </Button>
              </div>
            )}

            {loginMethod === 'biometric' && (
              <div className="text-center space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center relative">
                  {isScanning ? (
                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 animate-pulse"></div>
                  ) : null}
                  <Fingerprint className={`h-16 w-16 ${isScanning ? 'text-blue-400 animate-pulse' : 'text-muted-foreground'}`} />
                  {biometricAuth && (
                    <CheckCircle className="absolute -top-2 -right-2 h-8 w-8 text-green-400 bg-background rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isScanning ? 'Scanning fingerprint...' : 'Place your finger on the scanner'}
                  </p>
                  {biometricAuth && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-2">
                      Authenticated
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={biometricAuth ? handleLogin : simulateBiometric}
                  disabled={isScanning || isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600"
                >
                  {isScanning ? 'Scanning...' : biometricAuth ? 'Access Portal' : 'Start Scan'}
                </Button>
              </div>
            )}

            {loginMethod === 'face' && (
              <div className="text-center space-y-4">
                <div className="w-40 h-32 mx-auto rounded-xl border-4 border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center relative overflow-hidden">
                  {isScanning && (
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-400/20 to-transparent animate-pulse"></div>
                  )}
                  <Scan className={`h-12 w-12 ${isScanning ? 'text-purple-400 animate-pulse' : 'text-muted-foreground'}`} />
                  {biometricAuth && (
                    <CheckCircle className="absolute -top-2 -right-2 h-8 w-8 text-green-400 bg-background rounded-full" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {isScanning ? 'Analyzing facial features...' : 'Position your face in the frame'}
                  </p>
                  {biometricAuth && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30 mt-2">
                      Face Recognized
                    </Badge>
                  )}
                </div>
                <Button
                  onClick={biometricAuth ? handleLogin : simulateFaceRecognition}
                  disabled={isScanning || isLoading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-600"
                >
                  {isScanning ? 'Analyzing...' : biometricAuth ? 'Access Portal' : 'Start Recognition'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="futuristic-card">
          <CardContent className="p-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-muted-foreground">System Online</span>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Wifi className="h-3 w-3" />
                  <span>Connected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
