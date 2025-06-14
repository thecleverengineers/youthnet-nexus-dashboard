
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up Form
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    console.log('Attempting to sign in with:', signInEmail);
    
    try {
      const success = await signIn(signInEmail, signInPassword);
      if (success) {
        onClose();
        setSignInEmail('');
        setSignInPassword('');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUpEmail || !signUpPassword || !fullName) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    console.log('Attempting to sign up:', signUpEmail, 'with role:', role);
    
    try {
      const success = await signUp(signUpEmail, signUpPassword, fullName, role);
      if (success) {
        onClose();
        setSignUpEmail('');
        setSignUpPassword('');
        setFullName('');
        setRole('student');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      toast.error('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Demo users
  const demoUsers = [
    { email: 'admin@youthnet.in', password: 'admin123', role: 'Admin', color: 'red' },
    { email: 'staff@youthnet.in', password: 'staff123', role: 'Staff', color: 'blue' },
    { email: 'trainer@youthnet.in', password: 'trainer123', role: 'Trainer', color: 'purple' },
    { email: 'student@youthnet.in', password: 'student123', role: 'Student', color: 'green' },
  ];

  const handleDemoLogin = async (email: string, password: string) => {
    console.log('Demo login attempt for:', email);
    setSignInEmail(email);
    setSignInPassword(password);
    setLoading(true);
    
    try {
      const success = await signIn(email, password);
      if (success) {
        onClose();
        toast.success('Demo login successful!');
        setSignInEmail('');
        setSignInPassword('');
      } else {
        toast.error('Demo user not found. Please create the account first by signing up.');
      }
    } catch (error) {
      console.error('Demo login error:', error);
      toast.error('Demo user not found. Please create the account first.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDemoAccounts = async () => {
    setLoading(true);
    toast.info('Creating demo accounts...');
    
    for (const user of demoUsers) {
      try {
        console.log('Creating demo account for:', user.email);
        await signUp(user.email, user.password, user.role + ' User', user.role.toLowerCase());
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error creating demo account:', user.email, error);
      }
    }
    
    setLoading(false);
    toast.success('Demo accounts created! You can now use the demo login buttons.');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-md mx-auto p-0 bg-background border rounded-lg shadow-lg">
        <DialogHeader className="text-center p-6 pb-4">
          <div className="flex justify-center mb-4">
            <img 
              src="/lovable-uploads/42d39ae8-ded6-4d36-87fd-20233841bdf4.png" 
              alt="YouthNet Logo" 
              className="h-16 w-auto object-contain"
            />
          </div>
          <DialogTitle className="text-2xl font-bold text-foreground">Welcome to YouthNet</DialogTitle>
          <p className="text-sm text-muted-foreground">Management Information System</p>
        </DialogHeader>
        
        <div className="p-6 pt-0">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin" className="text-sm">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-sm">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin" className="space-y-4">
              {/* Demo Login Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground text-center">Demo Login</h3>
                <div className="grid grid-cols-2 gap-2">
                  {demoUsers.map((user) => (
                    <Button
                      key={user.email}
                      variant="outline"
                      size="sm"
                      onClick={() => handleDemoLogin(user.email, user.password)}
                      disabled={loading}
                      className="text-xs hover:bg-primary/10 border-primary/30 transition-colors"
                    >
                      {user.role}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleCreateDemoAccounts}
                  disabled={loading}
                  className="w-full text-xs"
                >
                  Create Demo Accounts
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or sign in manually</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInEmail}
                    onChange={(e) => setSignInEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="signin-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signInPassword}
                      onChange={(e) => setSignInPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-sm font-medium">Role</Label>
                  <Select value={role} onValueChange={setRole}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="staff">Staff</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email" className="text-sm font-medium">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="signup-password"
                      type={showPassword ? 'text' : 'password'}
                      value={signUpPassword}
                      onChange={(e) => setSignUpPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
