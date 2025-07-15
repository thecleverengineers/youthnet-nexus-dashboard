
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  Box,
} from '@mui/material';

interface BerryMainCardProps {
  title?: string;
  secondary?: React.ReactNode;
  children: React.ReactNode;
  content?: boolean;
  contentClass?: string;
  darkTitle?: boolean;
  sx?: object;
  elevation?: number;
}

export const BerryMainCard: React.FC<BerryMainCardProps> = ({
  title,
  secondary,
  children,
  content = true,
  contentClass = '',
  darkTitle = false,
  sx = {},
  elevation = 1,
  ...others
}) => {
  return (
    <Card
      elevation={elevation}
      sx={{
        border: '1px solid rgba(0, 245, 255, 0.1)',
        borderRadius: 2,
        ...sx,
      }}
      {...others}
    >
      {!darkTitle && title && (
        <CardHeader
          sx={{
            p: 2.5,
            '& .MuiCardHeader-content': {
              overflow: 'hidden',
            },
          }}
          title={
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>
          }
          action={secondary}
        />
      )}
      {darkTitle && title && (
        <CardHeader
          sx={{
            p: 2.5,
            background: 'linear-gradient(45deg, rgba(0, 245, 255, 0.1), rgba(139, 92, 246, 0.1))',
          }}
          title={
            <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {title}
            </Typography>
          }
          action={secondary}
        />
      )}

      {title && <Divider sx={{ borderColor: 'rgba(0, 245, 255, 0.2)' }} />}

      {content && (
        <CardContent sx={{ p: 2.5 }} className={contentClass}>
          {children}
        </CardContent>
      )}
      {!content && children}
    </Card>
  );
};
