import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography, Snackbar, Alert } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function CrearEvento() {
    const { itinerarioId } = useParams();
    const Navigate = useNavigate();
    const [actividades, setActividades] = useState([]);
    const [evento, setEvento] = useState({
        fechaYHora: '',
        actividadId: '',
        trasladoId: '',
        aeropuertoId: '',
        aerolineaId: '',
        hotelId: '',
        vueloId: ''
    });
    const baseUrl = process.env.REACT_APP_API_URL;
    const [traslados, setTraslados] = useState([]);
    const [vuelos, setVuelos] = useState([]);
    const [aeropuertos, setAeropuertos] = useState([]);
    const [aerolineas, setAerolineas] = useState([]);
    const [hoteles, setHoteles] = useState([]);
    const [mensajeExito, setMensajeExito] = useState(false);
    const [mensajeError, setMensajeError] = useState(false);
    const [fechaInicioItinerario, setFechaInicioItinerario] = useState(null);
    const [fechaFinItinerario, setFechaFinItinerario] = useState(null);
    const [fechaError, setFechaError] = useState(false); // Estado para el mensaje de error de fecha
    const token = localStorage.getItem('token');

    // Cargar fechas del itinerario
    useEffect(() => {
        const cargarFechasItinerario = async () => {
            try {
                const response = await fetch(`${baseUrl}/Itinerario/${itinerarioId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setFechaInicioItinerario(new Date(data.fechaInicio));
                setFechaFinItinerario(new Date(data.fechaFin));
            } catch (error) {
                console.error('Error al cargar las fechas del itinerario:', error);
            }
        };

        cargarFechasItinerario();
    }, [baseUrl, token, itinerarioId]);

    // Cargar actividades, traslados y otros datos
    useEffect(() => {
        const cargarActividades = async () => {
            try {
                const response = await fetch(`${baseUrl}/Actividad/listado`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setActividades(data);
            } catch (error) {
                console.error('Error al cargar las actividades:', error);
            }
        };

        const cargarTraslados = async () => {
            try {
                const response = await fetch(`${baseUrl}/Traslado/listado`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                setTraslados(data);
            } catch (error) {
                console.error('Error al cargar los traslados:', error);
            }
        };

        const cargarDatos = async () => {
            try {
                const [vuelosRes, aeropuertosRes, aerolineasRes, hotelesRes] = await Promise.all([
                    fetch(`${baseUrl}/Vuelo/vuelos`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                    fetch(`${baseUrl}/Aeropuerto/aeropuertos`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                    fetch(`${baseUrl}/Aerolinea/aerolineas`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                    fetch(`${baseUrl}/Hotel/hoteles`, { headers: { 'Authorization': `Bearer ${token}` } }).then(res => res.json()),
                ]);

                setVuelos(Array.isArray(vuelosRes) ? vuelosRes : []);
                setAeropuertos(Array.isArray(aeropuertosRes) ? aeropuertosRes : []);
                setAerolineas(Array.isArray(aerolineasRes) ? aerolineasRes : []);
                setHoteles(Array.isArray(hotelesRes) ? hotelesRes : []);
            } catch (error) {
                console.error('Error al cargar los datos:', error);
            }
        };

        cargarActividades();
        cargarTraslados();
        cargarDatos();
    }, [baseUrl, token]);

    // Manejar cambios en los campos del formulario
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvento({ ...evento, [name]: value });

        // Validar la fecha si el campo cambiado es "fechaYHora"
        if (name === "fechaYHora") {
            const fechaEvento = new Date(value);
            if (fechaEvento < fechaInicioItinerario || fechaEvento > fechaFinItinerario) {
                setFechaError(true); // Mostrar mensaje de error
            } else {
                setFechaError(false); // Ocultar mensaje de error
            }
        }
    };

    // Validar y enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Convertir la fecha del evento a un objeto Date
        const fechaEvento = new Date(evento.fechaYHora);

        // Validar que la fecha esté dentro del rango del itinerario
        if (fechaEvento < fechaInicioItinerario || fechaEvento > fechaFinItinerario) {
            setMensajeError(true); // Mostrar mensaje de error
            return;
        }

        const nuevoEvento = {
            fechaYHora: evento.fechaYHora || null,
            actividadId: evento.actividadId ? Number(evento.actividadId) : null,
            itinerarioId: itinerarioId ? Number(itinerarioId) : null,
            aeropuertoId: evento.aeropuertoId ? Number(evento.aeropuertoId) : null,
            hotelId: evento.hotelId ? Number(evento.hotelId) : null,
            trasladoId: evento.trasladoId ? Number(evento.trasladoId) : null,
            vueloId: evento.vueloId ? Number(evento.vueloId) : null,
            aerolineaId: evento.aerolineaId ? Number(evento.aerolineaId) : null,
        };

        try {
            const response = await fetch(`${baseUrl}/Itinerario/${itinerarioId}/evento`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoEvento)
            });

            if (response.ok) {
                console.log('Evento creado exitosamente');
                setMensajeExito(true); // Mostrar mensaje de éxito
                setEvento({ // Limpiar el formulario
                    fechaYHora: '',
                    actividadId: '',
                    trasladoId: '',
                    aeropuertoId: '',
                    aerolineaId: '',
                    hotelId: '',
                    vueloId: ''
                });
            } else {
                console.error('Error al crear el evento');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    // Navegar a la página de agregar actividad
    const handleAgregarActividad = () => {
        Navigate(`/agregar-actividad/${itinerarioId}`);
    };

    // Navegar a la página de agregar traslado
    const handleAgregarTraslado = () => {
        Navigate(`/agregar-traslado/${itinerarioId}`);
    };

    // Deshabilitar el botón de enviar si la fecha no es válida o no hay datos
    const isSubmitDisabled = () => {
        const fechaEvento = new Date(evento.fechaYHora);
        return (
            !evento.fechaYHora ||
            fechaEvento < fechaInicioItinerario ||
            fechaEvento > fechaFinItinerario ||
            !(
                evento.actividadId ||
                evento.aeropuertoId ||
                evento.hotelId ||
                evento.trasladoId ||
                evento.vueloId ||
                evento.aerolineaId
            )
        );
    };

    return (
        <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
                Crear Evento para el Itinerario 
            </Typography>

            <form onSubmit={handleSubmit}>
                <TextField
                    label="Fecha y Hora"
                    type="datetime-local"
                    name="fechaYHora"
                    value={evento.fechaYHora}
                    onChange={handleChange}
                    InputLabelProps={{
                        shrink: true,
                    }}
                    fullWidth
                    required
                    sx={{ marginBottom: 2 }}
                    error={fechaError} // Mostrar error si la fecha no es válida
                    helperText={fechaError ? "La fecha está fuera del rango del itinerario." : ""} // Mensaje de error
                />

                <Button variant="outlined" onClick={handleAgregarActividad} sx={{ marginBottom: 3, color: 'primary' }}>
                    Agregar Actividad
                </Button>

                <FormControl fullWidth sx={{ marginBottom: 3, gap: 3 }}>
                    <InputLabel>Actividad</InputLabel>
                    <Select
                        name="actividadId"
                        value={evento.actividadId}
                        onChange={handleChange}
                    >
                        {actividades.map((actividad) => (
                            <MenuItem key={actividad.id} value={actividad.id}>
                                {actividad.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button variant="outlined" onClick={handleAgregarTraslado} sx={{ marginBottom: 3, color: 'primary' }}>
                    Agregar Traslado
                </Button>

                <FormControl fullWidth sx={{ marginBottom: 3, gap: 3 }}>
                    <InputLabel>Traslado</InputLabel>
                    <Select
                        name="trasladoId"
                        value={evento.trasladoId}
                        onChange={handleChange}
                    >
                        {traslados.map((traslado) => (
                            <MenuItem key={traslado.id} value={traslado.id}>
                                {traslado.lugarDeEncuentro}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <InputLabel>Aeropuerto</InputLabel>
                    <Select
                        name="aeropuertoId"
                        value={evento.aeropuertoId}
                        onChange={handleChange}
                    >
                        {aeropuertos.map((aeropuerto) => (
                            <MenuItem key={aeropuerto.id} value={aeropuerto.id}>
                                {aeropuerto.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <InputLabel>Aerolínea</InputLabel>
                    <Select
                        name="aerolineaId"
                        value={evento.aerolineaId}
                        onChange={handleChange}
                    >
                        {aerolineas.map((aerolinea) => (
                            <MenuItem key={aerolinea.id} value={aerolinea.id}>
                                {aerolinea.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <InputLabel>Hotel</InputLabel>
                    <Select
                        name="hotelId"
                        value={evento.hotelId}
                        onChange={handleChange}
                    >
                        {hoteles.map((hotel) => (
                            <MenuItem key={hotel.id} value={hotel.id}>
                                {hotel.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth sx={{ marginBottom: 3 }}>
                    <InputLabel>Vuelo</InputLabel>
                    <Select
                        name="vueloId"
                        value={evento.vueloId}
                        onChange={handleChange}
                    >
                        {vuelos.map((vuelo) => (
                            <MenuItem key={vuelo.id} value={vuelo.id}>
                                {vuelo.nombre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled()}>
                    Crear Evento
                </Button>

                {mensajeExito && (
                    <Snackbar
                        open={mensajeExito}
                        autoHideDuration={3000}
                        onClose={() => setMensajeExito(false)}
                    >
                        <Alert onClose={() => setMensajeExito(false)} severity="success" sx={{ width: '100%' }}>
                            Evento creado exitosamente!
                        </Alert>
                    </Snackbar>
                )}

                {mensajeError && (
                    <Snackbar
                        open={mensajeError}
                        autoHideDuration={3000}
                        onClose={() => setMensajeError(false)}
                    >
                        <Alert onClose={() => setMensajeError(false)} severity="error" sx={{ width: '100%' }}>
                            La fecha del evento está fuera del rango del itinerario.
                        </Alert>
                    </Snackbar>
                )}
            </form>
        </Box>
    );
}

export default CrearEvento;
