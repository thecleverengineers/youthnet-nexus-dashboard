
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Brain, 
  Zap, 
  Shield, 
  Crown, 
  Sparkles, 
  Bot, 
  Activity, 
  Settings, 
  Users, 
  Calendar, 
  Clock, 
  Eye, 
  EyeOff, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Wifi, 
  Bluetooth, 
  Radio, 
  Satellite, 
  Atom, 
  Network, 
  AlertTriangle, 
  CheckCircle, 
  Star, 
  Filter, 
  Target, 
  Layers,
  Globe,
  Cpu,
  Database,
  Lock,
  Key
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';

interface NotificationChannel {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'neural' | 'quantum';
  enabled: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  frequency: 'instant' | 'batched' | 'daily' | 'weekly';
  aiFiltered: boolean;
  quantumEncrypted: boolean;
}

interface NotificationRule {
  id: string;
  name: string;
  condition: string;
  action: string;
  enabled: boolean;
  aiEnhanced: boolean;
  priority: 'low' | 'medium' | 'high' | 'critical';
  channels: string[];
}

interface AINotificationSettings {
  smartFiltering: boolean;
  priorityLearning: boolean;
  contextAwareness: boolean;
  sentimentAnalysis: boolean;
  predictiveAlerts: boolean;
  behaviorPatterns: boolean;
  neuralProcessing: boolean;
  quantumDelivery: boolean;
}

export const NotificationSettings = () => {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [rules, setRules] = useState<NotificationRule[]>([]);
  const [aiSettings, setAiSettings] = useState<AINotificationSettings>({
    smartFiltering: true,
    priorityLearning: true,
    contextAwareness: true,
    sentimentAnalysis: false,
    predictiveAlerts: true,
    behaviorPatterns: false,
    neuralProcessing: false,
    quantumDelivery: false
  });
  
  const [globalSettings, setGlobalSettings] = useState({
    enabled: true,
    quietHours: false,
    quietStart: '22:00',
    quietEnd: '08:00',
    doNotDisturb: false,
    emergencyOverride: true,
    aiAssistant: true,
    quantumMode: false,
    neuralSync: false
  });

  const isSuperAdmin = profile?.role === 'super_admin';

  useEffect(() => {
    initializeNotificationSystem();
    loadNotificationChannels();
    loadNotificationRules();
  }, []);

  const initializeNotificationSystem = () => {
    toast.info('🚀 Neural Notification System Initializing...');
    setTimeout(() => {
      toast.success('🧠 AI Notification Engine Online');
    }, 2000);
    setTimeout(() => {
      toast.success('⚛️ Quantum Communication Channels Active');
    }, 4000);
  };

  const loadNotificationChannels = () => {
    const mockChannels: NotificationChannel[] = [
      {
        id: '1',
        name: 'Neural Email Alerts',
        type: 'email',
        enabled: true,
        priority: 'high',
        frequency: 'instant',
        aiFiltered: true,
        quantumEncrypted: true
      },
      {
        id: '2',
        name: 'Quantum SMS Gateway',
        type: 'sms',
        enabled: true,
        priority: 'critical',
        frequency: 'instant',
        aiFiltered: true,
        quantumEncrypted: true
      },
      {
        id: '3',
        name: 'Neural Push Notifications',
        type: 'push',
        enabled: true,
        priority: 'medium',
        frequency: 'batched',
        aiFiltered: true,
        quantumEncrypted: false
      },
      {
        id: '4',
        name: 'Direct Neural Interface',
        type: 'neural',
        enabled: false,
        priority: 'critical',
        frequency: 'instant',
        aiFiltered: true,
        quantumEncrypted: true
      },
      {
        id: '5',
        name: 'Quantum Entanglement Channel',
        type: 'quantum',
        enabled: false,
        priority: 'critical',
        frequency: 'instant',
        aiFiltered: false,
        quantumEncrypted: true
      }
    ];
    
    setChannels(mockChannels);
  };

  const loadNotificationRules = () => {
    const mockRules: NotificationRule[] = [
      {
        id: '1',
        name: 'Critical System Alerts',
        condition: 'System health < 95%',
        action: 'Immediate notification to all channels',
        enabled: true,
        aiEnhanced: true,
        priority: 'critical',
        channels: ['1', '2', '4']
      },
      {
        id: '2',
        name: 'Security Threats',
        condition: 'AI detects anomalous behavior',
        action: 'Priority alert with threat analysis',
        enabled: true,
        aiEnhanced: true,
        priority: 'high',
        channels: ['1', '2', '3']
      },
      {
        id: '3',
        name: 'User Activity Patterns',
        condition: 'Unusual user login detected',
        action: 'Security notification with context',
        enabled: true,
        aiEnhanced: true,
        priority: 'medium',
        channels: ['1', '3']
      },
      {
        id: '4',
        name: 'AI Model Updates',
        condition: 'Neural network training complete',
        action: 'Performance summary notification',
        enabled: false,
        aiEnhanced: true,
        priority: 'low',
        channels: ['1']
      }
    ];
    
    setRules(mockRules);
  };

  const toggleChannel = (channelId: string) => {
    setChannels(prev => prev.map(channel => 
      channel.id === channelId 
        ? { ...channel, enabled: !channel.enabled }
        : channel
    ));
    
    const channel = channels.find(c => c.id === channelId);
    if (channel) {
      toast.success(
        `${channel.name} ${channel.enabled ? 'disabled' : 'enabled'}`
      );
    }
  };

  const toggleRule = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { ...rule, enabled: !rule.enabled }
        : rule
    ));
    
    const rule = rules.find(r => r.id === ruleId);
    if (rule) {
      toast.success(
        `${rule.name} ${rule.enabled ? 'disabled' : 'enabled'}`
      );
    }
  };

  const testNotification = async (channelId: string) => {
    setLoading(true);
    const channel = channels.find(c => c.id === channelId);
    
    if (channel) {
      toast.info(`🧪 Testing ${channel.name}...`);
      
      // Simulate different test scenarios based on channel type
      const testMessages = {
        email: '📧 Neural email test successful - Quantum encryption verified',
        sms: '📱 Quantum SMS delivered - Neural pathways clear',
        push: '🔔 Push notification test complete - AI filtering active',
        neural: '🧠 Direct neural interface test - Consciousness link established',
        quantum: '⚛️ Quantum entanglement test - Parallel universe sync confirmed'
      };
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success(testMessages[channel.type]);
    }
    
    setLoading(false);
  };

  const optimizeWithAI = async () => {
    setLoading(true);
    toast.info('🤖 AI Optimization Engine Analyzing Notification Patterns...');
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate AI optimization
    setAiSettings({
      ...aiSettings,
      smartFiltering: true,
      priorityLearning: true,
      contextAwareness: true,
      predictiveAlerts: true
    });
    
    setLoading(false);
    toast.success('✨ AI has optimized your notification settings for maximum efficiency');
  };

  const getChannelIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="h-5 w-5 text-blue-400" />;
      case 'sms': return <MessageSquare className="h-5 w-5 text-green-400" />;
      case 'push': return <Smartphone className="h-5 w-5 text-purple-400" />;
      case 'neural': return <Brain className="h-5 w-5 text-pink-400" />;
      case 'quantum': return <Atom className="h-5 w-5 text-cyan-400" />;
      default: return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500/50 bg-red-500/10 text-red-400';
      case 'high': return 'border-orange-500/50 bg-orange-500/10 text-orange-400';
      case 'medium': return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-400';
      case 'low': return 'border-blue-500/50 bg-blue-500/10 text-blue-400';
      default: return 'border-gray-500/50 bg-gray-500/10 text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Neural Notification Control Center */}
      <Card className="futuristic-card bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10 border-green-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-3 rounded-full bg-gradient-to-r from-green-500 to-blue-600 shadow-lg shadow-green-500/50">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <CardTitle className="text-gradient flex items-center gap-2 text-2xl">
                  <Crown className="h-6 w-6 text-yellow-400" />
                  Neural Notification Command Center
                  <Sparkles className="h-5 w-5 text-cyan-400 animate-pulse" />
                </CardTitle>
                <CardDescription className="text-green-300">
                  AI-Powered Alerts • Quantum Communication • Neural Interface
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={optimizeWithAI}
                disabled={loading}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500"
              >
                <Brain className="h-4 w-4 mr-2" />
                AI Optimize
              </Button>
              <Button 
                variant="outline"
                className={`${globalSettings.enabled ? 'bg-green-500/20 border-green-500/50' : 'bg-red-500/20 border-red-500/50'}`}
                onClick={() => setGlobalSettings({...globalSettings, enabled: !globalSettings.enabled})}
              >
                {globalSettings.enabled ? <Bell className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                {globalSettings.enabled ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Global Notification Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="futuristic-card hover-glow border-green-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-300">Active Channels</p>
                <p className="text-2xl font-bold text-green-400">
                  {channels.filter(c => c.enabled).length}
                </p>
                <p className="text-xs text-green-300">Neural sync active</p>
              </div>
              <Network className="h-8 w-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow border-blue-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-300">AI Rules</p>
                <p className="text-2xl font-bold text-blue-400">
                  {rules.filter(r => r.enabled && r.aiEnhanced).length}
                </p>
                <p className="text-xs text-blue-300">Learning patterns</p>
              </div>
              <Brain className="h-8 w-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-300">Quantum Secure</p>
                <p className="text-2xl font-bold text-purple-400">
                  {channels.filter(c => c.quantumEncrypted).length}
                </p>
                <p className="text-xs text-purple-300">Encrypted channels</p>
              </div>
              <Lock className="h-8 w-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="futuristic-card hover-glow border-cyan-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-cyan-300">System Health</p>
                <p className="text-2xl font-bold text-cyan-400">99.9%</p>
                <p className="text-xs text-cyan-300">Neural pathways</p>
              </div>
              <Activity className="h-8 w-8 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="channels" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Neural Channels
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            AI Rules
          </TabsTrigger>
          <TabsTrigger value="ai" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Settings
          </TabsTrigger>
          <TabsTrigger value="global" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Global Config
          </TabsTrigger>
        </TabsList>

        {/* Notification Channels */}
        <TabsContent value="channels" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="h-5 w-5 text-blue-400" />
                Communication Channels Matrix
              </CardTitle>
              <CardDescription>
                Configure neural and quantum communication pathways
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50 hover:border-blue-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                            {getChannelIcon(channel.type)}
                          </div>
                          {channel.enabled && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white text-lg">{channel.name}</h3>
                            <Badge className={getPriorityColor(channel.priority)}>
                              {channel.priority.toUpperCase()}
                            </Badge>
                            {channel.aiFiltered && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Filtered
                              </Badge>
                            )}
                            {channel.quantumEncrypted && (
                              <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
                                <Atom className="h-3 w-3 mr-1" />
                                Quantum
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Type:</span>
                              <p className="text-cyan-300 capitalize">{channel.type}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Frequency:</span>
                              <p className="text-green-300 capitalize">{channel.frequency}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Status:</span>
                              <p className={channel.enabled ? 'text-green-300' : 'text-red-300'}>
                                {channel.enabled ? 'Active' : 'Inactive'}
                              </p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Security:</span>
                              <p className={channel.quantumEncrypted ? 'text-purple-300' : 'text-yellow-300'}>
                                {channel.quantumEncrypted ? 'Quantum' : 'Standard'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={channel.enabled}
                          onCheckedChange={() => toggleChannel(channel.id)}
                        />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => testNotification(channel.id)}
                          disabled={loading || !channel.enabled}
                          className="hover:bg-blue-500/20 border-blue-500/30"
                        >
                          <Zap className="h-3 w-3 mr-1" />
                          Test
                        </Button>
                        <Button variant="outline" size="sm" className="hover:bg-green-500/20 border-green-500/30">
                          <Settings className="h-3 w-3 mr-1" />
                          Configure
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Rules */}
        <TabsContent value="rules" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-purple-400" />
                AI Notification Rules Engine
              </CardTitle>
              <CardDescription>
                Smart rules powered by machine learning and neural networks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rules.map((rule) => (
                  <div key={rule.id} className="p-6 rounded-lg bg-gradient-to-r from-gray-800/50 to-gray-700/30 border border-gray-700/50 hover:border-purple-500/50 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-600 shadow-lg">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          {rule.aiEnhanced && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-white text-lg">{rule.name}</h3>
                            <Badge className={getPriorityColor(rule.priority)}>
                              {rule.priority.toUpperCase()}
                            </Badge>
                            {rule.aiEnhanced && (
                              <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Enhanced
                              </Badge>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Condition:</span>
                              <p className="text-cyan-300">{rule.condition}</p>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Action:</span>
                              <p className="text-green-300">{rule.action}</p>
                            </div>
                          </div>
                          
                          <div className="mt-3 flex flex-wrap gap-2">
                            <span className="text-xs text-muted-foreground">Active Channels:</span>
                            {rule.channels.map(channelId => {
                              const channel = channels.find(c => c.id === channelId);
                              return channel ? (
                                <Badge key={channelId} variant="outline" className="text-xs">
                                  {channel.name}
                                </Badge>
                              ) : null;
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onCheckedChange={() => toggleRule(rule.id)}
                        />
                        <Button variant="outline" size="sm" className="hover:bg-purple-500/20 border-purple-500/30">
                          <Settings className="h-3 w-3 mr-1" />
                          Edit Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button className="bg-gradient-to-r from-purple-500 to-pink-600">
                  <Star className="h-4 w-4 mr-2" />
                  Create AI Rule
                </Button>
                <Button variant="outline" className="border-blue-500/30 hover:bg-blue-500/20">
                  <Brain className="h-4 w-4 mr-2" />
                  AI Suggestions
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings */}
        <TabsContent value="ai" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-400" />
                AI Notification Intelligence
              </CardTitle>
              <CardDescription>
                Configure artificial intelligence features for smart notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                    <div className="flex items-center gap-3">
                      <Filter className="h-5 w-5 text-blue-400" />
                      <div>
                        <p className="font-medium text-white">Smart Filtering</p>
                        <p className="text-sm text-blue-300">AI learns your preferences</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.smartFiltering}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, smartFiltering: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
                    <div className="flex items-center gap-3">
                      <Target className="h-5 w-5 text-purple-400" />
                      <div>
                        <p className="font-medium text-white">Priority Learning</p>
                        <p className="text-sm text-purple-300">Adapts to your behavior</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.priorityLearning}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, priorityLearning: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                    <div className="flex items-center gap-3">
                      <Eye className="h-5 w-5 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Context Awareness</p>
                        <p className="text-sm text-green-300">Understands your situation</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.contextAwareness}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, contextAwareness: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-pink-500/30 bg-pink-500/10">
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-pink-400" />
                      <div>
                        <p className="font-medium text-white">Sentiment Analysis</p>
                        <p className="text-sm text-pink-300">Analyzes emotional context</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.sentimentAnalysis}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, sentimentAnalysis: checked})
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg border border-yellow-500/30 bg-yellow-500/10">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-yellow-400" />
                      <div>
                        <p className="font-medium text-white">Predictive Alerts</p>
                        <p className="text-sm text-yellow-300">Anticipates your needs</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.predictiveAlerts}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, predictiveAlerts: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-cyan-400" />
                      <div>
                        <p className="font-medium text-white">Behavior Patterns</p>
                        <p className="text-sm text-cyan-300">Learns from usage patterns</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.behaviorPatterns}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, behaviorPatterns: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-orange-500/30 bg-orange-500/10">
                    <div className="flex items-center gap-3">
                      <Cpu className="h-5 w-5 text-orange-400" />
                      <div>
                        <p className="font-medium text-white">Neural Processing</p>
                        <p className="text-sm text-orange-300">Advanced AI processing</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.neuralProcessing}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, neuralProcessing: checked})
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                    <div className="flex items-center gap-3">
                      <Atom className="h-5 w-5 text-red-400" />
                      <div>
                        <p className="font-medium text-white">Quantum Delivery</p>
                        <p className="text-sm text-red-300">Instantaneous notification</p>
                      </div>
                    </div>
                    <Switch
                      checked={aiSettings.quantumDelivery}
                      onCheckedChange={(checked) => 
                        setAiSettings({...aiSettings, quantumDelivery: checked})
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Global Settings */}
        <TabsContent value="global" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-green-400" />
                Global Notification Configuration
              </CardTitle>
              <CardDescription>
                System-wide notification preferences and quantum settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-green-300">Master Notification Control</Label>
                    <div className="flex items-center justify-between p-4 rounded-lg border border-green-500/30 bg-green-500/10">
                      <div className="flex items-center gap-3">
                        <Bell className="h-5 w-5 text-green-400" />
                        <div>
                          <p className="font-medium text-white">Global Notifications</p>
                          <p className="text-sm text-green-300">Master switch for all alerts</p>
                        </div>
                      </div>
                      <Switch
                        checked={globalSettings.enabled}
                        onCheckedChange={(checked) => 
                          setGlobalSettings({...globalSettings, enabled: checked})
                        }
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-blue-300">Quiet Hours Configuration</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-blue-500/30 bg-blue-500/10">
                        <div className="flex items-center gap-3">
                          <Clock className="h-5 w-5 text-blue-400" />
                          <div>
                            <p className="font-medium text-white">Quiet Hours</p>
                            <p className="text-sm text-blue-300">Reduce notifications during sleep</p>
                          </div>
                        </div>
                        <Switch
                          checked={globalSettings.quietHours}
                          onCheckedChange={(checked) => 
                            setGlobalSettings({...globalSettings, quietHours: checked})
                          }
                        />
                      </div>
                      
                      {globalSettings.quietHours && (
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quiet-start" className="text-blue-300">Start Time</Label>
                            <Input
                              id="quiet-start"
                              type="time"
                              value={globalSettings.quietStart}
                              onChange={(e) => setGlobalSettings({...globalSettings, quietStart: e.target.value})}
                              className="border-blue-500/30"
                            />
                          </div>
                          <div>
                            <Label htmlFor="quiet-end" className="text-blue-300">End Time</Label>
                            <Input
                              id="quiet-end"
                              type="time"
                              value={globalSettings.quietEnd}
                              onChange={(e) => setGlobalSettings({...globalSettings, quietEnd: e.target.value})}
                              className="border-blue-500/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label className="text-purple-300">Advanced Features</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-red-500/30 bg-red-500/10">
                        <div className="flex items-center gap-3">
                          <VolumeX className="h-5 w-5 text-red-400" />
                          <div>
                            <p className="font-medium text-white">Do Not Disturb</p>
                            <p className="text-sm text-red-300">Block all non-critical alerts</p>
                          </div>
                        </div>
                        <Switch
                          checked={globalSettings.doNotDisturb}
                          onCheckedChange={(checked) => 
                            setGlobalSettings({...globalSettings, doNotDisturb: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-orange-500/30 bg-orange-500/10">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-5 w-5 text-orange-400" />
                          <div>
                            <p className="font-medium text-white">Emergency Override</p>
                            <p className="text-sm text-orange-300">Critical alerts bypass DND</p>
                          </div>
                        </div>
                        <Switch
                          checked={globalSettings.emergencyOverride}
                          onCheckedChange={(checked) => 
                            setGlobalSettings({...globalSettings, emergencyOverride: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-cyan-300">Experimental Features</Label>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-4 rounded-lg border border-cyan-500/30 bg-cyan-500/10">
                        <div className="flex items-center gap-3">
                          <Brain className="h-5 w-5 text-cyan-400" />
                          <div>
                            <p className="font-medium text-white">Neural Sync</p>
                            <p className="text-sm text-cyan-300">Direct brain interface</p>
                          </div>
                        </div>
                        <Switch
                          checked={globalSettings.neuralSync}
                          onCheckedChange={(checked) => 
                            setGlobalSettings({...globalSettings, neuralSync: checked})
                          }
                        />
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg border border-purple-500/30 bg-purple-500/10">
                        <div className="flex items-center gap-3">
                          <Atom className="h-5 w-5 text-purple-400" />
                          <div>
                            <p className="font-medium text-white">Quantum Mode</p>
                            <p className="text-sm text-purple-300">Parallel universe alerts</p>
                          </div>
                        </div>
                        <Switch
                          checked={globalSettings.quantumMode}
                          onCheckedChange={(checked) => 
                            setGlobalSettings({...globalSettings, quantumMode: checked})
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button className="bg-gradient-to-r from-green-500 to-blue-600">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Save Configuration
                </Button>
                <Button variant="outline" className="border-purple-500/30 hover:bg-purple-500/20">
                  <Settings className="h-4 w-4 mr-2" />
                  Advanced Settings
                </Button>
                <Button variant="outline" className="border-cyan-500/30 hover:bg-cyan-500/20">
                  <Atom className="h-4 w-4 mr-2" />
                  Quantum Calibration
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
