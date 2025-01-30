import React, { useState } from "react";
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
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Traslados = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

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
        <Button
          onClick={() => navigate('/catalogos')} 
          startIcon={<ArrowBackIcon />}
          sx={{
            alignSelf: 'flex-start',
            color: 'primary.main',
            backgroundColor: '#E3F2FD',
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#BBDEFB',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }
          }}
        >
          Volver
        </Button>

        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            padding: '2rem',
            textAlign: 'center'
          }}
        >
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold', color: 'primary.main' }}>
            Gestión de Traslados
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
            <Tab label="Buscar Traslados" />
            <Tab label="Cargar Nuevo Traslado" />
          </Tabs>

          {tabValue === 0 && (
            <Box sx={{ mt: 3 }}>
              {/* Sección de Búsqueda */}
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} md={8}>
                  <TextField 
                    fullWidth 
                    label="Buscar traslado" 
                    variant="outlined"
                    InputProps={{
                      endAdornment: <SearchIcon color="action" />
                    }}
                  />
                </Grid>
              </Grid>

              {/* Tabla de Traslados */}
              <TableContainer component={Paper} sx={{ mb: 3 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Opción</TableCell>
                      <TableCell>Horario</TableCell>
                      <TableCell>País</TableCell>
                      <TableCell>Ciudad</TableCell>
                      <TableCell>Acciones</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* Ejemplo de fila */}
                    <TableRow>
                      <TableCell>Traslado VIP</TableCell>
                      <TableCell>09:00 AM</TableCell>
                      <TableCell>Argentina</TableCell>
                      <TableCell>Buenos Aires</TableCell>
                      <TableCell>
                        <Button size="small" color="primary">Editar</Button>
                        <Button size="small" color="error">Eliminar</Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              {/* Formulario de Carga */}
              <form>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="select-opcion-label">Opción</InputLabel>
                      <Select
                        labelId="select-opcion-label"
                        id="select-opcion"
                        label="Opción"
                        defaultValue=""
                      >
                        <MenuItem value="VIP">Traslado VIP</MenuItem>
                        <MenuItem value="Económico">Traslado Económico</MenuItem>
                        <MenuItem value="Familiar">Traslado Familiar</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Horario" type="time" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="País" variant="outlined" />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Ciudad" variant="outlined" />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
                  <Button variant="outlined" color="secondary" onClick={() => navigate("/")}>
                    Volver
                  </Button>
                  <Button variant="contained" color="primary" type="submit">
                    Cargar
                  </Button>
                </Box>
              </form>
            </Box>
          )}
        </Box>
      </Box>
  );
};

export default Traslados;
