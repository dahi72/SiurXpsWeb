import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import { useSnackbar } from '../hooks/useSnackbar';

const VerItinerario = () => {
    const [itinerarios, setItinerarios] = useState([]);
    const { setOpenSnackbar, setSnackbarMessage } = useSnackbar();
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchItinerarios = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/listado`); 
                const data = await response.json();
                setItinerarios(data); 
            } catch (error) {
                console.error('Error al obtener itinerarios:', error);
                setSnackbarMessage('Error al cargar itinerarios');
                setOpenSnackbar(true);
            }
        };

        fetchItinerarios();
    }, [baseUrl, setOpenSnackbar, setSnackbarMessage]);

    const handleVerDetalles = (id) => {
        navigate(`/itinerario/${id}/eventos`);
    };
    const handleEditar = (id) => {
        navigate(`/itinerario/${id}/editarItinerario`); // Redirigir a la página de edición
    };

    const handleEliminar = async (id) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este itinerario?')) {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}`, {
                    method: 'DELETE',
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
        <div >
            <Header />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Mis Itinerarios
                </Typography>
                <div container spacing={2} justifyContent="flex-start">
                    {itinerarios.length === 0 ? (
                    <Typography variant="body1">No hay itinerarios para mostrar.</Typography>
                ) : (
                    <div container spacing={2} justifyContent="center">
                        {itinerarios.map((itinerario) => (
                            <div item xs={12} sm={6} md={4} key={itinerario.id}>
                                <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="h6">Itinerario {itinerario.id}</Typography> 
                                    <Typography variant="body1">Fecha de Inicio: {formatDate(itinerario.fechaInicio)}</Typography>
                                    <Typography variant="body1">Fecha de Fin: {formatDate(itinerario.fechaFin)}</Typography>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleVerDetalles(itinerario.id)}
                                        sx={{ marginTop: 2,  marginRight: 1 }}
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
                            </div>
                        ))}
                    </div>
                    )}
                    </div>
            </div>
            
        </div>
    );
};

export default VerItinerario;
