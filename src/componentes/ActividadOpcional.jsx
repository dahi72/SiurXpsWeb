import { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert, CircularProgress, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useParams } from "react-router-dom";

function ActividadOpcional() {
  const { grupoId, viajeroId } = useParams(); 
  const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchActividades = async () => {
      try {
        if (!token) {
          throw new Error('No hay sesión activa.');
        }

        const response = await fetch(`${baseUrl}/Actividad/actividadesDelGrupo/${grupoId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las actividades del grupo.');
        }

        const data = await response.json();
        setActividadesOpcionales(data);
      } catch (err) {
        setError(err.message);
        setSuccess(false);
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchActividades();
  }, [grupoId, baseUrl, token]);

  const handleInscribir = async () => {
    if (!selectedActividad) {
      setError("Debe seleccionar una actividad.");
      setSuccess(false);
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!token) throw new Error("No hay sesión activa.");

      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad),
        }),
      });

      if (!response.ok) {
        throw new Error('El usuario ya está inscrito en esta actividad.');
      }

      setSuccessMessage("Inscripción realizada con éxito.");
      setSuccess(true);
      setSelectedActividad("");
    } catch (err) {
      setError(err.message || "Error al inscribir al usuario en la actividad.");
      setSuccess(false);
    } finally {
      setOpenSnackbar(true);
    }
  };

  const handleDesinscribir = async () => {
    if (!selectedActividad) {
      setError("Debe seleccionar una actividad.");
      setSuccess(false);
      setOpenSnackbar(true);
      return;
    }

    try {
      if (!token) throw new Error("No hay sesión activa.");

      const response = await fetch(`${baseUrl}/Actividad/desinscribirUsuario`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuarioId: parseInt(viajeroId),
          actividadId: parseInt(selectedActividad),
        }),
      });

      if (!response.ok) {
        throw new Error("El usuario no está inscrito en esta actividad.");
      }

      setSuccessMessage("Usuario desinscrito correctamente.");
      setSuccess(true);
      setSelectedActividad("");
    } catch (err) {
      setError(err.message || "Error al desinscribir al usuario de la actividad.");
      setSuccess(false);
    } finally {
      setOpenSnackbar(true);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "background.default" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ padding: "2rem", backgroundColor: "background.default" }}>
      <Typography variant="h4" align="center" gutterBottom>
        Gestión de Actividades Opcionales para el Grupo
      </Typography>

      <Box sx={{ backgroundColor: "white", borderRadius: "10px", padding: "2rem", boxShadow: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Seleccionar Actividad</InputLabel>
          <Select
            value={selectedActividad}
            onChange={(e) => setSelectedActividad(e.target.value)}
            label="Seleccionar Actividad"
            fullWidth
          >
            <MenuItem value="">Seleccione una actividad</MenuItem>
            {actividadesOpcionales.map((actividad) => (
              <MenuItem key={actividad.id} value={actividad.id}>
                {actividad.nombre}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button variant="contained" color="primary" fullWidth onClick={handleInscribir} disabled={!selectedActividad}>
            Inscribir
          </Button>
          <Button variant="contained" color="error" fullWidth onClick={handleDesinscribir} disabled={!selectedActividad}>
            Desinscribir
          </Button>
        </Box>
      </Box>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={success ? "success" : "error"} variant="filled" onClose={() => setOpenSnackbar(false)}>
          {success ? successMessage : error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ActividadOpcional;
