
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabaseHelpers } from '@/utils/supabaseHelpers';
import { 
  Star, 
  TrendingUp, 
  Users, 
  Target, 
  Award,
  Brain,
  BarChart3,
  MessageSquare,
  Plus,
  Eye,
  Edit
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SkillAssessment {
  technical_skills: number;
  communication: number;
  leadership: number;
  problem_solving: number;
  teamwork: number;
  innovation: number;
}

export function AdvancedPerformanceReviews() {
  const [activeTab, setActiveTab] = useState('reviews');
  const [showCreateReview, setShowCreateReview] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [reviewData, setReviewData] = useState<Partial<any>>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch real performance reviews from database
  const { data: performanceReviews, isLoading: reviewsLoading } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: async () => {
      const { data, error } = await supabaseHelpers.performance_reviews.select(`
        *,
        employee:employee_id (
          id,
          employee_id,
          position,
          department,
          profiles:user_id (
            full_name,
            email
          )
        ),
        reviewer:reviewer_id (
          id,
          employee_id,
          profiles:user_id (
            full_name
          )
        )
      `);
      
      if (error) {
        console.error('Error fetching reviews:', error);
        throw error;
      }
      
      // Transform data to match expected format
      return (data || []).map((review: any) => ({
        ...review,
        employee_name: review.employee?.profiles?.full_name || 'Unknown',
        reviewer_name: review.reviewer?.profiles?.full_name || 'Unknown',
        technical_skills: review.technical_skills || 0,
        communication: review.communication || 0,
        leadership: review.leadership || 0,
        teamwork: review.teamwork || 0,
        innovation: review.innovation || 0,
      }));
    },
  });

  const { data: reviewAnalytics } = useQuery({
    queryKey: ['review-analytics', performanceReviews],
    queryFn: async () => {
      const reviews = performanceReviews || [];
      if (reviews.length === 0) {
        return {
          totalReviews: 0,
          averageRating: 0,
          completedReviews: 0,
          pendingReviews: 0,
          skillBreakdown: []
        };
      }

      const avgRating = reviews.reduce((sum: number, review: any) => 
        sum + (review.overall_rating || 0), 0) / reviews.length;
      
      // Calculate real skill averages
      const skillTotals = {
        technical: 0,
        communication: 0,
        leadership: 0,
        teamwork: 0,
        innovation: 0
      };

      reviews.forEach((review: any) => {
        skillTotals.technical += review.technical_skills || 0;
        skillTotals.communication += review.communication || 0;
        skillTotals.leadership += review.leadership || 0;
        skillTotals.teamwork += review.teamwork || 0;
        skillTotals.innovation += review.innovation || 0;
      });

      const skillBreakdown = [
        { skill: 'Technical', average: skillTotals.technical / reviews.length },
        { skill: 'Communication', average: skillTotals.communication / reviews.length },
        { skill: 'Leadership', average: skillTotals.leadership / reviews.length },
        { skill: 'Teamwork', average: skillTotals.teamwork / reviews.length },
        { skill: 'Innovation', average: skillTotals.innovation / reviews.length },
      ].map(s => ({ ...s, average: Number(s.average.toFixed(2)) }));
      
      return {
        totalReviews: reviews.length,
        averageRating: Number(avgRating.toFixed(1)),
        completedReviews: reviews.filter((r: any) => r.status === 'completed').length,
        pendingReviews: reviews.filter((r: any) => r.status === 'draft').length,
        skillBreakdown
      };
    },
    enabled: !!performanceReviews
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      const { data, error } = await supabaseHelpers.performance_reviews
        .insert([{
          ...reviewData,
          status: 'draft'
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      setShowCreateReview(false);
      setReviewData({});
      toast({ title: 'Performance review created successfully' });
    },
    onError: (error: any) => {
      toast({ 
        title: 'Failed to create review',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const generateAIInsights = (skillAssessment: SkillAssessment) => {
    const strengths = [];
    const improvements = [];
    
    if (skillAssessment.technical_skills >= 4.0) strengths.push('Strong technical capabilities');
    if (skillAssessment.communication >= 4.0) strengths.push('Excellent communication skills');
    if (skillAssessment.leadership >= 4.0) strengths.push('Leadership potential');
    if (skillAssessment.teamwork >= 4.0) strengths.push('Great team collaboration');
    if (skillAssessment.innovation >= 4.0) strengths.push('Innovative thinking');

    if (skillAssessment.technical_skills < 3.5) improvements.push('Technical skills development');
    if (skillAssessment.communication < 3.5) improvements.push('Communication enhancement');
    if (skillAssessment.leadership < 3.5) improvements.push('Leadership training');

    return {
      strengths: strengths.length ? strengths : ['Consistent performance across all areas'],
      improvements: improvements.length ? improvements : ['Continue current development trajectory'],
      recommendation: skillAssessment.technical_skills + skillAssessment.communication + skillAssessment.leadership + skillAssessment.teamwork + skillAssessment.innovation >= 20 
        ? 'Consider for advanced responsibilities or promotion' 
        : 'Focus on targeted skill development'
    };
  };

  const handleCreateReview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const skillAssessment: SkillAssessment = {
      technical_skills: Number(formData.get('technical_skills')),
      communication: Number(formData.get('communication')),
      leadership: Number(formData.get('leadership')),
      problem_solving: Number(formData.get('problem_solving')),
      teamwork: Number(formData.get('teamwork')),
      innovation: Number(formData.get('innovation')),
    };

    const overallRating = Object.values(skillAssessment).reduce((sum, val) => sum + val, 0) / Object.values(skillAssessment).length;
    const aiInsights = generateAIInsights(skillAssessment);

    const newReview = {
      employee_id: formData.get('employee_id') as string,
      reviewer_id: 'current-user', // This would be from auth context
      review_period: formData.get('review_period') as string,
      overall_rating: Number(overallRating.toFixed(1)),
      ...skillAssessment,
      ai_generated_insights: JSON.stringify(aiInsights),
      development_goals: [formData.get('development_goals') as string],
      achievements: [formData.get('achievements') as string],
      areas_for_improvement: aiInsights.improvements,
      comments: formData.get('comments') as string,
      status: 'draft'
    };

    createReviewMutation.mutate(newReview);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.0) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Advanced Performance Reviews</h1>
          <p className="text-gray-600">AI-powered performance evaluation and development planning</p>
        </div>
        <Button onClick={() => setShowCreateReview(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Review
        </Button>
      </div>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-8 w-8 text-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{reviewAnalytics?.averageRating}</p>
                <p className="text-sm text-gray-600">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{reviewAnalytics?.totalReviews}</p>
                <p className="text-sm text-gray-600">Total Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Award className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{reviewAnalytics?.completedReviews}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Target className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{reviewAnalytics?.pendingReviews}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="reviews">Performance Reviews</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="development">Development Plans</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Performance Reviews
              </CardTitle>
              <CardDescription>
                Manage employee performance reviews with AI-powered insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {performanceReviews?.map((review: any) => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold">{review.employee_name || `Employee ${review.employee_id}`}</h3>
                        <p className="text-sm text-gray-600">
                          Review Period: {review.review_period} • Reviewer: {review.reviewer_name || `Reviewer ${review.reviewer_id}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Overall</p>
                        <p className={`text-xl font-bold ${getRatingColor(review.overall_rating)}`}>
                          {review.overall_rating}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Technical</p>
                        <p className={`font-semibold ${getRatingColor(review.technical_skills)}`}>
                          {review.technical_skills}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Communication</p>
                        <p className={`font-semibold ${getRatingColor(review.communication)}`}>
                          {review.communication}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Leadership</p>
                        <p className={`font-semibold ${getRatingColor(review.leadership)}`}>
                          {review.leadership}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Teamwork</p>
                        <p className={`font-semibold ${getRatingColor(review.teamwork)}`}>
                          {review.teamwork}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Innovation</p>
                        <p className={`font-semibold ${getRatingColor(review.innovation)}`}>
                          {review.innovation}
                        </p>
                      </div>
                    </div>
                    
                    {review.ai_generated_insights && (
                      <div className="bg-blue-50 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Brain className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">AI Insights</span>
                        </div>
                        <p className="text-sm text-blue-700">
                          {typeof review.ai_generated_insights === 'string' 
                            ? JSON.parse(review.ai_generated_insights).recommendation
                            : 'AI analysis pending'
                          }
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Skill Assessment Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={reviewAnalytics?.skillBreakdown}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="skill" />
                    <YAxis domain={[0, 5]} />
                    <Tooltip />
                    <Bar dataKey="average" fill="#8884d8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Excellent (4.5-5.0)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm">25%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Good (3.5-4.4)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                      </div>
                      <span className="text-sm">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Needs Improvement (2.5-3.4)</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                      </div>
                      <span className="text-sm">15%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="development">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Development Plans
              </CardTitle>
              <CardDescription>
                AI-generated development recommendations and tracking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Technical Skills Enhancement</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    Recommended for employees with technical scores below 4.0
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">React Advanced</Badge>
                    <Badge variant="outline">System Design</Badge>
                    <Badge variant="outline">Database Optimization</Badge>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Leadership Development</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    For employees showing leadership potential
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">Management Training</Badge>
                    <Badge variant="outline">Conflict Resolution</Badge>
                    <Badge variant="outline">Strategic Planning</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Review Dialog */}
      <Dialog open={showCreateReview} onOpenChange={setShowCreateReview}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Performance Review</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateReview} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">Employee ID</Label>
                <Input
                  id="employee_id"
                  name="employee_id"
                  placeholder="emp001"
                  required
                />
              </div>
              <div>
                <Label htmlFor="review_period">Review Period</Label>
                <Input
                  id="review_period"
                  name="review_period"
                  placeholder="2024-Q2"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="font-semibold">Skill Assessment (1-5 scale)</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="technical_skills">Technical Skills</Label>
                  <Select name="technical_skills" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="communication">Communication</Label>
                  <Select name="communication" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="leadership">Leadership</Label>
                  <Select name="leadership" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="problem_solving">Problem Solving</Label>
                  <Select name="problem_solving" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="teamwork">Teamwork</Label>
                  <Select name="teamwork" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="innovation">Innovation</Label>
                  <Select name="innovation" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Needs Improvement</SelectItem>
                      <SelectItem value="2">2 - Below Average</SelectItem>
                      <SelectItem value="3">3 - Average</SelectItem>
                      <SelectItem value="4">4 - Good</SelectItem>
                      <SelectItem value="5">5 - Excellent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="achievements">Key Achievements</Label>
              <Textarea
                id="achievements"
                name="achievements"
                placeholder="List key achievements during this period..."
              />
            </div>

            <div>
              <Label htmlFor="development_goals">Development Goals</Label>
              <Textarea
                id="development_goals"
                name="development_goals"
                placeholder="Outline development goals for next period..."
              />
            </div>

            <div>
              <Label htmlFor="comments">Additional Comments</Label>
              <Textarea
                id="comments"
                name="comments"
                placeholder="Additional feedback and observations..."
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowCreateReview(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Create Review
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
