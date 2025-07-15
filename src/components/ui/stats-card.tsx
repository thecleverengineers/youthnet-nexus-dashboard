
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  LinearProgress,
} from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: SvgIconComponent;
}

export const StatsCard = ({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon 
}: StatsCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'success.main';
      case 'negative': return 'error.main';
      default: return 'text.secondary';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 0 30px rgba(0, 245, 255, 0.4)',
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyItems: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
            {title}
          </Typography>
          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.2), rgba(139, 92, 246, 0.2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon sx={{ color: 'primary.main', fontSize: 20 }} />
          </Box>
        </Box>

        <Typography 
          variant="h4" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            mb: 1,
            background: 'linear-gradient(45deg, #00f5ff, #ff1493)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {value}
        </Typography>

        <Typography 
          variant="body2" 
          sx={{ 
            color: getChangeColor(),
            fontWeight: 500,
            mb: 2,
          }}
        >
          {change}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={75}
          sx={{
            height: 4,
            borderRadius: 2,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(45deg, #00f5ff, #8b5cf6)',
              borderRadius: 2,
            },
          }}
        />
      </CardContent>
    </Card>
  );
};
