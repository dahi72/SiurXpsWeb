import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Typography, Box, MenuItem, FormControl, InputLabel, Select, IconButton, Snackbar, Alert, DialogActions, Button, DialogContent, DialogTitle, Dialog, Card, CardContent, CardHeader, Collapse } from '@mui/material';
import FlightIcon from '@mui/icons-material/Flight';
import HotelIcon from '@mui/icons-material/Hotel';
import EventIcon from '@mui/icons-material/Event';
import { useParams } from 'react-router-dom';
import Header from './Header';
import AirportShuttleIcon from '@mui/icons-material/AirportShuttle';
import AirlineSeatReclineNormalIcon from '@mui/icons-material/AirlineSeatReclineNormal';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DetallesItinerario = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [eventos, setEventos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const cargandoDetallesRef = useRef(false);
    const [sortOrder, setSortOrder] = useState("desc"); // Default to most recent first
    const fetchedOnce = useRef(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newDateTime, setNewDateTime] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const rol = localStorage.getItem('rol');
    const [expandedCards, setExpandedCards] = useState({});
    
    const createHeaders = (token) => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });
    const getTipoTraslado = (tipo) => {
        switch (tipo) {
          case 1:
            return "Transfer In";
          case 2:
            return "Transfer Out";
          case 3:
            return "Tren";
          case 4:
            return "Transfer InterHotel";
          case 5:
            return "Bus";
          case 6:
            return "Ferry";
          default:
            return "Desconocido";
        }
      };
    const headers = createHeaders(token);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        });
    };

    const handleEditClick = (event) => {
        setSelectedEvent(event);
        setNewDateTime(new Date(event.fechaYHora));
        setOpenEditDialog(true);
    };

    const handleDeleteClick = (event) => {
        setSelectedEvent(event);
        setOpenDeleteDialog(true);
    };

    const handleEditClose = () => {
        setOpenEditDialog(false);
        setSelectedEvent(null);
        setNewDateTime(null);
    };

    const handleDeleteClose = () => {
        setOpenDeleteDialog(false);
        setSelectedEvent(null);
    };

    const handleExpandClick = (cardId) => {
        setExpandedCards(prev => ({
            ...prev,
            [cardId]: !prev[cardId]
        }));
    };

    const handleEditConfirm = async () => {
        if (!selectedEvent || !newDateTime) return;

        try {
            const response = await fetch(`${baseUrl}/Itinerario/${id}/eventos/${selectedEvent.id}/horario`, {
                method: 'PUT',
                headers,
                body: JSON.stringify(newDateTime.toISOString())
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al modificar el horario');
            }

            const updatedEventos = eventos.map(evt =>
                evt.id === selectedEvent.id ? { ...evt, fechaYHora: newDateTime } : evt
            );
            setEventos(updatedEventos);
            showSnackbar('Horario actualizado exitosamente');
        } catch (error) {
            console.error('Error:', error);
            showSnackbar(error.mensaje || 'No se puede modificar un evento pasado', 'error');
        }

        handleEditClose();
    };

    const handleDeleteConfirm = async () => {
        if (!selectedEvent) return;

        try {
            const response = await fetch(`${baseUrl}/Itinerario/${id}/eventos/${selectedEvent.id}`, {
                method: 'DELETE',
                headers
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.mensaje || 'Error al eliminar el evento');
            }

            const updatedEventos = eventos.filter(evt => evt.id !== selectedEvent.id);
            setEventos(updatedEventos);
            showSnackbar('Evento eliminado exitosamente');
        } catch (error) {
            console.error('Error:', error.message);
            showSnackbar(error.message || 'No se pudo eliminar el evento', 'error');
        }

        handleDeleteClose();
    };

    const fetchWithErrorHandling = async (url, headers) => {
        try {
            const response = await fetch(url, { method: "GET", headers });
            const data = await response.json();

            if (!response.ok) {
                throw new Error("El itinerario no tiene eventos asociados");
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
                if (eventosData.length === 0) {
                    setEventos([]);
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
                return <FlightIcon color="primary" />;
            case 'aerolineaId':
                return <AirlineSeatReclineNormalIcon color="primary" />;
            case 'hotelId':
                return <HotelIcon color="secondary" />;
            case 'trasladoId':
                return <AirportShuttleIcon color="success" />;
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
                return "Aerolínea";
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

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    // Create sorted events array with their details
    const sortedEventsWithDetails = eventos.map((event, index) => ({
        event,
        details: detalles[index],
        date: new Date(event.fechaYHora).getTime()
    }))
    .sort((a, b) => {
        return sortOrder === "asc" ? a.date - b.date : b.date - a.date;
    });

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
           
                <Box sx={{
                    maxWidth: "800px",
                    margin: "0 auto",
                    backgroundColor: "rgba(191, 239, 255, 0.1)",  
                    borderRadius: "12px",
                    padding: { xs: "12px", sm: "16px", md: "24px" },
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                }}>
                    <Header />
                    <Typography
                        variant="h4"
                        sx={{
                            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "2rem" },
                            fontWeight: "bold",
                            textAlign: "center",
                            mb: { xs: 2, sm: 3, md: 4 },
                            color: "#1a365d",
                        }}
                    >
                        Eventos del Itinerario
                    </Typography>

                    <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                        <FormControl sx={{ width: { xs: '100%', sm: 200 } }}>
                            <InputLabel>Ordenar por fecha</InputLabel>
                            <Select
                                value={sortOrder}
                                label="Ordenar por fecha"
                                onChange={handleSortOrderChange}
                                sx={{
                                    backgroundColor: 'white',
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        borderColor: '#e2e8f0',
                                    },
                                }}
                            >
                                <MenuItem value="desc">Más recientes primero</MenuItem>
                                <MenuItem value="asc">Más antiguos primero</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    {eventos.length === 0 ? (
                        <Box sx={{
                            textAlign: 'center',
                            py: { xs: 4, sm: 6, md: 8 },
                            backgroundColor: '#f8fafc',
                            borderRadius: '8px',
                        }}>
                            <Typography variant="h6" color="text.secondary">
                                No hay eventos disponibles para este itinerario.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ 
                            display: 'flex', 
                            flexDirection: 'column',
                            position: 'relative',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: { xs: '16px', sm: '24px' },
                                top: '24px',
                                bottom: '24px',
                                width: '2px',
                                backgroundColor: '#e2e8f0',
                                zIndex: 0,
                            }
                        }}>
                            {sortedEventsWithDetails.map(({ event, details }) => (
                                details && Object.keys(details).map((detailType, detailIndex) => {
                                    const detail = details[detailType];
                                    if (!detail) return null;

                                    const eventTitle = getEventTitle(detailType);
                                    const eventIcon = getEventIcon(detailType);
                                    const eventDate = new Date(event.fechaYHora);
                                    const cardId = `${event.id}-${detailIndex}`;

                                    return (
                                        <Box
                                            key={cardId}
                                            sx={{
                                                display: 'flex',
                                                mb: { xs: 2, sm: 3 },
                                                position: 'relative',
                                                zIndex: 1,
                                                px: { xs: 1, sm: 2 },
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    width: { xs: '36px', sm: '48px' },
                                                    height: { xs: '36px', sm: '48px' },
                                                    backgroundColor: 'white',
                                                    borderRadius: '50%',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                    zIndex: 2,
                                                    flexShrink: 0,
                                                }}
                                            >
                                                {eventIcon}
                                            </Box>
                                            <Card 
                                                sx={{
                                                    flex: 1,
                                                    ml: { xs: 1, sm: 2 },
                                                    borderRadius: '12px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'translateY(-2px)',
                                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                                    },
                                                }}
                                            >
                                                <CardHeader
                                                    sx={{
                                                        p: { xs: 1.5, sm: 2 },
                                                    }}
                                                    title={
                                                        <Box sx={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            justifyContent: 'space-between',
                                                            flexWrap: { xs: 'wrap', sm: 'nowrap' },
                                                            gap: { xs: 1, sm: 0 }
                                                        }}>
                                                            <Typography 
                                                                variant="h6" 
                                                                component="div" 
                                                                sx={{ 
                                                                    fontWeight: 600,
                                                                    fontSize: { xs: '1rem', sm: '1.25rem' }
                                                                }}
                                                            >
                                                                {eventTitle}
                                                            </Typography>
                                                            <Box sx={{ 
                                                                display: 'flex', 
                                                                gap: 1,
                                                                ml: { xs: 0, sm: 2 }
                                                            }}>
                                                                {rol !== "Viajero" && (
                                                                    <>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleEditClick(event)}
                                                                            sx={{
                                                                                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                                                                                '&:hover': {
                                                                                    backgroundColor: 'rgba(25, 118, 210, 0.08)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <EditIcon fontSize="small" color="primary" />
                                                                        </IconButton>
                                                                        <IconButton
                                                                            size="small"
                                                                            onClick={() => handleDeleteClick(event)}
                                                                            sx={{
                                                                                backgroundColor: 'rgba(211, 47, 47, 0.04)',
                                                                                '&:hover': {
                                                                                    backgroundColor: 'rgba(211, 47, 47, 0.08)',
                                                                                },
                                                                            }}
                                                                        >
                                                                            <DeleteIcon fontSize="small" color="error" />
                                                                        </IconButton>
                                                                    </>
                                                                )}
                                                                <IconButton
                                                                    onClick={() => handleExpandClick(cardId)}
                                                                    sx={{
                                                                        transform: expandedCards[cardId] ? 'rotate(180deg)' : 'rotate(0deg)',
                                                                        transition: 'transform 0.2s',
                                                                    }}
                                                                >
                                                                    <ExpandMoreIcon />
                                                                </IconButton>
                                                            </Box>
                                                        </Box>
                                                    }
                                                    subheader={
                                                        <Typography 
                                                            variant="subtitle2" 
                                                            color="text.secondary"
                                                            sx={{
                                                                fontSize: { xs: '0.75rem', sm: '0.875rem' },
                                                                mt: { xs: 0.5, sm: 1 }
                                                            }}
                                                        >
                                                            {eventDate.toLocaleDateString('es-ES', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Typography>
                                                    }
                                                />
                                                <Collapse in={expandedCards[cardId]} timeout="auto" unmountOnExit>
                                                <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
  <Box sx={{ 
    display: 'grid',
    gridTemplateColumns: { 
      xs: '1fr',
      sm: 'repeat(auto-fit, minmax(200px, 1fr))'
    },
    gap: { xs: 1, sm: 2 }
  }}>
    {/* Aquí va el bloque de código que te proporcioné */}
    {Object.entries(detail)
      .filter(([key]) => key !== "ciudadId" && key !== "paisId" && key !== "id")
      .map(([key, value]) => {
        const displayValue = key === "tipoDeTraslado" 
          ? getTipoTraslado(value)
          : key === "ciudad" || key === "pais"
            ? value.nombre
            : key === "opcional"
              ? (value ? "Sí" : "No")
              : (typeof value === "object" ? JSON.stringify(value) : value);

        return (
          <Box
            key={key}
            sx={{
              p: { xs: 1.5, sm: 2 },
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
            }}
          >
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ 
                mb: 0.5, 
                textTransform: 'capitalize',
                fontSize: { xs: '0.75rem', sm: '0.875rem' }
              }}
            >
              {key}
            </Typography>
            <Typography 
              variant="body2"
              sx={{
                fontSize: { xs: '0.875rem', sm: '1rem' },
                wordBreak: 'break-word'
              }}
            >
              {displayValue}
            </Typography>
          </Box>
        );
      })}
  </Box>
</CardContent>
                                                </Collapse>
                                            </Card>
                                        </Box>
                                    );
                                })
                            ))}
                        </Box>
                    )}

                    <Dialog 
                        open={openEditDialog} 
                        onClose={handleEditClose}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>Modificar Horario del Evento</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2 }}>
                                <DateTimePicker
                                    label="Nueva fecha y hora"
                                    value={newDateTime}
                                    onChange={setNewDateTime}
                                    sx={{ width: '100%' }}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleEditClose}>Cancelar</Button>
                            <Button onClick={handleEditConfirm} variant="contained" color="primary">
                                Guardar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Dialog 
                        open={openDeleteDialog} 
                        onClose={handleDeleteClose}
                        fullWidth
                        maxWidth="xs"
                    >
                        <DialogTitle>Eliminar Evento</DialogTitle>
                        <DialogContent>
                            <Typography>¿Está seguro que desea eliminar este evento?</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleDeleteClose}>Cancelar</Button>
                            <Button onClick={handleDeleteConfirm} variant="contained" color="error">
                                Eliminar
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <Snackbar
                        open={snackbar.open}
                        autoHideDuration={6000}
                        onClose={handleCloseSnackbar}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    >
                        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                            {snackbar.message}
                        </Alert>
                    </Snackbar>
                </Box>
           
        </LocalizationProvider>
    );
};

export default DetallesItinerario;
