import {
  createTheme,
  AppBar,
  Box,
  Container,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  Typography,
} from '@mui/material';

import { SecuritiesTable } from './components/SecuritiesTable';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 600,
    },
  },
});

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Tradr
            </Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Tradr
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Your modern platform for mock securities trading
          </Typography>
          <Box sx={{ mt: 8 }}>
            <Typography variant="h5">Trade now:</Typography>
            <SecuritiesTable />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
