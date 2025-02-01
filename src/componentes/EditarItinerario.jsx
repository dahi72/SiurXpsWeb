import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Snackbar, Container, Grid } from '@mui/material';
import FormularioActividad from './FormularioActividad';
import FormularioTraslado from './FormularioTraslado';
import FormularioHotel from './FormularioHotel';
import FormularioAeropuerto from './FormularioAeropuerto';
import FormularioAerolinea from './FormularioAerolinea';
import FormularioVuelo from './FormularioVuelo'; 


const EditarItinerario = () => {
    const { id } = useParams(); // Obtener el ID del itinerario desde los parámetros de la URL
    const navigate = useNavigate();
    const baseUrl = process.env.REACT_APP_API_URL;

    const [actividad, setActividad] = useState(null);
    const [traslado, setTraslado] = useState(null);
    const [aerolinea, setAerolinea] = useState(null);
    const [aeropuerto, setAeropuerto] = useState(null);
    const [vuelo, setVuelo] = useState(null);
    const [hotel, setHotel] = useState(null);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(null);

    // Cargar el itinerario y sus datos relacionados cuando el componente se monta
    useEffect(() => {
        const fetchItinerario = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${id}`);
                const data = await response.json();

                // Obtener datos de las clases relacionadas solo si existen
                if (data.actividadId) {
                    const actividadResponse = await fetch(`${baseUrl}/Actividad/${data.actividadId}`);
                    const actividadData = await actividadResponse.json();
                    setActividad(actividadData);
                }

                if (data.trasladoId) {
                    const trasladoResponse = await fetch(`${baseUrl}/Traslado/api/Traslado/${data.trasladoId}`);
                    const trasladoData = await trasladoResponse.json();
                    setTraslado(trasladoData);
                }

                if (data.aerolineaId) {
                    try {
                        // Obtener todas las aerolíneas
                        const aerolineaResponse = await fetch(`${baseUrl}/Aerolinea/aerolineas`);
                        const aerolineasData = await aerolineaResponse.json();
                
                        // Buscar la aerolínea por ID
                        const aerolineaEncontrada = aerolineasData.find(aero => aero.id === data.aerolineaId);
                
                        if (aerolineaEncontrada) {
                            // Si se encuentra la aerolínea, actualizar el estado con sus datos
                            setAerolinea(aerolineaEncontrada);
                        } else {
                            setSnackbarMessage('Aerolinea no encontrada');
                            setOpenSnackbar(true);
                        }
                    } catch (error) {
                        console.error('Error al obtener la aerolínea:', error);
                        setSnackbarMessage('Error al cargar la aerolínea');
                        setOpenSnackbar(true);
                    }
                }

                if (data.aeropuertoId) {
                    try {
                        // Obtener todos los aeropuertos
                        const aeropuertoResponse = await fetch(`${baseUrl}/Aeropuerto/aeropuertos`);
                        const aeropuertosData = await aeropuertoResponse.json();
                
                        // Buscar el aeropuerto por ID
                        const aeropuertoEncontrado = aeropuertosData.find(aero => aero.id === data.aeropuertoId);
                
                        if (aeropuertoEncontrado) {
                            // Si se encuentra el aeropuerto, actualizar el estado con sus datos
                            setAeropuerto(aeropuertoEncontrado);
                        } else {
                            setSnackbarMessage('Aeropuerto no encontrado');
                            setOpenSnackbar(true);
                        }
                    } catch (error) {
                        console.error('Error al obtener el aeropuerto:', error);
                        setSnackbarMessage('Error al cargar el aeropuerto');
                        setOpenSnackbar(true);
                    }
                }
                

                if (data.vueloId) {
                    try {
                        // Obtener todos los vuelos
                        const vueloResponse = await fetch(`${baseUrl}/Vuelo/vuelos`);
                        const vuelosData = await vueloResponse.json();
                
                        // Buscar el vuelo por ID
                        const vueloEncontrado = vuelosData.find(vuelo => vuelo.id === data.vueloId);
                
                        if (vueloEncontrado) {
                            // Si se encuentra el vuelo, actualizar el estado con sus datos
                            setVuelo(vueloEncontrado);
                        } else {
                            setSnackbarMessage('Vuelo no encontrado');
                            setOpenSnackbar(true);
                        }
                    } catch (error) {
                        console.error('Error al obtener el vuelo:', error);
                        setSnackbarMessage('Error al cargar el vuelo');
                        setOpenSnackbar(true);
                    }
                }
                
                if (data.hotelId) {
                    try {
                        // Obtener todos los hoteles
                        const hotelResponse = await fetch(`${baseUrl}/Hotel/hoteles`);
                        const hotelesData = await hotelResponse.json();
                
                        // Buscar el hotel por ID
                        const hotelEncontrado = hotelesData.find(hotel => hotel.id === data.hotelId);
                
                        if (hotelEncontrado) {
                            // Si se encuentra el hotel, actualizar el estado con sus datos
                            setHotel(hotelEncontrado);
                        } else {
                            setSnackbarMessage('Hotel no encontrado');
                            setOpenSnackbar(true);
                        }
                    } catch (error) {
                        console.error('Error al obtener el hotel:', error);
                        setSnackbarMessage('Error al cargar el hotel');
                        setOpenSnackbar(true);
                    }
                }

            } catch (error) {
                console.error('Error al obtener el itinerario:', error);
                setSnackbarMessage('Error al cargar el itinerario');
                setOpenSnackbar(true);
            }
        };

        fetchItinerario();
    }, [id, baseUrl]);

    const handleFormularioClick = (formulario) => {
        setMostrarFormulario(formulario);
    }
    // Manejar el envío del formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Solo actualizar los datos asociados si existen
        const updatedActividad = actividad ? { ...actividad } : null;
        const updatedTraslado = traslado ? { ...traslado } : null;
        const updatedAerolinea = aerolinea ? { ...aerolinea } : null;
        const updatedAeropuerto = aeropuerto ? { ...aeropuerto } : null;
        const updatedVuelo = vuelo ? { ...vuelo } : null;
        const updatedHotel = hotel ? { ...hotel } : null;

        try {
            // await fetch(`${baseUrl}/Itinerario/${id}`, {
            //     method: 'PUT',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify(updatedItinerario),
            // });

            // Solo actualizar los datos asociados si están presentes
            if (updatedActividad) {
                await fetch(`${baseUrl}/Actividad/${actividad.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedActividad),
                });
            }

            if (updatedTraslado) {
                await fetch(`${baseUrl}/Traslado/${traslado.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedTraslado),
                });
            }

            if (updatedAerolinea) {
                await fetch(`${baseUrl}/Aerolinea/${aerolinea.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedAerolinea),
                });
            }

            if (updatedAeropuerto) {
                await fetch(`${baseUrl}/Aeropuerto/${aeropuerto.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedAeropuerto),
                });
            }

            if (updatedVuelo) {
                await fetch(`${baseUrl}/Vuelo/${vuelo.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedVuelo),
                });
            }

            if (updatedHotel) {
                await fetch(`${baseUrl}/Hotel/${hotel.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedHotel),
                });
            }

            setSnackbarMessage('Itinerario y detalles actualizados correctamente');
            setOpenSnackbar(true);
            navigate('/VerItinerario');
        } catch (error) {
            console.error('Error al actualizar el itinerario:', error);
            setSnackbarMessage('Error al actualizar el itinerario');
            setOpenSnackbar(true);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 4 }}>
            <h1>Editar Itinerario</h1>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('actividad')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
                        >
                            Editar Actividad
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('traslado')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            Editar Traslado
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('vuelo')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            Editar Vuelo
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('hotel')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            Editar Hotel
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('aerolinea')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            Editar Aerolinea
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            onClick={() => handleFormularioClick('aeropuerto')}
                            variant="contained"
                            fullWidth
                            sx={{ bgcolor: 'secondary.main', '&:hover': { bgcolor: 'secondary.dark' } }}
                        >
                            Editar Aeropuerto
                        </Button>
                    </Grid>
                </Grid>
    
                {mostrarFormulario === 'actividad' && actividad && (
                    <FormularioActividad actividad={actividad} setActividad={setActividad} />
                )}
    
                {mostrarFormulario === 'traslado' && traslado && (
                    <FormularioTraslado traslado={traslado} setTraslado={setTraslado} />
                )}

                {mostrarFormulario === 'hotel' && hotel && (
                    <FormularioHotel hotel={hotel} setHotel={setHotel} />
                )}

                {mostrarFormulario === 'aerolinea' && aerolinea && (
                    <FormularioAerolinea aerolinea={aerolinea} setAerolinea={setAerolinea} />
                )}

                 {mostrarFormulario === 'aeropuerto' && aeropuerto && (
                    <FormularioAeropuerto aeropuerto={aeropuerto} setAeropuerto={setAeropuerto} />
                )}

                 {mostrarFormulario === 'vuelo' && vuelo && (
                    <FormularioVuelo vuelo={vuelo} setVuelo={setVuelo} />
                )}

    
                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{ mt: 2, bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                >
                    Guardar Cambios
                </Button>
            </form>
    
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
                message={snackbarMessage}
                sx={{ width: '100%' }}
            />
        </Container>
    );
};


export default EditarItinerario;
