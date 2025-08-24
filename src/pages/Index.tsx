import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowRight, Users, Target, Award, Globe, GraduationCap, Trees, Lightbulb, Briefcase } from 'lucide-react';

const Index = () => {
  const programCategories = [
    {
      title: 'Education',
      icon: GraduationCap,
      color: 'blue',
      programs: [
        'NECTAR Lighthouse',
        'CareerAware & CareerReady',
        'LaunchPad'
      ]
    },
    {
      title: 'Environment',
      icon: Trees,
      color: 'green',
      programs: [
        'Nagaland Forest Management Project',
        'Mobius Young Climate Leaders'
      ]
    },
    {
      title: 'Entrepreneurship',
      icon: Lightbulb,
      color: 'purple',
      programs: [
        'YouthNet Incubation Centre',
        'Made in Nagaland Centre',
        'Livelihood Business Incubation',
        'Entrepreneurship Development Centre'
      ]
    },
    {
      title: 'Employment & Livelihood',
      icon: Briefcase,
      color: 'orange',
      programs: [
        'YouthNet Job Centre',
        'Career Development Centre',
        'Skill Development Centre',
        'Livelihood Programs'
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'bg-blue-500/10 text-blue-600 border-blue-200',
      green: 'bg-green-500/10 text-green-600 border-green-200',
      purple: 'bg-purple-500/10 text-purple-600 border-purple-200',
      orange: 'bg-orange-500/10 text-orange-600 border-orange-200'
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-foreground mb-6">
              Welcome to YouthNet
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Empowering Nagaland's youth through integrated education, skill development, and employment opportunities
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button size="lg" variant="outline">
                  Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-foreground mb-12">Our Programs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {programCategories.map((category, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className={`inline-flex p-3 rounded-lg mb-4 ${getColorClasses(category.color)}`}>
                  <category.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{category.title}</h3>
                <ul className="space-y-2">
                  {category.programs.map((program, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      <span>{program}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: Users, value: "10,000+", label: "Active Students" },
              { icon: Target, value: "500+", label: "Training Programs" },
              { icon: Award, value: "95%", label: "Placement Rate" },
              { icon: Globe, value: "50+", label: "Partner Organizations" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-muted-foreground mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export { Index };
export default Index;