
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
function normalizeRow(row: any) {
  const get = (keys: string[]) => {
    for (const k of keys) {
      // Try exact, lower, and upper case variants
      if (row[k] !== undefined) return row[k];
      if (row[k.toLowerCase()] !== undefined) return row[k.toLowerCase()];
      if (row[k.toUpperCase()] !== undefined) return row[k.toUpperCase()];
    }
    return undefined;
  };

  return {
    full_name: get(['Full Name', 'full_name', 'name']),
    email: get(['Email', 'email']),
    phone: get(['Phone', 'phone']),
    address: get(['Address', 'address']),
    password: get(['Password', 'password']),
    employee_id: get(['Employee ID', 'employee_id', 'EmployeeId']),
    position: get(['Position', 'position']),
    department: get(['Department', 'department']),
    status: get(['Status', 'status']),
    type: get(['Type', 'type']),
    salary: get(['Salary (Annual)', 'salary', 'annual_salary']),
    bank_account: get(['Bank Account', 'bank_account']),
    tax_id: get(['Tax ID', 'tax_id']),
    hire_date: get(['Hire Date', 'hire_date']),
    probation_end_date: get(['Probation End Date', 'probation_end_date']),
    contract_end_date: get(['Contract End Date', 'contract_end_date']),
    emergency_contact_name: get(['Emergency Contact Name', 'emergency_contact_name']),
    emergency_contact_phone: get(['Emergency Contact Phone', 'emergency_contact_phone']),
  } as any;
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
const rawRows = XLSX.utils.sheet_to_json(worksheet);

        // Normalize headers/keys to a consistent shape
        const jsonData = (rawRows as any[]).map(normalizeRow);

        // Build sets for batch lookups
        const emailSet = new Set<string>();
        const employeeIdSet = new Set<string>();
        for (const row of jsonData) {
          if (row.email) emailSet.add(String(row.email).toLowerCase());
          if (row.employee_id) employeeIdSet.add(String(row.employee_id));
        }

        // Resolve existing profiles by email
        const emailToUserId = new Map<string, string>();
        if (emailSet.size > 0) {
          const { data: profilesData } = await supabase
            .from('profiles')
            .select('user_id,email')
            .in('email', Array.from(emailSet));
          if (profilesData) {
            for (const p of profilesData as any[]) {
              if (p.email && p.user_id) emailToUserId.set(String(p.email).toLowerCase(), String(p.user_id));
            }
          }
        }

        // Resolve existing employees by employee_id
        const employeeIdToRowId = new Map<string, string>();
        if (employeeIdSet.size > 0) {
          const { data: employeesData } = await supabase
            .from('employees')
            .select('id, employee_id')
            .in('employee_id', Array.from(employeeIdSet));
          if (employeesData) {
            for (const e of employeesData as any[]) {
              if (e.employee_id && e.id) employeeIdToRowId.set(String(e.employee_id), String(e.id));
            }
          }
        }
        
        // Date helper
        const toISO = (val: any): string | undefined => {
          if (!val && val !== 0) return undefined;
          if (typeof val === 'number') {
            const excelEpoch = new Date(1899, 11, 30);
            const date = new Date(excelEpoch.getTime() + val * 86400000);
            return date.toISOString().split('T')[0];
          }
          const s = String(val).trim();
          const iso = parseToISODate(s);
          if (iso) return iso;
          if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
          return undefined;
        };
        
        let successful = 0;
        let failed = 0;
        const errors: string[] = [];

        let i = 0;
        for (const row of jsonData) {
          i++;
          try {
            setUploadProgress((i / jsonData.length) * 100);

            const email = row.email ? String(row.email) : '';
            const fullName = row.full_name ? String(row.full_name) : '';
            const lowerEmail = email.toLowerCase();

            // Ensure user in auth + profile if password provided; else link/create profile only
            let userId: string | undefined = lowerEmail ? emailToUserId.get(lowerEmail) : undefined;

            if (email && row.password) {
              const { data, error } = await supabase.functions.invoke('upsert-user-with-profile', {
                body: {
                  email,
                  password: String(row.password),
                  full_name: fullName || 'Staff User',
                  phone: row.phone ? String(row.phone) : undefined,
                  address: row.address ? String(row.address) : undefined,
                  role: 'staff',
                  status: row.status ? String(row.status) : 'active',
                },
              });
              if (error) throw error;
              userId = data?.user_id || userId;
              if (userId && lowerEmail && !emailToUserId.has(lowerEmail)) {
                emailToUserId.set(lowerEmail, userId);
              }
            } else if (!userId && email && fullName) {
              const newUserId = crypto.randomUUID();
              const { error: profileErr } = await supabase.from('profiles').insert({
                user_id: newUserId,
                full_name: fullName,
                email,
                phone: row.phone ? String(row.phone) : null,
                address: row.address ? String(row.address) : null,
                role: 'staff' as const,
                status: (row.status ? String(row.status) : 'active') as 'active' | 'inactive' | 'suspended',
              });
              if (!profileErr) {
                userId = newUserId;
                emailToUserId.set(lowerEmail, newUserId);
              }
            }

            // Build employee payload
            const employeeId = row.employee_id ? String(row.employee_id) : `EMP${Date.now()}${i}`;
            const employeeData: any = {
              employee_id: employeeId,
              position: row.position ? String(row.position) : 'Staff',
              department: row.department ? String(row.department) : 'General',
              employment_status: row.status ? String(row.status) : 'active',
              employment_type: row.type ? String(row.type) : 'full_time',
              salary: row.salary !== undefined && row.salary !== null && row.salary !== '' ? Number(row.salary) : null,
              bank_account: row.bank_account ? String(row.bank_account) : null,
              tax_id: row.tax_id ? String(row.tax_id) : null,
              emergency_contact_name: row.emergency_contact_name ? String(row.emergency_contact_name) : null,
              emergency_contact_phone: row.emergency_contact_phone ? String(row.emergency_contact_phone) : null,
            };

            const hireDate = toISO(row.hire_date);
            const probEnd = toISO(row.probation_end_date);
            const contractEnd = toISO(row.contract_end_date);
            if (hireDate) employeeData.hire_date = hireDate;
            if (probEnd) employeeData.probation_end_date = probEnd;
            if (contractEnd) employeeData.contract_end_date = contractEnd;
            if (userId) employeeData.user_id = userId;

            const existingRowId = employeeIdToRowId.get(employeeId);
            if (existingRowId) {
              const { error: updErr } = await supabase
                .from('employees')
                .update(employeeData)
                .eq('id', existingRowId);
              if (updErr) throw updErr;
            } else {
              const { error: insErr } = await supabase
                .from('employees')
                .insert([employeeData]);
              if (insErr) throw insErr;
            }

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
        "Employee ID": "EMP001",
        "Full Name": "John Doe",
        "Email": "john@example.com",
        "Phone": "9876543210",
        "Address": "123 Example Street, City",
        "Password": "Temp1234!",
        "Position": "Developer",
        "Department": "IT",
        "Status": "active",
        "Type": "full_time",
        "Salary (Annual)": 50000,
        "Bank Account": "1234567890",
        "Tax ID": "TAX12345",
        "Hire Date": "01-01-2024",
        "Probation End Date": "01-04-2024",
        "Contract End Date": "01-01-2025",
        "Emergency Contact Name": "Jane Doe",
        "Emergency Contact Phone": "9876500000"
      },
      {
        "Employee ID": "EMP002",
        "Full Name": "Jane Smith",
        "Email": "jane@example.com",
        "Phone": "9876543211",
        "Address": "456 Sample Ave, City",
        "Password": "Temp1234!",
        "Position": "Manager",
        "Department": "HR",
        "Status": "active",
        "Type": "part_time",
        "Salary (Annual)": 60000,
        "Bank Account": "9876543210",
        "Tax ID": "TAX67890",
        "Hire Date": "02-01-2024",
        "Probation End Date": "02-04-2024",
        "Contract End Date": "02-01-2025",
        "Emergency Contact Name": "John Smith",
        "Emergency Contact Phone": "9876511111"
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
