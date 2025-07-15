
import React from 'react';
import { Box, BoxProps } from '@mui/material';

interface BerryGridCardProps extends BoxProps {
  children: React.ReactNode;
}

export const BerryGridCard: React.FC<BerryGridCardProps> = ({ children, ...props }) => {
  return (
    <Box {...props}>
      {children}
    </Box>
  );
};
