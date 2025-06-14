
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EmployeeFormProps {
  employee?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export const EmployeeForm = ({ employee, onSuccess, onCancel }: EmployeeFormProps) => {
  const [formData, setFormData] = useState({
    employee_id: employee?.employee_id || '',
    position: employee?.position || '',
    department: employee?.department || '',
    employment_status: employee?.employment_status || 'active',
    employment_type: employee?.employment_type || 'full_time',
    hire_date: employee?.hire_date || new Date().toISOString().split('T')[0],
    salary: employee?.salary || '',
    probation_end_date: employee?.probation_end_date || '',
    contract_end_date: employee?.contract_end_date || '',
    emergency_contact_name: employee?.emergency_contact_name || '',
    emergency_contact_phone: employee?.emergency_contact_phone || '',
    bank_account: employee?.bank_account || '',
    tax_id: employee?.tax_id || '',
    // Profile data
    full_name: employee?.profiles?.full_name || '',
    email: employee?.profiles?.email || '',
    phone: employee?.profiles?.phone || '',
    address: employee?.profiles?.address || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (employee) {
        // Update existing employee
        const { error: empError } = await supabase
          .from('employees')
          .update({
            employee_id: formData.employee_id,
            position: formData.position,
            department: formData.department,
            employment_status: formData.employment_status,
            employment_type: formData.employment_type,
            hire_date: formData.hire_date,
            salary: formData.salary ? parseFloat(formData.salary) : null,
            probation_end_date: formData.probation_end_date || null,
            contract_end_date: formData.contract_end_date || null,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            bank_account: formData.bank_account,
            tax_id: formData.tax_id,
          })
          .eq('id', employee.id);

        if (empError) throw empError;

        // Update profile if user_id exists
        if (employee.user_id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({
              full_name: formData.full_name,
              email: formData.email,
              phone: formData.phone,
              address: formData.address,
            })
            .eq('id', employee.user_id);

          if (profileError) throw profileError;
        }

        toast.success('Employee updated successfully!');
      } else {
        // Create new employee - this will be a simplified version
        // as we don't have user creation functionality here
        const { error } = await supabase
          .from('employees')
          .insert([{
            employee_id: formData.employee_id,
            position: formData.position,
            department: formData.department,
            employment_status: formData.employment_status,
            employment_type: formData.employment_type,
            hire_date: formData.hire_date,
            salary: formData.salary ? parseFloat(formData.salary) : null,
            probation_end_date: formData.probation_end_date || null,
            contract_end_date: formData.contract_end_date || null,
            emergency_contact_name: formData.emergency_contact_name,
            emergency_contact_phone: formData.emergency_contact_phone,
            bank_account: formData.bank_account,
            tax_id: formData.tax_id,
            // Note: user_id will need to be set separately when user is created
          }]);

        if (error) throw error;
        toast.success('Employee created successfully!');
      }

      onSuccess();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Information */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="full_name">Full Name</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Employment Information */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-lg">Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                value={formData.employee_id}
                onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employment_status">Status</Label>
                <Select value={formData.employment_status} onValueChange={(value) => setFormData({ ...formData, employment_status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="probation">Probation</SelectItem>
                    <SelectItem value="on_leave">On Leave</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="terminated">Terminated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="employment_type">Type</Label>
                <Select value={formData.employment_type} onValueChange={(value) => setFormData({ ...formData, employment_type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full_time">Full Time</SelectItem>
                    <SelectItem value="part_time">Part Time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Information */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-lg">Financial Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salary">Salary (Annual)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="bank_account">Bank Account</Label>
              <Input
                id="bank_account"
                value={formData.bank_account}
                onChange={(e) => setFormData({ ...formData, bank_account: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input
                id="tax_id"
                value={formData.tax_id}
                onChange={(e) => setFormData({ ...formData, tax_id: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Information */}
        <Card className="futuristic-card">
          <CardHeader>
            <CardTitle className="text-lg">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="hire_date">Hire Date</Label>
              <Input
                id="hire_date"
                type="date"
                value={formData.hire_date}
                onChange={(e) => setFormData({ ...formData, hire_date: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="probation_end_date">Probation End Date</Label>
              <Input
                id="probation_end_date"
                type="date"
                value={formData.probation_end_date}
                onChange={(e) => setFormData({ ...formData, probation_end_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contract_end_date">Contract End Date</Label>
              <Input
                id="contract_end_date"
                type="date"
                value={formData.contract_end_date}
                onChange={(e) => setFormData({ ...formData, contract_end_date: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({ ...formData, emergency_contact_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="emergency_contact_phone">Emergency Contact Phone</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({ ...formData, emergency_contact_phone: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          {loading ? 'Saving...' : employee ? 'Update Employee' : 'Create Employee'}
        </Button>
      </div>
    </form>
  );
};
