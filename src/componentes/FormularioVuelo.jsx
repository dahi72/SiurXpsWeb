import React from 'react';
import { TextField } from '@mui/material';

const FormularioVuelo = ({ vuelo, setVuelo }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Nombre del Vuelo"
                variant="outlined"
                value={vuelo.nombre || ''}
                onChange={(e) => setVuelo({ ...vuelo, nombre: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Horario del Vuelo"
                variant="outlined"
                value={vuelo.horario || ''}
                onChange={(e) => setVuelo({ ...vuelo, horario: e.target.value })}
                sx={{ mb: 2 }}
            />
        </div>
    );
};

export default FormularioVuelo;
