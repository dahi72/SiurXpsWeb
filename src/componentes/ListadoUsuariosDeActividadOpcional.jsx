import { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";


const ListadoUsuariosDeActividadOpcional = () => {
  const [actividades, setActividades] = useState([]);
  const [usuarios, setUsuarios] = useState({});
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("success");
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${baseUrl}/Actividad/opcionales`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => setActividades(data))
      .catch(() => mostrarAlerta("Error al obtener actividades", "error"));
  }, [baseUrl]);

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
        setUsuarios((prevUsuarios) => ({ ...prevUsuarios, [idActividad]: data }));
      })
      .catch(() => mostrarAlerta("Error al obtener usuarios", "error"));
  };

  const mostrarAlerta = (mensaje, tipo) => {
    setMensaje(mensaje);
    setTipoAlerta(tipo);
    setOpenSnackbar(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", padding: "2rem" }}>
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={() => setOpenSnackbar(false)} severity={tipoAlerta} variant="filled">
          {mensaje}
        </Alert>
      </Snackbar>

      <Box sx={{ backgroundColor: "rgba(255, 255, 255, 0.9)", borderRadius: "10px", padding: "2rem", textAlign: "center" }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold", color: "primary.main" }}>
          Actividades Opcionales
        </Typography>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nombre de la Actividad</TableCell>
                <TableCell>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {actividades.length > 0 ? (
                actividades.map((actividad) => (
                  <TableRow key={actividad.id}>
                    <TableCell>{actividad.nombre}</TableCell>
                    <TableCell>
                      <Button variant="contained" onClick={() => obtenerUsuarios(actividad.id)}>
                        Ver Usuarios
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No hay actividades opcionales.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {Object.keys(usuarios).map((idActividad) => (
          <Box key={idActividad} sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Usuarios en {actividades.find((a) => a.id === parseInt(idActividad))?.nombre}
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Nombre</TableCell>
                    <TableCell>Apellido</TableCell>
                    <TableCell>Pasaporte</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {usuarios[idActividad]?.length > 0 ? (
                    usuarios[idActividad].map((usuario) => (
                      <TableRow key={usuario.id}>
                        <TableCell>{usuario.primerNombre}</TableCell>
                        <TableCell>{usuario.primerApellido}</TableCell>
                        <TableCell>{usuario.pasaporte}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} align="center">
                        No hay usuarios registrados en esta actividad.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ListadoUsuariosDeActividadOpcional;
