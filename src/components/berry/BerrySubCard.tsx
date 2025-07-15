
import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
} from '@mui/material';

interface BerrySubCardProps {
  children: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  darkTitle?: boolean;
  secondary?: React.ReactNode;
  sx?: object;
  contentSX?: object;
  title?: string;
}

export const BerrySubCard: React.FC<BerrySubCardProps> = ({
  children,
  content = true,
  contentClass = '',
  darkTitle = false,
  secondary,
  sx = {},
  contentSX = {},
  title,
  ...others
}) => {
  return (
    <Card
      sx={{
        border: '1px solid rgba(0, 245, 255, 0.1)',
        borderRadius: 1.5,
        background: 'rgba(20, 20, 30, 0.6)',
        ...sx,
      }}
      {...others}
    >
      {!darkTitle && title && (
        <Box sx={{ p: 2, pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              {title}
            </Typography>
            {secondary}
          </Box>
        </Box>
      )}
      {darkTitle && title && (
        <Box sx={{ p: 2, pb: 1, background: 'rgba(0, 245, 255, 0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {title}
            </Typography>
            {secondary}
          </Box>
        </Box>
      )}

      {content && (
        <CardContent sx={{ p: 2, pt: title ? 1 : 2, ...contentSX }} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
};
