import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { BannerForm } from './BannerForm';
import { bannerService, Banner } from '@/services/bannerService';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit, Trash2, GripVertical } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';

export const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBanner, setSelectedBanner] = useState<Banner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const loadBanners = async () => {
    try {
      const data = await bannerService.getAllBanners();
      setBanners(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load banners",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBanners();
  }, []);

  const handleCreate = () => {
    setSelectedBanner(null);
    setShowForm(true);
  };

  const handleEdit = (banner: Banner) => {
    setSelectedBanner(banner);
    setShowForm(true);
  };

  const handleSave = async (bannerData: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (selectedBanner) {
        await bannerService.updateBanner(selectedBanner.id, bannerData);
        toast({
          title: "Success",
          description: "Banner updated successfully",
        });
      } else {
        await bannerService.createBanner(bannerData);
        toast({
          title: "Success",
          description: "Banner created successfully",
        });
      }
      setShowForm(false);
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save banner",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    
    try {
      await bannerService.deleteBanner(deleteId);
      toast({
        title: "Success",
        description: "Banner deleted successfully",
      });
      setDeleteId(null);
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete banner",
        variant: "destructive",
      });
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      await bannerService.updateBanner(banner.id, {
        is_active: !banner.is_active
      });
      toast({
        title: "Success",
        description: `Banner ${banner.is_active ? 'deactivated' : 'activated'} successfully`,
      });
      loadBanners();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner status",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Banner Management</h2>
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add Banner
        </Button>
      </div>

      <div className="grid gap-4">
        {banners.map((banner) => (
          <Card key={banner.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <CardTitle className="text-lg">{banner.title}</CardTitle>
                    {banner.subtitle && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {banner.subtitle}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={banner.is_active ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => handleToggleActive(banner)}
                  >
                    {banner.is_active ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">
                    Order: {banner.display_order}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <div className="flex-1">
                  <img
                    src={banner.image_url}
                    alt={banner.title}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(banner)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(banner.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal
        open={showForm}
        onOpenChange={setShowForm}
        title={selectedBanner ? "Edit Banner" : "Add Banner"}
        trigger={<></>}
      >
        <BannerForm
          banner={selectedBanner}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <ConfirmationDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Banner"
        description="Are you sure you want to delete this banner? This action cannot be undone."
      />
    </div>
  );
};