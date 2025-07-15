
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from './components/ui/theme-provider';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import { BerryDashboard } from './pages/BerryDashboard';
import { PremiumDashboard } from './pages/PremiumDashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ThemeProvider>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={
                <ProtectedRoute>
                  <PremiumDashboard />
                </ProtectedRoute>
              } />
              <Route path="/berry" element={
                <ProtectedRoute>
                  <BerryDashboard />
                </ProtectedRoute>
              } />
              <Route path="/legacy" element={
                <ProtectedRoute>
                  <RoleBasedRoute />
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
