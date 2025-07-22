
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface AddressInformationStepProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function AddressInformationStep({ formData, updateFormData }: AddressInformationStepProps) {
  const handleInputChange = (field: string, value: any) => {
    updateFormData({ [field]: value });
  };

  const handleSameAddressChange = (checked: boolean) => {
    updateFormData({
      communication_same_as_permanent: checked,
      ...(checked && {
        communication_address_state: formData.permanent_address_state,
        communication_address_district: formData.permanent_address_district,
        communication_address_pin_code: formData.permanent_address_pin_code,
        communication_address_city: formData.permanent_address_city,
        communication_address_tehsil: formData.permanent_address_tehsil,
        communication_address_constituency: formData.permanent_address_constituency,
      }),
    });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4">Address Information</h3>
      
      {/* Permanent Address */}
      <div className="space-y-4">
        <h4 className="text-md font-medium text-blue-600">Permanent Address</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="space-y-2 md:col-span-3">
            <Label htmlFor="permanent_address">Address *</Label>
            <Textarea
              id="permanent_address"
              value={formData.permanent_address}
              onChange={(e) => handleInputChange('permanent_address', e.target.value)}
              placeholder="Enter permanent address"
              maxLength={50}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_state">State *</Label>
            <Input
              id="permanent_address_state"
              value={formData.permanent_address_state}
              onChange={(e) => handleInputChange('permanent_address_state', e.target.value)}
              placeholder="Enter state"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_district">District *</Label>
            <Input
              id="permanent_address_district"
              value={formData.permanent_address_district}
              onChange={(e) => handleInputChange('permanent_address_district', e.target.value)}
              placeholder="Enter district"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_pin_code">PIN Code *</Label>
            <Input
              id="permanent_address_pin_code"
              value={formData.permanent_address_pin_code}
              onChange={(e) => handleInputChange('permanent_address_pin_code', e.target.value)}
              placeholder="Enter PIN code"
              maxLength={7}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_city">City</Label>
            <Input
              id="permanent_address_city"
              value={formData.permanent_address_city}
              onChange={(e) => handleInputChange('permanent_address_city', e.target.value)}
              placeholder="Enter city"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_tehsil">Tehsil</Label>
            <Input
              id="permanent_address_tehsil"
              value={formData.permanent_address_tehsil}
              onChange={(e) => handleInputChange('permanent_address_tehsil', e.target.value)}
              placeholder="Enter tehsil"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="permanent_address_constituency">Constituency *</Label>
            <Input
              id="permanent_address_constituency"
              value={formData.permanent_address_constituency}
              onChange={(e) => handleInputChange('permanent_address_constituency', e.target.value)}
              placeholder="Enter constituency"
              required
            />
          </div>
        </div>
      </div>

      {/* Communication Address */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="communication_same_as_permanent"
            checked={formData.communication_same_as_permanent}
            onCheckedChange={handleSameAddressChange}
          />
          <Label htmlFor="communication_same_as_permanent">
            Communication address same as permanent address *
          </Label>
        </div>

        {!formData.communication_same_as_permanent && (
          <>
            <h4 className="text-md font-medium text-blue-600">Communication Address</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="communication_address_state">State</Label>
                <Input
                  id="communication_address_state"
                  value={formData.communication_address_state}
                  onChange={(e) => handleInputChange('communication_address_state', e.target.value)}
                  placeholder="Enter state"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_address_district">District</Label>
                <Input
                  id="communication_address_district"
                  value={formData.communication_address_district}
                  onChange={(e) => handleInputChange('communication_address_district', e.target.value)}
                  placeholder="Enter district"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_address_pin_code">PIN Code</Label>
                <Input
                  id="communication_address_pin_code"
                  value={formData.communication_address_pin_code}
                  onChange={(e) => handleInputChange('communication_address_pin_code', e.target.value)}
                  placeholder="Enter PIN code"
                  maxLength={7}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_address_city">City</Label>
                <Input
                  id="communication_address_city"
                  value={formData.communication_address_city}
                  onChange={(e) => handleInputChange('communication_address_city', e.target.value)}
                  placeholder="Enter city"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_address_tehsil">Tehsil</Label>
                <Input
                  id="communication_address_tehsil"
                  value={formData.communication_address_tehsil}
                  onChange={(e) => handleInputChange('communication_address_tehsil', e.target.value)}
                  placeholder="Enter tehsil"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="communication_address_constituency">Constituency</Label>
                <Input
                  id="communication_address_constituency"
                  value={formData.communication_address_constituency}
                  onChange={(e) => handleInputChange('communication_address_constituency', e.target.value)}
                  placeholder="Enter constituency"
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
