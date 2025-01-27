import React, { useState, useEffect, useCallback } from 'react';
import { Button, TextField, MenuItem, Snackbar, Alert, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Header from './Header';

const CrearItinerario = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const baseUrl = process.env.REACT_APP_API_URL;
    // Estado para los datos del formulario
    const [grupoViaje, setGrupoViaje] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');

    // Estado para los grupos de viaje obtenidos del backend
    const [grupos, setGrupos] = useState([]);

    // Estado para la retroalimentación
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Función para obtener los grupos de viaje desde el backend
    const cargarGrupos = useCallback(() => {
        setLoading(true);
        fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar los grupos');
                return response.json();
            })
            .then(data => setGrupos(data))
            .catch(error => {
                console.error('Error:', error);
                setError('No se pudieron cargar los grupos');
                setSnackbarMessage('Error al cargar los grupos de viaje.');
                setSnackbarSeverity('error');
                setOpenSnackbar(true);
            })
            .finally(() => setLoading(false));
    }, [baseUrl]);

    useEffect(() => {
        cargarGrupos();
    }, [cargarGrupos]);

    

       // Función para manejar la creación del itinerario
       const handleCrearItinerario = async () => {
        try {
            const nuevoItinerario = {
                grupoDeViajeId: grupoViaje,
                fechaInicio,
                fechaFin,
            };
        
            console.error("itine", nuevoItinerario)
            const response = await fetch(`${baseUrl}/Itinerario/altaItinerario`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(nuevoItinerario),
            });
    
            if (!response.ok) {
                const errorData = await response.json(); 
                console.error('Error del servidor:', errorData);
                throw new Error('Error al crear el itinerario');
            }
    
            // Aquí podrías hacer una segunda solicitud para obtener el ID del itinerario
            const itinerariosResponse = await fetch(`${baseUrl}/Itinerario/Listado`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
    
            if (!itinerariosResponse.ok) {
                throw new Error('Error al obtener los itinerarios');
            }
    
            const itinerarios = await itinerariosResponse.json();
            // Suponiendo que puedes identificar el itinerario correcto, por ejemplo, el más reciente
            const nuevoItinerarioId = itinerarios[itinerarios.length - 1].id;
            setSnackbarMessage('Itinerario creado correctamente');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
    
            // Redirigir a la creación de eventos usando el ID del itinerario
            navigate(`/crear-eventos/${nuevoItinerarioId}`);
        } catch (error) {
            console.error('Error al crear el itinerario:', error);
            setSnackbarMessage('Error al crear el itinerario.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }    };

    // Función para cerrar el snackbar
    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box 
            display="flex" 
            flexDirection="column" 
            minHeight="100vh" 
          //  sx={{ backgroundColor: '#f5f5f5' }}
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
                }}
            >
                <Typography variant="h4" gutterBottom>
                    Crear Itinerario
                </Typography>
                {/* Mostrar indicador de carga */}
            {loading && (
                <Typography variant="h6" color="primary">
                    Cargando grupos...
                </Typography>
                )}
                 {/* Mostrar error si ocurre */}
            {error && (
                <Snackbar 
                    open={openSnackbar} 
                    autoHideDuration={4000} 
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                >
                    <Alert 
                        onClose={handleCloseSnackbar} 
                        severity="error"
                        sx={{ width: '100%' }}
                    >
                        {error}
                    </Alert>
                </Snackbar>
            )}
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
            </Box>
         
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
    );
};

export default CrearItinerario;
