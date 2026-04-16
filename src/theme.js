// theme.js — MUI theme matching Stitch "Round Twelve" design
// Dark teal primary, peach accent, 12px roundness (standard, not extreme)
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#114B4B',
      light: '#1A6B6B',
      dark: '#0C3636',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#E4F2F2',
      light: '#F0F8F8',
      dark: '#C8E0E0',
      contrastText: '#114B4B',
    },
    success: { main: '#27AE60', light: '#E8F8EF' },
    warning: { main: '#F39C12', light: '#FEF5E7' },
    error: { main: '#E74C3C', light: '#FDEDEC' },
    background: { default: '#E4F2F2', paper: '#ffffff' },
    text: { primary: '#1A2B2B', secondary: '#5A7A7A' },
  },
  typography: {
    fontFamily: '"Lexend", "Inter", "Roboto", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-0.02em' },
    h2: { fontWeight: 700, letterSpacing: '-0.01em' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  shape: {
    borderRadius: 4, // base unit: 4px. Use multipliers in sx: 2=8px, 3=12px, 4=16px
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '10px 24px',
          fontSize: '0.938rem',
        },
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': { boxShadow: '0 4px 12px rgba(17,75,75,0.25)' },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: 'none',
          border: '1px solid rgba(17,75,75,0.06)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': { boxShadow: '0 8px 24px rgba(17,75,75,0.06)' },
        },
      },
    },
    MuiPaper: {
      styleOverrides: { root: { borderRadius: 12 } },
    },
    MuiTextField: {
      styleOverrides: {
        root: { '& .MuiOutlinedInput-root': { borderRadius: 8 } },
      },
    },
    MuiDialog: {
      styleOverrides: { paper: { borderRadius: 16 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 8, fontWeight: 500 } },
    },
    MuiDrawer: {
      styleOverrides: { paper: { borderRight: 'none', boxShadow: 'none' } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 4, height: 6 } },
    },
  },
});

export default theme;
