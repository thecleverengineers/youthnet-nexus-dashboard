import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { GraduationCap, ArrowRight, Lock, Shield, Sparkles } from 'lucide-react';

interface LandingPageProps {
  onSignInClick: () => void;
}

export const LandingPage = ({ onSignInClick }: LandingPageProps) => {
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
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-2xl mb-6 glass-effect">
            <GraduationCap className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold text-foreground mb-4">
            Youth<span className="text-gradient-primary">Net</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light">
            Modern Management Information System
          </p>
        </div>

        {/* Main authentication card */}
        <Card className="w-full max-w-md glass-card premium-card hover-lift">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-xl mb-4">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-muted-foreground">
                Sign in to access your dashboard
              </p>
            </div>

            <Button 
              onClick={onSignInClick}
              size="lg"
              className="w-full premium-button text-lg font-medium"
            >
              <Shield className="mr-2 h-5 w-5" />
              Sign In to Continue
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>

            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Sparkles className="h-4 w-4" />
                <span>Secure • Fast • Reliable</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 animate-fade-in">
          <Card className="glass-card text-center p-6 hover-lift">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Secure Access</h3>
            <p className="text-sm text-muted-foreground">
              Enterprise-grade security with role-based permissions
            </p>
          </Card>

          <Card className="glass-card text-center p-6 hover-lift">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Comprehensive</h3>
            <p className="text-sm text-muted-foreground">
              Complete youth development program management
            </p>
          </Card>

          <Card className="glass-card text-center p-6 hover-lift">
            <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-display font-semibold text-foreground mb-2">Modern UI</h3>
            <p className="text-sm text-muted-foreground">
              Intuitive interface designed for efficiency
            </p>
          </Card>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center text-sm text-muted-foreground">
          <p>© 2024 YouthNet MIS. Empowering youth development through technology.</p>
        </footer>
      </div>
    </div>
  );
};