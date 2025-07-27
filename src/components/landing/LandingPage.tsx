import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Shield, 
  Briefcase, 
  GraduationCap, 
  Star, 
  ArrowRight,
  CheckCircle,
  BarChart3,
  Globe,
  Award,
  Clock,
  Zap
} from 'lucide-react';

interface LandingPageProps {
  onSignInClick: () => void;
}

export const LandingPage = ({ onSignInClick }: LandingPageProps) => {
  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student tracking and enrollment management",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: BookOpen,
      title: "Education Programs",
      description: "Manage courses, curricula, and academic progress",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Briefcase,
      title: "Career Services",
      description: "Job placement tracking and career counseling",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: TrendingUp,
      title: "Analytics Dashboard",
      description: "Real-time insights and performance metrics",
      color: "from-orange-500 to-yellow-500"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Secure multi-level permission management",
      color: "from-red-500 to-rose-500"
    },
    {
      icon: GraduationCap,
      title: "Skill Development",
      description: "Training programs and certification tracking",
      color: "from-indigo-500 to-blue-500"
    }
  ];

  const stats = [
    { label: "Active Students", value: "10,000+", icon: Users },
    { label: "Success Rate", value: "95%", icon: TrendingUp },
    { label: "Programs", value: "150+", icon: BookOpen },
    { label: "Partners", value: "50+", icon: Globe }
  ];

  const benefits = [
    "Streamlined administrative processes",
    "Real-time data analytics and reporting", 
    "Automated workflow management",
    "Secure cloud-based infrastructure",
    "Mobile-responsive design",
    "24/7 technical support"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-8 -left-8 w-96 h-96 bg-gradient-to-tr from-cyan-400/20 to-blue-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-400/10 to-pink-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 p-6">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">YouthNet</h1>
              <p className="text-xs text-gray-600">MIS Platform</p>
            </div>
          </div>
          <Button 
            onClick={onSignInClick}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge 
            variant="secondary" 
            className="mb-6 px-4 py-2 bg-blue-100 text-blue-800 border border-blue-200 rounded-full"
          >
            <Star className="h-3 w-3 mr-1" />
            Advanced Management Platform
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              YouthNet MIS
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Comprehensive Management Information System designed for youth development, 
            education programs, and career advancement initiatives.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              onClick={onSignInClick}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
            >
              <Zap className="mr-2 h-5 w-5" />
              Get Started Now
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-gray-300 hover:border-blue-400 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 hover:bg-blue-50"
            >
              Learn More
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-20 bg-white/40 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                Modern Management
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage youth development programs, track progress, and drive success.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="mt-4 flex items-center text-blue-600 group-hover:text-purple-600 transition-colors duration-300">
                    <span className="text-sm font-semibold">Learn more</span>
                    <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent block">
                  YouthNet MIS?
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Built specifically for youth development organizations, our platform combines 
                powerful features with intuitive design.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="bg-gradient-to-br from-blue-600 to-purple-600 border-0 shadow-2xl">
                <CardContent className="p-8 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold">Platform Overview</h3>
                    <BarChart3 className="h-8 w-8" />
                  </div>
                  
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span>System Efficiency</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-white/20 rounded-full">
                          <div className="w-[90%] h-full bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">90%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>User Satisfaction</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-white/20 rounded-full">
                          <div className="w-[95%] h-full bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">95%</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span>Uptime</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 h-2 bg-white/20 rounded-full">
                          <div className="w-[99%] h-full bg-white rounded-full"></div>
                        </div>
                        <span className="text-sm font-semibold">99.9%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5" />
                      <span className="text-sm">Real-time Updates</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5" />
                      <span className="text-sm">Industry Leading</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of organizations already using YouthNet MIS to drive success.
          </p>
          <Button 
            onClick={onSignInClick}
            size="lg"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 text-lg font-semibold"
          >
            <Zap className="mr-2 h-5 w-5" />
            Start Your Journey
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-12 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold">YouthNet MIS</span>
          </div>
          <p className="text-gray-400 mb-4">
            Empowering youth development through innovative technology solutions.
          </p>
          <p className="text-sm text-gray-500">
            © 2024 YouthNet. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};