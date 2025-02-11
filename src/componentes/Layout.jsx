import { Alert, Box, Button, CssBaseline, Snackbar} from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSnackbar } from '../hooks/useSnackbar';
import { useLocation, useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';

export const Layout = ({ children }) => {
  
 const isAuthenticated = !!localStorage.getItem("token");
  const { openSnackbar, handleCloseSnackbar, snackbarSeverity, snackbarMessage } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('lastPath', location.pathname); // Guardamos la ruta actual en localStorage
    }
  }, [location, isAuthenticated]);
   useEffect(() => {
    const lastPath = localStorage.getItem('lastPath');
    if (isAuthenticated && lastPath && lastPath !== location.pathname) {
      navigate(lastPath); // Redirigimos a la última ruta guardada
    }
  }, [isAuthenticated, location.pathname, navigate]);

  // Comprobamos si estamos en la ruta de Dashboard
  const isDashboard = location.pathname === '/dashboard';

  

 
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    }}>
      <CssBaseline />

      <Header isAuthenticated={isAuthenticated} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { xs: '14px', sm: '120px' },
          mr: { xs: '14px', sm: '120px' },
          marginTop: '80px',
          overflow: 'auto', 
        }}
      >
        {!isDashboard && isAuthenticated && location.pathname !== '/' && 
          <Button 
              variant="outlined" 
              onClick={() => navigate(-1)} 
              sx={{ color: "white", borderColor: "white" }} 
          >
            {"< Volver"}
          </Button>
        }
        {children}
        <Snackbar
            open={openSnackbar} 
            autoHideDuration={4000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={handleCloseSnackbar} 
                severity={snackbarSeverity}
                sx={{ width: '100%' }}
            >
                {snackbarMessage}
            </Alert>
        </Snackbar>
      </Box>
      <Footer />
    </Box>
  );
};
