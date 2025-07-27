import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { mlService, MLInsight, PredictiveMetrics } from '@/services/mlService';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target, 
  Users, 
  Briefcase, 
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export const AIInsightsDashboard: React.FC = () => {
  const [insights, setInsights] = useState<MLInsight[]>([]);
  const [metrics, setMetrics] = useState<PredictiveMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      
      // Generate AI insights using both local ML service and edge function
      const [
        localInsights,
        edgeFunctionResult,
        predictiveMetrics
      ] = await Promise.all([
        generateLocalInsights(),
        generateEdgeFunctionInsights(),
        mlService.generatePredictiveMetrics()
      ]);

      // Combine insights from different sources
      const allInsights = [
        ...localInsights,
        ...(edgeFunctionResult || [])
      ].sort((a, b) => b.confidence - a.confidence);

      setInsights(allInsights);
      setMetrics(predictiveMetrics);
      
    } catch (error) {
      console.error('Error loading AI insights:', error);
      toast({
        title: "Error Loading Insights",
        description: "Failed to generate AI insights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateLocalInsights = async (): Promise<MLInsight[]> => {
    const [
      attritionInsights,
      successInsights,
      placementInsights,
      skillGapInsights
    ] = await Promise.all([
      mlService.generateEmployeeAttritionPrediction(),
      mlService.generateStudentSuccessPrediction(),
      mlService.generateJobPlacementRecommendations(),
      mlService.generateSkillGapAnalysis()
    ]);

    return [
      ...attritionInsights,
      ...successInsights,
      ...placementInsights,
      ...skillGapInsights
    ];
  };

  const generateEdgeFunctionInsights = async (): Promise<MLInsight[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('ai-insights', {
        body: { type: 'all', timeframe: 'month' }
      });

      if (error) throw error;
      return data?.insights || [];
    } catch (error) {
      console.error('Edge function insights failed:', error);
      return [];
    }
  };

  const refreshInsights = async () => {
    setRefreshing(true);
    await loadInsights();
    setRefreshing(false);
    toast({
      title: "Insights Refreshed",
      description: "AI insights have been updated with the latest data."
    });
  };

  const getInsightIcon = (type: MLInsight['type']) => {
    switch (type) {
      case 'prediction': return <Brain className="h-4 w-4" />;
      case 'recommendation': return <Target className="h-4 w-4" />;
      case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
      case 'trend': return <TrendingUp className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const getImpactColor = (impact: MLInsight['impact']) => {
    switch (impact) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hr': 
      case 'hr analytics': return <Users className="h-4 w-4" />;
      case 'education':
      case 'education analytics': return <GraduationCap className="h-4 w-4" />;
      case 'job centre':
      case 'job placement': return <Briefcase className="h-4 w-4" />;
      default: return <Brain className="h-4 w-4" />;
    }
  };

  const filterInsightsByCategory = (category: string) => {
    return insights.filter(insight => 
      insight.category.toLowerCase().includes(category.toLowerCase())
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 animate-pulse" />
          <h2 className="text-2xl font-bold">Generating AI Insights...</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          <h2 className="text-2xl font-bold">AI Insights Dashboard</h2>
        </div>
        <Button 
          onClick={refreshInsights} 
          disabled={refreshing}
          variant="outline"
          size="sm"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh Insights
        </Button>
      </div>

      {/* Predictive Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Attrition Risk</p>
                  <p className="text-2xl font-bold text-destructive">
                    {Math.round(metrics.employeeAttritionRisk * 100)}%
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive" />
              </div>
              <Progress 
                value={metrics.employeeAttritionRisk * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Student Success Rate</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(metrics.studentSuccessRate * 100)}%
                  </p>
                </div>
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <Progress 
                value={metrics.studentSuccessRate * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Job Placement Probability</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {Math.round(metrics.jobPlacementProbability * 100)}%
                  </p>
                </div>
                <Briefcase className="h-8 w-8 text-blue-600" />
              </div>
              <Progress 
                value={metrics.jobPlacementProbability * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Revenue Growth Forecast</p>
                  <p className="text-2xl font-bold text-primary">
                    {Math.round(metrics.revenueGrowthForecast * 100)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <Progress 
                value={metrics.revenueGrowthForecast * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Insights Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Insights ({insights.length})</TabsTrigger>
          <TabsTrigger value="hr">HR Analytics ({filterInsightsByCategory('hr').length})</TabsTrigger>
          <TabsTrigger value="education">Education ({filterInsightsByCategory('education').length})</TabsTrigger>
          <TabsTrigger value="jobs">Job Centre ({filterInsightsByCategory('job').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <InsightsList insights={insights} />
        </TabsContent>

        <TabsContent value="hr" className="space-y-4">
          <InsightsList insights={filterInsightsByCategory('hr')} />
        </TabsContent>

        <TabsContent value="education" className="space-y-4">
          <InsightsList insights={filterInsightsByCategory('education')} />
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4">
          <InsightsList insights={filterInsightsByCategory('job')} />
        </TabsContent>
      </Tabs>
    </div>
  );

  function InsightsList({ insights }: { insights: MLInsight[] }) {
    if (insights.length === 0) {
      return (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            No insights available for this category. Try refreshing or check back later.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <div className="grid gap-4">
        {insights.map((insight) => (
          <Card key={insight.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getCategoryIcon(insight.category)}
                  <div>
                    <CardTitle className="text-lg">{insight.title}</CardTitle>
                    <CardDescription>{insight.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getImpactColor(insight.impact)}>
                    {insight.impact} impact
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    {getInsightIcon(insight.type)}
                    {insight.type}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Confidence: {Math.round(insight.confidence * 100)}%</span>
                <span>{insight.category}</span>
              </div>
              
              <Progress 
                value={insight.confidence * 100} 
                className="mt-2 h-2"
              />
              
              {insight.data && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <details className="cursor-pointer">
                    <summary className="font-medium">View Details</summary>
                    <pre className="mt-2 text-xs overflow-auto">
                      {JSON.stringify(insight.data, null, 2)}
                    </pre>
                  </details>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
};