import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { Box, Paper, Typography, Container } from '@mui/material';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

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
        <Container
            maxWidth="sm"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                height: "100vh",
                textAlign: "center",
            }}
        >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "error.main", mb: 2 }} />
            <Box
                component="img"
                src="./Imagenes/imagen404.jpg"
                alt="Página no encontrada"
                sx={{ width: "80%", maxWidth: 400, mb: 3 }}
                onError={(e) => (e.target.style.display = "none")}
            />
            <Paper 
                sx={{ 
                    padding: 3, 
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    borderRadius: 2,
                    boxShadow: 3,
                    backgroundColor: "white",
                    width: "100%",
                    maxWidth: 400
                }}
            >
                <Typography variant="h3" gutterBottom>
                    ¡Oops! No encontramos esta página
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    Parece que te perdiste. La página que buscas no está disponible.
                </Typography>
                <Typography variant="body2" sx={{ color: "#003366", mb: 2 }}>
                    Redireccionando a la página anterior en {countdown} segundos...
                </Typography>
                <FaSpinner className="spinner-icon" style={{ fontSize: '24px', color: '#003366' }} />
            </Paper>
        </Container>
    );
};

export default NoEncontrado;





