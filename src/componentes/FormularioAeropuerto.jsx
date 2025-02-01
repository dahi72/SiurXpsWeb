import React from 'react';
import { TextField } from '@mui/material';

const FormularioAeropuerto = ({ aeropuerto, setAeropuerto }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Nombre del Aeropuerto"
                variant="outlined"
                value={aeropuerto.nombre || ''}
                onChange={(e) => setAeropuerto({ ...aeropuerto, nombre: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Dirección del Aeropuerto"
                variant="outlined"
                value={aeropuerto.direccion || ''}
                onChange={(e) => setAeropuerto({ ...aeropuerto, direccion: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Página Web"
                variant="outlined"
                value={aeropuerto.paginaWeb || ''}
                onChange={(e) => setAeropuerto({ ...aeropuerto, paginaWeb: e.target.value })}
                sx={{ mb: 2 }}
            />
        </div>
    );
};

export default FormularioAeropuerto;
