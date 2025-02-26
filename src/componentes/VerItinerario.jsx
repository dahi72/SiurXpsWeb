import React, { useEffect, useState, useCallback } from 'react';
import { 
    Box, 
    Typography, 
    Paper,  
    Button, 
    Snackbar, 
    Alert,
    Container,
    Divider,
    CircularProgress,
   
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

const VerItinerario = () => {
    const [itinerarios, setItinerarios] = useState([]);
    const [gruposDeViaje, setGruposDeViaje] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;
    const [openSnackbar, setOpenSnackbar] = useState(false);  
    const [snackbarMessage, setSnackbarMessage] = useState(''); 

    const fetchGruposDeViaje = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem('id')}/grupos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error al obtener grupos de viaje');
            const data = await response.json();
            setGruposDeViaje(data);
            return data;
        } catch (error) {
            setError(error.message);
            return [];
        }
    }, [baseUrl]);

    const fetchItinerarios = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${baseUrl}/Itinerario/listado`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Error al obtener itinerarios');
            return await response.json();
        } catch (error) {
            setError(error.message);
            return [];
        }
    }, [baseUrl]);

    useEffect(() => {
        const obtenerItinerarios = async () => {
            setLoading(true);
            const grupos = await fetchGruposDeViaje();
            const itinerarios = await fetchItinerarios();
            const itinerariosFiltrados = itinerarios.filter(itinerario =>
                grupos.some(grupo => grupo.id === itinerario.grupoDeViajeId)
            );
            setItinerarios(itinerariosFiltrados);
            setLoading(false);
        };
        obtenerItinerarios();
    }, [fetchGruposDeViaje, fetchItinerarios]);

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar este itinerario?')) return;
        try {
            const response = await fetch(`${baseUrl}/Itinerario/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            });
             if (!response.ok){
                const errorData = await response.json(); 
            throw new Error(errorData.message || 'Error al eliminar el itinerario');
            }
            setItinerarios(itinerarios.filter(itinerario => itinerario.id !== id));
            setSuccess(true);
            setMessage('Itinerario eliminado exitosamente');
        } catch (error) {
            setError(error.message);
        }
    };

    const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');
    const handleVerEventos = async (itinerarioId) => {
        const token = localStorage.getItem('token');
        
        try {
            const response = await fetch(`${baseUrl}/Itinerario/${itinerarioId}/eventos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });
    
            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }
    
            // Comprobar si la respuesta está vacía antes de hacer .json()
            const responseText = await response.text();  // Obtener la respuesta como texto
    
            if (responseText) {
                // Si hay datos, parsearlos
                const eventos = JSON.parse(responseText);
                
                if (eventos.length === 0) {
                    setSnackbarMessage('Este itinerario no tiene eventos asociados aún. Para agregar eventos, haz clic en "Nuevo Evento".');
                    setOpenSnackbar(true);  
                } else {
                    navigate(`/itinerario/${itinerarioId}/eventos`);
                }
            } else {
              
                setSnackbarMessage('Este itinerario no tiene eventos asociados aún. Para agregar eventos, haz clic en "Nuevo Evento".');
                setOpenSnackbar(true);  
            }
    
        } catch (error) {
            console.error('Error al verificar eventos:', error);
            setSnackbarMessage('El itinerario aún no tiene eventos asociados, para agregar haga click en editar');
            setOpenSnackbar(true);  
        }
    };
    
    return (
        <Container maxWidth="lg">
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 4,
                borderBottom: 1,
                borderColor: 'divider',
                pb: 2,
                justifyContent: 'center',
                width: '100%'
            }}>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
                    Mis Itinerarios
                </Typography>
            </Box>

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && itinerarios.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                    <Typography variant="h6" color="text.secondary">
                        No hay itinerarios para mostrar.
                    </Typography>
                </Paper>
            ) : (
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
                    gap: 3
                }}>
                    {itinerarios.map((itinerario) => {
                        const grupo = gruposDeViaje.find(g => g.id === itinerario.grupoDeViajeId);
                        return (
                            <Paper 
                                key={itinerario.id} 
                                elevation={3} 
                                sx={{ 
                                    p: 3, 
                                    transition: 'transform 0.3s ease', 
                                    '&:hover': { 
                                        transform: 'scale(1.03)', 
                                        boxShadow: 6 
                                    }
                                }}
                            >
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                {`Itinerario del grupo: ${grupo ? grupo.nombre : 'Grupo Desconocido'}`}
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Typography variant="body2" sx={{ mb: 2 }}>
                                    <strong>Fechas:</strong><br />
                                    {formatFechaCorta(itinerario.fechaInicio)} - {formatFechaCorta(itinerario.fechaFin)}
                                </Typography>

                                <Box sx={{ 
                                    display: 'flex', 
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    mt: 'auto' 
                                }}>
                                   <Button
    variant="outlined"
    startIcon={<VisibilityIcon />}
    onClick={() => handleVerEventos(itinerario.id)}  // Llamamos a la función aquí
    size="small"
    fullWidth
    sx={{
        '&:hover': { backgroundColor: 'primary.light', color: 'white' }
    }}
>
    Ver Eventos
</Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => navigate(`/crear-eventos/${itinerario.id}`)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '&:hover': { backgroundColor: 'info.light', color: 'white' }
                                        }}
                                    >
                                        Nuevo Evento
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        startIcon={<DeleteIcon />}
                                        color="error"
                                        onClick={() => handleEliminar(itinerario.id)}
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '&:hover': { backgroundColor: 'error.light', color: 'white' }
                                        }}
                                    >
                                        Eliminar
                                    </Button>
                                    <Button
    variant="outlined"
    startIcon={<GroupIcon />}
    onClick={() => navigate(`/usuariosActividadOpcional/${itinerario.id}`)}
    size="small"
    fullWidth
    sx={{
        '&:hover': { backgroundColor: 'secondary.light', color: 'white' }
    }}
>
    Actividades Opcionales
</Button>
                                </Box>
                            </Paper>
                        );
                    })}
                </Box>
            )}
            <Snackbar
    open={openSnackbar} 
    autoHideDuration={4000} 
    onClose={() => setOpenSnackbar(false)}  
>
    <Alert onClose={() => setOpenSnackbar(false)} severity="info">
        {snackbarMessage} 
    </Alert>
</Snackbar>

            <Snackbar 
                open={success} 
                autoHideDuration={3000} 
                onClose={() => setSuccess(false)}
            >
                <Alert severity="success">{message}</Alert>
            </Snackbar>

            <Snackbar 
                open={Boolean(error)} 
                autoHideDuration={3000} 
                onClose={() => setError(null)}
            >
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Container>
    );
};

export default VerItinerario;
