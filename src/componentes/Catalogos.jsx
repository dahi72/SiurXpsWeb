import React from "react";
import { useNavigate } from "react-router-dom";
import { Box,Typography, Paper, Divider, Container } from "@mui/material";
import {
  Hotel,
  TravelExplore,
  Flight,
  AirlineSeatReclineExtra,
} from '@mui/icons-material';

const Catalogos = () => {
  const navigate = useNavigate();

  const options = [
    { 
      label: "Hoteles", 
      path: "hoteles",
      icon: <Hotel sx={{ fontSize: 40 }} />
    },
    { 
      label: "Aeropuertos", 
      path: "aeropuertos",
      icon: <TravelExplore sx={{ fontSize: 40 }} />
    },
    { 
      label: "Vuelos", 
      path: "vuelos",
      icon: <Flight sx={{ fontSize: 40, transform: 'rotate(45deg)' }} />
    },
    { 
      label: "Aerolíneas", 
      path: "aerolineas",
      icon: <AirlineSeatReclineExtra sx={{ fontSize: 40 }} />
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2,
        justifyContent: 'center'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Cargar Catálogos
        </Typography>
      </Box>

      <Paper 
        elevation={3} 
        sx={{ 
          p: 4,
          transition: 'transform 0.3s ease',
          '&:hover': { 
            transform: 'scale(1.01)',
            boxShadow: 6 
          },
          background: 'linear-gradient(to bottom right, #ffffff, #f8f9fa)'
        }}
      >
        <Divider sx={{ mb: 3 }} />

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            },
            gap: 3,
            mt: 2
          }}
        >
          {options.map((option) => (
            <Paper
              key={option.path}
              onClick={() => navigate(`/${option.path}`)}
              elevation={2}
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backgroundColor: 'background.paper',
                borderRadius: 2,
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                  '& .MuiSvgIcon-root': {
                    transform: 'scale(1.1)',
                    color: 'primary.main'
                  },
                  '& .MuiTypography-root': {
                    color: 'primary.main'
                  }
                }
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 2,
                  borderRadius: '50%',
                  backgroundColor: 'primary.light',
                  color: 'primary.main',
                  transition: 'all 0.3s ease',
                  '& .MuiSvgIcon-root': {
                    fontSize: 32,
                    transition: 'all 0.3s ease'
                  }
                }}
              >
                {option.icon}
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'medium',
                  textAlign: 'center',
                  transition: 'color 0.3s ease'
                }}
              >
                {option.label}
              </Typography>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Container>
  );
};

export default Catalogos;
