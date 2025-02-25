import { Alert, Box, Button, CssBaseline, Snackbar, Tooltip } from '@mui/material';
import { Header } from './Header';
import { Footer } from './Footer';
import { useSnackbar } from '../hooks/useSnackbar';
import { useNavigate, useLocation } from 'react-router-dom';
import React from 'react';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export const Layout = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    const { openSnackbar, handleCloseSnackbar, snackbarSeverity, snackbarMessage } = useSnackbar();
    const navigate = useNavigate();
    const location = useLocation();

    const rutasSinBotonVolver = ['/', '/cambiar-contrasena', '/dashboard']; // Rutas donde no se muestra el botón "Volver"

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'transparent',
        }}>
            <CssBaseline />

            <Header isAuthenticated={isAuthenticated} />

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: { xs: 1, sm: 3 },
                    ml: { xs: 0, sm: '120px' },
                    mr: { xs: 0, sm: '120px' },
                    marginTop: '80px',
                    overflow: 'auto',
                    backgroundColor: 'transparent',
                }}
            >
                {/* Botones "Volver" y "Dashboard" condicionales */}
                {isAuthenticated && window.history.length > 1 && !rutasSinBotonVolver.includes(location.pathname) && (
                 <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
                 <Tooltip title="Volver al menú anterior" arrow>
                     <Button
                         variant="contained"
                         onClick={() => navigate(-1)}
                         sx={{
                             backgroundColor: 'rgba(0, 123, 255, 0.3)', // Fondo celeste transparente (puedes ajustar el valor)
                             color: 'white', // Texto blanco
                             fontSize: { xs: '0.75rem', sm: '0.875rem' },
                             fontWeight: 500, // Le damos un peso ligeramente mayor a la fuente
                             padding: { xs: '6px 12px', sm: '8px 16px' },
                             borderRadius: '20px',
                             boxShadow: 'none',
                             '&:hover': {
                                 backgroundColor: 'rgba(0, 123, 255, 0.5)', // Fondo más opaco al pasar el cursor
                                 transform: 'translateY(-1px)',
                             },
                         }}
                         startIcon={<ArrowBackIcon />}
                     >
                         Volver al menú anterior
                     </Button>
                 </Tooltip>
             
                 {location.pathname !== '/dashboard' && (
                     <Tooltip title="Ir al Dashboard" arrow>
                         <Button
                             variant="contained"
                             onClick={() => navigate('/dashboard')}
                             sx={{
                                 backgroundColor: 'rgba(0, 123, 255, 0.3)', // Fondo celeste transparente
                                 color: 'white', // Texto blanco
                                 fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                 fontWeight: 500, // Le damos un peso ligeramente mayor a la fuente
                                 padding: { xs: '6px 12px', sm: '8px 16px' },
                                 borderRadius: '20px',
                                 boxShadow: 'none',
                                 '&:hover': {
                                     backgroundColor: 'rgba(0, 123, 255, 0.5)', // Fondo más opaco al pasar el cursor
                                     transform: 'translateY(-1px)',
                                 },
                             }}
                             startIcon={<DashboardIcon />}
                         >
                             Dashboard
                         </Button>
                     </Tooltip>
                 )}
             </Box>
             
             
             
                
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
