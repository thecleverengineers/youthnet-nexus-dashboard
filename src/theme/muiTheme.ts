
import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff', // neon cyan
      light: '#66ffff',
      dark: '#00bcd4',
    },
    secondary: {
      main: '#ff1493', // neon pink
      light: '#ff69b4',
      dark: '#c7185d',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(20, 20, 30, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
    },
    success: {
      main: '#00ff41', // neon green
    },
    warning: {
      main: '#ffff00', // neon yellow
    },
    error: {
      main: '#ff073a', // neon red
    },
  },
  typography: {
    fontFamily: '"Orbitron", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      textShadow: '0 0 10px #00f5ff',
    },
    h2: {
      fontWeight: 600,
      textShadow: '0 0 8px #00f5ff',
    },
    h3: {
      fontWeight: 600,
      textShadow: '0 0 6px #00f5ff',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 20, 30, 0.8)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 245, 255, 0.3)',
          borderRadius: '16px',
          boxShadow: '0 0 20px rgba(0, 245, 255, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 0 30px rgba(0, 245, 255, 0.4)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: '0 0 10px rgba(0, 245, 255, 0.3)',
          '&:hover': {
            boxShadow: '0 0 20px rgba(0, 245, 255, 0.6)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(20, 20, 30, 0.9)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(0, 245, 255, 0.3)',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: 'rgba(15, 15, 25, 0.95)',
          backdropFilter: 'blur(15px)',
          borderRight: '1px solid rgba(0, 245, 255, 0.3)',
        },
      },
    },
  },
});
