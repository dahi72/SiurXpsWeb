import React, { useEffect, useState } from 'react';
import { Typography, Box, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import {
    Timeline,
    TimelineItem,
    TimelineSeparator,
    TimelineConnector,
    TimelineContent,
    TimelineDot,
    TimelineOppositeContent,
} from '@mui/lab';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import EventIcon from '@mui/icons-material/Event';
import { useParams } from 'react-router-dom';
import Header from './Header';
import { Button } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';

const DetallesItinerario = () => {
    const { id } = useParams();
    const [eventos, setEventos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [filter, setFilter] = useState("");
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEventos = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}/eventos`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setEventos(data);
                    await fetchDetalles(data);
                } else {
                    console.error('La respuesta no es un array:', data);
                }
            } catch (error) {
                console.error('Error al obtener eventos:', error);
            }
        };

        const fetchDetalles = async (eventos) => {
            const detallesPromises = eventos.map(async (evento) => {
                const detallesEvento = {};
                if (evento.actividadId) {
                    const actividadResponse = await fetch(`${baseUrl}/Actividad/${evento.actividadId}`);
                    detallesEvento.actividad = await actividadResponse.json();
                }
                if (evento.trasladoId) {
                    const trasladoResponse = await fetch(`${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`);
                    detallesEvento.traslado = await trasladoResponse.json();
                }
                if (evento.aeropuertoId) {
                    const query = `?nombre=${evento.aeropuerto.nombre}`
                    const aeropuertoResponse = await fetch(`${baseUrl}/Aeropuerto/aeropuertos` + query);
                    detallesEvento.aeropuerto = await aeropuertoResponse.json();
                }
                if (evento.aerolineaId) {
                
                    const query = `?nombre=${evento.aerolineaId.nombre}`
                    const aerolineaResponse = await fetch(`${baseUrl}/Aerolinea/aerolineas` + query);
                    detallesEvento.aerolinea = await aerolineaResponse.json();
                }
                if (evento.hotelId) {
                    const query = `?nombre=${evento.hotelId.nombre}&codigoIso=${evento.hotelId.codigoIso}&ciudad=${evento.hotelId.ciudad}`;
                    const hotelResponse = await fetch(`${baseUrl}/Hotel/hoteles` + query);
                    detallesEvento.hotel = await hotelResponse.json();
                }
                if (evento.vueloId) {
                    const query = `?nombre=${evento.vueloId.nombre}`
                    const vueloResponse = await fetch(`${baseUrl}/Vuelo/vuelos}` + query);
                    detallesEvento.vuelo = await vueloResponse.json();
                }
                return detallesEvento;
            });

            const detallesArray = await Promise.all(detallesPromises);
            setDetalles(detallesArray);
        };

        fetchEventos();

       
    }, [id, baseUrl]);

    const getEventIcon = (event) => {
        if (event.vueloId) return <FlightIcon color="primary" />;
        if (event.hotelId) return <HotelIcon color="secondary" />;
        if (event.trasladoId) return <DirectionsBusIcon color="action" />;
        if (event.actividadId) return <EventIcon color="success" />;
        return <EventIcon />;
    };

    const getEventTitle = (event) => {
        if (event.vueloId) return "Vuelo";
        if (event.hotelId) return "Hotel";
        if (event.trasladoId) return "Traslado";
        if (event.actividadId) return "Actividad";
        return "Evento General";
    };

    const filteredEvents = eventos.filter((event) =>
        getEventTitle(event).toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <Box
            sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: 3,
                position: 'relative',
                zIndex: 1,
                minHeight: '100vh',
                marginTop: '20px'
            }}
        >
            <Header />
            <Typography variant="h4" gutterBottom>
                Eventos del Itinerario
            </Typography>
            <Button 
                variant="contained" 
                color="primary" 
                onClick={() => navigate('/VerItinerario')} 
                sx={{ mb: 2 }} 
            >
                Ver Itinerario
            </Button>
            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Filtrar eventos"
                    variant="outlined"
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                />
            </Box>

            <Timeline position="alternate"sx={{ backgroundColor: '#d0daf4', padding: '20px', borderRadius: '8px' }} >
                {filteredEvents.map((event, index) => (
                    <TimelineItem key={event.id}>
                        <TimelineOppositeContent>
                            <Typography variant="body2" color="textSecondary">
                                {new Date(event.fechaYHora).toLocaleString()}
                            </Typography>
                        </TimelineOppositeContent>
                        <TimelineSeparator>
                            <TimelineDot>{getEventIcon(event)}</TimelineDot>
                            <TimelineConnector />
                        </TimelineSeparator>
                        <TimelineContent>
                            <Accordion>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Typography variant="h6">{getEventTitle(event)}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography variant="body2">
                                        Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
                                    </Typography>
                                    {detalles[index]?.actividad && (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Actividad:</strong> {detalles[index].actividad.nombre}
                                            </Typography>
                                            <Typography variant="body2">
                                                Descripción: {detalles[index].actividad.descripcion}
                                            </Typography>
                                        </>
                                    )}
                                    {detalles[index]?.traslado && (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Traslado:</strong> {detalles[index].traslado.lugarDeEncuentro}
                                            </Typography>
                                            <Typography variant="body2">
                                                Horario: {detalles[index].traslado.horario}
                                            </Typography>
                                        </>
                                    )}
                                    {detalles[index]?.hotel && (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Hotel:</strong> {detalles[index].hotel.nombre}
                                            </Typography>
                                            <Typography variant="body2">
                                                Dirección: {detalles[index].hotel.direccion}
                                            </Typography>
                                        </>
                                    )}
                                    {detalles[index]?.vuelo && (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Vuelo:</strong> {detalles[index].vuelo.nombre}
                                            </Typography>
                                            <Typography variant="body2">
                                                Horario: {detalles[index].vuelo.horario}
                                            </Typography>
                                        </>
                                    )}
                                </AccordionDetails>
                            </Accordion>
                        </TimelineContent>
                    </TimelineItem>
                ))}
            </Timeline>
        </Box>
    );
};

export default DetallesItinerario;