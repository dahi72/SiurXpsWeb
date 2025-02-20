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

  const DocumentPreview = ({ label, base64, tipoDocumento }) => {
    if (!base64) {
      return (
        <Typography variant="body2" color="text.secondary"sx={{ fontWeight: 'bold' }}>
          {label} no cargado
        </Typography>
      );
    }
  
    // Determinar si el documento es una imagen
    const isImage = tipoDocumento === 'pasaporte' || tipoDocumento === 'visado' || tipoDocumento === 'vacunas' || tipoDocumento === 'seguro';
    
    // Determinar el tipo de documento y la extensión del archivo
    const mimeType = isImage ? 'image/jpeg' : 'application/pdf';
    const extension = isImage ? 'jpg' : 'pdf';
  
    // Crear el enlace de descarga
    const downloadLink = `data:${mimeType};base64,${base64}`;
  
    return (
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 'bold' }}>
            {label}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            component="a"
            href={downloadLink}
            download={`${label}.${extension}`}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: 4,
              },
              transition: 'all 0.3s ease',
            }}
          >
            Descargar {label}
          </Button>
        </Box>
      </Box>
    );
  };
  
  
  
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

  <DocumentPreview
    label="Vacunaciones"
    base64={usuario?.vacunasDocumentoBase64}
    tipoDocumento="vacunas"
  />
  <Box sx={{ mt: 3 }} /> {/* Añadimos espacio extra entre los documentos */}
  <DocumentPreview
    label="Pasaporte"
    base64={usuario?.pasaporteDocumentoBase64}
    tipoDocumento="pasaporte"
  />
  <Box sx={{ mt: 3 }} /> {/* Añadimos espacio extra entre los documentos */}
  <DocumentPreview
    label="Visa"
    base64={usuario?.visaDocumentoBase64}
    tipoDocumento="visado"
  />
  <Box sx={{ mt: 3 }} /> {/* Añadimos espacio extra entre los documentos */}
  <DocumentPreview
    label="Seguro de Viaje"
    base64={usuario?.seguroDeViajeDocumentoBase64}
    tipoDocumento="seguro"
  />
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
