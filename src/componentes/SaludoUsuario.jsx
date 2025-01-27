import React from 'react';
import { Typography } from '@mui/material';

const SaludoUsuario = ({ userName }) => {
  return (
    <Typography variant="h8" className="saludo-texto">
      {userName ? `Bienvenido, ${userName}, a SiurXp` : 'Bienvenido a SiurXp'}
    </Typography>
  );
};

export default SaludoUsuario;
