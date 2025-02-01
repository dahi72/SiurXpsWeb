import React from 'react';
import { TextField } from '@mui/material';

const FormularioTraslado = ({ traslado, setTraslado }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Lugar de Encuentro del Traslado"
                variant="outlined"
                value={traslado.lugarDeEncuentro || ''}
                onChange={(e) => setTraslado({ ...traslado, lugarDeEncuentro: e.target.value })}
                sx={{ mb: 2 }}
            />
        </div>
    );
};

export default FormularioTraslado;
