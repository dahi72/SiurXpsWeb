import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,  
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Grid
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from "react-router-dom"; 

const Vuelos = () => {
  const navigate = useNavigate(); 
  const [tabValue, setTabValue] = useState(0);
  const [vuelos, setVuelos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [horario, setHorario] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [vueloEditando, setVueloEditando] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    const cargarVuelos = async () => {
      try {

        const response = await fetch(`${baseUrl}/Vuelo/vuelos`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json'
          }
        });
    
        if (!response.ok) throw new Error('Error al obtener los vuelos');
    
        const data = await response.json();
        setVuelos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error al cargar los vuelos:', error);
      }
    };

    cargarVuelos();
  }, [baseUrl, token]);
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nombre || !horario) {
      console.error('Nombre y horario son requeridos');
      return; 
    }

    const url = vueloEditando ? `${baseUrl}/Vuelo/${vueloEditando.id}` : `${baseUrl}/Vuelo/altaVuelo`;
    const method = vueloEditando ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, horario }),
      });

      if (response.ok) {
        const data = await response.json();
        if (vueloEditando) {
          setVuelos(vuelos.map(v => v.id === data.id ? data : v));
        } else {
          setVuelos([...vuelos, data]);
        }
        setNombre('');
        setHorario('');
        setVueloEditando(null);
        setTabValue(0);
      } else {
        const errorData = await response.json(); 
        console.error('Error al guardar el vuelo:', errorData);
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/Vuelo/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setVuelos(vuelos.filter(vuelo => vuelo.id !== id));
      } else {
        console.error('Error al eliminar el vuelo');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };
  const handleHorarioChange = (e) => {
    let time = e.target.value;
   
    if (/^([0-1]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time)) {
      time = `${time}:00`; 
    }
    setHorario(time); 
  };

  const handleEditar = (vuelo) => {
    setVueloEditando(vuelo);
    setNombre(vuelo.nombre);
    setTabValue(1); 
  };


  const filteredVuelos =(vuelos || []).filter(vuelo =>
    vuelo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>

      <Typography variant="h4">Gestión de Vuelos</Typography>

      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Buscar Vuelos" />
        <Tab label="Cargar Nuevo Vuelo" />
      </Tabs>

      {tabValue === 0 && (
        <Box sx={{ mt: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
          <TextField 
            label="Buscar vuelo" 
            variant="outlined" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            InputProps={{ endAdornment: <SearchIcon /> }} 
          />
          <TableContainer component={Paper}>
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
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                      No hay vuelos disponibles.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      )}

      {tabValue === 1 && (
        <Box sx={{ mt: 3, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: '10px', padding: '2rem', textAlign: 'center' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField 
                  fullWidth 
                  label="Nombre" 
                  variant="outlined" 
                  value={nombre} 
                  onChange={(e) => setNombre(e.target.value)} 
                  sx={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Horario Check-in"
                      value={horario} 
                      onChange={handleHorarioChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      inputProps={{
                        pattern: "([0-1]?[0-9]|2[0-3]):([0-5]?[0-9]):([0-5]?[0-9])", 
                      }}
                    />
                  </Grid>
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <Button variant="contained" color="primary" type="submit">
                {vueloEditando ? 'Actualizar' : 'Cargar'}
              </Button>
            </Box>
          </form>
        </Box>
      )}
       <Box>
          <Button variant="outlined"   backgroundColor="rgb(227, 242, 253)"
          color= "#1976d2" onClick={() => navigate('/catalogos')} sx={{ mb: 2 }}>
            Volver a Catálogos
          </Button>
        </Box>
    </Box>
  );
};

export default Vuelos;
