import React, { useState, useEffect,useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, Grid  } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Snackbar, Alert } from '@mui/material';

const Vuelos = () => {
  const navigate = useNavigate();
  const [vuelos, setVuelos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [horario, setHorario] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vueloEditando, setVueloEditando] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const [mensaje, setMensaje] = useState('');
  const [tipoAlerta, setTipoAlerta] = useState('success'); 
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const formatHorario = (hora) => {
    if (!hora) return "00:00:00"; 
    const [hh, mm] = hora.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoAlerta(tipo);
    setOpenSnackbar(true);
  };

  // Cerrar el Snackbar
const handleCloseSnackbar = (_, reason) => {
  if (reason === 'clickaway') return;
  setOpenSnackbar(false);
};

  const cargarVuelos = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/Vuelo/vuelos`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al obtener los vuelos');
      const data = await response.json();
      setVuelos(Array.isArray(data) ? data.map(vuelo => ({ ...vuelo, horario: formatHorario(vuelo.horario) })) : []);
    } catch (error) {
      console.error('Error al cargar los vuelos:', error);
    }
  }, [baseUrl, token]); 

  useEffect(() => {
    cargarVuelos();
  }, [cargarVuelos]); 


  const isFormComplete = () => nombre.trim() !== '' && horario.trim() !== '';

  const handleTabChange = (_, newValue) => setTabValue(newValue);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete()) return mostrarMensaje('Nombre y horario son requeridos', 'error');
  
    const url = vueloEditando ? `${baseUrl}/Vuelo/${vueloEditando.id}` : `${baseUrl}/Vuelo/altaVuelo`;
    const method = vueloEditando ? 'PUT' : 'POST';
    const vueloData = { nombre, horario: formatHorario(horario) };
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vueloData),
      });
  
      if (!response.ok) throw await response.json();
      
      await cargarVuelos(); // Recargar la lista completa desde el backend
  
      setNombre('');
      setHorario('');
      setVueloEditando(null);
      setTabValue(0);
      mostrarMensaje(vueloEditando ? 'Vuelo actualizado correctamente' : 'Vuelo agregado correctamente', 'success');
    } catch (error) {
      mostrarMensaje('Error al guardar el vuelo', 'error');
    }
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este vuelo?");
    if (!confirmacion) return;
    try {
      const response = await fetch(`${baseUrl}/Vuelo/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al eliminar el vuelo');
      setVuelos(vuelos.filter(vuelo => vuelo.id !== id));
      mostrarMensaje('Vuelo eliminado correctamente', 'success');
    } catch (error) {
      mostrarMensaje('Error al eliminar el vuelo', 'error');
    }
  };

  const handleEditar = (vuelo) => {
    setVueloEditando(vuelo);
    setNombre(vuelo.nombre);
    setHorario(vuelo.horario);
    setTabValue(1);
  };

  const filteredVuelos = vuelos.filter(vuelo => 
    vuelo.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );

  return (
    
    <Box>
      <Box>
        {/* Snackbar con Alert para mostrar mensajes */}
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={tipoAlerta} variant="filled">
            {mensaje}
          </Alert>
        </Snackbar>
      </Box>
      <Typography variant="h4">Gestión de Vuelos</Typography>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Buscar Vuelos" />
        <Tab label="Cargar Nuevo Vuelo" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3, p: 3, backgroundColor: 'white', borderRadius: '10px' }}>
          <TextField label="Buscar vuelo" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} InputProps={{ endAdornment: <SearchIcon /> }} />
          <TableContainer component={Paper} sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Horario</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredVuelos.length > 0 ? (
                  filteredVuelos.map((vuelo) => (
                    <TableRow key={vuelo.id}>
                      <TableCell>{vuelo.nombre}</TableCell>
                      <TableCell>{vuelo.horario}</TableCell>
                      <TableCell>
                        <Button onClick={() => handleEditar(vuelo)}>Editar</Button>
                        <Button onClick={() => handleEliminar(vuelo.id)}>Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center">No hay vuelos disponibles.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 3, p: 3, backgroundColor: 'white', borderRadius: '10px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField fullWidth label="Horario" type="time" value={horario} onChange={(e) => setHorario(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
            </Grid>
            <Box sx={{ mt: 3, textAlign: 'right' }}>
              <Button variant="contained" color="primary" type="submit" disabled={!isFormComplete()}>
                {vueloEditando ? 'Actualizar' : 'Cargar'}
              </Button>
            </Box>
          </form>
        <Button fullWidth variant="contained" color="primary" onClick={() => navigate('/catalogos')} sx={{ mb: 2 }}>
          Volver a Catálogos
        </Button>
        </Box>
      )}
    </Box>
  );
};

export default Vuelos;
