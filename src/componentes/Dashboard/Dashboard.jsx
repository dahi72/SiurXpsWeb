import { Typography, Paper, Box} from '@mui/material';
import { useNavigate } from "react-router-dom";
import { opcionesCoordinador, opcionesViajero } from './constantes';


const Dashboard = () => {
    const rol = localStorage.getItem("rol");
   
    const navigate = useNavigate();

    const handleClick = (path) => {
        if (path) navigate(path);
    };
    
    const opciones = rol === 'Coordinador' ? opcionesCoordinador : opcionesViajero;

    return  (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundImage: 'url(/Fondo.jpeg)', 
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    padding: '2rem'
                }}
            >
                <Box
                    sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        borderRadius: '10px',
                        padding: '2rem',
                        textAlign: 'center'
                    }}
                >
                    <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
                        Bienvenido a SiurXps
                    </Typography>
                  
                    <Box
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
                            gap: 2
                        }}
                    >
                        {opciones.map((opcion, index) => (
                            <Paper
                                key={index}
                                sx={{
                                    padding: 2,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    backgroundColor: '#E3F2FD',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                    cursor: 'pointer',
                                    '&:hover': { backgroundColor: '#BBDEFB' }
                                }}
                                onClick={() => handleClick(opcion.action)}
                            >
                                {opcion.icon}
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    {opcion.label}
                                </Typography>
                            </Paper>
                        ))}
                    </Box>
                </Box>
            </Box>
    );
};

export default Dashboard;
