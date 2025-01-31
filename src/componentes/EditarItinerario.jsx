import React, { useEffect, useState } from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from '../hooks/useSnackbar';

const EditarItinerario = () => {
    const { id } = useParams(); // Obtener el ID del itinerario de la URL
    const [itinerario, setItinerario] = useState(null);
    const [fechaInicio, setFechaInicio] = useState('');
    const [fechaFin, setFechaFin] = useState('');
    const [eventos, setEventos] = useState([]);
    const { setOpenSnackbar, setSnackbarMessage } = useSnackbar();
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchItinerario = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}`);
                const data = await response.json();
                setItinerario(data);
                setFechaInicio(data.fechaInicio.split('T')[0]); // Formato de fecha
                setFechaFin(data.fechaFin.split('T')[0]); // Formato de fecha
                setEventos(data.eventos); // Cargar eventos
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
        const updatedItinerario = { fechaInicio, fechaFin, eventos };

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
                navigate('/ver-itinerarios'); // Redirigir a la lista de itinerarios
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

    const handleEventoChange = (index, field, value) => {
        const updatedEventos = [...eventos];
        updatedEventos[index] = { ...updatedEventos[index], [field]: value };
        setEventos(updatedEventos);
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
                    label="Fecha de Inicio"
                    type="date"
                    variant="outlined"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Fecha de Fin"
                    type="date"
                    variant="outlined"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Typography variant="h6" gutterBottom>
                    Eventos
                </Typography>
                {eventos.map((evento, index) => (
                    <Box key={evento.id} sx={{ mb: 2 }}>
                        <Typography variant="subtitle1">Evento {index + 1}</Typography>
                        <TextField
                            fullWidth
                            label="Fecha y Hora"
                            type="datetime-local"
                            variant="outlined"
                            value={evento.fechaYHora.split('T')[0]} // Ajusta según sea necesario
                            onChange={(e) => handleEventoChange(index, 'fechaYHora', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Actividad ID"
                            type="number"
                            variant="outlined"
                            value={evento.actividadId}
                            onChange={(e) => handleEventoChange(index, 'actividadId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Traslado ID"
                            type="number"
                            variant="outlined"
                            value={evento.trasladoId}
                            onChange={(e) => handleEventoChange(index, 'trasladoId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Aeropuerto ID"
                            type="number"
                            variant="outlined"
                            value={evento.aeropuertoId}
                            onChange={(e) => handleEventoChange(index, 'aeropuertoId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Aerolínea ID"
                            type="number"
                            variant="outlined"
                            value={evento.aerolineaId}
                            onChange={(e) => handleEventoChange(index, 'aerolineaId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Hotel ID"
                            type="number"
                            variant="outlined"
                            value={evento.hotelId}
                            onChange={(e) => handleEventoChange(index, 'hotelId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            label="Vuelo ID"
                            type="number"
                            variant="outlined"
                            value={evento.vueloId}
                            onChange={(e) => handleEventoChange(index, 'vueloId', e.target.value)}
                            sx={{ mb: 2 }}
                        />
                    </Box>
                ))}
                <Button variant="contained" color="primary" type="submit">
                    Guardar Cambios
                </Button>
            </form>
        </Box>
    );
};

export default EditarItinerario;