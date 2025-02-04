import React, { useState } from 'react';
import { useUsuario } from '../hooks/UsuarioContext';
import { useNavigate } from 'react-router-dom';
import { IconButton, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';

const Logout = () => {
    const { setUsuario } = useUsuario();
    const navigate = useNavigate();
    const [openDialog, setOpenDialog] = useState(false);

    const handleLogout = () => {
       
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('pasaporte');
        localStorage.removeItem('rol');
        localStorage.removeItem('id');
        navigate('/');
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
