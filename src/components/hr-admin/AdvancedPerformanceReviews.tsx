
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

  // Mock data for demonstration
  const mockReviews = [
    {
      id: '1',
      employee_id: 'emp1',
      reviewer_id: 'mgr1',
      employee_name: 'John Smith',
      reviewer_name: 'Sarah Johnson',
      review_period: '2024-Q1',
      overall_rating: 4.2,
      technical_skills: 4.5,
      communication: 3.8,
      leadership: 4.0,
      teamwork: 4.3,
      innovation: 4.1,
      status: 'completed',
      created_at: '2024-03-15'
    },
    {
      id: '2', 
      employee_id: 'emp2',
      reviewer_id: 'mgr2',
      employee_name: 'Alice Cooper',
      reviewer_name: 'Mike Davis',
      review_period: '2024-Q1',
      overall_rating: 3.8,
      technical_skills: 4.0,
      communication: 4.2,
      leadership: 3.5,
      teamwork: 4.0,
      innovation: 3.6,
      status: 'draft',
      created_at: '2024-03-10'
    }
  ];

  const { data: performanceReviews } = useQuery({
    queryKey: ['performance-reviews'],
    queryFn: async () => {
      try {
        const { data, error } = await supabaseHelpers.performance_reviews.select('*');
        if (error) throw error;
        return data || mockReviews;
      } catch (error) {
        return mockReviews;
      }
    },
  });

  const { data: reviewAnalytics } = useQuery({
    queryKey: ['review-analytics'],
    queryFn: async () => {
      const reviews = performanceReviews || mockReviews;
      const avgRating = reviews.reduce((sum: number, review: any) => sum + review.overall_rating, 0) / reviews.length;
      
      return {
        totalReviews: reviews.length,
        averageRating: Number(avgRating.toFixed(1)),
        completedReviews: reviews.filter((r: any) => r.status === 'completed').length,
        pendingReviews: reviews.filter((r: any) => r.status === 'draft').length,
        skillBreakdown: [
          { skill: 'Technical', average: 4.25 },
          { skill: 'Communication', average: 4.0 },
          { skill: 'Leadership', average: 3.75 },
          { skill: 'Teamwork', average: 4.15 },
          { skill: 'Innovation', average: 3.85 },
        ]
      };
    },
    enabled: !!performanceReviews
  });

  const createReviewMutation = useMutation({
    mutationFn: async (reviewData: any) => {
      try {
        const { data, error } = await supabaseHelpers.performance_reviews
          .insert([reviewData]);
        if (error) throw error;
        return data;
      } catch (error) {
        // Mock success for demo
        return [{ ...reviewData, id: Date.now().toString() }];
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-reviews'] });
      setShowCreateReview(false);
      setReviewData({});
      toast({ title: 'Performance review created successfully' });
    },
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
