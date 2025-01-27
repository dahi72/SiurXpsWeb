import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Typography, CircularProgress, Paper, Snackbar, Alert, Backdrop } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState([0, 0]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');
    const [showEventMarkers, setShowEventMarkers] = useState(false);
    const [eventMarkers, setEventMarkers] = useState([]);

    // Memoize the eventos array
    const eventos = useMemo(() => [
        { id: 1, title: 'Evento 1', ubicacion: 'Hotel Ejemplo, Montevideo, Uruguay' },
        { id: 2, title: 'Evento 2', ubicacion: 'Aeropuerto Ejemplo, Punta del Este, Uruguay' },
        { id: 3, title: 'Evento 3', ubicacion: 'Actividad Ejemplo, Salto, Uruguay' },
    ], []); // Empty dependency array means it will only be created once

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
            setEventMarkers(markers.filter(marker => marker !== null)); // Filtrar marcadores válidos
        };

        fetchEventMarkers();
    }, [eventos]);

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    if (loading || error) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
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
                        backgroundColor: '#FFEB3B',
                        color: '#000',
                        '&:hover': { backgroundColor: '#FFEB3B' }
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