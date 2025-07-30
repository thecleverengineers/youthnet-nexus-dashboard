import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Banner } from '@/services/bannerService';
import { AlertCircle } from 'lucide-react';

interface BannerFormProps {
  banner?: Banner | null;
  onSave: (banner: Omit<Banner, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export const BannerForm = ({ banner, onSave, onCancel }: BannerFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    image_url: '',
    link_url: '',
    display_order: 0,
    is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title,
        subtitle: banner.subtitle || '',
        image_url: banner.image_url,
        link_url: banner.link_url || '',
        display_order: banner.display_order,
        is_active: banner.is_active,
      });
    }
  }, [banner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="subtitle">Subtitle</Label>
        <Textarea
          id="subtitle"
          value={formData.subtitle}
          onChange={(e) => handleChange('subtitle', e.target.value)}
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL *</Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url}
          onChange={(e) => handleChange('image_url', e.target.value)}
          required
        />
        {formData.image_url && (
          <div className="mt-2">
            {imageError ? (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                Failed to load image preview
              </div>
            ) : (
              <img
                src={formData.image_url}
                alt="Preview"
                className="w-full h-32 object-cover rounded-lg"
                onError={() => setImageError(true)}
                onLoad={() => setImageError(false)}
              />
            )}
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="link_url">Link URL</Label>
        <Input
          id="link_url"
          type="url"
          value={formData.link_url}
          onChange={(e) => handleChange('link_url', e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="display_order">Display Order</Label>
        <Input
          id="display_order"
          type="number"
          value={formData.display_order}
          onChange={(e) => handleChange('display_order', parseInt(e.target.value) || 0)}
          min="0"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="is_active"
          checked={formData.is_active}
          onCheckedChange={(checked) => handleChange('is_active', checked)}
        />
        <Label htmlFor="is_active">Active</Label>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <LoadingSpinner size="sm" className="mr-2" />
              {banner ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            `${banner ? 'Update' : 'Create'} Banner`
          )}
        </Button>
      </div>
    </form>
  );
};