import React, { useState } from 'react';
import { TextField, Button, Box, Typography, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';

function AgregarActividad() {
    const [actividad, setActividad] = useState({
        nombre: '',
        descripcion: '',
        ubicacion: '',
        duracion: 0,
        opcional: false
    });
    const { itinerarioId } = useParams();
    const baseUrl = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();

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
        return !(
           (actividad.nombre ||
            actividad.descripcion||
            actividad.ubicacion ||
            actividad.duracion)
        );
    };

    return (
        <Box sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)', padding: 4, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ color: 'black' }}>
                Agregar Nueva Actividad
            </Typography>
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Nombre"
                    name="nombre"
                    value={actividad.nombre}
                    onChange={handleChange}
                    fullWidth
                    required
                    sx={{ marginBottom: 3 }}
                />
                <TextField
                    label="Descripción"
                    name="descripcion"
                    value={actividad.descripcion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                />
                <TextField
                    label="Ubicación"
                    name="ubicacion"
                    value={actividad.ubicacion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                />
                <TextField
                    label="Duración"
                    name="duracion"
                    type="number"
                    value={actividad.duracion}
                    onChange={handleChange}
                    fullWidth
                    sx={{ marginBottom: 3 }}
                />
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
                <Button type="submit" variant="contained" color="primary" disabled={isSubmitDisabled()}>
                    Crear Actividad
                </Button>
            </form>
        </Box>
    );
}

export default AgregarActividad;