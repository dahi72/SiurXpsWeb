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
                        {/* Botón "Volver al menú anterior" con Tooltip */}
                        <Tooltip title="Volver al menú anterior" arrow>
                            <Button
                                variant="contained" // Usamos "contained" para el fondo completo
                                onClick={() => navigate(-1)}
                                sx={{
                                    backgroundColor: 'primary.main', // Fondo primario
                                    color: 'white', // Texto blanco
                                    fontSize: { xs: '0.8rem', sm: '1rem' },
                                    padding: { xs: '8px 16px', sm: '10px 20px' },
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark', // Fondo primario más oscuro al pasar el cursor
                                        boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                        transform: 'translateY(-2px)',
                                    },
                                }}
                                startIcon={<ArrowBackIcon />}
                            >
                                Volver al menú anterior
                            </Button>
                        </Tooltip>

                        {/* Botón "Dashboard" con Tooltip (solo si no está en el dashboard) */}
                        {location.pathname !== '/dashboard' && (
                            <Tooltip title="Ir al Dashboard" arrow>
                                <Button
                                    variant="contained" // Usamos "contained" para el fondo completo
                                    onClick={() => navigate('/dashboard')}
                                    sx={{
                                        backgroundColor: 'primary.main', // Fondo primario
                                        color: 'white', // Texto blanco
                                        fontSize: { xs: '0.8rem', sm: '1rem' },
                                        padding: { xs: '8px 16px', sm: '10px 20px' },
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            backgroundColor: 'primary.dark', // Fondo primario más oscuro al pasar el cursor
                                            boxShadow: '0 6px 8px rgba(0, 0, 0, 0.2)',
                                            transform: 'translateY(-2px)',
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
