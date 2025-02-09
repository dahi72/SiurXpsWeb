import React, { useEffect, useState, useCallback } from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineDot, TimelineContent, TimelineConnector, TimelineOppositeContent } from '@mui/lab';

import { Typography, Box, TextField, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore as ExpandMoreIcon, Flight as FlightIcon, Hotel as HotelIcon, DirectionsBus as DirectionsBusIcon, Event as EventIcon, AirportShuttle as AirportShuttleIcon, AirlineSeatReclineNormal as AirlineSeatReclineNormalIcon } from '@mui/icons-material';
import { useParams } from 'react-router-dom';

const DetallesItinerario = () => {
  const { id } = useParams();
  const [eventos, setEventos] = useState([]);
  const [detalles, setDetalles] = useState([]);
  const [filter, setFilter] = useState("");
  const token = localStorage.getItem("token");
  const baseUrl = process.env.REACT_APP_API_URL;

  const createHeaders = (token) => ({
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json"
  });

  const fetchWithErrorHandling = async (url, headers) => {
    try {
      const response = await fetch(url, { method: "GET", headers });
      const data = await response.json();
      if (!response.ok) throw new Error(`Error del servidor: ${response.status} - ${data.message}`);
      return data;
    } catch (error) {
      console.error("Error de búsqueda:", error);
      throw error;
    }
  };

  const fetchDetallesPorTipo = useCallback(async (evento) => {
    const detallesEvento = {};
    const fetchDetalle = async (condition, url, key) => {
      if (!condition) return;
      try {
        detallesEvento[key] = await fetchWithErrorHandling(url, createHeaders(token));
      } catch (error) {
        console.error(`Error al buscar ${key}:`, error);
      }
    };

    await Promise.all([
      evento.hotelId && fetchDetalle(true, `${baseUrl}/Hotel/${evento.hotelId}`, "hotel"),
      evento.vueloId && fetchDetalle(true, `${baseUrl}/Vuelo/${evento.vueloId}`, "vuelo"),
      evento.aerolineaId && fetchDetalle(true, `${baseUrl}/Aerolinea/${evento.aerolineaId}`, "aerolinea"),
      evento.aeropuertoId && fetchDetalle(true, `${baseUrl}/Aeropuerto/${evento.aeropuertoId}`, "aeropuerto"),
      evento.actividadId && fetchDetalle(true, `${baseUrl}/Actividad/${evento.actividadId}`, "actividad"),
      evento.trasladoId && fetchDetalle(true, `${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`, "traslado")
    ]);

    return detallesEvento;
  }, [baseUrl, token]);

  const fetchEventos = useCallback(async () => {
    try {
      const eventosData = await fetchWithErrorHandling(`${baseUrl}/Itinerario/${id}/eventos`, createHeaders(token));
      setEventos(eventosData);
      if (eventosData.length > 0) {
        const detallesArray = await Promise.all(eventosData.map(evento => fetchDetallesPorTipo(evento)));
        setDetalles(detallesArray);
      }
    } catch (error) {
      console.error("Error al obtener eventos:", error);
    }
  }, [id, baseUrl, token, fetchDetallesPorTipo]);

  useEffect(() => {
    fetchEventos();
  }, [fetchEventos]);

  const obtenerIconoEvento = (evento) => {
    if (evento.vueloId) return <FlightIcon color="primary" />;
    if (evento.aeropuertoId) return <AirportShuttleIcon color="primary" />;
    if (evento.aerolineaId) return <AirlineSeatReclineNormalIcon color="primary" />;
    if (evento.hotelId) return <HotelIcon color="secondary" />;
    if (evento.trasladoId) return <DirectionsBusIcon color="action" />;
    if (evento.actividadId) return <EventIcon color="success" />;
    return <EventIcon />;
  };

  const obtenerTituloEvento = (evento) => {
    if (evento.vueloId) return "Vuelo";
    if (evento.aerolineaId) return "Aerolinea";
    if (evento.hotelId) return "Hotel";
    if (evento.trasladoId) return "Traslado";
    if (evento.actividadId) return "Actividad";
    return "Evento";
  };

  const eventosFiltrados = eventos.filter((evento) => obtenerTituloEvento(evento).toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", borderRadius: "8px", padding: "20px", boxShadow: 3, position: "relative", zIndex: 1, minHeight: "100vh", marginTop: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Eventos del Itinerario
      </Typography>
      <TextField label="Filtrar eventos" variant="outlined" fullWidth value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ mb: 2 }} />
      
      <Timeline position="alternate">
        {eventosFiltrados.map((evento, index) => (
          <TimelineItem key={index}>
            <TimelineOppositeContent color="text.secondary">
              <Typography>{evento.fecha}</Typography>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary">
                {obtenerIconoEvento(evento)}
              </TimelineDot>
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography variant="h6">{obtenerTituloEvento(evento)}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body1">Detalles del evento: </Typography>
                  {detalles[index] && (
                    <>
                      {detalles[index].vuelo && (
                        <Box>
                          <Typography variant="body2">Vuelo: {detalles[index].vuelo.nombre}</Typography>
                          <Typography variant="body2">Hora de salida: {detalles[index].vuelo.horario}</Typography>
                        </Box>
                      )}
                      {detalles[index].hotel && (
                        <Box>
                            <Typography variant="body2">Hotel: {detalles[index].hotel.nombre}</Typography>
                            <Typography variant="body2">Dirección: {detalles[index].hotel.direccion}</Typography>
                            <Typography variant="body2">Check-In: {detalles[index].hotel.checkIn}</Typography>
                            <Typography variant="body2">Check-Out: {detalles[index].hotel.checkOut}</Typography>
                            <Typography variant="body2">Página web: {detalles[index].hotel.paginaWeb}</Typography>
                        </Box>
                      )}
                      {detalles[index].actividad && (
                        <Box>
                          <Typography variant="body2">Actividad: {detalles[index].actividad.nombre}</Typography>
                        <Typography variant="body2">Descripción: {detalles[index].actividad.descripcion}</Typography>
                        <Typography variant="body2">Dirección: {detalles[index].actividad.direccion}</Typography>
                        <Typography variant="body2">Página web: {detalles[index].actividad.paginaWeb}</Typography>
                        </Box>
                      )}
                      {detalles[index].traslado && (
                        <Box>
                          <Typography variant="body2">Traslado: {detalles[index].traslado.nombre}</Typography>
                          <Typography variant="body2">Lugar de encuentro: {detalles[index].traslado.lugarDeEncuentro}</Typography>
                          <Typography variant="body2">Horario: {detalles[index].traslado.horario}</Typography>
                        </Box>
                      )}
                      {detalles[index].aeropuerto && (
                        <Box>
                        <Typography variant="body2">Aeropuerto: {detalles[index].aeropuerto.nombre}</Typography>
                        <Typography variant="body2">Dirección: {detalles[index].aeropuerto.direccion}</Typography>
                        <Typography variant="body2">Página web: {detalles[index].aeropuerto.paginaWeb}</Typography>
                        </Box>
                      )}
                      {detalles[index].aerolinea && (
                        <Box>
                        <Typography variant="body2">Aerolinea: {detalles[index].aerolinea.nombre}</Typography>
                        <Typography variant="body2">Página web: {detalles[index].aerolinea.paginaWeb}</Typography>
                        </Box>
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













