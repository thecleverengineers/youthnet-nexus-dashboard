
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Award, 
  Plus, 
  Search, 
  Eye, 
  Calendar,
  CheckCircle,
  Clock,
  AlertTriangle,
  FileText,
  Download,
  Upload,
  Zap
} from 'lucide-react';

interface Certification {
  id: string;
  name: string;
  type: 'product' | 'process' | 'organic' | 'fair_trade' | 'geographical';
  producerName: string;
  productName: string;
  issuingAuthority: string;
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'expired' | 'pending' | 'suspended';
  requirements: string[];
  progress: number;
  documents: string[];
  cost: number;
  renewalRequired: boolean;
  description: string;
}

interface CertificationApplication {
  id: string;
  producerName: string;
  certificationType: string;
  appliedDate: string;
  expectedCompletion: string;
  status: 'submitted' | 'under_review' | 'approved' | 'rejected';
  notes: string;
}

export const CertificationTracker = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedCertification, setSelectedCertification] = useState<Certification | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: '1',
      name: 'Naga Shawl GI Tag',
      type: 'geographical',
      producerName: 'Heritage Weavers',
      productName: 'Traditional Naga Shawl',
      issuingAuthority: 'Geographical Indications Registry',
      issueDate: '2023-03-15',
      expiryDate: '2033-03-15',
      status: 'active',
      requirements: ['Traditional weaving techniques', 'Local materials', 'Regional authenticity'],
      progress: 100,
      documents: ['GI Certificate', 'Product specifications', 'Weaving process documentation'],
      cost: 25000,
      renewalRequired: false,
      description: 'Geographical Indication protection for traditional Naga shawls'
    },
    {
      id: '2',
      name: 'Organic Food Certification',
      type: 'organic',
      producerName: 'Organic Valley Farms',
      productName: 'Organic Honey',
      issuingAuthority: 'India Organic Certification Agency',
      issueDate: '2023-06-20',
      expiryDate: '2024-06-20',
      status: 'active',
      requirements: ['No chemical pesticides', 'Organic farming practices', 'Regular inspections'],
      progress: 100,
      documents: ['Organic Certificate', 'Soil test reports', 'Inspection reports'],
      cost: 15000,
      renewalRequired: true,
      description: 'Organic certification for honey and bee products'
    },
    {
      id: '3',
      name: 'Handloom Mark',
      type: 'product',
      producerName: 'Bamboo Craft Co.',
      productName: 'Bamboo Handicrafts',
      issuingAuthority: 'Office of Development Commissioner (Handicrafts)',
      issueDate: '2023-09-10',
      expiryDate: '2026-09-10',
      status: 'pending',
      requirements: ['Handmade verification', 'Quality standards', 'Traditional techniques'],
      progress: 75,
      documents: ['Application form', 'Product samples', 'Process documentation'],
      cost: 5000,
      renewalRequired: false,
      description: 'Official handloom mark for authentic handicraft products'
    }
  ]);

  const [applications, setApplications] = useState<CertificationApplication[]>([
    {
      id: '1',
      producerName: 'Mountain Spice Co.',
      certificationType: 'FSSAI License',
      appliedDate: '2024-01-15',
      expectedCompletion: '2024-02-15',
      status: 'under_review',
      notes: 'Food safety license for spice processing unit'
    },
    {
      id: '2',
      producerName: 'Eco Crafts',
      certificationType: 'Forest Stewardship Council',
      appliedDate: '2024-01-20',
      expectedCompletion: '2024-03-20',
      status: 'submitted',
      notes: 'Sustainable wood sourcing certification'
    }
  ]);

  const [newCertification, setNewCertification] = useState({
    name: '',
    type: '',
    producerName: '',
    productName: '',
    issuingAuthority: '',
    expiryDate: '',
    requirements: '',
    cost: '',
    description: ''
  });

  const certificationTypes = [
    { value: 'product', label: 'Product Certification' },
    { value: 'process', label: 'Process Certification' },
    { value: 'organic', label: 'Organic Certification' },
    { value: 'fair_trade', label: 'Fair Trade' },
    { value: 'geographical', label: 'Geographical Indication' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'expired': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'suspended': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'expired': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-blue-500" />;
    }
  };

  const filteredCertifications = certifications.filter(cert => {
    const matchesSearch = cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.producerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         cert.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || cert.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || cert.status === selectedStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddCertification = () => {
    if (!newCertification.name || !newCertification.type || !newCertification.producerName) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const certification: Certification = {
      id: Date.now().toString(),
      ...newCertification,
      type: newCertification.type as Certification['type'],
      issueDate: new Date().toISOString().split('T')[0],
      status: 'pending',
      requirements: newCertification.requirements.split(',').map(r => r.trim()).filter(r => r),
      progress: 0,
      documents: [],
      cost: parseInt(newCertification.cost) || 0,
      renewalRequired: false
    };

    setCertifications(prev => [...prev, certification]);
    setNewCertification({ 
      name: '', type: '', producerName: '', productName: '', issuingAuthority: '', 
      expiryDate: '', requirements: '', cost: '', description: '' 
    });
    setIsAddDialogOpen(false);
    
    toast({
      title: "Success",
      description: "Certification added successfully"
    });
  };

  const handleViewCertification = (certification: Certification) => {
    setSelectedCertification(certification);
    setIsViewDialogOpen(true);
  };

  const stats = {
    total: certifications.length,
    active: certifications.filter(c => c.status === 'active').length,
    pending: certifications.filter(c => c.status === 'pending').length,
    expiringSoon: certifications.filter(c => {
      const expiryDate = new Date(c.expiryDate);
      const threeMonthsFromNow = new Date();
      threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
      return expiryDate <= threeMonthsFromNow && c.status === 'active';
    }).length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Certification Tracker</h2>
          <p className="text-muted-foreground">Manage product certifications and quality standards</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Certification</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Certification Name *</Label>
                <Input
                  id="name"
                  value={newCertification.name}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter certification name"
                />
              </div>
              <div>
                <Label htmlFor="type">Type *</Label>
                <Select 
                  value={newCertification.type} 
                  onValueChange={(value) => setNewCertification(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {certificationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="producerName">Producer Name *</Label>
                <Input
                  id="producerName"
                  value={newCertification.producerName}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, producerName: e.target.value }))}
                  placeholder="Enter producer name"
                />
              </div>
              <div>
                <Label htmlFor="productName">Product Name</Label>
                <Input
                  id="productName"
                  value={newCertification.productName}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, productName: e.target.value }))}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <Label htmlFor="issuingAuthority">Issuing Authority</Label>
                <Input
                  id="issuingAuthority"
                  value={newCertification.issuingAuthority}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, issuingAuthority: e.target.value }))}
                  placeholder="Enter issuing authority"
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={newCertification.expiryDate}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, expiryDate: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="cost">Cost (₹)</Label>
                <Input
                  id="cost"
                  type="number"
                  value={newCertification.cost}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, cost: e.target.value }))}
                  placeholder="Enter cost"
                />
              </div>
              <div>
                <Label htmlFor="requirements">Requirements (comma-separated)</Label>
                <Input
                  id="requirements"
                  value={newCertification.requirements}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, requirements: e.target.value }))}
                  placeholder="e.g., Quality standards, Documentation"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newCertification.description}
                  onChange={(e) => setNewCertification(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Enter certification description"
                />
              </div>
              <div className="col-span-2 flex gap-2">
                <Button onClick={handleAddCertification} className="flex-1">Add Certification</Button>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Total Certifications</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-muted-foreground">Expiring Soon</p>
                <p className="text-2xl font-bold">{stats.expiringSoon}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="certifications" className="space-y-4">
        <TabsList>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="applications">Applications</TabsTrigger>
          <TabsTrigger value="renewals">Renewals</TabsTrigger>
        </TabsList>

        <TabsContent value="certifications" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search certifications..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {certificationTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Certifications List */}
          <div className="grid gap-4">
            {filteredCertifications.map((certification) => (
              <Card key={certification.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusIcon(certification.status)}
                        <h3 className="text-lg font-semibold">{certification.name}</h3>
                        <Badge className={getStatusColor(certification.status)}>
                          {certification.status}
                        </Badge>
                        <Badge variant="outline">
                          {certificationTypes.find(t => t.value === certification.type)?.label}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Producer:</span> {certification.producerName}
                        </div>
                        <div>
                          <span className="font-medium">Product:</span> {certification.productName}
                        </div>
                        <div>
                          <span className="font-medium">Authority:</span> {certification.issuingAuthority}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span> ₹{certification.cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => handleViewCertification(certification)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{certification.progress}%</span>
                      </div>
                      <Progress value={certification.progress} className="h-2" />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Expires: {new Date(certification.expiryDate).toLocaleDateString()}
                      </div>
                      {certification.renewalRequired && (
                        <Badge variant="secondary" className="text-xs">
                          <Zap className="h-3 w-3 mr-1" />
                          Renewal Required
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium mb-2">Requirements:</p>
                    <div className="flex flex-wrap gap-1">
                      {certification.requirements.map((req, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {req}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {certification.description && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-sm">{certification.description}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="applications" className="space-y-4">
          <div className="grid gap-4">
            {applications.map((application) => (
              <Card key={application.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2">{application.certificationType}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                        <div>
                          <span className="font-medium">Producer:</span> {application.producerName}
                        </div>
                        <div>
                          <span className="font-medium">Applied:</span> {new Date(application.appliedDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Expected:</span> {new Date(application.expectedCompletion).toLocaleDateString()}
                        </div>
                        <div>
                          <Badge className={getStatusColor(application.status)}>
                            {application.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm">{application.notes}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <FileText className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="renewals" className="space-y-4">
          <div className="grid gap-4">
            {certifications.filter(c => c.renewalRequired || c.status === 'expired').map((certification) => (
              <Card key={certification.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        <h3 className="text-lg font-semibold">{certification.name}</h3>
                        <Badge variant="outline" className="text-orange-600">
                          Renewal Required
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Producer:</span> {certification.producerName}
                        </div>
                        <div>
                          <span className="font-medium">Expires:</span> {new Date(certification.expiryDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Cost:</span> ₹{certification.cost.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Zap className="h-4 w-4 mr-2" />
                        Start Renewal
                      </Button>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* View Certification Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Certification Details</DialogTitle>
          </DialogHeader>
          {selectedCertification && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Certification Name</Label>
                  <p className="font-medium">{selectedCertification.name}</p>
                </div>
                <div>
                  <Label>Type</Label>
                  <p>{certificationTypes.find(t => t.value === selectedCertification.type)?.label}</p>
                </div>
                <div>
                  <Label>Producer</Label>
                  <p>{selectedCertification.producerName}</p>
                </div>
                <div>
                  <Label>Product</Label>
                  <p>{selectedCertification.productName}</p>
                </div>
                <div>
                  <Label>Issuing Authority</Label>
                  <p>{selectedCertification.issuingAuthority}</p>
                </div>
                <div>
                  <Label>Cost</Label>
                  <p>₹{selectedCertification.cost.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Issue Date</Label>
                  <p>{new Date(selectedCertification.issueDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Expiry Date</Label>
                  <p>{new Date(selectedCertification.expiryDate).toLocaleDateString()}</p>
                </div>
              </div>
              
              <div>
                <Label>Requirements</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCertification.requirements.map((req, index) => (
                    <Badge key={index} variant="secondary">{req}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Documents</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedCertification.documents.map((doc, index) => (
                    <Badge key={index} variant="outline">{doc}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <Label>Description</Label>
                <p className="text-sm mt-1">{selectedCertification.description}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
