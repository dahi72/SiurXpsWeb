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
import { useNavigate } from "react-router-dom"; 

const Aeropuertos = () => {
  const navigate = useNavigate(); 
  const [tabValue, setTabValue] = useState(0);
  const [aeropuertos, setAeropuertos] = useState([]);
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [paisSeleccionado, setPaisSeleccionado] = useState('');
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState('');
  const [nombre, setNombre] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aeropuertoEditando, setAeropuertoEditando] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const cargarAeropuertos = async () => {
      try {
        const response = await fetch(`${baseUrl}/Aeropuerto/aeropuertos`);
        const data = await response.json();
        setAeropuertos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar los aeropuertos:', error);
      }
    };

    cargarAeropuertos();
  }, [baseUrl]);

  useEffect(() => {
    const cargarPaises = async () => {
      try {
        const response = await fetch(`${baseUrl}/Pais/listado`);
        const data = await response.json();
        setPaises(data);
      } catch (error) {
        console.error('Error al cargar los países:', error);
      }
    };

    cargarPaises();
  }, [baseUrl]);

  useEffect(() => {
    const cargarCiudades = async () => {
      if (paisSeleccionado) {
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

    cargarCiudades();
  }, [baseUrl, paisSeleccionado]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = aeropuertoEditando ? `${baseUrl}/Aeropuerto/${aeropuertoEditando.id}` : `${baseUrl}/Aeropuerto/altaAeropuerto`;
    const method = aeropuertoEditando ? 'PUT' : 'POST';
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          nombre, 
          paginaWeb, 
          paisId: paisSeleccionado.id,
          ciudadId: ciudadSeleccionada,
          direccion 
        }),
      });

      if (response.ok) {
        const message = await response.json();
        console.log('Mensaje de la API:', message);

        const aeropuertosResponse = await fetch(`${baseUrl}/Aeropuerto/aeropuertos`);
        if (aeropuertosResponse.ok) {
          const aeropuertosData = await aeropuertosResponse.json();
          setAeropuertos(aeropuertosData);
        } else {
          console.error('Error al cargar la lista de aeropuertos:', await aeropuertosResponse.json());
        }

        setNombre('');
        setPaginaWeb('');
        setPaisSeleccionado('');
        setCiudadSeleccionada('');
        setDireccion('');
        setAeropuertoEditando(null);
        setTabValue(0);
      } else {
        const errorData = await response.json();
        console.error('Error al guardar el aeropuerto:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleEditar = (aeropuerto) => {
    setAeropuertoEditando(aeropuerto);
    setNombre(aeropuerto.nombre);
    setPaginaWeb(aeropuerto.paginaWeb);
    setPaisSeleccionado(aeropuerto.pais);
    setCiudadSeleccionada(aeropuerto.ciudad);
    setDireccion(aeropuerto.direccion);
    setTabValue(1); 
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/Aeropuerto/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAeropuertos(aeropuertos.filter(aeropuerto => aeropuerto.id !== id));
      } else {
        console.error('Error al eliminar el aeropuerto');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };
  console.log("aeropuertos", aeropuertos)
  const filteredAeropuertos = aeropuertos.filter(aeropuerto =>
    aeropuerto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem'
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          flexGrow: 1,
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Gestión de Aeropuertos
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
          <Tab label="Buscar Aeropuertos" />
          <Tab label="Cargar Nuevo Aeropuerto" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            {/* Sección de Búsqueda */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField 
                  fullWidth 
                  label="Buscar aeropuerto" 
                  variant="outlined"
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </Grid>
            </Grid>

            {/* Tabla de Aeropuertos */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Página Web</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAeropuertos.length > 0 ? (
                    filteredAeropuertos.map((aeropuerto) => (
                      <TableRow key={aeropuerto.id}>
                        <TableCell>{aeropuerto.nombre}</TableCell>
                        <TableCell>
                          <a href={aeropuerto.paginaWeb} target="_blank" rel="noopener noreferrer">
                            {aeropuerto.paginaWeb}
                          </a>
                        </TableCell>
                        <TableCell>{aeropuerto.pais}</TableCell>
                        <TableCell>{aeropuerto.ciudad}</TableCell>
                        <TableCell>{aeropuerto.direccion}</TableCell>
                        <TableCell>
                          <Button size="small" color="primary" onClick={() => handleEditar(aeropuerto)}>Editar</Button>
                          <Button size="small" color="error" onClick={() => handleEliminar(aeropuerto.id)}>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} style={{ textAlign: 'center' }}>
                        No hay aeropuertos disponibles.
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
            {/* Formulario de Carga */}
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
                    label="Página Web" 
                    type="url" 
                    variant="outlined" 
                    value={paginaWeb} 
                    onChange={(e) => setPaginaWeb(e.target.value)} 
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    select 
                    fullWidth 
                    label="País" 
                    variant="outlined" 
                    value={paisSeleccionado ? paisSeleccionado.id : ''}
                    onChange={(e) => {
                      const selectedPais = paises.find(pais => pais.codigoIso === e.target.value);
                      setPaisSeleccionado(selectedPais);
                    }} 
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Seleccione un país</option>
                    {paises.map((pais) => (
                      <option key={pais.id} value={pais.codigoIso}>{pais.nombre}</option>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField 
                    select 
                    fullWidth 
                    label="Ciudad" 
                    variant="outlined" 
                    value={ciudadSeleccionada} 
                    onChange={(e) => setCiudadSeleccionada(e.target.value)} 
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="">Seleccione una ciudad</option>
                    {ciudades.map((ciudad) => (
                      <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
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
                  {aeropuertoEditando ? 'Actualizar' : 'Cargar'}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
      <Box>
      <Button variant="outlined" 
          onClick={() => navigate('/catalogos')} 
          sx={{ 
          mb: 2, 
          backgroundColor: 'blue', // Cambia 'blue' por el color que desees
          color: 'white', // Cambia el color del texto
          '&:hover': {
          backgroundColor: 'darkblue', // Color al pasar el mouse
      }
    }}
  >Volver a Catálogos
          </Button>
      </Box>
    </Box>
  );
};

export default Aeropuertos;
