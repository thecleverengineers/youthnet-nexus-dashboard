
import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Business as BusinessIcon,
  Assignment as AssignmentIcon,
  Event as EventIcon,
} from '@mui/icons-material';
import { BerryLayout } from '@/components/layout/BerryLayout';
import { BerryMainCard, BerrySubCard, BerryAnalyticsCard } from '@/components/berry';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useAuth } from '@/hooks/useAuth';

export const BerryDashboard = () => {
  const { stats, isLoading } = useDashboardData();
  const { profile } = useAuth();

  if (isLoading) {
    return (
      <BerryLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <Typography>Loading Berry dashboard...</Typography>
        </Box>
      </BerryLayout>
    );
  }

  return (
    <BerryLayout>
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          component="h1" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Berry Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {profile?.full_name || 'User'}! Here's what's happening today.
        </Typography>
      </Box>

      {/* Analytics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <BerryAnalyticsCard
            title="Total Students"
            count={stats.totalStudents?.toString() || '0'}
            percentage={12}
            color="primary"
            icon={<PeopleIcon />}
            extra="Active enrollments"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <BerryAnalyticsCard
            title="Active Programs"
            count={stats.totalPrograms?.toString() || '0'}
            percentage={5}
            color="secondary"
            icon={<SchoolIcon />}
            extra="Running courses"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <BerryAnalyticsCard
            title="Job Placements"
            count={stats.activeJobs?.toString() || '0'}
            percentage={25}
            color="success"
            icon={<TrendingUpIcon />}
            extra="This quarter"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <BerryAnalyticsCard
            title="Incubation Projects"
            count={stats.totalProjects?.toString() || '0'}
            percentage={8}
            color="warning"
            icon={<BusinessIcon />}
            extra="Active startups"
          />
        </Grid>
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <BerryMainCard title="Performance Analytics" darkTitle>
            <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary" variant="h6">
                Advanced analytics charts will be displayed here
              </Typography>
            </Box>
          </BerryMainCard>
        </Grid>
        
        <Grid item xs={12} lg={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <BerrySubCard title="Quick Actions" darkTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { icon: <PeopleIcon />, title: 'Manage Students', desc: 'View and edit student records' },
                    { icon: <SchoolIcon />, title: 'Course Management', desc: 'Create and manage courses' },
                    { icon: <AssignmentIcon />, title: 'Generate Reports', desc: 'Export system reports' },
                    { icon: <EventIcon />, title: 'Schedule Events', desc: 'Plan upcoming activities' },
                  ].map((action, index) => (
                    <Box
                      key={index}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2,
                        p: 2,
                        borderRadius: 1,
                        background: 'rgba(0, 245, 255, 0.05)',
                        border: '1px solid rgba(0, 245, 255, 0.1)',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'rgba(0, 245, 255, 0.1)',
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Box sx={{ color: 'primary.main' }}>
                        {action.icon}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {action.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {action.desc}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </BerrySubCard>
            </Grid>
            
            <Grid item xs={12}>
              <BerrySubCard title="System Status" darkTitle>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {[
                    { label: 'Server Status', value: 'Online', color: 'success' },
                    { label: 'Database', value: 'Connected', color: 'success' },
                    { label: 'API Response', value: '125ms', color: 'warning' },
                    { label: 'Active Users', value: '1,247', color: 'info' },
                  ].map((item, index) => (
                    <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body2">{item.label}</Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: 600,
                          color: `${item.color}.main`,
                        }}
                      >
                        {item.value}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </BerrySubCard>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </BerryLayout>
  );
};
