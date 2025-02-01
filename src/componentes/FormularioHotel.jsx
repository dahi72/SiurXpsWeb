import React from 'react';
import { TextField } from '@mui/material';

const FormularioHotel = ({ hotel, setHotel }) => {
    return (
        <div>
            <TextField
                fullWidth
                label="Nombre del Hotel"
                variant="outlined"
                value={hotel.nombre || ''}
                onChange={(e) => setHotel({ ...hotel, nombre: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Dirección del Hotel"
                variant="outlined"
                value={hotel.direccion || ''}
                onChange={(e) => setHotel({ ...hotel, direccion: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Check-In"
                variant="outlined"
                value={hotel.checkIn || ''}
                onChange={(e) => setHotel({ ...hotel, checkIn: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Check-Out"
                variant="outlined"
                value={hotel.checkOut || ''}
                onChange={(e) => setHotel({ ...hotel, checkOut: e.target.value })}
                sx={{ mb: 2 }}
            />
            <TextField
                fullWidth
                label="Página Web"
                variant="outlined"
                value={hotel.paginaWeb || ''}
                onChange={(e) => setHotel({ ...hotel, paginaWeb: e.target.value })}
                sx={{ mb: 2 }}
            />
        </div>
    );
};

export default FormularioHotel;
