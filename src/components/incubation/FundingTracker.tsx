
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Eye, 
  Edit,
  Calendar,
  Target,
  Building2,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

export const FundingTracker = () => {
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const [newFunding, setNewFunding] = useState({
    startupName: '',
    amount: '',
    stage: 'seed',
    investor: '',
    status: 'applied',
    applicationDate: '',
  });

  const [fundingApplications] = useState([
    {
      id: 1,
      startupName: 'TechNova Solutions',
      founderName: 'Raj Kumar',
      amount: '₹50,00,000',
      stage: 'Seed',
      investor: 'Angel Network India',
      status: 'approved',
      applicationDate: '2024-01-05',
      approvalDate: '2024-01-20',
      disbursedAmount: '₹50,00,000',
      progress: 100,
      equity: '12%'
    },
    {
      id: 2,
      startupName: 'GreenEnergy Innovations',
      founderName: 'Priya Sharma',
      amount: '₹1,20,00,000',
      stage: 'Series A',
      investor: 'Venture Capital Fund',
      status: 'under_review',
      applicationDate: '2024-01-10',
      approvalDate: null,
      disbursedAmount: '₹0',
      progress: 60,
      equity: '20%'
    },
    {
      id: 3,
      startupName: 'HealthTech Pro',
      founderName: 'Dr. Amit Singh',
      amount: '₹75,00,000',
      stage: 'Pre-Series A',
      investor: 'Healthcare Ventures',
      status: 'pending_documentation',
      applicationDate: '2023-12-15',
      approvalDate: '2024-01-08',
      disbursedAmount: '₹25,00,000',
      progress: 33,
      equity: '15%'
    },
    {
      id: 4,
      startupName: 'FinTech Revolution',
      founderName: 'Sarah Patel',
      amount: '₹2,00,00,000',
      stage: 'Series B',
      investor: 'Banking Innovation Fund',
      status: 'rejected',
      applicationDate: '2023-11-20',
      approvalDate: null,
      disbursedAmount: '₹0',
      progress: 0,
      equity: '25%'
    }
  ]);

  const [fundingStats] = useState({
    totalApplications: 24,
    approvedFunding: '₹15.2 Cr',
    pendingApplications: 8,
    averageTicketSize: '₹87 L',
    successRate: 67,
    totalDisbursed: '₹12.8 Cr'
  });

  const handleCreateFunding = () => {
    if (!newFunding.startupName || !newFunding.amount) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Funding Application Created",
      description: `Application for ${newFunding.startupName} has been submitted.`,
    });
    
    setShowCreateDialog(false);
    setNewFunding({
      startupName: '',
      amount: '',
      stage: 'seed',
      investor: '',
      status: 'applied',
      applicationDate: '',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-500/20 text-green-300">Approved</Badge>;
      case 'under_review':
        return <Badge className="bg-blue-500/20 text-blue-300">Under Review</Badge>;
      case 'pending_documentation':
        return <Badge className="bg-yellow-500/20 text-yellow-300">Pending Docs</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gradient">Funding Tracker</h2>
          <p className="text-muted-foreground">Track funding applications and disbursements</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="professional-button">
              <Plus className="mr-2 h-4 w-4" />
              Add Funding Application
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>New Funding Application</DialogTitle>
              <DialogDescription>Add a new funding application to track</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="startupName">Startup Name</Label>
                <Input
                  id="startupName"
                  value={newFunding.startupName}
                  onChange={(e) => setNewFunding({ ...newFunding, startupName: e.target.value })}
                  className="professional-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Funding Amount</Label>
                  <Input
                    id="amount"
                    value={newFunding.amount}
                    onChange={(e) => setNewFunding({ ...newFunding, amount: e.target.value })}
                    placeholder="₹50,00,000"
                    className="professional-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Funding Stage</Label>
                  <Select value={newFunding.stage} onValueChange={(value) => setNewFunding({ ...newFunding, stage: value })}>
                    <SelectTrigger className="professional-input">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="seed">Seed</SelectItem>
                      <SelectItem value="pre-series-a">Pre-Series A</SelectItem>
                      <SelectItem value="series-a">Series A</SelectItem>
                      <SelectItem value="series-b">Series B</SelectItem>
                      <SelectItem value="series-c">Series C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="investor">Investor/Fund Name</Label>
                <Input
                  id="investor"
                  value={newFunding.investor}
                  onChange={(e) => setNewFunding({ ...newFunding, investor: e.target.value })}
                  className="professional-input"
                />
              </div>

              <Button onClick={handleCreateFunding} className="w-full professional-button">
                Add Application
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Funding Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Applications</p>
                <p className="text-3xl font-bold">{fundingStats.totalApplications}</p>
              </div>
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <Target className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Approved Funding</p>
                <p className="text-3xl font-bold text-green-400">{fundingStats.approvedFunding}</p>
              </div>
              <div className="p-2 bg-green-500/20 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-3xl font-bold text-purple-400">{fundingStats.successRate}%</p>
              </div>
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funding Applications Table */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Funding Applications</CardTitle>
          <CardDescription>Monitor all funding applications and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border border-white/10 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-white/10">
                  <TableHead>Startup</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Stage</TableHead>
                  <TableHead>Investor</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fundingApplications.map((app) => (
                  <TableRow key={app.id} className="border-white/10">
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.startupName}</div>
                        <div className="text-sm text-muted-foreground">{app.founderName}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{app.amount}</div>
                        <div className="text-sm text-muted-foreground">{app.equity} equity</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{app.stage}</Badge>
                    </TableCell>
                    <TableCell>{app.investor}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Disbursed</span>
                          <span>{app.progress}%</span>
                        </div>
                        <Progress value={app.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(app.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
