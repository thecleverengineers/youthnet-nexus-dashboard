import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useLandingPageContent } from '@/hooks/useLandingPageContent';
import { GraduationCap, Lock, Sparkles, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

interface LandingPageProps {
  onSignInClick?: () => void; // Made optional since we're not using it
}

export const LandingPage = ({ onSignInClick }: LandingPageProps) => {
  const { content, loading: contentLoading } = useLandingPageContent();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Sign In Form
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail || !signInPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setIsLoading(true);
    console.log('Attempting to sign in with:', signInEmail);
    
    try {
      const success = await signIn(signInEmail, signInPassword);
      if (success) {
        setSignInEmail('');
        setSignInPassword('');
        toast.success('Successfully signed in!');
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error('Failed to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-secondary/10 relative overflow-hidden">
      {/* Elegant background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6">
        
        {/* Logo and branding */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6 glass-effect">
            {content?.logo_url ? (
              <img 
                src={content.logo_url} 
                alt="YouthNet Logo" 
                className="h-16 w-16 object-contain rounded-xl"
              />
            ) : (
              <GraduationCap className="h-10 w-10 text-primary" />
            )}
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            {content?.site_title || 'Youth'}<span className="text-gradient-primary">{content?.site_title ? '' : 'Net'}</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            {content?.site_subtitle || 'Modern Management Information System'}
          </p>
        </div>

        {/* Main authentication card with direct form */}
        <Card className="w-full max-w-md glass-card premium-card hover-lift">
          <CardContent className="p-8">
            <div className="text-center mb-6">
              {/* Dynamic logo in auth card */}
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
                {content?.logo_url ? (
                  <img 
                    src={content.logo_url} 
                    alt="YouthNet Logo" 
                    className="h-12 w-12 object-contain rounded-lg"
                  />
                ) : (
                  <Lock className="h-8 w-8 text-primary" />
                )}
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your dashboard
              </p>
            </div>

            {/* Sign In Form Only */}
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-sm font-medium">Email</Label>
                <Input
                  id="signin-email"
                  type="email"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full premium-input"
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
                    className="w-full pr-10 premium-input"
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
              <Button type="submit" className="w-full premium-button" disabled={isLoading}>
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Secure • Fast • Reliable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© 2024 YouthNet MIS. Empowering youth development through technology.</p>
        </footer>
      </div>
    </div>
  );
};