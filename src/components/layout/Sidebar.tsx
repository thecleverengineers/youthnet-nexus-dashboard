
import React from 'react';
import { ResponsiveSidebar } from './ResponsiveSidebar';

// Backward compatibility wrapper - maintains the same interface
export const Sidebar = () => {
  return <ResponsiveSidebar isOpen={true} setIsOpen={() => {}} />;
};
