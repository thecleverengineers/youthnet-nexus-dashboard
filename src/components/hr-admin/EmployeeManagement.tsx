
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { MobileStatsGrid, MobileStatsCard } from '@/components/ui/mobile-stats';
import { 
  Plus, 
  Search, 
  Users, 
  Building, 
  Clock, 
  Activity,
  Download,
  Upload,
  RefreshCw
} from 'lucide-react';
import { employeeService, Employee } from '@/services/employeeService';
import { EmployeeCard } from './EmployeeCard';
import { EmployeeForm } from './EmployeeForm';
import { EmployeeDetails } from './EmployeeDetails';

export const EmployeeManagement = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    onLeave: 0,
    probation: 0
  });

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.fetchEmployees();
      setEmployees(data);
      
      const stats = data.reduce((acc, emp) => {
        acc.total++;
        if (emp.employment_status === 'active') acc.active++;
        if (emp.employment_status === 'on_leave') acc.onLeave++;
        if (emp.employment_status === 'probation') acc.probation++;
        return acc;
      }, { total: 0, active: 0, onLeave: 0, probation: 0 });
      
      setStats(stats);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = 
      employee.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || employee.employment_status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowForm(true);
  };

  const handleView = (employee: Employee) => {
    setSelectedEmployee(employee);
    setShowDetails(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setSelectedEmployee(null);
    fetchEmployees();
  };

  const departments = [...new Set(employees.map(emp => emp.department).filter(Boolean))];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Mobile-Optimized Header */}
      <Card className="border-slate-200">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <div>
              <CardTitle className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                Employee Management
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Manage your workforce with real-time insights
              </CardDescription>
            </div>
            
            {/* Mobile-Friendly Action Buttons */}
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={fetchEmployees}
                className="h-9 px-3 text-sm touch-manipulation"
              >
                <RefreshCw className="h-4 w-4 mr-1.5" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3 text-sm touch-manipulation hidden sm:flex">
                <Download className="h-4 w-4 mr-1.5" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="h-9 px-3 text-sm touch-manipulation hidden sm:flex">
                <Upload className="h-4 w-4 mr-1.5" />
                Import
              </Button>
              <Dialog open={showForm} onOpenChange={setShowForm}>
                <DialogTrigger asChild>
                  <Button size="sm" className="h-9 px-3 text-sm touch-manipulation">
                    <Plus className="h-4 w-4 mr-1.5" />
                    Add Employee
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
                  <DialogHeader>
                    <DialogTitle className="text-lg">
                      {selectedEmployee ? 'Edit Employee' : 'Add New Employee'}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="p-1">
                    <EmployeeForm
                      employee={selectedEmployee}
                      onSuccess={handleFormSuccess}
                      onCancel={() => {
                        setShowForm(false);
                        setSelectedEmployee(null);
                      }}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Mobile-Optimized Stats Grid */}
      <MobileStatsGrid columns={2}>
        <MobileStatsCard
          title="Total Employees"
          value={stats.total}
          icon={Users}
          trend="neutral"
        />
        <MobileStatsCard
          title="Active Staff"
          value={stats.active}
          icon={Activity}
          trend="up"
          change={{ value: `${stats.active > 0 ? '+' : ''}${((stats.active / stats.total) * 100).toFixed(0)}%`, type: 'increase' }}
        />
        <MobileStatsCard
          title="On Leave"
          value={stats.onLeave}
          icon={Clock}
          trend="neutral"
        />
        <MobileStatsCard
          title="Probation"
          value={stats.probation}
          icon={Building}
          trend="down"
        />
      </MobileStatsGrid>

      {/* Mobile-Optimized Filters */}
      <Card className="border-slate-200">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search employees by name, ID, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11 text-base touch-manipulation"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-11 text-base touch-manipulation">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status ({stats.total})</SelectItem>
                  <SelectItem value="active">Active ({stats.active})</SelectItem>
                  <SelectItem value="probation">Probation ({stats.probation})</SelectItem>
                  <SelectItem value="on_leave">On Leave ({stats.onLeave})</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="h-11 text-base touch-manipulation">
                  <SelectValue placeholder="Filter by department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile-Optimized Employee Grid */}
      {filteredEmployees.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {filteredEmployees.map((employee) => (
            <EmployeeCard
              key={employee.id}
              employee={employee}
              onEdit={handleEdit}
              onView={handleView}
            />
          ))}
        </div>
      ) : (
        <Card className="border-slate-200">
          <CardContent className="p-8 sm:p-12 text-center">
            <Users className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No employees found</h3>
            <p className="text-sm sm:text-base text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all'
                ? 'Try adjusting your search filters'
                : 'Get started by adding your first employee'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && departmentFilter === 'all' && (
              <Button onClick={() => setShowForm(true)} className="touch-manipulation">
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Mobile-Optimized Employee Details Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg">Employee Details</DialogTitle>
          </DialogHeader>
          {selectedEmployee && (
            <div className="p-1">
              <EmployeeDetails
                employee={selectedEmployee}
                onClose={() => {
                  setShowDetails(false);
                  setSelectedEmployee(null);
                }}
                onEdit={() => {
                  setShowDetails(false);
                  setShowForm(true);
                }}
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
