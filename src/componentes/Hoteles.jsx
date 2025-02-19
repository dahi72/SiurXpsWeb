import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel, Snackbar, Alert } from '@mui/material';

const Hoteles = () => {
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
  const [filtroNombre, setFiltroNombre] = useState('');
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [tipoAlerta] = useState('success');
  const [hotelEditando, setHotelEditando] = useState(null);
  const [paisCodigoIso, setPaisCodigoIso] = useState('');
  const [mensaje, setMensaje] = useState('');
  

  const formatHorario = (hora) => {
    if (!hora) return "00:00:00";
    const [hh, mm] = hora.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
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

  const handleCloseSnackbar = (_, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  const cargarHoteles = useCallback(async () => {
    try {
      const response = await fetch(`${baseUrl}/Hotel/hoteles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al obtener los hoteles');
      }

      const data = await response.json();
      setHoteles(Array.isArray(data) ? data : []);
    } catch (error) {
      alert(error.message || 'Hubo un error al cargar los hoteles');
    }
  }, [baseUrl, token]);

  useEffect(() => {
    cargarHoteles();
  }, [cargarHoteles]);

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
        alert(error.message || 'Hubo un error al cargar los países');
      }
    };

    cargarPaises();
  }, [baseUrl, token]);

  useEffect(() => {
    const cargarCiudades = async () => {
      if (paisCodigoIso) {
        try {
          const response = await fetch(`${baseUrl}/Ciudad/${paisCodigoIso}/ciudades`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al obtener las ciudades');
          }

          const data = await response.json();
          const ciudadesOrdenadas = data.sort((a, b) => a.nombre.localeCompare(b.nombre));
          setCiudades(ciudadesOrdenadas);
        } catch (error) {
          console.error('Error al cargar las ciudades:', error);
          alert(error.message || 'Hubo un error al cargar las ciudades');
        }
      } else {
        setCiudades([]);
      }
    };

    cargarCiudades();
  }, [baseUrl, paisCodigoIso, token]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = hotelEditando ? `${baseUrl}/Hotel/${hotelEditando.id}` : `${baseUrl}/Hotel/altaHotel`;
    const method = hotelEditando ? 'PUT' : 'POST';
    const hotelData = {
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
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(hotelData),
      });

      if (response.status === 204) {
        console.log('Operación exitosa pero sin contenido.');
      } else {
        const mensaje = await response.json();
        console.log('Mensaje de la API:', mensaje);
      }

      await cargarHoteles();

      setNombre('');
      setCheckIn('');
      setCheckOut('');
      setPaginaWeb('');
      setDireccion('');
      setPaisId('');
      setCiudadId('');
      setTips('');
      setHotelEditando(null);
      setTabValue(0);
    } catch (error) {
      console.error('Error de red:', error);
      alert(error.message || 'Hubo un error al dar de alta el hotel');
    }
  };

  const handleEditar = (hotel) => {
    setHotelEditando(hotel);
    setNombre(hotel.nombre);
    setCheckIn(hotel.checkIn.slice(0, 5)); // Ajustar formato de hora
    setCheckOut(hotel.checkOut.slice(0, 5)); // Ajustar formato de hora
    setPaginaWeb(hotel.paginaWeb);
    setDireccion(hotel.direccion);
    setPaisId(hotel.paisId.toString());
    setCiudadId(hotel.ciudadId.toString());
    setTips(hotel.tips);

    const pais = paises.find(p => p.id === hotel.paisId);
    if (pais) {
      setPaisCodigoIso(pais.codigoIso);
    }

    setTabValue(1);
  };

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar este hotel?");
    if (confirmacion) {
      try {
        const response = await fetch(`${baseUrl}/Hotel/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });
  
        if (response.ok) {
          setHoteles(hoteles.filter(hotel => hotel.id !== id));
          setMensaje('Hotel eliminado con éxito');  // Actualizar el mensaje
          setOpenSnackbar(true);  // Abrir el Snackbar
        } else {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Hubo un error al eliminar el hotel');
        }
      } catch (error) {
        console.error('Error al eliminar hotel:', error);
        alert(error.message || 'Hubo un error al eliminar el hotel');
      }
    } else {
      console.log('Eliminación cancelada');
    }
  };
  
  const filteredHoteles = (hoteles ?? []).filter(hotel =>
    hotel?.nombre?.toLowerCase().includes(filtroNombre?.toLowerCase() || "")
  );
 
 
  const handleFiltroNombreChange = (e) => {
    setFiltroNombre(e.target.value);
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
          onChange={handleTabChange} 
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
          <Tab label="Cargar Nuevo Hotel" />
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
              <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>País</InputLabel>
                    <Select
                      value={paisId || ''}
                      onChange={(e) => {
                        const selectedPais = paises.find(pais => pais.id === parseInt(e.target.value));
                        setPaisId(Number(e.target.value));
                        if (selectedPais) {
                          setPaisCodigoIso(selectedPais.codigoIso);
                          setCiudadId('');
                        }
                      }}
                    >
                      <MenuItem value="">Seleccione un país</MenuItem>
                      {paises.map((pais) => (
                        <MenuItem key={pais.id} value={pais.id}>{pais.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!paisId}>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={ciudadId}
                      onChange={(e) => setCiudadId(e.target.value)}
                    >
                      <MenuItem value="">Seleccione una ciudad</MenuItem>
                      {ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
            </Grid>
            <TableContainer

>
  <Table sx={{ ml: 0, width: '110%', tableLayout: 'auto' }}> {/* Hacemos que la tabla ocupe todo el ancho */}
    <TableHead>
      <TableRow>
        <TableCell sx={{ fontSize: '0.75rem' }}>Nombre</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Check-in</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Check-out</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Página Web</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Dirección</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>País</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Ciudad</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Tips</TableCell>
        <TableCell sx={{ fontSize: '0.75rem' }}>Acciones</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredHoteles.length > 0 ? (
        filteredHoteles.map((hotel) => (
          <TableRow key={hotel.id}>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.nombre}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.checkIn}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.checkOut}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.paginaWeb}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.direccion}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.pais.nombre}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.ciudad.nombre}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>{hotel.tips}</TableCell>
            <TableCell sx={{ fontSize: '0.75rem', padding: '6px 8px' }}>
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
                 <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>País</InputLabel>
                    <Select
                      value={paisId || ''}
                      onChange={(e) => {
                        const selectedPais = paises.find(pais => pais.id === parseInt(e.target.value));
                        setPaisId(Number(e.target.value));
                        if (selectedPais) {
                          setPaisCodigoIso(selectedPais.codigoIso);
                          setCiudadId('');
                        }
                      }}
                    >
                      <MenuItem value="">Seleccione un país</MenuItem>
                      {paises.map((pais) => (
                        <MenuItem key={pais.id} value={pais.id}>{pais.nombre}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth disabled={!paisId}>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={ciudadId}
                      onChange={(e) => setCiudadId(e.target.value)}
                    >
                      <MenuItem value="">Seleccione una ciudad</MenuItem>
                      {ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</MenuItem>
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
                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  type="submit"
                  disabled={!isFormComplete()}
                >
                  {hotelEditando ? "Actualizar" : "Crear"} Hotel
                </Button>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  onClick={() => {
                    setNombre('');
                    setCheckIn('');
                    setCheckOut('');
                    setPaginaWeb('');
                    setDireccion('');
                    setPaisId('');
                    setCiudadId('');
                    setTips('');
                    setHotelEditando(null);
                    setTabValue(0);
                  }}
                >
                  Cancelar
                </Button>
                </Box>
                </Grid>
              </Grid>
          
            </form>
          </Box>
        )}
      
      </Box>
    </Box>
  );
};

export default Hoteles;
