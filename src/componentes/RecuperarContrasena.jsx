import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const RecuperarContrasena = () => {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');
  const baseUrl = process.env.REACT_APP_API_URL;

  const handleSubmit = (e) => {
    e.preventDefault();
  
    if (!email) {
      setError('Por favor, ingresa tu correo electrónico.');
      return;
    }
  
    fetch(`${baseUrl}/Usuario/RecuperarContrasena?email=${encodeURIComponent(email)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensaje) {
          setMensaje(data.mensaje);
          setError('');
          setTimeout(() => {
            setMensaje('');
          }, 3000);
        } else {
          setError(data.mensaje || 'Error al enviar el enlace de recuperación.');
          setMensaje('');
          setTimeout(() => {
            setMensaje('');
          }, 3000);
        }
      })
      .catch(() => {
        setError('Ocurrió un error al enviar la solicitud.');
        setMensaje('');
        setTimeout(() => {
          setMensaje('');
        }, 3000);
      });
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', padding: 2 }}>
      <Paper sx={{ padding: 3, width: '100%', maxWidth: 400 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Recuperar Contraseña
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Correo Electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
          />
          {mensaje && <Typography color="success">{mensaje}</Typography>}
          {error && <Typography color="error">{error}</Typography>}
          <Button fullWidth variant="contained" type="submit" sx={{ mt: 2 }}>
            Enviar
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button variant="outlined" component={Link} to="/">
            Volver al Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default RecuperarContrasena;