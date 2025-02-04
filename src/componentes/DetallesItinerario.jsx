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
                                            <Typography variant="body2">
                                                Ubicación: {detalles[index].actividad.ubicacion || 'Información no disponible'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Duración: {detalles[index].actividad.duracion || 'Desconocida'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Tips: {detalles[index].actividad.tips || 'No hay recomendaciones'}
                                            </Typography>
                                            <Typography variant="body2">
                                               País: {detalles[index].actividad.pais.nombre || 'No hay pais'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Ciudad: {detalles[index].actividad.ciudad.nombre || 'No hay ciudad'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Opcional?: {detalles[index].actividad.opcional || ''}
                                            </Typography>
                                            {/* <Typography variant="body2">
                                                <strong>Enlace de información:</strong> <a href={detalles[index].actividad.enlace} target="_blank" rel="noopener noreferrer">Más información</a>
                                            </Typography> */}
                                        </>
                                    )}
                                    {detalles[index]?.traslado && (
                                        <>
                                            <Typography variant="body2">
                                                <strong>Traslado:</strong> {detalles[index].traslado.lugarDeEncuentro || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                Horario: {detalles[index].traslado.horario || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                Tips: {detalles[index].traslado.tips || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                País: {detalles[index].traslado.pais || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                Ciudad: {detalles[index].traslado.ciudad || ''}
                                            </Typography>
                                            <Typography variant="body2">
                                                Tipo de traslado: {detalles[index].traslado.tipoDeTraslado || ''}
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
                                            <Typography variant="body2">
                                                Fecha de Check-In: {new Date(detalles[index].hotel.checkIn).toLocaleDateString() || 'Fecha no disponible'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Fecha de Check-Out: {new Date(detalles[index].hotel.checkOut).toLocaleDateString() || 'Fecha no disponible'}
                                            </Typography>
                                            <Typography variant="body2">
                                                Enlace al sitio web: <a href={detalles[index].hotel.sitioWeb} target="_blank" rel="noopener noreferrer">Visitar sitio</a>
                                            </Typography></>
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
                                    {detalles[index]?.aeropuerto && (
                                        <>
                                        <Typography variant="body2">
                                            <strong>Aeropuerto:</strong> {detalles[index].aeropuerto.nombre}
                                        </Typography>
                                        <Typography variant="body2">
                                            Dirección: {detalles[index].aeropuerto.direccion}
                                        </Typography>
                                        <Typography variant="body2">
                                            Página web: <a href={detalles[index].aeropuerto.paginaWeb} target="_blank" rel="noopener noreferrer">{detalles[index].aeropuerto.paginaWeb}</a>
                                        </Typography>
                                    </>
                                )}
                                {detalles[index]?.aerolinea && (
                                    <>
                                        <Typography variant="body2">
                                            <strong>Aerolínea:</strong> {detalles[index].aerolinea.nombre}
                                        </Typography>
                                        <Typography variant="body2">
                                            Página web: <a href={detalles[index].aerolinea.paginaWeb} target="_blank" rel="noopener noreferrer">{detalles[index].aerolinea.paginaWeb}</a>
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