
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
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import * as XLSX from 'xlsx';

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
      const isExcel = selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls');
      if (!isExcel) {
        toast.error('Please select an Excel file (.xlsx or .xls)');
        return;
      }
      setFile(selectedFile);
      previewExcel(selectedFile);
    }
  };

  const previewExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target?.result;
      const workbook = XLSX.read(data, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Take first 5 rows for preview
      const preview = jsonData.slice(0, 5);
      setPreviewData(preview);
    };
    reader.readAsBinaryString(file);
  };

  const processImport = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Build set of emails to resolve existing profiles in one query
        const emailSet = new Set<string>();
        for (const row of jsonData) {
          const email = (row as any).email;
          if (email) emailSet.add(String(email).toLowerCase());
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

        let i = 0;
        for (const row of jsonData) {
          i++;
          try {
            setUploadProgress((i / jsonData.length) * 100);

            const email = (row as any).email || '';
            const fullName = (row as any).full_name || (row as any).name || '';
            const linkedUserId = email ? emailToUserId.get(String(email).toLowerCase()) : undefined;

            let hireDate: string | undefined;
            const rawDate = (row as any).hire_date;
            if (rawDate) {
              // Handle Excel date serial number
              if (typeof rawDate === 'number') {
                const excelEpoch = new Date(1899, 11, 30);
                const date = new Date(excelEpoch.getTime() + rawDate * 86400000);
                hireDate = date.toISOString().split('T')[0];
              } else {
                const iso = parseToISODate(String(rawDate));
                if (iso) hireDate = iso;
                else if (/^\d{4}-\d{2}-\d{2}$/.test(String(rawDate))) hireDate = String(rawDate);
              }
            }

            // If no linked profile exists and we have email/name, create one
            let userId = linkedUserId;
            if (!userId && email && fullName) {
              const newUserId = crypto.randomUUID();
              const { error: profileError } = await supabase
                .from('profiles')
                .insert([{
                  user_id: newUserId,
                  full_name: fullName,
                  email: email,
                  role: 'staff'
                }]);
              
              if (!profileError) {
                userId = newUserId;
              }
            }

            const employeeData: any = {
              employee_id: (row as any).employee_id || `EMP${Date.now()}${i}`,
              position: (row as any).position || 'Staff',
              department: (row as any).department || 'General',
              employment_status: 'active',
              employment_type: 'full_time',
              salary: (row as any).salary ? parseFloat((row as any).salary) : undefined,
            };

            if (hireDate) employeeData.hire_date = hireDate;
            if (userId) employeeData.user_id = userId;

            const { error: empError } = await supabase
              .from('employees')
              .insert([employeeData]);
            if (empError) throw empError;

            successful++;
          } catch (error: any) {
            failed++;
            errors.push(`Row ${i}: ${error.message || 'Unknown error'}`);
          }
        }

        setImportResults({
          total: jsonData.length,
          successful,
          failed,
          errors: errors.slice(0, 5)
        });

        toast.success(`Import completed! ${successful} successful, ${failed} failed`);
      };
      
      reader.readAsBinaryString(file);
    } catch (error: any) {
      toast.error(`Import failed: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    
    // Sample data for the template
    const templateData = [
      {
        employee_id: 'EMP001',
        full_name: 'John Doe',
        email: 'john@example.com',
        position: 'Developer',
        department: 'IT',
        hire_date: '01-01-2024',
        salary: 50000
      },
      {
        employee_id: 'EMP002',
        full_name: 'Jane Smith',
        email: 'jane@example.com',
        position: 'Manager',
        department: 'HR',
        hire_date: '02-01-2024',
        salary: 60000
      }
    ];
    
    // Convert data to worksheet
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Set column widths for better visibility
    const colWidths = [
      { wch: 12 }, // employee_id
      { wch: 20 }, // full_name
      { wch: 25 }, // email
      { wch: 15 }, // position
      { wch: 15 }, // department
      { wch: 12 }, // hire_date
      { wch: 10 }  // salary
    ];
    ws['!cols'] = colWidths;
    
    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Staff Data');
    
    // Write the file
    XLSX.writeFile(wb, 'staff_import_template.xlsx');
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
                Import staff data from Excel files to quickly populate your employee database
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
              {file ? file.name : 'Click to select Excel file'}
            </p>
            <p className="text-sm text-muted-foreground">
              Supported formats: .xlsx, .xls
            </p>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
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
