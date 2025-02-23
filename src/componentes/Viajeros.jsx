import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress, Snackbar, Alert, Box, Button, Dialog, DialogActions, DialogContent,
  DialogContentText, DialogTitle
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';


const Viajeros = () => {
  const { grupoId } = useParams();
  const [viajeros, setViajeros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedViajero, setSelectedViajero] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerViajeros = async () => {
      setError(null);
      setLoading(true);

      try {
        const grupoResponse = await fetch(`${baseUrl}/GrupoDeViaje/${grupoId}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!grupoResponse.ok) throw new Error('Error al obtener el grupo');

        const grupoData = await grupoResponse.json();
        if (!grupoData.viajerosIds || grupoData.viajerosIds.length === 0) {
          setError('No hay viajeros en este grupo.');
          setLoading(false);
          return;
        }

        const viajerosData = await Promise.all(grupoData.viajerosIds.map(async (id) => {
          const viajeroResponse = await fetch(`${baseUrl}/Usuario/${id}`, {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
          });

          if (!viajeroResponse.ok) throw new Error(`Error cargando viajero ID: ${id}`);

          return viajeroResponse.json();
        }));

        setViajeros(viajerosData);
      } catch (error) {
        console.error(error);
        setError(error.message || 'Hubo un error al cargar los viajeros.');
      } finally {
        setLoading(false);
      }
    };

    obtenerViajeros();
  }, [grupoId,baseUrl]);

  const handleDeleteClick = (viajero) => {
    setSelectedViajero(viajero);
    setOpenDialog(true);
  };
  const handleActividadOpcional = (viajeroId) => {
    navigate(`/actividad-opcional/${grupoId}/${viajeroId}`); 
  }
  const handleDeleteConfirm = async () => {
    if (!selectedViajero) return;

    setError(null);

    try {
      const response = await fetch(`${baseUrl}/GrupoDeViaje/${grupoId}/viajeros/${selectedViajero.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      if (!response.ok) throw new Error('Error al eliminar el viajero');

      setViajeros(prevViajeros => prevViajeros.filter(v => v.id !== selectedViajero.id));
      setSuccess(true);
    } catch (error) {
      console.error(error);
      setError(error.message || 'Error al eliminar el viajero.');
    } finally {
      setOpenDialog(false);
      setSelectedViajero(null);
    }
  };

  const handleDatosViajero = (viajero) => {
    navigate('/verDatosViajero', { state: { viajero } });
  };
 

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Viajeros del Grupo
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h6" color="error">
              {error}
            </Typography>
          </Paper>
        ) : (
          <TableContainer component={Paper}>
            <Table aria-label="Lista de viajeros">
              <TableHead>
                <TableRow>
                  <TableCell scope="col">Nombre</TableCell>
                  <TableCell scope="col">Apellido</TableCell>
                  <TableCell scope="col">Pasaporte</TableCell>
                  <TableCell scope="col">Email</TableCell>
                  <TableCell scope="col">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {viajeros.map((viajero) => (
                  <TableRow key={viajero.id}>
                    <TableCell>{viajero.primerNombre}</TableCell>
                    <TableCell>{viajero.primerApellido}</TableCell>
                    <TableCell>{viajero.pasaporte}</TableCell>
                    <TableCell>{viajero.email}</TableCell>
                    <TableCell>
                    <Button
                        variant="contained"
                        color="info"
                        size="small"
                        sx={{ 
                          mr: 4, 
                          fontSize: "0.85rem" 
                        }}
                        onClick={() => handleActividadOpcional(viajero.id)}
                      >
                        Inscribir/Describir a actividad opcional
                      </Button>
                      <Button variant="contained" color="info"  onClick={() => handleDatosViajero(viajero)}  size="small"
                        sx={{ 
                          mr: 4,
                          mt:4,
                          fontSize: "0.85rem" 
                        }}>
                        Info personal
                      </Button>
                   
                      <Button variant="contained" color="error" onClick={() => handleDeleteClick(viajero)}  size="small"
                        sx={{ 
                          mr: 4,
                          fontSize: "0.85rem" 
                        }}>
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Dialogo de confirmación */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Eliminar viajero</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar a {selectedViajero?.primerNombre} {selectedViajero?.primerApellido}?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDeleteConfirm} color="error">
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
        {/* Notificación de éxito */}
        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success">
            Viajero eliminado con éxito.
          </Alert>
        </Snackbar>
      </Box>
      
    </Container>
  );
};

export default Viajeros;
