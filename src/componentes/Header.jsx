import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Toolbar, IconButton, Box, useMediaQuery, useTheme } from '@mui/material';
import xperiencias from '../Imagenes/xperiencias.png';
import siurBlanco from '../Imagenes/SiurBlanco.png';
import Logout from './Logout';
import { ActionButtons } from './Header/ActionButtons';
import { useUsuario } from '../hooks/UsuarioContext';

export const Header = ({ handleDrawerToggle }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const { usuario } = useUsuario();
  
  return (
    <>
      <AppBar>
        <Toolbar sx={{ width: '100%', padding: { xs: '0 16px', sm: '0 32px' } }}>
          {/* Icono de hamburguesa solo en pantallas pequeñas */}
          {!usuario && isSmallScreen && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Contenedor para mostrar las imágenes en columna */}
          <Box
            sx={{
              display: 'flex',
              flexGrow: 1,
              flexDirection: 'column', 
              marginLeft: '150px'
            }}
          >
            {/* Logo Siur */}
            <img
              src={siurBlanco}
              alt="Siur Logo"
              style={{ width: '150px', margin: '4px' }}
            />
            {/* Logo Xperiencias */}
            <img
              src={xperiencias}
              alt="Xperiencias Logo"
              style={{ width: '150px', margin: '4px' }}
            />
          </Box>

          {/* Botón de Logout */}
          {usuario && (
            <>
              <ActionButtons />
              <Logout />
           </>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;