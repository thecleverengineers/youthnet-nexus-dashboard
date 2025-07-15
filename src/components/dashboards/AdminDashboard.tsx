
import React from 'react';
import {
  Box,
  Grid2 as Grid,
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

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title="Total Students"
            value={stats.totalStudents.toString()}
            change="+12% from last month"
            changeType="positive"
            icon={PeopleIcon}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title="Active Programs"
            value={stats.totalPrograms.toString()}
            change="+5% from last month"
            changeType="positive"
            icon={SchoolIcon}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title="Job Placements"
            value={stats.activeJobs.toString()}
            change="+25% from last month"
            changeType="positive"
            icon={TrendingUpIcon}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatsCard
            title="Incubation Projects"
            value={stats.totalProjects.toString()}
            change="+8% from last month"
            changeType="positive"
            icon={BusinessIcon}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid xs={12} lg={8}>
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
        </Grid>
        
        <Grid xs={12} lg={4}>
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
        </Grid>
      </Grid>
    </Layout>
  );
};
