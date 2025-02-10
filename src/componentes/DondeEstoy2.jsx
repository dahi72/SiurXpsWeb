
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Box, Button, Typography, CircularProgress, Paper, Snackbar, Alert, Backdrop } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
import { useParams } from 'react-router-dom';
 
// Fix Leaflet default icon issue
L.Icon.Default.imagePath = '/';
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
 
L.Marker.prototype.options.icon = defaultIcon;
 
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
  const [listaEventos, setListaEventos] = useState([]);
    const { idItinerario } = useParams();
    const [aeropuertos, setAeropuertos] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const [actividades, setActividades] = useState([]);
    const [traslados, setTraslados] = useState([]);

  const token = localStorage.getItem('token');
  const baseUrl =  process.env.REACT_APP_API_URL;
 
  const fetchItinerario = useCallback(async () => {
    try { 
      const response = await fetch(`${baseUrl}/Itinerario/${idItinerario}/eventos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
 
      if (!response.ok) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }
 
      const data = await response.json();
      setListaEventos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar los hoteles:', error);
    }
  }, [baseUrl, token, idItinerario]);
 
  useEffect(() => {
    fetchItinerario();
  }, [fetchItinerario]);
  useEffect(() => {
  const cargarDatos = async () => {
    try {
        const [ trasladosRes, aeropuertosRes, actividadesRes, hotelesRes] = await Promise.all([
            fetch(`${baseUrl}/Traslado/listado`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`${baseUrl}/Aeropuerto/aeropuertos`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`${baseUrl}/Actividad/listado`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
            fetch(`${baseUrl}/Hotel/hoteles`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
        ]);

        setTraslados(Array.isArray(trasladosRes) ? trasladosRes : []);
        setAeropuertos(Array.isArray(aeropuertosRes) ? aeropuertosRes : []);
        setActividades(Array.isArray(actividadesRes) ? actividadesRes : []);
        setHoteles(Array.isArray(hotelesRes) ? hotelesRes : []);
    } catch (error) {
        console.error('Error al cargar los datos:', error);
    }
};

cargarDatos();
  }, [baseUrl, token]);
    
    console.log("traslados", traslados);   
    console.log("aeropuertos", aeropuertos); 
    console.log("actividades", actividades); 
    console.log("hoteles", hoteles); 
    
const eventos = useMemo(() => {
    return listaEventos.flatMap((evento) => {
      const ubicaciones = [];
  
      // Aeropuerto
      if (evento.aeropuertoId) {
        const aeropuertoFiltrado = aeropuertos.find(aero => aero.id === evento.aeropuertoId);
        if (aeropuertoFiltrado) {
          ubicaciones.push({
            id: aeropuertoFiltrado.id,
            title: aeropuertoFiltrado.nombre,
            ubicacion: `${aeropuertoFiltrado.direccion}, ${aeropuertoFiltrado.ciudad.nombre}, ${aeropuertoFiltrado.pais.nombre}`,
          });
        }
      }
  
      // Hotel
      if (evento.hotelId) {
        const hotelFiltrado = hoteles.find(hotel => hotel.id === evento.hotelId);
        if (hotelFiltrado) {
          ubicaciones.push({
            id: hotelFiltrado.id,
            title: hotelFiltrado.nombre,
            ubicacion: `${hotelFiltrado.direccion}, ${hotelFiltrado.ciudad.nombre}, ${hotelFiltrado.pais.nombre}`,
          });
        }
      }
  
      // Actividad
      if (evento.actividadId) {
        const actividadFiltrada = actividades.find(act => act.id === evento.actividadId);
        if (actividadFiltrada) {
          ubicaciones.push({
            id: actividadFiltrada.id,
            title: actividadFiltrada.nombre,
            ubicacion: `${actividadFiltrada.ubicacion}, ${actividadFiltrada.ciudad.nombre}, ${actividadFiltrada.pais.nombre}`,
          });
        }
      }
  
      // Traslado
      if (evento.trasladoId) {
        const trasladoFiltrado = traslados.find(traslado => traslado.id === evento.trasladoId);
        if (trasladoFiltrado) {
          ubicaciones.push({
            id: trasladoFiltrado.id,
            title: trasladoFiltrado.nombre,
            ubicacion: `${trasladoFiltrado.lugarDeEncuentro}, ${trasladoFiltrado.ciudad.nombre}, ${trasladoFiltrado.pais.nombre}`,
          });
        }
      }
  
      return ubicaciones; // Cada evento puede tener varias ubicaciones
    });
  }, [listaEventos, aeropuertos, hoteles, actividades, traslados]);
  
    
  console.log("eventos", eventos); 
    
//   const evento = useMemo(() => {
//     return hoteles
//       .filter(hotel => hotel.id === 14)
//       .map(hotel => ({
//         id: hotel.id,
//         title: hotel.nombre,
//         direccion: `${hotel.direccion}, ${hotel.ciudad.nombre}, ${hotel.pais.nombre}`
//       }))[0];
    //   }, [hoteles]);
    
    // const eventos = useMemo(() => {
    //     return hoteles.map(hotel => ({
    //         id: hotel.id,
    //         title: hotel.nombre,
    //         direccion: `${hotel.direccion}, ${hotel.ciudad.nombre}, ${hotel.pais.nombre}`
    //     }));
    // }, [hoteles]);
    
 
  const geocodeLocation = async (address) => {
    const apiKey = 'ffe0407498914865a2e38a5418e8a482';
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json?q=' + encodeURIComponent(address) + '&key=' + apiKey);
      if (response.data.results.length > 0) {
        return {
          lat: response.data.results[0].geometry.lat,
          lng: response.data.results[0].geometry.lng,
        };
      }
    } catch (error) {
      console.error('Error geocodificando la dirección:', error);
    }
    return null;
  };
    
  useEffect(() => {
    const fetchEventMarkers = async () => {
      if (!eventos || eventos.length === 0) return;
  
      // Mapear cada evento y geocodificar su dirección
      const markers = await Promise.all(
        eventos.map(async (evento) => {
          // Determinar cuál atributo usar para la dirección
          const direccion = 
            evento.ubicacion || 
            evento.lugarDeEncuentro || 
            evento.direccion;
  
          if (!direccion) return null; // Ignorar si no tiene dirección
  
          const location = await geocodeLocation(direccion);
          if (location) {
            return { lat: location.lat, lng: location.lng, title: evento.title };
          }
          return null; // Devolver null si no se puede obtener la ubicación
        })
      );
  
      // Filtrar los nulls (eventos sin ubicación) y establecer los marcadores
      setEventMarkers(markers.filter(marker => marker !== null));
    };
  
    fetchEventMarkers();
  }, [eventos]); // Ejecutar cuando el array `eventos` cambie
  
  
    
//   useEffect(() => {
//     const fetchEventMarker = async () => {
//       if (!evento?.direccion) return;
 
//       const location = await geocodeLocation(evento.direccion);
//       if (location) {
//         setEventMarkers([{ lat: location.lat, lng: location.lng, title: evento.title }]);
//       } else {
//         setEventMarkers([]);
//       }
//     };
 
//     fetchEventMarker();
//   }, [evento]);
 
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
 
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
 
  if (loading) {
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
 
      <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
      </Backdrop>
 
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
 
              {showEventMarkers && eventMarkers.map((event, index) => (
                <Marker key={index} position={[event.lat, event.lng]}>
                  <Popup>{event.title}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </Paper>
        )}
 
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












// import React, { useState, useEffect, useMemo, useCallback } from 'react';
// import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
// import { Box, Button, Typography, CircularProgress, Paper, Snackbar, Alert, Backdrop } from '@mui/material';
// import { Visibility, VisibilityOff } from '@mui/icons-material';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import axios from 'axios';

// // Arreglo para el ícono del marcador
// delete L.Icon.Default.prototype._getIconUrl;
// L.Icon.Default.mergeOptions({
//     iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//     iconUrl: require('leaflet/dist/images/marker-icon.png'),
//     shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

// // Componente para centrar el mapa en la ubicación actual
// function LocationMarker() {
//     const [position, setPosition] = useState(null);
//     const [error, setError] = useState(null);
//     const map = useMap();

//     useEffect(() => {
//         map.locate().on("locationfound", function (e) {
//             setPosition(e.latlng);
//             map.flyTo(e.latlng, map.getZoom());
//         }).on("locationerror", function (e) {
//             setError(e.message);
//         });
//     }, [map]);

//     return position === null ? (
//         error ? <div>{error}</div> : null
//     ) : (
//         <Marker position={position}>
//             <Popup>¡Estás aquí!</Popup>
//         </Marker>
//     );
// }

// const DondeEstoy2 = () => {
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [center, setCenter] = useState([0, 0]);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [snackbarMessage, setSnackbarMessage] = useState('');
//     const [snackbarSeverity, setSnackbarSeverity] = useState('success');
//     const [showEventMarkers, setShowEventMarkers] = useState(false);
//     const [eventMarkers, setEventMarkers] = useState([]);
//     const token = localStorage.getItem('token');
//     const baseUrl = process.env.REACT_APP_API_URL;
//     const [hoteles, setHoteles] = useState([]);
//     const [hotel] = useState('');
    
//     const fetchHoteles = useCallback(async () => {
//         try {
//           const response = await fetch(`${baseUrl}/Hotel/hoteles`, {
//             method: 'GET',
//             headers: {
//               'Authorization': `Bearer ${token}`,
//               'Content-Type': 'application/json'
//             }
//           });
    
//           if (!response.ok) {
//             throw new Error(`Error ${response.status}: ${response.statusText}`);
//           }
    
//           const data = await response.json();
//             setHoteles(Array.isArray(data) ? data : []);
           
//         } catch (error) {
//           console.error('Error al cargar los hoteles:', error);
//         }
//       }, [baseUrl, token]);

    
//       useEffect(() => {
//         fetchHoteles();
//       }, [fetchHoteles]);

    
//       const evento =  useMemo(() => {
//         return hoteles
//             .filter(hotel => hotel.id === 14)
//             .map(hotel => ({
//                 id: hotel.id,
//                 title: hotel.nombre,
//                 direccion: `${hotel.direccion}, ${hotel.ciudad.nombre}, ${hotel.pais.nombre}`
//             }));
//     }, [hoteles]);
    
//     // const id = 14; 
//     // const fetchHoteles = useCallback(async () => {
//     //         try {
//     //           const response = await fetch(`${baseUrl}/Hotel/${id}`, {
//     //             method: 'GET',
//     //             headers: {
//     //               'Authorization': `Bearer ${token}`,
//     //               'Content-Type': 'application/json'
//     //             }
//     //           });
        
//     //           if (!response.ok) {
//     //             throw new Error(`Error ${response.status}: ${response.statusText}`);
//     //           }
        
//     //           const data = await response.json();
//     //           setHotel(data);
//     //         } catch (error) {
//     //           console.error('Error al cargar los hoteles:', error);
//     //         }
//     //       }, [baseUrl, token]);
    
        
//           useEffect(() => {
//             fetchHoteles();
//           }, [fetchHoteles]);


//     console.log("evento", evento);
//     console.log("hotel", hotel);
    
//     // const evento = useMemo(() => ({
//     //     id: hotel.id,
//     //     title: hotel.nombre,
//     //     direccion: `${hotel.direccion}, ${hotel.ciudad.nombre}, ${hotel.pais.nombre}`,
//     // }), [hotel]);
    
//     // console.log("evento", evento);
    
    
//     //   const eventos = useMemo(() => 
//     //     hoteles.map((hotel) => ({
//     //         id: hotel.id,
//     //         title: `${hotel.nombre}`,
//     //         direccion: `${hotel.direccion}, ${hotel.ciudad.nombre}, ${hotel.pais.nombre}`,
//     //     })), [hoteles]);
    
//         // console.log("eventos", eventos);
    
//     // Memoize the eventos array
//     // const eventos = useMemo(() => [
//     //     { id: 1, title: 'Evento 1', ubicacion: 'Hotel Ejemplo, Montevideo, Uruguay' },
//     //     { id: 2, title: 'Evento 2', ubicacion: 'Aeropuerto Ejemplo, Punta del Este, Uruguay' },
//     //     { id: 3, title: 'Evento 3', ubicacion: 'Actividad Ejemplo, Salto, Uruguay' },
//     // ], []); // Empty dependency array means it will only be created once

//     // useEffect(() => {
//     //     if (!navigator.geolocation) {
//     //         setError('Tu navegador no soporta geolocalización');
//     //         setLoading(false);
//     //         return;
//     //     }

//     //     navigator.geolocation.getCurrentPosition(
//     //         (position) => {
//     //             setCenter([position.coords.latitude, position.coords.longitude]);
//     //             setLoading(false);
//     //         },
//     //         (error) => {
//     //             let errorMessage = 'No se pudo obtener tu ubicación';
//     //             switch (error.code) {
//     //                 case error.PERMISSION_DENIED:
//     //                     errorMessage = 'No has dado permiso para acceder a tu ubicación';
//     //                     break;
//     //                 case error.POSITION_UNAVAILABLE:
//     //                     errorMessage = 'La información de ubicación no está disponible';
//     //                     break;
//     //                 case error.TIMEOUT:
//     //                     errorMessage = 'Se agotó el tiempo para obtener la ubicación';
//     //                     break;
//     //                 default:
//     //                     errorMessage = 'Ocurrió un error desconocido';
//     //             }
//     //             setError(errorMessage);
//     //             setLoading(false);
//     //         },
//     //         {
//     //             enableHighAccuracy: true,
//     //             timeout: 5000,
//     //             maximumAge: 0
//     //         }
//     //     );
//     // }, [eventos]);
//     useEffect(() => {
//         if (!navigator.geolocation) {
//             setError('Tu navegador no soporta geolocalización');
//             setLoading(false);
//             return;
//         }
    
//         navigator.geolocation.getCurrentPosition(
//             (position) => {
//                 setCenter([position.coords.latitude, position.coords.longitude]);
//                 setLoading(false);
//             },
//             (error) => {
//                 let errorMessage = 'No se pudo obtener tu ubicación';
//                 switch (error.code) {
//                     case error.PERMISSION_DENIED:
//                         errorMessage = 'No has dado permiso para acceder a tu ubicación';
//                         break;
//                     case error.POSITION_UNAVAILABLE:
//                         errorMessage = 'La información de ubicación no está disponible';
//                         break;
//                     case error.TIMEOUT:
//                         errorMessage = 'Se agotó el tiempo para obtener la ubicación';
//                         break;
//                     default:
//                         errorMessage = 'Ocurrió un error desconocido';
//                 }
//                 setError(errorMessage);
//                 setLoading(false);
//             },
//             {
//                 enableHighAccuracy: true,
//                 timeout: 5000,
//                 maximumAge: 0
//             }
//         );
//     }, [evento]); // Dependencia del evento único
    
//     // Función para geocodificar direcciones
//     const geocodeLocation = async (address) => {
//         const apiKey = 'ffe0407498914865a2e38a5418e8a482'; // Usa tu clave de API aquí
//         try {
//             const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`);
//             if (response.data.results.length > 0) {
//                 return {
//                     lat: response.data.results[0].geometry.lat,
//                     lng: response.data.results[0].geometry.lng,
//                 };
//             }
//         } catch (error) {
//             console.error('Error geocodificando la dirección:', error.response ? error.response.data : error.message);
//         }
//         return null;
//     };

//     useEffect(() => {
//         const fetchEventMarker = async () => {
//             if (!evento) return; // Evitar errores si `evento` aún no está definido
    
//             const location = await geocodeLocation(evento.direccion);
//             if (location) {
//                 setEventMarkers([{ lat: location.lat, lng: location.lng, title: evento.title }]);
//             } else {
//                 setEventMarkers([]); // Limpiar si no se encuentra la ubicación
//             }
//         };
    
//         fetchEventMarker();
//     }, [evento]); // Se ejecuta cuando `evento` cambia
    
//     // useEffect(() => {
//     //     const fetchEventMarkers = async () => {
//     //         const markers = await Promise.all(eventos.map(async (evento) => {
//     //             const location = await geocodeLocation(evento.ubicacion);
//     //             return location ? { lat: location.lat, lng: location.lng, title: evento.title } : null;
//     //         }));
//     //         setEventMarkers(markers.filter(marker => marker !== null)); // Filtrar marcadores válidos
//     //     };

//     //     fetchEventMarkers();
//     // }, [eventos]);

//     const handleSnackbarClose = () => {
//         setOpenSnackbar(false);
//     };

//     if (loading || error) {
//         return (
//             <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <CircularProgress />
//                 <Typography sx={{ mt: 2 }}>
//                     Obteniendo tu ubicación...
//                 </Typography>
//             </Box>
//         );
//     }

//     return (
//         <>
//             {/* Snackbar para mensajes */}
//             <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
//                 <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
//                     {snackbarMessage}
//                 </Alert>
//             </Snackbar>

//             {/* Backdrop para el indicador de carga */}
//             <Backdrop open={loading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//                 <CircularProgress color="inherit" />
//             </Backdrop>

//             {/* Contenedor del mapa */}
//             <Box sx={{ p: 2 }}>
        
//                 {error ? (
//                     <Typography color="error" sx={{ mb: 2 }}>
//                         {error}
//                     </Typography>
//                 ) : (
//                     <Paper sx={{ height: '70vh', width: '100%', borderRadius: '10px', overflow: 'hidden', boxShadow: 3 }}>
//                         <MapContainer
//                             center={center}
//                             zoom={13}
//                             style={{ height: '100%', width: '100%' }}
//                             scrollWheelZoom={true}
//                             doubleClickZoom={true}
//                             zoomControl={true}
//                         >
//                             <TileLayer
//                                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                                 attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                             />
//                             <LocationMarker />

//                             {/* Mostrar marcadores de eventos */}
//                             {showEventMarkers && eventMarkers.map((event, index) => (
//                                 <Marker key={index} position={[event.lat, event.lng]}>
//                                     <Popup>{event.title}</Popup>
//                                 </Marker>
//                             ))}
//                         </MapContainer>
//                     </Paper>
//                 )}

//                 {/* Botón para mostrar/ocultar eventos */}
//                 <Button
//                     onClick={() => {
//                         setShowEventMarkers(!showEventMarkers);
//                         setSnackbarMessage(showEventMarkers ? 'Eventos ocultos' : 'Eventos mostrados');
//                         setSnackbarSeverity(showEventMarkers ? 'info' : 'success');
//                         setOpenSnackbar(true);
//                     }}
//                     sx={{
//                         mt: 2,
//                         backgroundColor: '#FFEB3B',
//                         color: '#000',
//                         '&:hover': { backgroundColor: '#FFEB3B' }
//                     }}
//                     startIcon={showEventMarkers ? <VisibilityOff /> : <Visibility />}
//                 >
//                     {showEventMarkers ? 'Ocultar Eventos' : 'Mostrar Eventos'}
//                 </Button>
//             </Box>
//         </>
//     );
// };

// export default DondeEstoy2;