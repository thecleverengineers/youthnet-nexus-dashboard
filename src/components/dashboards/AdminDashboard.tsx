
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
} from '@mui/icons-material';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/ui/stats-card';
import { useDashboardData } from '@/hooks/useDashboardData';

export const AdminDashboard = () => {
  const { stats, recentActivities, isLoading } = useDashboardData();

  if (isLoading) {
    return (
      <Layout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading dashboard...</Typography>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            textShadow: '0 0 20px rgba(0, 245, 255, 0.5)',
          }}
        >
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comprehensive overview of YouthNet operations
        </Typography>
      </Box>

      {/* Stats Cards Grid */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 3,
          mb: 4
        }}
      >
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toString()}
          change="+12% from last month"
          changeType="positive"
          icon={PeopleIcon}
        />
        <StatsCard
          title="Active Programs"
          value={stats.totalPrograms.toString()}
          change="+5% from last month"
          changeType="positive"
          icon={SchoolIcon}
        />
        <StatsCard
          title="Job Placements"
          value={stats.activeJobs.toString()}
          change="+25% from last month"
          changeType="positive"
          icon={TrendingUpIcon}
        />
        <StatsCard
          title="Incubation Projects"
          value={stats.totalProjects.toString()}
          change="+8% from last month"
          changeType="positive"
          icon={BusinessIcon}
        />
      </Box>

      {/* Main Content Grid */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3
        }}
      >
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              System Performance
            </Typography>
            <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">
                Analytics charts will be displayed here
              </Typography>
            </Box>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.slice(0, 5).map((activity, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemText
                    primary={
                      <Typography variant="body2">
                        {activity.description || 'System activity'}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Chip 
                          label={activity.type || 'general'} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                        <Typography variant="caption" color="text.secondary">
                          {new Date().toLocaleDateString()}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
      </Box>
    </Layout>
  );
};
