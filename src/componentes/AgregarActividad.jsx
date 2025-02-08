import React, { useState, useEffect } from 'react';
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox, MenuItem, Select, InputLabel, FormControl, CircularProgress, Grid } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function AgregarActividad() {
    const [actividad, setActividad] = useState({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        duracion: 0,
        opcional: false,
        pais: '',
        ciudad: '',
        tips: ''
    });
    const [paises, setPaises] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [loadingPaises, setLoadingPaises] = useState(true);
    const [loadingCiudades, setLoadingCiudades] = useState(false);
    const { itinerarioId } = useParams();
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const [paisId, setPaisId] = useState(""); 
    const [paisCodigoIso, setPaisCodigoIso] = useState("");


    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await fetch(`${baseUrl}/Pais/listado`);
                const data = await response.json();
                const sortedPaises = data.sort((a, b) => a.nombre.localeCompare(b.nombre)); // Ordenar países alfabéticamente
                setPaises(sortedPaises);
                setLoadingPaises(false);
            } catch (error) {
                console.error('Error al obtener los países:', error);
            }
        };
        fetchPaises();
    }, [baseUrl]);

    const handlePaisChange = async (e) => {
        const selectedPaisId = e.target.value; // Pais id para la actividad
        const selectedPaisCodigoIso = e.target.selectedOptions[0].getAttribute("data-codigoIso"); // Pais codigoIso para ciudades
        
        // Actualizamos el estado con los valores correspondientes
        setPaisId(selectedPaisId); 
        setPaisCodigoIso(selectedPaisCodigoIso); 
        setActividad((prevState) => ({ ...prevState, pais: paisId }));
        // Llamada para cargar las ciudades
        setLoadingCiudades(true);
        try {
          const response = await fetch(`${baseUrl}/Ciudad/${paisCodigoIso}/ciudades`);
          const data = await response.json();
          setCiudades(data);
        } catch (error) {
          console.error("Error al obtener las ciudades", error);
        } finally {
          setLoadingCiudades(false);
        }
      };
      

    // const handleCiudadChange = (event) => {
    //     setActividad({ ...actividad, ciudad: event.target.value });
    // };
    const handleCiudadChange = (e) => {
        setActividad((prevState) => ({ ...prevState, ciudad: e.target.value }));
      };
      


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setActividad({
            ...actividad,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${baseUrl}/Actividad/altaActividad`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(actividad)
            });

            if (response.ok) {
                console.log('Actividad creada exitosamente');
                navigate(`/crear-eventos/${itinerarioId}`);
            } else {
                console.error('Error al crear la actividad');
            }
        } catch (error) {
            console.error('Error de red:', error);
        }
    };

    const isSubmitDisabled = () => {
        return !(actividad.nombre && actividad.descripcion && actividad.ubicacion && actividad.duracion && actividad.pais && actividad.ciudad);
    };

    return (
        <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black', textAlign: 'center', fontWeight: 'bold' }}>
                Agregar Nueva Actividad
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Nombre"
                            name="nombre"
                            value={actividad.nombre}
                            onChange={handleChange}
                            fullWidth
                            required
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Descripción"
                            name="descripcion"
                            value={actividad.descripcion}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Ubicación"
                            name="ubicacion"
                            value={actividad.ubicacion}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Duración"
                            name="duracion"
                            type="number"
                            value={actividad.duracion}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={actividad.opcional}
                                    onChange={handleChange}
                                    name="opcional"
                                />
                            }
                            label="Opcional"
                        />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>País</InputLabel>
                        <Select
                        name="pais"
                        value={paisId}
                        onChange={handlePaisChange}
                        label="País"
                        required
                        >
                        {loadingPaises ? (
                            <MenuItem disabled>
                            <CircularProgress size={24} />
                            </MenuItem>
                        ) : (
                            paises.map((pais) => (
                            <MenuItem
                                key={pais.id}
                                value={pais.id} // Guardamos el id del país
                                data-codigoIso={pais.codigoIso}>
                                {pais.nombre}
                            </MenuItem>
                            ))
                        )}
                        </Select>
                    </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                        <InputLabel>Ciudad</InputLabel>
                        <Select
                        name="ciudad"
                        value={actividad.ciudad}
                        onChange={handleCiudadChange}
                        label="Ciudad"
                        required
                        disabled={loadingCiudades || !paisId}
                        >
                        {loadingCiudades ? (
                            <MenuItem disabled>
                            <CircularProgress size={24} />
                            </MenuItem>
                        ) : (
                            ciudades.map((ciudad) => (
                            <MenuItem key={ciudad.id} value={ciudad.id}>
                                {ciudad.nombre}
                            </MenuItem>
                            ))
                        )}
                        </Select>
                    </FormControl>
                    </Grid>

                    {/* <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel>Ciudad</InputLabel>
                            <Select
                                name="ciudad"
                                value={actividad.ciudad}
                                onChange={handleCiudadChange}
                                label="Ciudad"
                                required
                                disabled={loadingCiudades || !actividad.pais}
                            >
                                {loadingCiudades ? (
                                    <MenuItem disabled>
                                        <CircularProgress size={24} />
                                    </MenuItem>
                                ) : (
                                    ciudades.map((ciudad) => (
                                        <MenuItem key={ciudad.codigo} value={ciudad.codigo}>
                                            {ciudad.nombre}
                                        </MenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Grid>*/}

                    <Grid item xs={12}>
                        <TextField
                            label="Tips (opcional)"
                            name="tips"
                            value={actividad.tips}
                            onChange={handleChange}
                            fullWidth
                        />
                    </Grid> 

                    <Grid item xs={12}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={isSubmitDisabled()}
                            sx={{ width: '100%', padding: '14px', fontWeight: 'bold' }}
                        >
                            Crear Actividad
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}

export default AgregarActividad;
