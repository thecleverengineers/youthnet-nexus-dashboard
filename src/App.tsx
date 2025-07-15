
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from './theme/muiTheme';
import { AuthProvider } from './hooks/useAuth';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { RoleBasedRoute } from './components/auth/RoleBasedRoute';
import { BerryDashboard } from './pages/BerryDashboard';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={
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
