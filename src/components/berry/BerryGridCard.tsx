
import React from 'react';
import { Grid2, Grid2Props } from '@mui/material';

interface BerryGridCardProps extends Grid2Props {
  children: React.ReactNode;
}

export const BerryGridCard: React.FC<BerryGridCardProps> = ({ children, ...props }) => {
  return (
    <Grid2 {...props}>
      {children}
    </Grid2>
  );
};
