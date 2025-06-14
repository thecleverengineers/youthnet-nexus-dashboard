
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Star, 
  TrendingUp, 
  Target, 
  Brain, 
  FileText,
  Users,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Lightbulb,
  Plus
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface PerformanceReview {
  id: string;
  employee_id: string;
  reviewer_id: string;
  review_period_start: string;
  review_period_end: string;
  overall_rating: 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory';
  goals_achieved: string;
  areas_for_improvement: string;
  development_plan: string;
  comments: string;
  created_at: string;
  updated_at: string;
  ai_generated_insights?: string;
  skill_assessment?: any;
  career_recommendations?: any;
  peer_feedback?: any;
  self_assessment?: any;
}

interface SkillAssessment {
  technical_skills: number;
  communication: number;
  leadership: number;
  problem_solving: number;
  teamwork: number;
  innovation: number;
}

export const AdvancedPerformanceReviews = () => {
  const [reviews, setReviews] = useState<PerformanceReview[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState({
    totalReviews: 0,
    averageRating: 0,
    pendingReviews: 0,
    improvementTrends: 0
  });

  const [newRe

view, setNewReview] = useState({
    employee_id: '',
    review_period_start: '',
    review_period_end: '',
    overall_rating: 'satisfactory' as const,
    goals_achieved: '',
    areas_for_improvement: '',
    development_plan: '',
    comments: '',
    skill_assessment: {
      technical_skills: 3,
      communication: 3,
      leadership: 3,
      problem_solving: 3,
      teamwork: 3,
      innovation: 3
    }
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [reviewsResponse, employeesResponse] = await Promise.all([
        supabase
          .from('performance_reviews')
          .select('*')
          .order('created_at', { ascending: false }),
        supabase.from('employees').select('id, employee_id, position, department')
      ]);

      let reviewsData: PerformanceReview[] = [];
      
      if (reviewsResponse.data) {
        // Convert database response to proper PerformanceReview type
        reviewsData = reviewsResponse.data.map(review => ({
          ...review,
          comments: '', // Set default value since comments field doesn't exist in DB response
          overall_rating: review.overall_rating as 'excellent' | 'good' | 'satisfactory' | 'needs_improvement' | 'unsatisfactory'
        }));
        setReviews(reviewsData);
      }
      
      if (employeesResponse.data) setEmployees(employeesResponse.data);

      // Calculate analytics
      const total = reviewsData.length;
      const ratings = reviewsData.map(r => {
        switch (r.overall_rating) {
          case 'excellent': return 5;
          case 'good': return 4;
          case 'satisfactory': return 3;
          case 'needs_improvement': return 2;
          case 'unsatisfactory': return 1;
          default: return 3;
        }
      });
      
      const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

      setAnalytics({
        totalReviews: total,
        averageRating: avgRating,
        pendingReviews: Math.floor(total * 0.15), // Mock pending reviews
        improvementTrends: 8.5 // Mock improvement trend
      });

    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load performance reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReview = async () => {
    try {
      // Generate AI insights
      const aiInsights = generateAIInsights(newReview.skill_assessment);
      const careerRecommendations = generateCareerRecommendations(newReview.skill_assessment);

      const reviewData = {
        ...newReview,
        reviewer_id: 'current-user-id', // This should come from auth context
        ai_generated_insights: aiInsights,
        skill_assessment: newReview.skill_assessment,
        career_recommendations: careerRecommendations,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('performance_reviews')
        .insert([reviewData]);

      if (error) throw error;

      toast.success('Performance review created successfully!');
      setIsCreateDialogOpen(false);
      loadData();
      
      // Reset form
      setNewReview({
        employee_id: '',
        review_period_start: '',
        review_period_end: '',
        overall_rating: 'satisfactory',
        goals_achieved: '',
        areas_for_improvement: '',
        development_plan: '',
        comments: '',
        skill_assessment: {
          technical_skills: 3,
          communication: 3,
          leadership: 3,
          problem_solving: 3,
          teamwork: 3,
          innovation: 3
        }
      });

    } catch (error: any) {
      toast.error('Failed to create review: ' + error.message);
    }
  };

  const generateAIInsights = (skills: SkillAssessment): string => {
    const strengths = [];
    const improvements = [];
    
    Object.entries(skills).forEach(([skill, rating]) => {
      if (rating >= 4) {
        strengths.push(skill.replace('_', ' '));
      } else if (rating <= 2) {
        improvements.push(skill.replace('_', ' '));
      }
    });

    return `AI Analysis: Employee shows strong performance in ${strengths.join(', ')}. 
    Recommended focus areas for development: ${improvements.join(', ')}.
    Predicted performance trajectory: Positive growth with targeted skill development.`;
  };

  const generateCareerRecommendations = (skills: SkillAssessment): string[] => {
    const recommendations = [];
    
    if (skills.leadership >= 4) {
      recommendations.push('Consider leadership training programs');
      recommendations.push('Mentorship opportunities available');
    }
    
    if (skills.technical_skills >= 4) {
      recommendations.push('Advanced technical certifications recommended');
      recommendations.push('Senior technical role pathway');
    }
    
    if (skills.communication >= 4) {
      recommendations.push('Cross-functional collaboration roles');
      recommendations.push('Training and presentation opportunities');
    }

    return recommendations.length > 0 ? recommendations : ['Continue current development path'];
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-blue-400';
      case 'satisfactory': return 'text-yellow-400';
      case 'needs_improvement': return 'text-orange-400';
      case 'unsatisfactory': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getRatingBadgeColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'good': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'satisfactory': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'needs_improvement': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'unsatisfactory': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading performance data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-6 font-inter">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
            AI-Powered Performance Reviews
          </h1>
          <p className="text-muted-foreground flex items-center gap-2 mt-2">
            <Brain className="h-4 w-4 text-purple-400" />
            Advanced analytics and intelligent insights
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              Create Review
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/95 backdrop-blur-xl border-white/10">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gradient">Create Performance Review</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Employee</label>
                  <Select value={newReview.employee_id} onValueChange={(value) => setNewReview({...newReview, employee_id: value})}>
                    <SelectTrigger className="bg-gray-800/50 border-white/10 text-white">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/10">
                      {employees.map((emp) => (
                        <SelectItem key={emp.id} value={emp.id} className="text-white hover:bg-gray-700">
                          {emp.employee_id} - {emp.position}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Overall Rating</label>
                  <Select value={newReview.overall_rating} onValueChange={(value: any) => setNewReview({...newReview, overall_rating: value})}>
                    <SelectTrigger className="bg-gray-800/50 border-white/10 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-white/10">
                      <SelectItem value="excellent" className="text-white hover:bg-gray-700">Excellent</SelectItem>
                      <SelectItem value="good" className="text-white hover:bg-gray-700">Good</SelectItem>
                      <SelectItem value="satisfactory" className="text-white hover:bg-gray-700">Satisfactory</SelectItem>
                      <SelectItem value="needs_improvement" className="text-white hover:bg-gray-700">Needs Improvement</SelectItem>
                      <SelectItem value="unsatisfactory" className="text-white hover:bg-gray-700">Unsatisfactory</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Review Period Start</label>
                  <Input
                    type="date"
                    value={newReview.review_period_start}
                    onChange={(e) => setNewReview({...newReview, review_period_start: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Review Period End</label>
                  <Input
                    type="date"
                    value={newReview.review_period_end}
                    onChange={(e) => setNewReview({...newReview, review_period_end: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white"
                  />
                </div>
              </div>

              {/* Skill Assessment */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white">Skill Assessment</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(newReview.skill_assessment).map(([skill, rating]) => (
                    <div key={skill} className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium text-gray-300 capitalize">
                          {skill.replace('_', ' ')}
                        </label>
                        <span className="text-sm text-purple-400 font-medium">{rating}/5</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setNewReview({
                              ...newReview,
                              skill_assessment: {
                                ...newReview.skill_assessment,
                                [skill]: star
                              }
                            })}
                            className={`transition-colors ${
                              star <= rating ? 'text-yellow-400' : 'text-gray-600'
                            }`}
                          >
                            <Star className="h-5 w-5 fill-current" />
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Goals Achieved</label>
                  <Textarea
                    value={newReview.goals_achieved}
                    onChange={(e) => setNewReview({...newReview, goals_achieved: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white min-h-[100px] resize-none"
                    placeholder="Describe the goals achieved during this period..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Areas for Improvement</label>
                  <Textarea
                    value={newReview.areas_for_improvement}
                    onChange={(e) => setNewReview({...newReview, areas_for_improvement: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white min-h-[100px] resize-none"
                    placeholder="Identify areas that need improvement..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Development Plan</label>
                  <Textarea
                    value={newReview.development_plan}
                    onChange={(e) => setNewReview({...newReview, development_plan: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white min-h-[100px] resize-none"
                    placeholder="Outline the development plan for the next period..."
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">Additional Comments</label>
                  <Textarea
                    value={newReview.comments}
                    onChange={(e) => setNewReview({...newReview, comments: e.target.value})}
                    className="bg-gray-800/50 border-white/10 text-white min-h-[100px] resize-none"
                    placeholder="Any additional comments or observations..."
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                  className="border-white/20 text-gray-300 hover:bg-white/5"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateReview}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                >
                  Create Review
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Total Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">{analytics.totalReviews}</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% this quarter
                </p>
              </div>
              <div className="p-3 bg-purple-500/20 rounded-xl">
                <FileText clas

sName="h-8 w-8 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Average Rating</p>
                <p className="text-3xl font-bold text-white mt-1">{analytics.averageRating.toFixed(1)}</p>
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < Math.floor(analytics.averageRating) ? 'text-yellow-400 fill-current' : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <div className="p-3 bg-blue-500/20 rounded-xl">
                <Award className="h-8 w-8 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-orange-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Pending Reviews</p>
                <p className="text-3xl font-bold text-white mt-1">{analytics.pendingReviews}</p>
                <p className="text-xs text-orange-400 mt-2 flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Requires attention
                </p>
              </div>
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Clock className="h-8 w-8 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl hover:shadow-green-500/10 transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 font-medium">Improvement Trend</p>
                <p className="text-3xl font-bold text-white mt-1">{analytics.improvementTrends}%</p>
                <p className="text-xs text-green-400 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Positive trajectory
                </p>
              </div>
              <div className="p-3 bg-green-500/20 rounded-xl">
                <BarChart3 className="h-8 w-8 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews List */}
      <Card className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-xl border-white/10 shadow-2xl">
        <CardHeader className="border-b border-white/10">
          <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="h-6 w-6 text-purple-400" />
            Performance Reviews
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {reviews.length > 0 ? (
            <div className="divide-y divide-white/10">
              {reviews.map((review) => {
                const employee = employees.find(emp => emp.id === review.employee_id);
                return (
                  <div key={review.id} className="p-6 hover:bg-white/5 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="text-lg font-semibold text-white">
                            {employee?.employee_id || 'Unknown Employee'}
                          </h3>
                          <Badge className={getRatingBadgeColor(review.overall_rating)}>
                            {review.overall_rating.replace('_', ' ')}
                          </Badge>
                          <span className="text-sm text-gray-400">
                            {employee?.position} • {employee?.department}
                          </span>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Review Period</p>
                            <p className="text-white font-medium">
                              {format(new Date(review.review_period_start), 'MMM dd')} - {format(new Date(review.review_period_end), 'MMM dd, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Goals Achieved</p>
                            <p className="text-white font-medium line-clamp-2">
                              {review.goals_achieved || 'No goals specified'}
                            </p>
                          </div>
                        </div>

                        {review.ai_generated_insights && (
                          <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                              <Brain className="h-5 w-5 text-purple-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-purple-400 mb-2">AI Insights</p>
                                <p className="text-sm text-gray-300 leading-relaxed">
                                  {review.ai_generated_insights}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {review.skill_assessment && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                            {Object.entries(review.skill_assessment as SkillAssessment).map(([skill, rating]) => (
                              <div key={skill} className="bg-gray-800/50 rounded-lg p-3">
                                <p className="text-xs text-gray-400 mb-1 capitalize">{skill.replace('_', ' ')}</p>
                                <div className="flex items-center gap-1">
                                  <Progress value={(Number(rating) / 5) * 100} className="flex-1 h-2" />
                                  <span className="text-xs text-white font-medium">{rating}/5</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {review.career_recommendations && (
                          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="text-sm font-medium text-blue-400 mb-2">Career Recommendations</p>
                                <ul className="text-sm text-gray-300 space-y-1">
                                  {(Array.isArray(review.career_recommendations) ? review.career_recommendations : []).map((rec: string, index: number) => (
                                    <li key={index} className="flex items-start gap-2">
                                      <CheckCircle className="h-3 w-3 text-green-400 mt-1 flex-shrink-0" />
                                      {rec}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Created</p>
                        <p className="text-white font-medium">
                          {format(new Date(review.created_at), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">No Performance Reviews</h3>
              <p className="text-gray-400 mb-6">Get started by creating your first performance review</p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Review
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
