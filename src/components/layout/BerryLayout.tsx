
import React, { useState } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  IconButton,
  Container,
  Avatar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { AppSidebar } from './AppSidebar';
import { TopNavbar } from './TopNavbar';

interface BerryLayoutProps {
  children: React.ReactNode;
}

export const BerryLayout = ({ children }: BerryLayoutProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const drawerWidth = 280;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          background: 'linear-gradient(135deg, rgba(20, 20, 30, 0.95) 0%, rgba(25, 25, 35, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.2)',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            edge="start"
            sx={{ 
              mr: 2,
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                boxShadow: '0 0 15px rgba(0, 245, 255, 0.5)',
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar
              sx={{
                width: 32,
                height: 32,
                mr: 2,
                background: 'linear-gradient(45deg, #ff1493, #8b5cf6)',
                boxShadow: '0 0 15px rgba(255, 20, 147, 0.3)',
              }}
            >
              Y
            </Avatar>
            <Box>
              <Typography 
                variant="h6" 
                component="div" 
                sx={{ 
                  fontWeight: 700,
                  background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                YouthNet Berry
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.7rem',
                }}
              >
                Advanced Dashboard System
              </Typography>
            </Box>
          </Box>
          
          <TopNavbar />
        </Toolbar>
      </AppBar>

      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={sidebarOpen}
        onClose={isMobile ? toggleSidebar : undefined}
        sx={{
          width: sidebarOpen ? drawerWidth : 0,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            mt: '64px',
            height: 'calc(100vh - 64px)',
            background: 'linear-gradient(180deg, rgba(15, 15, 25, 0.98) 0%, rgba(25, 25, 35, 0.98) 100%)',
            borderRight: '1px solid rgba(0, 245, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          },
        }}
      >
        <AppSidebar />
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: !isMobile && sidebarOpen ? `${drawerWidth}px` : 0,
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
          background: 'linear-gradient(135deg, rgba(10, 10, 15, 0.95) 0%, rgba(20, 20, 30, 0.95) 100%)',
          transition: theme.transitions.create(['margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3, px: { xs: 2, sm: 3 } }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
};
