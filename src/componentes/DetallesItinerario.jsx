
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
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';

const DetallesItinerario = () => {
    const { id } = useParams();
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
                throw new Error("El itinerario no tiene eventos asociados",)
            }

            return data;
        } catch (error) {
            
            throw error;
        }
    };

    const fetchDetallesPorTipo = useCallback(async (evento) => {
        const detallesEvento = {};
        const urls = {
            actividadId: `/Actividad/${evento.actividadId}`,
            trasladoId: `/Traslado/api/Traslado/${evento.trasladoId}`,
            aeropuertoId: `/Aeropuerto/${evento.aeropuertoId}`,
            aerolineaId: `/Aerolinea/${evento.aerolineaId}`,
            hotelId: `/Hotel/${evento.hotelId}`,
            vueloId: `/Vuelo/${evento.vueloId}`
        };
    
        await Promise.all(
            Object.keys(urls).map(async (key) => {
                if (evento[key]) {
                    try {
                        detallesEvento[key] = await fetchWithErrorHandling(baseUrl + urls[key], headers);
                    } catch (error) {
                        console.error(`Error fetching ${key}:`, error);
                    }
                }
            })
        );
    
        return detallesEvento;
    }, [baseUrl, headers]);

    const fetchDetalles = useCallback(async (eventosData) => {
        if (cargandoDetallesRef.current) return; 
        if (detalles.length > 0) return; 
        try {
            cargandoDetallesRef.current = true;
            console.log("Fetching detalles...");
            const detallesArray = await Promise.all(
                eventosData.map((evento) => fetchDetallesPorTipo(evento))
            );
            setDetalles(detallesArray);
        } catch (error) {
            console.error("Error fetching detalles:", error);
        } finally {
            cargandoDetallesRef.current = false; 
        }
    }, [fetchDetallesPorTipo, detalles.length]);

    const fetchEventos = useCallback(async () => {
        if (!id || !baseUrl || !token) {
            console.error("Missing required parameters:", { id, baseUrl, token: !!token });
            return;
        }

        try {
            if (eventos.length === 0) {
                const eventosData = await fetchWithErrorHandling(`${baseUrl}/Itinerario/${id}/eventos`, headers);
                if (!Array.isArray(eventosData)) {
                    console.error("Invalid response format:", eventosData);
                    throw new Error("La respuesta no tiene el formato esperado");
                }
                if (eventosData.length === 0)
                {
                    setEventos([]); // Asegurarse de que no haya eventos
                    alert("El itinerario no tiene eventos asociados");
                    return;
                }
                setEventos(eventosData);
                fetchedOnce.current = true;

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
            case 'vueloId':
                return <FlightIcon color="primary" />;
            case 'aeropuertoId':
                return <AirportShuttleIcon color="primary" />;
            case 'aerolineaId':
                return <AirlineSeatReclineNormalIcon color="primary" />;
            case 'hotelId':
                return <HotelIcon color="secondary" />;
            case 'trasladoId':
                return <DirectionsBusIcon color="action" />;
            case 'actividadId':
                return <EventIcon color="success" />;
            default:
                return <EventIcon />;
        }
    };

    const getEventTitle = (detailType) => {
        switch (detailType) {
            case 'vueloId':
                return "Vuelo";
            case 'aeropuertoId':
                return "Aeropuerto";
            case 'aerolineaId':
                return "Aerolinea"
            case 'hotelId':
                return "Hotel";
            case 'trasladoId':
                return "Traslado";
            case 'actividadId':
                return "Actividad";
            default:
                return "Evento";
        }
    };

    const filteredEvents = eventos.filter((event) => {
        const title = getEventTitle(event) ?? "";
        return title.toLowerCase().includes(filter.toLowerCase());
    });

    return (
        <Box
            sx={{
                backgroundColor: "rgba(255, 255, 255, 0.8)",
                borderRadius: "8px",
                padding: { xs: "10px", sm: "20px" },
                boxShadow: 3,
                position: "relative",
                zIndex: 1,
                minHeight: "100vh",
                marginTop: { xs: "10px", sm: "20px" },
                width: "100%",
                maxWidth: "900px",
                mx: "auto",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontSize: { xs: "1.5rem", sm: "2rem" },
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 2,
                }}
                gutterBottom
            >
                Eventos del Itinerario
            </Typography>

            <Box sx={{ mb: 2 }}>
                <TextField
                    label="Filtrar eventos"
                    variant="outlined"
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{ width: { xs: "100%", sm: "80%" }, mx: "auto" }}
                />
            </Box>

            {eventos.length === 0 ? (
                <Typography variant="h6" color="textSecondary" align="center">
                    No hay eventos disponibles para este itinerario.
                </Typography>
            ) : (
                <Timeline
                    position="alternate"
                    sx={{
                        backgroundColor: "#d0daf4",
                        padding: { xs: "10px", sm: "20px" },
                        borderRadius: "8px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    {filteredEvents.map((event, index) => (
                        <React.Fragment key={event.id}>
                            <Typography
                                variant="h5"
                                sx={{
                                    marginTop: "20px",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    fontSize: { xs: "1.2rem", sm: "1.5rem" },
                                }}
                            >
                                Evento {event.id} del itinerario {id}
                            </Typography>

                            {detalles[index] &&
                                Object.keys(detalles[index]).map((detailType, detailIndex) => {
                                    const detail = detalles[index][detailType];
                                    if (detail) {
                                        return (
                                            <TimelineItem key={detailIndex}>
                                                <TimelineOppositeContent
                                                    sx={{
                                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                                        textAlign: { xs: "left", sm: "right" },
                                                        width: { xs: "auto", sm: "180px" },
                                                    }}
                                                >
                                                    Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
                                                </TimelineOppositeContent>

                                                <TimelineSeparator>
                                                    <TimelineDot>{getEventIcon(detailType)}</TimelineDot>
                                                    <TimelineConnector />
                                                </TimelineSeparator>

                                                <TimelineContent
                                                    sx={{
                                                        flex: 1,
                                                        minWidth: "250px",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                    }}
                                                >
                                                    <Accordion sx={{ width: "100%", boxShadow: 2 }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                            <Typography
                                                                variant="h6"
                                                                sx={{
                                                                    fontSize: { xs: "1rem", sm: "1.2rem" },
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {getEventTitle(detailType)}
                                                            </Typography>
                                                        </AccordionSummary>

                                                        <AccordionDetails>
                                                            {Object.keys(detail).map((key) => {
                                                                if (!key.includes("id")) {
                                                                    const value = detail[key];
                                                                    const renderValue = typeof value === "object" ? JSON.stringify(value) : value;
                                                                    return (
                                                                        <Typography
                                                                            variant="body2"
                                                                            key={key}
                                                                            sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                                                                        >
                                                                            {key}: {renderValue}
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
            )}
        </Box>
            );
        };
        export default DetallesItinerario;
        // <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", padding: "20px", boxShadow: 3, position: "relative", zIndex: 1, minHeight: "100vh", marginTop: "20px" }}>
        //     <Header />
        //     <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2rem" }, fontWeight: "bold" }} gutterBottom>
        //         Eventos del Itinerario
        //     </Typography>
        
        
        //     <Box sx={{ mb: 2 }}>
        //         <TextField label="Filtrar eventos" variant="outlined" fullWidth value={filter} onChange={(e) => setFilter(e.target.value)} />
        //     </Box>
            
        //     {eventos.length === 0 ? (
        //         <Typography variant="h6" color="textSecondary" align="center">
        //             No hay eventos disponibles para este itinerario.
        //         </Typography>
        //     ) : (
        //         <Timeline position="alternate" sx={{ backgroundColor: "#d0daf4", padding: "20px", borderRadius: "8px" }}>
        //             {filteredEvents.map((event, index) => (
        //                 <React.Fragment key={event.id}>
        //                     <Typography variant="h5" sx={{ marginTop: "20px", textAlign: "center" , fontWeight: "bold" }}>
        //                         Evento número {event.id} del itinerario número {id}
        //                     </Typography>
        //                     {detalles[index] && Object.keys(detalles[index]).map((detailType, detailIndex) => {
        //                         const detail = detalles[index][detailType];
        //                         if (detail) {
        //                             return (
        //                                 <TimelineItem key={detailIndex}>
        //                                     <TimelineOppositeContent>
        //                                         <Typography variant="body2" color="textSecondary">
        //                                             Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
        //                                         </Typography>
        //                                     </TimelineOppositeContent>
        //                                     <TimelineSeparator>
        //                                         <TimelineDot>{getEventIcon(detailType)}</TimelineDot>
        //                                         <TimelineConnector />
        //                                     </TimelineSeparator>
        //                                     <TimelineContent>
        //                                         <Accordion>
        //                                             <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        //                                                 <Typography variant="h6">{getEventTitle(detailType)}</Typography>
        //                                             </AccordionSummary>
        //                                             <AccordionDetails>
        //                                                 {Object.keys(detail).map((key) => {
        //                                                     if (!key.includes('id')) {
        //                                                         const value = detail[key];
        //                                                         const renderValue = typeof value === 'object' ? JSON.stringify(value) : value;
        //                                                         return (
        //                                                             <Typography variant="body2" key={key}>
        //                                                                 {key}: {renderValue}
        //                                                             </Typography>
        //                                                         );
        //                                                     }
        //                                                     return null;
        //                                                 })}
        //                                             </AccordionDetails>
        //                                         </Accordion>
        //                                     </TimelineContent>
        //                                 </TimelineItem>
        //                             );
        //                         }
        //                         return null;
        //                     })}
        //                 </React.Fragment>
        //             ))}
        //         </Timeline>
        //     )}
        // </Box>

