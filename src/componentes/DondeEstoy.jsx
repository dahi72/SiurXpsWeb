import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Typography, CircularProgress } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Configuración de íconos para Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Componente para forzar la actualización del mapa cuando cambia la ubicación
function ForceUpdateMap({ center }) {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, map.getZoom(), { animate: true });
        }
    }, [center, map]);
    return null;
}

// Componente para mostrar el marcador de la ubicación actual
function LocationMarker() {
    const [position, setPosition] = useState(null);
    const [error, setError] = useState(null);
    const map = useMap();

    useEffect(() => {
        map.locate().on("locationfound", (e) => {
            setPosition(e.latlng);
            map.flyTo(e.latlng, map.getZoom());
        }).on("locationerror", (e) => {
            setError(e.message);
        });
    }, [map]);

    return position === null ? (
        error ? <Typography color="error">{error}</Typography> : null
    ) : (
        <Marker position={position}>
            <Popup>¡Estás aquí!</Popup>
        </Marker>
    );
}

// Componente principal
const DondeEstoy = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [center, setCenter] = useState([0, 0]);

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
    }, []);

    if (loading) {
        return (
            <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh',
                backgroundColor: '#f0f0f0'
            }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Obteniendo tu ubicación...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ height: '90vh', width: '100%', p: 2 }}>
            {error ? (
                <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
            ) : (
                <Box sx={{
                    height: '80vh',
                    width: '100%',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                }}>
                    <MapContainer
                        center={center}
                        zoom={13}
                        style={{ height: '100%', width: '100%' }}
                        scrollWheelZoom={true}
                        doubleClickZoom={true}
                        zoomControl={true}
                    >
                        {/* Alternativa de servidor de tiles */}
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />
                        <ForceUpdateMap center={center} />
                        <LocationMarker />
                    </MapContainer>
                </Box>
            )}
        </Box>
    );
};

export default DondeEstoy;
