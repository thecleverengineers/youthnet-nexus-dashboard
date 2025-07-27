import {
  LayoutDashboard,
  GraduationCap,
  Trophy,
  Briefcase,
  Heart,
  Building,
  ShoppingBag,
  Users,
  Settings,
  BarChart3,
  UserCheck,
  FileText,
  Calendar,
  Zap,
  MapPin,
  Award,
  Target,
  TrendingUp,
  UserPlus,
  BookOpen,
  Clock,
  Star,
  Shield,
  type LucideIcon
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  href: string;
  icon: LucideIcon;
  description?: string;
  badge?: string | number;
  isFavorite?: boolean;
}

export interface NavigationSection {
  id: string;
  title: string;
  color: string;
  roles: string[];
  items: NavigationItem[];
}

export const navigationConfig: NavigationSection[] = [
  {
    id: 'core',
    title: 'Core Modules',
    color: 'primary',
    roles: ['all'],
    items: [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        description: 'Overview and insights',
        isFavorite: true
      },
      {
        name: 'Education',
        href: '/education',
        icon: GraduationCap,
        description: 'Student management & courses'
      },
      {
        name: 'Skill Development',
        href: '/skill-development',
        icon: Trophy,
        description: 'Training programs & certifications'
      }
    ]
  },
  {
    id: 'student-hub',
    title: 'Student Hub',
    color: 'secondary',
    roles: ['admin', 'staff', 'trainer'],
    items: [
      {
        name: 'Student Registration',
        href: '/education?tab=registration',
        icon: UserPlus,
        description: 'Register new students',
        badge: 'New'
      },
      {
        name: 'Enrollment Management',
        href: '/education?tab=enrollment',
        icon: BookOpen,
        description: 'Course enrollments'
      },
      {
        name: 'Performance Analytics',
        href: '/education?tab=analytics',
        icon: TrendingUp,
        description: 'Student progress tracking'
      },
      {
        name: 'Attendance Tracker',
        href: '/education?tab=attendance',
        icon: Clock,
        description: 'Track student attendance'
      }
    ]
  },
  {
    id: 'services',
    title: 'Services',
    color: 'accent',
    roles: ['admin', 'staff', 'trainer', 'student'],
    items: [
      {
        name: 'Job Centre',
        href: '/job-centre',
        icon: Briefcase,
        description: 'Job placements & opportunities',
        badge: 12
      },
      {
        name: 'Career Centre',
        href: '/career-centre',
        icon: Target,
        description: 'Career guidance & counselling'
      },
      {
        name: 'Livelihood Incubator',
        href: '/livelihood-incubator',
        icon: Heart,
        description: 'Community development programs'
      },
      {
        name: 'Incubation',
        href: '/incubation',
        icon: Building,
        description: 'Startup incubation programs'
      },
      {
        name: 'Made in Nagaland',
        href: '/made-in-nagaland',
        icon: ShoppingBag,
        description: 'Local products & marketplace'
      }
    ]
  },
  {
    id: 'departments',
    title: 'Department Modules',
    color: 'muted',
    roles: ['admin', 'staff'],
    items: [
      {
        name: 'Education Department',
        href: '/education-department',
        icon: GraduationCap,
        description: 'Department administration'
      },
      {
        name: 'HR Administration',
        href: '/hr-admin',
        icon: Users,
        description: 'Human resources management',
        badge: 5
      },
      {
        name: 'Inventory Management',
        href: '/inventory',
        icon: MapPin,
        description: 'Asset & inventory tracking'
      }
    ]
  },
  {
    id: 'administration',
    title: 'Administration',
    color: 'destructive',
    roles: ['admin'],
    items: [
      {
        name: 'User Management',
        href: '/user-management',
        icon: Users,
        description: 'Manage system users'
      },
      {
        name: 'Role & Permissions',
        href: '/admin-rbac',
        icon: Shield,
        description: 'Access control management'
      },
      {
        name: 'Reports & Analytics',
        href: '/reports',
        icon: BarChart3,
        description: 'System reports & insights'
      },
      {
        name: 'System Settings',
        href: '/settings',
        icon: Settings,
        description: 'Platform configuration'
      }
    ]
  }
];