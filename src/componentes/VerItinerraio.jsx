import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Box, Container, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const VerItinerario = () => {

    const [itinerarios, setItinerarios] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;
    const [gruposDeViaje, setGruposDeViaje] = useState({});
    const token = localStorage.getItem('token');

    useEffect(() => {

        const fetchItinerarios = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/listado`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
        
                if (!response.ok) {
                    throw new Error(`Error ${response.status}: ${response.statusText}`);
                }
        
                const data = await response.json();
                setItinerarios(data); 
                
                for (const itinerario of data) {
                    if (itinerario.grupoDeViajeId) {
                        const grupoResponse = await fetch(`${baseUrl}/GrupoDeViaje/${itinerario.grupoDeViajeId}`, {
                            method: 'GET',
                            headers: {
                                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                                'Content-Type': 'application/json'
                            }
                        });
        
                        if (!grupoResponse.ok) {
                            throw new Error(`Error ${grupoResponse.status}: ${grupoResponse.statusText}`);
                        }
        
                        const grupoData = await grupoResponse.json();
                        setGruposDeViaje(prev => ({
                            ...prev,
                            [itinerario.grupoDeViajeId]: grupoData.nombre
                        }));
                    }
                }
            } catch (error) {
                console.error('Error al obtener itinerarios:', error);
                setSnackbarMessage('Error al cargar itinerarios');
                setOpenSnackbar(true);
                
            }
        };
        

        fetchItinerarios();
    }, [token, baseUrl, setOpenSnackbar, setSnackbarMessage]);

    
    const handleVerDetalles = (id) => {
        navigate(`/itinerario/${id}/eventos`);
    };
    const handleEditar = (id) => {
        navigate(`/itinerario/${id}/editarItinerario`); 
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }
        setOpenSnackbar(false);
      };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este itinerario?')) {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer  ${localStorage.getItem('token')}`, 
                        'Content-Type': 'application/json'
                    }

                });

                if (response.ok) {
                    setItinerarios(itinerarios.filter(itinerario => itinerario.id !== id));
                    setSnackbarMessage('Itinerario eliminado exitosamente');
                    setOpenSnackbar(true);
                } else {
                    setSnackbarMessage('Error al eliminar el itinerario');
                    setOpenSnackbar(true);
                }
            } catch (error) {
                console.error('Error al eliminar itinerario:', error);
                setSnackbarMessage('Error al eliminar el itinerario');
                setOpenSnackbar(true);
            }
        }
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };



    return (
        <Container maxWidth="lg">
            <Header />
            <Box sx={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Mis Itinerarios
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {itinerarios.length === 0 ? (
                        <Typography variant="body1">No hay itinerarios para mostrar.</Typography>
                    ) : (
                        itinerarios.map((itinerario) => (
                            <Paper key={itinerario.id} elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 1 }}>
                                    {gruposDeViaje[itinerario.grupoDeViajeId]
                                        ? `Itinerario de ${gruposDeViaje[itinerario.grupoDeViajeId]}`
                                        : 'Cargando nombre del grupo...'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', marginBottom: 1 }}>
                                    <strong>Fecha de Inicio:</strong> {formatDate(itinerario.fechaInicio)}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#666', marginBottom: 2 }}>
                                    <strong>Fecha de Fin:</strong> {formatDate(itinerario.fechaFin)}
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => handleVerDetalles(itinerario.id)}
                                    sx={{ marginTop: 2, marginRight: 1 }}
                                >
                                    Ver Detalles
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleEditar(itinerario.id)}
                                    sx={{ marginTop: 2, marginRight: 1 }}
                                >
                                    Editar
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="error"
                                    onClick={() => handleEliminar(itinerario.id)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Eliminar
                                </Button>
                            </Paper>
                        ))
                    )}
                </Box>
            </Box>
            {/* Agregar Snackbar para mostrar mensajes */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={3000} // 3 segundos
                message={snackbarMessage}
                onClose={handleCloseSnackbar}
            />
        </Container>
    );
};

export default VerItinerario;
