import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { Box, Paper, Typography } from '@mui/material';

const NoEncontrado = () => {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (countdown > 0) {
                setCountdown(countdown - 1);
            } else {
                navigate(-1); 
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [countdown, navigate]);

    return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                   // bgcolor: '#f5f5f5', // Color de fondo suave
            }}>
                <Paper sx={{ 
                    padding: 3, 
                    width: '100%', 
                    maxWidth: 400, // Tamaño máximo para mantenerlo centrado
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center', 
                    gap: 2,
                    backgroundColor: 'white',
                    borderRadius: 2,
                    boxShadow: 3,
                    height:'50vh',
                }}>
                    <Typography variant="h5" sx={{ color: '#003366', mb: 2 , mt:15}}>
                        Página no encontrada
                    </Typography>
                    <Typography sx={{ color: '#003366', mb: 2 }}>
                        Redireccionando a la página anterior en {countdown} segundos...
                    </Typography>
                    <FaSpinner className="spinner-icon" style={{ fontSize: '24px', color: '#003366' }} />
                </Paper>
            </Box>
    );
};

export default NoEncontrado;
