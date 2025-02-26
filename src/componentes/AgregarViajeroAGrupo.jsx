import React, { useState, useEffect } from "react";
import { Paper, Typography, Button, TextField, Alert, Container, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useLocation } from "react-router-dom";

const AgregarViajeroAGrupo = () => {
  const { state } = useLocation();
  const { grupoId, grupoNombre } = state || {};
  const [grupoSeleccionado, setGrupoSeleccionado] = useState(grupoId || "");
  const [nombreGrupo, setNombreGrupo] = useState(grupoNombre || "");
  const [viajero, setViajero] = useState({ primerNombre: "", primerApellido: "", pasaporte: "", email: "", telefono: "" });
  const [grupos, setGrupos] = useState([]);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const [errorPasaporte, setErrorPasaporte] = useState(null);
  const [isValidPasaporte, setIsValidPasaporte] = useState(false);

  useEffect(() => {
    if (state?.grupoId) {
        setGrupos([{ id: state.grupoId, nombre: state.grupoNombre }]);
        setGrupoSeleccionado(state.grupoId);
        setNombreGrupo(state.grupoNombre);
    } else {
        fetch(`${baseUrl}/GrupoDeViaje/coordinador/${localStorage.getItem("id")}/grupos`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem("token")}`
            }
        })
            .then((response) => {
              if(!response.ok){
                const errorData = response.json(); 
                throw new Error(errorData.message ||  'Error al cargar los grupos');
                }  return response.json();
        })
            .then((data) => {
                setGrupos(Array.isArray(data) ? data : []);
            })
            .catch((error) => {
                console.error('Error:', error);
                setError("Error al cargar los grupos disponibles.");
                setGrupos([]); 
            });
    }
  }, [state, baseUrl]);

  useEffect(() => {
    if (grupoSeleccionado && grupos.length > 0) {
      const grupo = grupos.find(g => g.id === grupoSeleccionado);
      if (grupo) {
        setNombreGrupo(grupo.nombre);
      }
    }
  }, [grupoSeleccionado, grupos]);

  const handlePasaporteChange = (e) => {
    const value = e.target.value;
    const regex = /^[A-Za-z]\d{6}$/; 
  
    if (!regex.test(value)) {
      setErrorPasaporte("⚠ El pasaporte debe comenzar con una letra y contener 6 números.");
      setIsValidPasaporte(false);
    } else {
      setErrorPasaporte(null);
      setIsValidPasaporte(true);
    }
  
    setViajero({ ...viajero, pasaporte: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!grupoSeleccionado) {
      setError("Por favor selecciona un grupo.");
      return;
    }

    fetch(`${baseUrl}/GrupoDeViaje/agregarViajero/${grupoSeleccionado}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(viajero),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.message || "Ocurrió un error al agregar al viajero.");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data.message && data.message.includes("Ya existe un usuario con ese pasaporte")) {
          setSuccess(true);
          setError(null);
          setViajero({ primerNombre: "", primerApellido: "", pasaporte: "", email: "", telefono: "" });
          setErrorPasaporte(null);
          setIsValidPasaporte(false);
          setError("El viajero ya existía y ha sido agregado al grupo.");
        } else {
          setSuccess(true);
          setError(null);
          setViajero({ primerNombre: "", primerApellido: "", pasaporte: "", email: "", telefono: "" });
        }

        // Después de 3 segundos, limpiar el mensaje de éxito o error
        setTimeout(() => {
          setSuccess(false);
          setError(null);
        }, 3000);
      })
      .catch((error) => {
        setError(error.message);
        console.error("Error:", error);
      });
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Agregar Pasajero al Grupo: {nombreGrupo || 'Selecciona un grupo'}
          </Typography>
          <form onSubmit={handleSubmit}>
            {!grupoSeleccionado && (
              <FormControl fullWidth margin="normal" required>
                <InputLabel>Grupo de Viaje</InputLabel>
                <Select
                  value={grupoSeleccionado}
                  onChange={(e) => {
                    const seleccionado = e.target.value;
                    setGrupoSeleccionado(seleccionado);
                    const grupoSelec = grupos.find(g => g.id === seleccionado);
                    if (grupoSelec) {
                      setNombreGrupo(grupoSelec.nombre);
                    }
                  }}
                  label="Grupo de Viaje"
                >
                  {Array.isArray(grupos) && grupos.map((grupo) => (
                    <MenuItem key={grupo.id} value={grupo.id}>
                      {grupo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              fullWidth
              label="Primer Nombre"
              value={viajero.primerNombre}
              onChange={(e) => setViajero({ ...viajero, primerNombre: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Primer Apellido"
              value={viajero.primerApellido}
              onChange={(e) => setViajero({ ...viajero, primerApellido: e.target.value })}
              required
              margin="normal"
            />
            <TextField
              fullWidth
              label="Número de Pasaporte"
              value={viajero.pasaporte}
              onChange={handlePasaporteChange}
              required
              margin="normal"
              helperText={errorPasaporte} // Muestra una advertencia en lugar de error
            />
            <TextField
              fullWidth
              label="Correo Electrónico"
              value={viajero.email}
              onChange={(e) => setViajero({ ...viajero, email: e.target.value })}
              required
              margin="normal"
              type="email"
            />
            <TextField
              fullWidth
              label="Teléfono"
              value={viajero.telefono}
              onChange={(e) => setViajero({ ...viajero, telefono: e.target.value })}
              required
              margin="normal"
              type="tel"
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 }} disabled={!isValidPasaporte}>
              Agregar Pasajero
            </Button>
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>Pasajero agregado correctamente.</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Paper>
      </Container>
    </>
  );
};

export default AgregarViajeroAGrupo;
