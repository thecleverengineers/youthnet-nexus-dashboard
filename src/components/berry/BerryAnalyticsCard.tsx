
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
} from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface BerryAnalyticsCardProps {
  title: string;
  count: string;
  percentage?: number;
  isLoss?: boolean;
  extra?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  icon?: React.ReactNode;
}

export const BerryAnalyticsCard: React.FC<BerryAnalyticsCardProps> = ({
  title,
  count,
  percentage,
  isLoss = false,
  extra,
  color = 'primary',
  icon,
}) => {
  return (
    <Card sx={{ 
      border: '1px solid rgba(0, 245, 255, 0.1)',
      borderRadius: 2,
      background: 'rgba(20, 20, 30, 0.8)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 25px rgba(0, 245, 255, 0.2)',
      },
    }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" sx={{ fontWeight: 500, mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ 
              fontWeight: 700, 
              mb: 1,
              background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {count}
            </Typography>
            {extra && (
              <Typography variant="caption" color="text.secondary">
                {extra}
              </Typography>
            )}
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            {icon && (
              <Avatar sx={{ 
                width: 44, 
                height: 44,
                background: `linear-gradient(45deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))`,
                color: 'primary.main',
              }}>
                {icon}
              </Avatar>
            )}
            
            {percentage !== undefined && (
              <Chip
                variant="outlined"
                size="small"
                icon={isLoss ? <TrendingDown /> : <TrendingUp />}
                label={`${percentage}%`}
                color={isLoss ? 'error' : 'success'}
                sx={{
                  '& .MuiChip-icon': {
                    fontSize: 16,
                  },
                }}
              />
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};
