import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, IconButton, Alert, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UsuarioContext } from '../hooks/UsuarioContext';

const CambioContrasena = () => {
  const { usuario } = useContext(UsuarioContext);
  const [contrasenaActual, setContrasenaActual] = useState('');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;

  const manejarCambioContrasena = (e) => {
    e.preventDefault();
    setMensaje('');

    if (nuevaPassword !== confirmPassword) {
      setMensaje('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    const token = localStorage.getItem('token');
    fetch(`${baseUrl}/Usuario/cambiarContrasenia`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        pasaporte: usuario.pasaporte,
        contrasenaActual,
        nuevaPassword,
        confirmPassword,
      }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message || 'Error desconocido al cambiar la contraseña.');
          });
        }
        return response.json();
      })
      .then(() => {
        setSuccess(true);
        setMensaje('Contraseña actualizada exitosamente.');
  
        setTimeout(() => {
          setSuccess(false);
          navigate('/dashboard');
        }, 2000);
      })
      .catch((error) => {
        setError(error.message);
  
        setTimeout(() => {
          setError(null);
        }, 3000);
      });
  };

  const handleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };

  return (
    <>
      <Box 
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '16px',
          height: '100vh',
        }}
      >
        <Box 
          sx={{
            width: '100%',
            maxWidth: 400,
            padding: '32px',
            bgcolor: 'white',
            borderRadius: 2,
            boxShadow: 3,
          }}
        >
          <Typography variant="h5" align="center" sx={{ mb: 3 }}>
            Cambiar Contraseña
          </Typography>
          <form onSubmit={manejarCambioContrasena}>
            <TextField
              label="Pasaporte"
              variant="outlined"
              fullWidth
              value={usuario.pasaporte}
              disabled
              sx={{ mb: 2 }}
            />
            <TextField
              label="Contraseña Actual"
              type={mostrarContrasena ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={contrasenaActual}
              onChange={(e) => setContrasenaActual(e.target.value)}
              sx={{ mb: 2 }}
              required
            />
            <TextField
              label="Nueva Contraseña"
              type={mostrarContrasena ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              sx={{ mb: 2 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleMostrarContrasena}>
                      {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Confirmar Contraseña"
              type={mostrarContrasena ? 'text' : 'password'}
              variant="outlined"
              fullWidth
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              sx={{ mb: 3 }}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleMostrarContrasena}>
                      {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth 
              type="submit"
              sx={{ mb: 2 }}
            >
              Cambiar Contraseña
            </Button>
            {mensaje && (
              <Typography variant="body2" color={mensaje.includes('exitosamente') ? 'green' : 'red'} align="center" sx={{ mt: 2 }}>
                {mensaje}
              </Typography>
            )}
          </form>
          {success && <Alert severity="success" sx={{ mt: 2 }}>Se actualizó la contraseña</Alert>}
          {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
        </Box>
      </Box>
    </>
  );
};

export default CambioContrasena;
