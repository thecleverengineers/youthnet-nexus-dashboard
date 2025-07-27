import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface MobileFormProps {
  title?: string;
  children: React.ReactNode;
  onSubmit?: (e: React.FormEvent) => void;
  className?: string;
}

export const MobileForm = ({ title, children, onSubmit, className }: MobileFormProps) => (
  <Card className={cn("w-full", className)}>
    {title && (
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
    )}
    <CardContent>
      <form onSubmit={onSubmit} className="space-y-4">
        {children}
      </form>
    </CardContent>
  </Card>
);

interface MobileFormFieldProps {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  className?: string;
}

export const MobileFormField = ({ 
  label, 
  children, 
  required, 
  error, 
  className 
}: MobileFormFieldProps) => (
  <div className={cn("space-y-2", className)}>
    <Label className="text-sm font-medium text-foreground">
      {label}
      {required && <span className="text-destructive ml-1">*</span>}
    </Label>
    {children}
    {error && (
      <p className="text-xs text-destructive font-medium">{error}</p>
    )}
  </div>
);

interface MobileFormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const MobileFormInput = ({ 
  label, 
  error, 
  required, 
  className, 
  ...props 
}: MobileFormInputProps) => (
  <MobileFormField label={label} required={required} error={error}>
    <Input 
      {...props}
      className={cn(
        "h-12 text-base touch-manipulation",
        error && "border-destructive focus:border-destructive",
        className
      )}
    />
  </MobileFormField>
);

interface MobileFormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const MobileFormTextarea = ({ 
  label, 
  error, 
  required, 
  className, 
  ...props 
}: MobileFormTextareaProps) => (
  <MobileFormField label={label} required={required} error={error}>
    <Textarea 
      {...props}
      className={cn(
        "min-h-[100px] text-base touch-manipulation resize-none",
        error && "border-destructive focus:border-destructive",
        className
      )}
    />
  </MobileFormField>
);

interface MobileFormSelectProps {
  label: string;
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  error?: string;
  required?: boolean;
  className?: string;
}

export const MobileFormSelect = ({ 
  label, 
  value, 
  onValueChange, 
  placeholder, 
  options, 
  error, 
  required, 
  className 
}: MobileFormSelectProps) => (
  <MobileFormField label={label} required={required} error={error}>
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className={cn(
        "h-12 text-base touch-manipulation",
        error && "border-destructive",
        className
      )}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-60">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value} className="text-base py-3">
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </MobileFormField>
);

interface MobileFormActionsProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileFormActions = ({ children, className }: MobileFormActionsProps) => (
  <div className={cn("flex flex-col sm:flex-row gap-3 pt-4", className)}>
    {children}
  </div>
);

interface MobileFormButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  children: React.ReactNode;
}

export const MobileFormButton = ({ 
  variant = "default", 
  size = "default", 
  className, 
  children, 
  ...props 
}: MobileFormButtonProps) => (
  <Button 
    variant={variant} 
    size={size} 
    className={cn(
      "h-12 text-base font-medium touch-manipulation sm:h-10 sm:text-sm",
      className
    )}
    {...props}
  >
    {children}
  </Button>
);