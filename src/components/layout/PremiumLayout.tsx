
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
  useTheme as useMuiTheme,
  useMediaQuery,
  Badge,
  Menu,
  MenuItem,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  InputBase,
  alpha,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  People as PeopleIcon,
  BusinessCenter as BusinessCenterIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  Lock as LockIcon,
  ExpandLess,
  ExpandMore,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';

interface PremiumLayoutProps {
  children: React.ReactNode;
  darkMode?: boolean;
  onThemeToggle?: () => void;
}

const menuGroups = [
  {
    title: 'Core',
    items: [
      { icon: DashboardIcon, label: 'Dashboard', route: '/dashboard' },
      { icon: AnalyticsIcon, label: 'Analytics', route: '/analytics' },
    ],
  },
  {
    title: 'Management',
    items: [
      { icon: PeopleIcon, label: 'Users', route: '/users' },
      { icon: BusinessCenterIcon, label: 'Projects', route: '/projects' },
      { icon: ScheduleIcon, label: 'Tasks', route: '/tasks' },
    ],
  },
  {
    title: 'System',
    items: [
      { icon: SettingsIcon, label: 'Settings', route: '/settings' },
      { icon: LockIcon, label: 'Access Control', route: '/access' },
    ],
  },
];

export const PremiumLayout = ({ children, darkMode = false, onThemeToggle }: PremiumLayoutProps) => {
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { signOut, profile } = useAuth();
  
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    Core: true,
    Management: false,
    System: false,
  });

  const drawerWidth = 280;

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleProfileMenuClose();
  };

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle],
    }));
  };

  const sidebarContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
          Premium Admin
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Dashboard v2.0
        </Typography>
      </Box>

      {/* Navigation */}
      <List sx={{ flexGrow: 1, p: 1 }}>
        {menuGroups.map((group) => (
          <Box key={group.title}>
            <ListItemButton
              onClick={() => toggleGroup(group.title)}
              sx={{ mb: 1 }}
            >
              <ListItemText
                primary={group.title}
                primaryTypographyProps={{
                  variant: 'overline',
                  fontWeight: 600,
                  color: 'text.secondary',
                }}
              />
              {expandedGroups[group.title] ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={expandedGroups[group.title]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {group.items.map((item) => (
                  <ListItemButton
                    key={item.label}
                    sx={{ pl: 4, mb: 0.5 }}
                    component={motion.div}
                    whileHover={{ x: 4 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <item.icon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary={item.label} />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          </Box>
        ))}
      </List>

      {/* User Panel */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ width: 40, height: 40 }}>
            {profile?.full_name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="body2" fontWeight={500}>
              {profile?.full_name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profile?.role || 'Admin'}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* App Bar */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: theme.zIndex.drawer + 1,
          ml: !isMobile && sidebarOpen ? `${drawerWidth}px` : 0,
          width: !isMobile && sidebarOpen ? `calc(100% - ${drawerWidth}px)` : '100%',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="toggle sidebar"
            onClick={toggleSidebar}
            edge="start"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Search Bar */}
          <Box
            sx={{
              position: 'relative',
              borderRadius: 1,
              backgroundColor: alpha(theme.palette.common.white, 0.15),
              '&:hover': {
                backgroundColor: alpha(theme.palette.common.white, 0.25),
              },
              marginRight: 2,
              marginLeft: 0,
              width: '100%',
              maxWidth: 400,
            }}
          >
            <Box
              sx={{
                padding: theme.spacing(0, 2),
                height: '100%',
                position: 'absolute',
                pointerEvents: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <SearchIcon />
            </Box>
            <InputBase
              placeholder="Search…"
              sx={{
                color: 'inherit',
                '& .MuiInputBase-input': {
                  padding: theme.spacing(1, 1, 1, 0),
                  paddingLeft: `calc(1em + ${theme.spacing(4)})`,
                  transition: theme.transitions.create('width'),
                  width: '100%',
                },
              }}
            />
          </Box>

          <Box sx={{ flexGrow: 1 }} />

          {/* Header Actions */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Theme Toggle */}
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={onThemeToggle}
                  icon={<Brightness7 />}
                  checkedIcon={<Brightness4 />}
                />
              }
              label=""
              sx={{ m: 0 }}
            />

            {/* Notifications */}
            <IconButton
              color="inherit"
              onClick={handleNotificationMenuOpen}
            >
              <Badge badgeContent={4} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton
              color="inherit"
              onClick={handleProfileMenuOpen}
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                {profile?.full_name?.charAt(0) || 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Sidebar */}
      <Drawer
        variant={isMobile ? 'temporary' : 'persistent'}
        anchor="left"
        open={sidebarOpen}
        onClose={isMobile ? toggleSidebar : undefined}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: !isMobile && sidebarOpen ? 0 : 0,
          mt: '64px',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Container maxWidth="xl" sx={{ py: 3 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Container>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            mt: 'auto',
            py: 2,
            px: 3,
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          }}
        >
          <Typography variant="body2" color="text.secondary" align="center">
            © 2025 Premium Admin Dashboard. All rights reserved.
          </Typography>
        </Box>
      </Box>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleProfileMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 200 },
        }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <AccountIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationAnchor}
        open={Boolean(notificationAnchor)}
        onClose={handleNotificationMenuClose}
        PaperProps={{
          sx: { mt: 1, minWidth: 300, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">New user registration</Typography>
            <Typography variant="caption" color="text.secondary">
              2 minutes ago
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleNotificationMenuClose}>
          <Box>
            <Typography variant="body2">System update completed</Typography>
            <Typography variant="caption" color="text.secondary">
              1 hour ago
            </Typography>
          </Box>
        </MenuItem>
      </Menu>
    </Box>
  );
};
