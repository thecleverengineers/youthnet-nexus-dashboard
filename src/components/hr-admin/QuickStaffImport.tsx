import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Upload, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { staffSeed } from '@/data/staffSeed';

export const QuickStaffImport = () => {
  const [importing, setImporting] = useState(false);
  const [importStats, setImportStats] = useState<{
    totalInDb: number;
    toImport: number;
    alreadyExists: number;
    imported: number;
  } | null>(null);

  // Parse DD/MM/YYYY to ISO date
  const parseToISODate = (dateStr?: string) => {
    if (!dateStr) return null;
    const [day, month, year] = dateStr.split('/');
    if (!day || !month || !year) return null;
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  };

  // Split designation into position and department
  const splitDesignation = (designation?: string) => {
    if (!designation) return { position: 'Staff', department: 'General' };
    
    const parts = designation.split('-').map(p => p.trim());
    if (parts.length >= 2) {
      return {
        position: parts.slice(0, -1).join(' '),
        department: parts[parts.length - 1]
      };
    }
    
    if (designation.includes('(') && designation.includes(')')) {
      const matches = designation.match(/^(.+?)\s*\((.+?)\)$/);
      if (matches) {
        return { position: matches[1].trim(), department: matches[2].trim() };
      }
    }
    
    return { position: designation, department: 'General' };
  };

  // Placeholder function - this component needs to be updated
  // when staff data is properly integrated with user accounts
  const handleImport = async () => {
    try {
      setImporting(true);
      
      toast({
        title: "Import Pending",
        description: "Staff import requires proper user account creation first. Please create user accounts before importing staff data.",
        variant: "default",
      });
      
      // Show statistics for preview
      setImportStats({
        totalInDb: 0,
        toImport: staffSeed.length,
        alreadyExists: 0,
        imported: 0
      });
      
    } catch (error: any) {
      console.error('Import error:', error);
      toast({
        title: "Import Failed",
        description: error.message || "Failed to import staff data",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Staff Import</CardTitle>
        <CardDescription>
          Import pre-configured staff data into the system
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-900">Important Notice</p>
              <p className="text-sm text-amber-700 mt-1">
                Staff import requires user accounts to be created first. Each staff member needs:
              </p>
              <ul className="list-disc list-inside text-sm text-amber-700 mt-2 space-y-1">
                <li>A registered user account with email and password</li>
                <li>A profile with the 'staff' role</li>
                <li>Then employee data can be linked to their profile</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Available records: {staffSeed.length}</p>
            <p className="text-xs text-gray-500 mt-1">From staffSeed.ts</p>
          </div>
          <Button 
            onClick={handleImport}
            disabled={importing}
          >
            {importing ? (
              <>Processing...</>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Preview Import
              </>
            )}
          </Button>
        </div>

        {importStats && (
          <div className="border rounded-lg p-4 space-y-2">
            <h4 className="font-medium text-sm">Import Summary</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-600">Total records to import:</span>
                <Badge variant="outline" className="ml-2">{importStats.toImport}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Already exists:</span>
                <Badge variant="outline" className="ml-2">{importStats.alreadyExists}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Currently in database:</span>
                <Badge variant="outline" className="ml-2">{importStats.totalInDb}</Badge>
              </div>
              <div>
                <span className="text-gray-600">Successfully imported:</span>
                <Badge variant="secondary" className="ml-2">
                  {importStats.imported > 0 && <Check className="h-3 w-3 mr-1" />}
                  {importStats.imported}
                </Badge>
              </div>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• This is a preview mode showing what data would be imported</p>
          <p>• Actual import requires user accounts to be created first</p>
          <p>• Use the HR Admin → Employee Management section to add staff properly</p>
        </div>
      </CardContent>
    </Card>
  );
};