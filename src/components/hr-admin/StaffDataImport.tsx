import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StaffMember {
  name: string;
  gender: string;
  dateOfJoining: string;
  designation: string;
}

const STAFF_DATA = [
  { name: "PHULMONI CHETRI", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "YANGER IMCHEN", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "TEMSUNARO LONGCHAR", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "YANGERTEMSULA", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "MOAIENLA JAMIR", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "BENDANGCHUBA JAMIR", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "TIAJUNGLA", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "ANUNGLA OZUKUM", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "TEMSUIENLA", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "IMNASANGLA LONGCHAR", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "KEVISEVOLIE KEHIE", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "SENTILA YANGER", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "VIKETOUNO SUOKHRIE", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "MEZEVINUO SUOKHRIE", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "KEDUONEIU YHOME", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "KEZHALEZO YHOME", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "SAMUEL YIMCHUNGER", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "YIMTHONG BETSOKPU", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "YIMHON BETSOKPU", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "MHONCHAN OVUNG", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "TEYIKOKLA", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "JAMBONI MECH", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "SHOHINI MAHANTA", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "SANSENGLA LONGCHAR", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "THSANBENI LOTHA", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "ABENI MOLLIER", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "AMKALA", gender: "Female", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
  { name: "LIMATOSHI", gender: "Male", dateOfJoining: "2020-04-01", designation: "Assistant Professor" },
];

export const StaffDataImport = () => {
  const [importing, setImporting] = useState(false);
  const [customStaff, setCustomStaff] = useState<StaffMember[]>([{ name: '', gender: '', dateOfJoining: '', designation: '' }]);

  const generateEmployeeId = (name: string, index: number) => {
    const nameParts = name.split(' ');
    const initials = nameParts.map(part => part.charAt(0)).join('');
    return `EMP${initials}${String(index + 1).padStart(3, '0')}`;
  };

  const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  };

  const importPredefinedData = async () => {
    setImporting(true);
    try {
      let successCount = 0;
      
      for (let i = 0; i < STAFF_DATA.length; i++) {
        const staff = STAFF_DATA[i];
        const employeeId = generateEmployeeId(staff.name, i);
        const profileId = generateUUID();
        
        // First create profile with generated ID
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            full_name: staff.name,
            email: `${staff.name.toLowerCase().replace(/\s+/g, '.')}@youthnet.com`,
            role: 'staff' as const
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          continue;
        }

        // Then create employee record
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            user_id: profileId,
            employee_id: employeeId,
            position: staff.designation,
            department: 'Academic',
            employment_status: 'active',
            employment_type: 'full_time',
            gender: staff.gender.toLowerCase(),
            date_of_joining: staff.dateOfJoining,
            hire_date: staff.dateOfJoining,
            salary: 50000
          });

        if (employeeError) {
          console.error('Employee creation error:', employeeError);
        } else {
          successCount++;
        }
      }

      toast.success(`Successfully imported ${successCount} staff members out of ${STAFF_DATA.length}`);
    } catch (error: any) {
      toast.error('Error importing staff data: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  const addCustomStaffRow = () => {
    setCustomStaff([...customStaff, { name: '', gender: '', dateOfJoining: '', designation: '' }]);
  };

  const updateCustomStaff = (index: number, field: keyof StaffMember, value: string) => {
    const updated = [...customStaff];
    updated[index][field] = value;
    setCustomStaff(updated);
  };

  const removeCustomStaffRow = (index: number) => {
    const updated = customStaff.filter((_, i) => i !== index);
    setCustomStaff(updated);
  };

  const importCustomData = async () => {
    setImporting(true);
    try {
      let successCount = 0;
      
      for (let i = 0; i < customStaff.length; i++) {
        const staff = customStaff[i];
        if (!staff.name || !staff.designation) continue;
        
        const employeeId = generateEmployeeId(staff.name, i + STAFF_DATA.length);
        const profileId = generateUUID();
        
        // Create profile with generated ID
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: profileId,
            full_name: staff.name,
            email: `${staff.name.toLowerCase().replace(/\s+/g, '.')}@youthnet.com`,
            role: 'staff' as const
          });

        if (profileError) {
          console.error('Profile creation error:', profileError);
          continue;
        }

        // Create employee record
        const { error: employeeError } = await supabase
          .from('employees')
          .insert({
            user_id: profileId,
            employee_id: employeeId,
            position: staff.designation,
            department: 'Academic',
            employment_status: 'active',
            employment_type: 'full_time',
            gender: staff.gender.toLowerCase(),
            date_of_joining: staff.dateOfJoining,
            hire_date: staff.dateOfJoining,
            salary: 50000
          });

        if (employeeError) {
          console.error('Employee creation error:', employeeError);
        } else {
          successCount++;
        }
      }

      toast.success(`Successfully imported ${successCount} custom staff members`);
      setCustomStaff([{ name: '', gender: '', dateOfJoining: '', designation: '' }]);
    } catch (error: any) {
      toast.error('Error importing custom staff data: ' + error.message);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="text-gradient">Import Staff Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Predefined Staff List</h3>
            <p className="text-sm text-gray-400 mb-4">
              Import {STAFF_DATA.length} staff members from the uploaded data. This will create both profile and employee records.
            </p>
            <Button 
              onClick={importPredefinedData} 
              disabled={importing}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              {importing ? 'Importing...' : `Import ${STAFF_DATA.length} Staff Members`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="text-gradient">Add Custom Staff</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {customStaff.map((staff, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border border-gray-700 rounded-lg bg-gray-800/50">
              <div>
                <Label htmlFor={`name-${index}`} className="text-white">Name</Label>
                <Input
                  id={`name-${index}`}
                  value={staff.name}
                  onChange={(e) => updateCustomStaff(index, 'name', e.target.value)}
                  placeholder="Full Name"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`gender-${index}`} className="text-white">Gender</Label>
                <Select value={staff.gender} onValueChange={(value) => updateCustomStaff(index, 'gender', value)}>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor={`date-${index}`} className="text-white">Date of Joining</Label>
                <Input
                  id={`date-${index}`}
                  type="date"
                  value={staff.dateOfJoining}
                  onChange={(e) => updateCustomStaff(index, 'dateOfJoining', e.target.value)}
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor={`designation-${index}`} className="text-white">Designation</Label>
                <Input
                  id={`designation-${index}`}
                  value={staff.designation}
                  onChange={(e) => updateCustomStaff(index, 'designation', e.target.value)}
                  placeholder="Job Title"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="flex items-end">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => removeCustomStaffRow(index)}
                  disabled={customStaff.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          
          <div className="flex space-x-2">
            <Button variant="outline" onClick={addCustomStaffRow}>
              Add Another Staff Member
            </Button>
            <Button 
              onClick={importCustomData} 
              disabled={importing || customStaff.every(s => !s.name)}
              className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
            >
              {importing ? 'Importing...' : 'Import Custom Staff'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
