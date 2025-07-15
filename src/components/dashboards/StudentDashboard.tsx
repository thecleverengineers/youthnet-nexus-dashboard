
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
  Button,
  LinearProgress,
} from '@mui/material';
import {
  GraduationCap,
  Briefcase,
  FileText,
  Star,
} from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { StatsCard } from '@/components/ui/stats-card';
import { useAuth } from '@/hooks/useAuth';

export const StudentDashboard = () => {
  const { profile } = useAuth();

  const studentStats = [
    { title: 'Courses Enrolled', value: '5', change: '+2 this semester', changeType: 'positive' as const, icon: GraduationCap },
    { title: 'Assignments Due', value: '3', change: 'Due this week', changeType: 'neutral' as const, icon: FileText },
    { title: 'Job Applications', value: '8', change: '+3 this month', changeType: 'positive' as const, icon: Briefcase },
    { title: 'Average Grade', value: '85%', change: '+5% improvement', changeType: 'positive' as const, icon: Star },
  ];

  const upcomingClasses = [
    { name: 'Web Development', time: '9:00 AM', instructor: 'John Doe', progress: 75 },
    { name: 'Data Analysis', time: '2:00 PM', instructor: 'Jane Smith', progress: 60 },
    { name: 'Digital Marketing', time: '4:00 PM', instructor: 'Mike Johnson', progress: 90 },
  ];

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
          Welcome back, {profile?.full_name || 'Student'}!
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Continue your learning journey
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
        {studentStats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
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
            <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
              Today's Schedule
            </Typography>
            <List>
              {upcomingClasses.map((class_, index) => (
                <ListItem key={index} sx={{ mb: 2, border: '1px solid rgba(0, 245, 255, 0.2)', borderRadius: 2 }}>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="h6">{class_.name}</Typography>
                        <Chip label={class_.time} color="primary" size="small" />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Instructor: {class_.instructor}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Typography variant="caption">Progress: {class_.progress}%</Typography>
                          <LinearProgress
                            variant="determinate"
                            value={class_.progress}
                            sx={{
                              flexGrow: 1,
                              height: 6,
                              borderRadius: 3,
                              '& .MuiLinearProgress-bar': {
                                background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  sx={{
                    background: 'linear-gradient(45deg, #00f5ff, #8b5cf6)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #8b5cf6, #00f5ff)',
                    },
                  }}
                >
                  View Assignments
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{
                    borderColor: 'primary.main',
                    color: 'primary.main',
                    '&:hover': {
                      borderColor: 'secondary.main',
                      color: 'secondary.main',
                    },
                  }}
                >
                  Browse Jobs
                </Button>
                <Button 
                  variant="outlined" 
                  fullWidth
                  sx={{
                    borderColor: 'secondary.main',
                    color: 'secondary.main',
                    '&:hover': {
                      borderColor: 'primary.main',
                      color: 'primary.main',
                    },
                  }}
                >
                  Career Resources
                </Button>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Achievements
              </Typography>
              <List>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="Course Completion"
                    secondary="Completed 3 courses this semester"
                  />
                  <Chip label="🏆" size="small" />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemText
                    primary="High Performer"
                    secondary="Maintained 85%+ average"
                  />
                  <Chip label="⭐" size="small" />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Layout>
  );
};
