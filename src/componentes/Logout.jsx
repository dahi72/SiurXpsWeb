import React, { useState } from 'react';
import { useUsuario } from '../hooks/UsuarioContext';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';

const Logout = ({ onLogout }) => {
  const { setUsuario } = useUsuario();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const baseUrl = process.env.REACT_APP_API_URL;

  const handleLogout = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.warn("No hay token en el localStorage.");
      finalizarLogout();
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/Usuario/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        console.log("Token enviado al backend para ser revocado.");
      } else {
        console.error("Error al revocar el token:", await response.json());
      }
    } catch (error) {
      console.error("Error en la solicitud de logout:", error);
    }

    finalizarLogout();
  };

  const finalizarLogout = () => {
    // Limpiar el estado del usuario
    setUsuario(null);

    // Limpiar el localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('pasaporte');
    localStorage.removeItem('rol');
    localStorage.removeItem('id');


    navigate('/');

  
    setOpenDialog(false);

   
    if (onLogout) onLogout();
  };

  return (
    <>
      {/* Tooltip para mostrar "Cerrar sesión" al pasar el mouse */}
      <Tooltip title="Cerrar sesión">
        <IconButton onClick={() => setOpenDialog(true)}>
          <ExitToApp style={{ color: 'white' }} />
        </IconButton>
      </Tooltip>

      {/* Diálogo de confirmación */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirmar cierre de sesión</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Está seguro que desea cerrar sesión?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="error" autoFocus>
            Cerrar sesión
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Logout;
