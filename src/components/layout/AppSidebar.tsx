
import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  Typography,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Business as BusinessIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

const menuItems = [
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
  },
  {
    title: 'Students',
    icon: <PeopleIcon />,
    path: '/students',
    roles: ['admin', 'staff'],
  },
  {
    title: 'Training',
    icon: <SchoolIcon />,
    path: '/training',
    roles: ['admin', 'staff', 'trainer'],
  },
  {
    title: 'Career Centre',
    icon: <WorkIcon />,
    path: '/career',
    roles: ['admin', 'staff'],
  },
  {
    title: 'Business Incubation',
    icon: <BusinessIcon />,
    path: '/incubation',
    roles: ['admin', 'staff'],
  },
  {
    title: 'Analytics',
    icon: <AssessmentIcon />,
    path: '/analytics',
    roles: ['admin'],
  },
  {
    title: 'Settings',
    icon: <SettingsIcon />,
    path: '/settings',
  },
];

export const AppSidebar = () => {
  const { profile } = useAuth();
  const [openSections, setOpenSections] = React.useState<Record<string, boolean>>({});

  const toggleSection = (section: string) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const filteredMenuItems = menuItems.filter(item => 
    !item.roles || (profile?.role && item.roles.includes(profile.role))
  );

  return (
    <Box 
      sx={{ 
        height: '100%',
        background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.95) 0%, rgba(25, 25, 35, 0.95) 100%)',
      }}
    >
      <Box sx={{ p: 2 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'primary.main',
            fontWeight: 600,
            textAlign: 'center',
            textShadow: '0 0 10px rgba(0, 245, 255, 0.5)',
          }}
        >
          Navigation
        </Typography>
      </Box>
      
      <Divider sx={{ borderColor: 'rgba(0, 245, 255, 0.2)' }} />
      
      <List sx={{ pt: 1 }}>
        {filteredMenuItems.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton
              sx={{
                mx: 1,
                my: 0.5,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'rgba(0, 245, 255, 0.1)',
                  boxShadow: '0 0 15px rgba(0, 245, 255, 0.3)',
                  transform: 'translateX(5px)',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  color: 'primary.main',
                  minWidth: 40,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.title}
                primaryTypographyProps={{
                  fontWeight: 500,
                  fontSize: '0.9rem',
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.1), rgba(255, 20, 147, 0.1))',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {profile?.full_name || 'User'}
          </Typography>
          <Typography variant="caption" display="block" sx={{ color: 'primary.main' }}>
            {profile?.role || 'Role'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
