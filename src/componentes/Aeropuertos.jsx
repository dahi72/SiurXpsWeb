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
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem
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
  const [tips, setTips] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aeropuertoEditando, setAeropuertoEditando] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token'); 

  const isFormComplete = () => {
    return (
      nombre &&
      paginaWeb &&
      direccion &&
      paisSeleccionado &&
      ciudadSeleccionada 
    );
  };

  useEffect(() => {
    const cargarAeropuertos = async () => {
        try {
            const token = localStorage.getItem('token');

            const response = await fetch(`${baseUrl}/Aeropuerto/aeropuertos`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error('Error al obtener los aeropuertos');

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
            const token = localStorage.getItem('token');

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
}, [baseUrl]);


  useEffect(() => {
    const cargarCiudades = async () => {
        if (paisSeleccionado) {
            try {
               

                const response = await fetch(`${baseUrl}/Ciudad/${paisSeleccionado.codigoIso}/ciudades`, {
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
        } else {
            setCiudades([]); 
        }
    };

    cargarCiudades();
}, [baseUrl, paisSeleccionado, token]);


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = aeropuertoEditando ? `${baseUrl}/Aeropuerto/${aeropuertoEditando.id}` : `${baseUrl}/Aeropuerto/altaAeropuerto`;
    const method = aeropuertoEditando ? 'PUT' : 'POST';
    console.log("aeropuerto", nombre, paginaWeb, paisSeleccionado, ciudadSeleccionada, direccion, tips)

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer  ${localStorage.getItem('token')}`, 
          'Content-Type': 'application/json'
      },
        body: JSON.stringify({ 
          nombre, 
          paginaWeb, 
          paisId: paisSeleccionado,
          ciudadId: ciudadSeleccionada,
          direccion,
          tips
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
        setTips('');
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
  const handleCiudadChange = async (codigoIso) => {
    if (codigoIso) {
      try {
        const response = await fetch(`${baseUrl}/Ciudad/${codigoIso}/ciudades`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
  
        if (!response.ok) throw new Error('Error al obtener las ciudades');
  
        const data = await response.json();
        setCiudades(data); 
      } catch (error) {
        console.error('Error al cargar las ciudades:', error);
      }
    } else {
      setCiudades([]);  
    }
  };

  const handleEditar = (aeropuerto) => {
    setAeropuertoEditando(aeropuerto);
    setNombre(aeropuerto.nombre);
    setPaginaWeb(aeropuerto.paginaWeb);
    setPaisSeleccionado(aeropuerto.pais);
    setCiudadSeleccionada(aeropuerto.ciudad);
    setDireccion(aeropuerto.direccion);
    setTips(aeropuerto.tips);
    setTabValue(1); 
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/Aeropuerto/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer  ${token}`, 
          'Content-Type': 'application/json'
      },
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
  const filteredAeropuertos = (aeropuertos ?? []).filter(aeropuerto =>
    aeropuerto?.nombre?.toLowerCase().includes(searchTerm?.toLowerCase() || "")
  );
  

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem'
      }}
    >
      <Box>
        <Button variant="outlined" 
            onClick={() => navigate('/catalogos')} 
            sx={{ 
            mb: 2, 
            backgroundColor: 'rgb(227, 242, 253)', 
            color: '#1976d2'
            }}
              >Volver a Catálogos
        </Button>
      </Box>
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
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Página Web</TableCell>
                    <TableCell>País</TableCell>
                    <TableCell>Ciudad</TableCell>
                    <TableCell>Dirección</TableCell>
                    <TableCell>Tips</TableCell>
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
                        <TableCell>{aeropuerto.tips}</TableCell>
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
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>País</InputLabel>
                    <Select
                      value={paisSeleccionado ? paisSeleccionado.id : ''}
                      onChange={(e) => {
                        const selectedPais = paises.find(pais => pais.id === e.target.value);
                        if (selectedPais) {
                          setPaisSeleccionado(selectedPais); 
                          setCiudades([]);  
                          handleCiudadChange(selectedPais.codigoIso); 
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
                  <FormControl fullWidth margin="normal" disabled={ciudades.length === 0}>
                    <InputLabel>Ciudad</InputLabel>
                    <Select
                      value={ciudadSeleccionada || ''}
                      onChange={(e) => setCiudadSeleccionada(e.target.value)}  
                    >
                      <MenuItem value="">Seleccione una ciudad</MenuItem>
                      {ciudades.map((ciudad) => (
                        <MenuItem key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</MenuItem>  
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

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
                <Grid item xs={12}>
                  <TextField 
                    fullWidth 
                    label="Tips" 
                    variant="outlined" 
                    value={tips} 
                    onChange={(e) => setTips(e.target.value)} 
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" type="submit"  disabled={!isFormComplete()} >
                  {aeropuertoEditando ? 'Actualizar' : 'Cargar'}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Aeropuertos;
