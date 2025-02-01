import React from 'react';
import { TextField } from '@mui/material';

const FormularioAerolinea = ({ aerolinea, setAerolinea }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Nombre de la Aerolínea"
                variant="outlined"
                value={aerolinea.nombre || ''}
                onChange={(e) => setAerolinea({ ...aerolinea, nombre: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Página Web"
                variant="outlined"
                value={aerolinea.paginaWeb || ''}
                onChange={(e) => setAerolinea({ ...aerolinea, paginaWeb: e.target.value })}
                sx={{ mb: 2 }}
            />
        </div>
    );
};

export default FormularioAerolinea;
