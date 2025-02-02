import React, { useState, useEffect } from 'react';
import { TextField, FormControlLabel, Checkbox, FormControl, InputLabel, Select, MenuItem, CircularProgress, Grid } from '@mui/material';

const FormularioActividad = ({ actividad, setActividad }) => {
    const [paises, setPaises] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [loadingPaises, setLoadingPaises] = useState(true);
    const [loadingCiudades, setLoadingCiudades] = useState(false);

    // Cargar países
    useEffect(() => {
        const fetchPaises = async () => {
            try {
                const response = await fetch('https://api.example.com/paises'); // Cambiar a la URL real
                const data = await response.json();
                setPaises(data.sort((a, b) => a.nombre.localeCompare(b.nombre))); // Ordenar países alfabéticamente
                setLoadingPaises(false);
            } catch (error) {
                console.error('Error al cargar los países', error);
            }
        };
        fetchPaises();
    }, []);

    // Cargar ciudades según el país seleccionado
    const handlePaisChange = async (event) => {
        const paisSeleccionado = event.target.value;
        setActividad({ ...actividad, pais: paisSeleccionado, ciudad: '' }); // Reiniciar ciudad
        setLoadingCiudades(true);

        try {
            const response = await fetch(`https://api.example.com/ciudades/${paisSeleccionado}`); // Cambiar a la URL real
            const data = await response.json();
            setCiudades(data.sort((a, b) => a.nombre.localeCompare(b.nombre))); // Ordenar ciudades alfabéticamente
            setLoadingCiudades(false);
        } catch (error) {
            console.error('Error al cargar las ciudades', error);
        }
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Nombre de la Actividad"
                    variant="outlined"
                    value={actividad.nombre || ''}
                    onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Descripción de la Actividad"
                    variant="outlined"
                    value={actividad.descripcion || ''}
                    onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Ubicación de la Actividad"
                    variant="outlined"
                    value={actividad.ubicacion || ''}
                    onChange={(e) => setActividad({ ...actividad, ubicacion: e.target.value })}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Duración (en horas)"
                    variant="outlined"
                    type="number"
                    value={actividad.duracion || ''}
                    onChange={(e) => setActividad({ ...actividad, duracion: e.target.value })}
                />
            </Grid>

            {/* Select de País */}
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>País</InputLabel>
                    <Select
                        value={actividad.pais || ''}
                        onChange={handlePaisChange}
                        label="País"
                    >
                        {loadingPaises ? (
                            <MenuItem disabled>
                                <CircularProgress size={24} />
                            </MenuItem>
                        ) : (
                            paises.map((pais) => (
                                <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
                                    {pais.nombre}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
            </Grid>

            {/* Select de Ciudad */}
            <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                        value={actividad.ciudad || ''}
                        onChange={(e) => setActividad({ ...actividad, ciudad: e.target.value })}
                        label="Ciudad"
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
            </Grid>

            {/* Campo de Tips */}
            <Grid item xs={12}>
                <TextField
                    fullWidth
                    label="Tips (Opcional)"
                    variant="outlined"
                    value={actividad.tips || ''}
                    onChange={(e) => setActividad({ ...actividad, tips: e.target.value })}
                />
            </Grid>

            {/* Checkbox Opcional */}
            <Grid item xs={12}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={actividad.opcional}
                            onChange={(e) => setActividad({ ...actividad, opcional: e.target.checked })}
                        />
                    }
                    label="Opcional"
                />
            </Grid>
        </Grid>
    );
};

export default FormularioActividad;
