import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Divider, Stack, Button } from '@mui/material';
import dayjs from 'dayjs';

const DataField = ({ label, value }) => (
  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{label}:</Typography>
    <Typography variant="body1">{value || 'No especificado'}</Typography>
  </Stack>
);

const DocumentPreview = ({ label, path }) => (
  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{label}:</Typography>
    {path ? (
      <Link to={path} target="_blank" rel="noopener noreferrer">Ver documento</Link>
    ) : (
      <Typography variant="body1">No disponible</Typography>
    )}
  </Stack>
);

const VerDatosViajero = () => {
  const location = useLocation();
  const viajero = location.state?.viajero;
  const navigate = useNavigate();
  console.log(viajero);
 
  const fechaNacFormateada = viajero.fechaNac ? dayjs(viajero.fechaNac).format('DD/MM/YYYY') : 'No especificado';

  const handleBack = () => {
    navigate(-1); 
  };

  return (
    <Container maxWidth="md">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
          Datos del Viajero
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Información Personal</Typography>
            <Divider sx={{ mb: 3 }} />

            <DataField label="Primer Nombre" value={viajero.primerNombre} />
            <DataField label="Segundo Nombre" value={viajero.segundoNombre} />
            <DataField label="Primer Apellido" value={viajero.primerApellido} />
            <DataField label="Segundo Apellido" value={viajero.segundoApellido} />
            <DataField label="Pasaporte" value={viajero.pasaporte} />
            <DataField label="Fecha de Nacimiento" value={fechaNacFormateada} />
            <DataField label="Correo Electrónico" value={viajero.email} />
            <DataField label="Teléfono" value={viajero.telefono} />
          </Box>

          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>Documentos</Typography>
            <Divider sx={{ mb: 3 }} />

            <DocumentPreview label="Vacunaciones" path={viajero.vacunasDocumentoRuta} />
            <DocumentPreview label="Pasaporte" path={viajero.pasaporteDocumentoRuta} />
            <DocumentPreview label="Visa" path={viajero.visaDocumentoRuta} />
            <DocumentPreview label="Seguro de Viaje" path={viajero.seguroDeViajeDocumentoRuta} />
          </Box>
        </Box>
      </Paper>
      <Button 
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleBack} 
        sx={{ mb: 4, fontSize: "0.85rem" }}
        >
          Volver a lista de viajeros
        </Button>
    </Container>
  );
};

export default VerDatosViajero;
