
import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Paper, TextField, Grid, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  const [hotelesFiltrados, setHotelesFiltrados] = useState([]); 
  const [filtros, setFiltros] = useState({
    pais: '',
    ciudad: '',
    nombre: ''
  });
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;

  const isFormComplete = () => {
    return (
      nombre &&
      checkIn &&
      checkOut &&
      paginaWeb &&
      direccion &&
      paisId.id &&
      ciudadId &&
      tips
    );
  };
  useEffect(() => {
    const cargarPaises = async () => {
        try {
          const response = await fetch(`${baseUrl}/Pais/listado`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
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
  const formatHorario = (hora) => {
    if (!hora) return "00:00:00"; 
    const [hh, mm] = hora.split(":");
    return `${hh.padStart(2, "0")}:${mm.padStart(2, "0")}:00`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoHotel = {
      nombre,
      checkIn : formatHorario(checkIn),
      checkOut : formatHorario(checkOut),
      paginaWeb,
      direccion,
      paisId : paisId.id,
      ciudadId,
      tips
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
  
      const data = await response.json(); 
      console.log('Respuesta del servidor:', data);
      if (!response.ok) {
        throw new Error(data?.mensaje || 'Error al agregar el hotel');
      }
  
      setNombre('');
      setCheckIn('');
      setCheckOut('');
      setPaginaWeb('');
      setDireccion('');
      setPaisId('');
      setCiudadId('');
      setTips('');
      
      const hotelesResponse = await fetch(`${baseUrl}/Hotel/hoteles`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
    
      if (!hotelesResponse.ok) {
        throw new Error(`Error ${hotelesResponse.status}: ${hotelesResponse.statusText}`);
      }
    
      const hotelesData = await hotelesResponse.json();
      // Si no hay filtros, mostramos todos los hoteles
      let hotelesFiltrados = hotelesData;
      setHoteles(hotelesData)
      hotelesFiltrados = hoteles.filter((hotel) => {
        return (
          (filtros.nombre === '' || hotel.nombre.toLowerCase().includes(filtros.nombre.toLowerCase())) &&
          (filtros.pais === '' || hotel.paisCodigo === filtros.pais) &&
          (filtros.ciudad === '' || hotel.ciudadId === filtros.ciudad)
        );
      });
      

      // Mapea los nombres de país y ciudad
      const hotelesConNombres = hotelesFiltrados.map(hotel => ({
        ...hotel,
        paisNombre: paises.find(pais => pais.id === hotel.paisId)?.nombre || 'No disponible',
        ciudadNombre: ciudades.find(ciudad => ciudad.id === hotel.ciudadId)?.nombre || 'No disponible'
      }));

      setHotelesFiltrados(hotelesConNombres);
      
    } catch (error) {
      console.error('Error en la solicitud de hoteles:', error.message);
    }
  };

  const handleFiltroChange = (e) => {
    setFiltros({
      ...filtros,
      [e.target.name]: e.target.value
    });
  };

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
    
    } catch (error) {
      console.error('Error al eliminar el vuelo', 'error');
    }
  };

  const handleEditar = (hotel) => {
   
    setNombre(hotel.nombre);
      setCheckIn(hotel.checkIn);
      setCheckOut(hotel.checkOut);
      setPaginaWeb(hotel.paginaWeb);
      setDireccion(hotel.direccion);
      setPaisId(hotel.paisId);
      setCiudadId(hotel.ciudadId);
      setTips(hotel.tips);
    setTabValue(1);
    // const hotelesFiltrados = hotel.filter(hotel => 
    //   hotel.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
    // );

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
        <Button
           fullWidth
          //variant="contained"
          onClick={() => navigate('/catalogos')} 
          sx={{ 
          mb: 2, 
          backgroundColor: 'rgb(227, 242, 253)', 
          color: '#1976d2'
          }} >
          Volver a Catálogos
        </Button>
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
            {/* Filtros */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                <TextField 
                  fullWidth 
                  label="Nombre del Hotel" 
                  variant="outlined" 
                  value={filtros.nombre}
                  onChange={handleFiltroChange}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <InputLabel>País</InputLabel>
                  <Select
                    value={filtros.pais}
                    onChange={handleFiltroChange}
                    label="País"
                  >
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
                    value={filtros.ciudad}
                    onChange={handleFiltroChange}
                    label="Ciudad"
                  >
                    {ciudades.map((ciudad) => (
                      <MenuItem key={ciudad.id} value={ciudad.id}>
                        {ciudad.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Tabla de Hoteles Filtrados */}
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
                  {hotelesFiltrados.length > 0 ? (
                    hotelesFiltrados.map((hotel) => (
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
                    label="Check-In"
                    type="time"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
                <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label="Check-Out"
                    type="time"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)} InputLabelProps={{ shrink: true }} />
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
                      value={paisId ? paisId.id : ''}
                      onChange={(e) => {
                        const selectedPais = paises.find(pais => pais.id === e.target.value);
                        if (selectedPais) {
                          setPaisId(selectedPais);
                          setCiudades([]);  
                          handleCiudadChange(selectedPais.codigoIso); 
                        }
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
    </Box>
  );
};
export default Hoteles;

