
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  FileText, 
  Download, 
  Eye, 
  Settings, 
  Calendar, 
  Users, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Filter,
  Plus,
  Play,
  Save,
  Briefcase
} from 'lucide-react';

export const ReportGenerator = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [reportConfig, setReportConfig] = useState({
    name: '',
    description: '',
    type: 'student_performance',
    format: 'pdf',
    dateRange: 'last30days',
    includeCharts: true,
    includeTables: true,
    includeDetails: false,
    recipients: [] as string[],
    schedule: 'manual',
  });

  const reportTypes = [
    { 
      id: 'student_performance', 
      name: 'Student Performance Report', 
      description: 'Detailed analysis of student academic performance',
      icon: Users,
      category: 'Education'
    },
    { 
      id: 'course_analytics', 
      name: 'Course Analytics', 
      description: 'Course enrollment, completion, and engagement metrics',
      icon: BarChart3,
      category: 'Education'
    },
    { 
      id: 'hr_summary', 
      name: 'HR Summary Report', 
      description: 'Employee statistics, attendance, and performance data',
      icon: Users,
      category: 'HR'
    },
    { 
      id: 'financial_overview', 
      name: 'Financial Overview', 
      description: 'Revenue, expenses, and budget analysis',
      icon: TrendingUp,
      category: 'Finance'
    },
    { 
      id: 'system_usage', 
      name: 'System Usage Report', 
      description: 'Platform usage statistics and user engagement',
      icon: PieChart,
      category: 'Analytics'
    },
    { 
      id: 'job_placement', 
      name: 'Job Placement Report', 
      description: 'Employment statistics and placement success rates',
      icon: Briefcase,
      category: 'Career'
    }
  ];

  const [savedReports] = useState([
    {
      id: 1,
      name: 'Monthly Student Performance',
      type: 'Student Performance Report',
      lastGenerated: '2024-01-10',
      status: 'completed',
      format: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 2,
      name: 'Q4 Course Analytics',
      type: 'Course Analytics',
      lastGenerated: '2024-01-08',
      status: 'completed',
      format: 'Excel',
      size: '1.8 MB'
    },
    {
      id: 3,
      name: 'HR Summary December',
      type: 'HR Summary Report',
      lastGenerated: '2024-01-05',
      status: 'failed',
      format: 'PDF',
      size: '0 MB'
    }
  ]);

  const handleGenerateReport = async () => {
    if (!reportConfig.name) {
      toast({
        title: "Validation Error",
        description: "Please enter a report name.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate report generation progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsGenerating(false);
          toast({
            title: "Report Generated",
            description: `${reportConfig.name} has been generated successfully.`,
          });
          return 100;
        }
        return prev + 20;
      });
    }, 800);
  };

  const downloadReport = (reportId: number) => {
    toast({
      title: "Download Started",
      description: "Report download will begin shortly.",
    });
  };

  const previewReport = (reportId: number) => {
    toast({
      title: "Preview Opening",
      description: "Report preview will open in a new window.",
    });
  };

  return (
    <div className="space-y-6">
      <Tabs defaultValue="create" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create Report</TabsTrigger>
          <TabsTrigger value="templates">Report Templates</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        {/* Create Report Tab */}
        <TabsContent value="create" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Create Custom Report
              </CardTitle>
              <CardDescription>Configure and generate detailed reports across all modules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="reportName">Report Name</Label>
                  <Input
                    id="reportName"
                    value={reportConfig.name}
                    onChange={(e) => setReportConfig({ ...reportConfig, name: e.target.value })}
                    placeholder="Enter report name..."
                    className="professional-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="reportType">Report Type</Label>
                  <Select value={reportConfig.type} onValueChange={(value) => setReportConfig({ ...reportConfig, type: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map(type => (
                        <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={reportConfig.description}
                  onChange={(e) => setReportConfig({ ...reportConfig, description: e.target.value })}
                  placeholder="Describe the purpose and scope of this report..."
                  className="professional-input min-h-[80px]"
                />
              </div>

              {/* Date Range and Format */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateRange">Date Range</Label>
                  <Select value={reportConfig.dateRange} onValueChange={(value) => setReportConfig({ ...reportConfig, dateRange: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                      <SelectItem value="last90days">Last 90 days</SelectItem>
                      <SelectItem value="last1year">Last year</SelectItem>
                      <SelectItem value="custom">Custom range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format">Output Format</Label>
                  <Select value={reportConfig.format} onValueChange={(value) => setReportConfig({ ...reportConfig, format: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="html">HTML Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Content Options */}
              <div className="space-y-3">
                <Label>Content Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={reportConfig.includeCharts}
                      onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeCharts: checked as boolean })}
                    />
                    <Label htmlFor="includeCharts">Include Charts and Graphs</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeTables"
                      checked={reportConfig.includeTables}
                      onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeTables: checked as boolean })}
                    />
                    <Label htmlFor="includeTables">Include Data Tables</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeDetails"
                      checked={reportConfig.includeDetails}
                      onCheckedChange={(checked) => setReportConfig({ ...reportConfig, includeDetails: checked as boolean })}
                    />
                    <Label htmlFor="includeDetails">Include Detailed Analysis</Label>
                  </div>
                </div>
              </div>

              {/* Generation Progress */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating report...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  onClick={handleGenerateReport} 
                  disabled={isGenerating}
                  className="professional-button"
                >
                  {isGenerating ? (
                    <>
                      <Play className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
                
                <Button variant="outline">
                  <Save className="mr-2 h-4 w-4" />
                  Save Template
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-configured report templates for common use cases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {reportTypes.map((template) => (
                  <Card key={template.id} className="p-4 border border-white/10 hover-lift">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/20 rounded-lg">
                          <template.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm">{template.name}</h3>
                          <Badge variant="outline" className="text-xs">{template.category}</Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <Plus className="mr-1 h-3 w-3" />
                          Use Template
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Report History Tab */}
        <TabsContent value="history" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>View and manage previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-white/10 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Report Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Generated</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {savedReports.map((report) => (
                      <TableRow key={report.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <div className="font-medium">{report.name}</div>
                            <div className="text-sm text-muted-foreground">{report.size}</div>
                          </div>
                        </TableCell>
                        <TableCell>{report.type}</TableCell>
                        <TableCell>{report.lastGenerated}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{report.format}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={report.status === 'completed' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => previewReport(report.id)}
                              disabled={report.status !== 'completed'}
                            >
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => downloadReport(report.id)}
                              disabled={report.status !== 'completed'}
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
