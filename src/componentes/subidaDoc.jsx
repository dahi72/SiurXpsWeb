
import React, { useState, useContext } from 'react';
import { 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Alert, 
    Box,
    Paper,
    Divider,
    ListItemText,
    ListItem,
    Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { useNavigate } from 'react-router-dom';
import { UsuarioContext } from '../hooks/UsuarioContext';
import dayjs from 'dayjs';
import { Upload } from 'lucide-react';

const MisDatos = () => {
  const { usuario, setUsuario } = useContext(UsuarioContext);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [fechaNac, setFechaNac] = useState(dayjs(usuario?.fechaNac || null));
  const [documentos, setDocumentos] = useState({ pasaporte: null, visa: null, vacuna: null, seguro: null });
  const baseUrl = process.env.REACT_APP_API_URL;
  
  // const handleFileChange = (e, tipo) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setDocumentos((prev) => ({ ...prev, [tipo]: file }));
  //   }
  // };
  const handleFileChange = (e, tipo) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]; // Obtener solo la parte base64 del archivo
        setDocumentos((prev) => ({ ...prev, [tipo]: base64String }));
      };
      reader.readAsDataURL(file); // Convertir el archivo a base64
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    // Agregar otros campos de usuario al formData
    Object.keys(usuario).forEach((key) => {
      if (usuario[key]) {
        formData.append(key, usuario[key]);
      }
    });
  
    // Agregar documentos en base64
    Object.entries(documentos).forEach(([key, base64]) => {
      if (base64) formData.append(`${key}DocumentoBase64`, base64);
    });
  
    try {
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");
      const response = await fetch(`${baseUrl}/Usuario/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Error al actualizar datos');
      }
  
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      setError(error.message);
      setTimeout(() => setError(null), 2000);
    }
  };
  

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const formData = new FormData();
    
  //   Object.keys(usuario).forEach((key) => {
  //     if (usuario[key]) {
  //       formData.append(key, usuario[key]);
  //     }
  //   });
    
  //   formData.append("fechaNac", fechaNac.format("YYYY-MM-DD"));
  //   Object.entries(documentos).forEach(([key, file]) => {
  //     if (file) formData.append(`${key}Documento`, file);
  //   });

  //   try {
  //     const token = localStorage.getItem("token");
  //     const id = localStorage.getItem("id");
  //     const response = await fetch(`${baseUrl}/Usuario/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Authorization': `Bearer ${token}` },
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       const data = await response.json();
  //       throw new Error(data.message || 'Error al actualizar datos');
  //     }

  //     setSuccess(true);
  //     setTimeout(() => {
  //       setSuccess(false);
  //       navigate("/dashboard");
  //     }, 2000);
  //   } catch (error) {
  //     setError(error.message);
  //     setTimeout(() => setError(null), 2000);
  //   }
  // };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4, pb: 2, justifyContent: 'center', textAlign: 'center' }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Mis Datos</Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Datos Personales</Typography>
          <Divider sx={{ mb: 2 }} />
          <TextField label="Primer Nombre" name="primerNombre" value={usuario.primerNombre || ''} onChange={handleInputChange} fullWidth required size="small" sx={{ mb: 2 }} />
          <TextField label="Apellido" name="primerApellido" value={usuario.primerApellido || ''} onChange={handleInputChange} fullWidth required size="small" sx={{ mb: 2 }} />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker label="Fecha de Nacimiento" value={fechaNac} onChange={handleDateChange} renderInput={(params) => <TextField {...params} fullWidth size="small" />} />
          </LocalizationProvider>
        </Paper>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Documentos</Typography>
          <Divider sx={{ mb: 2 }} />
          {['pasaporte', 'visa', 'vacuna', 'seguro'].map((tipo) => (
            <ListItem key={tipo} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <ListItemText primary={tipo.charAt(0).toUpperCase() + tipo.slice(1)} secondary={documentos[tipo]?.name || 'No cargado'} />
              <Button component="label" variant="outlined" size="small" startIcon={<Upload size={16} />}>
                Subir
                <input type="file" hidden onChange={(e) => handleFileChange(e, tipo)} accept=".jpg,.png,.pdf" />
              </Button>
            </ListItem>
          ))}
        </Paper>
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Guardar Cambios</Button>
      </form>
      <Snackbar open={success} autoHideDuration={2000} message="Datos actualizados correctamente" />
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
    </Container>
  );
};

export default MisDatos;






////////MAPA

/////////////MAPA




// import React, { useState, useContext } from 'react';
// import { 
//     Container, 
//     TextField, 
//     Button, 
//     Typography, 
//     Alert, 
//     Box,
//     Paper,
//     Divider,
//     ListItemText,
//     ListItem,
//     List,
//     Snackbar
// } from '@mui/material';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { useNavigate } from 'react-router-dom';
// import { UsuarioContext } from '../hooks/UsuarioContext';
// import dayjs from 'dayjs';
// import { Upload} from 'lucide-react';

// const MisDatos = () => {
//   const { usuario, setUsuario } = useContext(UsuarioContext);
//   const [success, setSuccess] = useState(false);
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();
//   const [fechaNac, setFechaNac] = useState(dayjs(usuario?.fechaNac || null));
//   const [pasaporte, setPasaporte] = useState(null);
//   const [visa, setVisa] = useState(null);
//   const [vacuna, setVacuna] = useState(null);
//   const [seguro, setSeguro] = useState(null);
//   const baseUrl = process.env.REACT_APP_API_URL;
  
//   const handleFileChange = (e, tipoDocumento) => {
//     const file = e.target.files[0];
//     if (file) {
//       switch (tipoDocumento) {
//         case "pasaporte":
//           setPasaporte(file);
//           break;
//         case "visa":
//           setVisa(file);
//           break;
//         case "vacuna":
//           setVacuna(file);
//           break;
//         case "seguro":
//           setSeguro(file);
//           break;
//         default:
//           break;
//       }
//     }
//   };

//   const handleDateChange = (date) => {
//     if (date) {
//       setFechaNac(dayjs(date).startOf('day'));
//       setUsuario((prevUsuario) => ({ ...prevUsuario, fechaNac: date.format("YYYY-MM-DD") }));
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const formData = new FormData();
  
//     Object.keys(usuario).forEach((key) => {
//       if (usuario[key] !== null && usuario[key] !== undefined) {
//         formData.append(key, usuario[key]);
//       }
//     });

//     formData.append("fechaNac", fechaNac.format("YYYY-MM-DD"));
    
//     if (pasaporte) formData.append("pasaporteDocumento", pasaporte);
//     if (visa) formData.append("visaDocumento", visa);
//     if (vacuna) formData.append("vacunasDocumento", vacuna);
//     if (seguro) formData.append("seguroDeViajeDocumento", seguro);

//     const token = localStorage.getItem("token");
//     const id = localStorage.getItem("id");

//     fetch(`${baseUrl}/Usuario/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//       },
//       body: formData,
//     })
//     .then((response) => {
//       if (!response.ok) {
//         return response.json().then((data) => {
//           if (response.status === 400) 
//             throw new Error(data.message || 'Los datos proporcionados son incorrectos.');
//           if (response.status === 401) {
//             localStorage.removeItem("token");
//             localStorage.removeItem("pasaporte");
//             localStorage.removeItem("rol");
//             localStorage.removeItem("id");
//             navigate('/'); 
//           }
//           if (response.status === 404) {
//             throw new Error('Usuario no encontrado.');
//           }
//           if (response.status === 500) {
//             throw new Error('Ocurrió un error en el servidor. Por favor intente más tarde.');
//           }
//           throw new Error(data.message || 'Error desconocido al intentar cargar información');
//         });
//       }
//       return response.json();
//     })
//     .then((data) => {
//       setSuccess(true);
//       setError(null);
//       setTimeout(() => {
//         setSuccess(false);
//         navigate("/dashboard"); 
//       }, 2000);
//     })
//     .catch((error) => {
//       setSuccess(false);
//       setError(error.message);
//       setTimeout(() => {
//         setError(null);
//         navigate("/dashboard"); 
//       }, 2000);
//     });
//   };

//   return (
//     <Container maxWidth="lg">
//       <Box sx={{ 
//         display: 'flex', 
//         alignItems: 'center', 
//         mb: 4,
//         borderBottom: 1,
//         borderColor: 'divider',
//         pb: 2,
//         justifyContent: 'center',
//         width: '100%'
//       }}>
//         <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
//           Mis Datos
//         </Typography>
//       </Box>

//       <Box sx={{ 
//         display: 'grid',
//         gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
//         gap: 3
//       }}>
//         {/* Datos Personales */}
//         <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//             Datos Personales
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <TextField
//               label="Primer Nombre"
//               name="primerNombre"
//               value={usuario.primerNombre}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               size="small"
//             />
//             <TextField
//               label="Primer Apellido"
//               name="primerApellido"
//               value={usuario.primerApellido}
//               onChange={handleInputChange}
//               fullWidth
//               required
//               size="small"
//             />
//             <TextField
//               label="Segundo Nombre"
//               name="segundoNombre"
//               value={usuario.segundoNombre}
//               onChange={handleInputChange}
//               fullWidth
//               size="small"
//             />
//             <TextField
//               label="Segundo Apellido"
//               name="segundoApellido"
//               value={usuario.segundoApellido}
//               onChange={handleInputChange}
//               fullWidth
//               size="small"
//             />
//           </Box>
//         </Paper>

//         {/* Información de Contacto */}
//         <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//             Información de Contacto
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
//             <TextField
//               label="Nro. Pasaporte"
//               name="pasaporte"
//               value={usuario.pasaporte}
//               onChange={handleInputChange}
//               fullWidth
//               size="small"
//             />
//             <TextField
//               label="Correo Electrónico"
//               name="email"
//               value={usuario.email}
//               onChange={handleInputChange}
//               fullWidth
//               type="email"
//               size="small"
//             />
//             <TextField
//               label="Teléfono"
//               name="telefono"
//               value={usuario.telefono}
//               onChange={handleInputChange}
//               fullWidth
//               size="small"
//             />
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <DatePicker
//                 label="Fecha de Nacimiento"
//                 value={fechaNac}
//                 onChange={handleDateChange}
//                 renderInput={(params) => <TextField {...params} fullWidth size="small" />}
//               />
//             </LocalizationProvider>
//           </Box>
//         </Paper>

//         {/* Documentos */}
//         <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
//           <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
//             Documentos
//           </Typography>
//           <Divider sx={{ mb: 2 }} />
//           <List>
//             <ListItem>
//               <ListItemText 
//                 primary="Pasaporte"
//                 secondary={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     {pasaporte ? (
//                       <Typography variant="body2">{pasaporte.name}</Typography>
//                     ) : usuario?.pasaporteDocumentoRuta ? (
//                       <a href={`https://siurxpss.azurewebsites.net/${usuario.pasaporteDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
//                         Ver documento actual
//                       </a>
//                     ) : (
//                       <Typography variant="body2">No cargado</Typography>
//                     )}
//                     <Button
//                       component="label"
//                       variant="outlined"
//                       size="small"
//                       startIcon={<Upload size={16} />}
//                     >
//                       Subir
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) => handleFileChange(e, "pasaporte")}
//                         accept=".jpg,.png,.pdf"
//                       />
//                     </Button>
//                   </Box>
//                 }
//               />
//             </ListItem>
//             <ListItem>
//               <ListItemText 
//                 primary="Visa"
//                 secondary={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     {visa ? (
//                       <Typography variant="body2">{visa.name}</Typography>
//                     ) : usuario?.visaDocumentoRuta ? (
//                       <a href={`https://siurxpss.azurewebsites.net/${usuario.visaDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
//                         Ver documento actual
//                       </a>
//                     ) : (
//                       <Typography variant="body2">No cargado</Typography>
//                     )}
//                     <Button
//                       component="label"
//                       variant="outlined"
//                       size="small"
//                       startIcon={<Upload size={16} />}
//                     >
//                       Subir
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) => handleFileChange(e, "visa")}
//                         accept=".jpg,.png,.pdf"
//                       />
//                     </Button>
//                   </Box>
//                 }
//               />
//             </ListItem>
//             <ListItem>
//               <ListItemText 
//                 primary="Certificado de Vacunación"
//                 secondary={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     {vacuna ? (
//                       <Typography variant="body2">{vacuna.name}</Typography>
//                     ) : usuario?.vacunasDocumentoRuta ? (
//                       <a href={`https://siurxpss.azurewebsites.net/${usuario.vacunasDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
//                         Ver documento actual
//                       </a>
//                     ) : (
//                       <Typography variant="body2">No cargado</Typography>
//                     )}
//                     <Button
//                       component="label"
//                       variant="outlined"
//                       size="small"
//                       startIcon={<Upload size={16} />}
//                     >
//                       Subir
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) => handleFileChange(e, "vacuna")}
//                         accept=".jpg,.png,.pdf"
//                       />
//                     </Button>
//                   </Box>
//                 }
//               />
//             </ListItem>
//             <ListItem>
//               <ListItemText 
//                 primary="Seguro de Viaje"
//                 secondary={
//                   <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
//                     {seguro ? (
//                       <Typography variant="body2">{seguro.name}</Typography>
//                     ) : usuario?.seguroDeViajeDocumentoRuta ? (
//                       <a href={`https://siurxpss.azurewebsites.net/${usuario.seguroDeViajeDocumentoRuta}`} target="_blank" rel="noopener noreferrer">
//                         Ver documento actual
//                       </a>
//                     ) : (
//                       <Typography variant="body2">No cargado</Typography>
//                     )}
//                     <Button
//                       component="label"
//                       variant="outlined"
//                       size="small"
//                       startIcon={<Upload size={16} />}
//                     >
//                       Subir
//                       <input
//                         type="file"
//                         hidden
//                         onChange={(e) => handleFileChange(e, "seguro")}
//                         accept=".jpg,.png,.pdf"
//                       />
//                     </Button>
//                   </Box>
//                 }
//               />
//             </ListItem>
//           </List>
//         </Paper>
//       </Box>

//       <Box sx={{ mt: 3 }}>
//         <Button 
//           type="submit" 
//           variant="contained" 
//           fullWidth
//           size="large"
//           onClick={handleSubmit}
//           sx={{
//             py: 1.5,
//             fontWeight: 'bold',
//             transition: 'transform 0.2s ease-in-out',
//             '&:hover': {
//               transform: 'scale(1.02)'
//             }
//           }}
//         >
//           Guardar Cambios
//         </Button>
//       </Box>

//       <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
//         <Alert severity="success">Operación realizada con éxito</Alert>
//       </Snackbar>

//       <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError(null)}>
//         <Alert severity="error">{error}</Alert>
//       </Snackbar>
//     </Container>
//   );
// };

// export default MisDatos;
