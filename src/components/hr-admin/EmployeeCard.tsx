
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Edit, 
  Eye,
  Clock,
  DollarSign
} from 'lucide-react';

interface EmployeeCardProps {
  employee: {
    id: string;
    employee_id: string;
    user_id: string;
    position: string;
    department: string;
    employment_status: string;
    employment_type: string;
    hire_date: string;
    salary: number;
    profiles?: {
      full_name: string;
      email: string;
      phone: string;
    };
  };
  onEdit: (employee: any) => void;
  onView: (employee: any) => void;
}

export const EmployeeCard = ({ employee, onEdit, onView }: EmployeeCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'probation': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'on_leave': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'inactive': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      case 'terminated': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'full_time': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'part_time': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'contract': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'intern': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      case 'consultant': return 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Card className="futuristic-card hover-lift group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12 border-2 border-blue-500/30">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                {employee.profiles?.full_name?.split(' ').map(n => n[0]).join('') || 'NA'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                {employee.profiles?.full_name || 'Unknown'}
              </h3>
              <p className="text-sm text-muted-foreground">{employee.employee_id}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge className={getStatusColor(employee.employment_status)}>
                  {employee.employment_status.replace('_', ' ')}
                </Badge>
                <Badge className={getTypeColor(employee.employment_type)}>
                  {employee.employment_type.replace('_', ' ')}
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(employee)}
              className="hover:bg-blue-500/20 hover:border-blue-500/50"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(employee)}
              className="hover:bg-purple-500/20 hover:border-purple-500/50"
            >
              <Edit className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <User className="h-4 w-4 text-blue-400" />
            <span>{employee.position}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4 text-green-400" />
            <span>{employee.department}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4 text-purple-400" />
            <span>{employee.profiles?.email || 'No email'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Phone className="h-4 w-4 text-orange-400" />
            <span>{employee.profiles?.phone || 'No phone'}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4 text-cyan-400" />
            <span>Hired: {new Date(employee.hire_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="h-4 w-4 text-emerald-400" />
            <span>${employee.salary?.toLocaleString() || 'Not set'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
