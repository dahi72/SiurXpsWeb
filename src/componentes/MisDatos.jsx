import React, { useState, useContext} from 'react';
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
    List,
    Snackbar,
    CircularProgress
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
  const [pasaporteDoc, setPasaporte] = useState(null);
  const [visa, setVisa] = useState(null);
  const [vacuna, setVacuna] = useState(null);
  const [seguro, setSeguro] = useState(null);
  const baseUrl = process.env.REACT_APP_API_URL;
  const [loading, setLoading] = useState(false);

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); 
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e, tipoDocumento) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que el archivo sea JPG
      if (!file.type.startsWith('image/jpeg')) {
        setError('Solo se permiten archivos en formato JPG.');
        return; // Detener la ejecución si no es JPG
      }

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
    console.log(`Actualizando ${name} a: ${value}`);
    setUsuario((prevUsuario) => ({ ...prevUsuario, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validar que los archivos sean JPG antes de enviar
    const archivos = [pasaporteDoc, visa, vacuna, seguro];
    for (const archivo of archivos) {
      if (archivo && !archivo.type.startsWith('image/jpeg')) {
        setError('Solo se permiten archivos en formato JPG.');
        return;
      }
    }

    try {
      // Convertir archivos a Base64
      const pasaporteBase64 = pasaporteDoc ? await convertFileToBase64(pasaporteDoc) : null;
      const visaBase64 = visa ? await convertFileToBase64(visa) : null;
      const vacunaBase64 = vacuna ? await convertFileToBase64(vacuna) : null;
      const seguroBase64 = seguro ? await convertFileToBase64(seguro) : null;

      // Crear el objeto con los datos del usuario y los archivos en Base64
      const datosUsuario = {
        ...usuario,
        fechaNac: fechaNac.format("YYYY-MM-DD"),
        PasaporteDocumentoBase64: pasaporteBase64,
        VisaDocumentoBase64: visaBase64,
        VacunasDocumentoBase64: vacunaBase64,
        SeguroDeViajeDocumentoBase64: seguroBase64,
      };
      console.log("Enviando estos datos:", datosUsuario);
      const token = localStorage.getItem("token");
      const id = localStorage.getItem("id");

      const response = await fetch(`${baseUrl}/Usuario/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosUsuario), 
      });

      if (!response.ok) {
        const data = await response.json();
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
      }

      setSuccess(true);
      setError(null);
      setTimeout(() => {
        setSuccess(false);
        setLoading(false);
        navigate("/dashboard"); 
      }, 2000);
    } catch (error) {
      setSuccess(false);
      setError(error.message);
      setTimeout(() => {
        setError(null);
        setLoading(false);
        navigate("/dashboard"); 
      }, 2000);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 4,
        borderBottom: 1,
        borderColor: 'divider',
        pb: 2,
        justifyContent: 'center',
        width: '100%'
      }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
          Mis Datos
        </Typography>
      </Box>

      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3
      }}>
        {/* Datos Personales */}
        <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Datos Personales
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Primer Nombre"
              name="primerNombre"
              value={usuario.primerNombre || ''}
              onChange={handleInputChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Primer Apellido"
              name="primerApellido"
              value={usuario.primerApellido || ''}
              onChange={handleInputChange}
              fullWidth
              required
              size="small"
            />
            <TextField
              label="Segundo Nombre"
              name="segundoNombre"
              value={usuario.segundoNombre || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Segundo Apellido"
              name="segundoApellido"
              value={usuario.segundoApellido || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
          </Box>
        </Paper>

        {/* Información de Contacto */}
        <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Información de Contacto
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="Nro. Pasaporte"
              name="pasaporte"
              value={usuario.pasaporte || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <TextField
              label="Correo Electrónico"
              name="email"
              value={usuario.email || ''}
              onChange={handleInputChange}
              fullWidth
              type="email"
              size="small"
            />
            <TextField
              label="Teléfono"
              name="telefono"
              value={usuario.telefono || ''}
              onChange={handleInputChange}
              fullWidth
              size="small"
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Nacimiento"
                value={fechaNac}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth size="small" />}
              />
            </LocalizationProvider>
          </Box>
        </Paper>

        {/* Documentos */}
        <Paper elevation={3} sx={{ p: 3, transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.03)', boxShadow: 6 } }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Documentos
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List>
            <ListItem>
              <ListItemText 
                primary="Pasaporte"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {pasaporteDoc ? (
                      <Typography variant="body2">{pasaporteDoc.name}</Typography>
                    ) : usuario?.pasaporteDocumentoBase64 ? (
                      <Typography variant="body2">Documento cargado. Si deseas reemplazarlo, puedes subir uno nuevo.</Typography>
                    ) : (
                      <Typography variant="body2">No cargado</Typography>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Upload size={16} />}
                    >
                      Subir
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, "pasaporte")}
                        accept=".jpg,.jpeg"
                      />
                    </Button>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Visa"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {visa ? (
                      <Typography variant="body2">{visa.name}</Typography>
                    ) : usuario?.visaDocumentoBase64 ? (
                      <Typography variant="body2">Documento cargado. Si deseas reemplazarlo, puedes subir uno nuevo.</Typography>
                    ) : (
                      <Typography variant="body2">No cargado</Typography>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Upload size={16} />}
                    >
                      Subir
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, "visa")}
                        accept=".jpg,.jpeg"
                      />
                    </Button>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Certificado de Vacunación"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {vacuna ? (
                      <Typography variant="body2">{vacuna.name}</Typography>
                    ) : usuario?.vacunasDocumentoBase64 ? (
                      <Typography variant="body2">Documento cargado. Si deseas reemplazarlo, puedes subir uno nuevo.</Typography>
                    ) : (
                      <Typography variant="body2">No cargado</Typography>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Upload size={16} />}
                    >
                      Subir
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, "vacuna")}
                        accept=".jpg,.jpeg"
                      />
                    </Button>
                  </Box>
                }
              />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Seguro de Viaje"
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                    {seguro ? (
                      <Typography variant="body2">{seguro.name}</Typography>
                    ) : usuario?.seguroDeViajeDocumentoBase64 ? (
                      <Typography variant="body2">Documento cargado. Si deseas reemplazarlo, puedes subir uno nuevo.</Typography>
                    ) : (
                      <Typography variant="body2">No cargado</Typography>
                    )}
                    <Button
                      component="label"
                      variant="outlined"
                      size="small"
                      startIcon={<Upload size={16} />}
                    >
                      Subir
                      <input
                        type="file"
                        hidden
                        onChange={(e) => handleFileChange(e, "seguro")}
                        accept=".jpg,.jpeg"
                      />
                    </Button>
                  </Box>
                }
              />
            </ListItem>
          </List>
        </Paper>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Button 
          type="submit" 
          variant="contained" 
          fullWidth
          size="large"
          onClick={handleSubmit}
          sx={{
            py: 1.5,
            fontWeight: 'bold',
            transition: 'transform 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.02)'
            }
          }}
          disabled={loading} // Deshabilitar botón mientras se está procesando
        >
          {loading ? <CircularProgress size={24} color="primary" sx={{ mr: 1 }} /> : 'Guardar Cambios'}
        </Button>
      </Box>

      <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
        <Alert severity="success">Operación realizada con éxito</Alert>
      </Snackbar>

      <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError(null)}>
        <Alert severity="error">{error}</Alert>
      </Snackbar>
    </Container>
  );
};

export default MisDatos;
