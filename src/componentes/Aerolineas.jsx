import React, { useEffect, useState } from "react";
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
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';


const Aerolineas = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [aerolineas, setAerolineas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aerolineaEditando, setAerolineaEditando] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Cargar aerolíneas al montar el componente
    const cargarAerolineas = async () => {
      try {
        const response = await fetch(`${baseUrl}/Aerolinea/aerolineas`);
        const data = await response.json();
        // Asegúrate de que data sea un array
        setAerolineas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar las aerolíneas:', error);
      }
    };

    cargarAerolineas();
  }, [baseUrl]);

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/Aerolinea/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Filtrar la aerolínea eliminada del estado
        setAerolineas(aerolineas.filter(aerolinea => aerolinea.id !== id));
      } else {
        console.error('Error al eliminar la aerolínea');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleEditar = (aerolinea) => {
    setAerolineaEditando(aerolinea);
    setNombre(aerolinea.nombre);
    setPaginaWeb(aerolinea.paginaWeb);
    setTabValue(1); // Cambiar a la solapa de carga
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = aerolineaEditando ? `${baseUrl}/Aerolinea/${aerolineaEditando.id}` : `${baseUrl}/Aerolinea/altaAerolinea`;
    const method = aerolineaEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombre, paginaWeb }),
      });

      if (response.ok) {
        const data = await response.json();
        if (aerolineaEditando) {
          setAerolineas(aerolineas.map(a => a.id === data.id ? data : a));
        } else {
          setAerolineas([...aerolineas, data]);
        }
        setNombre('');
        setPaginaWeb('');
        setAerolineaEditando(null);
        setTabValue(0);
      } else {
        console.error('Error al guardar la aerolínea');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const filteredAerolineas = aerolineas.filter(aerolinea =>
    aerolinea.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    

      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          padding: '2rem',
          textAlign: 'center'
        }}
      >
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
          Gestión de Aerolíneas
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
          <Tab label="Buscar Aerolíneas" />
          <Tab label="Cargar Nueva Aerolínea" />
        </Tabs>

        {tabValue === 0 && (
          <Box sx={{ mt: 3 }}>
            {/* Sección de Búsqueda */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} md={8}>
                <TextField 
                  fullWidth 
                  label="Buscar aerolínea" 
                  variant="outlined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    endAdornment: <SearchIcon color="action" />
                  }}
                />
              </Grid>
            </Grid>

            {/* Tabla de Aerolíneas */}
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Página Web</TableCell>
                    <TableCell>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAerolineas.length > 0 ? (
                    filteredAerolineas.map((aerolinea) => (
                      <TableRow key={aerolinea.id}>
                        <TableCell>{aerolinea.nombre}</TableCell>
                        <TableCell>
                          <a href={aerolinea.paginaWeb} target="_blank" rel="noopener noreferrer">
                            {aerolinea.paginaWeb}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Button size="small" color="primary" onClick={() => handleEditar(aerolinea)}>Editar</Button>
                          <Button size="small" color="error" onClick={() => handleEliminar(aerolinea.id)}>Eliminar</Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                        No hay aerolíneas disponibles.
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
                    value={paginaWeb}
                    onChange={(e) => setPaginaWeb(e.target.value)}
                  />
                </Grid>
              </Grid>
              <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                <Button variant="contained" color="primary" type="submit">
                  {aerolineaEditando ? 'Actualizar' : 'Cargar'}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
      <Box>
        <Button variant="outlined" onClick={() => navigate('/catalogos')} sx={{ mb: 2 }}>
            Volver a Catálogos
        </Button>
      </Box>
    </Box>
  );
};

export default Aerolineas;
