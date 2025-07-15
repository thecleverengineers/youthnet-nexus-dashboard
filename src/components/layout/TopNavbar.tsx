
import React from 'react';
import {
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Typography,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '@/hooks/useAuth';

export const TopNavbar = () => {
  const { signOut, profile } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await signOut();
    handleMenuClose();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <IconButton
        color="inherit"
        sx={{
          '&:hover': {
            boxShadow: '0 0 15px rgba(0, 245, 255, 0.5)',
          },
        }}
      >
        <Badge badgeContent={3} color="secondary">
          <NotificationsIcon />
        </Badge>
      </IconButton>

      <IconButton
        onClick={handleMenuOpen}
        sx={{
          '&:hover': {
            boxShadow: '0 0 15px rgba(255, 20, 147, 0.5)',
          },
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
          }}
        >
          {profile?.full_name?.charAt(0) || 'U'}
        </Avatar>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            minWidth: 200,
            backgroundColor: 'rgba(20, 20, 30, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0, 245, 255, 0.3)',
            borderRadius: 2,
          },
        }}
      >
        <MenuItem onClick={handleMenuClose}>
          <AccountIcon sx={{ mr: 2, color: 'primary.main' }} />
          <Box>
            <Typography variant="body2">
              {profile?.full_name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {profile?.role || 'Role'}
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogoutIcon sx={{ mr: 2, color: 'error.main' }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};
