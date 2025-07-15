
import React from 'react';
import { Grid, GridProps } from '@mui/material';

interface BerryGridCardProps extends GridProps {
  children: React.ReactNode;
}

export const BerryGridCard: React.FC<BerryGridCardProps> = ({ children, ...props }) => {
  return (
    <Grid item {...props}>
      {children}
    </Grid>
  );
};
