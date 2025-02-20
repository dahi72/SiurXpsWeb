
import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Typography, Box, TextField, Accordion, AccordionSummary, AccordionDetails, MenuItem, FormControl, InputLabel, Select, IconButton, Snackbar, Alert, DialogActions, Button, DialogContent, DialogTitle, Dialog } from '@mui/material';
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
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
//import { DeleteIcon, EditIcon } from 'lucide-react';
import { DateTimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const DetallesItinerario = () => {
    const { id } = useParams();
    const token = localStorage.getItem("token");
    const [eventos, setEventos] = useState([]);
    const [detalles, setDetalles] = useState([]);
    const [filter, setFilter] = useState("");
    const cargandoDetallesRef = useRef(false);
    const [sortOrder, setSortOrder] = useState("asc");
    const fetchedOnce = useRef(false);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [newDateTime, setNewDateTime] = useState(null);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const rol = localStorage.getItem('rol');
    
    const createHeaders = (token) => ({
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
    });

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
            showSnackbar(error.mensaje || 'No se puede modificar un evento pasado');
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
                const errorData = await response.json();  // Captura el mensaje de error del backend
                throw new Error(errorData.mensaje || 'Error al eliminar el evento'); // Aquí extraes el mensaje de error
            }
    
            const updatedEventos = eventos.filter(evt => evt.id !== selectedEvent.id);
            setEventos(updatedEventos);
            showSnackbar('Evento eliminado exitosamente');
        } catch (error) {
            console.error('Error:', error.message);  // Mostrar el mensaje de error correctamente
            showSnackbar(error.message || 'No se pudo eliminar el evento');
        }
    
        handleDeleteClose();
    };
    

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

    // const filteredEvents = eventos.filter((event) => {
    //     const title = getEventTitle(event) ?? "";
    //     return title.toLowerCase().includes(filter.toLowerCase());
    // });

    const handleSortOrderChange = (event) => {
        setSortOrder(event.target.value);
    };

    const filteredEvents = eventos
        .filter((event) => {
            const title = getEventTitle(event) ?? "";
            return title.toLowerCase().includes(filter.toLowerCase());
        })
        .sort((a, b) => {
            const dateA = new Date(a.fechaYHora).getTime();
            const dateB = new Date(b.fechaYHora).getTime();
            return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
        });

    return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
        overflowX: "hidden",
    }}
        >
            <Header />
            <Typography
                variant="h4"
                sx={{
                    fontSize: { xs: "1.3rem", sm: "2rem" },
                    fontWeight: "bold",
                    textAlign: "center",
                    mb: 2,
                }}
                    gutterBottom
                    fullWidth
            >
                Eventos del Itinerario
            </Typography>

            {/* <Box sx={{ mb: 2 }}>
                <TextField
                    label="Filtrar eventos"
                    variant="outlined"
                    fullWidth
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    sx={{ width: { xs: "100%", sm: "80%" }, mx: "auto" }}
                />
            </Box> */}

                <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                    <TextField 
                        fullWidth
                        label="Filtrar eventos" 
                        variant="outlined"
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                        sx={{ backgroundColor: 'white', flex: 1 }}
                    />
                    <FormControl sx={{ minWidth: 200, backgroundColor: 'white' }}>
                        <InputLabel>Ordenar por fecha</InputLabel>
                        <Select
                            value={sortOrder}
                            label="Ordenar por fecha"
                            onChange={handleSortOrderChange}
                        >
                            <MenuItem value="asc">Más antiguos primero</MenuItem>
                            <MenuItem value="desc">Más recientes primero</MenuItem>
                        </Select>
                    </FormControl>
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
                        // width: "100%", // Ajuste clave
                        // maxWidth: "900px",
                        mx: "auto",
                        width: "100%",  // 🔹 Permite que el Timeline se expanda
                        maxWidth: "none",
                    }}
                >
                    {filteredEvents.map((event, index) => (
                        <React.Fragment key={event.id}>
                            <Typography
                                fullWidth
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
                                    console.log("detail", detail)
                                    console.log("detailIndex", detailIndex)
                                    if (detail) {
                                        return (
                                            <TimelineItem key={detailIndex}>
                                                <TimelineOppositeContent
                                                    sx={{
                                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                                        textAlign: { xs: "left", sm: "right" },
                                                        width: { xs: "auto", sm: "180px" },
                                                        overflowWrap: "break-word", // 🔧 Mejora para textos largos
                                                    }}
                                                >
                                                   <Typography variant="body2" color="textSecondary">
                                                        Fecha y Hora: {new Date(event.fechaYHora).toLocaleString()}
                                                    </Typography>
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
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                                                    <Accordion  sx={{
                                                        width: "100%",
                                                        boxShadow: 2,
                                                        "& .MuiAccordionSummary-content": {
                                                            margin: 0,
                                                        },
                                                        "& .MuiAccordionDetails-root": {
                                                            padding: { xs: "8px", sm: "16px" }, 
                                                        },
                                                        }}>
                                                        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "8px", 
                                                            fontSize: { xs: "0.8rem", sm: "1rem" },
                                                        }}>
                                                                <Typography
                                                                    fullWidth
                                                                variant="h6"
                                                                sx={{
                                                                    fontSize: { xs: "1rem", sm: "1.2rem" },
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                {getEventTitle(detailType)}
                                                            </Typography>
                                                        </AccordionSummary>

                                                        <AccordionDetails   sx={{
                                                            display: "flex",
                                                            flexDirection: "column",
                                                            gap: "8px",
                                                            fontSize: { xs: "0.8rem", sm: "1rem" },
                                                            width: "100%",
                                                            overflowWrap: "break-word",
                                                        }} >
                                                            {Object.entries(detail)
                                                                .filter(([key]) => key !== "ciudadId" && key !== "paisId" && key !== "id") // Excluir ciudadId y paisId
                                                                .map(([key, value]) => (
                                                             <Typography
                                                                fullWidth
                                                                key={key}
                                                                variant="body2"
                                                                sx={{
                                                                    fontSize: { xs: "0.8rem", sm: "1rem" },
                                                                    display: "block",
                                                                    textAlign: "left",
                                                                    wordBreak: "break-word",
                                                                }}
                                                                >
                                                                <b>{key}:</b> 
                                                                {key === "ciudad" || key === "pais" ? 
                                                                    value.nombre : 
                                                                    (typeof value === "object" ? JSON.stringify(value) : value)
                                                                }
                                                                {/* Mostrar "opcional" aquí si existe */}
                                                                {key === "opcional" && (
                                                                    <span> {value ? "Sí" : "No"}</span>
                                                                )}
                                                            </Typography>
                                                                ))}
                                                        </AccordionDetails>
                                                    </Accordion>

                                                    <Box sx={{ 
                                                            display: 'flex', 
                                                            flexDirection: 'column', 
                                                            gap: 1,
                                                            mt: 1
                                                        }}>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleEditClick(event)}
                                                                sx={{ 
                                                                    bgcolor: 'white',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(25, 118, 210, 0.04)'
                                                                    }
                                                                }}
                                                            >
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                onClick={() => handleDeleteClick(event)}
                                                                sx={{ 
                                                                    bgcolor: 'white',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(211, 47, 47, 0.04)'
                                                                    }
                                                                }}
                                                            >
                                                                <DeleteIcon color="error" />
                                                            </IconButton>
                                                        </Box>
                                                    </Box>
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
                {rol !== "Viajero" && (
                    <>
                   <Dialog open={openEditDialog} onClose={handleEditClose}>
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

                <Dialog open={openDeleteDialog} onClose={handleDeleteClose}>
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
                        </>
                        )}
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
       
