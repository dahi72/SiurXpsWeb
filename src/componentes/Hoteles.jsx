import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Hoteles = () => {
  const navigate = useNavigate();
  const [tips, setTips] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [nombre, setNombre] = useState('');
  const [checkIn, setCheckIn] = useState('00:00:00');
  const [checkOut, setCheckOut] = useState('00:00:00');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [hoteles, setHoteles] = useState([]);
  const [filtroPais, setFiltroPais] = useState('');
  const [filtroCiudad, setFiltroCiudad] = useState('');
  const [filtroNombre, setFiltroNombre] = useState('');
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tipoAlerta, setTipoAlerta] = useState('success');
  const [mensaje, setMensaje] = useState('');

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

  const fetchHoteles = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/Hotel/hoteles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setHoteles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error al cargar los hoteles:', error);
    }
  }, [baseUrl, token]);

  useEffect(() => {
    fetchHoteles();
  }, [fetchHoteles]);

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await fetch(`${baseUrl}/Pais/listado`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Error al obtener los países');

        const data = await response.json();
        const paisesOrdenados = data.sort((a, b) => {
          if (a.nombre < b.nombre) return -1;
          if (a.nombre > b.nombre) return 1;
          return 0;
        });

        setPaises(paisesOrdenados);
      } catch (error) {
        console.error('Error al cargar los países:', error);
      }
    };

    cargarPaises();
  }, [baseUrl, token]);

  const handleCiudadChange = async (codigoIso) => {
    try {
      const response = await fetch(`${baseUrl}/Ciudad/${codigoIso}/ciudades`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al obtener las ciudades');

      const data = await response.json();
      const ciudadesOrdenadas = data.sort((a, b) => {
        if (a.nombre < b.nombre) return -1;
        if (a.nombre > b.nombre) return 1;
        return 0;
      });

      setCiudades(ciudadesOrdenadas);
    } catch (error) {
      console.error('Error al cargar las ciudades:', error);
    }
  };

  const isFormComplete = () => {
    return (
      nombre &&
      checkIn.trim() !== '' &&
      checkOut.trim() !== '' &&
      paginaWeb &&
      direccion &&
      paisId &&
      ciudadId
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormComplete()) return mostrarMensaje('Todos los campos son requeridos', 'error');
    const nuevoHotel = {
      nombre,
      checkIn: formatHorario(checkIn.slice(0, 5)),
      checkOut: formatHorario(checkOut.slice(0, 5)),
      paginaWeb: paginaWeb || null,
      direccion,
      paisId: parseInt(paisId),
      ciudadId: parseInt(ciudadId),
      tips: tips || null
    };

    try {
      const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(nuevoHotel),
      });
      
      //const data = await response.json();

      if (!response.ok) {
        mostrarMensaje('Error al agregar el hotel', 'error');
      }

      setNombre('');
      setCheckIn('');
      setCheckOut('');
      setPaginaWeb('');
      setDireccion('');
      setPaisId('');
      setCiudadId('');
      setTips('');
      
      await fetchHoteles();
      setTabValue(0);
     
      alert('Hotel agregado exitosamente');
    } catch (error) {
      mostrarMensaje('Error al guardar el hotel', 'error');
    }
  };

 

  const handleFiltroPaisChange = async (e) => {
    setFiltroPais(e.target.value);
    setFiltroCiudad('');
    if (e.target.value) {
      handleCiudadChange(e.target.value);
    }
  };

  const handleFiltroCiudadChange = (e) => {
    setFiltroCiudad(e.target.value);
  };

  const handleFiltroNombreChange = (e) => {
    setFiltroNombre(e.target.value);
  };

  const filteredHoteles = hoteles.filter(hotel => {
    return (
      (filtroPais ? hotel.paisId === filtroPais : true) &&
      (filtroCiudad ? hotel.ciudadId === filtroCiudad : true) &&
      (filtroNombre ? hotel.nombre.toLowerCase().includes(filtroNombre.toLowerCase()) : true)
    );
  });

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este hotel?");
    if (!confirmacion) return;
    try {
      const response = await fetch(`${baseUrl}/Hotel/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Error al eliminar el hotel');
      setHoteles(hoteles.filter(hotel => hotel.id !== id));
      mostrarMensaje('Hotel eliminado correctamente', 'success');
    } catch (error) {
      mostrarMensaje('Error al eliminar el hotel', 'error');
    }
  };

  const handleEditar = async (hotel) => {
    hotel.preventDefault();
    if (!isFormComplete()) return mostrarMensaje('Todos los campos son requeridos', 'error');
    
    // setVueloEditando(vuelo);
    // setNombre(vuelo.nombre);
    // setHorario(vuelo.horario);
    // setTabValue(1);
    const hotelActualizado = {
      id : hotel.id, // Asegúrate de tener el ID del hotel a actualizar
      nombre,
      checkIn : formatHorario(checkIn.slice(0, 5)),
      checkOut : formatHorario(checkOut.slice(0, 5)),
      paginaWeb : paginaWeb || null,
      direccion,
      paisId : parseInt(paisId),
      ciudadId : parseInt(ciudadId),
      tips : tips || null
    }
    
    try {
      const response = await fetch(`${baseUrl}/Hotel/${hotel.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelActualizado),
      });
    
      if (!response.ok) {
        return mostrarMensaje('Error al actualizar el hotel', 'error');
      }
      setNombre('');
      setCheckIn('');
      setCheckOut('');
      setPaginaWeb('');
      setDireccion('');
      setPaisId('');
      setCiudadId('');
      setTips('');
    
      await fetchHoteles(); // Recargar la lista de hoteles
      setTabValue(0);
    
      alert('Hotel actualizado exitosamente');
    } catch (error) {
      mostrarMensaje('Error al actualizar el hotel', 'error');
    }
  };


  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem'
      }}
    >
      <Box>
        {/* Snackbar con Alert para mostrar mensajes */}
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={tipoAlerta} variant="filled">
            {mensaje}
          </Alert>
        </Snackbar>
      </Box>
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '2rem',
          flexGrow: 1,
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Gestión de Hoteles
        </Typography>

        <Tabs 
          value={tabValue} 
          onChange={(event, newValue) => setTabValue(newValue)} 
          sx={{ 
            mb: 3,
            '& .MuiTab-root': {
              fontWeight: 'bold',
              color: 'rgba(25, 118, 210, 0.7)',
              '&.Mui-selected': {
                color: 'primary.main',
              }
            }
          }}
        >
          <Tab label="Buscar Hoteles" />
          <Tab label="Agregar Nuevo Hotel" />
        </Tabs>

        {tabValue === 0 && (
          <Box>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Nombre del Hotel" 
                  variant="outlined" 
                  value={filtroNombre}
                  onChange={handleFiltroNombreChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>País</InputLabel>
                  <Select
                    value={filtroPais}
                    onChange={handleFiltroPaisChange}
                    label="País"
                  >
                    <MenuItem value="">Todos</MenuItem>
                    {paises.map((pais) => (
                      <MenuItem key={pais.codigoIso} value={pais.codigoIso}>
                        {pais.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>Ciudad</InputLabel>
                  <Select
                    value={filtroCiudad}
                    onChange={handleFiltroCiudadChange}
                    label="Ciudad"
                    disabled={!filtroPais}
                  >
                    <MenuItem value="">Todas</MenuItem>
                    {ciudades.map((ciudad) => (
                      <MenuItem key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Página Web</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Tips</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredHoteles.length > 0 ? (
                    filteredHoteles.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell>{hotel.nombre}</TableCell>
                        <TableCell>{hotel.checkIn}</TableCell>
                        <TableCell>{hotel.checkOut}</TableCell>
                        <TableCell>{hotel.paginaWeb}</TableCell>
                        <TableCell>{hotel.direccion}</TableCell>
                        <TableCell>{hotel.paisNombre}</TableCell>
                        <TableCell>{hotel.ciudadNombre}</TableCell>
                        <TableCell>{hotel.tips}</TableCell>
                        <TableCell>
                        <Button onClick={() => handleEditar(hotel)}>Editar</Button>
                        <Button onClick={() => handleEliminar(hotel.id)}>Eliminar</Button>
                      </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} align="center">
                        No se encontraron hoteles.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {tabValue === 1 && (
          <Box>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Nombre del Hotel" 
                    variant="outlined" 
                    value={nombre} 
                    onChange={(e) => setNombre(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Check-in" 
                    type="time"
                    variant="outlined" 
                    value={checkIn === '00:00:00' ? '' : checkIn.slice(0, 5)} 
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Check-out" 
                    type="time"
                    variant="outlined" 
                    value={checkOut === '00:00:00' ? '' : checkOut.slice(0, 5)} 
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Página Web" 
                    variant="outlined" 
                    value={paginaWeb} 
                    onChange={(e) => setPaginaWeb(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Dirección" 
                    variant="outlined" 
                    value={direccion} 
                    onChange={(e) => setDireccion(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>País</InputLabel>
                    <Select
                      value={paisId}
                      onChange={(e) => {
                        setPaisId(e.target.value);
                        handleCiudadChange(e.target.value);
                      }}
                      label="País"
                    >
                      {paises.map((pais) => (
                        <MenuItem key={pais.id} value={pais.id}>
                          {pais.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={ciudadId}
                      onChange={(e) => setCiudadId(e.target.value)}
                      label="Ciudad"
                      disabled={!paisId}
                    >
                      {ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.id}>
                          {ciudad.nombre}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Tips"
                    variant="outlined"
                    multiline
                    rows={4}
                    value={tips}
                    onChange={(e) => setTips(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary" 
                    fullWidth 
                    sx={{ mt: 3 }}
                    disabled={!isFormComplete()}
                  >
                    Agregar Hotel
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        )}
      </Box>
      <Box>
        <Button 
          variant="outlined" 
          onClick={() => navigate('/catalogos')} 
          sx={{ 
            mb: 2, 
            backgroundColor: 'rgb(227, 242, 253)', 
            color: '#1976d2'
          }}
        >
          Volver a Catálogos
        </Button>
      </Box>
    </Box>
  );
};

export default Hoteles;