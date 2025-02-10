import { Typography, Paper, Box, Container, Divider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { opcionesCoordinador, opcionesViajero } from './constantes';
import { Home as HomeIcon } from '@mui/icons-material';

const Dashboard = () => {
    const rol = localStorage.getItem("rol");
    const navigate = useNavigate();

    const handleClick = (path) => {
        if (path) navigate(path);
    };
    
    const opciones = rol === 'Coordinador' ? opcionesCoordinador : opcionesViajero;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2,
                justifyContent: 'center'
            }}>
                <HomeIcon sx={{ mr: 2, fontSize: 32 }} />
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Bienvenido a SiurXps
                </Typography>
            </Box>

            <Paper 
                elevation={3} 
               
                sx={{ 
                    p: { xs: 2, sm: 4 },
                    transition: 'transform 0.3s ease',
                    '&:hover': { 
                        transform: 'scale(1.01)',
                        boxShadow: 6 
                    },
                    background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
                }}
            >
                <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
                    Dashboard
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)'
                        },
                        gap: 3,
                        mt: 2
                    }}
                >
                    {opciones.map((opcion, index) => (
                        <Paper
                            key={index}
                            onClick={() => handleClick(opcion.action)}
                            elevation={2}
                            sx={{
                                p: { xs: 2, sm: 4 },
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: 2,
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: 'background.paper',
                                borderRadius: 2,
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    '& .MuiSvgIcon-root': {
                                        transform: 'scale(1.1)',
                                        color: 'primary.main'
                                    },
                                    '& .MuiTypography-root': {
                                        color: 'primary.main'
                                    }
                                }
                            }}
                        >
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    p: 2,
                                    borderRadius: '50%',
                                    backgroundColor: 'primary.light',
                                    color: 'primary.main',
                                    transition: 'all 0.3s ease',
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 32,
                                        transition: 'all 0.3s ease'
                                    }
                                }}
                            >
                                {opcion.icon}
                            </Box>
                            <Typography
                                variant="h6"
                                sx={{
                                    fontWeight: 'medium',
                                    textAlign: 'center',
                                    transition: 'color 0.3s ease'
                                }}
                            >
                                {opcion.label}
                            </Typography>
                        </Paper>
                    ))}
                </Box>
            </Paper>
        </Container>
    );
};

export default Dashboard;