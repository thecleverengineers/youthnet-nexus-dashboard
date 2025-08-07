import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CategoryFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  max_file_size_mb: number;
  requires_approval: boolean;
  retention_days: number | null;
  allowed_file_types: string[];
}

const defaultFormData: CategoryFormData = {
  name: '',
  description: '',
  color: '#3b82f6',
  icon: 'folder',
  max_file_size_mb: 10,
  requires_approval: false,
  retention_days: null,
  allowed_file_types: []
};

const commonFileTypes = [
  'pdf', 'doc', 'docx', 'txt', 'rtf',
  'jpg', 'jpeg', 'png', 'gif', 'webp',
  'xls', 'xlsx', 'csv',
  'ppt', 'pptx',
  'zip', 'rar', '7z'
];

export function DocumentCategories() {
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>(defaultFormData);
  const [allowedTypesInput, setAllowedTypesInput] = useState('');

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Mock categories data
  const categories = [
    {
      id: '1',
      name: 'Reports',
      description: 'Official reports and documentation',
      color: '#3b82f6',
      max_file_size_mb: 10,
      requires_approval: false,
      retention_days: 365,
      allowed_file_types: ['pdf', 'doc', 'docx']
    },
    {
      id: '2', 
      name: 'Contracts',
      description: 'Legal contracts and agreements',
      color: '#10b981',
      max_file_size_mb: 5,
      requires_approval: true,
      retention_days: null,
      allowed_file_types: ['pdf']
    }
  ];
  const isLoading = false;

  // Mock mutations for demo
  const saveCategoryMutation = useMutation({
    mutationFn: async (data: CategoryFormData) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return data;
    },
    onSuccess: () => {
      setIsOpen(false);
      resetForm();
      toast({
        title: 'Success',
        description: `Category ${editingCategory ? 'updated' : 'created'} successfully (demo)`
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return categoryId;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Category deleted successfully (demo)'
      });
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive'
      });
    }
  });

  const resetForm = () => {
    setFormData(defaultFormData);
    setAllowedTypesInput('');
    setEditingCategory(null);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      color: category.color || '#3b82f6',
      icon: category.icon || 'folder',
      max_file_size_mb: category.max_file_size_mb || 10,
      requires_approval: category.requires_approval || false,
      retention_days: category.retention_days,
      allowed_file_types: category.allowed_file_types || []
    });
    setAllowedTypesInput(category.allowed_file_types?.join(', ') || '');
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveCategoryMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/6 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Document Categories</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
                <DialogDescription>
                  Configure document category settings and restrictions
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Contracts, Reports"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="color"
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                        className="w-16 h-10"
                      />
                      <Badge style={{ backgroundColor: formData.color, color: 'white' }}>
                        Preview
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Category description"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max_file_size">Max File Size (MB)</Label>
                    <Input
                      id="max_file_size"
                      type="number"
                      min="1"
                      max="100"
                      value={formData.max_file_size_mb}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        max_file_size_mb: parseInt(e.target.value) || 10 
                      }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retention_days">Retention Period (Days)</Label>
                    <Input
                      id="retention_days"
                      type="number"
                      min="1"
                      value={formData.retention_days || ''}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        retention_days: e.target.value ? parseInt(e.target.value) : null 
                      }))}
                      placeholder="Optional"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed_types">Allowed File Types</Label>
                  <Input
                    id="allowed_types"
                    value={allowedTypesInput}
                    onChange={(e) => setAllowedTypesInput(e.target.value)}
                    placeholder="pdf, doc, docx, jpg, png (leave empty for all types)"
                  />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {commonFileTypes.map(type => (
                      <Button
                        key={type}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const current = allowedTypesInput.split(',').map(t => t.trim()).filter(Boolean);
                          if (!current.includes(type)) {
                            setAllowedTypesInput(current.length > 0 ? `${allowedTypesInput}, ${type}` : type);
                          }
                        }}
                        className="text-xs"
                      >
                        +{type}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requires_approval"
                    checked={formData.requires_approval}
                    onCheckedChange={(checked) => setFormData(prev => ({ 
                      ...prev, 
                      requires_approval: checked 
                    }))}
                  />
                  <Label htmlFor="requires_approval">Require approval for uploads</Label>
                </div>

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={saveCategoryMutation.isPending}>
                    {saveCategoryMutation.isPending ? 'Saving...' : 'Save Category'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        
        <CardContent>
          {categories?.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No categories found</h3>
              <p className="text-muted-foreground mb-4">
                Create your first document category to organize uploads
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Max Size</TableHead>
                  <TableHead>File Types</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Retention</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories?.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-4 h-4 rounded"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          {category.description && (
                            <p className="text-sm text-muted-foreground">
                              {category.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{category.max_file_size_mb} MB</TableCell>
                    <TableCell>
                      {category.allowed_file_types?.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {category.allowed_file_types.slice(0, 3).map((type: string) => (
                            <Badge key={type} variant="secondary" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                          {category.allowed_file_types.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{category.allowed_file_types.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">All types</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant={category.requires_approval ? 'default' : 'secondary'}>
                        {category.requires_approval ? 'Required' : 'Not required'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {category.retention_days ? `${category.retention_days} days` : 'Permanent'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Category</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{category.name}"? 
                                This action cannot be undone and may affect existing documents.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteCategoryMutation.mutate(category.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}