import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, MenuItem, Snackbar, Alert, Box, Typography, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const CrearItinerario = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_API_URL;
    const [grupoViaje, setGrupoViaje] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [grupos, setGrupos] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const token = localStorage.getItem('token');
    const usuarioId = localStorage.getItem("id");

    const cargarGrupos = useCallback(() => {
        setLoading(true);
        fetch(`${baseUrl}/GrupoDeViaje/coordinador/${usuarioId}/grupos`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setSnackbarMessage('No tienes grupos de viaje creados. No puede crear un itinerario.');
                        setSnackbarSeverity('info');
                        setOpenSnackbar(true);
                        return []; 
                    }
                    throw new Error('Ocurrió un error al cargar los grupos');
                }
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    setSnackbarMessage('Debe crear un grupo antes de crear un itinerario.');
                    setSnackbarSeverity('warning');
                    setOpenSnackbar(true);
                }
                setGrupos(data);
            })
            .catch(error => {
                setError(error.message || 'Ocurrió un error al cargar los grupos.');
                setOpenSnackbar(true);
            })
            .finally(() => setLoading(false));
    }, [token, baseUrl, usuarioId]);

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    const handleCrearItinerario = async () => {
        if (!grupoViaje) {
            setSnackbarMessage('Debe seleccionar un grupo para crear un itinerario.');
            setSnackbarSeverity('warning');
            setOpenSnackbar(true);
            return;
        }

        try {
            const nuevoItinerario = {
                grupoDeViajeId: grupoViaje,
                fechaInicio,
                fechaFin,
            };
          
            const response = await fetch(`${baseUrl}/Itinerario/altaItinerario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nuevoItinerario),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
                throw new Error('Error al crear el itinerario');
            }

            const itinerariosResponse = await fetch(`${baseUrl}/Itinerario/Listado`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!itinerariosResponse.ok) {
                throw new Error('Error al obtener los itinerarios');
            }

            const itinerarios = await itinerariosResponse.json();
            const nuevoItinerarioId = itinerarios[itinerarios.length - 1].id;
            setSnackbarMessage('Itinerario creado correctamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);

            navigate(`/crear-eventos/${nuevoItinerarioId}`);
        } catch (error) {
            console.error('Error al crear el itinerario:', error);
            setSnackbarMessage('Error al crear el itinerario.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleCrearGrupo = () => {
        navigate("/crearGrupo"); // Redirige al componente CrearGrupo
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh">
            <Header />
            <Box
                component="main"
                sx={{
                    padding: 3,
                    marginTop: 8,
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Crear Itinerario
                </Typography>
                {loading && (
                    <Typography variant="h6" color="primary">
                        Cargando grupos...
                    </Typography>
                )}
                {error && (
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={4000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                    </Snackbar>
                )}
                {/* Mostrar mensaje si no hay grupos */}
                {!loading && grupos.length === 0 ? (
                    <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
                        <Typography variant="h6" color="text.secondary">
                            No tienes grupos de viaje creados. No puede crear un itinerario.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCrearGrupo}
                            sx={{ marginTop: 2 }}
                        >
                            Crear un Grupo
                        </Button>
                    </Paper>
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            backgroundColor: 'white',
                            borderRadius: 2,
                            boxShadow: 3,
                            padding: 3,
                            maxWidth: 600,
                            width: '100%',
                        }}
                    >
                        <TextField
                            select
                            label="Grupo de Viaje"
                            value={grupoViaje}
                            onChange={(e) => setGrupoViaje(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ marginBottom: 2 }}
                        >
                            {grupos.map((grupo) => (
                                <MenuItem key={grupo.id} value={grupo.id}>
                                    {grupo.nombre}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Fecha de Inicio"
                            type="date"
                            value={fechaInicio}
                            onChange={(e) => setFechaInicio(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginBottom: 2 }}
                        />
                        <TextField
                            label="Fecha de Fin"
                            type="date"
                            value={fechaFin}
                            onChange={(e) => setFechaFin(e.target.value)}
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            sx={{ marginBottom: 2 }}
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCrearItinerario}
                            sx={{ marginTop: 2 }}
                        >
                            Crear Itinerario
                        </Button>
                    </Box>
                )}
            </Box>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CrearItinerario;
