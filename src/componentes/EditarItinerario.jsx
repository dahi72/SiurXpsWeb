import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackbar';

const EditarItinerario = () => {
    const { id } = useParams(); // Obtener el ID del itinerario de la URL
    const [itinerario, setItinerario] = useState(null);
    const [descripcion, setDescripcion] = useState('');
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const { setOpenSnackbar, setSnackbarMessage } = useSnackbar();
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchItinerario = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}`);
                const data = await response.json();
                setItinerario(data);
                setDescripcion(data.descripcion);
                setFechaInicio(data.fechaInicio);
                setFechaFin(data.fechaFin);
            } catch (error) {
                console.error('Error al obtener el itinerario:', error);
                setSnackbarMessage('Error al cargar el itinerario');
                setOpenSnackbar(true);
            }
        };

        fetchItinerario();
    }, [id, baseUrl, setOpenSnackbar, setSnackbarMessage]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedItinerario = { descripcion, fechaInicio, fechaFin };

        try {
            const response = await fetch(`${baseUrl}/Itinerario/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItinerario),
            });

            if (response.ok) {
                setSnackbarMessage('Itinerario actualizado exitosamente');
                setOpenSnackbar(true);
                navigate('/VerItinerario'); // Redirigir a la lista de itinerarios
            } else {
                setSnackbarMessage('Error al actualizar el itinerario');
                setOpenSnackbar(true);
            }
        } catch (error) {
            console.error('Error al actualizar el itinerario:', error);
            setSnackbarMessage('Error al actualizar el itinerario');
            setOpenSnackbar(true);
        }
    };

    if (!itinerario) {
        return <Typography>Cargando...</Typography>; // O un spinner
    }

    return (
        <Box sx={{ padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                Editar Itinerario
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    fullWidth
                    label="Descripción"
                    variant="outlined"
                    value={descripcion}
                    onChange={(e) => setDescripcion(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Fecha de Inicio"
                    type="date"
                    variant="outlined"
                    value={fechaInicio.split('T')[0]} // Formato de fecha
                    onChange={(e) => setFechaInicio(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Fecha de Fin"
                    type="date"
                    variant="outlined"
                    value={fechaFin.split('T')[0]} // Formato de fecha
                    onChange={(e) => setFechaFin(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button variant="contained" color="primary" type="submit">
                    Guardar Cambios
                </Button>
            </form>
        </Box>
    );
};

export default EditarItinerario;