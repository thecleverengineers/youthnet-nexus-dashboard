
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Users, 
  Calendar,
  Download,
  Filter,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';

interface OutcomeMetric {
  id: string;
  name: string;
  target: number;
  achieved: number;
  unit: string;
  category: 'employment' | 'income' | 'skills' | 'satisfaction';
  status: 'on_track' | 'behind' | 'exceeded';
  trend: 'up' | 'down' | 'stable';
}

interface ProgramOutcome {
  id: string;
  programName: string;
  participants: number;
  completionRate: number;
  employmentRate: number;
  avgIncomeIncrease: number;
  satisfactionScore: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'planning';
}

export const OutcomeAssessment = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedProgram, setSelectedProgram] = useState('all');

  const outcomes: ProgramOutcome[] = [
    {
      id: '1',
      programName: 'Agricultural Development',
      participants: 45,
      completionRate: 85,
      employmentRate: 78,
      avgIncomeIncrease: 35,
      satisfactionScore: 4.6,
      startDate: '2023-01-15',
      endDate: '2023-06-15',
      status: 'completed'
    },
    {
      id: '2',
      programName: 'Handicraft Business',
      participants: 32,
      completionRate: 92,
      employmentRate: 85,
      avgIncomeIncrease: 45,
      satisfactionScore: 4.8,
      startDate: '2023-03-01',
      endDate: '2023-08-01',
      status: 'completed'
    },
    {
      id: '3',
      programName: 'Tourism Development',
      participants: 28,
      completionRate: 75,
      employmentRate: 68,
      avgIncomeIncrease: 25,
      satisfactionScore: 4.2,
      startDate: '2023-06-01',
      endDate: '2023-12-01',
      status: 'active'
    }
  ];

  const metrics: OutcomeMetric[] = [
    {
      id: '1',
      name: 'Employment Rate',
      target: 80,
      achieved: 77,
      unit: '%',
      category: 'employment',
      status: 'behind',
      trend: 'up'
    },
    {
      id: '2',
      name: 'Average Income Increase',
      target: 40,
      achieved: 35,
      unit: '%',
      category: 'income',
      status: 'behind',
      trend: 'up'
    },
    {
      id: '3',
      name: 'Skill Certification Rate',
      target: 90,
      achieved: 94,
      unit: '%',
      category: 'skills',
      status: 'exceeded',
      trend: 'up'
    },
    {
      id: '4',
      name: 'Program Satisfaction',
      target: 4.5,
      achieved: 4.6,
      unit: '/5',
      category: 'satisfaction',
      status: 'exceeded',
      trend: 'stable'
    }
  ];

  const monthlyData = [
    { month: 'Jan', employment: 65, income: 20, satisfaction: 4.2, participants: 12 },
    { month: 'Feb', employment: 68, income: 22, satisfaction: 4.3, participants: 18 },
    { month: 'Mar', employment: 72, income: 28, satisfaction: 4.4, participants: 25 },
    { month: 'Apr', employment: 75, income: 32, satisfaction: 4.5, participants: 32 },
    { month: 'May', employment: 77, income: 35, satisfaction: 4.6, participants: 38 },
    { month: 'Jun', employment: 77, income: 35, satisfaction: 4.6, participants: 45 }
  ];

  const impactCategories = [
    { name: 'Economic Impact', value: 40, color: '#3b82f6' },
    { name: 'Skill Development', value: 30, color: '#10b981' },
    { name: 'Social Impact', value: 20, color: '#f59e0b' },
    { name: 'Environmental', value: 10, color: '#8b5cf6' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'exceeded': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'on_track': return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'behind': return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'exceeded': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'on_track': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'behind': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const overallStats = {
    totalParticipants: outcomes.reduce((sum, p) => sum + p.participants, 0),
    avgCompletionRate: Math.round(outcomes.reduce((sum, p) => sum + p.completionRate, 0) / outcomes.length),
    avgEmploymentRate: Math.round(outcomes.reduce((sum, p) => sum + p.employmentRate, 0) / outcomes.length),
    avgIncomeIncrease: Math.round(outcomes.reduce((sum, p) => sum + p.avgIncomeIncrease, 0) / outcomes.length)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Outcome Assessment</h2>
          <p className="text-muted-foreground">Comprehensive analysis of program effectiveness and impact</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="flex gap-4">
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Time</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="q4">Q4 2023</SelectItem>
            <SelectItem value="q3">Q3 2023</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedProgram} onValueChange={setSelectedProgram}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select program" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Programs</SelectItem>
            <SelectItem value="agricultural">Agricultural Development</SelectItem>
            <SelectItem value="handicraft">Handicraft Business</SelectItem>
            <SelectItem value="tourism">Tourism Development</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
                <p className="text-2xl font-bold">{overallStats.totalParticipants}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Completion Rate</p>
                <p className="text-2xl font-bold">{overallStats.avgCompletionRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Employment Rate</p>
                <p className="text-2xl font-bold">{overallStats.avgEmploymentRate}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Income Increase</p>
                <p className="text-2xl font-bold">{overallStats.avgIncomeIncrease}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="metrics">Key Metrics</TabsTrigger>
          <TabsTrigger value="programs">Program Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Progress Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="employment" stroke="#3b82f6" name="Employment %" />
                    <Line type="monotone" dataKey="income" stroke="#10b981" name="Income Increase %" />
                    <Line type="monotone" dataKey="satisfaction" stroke="#f59e0b" name="Satisfaction" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Impact Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Impact Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={impactCategories}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      dataKey="value"
                      stroke="none"
                    >
                      {impactCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {impactCategories.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm">{item.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metrics" className="space-y-4">
          <div className="grid gap-4">
            {metrics.map((metric) => (
              <Card key={metric.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(metric.status)}
                      <div>
                        <h3 className="font-semibold">{metric.name}</h3>
                        <p className="text-sm text-muted-foreground capitalize">{metric.category}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(metric.status)}>
                      {metric.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Target: {metric.target}{metric.unit}</span>
                      <span>Achieved: {metric.achieved}{metric.unit}</span>
                    </div>
                    <Progress 
                      value={(metric.achieved / metric.target) * 100} 
                      className="h-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      {((metric.achieved / metric.target) * 100).toFixed(1)}% of target achieved
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-4">
          <div className="grid gap-4">
            {outcomes.map((outcome) => (
              <Card key={outcome.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{outcome.programName}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{outcome.participants} participants</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(outcome.startDate).toLocaleDateString()} - {new Date(outcome.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <Badge variant={outcome.status === 'completed' ? 'default' : 'secondary'}>
                      {outcome.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Completion Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={outcome.completionRate} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{outcome.completionRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Employment Rate</p>
                      <div className="flex items-center gap-2">
                        <Progress value={outcome.employmentRate} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{outcome.employmentRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Income Increase</p>
                      <div className="flex items-center gap-2">
                        <Progress value={outcome.avgIncomeIncrease} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{outcome.avgIncomeIncrease}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Satisfaction</p>
                      <div className="flex items-center gap-2">
                        <Progress value={(outcome.satisfactionScore / 5) * 100} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{outcome.satisfactionScore}/5</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Program Effectiveness Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employment" fill="#3b82f6" name="Employment %" />
                  <Bar dataKey="income" fill="#10b981" name="Income Increase %" />
                  <Bar dataKey="participants" fill="#f59e0b" name="New Participants" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
