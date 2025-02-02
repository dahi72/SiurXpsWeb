import { Container, Typography, Box, Button, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import React, { useContext, useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { UsuarioContext } from '../hooks/UsuarioContext';

const VerMisDatos = () => {
  const navigate = useNavigate();
  const { usuario, error } = useContext(UsuarioContext);
  const [documentos, setDocumentos] = useState({
    vacunas: null,
    pasaporte: null,
    visa: null,
    seguroDeViaje: null,
  });
  const baseUrl = process.env.REACT_APP_API_URL;

  const fechaNacFormateada = usuario && usuario.fechaNac ? dayjs(usuario.fechaNac).format('DD/MM/YYYY') : '';

  const handleEditClick = () => {
    navigate('/misDatos');
  };

  useEffect(() => {
    if (usuario) {
      // Get the document URLs from the backend
      const fetchDocumentos = async () => {
        try {
          const docTypes = ['vacunas', 'pasaporte', 'visa', 'seguroDeViaje'];
          const newDocumentos = {};
          for (const tipo of docTypes) {
            const response = await fetch(`${baseUrl}/Usuario/ver-documento/${usuario.id}/${tipo}`);
            if (response.ok) {
              const data = await response.blob();
              newDocumentos[tipo] = URL.createObjectURL(data);
            } else {
              newDocumentos[tipo] = null;
            }
          }
          setDocumentos(newDocumentos);
        } catch (error) {
          console.error('Error fetching documentos:', error);
        }
      };

      fetchDocumentos();
    }
  }, [usuario, baseUrl]);

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: 'auto' }}>
        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
          <Container sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
            <Typography variant="h4" align="center" gutterBottom>Datos</Typography>
            {error && <Typography color="error">{error}</Typography>}
            <Paper sx={{ p: 3, mt: 2 }}>
              <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Primer Nombre:</Typography>
                  <Typography variant="body1">{usuario?.primerNombre || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Segundo Nombre:</Typography>
                  <Typography variant="body1">{usuario?.segundoNombre || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Primer Apellido:</Typography>
                  <Typography variant="body1">{usuario?.primerApellido || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Segundo Apellido:</Typography>
                  <Typography variant="body1">{usuario?.segundoApellido || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Cédula:</Typography>
                  <Typography variant="body1">{usuario?.cedula || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Pasaporte:</Typography>
                  <Typography variant="body1">{usuario?.pasaporte || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Fecha de Nacimiento:</Typography>
                  <Typography variant="body1">{fechaNacFormateada || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Correo Electrónico:</Typography>
                  <Typography variant="body1">{usuario?.email || ''}</Typography>
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Teléfono:</Typography>
                  <Typography variant="body1">{usuario?.telefono || ''}</Typography>
                </Box>

                {/* Documentos */}
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Vacunaciones:</Typography>
                  {documentos.vacunas ? (
                    <img src={documentos.vacunas} alt="Documento de Vacunas" style={{ width: '200px', height: 'auto' }} />
                  ) : (
                    <Typography>No cargado</Typography>
                  )}
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Pasaporte:</Typography>
                  {documentos.pasaporte ? (
                    <img src={documentos.pasaporte} alt="Documento de Pasaporte" style={{ width: '200px', height: 'auto' }} />
                  ) : (
                    <Typography>No cargado</Typography>
                  )}
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Visa:</Typography>
                  {documentos.visa ? (
                    <img src={documentos.visa} alt="Documento de Visa" style={{ width: '200px', height: 'auto' }} />
                  ) : (
                    <Typography>No cargado</Typography>
                  )}
                </Box>
                <Box sx={{ flexBasis: '50%', p: 1 }}>
                  <Typography variant="subtitle1" color="text.secondary">Seguro de Viaje:</Typography>
                  {documentos.seguroDeViaje ? (
                    <img src={documentos.seguroDeViaje} alt="Documento de Seguro de Viaje" style={{ width: '200px', height: 'auto' }} />
                  ) : (
                    <Typography>No cargado</Typography>
                  )}
                </Box>
              </Box>
            </Paper>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={handleEditClick}
              sx={{ mt: 3 }}
            >
              Modificar mis datos
            </Button>
          </Container>
        </Box>
      </Box>
    </>
  );
};

export default VerMisDatos;
