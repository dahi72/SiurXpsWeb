import React, { useContext } from 'react';
import { Container, Typography, Box, Button, Paper, Grid, Divider } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Edit as EditIcon } from '@mui/icons-material';
import { UsuarioContext } from '../hooks/UsuarioContext';

const VerMisDatos = () => {
  const navigate = useNavigate();
  const { usuario, error } = useContext(UsuarioContext);

  const fechaNacFormateada = usuario && usuario.fechaNac ? dayjs(usuario.fechaNac).format('DD/MM/YYYY') : '';

  const handleEditClick = () => {
    navigate('/misDatos');
  };

  const DataField = ({ label, value }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      <Typography variant="body1">
        {value || 'No especificado'}
      </Typography>
    </Box>
  );

  const DocumentPreview = ({ label, path }) => (
    <Box sx={{ mb: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
        {label}
      </Typography>
      {path ? (
        <Box sx={{ 
          mt: 1,
          position: 'relative',
          '&:hover': {
            '& img': {
              transform: 'scale(1.05)',
            },
          }
        }}>
          <img 
            src={`https://siurxpss.azurewebsites.net/${path}`} 
            alt={`Documento de ${label}`} 
            style={{ 
              width: '100%',
              maxWidth: '200px',
              height: 'auto',
              borderRadius: '8px',
              transition: 'transform 0.3s ease',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }} 
          />
        </Box>
      ) : (
        <Typography variant="body2" color="text.secondary">
          No cargado
        </Typography>
      )}
    </Box>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2,
        justifyContent: 'center'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Mis Datos Personales
        </Typography>
      </Box>

      {error && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'error.light', color: 'error.contrastText' }}>
          <Typography>{error}</Typography>
        </Paper>
      )}

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          transition: 'transform 0.3s ease',
          '&:hover': { 
            transform: 'scale(1.01)',
            boxShadow: 6 
          }
        }}
      >
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Información Personal
            </Typography>
            <Divider sx={{ mb: 3 }} />
            
            <DataField label="Primer Nombre" value={usuario?.primerNombre} />
            <DataField label="Segundo Nombre" value={usuario?.segundoNombre} />
            <DataField label="Primer Apellido" value={usuario?.primerApellido} />
            <DataField label="Segundo Apellido" value={usuario?.segundoApellido} />
            <DataField label="Pasaporte" value={usuario?.pasaporte} />
            <DataField label="Fecha de Nacimiento" value={fechaNacFormateada} />
            <DataField label="Correo Electrónico" value={usuario?.email} />
            <DataField label="Teléfono" value={usuario?.telefono} />
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Documentos
            </Typography>
            <Divider sx={{ mb: 3 }} />

            <DocumentPreview label="Vacunaciones" path={usuario?.vacunasDocumentoRuta} />
            <DocumentPreview label="Pasaporte" path={usuario?.pasaporteDocumentoRuta} />
            <DocumentPreview label="Visa" path={usuario?.visaDocumentoRuta} />
            <DocumentPreview label="Seguro de Viaje" path={usuario?.seguroDeViajeDocumentoRuta} />
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleEditClick}
            startIcon={<EditIcon />}
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontSize: '1.1rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4
              },
              transition: 'all 0.3s ease'
            }}
          >
            Modificar mis datos
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default VerMisDatos;
