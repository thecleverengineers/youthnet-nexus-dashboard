
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { 
  Users, 
  Home, 
  Briefcase, 
  GraduationCap,
  Heart,
  Leaf,
  TrendingUp,
  MapPin,
  DollarSign,
  Calendar,
  Download,
  Eye
} from 'lucide-react';

interface CommunityMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  target: number;
  unit: string;
  category: 'economic' | 'social' | 'environmental' | 'education';
  icon: React.ReactNode;
}

interface RegionImpact {
  region: string;
  population: number;
  programsActive: number;
  employmentRate: number;
  avgIncome: number;
  educationAccess: number;
  healthcareAccess: number;
  environmentalScore: number;
}

export const CommunityImpact = () => {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1year');

  const communityMetrics: CommunityMetric[] = [
    {
      id: '1',
      name: 'Households Reached',
      value: 1250,
      change: 12,
      target: 1500,
      unit: '',
      category: 'social',
      icon: <Home className="h-5 w-5" />
    },
    {
      id: '2',
      name: 'Jobs Created',
      value: 340,
      change: 8,
      target: 400,
      unit: '',
      category: 'economic',
      icon: <Briefcase className="h-5 w-5" />
    },
    {
      id: '3',
      name: 'Income Improvement',
      value: 28,
      change: 5,
      target: 35,
      unit: '%',
      category: 'economic',
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: '4',
      name: 'Education Access',
      value: 85,
      change: 15,
      target: 90,
      unit: '%',
      category: 'education',
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      id: '5',
      name: 'Healthcare Access',
      value: 78,
      change: 10,
      target: 85,
      unit: '%',
      category: 'social',
      icon: <Heart className="h-5 w-5" />
    },
    {
      id: '6',
      name: 'Environmental Score',
      value: 72,
      change: 3,
      target: 80,
      unit: '/100',
      category: 'environmental',
      icon: <Leaf className="h-5 w-5" />
    }
  ];

  const regionData: RegionImpact[] = [
    {
      region: 'Kohima',
      population: 45000,
      programsActive: 8,
      employmentRate: 78,
      avgIncome: 25000,
      educationAccess: 90,
      healthcareAccess: 85,
      environmentalScore: 75
    },
    {
      region: 'Dimapur',
      population: 65000,
      programsActive: 12,
      employmentRate: 82,
      avgIncome: 28000,
      educationAccess: 88,
      healthcareAccess: 80,
      environmentalScore: 70
    },
    {
      region: 'Mokokchung',
      population: 35000,
      programsActive: 6,
      employmentRate: 75,
      avgIncome: 22000,
      educationAccess: 85,
      healthcareAccess: 78,
      environmentalScore: 80
    },
    {
      region: 'Mon',
      population: 28000,
      programsActive: 4,
      employmentRate: 70,
      avgIncome: 20000,
      educationAccess: 80,
      healthcareAccess: 75,
      environmentalScore: 85
    }
  ];

  const timelineData = [
    { month: 'Jan', households: 850, jobs: 200, income: 18, education: 70, healthcare: 65, environment: 68 },
    { month: 'Feb', households: 920, jobs: 225, income: 20, education: 72, healthcare: 68, environment: 69 },
    { month: 'Mar', households: 980, jobs: 250, income: 22, education: 75, healthcare: 70, environment: 70 },
    { month: 'Apr', households: 1050, jobs: 275, income: 24, education: 78, healthcare: 72, environment: 71 },
    { month: 'May', households: 1120, jobs: 300, income: 26, education: 80, healthcare: 75, environment: 71 },
    { month: 'Jun', households: 1180, jobs: 320, income: 27, education: 82, healthcare: 76, environment: 72 },
    { month: 'Jul', households: 1220, jobs: 335, income: 28, education: 84, healthcare: 77, environment: 72 },
    { month: 'Aug', households: 1250, jobs: 340, income: 28, education: 85, healthcare: 78, environment: 72 }
  ];

  const radarData = [
    {
      category: 'Economic',
      current: 75,
      target: 85,
      baseline: 60
    },
    {
      category: 'Social',
      current: 82,
      target: 90,
      baseline: 65
    },
    {
      category: 'Education',
      current: 85,
      target: 90,
      baseline: 70
    },
    {
      category: 'Healthcare',
      current: 78,
      target: 85,
      baseline: 65
    },
    {
      category: 'Environment',
      current: 72,
      target: 80,
      baseline: 70
    },
    {
      category: 'Infrastructure',
      current: 68,
      target: 75,
      baseline: 55
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'economic': return 'text-blue-500';
      case 'social': return 'text-green-500';
      case 'education': return 'text-purple-500';
      case 'environmental': return 'text-emerald-500';
      default: return 'text-gray-500';
    }
  };

  const getChangeColor = (change: number) => {
    return change > 0 ? 'text-green-600' : change < 0 ? 'text-red-600' : 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Community Impact Dashboard</h2>
          <p className="text-muted-foreground">Comprehensive view of community development progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <Select value={selectedRegion} onValueChange={setSelectedRegion}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="kohima">Kohima</SelectItem>
            <SelectItem value="dimapur">Dimapur</SelectItem>
            <SelectItem value="mokokchung">Mokokchung</SelectItem>
            <SelectItem value="mon">Mon</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="1year">Last Year</SelectItem>
            <SelectItem value="2years">Last 2 Years</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communityMetrics.map((metric) => (
          <Card key={metric.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-muted ${getCategoryColor(metric.category)}`}>
                    {metric.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                    <p className="text-2xl font-bold">
                      {metric.value.toLocaleString()}{metric.unit}
                    </p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${getChangeColor(metric.change)}`}>
                  {metric.change > 0 ? '+' : ''}{metric.change}%
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Target: {metric.target.toLocaleString()}{metric.unit}</span>
                  <span>{((metric.value / metric.target) * 100).toFixed(1)}%</span>
                </div>
                <Progress value={(metric.value / metric.target) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="regions">Regional Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="impact">Impact Assessment</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Impact Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Community Development Radar</CardTitle>
                <CardDescription>Multi-dimensional impact assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="category" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Target"
                      dataKey="target"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.1}
                    />
                    <Radar
                      name="Baseline"
                      dataKey="baseline"
                      stroke="#6b7280"
                      fill="#6b7280"
                      fillOpacity={0.1}
                    />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Progress Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Timeline</CardTitle>
                <CardDescription>Monthly development indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={timelineData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="households" stroke="#3b82f6" name="Households" />
                    <Line type="monotone" dataKey="jobs" stroke="#10b981" name="Jobs" />
                    <Line type="monotone" dataKey="education" stroke="#8b5cf6" name="Education %" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="regions" className="space-y-4">
          <div className="grid gap-4">
            {regionData.map((region) => (
              <Card key={region.region}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <div>
                        <h3 className="text-lg font-semibold">{region.region}</h3>
                        <p className="text-sm text-muted-foreground">
                          Population: {region.population.toLocaleString()} • {region.programsActive} Active Programs
                        </p>
                      </div>
                    </div>
                    <Badge variant="secondary">
                      {region.programsActive} Programs
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Employment</p>
                      <div className="flex items-center gap-2">
                        <Progress value={region.employmentRate} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{region.employmentRate}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Education</p>
                      <div className="flex items-center gap-2">
                        <Progress value={region.educationAccess} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{region.educationAccess}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Healthcare</p>
                      <div className="flex items-center gap-2">
                        <Progress value={region.healthcareAccess} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{region.healthcareAccess}%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Environment</p>
                      <div className="flex items-center gap-2">
                        <Progress value={region.environmentalScore} className="h-2 flex-1" />
                        <span className="text-sm font-medium">{region.environmentalScore}/100</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm">
                      <strong>Average Income:</strong> ₹{region.avgIncome.toLocaleString()}/month
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Multi-Indicator Trends</CardTitle>
              <CardDescription>Track progress across key development areas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="income" stroke="#3b82f6" name="Income Improvement %" />
                  <Line type="monotone" dataKey="education" stroke="#10b981" name="Education Access %" />
                  <Line type="monotone" dataKey="healthcare" stroke="#f59e0b" name="Healthcare Access %" />
                  <Line type="monotone" dataKey="environment" stroke="#8b5cf6" name="Environmental Score" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Regional Impact Comparison</CardTitle>
              <CardDescription>Compare development metrics across regions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={regionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="employmentRate" fill="#3b82f6" name="Employment Rate %" />
                  <Bar dataKey="educationAccess" fill="#10b981" name="Education Access %" />
                  <Bar dataKey="healthcareAccess" fill="#f59e0b" name="Healthcare Access %" />
                  <Bar dataKey="environmentalScore" fill="#8b5cf6" name="Environmental Score" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
