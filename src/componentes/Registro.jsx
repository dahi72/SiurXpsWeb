import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Container, Paper } from "@mui/material";


const Registro = () => {
  const [userData, setUserData] = useState({
    primerNombre: "",
    primerApellido: "",
    pasaporte: "",
    rol: "Coordinador",
  });
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const baseUrl = process.env.REACT_APP_API_URL;
  
  const cambio = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const registrar = (e) => {
    e.preventDefault();

   if (!userData.primerNombre || !userData.primerApellido || !userData.pasaporte || !userData.email || !userData.telefono) {
      setMensaje("Todos los campos son obligatorios");
      setTimeout(() => {
        setMensaje("");
      }, 5000);
      return;
    }

    fetch(`${baseUrl}/Usuario/altaUsuario`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            throw new Error(text);
          });
        } else {
          setMensaje('Usuario creado exitosamente.');
        }
      })
      .catch((error) => {
        setMensaje(error.message);
        console.error("Error:", error);
      });
  };

  return (
    <Container maxWidth="sm">
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => navigate("/dashboard")}
          sx={{ margin: 2 }}
          >
              Volver al Dashboard
        </Button>
        <Box
        sx={{
            height: '100vh', 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
            padding: 2,
          }}
        >
          <Paper sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Typography variant="h5" gutterBottom>Registro de Usuario</Typography>
            </Box>

            <form onSubmit={registrar}>
              <TextField
                label="Primer Nombre"
                variant="outlined"
                fullWidth
                name="primerNombre"
                value={userData.primerNombre}
                onChange={cambio}
                required
                margin="normal"
              />
              <TextField
                label="Primer Apellido"
                variant="outlined"
                fullWidth
                name="primerApellido"
                value={userData.primerApellido}
                onChange={cambio}
                required
                margin="normal"
              />
              <TextField
                label="Pasaporte"
                variant="outlined"
                fullWidth
                name="pasaporte"
                value={userData.pasaporte}
                onChange={cambio}
                required
                margin="normal"
              />
               <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              name="email"
              value={userData.email}
              onChange={cambio}
              required
              margin="normal"
            />
            <TextField
              label="Teléfono"
              type="tel"
              variant="outlined"
              fullWidth
              name="telefono"
              value={userData.telefono}
              onChange={cambio}
              required
              margin="normal"
            />
              <TextField
                label="Rol"
                variant="outlined"
                fullWidth
                name="rol"
                value="Coordinador"
                disabled
                margin="normal"
              />

              {mensaje && (
                <Typography color={mensaje.includes('exitosamente') ? "success" : "error"} sx={{ mt: 2 }}>
                  {mensaje}
                </Typography>
              )}

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2 }}
              >
                Registrar
              </Button>
            </form>
        </Paper>
        </Box>
      </Container>
  );
};

export default Registro;
