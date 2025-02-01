import React, { useEffect, useState } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, Snackbar, Alert, Box, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';


const Viajeros = () => {
  const { grupoId } = useParams(); 
  const [viajeros, setViajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerViajeros = async () => {
      try {
        const grupoResponse = await fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const grupoData = await grupoResponse.json();

        if (grupoData.viajerosIds.length > 0) {
          const viajerosData = await Promise.all(grupoData.viajerosIds.map(async (id) => {
            const viajeroResponse = await fetch(`${baseUrl}/Usuario/${id}`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
              }
            });
            if (!viajeroResponse.ok) {
              throw new Error('Error al cargar los datos del viajero');
            }
            return viajeroResponse.json();
          }));

          setViajeros(viajerosData);
        } else {
          setError('No hay viajeros para este grupo.');
        }
      } catch (error) {
        setError('Hubo un error al cargar los viajeros.');
      } finally {
        setLoading(false);
      }
    };

    obtenerViajeros();
  }, [grupoId, baseUrl]);


  const handleRedirect = () => {
    navigate('/misGrupos'); 
  };
  

  
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 4 }}>
          Viajeros del Grupo
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {error}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Apellido</TableCell>
                  <TableCell>Pasaporte</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Teléfono</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viajeros.map((viajero) => (
                  <TableRow key={viajero.id}>
                    <TableCell>{viajero.primerNombre}</TableCell>
                    <TableCell>{viajero.primerApellido}</TableCell>
                    <TableCell>{viajero.pasaporte}</TableCell>
                    <TableCell>{viajero.email}</TableCell>
                    <TableCell>{viajero.telefono}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
         <Box sx={{ my: 4 }}>
          <Button
            variant="contained"
            onClick={handleRedirect} // Llamar a la función de redirección
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            Volver a Mis Grupos
          </Button>
        </Box>
        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
        >
          <Alert severity="success" sx={{ width: '100%' }}>
            Operación realizada con éxito
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default Viajeros;
