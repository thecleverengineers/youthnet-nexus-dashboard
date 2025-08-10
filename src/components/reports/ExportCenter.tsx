
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { 
  Download, 
  Upload, 
  FileText, 
  Database, 
  Users, 
  GraduationCap,
  Briefcase,
  Settings,
  Filter,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export const ExportCenter = () => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [selectedTables, setSelectedTables] = useState<string[]>(['students', 'courses']);
  
  const [exportConfig, setExportConfig] = useState({
    format: 'csv',
    includeHeaders: true,
    dateRange: 'all',
    compression: false,
    encryption: false,
    batchSize: 1000,
  });

  const dataCategories = [
    {
      id: 'education',
      name: 'Education Data',
      icon: GraduationCap,
      tables: [
        { id: 'students', name: 'Students', count: 1847, size: '2.3 MB' },
        { id: 'courses', name: 'Courses', count: 156, size: '450 KB' },
        { id: 'enrollments', name: 'Course Enrollments', count: 3421, size: '1.8 MB' },
        { id: 'grades', name: 'Grades & Assessments', count: 8932, size: '3.2 MB' },
      ]
    },
    {
      id: 'hr',
      name: 'HR & Administration',
      icon: Users,
      tables: [
        { id: 'employees', name: 'Employees', count: 245, size: '890 KB' },
        { id: 'attendance', name: 'Attendance Records', count: 12456, size: '4.1 MB' },
        { id: 'payroll', name: 'Payroll Data', count: 2940, size: '1.5 MB' },
        { id: 'performance', name: 'Performance Reviews', count: 567, size: '680 KB' },
      ]
    },
    {
      id: 'career',
      name: 'Career Services',
      icon: Briefcase,
      tables: [
        { id: 'job_postings', name: 'Job Postings', count: 234, size: '567 KB' },
        { id: 'applications', name: 'Job Applications', count: 1456, size: '2.1 MB' },
        { id: 'placements', name: 'Placement Records', count: 892, size: '1.3 MB' },
      ]
    },
    {
      id: 'system',
      name: 'System Data',
      icon: Settings,
      tables: [
        { id: 'users', name: 'User Accounts', count: 2459, size: '1.2 MB' },
        { id: 'activity_logs', name: 'Activity Logs', count: 45678, size: '15.2 MB' },
        { id: 'notifications', name: 'Notifications', count: 8934, size: '3.4 MB' },
        { id: 'documents', name: 'Document Metadata', count: 1567, size: '890 KB' },
      ]
    }
  ];

  const [exportHistory] = useState([
    {
      id: 1,
      name: 'Student Data Export',
      date: '2024-01-10 14:30',
      format: 'CSV',
      size: '5.2 MB',
      status: 'completed',
      tables: ['students', 'courses', 'enrollments']
    },
    {
      id: 2,
      name: 'HR Complete Backup',
      date: '2024-01-08 09:15',
      format: 'Excel',
      size: '12.8 MB',
      status: 'completed',
      tables: ['employees', 'attendance', 'payroll']
    },
    {
      id: 3,
      name: 'System Logs Export',
      date: '2024-01-05 16:45',
      format: 'JSON',
      size: '18.5 MB',
      status: 'failed',
      tables: ['activity_logs', 'notifications']
    }
  ]);

  const handleTableSelection = (tableId: string, checked: boolean) => {
    if (checked) {
      setSelectedTables([...selectedTables, tableId]);
    } else {
      setSelectedTables(selectedTables.filter(id => id !== tableId));
    }
  };

  const handleExport = async () => {
    if (selectedTables.length === 0) {
      toast({
        title: "No Data Selected",
        description: "Please select at least one table to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);
    setExportProgress(0);

    // Simulate export progress
    const interval = setInterval(() => {
      setExportProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsExporting(false);
          toast({
            title: "Export Completed",
            description: `Data export completed successfully. Download will begin shortly.`,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 600);
  };

  const getTotalSize = () => {
    let totalSize = 0;
    let totalRecords = 0;
    
    dataCategories.forEach(category => {
      category.tables.forEach(table => {
        if (selectedTables.includes(table.id)) {
          totalRecords += table.count;
          // Convert size to MB for calculation
          const sizeInMB = parseFloat(table.size.replace(/[^\d.]/g, ''));
          totalSize += sizeInMB;
        }
      });
    });
    
    return { totalSize: totalSize.toFixed(1), totalRecords };
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-300">Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      case 'processing':
        return <Badge className="bg-blue-500/20 text-blue-300">Processing</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="export" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="export">Data Export</TabsTrigger>
          <TabsTrigger value="import">Data Import</TabsTrigger>
          <TabsTrigger value="history">Export History</TabsTrigger>
        </TabsList>

        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Data Selection */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  Select Data to Export
                </CardTitle>
                <CardDescription>Choose the data categories and tables you want to export</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {dataCategories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                      <category.icon className="h-4 w-4 text-primary" />
                      <h4 className="font-medium">{category.name}</h4>
                    </div>
                    <div className="space-y-2 ml-6">
                      {category.tables.map((table) => (
                        <div key={table.id} className="flex items-center justify-between p-2 border border-white/10 rounded">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={table.id}
                              checked={selectedTables.includes(table.id)}
                              onCheckedChange={(checked) => handleTableSelection(table.id, checked as boolean)}
                            />
                            <Label htmlFor={table.id} className="font-medium">{table.name}</Label>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {table.count.toLocaleString()} records • {table.size}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Export Configuration */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  Export Configuration
                </CardTitle>
                <CardDescription>Configure export settings and options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="format">Export Format</Label>
                    <Select value={exportConfig.format} onValueChange={(value) => setExportConfig({ ...exportConfig, format: value })}>
                      <SelectTrigger className="professional-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="csv">CSV (Comma Separated)</SelectItem>
                        <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                        <SelectItem value="json">JSON Format</SelectItem>
                        <SelectItem value="xml">XML Format</SelectItem>
                        <SelectItem value="sql">SQL Dump</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dateRange">Date Range</Label>
                    <Select value={exportConfig.dateRange} onValueChange={(value) => setExportConfig({ ...exportConfig, dateRange: value })}>
                      <SelectTrigger className="professional-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Data</SelectItem>
                        <SelectItem value="last30days">Last 30 Days</SelectItem>
                        <SelectItem value="last90days">Last 90 Days</SelectItem>
                        <SelectItem value="lastyear">Last Year</SelectItem>
                        <SelectItem value="custom">Custom Range</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="batchSize">Batch Size</Label>
                    <Input
                      id="batchSize"
                      type="number"
                      value={exportConfig.batchSize}
                      onChange={(e) => setExportConfig({ ...exportConfig, batchSize: parseInt(e.target.value) })}
                      className="professional-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeHeaders"
                      checked={exportConfig.includeHeaders}
                      onCheckedChange={(checked) => setExportConfig({ ...exportConfig, includeHeaders: checked as boolean })}
                    />
                    <Label htmlFor="includeHeaders">Include Headers</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="compression"
                      checked={exportConfig.compression}
                      onCheckedChange={(checked) => setExportConfig({ ...exportConfig, compression: checked as boolean })}
                    />
                    <Label htmlFor="compression">Enable Compression</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="encryption"
                      checked={exportConfig.encryption}
                      onCheckedChange={(checked) => setExportConfig({ ...exportConfig, encryption: checked as boolean })}
                    />
                    <Label htmlFor="encryption">Encrypt Export</Label>
                  </div>
                </div>

                {/* Export Summary */}
                <div className="p-3 bg-secondary/20 rounded-lg">
                  <h4 className="font-medium mb-2">Export Summary</h4>
                  <div className="text-sm space-y-1">
                    <div>Selected Tables: {selectedTables.length}</div>
                    <div>Total Records: {getTotalSize().totalRecords.toLocaleString()}</div>
                    <div>Estimated Size: {getTotalSize().totalSize} MB</div>
                  </div>
                </div>

                {/* Export Progress */}
                {isExporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Exporting data...</span>
                      <span>{exportProgress}%</span>
                    </div>
                    <Progress value={exportProgress} className="w-full" />
                  </div>
                )}

                <Button 
                  onClick={handleExport} 
                  disabled={isExporting || selectedTables.length === 0}
                  className="w-full professional-button"
                >
                  {isExporting ? (
                    <>
                      <Clock className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Start Export
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-primary" />
                Data Import Center
              </CardTitle>
              <CardDescription>Import data from external sources into the system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center">
                <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">Upload Files for Import</h3>
                <p className="text-muted-foreground mb-4">
                  Supported formats: CSV, Excel, JSON, XML
                </p>
                <Button className="professional-button">
                  Choose Files
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Card className="p-4 border border-white/10">
                  <div className="text-center">
                    <Users className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium">Student Data</h4>
                    <p className="text-sm text-muted-foreground">Import student records and enrollment data</p>
                  </div>
                </Card>

                <Card className="p-4 border border-white/10">
                  <div className="text-center">
                    <GraduationCap className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium">Course Data</h4>
                    <p className="text-sm text-muted-foreground">Import course catalogs and schedules</p>
                  </div>
                </Card>

                <Card className="p-4 border border-white/10">
                  <div className="text-center">
                    <Briefcase className="mx-auto h-8 w-8 text-primary mb-2" />
                    <h4 className="font-medium">Job Postings</h4>
                    <p className="text-sm text-muted-foreground">Import job opportunities and employer data</p>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Export History</CardTitle>
              <CardDescription>View and manage previous data exports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Export Name</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {exportHistory.map((export_item) => (
                      <TableRow key={export_item.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <div className="font-medium">{export_item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {export_item.tables.length} tables exported
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{export_item.date}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{export_item.format}</Badge>
                        </TableCell>
                        <TableCell>{export_item.size}</TableCell>
                        <TableCell>{getStatusBadge(export_item.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              disabled={export_item.status !== 'completed'}
                            >
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
