import React, { useState, useEffect } from 'react';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';


function CrearEvento() {
    const { itinerarioId  } = useParams();
 
  const [actividades, setActividades] = useState([]);
    const Navigate = useNavigate();
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
    const token = localStorage.getItem('token');

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

        cargarActividades();
        cargarTraslados();
    
        const cargarDatos = async () => {
            try {
                const [ vuelosRes, aeropuertosRes, aerolineasRes, hotelesRes] = await Promise.all([
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
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvento({ ...evento, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                    'Authorization': `Bearer  ${token}`, 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoEvento)
                
            });
            if (response.ok) {
                console.log('Evento creado exitosamente');
                setMensajeExito(true);
                setTimeout(() => {
                    Navigate('/dashboard');
                }, 2000); 
            } else {
                console.error('Error al crear el evento');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const handleAgregarActividad = () => {
        Navigate(`/agregar-actividad/${itinerarioId}`);
    }; 
    const handleAgregarTraslado = () => {
        Navigate(`/agregar-traslado/${itinerarioId}`);
    };
    const isSubmitDisabled = () => {
        return !(
            evento.fechaYHora &&
           (evento.actividadId ||
            evento.aeropuertoId ||
            evento.hotelId ||
            evento.trasladoId ||
            evento.vueloId ||
            evento.aerolineaId)
        );
    };
    return (
        <Box sx={{ backgroundColor:'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
                Crear Evento para Itinerario {itinerarioId}
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
                    sx={{ marginBottom: 3 }}
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
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled()} >
                    Crear Evento
                </Button>
                {mensajeExito && (
                <Typography variant="body1" color="success" sx={{ marginTop: 2 }}>
                    Evento creado exitosamente. Redirigiendo al dashboard...
                </Typography>
            )}
            </form>
        </Box>
    );
}

export default CrearEvento;