import React, { useEffect, useState } from 'react';
import { Paper, Typography, Button, Grid } from '@mui/material';
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
        // setSnackbarMessage(`Viendo detalles del itinerario ${id}`);
        // setOpenSnackbar(true);
        navigate(`/itinerario/${id}/eventos`);
    };

    // Función para formatear la fecha
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <div>
            <Header />
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h4" gutterBottom>
                    Mis Itinerarios
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {itinerarios.map((itinerario) => (
                        <Grid item xs={12} sm={6} md={4} key={itinerario.id}>
                            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                                <Typography variant="h6">{itinerario.descripcion}</Typography>
                                <Typography variant="body1">Fecha de Inicio: {formatDate(itinerario.fechaInicio)}</Typography>
                                <Typography variant="body1">Fecha de Fin: {formatDate(itinerario.fechaFin)}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleVerDetalles(itinerario.id)}
                                    sx={{ marginTop: 2 }}
                                >
                                    Ver Detalles
                                </Button>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

export default VerItinerario;
