import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Hotel,
  TravelExplore,
  Flight,
  AirlineSeatReclineExtra,
  
} from '@mui/icons-material';

const Catalogos = () => {
  const navigate = useNavigate();
  const handleBackClick = () => {
    navigate('/dashboard');
  };
  
  const options = [
    { 
      label: "Hoteles", 
      path: "hoteles",
      icon: <Hotel sx={{ fontSize: 40, mb: 1 }} />
    },
    { 
      label: "Aeropuertos", 
      path: "aeropuertos",
      icon: <TravelExplore sx={{ fontSize: 40, mb: 1 }} />
    },
    { 
      label: "Vuelos", 
      path: "vuelos",
      icon: <Flight sx={{ 
        fontSize: 40, 
        mb: 1,
        transform: 'rotate(45deg)'
      }} />
    },
    { 
      label: "Aerolíneas", 
      path: "aerolineas",
      icon: <AirlineSeatReclineExtra sx={{ fontSize: 40, mb: 1 }} />
    }
  ];

  return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          backgroundImage: 'url(/Fondo.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '2rem',
          minHeight: '100%'
        }}
      >
        <Button
          onClick={handleBackClick} 
          startIcon={<ArrowBackIcon />}
          sx={{
            alignSelf: 'flex-start',
            color: 'primary.main',
            backgroundColor: '#E3F2FD',
            mb: 2,
            px: 3,
            py: 1,
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            fontWeight: 'bold',
            textTransform: 'none',  // Evita que el texto esté en mayúsculas
            '&:hover': {
              backgroundColor: '#BBDEFB',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            }
          }}
        >
          Volver
        </Button>

        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '10px',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              fontWeight: 'bold',
              color: 'primary.main',
              textAlign: 'center',
              mb: 3
            }}
          >
            Cargar Catálogos
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(3, 1fr)' },
              gap: 2,
              width: '100%'
            }}
          >
            {options.map((option) => (
              <Button
                key={option.path}
                variant="contained"
                onClick={() => navigate(`/${option.path}`)}
                sx={{
                  padding: 2,
                  backgroundColor: '#E3F2FD',
                  color: 'primary.main',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  '&:hover': { 
                    backgroundColor: '#BBDEFB',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                {option.icon}
                {option.label}
              </Button>
            ))}
          </Box>
        </Box>
      </Box>
  );
};

export default Catalogos;
