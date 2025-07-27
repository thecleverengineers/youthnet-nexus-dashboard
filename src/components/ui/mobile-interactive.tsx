import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCw, AlertCircle, CheckCircle, X } from 'lucide-react';

interface MobilePullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

export const MobilePullToRefresh = ({
  onRefresh,
  children,
  disabled = false,
  className
}: MobilePullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  const threshold = 60;
  const maxPull = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (disabled || isRefreshing) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (disabled || isRefreshing || startY === 0) return;
    
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startY;
    
    if (diffY > 0 && window.scrollY === 0) {
      e.preventDefault();
      setPullDistance(Math.min(diffY, maxPull));
    }
  };

  const handleTouchEnd = async () => {
    if (disabled || isRefreshing) return;
    
    if (pullDistance > threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setStartY(0);
  };

  const getRefreshIndicator = () => {
    if (isRefreshing) {
      return <Loader2 className="h-5 w-5 animate-spin text-primary" />;
    }
    
    if (pullDistance > threshold) {
      return <RefreshCw className="h-5 w-5 text-primary" />;
    }
    
    return <RefreshCw className="h-5 w-5 text-muted-foreground" />;
  };

  return (
    <div
      className={cn("relative", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="absolute top-0 left-0 right-0 flex items-center justify-center py-4 bg-slate-50/90 backdrop-blur-sm border-b border-slate-200 transition-all duration-200"
          style={{ 
            transform: `translateY(${isRefreshing ? 0 : pullDistance - 60}px)`,
            opacity: pullDistance > 20 ? 1 : pullDistance / 20 
          }}
        >
          {getRefreshIndicator()}
          <span className="ml-2 text-sm text-muted-foreground">
            {isRefreshing ? 'Refreshing...' : pullDistance > threshold ? 'Release to refresh' : 'Pull to refresh'}
          </span>
        </div>
      )}
      
      {/* Content */}
      <div
        style={{
          transform: `translateY(${pullDistance * 0.5}px)`,
          transition: pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

interface MobileToastProps {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
}

export const MobileToast = ({
  message,
  type = 'info',
  visible,
  onDismiss,
  duration = 3000,
  position = 'bottom'
}: MobileToastProps) => {
  useEffect(() => {
    if (visible && duration > 0) {
      const timer = setTimeout(onDismiss, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-emerald-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-amber-600" />;
      default: return <AlertCircle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success': return 'bg-emerald-50 border-emerald-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'warning': return 'bg-amber-50 border-amber-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  if (!visible) return null;

  return (
    <div className={cn(
      "fixed left-4 right-4 z-50 transition-all duration-300",
      position === 'top' ? 'top-4' : 'bottom-4',
      visible ? 'translate-y-0 opacity-100' : 
        position === 'top' ? '-translate-y-full opacity-0' : 'translate-y-full opacity-0'
    )}>
      <Card className={cn("border shadow-lg", getBackgroundColor())}>
        <CardContent className="flex items-center gap-3 p-4">
          {getIcon()}
          <span className="flex-1 text-sm font-medium text-foreground">{message}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-6 w-6 p-0 hover:bg-black/10"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

interface MobileLoadingProps {
  loading: boolean;
  message?: string;
  overlay?: boolean;
  className?: string;
}

export const MobileLoading = ({
  loading,
  message = "Loading...",
  overlay = false,
  className
}: MobileLoadingProps) => {
  if (!loading) return null;

  const content = (
    <div className="flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground font-medium">{message}</p>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center">
        <Card className="bg-white shadow-xl">
          <CardContent className="p-0">
            {content}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {content}
    </div>
  );
};

interface MobileErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  onError?: (error: Error) => void;
}

interface MobileErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class MobileErrorBoundary extends React.Component<
  MobileErrorBoundaryProps,
  MobileErrorBoundaryState
> {
  constructor(props: MobileErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): MobileErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Mobile Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="m-4 border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Something went wrong</h3>
            <p className="text-red-600 text-sm mb-4">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="touch-manipulation"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}