
import React, { useCallback, useEffect, useState, useRef } from 'react';
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
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

const DetallesItinerario = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [eventos, setEventos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [filter, setFilter] = useState("");
    const cargandoDetallesRef = useRef(false);
    const fetchedOnce = useRef(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    
    const createHeaders = (token) => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

    const headers = createHeaders(token);

    const fetchWithErrorHandling = async (url, headers) => {
        try {
            console.log(`Fetching: ${url}`);
            const response = await fetch(url, { method: "GET", headers });
            const data = await response.json();

            if (!response.ok) {
                console.error("Server Error:", { status: response.status, statusText: response.statusText, data });
                throw new Error(`Server error: ${response.status} - ${data.message || response.statusText}`);
            }

            return data;
        } catch (error) {
            console.error("Fetch Error:", { url, error: error.message, stack: error.stack });
            throw error;
        }
    };

    const fetchDetallesPorTipo = useCallback(async (evento) => {
        const detallesEvento = {};

        const fetchDetalle = async (condition, url, key) => {
            if (!condition) return;
            try {
                detallesEvento[key] = await fetchWithErrorHandling(url, headers);
            } catch (error) {
                console.error(`Error fetching ${key}:`, error);
            }
        };

        await Promise.all([
            evento.actividadId && fetchDetalle(true, `${baseUrl}/Actividad/${evento.actividadId}`, "actividad"),
            evento.trasladoId && fetchDetalle(true, `${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`, "traslado"),
            evento.aeropuertoId && fetchDetalle(true, `${baseUrl}/Aeropuerto/${evento.aeropuertoId}`, "aeropuerto"),
            evento.aerolineaId && fetchDetalle(true, `${baseUrl}/Aerolinea/${evento.aerolineaId}`, "aerolinea"),
            evento.hotelId && fetchDetalle(true, `${baseUrl}/Hotel/${evento.hotelId}`, "hotel"),
            evento.vueloId && fetchDetalle(true, `${baseUrl}/Vuelo/${evento.vueloId}`, "vuelo")
        ]);

        return detallesEvento;
    }, [baseUrl, headers]);

    const fetchDetalles = useCallback(async (eventosData) => {
        if (cargandoDetallesRef.current) return; // Si ya estamos cargando, no hacemos otra petición
        if (detalles.length > 0) return; // Si los detalles ya están cargados, no volvemos a hacer la petición
        try {
            cargandoDetallesRef.current = true; // Marcamos que estamos cargando
            console.log("Fetching detalles...");
            const detallesArray = await Promise.all(
                eventosData.map((evento) => fetchDetallesPorTipo(evento))
            );
            setDetalles(detallesArray);
        } catch (error) {
            console.error("Error fetching detalles:", error);
        } finally {
            cargandoDetallesRef.current = false; // Marcamos que hemos terminado de cargar
        }
    }, [fetchDetallesPorTipo, detalles.length]);

    console.log("detalles", detalles);
    
    const fetchEventos = useCallback(async () => {
        if (!id || !baseUrl || !token) {
            console.error("Missing required parameters:", { id, baseUrl, token: !!token });
            return;
        }

        try {
            if (eventos.length === 0) {
                console.log("Fetching eventos for itinerario:", id);
                const eventosData = await fetchWithErrorHandling(`${baseUrl}/Itinerario/${id}/eventos`, headers);
                if (!Array.isArray(eventosData)) {
                    console.error("Invalid response format:", eventosData);
                    throw new Error("La respuesta no tiene el formato esperado");
                }

                console.log("Eventos fetched successfully:", eventosData.length);
                setEventos(eventosData);
                fetchedOnce.current = true;
                // Solo cargar detalles si no estamos cargando ya
                if (eventosData.length > 0 && !cargandoDetallesRef.current) {
                    fetchDetalles(eventosData);
                }
            }
        } catch (error) {
            console.error("Error fetching eventos:", error);
        }
    }, [id, baseUrl, token, headers, eventos.length, fetchDetalles]);
   
    useEffect(() => {
        fetchEventos();
    }, [fetchEventos]);

    const getEventIcon = (detailType) => {
        switch (detailType) {
            case 'vuelo':
                return <FlightIcon color="primary" />;
            case 'aeropuerto':
                return <AirportShuttleIcon color="primary" />;
            case 'aerolinea':
                return <AirlineSeatReclineNormalIcon color="primary" />;
            case 'hotel':
                return <HotelIcon color="secondary" />;
            case 'traslado':
                return <DirectionsBusIcon color="action" />;
            case 'actividad':
                return <EventIcon color="success" />;
            default:
                return <EventIcon />;
        }
    };

    const getEventTitle = (detailType) => {
        switch (detailType) {
            case 'vuelo':
                return "Vuelo";
            case 'aeropuerto':
                return "Aeropuerto";
            case 'aerolinea':
                return "Aerolinea"
            case 'hotel':
                return "Hotel";
            case 'traslado':
                return "Traslado";
            case 'actividad':
                return "Actividad";
            default:
                return "Evento";
        }
    };
    

    // const getEventIcon = (detail) => {
    //     if (detail.vuelo) return <FlightIcon color="primary" />;
    //     if (detail.aeropuerto) return <AirportShuttleIcon color="primary" />;
    //     if (detail.aerolinea) return <AirlineSeatReclineNormalIcon color="primary" />;
    //     if (detail.hotel) return <HotelIcon color="secondary" />;
    //     if (detail.traslado) return <DirectionsBusIcon color="action" />;
    //     if (detail.actividad) return <EventIcon color="success" />;
    //     return <EventIcon />;
    // };
    

    // const getEventTitle = (detail) => {
    //     if (detail.vuelo) return `Vuelo: ${detail.vuelo.nombre}`;  // Muestra el nombre del vuelo
    //     if (detail.aeropuerto) return `Aeropuerto: ${detail.aeropuerto.nombre}`; // Muestra el nombre del aeropuerto
    //     if (detail.aerolinea) return `Aerolinea: ${detail.aerolinea.nombre}`;  // Muestra el nombre de la aerolínea
    //     if (detail.hotel) return `Hotel: ${detail.hotel.nombre}`;
    //     if (detail.traslado) return "Traslado";
    //     if (detail.actividad) return `Actividad: ${detail.actividad.nombre}`;
    //     return "Evento";
    // };
    

    const filteredEvents = eventos.filter((event) => {
        const title = getEventTitle(event) ?? "";
        return title.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", padding: "20px", boxShadow: 3, position: "relative", zIndex: 1, minHeight: "100vh", marginTop: "20px" }}>
            <Header />
            <Typography variant="h4" gutterBottom>
                Eventos del Itinerario
            </Typography>
            <Button variant="contained" color="primary" onClick={() => navigate("/VerItinerario")} sx={{ mb: 2 }}>
                Ver Itinerario
            </Button>
            <Box sx={{ mb: 2 }}>
                <TextField label="Filtrar eventos" variant="outlined" fullWidth value={filter} onChange={(e) => setFilter(e.target.value)} />
            </Box>
            <Timeline position="alternate" sx={{ backgroundColor: "#d0daf4", padding: "20px", borderRadius: "8px" }}>
                {filteredEvents.map((event, index) => (
                    <React.Fragment key={event.id}>
                      
                        {detalles[index] && Object.keys(detalles[index]).map((detailType, detailIndex) => {
                            const detail = detalles[index][detailType];
                            console.log("DetailIndex:", detailIndex);
                            console.log("DetailType:", detailType);
                            if (detail) {
                                console.log('Detail:', detail); // Verifica el detalle
                                return (
                                    <TimelineItem key={detailIndex}>
                                          
                                        <TimelineOppositeContent>
                                            <Typography variant="body2" color="textSecondary">
                                                Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
                                            </Typography>
                                        </TimelineOppositeContent>
                                        <TimelineSeparator>
                                            <TimelineDot>{getEventIcon(detailType)}</TimelineDot>
                                            <TimelineConnector />
                                        </TimelineSeparator>
                                        <TimelineContent>
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography variant="h6">{getEventTitle(detailType)}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                {Object.keys(detail).map((key) => {
                                                    if (!key.includes('id')) {
                                                        return (
                                                            <Typography variant="body2" key={key}>
                                                                {key}: {detail[key]} 
                                                            </Typography>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </AccordionDetails>
                                        </Accordion>
                                    </TimelineContent>
                                    </TimelineItem>
                                );
                            }
                            return null;
                        })}
                    </React.Fragment>
                ))}
            </Timeline>
        </Box>
    );
};

export default DetallesItinerario;
