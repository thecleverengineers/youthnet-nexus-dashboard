import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Trees, Mountain, Leaf, CloudRain } from 'lucide-react';

export const Environment = () => {
  const programs = [
    {
      id: 'nfmp',
      title: 'Nagaland Forest Management Project (NFMP)',
      description: 'Sustainable forest management and conservation initiatives for ecological balance',
      icon: Trees,
      features: [
        'Forest conservation and restoration',
        'Community-based forest management',
        'Biodiversity protection programs',
        'Sustainable resource utilization'
      ],
      stats: {
        'Forest Area Covered': '12,500 hectares',
        'Communities Involved': '45',
        'Trees Planted': '2.5M+',
        'Carbon Offset': '15,000 tons/year'
      }
    },
    {
      id: 'mobius',
      title: 'Mobius Young Climate Leaders for Himalayan Development',
      description: 'Empowering youth to lead climate action and sustainable development in the Himalayan region',
      icon: Mountain,
      features: [
        'Youth climate leadership training',
        'Himalayan ecosystem preservation',
        'Climate adaptation strategies',
        'Green technology innovation'
      ],
      stats: {
        'Youth Leaders Trained': '250+',
        'Projects Initiated': '35',
        'Villages Impacted': '20',
        'Awareness Campaigns': '100+'
      }
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">Environment Programs</h1>
        <p className="text-muted-foreground mt-2">
          Protecting nature and building climate resilience for future generations
        </p>
      </div>

      <Tabs defaultValue="nfmp" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="nfmp">NFMP</TabsTrigger>
          <TabsTrigger value="mobius">Mobius Climate Leaders</TabsTrigger>
        </TabsList>

        {programs.map((program) => (
          <TabsContent key={program.id} value={program.id}>
            <div className="space-y-6">
              {/* Program Overview */}
              <Card className="p-6">
                <div className="flex items-start space-x-4 mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <program.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{program.title}</h2>
                    <p className="text-muted-foreground">{program.description}</p>
                  </div>
                </div>

                {/* Key Features */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Key Features</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {program.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Leaf className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Object.entries(program.stats).map(([key, value]) => (
                  <Card key={key} className="p-4">
                    <div className="text-2xl font-bold text-primary">{value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{key}</div>
                  </Card>
                ))}
              </div>

              {/* Action Areas */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Current Initiatives</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 dark:bg-green-950/20 rounded-lg">
                    <CloudRain className="h-5 w-5 text-green-600 mb-2" />
                    <h4 className="font-medium mb-1">Climate Monitoring</h4>
                    <p className="text-sm text-muted-foreground">
                      Real-time environmental data collection and analysis
                    </p>
                  </div>
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                    <Trees className="h-5 w-5 text-blue-600 mb-2" />
                    <h4 className="font-medium mb-1">Reforestation</h4>
                    <p className="text-sm text-muted-foreground">
                      Large-scale tree planting and habitat restoration
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                    <Mountain className="h-5 w-5 text-purple-600 mb-2" />
                    <h4 className="font-medium mb-1">Sustainable Practices</h4>
                    <p className="text-sm text-muted-foreground">
                      Promoting eco-friendly livelihoods and green economy
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};