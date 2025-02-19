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
  Tab,
  Snackbar,  
  Alert      
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

const Aerolineas = () => {

  const [tabValue, setTabValue] = useState(0);
  const [aerolineas, setAerolineas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [aerolineaEditando, setAerolineaEditando] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const [tipoAlerta, setTipoAlerta] = useState('success'); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const isFormComplete = () => {
    return (
      nombre &&
      paginaWeb
    );
  };

  const mostrarMensaje = (texto, tipo = 'success') => {
    setMensaje(texto);
    setTipoAlerta(tipo);
    setOpenSnackbar(true);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const cargarAerolineas = async () => {
      try {
        const response = await fetch(`${baseUrl}/Aerolinea/aerolineas`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          const errorData = await response.json(); 
          throw new Error(errorData.mensaje || 'Error al obtener las aerolíneas');
        }

        const data = await response.json();
        setAerolineas(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar las aerolíneas:', error);
        mostrarMensaje(error.message, 'error');
      }
    };

    cargarAerolineas();
  }, [baseUrl, token]);

  const handleEliminar = async (id) => {
    const confirmacion = window.confirm("¿Está seguro de que desea eliminar esta aerolínea?");
    if (confirmacion) {
    try {
      const response = await fetch(`${baseUrl}/Aerolinea/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();  
        throw new Error(errorData.message || 'Error al eliminar la aerolínea');
      }

      setAerolineas(aerolineas.filter(aerolinea => aerolinea.id !== id));
      mostrarMensaje('Aerolinea eliminada correctamente', 'success');
    } catch (error) {
      console.error('Error al eliminar la aerolínea:', error);
      mostrarMensaje(error.message || 'Hubo un error al eliminar la aerolínea', 'error');
    }
  }
  };

  const handleEditar = (aerolinea) => {
    setAerolineaEditando(aerolinea);
    setNombre(aerolinea.nombre);
    setPaginaWeb(aerolinea.paginaWeb);
    setTabValue(1); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = aerolineaEditando ? `${baseUrl}/Aerolinea/${aerolineaEditando.id}` : `${baseUrl}/Aerolinea/altaAerolinea`;
    const method = aerolineaEditando ? 'PUT' : 'POST';
  
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer  ${token}`, 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, paginaWeb }),
      });
  
      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Error al guardar la aerolínea');
      }
  
      // Si la respuesta no tiene contenido (por ejemplo, NoContent en PUT), no intentamos leer JSON
      if (response.status === 204) {
        mostrarMensaje(aerolineaEditando ? 'Aerolinea actualizada correctamente' : 'Aerolinea agregada correctamente', 'success');
      } else {
        // Si hay contenido en la respuesta, lo procesamos como JSON
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
        mostrarMensaje(aerolineaEditando ? 'Aerolinea actualizada correctamente' : 'Aerolinea agregada correctamente', 'success');
      }
    } catch (error) {
      console.error('Error al guardar la aerolínea:', error);
      mostrarMensaje(error.message || 'Hubo un error al guardar la aerolínea', 'error');
    }
  };
  

  const filteredAerolineas = (aerolineas || []).filter(aerolinea =>
    aerolinea.nombre && aerolinea.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '2rem',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          borderRadius: '10px',
          flexGrow: 1,
          padding: { xs: '1rem', sm: '2rem' },
          textAlign: 'center',
        }}
      >
        <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
          <Alert onClose={handleCloseSnackbar} severity={tipoAlerta} variant="filled">
            {mensaje}
          </Alert>
        </Snackbar>

        <Typography
          variant="h4"
          sx={{
            mb: 2,
            fontWeight: 'bold',
            color: 'primary.main',
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.5rem' },
          }}
        >
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
            <Grid container spacing={2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={8}>
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

            <Box sx={{ overflowX: 'auto' }}>
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table sx={{ minWidth: 650 }}>
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
                    variant="outlined" 
                    value={paginaWeb}
                    onChange={(e) => setPaginaWeb(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary" 
                  disabled={!isFormComplete()}
                >
                  {aerolineaEditando ? 'Actualizar Aerolínea' : 'Agregar Aerolínea'}
                </Button>
              </Box>
            </form>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Aerolineas;
