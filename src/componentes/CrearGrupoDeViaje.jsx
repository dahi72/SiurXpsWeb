import React, { useState, useContext, useEffect } from 'react';
import { PaisContext } from "../hooks/PaisContext"; 
import { CiudadContext } from "../hooks/CiudadContext";
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Alert, 
  List, 
  ListItem, 
  ListItemText, 
  IconButton, 
  Container 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const CrearGrupoDeViaje = () => {
  const { paises } = useContext(PaisContext); 
  const { ciudades, setPaisSeleccionadoContext } = useContext(CiudadContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [nombre, setNombre] = useState('');
  const [paisSeleccionado, setPaisSeleccionado] = useState(null); 
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const [paisesSeleccionados, setPaisesSeleccionados] = useState([]);
  const [ciudadesSeleccionadas, setCiudadesSeleccionadas] = useState([]);
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();

  const baseUrl = process.env.REACT_APP_API_URL;

 
  useEffect(() => {
    if (paisSeleccionado) {
      setPaisSeleccionadoContext(paisSeleccionado);
    }
  }, [paisSeleccionado, setPaisSeleccionadoContext]);

  const handleAddPais = () => {
    if (paisSeleccionado && !paisesSeleccionados.find(p => p.id === paisSeleccionado.id)) {
      // Aseguramos que el código ISO se guarde en el mismo formato que se usa en la base de datos
      const paisConCodigoIsoNormalizado = {
        ...paisSeleccionado,
        codigoIso: paisSeleccionado.codigoIso.trim().toUpperCase(), // Normalizamos el código ISO
      };
      setPaisesSeleccionados([...paisesSeleccionados, paisConCodigoIsoNormalizado]);
      setPaisSeleccionado(null);
    }
  };

  const handleAddCiudad = () => {
    if (ciudadSeleccionada && !ciudadesSeleccionadas.find(c => c.id === ciudadSeleccionada.id)) {
      // Verificamos que el país de la ciudad esté en la lista de países seleccionados
      const paisDeLaCiudad = paisesSeleccionados.find(
        p => p.codigoIso.trim().toUpperCase() === ciudadSeleccionada.paisCodigoIso.trim().toUpperCase()
      );
  
      if (!paisDeLaCiudad) {
        setError(`Primero debe seleccionar el país al que pertenece la ciudad ${ciudadSeleccionada.nombre}`);
        return;
      }
  
      // Normalizamos el código ISO de la ciudad
      const ciudadNormalizada = {
        ...ciudadSeleccionada,
        paisCodigoIso: ciudadSeleccionada.paisCodigoIso.trim().toUpperCase()
      };
      
      setCiudadesSeleccionadas([...ciudadesSeleccionadas, ciudadNormalizada]);
      setCiudadSeleccionada(null);
      setError(null);
    }
  };

  const handleRemovePais = (id) => {
    setPaisesSeleccionados(paisesSeleccionados.filter(p => p.id !== id));
  };

  const handleRemoveCiudad = (id) => {
    setCiudadesSeleccionadas(ciudadesSeleccionadas.filter(c => c.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const grupoDeViaje = {
      nombre,
      paisesDestinoIds: paisesSeleccionados.map(p => p.id),
      ciudadesDestinoIds: ciudadesSeleccionadas.map(c => c.id),
      fechaInicio,
      fechaFin,
      coordinadorId: localStorage.getItem("id")
    };

    fetch(`${baseUrl}/GrupoDeViaje/altaGrupo`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, 
      },
      body: JSON.stringify(grupoDeViaje),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.codigo === 200) {
          setSuccess(true);
          setError(null);
          setTimeout(() => {
            navigate("/dashboard");
          }, 2000);
        } else {
          setError(data.message);
        }
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
      <Container maxWidth="md" sx={{ mt: 2, p: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Paper sx={{ padding: 3 }}>
            <Typography variant="h5" gutterBottom>Crear Grupo de Viaje</Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Nombre del Grupo"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                margin="normal"
              />

              {/* Selección de País */}
              <FormControl fullWidth margin="normal">
                <InputLabel>País</InputLabel>
                <Select
                  value={paisSeleccionado ? paisSeleccionado.id : ''}
                  onChange={(e) => {
                    const selectedPais = paises.find(p => p.id === e.target.value);
                    setPaisSeleccionado(selectedPais);
                  }}
                >
                  {paises.map(pais => (
                    <MenuItem key={pais.id} value={pais.id}>{pais.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleAddPais} variant="outlined">Agregar País</Button>
              <List>
                {paisesSeleccionados.map(pais => (
                  <ListItem key={pais.id}>
                    <ListItemText primary={pais.nombre} />
                    <IconButton onClick={() => handleRemovePais(pais.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              {/* Selección de Ciudad */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Ciudad</InputLabel>
                <Select
                  value={ciudadSeleccionada ? ciudadSeleccionada.id : ''}
                  onChange={(e) => {
                    const selectedCiudad = ciudades.find(c => c.id === e.target.value);
                    setCiudadSeleccionada(selectedCiudad);
                  }}
                >
                  {ciudades.map(ciudad => (
                    <MenuItem key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button onClick={handleAddCiudad} variant="outlined">Agregar Ciudad</Button>
              <List>
                {ciudadesSeleccionadas.map(ciudad => (
                  <ListItem key={ciudad.id}>
                    <ListItemText primary={ciudad.nombre} />
                    <IconButton onClick={() => handleRemoveCiudad(ciudad.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>

              <TextField
                fullWidth
                label="Fecha de Inicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Fecha de Fin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />

              <Button
                fullWidth
                variant="contained"
                sx={{ mt: 2 }}
                type="submit"
              >
                Crear Grupo
              </Button>
            </form>
          </Paper>
          {success && <Alert severity="success">¡Grupo creado con éxito!</Alert>}
          {error && <Alert severity="error">{error}</Alert>}
        </Box>
      </Container>
  );
};

export default CrearGrupoDeViaje;