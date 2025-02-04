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
<<<<<<< HEAD
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        setSnackbarMessage('No tienes grupos de viaje creados. No puede crear un itinerario.');
                        setSnackbarSeverity('info');
                        setOpenSnackbar(true);
                        return []; // Retornamos un array vacío en caso de 404
                    }
                    throw new Error('Ocurrió un error al cargar los grupos');
                }
                return response.json();
            })
=======
            .then(response => response.json())
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
            .then(data => {
                if (data.length === 0) {
                    setSnackbarMessage('Debe crear un grupo antes de crear un itinerario.');
                    setSnackbarSeverity('warning');
                    setOpenSnackbar(true);
                }
                setGrupos(data);
            })
            .catch(error => {
<<<<<<< HEAD
                setError(error.message || 'Ocurrió un error al cargar los grupos.');
=======
                setError('Ocurrió un error al cargar los grupos.');
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
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
<<<<<<< HEAD

=======
        
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
            const response = await fetch(`${baseUrl}/Itinerario/altaItinerario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(nuevoItinerario),
            });

            if (!response.ok) {
<<<<<<< HEAD
                const errorData = await response.json();
                console.error('Error del servidor:', errorData);
=======
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
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
<<<<<<< HEAD
            console.error('Error al crear el itinerario:', error);
=======
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
            setSnackbarMessage('Error al crear el itinerario.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };
<<<<<<< HEAD

    const handleCrearGrupo = () => {
        navigate("/crearGrupo"); // Redirige al componente CrearGrupo
    };
=======
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
<<<<<<< HEAD
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
=======
        <Box 
            display="flex" 
            flexDirection="column" 
            minHeight="100vh"
        >
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
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Crear Itinerario
                </Typography>
<<<<<<< HEAD
=======

>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
                {loading && (
                    <Typography variant="h6" color="primary">
                        Cargando grupos...
                    </Typography>
                )}
                {error && (
<<<<<<< HEAD
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
=======
    <Typography color="error" variant="h6">
        {error}
    </Typography>
)}

                {grupos.length === 0 && !loading && (
                    <Box textAlign="center" mt={2}>
                        <Typography color="error" variant="h6">
                            Debe crear un grupo antes de crear un itinerario.
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            sx={{ marginTop: 2 }}
                            onClick={() => navigate('/crear-grupo')}
                        >
                            Crear Grupo
                        </Button>
                    </Box>
                )}

                {grupos.length > 0 && (
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
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
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
<<<<<<< HEAD
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleCrearItinerario}
                            sx={{ marginTop: 2 }}
=======
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleCrearItinerario}
                            sx={{ marginTop: 2 }}
                            disabled={!grupoViaje}
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
                        >
                            Crear Itinerario
                        </Button>
                    </Box>
                )}
            </Box>

<<<<<<< HEAD
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
=======
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
>>>>>>> 88b1e3d3321f48c8c03a08df85a5b87303b9433d
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default CrearItinerario;
