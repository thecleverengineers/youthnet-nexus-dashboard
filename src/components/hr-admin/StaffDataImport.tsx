
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  FileSpreadsheet, 
  Users, 
  CheckCircle, 
  AlertTriangle,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Helper to parse various date formats like dd/mm/yyyy or dd-mm-yyyy into YYYY-MM-DD
function parseToISODate(input?: string): string | null {
  if (!input) return null;
  const str = input.trim();
  // Replace various separators with '-'
  const norm = str.replace(/[\.\/]/g, '-').replace(/\s+/g, '');
  // Expecting d-m-yyyy
  const match = norm.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (!match) return null;
  const d = parseInt(match[1], 10);
  const m = parseInt(match[2], 10);
  const y = parseInt(match[3], 10);
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const mm = String(m).padStart(2, '0');
  const dd = String(d).padStart(2, '0');
  return `${y}-${mm}-${dd}`;
}
export const StaffDataImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResults, setImportResults] = useState<any>(null);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
        toast.error('Please select a CSV file');
        return;
      }
      setFile(selectedFile);
      previewCSV(selectedFile);
    }
  };

  const previewCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim());
      const preview = lines.slice(1, 6).map(line => {
        const values = line.split(',').map(v => v.trim());
        const obj: any = {};
        headers.forEach((header, index) => {
          obj[header] = values[index] || '';
        });
        return obj;
      });
      setPreviewData(preview);
    };
    reader.readAsText(file);
  };

  const processImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const csv = e.target?.result as string;
        const lines = csv.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim());

        const emailIdx = headers.indexOf('email');
        const hireIdx = headers.indexOf('hire_date');
        const positionIdx = headers.indexOf('position');
        const departmentIdx = headers.indexOf('department');
        const employeeIdIdx = headers.indexOf('employee_id');
        const fullNameIdx = headers.indexOf('full_name') >= 0 ? headers.indexOf('full_name') : headers.indexOf('name');
        const salaryIdx = headers.indexOf('salary');

        // Build set of emails to resolve existing profiles in one query
        const emailSet = new Set<string>();
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          const email = emailIdx >= 0 ? values[emailIdx] : '';
          if (email) emailSet.add(email.toLowerCase());
        }

        const emailToUserId = new Map<string, string>();
        if (emailSet.size > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('user_id,email');
          if (!profilesError && profilesData) {
            for (const p of profilesData as any[]) {
              if (p.email && p.user_id) emailToUserId.set(String(p.email).toLowerCase(), String(p.user_id));
            }
          }
        }
        
        let successful = 0;
        let failed = 0;
        const errors: string[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          try {
            setUploadProgress((i / (lines.length - 1)) * 100);

            const email = emailIdx >= 0 ? values[emailIdx] : '';
            const linkedUserId = email ? emailToUserId.get(email.toLowerCase()) : undefined;

            let hireDate: string | undefined;
            if (hireIdx >= 0) {
              const raw = values[hireIdx];
              const iso = parseToISODate(raw);
              if (iso) hireDate = iso;
              else if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) hireDate = raw; // already ISO
            }

            const employeeData: any = {
              employee_id: employeeIdIdx >= 0 && values[employeeIdIdx] ? values[employeeIdIdx] : `EMP${Date.now()}${i}`,
              position: positionIdx >= 0 ? (values[positionIdx] || '') : '',
              department: departmentIdx >= 0 ? (values[departmentIdx] || '') : '',
              employment_status: 'active',
              employment_type: 'full_time',
              salary: salaryIdx >= 0 && values[salaryIdx] ? parseFloat(values[salaryIdx]) : undefined,
            };

            if (hireDate) employeeData.hire_date = hireDate;
            if (linkedUserId) employeeData.user_id = linkedUserId;

            const { error: empError } = await supabaseHelpers.employees.insert([employeeData]);
            if (empError) throw empError;

            successful++;
          } catch (error: any) {
            failed++;
            errors.push(`Row ${i + 1}: ${error.message || 'Unknown error'}`);
          }
        }

        setImportResults({
          total: lines.length - 1,
          successful,
          failed,
          errors: errors.slice(0, 5)
        });

        toast.success(`Import completed! ${successful} successful, ${failed} failed`);
      };
      
      reader.readAsText(file);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = 'employee_id,full_name,email,position,department,hire_date,salary\nEMP001,John Doe,john@example.com,Developer,IT,2024-01-01,50000\nEMP002,Jane Smith,jane@example.com,Manager,HR,2024-01-02,60000';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'staff_import_template.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const clearFile = () => {
    setFile(null);
    setPreviewData([]);
    setShowPreview(false);
    setImportResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-blue-400" />
            Staff Data Import
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground">
                Import staff data from CSV files to quickly populate your employee database
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                User linking: if an email matches an existing profile, the employee will be linked automatically. Otherwise, user_id is left empty to avoid foreign key issues. Dates accept dd-mm-yyyy or dd/mm/yyyy.
              </p>
            </div>
            <Button onClick={downloadTemplate} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Download Template
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload Section */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-green-400" />
            File Upload
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {file ? file.name : 'Click to select CSV file'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported format: CSV files only
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="hidden"
          />

          {file && (
            <div className="flex items-center justify-between bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <FileSpreadsheet className="h-5 w-5 text-green-400" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowPreview(!showPreview)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="h-3 w-3" />
                  Preview
                </Button>
                <Button
                  onClick={clearFile}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Section */}
      {showPreview && previewData.length > 0 && (
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-400" />
              Data Preview (First 5 Rows)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    {Object.keys(previewData[0]).map(header => (
                      <th key={header} className="text-left py-2 px-3 text-muted-foreground">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((row, index) => (
                    <tr key={index} className="border-b border-gray-800">
                      {Object.values(row).map((value: any, cellIndex) => (
                        <td key={cellIndex} className="py-2 px-3">
                          {value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Progress */}
      {isUploading && (
        <Card className="futuristic-card">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Importing data...</span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Import Results */}
      {importResults && (
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-400" />
              Import Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{importResults.total}</div>
                <div className="text-sm text-muted-foreground">Total Records</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{importResults.successful}</div>
                <div className="text-sm text-muted-foreground">Successful</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-400">{importResults.failed}</div>
                <div className="text-sm text-muted-foreground">Failed</div>
              </div>
            </div>

            {importResults.errors.length > 0 && (
              <Alert className="bg-red-500/10 border-red-500/30">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <p className="font-medium">Import Errors:</p>
                    <ul className="text-sm space-y-1">
                      {importResults.errors.map((error: string, index: number) => (
                        <li key={index} className="text-red-400">• {error}</li>
                      ))}
                    </ul>
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end space-x-4">
        <Button
          onClick={processImport}
          disabled={!file || isUploading}
          className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
        >
          {isUploading ? 'Importing...' : 'Start Import'}
        </Button>
      </div>
    </div>
  );
};
