import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, MenuItem, Snackbar, Alert, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const CrearItinerario2 = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [grupoViaje, setGrupoViaje] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [grupos, setGrupos] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const token = localStorage.getItem("token");
    const [grupoSeleccionado, setGrupoSeleccionado] = useState(null);
    const [itinerarioExistente, setItinerarioExistente] = useState(false);
    const coordinadorId = localStorage.getItem("id");

    // Llamada a la API para obtener los grupos
    const cargarGrupos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${baseUrl}/GrupoDeViaje/coordinador/${coordinadorId}/grupos`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error('Error al cargar los grupos');
            }
            const data = await response.json();
            setGrupos(data);
        } catch (error) {
            console.error(error.message || 'Ocurrió un error al cargar los grupos.');
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    }, [baseUrl, coordinadorId, token]);

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    const handleGrupoChange = (e) => {
        setGrupoViaje(e.target.value); // Actualizar el estado
        verificarItinerarioExistente(e.target.value); // Llamar a la función con el valor seleccionado
    };
    
    // Filtra el grupo seleccionado y verifica si ya tiene un itinerario
    const verificarItinerarioExistente = async (grupoId) => {
        setGrupoSeleccionado(grupoId);
        try {
            const response = await fetch(`${baseUrl}/Itinerario/existeGrupoEnItinerario/${grupoId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error('Error al verificar el itinerario');
            }

            const existe = await response.json();
            if (existe) {
                setItinerarioExistente(true);
                setSnackbarMessage('El grupo de viaje seleccionado ya tiene un itinerario asignado, elija otro.');
                setSnackbarSeverity('warning');
                setOpenSnackbar(true);
                setFechaInicio('');
                setFechaFin('');
            } else {
                setItinerarioExistente(false);
                setFechaInicio(grupoSeleccionado?.fechaInicio || '');
                setFechaFin(grupoSeleccionado?.fechaFin || '');
            }
        } catch (error) {
            console.error(error.message || 'Error al verificar el itinerario');
            setOpenSnackbar(true);
        }
    };

    // Crear el itinerario
    const handleCrearItinerario = async () => {
        try {
            const nuevoItinerario = {
                grupoDeViajeId: grupoViaje,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            };

            const response = await fetch(`${baseUrl}/Itinerario/altaItinerario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(nuevoItinerario),
            });

            if (!response.ok) {
                throw new Error('Error al crear el itinerario');
            }

            const itinerariosResponse = await fetch(`${baseUrl}/Itinerario/Listado`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
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
            setSnackbarMessage('Error al crear el itinerario.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
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
                        o onChange={handleGrupoChange}
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
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ marginBottom: 2 }}
                    />

                    <TextField
                        label="Fecha de Fin"
                        type="date"
                        value={fechaFin}
                        fullWidth
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        disabled
                        sx={{ marginBottom: 2 }}
                    />

                    {!itinerarioExistente && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCrearItinerario}
                            sx={{ marginTop: 2 }}
                        >
                            Crear Itinerario
                        </Button>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default CrearItinerario2;
