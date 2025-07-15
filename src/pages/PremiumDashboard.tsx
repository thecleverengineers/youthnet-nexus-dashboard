
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  IconButton,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
} from '@mui/material';
import {
  TrendingUp,
  People,
  AttachMoney,
  Assignment,
  MoreVert,
  ArrowUpward,
  ArrowDownward,
} from '@mui/icons-material';
import { PremiumLayout } from '@/components/layout/PremiumLayout';
import { useTheme } from '@/components/ui/theme-provider';
import { motion } from 'framer-motion';

const StatCard = ({
  title,
  value,
  icon: Icon,
  change,
  changeType,
}: {
  title: string;
  value: string;
  icon: any;
  change: string;
  changeType: 'positive' | 'negative';
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              {changeType === 'positive' ? (
                <ArrowUpward sx={{ fontSize: 16, color: 'success.main' }} />
              ) : (
                <ArrowDownward sx={{ fontSize: 16, color: 'error.main' }} />
              )}
              <Typography
                variant="caption"
                sx={{
                  color: changeType === 'positive' ? 'success.main' : 'error.main',
                  fontWeight: 500,
                }}
              >
                {change}
              </Typography>
            </Box>
          </Box>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              width: 56,
              height: 56,
            }}
          >
            <Icon />
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  </motion.div>
);

export const PremiumDashboard = () => {
  const { theme, setTheme, setIsPremiumTheme } = useTheme();

  React.useEffect(() => {
    // Set premium theme when this component mounts
    setIsPremiumTheme(true);
  }, [setIsPremiumTheme]);

  const handleThemeToggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const stats = [
    {
      title: 'Total Users',
      value: '12.4K',
      icon: People,
      change: '+12.5%',
      changeType: 'positive' as const,
    },
    {
      title: 'Monthly Revenue',
      value: '$132K',
      icon: AttachMoney,
      change: '+8.2%',
      changeType: 'positive' as const,
    },
    {
      title: 'Active Projects',
      value: '48',
      icon: Assignment,
      change: '+5.1%',
      changeType: 'positive' as const,
    },
    {
      title: 'Growth Rate',
      value: '24%',
      icon: TrendingUp,
      change: '-2.1%',
      changeType: 'negative' as const,
    },
  ];

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'Created new project',
      time: '2 hours ago',
      avatar: 'JD',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'Updated user profile',
      time: '4 hours ago',
      avatar: 'JS',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'Completed task review',
      time: '6 hours ago',
      avatar: 'MJ',
    },
  ];

  return (
    <PremiumLayout darkMode={theme === 'dark'} onThemeToggle={handleThemeToggle}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
          Premium Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back! Here's what's happening with your business today.
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
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </Box>

      {/* Charts and Content Grid */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            lg: '2fr 1fr'
          },
          gap: 3,
          mb: 3
        }}
      >
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  User Growth
                </Typography>
                <IconButton size="small">
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Chart component will be rendered here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivities.map((activity) => (
                  <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'primary.main' }}>
                        {activity.avatar}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={activity.user}
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {activity.action}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {activity.time}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </motion.div>
      </Box>

      {/* Bottom Section Grid */}
      <Box 
        sx={{ 
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)'
          },
          gap: 3
        }}
      >
        {/* Project Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Project Timeline
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { name: 'Website Redesign', progress: 75, status: 'In Progress' },
                  { name: 'Mobile App', progress: 45, status: 'Development' },
                  { name: 'API Integration', progress: 90, status: 'Testing' },
                ].map((project, index) => (
                  <Box key={index}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="body2" fontWeight={500}>
                        {project.name}
                      </Typography>
                      <Chip
                        label={project.status}
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={project.progress}
                      sx={{ height: 6, borderRadius: 3 }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {project.progress}% Complete
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traffic Channels */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Traffic Channels
              </Typography>
              <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography color="text.secondary">
                  Pie chart component will be rendered here
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Box>
    </PremiumLayout>
  );
};
