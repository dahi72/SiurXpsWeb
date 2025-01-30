import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Grid, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


const Hoteles = () => {
 
  const [tabValue, setTabValue] = useState(0);
  const [hoteles, setHoteles] = useState([]);
  const [hotelEditando, setHotelEditando] = useState(null);
  const [nombre, setNombre] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [paisId, setPaisId] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [direccion, setDireccion] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pais, setPais] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const cargarHoteles = async () => {
      try {
        const response = await fetch(`${baseUrl}/Hotel/hoteles`);
        const data = await response.json();

        // Verifica si la respuesta es un array
        if (Array.isArray(data)) {
          setHoteles(data);
        } else {
          console.warn(data.message || 'No se encontraron hoteles.');
          setHoteles([]); // Establece hoteles como un array vacío
        }
      } catch (error) {
        console.error('Error al cargar los hoteles:', error);
        setHoteles([]); // Establece hoteles como un array vacío en caso de error
      }
    };

    const cargarPaises = async () => {
      try {
        const response = await fetch(`${baseUrl}/Pais/listado`);
        const data = await response.json();
        setPaises(data);
      } catch (error) {
        console.error('Error al cargar los países:', error);
      }
    };

    cargarHoteles();
    cargarPaises();
  }, [baseUrl]);

  const handlePaisChange = async (e) => {
    const paisSeleccionado = JSON.parse(e.target.value);
   
    setCiudadId('');
    console.log("país seleccionado:", paisSeleccionado);
    setPais(paisSeleccionado.id);
    if (paisSeleccionado.codigoIso) {
      try {
        const response = await fetch(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`);
        const data = await response.json();
        setCiudades(data);
      } catch (error) {
        console.error('Error al cargar las ciudades:', error);
      }
    } else {
      setCiudades([]);
    }
  };

  const handleCiudadChange = (e) => {
    setCiudadId(e.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = hotelEditando ? `${baseUrl}/Hotel/${hotelEditando.id}` : `${baseUrl}/Hotel/altaHotel`;
    const method = hotelEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombre, 
          checkIn, 
          checkOut, 
          paginaWeb, 
          paisId: paisId,
          ciudadId: ciudadId,
          direccion 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Hotel guardado:', data);
        const hotelesResponse = await fetch(`${baseUrl}/Hotel/hoteles`);
        const hotelesData = await hotelesResponse.json();
        setHoteles(hotelesData);
        setNombre('');
        setCheckIn('');
        setCheckOut('');
        setPaginaWeb('');
        setPaisId('');
        setCiudadId('');
        setDireccion('');
        setHotelEditando(null);
        setTabValue(0);
      } else {
        const errorData = await response.json();
        console.error('Error al guardar el hotel:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleEditar = (hotel) => {
    setHotelEditando(hotel);
    setNombre(hotel.nombre);
    setCheckIn(hotel.checkIn);
    setCheckOut(hotel.checkOut);
    setPaginaWeb(hotel.paginaWeb);
    setPaisId(hotel.pais);
    setCiudadId(hotel.ciudad);
    setDireccion(hotel.direccion);
    setTabValue(1);
  };

  const handleEliminar = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este hotel?')) {
      try {
        const response = await fetch(`${baseUrl}/Hotel/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          const hotelesResponse = await fetch(`${baseUrl}/Hotel/hoteles`);
          const hotelesData = await hotelesResponse.json();
          setHoteles(hotelesData);
        } else {
          console.error('Error al eliminar el hotel');
        }
      } catch (error) {
        console.error('Error de red:', error);
      }
    }
  };
 
 // console.log('Tipo de hoteles:', Array.isArray(hoteles), hoteles);
  // const filteredHoteles = Array.isArray(hoteles) ? hoteles.filter(hotel => 
  //   hotel.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  // ) : [];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundImage: 'url(/Fondo.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '2rem',
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
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField 
                  fullWidth 
                  label="Buscar hotel" 
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />
                  }}
                />
              </Grid>
            </Grid>

            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Check-in</TableCell>
                    <TableCell>Check-out</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
            
                  {/* {filteredHoteles.length > 0 ? (
                    filteredHoteles.map(hotel => (
                      <TableRow key={hotel.id}>
                        <TableCell>{hotel.nombre}</TableCell>
                        <TableCell>{hotel.ciudadId}</TableCell>
                        <TableCell>{hotel.checkIn}</TableCell>
                        <TableCell>{hotel.checkOut}</TableCell>
                        <TableCell>
                          <Button size="small" color="primary" onClick={() => handleEditar(hotel)}>Editar</Button>
                          <Button size="small" color="error" onClick={() => handleEliminar(hotel.id)}>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : ( */}
                    <TableRow>
                      <TableCell colSpan={5} style={{ textAlign: 'center' }}>
                        No hay hoteles disponibles.
                      </TableCell>
                    </TableRow>
                  {/* )} */}
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
                    label="Nombre" 
                    variant="outlined" 
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Horario Check-in" 
                    type="time" 
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Horario Check-out" 
                    type="time" 
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Página Web" 
                    type="url" 
                    value={paginaWeb}
                    onChange={(e) => setPaginaWeb(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="País" 
                    variant="outlined" 
                    select
                    value={pais ? pais.id : ''}
                    onChange={handlePaisChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Seleccione un país</option>
                    {paises.map(p => (
                      <option key={p.id} value={JSON.stringify(p)}>{p.nombre}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    fullWidth 
                    label="Ciudad" 
                    variant="outlined" 
                    select
                    value={ciudadId}
                    onChange={handleCiudadChange}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {ciudades.map(c => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Dirección" 
                    variant="outlined" 
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" type="submit">
                  {hotelEditando ? 'Actualizar' : 'Cargar'}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Hoteles;
