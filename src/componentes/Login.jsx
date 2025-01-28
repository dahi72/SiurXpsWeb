import React, { useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Paper, Typography, Button, TextField, InputAdornment, IconButton} from '@mui/material';
import { useScreenSize } from '../hooks/useScreenSize'; 
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { UsuarioContext } from '../hooks/UsuarioContext';


const Login = () => {
  const passwordRef = useRef(null);
  const pasaporteRef = useRef(null);  // Referencia para el campo de pasaporte
  const navigate = useNavigate();
  const baseUrl = process.env.REACT_APP_API_URL;
  console.log("baseUrl:", baseUrl);
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const {isXs} = useScreenSize();
  const [mensaje, setMensaje] = useState("");
  const [camposVacios, setCamposVacios] = useState(true);
  const { setUsuario } = useContext(UsuarioContext);


  const ingresar = (e) => {
    e.preventDefault(); 
    const password = passwordRef.current.value;
    const pasaporte = pasaporteRef.current.value;  

    if (!password || !pasaporte) {
      setMensaje("Debe proporcionar pasaporte y contraseña");
      return;
    }

    fetch(`${baseUrl}/Usuario/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        password,
        pasaporte,
      }),
    })
      .then((response) => response.json())  
      .then((data) => {
       
        if (data.token) {  
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.id);
          localStorage.setItem("rol", data.rol);
          setUsuario({
            token: data.token,
            pasaporte: data.pasaporte,
            id: data.id,
            rol: data.rol,
          });
          
          if (data.debeCambiarContrasenia) {
            navigate("/cambiar-contrasena");
          } else {
            navigate("/dashboard");
          }
        } else {
          setMensaje("Usuario y/o contraseña incorrectos");
        }
      })
      .catch((error) => {
        if (error.message === "Failed to fetch") {
          setMensaje("Ocurrió un error en el servidor. Inténtelo de nuevo más tarde.");
        } else {
          setMensaje(`Error: ${error.message}`);
        }
      });
  };

  const handleMostrarContrasena = () => {
    setMostrarContrasena(!mostrarContrasena);
  };


  const handleChange = () => {
    const passwordValue = passwordRef.current.value;
    const pasaporteValue = pasaporteRef.current.value;
    setCamposVacios(!passwordValue || !pasaporteValue);  
  };
  

  return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        Height: 'auto', 
        flexDirection: 'column',
        padding: 2,
        marginTop: '0', 
      }}>
        <Paper sx={{ 
          padding: 3, 
          width: '100%', 
          maxWidth: isXs ? 300 : 400, 
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: 2, 
          height:'60vh',
        }}>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Typography variant="h5" gutterBottom>Inicio de Sesión</Typography>
          </Box>

          <form onSubmit={ingresar}>
            <TextField
              fullWidth
              label="Pasaporte"
              inputRef={pasaporteRef}  
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="username"
            />
            <TextField
              fullWidth
              label="Contraseña"
              type={mostrarContrasena ? "text" : "password"}  
              inputRef={passwordRef}
              onChange={handleChange}
              required
              margin="normal"
              autoComplete="current-password" 
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleMostrarContrasena}>
                      {mostrarContrasena ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            {mensaje && <Typography color="error" sx={{ mt: 2 }}>{mensaje}</Typography>}

            <Button 
              fullWidth 
              variant="contained" 
              sx={{ mt: 2 }} 
              type="submit" 
              disabled={camposVacios}
            >
              Ingresar
            </Button>
            
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Link to="/recuperar-contrasena" className="link">
                ¿Olvidaste la contraseña?
              </Link>
            </Box>
          </form>

          <Box sx={{ mt: 2, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Link to="/registro" className="link">
              ¿Aún no estás registrado?
            </Link>
          </Box>
        </Paper>
      </Box>
  );
};

export default Login;