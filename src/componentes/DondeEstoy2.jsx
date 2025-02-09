import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Typography, CircularProgress, Paper, Snackbar, Alert, Backdrop } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useUsuario } from '../hooks/UsuarioContext';

// Arreglo para el ícono del marcador
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para centrar el mapa en la ubicación actual
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const map = useMap();
  
    useEffect(() => {
        map.locate().on("locationfound", function (e) {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }).on("locationerror", function (e) {
            setError(e.message);
        });
    }, [map]);

    return position === null ? (
        error ? <div>{error}</div> : null
    ) : (
        <Marker position={position}>
            <Popup>¡Estás aquí!</Popup>
        </Marker>
    );
}

const DondeEstoy2 = () => {
    const { Usuario } = useUsuario();
    const usuarioId = Usuario?.id;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState([0, 0]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showEventMarkers, setShowEventMarkers] = useState(false);
    const [eventMarkers, setEventMarkers] = useState([]);
    const baseUrl = process.env.REACT_APP_API_URL;
    const [ setItinerarios] = useState([]);
    const [eventos, setEventos] = useState([]);
    const token = localStorage.getItem('token');

// Función para geocodificar direcciones
const geocodeLocation = async (address) => {
    const apiKey = 'ffe0407498914865a2e38a5418e8a482'; // Usa tu clave de API aquí
    try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
        if (response.data.results.length > 0) {
            return {
                lat: response.data.results[0].geometry.lat,
                lng: response.data.results[0].geometry.lng,
            };
        }
    } catch (error) {
        console.error('Error geocodificando la dirección:', error.response ? error.response.data : error.message);
    }
    return null;
};

useEffect(() => {
    const fetchEventMarkers = async () => {
        const markers = await Promise.all(eventos.map(async (evento) => {
            const location = await geocodeLocation(evento.ubicacion);
            return location ? { lat: location.lat, lng: location.lng, title: evento.title } : null;
        }));
        setEventMarkers(markers.filter(marker => marker !== null)); 
    };

    fetchEventMarkers();
}, [eventos]);
    


useEffect(() => {
    const fetchItinerarios = async () => {

        
        if (!usuarioId) return; // Evita hacer la petición si no hay usuario

        try {
            // 1. Obtener los itinerarios del coordinador
            const response = await axios.get(`${baseUrl}/ItinerariosDeCoordinador/${usuarioId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Incluir el token en el header
                }
                });
            setItinerarios(response.data);

            // Obtener el listado de países
            const paisesResponse = await axios.get(`${baseUrl}/Pais/listado`);
            const paises = paisesResponse.data;

            // 2. Obtener los eventos de cada itinerario
            const eventosPromises = response.data.map(async (itinerario) => {
                try {
                    const eventosResponse = await axios.get(`${baseUrl}/Itinerario/${itinerario.id}/eventos`);
                    const eventosConDetalles = await Promise.all(
                        eventosResponse.data.map(async (evento) => {
                            // 3. Crear un arreglo para obtener todos los detalles del evento
                            const detallesPromises = [];

                            // Agregar detalle de actividad
                            if (evento.actividadId) {
                                detallesPromises.push(
                                    axios.get(`${baseUrl}/Actividad/${evento.actividadId}`).then(res => ({ actividad: res.data }))
                                );
                            }

                            // Agregar detalle de traslado
                            if (evento.trasladoId) {
                                detallesPromises.push(
                                    axios.get(`${baseUrl}/Traslado/api/Traslado/${evento.trasladoId}`).then(res => ({ traslado: res.data }))
                                );
                            }

                            // Agregar detalle de aeropuerto
                            if (evento.aeropuertoId) {
                                detallesPromises.push(
                                    axios.get(`${baseUrl}/Aeropuerto/${evento.aeropuertoId}`).then(res => ({ aeropuerto: res.data }))
                                );
                            }

                            // Agregar detalle de hotel
                            if (evento.hotelId) {
                                detallesPromises.push(
                                    axios.get(`${baseUrl}/Hotel/${evento.hotelId}`).then(res => ({ hotel: res.data }))
                                );
                            }

                            // Esperar a que todos los detalles se resuelvan
                            const detalles = await Promise.all(detallesPromises);
                            const eventoConDetalles = detalles.reduce((acc, detalle) => {
                                return { ...acc, ...detalle };
                            }, evento);

                            // 4. Obtener el país usando el paisId y el códigoIso para obtener las ciudades
                            const obtenerPaisYCiudad = async (paisId, ciudadId) => {
                                // Buscar el país en el listado de países
                                const pais = paises.find(p => p.id === paisId);

                                if (pais) {
                                    // Obtener las ciudades de ese país
                                    const ciudadesResponse = await axios.get(`${baseUrl}/Ciudad/${pais.codigoIso}/ciudades`);
                                    const ciudad = ciudadesResponse.data.find(c => c.id === ciudadId);

                                    return { pais, ciudad };
                                }

                                return { pais: null, ciudad: null };
                            };

                            // Obtener la información de país y ciudad para cada ubicación
                            const ubicacionHotel = eventoConDetalles.hotelId
                                ? await obtenerPaisYCiudad(eventoConDetalles.hotel.paisId, eventoConDetalles.hotel.ciudadId)
                                : { pais: null, ciudad: null };

                            const ubicacionActividad = eventoConDetalles.actividadId
                                ? await obtenerPaisYCiudad(eventoConDetalles.actividad.paisId, eventoConDetalles.actividad.ciudadId)
                                : { pais: null, ciudad: null };

                            const ubicacionTraslado = eventoConDetalles.trasladoId
                                ? await obtenerPaisYCiudad(eventoConDetalles.traslado.paisId, eventoConDetalles.traslado.ciudadId)
                                : { pais: null, ciudad: null };

                            const ubicacionAeropuerto = eventoConDetalles.aeropuertoId
                                ? await obtenerPaisYCiudad(eventoConDetalles.aeropuerto.paisId, eventoConDetalles.aeropuerto.ciudadId)
                                : { pais: null, ciudad: null };

                            // Construir las direcciones con los detalles de cada uno
                            const direccionHotel = eventoConDetalles.hotel?.direccion
                                ? `${eventoConDetalles.hotel.direccion}, ${ubicacionHotel.ciudad ? `${ubicacionHotel.ciudad.nombre}, ${ubicacionHotel.pais.nombre}` : ''}`
                                : `${ubicacionHotel.ciudad ? `${ubicacionHotel.ciudad.nombre}, ${ubicacionHotel.pais.nombre}` : ''}`;

                            const direccionActividad = eventoConDetalles.actividad?.ubicacion
                                ? `${eventoConDetalles.actividad.ubicacion}, ${ubicacionActividad.ciudad ? `${ubicacionActividad.ciudad.nombre}, ${ubicacionActividad.pais.nombre}` : ''}`
                                : `${ubicacionActividad.ciudad ? `${ubicacionActividad.ciudad.nombre}, ${ubicacionActividad.pais.nombre}` : ''}`;

                            const direccionTraslado = eventoConDetalles.traslado?.lugarDeEncuentro
                                ? `${eventoConDetalles.traslado.lugarDeEncuentro}, ${ubicacionTraslado.ciudad ? `${ubicacionTraslado.ciudad.nombre}, ${ubicacionTraslado.pais.nombre}` : ''}`
                                : `${ubicacionTraslado.ciudad ? `${ubicacionTraslado.ciudad.nombre}, ${ubicacionTraslado.pais.nombre}` : ''}`;

                            const direccionAeropuerto = eventoConDetalles.aeropuerto?.direccion
                                ? `${eventoConDetalles.aeropuerto.direccion}, ${ubicacionAeropuerto.ciudad ? `${ubicacionAeropuerto.ciudad.nombre}, ${ubicacionAeropuerto.pais.nombre}` : ''}`
                                : `${ubicacionAeropuerto.ciudad ? `${ubicacionAeropuerto.ciudad.nombre}, ${ubicacionAeropuerto.pais.nombre}` : ''}`;

                            const direccionFinal = `${direccionHotel} ${direccionActividad} ${direccionTraslado} ${direccionAeropuerto}`.trim();
                            console.log("eventoConDetalle", eventoConDetalles);
                            // Geocodificar la dirección final
                            const location = await geocodeLocation(direccionFinal);
                            console.log("direccionFinal", direccionFinal);
                            return location
                                ? { ...eventoConDetalles, lat: location.lat, lng: location.lng, direccion: direccionFinal }
                                : { ...eventoConDetalles, lat: null, lng: null, direccion: direccionFinal };
                        })
                    );

                    return eventosConDetalles;
                } catch (error) {
                    console.error(`Error al obtener eventos del itinerario ${itinerario.id}:`, error);
                    return []; // Devuelve un array vacío en caso de error
                }
            });

            // Esperar a que todas las promesas de eventos terminen
            const eventosConDetalles = await Promise.all(eventosPromises);
            setEventos(eventosConDetalles.flat()); // Aplanar el array de eventos

        } catch (error) {
            console.error("Error al obtener los itinerarios:", error);
        }
    };

    fetchItinerarios();
}, [baseUrl, usuarioId, setItinerarios, token]);



useEffect(() => {
    if (!navigator.geolocation) {
        setError('Tu navegador no soporta geolocalización');
        setLoading(false);
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setCenter([position.coords.latitude, position.coords.longitude]);
            setLoading(false);
        },
        (error) => {
            let errorMessage = 'No se pudo obtener tu ubicación';
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = 'No has dado permiso para acceder a tu ubicación';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = 'La información de ubicación no está disponible';
                    break;
                case error.TIMEOUT:
                    errorMessage = 'Se agotó el tiempo para obtener la ubicación';
                    break;
                default:
                    errorMessage = 'Ocurrió un error desconocido';
            }
            setError(errorMessage);
            setLoading(false);
        },
        {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        }
    );
}, [eventos]);



const handleSnackbarClose = () => {
    setOpenSnackbar(false);
};

if (loading || error) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor:'#fff' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>
                Obteniendo tu ubicación...
            </Typography>
        </Box>
    );
}

return (
    <>
        {/* Snackbar para mensajes */}
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
            <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                {snackbarMessage}
            </Alert>
        </Snackbar>

        {/* Backdrop para el indicador de carga */}
        <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <CircularProgress color="inherit" />
        </Backdrop>

        {/* Contenedor del mapa */}
        <Box sx={{ p: 2 }}>
    
            {error ? (
                <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                </Typography>
            ) : (
                <Paper sx={{ height: '70vh', width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: 3 }}>
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        doubleClickZoom={true}
                        zoomControl={true}
                    >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <LocationMarker />

                        {/* Mostrar marcadores de eventos */}
                        {showEventMarkers && eventMarkers.map((event, index) => (
                            <Marker key={index} position={[event.lat, event.lng]}>
                                <Popup>{event.title}</Popup>
                            </Marker>
                        ))}
                    </MapContainer>
                </Paper>
            )}

            {/* Botón para mostrar/ocultar eventos */}
            <Button
                onClick={() => {
                    setShowEventMarkers(!showEventMarkers);
                    setSnackbarMessage(showEventMarkers ? 'Eventos ocultos' : 'Eventos mostrados');
                    setSnackbarSeverity(showEventMarkers ? 'info' : 'success');
                    setOpenSnackbar(true);
                }}
                sx={{
                    mt: 2,
                    color: "white",
                    '&:hover': { backgroundColor: "primary" },
                }}
                startIcon={showEventMarkers ? <VisibilityOff /> : <Visibility />}
            >
                {showEventMarkers ? 'Ocultar Eventos' : 'Mostrar Eventos'}
            </Button>
        </Box>
    </>
);
};

export default DondeEstoy2;