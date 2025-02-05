import React, { useState, useContext, useEffect } from 'react';
import { Container, TextField, Button, Typography, FormControl, Alert, Box,Input } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../hooks/UsuarioContext';
import dayjs from 'dayjs';
import { useLocation } from 'react-router-dom';


const MisDatos = () => {
  const { usuario, setUsuario } = useContext(UsuarioContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [fechaNac, setFechaNac] = useState(dayjs(usuario?.fechaNac || null));
  const [pasaporte, setPasaporte] = useState(null);
  const [visa, setVisa] = useState(null);
  const [vacuna, setVacuna] = useState(null);
  const [seguro, setSeguro] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const location = useLocation();
 
  // Si location.state tiene datos, actualiza el usuario del contexto
  useEffect(() => {
    if (location.state?.viajero) {
      setUsuario(location.state.viajero);
    }
  }, [location.state, setUsuario]);

  const handleFileChange = (e, tipoDocumento) => {
    const file = e.target.files[0];
    if (file) {
      switch (tipoDocumento) {
        case "pasaporte":
          setPasaporte(file);
          break;
        case "visa":
          setVisa(file);
          break;
        case "vacuna":
          setVacuna(file);
          break;
        case "seguro":
          setSeguro(file);
          break;
        default:
          break;
      }
    }
  };


  const handleDateChange = (date) => {
    if (date) {
      setFechaNac(dayjs(date).startOf('day'));
      setUsuario((prevUsuario) => ({ ...prevUsuario, fechaNac: date.format("YYYY-MM-DD") }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

  
    Object.keys(usuario).forEach((key) => {
      if (usuario[key] !== null && usuario[key] !== undefined) {
        formData.append(key, usuario[key]);
      }
    });

    formData.append("fechaNac", fechaNac.format("YYYY-MM-DD"));

    
    if (pasaporte) formData.append("pasaporteDocumento", pasaporte);
    if (visa) formData.append("visaDocumento", visa);
    if (vacuna) formData.append("vacunasDocumento", vacuna);
    if (seguro) formData.append("seguroDeViajeDocumento", seguro);
    

    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    fetch(`${baseUrl}/Usuario/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((data) => {
          if (response.status === 400) 
            throw new Error(data.message || 'Los datos proporcionados son incorrectos.');
          if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("pasaporte");
            localStorage.removeItem("rol");
            localStorage.removeItem("id");
            navigate('/'); 
          }
          if (response.status === 404) {
            throw new Error('Usuario no encontrado.');
          }
          if (response.status === 500) {
            throw new Error('Ocurrió un error en el servidor. Por favor intente más tarde.');
          }
          throw new Error(data.message || 'Error desconocido al intentar cargar información');
        });
      }
      return response.json();
    })
    .then((data) => {
      setSuccess(true);
      setError(null);
 
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard"); 
      }, 2000);
    })
    .catch((error) => {
      setSuccess(false);
      setError(error.message);
   
      setTimeout(() => {
        setError(null);
        navigate("/dashboard"); 
      }, 2000);
    });
  };


  return (
    <>

      <Container maxWidth="md" sx={{ mt: 5, p: 4, boxShadow: 3, borderRadius: 2, backgroundColor: '#fff' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Mis Datos
        </Typography>
        
        <form onSubmit={handleSubmit}>
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <TextField
              label="Primer Nombre"
              name="primerNombre"
              value={usuario.primerNombre}
              onChange={handleInputChange}
              fullWidth
              required
              />
            <TextField
              label="Primer Apellido"
              name="primerApellido"
              value={usuario.primerApellido}
              onChange={handleInputChange}
              fullWidth
              required
              />
          </Box>

          {/* Segundo Nombre y Segundo Apellido */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <TextField
              label="Segundo Nombre"
              name="segundoNombre"
              value={usuario.segundoNombre}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Segundo Apellido"
              name="segundoApellido"
              value={usuario.segundoApellido}
              onChange={handleInputChange}
              fullWidth
            />
          </Box>

          {/* Nro. Pasaporte y Correo Electrónico */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
            <TextField
              label="Nro. Pasaporte"
              name="pasaporte"
              value={usuario.pasaporte}
              onChange={handleInputChange}
              fullWidth
            />
            <TextField
              label="Correo Electrónico"
              name="email"
              value={usuario.email}
              onChange={handleInputChange}
              fullWidth
              type="email"
            />
          </Box>

          {/* Teléfono y Fecha de Nacimiento */}
          <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={3} mb={3}>
            <TextField
              label="Teléfono"
              name="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
              fullWidth
          
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={fechaNac}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </LocalizationProvider>
          </Box>

         {/* Documentos: Pasaporte, Visa, Vacunas, Seguro de Viaje */}
<Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
  <FormControl fullWidth>
    <Typography>Pasaporte:</Typography>
    {pasaporte ? (
      <Typography>{pasaporte.name}</Typography>
    ) : usuario?.pasaporteDocumentoRuta ? (
      <a href={`https://siurxpss.azurewebsites.net/${usuario.pasaporteDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
        Ver pasaporte actual
      </a>
    ) : (
      <Typography>No cargado</Typography>
    )}
    <Input
      type="file"
      onChange={(e) => handleFileChange(e, "pasaporte")}
      inputProps={{ accept: '.jpg,.png,.pdf' }}
    />
  </FormControl>

  <FormControl fullWidth>
    <Typography>Visa :</Typography>
    {visa ? (
      <Typography>{visa.name}</Typography>
    ) : usuario?.visaDocumentoRuta ? (
      <a href={`https://siurxpss.azurewebsites.net/${usuario.visaDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
        Ver visa actual
      </a>
    ) : (
      <Typography>No cargado</Typography>
    )}
    <Input
      type="file"
      onChange={(e) => handleFileChange(e, "visa")}
      inputProps={{ accept: '.jpg,.png,.pdf' }}
    />
  </FormControl>
</Box>

<Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2} mb={2}>
  <FormControl fullWidth>
    <Typography>Certificado de vacunación:</Typography>
    {vacuna ? (
      <Typography>{vacuna.name}</Typography>
    ) : usuario?.vacunasDocumentoRuta ? (
      <a href={`https://siurxpss.azurewebsites.net/${usuario.vacunasDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
        Ver certificado de vacunas actual
      </a>
    ) : (
      <Typography>No cargado</Typography>
    )}
    <Input
      type="file"
      onChange={(e) => handleFileChange(e, "vacuna")}
      inputProps={{ accept: '.jpg,.png,.pdf' }}
    />
  </FormControl>

  <FormControl fullWidth>
    <Typography>Seguro de Viaje:</Typography>
    {seguro ? (
      <Typography>{seguro.name}</Typography>
    ) : usuario?.seguroDeViajeDocumentoRuta ? (
      <a href={`https://siurxpss.azurewebsites.net/${usuario.seguroDeViajeDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
        Ver seguro actual
      </a>
    ) : (
      <Typography>No cargado</Typography>
    )}
    <Input
      type="file"
      onChange={(e) => handleFileChange(e, "seguro")}
      inputProps={{ accept: '.jpg,.png,.pdf' }}
    />
  </FormControl>
</Box>
          {/* Botón de Guardar Cambios */}
          <Box mt={3}>
            <Button type="submit" variant="contained" fullWidth>
              Guardar Cambios
            </Button>
          </Box>
        </form>

        {success && <Alert severity="success" sx={{ mt: 2 }}>Datos actualizados con éxito.</Alert>}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Container>
    </>
  );
};

export default MisDatos;
