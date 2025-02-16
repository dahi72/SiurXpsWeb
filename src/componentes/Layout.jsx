import { Alert, Box, Button, CssBaseline, Snackbar } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSnackbar } from '../hooks/useSnackbar';
import { useNavigate, useLocation } from 'react-router-dom'; // Importa useLocation
import React from 'react';

export const Layout = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    const { openSnackbar, handleCloseSnackbar, snackbarSeverity, snackbarMessage } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation(); // Obtiene la ubicación actual

    // Array de rutas donde no quieres mostrar el botón "Volver"
    const rutasSinBotonVolver = ['/', '/cambiar-contraena', '/dashboard']; // Agrega aquí las rutas que necesites

    return (
      <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: 'transparent', // El fondo principal es transparente para no interferir con el contenido
      }}>
          <CssBaseline />
          
          <Header isAuthenticated={isAuthenticated} />
          
          <Box
              component="main"
              sx={{
                  flexGrow: 1,
                  p: { xs: 1, sm: 3 }, // Menos padding en pantallas pequeñas
                  ml: { xs: 0, sm: '120px' }, // Sin margen en dispositivos pequeños
                  mr: { xs: 0, sm: '120px' }, // Sin margen en dispositivos pequeños
                  marginTop: '80px',
                  overflow: 'auto',
                  backgroundColor: 'transparent', // Fondo transparente para el contenido
              }}
          >
              {/* Botón "Volver" condicional */}
              {isAuthenticated && window.history.length > 1 && !rutasSinBotonVolver.includes(location.pathname) && ( // Nueva condición
                  <Button
                      variant="outlined"
                      onClick={() => navigate(-1)}
                      sx={{
                          color: "white", 
                          borderColor: "white",
                          fontSize: { xs: '0.8rem', sm: '1rem' }, // Reducir el tamaño del botón en pantallas pequeñas
                          padding: { xs: '4px 10px', sm: '6px 16px' }, // Ajustar el padding en pantallas pequeñas
                          marginBottom: 2, // Espacio debajo del botón
                      }}
                  >
                      {"< Volver"}
                  </Button>
              )}

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
