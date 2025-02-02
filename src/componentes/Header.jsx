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
  const isVerySmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const { usuario } = useUsuario();
  
  return (
    <>
      <AppBar>
        <Toolbar sx={{ width: '100%', padding: { xs: '0 16px', sm: '0 32px' } }}>
          
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

          <Box
            sx={{
              display: 'flex',
              flexDirection: isVerySmallScreen ? 'column' : 'row',
              alignItems: 'center',
              flexGrow: 1,
              justifyContent: isSmallScreen ? 'center' : 'flex-start',
              gap: 1, 
            }}
        >
          <img
            src={siurBlanco}
            alt="Siur Logo"
            style={{
              width: isVerySmallScreen ? '100px' : '150px',
              margin: '4px',
            }}
          />
          <img
            src={xperiencias}
            alt="Xperiencias Logo"
            style={{
              width: isVerySmallScreen ? '100px' : '150px',
              margin: '4px',
            }}
          />
        </Box>

        {usuario && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ActionButtons />
            <Logout />
          </Box>
         
          )}
        </Toolbar>
      </AppBar>
    </>
  );
};

export default Header;