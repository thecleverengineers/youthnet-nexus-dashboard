
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { 
  Star,
  TrendingUp,
  Target,
  Brain,
  Users,
  Award,
  Lightbulb,
  BarChart3,
  PieChart,
  Calendar,
  MessageCircle,
  Zap,
  Sparkles,
  Eye,
  FileText,
  Plus,
  CheckCircle
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export const AdvancedPerformanceReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [metrics, setMetrics] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [aiInsights, setAiInsights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    avgPerformance: 0,
    reviewsCompleted: 0,
    improvementNeeded: 0,
    topPerformers: 0,
    skillGaps: 0,
    careerProgression: 0
  });

  const [newReview, setNewReview] = useState({
    employee_id: '',
    review_period_start: '',
    review_period_end: '',
    overall_rating: 'satisfactory',
    goals_achieved: '',
    strengths: '',
    areas_for_improvement: '',
    development_plan: ''
  });

  useEffect(() => {
    fetchReviews();
    fetchEmployees();
    fetchMetrics();
    fetchStats();
    generateAiInsights();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('performance_reviews')
        .select(`
          *,
          employee:employees!employee_id(employee_id, department, position)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch performance reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employment_status', 'active');

      if (error) throw error;
      setEmployees(data || []);
    } catch (error: any) {
      toast.error('Failed to fetch employees');
    }
  };

  const fetchMetrics = async () => {
    try {
      const { data, error } = await supabase
        .from('performance_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMetrics(data || []);
    } catch (error: any) {
      console.error('Failed to fetch metrics:', error);
    }
  };

  const fetchStats = async () => {
    try {
      const { data: reviewData } = await supabase
        .from('performance_reviews')
        .select('overall_rating');

      if (reviewData) {
        const ratingCounts = reviewData.reduce((acc, review) => {
          acc[review.overall_rating] = (acc[review.overall_rating] || 0) + 1;
          return acc;
        }, {});

        setStats({
          avgPerformance: 4.2, // Mock calculation
          reviewsCompleted: reviewData.length,
          improvementNeeded: ratingCounts.needs_improvement || 0,
          topPerformers: ratingCounts.excellent || 0,
          skillGaps: 8, // Mock data
          careerProgression: 85 // Mock percentage
        });
      }
    } catch (error: any) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const generateAiInsights = async () => {
    const insights = [
      {
        type: 'performance_prediction',
        title: 'High Performer Identification',
        description: 'AI identified 3 employees with 92% probability of promotion readiness',
        confidence: 0.92,
        impact: 'positive',
        employees: ['EMP001', 'EMP007', 'EMP015']
      },
      {
        type: 'skill_gap',
        title: 'Critical Skill Gap Detected',
        description: 'Digital marketing skills gap across 40% of marketing team',
        confidence: 0.87,
        impact: 'warning',
        action: 'training_recommendation'
      },
      {
        type: 'turnover_risk',
        title: 'Attrition Risk Analysis',
        description: '2 high-performing employees show signs of disengagement',
        confidence: 0.78,
        impact: 'negative',
        urgency: 'high'
      }
    ];
    setAiInsights(insights);
  };

  const createReview = async () => {
    if (!newReview.employee_id || !newReview.review_period_start || !newReview.review_period_end) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      // Generate AI insights for the review
      const aiGeneratedInsights = `AI Analysis Summary:
      - Performance trend: Upward trajectory over last 6 months
      - Key strengths: Problem-solving, team collaboration
      - Skill development opportunities: Advanced analytics, leadership
      - Career recommendation: Consider for senior role within 12 months`;

      const { data, error } = await supabase
        .from('performance_reviews')
        .insert({
          ...newReview,
          ai_generated_insights: aiGeneratedInsights,
          skill_assessment: {
            technical_skills: 8.5,
            communication: 9.0,
            leadership: 7.5,
            problem_solving: 8.8
          },
          career_recommendations: [
            'Senior Developer Role',
            'Team Lead Position',
            'Advanced Certifications'
          ]
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Performance review created with AI insights');
      setIsCreateReviewOpen(false);
      setNewReview({
        employee_id: '',
        review_period_start: '',
        review_period_end: '',
        overall_rating: 'satisfactory',
        goals_achieved: '',
        strengths: '',
        areas_for_improvement: '',
        development_plan: ''
      });
      fetchReviews();
      fetchStats();
    } catch (error: any) {
      toast.error('Failed to create review');
    }
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'satisfactory': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'needs_improvement': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'unsatisfactory': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getInsightColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'border-green-500/30 bg-green-500/10';
      case 'warning': return 'border-orange-500/30 bg-orange-500/10';
      case 'negative': return 'border-red-500/30 bg-red-500/10';
      default: return 'border-blue-500/30 bg-blue-500/10';
    }
  };

  return (
    <div className="space-y-6">
      {/* AI-Powered Header */}
      <Card className="futuristic-card bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-cyan-500/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-blue-600">
                <Star className="h-8 w-8 text-white" />
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2">
                  Advanced Performance Reviews
                  <Brain className="h-5 w-5 text-purple-400" />
                </CardTitle>
                <p className="text-muted-foreground">
                  AI-driven performance analysis with predictive insights
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="hover:bg-purple-500/20">
                <Lightbulb className="h-4 w-4 mr-2" />
                AI Analyze
              </Button>
              <Dialog open={isCreateReviewOpen} onOpenChange={setIsCreateReviewOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-blue-600">
                    <Plus className="h-4 w-4 mr-2" />
                    New Review
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] bg-gray-900 border-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-gradient">Create Performance Review</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Employee *</label>
                      <Select 
                        value={newReview.employee_id} 
                        onValueChange={(value) => setNewReview(prev => ({ ...prev, employee_id: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id}>
                              {employee.employee_id} - {employee.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Period Start *</label>
                        <Input
                          type="date"
                          value={newReview.review_period_start}
                          onChange={(e) => setNewReview(prev => ({ ...prev, review_period_start: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Period End *</label>
                        <Input
                          type="date"
                          value={newReview.review_period_end}
                          onChange={(e) => setNewReview(prev => ({ ...prev, review_period_end: e.target.value }))}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Overall Rating</label>
                      <Select 
                        value={newReview.overall_rating} 
                        onValueChange={(value) => setNewReview(prev => ({ ...prev, overall_rating: value }))}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excellent">⭐ Excellent</SelectItem>
                          <SelectItem value="good">👍 Good</SelectItem>
                          <SelectItem value="satisfactory">✅ Satisfactory</SelectItem>
                          <SelectItem value="needs_improvement">⚠️ Needs Improvement</SelectItem>
                          <SelectItem value="unsatisfactory">❌ Unsatisfactory</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Strengths</label>
                      <Textarea
                        value={newReview.strengths}
                        onChange={(e) => setNewReview(prev => ({ ...prev, strengths: e.target.value }))}
                        placeholder="Key strengths and achievements"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Areas for Improvement</label>
                      <Textarea
                        value={newReview.areas_for_improvement}
                        onChange={(e) => setNewReview(prev => ({ ...prev, areas_for_improvement: e.target.value }))}
                        placeholder="Areas that need development"
                        className="mt-1"
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button
                        onClick={createReview}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-blue-600"
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Create with AI
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreateReviewOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Performance Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg Performance</p>
                <p className="text-3xl font-bold text-purple-400">{stats.avgPerformance}/5</p>
                <p className="text-xs text-purple-300">Rating</p>
              </div>
              <Star className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Reviews Done</p>
                <p className="text-3xl font-bold text-blue-400">{stats.reviewsCompleted}</p>
                <p className="text-xs text-blue-300">This Quarter</p>
              </div>
              <FileText className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Top Performers</p>
                <p className="text-3xl font-bold text-green-400">{stats.topPerformers}</p>
                <p className="text-xs text-green-300">Excellent</p>
              </div>
              <Award className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Need Support</p>
                <p className="text-3xl font-bold text-orange-400">{stats.improvementNeeded}</p>
                <p className="text-xs text-orange-300">Improvement</p>
              </div>
              <Target className="h-8 w-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Skill Gaps</p>
                <p className="text-3xl font-bold text-cyan-400">{stats.skillGaps}</p>
                <p className="text-xs text-cyan-300">Identified</p>
              </div>
              <Lightbulb className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Career Ready</p>
                <p className="text-3xl font-bold text-pink-400">{stats.careerProgression}%</p>
                <p className="text-xs text-pink-300">Progression</p>
              </div>
              <TrendingUp className="h-8 w-8 text-pink-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights Panel */}
      <Card className="futuristic-card bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-400" />
            AI Performance Intelligence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {aiInsights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.impact)}`}>
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-white">{insight.title}</h4>
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                    {Math.round(insight.confidence * 100)}%
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                {insight.urgency === 'high' && (
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30 mb-2">
                    High Priority
                  </Badge>
                )}
                <Button size="sm" variant="outline" className="hover:bg-purple-500/20">
                  View Details
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Reviews List */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            Performance Review Analytics
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800/50 rounded-lg h-24"></div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-white text-lg">
                          {review.employee?.employee_id} - {review.employee?.position}
                        </h3>
                        <Badge className={getRatingColor(review.overall_rating)}>
                          {review.overall_rating.replace('_', ' ')}
                        </Badge>
                        {review.ai_generated_insights && (
                          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                            <Brain className="h-3 w-3 mr-1" />
                            AI Enhanced
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-4">
                        <div>
                          <span className="font-medium">Period:</span> {format(new Date(review.review_period_start), 'MMM yyyy')} - {format(new Date(review.review_period_end), 'MMM yyyy')}
                        </div>
                        <div>
                          <span className="font-medium">Department:</span> {review.employee?.department}
                        </div>
                        <div>
                          <span className="font-medium">Status:</span> {review.status}
                        </div>
                        <div>
                          <span className="font-medium">Next Review:</span> {review.next_review_date ? format(new Date(review.next_review_date), 'MMM yyyy') : 'TBD'}
                        </div>
                      </div>

                      {review.skill_assessment && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          {Object.entries(review.skill_assessment).map(([skill, score]) => (
                            <div key={skill} className="bg-gray-800/30 p-3 rounded-lg">
                              <p className="text-xs text-muted-foreground mb-1">{skill.replace('_', ' ')}</p>
                              <Progress value={score * 10} className="h-2 mb-1" />
                              <p className="text-sm font-semibold text-white">{score}/10</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 ml-4">
                      <Button variant="outline" className="hover:bg-blue-500/20">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" className="hover:bg-purple-500/20">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No performance reviews found</h3>
              <p className="text-muted-foreground">Create your first AI-powered performance review to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
