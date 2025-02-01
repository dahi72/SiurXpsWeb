import React from 'react';
import { TextField, FormControlLabel, Checkbox } from '@mui/material';

const FormularioActividad = ({ actividad, setActividad }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Nombre de la Actividad"
                variant="outlined"
                value={actividad.nombre || ''}
                onChange={(e) => setActividad({ ...actividad, nombre: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Descripción de la Actividad"
                variant="outlined"
                value={actividad.descripcion || ''}
                onChange={(e) => setActividad({ ...actividad, descripcion: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Ubicación de la Actividad"
                variant="outlined"
                value={actividad.ubicacion || ''}
                onChange={(e) => setActividad({ ...actividad, ubicacion: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Duración (en horas)"
                variant="outlined"
                type="number"
                value={actividad.duracion || ''}
                onChange={(e) => setActividad({ ...actividad, duracion: e.target.value })}
                sx={{ mb: 2 }}
            />
            <FormControlLabel
                control={
                    <Checkbox
                        checked={actividad.opcional}
                        onChange={(e) => setActividad({ ...actividad, opcional: e.target.checked })}
                    />
                }
                label="Opcional"
            />
        </div>
    );
};

export default FormularioActividad;
