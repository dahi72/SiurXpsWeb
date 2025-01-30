import React, { useState, useEffect } from "react";
import { 
  Box, 
  Button, 
  TextField, 
  Typography,  
  Grid
} from "@mui/material";

const Hoteles = () => {
  const [nombre, setNombre] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [paginaWeb, setPaginaWeb] = useState('');
  const [direccion, setDireccion] = useState('');
  const [paises, setPaises] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [ciudadId, setCiudadId] = useState('');

  const baseUrl = process.env.REACT_APP_API_URL;

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

  const handleCiudadChange = async (e) => {
    const selectedPais = JSON.parse(e.target.value);
    setPaisId(selectedPais.id);
    setCiudades([]); // Reiniciar ciudades al cambiar de país

    try {
      const response = await fetch(`${baseUrl}/Ciudad/${selectedPais.codigoIso}/ciudades`);
      const data = await response.json();
      setCiudades(data);
    } catch (error) {
      console.error('Error al cargar las ciudades:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevoHotel = {
      nombre,
      checkIn,
      checkOut,
      paginaWeb,
      direccion,
      paisId,
      ciudadId
    };

    try {
      const response = await fetch(`${baseUrl}/Hotel/altaHotel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoHotel),
      });

      if (response.ok) {
        console.log('Hotel agregado exitosamente');
        // Reiniciar el formulario
        setNombre('');
        setCheckIn('');
        setCheckOut('');
        setPaginaWeb('');
        setDireccion('');
        setPaisId('');
        setCiudadId('');
      } else {
        console.error('Error al agregar el hotel');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Agregar Nuevo Hotel</Typography>
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
              value={paisId}
              onChange={handleCiudadChange}
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
              onChange={(e) => setCiudadId(e.target.value)}
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
            Agregar Hotel
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default Hoteles;
