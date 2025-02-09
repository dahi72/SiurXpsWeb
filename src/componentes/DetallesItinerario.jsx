
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
            evento.aeropuertoId &&
                fetchDetalle(true, `${baseUrl}/Aeropuerto/${evento.aeropuertoId}`, "aeropuerto"),
            evento.aerolineaId &&
                fetchDetalle(true, `${baseUrl}/Aerolinea/${evento.aerolineaId}`, "aerolinea"),
            evento.hotelId && 
                fetchDetalle(true,`${baseUrl}/Hotel/${evento.hotelId}`, "hotel"),
            evento.vueloId && 
                fetchDetalle(true, `${baseUrl}/Vuelo/${evento.vueloId}`, "vuelo")
        ]);

        return detallesEvento;
    }, [baseUrl, headers]);

    // const fetchDetallesPorTipo = useCallback(async (evento) => {
    //     // Lógica para obtener detalles de un evento, similar a lo que hacías antes
    //     const detalleData = await fetchWithErrorHandling(
    //         `${baseUrl}/Eventos/${evento.EventoId}/detalles`,
    //         headers
    //     );
    //     return detalleData;
    // }, [baseUrl, headers]); // Esta función solo depende de baseUrl y headers

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
    }, [fetchDetallesPorTipo, detalles.length]); // Aquí usamos fetchDetallesPorTipo como dependencia

    
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
        }, [id, baseUrl, token, headers, eventos.length, fetchDetalles]); // Dependencias controladas
   

    useEffect(() => {
        fetchEventos();
    }, [ fetchEventos]);
    // const fetchDetalles = useCallback(async (eventos) => {
    //     const detallesPromises = eventos.map((evento) => fetchDetallesPorTipo(evento));
    //     return Promise.all(detallesPromises);
    // }, [fetchDetallesPorTipo]);
    

    // useEffect(() => {
    //     const fetchEventos = async () => {
    //         if (!id || !baseUrl || !token) {
    //             console.error("Missing required parameters:", { id, baseUrl, token: !!token });
    //             return;
    //         }

    //         try {
    //             console.log("Fetching eventos for itinerario:", id);
    //             const eventosData = await fetchWithErrorHandling(`${baseUrl}/Itinerario/${id}/eventos`, headers);
    //             if (!Array.isArray(eventosData)) {
    //                 console.error("Invalid response format:", eventosData);
    //                 throw new Error("La respuesta no tiene el formato esperado");
    //             }

    //             console.log("Eventos fetched successfully:", eventosData.length);
    //             setEventos(eventosData);


    //             if (eventosData.length > 0 && !cargandoDetalles) {
    //                 setCargandoDetalles(true);
    //                 console.log("Fetching detalles for eventos...");
    //                 const detallesArray = await fetchDetalles(eventosData);
    //                 console.log("Detalles fetched successfully");
    //                 setDetalles(detallesArray);
    //                 setCargandoDetalles(false);
    //             }
    //         } catch (error) {
    //             console.error("Error fetching eventos:", error);
    //         }
    //     };

    //     fetchEventos();
    // }, [id, token, baseUrl, headers, setDetalles, fetchDetalles, cargandoDetalles]);

    const getEventIcon = (event) => {
        if (event.vueloId) return <FlightIcon color="primary" />;
        if (event.aeropuertoId) return <AirportShuttleIcon color="primary" />;
        if (event.aerolineaId) return <AirlineSeatReclineNormalIcon color="primary" />;
        if (event.hotelId) return <HotelIcon color="secondary" />;
        if (event.trasladoId) return <DirectionsBusIcon color="action" />;
        if (event.actividadId) return <EventIcon color="success" />;
        return <EventIcon />;
    };

    const getEventTitle = (event) => {
        if (event.vueloId) return "Vuelo";
        if (event.aerolineaId) return "Aeropuerto";
        if (event.aerolineaId) return "Aerolinea";
        if (event.hotelId) return "Hotel";
        if (event.trasladoId) return "Traslado";
        if (event.actividadId) return "Actividad";
        return "Evento General";
    };

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
                                    <Typography variant="body2">Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}</Typography>
                                    {detalles[index] && detalles[index].actividad && (
                                    <>
                                        <Typography variant="body2">Actividad: {detalles[index].actividad.nombre}</Typography>
                                        {detalles[index].actividad.descripcion && (
                                        <Typography variant="body2">Descripción: {detalles[index].actividad.descripcion}</Typography>
                                        )}
                                        {detalles[index].actividad.duracion && (
                                            <Typography variant="body2">Duración: {detalles[index].actividad.duracion} horas</Typography>
                                        )}
                                        {detalles[index].actividad.tipo && (
                                            <Typography variant="body2">Ubicacion: {detalles[index].actividad.ubicacion}</Typography>
                                        )}
                                        </> 
                                    )}
                                    {detalles[index] && detalles[index].traslado && (
                                        <>
                                        <Typography variant="body2">Traslado: {detalles[index].traslado.nombre}</Typography>
                                        {detalles[index].traslado.lugarDeEncuantro && (
                                        <Typography variant="body2">Lugar de encuentro: {detalles[index].traslado.lugarDeEncuantro}</Typography>
                                        )}
                                        {detalles[index].traslado.tipoDeTraslado && (
                                            <Typography variant="body2">Tipo de traslado: {detalles[index].traslado.tipoDeTraslado} </Typography>
                                        )}
                                        {detalles[index].traslado.tips && (
                                            <Typography variant="body2">Tips: {detalles[index].traslado.tips}</Typography>
                                        )}
                                      </> 
                                    )}
                                    {detalles[index] && detalles[index].aeropuerto && (
                                             <>
                                            <Typography variant="body2">Aeropuerto: {detalles[index].aeropuerto.nombre}</Typography>
                                             {detalles[index].aeropuerto.direccion && (
                                             <Typography variant="body2">Dirección: {detalles[index].aeropuerto.direccion}</Typography>
                                             )}
                                             {detalles[index].aeropuerto.paginaWeb && (
                                                 <Typography variant="body2">Página web: {detalles[index].aeropuerto.paginaWeb} </Typography>
                                             )}
                                           </> 
                                    )}
                                    {detalles[index] && detalles[index].hotel && (
                                          <>
                                          <Typography variant="body2">Hotel: {detalles[index].hotel.nombre}</Typography>
                                          {detalles[index].hotel.direccion && (
                                          <Typography variant="body2">Dirección: {detalles[index].hotel.direccion}</Typography>
                                          )}
                                          {detalles[index].hotel.checkIn && (
                                            <Typography variant="body2">Check-In: {detalles[index].hotel.checkIn} </Typography>
                                          )}
                                          {detalles[index].hotel.checkOut && (
                                            <Typography variant="body2">Check-Out: {detalles[index].hotel.checkOut}</Typography>
                                          )}
                                          {detalles[index].hotel.paginaWeb && (
                                            <Typography variant="body2">Página web: {detalles[index].hotel.paginaWeb} </Typography>
                                           )}
                                        </> 
                                       
                                    )}
                                    {detalles[index] && detalles[index].vuelo && (
                                          <>
                                           <Typography variant="body2">Vuelo: {detalles[index].vuelo.nombre}</Typography>
                                           {detalles[index].vuelo.horario && (
                                           <Typography variant="body2">Horario: {detalles[index].vuelo.horario}</Typography>
                                           )}
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



// // const DetallesItinerario = () => {
// //     const { id } = useParams();
// //     const [eventos, setEventos] = useState([]);
// //     const [detalles, setDetalles] = useState([]);
// //     const [filter, setFilter] = useState("");
// //     // const baseUrl = process.env.REACT_APP_API_URL;
// //     const navigate = useNavigate();
// //     const token = localStorage.getItem("token");
// //     // console.log("Token", token);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState(null);
// //     const headers = createHeaders(token);

// //     const createHeaders = (token) => ({
// //         'Authorization': `Bearer ${token}`,
// //         'Content-Type': 'application/json'
// //     });

      
// //     const fetchWithErrorHandling = async (url, headers) => {
// //         try {
// //             console.log(`Fetching: ${url}`);
// //             const response = await fetch(url, {
// //                 method: 'GET',
// //                 headers
// //             });
          
// //             const data = await response.json();
          
// //             if (!response.ok) {
// //                 console.error('Server Error:', {
// //                     status: response.status,
// //                     statusText: response.statusText,
// //                     data
// //                 });
// //                 throw new Error(`Server error: ${response.status} - ${data.message || response.statusText}`);
// //             }
          
// //             return data;
// //         } catch (error) {
// //             console.error('Fetch Error:', {
// //                 url,
// //                 error: error.message,
// //                 stack: error.stack
// //             });
// //             throw error;
// //         }
// //     };
    
    
      
// //     const fetchDetallesPorTipo = async (evento) => {
// //         const detallesEvento = {};
      
// //         const fetchDetalle = async (condition, url, key) => {
// //             if (!condition) return;
// //             try {
// //                 detallesEvento[key] = await fetchWithErrorHandling(url, headers);
// //             } catch (error) {
// //                 console.error(`Error fetching ${key}:`, error);
// //                 // Continue with other fetches even if one fails
// //             }
// //         };
      
// //         await Promise.all([
// //             evento.actividadId && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Actividad/${evento.actividadId}`,
// //                 'actividad'
// //             ),
// //             evento.trasladoId && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`,
// //                 'traslado'
// //             ),
// //             evento.aeropuertoId && evento.aeropuerto?.nombre && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Aeropuerto/aeropuertos?nombre=${encodeURIComponent(evento.aeropuerto.nombre)}`,
// //                 'aeropuerto'
// //             ),
// //             evento.aerolineaId?.nombre && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Aerolinea/aerolineas?nombre=${encodeURIComponent(evento.aerolineaId.nombre)}`,
// //                 'aerolinea'
// //             ),
// //             evento.hotelId && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Hotel/hoteles?${new URLSearchParams({
// //                     nombre: evento.hotelId.nombre || '',
// //                     codigoIso: evento.hotelId.codigoIso || '',
// //                     ciudad: evento.hotelId.ciudad || ''
// //                 })}`,
// //                 'hotel'
// //             ),
// //             evento.vueloId?.nombre && fetchDetalle(
// //                 true,
// //                 `${baseUrl}/Vuelo/vuelos?nombre=${encodeURIComponent(evento.vueloId.nombre)}`,
// //                 'vuelo'
// //             )
// //         ].filter(Boolean)); // Filter out undefined promises
      
// //         return detallesEvento;
// //     };
      
// //     const fetchDetalles = async (eventos) => {
// //         const detallesPromises = eventos.map(evento => fetchDetallesPorTipo(evento));
// //         return Promise.all(detallesPromises);
// //     };
    
  
// //     useEffect(() => {
// //         const fetchEventos = async () => {
// //             if (!id || !baseUrl || !token) {
// //                 console.error('Missing required parameters:', { id, baseUrl, token: !!token });
// //                 return;
// //             }
      
// //             try {
// //                 setLoading(true);
// //                 setError(null);
      
// //                 console.log('Fetching eventos for itinerario:', id);
// //                 const eventosData = await fetchWithErrorHandling(
// //                     `${baseUrl}/Itinerario/${id}/eventos`,
// //                     headers
// //                 );
      
// //                 if (!Array.isArray(eventosData)) {
// //                     console.error('Invalid response format:', eventosData);
// //                     throw new Error('La respuesta no tiene el formato esperado');
// //                 }
      
// //                 console.log('Eventos fetched successfully:', eventosData.length);
// //                 setEventos(eventosData);
      
// //                 if (eventosData.length > 0) {
// //                     console.log('Fetching detalles for eventos...');
// //                     const detallesArray = await fetchDetalles(eventosData);
// //                     console.log('Detalles fetched successfully');
// //                     setDetalles(detallesArray);
// //                 }
// //             } catch (error) {
// //                 const errorMessage = error.message || 'Error desconocido';
// //                 console.error('Error in fetchEventos:', {
// //                     message: errorMessage,
// //                     stack: error.stack
// //                 });
// //                 setError(`Error al obtener los datos: ${errorMessage}`);
// //             } finally {
// //                 setLoading(false);
// //             }
      
// //             fetchEventos();
// //         }, [id, token, fetchDetalles, headers]
      
// //         return { eventos, detalles, loading, error };
// //     });
   
//     // useEffect(() => {
//     //     const fetchEventos = async () => {
//     //         try {
//     //             const response = await fetch(`${baseUrl}/Itinerario/${id}/eventos`, {
//     //                 method: 'GET',
//     //                 headers: {
//     //                     'Authorization': `Bearer ${token}`, 
//     //                     'Content-Type': 'application/json'
//     //                 }
//     //             });
        
//     //             const data = await response.json();
//     //             if (Array.isArray(data)) {
//     //                 setEventos(data);
//     //                 await fetchDetalles(data);
//     //             } else {
//     //                 console.error('La respuesta no es un array:', data);
//     //             }
//     //         } catch (error) {
//     //             console.error('Error al obtener eventos:', error);
//     //         }
//     //     };
        

//     //     const fetchDetalles = async (eventos) => {
//     //         const detallesPromises = eventos.map(async (evento) => {
//     //             const detallesEvento = {};
//     //             const headers = {
//     //                 'Authorization': `Bearer ${token}`, 
//     //                 'Content-Type': 'application/json'
//     //             };
        
//     //             if (evento.actividadId) {
//     //                 const actividadResponse = await fetch(`${baseUrl}/Actividad/${evento.actividadId}`, { headers });
//     //                 detallesEvento.actividad = await actividadResponse.json();
//     //             }
//     //             if (evento.trasladoId) {
//     //                 const trasladoResponse = await fetch(`${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`, { headers });
//     //                 detallesEvento.traslado = await trasladoResponse.json();
//     //             }
//     //             if (evento.aeropuertoId) {
//     //                 const query = `?nombre=${evento.aeropuerto.nombre}`;
//     //                 const aeropuertoResponse = await fetch(`${baseUrl}/Aeropuerto/aeropuertos` + query, { headers });
//     //                 detallesEvento.aeropuerto = await aeropuertoResponse.json();
//     //             }
//     //             if (evento.aerolineaId) {
//     //                 const query = `?nombre=${evento.aerolineaId.nombre}`;
//     //                 const aerolineaResponse = await fetch(`${baseUrl}/Aerolinea/aerolineas` + query, { headers });
//     //                 detallesEvento.aerolinea = await aerolineaResponse.json();
//     //             }
//     //             if (evento.hotelId) {
//     //                 const query = `?nombre=${evento.hotelId.nombre}&codigoIso=${evento.hotelId.codigoIso}&ciudad=${evento.hotelId.ciudad}`;
//     //                 const hotelResponse = await fetch(`${baseUrl}/Hotel/hoteles` + query, { headers });
//     //                 detallesEvento.hotel = await hotelResponse.json();
//     //             }
//     //             if (evento.vueloId) {
//     //                 const query = `?nombre=${evento.vueloId.nombre}`;
//     //                 const vueloResponse = await fetch(`${baseUrl}/Vuelo/vuelos` + query, { headers }); 
//     //                 detallesEvento.vuelo = await vueloResponse.json();
//     //             }
//     //             return detallesEvento;
//     //         });
        
//     //         const detallesArray = await Promise.all(detallesPromises);
//     //         setDetalles(detallesArray);
//     //     };
        
//     //     fetchEventos();

       
//     // }, [id, baseUrl, token]);

// //     const getEventIcon = (event) => {
// //         if (event.vueloId) return <FlightIcon color="primary" />;
// //         if (event.hotelId) return <HotelIcon color="secondary" />;
// //         if (event.trasladoId) return <DirectionsBusIcon color="action" />;
// //         if (event.actividadId) return <EventIcon color="success" />;
// //         return <EventIcon />;
// //     };

// //     const getEventTitle = (event) => {
// //         if (event.vueloId) return "Vuelo";
// //         if (event.hotelId) return "Hotel";
// //         if (event.trasladoId) return "Traslado";
// //         if (event.actividadId) return "Actividad";
// //         return "Evento General";
// //     };

// //     const filteredEvents = (eventos ?? []).filter((event) => {
// //         const title = getEventTitle(event) ?? '';
// //         return title.toLowerCase().includes((filter ?? '').toLowerCase());
// //     });


// //     return (
// //         <Box
// //             sx={{
// //                 backgroundColor: 'rgba(255, 255, 255, 0.8)',
// //                 borderRadius: '8px',
// //                 padding: '20px',
// //                 boxShadow: 3,
// //                 position: 'relative',
// //                 zIndex: 1,
// //                 minHeight: '100vh',
// //                 marginTop: '20px'
// //             }}
// //         >
// //             <Header />
// //             <Typography variant="h4" gutterBottom>
// //                 Eventos del Itinerario
// //             </Typography>
// //             <Button 
// //                 variant="contained" 
// //                 color="primary" 
// //                 onClick={() => navigate('/VerItinerario')} 
// //                 sx={{ mb: 2 }} 
// //             >
// //                 Ver Itinerario
// //             </Button>
// //             <Box sx={{ mb: 2 }}>
// //                 <TextField
// //                     label="Filtrar eventos"
// //                     variant="outlined"
// //                     fullWidth
// //                     value={filter}
// //                     onChange={(e) => setFilter(e.target.value)}
// //                 />
// //             </Box>

// //             <Timeline position="alternate"sx={{ backgroundColor: '#d0daf4', padding: '20px', borderRadius: '8px' }} >
// //                 {filteredEvents.map((event, index) => (
// //                     <TimelineItem key={event.id}>
// //                         <TimelineOppositeContent>
// //                             <Typography variant="body2" color="textSecondary">
// //                                 {new Date(event.fechaYHora).toLocaleString()}
// //                             </Typography>
// //                         </TimelineOppositeContent>
// //                         <TimelineSeparator>
// //                             <TimelineDot>{getEventIcon(event)}</TimelineDot>
// //                             <TimelineConnector />
// //                         </TimelineSeparator>
// //                         <TimelineContent>
// //                             <Accordion>
// //                                 <AccordionSummary expandIcon={<ExpandMoreIcon />}>
// //                                     <Typography variant="h6">{getEventTitle(event)}</Typography>
// //                                 </AccordionSummary>
// //                                 <AccordionDetails>
// //                                     <Typography variant="body2">
// //                                         Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
// //                                     </Typography>
// //                                     {detalles[index]?.actividad && (
// //                                         <>
// //                                             <Typography variant="body2">
// //                                                 <strong>Actividad:</strong> {detalles[index].actividad.nombre}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Descripción: {detalles[index].actividad.descripcion}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Ubicación: {detalles[index].actividad.ubicacion || 'Información no disponible'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Duración: {detalles[index].actividad.duracion || 'Desconocida'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Tips: {detalles[index].actividad.tips || 'No hay recomendaciones'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                País: {detalles[index].actividad.pais.nombre || 'No hay pais'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Ciudad: {detalles[index].actividad.ciudad.nombre || 'No hay ciudad'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Opcional?: {detalles[index].actividad.opcional || ''}
// //                                             </Typography>
// //                                             {/* <Typography variant="body2">
// //                                                 <strong>Enlace de información:</strong> <a href={detalles[index].actividad.enlace} target="_blank" rel="noopener noreferrer">Más información</a>
// //                                             </Typography> */}
// //                                         </>
// //                                     )}
// //                                     {detalles[index]?.traslado && (
// //                                         <>
// //                                             <Typography variant="body2">
// //                                                 <strong>Traslado:</strong> {detalles[index].traslado.lugarDeEncuentro || ''}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Horario: {detalles[index].traslado.horario || ''}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Tips: {detalles[index].traslado.tips || ''}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 País: {detalles[index].traslado.pais || ''}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Ciudad: {detalles[index].traslado.ciudad || ''}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Tipo de traslado: {detalles[index].traslado.tipoDeTraslado || ''}
// //                                             </Typography>
// //                                         </>
// //                                     )}
// //                                     {detalles[index]?.hotel && (
// //                                         <>
// //                                             <Typography variant="body2">
// //                                                 <strong>Hotel:</strong> {detalles[index].hotel.nombre}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Dirección: {detalles[index].hotel.direccion}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Fecha de Check-In: {new Date(detalles[index].hotel.checkIn).toLocaleDateString() || 'Fecha no disponible'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Fecha de Check-Out: {new Date(detalles[index].hotel.checkOut).toLocaleDateString() || 'Fecha no disponible'}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Enlace al sitio web: <a href={detalles[index].hotel.sitioWeb} target="_blank" rel="noopener noreferrer">Visitar sitio</a>
// //                                             </Typography></>
// //                                     )}
// //                                     {detalles[index]?.vuelo && (
// //                                         <>
// //                                             <Typography variant="body2">
// //                                                 <strong>Vuelo:</strong> {detalles[index].vuelo.nombre}
// //                                             </Typography>
// //                                             <Typography variant="body2">
// //                                                 Horario: {detalles[index].vuelo.horario}
// //                                             </Typography>
// //                                         </>
// //                                     )}
// //                                     {detalles[index]?.aeropuerto && (
// //                                         <>
// //                                         <Typography variant="body2">
// //                                             <strong>Aeropuerto:</strong> {detalles[index].aeropuerto.nombre}
// //                                         </Typography>
// //                                         <Typography variant="body2">
// //                                             Dirección: {detalles[index].aeropuerto.direccion}
// //                                         </Typography>
// //                                         <Typography variant="body2">
// //                                             Página web: <a href={detalles[index].aeropuerto.paginaWeb} target="_blank" rel="noopener noreferrer">{detalles[index].aeropuerto.paginaWeb}</a>
// //                                         </Typography>
// //                                     </>
// //                                 )}
// //                                 {detalles[index]?.aerolinea && (
// //                                     <>
// //                                         <Typography variant="body2">
// //                                             <strong>Aerolínea:</strong> {detalles[index].aerolinea.nombre}
// //                                         </Typography>
// //                                         <Typography variant="body2">
// //                                             Página web: <a href={detalles[index].aerolinea.paginaWeb} target="_blank" rel="noopener noreferrer">{detalles[index].aerolinea.paginaWeb}</a>
// //                                         </Typography>
// //                                     </>
// //                                 )}
// //                                 </AccordionDetails>
// //                             </Accordion>
// //                         </TimelineContent>
// //                     </TimelineItem>
// //                 ))}
// //             </Timeline>
// //         </Box>
// //     );
// // };

// // export default DetallesItinerario;