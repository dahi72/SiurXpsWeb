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
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';

const VerItinerarioViajero = () => {
    const [itinerarios, setItinerarios] = useState([]);
    const [gruposDeViaje, setGruposDeViaje] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    const fetchGruposDeViaje = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('id');

            // URL específica para los viajeros
            const url = `${baseUrl}/GrupoDeViaje/viajero/${userId}/grupos`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener grupos de viaje');
            }

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

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al obtener itinerarios');
            }

            return await response.json();
        } catch (error) {
            setError(error.message);
            return [];
        }
    }, [baseUrl]);

    useEffect(() => {
        const obtenerItinerarios = async () => {
            setLoading(true);
            try {
                const grupos = await fetchGruposDeViaje();
                const itinerarios = await fetchItinerarios();

                const itinerariosFiltrados = itinerarios.filter((itinerario) =>
                    grupos.some((grupo) => grupo.id === itinerario.grupoDeViajeId)
                );

                setItinerarios(itinerariosFiltrados);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        obtenerItinerarios();
    }, [fetchGruposDeViaje, fetchItinerarios]);

    const formatFechaCorta = (fecha) => format(new Date(fecha), 'dd MMM yyyy');

    const handleVerEventos = async (itinerarioId) => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`${baseUrl}/Itinerario/${itinerarioId}/eventos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al obtener los eventos');
            }

            const responseText = await response.text();

            if (responseText) {
                const eventos = JSON.parse(responseText);

                if (eventos.length === 0) {
                    setSnackbarMessage('Este itinerario no tiene eventos asociados aún.');
                    setOpenSnackbar(true);
                } else {
                    navigate(`/itinerario/${itinerarioId}/eventos`);
                }
            } else {
                setSnackbarMessage('Este itinerario no tiene eventos asociados aún.');
                setOpenSnackbar(true);
            }
        } catch (error) {
            setSnackbarMessage('Error al verificar eventos.');
            setOpenSnackbar(true);
        }
    };
    console.log('Grupos de viaje:', gruposDeViaje);
    console.log('Itinerarios:', itinerarios);
    
    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, borderBottom: 1, borderColor: 'divider', pb: 2, justifyContent: 'center', width: '100%' }}>
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                    {itinerarios.map((itinerario) => {
                        const grupo = gruposDeViaje.find((g) => g.id === itinerario.grupoDeViajeId);
                        return (
                            <Paper
                                key={itinerario.id}
                                elevation={3}
                                sx={{
                                    p: 3,
                                    transition: 'transform 0.3s ease',
                                    '&:hover': { transform: 'scale(1.03)', boxShadow: 6 },
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

                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 'auto' }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleVerEventos(itinerario.id)}  // Llamamos a la función aquí
                                        size="small"
                                        fullWidth
                                        sx={{
                                            '&:hover': { backgroundColor: 'primary.light', color: 'white' },
                                        }}
                                    >
                                        Ver Eventos
                                    </Button>
                                     <Button
                                        variant="outlined"
                                        startIcon={<GroupIcon />}
                                        onClick={() => {
                                            if (itinerario.id) {
                                                navigate(`/usuariosActividadOpcional/${itinerario.id}`);
                                            } else {
                                                setSnackbarMessage("El itinerario no tiene un ID válido.");
                                                setOpenSnackbar(true);
                                            }
                                        }}
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

            <Snackbar open={openSnackbar} autoHideDuration={4000} onClose={() => setOpenSnackbar(false)}>
                <Alert onClose={() => setOpenSnackbar(false)} severity="info">
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Container>
    );
};

export default VerItinerarioViajero;
