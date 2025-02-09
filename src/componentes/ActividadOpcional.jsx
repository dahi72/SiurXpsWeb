
import { useEffect, useState } from 'react';
import { Container, Typography, Paper, Select, MenuItem, 
         FormControl, InputLabel, Button, Snackbar, Alert, 
         CircularProgress, Box } from '@mui/material';

const ActividadOpcional = () => {
  const [actividadesOpcionales, setActividadesOpcionales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActividad, setSelectedActividad] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');
  const baseUrl = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const obtenerActividades = async () => {
      try {
        
        const opcionalesRes = await fetch(`${baseUrl}/Actividad/opcionales`, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}` },
        });

        if (!opcionalesRes.ok) {
            const errorData = await opcionalesRes.json(); 
            throw new Error(errorData.message);
        }

        setActividadesOpcionales(await opcionalesRes.json());
      } catch (err) {
        setError('Hubo un error al cargar las actividades.');
      } finally {
        setLoading(false);
      }
    };

    obtenerActividades();
  }, [baseUrl, token]);

  const handleInscribir = async () => {
    if (!selectedActividad) return;

    try {

      const response = await fetch(`${baseUrl}/Actividad/inscribirUsuario`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
       // body: JSON.stringify({ actividadId: selectedActividad }),
      });

      if (!response.ok) {
        const errorData = await response.json(); 
        throw new Error(errorData.message || 'Error al inscribir al usuario');
      }

      const nuevaActividad = actividadesOpcionales.find((act) => act.id === selectedActividad);
      if (nuevaActividad) {
        setSuccess(true);
   
      }
    } catch {
      setError('Error al inscribirse en la actividad.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
          Actividades Opcionales
        </Typography>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Paper sx={{ p: 4, textAlign: 'center', backgroundColor: 'grey.50' }}>
            <Typography variant="h6" color="text.secondary">
              {error}
            </Typography>
          </Paper>
        ) : (
          <>
            {/* Sección de inscripción a actividades opcionales */}
            <Typography variant="h5" sx={{ mb: 2 }}>Inscripción a Actividades Opcionales</Typography>
            <Paper sx={{ p: 2, mb: 4 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Seleccionar Actividad</InputLabel>
                <Select value={selectedActividad} onChange={(e) => setSelectedActividad(e.target.value)}>
                  {actividadesOpcionales.map((actividad) => (
                    <MenuItem key={actividad.id} value={actividad.id}>
                      {actividad.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button variant="contained" onClick={handleInscribir} disabled={!selectedActividad}>
                Inscribir
              </Button>
            </Paper>
          </>
        )}

        <Snackbar open={success} autoHideDuration={3000} onClose={() => setSuccess(false)}>
          <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
            Inscripción realizada con éxito.
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default ActividadOpcional;

