import { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import { useParams } from "react-router-dom";

const ListadoUsuariosDeActividadOpcional = () => {
  const { itinerarioId } = useParams();
  const [actividades, setActividades] = useState([]);  // Aseguramos que sea un array
  const [usuarios, setUsuarios] = useState([]); // Inicializamos como un arreglo vacío
  const [selectedActividad, setSelectedActividad] = useState(""); // Estado para la actividad seleccionada
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("success");
  const [grupoDeViajeId, setGrupoDeViajeId] = useState(null); // Para almacenar el ID del grupo de viaje asociado al itinerario
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (itinerarioId) {
      // Obtener el itinerario y su grupo
      fetch(`${baseUrl}/Itinerario/${itinerarioId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setGrupoDeViajeId(data.grupoDeViajeId); // Guardamos el grupo de viaje del itinerario
        })
        .catch(() => mostrarAlerta("Error al obtener itinerario", "error"));
    } else {
      mostrarAlerta("No se ha proporcionado un ID válido", "error");
    }
  }, [baseUrl, itinerarioId]);

  useEffect(() => {
    if (grupoDeViajeId) {
      fetch(`${baseUrl}/Actividad/opcionales/${grupoDeViajeId}`, {  // Cambiamos la URL para obtener actividades del grupo
        method: "GET",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Actividades obtenidas: ", data); // Verifica los datos aquí
          setActividades(Array.isArray(data) ? data : []); // Aseguramos que 'data' sea un array
        })
        .catch(() => mostrarAlerta("Error al obtener actividades", "error"));
    }
  }, [baseUrl, grupoDeViajeId]);

  // Función para obtener usuarios por actividad
  const obtenerUsuarios = (idActividad) => {
    fetch(`${baseUrl}/Usuario/usuariosDeActividad/${idActividad}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setUsuarios(Array.isArray(data) ? data : []);  // Aseguramos que los datos sean un arreglo
      })
      .catch(() => mostrarAlerta("Error al obtener usuarios", "error"));
  };

  // Función para manejar la selección de actividad
  const handleActividadChange = (event) => {
    const idActividad = event.target.value;
    setSelectedActividad(idActividad);  // Guarda el ID de la actividad seleccionada
    if (idActividad) {
      obtenerUsuarios(idActividad);  // Llama a la función para obtener usuarios de esta actividad
    } else {
      setUsuarios([]);  // Limpiar usuarios si no hay actividad seleccionada
    }
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoAlerta(tipo);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "2rem", width: "100%" }}>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={tipoAlerta} variant="filled">
          {mensaje}
        </Alert>
      </Snackbar>

      {/* Título */}
      <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "primary.main", textAlign: "center" }}>
        Actividades Opcionales
      </Typography>

      {/* Select para elegir la actividad */}
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Seleccionar Actividad</InputLabel>
        <Select
          value={selectedActividad}
          onChange={handleActividadChange}
          label="Seleccionar Actividad"
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.7)", // Fondo blanco semi-transparente
            borderRadius: "5px", // Esquinas redondeadas
            "& .MuiSelect-icon": { color: "#1976d2" }, // Color del ícono
            padding: "8px", // Un poco de padding para más espacio
          }}
        >
          <MenuItem value="">Selecciona una actividad</MenuItem>
          {Array.isArray(actividades) && actividades.length > 0 ? (
            actividades.map((actividad) => (
              <MenuItem key={actividad.id} value={actividad.id}>
                {actividad.nombre}  {/* Asegúrate de que 'nombre' es lo que deseas mostrar */}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay actividades disponibles</MenuItem>
          )}
        </Select>
      </FormControl>

      {/* Si hay usuarios, mostramos la tabla */}
      {selectedActividad && (
        <Box sx={{ mt: 3 }}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              textAlign: "center",
              fontWeight: "bold",
              color: "primary.main",
            }}
          >
            Usuarios en {actividades.find((a) => a.id === parseInt(selectedActividad))?.nombre}
          </Typography>

          {usuarios.length === 0 ? (
            <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.7)", padding: "1rem", borderRadius: "8px", boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)", marginBottom: "1rem", textAlign: "center" }}>
              <Typography variant="body1" color="textSecondary">
                No hay usuarios inscritos en esta actividad.
              </Typography>
            </Box>
          ) : (
            <TableContainer component={Paper} sx={{ marginBottom: "1rem", backgroundColor: "rgba(255, 255, 255, 0.7)" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Pasaporte</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios.map((usuario) => (
                    <TableRow key={usuario.id}>
                      <TableCell>{usuario.primerNombre}</TableCell>
                      <TableCell>{usuario.primerApellido}</TableCell>
                      <TableCell>{usuario.pasaporte}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      )}
    </Box>
  );
};

export default ListadoUsuariosDeActividadOpcional;
