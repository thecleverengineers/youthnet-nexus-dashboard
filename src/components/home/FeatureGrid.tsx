
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock, 
  Globe,
  BookOpen,
  Briefcase
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const features = [
  {
    icon: Users,
    title: 'Student Management',
    description: 'Comprehensive student lifecycle management with advanced analytics and reporting capabilities.'
  },
  {
    icon: BookOpen,
    title: 'Training Programs',
    description: 'Streamlined training management with certification tracking and skill assessment tools.'
  },
  {
    icon: Briefcase,
    title: 'Career Services',
    description: 'Complete career center with job placements, counseling, and mentorship programs.'
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Real-time insights and comprehensive reporting across all organizational metrics.'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Bank-level security with role-based access control and data encryption.'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Optimized performance with sub-second response times and 99.9% uptime.'
  },
  {
    icon: Clock,
    title: '24/7 Operations',
    description: 'Round-the-clock system availability with automated monitoring and alerts.'
  },
  {
    icon: Globe,
    title: 'Global Scale',
    description: 'Multi-location support with centralized management and local customization.'
  }
];

export const FeatureGrid = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
            Everything You Need
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Powerful features designed to streamline your operations and enhance productivity across all departments.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="h-full border-0 bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
