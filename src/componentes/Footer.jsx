import React from 'react';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { useScreenSize } from '../hooks/useScreenSize';
import xperiencias from '../Imagenes/xperiencias.png';
import siurBlanco from '../Imagenes/SiurBlanco.png';

export const Footer = () => {
  const { isDownMd } = useScreenSize(); 

  return (
    <Box
    component="footer"
    sx={{
      flexDirection: 'column',
      bottom: 0,          
      width: '100%',
      bgcolor: 'rgba(25, 118, 210, 0.8)', 
      py: 1,
      zIndex: 1200,
      marginTop: 'auto', 
    }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: isDownMd ? 'column' : 'row', 
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 32px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: isDownMd ? 'center' : 'flex-start', marginLeft: isDownMd ? 0 : 20 }}>
          <Box sx={{ marginBottom: 2 }}>
            <img
              src={siurBlanco}
              alt="Siur Experiencias"
              style={{ width: isDownMd ? '100px' : '150px'}}
            />
          </Box>
          <Typography variant="body2" sx={{ color: 'white', textAlign: isDownMd ? 'center' : 'left' }}>
            Montevideo, Uruguay
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', textAlign: isDownMd ? 'center' : 'left' }}>
            Código Postal: 11200
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', textAlign: isDownMd ? 'center' : 'left' }}>
            Tel: 097381870
          </Typography>
          <Typography variant="body2" sx={{ color: 'white', textAlign: isDownMd ? 'center' : 'left' }}>
            Email: siurxps@gmail.com
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box sx={{ marginBottom: 2 }}>
            <img
              src={xperiencias}
              alt="Siur Experiencias"
              style={{ width: isDownMd ? '100px' : '150px'}}
            />
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Link
              to="/politicaDePrivacidad"
              className="footer-link"
              style={{
                textDecoration: 'none',
                color: 'white',
         marginRight: isDownMd ? '20px' : '40px',
               
              }}
            >
              Políticas de Privacidad
            </Link>
            <Link
              to="/terminos"
              className="footer-link"
              style={{
                textDecoration: 'none',
                color: 'white',
                  
              }}
            >
              Términos y Condiciones
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Footer;
