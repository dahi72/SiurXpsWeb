import React from 'react';
import { useUsuario } from '../hooks/UsuarioContext';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@mui/material';
import ExitToApp from '@mui/icons-material/ExitToApp';

const Logout = () => {
    const { setUsuario } = useUsuario();
    const navigate = useNavigate();

    const handleLogout = () => {
       
        setUsuario(null);
        localStorage.removeItem('token');
        localStorage.removeItem('pasaporte');
        localStorage.removeItem('rol');
        localStorage.removeItem('id');
        navigate('/');
    };

    return (
        <IconButton onClick={handleLogout}>
            <ExitToApp style={{color: 'white'}}/>
        </IconButton>
    );
};

export default Logout;
